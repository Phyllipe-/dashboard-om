/**
 * src/lib/mapa/index.js
 * Ponto de entrada da biblioteca de processamento de mapas ENA.
 *
 * Uso típico:
 *   import { parseMapaXML, mapaParaGeoJSON, DICIONARIO, TILE_SIZE } from "../lib/mapa/index.js";
 */

export { parseMapaXML, DICIONARIO, CAMADAS_CONHECIDAS, TILE_SIZE } from "./parser.js";
export { mapaParaGeoJSON } from "./geojson.js";
