import { describe, it, expect } from "vitest";
import { corHeatmap, contarMovimentos, heatTilesParaRects, PALETA_HEATMAP } from "./heatmap.js";

describe("corHeatmap", () => {
  it("count 1 → primeiro nível da paleta", () => {
    expect(corHeatmap(1)).toBe(PALETA_HEATMAP[0].cor);
  });

  it("count 3 → terceiro nível da paleta", () => {
    expect(corHeatmap(3)).toBe(PALETA_HEATMAP[2].cor);
  });

  it("count 5 → último nível da paleta", () => {
    expect(corHeatmap(5)).toBe(PALETA_HEATMAP[4].cor);
  });

  it("count acima de 5 → clampado ao último nível", () => {
    expect(corHeatmap(10)).toBe(PALETA_HEATMAP[4].cor);
    expect(corHeatmap(100)).toBe(PALETA_HEATMAP[4].cor);
  });
});

describe("contarMovimentos", () => {
  it("retorna Map vazia para log vazio ou inválido", () => {
    expect(contarMovimentos(null).size).toBe(0);
    expect(contarMovimentos({}).size).toBe(0);
    expect(contarMovimentos({ objectives: [] }).size).toBe(0);
  });

  it("conta passagens em tiles distintos", () => {
    const log = {
      objectives: [
        {
          actions: [
            { position: { x: 0, y: 0, z: 0 } },
            { position: { x: 1, y: 0, z: 0 } },
            { position: { x: 0, y: 0, z: 0 } },
          ],
        },
      ],
    };
    const resultado = contarMovimentos(log);
    expect(resultado.get("0,0")).toBe(2);
    expect(resultado.get("1,0")).toBe(1);
  });

  it("acumula contagens de múltiplos objectives", () => {
    const log = {
      objectives: [
        { actions: [{ position: { x: 2, y: 0, z: 3 } }] },
        { actions: [{ position: { x: 2, y: 0, z: 3 } }] },
      ],
    };
    const resultado = contarMovimentos(log);
    expect(resultado.get("2,3")).toBe(2);
  });

  it("arredonda posições com Math.round", () => {
    const log = {
      objectives: [
        {
          actions: [
            { position: { x: 1.4, y: 0, z: 2.6 } },
            { position: { x: 1.6, y: 0, z: 2.4 } },
          ],
        },
      ],
    };
    const resultado = contarMovimentos(log);
    // 1.4 → 1, 2.6 → 3  /  1.6 → 2, 2.4 → 2
    expect(resultado.get("1,3")).toBe(1);
    expect(resultado.get("2,2")).toBe(1);
  });
});

describe("heatTilesParaRects", () => {
  it("converte Map em array de rects com campos corretos", () => {
    const contagem = new Map([["2,3", 4]]);
    const rows = 10;
    const rects = heatTilesParaRects(contagem, rows);
    expect(rects).toHaveLength(1);
    const r = rects[0];
    expect(r.count).toBe(4);
    // x: col=2, margem=0.2 → x1=2.2, x2=2.8
    expect(r.x1).toBeCloseTo(2.2);
    expect(r.x2).toBeCloseTo(2.8);
    // row=3, rows=10 → y1 = 3 - 10 + 0.2 = -6.8, y2 = 3 + 1 - 0.2 - 10 = -6.2
    expect(r.y1).toBeCloseTo(-6.8);
    expect(r.y2).toBeCloseTo(-6.2);
  });

  it("retorna array vazio para Map vazia", () => {
    expect(heatTilesParaRects(new Map(), 5)).toEqual([]);
  });

  it("retorna um rect por entrada do Map", () => {
    const contagem = new Map([["0,0", 1], ["1,1", 3], ["2,2", 5]]);
    expect(heatTilesParaRects(contagem, 5)).toHaveLength(3);
  });
});
