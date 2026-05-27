import { describe, it, expect } from "vitest";
import { extrairLateralidade } from "./lateralidade.js";

function acao(direction) {
  return { actionType: 1, direction, position: { x: 0, y: 0, z: 0 }, timestamp: 0 };
}

describe("extrairLateralidade", () => {
  it("retorna 0.5/0.5 para log vazio ou inválido", () => {
    for (const input of [null, {}, { objectives: [] }]) {
      const r = extrairLateralidade(input);
      expect(r.direita).toBe(0);
      expect(r.esquerda).toBe(0);
      expect(r.total).toBe(0);
      expect(r.pctDireita).toBe(0.5);
      expect(r.pctEsquerda).toBe(0.5);
    }
  });

  it("conta corretamente ações de direita (direction=4)", () => {
    const log = {
      objectives: [{ actions: [acao(4), acao(4), acao(4)] }],
    };
    const r = extrairLateralidade(log);
    expect(r.direita).toBe(3);
    expect(r.esquerda).toBe(0);
    expect(r.total).toBe(3);
    expect(r.pctDireita).toBeCloseTo(1);
    expect(r.pctEsquerda).toBeCloseTo(0);
  });

  it("conta corretamente ações de esquerda (direction=0)", () => {
    const log = {
      objectives: [{ actions: [acao(0), acao(0)] }],
    };
    const r = extrairLateralidade(log);
    expect(r.esquerda).toBe(2);
    expect(r.direita).toBe(0);
    expect(r.pctEsquerda).toBeCloseTo(1);
    expect(r.pctDireita).toBeCloseTo(0);
  });

  it("ignora ações com direction diferente de 0 e 4", () => {
    const log = {
      objectives: [{ actions: [acao(4), { direction: 2, actionType: 0, position: { x: 0, y: 0, z: 0 } }] }],
    };
    const r = extrairLateralidade(log);
    expect(r.total).toBe(1);
    expect(r.direita).toBe(1);
  });

  it("calcula percentuais corretos com 3 direitas e 1 esquerda", () => {
    const log = {
      objectives: [{ actions: [acao(4), acao(4), acao(4), acao(0)] }],
    };
    const r = extrairLateralidade(log);
    expect(r.direita).toBe(3);
    expect(r.esquerda).toBe(1);
    expect(r.total).toBe(4);
    expect(r.pctDireita).toBeCloseTo(0.75);
    expect(r.pctEsquerda).toBeCloseTo(0.25);
  });

  it("acumula ações de múltiplos objectives", () => {
    const log = {
      objectives: [
        { actions: [acao(4), acao(0)] },
        { actions: [acao(4), acao(4)] },
      ],
    };
    const r = extrairLateralidade(log);
    expect(r.direita).toBe(3);
    expect(r.esquerda).toBe(1);
    expect(r.total).toBe(4);
  });
});
