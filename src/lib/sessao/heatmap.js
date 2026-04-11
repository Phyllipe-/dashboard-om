/**
 * heatmap.js
 * Processa dados_log de uma sessão ENA para gerar tiles de heatmap de movimentação.
 *
 * Sistema de coordenadas GeoJSON:
 *   col = Math.round(position.x)
 *   row = Math.round(position.z)
 *   Tile no espaço GeoJSON: x ∈ [col, col+1], y ∈ [-(row+1), -row]
 */

/** Fator de redução linear do tile (0.4 = reduz 40% de cada lado → tile ocupa 60%). */
const ESCALA_TILE = 0.6;
/** Margem em cada lado para manter o tile centralizado. */
const MARGEM = (1 - ESCALA_TILE) / 2; // 0.2

/**
 * Paleta de azuis com transparência (5 níveis: 1, 2, 3, 4, 5+).
 * Opacidade parcial permite visualizar o mapa base por baixo.
 */
export const PALETA_HEATMAP = [
  { label: "1",  cor: "rgba(198,219,239,0.60)" },
  { label: "2",  cor: "rgba(107,174,214,0.68)" },
  { label: "3",  cor: "rgba(49,130,189,0.75)"  },
  { label: "4",  cor: "rgba(8,81,156,0.82)"    },
  { label: "5+", cor: "rgba(8,48,107,0.88)"    },
];

/**
 * Retorna a cor CSS para um dado número de ações.
 * count 1 → índice 0, count 5+ → índice 4.
 */
export function corHeatmap(count) {
  const idx = Math.min(count - 1, PALETA_HEATMAP.length - 1);
  return PALETA_HEATMAP[idx].cor;
}

/**
 * Conta quantas vezes o aluno passou por cada tile (col, row).
 *
 * @param {object} dadosLog — campo dados_log retornado pela API
 *   Estrutura: { objectives: [{ actions: [{ position: {x, y, z} }] }] }
 * @returns {Map<string, number>} chave "col,row" → contagem de passagens
 */
export function contarMovimentos(dadosLog) {
  const contagem = new Map();
  for (const obj of dadosLog?.objectives ?? []) {
    for (const a of obj.actions ?? []) {
      const col = Math.round(a.position?.x ?? 0);
      const row = Math.round(a.position?.z ?? 0);
      const key = `${col},${row}`;
      contagem.set(key, (contagem.get(key) ?? 0) + 1);
    }
  }
  return contagem;
}

/**
 * Converte a Map de contagem em array de rects prontos para Plot.rect.
 * Cada tile é reduzido em 40% e mantido centralizado no grid.
 *
 * @param {Map<string, number>} contagem — resultado de contarMovimentos()
 * @param {number} rows — número de linhas do mapa (giroState.rows)
 * @returns {Array<{ x1: number, x2: number, y1: number, y2: number, count: number }>}
 */
export function heatTilesParaRects(contagem, rows) {
  const m = MARGEM;
  return [...contagem.entries()].map(([key, count]) => {
    const [col, row] = key.split(",").map(Number);
    // No Unity, Z aumenta em direção ao topo do mapa; row=rows-1-round(z).
    // Equivalente: geoY_topo = round(z) - rows, geoY_base = round(z) + 1 - rows
    return {
      x1: col + m,
      x2: col + 1 - m,
      y1: row - rows + m,
      y2: row + 1 - m - rows,
      count,
    };
  });
}
