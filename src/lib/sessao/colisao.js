/**
 * colisao.js
 * Extrai trajetórias e colisões do dados_log de uma sessão ENA.
 *
 * Estrutura do log:
 *   objectives[i].actions[]    → { actionType, direction, timestamp, position:{x,y,z} }
 *   objectives[i].collisions[] → { objectID, timestamp, position:{x,y,z} }
 *
 * Eixo Z do Unity é INVERTIDO em relação ao row do mapa XML:
 *   Z cresce em direção ao topo do mapa → geoY = round(z) + 0.5 - rows
 */

export const ACTION_TIPO_COLISAO = 2;

// Z Unity → geoY GeoJSON (requer rows do mapa)
function tileCenter(x, z, rows) {
  return {
    geoX: Math.round(x) + 0.5,
    geoY: Math.round(z) + 0.5 - rows,
  };
}

/** Chave canônica A↔B (combina travessias nos dois sentidos). */
function segKey(a, b) {
  if (a.geoX < b.geoX || (a.geoX === b.geoX && a.geoY <= b.geoY)) {
    return `${a.geoX},${a.geoY}|${b.geoX},${b.geoY}`;
  }
  return `${b.geoX},${b.geoY}|${a.geoX},${a.geoY}`;
}

/**
 * Extrai segmentos de trajetória em ordem temporal.
 * Conecta posições consecutivas distintas de actions[].
 * Descarta diagonais (artefatos de log) — movimento é sempre ortogonal.
 *
 * @param {object} dadosLog
 * @param {number} rows — número de linhas do mapa
 * @returns {Array<{ x1, y1, x2, y2, count }>}
 */
export function extrairSegmentos(dadosLog, rows) {
  const contagem = new Map();

  for (const obj of dadosLog?.objectives ?? []) {
    let prev = null;
    for (const a of obj.actions ?? []) {
      const cur = tileCenter(a.position?.x ?? 0, a.position?.z ?? 0, rows);
      const movedX = cur.geoX !== prev?.geoX;
      const movedY = cur.geoY !== prev?.geoY;
      if (prev && (movedX || movedY) && !(movedX && movedY)) {
        const key = segKey(prev, cur);
        contagem.set(key, (contagem.get(key) ?? 0) + 1);
      }
      prev = cur;
    }
  }

  return [...contagem.entries()].map(([key, count]) => {
    const [from, to] = key.split("|");
    const [x1, y1]   = from.split(",").map(Number);
    const [x2, y2]   = to.split(",").map(Number);
    return { x1, y1, x2, y2, count };
  });
}

/**
 * Extrai colisões de objectives[].collisions[].
 * Usa Math.ceil em x e z e aplica a mesma inversão de eixo Z.
 * Agrupa pelo tile resultante e conta ocorrências.
 *
 * @param {object} dadosLog
 * @param {number} rows — número de linhas do mapa
 * @returns {Array<{ geoX, geoY, count, objectID }>}
 */
export function extrairColisoes(dadosLog, rows) {
  const contagem = new Map();
  const objeto   = new Map();

  for (const obj of dadosLog?.objectives ?? []) {
    for (const c of obj.collisions ?? []) {
      const geoX = Math.ceil(c.position?.x ?? 0);
      const geoY = Math.ceil(c.position?.z ?? 0) - rows;
      const key  = `${geoX},${geoY}`;
      contagem.set(key, (contagem.get(key) ?? 0) + 1);
      if (!objeto.has(key)) objeto.set(key, c.objectID ?? "");
    }
  }

  return [...contagem.entries()].map(([key, count]) => {
    const [geoX, geoY] = key.split(",").map(Number);
    return { geoX, geoY, count, objectID: objeto.get(key) };
  });
}

/**
 * Cor CSS do segmento de trajetória — paleta Blues (#c6dbef → #08306b).
 */
export function corSegmento(count, maxCount) {
  const t = maxCount > 1 ? (count - 1) / (maxCount - 1) : 1;
  const r = Math.round(198 - t * 190);
  const g = Math.round(219 - t * 171);
  const b = Math.round(239 - t * 132);
  return `rgb(${r},${g},${b})`;
}

/**
 * Raio (px) do círculo de colisão: cresce com a contagem.
 */
export function raioColisao(count, scale) {
  return Math.max(1.5, Math.min(scale * 0.04, 1.5 + count * scale * 0.01));
}
