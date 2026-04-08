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
    resultados.push({
      id:     arquivo,
      nome:   nomeFromFilename(arquivo),
      camadas: mapaParaGeoJSON(mapa),
    });
  }
}

process.stdout.write(JSON.stringify(resultados));
