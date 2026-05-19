/**
 * src/lib/sessao/detalhamento.js
 * Gráficos por tipo de análise — Perfil Detalhado.
 *
 * Assinaturas:
 *   graficoLateralidade(sessoesComLog, Plot)
 *   graficoTrajetoria(sessoesComLog, camadas, Plot)
 *   graficoTrafego(sessoesComLog, Plot)
 *   graficoGiros(sessoesComLog, Plot)
 *   graficoComparacao(sessoesDoMapaComMetricas, idLogAtual, Plot)
 *   graficoEvolucaoLongitudinal(sessoesComLog, idLogAtual, Plot)
 *
 * sessoesComLog: [{ sessao: { id_log, ... }, dadosLog }] em ordem cronológica
 */

import { extrairLateralidade }            from "./lateralidade.js";
import { detectarGiros }                  from "./giros.js";
import { contarMovimentos, heatTilesParaRects, corHeatmap, PALETA_HEATMAP } from "./heatmap.js";

const W = 280;

function aviso(msg) {
  const p = document.createElement("p");
  p.style.cssText = "font-style:italic;font-size:.82rem;color:var(--theme-foreground-muted);padding:.3rem 0;margin:0;";
  p.textContent = msg;
  return p;
}

function label(s) { return `#${s.id_log}`; }

// ── Lateralidade ──────────────────────────────────────────────────────────────
/**
 * Barras horizontais Direita (positivo) / Esquerda (negativo) por sessão.
 */
export function graficoLateralidade(sessoesComLog, Plot) {
  const dados = sessoesComLog.flatMap(({ sessao, dadosLog }) => {
    const lat = extrairLateralidade(dadosLog);
    const lbl = label(sessao);
    return [
      { lbl, lado: "Direita",  valor:  lat.direita  },
      { lbl, lado: "Esquerda", valor: -lat.esquerda },
    ];
  }).filter(d => d.valor !== 0);

  if (!dados.length) return aviso("Nenhuma ação lateral registada.");

  const labels = [...new Map(dados.map(d => [d.lbl, d.lbl])).keys()];
  const maxVal = Math.max(...dados.map(d => Math.abs(d.valor)), 1);

  return Plot.plot({
    width: W,
    height: Math.max(90, labels.length * 28 + 40),
    marginLeft: 56, marginRight: 8, marginTop: 8, marginBottom: 24,
    x: { label: null, domain: [-maxVal * 1.1, maxVal * 1.1], ticks: [-maxVal, 0, maxVal], tickFormat: d => Math.abs(d) },
    y: { domain: labels, label: null },
    color: { domain: ["Direita", "Esquerda"], range: ["#5ba85b", "#e07b54"], legend: true },
    marks: [
      Plot.barX(dados, { x: "valor", y: "lbl", fill: "lado", tip: true }),
      Plot.ruleX([0]),
    ],
  });
}

// ── Trajetória — mapa de densidade de movimentação ────────────────────────────
/**
 * Plot.density sobre as posições brutas de todas as sessões, renderizado sobre
 * o mapa base (floor + paredes + portas). Segue o mesmo padrão de:
 *
 *   Plot.density(dados, {x, y, stroke: "steelblue", strokeWidth: 0.75})   ← linhas finas
 *   Plot.density(dados, {x, y, stroke: "steelblue", thresholds: 4})       ← 4 faixas marcadas
 *   Plot.dot(dados, {x, y, fill, r})                                       ← posições brutas
 *
 * Coordenadas:
 *   x_geo = position.x            (Unity X → GeoJSON X, 1:1)
 *   y_geo = position.z − rows     (Unity Z invertido: Z cresce p/ cima)
 *
 * @param {Array<{sessao, dadosLog}>} sessoesComLog
 * @param {Array|null} camadas  — resultado de mapaParaGeoJSON(); null = sem base
 */
