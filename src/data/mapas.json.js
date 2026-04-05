import fs from "fs";
import path from "path";
import { DOMParser } from "@xmldom/xmldom";

const dicionarioE3 = {
  "floor": { "0": "Cimento Queimado", "1": "Carpete", "2": "Água", "3": "Cerâmica", "4": "Areia", "5": "Piso tátil atenção", "6": "Piso tátil direção", "7": "Cascalho", "8": "Paralelepípedo", "9": "Metálico", "10": "Chão com folhas secas", "11": "Grama", "12": "Madeira", "13": "Neve", "14": "Piso de vidro", "15": "Pedra" },
  "walls": { "0": "Guardacorpo", "1": "Azulejo", "2": "Madeira", "3": "Tijolo aparente", "4": "Vidro", "5": "Plástico", "6": "Gesso", "8": "Escada 270º - P1", "9": "Escada 270º - P2", "10": "Escada 0º - P2", "11": "Escada 180º - P1", "16": "Escada 90º - P2", "17": "Escada 90º - P1", "18": "Escada 0º - P1", "19": "Escada 180º - P2" },
  "door_and_windows": { "0": "Porta Trancada 0º", "2": "Porta Fechada 0º", "4": "Porta Automática 0º", "6": "Janela de vidro 0º", "7": "Janela de madeira 0º", "8": "Porta Trancada 90º", "10": "Porta Fechada 90º", "12": "Porta Automática 90º", "14": "Janela de vidro 90º", "15": "Janela de madeira 90º" },
  "furniture": { "0.1": "Cama de Casal", "2.1": "Cama de Solteiro", "4.1": "Mesa de jantar", "4.5": "Guarda-roupa", "8.5": "Sofá", "10.1": "Cômoda", "10.5": "Estante", "12.1": "Mesa" },
  "eletronics": { "0.0": "Geladeira", "0.2": "Fogão", "0.4": "Computador", "0.6": "Máquina de lavar", "2.2": "TV", "2.4": "Micro-ondas" },
  "utensils": { "0.0": "Piano", "0.2": "Cone", "0.3": "Abajur", "1.2": "Violão", "1.3": "Lixeira", "0.4": "Vaso Sanitário", "0.6": "Lavatório", "2.2": "Vaso de planta", "2.3": "Quadro", "4.1": "Objeto Alvo" },
  "persons": { "0.0": "Personagem - Frente", "0.1": "Personagem - Trás", "0.2": "Personagem - Direita", "0.3": "Personagem - Esquerda" }
};

