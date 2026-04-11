/**
 * src/lib/sessao/index.js
 * Ponto de entrada da biblioteca de processamento de sessões ENA.
 */

export { detectarGiros, posicoesIguais, MARCADORES_GIRO } from "./giros.js";
export { contarMovimentos, heatTilesParaRects } from "./heatmap.js";
export { extrairSegmentos, extrairColisoes, corSegmento, raioColisao } from "./colisao.js";
export { extrairLateralidade, corpoSVGElement, COR_DIREITA, COR_ESQUERDA } from "./lateralidade.js";
export { graficoLateralidade, graficoTrajetoria, graficoTrafego, graficoGiros, graficoComparacao, graficoEvolucaoLongitudinal, graficoEficienciaRota } from "./detalhamento.js";