export function graficoTrajetoria(sessoesComLog, camadas, Plot) {
  // Dimensões do mapa
  const ref  = camadas?.[0];
  const cols = ref?.cols ?? 0;
  const rows = ref?.rows ?? 0;

  // Helpers de camada base
  const getCamada  = name => camadas?.find(c => c.layerName === name);
  const polyToRect = f => {
    const c = f.geometry.type === "Polygon" ? f.geometry.coordinates[0] : f.geometry.coordinates;
    return { x1: c[0][0], y1: c[2][1], x2: c[2][0], y2: c[0][1], ...f.properties };
  };

  const floorRects  = (getCamada("floor")?.geojson.features ?? []).map(polyToRect);
  const doorRects   = (getCamada("door_and_windows")?.geojson.features ?? []).map(polyToRect);
  const wallFeature   = getCamada("walls")?.geojson.features[0];
  const wallEdges     = (wallFeature?.geometry.coordinates ?? []).map(([p1, p2]) => ({
    x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
  }));
  const personPoints  = (getCamada("persons")?.geojson.features ?? []).map(f => ({
    x: f.geometry.coordinates[0], y: f.geometry.coordinates[1], label: "Início",
  }));

  // ── Conjunto de tiles navegáveis ─────────────────────────────────────────────
  const navSet = new Set();
  for (const r of [...floorRects, ...doorRects]) {
    const col = Math.floor(r.x1);
    const row = Math.floor(Math.min(r.y1, r.y2) + rows);
    navSet.add(`${col},${row}`);
  }

  // ── Máscara reversa ───────────────────────────────────────────────────────────
  const maskTiles = [];
  if (navSet.size > 0 && cols > 0 && rows > 0) {
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        if (!navSet.has(`${col},${row}`)) {
          maskTiles.push({ x1: col, x2: col + 1, y1: row - rows, y2: row + 1 - rows });
        }
      }
    }
  }

  // ── Extrair posições brutas ───────────────────────────────────────────────────
  const posicoes = [];
  for (const { dadosLog } of sessoesComLog) {
    for (const obj of dadosLog?.objectives ?? []) {
      for (const a of obj.actions ?? []) {
        if (a.position == null) continue;
        posicoes.push({ x: a.position.x, y: a.position.z - rows });
      }
    }
  }

  if (posicoes.length === 0) return aviso("Nenhum dado de movimentação disponível.");

  // Dimensões visuais
  const scale = camadas && cols > 0 ? Math.min((W - 8) / cols, 320 / rows) : 1;
  const W2 = camadas && cols > 0 ? Math.round(cols * scale) : W;
  const H2 = camadas && cols > 0 ? Math.round(rows * scale) : 200;
  const xDomain = camadas && cols > 0 ? [0, cols]  : null;
  const yDomain = camadas && rows > 0 ? [-rows, 0] : null;
  const rDot = Math.max(0.8, Math.min(2.5, 200 / posicoes.length));

  const chart = Plot.plot({
    width: W2, height: H2,
    marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0,
    ...(xDomain ? { x: { domain: xDomain, axis: null } } : { x: { axis: null } }),
    ...(yDomain ? { y: { domain: yDomain, axis: null } } : { y: { axis: null } }),
    style: { background: "transparent", overflow: "visible" },
    marks: [
      ...(floorRects.length ? [Plot.rect(floorRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: "none", stroke: d => d.areaInterna ? "#cccccc" : "#e0e0e0", strokeWidth: 0.5,
      })] : []),
      ...(doorRects.length ? [Plot.rect(doorRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: "#f0f0f0", stroke: "none",
      })] : []),
      Plot.density(posicoes, { x: "x", y: "y", stroke: "steelblue", strokeWidth: 0.75, strokeOpacity: 0.55 }),
      Plot.density(posicoes, { x: "x", y: "y", stroke: "steelblue", thresholds: 4, strokeWidth: 1.75, strokeOpacity: 0.9 }),
      Plot.dot(posicoes, { x: "x", y: "y", fill: "steelblue", fillOpacity: 0.18, r: rDot }),
      ...(maskTiles.length ? [Plot.rect(maskTiles, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2", fill: "var(--theme-background)", stroke: "none",
      })] : []),
      ...(wallEdges.length ? [Plot.link(wallEdges, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        stroke: "#3a3a3a", strokeWidth: Math.max(1, scale * 0.07),
      })] : []),
      ...(personPoints.length ? [
        Plot.dot(personPoints, { x: "x", y: "y", r: 5, fill: "#222", stroke: "#fff", strokeWidth: 1.5 }),
      ] : []),
    ],
  });

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:4px;";

  const nota = document.createElement("div");
  nota.style.cssText = "font-size:.58rem;color:var(--theme-foreground-muted);text-align:center;";
  nota.textContent = `${sessoesComLog.length} sessão(ões) · ${posicoes.length} posições registadas`;

  if (personPoints.length) {
    const legInic = document.createElement("div");
    legInic.style.cssText = "display:flex;align-items:center;justify-content:center;gap:5px;font-size:.6rem;color:var(--theme-foreground-muted);";
    const dotEl = document.createElement("div");
    dotEl.style.cssText = "width:8px;height:8px;border-radius:50%;background:#222;border:1.5px solid #fff;box-shadow:0 0 0 1px #222;flex-shrink:0;";
    const lblEl = document.createElement("span");
    lblEl.textContent = "Ponto Inicial";
    legInic.append(dotEl, lblEl);
    wrap.append(chart, legInic, nota);
  } else {
    wrap.append(chart, nota);
  }
  return wrap;
}

