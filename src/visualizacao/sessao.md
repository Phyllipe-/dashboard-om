---
title: Detalhe da Sessão
toc: false
---

<style>
  .sessao-layout { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; align-items:start; margin-top:1rem; }
  @media(max-width:900px) { .sessao-layout { grid-template-columns:1fr 1fr; } }
  @media(max-width:600px) { .sessao-layout { grid-template-columns:1fr; } }
  .col-imagens { display:flex; flex-direction:column; gap:1rem; }

  .painel { background:var(--theme-background); border:1px solid var(--theme-foreground-faintest); border-radius:12px; overflow:hidden; }
  .painel-titulo { font-size:.78rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; background:#2E9B96; color:#201E1C; padding:.65rem 1rem; border-bottom:1px solid var(--theme-foreground-faintest); }
  .painel-corpo { padding:1rem; }

  .stat-row { display:grid; grid-template-columns:repeat(auto-fill, minmax(130px,1fr)); gap:.75rem; margin-bottom:1rem; }
  .stat-box { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.6rem .9rem; }
  .stat-val { font-size:1.5rem; font-weight:800; line-height:1.1; }
  .stat-lbl { font-size:.72rem; color:var(--theme-foreground-muted); margin-top:.1rem; }

  .badge { display:inline-block; font-size:.78rem; font-weight:700; padding:.2rem .6rem; border-radius:5px; }
  .badge-ok { background:var(--om-ok-bg); color:var(--om-ok-text); }
  .badge-no { background:var(--om-bad-bg); color:var(--om-bad-text); }

  .img-wrap { border-radius:8px; overflow:hidden; border:1px solid var(--theme-foreground-faintest); background:var(--theme-background-alt); display:flex; align-items:center; justify-content:center; min-height:180px; }
  .img-wrap img { width:100%; height:auto; display:block; }
  .img-placeholder { color:var(--theme-foreground-muted); font-size:.85rem; font-style:italic; padding:2rem; text-align:center; }

  .page-header { display:flex; align-items:center; gap:.75rem; margin-bottom:1.25rem; flex-wrap:wrap; }
  .btn-back { font-size:.82rem; padding:.3rem .75rem; border-radius:6px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); text-decoration:none; }
  .btn-back:hover { background:var(--theme-background-alt); }

  .session-nav { display:flex; align-items:center; justify-content:space-between; margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--theme-foreground-faintest); }
  .nav-btn { padding:.35rem .85rem; border-radius:6px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.85rem; text-decoration:none; }
  .nav-btn:hover { background:var(--theme-background-alt); }
  .nav-btn-disabled { padding:.35rem .85rem; border-radius:6px; border:1px solid var(--theme-foreground-faintest); color:var(--theme-foreground-faint); font-size:.85rem; }
  .nav-center { font-size:.82rem; color:var(--theme-foreground-muted); }

  .info-table { width:100%; border-collapse:collapse; font-size:.88rem; }
  .info-table td { padding:.45rem 0; border-bottom:1px solid var(--theme-foreground-faintest); }
  .info-table tr:last-child td { border-bottom:none; }
  .info-table .lbl { color:var(--theme-foreground-muted); width:50%; }
  .info-table .val { font-weight:600; text-align:right; }

  .info-group { border:1px solid var(--theme-foreground-faintest); border-radius:8px; overflow:hidden; margin:.75rem 0; }
  .info-group-header { background:var(--theme-background-alt); padding:.28rem .75rem; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--theme-foreground-muted); }
  .info-group-row { display:flex; justify-content:space-between; align-items:center; padding:.32rem .75rem; font-size:.85rem; border-top:1px solid var(--theme-foreground-faintest); gap:.5rem; }
  .info-group-lbl { color:var(--theme-foreground-muted); flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .info-group-val { font-weight:600; flex-shrink:0; }
  .info-group-empty { padding:.32rem .75rem; font-size:.84rem; color:var(--theme-foreground-faint); font-style:italic; border-top:1px solid var(--theme-foreground-faintest); }

  .info-divider { border:none; border-top:1px solid var(--theme-foreground-faintest); margin:.75rem 0 .5rem; }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchSessao, fetchMetricas, fetchSessoes } from "../api.js";
