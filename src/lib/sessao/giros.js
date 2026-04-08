/**
 * giros.js
 * Detecta giros (90°/180°/270°/360°) a partir do dados_log de uma sessão ENA.
 *
 * Lógica baseada em obterDetalhesDosGirosP do notebook Observable
 * https://observablehq.com/d/847e70f7368f6dfe
 *
 * actionType === 1  → ação de giro
 * direction  === 0  → Esquerda
 * direction  === 4  → Direita
 */

/** Verifica se duas posições {x, y, z} são iguais dentro de uma tolerância. */
export function posicoesIguais(pos1, pos2, tolerancia = 0.1) {
  if (!pos1 || !pos2) return false;
  return (
    Math.abs(pos1.x - pos2.x) < tolerancia &&
    Math.abs(pos1.z - pos2.z) < tolerancia
  );
}

/** Tabela de marcadores Unicode por graus e direção. */
export const MARCADORES_GIRO = [
  { graus: "360", direcao: 4, marcador: "⟳", corHex: "#e07b54" },
  { graus: "270", direcao: 4, marcador: "⮎", corHex: "#e07b54" },
  { graus: "180", direcao: 4, marcador: "⤻", corHex: "#e07b54" },
  { graus: "90",  direcao: 4, marcador: "⮣", corHex: "#e07b54" },
  { graus: "360", direcao: 0, marcador: "⟲", corHex: "#4a90d9" },
  { graus: "270", direcao: 0, marcador: "⮌", corHex: "#4a90d9" },
  { graus: "180", direcao: 0, marcador: "⤺", corHex: "#4a90d9" },
  { graus: "90",  direcao: 0, marcador: "⮢", corHex: "#4a90d9" },
];

/**
 * Detecta giros no dados_log de UMA sessão.
 *
 * @param {object} dadosLog — campo dados_log retornado pela API
 *   Estrutura esperada: { objectives: [{ actions: [{ actionType, direction, position:{x,y,z}, timestamp }] }] }
 *
 * @returns {Array<{
 *   graus: "90"|"180"|"270"|"360",
 *   direcao: 0|4,
 *   direcaoLabel: string,
 *   marcador: string,
 *   corHex: string,
 *   geoX: number,   // coordenada X no espaço GeoJSON do mapa (col + 0.5)
 *   geoY: number,   // coordenada Y no espaço GeoJSON do mapa (-(row + 0.5))
 *   timestamp: number,
 *   objetivoIdx: number,
 * }>}
 */
export function detectarGiros(dadosLog) {
  const giros = [];
  if (!dadosLog?.objectives) return giros;

  const isTurn = (a) => a?.actionType === 1;

  dadosLog.objectives.forEach((objetivo, objIdx) => {
    const actions = objetivo.actions ?? [];
    let i = 0;

    while (i < actions.length) {
      const a0 = actions[i];
      const a1 = actions[i + 1];
      const a2 = actions[i + 2];
      const a3 = actions[i + 3];

      let graus = null;
      let consumidas = 0;

      // 360° — 4 giros consecutivos, mesma direção, mesma posição
      if (
        isTurn(a0) && isTurn(a1) && isTurn(a2) && isTurn(a3) &&
        a1.direction === a0.direction &&
        a2.direction === a0.direction &&
        a3.direction === a0.direction &&
        posicoesIguais(a0.position, a1.position) &&
        posicoesIguais(a0.position, a2.position) &&
        posicoesIguais(a0.position, a3.position)
      ) {
        graus = "360"; consumidas = 4;

      // 270° — 3 giros consecutivos
      } else if (
        isTurn(a0) && isTurn(a1) && isTurn(a2) &&
        a1.direction === a0.direction &&
        a2.direction === a0.direction &&
        posicoesIguais(a0.position, a1.position) &&
        posicoesIguais(a0.position, a2.position)
      ) {
        graus = "270"; consumidas = 3;

      // 180° — 2 giros consecutivos
      } else if (
        isTurn(a0) && isTurn(a1) &&
        a1.direction === a0.direction &&
        posicoesIguais(a0.position, a1.position)
      ) {
        graus = "180"; consumidas = 2;

      // 90° — giro simples
      } else if (isTurn(a0)) {
        graus = "90"; consumidas = 1;
      }

      if (graus) {
        const info = MARCADORES_GIRO.find(
          (m) => m.direcao === a0.direction && m.graus === graus
        );
        if (info) {
          giros.push({
            ...info,
            direcaoLabel: a0.direction === 4 ? "Direita →" : "← Esquerda",
            // Posição em tile-space → centro do tile no espaço GeoJSON
            geoX: Math.round(a0.position?.x ?? 0) + 0.5,
            geoY: -(Math.round(a0.position?.z ?? 0) + 0.5),
            timestamp: a0.timestamp ?? 0,
            objetivoIdx: objIdx,
          });
        }
        i += consumidas;
      } else {
        i++;
      }
    }
  });

  return giros;
}