// ── Tráfego (colisões por sessão) ─────────────────────────────────────────────
/**
 * Barras verticais: total de colisões por sessão.
 */
export function graficoTrafego(sessoesComLog, Plot) {
  const dados = sessoesComLog.map(({ sessao, dadosLog }) => {
    let n = 0;
    for (const obj of dadosLog?.objectives ?? []) n += (obj.collisions ?? []).length;
    return { lbl: label(sessao), n };
  });

  if (dados.every(d => d.n === 0)) return aviso("Nenhuma colisão registada nessas sessões.");

  const labels = dados.map(d => d.lbl);

  return Plot.plot({
    width: W,
    height: 180,
    marginLeft: 44, marginRight: 8, marginTop: 8,
    marginBottom: labels.length > 5 ? 56 : 36,
    x: { label: null, domain: labels, tickRotate: labels.length > 5 ? -40 : 0 },
    y: { label: "↑ Colisões", grid: true, ticks: 4, labelAnchor: "center", labelArrow: "none" },
    marks: [
      Plot.barY(dados, { x: "lbl", y: "n", fill: "#e07b54", tip: true }),
      Plot.ruleY([0]),
    ],
  });
}

// ── Giros por sessão e tipo ───────────────────────────────────────────────────
/**
 * Barras empilhadas: eixo X = sessão, cor = tipo de giro (grau + direção).
 * Ordem das fatias: 90°←, 90°→, 180°←, 180°→, 270°←, 270°→, 360°←, 360°→
 */
export function graficoGiros(sessoesComLog, Plot) {
  const TIPOS_GIRO = [
    { tipo: "90° ←",  graus: "90",  dir: 0, cor: "#aec7e8" },
    { tipo: "90° →",  graus: "90",  dir: 4, cor: "#1f77b4" },
    { tipo: "180° ←", graus: "180", dir: 0, cor: "#ffbb78" },
    { tipo: "180° →", graus: "180", dir: 4, cor: "#ff7f0e" },
    { tipo: "270° ←", graus: "270", dir: 0, cor: "#98df8a" },
    { tipo: "270° →", graus: "270", dir: 4, cor: "#2ca02c" },
    { tipo: "360° ←", graus: "360", dir: 0, cor: "#c5b0d5" },
    { tipo: "360° →", graus: "360", dir: 4, cor: "#9467bd" },
  ];

  const dados = [];
  for (const { sessao, dadosLog } of sessoesComLog) {
    const lbl = label(sessao);
    const contagem = new Map(TIPOS_GIRO.map(t => [t.tipo, 0]));
    for (const g of detectarGiros(dadosLog)) {
      const key = `${g.graus}° ${g.direcao === 0 ? "←" : "→"}`;
      if (contagem.has(key)) contagem.set(key, contagem.get(key) + 1);
    }
    for (const { tipo } of TIPOS_GIRO) dados.push({ lbl, tipo, n: contagem.get(tipo) });
  }

  if (dados.every(d => d.n === 0)) return aviso("Nenhum giro detectado nessas sessões.");

  const labels      = [...new Set(dados.map(d => d.lbl))];
  const tiposDom    = TIPOS_GIRO.map(t => t.tipo);
  const cores       = TIPOS_GIRO.map(t => t.cor);
  const corParaTipo = new Map(TIPOS_GIRO.map(t => [t.cor.toLowerCase(), t.tipo]));

  let tipoDestaque = null;

  const container = document.createElement("div");
  container.style.cssText = "display:flex;flex-direction:column;gap:6px;";

  function render() {
    container.innerHTML = "";

    const chart = Plot.plot({
      width: W,
      height: 416,
      marginLeft: 28, marginRight: 8, marginTop: 8,
      marginBottom: labels.length > 5 ? 56 : 36,
      x: { label: null, domain: labels, tickRotate: labels.length > 5 ? -40 : 0 },
      y: { label: "↑ Giros", grid: true, ticks: 4, labelAnchor: "center", labelArrow: "none" },
      color: { domain: tiposDom, range: cores },
      marks: [
        Plot.barY(dados, {
          x: "lbl", y: "n", fill: "tipo",
          fillOpacity: d => tipoDestaque === null || d.tipo === tipoDestaque ? 1 : 0.1,
          order: tiposDom,
          tip: true,
          title: d => `${d.tipo}: ${d.n}`,
        }),
        Plot.ruleY([0]),
      ],
    });

    chart.style.cursor = "pointer";
    chart.addEventListener("click", e => {
      const rect = e.target.closest("rect");
      if (!rect) { tipoDestaque = null; render(); return; }
      const fill = (rect.getAttribute("fill") || "").toLowerCase();
      const tipo = corParaTipo.get(fill);
      tipoDestaque = tipo && tipoDestaque !== tipo ? tipo : null;
      render();
    });

    // Legenda em grid 2 colunas — reflete o destaque atual
    const leg = document.createElement("div");
    leg.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:2px 8px;user-select:none;";
    for (const { tipo, cor } of TIPOS_GIRO) {
      const isDestaque = tipoDestaque === tipo;
      const apagado    = tipoDestaque !== null && !isDestaque;
      const item = document.createElement("div");
      item.style.cssText = `display:flex;align-items:center;gap:4px;font-size:.6rem;cursor:pointer;
        opacity:${apagado ? 0.3 : 1};transition:opacity .15s;`;
      const sq = document.createElement("span");
      sq.style.cssText = `width:10px;height:10px;background:${cor};border-radius:2px;flex-shrink:0;`;
      const txt = document.createElement("span");
      txt.style.cssText = `color:var(--theme-foreground-muted);font-weight:${isDestaque ? 700 : 400};`;
      txt.textContent = tipo;
      item.append(sq, txt);
      item.addEventListener("click", () => {
        tipoDestaque = tipoDestaque === tipo ? null : tipo;
        render();
      });
      leg.append(item);
    }

    container.append(chart, leg);
  }

  render();
  return container;
}