import { attachMetricaTip } from "../metricas.js";

requireAuth();
const headerLogout = document.getElementById("header-logout");
if (headerLogout) headerLogout.addEventListener("click", logout);

const params   = new URLSearchParams(location.search);
const id_log   = parseInt(params.get("id"));
const id_aluno = params.get("aluno");

const API_BASE = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "http://127.0.0.1:5000/api"
  : "https://api.omaproject.com.br/api";

if (!id_log) {
  display(html`<p style="color:#b91c1c">ID de sessão não informado.</p>`);
  throw new Error("sem id");
}

let sessao, metricas, todasSessoes = [];
try {
  [sessao, metricas] = await Promise.all([
    fetchSessao(id_log),
    fetchMetricas(id_log).catch(() => null),
  ]);
  if (id_aluno) {
    ({ sessoes: todasSessoes } = await fetchSessoes(parseInt(id_aluno)).catch(() => ({ sessoes: [] })));
  }
} catch(e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px">Erro: ${e.message}</div>`);
  throw e;
}

// Navegação entre sessões (ordenadas desc — mesma ordem da lista)
const idxAtual       = todasSessoes.findIndex(s => s.id_log === id_log);
const sessaoAnterior = todasSessoes[idxAtual + 1] ?? null; // mais antiga
const sessaoProxima  = todasSessoes[idxAtual - 1] ?? null; // mais recente

function navBtn(sessao, rotulo) {
  if (!sessao) {
    const s = document.createElement("span"); s.className = "nav-btn-disabled"; s.textContent = rotulo; return s;
  }
  const a = document.createElement("a");
  a.className = "nav-btn";
  a.href = `/visualizacao/sessao?id=${sessao.id_log}&aluno=${id_aluno}`;
  a.textContent = rotulo;
  return a;
}

function fmtTempo(s) {
  if (s == null) return "—";
  const m = Math.floor(s / 60), seg = Math.round(s % 60);
  return m > 0 ? `${m}m ${seg}s` : `${seg}s`;
}

const cleared  = sessao.cleared_map;
const voltar   = id_aluno ? `/visualizacao/sessoes?aluno=${id_aluno}` : `/visualizacao/alunos`;
const token    = sessionStorage.getItem("om_token");
const m        = metricas?.metricas ?? null;

// ── Badge resultado ───────────────────────────────────────────────────────
const badge = document.createElement("span");
badge.className = `badge ${cleared ? "badge-ok" : "badge-no"}`;
badge.textContent = cleared ? "Mapa concluído" : "Não concluído";

// ── Stats gerais ──────────────────────────────────────────────────────────
function makeStatBox(val, label, color) {
  const box = document.createElement("div"); box.className = "stat-box";
  const v = document.createElement("div"); v.className = "stat-val"; v.textContent = val;
  if (color) v.style.color = color;
  const l = document.createElement("div"); l.className = "stat-lbl"; l.textContent = label;
  attachMetricaTip(l, label);
  box.append(v, l); return box;
}
const statRow = document.createElement("div"); statRow.className = "stat-row";
statRow.append(
  makeStatBox(fmtTempo(sessao.tempo_sessao), "Tempo de sessão"),
  makeStatBox(sessao.total_acoes ?? "—", "Ações"),
  makeStatBox(sessao.total_colisoes ?? "—", "Colisões", sessao.total_colisoes > 0 ? "#b91c1c" : null),
  makeStatBox(`${sessao.objetivos_concluidos ?? "—"}/${sessao.total_objetivos ?? "—"}`, "Objetivos"),
);

