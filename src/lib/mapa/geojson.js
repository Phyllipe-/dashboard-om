/**
 * geojson.js
 * Converte a estrutura normalizada de um mapa ENA em FeatureCollections GeoJSON,
 * uma por camada, prontas para renderização com Plot/D3/Vega-Lite.
 *
 * Entrada: retorno de parseMapaXML() → { cols, rows, layers }
 * Saída:   Array<{ layerName, geojson: FeatureCollection, cols, rows }>
 */

import { DICIONARIO } from "./parser.js";

/** Camadas cujos objetos são agrupados em bounding-box (móveis, eletrônicos, utensílios). */
const CAMADAS_BBOX = ["furniture", "eletronics", "utensils"];

/**
 * Gera GeoJSON a partir de um mapa parseado.
 * @param {{ cols: number, rows: number, layers: Record<string, string[]> }} mapa
 * @returns {Array<{ layerName: string, geojson: GeoJSON.FeatureCollection, cols: number, rows: number }>}
 */
export function mapaParaGeoJSON({ cols, rows, layers }) {
  const total = cols * rows;

  // --- pré-computação de masks ---
  const doorsData  = layers["door_and_windows"] ?? [];
  const wallsData  = layers["walls"]            ?? [];
  const floorData  = layers["floor"]            ?? [];

  /** tile com parede sólida (parede presente, sem porta/janela) */
  const solidWalls = new Array(total).fill(false);
  for (let i = 0; i < total; i++) {
    if (wallsData[i] !== "-1" && wallsData[i] !== undefined &&
        (doorsData[i] === undefined || doorsData[i] === "-1")) {
      solidWalls[i] = true;
    }
  }

  /** tile que é fronteira (parede sólida ou porta/janela) */
  const isBoundary = new Array(total).fill(false);
  /** tile com piso */
  const isFloor    = new Array(total).fill(false);
  const floorTiles = [];

  for (let i = 0; i < total; i++) {
    if (solidWalls[i] || (doorsData[i] !== undefined && doorsData[i] !== "-1")) isBoundary[i] = true;
    if (floorData[i] !== undefined && floorData[i] !== "-1") { isFloor[i] = true; floorTiles.push(i); }
  }

  // BFS para identificar a maior região de piso (= área externa / gramado)
  const visitedFloor = new Array(total).fill(false);
  const floorRegions = [];

  for (const start of floorTiles) {
    if (visitedFloor[start] || isBoundary[start]) continue;
    const region = []; const queue = [start]; visitedFloor[start] = true;
    while (queue.length > 0) {
      const curr = queue.shift(); region.push(curr);
      const cx = curr % cols, cy = Math.floor(curr / cols);
      const neighbors = [];
      if (cy > 0)          neighbors.push(curr - cols);
      if (cy < rows - 1)   neighbors.push(curr + cols);
      if (cx > 0)          neighbors.push(curr - 1);
      if (cx < cols - 1)   neighbors.push(curr + 1);
      for (const n of neighbors) {
        if (isFloor[n] && !visitedFloor[n] && !isBoundary[n]) { visitedFloor[n] = true; queue.push(n); }
      }
    }
    floorRegions.push(region);
  }

  let maxSize = 0, extIdx = -1;
  for (let r = 0; r < floorRegions.length; r++) {
    if (floorRegions[r].length > maxSize) { maxSize = floorRegions[r].length; extIdx = r; }
  }
  const isExternalFloor = new Array(total).fill(false);
  if (extIdx !== -1) { for (const idx of floorRegions[extIdx]) isExternalFloor[idx] = true; }

  // --- helpers ---
  function isSolidWall(cx, cy) {
    if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) return false;
    return solidWalls[cy * cols + cx];
  }

  function tilePolygon(x, y, margin = 0) {
    return [[[x + margin, -(y + margin)], [x + 1 - margin, -(y + margin)],
             [x + 1 - margin, -(y + 1 - margin)], [x + margin, -(y + 1 - margin)],
             [x + margin, -(y + margin)]]];
  }

  function nomeAmigavel(layerName, idx, fallback) {
    return DICIONARIO[layerName]?.[idx] ?? fallback;
  }

  // --- geração por camada ---
  const result = [];

  for (const [layerName, data] of Object.entries(layers)) {
    const features = [];

    if (layerName === "floor") {
      for (let i = 0; i < data.length; i++) {
        if (data[i] === "-1" || solidWalls[i]) continue;
        const x = i % cols, y = Math.floor(i / cols);
        features.push({
          type: "Feature",
          geometry: { type: "Polygon", coordinates: tilePolygon(x, y) },
          properties: {
            layerName,
            nomeAmigavel: nomeAmigavel(layerName, data[i], `Piso (${data[i]})`),
            areaInterna: !isExternalFloor[i],
          },
        });
      }

    } else if (layerName === "walls") {
      const wallEdges = [];
      for (let i = 0; i < data.length; i++) {
        const x = i % cols, y = Math.floor(i / cols);
        if (!isSolidWall(x, y)) continue;
        if (!isSolidWall(x, y - 1)) wallEdges.push([[x, -y],       [x + 1, -y]]);
        if (!isSolidWall(x, y + 1)) wallEdges.push([[x, -(y + 1)], [x + 1, -(y + 1)]]);
        if (!isSolidWall(x - 1, y)) wallEdges.push([[x, -y],       [x, -(y + 1)]]);
        if (!isSolidWall(x + 1, y)) wallEdges.push([[x + 1, -y],   [x + 1, -(y + 1)]]);
      }
      if (wallEdges.length > 0) {
        features.push({
          type: "Feature",
          geometry: { type: "MultiLineString", coordinates: wallEdges },
          properties: { layerName, nomeAmigavel: "Parede (Estrutura)", bloqueiaPassagem: true },
        });
      }

    } else if (layerName === "door_and_windows") {
      for (let i = 0; i < data.length; i++) {
        if (data[i] === "-1" || solidWalls[i]) continue;
        const x = i % cols, y = Math.floor(i / cols);
        features.push({
          type: "Feature",
          geometry: { type: "Polygon", coordinates: tilePolygon(x, y) },
          properties: { layerName, nomeAmigavel: nomeAmigavel(layerName, data[i], `Abertura (${data[i]})`) },
        });
      }

    } else if (layerName === "persons") {
      const DIR_MAP = { "0.0": 2, "0.1": 6, "0.2": 4, "0.3": 0 };
      for (let i = 0; i < data.length; i++) {
        if (data[i] === "-1") continue;
        const x = i % cols, y = Math.floor(i / cols);
        features.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: [x + 0.5, -(y + 0.5)] },
          properties: {
            layerName,
            nomeAmigavel: nomeAmigavel(layerName, data[i], "Personagem"),
            direcaoIndex: DIR_MAP[data[i]] ?? 2,
          },
        });
      }

    } else if (layerName === "interactive_elements") {
      for (let i = 0; i < data.length; i++) {
        if (data[i] === "-1" || solidWalls[i]) continue;
        const x = i % cols, y = Math.floor(i / cols);
        features.push({
          type: "Feature",
          geometry: { type: "Polygon", coordinates: tilePolygon(x, y, 0.15) },
          properties: { layerName, nomeAmigavel: nomeAmigavel(layerName, data[i], `Interativo (${data[i]})`) },
        });
      }

    } else if (CAMADAS_BBOX.includes(layerName)) {
      // Agrupa tiles adjacentes do mesmo objeto em bounding-box
      const visited = new Array(data.length).fill(false);
      for (let i = 0; i < data.length; i++) {
        if (data[i] === "-1" || solidWalls[i] || visited[i]) continue;
        const firstIdx = data[i];
        let minX = cols, maxX = 0, minY = rows, maxY = 0;
        const queue = [i]; visited[i] = true;
        while (queue.length > 0) {
          const curr = queue.shift();
          const cx = curr % cols, cy = Math.floor(curr / cols);
          if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
          const neighbors = [];
          if (cy > 0)          neighbors.push(curr - cols);
          if (cy < rows - 1)   neighbors.push(curr + cols);
          if (cx > 0)          neighbors.push(curr - 1);
          if (cx < cols - 1)   neighbors.push(curr + 1);
          for (const n of neighbors) {
            if (!visited[n] && data[n] !== "-1" && !solidWalls[n]) { visited[n] = true; queue.push(n); }
          }
        }
        const m = 0.15;
        features.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [[[minX + m, -(minY + m)], [maxX + 1 - m, -(minY + m)],
                           [maxX + 1 - m, -(maxY + 1 - m)], [minX + m, -(maxY + 1 - m)],
                           [minX + m, -(minY + m)]]],
          },
          properties: { layerName, nomeAmigavel: nomeAmigavel(layerName, firstIdx, "Objeto"), bloqueiaPassagem: true },
        });
      }

    } else {
      // Camada genérica: um polígono por tile
      for (let i = 0; i < data.length; i++) {
        if (data[i] === "-1" || solidWalls[i]) continue;
        const x = i % cols, y = Math.floor(i / cols);
        features.push({
          type: "Feature",
          geometry: { type: "Polygon", coordinates: tilePolygon(x, y) },
          properties: { layerName, nomeAmigavel: nomeAmigavel(layerName, data[i], `Tile (${data[i]})`) },
        });
      }
    }

    result.push({ layerName, geojson: { type: "FeatureCollection", features }, cols, rows });
  }

  return result;
}