function processarXML(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
  const canvasNode = xmlDoc.getElementsByTagName("canvas")[0];
  if (!canvasNode) return []; // Retorno seguro se o ficheiro estiver corrompido
  
  const canvasWidth = parseInt(canvasNode.getAttribute("width"));
  const canvasHeight = parseInt(canvasNode.getAttribute("height"));
  const tileBase = 32; 
  const cols = canvasWidth / tileBase;
  const rows = canvasHeight / tileBase;

  function getLayerText(name) {
    const layers = xmlDoc.getElementsByTagName("layer");
    for(let i=0; i<layers.length; i++) {
       if(layers[i].getAttribute("name") === name) return layers[i].textContent;
    }
    return null;
  }

  function parseCSV(text, layerName) {
    if (!text) return [];
    return text.replace(/\s+/g, '').split(',').map(v => {
       if (v === '' || v === '-1') return "-1";
       if (v === '0' && (!dicionarioE3[layerName] || !dicionarioE3[layerName]["0"])) return "-1";
       return v; 
    });
  }

  const dataDoors = getLayerText("door_and_windows") ? parseCSV(getLayerText("door_and_windows"), "door_and_windows") : [];
  const dataWalls = getLayerText("walls") ? parseCSV(getLayerText("walls"), "walls") : [];
  const dataFloor = getLayerText("floor") ? parseCSV(getLayerText("floor"), "floor") : [];

  const solidWalls = new Array(cols * rows).fill(false);
  for(let i = 0; i < cols * rows; i++) {
    if (dataWalls[i] !== undefined && dataWalls[i] !== "-1" && (dataDoors[i] === undefined || dataDoors[i] === "-1")) {
        solidWalls[i] = true;
    }
  }

  const isBoundary = new Array(cols * rows).fill(false);
  const isFloor = new Array(cols * rows).fill(false);
  const floorTiles = [];
  for(let i = 0; i < cols * rows; i++) {
    if (solidWalls[i] || (dataDoors[i] !== undefined && dataDoors[i] !== "-1")) isBoundary[i] = true;
    if (dataFloor[i] !== undefined && dataFloor[i] !== "-1") { isFloor[i] = true; floorTiles.push(i); }
  }

  const visitedFloor = new Array(cols * rows).fill(false);
  const floorRegions = [];
  for (let i of floorTiles) {
      if (!visitedFloor[i] && !isBoundary[i]) {
          const region = []; const queue = [i]; visitedFloor[i] = true;
          while (queue.length > 0) {
              const curr = queue.shift(); region.push(curr);
              const cx = curr % cols, cy = Math.floor(curr / cols);
              const neighbors = [];
              if (cy > 0) neighbors.push(curr - cols);
              if (cy < rows - 1) neighbors.push(curr + cols);
              if (cx > 0) neighbors.push(curr - 1);
              if (cx < cols - 1) neighbors.push(curr + 1);
              for (let n of neighbors) {
                  if (isFloor[n] && !visitedFloor[n] && !isBoundary[n]) { visitedFloor[n] = true; queue.push(n); }
              }
          }
          floorRegions.push(region);
      }
  }

  let maxRegionSize = 0, externalRegionIndex = -1;
  for (let r = 0; r < floorRegions.length; r++) {
      if (floorRegions[r].length > maxRegionSize) { maxRegionSize = floorRegions[r].length; externalRegionIndex = r; }
  }
  const isExternalFloor = new Array(cols * rows).fill(false);
  if (externalRegionIndex !== -1) {
      for (let idx of floorRegions[externalRegionIndex]) isExternalFloor[idx] = true;
  }

  const camadasUnificadas = ["furniture", "eletronics", "utensils"];
  const featuresLayers = [];
  
  // FIX: Lemos as camadas com um ciclo "For" seguro, compatível com xmldom
  const layersNodeList = xmlDoc.getElementsByTagName("layer");
  for(let L = 0; L < layersNodeList.length; L++) {
    const layer = layersNodeList[L];
    const layerName = layer.getAttribute("name");
    const data = parseCSV(layer.textContent, layerName);
    const features = [];

    if (layerName === "persons") {
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== "-1") {
          const x = i % cols, y = Math.floor(i / cols), tileIdx = data[i];
          let direcaoIdx = 2; 
          if (tileIdx === "0.0") direcaoIdx = 2; else if (tileIdx === "0.1") direcaoIdx = 6; else if (tileIdx === "0.2") direcaoIdx = 4; else if (tileIdx === "0.3") direcaoIdx = 0; 
          features.push({ type: "Feature", geometry: { type: "Point", coordinates: [x + 0.5, -(y + 0.5)] }, properties: { layerName, nomeAmigavel: dicionarioE3[layerName]?.[tileIdx] || `Personagem`, direcaoIndex: direcaoIdx }});
        }
      }
    } else if (layerName === "floor") {
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== "-1" && !solidWalls[i]) {
          const x = i % cols, y = Math.floor(i / cols), idx = data[i];
          features.push({ type: "Feature", geometry: { type: "Polygon", coordinates: [[[x, -y], [x + 1, -y], [x + 1, -(y + 1)], [x, -(y + 1)], [x, -y]]] }, properties: { layerName, nomeAmigavel: dicionarioE3[layerName]?.[idx] || `Tile (${idx})`, areaInterna: !isExternalFloor[i] }});
        }
      }
    } else if (layerName === "interactive_elements") {
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== "-1" && !solidWalls[i]) {
          const x = i % cols, y = Math.floor(i / cols), idx = data[i], margin = 0.15; 
          features.push({ type: "Feature", geometry: { type: "Polygon", coordinates: [[[x + margin, -(y + margin)], [x + 1 - margin, -(y + margin)], [x + 1 - margin, -(y + 1 - margin)], [x + margin, -(y + 1 - margin)], [x + margin, -(y + margin)]]] }, properties: { layerName, nomeAmigavel: dicionarioE3[layerName]?.[idx] || `Interativo (${idx})` }});
        }
      }
    } else if (layerName === "walls") {
      const wallEdges = [];
      function isSolidWall(cx, cy) { if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) return false; return solidWalls[cy * cols + cx]; }
      for (let i = 0; i < data.length; i++) {
        const x = i % cols, y = Math.floor(i / cols);
        if (isSolidWall(x, y)) {
          if (!isSolidWall(x, y - 1)) wallEdges.push([[x, -y], [x + 1, -y]]);
          if (!isSolidWall(x, y + 1)) wallEdges.push([[x, -(y + 1)], [x + 1, -(y + 1)]]);
          if (!isSolidWall(x - 1, y)) wallEdges.push([[x, -y], [x, -(y + 1)]]);
          if (!isSolidWall(x + 1, y)) wallEdges.push([[x + 1, -y], [x + 1, -(y + 1)]]);
        }
      }
      if (wallEdges.length > 0) features.push({ type: "Feature", geometry: { type: "MultiLineString", coordinates: wallEdges }, properties: { layerName: "walls", nomeAmigavel: "Parede (Estrutura)", bloqueiaPassagem: true }});
    } else if (camadasUnificadas.includes(layerName)) {
      const visited = new Array(data.length).fill(false);
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== "-1" && !solidWalls[i] && !visited[i]) {
          let minX = cols, maxX = 0, minY = rows, maxY = 0; const queue = [i]; visited[i] = true; const firstIdx = data[i]; const nomeObj = dicionarioE3[layerName]?.[firstIdx] || `Objeto`;
          while (queue.length > 0) {
            const curr = queue.shift(); const cx = curr % cols, cy = Math.floor(curr / cols);
            if (cx < minX) minX = cx; if (cx > maxX) maxX = cx; if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
            const neighbors = []; if (cy > 0) neighbors.push(curr - cols); if (cy < rows - 1) neighbors.push(curr + cols); if (cx > 0) neighbors.push(curr - 1); if (cx < cols - 1) neighbors.push(curr + 1);
            for (const n of neighbors) { if (!visited[n] && data[n] !== "-1" && !solidWalls[n]) { visited[n] = true; queue.push(n); } }
          }
          const margin = 0.15;
          features.push({ type: "Feature", geometry: { type: "Polygon", coordinates: [[[minX + margin, -(minY + margin)], [maxX + 1 - margin, -(minY + margin)], [maxX + 1 - margin, -(maxY + 1 - margin)], [minX + margin, -(maxY + 1 - margin)], [minX + margin, -(minY + margin)]]] }, properties: { layerName, nomeAmigavel: nomeObj, bloqueiaPassagem: true }});
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== "-1" && !solidWalls[i]) {
          const x = i % cols, y = Math.floor(i / cols), idx = data[i];
          features.push({ type: "Feature", geometry: { type: "Polygon", coordinates: [[[x, -y], [x + 1, -y], [x + 1, -(y + 1)], [x, -(y + 1)], [x, -y]]] }, properties: { layerName, nomeAmigavel: dicionarioE3[layerName]?.[idx] || `Tile (${idx})` }});
        }
      }
    }
    
    // Adiciona ao Array final
    featuresLayers.push({ layerName, geojson: { type: "FeatureCollection", features }, cols, rows });
  }

  // RETORNO ESSENCIAL: Sem ele o JSON fica vazio!
  return featuresLayers;
}

const pastaXML = "./src/data/xml/";
const resultados = [];

if (fs.existsSync(pastaXML)) {
  const arquivos = fs.readdirSync(pastaXML).filter(f => f.endsWith('.xml'));
  for (const arquivo of arquivos) {
    const conteudo = fs.readFileSync(path.join(pastaXML, arquivo), 'utf-8');
    resultados.push({
      id: arquivo,
      camadas: processarXML(conteudo)
    });
  }
}

process.stdout.write(JSON.stringify(resultados));