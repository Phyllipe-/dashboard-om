import fs from "fs";
import path from "path";
import { parseMapaXML } from "../lib/mapa/parser.js";
import { mapaParaGeoJSON } from "../lib/mapa/geojson.js";

const pastaXML = "./src/data/xml/";
const resultados = [];

/**
 * Extrai o nome legível do mapa a partir do nome do arquivo XML.
 * Ex: "4_1_casa_simples.xml" → "casa simples"
 *     "1_2_entrada.xml"     → "entrada"
 */
function nomeFromFilename(arquivo) {
  const parts = arquivo.replace(/\.xml$/i, "").split("_");
  // Os dois primeiros segmentos são números (id e versão); o resto é o nome
  return parts.slice(2).join(" ").toLowerCase();
}

if (fs.existsSync(pastaXML)) {
  const arquivos = fs.readdirSync(pastaXML).filter(f => f.endsWith(".xml"));
  for (const arquivo of arquivos) {
    const conteudo = fs.readFileSync(path.join(pastaXML, arquivo), "utf-8");
    const mapa = parseMapaXML(conteudo);
    const camadas = mapaParaGeoJSON(mapa);
    const { cols, rows } = mapa;
    const totalTiles = cols * rows;

    // Tiles navegáveis: floor + door_and_windows excluindo janelas
    const getCamada = name => camadas.find(c => c.layerName === name);
    const polyToRect = f => {
      const c = f.geometry.coordinates[0];
      return { x1: c[0][0], y1: c[2][1], x2: c[2][0], y2: c[0][1], ...f.properties };
    };
    const floorRects = (getCamada("floor")?.geojson.features ?? []).map(polyToRect);
    const doorRects  = (getCamada("door_and_windows")?.geojson.features ?? [])
      .map(polyToRect)
      .filter(r => !String(r.nomeAmigavel ?? "").includes("Janela"));
    const tilesNavegaveis = floorRects.length + doorRects.length;
    const navPct = totalTiles > 0 ? tilesNavegaveis / totalTiles : 1;

    resultados.push({
      id:     arquivo,
      nome:   nomeFromFilename(arquivo),
      camadas,
      navPct,
    });
  }
}

process.stdout.write(JSON.stringify(resultados));