// ── Giros Treemap ─────────────────────────────────────────────────────────────
/**
 * Versão Treemap do gráfico de Giros.
 * Agrupa por graus (90°/180°/270°/360°) e divide por direção (←/→).
 * Layout: colunas proporcionais ao total do grupo, linhas proporcionais à direção.
 */
export function graficoGirosTreemap(sessoesComLog) {
  const GRUPOS = [
    { graus: "90",  label: "90°",  corBorda: "#1f77b4",
      dirs: [
        { tipo: "90° ←",  label: "90° Esquerda",  cor: "#aec7e8" },
        { tipo: "90° →",  label: "90° Direita",   cor: "#1f77b4" },
      ]},
    { graus: "180", label: "180°", corBorda: "#ff7f0e",
      dirs: [
        { tipo: "180° ←", label: "180° Esquerda", cor: "#ffbb78" },
        { tipo: "180° →", label: "180° Direita",  cor: "#ff7f0e" },
      ]},
    { graus: "270", label: "270°", corBorda: "#2ca02c",
      dirs: [
        { tipo: "270° ←", label: "270° Esquerda", cor: "#98df8a" },
        { tipo: "270° →", label: "270° Direita",  cor: "#2ca02c" },
      ]},
    { graus: "360", label: "360°", corBorda: "#9467bd",
      dirs: [
        { tipo: "360° ←", label: "360° Esquerda", cor: "#c5b0d5" },
        { tipo: "360° →", label: "360° Direita",  cor: "#9467bd" },
      ]},
  ];

  // Agregar contagens de todas as sessões
  const contagem = new Map(GRUPOS.flatMap(g => g.dirs).map(d => [d.tipo, 0]));
  for (const { dadosLog } of sessoesComLog) {
    for (const g of detectarGiros(dadosLog)) {
      const key = `${g.graus}° ${g.direcao === 0 ? "←" : "→"}`;
      if (contagem.has(key)) contagem.set(key, contagem.get(key) + 1);
    }
  }

  const total = [...contagem.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return aviso("Nenhum giro detectado nessas sessões.");

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:row;width:100%;height:416px;gap:3px;";

  for (const grupo of GRUPOS) {
    const groupTotal = grupo.dirs.reduce((s, d) => s + (contagem.get(d.tipo) ?? 0), 0);
    if (groupTotal === 0) continue;

    const groupPct = groupTotal / total;

    // Container do grupo (borda colorida + label)
    const groupDiv = document.createElement("div");
    groupDiv.style.cssText = `flex:${groupPct} 1 0;display:flex;flex-direction:column;border:2px solid ${grupo.corBorda};border-radius:4px;overflow:hidden;min-width:0;`;

    // Label do grupo
    const lbl = document.createElement("div");
    lbl.style.cssText = `font-size:.7rem;font-weight:700;color:white;background:${grupo.corBorda};padding:3px 6px;flex-shrink:0;`;
    lbl.textContent = grupo.label;
    groupDiv.append(lbl);

    // Tiles de direção empilhados verticalmente
    const tilesDiv = document.createElement("div");
    tilesDiv.style.cssText = "display:flex;flex-direction:column;flex:1;gap:1px;";

    for (const d of grupo.dirs) {
      const cnt = contagem.get(d.tipo) ?? 0;
      if (cnt === 0) continue;
      const dirPct = cnt / groupTotal;
      const pctTotal = (cnt / total * 100).toFixed(1);

      const tile = document.createElement("div");
      tile.style.cssText = `flex:${dirPct} 1 0;background:${d.cor};display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:5px 7px;overflow:hidden;box-sizing:border-box;min-height:18px;`;
      tile.title = `${d.label}: ${cnt} (${pctTotal}%)`;

      const tNome = document.createElement("span");
      tNome.style.cssText = "font-size:.68rem;font-weight:700;color:rgba(0,0,0,.8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;";
      tNome.textContent = d.label;

      const tVal = document.createElement("span");
      tVal.style.cssText = "font-size:.63rem;color:rgba(0,0,0,.65);";
      tVal.textContent = `${cnt}  ·  ${pctTotal}%`;

      tile.append(tNome, tVal);
      tilesDiv.append(tile);
    }

    groupDiv.append(tilesDiv);
    wrap.append(groupDiv);
  }

  return wrap;
}

// ── Comparação ────────────────────────────────────────────────────────────────
/**
 * Três gráficos independentes (Precisão, Objetivos, Fluidez), um por linha.
 * Cada um: linha + pontos por sessão + ruleY de média tracejado.
 * Sessão atual: ponto preenchido e maior.
 */
export function graficoComparacao(sessoesDoMapaComMetricas, idLogAtual, Plot) {
  const comMetricas = sessoesDoMapaComMetricas
    .filter(s => s.metricas)
    .sort((a, b) => a.sessao.id_log - b.sessao.id_log);

  if (!comMetricas.length) return aviso("Métricas insuficientes para comparação.");

  const METRICAS = ["Precisão", "Objetivos", "Fluidez"];
  const CHAVES   = ["precisao", "objetivos", "fluidez"];
  const CORES    = ["#4a90e2", "#5ba85b", "#e07b54"];

  const lblsDomain = comMetricas.map(s => `#${s.sessao.id_log}`);
  const mbottom    = lblsDomain.length > 6 ? 52 : 30;

  const yLabel = document.createElement("div");
  yLabel.style.cssText = "display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;transform:rotate(180deg);font-size:.65rem;color:var(--theme-foreground-muted);padding:0 2px;flex-shrink:0;";
  yLabel.textContent = "%";

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:12px;flex:1;";

  METRICAS.forEach((metrica, mi) => {
    const cor   = CORES[mi];
    const chave = CHAVES[mi];

    const rows = comMetricas.map(s => ({
      lbl:   `#${s.sessao.id_log}`,
      valor: s.metricas[chave] ?? 0,
      atual: s.sessao.id_log === idLogAtual,
    }));

    const media = rows.reduce((s, r) => s + r.valor, 0) / rows.length;

    // Título da sub-seção
    const titulo = document.createElement("div");
    titulo.style.cssText = `font-size:.7rem;font-weight:700;color:${cor};margin-bottom:-8px;`;
    titulo.textContent = metrica;

    const chart = Plot.plot({
      width: W, height: 110,
      marginLeft: 32, marginRight: 8, marginTop: 8, marginBottom: mbottom,
      x: {
        label: null,
        domain: lblsDomain,
        tickRotate: lblsDomain.length > 6 ? -40 : 0,
        // só mostrar ticks no último gráfico
        axis: mi === METRICAS.length - 1 ? "bottom" : null,
      },
      y: { label: null, domain: [0, 100], grid: true, ticks: 3 },
      marks: [
        Plot.line(rows, {
          x: "lbl", y: "valor",
          stroke: cor, strokeWidth: 2,
          tip: true,
          title: d => `${metrica} ${d.lbl}: ${d.valor.toFixed(1)}%`,
        }),
        Plot.dot(rows, {
          x: "lbl", y: "valor",
          fill:        d => d.atual ? cor : "white",
          stroke:      cor,
          strokeWidth: 1.5,
          r:           d => d.atual ? 5 : 3,
        }),
        Plot.ruleY([media], {
          stroke: cor, strokeWidth: 1.2,
          strokeDasharray: "4,3", strokeOpacity: 0.8,
          title: () => `Média: ${media.toFixed(1)}%`,
        }),
      ],
    });

    wrap.append(titulo, chart);
  });

  const nota = document.createElement("div");
  nota.style.cssText = "font-size:.58rem;color:var(--theme-foreground-muted);text-align:center;margin-top:-4px;";
  nota.textContent = `● preenchido = #${idLogAtual} (sessão atual) · tracejado = média`;
  wrap.append(nota);

  const outer = document.createElement("div");
  outer.style.cssText = "display:flex;align-items:stretch;gap:4px;min-height:416px;";
  outer.append(yLabel, wrap);

  return outer;
}

// ── Helpers BFS para Eficiência da Rota ──────────────────────────────────────

/**
 * Constrói um grid booleano de tiles bloqueados a partir do mapa parseado.
 * Bloqueia: paredes sólidas (walls sem door/window) + furniture + eletronics + utensils.
 */
function buildBlockedGrid({ cols, rows, layers }) {
  const total = cols * rows;
  const walls = layers["walls"]            ?? [];
  const doors = layers["door_and_windows"] ?? [];
  const blocked = new Array(total).fill(false);

  for (let i = 0; i < total; i++) {
    if (walls[i] !== undefined && walls[i] !== "-1" &&
        (doors[i] === undefined || doors[i] === "-1")) {
      blocked[i] = true;
    }
  }
  for (const layer of ["furniture", "eletronics", "utensils"]) {
    const data = layers[layer] ?? [];
    for (let i = 0; i < total; i++) {
      if (data[i] !== undefined && data[i] !== "-1") blocked[i] = true;
    }
  }
  return blocked;
}

/**
 * Desloca um ponto para o tile livre mais próximo (BFS de expansão).
 * Necessário quando coordenadas do log arredondam para um tile bloqueado.
 */
function snapToFree(cols, rows, blocked, pt) {
  const idx = pt.z * cols + pt.x;
  if (idx < 0 || idx >= cols * rows) return pt;
  if (!blocked[idx]) return pt;
  const visited = new Uint8Array(cols * rows);
  visited[idx] = 1;
  const queue = [idx];
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    if (!blocked[curr]) return { x: curr % cols, z: Math.floor(curr / cols) };
    const cx = curr % cols, cz = Math.floor(curr / cols);
    for (const [dx, dz] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = cx + dx, nz = cz + dz;
      if (nx < 0 || nx >= cols || nz < 0 || nz >= rows) continue;
      const ni = nz * cols + nx;
      if (!visited[ni]) { visited[ni] = 1; queue.push(ni); }
    }
  }
  return pt;
}

