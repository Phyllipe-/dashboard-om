/**
 * parser.js
 * Lê um XML de mapa do ENA e devolve uma estrutura normalizada.
 *
 * Retorno: { cols, rows, layers: { [nome]: string[] } }
 * onde cada valor é o array de tiles daquela camada (ou [] se ausente).
 */

import { DOMParser } from "@xmldom/xmldom";

export const TILE_SIZE = 32;

/** Nomes de todas as camadas conhecidas do formato ENA. */
export const CAMADAS_CONHECIDAS = [
  "floor",
  "walls",
  "door_and_windows",
  "furniture",
  "eletronics",
  "utensils",
  "persons",
  "interactive_elements",
];

/** Dicionário de nomes amigáveis por camada e índice de tile. */
export const DICIONARIO = {
  floor:            { "0":"Cimento Queimado","1":"Carpete","2":"Água","3":"Cerâmica","4":"Areia","5":"Piso tátil atenção","6":"Piso tátil direção","7":"Cascalho","8":"Paralelepípedo","9":"Metálico","10":"Chão com folhas secas","11":"Grama","12":"Madeira","13":"Neve","14":"Piso de vidro","15":"Pedra" },
  walls:            { "0":"Guardacorpo","1":"Azulejo","2":"Madeira","3":"Tijolo aparente","4":"Vidro","5":"Plástico","6":"Gesso","8":"Escada 270º-P1","9":"Escada 270º-P2","10":"Escada 0º-P2","11":"Escada 180º-P1","16":"Escada 90º-P2","17":"Escada 90º-P1","18":"Escada 0º-P1","19":"Escada 180º-P2" },
  door_and_windows: { "0":"Porta Trancada 0º","2":"Porta Fechada 0º","4":"Porta Automática 0º","6":"Janela de vidro 0º","7":"Janela de madeira 0º","8":"Porta Trancada 90º","10":"Porta Fechada 90º","12":"Porta Automática 90º","14":"Janela de vidro 90º","15":"Janela de madeira 90º" },
  furniture:        { "0.1":"Cama de Casal","2.1":"Cama de Solteiro","4.1":"Mesa de jantar","4.5":"Guarda-roupa","8.5":"Sofá","10.1":"Cômoda","10.5":"Estante","12.1":"Mesa" },
  eletronics:       { "0.0":"Geladeira","0.2":"Fogão","0.4":"Computador","0.6":"Máquina de lavar","2.2":"TV","2.4":"Micro-ondas" },
  utensils:         { "0.0":"Piano","0.2":"Cone","0.3":"Abajur","1.2":"Violão","1.3":"Lixeira","0.4":"Vaso Sanitário","0.6":"Lavatório","2.2":"Vaso de planta","2.3":"Quadro","4.1":"Objeto Alvo" },
  persons:          { "0.0":"Personagem - Frente","0.1":"Personagem - Trás","0.2":"Personagem - Direita","0.3":"Personagem - Esquerda" },
};

/**
 * Parseia o XML de um mapa ENA.
 * @param {string} xmlString — conteúdo bruto do arquivo .xml
 * @returns {{ cols: number, rows: number, layers: Record<string, string[]> }}
 */
export function parseMapaXML(xmlString) {
  const doc = new DOMParser().parseFromString(xmlString, "text/xml");

  const canvas = doc.getElementsByTagName("canvas")[0];
  if (!canvas) throw new Error("XML inválido: elemento <canvas> não encontrado.");

  const cols = parseInt(canvas.getAttribute("width"))  / TILE_SIZE;
  const rows = parseInt(canvas.getAttribute("height")) / TILE_SIZE;
  const total = cols * rows;

  const layers = {};
  const nodeList = doc.getElementsByTagName("layer");

  for (let i = 0; i < nodeList.length; i++) {
    const node = nodeList[i];
    const nome = node.getAttribute("name");
    const tiles = node.textContent
      .replace(/\s+/g, "")
      .split(",")
      .map(v => (v === "" || v === "-1") ? "-1" : v);

    // Garante tamanho correto (padding com -1 se necessário)
    while (tiles.length < total) tiles.push("-1");
    layers[nome] = tiles;
  }

  return { cols, rows, layers };
}
