import { describe, it, expect } from "vitest";
import { parseMapaXML, TILE_SIZE, CAMADAS_CONHECIDAS } from "./parser.js";

// Gera XML mínimo válido com as dimensões fornecidas
function xmlMapa(widthPx, heightPx, layers = []) {
  const layerXml = layers
    .map(({ name, tiles }) => `<layer name="${name}">${tiles.join(",")}</layer>`)
    .join("\n");
  return `<?xml version="1.0"?>
<map>
  <canvas width="${widthPx}" height="${heightPx}">
    ${layerXml}
  </canvas>
</map>`;
}

describe("parseMapaXML", () => {
  it("lança erro quando <canvas> está ausente", () => {
    expect(() => parseMapaXML("<map></map>")).toThrow("canvas");
  });

  it("calcula cols e rows corretamente", () => {
    const xml = xmlMapa(5 * TILE_SIZE, 4 * TILE_SIZE);
    const result = parseMapaXML(xml);
    expect(result.cols).toBe(5);
    expect(result.rows).toBe(4);
  });

  it("retorna layers vazio quando não há elementos <layer>", () => {
    const xml = xmlMapa(3 * TILE_SIZE, 2 * TILE_SIZE);
    const result = parseMapaXML(xml);
    expect(result.layers).toEqual({});
  });

  it("parseia uma camada simples corretamente", () => {
    const cols = 3, rows = 2;
    const total = cols * rows; // 6 tiles
    const tiles = [0, 1, -1, 2, -1, 0];
    const xml = xmlMapa(cols * TILE_SIZE, rows * TILE_SIZE, [
      { name: "floor", tiles },
    ]);
    const result = parseMapaXML(xml);
    expect(result.layers.floor).toHaveLength(total);
    expect(result.layers.floor[0]).toBe("0");
    expect(result.layers.floor[1]).toBe("1");
    expect(result.layers.floor[2]).toBe("-1");
  });

  it("substitui tiles vazios por -1", () => {
    const xml = xmlMapa(2 * TILE_SIZE, 1 * TILE_SIZE, [
      { name: "walls", tiles: [0, ""] },
    ]);
    const result = parseMapaXML(xml);
    expect(result.layers.walls[1]).toBe("-1");
  });

  it("faz padding com -1 quando o layer tem tiles insuficientes", () => {
    const cols = 3, rows = 2; // total = 6
    const xml = xmlMapa(cols * TILE_SIZE, rows * TILE_SIZE, [
      { name: "floor", tiles: [1, 2] }, // só 2 tiles para 6
    ]);
    const result = parseMapaXML(xml);
    expect(result.layers.floor).toHaveLength(6);
    expect(result.layers.floor[2]).toBe("-1");
  });

  it("parseia múltiplas camadas", () => {
    const cols = 2, rows = 2;
    const tiles = [0, 1, 2, 3];
    const xml = xmlMapa(cols * TILE_SIZE, rows * TILE_SIZE, [
      { name: "floor", tiles },
      { name: "walls", tiles },
    ]);
    const result = parseMapaXML(xml);
    expect(Object.keys(result.layers)).toEqual(["floor", "walls"]);
    expect(result.layers.floor).toHaveLength(4);
    expect(result.layers.walls).toHaveLength(4);
  });

  it("CAMADAS_CONHECIDAS contém as camadas padrão", () => {
    expect(CAMADAS_CONHECIDAS).toContain("floor");
    expect(CAMADAS_CONHECIDAS).toContain("walls");
    expect(CAMADAS_CONHECIDAS).toContain("persons");
  });
});