/**
 * BFS ortogonal — retorna o número mínimo de passos entre dois tiles.
 * Retorna Infinity se o destino for inacessível.
 */
function bfsDistancia(cols, rows, blocked, from, to) {
  const f = blocked ? snapToFree(cols, rows, blocked, from) : from;
  const t = blocked ? snapToFree(cols, rows, blocked, to)   : to;
  const fromIdx = f.z * cols + f.x;
  const toIdx   = t.z * cols + t.x;
  if (fromIdx === toIdx) return 0;
  if (fromIdx < 0 || fromIdx >= cols * rows) return Infinity;
  if (toIdx   < 0 || toIdx   >= cols * rows) return Infinity;

  const dist = new Int32Array(cols * rows).fill(-1);
  dist[fromIdx] = 0;
  const queue = [fromIdx];
  let head = 0;

  while (head < queue.length) {
    const curr = queue[head++];
    if (curr === toIdx) return dist[curr];
    const cx = curr % cols, cz = Math.floor(curr / cols);
    for (const [dx, dz] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = cx + dx, nz = cz + dz;
      if (nx < 0 || nx >= cols || nz < 0 || nz >= rows) continue;
      const ni = nz * cols + nx;
      if (blocked[ni] || dist[ni] !== -1) continue;
      dist[ni] = dist[curr] + 1;
      queue.push(ni);
    }
  }
  return Infinity;
}

