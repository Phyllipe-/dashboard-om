import { describe, it, expect } from "vitest";
import { posicoesIguais, detectarGiros } from "./giros.js";

describe("posicoesIguais", () => {
  it("retorna false se qualquer posição for null/undefined", () => {
    expect(posicoesIguais(null, { x: 0, z: 0 })).toBe(false);
    expect(posicoesIguais({ x: 0, z: 0 }, null)).toBe(false);
    expect(posicoesIguais(undefined, undefined)).toBe(false);
  });

  it("retorna true para posições idênticas", () => {
    expect(posicoesIguais({ x: 1, z: 2 }, { x: 1, z: 2 })).toBe(true);
  });

  it("retorna true dentro da tolerância padrão (0.1)", () => {
    expect(posicoesIguais({ x: 1, z: 2 }, { x: 1.09, z: 2.09 })).toBe(true);
  });

  it("retorna false fora da tolerância padrão", () => {
    expect(posicoesIguais({ x: 1, z: 2 }, { x: 1.11, z: 2 })).toBe(false);
    expect(posicoesIguais({ x: 1, z: 2 }, { x: 1, z: 2.11 })).toBe(false);
  });

  it("usa tolerância customizada", () => {
    expect(posicoesIguais({ x: 1, z: 2 }, { x: 1.5, z: 2.5 }, 1.0)).toBe(true);
    expect(posicoesIguais({ x: 1, z: 2 }, { x: 2, z: 3 }, 1.0)).toBe(false);
  });
});

// Helper que gera uma ação de giro
function acao(direction, x = 0, z = 0, timestamp = 0) {
  return { actionType: 1, direction, position: { x, y: 0, z }, timestamp };
}

function acaoMovimento(x = 0, z = 0) {
  return { actionType: 0, direction: 4, position: { x, y: 0, z }, timestamp: 0 };
}

describe("detectarGiros", () => {
  it("retorna [] para log vazio ou inválido", () => {
    expect(detectarGiros(null)).toEqual([]);
    expect(detectarGiros({})).toEqual([]);
    expect(detectarGiros({ objectives: [] })).toEqual([]);
  });

  it("detecta giro de 90° simples (direita)", () => {
    const log = { objectives: [{ actions: [acao(4, 2, 3)] }] };
    const resultado = detectarGiros(log);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].graus).toBe("90");
    expect(resultado[0].direcao).toBe(4);
    expect(resultado[0].geoX).toBe(2.5);
    expect(resultado[0].geoY).toBe(-3.5);
  });

  it("detecta giro de 90° simples (esquerda)", () => {
    const log = { objectives: [{ actions: [acao(0, 1, 1)] }] };
    const resultado = detectarGiros(log);
    expect(resultado[0].graus).toBe("90");
    expect(resultado[0].direcao).toBe(0);
    expect(resultado[0].direcaoLabel).toBe("← Esquerda");
  });

  it("detecta giro de 180°", () => {
    const log = {
      objectives: [{ actions: [acao(4, 5, 5), acao(4, 5, 5)] }],
    };
    const resultado = detectarGiros(log);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].graus).toBe("180");
  });

  it("detecta giro de 270°", () => {
    const log = {
      objectives: [{ actions: [acao(4, 3, 3), acao(4, 3, 3), acao(4, 3, 3)] }],
    };
    const resultado = detectarGiros(log);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].graus).toBe("270");
  });

  it("detecta giro de 360°", () => {
    const log = {
      objectives: [
        { actions: [acao(4, 1, 1), acao(4, 1, 1), acao(4, 1, 1), acao(4, 1, 1)] },
      ],
    };
    const resultado = detectarGiros(log);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].graus).toBe("360");
  });

  it("não agrupa giros de direções diferentes", () => {
    // Direita seguida de Esquerda na mesma posição → dois giros de 90°
    const log = {
      objectives: [{ actions: [acao(4, 1, 1), acao(0, 1, 1)] }],
    };
    const resultado = detectarGiros(log);
    expect(resultado).toHaveLength(2);
    expect(resultado[0].graus).toBe("90");
    expect(resultado[1].graus).toBe("90");
  });

  it("não agrupa giros em posições diferentes", () => {
    const log = {
      objectives: [{ actions: [acao(4, 1, 1), acao(4, 2, 2)] }],
    };
    const resultado = detectarGiros(log);
    expect(resultado).toHaveLength(2);
    expect(resultado.every(g => g.graus === "90")).toBe(true);
  });

  it("ignora ações que não são giros (actionType !== 1)", () => {
    const log = {
      objectives: [{ actions: [acaoMovimento(0, 0), acao(4, 0, 0)] }],
    };
    const resultado = detectarGiros(log);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].graus).toBe("90");
  });

  it("acumula giros de múltiplos objectives", () => {
    const log = {
      objectives: [
        { actions: [acao(4, 0, 0)] },
        { actions: [acao(0, 1, 1)] },
      ],
    };
    const resultado = detectarGiros(log);
    expect(resultado).toHaveLength(2);
    expect(resultado[0].objetivoIdx).toBe(0);
    expect(resultado[1].objetivoIdx).toBe(1);
  });
});