// ── Radar ─────────────────────────────────────────────────────────────────
function makeRadar(m) {
  const avg = (m.precisao + m.objetivos + m.fluidez) / 3;
  const cor = avg >= 60
    ? { stroke:"#2e7d32", fill:"rgba(46,125,50,.18)" }
    : avg >= 35
    ? { stroke:"#e6a817", fill:"rgba(230,168,23,.18)" }
    : { stroke:"#c0392b", fill:"rgba(192,57,43,.15)" };

  const cx = 130, cy = 130, R = 80;
  const eixos = [
    { angulo:-90, label:"Precisão",  valor:m.precisao  },
    { angulo: 30, label:"Objetivos", valor:m.objetivos },
    { angulo:150, label:"Fluidez",   valor:m.fluidez   },
  ];
  function pt(r, deg) {
    const rad = deg * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }
  let grid = "";
  for (const pct of [.25,.5,.75,1]) {
    const pts = eixos.map(e => pt(R*pct, e.angulo)).map(([x,y]) => `${x},${y}`).join(" ");
    grid += `<polygon points="${pts}" fill="none" stroke="rgba(128,128,128,.25)" stroke-width="${pct===1?1:.5}"/>`;
  }
  const axes = eixos.map(e => {
    const [x,y] = pt(R, e.angulo);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(128,128,128,.25)" stroke-width=".8"/>`;
  }).join("");
  const dataPts = eixos.map(e => pt(R * e.valor / 100, e.angulo)).map(([x,y]) => `${x},${y}`).join(" ");
  const polygon = `<polygon points="${dataPts}" fill="${cor.fill}" stroke="${cor.stroke}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const OFFSET = 28;
  const labels = eixos.map(e => {
    const [lx,ly] = pt(R + OFFSET, e.angulo);
    const [dx,dy] = pt(R * e.valor / 100, e.angulo);
    const anchor  = lx < cx - 5 ? "end" : lx > cx + 5 ? "start" : "middle";
    return `<circle cx="${dx}" cy="${dy}" r="4" fill="${cor.stroke}"/>
      <text class="metrica" x="${lx}" y="${ly-7}" font-size="11" font-weight="600" style="fill:var(--theme-foreground);cursor:help" text-anchor="${anchor}" font-family="system-ui,sans-serif">${e.label}</text>
      <text x="${lx}" y="${ly+9}" font-size="13" font-weight="700" fill="${cor.stroke}" text-anchor="${anchor}" font-family="system-ui,sans-serif">${Math.round(e.valor)}%</text>`;
  }).join("");

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "-20 -20 300 300");
  svg.style.cssText = "width:100%;max-width:260px";
  svg.innerHTML = grid + axes + polygon + labels;
  return svg;
}

const painelRadar = document.createElement("div"); painelRadar.className = "painel";
const painelRadarTitulo = document.createElement("div"); painelRadarTitulo.className = "painel-titulo"; painelRadarTitulo.textContent = "Desempenho — Radar";
const painelRadarCorpo = document.createElement("div"); painelRadarCorpo.className = "painel-corpo"; painelRadarCorpo.style.cssText = "display:flex;justify-content:center;padding:1.5rem 1rem";
if (m) {
  painelRadarCorpo.append(makeRadar(m));
  painelRadarCorpo.querySelectorAll("text.metrica").forEach(t => attachMetricaTip(t, t.textContent));
} else {
  painelRadarCorpo.innerHTML = `<p style="color:var(--theme-foreground-muted);font-style:italic;font-size:.85rem;margin:0">Métricas indisponíveis para esta sessão</p>`;
}
painelRadar.append(painelRadarTitulo, painelRadarCorpo);

// ── Legenda (minimap / preview 3D) ────────────────────────────────────────
const LEG = {
  trajetoria: ["width:32px;background:linear-gradient(90deg,#f0f 0 16.6%,#00f 16.6% 33.3%,#0ff 33.3% 50%,#0f0 50% 66.6%,#ff0 66.6% 83.3%,#f70 83.3%);", "Trajetória do aluno — cada trecho em uma cor"],
  objetivos:  ["background:#12b33c;", "Objetivos / metas"],
  inicioFim:  ["background:#fff;border:1px solid var(--theme-foreground-faint);", "Início / Fim"],
};
function makeLegenda(itens) {
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-wrap:wrap;gap:.55rem 1.1rem;padding:.6rem 1rem;font-size:.72rem;color:var(--theme-foreground-muted);border-top:1px solid var(--theme-foreground-faintest);";
  for (const [css, label] of itens) {
    const it = document.createElement("span");
    it.style.cssText = "display:inline-flex;align-items:center;gap:.4rem;";
    const sw = document.createElement("span");
    sw.style.cssText = "width:14px;height:14px;border-radius:3px;flex:none;" + css;
    const lb = document.createElement("span"); lb.textContent = label;
    it.append(sw, lb);
    wrap.append(it);
  }
  return wrap;
}

// ── Minimap ───────────────────────────────────────────────────────────────
const painelMini = document.createElement("div"); painelMini.className = "painel";
const painelMiniTitulo = document.createElement("div"); painelMiniTitulo.className = "painel-titulo"; painelMiniTitulo.textContent = "Minimap da sessão";
const painelMiniCorpo = document.createElement("div"); painelMiniCorpo.className = "painel-corpo";
const miniWrap = document.createElement("div"); miniWrap.className = "img-wrap";
if (sessao.tem_minimap && sessao.caminho_minimap) {
  const img = document.createElement("img");
  img.alt = "Minimap";
  img.loading = "lazy";
  img.style.transform = "rotate(180deg)";   // alinha o norte do minimap com o Preview 3D
  fetch(`${API_BASE}/treinos/arquivos${sessao.caminho_minimap}`, { headers: { Authorization: `Bearer ${token}` } })
    .then(r => r.ok ? r.blob() : null)
    .then(blob => { if (blob) img.src = URL.createObjectURL(blob); })
    .catch(() => {});
  miniWrap.append(img);
} else {
  miniWrap.innerHTML = `<div class="img-placeholder">Minimap não disponível</div>`;
}
painelMiniCorpo.append(miniWrap);
painelMiniCorpo.append(makeLegenda([LEG.trajetoria, LEG.objetivos, LEG.inicioFim]));
painelMini.append(painelMiniTitulo, painelMiniCorpo);

// ── Render 3D ─────────────────────────────────────────────────────────────
const painelRender = document.createElement("div"); painelRender.className = "painel";
const painelRenderTitulo = document.createElement("div"); painelRenderTitulo.className = "painel-titulo"; painelRenderTitulo.textContent = "Preview 3D do mapa";
const painelRenderCorpo = document.createElement("div"); painelRenderCorpo.className = "painel-corpo";
const renderWrap = document.createElement("div"); renderWrap.className = "img-wrap";
if (sessao.render_3d) {
  const img = document.createElement("img");
  img.alt = "Render 3D";
  img.loading = "lazy";
  // Cache-bust com timestamp para evitar cache do navegador retornar sempre a mesma imagem
  fetch(`${API_BASE}/treinos/mapas/${sessao.id_mapa}/render3d?t=${Date.now()}`, { headers: { Authorization: `Bearer ${token}` } })
    .then(r => r.ok ? r.blob() : null)
    .then(blob => { if (blob) img.src = URL.createObjectURL(blob); })
    .catch(() => {});
  renderWrap.append(img);
} else {
  renderWrap.innerHTML = `<div class="img-placeholder">Render 3D não disponível</div>`;
}
painelRenderCorpo.append(renderWrap);
painelRenderCorpo.append(makeLegenda([LEG.objetivos]));
painelRender.append(painelRenderTitulo, painelRenderCorpo);

// ── Informações gerais ────────────────────────────────────────────────────
const painelInfo = document.createElement("div"); painelInfo.className = "painel";
const painelInfoTitulo = document.createElement("div"); painelInfoTitulo.className = "painel-titulo"; painelInfoTitulo.textContent = "Informações gerais";
const painelInfoCorpo = document.createElement("div"); painelInfoCorpo.className = "painel-corpo";

function infoRow(label, value, color) {
  const tr  = document.createElement("tr");
  const tdL = document.createElement("td"); tdL.className = "lbl"; tdL.textContent = label;
  attachMetricaTip(tdL, label);
  const tdV = document.createElement("td"); tdV.className = "val";
  if (value instanceof Element) tdV.append(value);
  else tdV.textContent = value ?? "—";
  if (color) tdV.style.color = color;
  tr.append(tdL, tdV);
  return tr;
}

function makeInfoGroup(title, rows) {
  // rows: [{ label, value (string | Element), color? }]
  const wrap = document.createElement("div"); wrap.className = "info-group";
  const hdr  = document.createElement("div"); hdr.className = "info-group-header"; hdr.textContent = title;
  wrap.append(hdr);
  if (rows.length === 0) {
    const empty = document.createElement("div"); empty.className = "info-group-empty"; empty.textContent = "Nenhuma";
    wrap.append(empty);
  } else {
    for (const row of rows) {
      const r   = document.createElement("div"); r.className = "info-group-row";
      const lbl = document.createElement("span"); lbl.className = "info-group-lbl"; lbl.textContent = row.label;
      const val = document.createElement("span"); val.className = "info-group-val";
      if (row.color) val.style.color = row.color;
      if (row.value instanceof Element) val.append(row.value);
      else val.textContent = row.value ?? "—";
      r.append(lbl, val);
      wrap.append(r);
    }
  }
  return wrap;
}

function makeBadgeSmall(ok) {
  const s = document.createElement("span");
  s.className = `badge ${ok ? "badge-ok" : "badge-no"}`;
  s.style.fontSize = ".7rem";
  s.textContent = ok ? "Concluído" : "Não concluído";
  return s;
}

// Agrega dados do log
const ACAO_NOME = { 0: "Passos", 1: "Giros" };

// Tradução dos objetos de colisão (objectID = Prop.ID do ENA, inglês PascalCase).
const OBJ_NOME = {
  AlarmClock:"Despertador", Armchair:"Poltrona", AttentionMarkerFloor:"Piso de alerta",
  BedTable:"Mesa de cabeceira", Bird:"Pássaro", Blender:"Liquidificador",
  BrickWall:"Parede de tijolo", Bureau:"Escrivaninha", CarpetFloor:"Piso de carpete",
  Cat:"Gato", Cellphone:"Celular", CementFloor:"Piso de cimento", CeramicFloor:"Piso de cerâmica",
  ClosedDoor:"Porta fechada", CobblestoneFloor:"Piso de paralelepípedo", Computer:"Computador",
  Cone:"Cone", CopyMachine:"Copiadora", CouplesBed:"Cama de casal", DiningTable:"Mesa de jantar",
  DirectionMarkerFloor:"Piso direcional", Dog:"Cachorro", Fan:"Ventilador", FoodMixer:"Batedeira",
  Fridge:"Geladeira", Frog:"Sapo", GenericWall:"Parede", Glass:"Vidro", GlassFloor:"Piso de vidro",
  GlassWindow:"Janela de vidro", GrassFloor:"Piso de grama", Guardrail:"Guarda-corpo", Guitar:"Violão",
  HairDryer:"Secador de cabelo", Insect:"Inseto", IronCloset:"Armário de ferro", Kid:"Criança",
  Lamp:"Luminária", LeafFloor:"Piso de folhas", LockedDoor:"Porta trancada", MetalFloor:"Piso de metal",
  Microwave:"Micro-ondas", OpenDoor:"Porta aberta", Painting:"Quadro", PavingStoneFloor:"Piso de pedra",
  Piano:"Piano", Plant:"Planta", PlasterWall:"Parede de gesso", PlasticWall:"Parede de plástico",
  Printer:"Impressora", Radio:"Rádio", SandFloor:"Piso de areia", Shelf:"Estante",
  SinglesBed:"Cama de solteiro", Sink:"Pia", SnowFloor:"Piso de neve", Sofa:"Sofá", Stairs:"Escada",
  StoneFloor:"Piso de pedra", Stove:"Fogão", TV:"TV", Table:"Mesa", TeaKettle:"Chaleira",
  TileWall:"Parede de azulejo", Toilet:"Vaso sanitário", TrashCan:"Lixeira", Wardrobe:"Guarda-roupa",
  WaterFloor:"Água", WoodFloor:"Piso de madeira", WoodenWall:"Parede de madeira", WoodenWindow:"Janela de madeira",
  "No ID":"Outro objeto",
};
const logObjs   = sessao.dados_log?.objectives ?? [];

const acoesMap = {};
for (const obj of logObjs) {
  for (const a of (obj.actions ?? [])) {
    const t = a.actionType ?? "?";
    acoesMap[t] = (acoesMap[t] ?? 0) + 1;
  }
}

const colisMap = {};
for (const obj of logObjs) {
  for (const c of (obj.collisions ?? [])) {
    const id = c.objectID ?? "?";
    colisMap[id] = (colisMap[id] ?? 0) + 1;
  }
}

// ── Tabela topo: Mapa + Data ───────────────────────────────────────────────
const tableTop = document.createElement("table"); tableTop.className = "info-table";
tableTop.append(
  infoRow("Mapa", sessao.nome_mapa),
  infoRow("Data", sessao.data),
);

// ── Cards: Ações, Colisões, Objetivos ─────────────────────────────────────
const acoesRows = Object.entries(acoesMap)
  .sort((a, b) => +a[0] - +b[0])
  .map(([tipo, qt]) => ({ label: ACAO_NOME[tipo] ?? `Tipo ${tipo}`, value: String(qt) }));

const colisRows = Object.entries(colisMap)
  .sort((a, b) => b[1] - a[1])
  .map(([objId, qt]) => ({ label: OBJ_NOME[objId] ?? objId, value: String(qt), color: "#b91c1c" }));

const objRows = logObjs.map(obj => ({
  label: obj.objectiveName ?? "?",
  value: makeBadgeSmall((obj.startTime ?? 0) > 0),
}));

const groupAcoes = makeInfoGroup("Ações", acoesRows);
const groupColis = makeInfoGroup("Colisões", colisRows);
const groupObjs  = makeInfoGroup("Objetivos", objRows);

// ── Tabela base: métricas + resultado ─────────────────────────────────────
const divider = document.createElement("hr"); divider.className = "info-divider";
const tableBot = document.createElement("table"); tableBot.className = "info-table";
if (m) {
  tableBot.append(
    infoRow("Precisão",    `${Math.round(m.precisao)}%`),
    infoRow("Objetivos %", `${Math.round(m.objetivos)}%`),
    infoRow("Fluidez",     `${Math.round(m.fluidez)}%`),
  );
}
const badgeClone = badge.cloneNode(true);
tableBot.append(infoRow("Resultado", badgeClone));

painelInfoCorpo.append(tableTop, groupAcoes, groupColis, groupObjs, divider, tableBot);
painelInfo.append(painelInfoTitulo, painelInfoCorpo);

// ── Layout ────────────────────────────────────────────────────────────────
const colImagens = document.createElement("div"); colImagens.className = "col-imagens";
colImagens.append(painelMini, painelRender);

const layout = document.createElement("div"); layout.className = "sessao-layout";
layout.append(colImagens, painelInfo, painelRadar);

display(html`<div>
  <div class="page-header">
    <h1 style="margin:0;font-size:1.3rem">Sessão #${id_log} — ${sessao.nome_mapa}</h1>
  </div>
  ${statRow}
  ${layout}
  <div class="session-nav">
    ${navBtn(sessaoAnterior, "← Sessão anterior")}
    ${idxAtual >= 0
      ? html`<span class="nav-center">Sessão ${idxAtual + 1} de ${todasSessoes.length}</span>`
      : html`<span></span>`}
    ${navBtn(sessaoProxima, "Sessão seguinte →")}
  </div>
  <div style="margin-top:1rem">
    <a class="btn-back" href="${voltar}">← Voltar</a>
  </div>
</div>`);
```