/**
 * Extrai o ponto inicial do personagem da camada "persons" do mapa.
 * Retorna null se a camada estiver vazia.
 */
function startPtFromPersonsLayer({ cols, layers }) {
  const persons = layers["persons"] ?? [];
  for (let i = 0; i < persons.length; i++) {
    if (persons[i] !== undefined && persons[i] !== "-1") {
      return { x: i % cols, z: Math.floor(i / cols) };
    }
  }
  return null;
}

// ── Eficiência da Rota ────────────────────────────────────────────────────────
/**
 * Barras agrupadas por sessão: Distância Percorrida vs Menor Caminho.
 *
 * Distância Real  — conta movimentos ortogonais consecutivos no log.
 * Menor Caminho   — BFS (quando mapaRaw disponível) ou Manhattan (fallback).
 *                   Greedy nearest-neighbor entre waypoints de cada objetivo.
 *                   Ponto inicial: camada "persons" do mapa ou primeira ação do log.
 *
 * Unidade: passos (tiles). Cada tile = 1 célula do grid ENA.
 */
export function graficoEficienciaRota(sessoesComLog, Plot, mapaRaw = null) {
  const blocked      = mapaRaw ? buildBlockedGrid(mapaRaw)          : null;
  const mapaStart    = mapaRaw ? startPtFromPersonsLayer(mapaRaw)   : null;
  const { cols = 0, rows = 0 } = mapaRaw ?? {};

  const dados = [];

  for (const { sessao, dadosLog } of sessoesComLog) {
    const lbl = label(sessao);
    const objetivos = dadosLog?.objectives ?? [];

    // ── Distância Real ──
    let real = 0;
    let prevX = null, prevZ = null;
    for (const obj of objetivos) {
      for (const a of obj.actions ?? []) {
        const cx = Math.round(a.position?.x ?? 0);
        const cz = Math.round(a.position?.z ?? 0);
        if (prevX !== null) {
          const dx = Math.abs(cx - prevX);
          const dz = Math.abs(cz - prevZ);
          if ((dx === 1 && dz === 0) || (dx === 0 && dz === 1)) real++;
        }
        prevX = cx; prevZ = cz;
      }
    }

    // ── Menor Caminho (BFS ou Manhattan, greedy nearest-neighbor) ──
    let ideal = 0;
    let startPt = mapaStart ?? null;
    const waypoints = [];

    for (const obj of objetivos) {
      if (!obj.actions?.length) continue;
      const a0 = obj.actions[0];
      const pt = { x: Math.round(a0.position?.x ?? 0), z: Math.round(a0.position?.z ?? 0) };
      if (mapaStart) {
        waypoints.push(pt);         // persons layer define início → todos os objetivos são waypoints
      } else if (!startPt) {
        startPt = pt;               // sem persons layer → primeira ação é o início
      } else {
        waypoints.push(pt);
      }
    }

    if (startPt && waypoints.length) {
      let cur = startPt;
      const rem = [...waypoints];
      while (rem.length) {
        let bestDist = Infinity, bestIdx = 0;
        for (let i = 0; i < rem.length; i++) {
          const d = blocked
            ? bfsDistancia(cols, rows, blocked, cur, rem[i])
            : Math.abs(rem[i].x - cur.x) + Math.abs(rem[i].z - cur.z);
          if (d < bestDist) { bestDist = d; bestIdx = i; }
        }
        if (bestDist === Infinity) break;
        ideal += bestDist;
        cur = rem[bestIdx];
        rem.splice(bestIdx, 1);
      }
    }

    // Fallback para sessão com objetivo único sem persons layer:
    // usa BFS (ou Manhattan) da primeira à última posição registrada no log.
    if (ideal === 0 && startPt) {
      let lastPt = startPt;
      for (const obj of objetivos) {
        const acts = obj.actions ?? [];
        if (acts.length > 0) {
          const a = acts[acts.length - 1];
          lastPt = { x: Math.round(a.position?.x ?? 0), z: Math.round(a.position?.z ?? 0) };
        }
      }
      if (lastPt.x !== startPt.x || lastPt.z !== startPt.z) {
        const d = blocked
          ? bfsDistancia(cols, rows, blocked, startPt, lastPt)
          : Math.abs(lastPt.x - startPt.x) + Math.abs(lastPt.z - startPt.z);
        if (d !== Infinity) ideal = d;
      }
    }

    if (real > 0) {
      dados.push({ lbl, tipo: "Percorrida (Real)", passos: real });
      if (ideal > 0) dados.push({ lbl, tipo: "Menor Caminho", passos: ideal });
    }
  }

  if (!dados.length) return aviso("Sem dados de movimentação disponíveis.");

  const labels  = [...new Set(dados.map(d => d.lbl))];
  const mbottom = labels.length > 6 ? 64 : 40;

  const CORES = { "Percorrida (Real)": "#377eb8", "Menor Caminho": "#4daf4a" };

  const chart = Plot.plot({
    width: W * 2, height: 280,
    marginLeft: 48, marginRight: 12, marginTop: 12, marginBottom: mbottom,
    x: { axis: null },
    fx: {
      label: null,
      padding: 0.15,
      tickRotate: labels.length > 6 ? -40 : 0,
      tickSize: 6,
    },
    y: { label: "↑ Passos (tiles)", grid: true, labelAnchor: "center", labelArrow: "none" },
    color: {
      domain: Object.keys(CORES),
      range:  Object.values(CORES),
    },
    marks: [
      Plot.barY(dados, {
        x: "tipo", y: "passos", fx: "lbl",
        fill: "tipo", tip: true, rx: 2,
        title: d => `${d.tipo}  —  ${d.lbl}\n${d.passos} passos`,
      }),
      Plot.ruleY([0]),
    ],
  });

  // Legenda HTML abaixo do gráfico
  const leg = document.createElement("div");
  leg.style.cssText = `display:flex;gap:1rem;justify-content:center;margin-top:6px;
    padding:4px 12px;background:var(--theme-background-alt);
    border:1px solid var(--theme-foreground-faintest);border-radius:8px;
    width:fit-content;margin-left:auto;margin-right:auto;`;
  for (const [label_, cor] of Object.entries(CORES)) {
    const item = document.createElement("div");
    item.style.cssText = "display:flex;align-items:center;gap:5px;";
    const sq = document.createElement("span");
    sq.style.cssText = `width:12px;height:12px;border-radius:3px;background:${cor};flex-shrink:0;`;
    const txt = document.createElement("span");
    txt.style.cssText = "font-size:.72rem;font-weight:600;color:var(--theme-foreground-muted);white-space:nowrap;";
    txt.textContent = label_;
    item.append(sq, txt);
    leg.append(item);
  }

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:6px;";
  wrap.append(chart, leg);
  return wrap;
}

