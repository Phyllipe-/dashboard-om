import { describe, it, expect } from "vitest";
import { extrairSegmentos, extrairColisoes, corSegmento, raioColisao } from "./colisao.js";

describe("corSegmento", () => {
  it("maxCount === 1 → t=1 → cor mais escura (rgb(8,48,107))", () => {
    expect(corSegmento(1, 1)).toBe("rgb(8,48,107)");
  });

  it("count === 1, maxCount > 1 → t=0 → cor mais clara (rgb(198,219,239))", () => {
    expect(corSegmento(1, 5)).toBe("rgb(198,219,239)");
  });

  it("count === maxCount (>1) → t=1 → cor mais escura", () => {
    expect(corSegmento(5, 5)).toBe("rgb(8,48,107)");
  });

  it("valor intermediário → cor entre extremos", () => {
    const cor = corSegmento(3, 5); // t = (3-1)/(5-1) = 0.5
    expect(cor).toMatch(/^rgb\(/);
    const vals = cor.match(/\d+/g).map(Number);
    // R deve estar entre 8 e 198
    expect(vals[0]).toBeGreaterThan(8);
    expect(vals[0]).toBeLessThan(198);
  });
});

describe("raioColisao", () => {
  it("count pequeno com scale pequeno → clampado ao mínimo (1.5)", () => {
    expect(raioColisao(1, 10)).toBeCloseTo(1.5);
  });

  it("count grande → raio cresce com a contagem", () => {
    const r1 = raioColisao(1, 100);
    const r2 = raioColisao(10, 100);
    expect(r2).toBeGreaterThan(r1);
  });

  it("raio não ultrapassa scale * 0.04", () => {
    const scale = 200;
    const max = scale * 0.04; // 8
    expect(raioColisao(1000, scale)).toBeLessThanOrEqual(max);
  });
});

function acaoLog(x, z) {
  return { actionType: 0, direction: 4, timestamp: 0, position: { x, y: 0, z } };
}

describe("extrairSegmentos", () => {
  it("retorna [] para log vazio ou inválido", () => {
    expect(extrairSegmentos(null, 5)).toEqual([]);
    expect(extrairSegmentos({}, 5)).toEqual([]);
    expect(extrairSegmentos({ objectives: [] }, 5)).toEqual([]);
  });

  it("retorna [] se há apenas uma ação (sem segmento)", () => {
    const log = { objectives: [{ actions: [acaoLog(0, 0)] }] };
    expect(extrairSegmentos(log, 5)).toEqual([]);
  });

  it("gera segmento entre duas posições ortogonais distintas", () => {
    const log = { objectives: [{ actions: [acaoLog(0, 0), acaoLog(1, 0)] }] };
    const segs = extrairSegmentos(log, 5);
    expect(segs).toHaveLength(1);
    const s = segs[0];
    // rows=5: geoY = round(z) + 0.5 - rows
    // pos(0,0) → geoX=0.5, geoY=0.5-5=-4.5
    // pos(1,0) → geoX=1.5, geoY=0.5-5=-4.5
    expect(s.y1).toBeCloseTo(-4.5);
    expect(s.y2).toBeCloseTo(-4.5);
    expect(s.count).toBe(1);
  });

  it("descarta movimentos diagonais (ambos x e z mudam)", () => {
    const log = { objectives: [{ actions: [acaoLog(0, 0), acaoLog(1, 1)] }] };
    expect(extrairSegmentos(log, 5)).toEqual([]);
  });

  it("incrementa count para segmento percorrido mais de uma vez", () => {
    const log = {
      objectives: [
        { actions: [acaoLog(0, 0), acaoLog(1, 0), acaoLog(0, 0)] },
      ],
    };
    const segs = extrairSegmentos(log, 5);
    // segmento 0.5,-4.5 | 1.5,-4.5 percorrido duas vezes
    expect(segs).toHaveLength(1);
    expect(segs[0].count).toBe(2);
  });
});

describe("extrairColisoes", () => {
  it("retorna [] para log vazio ou inválido", () => {
    expect(extrairColisoes(null, 5)).toEqual([]);
    expect(extrairColisoes({}, 5)).toEqual([]);
  });

  it("retorna [] quando não há colisões", () => {
    const log = { objectives: [{ actions: [acaoLog(0, 0)], collisions: [] }] };
    expect(extrairColisoes(log, 5)).toEqual([]);
  });

  it("agrupa colisões pelo objectID", () => {
    const log = {
      objectives: [
        {
          actions: [],
          collisions: [
            { objectID: "parede-1", timestamp: 0, position: { x: 2, y: 0, z: 3 } },
            { objectID: "parede-1", timestamp: 1, position: { x: 4, y: 0, z: 5 } },
          ],
        },
      ],
    };
    const cols = extrairColisoes(log, 10);
    expect(cols).toHaveLength(1);
    expect(cols[0].objectID).toBe("parede-1");
    expect(cols[0].count).toBe(2);
    // geoX = média de x = (2+4)/2 = 3
    expect(cols[0].geoX).toBeCloseTo(3);
    // geoY = média de z - rows = (3+5)/2 - 10 = 4-10 = -6
    expect(cols[0].geoY).toBeCloseTo(-6);
  });

  it("trata múltiplos objectIDs separadamente", () => {
    const log = {
      objectives: [
        {
          actions: [],
          collisions: [
            { objectID: "A", timestamp: 0, position: { x: 1, y: 0, z: 1 } },
            { objectID: "B", timestamp: 0, position: { x: 5, y: 0, z: 5 } },
          ],
        },
      ],
    };
    const cols = extrairColisoes(log, 10);
    expect(cols).toHaveLength(2);
  });
});