// ── Evolução Longitudinal ─────────────────────────────────────────────────────
/**
 * Linhas de Colisões e Giros por sessão (ordem cronológica).
 * Sessão atual destacada com ponto maior. Dados calculados do log real.
 * @param {Array<{sessao, dadosLog}>} sessoesComLog
 * @param {number} idLogAtual
 */
export function graficoEvolucaoLongitudinal(sessoesComLog, idLogAtual, Plot) {
  if (!sessoesComLog.length) return aviso("Nenhuma sessão disponível.");

  const lblsDomain = sessoesComLog.map(s => `#${s.sessao.id_log}`);

  const dados = sessoesComLog.flatMap(({ sessao, dadosLog }) => {
    const lbl = `#${sessao.id_log}`;
    let colisoes = 0;
    for (const obj of dadosLog?.objectives ?? []) colisoes += (obj.collisions ?? []).length;
    const giros = detectarGiros(dadosLog).length;
    return [
      { lbl, metrica: "Colisões c/ Obstáculos", valor: colisoes, atual: sessao.id_log === idLogAtual },
      { lbl, metrica: "Giros de Desorientação",  valor: giros,    atual: sessao.id_log === idLogAtual },
    ];
  });

  const mbottom = lblsDomain.length > 6 ? 52 : 36;

  return Plot.plot({
    width: W * 2, height: 300,
    marginLeft: 40, marginRight: 8, marginTop: 12, marginBottom: mbottom,
    x: {
      label: "Sessões de Treino",
      domain: lblsDomain,
      tickRotate: lblsDomain.length > 6 ? -40 : 0,
    },
    y: { label: "↑ Quantidade de Ocorrências", grid: true, labelAnchor: "center", labelArrow: "none" },
    color: {
      domain: ["Colisões c/ Obstáculos", "Giros de Desorientação"],
      range:  ["#e41a1c", "#ff7f00"],
      legend: true,
    },
    marks: [
      Plot.line(dados, {
        x: "lbl", y: "valor", stroke: "metrica",
        strokeWidth: 3, curve: "monotone-x",
        tip: true,
        title: d => `${d.metrica}\n${d.lbl}: ${d.valor}`,
      }),
      Plot.dot(dados, {
        x: "lbl", y: "valor", fill: "metrica",
        r: d => d.atual ? 7 : 5,
        stroke: "white", strokeWidth: d => d.atual ? 2 : 0,
      }),
    ],
  });
}
