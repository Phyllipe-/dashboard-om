---
title: Perfil Geral do Aluno
toc: false
---

<style>
  /* ── Reset de layout da página ────────────────── */
  .observablehq-center { max-width:none !important; }

  /* ── Estrutura principal ──────────────────────── */
  .perfil-layout {
    display:grid;
    grid-template-columns:260px 1fr 380px;
    grid-template-rows:auto;
    gap:1rem;
    min-height:calc(100vh - 80px);
    align-items:start;
  }
  @media(max-width:1100px) {
    .perfil-layout { grid-template-columns:220px 1fr; }
    .col-direita { grid-column:1/-1; }
  }
  @media(max-width:700px) {
    .perfil-layout { grid-template-columns:1fr; }
  }

  /* ── Painel genérico ──────────────────────────── */
  .painel {
    background:var(--theme-background);
    border:1px solid var(--theme-foreground-faintest);
    border-radius:12px;
    overflow:hidden;
  }
  .painel-titulo {
    font-size:.82rem; font-weight:700;
    text-transform:uppercase; letter-spacing:.06em;
    color:var(--theme-foreground-muted);
    padding:.75rem 1rem;
    border-bottom:1px solid var(--theme-foreground-faintest);
  }
  .painel-corpo { padding:1rem; }

  /* ── Sidebar esquerda ─────────────────────────── */
  .col-esquerda { display:flex; flex-direction:column; gap:1rem; position:sticky; top:1rem; }

  .aluno-selector { display:flex; align-items:center; gap:.75rem; }
  .sel-avatar {
    width:40px; height:40px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-weight:800; font-size:.95rem; color:#fff; flex-shrink:0;
  }
  .sel-label { font-size:.75rem; color:var(--theme-foreground-muted); margin-bottom:.2rem; }
  .sel-select {
    width:100%; padding:.4rem .6rem;
    border:1px solid var(--theme-foreground-faint);
    border-radius:6px; background:var(--theme-background);
    color:var(--theme-foreground); font-size:.88rem; outline:none;
  }
  .sel-select:focus { border-color:#4a90e2; }

  /* ── Filtros ──────────────────────────────────── */
  .filtro-titulo {
    font-size:.78rem; font-weight:700; text-transform:uppercase;
    letter-spacing:.05em; color:var(--theme-foreground-muted);
    margin-bottom:.65rem;
  }
  .filtro-check { display:flex; flex-direction:column; gap:.45rem; margin-bottom:1rem; }
  .filtro-check label {
    display:flex; align-items:center; gap:.5rem;
    font-size:.875rem; cursor:pointer; user-select:none;
  }
  .filtro-check input[type=checkbox] { accent-color:#4a90e2; width:14px; height:14px; }
  .filtro-icon { font-size:.75rem; width:18px; text-align:center; }

  .filtro-sessao { display:flex; flex-direction:column; gap:.4rem; margin-bottom:.75rem; }
  .filtro-sessao label { font-size:.8rem; color:var(--theme-foreground-muted); }
  .filtro-sessao select {
    width:100%; padding:.35rem .5rem;
    border:1px solid var(--theme-foreground-faint);
    border-radius:6px; background:var(--theme-background);
    color:var(--theme-foreground); font-size:.85rem; outline:none;
  }
  .filtro-divisor {
    border:none; border-top:1px solid var(--theme-foreground-faintest);
    margin:.75rem 0;
  }
  .filtro-range { display:flex; flex-direction:column; gap:.3rem; margin-bottom:.75rem; }
  .filtro-range label { font-size:.8rem; color:var(--theme-foreground-muted); }
  .filtro-range input[type=range] { width:100%; accent-color:#e6a817; }

  /* ── Stats rápidas na sidebar ─────────────────── */
  .quick-stats { display:grid; grid-template-columns:1fr 1fr; gap:.5rem; }
  .qs-card {
    background:var(--theme-background-alt);
    border:1px solid var(--theme-foreground-faintest);
    border-radius:8px; padding:.5rem .65rem;
  }
  .qs-value { font-size:1.3rem; font-weight:700; }
  .qs-label { font-size:.7rem; color:var(--theme-foreground-muted); }

  /* ── Coluna central ───────────────────────────── */
  .col-centro { display:flex; flex-direction:column; gap:1rem; }

  /* ── Área de placeholder de gráfico ──────────── */
  .chart-placeholder {
    background:var(--theme-background-alt);
    border:2px dashed var(--theme-foreground-faintest);
    border-radius:8px;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    gap:.5rem;
    color:var(--theme-foreground-muted);
    font-size:.85rem; font-style:italic;
    text-align:center; padding:1rem;
  }
  .chart-placeholder .ph-icon { font-size:2rem; opacity:.35; }
  .chart-placeholder .ph-label { font-weight:600; font-style:normal; font-size:.8rem;
    text-transform:uppercase; letter-spacing:.05em; opacity:.5; }

  /* Alturas específicas por gráfico */
  .ph-trafego    { min-height:380px; }
  .ph-heatmap    { min-height:180px; }
  .ph-lateralidade { min-height:260px; }
  .ph-comportamental { min-height:200px; }
  .ph-radar      { min-height:240px; }
  .ph-evolucao   { min-height:180px; }

  /* ── Coluna direita ───────────────────────────── */
  .col-direita { display:flex; flex-direction:column; gap:1rem; }

  /* ── Cobertura de análises ────────────────────── */
  .analise-bar { display:flex; flex-direction:column; gap:.4rem; }
  .analise-row { display:flex; align-items:center; gap:.65rem; font-size:.82rem; }
  .analise-name { width:110px; flex-shrink:0; color:var(--theme-foreground-muted); }
  .bar-track { flex:1; height:6px; background:var(--theme-foreground-faintest); border-radius:3px; overflow:hidden; }
  .bar-fill  { height:100%; border-radius:3px; background:#4a90e2; transition:width .4s; }
  .bar-count { width:36px; text-align:right; font-size:.78rem; color:var(--theme-foreground-muted); }

  /* ── Sessões recentes ─────────────────────────── */
  .session-list { display:flex; flex-direction:column; gap:.3rem; }
  .session-item {
    display:flex; align-items:center; gap:.65rem;
    padding:.4rem .65rem; border-radius:6px;
    border:1px solid var(--theme-foreground-faintest);
    font-size:.82rem; cursor:pointer; transition:background .12s;
  }
  .session-item:hover, .session-item.ativa { background:var(--theme-background-alt); }
  .session-item.ativa { border-color:#4a90e2; }
  .si-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .si-nome { flex:1; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .si-data { color:var(--theme-foreground-muted); font-size:.76rem; flex-shrink:0; }
  .si-link { font-size:.76rem; font-weight:600; color:#4a90e2; text-decoration:none; flex-shrink:0; }
  .si-link:hover { text-decoration:underline; }

  .empty-hint { font-size:.85rem; color:var(--theme-foreground-muted); font-style:italic; padding:.5rem 0; }

  /* ── Legenda de cores ─────────────────────────── */
  .legend-bar {
    display:flex; align-items:center; gap:.5rem;
    font-size:.75rem; color:var(--theme-foreground-muted);
    margin-top:.5rem;
  }
  .legend-gradient {
    flex:1; height:10px; border-radius:4px;
    background:linear-gradient(to right, #dbeafe, #1d4ed8);
  }

  /* ── Mapa de giros ────────────────────────────── */
  .giro-header { display:flex; align-items:center; gap:.4rem; flex-wrap:wrap; margin-bottom:.6rem; }
  .giro-filter-group { display:flex; gap:.25rem; }
  .giro-sep { width:1px; background:var(--theme-foreground-faintest); align-self:stretch; margin:0 .2rem; }
  .giro-btn {
    padding:.22rem .55rem; border-radius:14px;
    border:1px solid var(--theme-foreground-faint);
    background:transparent; color:var(--theme-foreground);
    font-size:.74rem; cursor:pointer; white-space:nowrap;
  }
  .giro-btn.active { background:var(--theme-foreground); color:var(--theme-background); border-color:var(--theme-foreground); }
  .giro-btn.dir-right.active { background:#e07b54; border-color:#e07b54; color:#fff; }
  .giro-btn.dir-left.active  { background:#4a90d9; border-color:#4a90d9; color:#fff; }
  .giro-count { font-size:.76rem; color:var(--theme-foreground-muted); margin-bottom:.4rem; }
  .giro-hint  { font-size:.82rem; color:var(--theme-foreground-muted); font-style:italic; padding:.5rem 0; }

  /* ── Filtro de sessões ────────────────────────── */
  .filtro-sessoes-row { display:flex; flex-direction:column; gap:.5rem; }
  .filtro-sessoes-row label { font-size:.78rem; color:var(--theme-foreground-muted); font-weight:600; }
  .filtro-sessoes-row select {
    width:100%; padding:.35rem .5rem;
    border:1px solid var(--theme-foreground-faint);
    border-radius:6px; background:var(--theme-background);
    color:var(--theme-foreground); font-size:.84rem; outline:none;
  }
  .filtro-sessoes-row select:focus { border-color:#4a90e2; }
  .filtro-concl-btns { display:flex; gap:.35rem; }
  .filtro-concl-btns button {
    flex:1; padding:.28rem .4rem;
    border-radius:16px; border:1px solid var(--theme-foreground-faint);
    background:transparent; color:var(--theme-foreground);
    font-size:.75rem; cursor:pointer; white-space:nowrap;
  }
  .filtro-concl-btns button.active {
    background:var(--theme-foreground); color:var(--theme-background);
    border-color:var(--theme-foreground);
  }
  .filtro-badge {
    font-size:.75rem; font-weight:700; text-align:right;
    color:var(--theme-foreground-muted);
    padding:.2rem 0 0;
  }
  .filtro-badge span { color:#4a90e2; }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAlunos, fetchAluno, fetchSessoes, fetchSessao, fetchAnalises, fetchMetricas } from "../api.js";
import * as Plot from "npm:@observablehq/plot";
import { detectarGiros } from "../lib/sessao/giros.js";
import { contarMovimentos, heatTilesParaRects, corHeatmap, PALETA_HEATMAP } from "../lib/sessao/heatmap.js";
import { extrairSegmentos, extrairColisoes, corSegmento, raioColisao } from "../lib/sessao/colisao.js";
import { extrairLateralidade, corpoSVGElement, COR_DIREITA as LAT_COR_DIR, COR_ESQUERDA as LAT_COR_ESQ } from "../lib/sessao/lateralidade.js";
import { parseMapaXML } from "../lib/mapa/parser.js";
import { mapaParaGeoJSON } from "../lib/mapa/geojson.js";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

// ── Paleta de avatares ────────────────────────────────────────────────────
const AVATAR_COLORS = ["#e07b54","#4a90d9","#5ba85b","#c9a227","#9b59b6","#2eaaa8"];
function avatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }
function initials(nome) {
  const p = nome.trim().split(/\s+/);
  return p.length >= 2 ? (p[0][0] + p[p.length-1][0]).toUpperCase() : p[0].slice(0,2).toUpperCase();
}

// ── Carregar lista de alunos para o selector ──────────────────────────────
let todosAlunos = [];
try {
  ({ alunos: todosAlunos } = await fetchAlunos());
} catch(e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px">Erro ao carregar alunos: ${e.message}</div>`);
}

// ── Aluno inicial — via URL ou primeiro ativo ─────────────────────────────
const params = new URLSearchParams(window.location.search);
const idInicial = params.get("id") ? parseInt(params.get("id"))
  : (todosAlunos.find(a => a.ativo)?.id_aluno ?? todosAlunos[0]?.id_aluno ?? null);

// ── Estado reativo ────────────────────────────────────────────────────────
let estado = {
  idAluno:   idInicial,
  aluno:     null,
  sessoes:   [],
  analises:  [],   // [{ sessao, analises, metricas }]
  sessaoAtiva: null,
  filtros: { inicio: true, colisoes: false, objetivos: false },
  rangeA: 50, rangeB: 80,
  // filtro de sessões
  filtroMapa:    "todas",
  filtroConcl:   "todas",   // "todas" | "concluidas" | "nao_concluidas"
  filtroSessaoId: null,      // null = todas; number = sessão específica
};

// ── Elementos do DOM ──────────────────────────────────────────────────────
const selAvatar   = document.createElement("div");  selAvatar.className = "sel-avatar";
const selSelect   = document.createElement("select"); selSelect.className = "sel-select";

const chkInicio   = html`<input type="checkbox" checked>`;
const chkColisoes = html`<input type="checkbox">`;
const chkObjetivos= html`<input type="checkbox">`;
const chkObjetos  = html`<input type="checkbox" checked>`;  // interactive_elements
const chkMoveis   = html`<input type="checkbox" checked>`;  // furniture/eletronics/utensils

// Re-renderiza os mapas quando qualquer checkbox de camada mudar
[chkObjetos, chkMoveis].forEach(c => c.addEventListener("change", () => {
  if (giroState.camadas) renderizarMapaGiros();
  if (giroState.camadas) renderizarHeatmap();
  if (giroState.camadas) renderizarColisao();
}));

const selSessao1  = document.createElement("select"); selSessao1.className = "filtro-sessao select";
const selSessao2  = document.createElement("select"); selSessao2.className = "filtro-sessao select";
const selSessao3  = document.createElement("select"); selSessao3.className = "filtro-sessao select";

const rangeA = html`<input type="range" min="0" max="100" value="50">`;
const rangeB = html`<input type="range" min="0" max="100" value="80">`;

// Stats rápidas
const qsTotalSessoes  = document.createElement("div"); qsTotalSessoes.className  = "qs-card";
const qsComAnalise    = document.createElement("div"); qsComAnalise.className    = "qs-card";
const qsMapasDistintos = document.createElement("div"); qsMapasDistintos.className = "qs-card";
const qsMediaGeral    = document.createElement("div"); qsMediaGeral.className    = "qs-card";

// ── Filtro de sessões — elementos ─────────────────────────────────────────
const filtroMapaSelect   = document.createElement("select");
const filtroSessaoSelect = document.createElement("select");
const filtroBtnTodas    = document.createElement("button"); filtroBtnTodas.textContent    = "Todas";
const filtroBtnConcl    = document.createElement("button"); filtroBtnConcl.textContent    = "Concluídas";
const filtroBtnNaoConcl = document.createElement("button"); filtroBtnNaoConcl.textContent = "Não concluídas";
const filtroBadge       = document.createElement("div");    filtroBadge.className = "filtro-badge";

filtroBtnTodas.className    = "active";
filtroBtnConcl.className    = "";
filtroBtnNaoConcl.className = "";

function setFiltroConcl(val) {
  estado.filtroConcl    = val;
  estado.filtroSessaoId = null;
  [filtroBtnTodas, filtroBtnConcl, filtroBtnNaoConcl].forEach(b => b.classList.remove("active"));
  (val === "todas" ? filtroBtnTodas : val === "concluidas" ? filtroBtnConcl : filtroBtnNaoConcl).classList.add("active");
  popularFiltroSessaoSelect();
  aplicarFiltroSessoes();
}
filtroBtnTodas.addEventListener("click",    () => setFiltroConcl("todas"));
filtroBtnConcl.addEventListener("click",    () => setFiltroConcl("concluidas"));
filtroBtnNaoConcl.addEventListener("click", () => setFiltroConcl("nao_concluidas"));

filtroMapaSelect.addEventListener("change", () => {
  estado.filtroMapa     = filtroMapaSelect.value;
  estado.filtroSessaoId = null;
  popularFiltroSessaoSelect();
  aplicarFiltroSessoes();
});

filtroSessaoSelect.addEventListener("change", () => {
  const v = filtroSessaoSelect.value;
  estado.filtroSessaoId = v === "" ? null : parseInt(v);
  aplicarFiltroSessoes();
});

/** Retorna o subconjunto de analises que passa pelos filtros ativos. */
function sessoesFiltradas() {
  // Sessão específica selecionada — ignora mapa/conclusão
  if (estado.filtroSessaoId !== null) {
    return estado.analises.filter(a => a.sessao.id_log === estado.filtroSessaoId);
  }
  return estado.analises.filter(({ sessao }) => {
    if (estado.filtroMapa !== "todas" && sessao.nome_mapa !== estado.filtroMapa) return false;
    if (estado.filtroConcl === "concluidas"     && !sessao.cleared_map) return false;
    if (estado.filtroConcl === "nao_concluidas" && sessao.cleared_map)  return false;
    return true;
  });
}

function popularFiltroMapa() {
  const mapas = [...new Set(estado.sessoes.map(s => s.nome_mapa).filter(Boolean))].sort();
  filtroMapaSelect.replaceChildren();
  const optTodas = document.createElement("option"); optTodas.value = "todas"; optTodas.textContent = "Todos os mapas";
  filtroMapaSelect.append(optTodas);
  for (const m of mapas) {
    const op = document.createElement("option"); op.value = m; op.textContent = m;
    filtroMapaSelect.append(op);
  }
  filtroMapaSelect.value = estado.filtroMapa;
}

/** Popula o select de sessão com as sessões que passam pelo filtro atual de mapa/conclusão. */
function popularFiltroSessaoSelect() {
  const pool = estado.analises.filter(({ sessao }) => {
    if (estado.filtroMapa !== "todas" && sessao.nome_mapa !== estado.filtroMapa) return false;
    if (estado.filtroConcl === "concluidas"     && !sessao.cleared_map) return false;
    if (estado.filtroConcl === "nao_concluidas" && sessao.cleared_map)  return false;
    return true;
  });

  filtroSessaoSelect.replaceChildren();
  const optAll = document.createElement("option"); optAll.value = ""; optAll.textContent = "Todas as sessões";
  filtroSessaoSelect.append(optAll);
  for (const { sessao: s } of pool) {
    const op  = document.createElement("option");
    op.value  = s.id_log;
    const data = s.data?.slice(0, 10) ?? "—";
    const concl = s.cleared_map ? "✓" : "✗";
    op.textContent = `#${s.id_log} — ${s.nome_mapa} (${data}) ${concl}`;
    filtroSessaoSelect.append(op);
  }
  filtroSessaoSelect.value = estado.filtroSessaoId ?? "";
}

function aplicarFiltroSessoes() {
  const filtradas = sessoesFiltradas();
  const total = estado.analises.length;
  if (estado.filtroSessaoId !== null) {
    filtroBadge.innerHTML = `Sessão <span>#${estado.filtroSessaoId}</span> selecionada`;
  } else {
    filtroBadge.innerHTML = `<span>${filtradas.length}</span> de ${total} sessões`;
  }
  atualizarStats(filtradas);
  atualizarAnaliseBar(filtradas);
  atualizarSessionList(filtradas);
  renderizarGrafico(filtradas);

  // Mapa de giros — usa a primeira sessão filtrada
  const target = filtradas[0];
  if (target?.sessao?.id_log) {
    carregarMapaGiros(target.sessao.id_log);
  } else {
    giroState.camadas  = null;
    giroState.dadosLog = null;
    renderizarMapaGiros();
    renderizarHeatmap();
    renderizarColisao();
    renderizarLateralidade();
  }
}

// ── Mapa de Giros — estado e elementos ───────────────────────────────────
let giroState = {
  giros:        [],
  objetivos:    [],   // [{ objectiveName, objectiveID, endTime }] da sessão
  dadosLog:     null, // dados_log completo para heatmap
  camadas:      null,
  cols:         0,
  rows:         0,
  filtroGraus:  "todos",
  filtroDirecao: "todos",
};
let giroVersion  = 0;   // cancela fetches antigos

const mapaGirosContainer = document.createElement("div");
const giroHint = document.createElement("div"); giroHint.className = "giro-hint";

// Botões de filtro dentro do painel de giros
function mkGiroBtn(label, extra = "") {
  const b = document.createElement("button");
  b.className = "giro-btn" + (extra ? " " + extra : "");
  b.textContent = label;
  return b;
}
const gBtnTodos   = mkGiroBtn("Todos");   gBtnTodos.classList.add("active");
const gBtnG90     = mkGiroBtn("90°");
const gBtnG180    = mkGiroBtn("180°");
const gBtnG270    = mkGiroBtn("270°");
const gBtnG360    = mkGiroBtn("360°");
const gBtnDirTodos = mkGiroBtn("Ambas");  gBtnDirTodos.classList.add("active");
const gBtnDireita  = mkGiroBtn("Direita →", "dir-right");
const gBtnEsquerda = mkGiroBtn("← Esquerda", "dir-left");

function setGiroFiltroGraus(v) {
  giroState.filtroGraus = v;
  [gBtnTodos, gBtnG90, gBtnG180, gBtnG270, gBtnG360].forEach(b => b.classList.remove("active"));
  ({ todos: gBtnTodos, "90": gBtnG90, "180": gBtnG180, "270": gBtnG270, "360": gBtnG360 })[v]?.classList.add("active");
  renderizarMapaGiros();
}
function setGiroFiltroDirecao(v) {
  giroState.filtroDirecao = v;
  [gBtnDirTodos, gBtnDireita, gBtnEsquerda].forEach(b => b.classList.remove("active"));
  ({ todos: gBtnDirTodos, direita: gBtnDireita, esquerda: gBtnEsquerda })[v]?.classList.add("active");
  renderizarMapaGiros();
}

gBtnTodos.addEventListener("click",    () => setGiroFiltroGraus("todos"));
gBtnG90.addEventListener("click",      () => setGiroFiltroGraus("90"));
gBtnG180.addEventListener("click",     () => setGiroFiltroGraus("180"));
gBtnG270.addEventListener("click",     () => setGiroFiltroGraus("270"));
gBtnG360.addEventListener("click",     () => setGiroFiltroGraus("360"));
gBtnDirTodos.addEventListener("click", () => setGiroFiltroDirecao("todos"));
gBtnDireita.addEventListener("click",  () => setGiroFiltroDirecao("direita"));
gBtnEsquerda.addEventListener("click", () => setGiroFiltroDirecao("esquerda"));

/** Renderiza o mapa base + marcadores de giro com legenda interativa. */
function renderizarMapaGiros() { try { _renderizarMapaGiros(); } catch(e) { console.error("renderizarMapaGiros:", e); } }
function _renderizarMapaGiros() {
  const { camadas, cols, rows, giros, filtroDirecao, filtroGraus } = giroState;
  mapaGirosContainer.replaceChildren();

  if (!camadas || cols === 0) {
    giroHint.textContent = "Selecione uma sessão para ver o mapa de giros.";
    mapaGirosContainer.append(giroHint);
    return;
  }

  // ── Extrair camadas do GeoJSON ──────────────────────────────────────────
  const getCamada = name => camadas.find(c => c.layerName === name);
  const polyToRect = f => {
    const c = f.geometry.coordinates[0];
    return { x1: c[0][0], y1: c[2][1], x2: c[2][0], y2: c[0][1], ...f.properties };
  };

  const mostrarObjetos = chkObjetos.checked;
  const mostrarMoveis  = chkMoveis.checked;

  const floorRects = (getCamada("floor")?.geojson.features ?? []).map(polyToRect);
  const doorRects  = (getCamada("door_and_windows")?.geojson.features ?? []).map(polyToRect);
  const furnRects  = mostrarMoveis ? [
    ...(getCamada("furniture")?.geojson.features  ?? []),
    ...(getCamada("eletronics")?.geojson.features ?? []),
    ...(getCamada("utensils")?.geojson.features   ?? []),
  ].map(polyToRect) : [];
  const wallFeature = getCamada("walls")?.geojson.features[0];
  const wallEdges = (wallFeature?.geometry.coordinates ?? []).map(([p1, p2]) => ({
    x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
  }));

  // interactive_elements: polígonos com centro e índice numerado
  const interRects = mostrarObjetos
    ? (getCamada("interactive_elements")?.geojson.features ?? []).map((f, i) => {
        const r = polyToRect(f);
        return { ...r, cx: (r.x1 + r.x2) / 2, cy: (r.y1 + r.y2) / 2, idx: i + 1 };
      })
    : [];

  // ── Aplicar filtros combinados ─────────────────────────────────────────
  const girosFiltrados = giros.filter(g => {
    if (filtroDirecao === "direita"  && g.direcao !== 4)       return false;
    if (filtroDirecao === "esquerda" && g.direcao !== 0)       return false;
    if (filtroGraus !== "todos"      && g.graus  !== filtroGraus) return false;
    return true;
  });

  // Agrupar por posição
  const giroMap = new Map();
  for (const g of girosFiltrados) {
    const key = `${g.geoX},${g.geoY}`;
    if (!giroMap.has(key)) giroMap.set(key, []);
    giroMap.get(key).push(g);
  }
  // geoY de detectarGiros usa -(round(z)+0.5); corrigir para o eixo Z invertido do Unity
  const giroPoints = [...giroMap.values()].map(arr => ({
    ...arr[0],
    geoY: -arr[0].geoY - rows,  // round(z)+0.5 - rows
    count: arr.length,
    marcador: arr.reduce((p, c) => parseInt(c.graus) > parseInt(p.graus) ? c : p).marcador,
    tooltip: arr.map(g => `${g.marcador} ${g.graus}° ${g.direcaoLabel}`).join("\n"),
  }));

  // ── Dimensões ──────────────────────────────────────────────────────────
  const W = (mapaGirosContainer.clientWidth || 460) - 110; // 110 = legenda
  const scale = Math.min((W - 8) / cols, 480 / rows);
  const W2 = Math.round(cols * scale);
  const H2 = Math.round(rows * scale);
  const symSize = Math.max(9, Math.min(scale * 0.65, 20));

  // ── Contagens para a legenda (sobre todos os giros, sem filtro) ────────
  const nEsquerda = giros.filter(g => g.direcao === 0).length;
  const nDireita  = giros.filter(g => g.direcao === 4).length;
  const nPorGraus = { "90": 0, "180": 0, "270": 0, "360": 0 };
  for (const g of giros) nPorGraus[g.graus] = (nPorGraus[g.graus] ?? 0) + 1;

  // ── Plot ───────────────────────────────────────────────────────────────
  const chart = Plot.plot({
    width: W2, height: H2,
    marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0,
    x: { domain: [0, cols], axis: null },
    y: { domain: [-rows, 0], axis: null },
    style: { background: "transparent", overflow: "visible" },
    marks: [
      Plot.rect(floorRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: d => d.areaInterna ? "#e8d5b7" : "#c8e6c9", stroke: "none",
      }),
      Plot.rect(doorRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: "#87ceeb", fillOpacity: 0.8, stroke: "none",
      }),
      Plot.link(wallEdges, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        stroke: "#3a3a3a", strokeWidth: Math.max(1, scale * 0.07),
      }),
      // Móveis / objetos (contorno destacado)
      ...furnRects.length ? [Plot.rect(furnRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: "#d4a56a", fillOpacity: 0.75, stroke: "#b8864e", strokeWidth: 0.5,
      })] : [],
      // Objetivos da cena: área sombreada + número centralizado
      ...interRects.length ? [
        Plot.rect(interRects, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          fill: "#5ba85b", fillOpacity: 0.25,
          stroke: "#5ba85b", strokeWidth: 1.2,
        }),
        Plot.text(interRects, {
          x: "cx", y: "cy",
          text: d => String(d.idx),
          fontSize: Math.max(7, scale * 0.5),
          fill: "#2d6a2d",
          fontWeight: "bold",
          textAnchor: "middle",
          dy: "0.35em",
          title: "nomeAmigavel",
        }),
      ] : [],
      Plot.text(giroPoints, {
        x: "geoX", y: "geoY",
        text: "marcador",
        fontSize: symSize,
        fill: d => d.direcao === 4 ? "#e07b54" : "#4a90d9",
        fontWeight: "bold",
        textAnchor: "middle",
        dy: "0.35em",
        title: "tooltip",
      }),
    ],
  });

  // ── Wrapper: mapa + legenda lado a lado ───────────────────────────────
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;align-items:flex-start;gap:10px;width:100%;";
  wrapper.append(chart);

  // ── Helper: item de legenda toggle ────────────────────────────────────
  function mkLegendItem({ label, swatch, isAtivo, onClick }) {
    const item = document.createElement("div");
    item.style.cssText = `display:flex;align-items:center;gap:6px;cursor:pointer;
      opacity:${isAtivo ? 1 : 0.3};transition:opacity .15s;`;
    item.append(swatch);
    const txt = document.createElement("span");
    txt.style.cssText = "font-size:.72rem;font-weight:600;color:#fff;white-space:nowrap;";
    txt.textContent = label;
    item.append(txt);
    item.addEventListener("click", onClick);
    return item;
  }

  // ── Legenda única (canto inferior esquerdo) ───────────────────────────
  const COR_ESQ = "#4a90d9";
  const COR_DIR = "#e07b54";

  const GRAUS_DEFS = [
    { graus: "90",  symE: "⮢", symD: "⮣" },
    { graus: "180", symE: "⤺", symD: "⤻" },
    { graus: "270", symE: "⮌", symD: "⮎" },
    { graus: "360", symE: "⟲", symD: "⟳" },
  ];

  const legend = document.createElement("div");
  legend.style.cssText = `flex-shrink:0;
    background:var(--theme-background-alt);
    border:1px solid var(--theme-foreground-faintest);
    border-radius:8px;padding:8px 12px;display:flex;flex-direction:column;gap:3px;user-select:none;`;

  // ── Bloco Esquerda ─────────────────────────────────────────────────────
  const ativoEsq = filtroDirecao === "todos" || filtroDirecao === "esquerda";

  const headerEsq = document.createElement("div");
  headerEsq.style.cssText = `display:flex;align-items:center;gap:6px;cursor:pointer;
    opacity:${ativoEsq ? 1 : 0.3};transition:opacity .15s;margin-bottom:2px;`;
  const dotEsq = document.createElement("div");
  dotEsq.style.cssText = `width:9px;height:9px;border-radius:50%;background:${COR_ESQ};flex-shrink:0;`;
  const lblEsq = document.createElement("span");
  lblEsq.style.cssText = `font-size:.7rem;font-weight:700;color:${COR_ESQ};text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;`;
  lblEsq.textContent = `← Esquerda (${nEsquerda})`;
  headerEsq.append(dotEsq, lblEsq);
  headerEsq.addEventListener("click", () => {
    giroState.filtroDirecao = filtroDirecao === "esquerda" ? "todos" : "esquerda";
    renderizarMapaGiros();
  });
  legend.append(headerEsq);

  for (const def of GRAUS_DEFS) {
    const n = giros.filter(g => g.direcao === 0 && g.graus === def.graus).length;
    const isAtivo = ativoEsq && (filtroGraus === "todos" || filtroGraus === def.graus);
    const row = document.createElement("div");
    row.style.cssText = `display:flex;align-items:center;gap:5px;cursor:pointer;
      padding-left:15px;opacity:${isAtivo ? 1 : 0.25};transition:opacity .15s;`;
    const sym = document.createElement("span");
    sym.style.cssText = `font-size:.9rem;font-weight:bold;color:${COR_ESQ};width:14px;text-align:center;line-height:1;`;
    sym.textContent = def.symE;
    const lbl = document.createElement("span");
    lbl.style.cssText = "font-size:.7rem;color:var(--theme-foreground-muted);";
    lbl.textContent = `${def.graus}° (${n})`;
    row.append(sym, lbl);
    row.addEventListener("click", e => {
      e.stopPropagation();
      giroState.filtroGraus    = filtroGraus === def.graus ? "todos" : def.graus;
      giroState.filtroDirecao  = "esquerda";
      renderizarMapaGiros();
    });
    legend.append(row);
  }

  // ── Divisor ────────────────────────────────────────────────────────────
  const sep = document.createElement("div");
  sep.style.cssText = "border-top:1px solid var(--theme-foreground-faintest);margin:4px 0;";
  legend.append(sep);

  // ── Bloco Direita ──────────────────────────────────────────────────────
  const ativoDir = filtroDirecao === "todos" || filtroDirecao === "direita";

  const headerDir = document.createElement("div");
  headerDir.style.cssText = `display:flex;align-items:center;gap:6px;cursor:pointer;
    opacity:${ativoDir ? 1 : 0.3};transition:opacity .15s;margin-bottom:2px;`;
  const dotDir = document.createElement("div");
  dotDir.style.cssText = `width:9px;height:9px;border-radius:50%;background:${COR_DIR};flex-shrink:0;`;
  const lblDir2 = document.createElement("span");
  lblDir2.style.cssText = `font-size:.7rem;font-weight:700;color:${COR_DIR};text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;`;
  lblDir2.textContent = `Direita → (${nDireita})`;
  headerDir.append(dotDir, lblDir2);
  headerDir.addEventListener("click", () => {
    giroState.filtroDirecao = filtroDirecao === "direita" ? "todos" : "direita";
    renderizarMapaGiros();
  });
  legend.append(headerDir);

  for (const def of GRAUS_DEFS) {
    const n = giros.filter(g => g.direcao === 4 && g.graus === def.graus).length;
    const isAtivo = ativoDir && (filtroGraus === "todos" || filtroGraus === def.graus);
    const row = document.createElement("div");
    row.style.cssText = `display:flex;align-items:center;gap:5px;cursor:pointer;
      padding-left:15px;opacity:${isAtivo ? 1 : 0.25};transition:opacity .15s;`;
    const sym = document.createElement("span");
    sym.style.cssText = `font-size:.9rem;font-weight:bold;color:${COR_DIR};width:14px;text-align:center;line-height:1;`;
    sym.textContent = def.symD;
    const lbl = document.createElement("span");
    lbl.style.cssText = "font-size:.7rem;color:var(--theme-foreground-muted);";
    lbl.textContent = `${def.graus}° (${n})`;
    row.append(sym, lbl);
    row.addEventListener("click", e => {
      e.stopPropagation();
      giroState.filtroGraus    = filtroGraus === def.graus ? "todos" : def.graus;
      giroState.filtroDirecao  = "direita";
      renderizarMapaGiros();
    });
    legend.append(row);
  }

  // ── Legenda de objetivos (abaixo da legenda de giros, se houver) ─────────
  const legendObjetivos = document.createElement("div");
  legendObjetivos.style.cssText = `flex-shrink:0;
    background:var(--theme-background-alt);
    border:1px solid var(--theme-foreground-faintest);
    border-radius:8px;padding:8px 12px;display:flex;flex-direction:column;gap:4px;user-select:none;`;

  const lblObj = document.createElement("div");
  lblObj.style.cssText = "font-size:.65rem;font-weight:700;color:var(--theme-foreground-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;";
  lblObj.textContent = "Objetivos da cena";
  legendObjetivos.append(lblObj);

  const allInterRects = (getCamada("interactive_elements")?.geojson.features ?? []).map((f, i) => {
    const r = polyToRect(f);
    const logObj = giroState.objetivos[i];
    const nome = logObj?.objectiveName ?? f.properties.nomeAmigavel ?? `Objetivo ${i + 1}`;
    const concluido = logObj ? (logObj.endTime ?? 0) > 0 : false;
    return { ...r, idx: i + 1, nome, concluido };
  });

  if (allInterRects.length === 0) {
    const vazio = document.createElement("span");
    vazio.style.cssText = "font-size:.72rem;color:var(--theme-foreground-muted);font-style:italic;";
    vazio.textContent = "Nenhum objetivo no mapa";
    legendObjetivos.append(vazio);
  } else {
    for (const obj of allInterRects) {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:6px;";

      const badge = document.createElement("div");
      badge.style.cssText = `width:18px;height:18px;border-radius:4px;flex-shrink:0;
        background:rgba(91,168,91,.25);border:1.5px solid #5ba85b;
        display:flex;align-items:center;justify-content:center;`;
      const num = document.createElement("span");
      num.style.cssText = "font-size:.68rem;font-weight:800;color:#2d6a2d;line-height:1;";
      num.textContent = obj.idx;
      badge.append(num);

      const nome = document.createElement("span");
      nome.style.cssText = "font-size:.72rem;color:var(--theme-foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;";
      nome.textContent = obj.nome;
      nome.title = obj.nome;

      row.append(badge, nome);
      legendObjetivos.append(row);
    }
  }

  // Coluna lateral: legenda giros em cima, objetivos em baixo
  const sideCol = document.createElement("div");
  sideCol.style.cssText = "display:flex;flex-direction:column;gap:8px;flex-shrink:0;";
  sideCol.append(legend, legendObjetivos);

  wrapper.append(sideCol);
  mapaGirosContainer.append(wrapper);
}

// ── Heatmap de Movimentação ────────────────────────────────────────────────
function renderizarHeatmap() { try { _renderizarHeatmap(); } catch(e) { console.error("renderizarHeatmap:", e); } }
function _renderizarHeatmap() {
  heatmapContainer.replaceChildren();

  const { camadas, cols, rows, dadosLog } = giroState;

  if (!camadas || cols === 0 || !dadosLog) {
    const hint = document.createElement("div");
    hint.className = "giro-hint";
    hint.textContent = "Selecione uma sessão para ver o heatmap de movimentação.";
    heatmapContainer.append(hint);
    return;
  }

  // ── Coletar e converter posições ─────────────────────────────────────────
  const contagem = contarMovimentos(dadosLog);

  if (contagem.size === 0) {
    const hint = document.createElement("div");
    hint.className = "giro-hint";
    hint.textContent = "Nenhum dado de movimentação disponível.";
    heatmapContainer.append(hint);
    return;
  }

  const heatTiles = heatTilesParaRects(contagem, rows);

  // ── Camadas base ──────────────────────────────────────────────────────────
  const getCamada = name => camadas.find(c => c.layerName === name);
  const polyToRect = f => {
    const c = f.geometry.coordinates[0];
    return { x1: c[0][0], y1: c[2][1], x2: c[2][0], y2: c[0][1], ...f.properties };
  };
  const floorRects = (getCamada("floor")?.geojson.features ?? []).map(polyToRect);
  const doorRects  = (getCamada("door_and_windows")?.geojson.features ?? []).map(polyToRect);
  const wallFeature = getCamada("walls")?.geojson.features[0];
  const wallEdges = (wallFeature?.geometry.coordinates ?? []).map(([p1, p2]) => ({
    x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
  }));

  // interactive_elements numerados (responde ao chkObjetos)
  const mostrarObjetos = chkObjetos.checked;
  const allInterFeatures = getCamada("interactive_elements")?.geojson.features ?? [];
  const interRects = mostrarObjetos
    ? allInterFeatures.map((f, i) => {
        const r = polyToRect(f);
        return { ...r, cx: (r.x1 + r.x2) / 2, cy: (r.y1 + r.y2) / 2, idx: i + 1 };
      })
    : [];

  // ── Dimensões ─────────────────────────────────────────────────────────────
  const LEGENDA_W = 80; // largura reservada para a legenda lateral
  const W = (heatmapContainer.getBoundingClientRect().width || 500) - LEGENDA_W - 16;
  const scale = Math.min((W - 8) / cols, 480 / rows);
  const W2 = Math.round(cols * scale);
  const H2 = Math.round(rows * scale);

  // ── Plot ─────────────────────────────────────────────────────────────────
  const chart = Plot.plot({
    width: W2, height: H2,
    marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0,
    x: { domain: [0, cols], axis: null },
    y: { domain: [-rows, 0], axis: null },
    style: { background: "transparent", overflow: "visible" },
    marks: [
      Plot.rect(floorRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: d => d.areaInterna ? "#e8d5b7" : "#c8e6c9", stroke: "none",
      }),
      Plot.rect(doorRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: "#87ceeb", fillOpacity: 0.8, stroke: "none",
      }),
      // Tiles de calor — azuis com transparência (mapa visível por baixo)
      Plot.rect(heatTiles, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: d => corHeatmap(d.count),
        stroke: "none",
        title: d => `${d.count} ação${d.count > 1 ? "ões" : ""}`,
      }),
      Plot.link(wallEdges, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        stroke: "#3a3a3a", strokeWidth: Math.max(1, scale * 0.07),
      }),
      // Objetivos da cena: contorno + número
      ...interRects.length ? [
        Plot.rect(interRects, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          fill: "#5ba85b", fillOpacity: 0.20,
          stroke: "#5ba85b", strokeWidth: 1.2,
        }),
        Plot.text(interRects, {
          x: "cx", y: "cy",
          text: d => String(d.idx),
          fontSize: Math.max(7, scale * 0.5),
          fill: "#2d6a2d", fontWeight: "bold",
          textAnchor: "middle", dy: "0.35em",
          title: "nomeAmigavel",
        }),
      ] : [],
    ],
  });

  // ── Legenda lateral ───────────────────────────────────────────────────────
  const legenda = document.createElement("div");
  legenda.style.cssText = `
    flex-shrink:0;width:${LEGENDA_W}px;
    display:flex;flex-direction:column;align-items:center;gap:0;
    background:var(--theme-background-alt);
    border:1px solid var(--theme-foreground-faintest);
    border-radius:8px;padding:8px 6px 6px;`;

  const titulo = document.createElement("div");
  titulo.style.cssText = "font-size:.65rem;font-weight:700;text-align:center;line-height:1.2;margin-bottom:4px;color:var(--theme-foreground);";
  titulo.textContent = "Ações por Área";
  legenda.append(titulo);

  const subtitulo = document.createElement("div");
  subtitulo.style.cssText = "font-size:.6rem;text-align:center;color:var(--theme-foreground-muted);margin-bottom:6px;";
  subtitulo.textContent = "Legenda de Cores";
  legenda.append(subtitulo);

  // Swatches (ordem reversa: 5+ em cima, 1 em baixo — mais escuro → mais claro)
  const swatchesWrap = document.createElement("div");
  swatchesWrap.style.cssText = "display:flex;gap:4px;align-items:stretch;";

  const swatchCol = document.createElement("div");
  swatchCol.style.cssText = "display:flex;flex-direction:column;gap:2px;";

  const labelCol = document.createElement("div");
  labelCol.style.cssText = "display:flex;flex-direction:column;gap:2px;justify-content:space-around;";

  for (const entry of [...PALETA_HEATMAP].reverse()) {
    const swatch = document.createElement("div");
    swatch.style.cssText = `width:22px;height:16px;border-radius:3px;background:${entry.cor};border:1px solid rgba(0,0,0,.1);`;
    swatchCol.append(swatch);

    const lbl = document.createElement("div");
    lbl.style.cssText = "font-size:.65rem;color:var(--theme-foreground-muted);line-height:16px;";
    lbl.textContent = entry.label;
    labelCol.append(lbl);
  }
  swatchesWrap.append(swatchCol, labelCol);
  legenda.append(swatchesWrap);

  // Label rotacionado "N° de Ações"
  const rotLabel = document.createElement("div");
  rotLabel.style.cssText = `
    writing-mode:vertical-rl;transform:rotate(180deg);
    font-size:.6rem;color:var(--theme-foreground-muted);
    margin-top:6px;letter-spacing:.03em;`;
  rotLabel.textContent = "N° de Ações";
  legenda.append(rotLabel);

  // ── Legenda de objetivos ──────────────────────────────────────────────────
  const legendObjetivos = document.createElement("div");
  legendObjetivos.style.cssText = `
    flex-shrink:0;
    background:var(--theme-background-alt);
    border:1px solid var(--theme-foreground-faintest);
    border-radius:8px;padding:8px 10px;display:flex;flex-direction:column;gap:4px;`;

  const lblObj = document.createElement("div");
  lblObj.style.cssText = "font-size:.65rem;font-weight:700;color:var(--theme-foreground-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;";
  lblObj.textContent = "Objetivos da cena";
  legendObjetivos.append(lblObj);

  const objData = allInterFeatures.map((f, i) => {
    const logObj = giroState.objetivos[i];
    const nome = logObj?.objectiveName ?? f.properties.nomeAmigavel ?? `Objetivo ${i + 1}`;
    return { idx: i + 1, nome };
  });

  if (objData.length === 0) {
    const vazio = document.createElement("span");
    vazio.style.cssText = "font-size:.72rem;color:var(--theme-foreground-muted);font-style:italic;";
    vazio.textContent = "Nenhum objetivo no mapa";
    legendObjetivos.append(vazio);
  } else {
    for (const obj of objData) {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:6px;";

      const badge = document.createElement("div");
      badge.style.cssText = `width:18px;height:18px;border-radius:4px;flex-shrink:0;
        background:rgba(91,168,91,.25);border:1.5px solid #5ba85b;
        display:flex;align-items:center;justify-content:center;`;
      const num = document.createElement("span");
      num.style.cssText = "font-size:.68rem;font-weight:800;color:#2d6a2d;line-height:1;";
      num.textContent = obj.idx;
      badge.append(num);

      const nomeEl = document.createElement("span");
      nomeEl.style.cssText = "font-size:.72rem;color:var(--theme-foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;";
      nomeEl.textContent = obj.nome;
      nomeEl.title = obj.nome;

      row.append(badge, nomeEl);
      legendObjetivos.append(row);
    }
  }

  // Coluna lateral: cor em cima, objetivos em baixo
  const sideCol = document.createElement("div");
  sideCol.style.cssText = "display:flex;flex-direction:column;gap:8px;flex-shrink:0;";
  sideCol.append(legenda, legendObjetivos);

  // ── Wrapper mapa + legenda ────────────────────────────────────────────────
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;align-items:flex-start;gap:8px;";
  wrapper.append(chart, sideCol);
  heatmapContainer.append(wrapper);
}

// ── Mapa de Colisão — checkboxes internos ─────────────────────────────────
const chkColisaoPoints  = Object.assign(document.createElement("input"),  { type: "checkbox" }); chkColisaoPoints.checked  = true;
const chkObjetivosCol   = Object.assign(document.createElement("input"),  { type: "checkbox" }); chkObjetivosCol.checked   = true;
[chkColisaoPoints, chkObjetivosCol].forEach(c => c.addEventListener("change", () => {
  if (giroState.camadas) renderizarColisao();
}));

function renderizarColisao() { try { _renderizarColisao(); } catch(e) { console.error("renderizarColisao:", e); } }
function _renderizarColisao() {
  colisaoContainer.replaceChildren();

  // ── Barra de checkboxes ───────────────────────────────────────────────────
  const chkBar = document.createElement("div");
  chkBar.style.cssText = "display:flex;gap:16px;margin-bottom:8px;font-size:.75rem;color:var(--theme-foreground-muted);user-select:none;";

  const mkChkLabel = (chk, text) => {
    const lbl = document.createElement("label");
    lbl.style.cssText = "display:flex;align-items:center;gap:5px;cursor:pointer;";
    lbl.append(chk, text);
    return lbl;
  };
  chkBar.append(
    mkChkLabel(chkColisaoPoints, "Pontos de Colisão"),
    mkChkLabel(chkObjetivosCol,  "Pontos de Objetivos"),
  );
  colisaoContainer.append(chkBar);

  const { camadas, cols, rows, dadosLog } = giroState;

  if (!camadas || cols === 0 || !dadosLog) {
    const hint = document.createElement("div");
    hint.className = "giro-hint";
    hint.textContent = "Selecione uma sessão para ver o mapa de colisões.";
    colisaoContainer.append(hint);
    return;
  }

  // ── Dados ─────────────────────────────────────────────────────────────────
  const segmentos  = extrairSegmentos(dadosLog, rows);
  const colisoes   = extrairColisoes(dadosLog, rows);
  const maxSeg     = segmentos.length ? Math.max(...segmentos.map(s => s.count)) : 1;

  // Pontos visitados para dots azuis nos nós da trajetória
  const visitContagem = contarMovimentos(dadosLog);
  const visitPoints   = [...visitContagem.entries()].map(([key]) => {
    const [col, row] = key.split(",").map(Number);
    // mesma inversão de eixo Z: geoY = round(z) + 0.5 - rows = row + 0.5 - rows
    return { geoX: col + 0.5, geoY: row + 0.5 - rows };
  });

  // ── Camadas base ──────────────────────────────────────────────────────────
  const getCamada = name => camadas.find(c => c.layerName === name);
  const polyToRect = f => {
    const c = f.geometry.coordinates[0];
    return { x1: c[0][0], y1: c[2][1], x2: c[2][0], y2: c[0][1], ...f.properties };
  };
  const floorRects  = (getCamada("floor")?.geojson.features ?? []).map(polyToRect);
  const doorRects   = (getCamada("door_and_windows")?.geojson.features ?? []).map(polyToRect);
  const wallFeature = getCamada("walls")?.geojson.features[0];
  const wallEdges   = (wallFeature?.geometry.coordinates ?? []).map(([p1, p2]) => ({
    x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
  }));

  const allInterFeatures = getCamada("interactive_elements")?.geojson.features ?? [];
  const interCenters = chkObjetivosCol.checked
    ? allInterFeatures.map((f, i) => {
        const r = polyToRect(f);
        return { cx: (r.x1 + r.x2) / 2, cy: (r.y1 + r.y2) / 2, idx: i + 1, ...f.properties };
      })
    : [];

  // ── Dimensões ─────────────────────────────────────────────────────────────
  const LEGENDA_W = 140;
  const W     = (colisaoContainer.getBoundingClientRect().width || 500) - LEGENDA_W - 16;
  const scale = Math.min((W - 8) / cols, 480 / rows);
  const W2    = Math.round(cols * scale);
  const H2    = Math.round(rows * scale);
  const dotR  = 2;  // raio dos nós da trajetória (diâmetro 4px fixo)
  const colR  = Math.max(3,   scale * 0.12);  // raio fixo dos círculos de colisão

  // ── Plot ─────────────────────────────────────────────────────────────────
  const chart = Plot.plot({
    width: W2, height: H2,
    marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0,
    x: { domain: [0, cols], axis: null },
    y: { domain: [-rows, 0], axis: null },
    style: { background: "transparent", overflow: "visible" },
    marks: [
      // Mapa base
      Plot.rect(floorRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: d => d.areaInterna ? "#e8d5b7" : "#c8e6c9", stroke: "none",
      }),
      Plot.rect(doorRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: "#87ceeb", fillOpacity: 0.8, stroke: "none",
      }),
      // Trajetórias ortogonais
      ...segmentos.length ? [Plot.link(segmentos, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        stroke:      d => corSegmento(d.count, maxSeg),
        strokeWidth: 12,
        strokeLinecap: "round",
        title: d => `${d.count} travessia${d.count > 1 ? "s" : ""}`,
      })] : [],
      // Nós: ponto azul preenchido em cada tile visitado
      Plot.dot(visitPoints, {
        x: "geoX", y: "geoY",
        r: dotR,
        fill: "#4a90d9",
        stroke: "#1a5fa8",
        strokeWidth: 1,
      }),
      // Paredes (sobre tudo exceto colisões e objetivos)
      Plot.link(wallEdges, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        stroke: "#3a3a3a", strokeWidth: Math.max(1.5, scale * 0.07),
      }),
      // Objetivos: círculo branco com contorno verde nos centros
      ...interCenters.length ? [
        Plot.dot(interCenters, {
          x: "cx", y: "cy",
          r: dotR * 1.4,
          fill: "white",
          stroke: "#5ba85b",
          strokeWidth: 1.5,
        }),
        Plot.text(interCenters, {
          x: "cx", y: "cy",
          text: d => String(d.idx),
          fontSize: Math.max(6, scale * 0.4),
          fill: "#2d6a2d", fontWeight: "bold",
          textAnchor: "middle", dy: "0.35em",
        }),
      ] : [],
      // Colisões: círculo vermelho — sem fill, contorno (posição real do log)
      ...chkColisaoPoints.checked && colisoes.length ? [Plot.dot(colisoes, {
        x: "geoX", y: "geoY",
        r: colR,
        fill: "none",
        stroke: "rgba(200,20,20,0.90)",
        strokeWidth: 1.8,
        title: d => `${d.count} colisão${d.count > 1 ? "ões" : ""} — ${d.objectID}`,
      })] : [],
    ],
  });

  // ── Legenda lateral ───────────────────────────────────────────────────────
  const legenda = document.createElement("div");
  legenda.style.cssText = `
    flex-shrink:0;width:${LEGENDA_W}px;display:flex;flex-direction:column;gap:10px;
    background:var(--theme-background-alt);
    border:1px solid var(--theme-foreground-faintest);
    border-radius:8px;padding:10px 10px 8px;`;

  // — Trajetória —
  const mkSec = label => {
    const sec = document.createElement("div");
    sec.style.cssText = "display:flex;flex-direction:column;gap:5px;";
    const lbl = document.createElement("div");
    lbl.style.cssText = "font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--theme-foreground-muted);margin-bottom:2px;";
    lbl.textContent = label;
    sec.append(lbl);
    return sec;
  };

  const secTraj = mkSec("Trajetória");
  for (const { label, t } of [{ label: "Pouco", t: 0 }, { label: "Moderado", t: 0.5 }, { label: "Frequente", t: 1 }]) {
    const cor = corSegmento(Math.round(1 + t * (maxSeg - 1)), maxSeg);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:6px;";
    const linha = document.createElement("div");
    linha.style.cssText = `width:28px;height:4px;border-radius:2px;background:${cor};flex-shrink:0;`;
    const lbl = document.createElement("span");
    lbl.style.cssText = "font-size:.68rem;color:var(--theme-foreground-muted);";
    lbl.textContent = label;
    row.append(linha, lbl);
    secTraj.append(row);
  }
  legenda.append(secTraj);

  // — Colisões —
  const secCol = mkSec("Colisões");
  for (const { label, d } of [{ label: "1", d: 8 }, { label: "2–3", d: 12 }, { label: "4+", d: 18 }]) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:6px;";
    const circ = document.createElement("div");
    circ.style.cssText = `width:${d}px;height:${d}px;border-radius:50%;background:none;border:1.8px solid rgba(200,20,20,0.90);flex-shrink:0;`;
    const lbl = document.createElement("span");
    lbl.style.cssText = "font-size:.68rem;color:var(--theme-foreground-muted);";
    lbl.textContent = label;
    row.append(circ, lbl);
    secCol.append(row);
  }
  legenda.append(secCol);

  // — Objetivos —
  if (chkObjetivosCol.checked && allInterFeatures.length > 0) {
    const secObj = mkSec("Objetivos");
    secObj.style.borderTop = "1px solid var(--theme-foreground-faintest)";
    secObj.style.paddingTop = "8px";
    allInterFeatures.forEach((f, i) => {
      const logObj = giroState.objetivos[i];
      const nome = logObj?.objectiveName ?? f.properties.nomeAmigavel ?? `Objetivo ${i + 1}`;
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:5px;";
      const badge = document.createElement("div");
      badge.style.cssText = `width:16px;height:16px;border-radius:50%;flex-shrink:0;
        background:white;border:1.5px solid #5ba85b;
        display:flex;align-items:center;justify-content:center;`;
      const num = document.createElement("span");
      num.style.cssText = "font-size:.6rem;font-weight:800;color:#2d6a2d;line-height:1;";
      num.textContent = i + 1;
      badge.append(num);
      const nomeEl = document.createElement("span");
      nomeEl.style.cssText = "font-size:.68rem;color:var(--theme-foreground);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:88px;";
      nomeEl.textContent = nome;
      nomeEl.title = nome;
      row.append(badge, nomeEl);
      secObj.append(row);
    });
    legenda.append(secObj);
  }

  // ── Wrapper ───────────────────────────────────────────────────────────────
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;align-items:flex-start;gap:8px;";
  wrapper.append(chart, legenda);
  colisaoContainer.append(wrapper);
}

// Cache de camadas por id_mapa para não reprocessar o mesmo XML
const xmlMapaCache = new Map();

/** Carrega dados_log + mapa e popula giroState para renderização. */
async function carregarMapaGiros(id_log) {
  const myVersion = ++giroVersion;

  giroHint.textContent = "Carregando dados de giros…";
  mapaGirosContainer.replaceChildren(giroHint);

  try {
    // 1. Dados completos da sessão (inclui dados_log e nome_arquivo_xml)
    const sessao = await fetchSessao(id_log);
    if (myVersion !== giroVersion) return;

    // 2. Detectar giros
    giroState.dadosLog  = sessao.dados_log ?? null;
    giroState.giros     = sessao.dados_log ? detectarGiros(sessao.dados_log) : [];
    giroState.objetivos = sessao.dados_log?.objectives ?? [];

    // 3. Carregar e processar XML do mapa (com cache por id_mapa)
    const idMapa = sessao.id_mapa;
    if (!xmlMapaCache.has(idMapa)) {
      // Busca o XML diretamente da API usando a rota de arquivos
      const caminhoXml = sessao.nome_arquivo_xml; // ex: "/mapas/Quarto_0.xml"
      if (caminhoXml) {
        const token   = sessionStorage.getItem("om_token");
        // "/mapas/Quarto_0.xml" → pasta="mapas", arquivo="Quarto_0.xml"
        const partes  = caminhoXml.replace(/^\//, "").split("/");
        const pasta   = partes[0];
        const arquivo = partes.slice(1).join("/");
        const xmlResp = await fetch(`http://127.0.0.1:5000/api/treinos/arquivos/${pasta}/${arquivo}?token=${token}`);
        if (xmlResp.ok) {
          const xmlText = await xmlResp.text();
          const parsed  = parseMapaXML(xmlText);
          xmlMapaCache.set(idMapa, mapaParaGeoJSON(parsed));
        } else {
          xmlMapaCache.set(idMapa, null);
        }
      } else {
        xmlMapaCache.set(idMapa, null);
      }
    }
    if (myVersion !== giroVersion) return;

    const camadas = xmlMapaCache.get(idMapa);
    if (camadas) {
      const ref         = camadas[0];
      giroState.cols    = ref?.cols ?? 0;
      giroState.rows    = ref?.rows ?? 0;
      giroState.camadas = camadas;
    } else {
      giroState.camadas = null;
      giroState.cols    = 0;
      giroState.rows    = 0;
    }

    renderizarMapaGiros();
    renderizarHeatmap();
    renderizarColisao();
    renderizarLateralidade();
  } catch (e) {
    if (myVersion !== giroVersion) return;
    giroHint.textContent = `Erro ao carregar: ${e.message}`;
    mapaGirosContainer.replaceChildren(giroHint);
  }
}

// Placeholders dos gráficos
function ph(classe, icon, label) {
  const d = document.createElement("div");
  d.className = `chart-placeholder ${classe}`;
  d.innerHTML = `<div class="ph-icon">${icon}</div><div class="ph-label">${label}</div>`;
  return d;
}

const phTrafego        = ph("ph-trafego",       "🗺️",  "Mapa de Tráfego e Giros");
const heatmapContainer = document.createElement("div");
heatmapContainer.style.cssText = "min-height:180px";
const colisaoContainer = document.createElement("div");
colisaoContainer.style.cssText = "min-height:180px";
// ── Mapa de Lateralidade ──────────────────────────────────────────────────
function renderizarLateralidade() { try { _renderizarLateralidade(); } catch(e) { console.error("renderizarLateralidade:", e); } }
function _renderizarLateralidade() {
  lateralidadeContainer.replaceChildren();

  const { dadosLog } = giroState;
  if (!dadosLog) {
    const hint = document.createElement("div");
    hint.className = "giro-hint";
    hint.textContent = "Selecione uma sessão para ver a lateralidade.";
    lateralidadeContainer.append(hint);
    return;
  }

  const lat = extrairLateralidade(dadosLog);

  // ── Barra de proporção ────────────────────────────────────────────────────
  const barWrap = document.createElement("div");
  barWrap.style.cssText = "margin-bottom:10px;";

  const barTitle = document.createElement("div");
  barTitle.style.cssText = "font-size:.7rem;text-align:center;color:var(--theme-foreground-muted);margin-bottom:4px;";
  barTitle.textContent = "Proporção de Ações (Direita vs. Esquerda)";

  // Wrapper relativo para posicionar o marcador de 50%
  const barOuter = document.createElement("div");
  barOuter.style.cssText = "position:relative;";

  const bar = document.createElement("div");
  bar.style.cssText = "display:flex;height:14px;border-radius:3px;overflow:hidden;";
  const segDir = document.createElement("div");
  segDir.style.cssText = `flex:${lat.pctDireita};background:${LAT_COR_DIR};`;
  const segEsq = document.createElement("div");
  segEsq.style.cssText = `flex:${lat.pctEsquerda};background:${LAT_COR_ESQ};`;
  bar.append(segDir, segEsq);

  // Marcador de 50%
  const marca50 = document.createElement("div");
  marca50.style.cssText = `
    position:absolute;left:50%;top:-4px;bottom:-4px;
    width:2px;margin-left:-1px;
    background:#333;opacity:0.7;pointer-events:none;`;
  const marca50Lbl = document.createElement("div");
  marca50Lbl.style.cssText = `
    position:absolute;left:50%;top:-16px;
    transform:translateX(-50%);
    font-size:.58rem;font-weight:700;color:#333;white-space:nowrap;`;
  marca50Lbl.textContent = "50%";
  barOuter.append(bar, marca50, marca50Lbl);

  // Escala de % abaixo da barra
  const barScale = document.createElement("div");
  barScale.style.cssText = "display:flex;justify-content:space-between;font-size:.6rem;color:var(--theme-foreground-muted);margin-top:6px;";
  for (let p = 0; p <= 100; p += 10) {
    const s = document.createElement("span"); s.textContent = p + "%";
    barScale.append(s);
  }
  const barSubLabel = document.createElement("div");
  barSubLabel.style.cssText = "font-size:.65rem;text-align:center;color:var(--theme-foreground-muted);margin-top:1px;";
  barSubLabel.textContent = "Proporção de Ações";

  barWrap.append(barTitle, barOuter, barScale, barSubLabel);

  // ── Silhueta + gráfico lado a lado ───────────────────────────────────────
  const row = document.createElement("div");
  row.style.cssText = "display:flex;align-items:flex-start;gap:16px;";

  // Silhueta com labels DIREITA / ESQUERDA
  const figWrap = document.createElement("div");
  figWrap.style.cssText = "flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:4px;";

  const lblRow = document.createElement("div");
  lblRow.style.cssText = "display:flex;width:220px;justify-content:space-between;";
  const mkLbl = (txt, cor) => {
    const s = document.createElement("span");
    s.style.cssText = `font-size:.75rem;font-weight:bold;color:${cor};`;
    s.textContent = txt;
    return s;
  };
  lblRow.append(mkLbl("DIREITA", LAT_COR_DIR), mkLbl("ESQUERDA", LAT_COR_ESQ));

  const svgEl = corpoSVGElement(lat);
  svgEl.style.width = "220px";

  const pctRow = document.createElement("div");
  pctRow.style.cssText = "display:flex;width:220px;justify-content:space-between;";
  const mkPct = (v, cor) => {
    const s = document.createElement("span");
    s.style.cssText = `font-size:.8rem;font-weight:bold;color:${cor};`;
    s.textContent = (v * 100).toFixed(2) + "%";
    return s;
  };
  pctRow.append(mkPct(lat.pctDireita, LAT_COR_DIR), mkPct(lat.pctEsquerda, LAT_COR_ESQ));

  figWrap.append(lblRow, svgEl, pctRow);

  // Gráfico de barras
  const chartWrap = document.createElement("div");
  chartWrap.style.cssText = "flex:1;min-width:0;";

  const barData = [
    { lado: "Direita",  n: lat.direita  },
    { lado: "Esquerda", n: lat.esquerda },
  ];
  const chartW = Math.max(140, (lateralidadeContainer.getBoundingClientRect().width || 420) - 256);
  const barChart = Plot.plot({
    width: chartW,
    height: 360,
    marginBottom: 55,
    marginLeft: 55,
    x: { label: "Lateralidade", tickRotate: -30 },
    y: { label: "Número de Ações", grid: true },
    marks: [
      Plot.barY(barData, {
        x: "lado", y: "n",
        fill: d => d.lado === "Direita" ? LAT_COR_DIR : LAT_COR_ESQ,
      }),
      Plot.ruleY([0]),
      Plot.text(barData, {
        x: "lado", y: "n",
        text: d => d.n.toLocaleString("pt-BR"),
        dy: -6, fontSize: 11, fontWeight: "bold",
        fill: "var(--theme-foreground)",
      }),
    ],
  });
  chartWrap.append(barChart);

  row.append(figWrap, chartWrap);
  lateralidadeContainer.append(barWrap, row);
}

const lateralidadeContainer = document.createElement("div");
lateralidadeContainer.style.cssText = "min-height:260px";
const phComportamental = ph("ph-comportamental","📈",  "Análise Comportamental");
const phRadar          = ph("ph-radar",         "🕸️",  "Radar de Métricas");

// Gráfico de evolução por sessão (real)
const evolucaoContainer = document.createElement("div");
evolucaoContainer.style.cssText = "min-height:180px";

function renderizarGrafico(filtradas) {
  evolucaoContainer.replaceChildren();

  // Ordem cronológica: API retorna mais recente primeiro, invertemos
  const comMetricas = [...filtradas].reverse().filter(a => a.metricas);

  if (!comMetricas.length) {
    evolucaoContainer.append(ph("ph-evolucao", "📉", "Evolução por Sessão"));
    return;
  }

  // Eixo X = "#id_log" — único por sessão, independente de data
  const grafRows = comMetricas.flatMap(a => {
    const label = `#${a.sessao.id_log}`;
    const m = a.metricas;
    return [
      { label, metrica: "Precisão",  valor: m.precisao  },
      { label, metrica: "Objetivos", valor: m.objetivos },
      { label, metrica: "Fluidez",   valor: m.fluidez   },
    ];
  });

  const labelsDomain = comMetricas.map(a => `#${a.sessao.id_log}`);
  const COR_RANGE = ["#4a90e2", "#5ba85b", "#e07b54"];

  try {
    const w = evolucaoContainer.getBoundingClientRect().width || evolucaoContainer.offsetWidth || 400;
    const chart = Plot.plot({
      width: Math.max(w, 240),
      height: 180,
      marginLeft: 36, marginRight: 8, marginBottom: 40, marginTop: 12,
      x: {
        label: null,
        domain: labelsDomain,
        tickRotate: labelsDomain.length > 5 ? -40 : 0,
      },
      y: { label: "%", domain: [0, 100], grid: true, ticks: 5 },
      color: {
        domain: ["Precisão", "Objetivos", "Fluidez"],
        range: COR_RANGE,
      },
      marks: [
        Plot.line(grafRows, { x: "label", y: "valor", stroke: "metrica", strokeWidth: 2, tip: true }),
        Plot.dot(grafRows,  { x: "label", y: "valor", fill: "metrica", r: 3.5 }),
      ],
    });

    // Legenda simples em HTML
    const leg = document.createElement("div");
    leg.style.cssText = "display:flex;gap:1rem;justify-content:center;margin-top:4px;";
    ["Precisão", "Objetivos", "Fluidez"].forEach((m, i) => {
      const item = document.createElement("span");
      item.style.cssText = `font-size:.72rem;font-weight:600;display:flex;align-items:center;gap:4px;color:var(--theme-foreground-muted);`;
      const dot = document.createElement("span");
      dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${COR_RANGE[i]};flex-shrink:0;display:inline-block;`;
      item.append(dot, m);
      leg.append(item);
    });

    evolucaoContainer.append(chart, leg);
  } catch(e) {
    console.error("renderizarGrafico:", e);
    evolucaoContainer.append(ph("ph-evolucao", "📉", "Evolução por Sessão"));
  }
}

const analiseBar    = document.createElement("div"); analiseBar.className = "analise-bar";
const sessionListEl = document.createElement("div"); sessionListEl.className = "session-list";

// ── Popular selector de alunos ────────────────────────────────────────────
function popularSelector() {
  selSelect.replaceChildren();
  for (const a of todosAlunos.filter(a => a.ativo)) {
    const op = document.createElement("option");
    op.value = a.id_aluno;
    op.textContent = a.nome_completo;
    if (a.id_aluno === estado.idAluno) op.selected = true;
    selSelect.append(op);
  }
}
popularSelector();

// ── Popular selects de sessão nos filtros ─────────────────────────────────
function popularSeletoressessao() {
  const opts = [
    document.createElement("option"),
    ...estado.sessoes.map(s => {
      const op = document.createElement("option");
      op.value = s.id_log;
      op.textContent = `#${s.id_log} — ${s.nome_mapa} (${s.data?.slice(0,10) ?? "—"})`;
      return op;
    })
  ];
  for (const sel of [selSessao1, selSessao2, selSessao3]) {
    sel.replaceChildren(...opts.map(o => o.cloneNode(true)));
  }
  if (estado.sessoes[0]) selSessao1.value = estado.sessoes[0].id_log;
}

// ── Atualizar stats rápidas ───────────────────────────────────────────────
function atualizarStats(filtradas = estado.analises) {
  const total  = filtradas.length;
  const comAn  = filtradas.filter(a => a.analises).length;
  const mapas  = new Set(filtradas.map(a => a.sessao.nome_mapa)).size;
  const medias = filtradas.filter(a => a.metricas).map(a => {
    const m = a.metricas;
    return (m.precisao + m.objetivos + m.fluidez) / 3;
  });
  const media = medias.length ? Math.round(medias.reduce((s,v) => s+v, 0) / medias.length) : "—";

  qsTotalSessoes.innerHTML   = `<div class="qs-value">${total}</div><div class="qs-label">Sessões</div>`;
  qsComAnalise.innerHTML     = `<div class="qs-value" style="color:#166534">${comAn}</div><div class="qs-label">Analisadas</div>`;
  qsMapasDistintos.innerHTML = `<div class="qs-value">${mapas}</div><div class="qs-label">Mapas</div>`;
  qsMediaGeral.innerHTML     = `<div class="qs-value" style="color:#4a90e2">${media}${medias.length ? "%" : ""}</div><div class="qs-label">Média geral</div>`;
}

// ── Atualizar barra de análises ───────────────────────────────────────────
const TIPOS  = ["lateralidade","simulacao_trajetoria","trafego","giros","comparacao"];
const LABELS = { lateralidade:"Lateralidade", simulacao_trajetoria:"Trajetória", trafego:"Tráfego", giros:"Giros", comparacao:"Comparação" };

function atualizarAnaliseBar(filtradas = estado.analises) {
  analiseBar.replaceChildren();
  const total = filtradas.length || 1;
  for (const t of TIPOS) {
    const count = filtradas.filter(a => a.analises?.[t]).length;
    const pct   = (count / total * 100).toFixed(0);
    const row = document.createElement("div"); row.className = "analise-row";
    row.innerHTML = `
      <span class="analise-name">${LABELS[t]}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <span class="bar-count">${count}/${total}</span>`;
    analiseBar.append(row);
  }
}

// ── Atualizar lista de sessões ────────────────────────────────────────────
const COR_SESSAO = ["#4a90e2","#5ba85b","#e07b54","#c9a227","#9b59b6"];

function atualizarSessionList(filtradas = estado.analises) {
  sessionListEl.replaceChildren();
  const sessoes = filtradas.map(a => a.sessao);
  if (!sessoes.length) {
    const p = document.createElement("p"); p.className = "empty-hint";
    p.textContent = "Nenhuma sessão encontrada."; sessionListEl.append(p); return;
  }
  sessoes.slice(0, 8).forEach((s, i) => {
    const item = document.createElement("div");
    item.className = "session-item" + (estado.sessaoAtiva === s.id_log ? " ativa" : "");
    item.innerHTML = `
      <div class="si-dot" style="background:${COR_SESSAO[i % COR_SESSAO.length]}"></div>
      <span class="si-nome">${s.nome_mapa}</span>
      <span class="si-data">${s.data?.slice(0,10) ?? "—"}</span>
      <a class="si-link" href="/visualizacao/perfil-detalhado?id=${estado.idAluno}&log=${s.id_log}">→</a>`;
    item.addEventListener("click", e => {
      if (e.target.tagName === "A") return;
      estado.sessaoAtiva = estado.sessaoAtiva === s.id_log ? null : s.id_log;
      atualizarSessionList();
    });
    sessionListEl.append(item);
  });
}

// ── Atualizar avatar do seletor ───────────────────────────────────────────
function atualizarAvatar() {
  const a = estado.aluno;
  if (!a) return;
  selAvatar.style.background = avatarColor(a.id_aluno);
  selAvatar.textContent = initials(a.nome_completo);
}

// ── Carregar dados do aluno selecionado ───────────────────────────────────
async function carregarAluno(idAluno) {
  if (!idAluno) return;
  estado.idAluno        = idAluno;
  estado.filtroMapa     = "todas";
  estado.filtroConcl    = "todas";
  estado.filtroSessaoId = null;   // será definido após carregar as sessões

  try {
    const [aluno, { sessoes }] = await Promise.all([
      fetchAluno(idAluno),
      fetchSessoes(idAluno),
    ]);
    estado.aluno   = aluno;
    estado.sessoes = sessoes ?? [];

    // Busca análises e métricas da última sessão em paralelo
    estado.analises = await Promise.all(
      estado.sessoes.slice(0, 10).map(async s => {
        const [analises, metricasResp] = await Promise.all([
          fetchAnalises(s.id_log).then(r => r.analises).catch(() => null),
          fetchMetricas(s.id_log).catch(() => null),
        ]);
        return { sessao: s, analises, metricas: metricasResp?.metricas ?? null };
      })
    );

    estado.sessaoAtiva  = estado.sessoes[0]?.id_log ?? null;
    // Por padrão seleciona a sessão mais recente (primeira da lista)
    estado.filtroSessaoId = estado.analises[0]?.sessao.id_log ?? null;
    renderizar();
  } catch(e) {
    console.error("Erro ao carregar aluno:", e.message);
  }
}

// ── Renderizar tudo ───────────────────────────────────────────────────────
function renderizar() {
  atualizarAvatar();
  popularFiltroMapa();
  popularFiltroSessaoSelect();
  popularSeletoressessao();
  aplicarFiltroSessoes();
}

// ── Eventos ───────────────────────────────────────────────────────────────
selSelect.addEventListener("change", () => carregarAluno(parseInt(selSelect.value)));

// ── Montar layout ─────────────────────────────────────────────────────────
const colEsquerda = html`<div class="col-esquerda">

  <!-- Seletor de aluno -->
  <div class="painel">
    <div class="painel-titulo">Aluno</div>
    <div class="painel-corpo">
      <div class="aluno-selector">
        ${selAvatar}
        <div style="flex:1">
          <div class="sel-label">Selecionar aluno</div>
          ${selSelect}
        </div>
      </div>
    </div>
  </div>

  <!-- Filtro de sessões -->
  <div class="painel">
    <div class="painel-titulo">Filtro de Sessões</div>
    <div class="painel-corpo">
      <div class="filtro-sessoes-row">
        <label>Mapa</label>
        ${filtroMapaSelect}
      </div>
      <div class="filtro-sessoes-row" style="margin-top:.6rem">
        <label>Conclusão</label>
        <div class="filtro-concl-btns">
          ${filtroBtnTodas}${filtroBtnConcl}${filtroBtnNaoConcl}
        </div>
      </div>
      <div class="filtro-sessoes-row" style="margin-top:.6rem">
        <label>Sessão</label>
        ${filtroSessaoSelect}
      </div>
      ${filtroBadge}
    </div>
  </div>

  <!-- Filtros -->
  <div class="painel">
    <div class="painel-titulo">Select Filters</div>
    <div class="painel-corpo">

      <div class="filtro-titulo">Eventos</div>
      <div class="filtro-check">
        <label>${chkInicio}   <span class="filtro-icon">＋</span> Início</label>
        <label>${chkColisoes} <span class="filtro-icon">○</span> Colisões</label>
        <label>${chkObjetivos}<span class="filtro-icon">•</span> Objetivos</label>
      </div>

      <div class="filtro-titulo">Camadas do Mapa</div>
      <div class="filtro-check">
        <label>${chkObjetos}<span class="filtro-icon">◎</span> Objetivos da cena</label>
        <label>${chkMoveis} <span class="filtro-icon">▭</span> Móveis / objetos</label>
      </div>

      <hr class="filtro-divisor">
      <div class="filtro-titulo">Sessões</div>
      <div class="filtro-sessao">
        <label>Comparar sessão A</label>
        ${selSessao1}
      </div>
      <div class="filtro-sessao">
        <label>Comparar sessão B</label>
        ${selSessao2}
      </div>
      <div class="filtro-sessao">
        <label>Sessão de referência</label>
        ${selSessao3}
      </div>

      <hr class="filtro-divisor">
      <div class="filtro-range">
        <label>Intervalo de tempo (Range 1)</label>
        ${rangeA}
      </div>
      <div class="filtro-range">
        <label>Intervalo de sessão (Range 2)</label>
        ${rangeB}
      </div>
    </div>
  </div>

  <!-- Stats rápidas -->
  <div class="painel">
    <div class="painel-titulo">Resumo</div>
    <div class="painel-corpo">
      <div class="quick-stats">
        ${qsTotalSessoes}${qsComAnalise}
        ${qsMapasDistintos}${qsMediaGeral}
      </div>
    </div>
  </div>

</div>`;

const colCentro = html`<div class="col-centro">

  <!-- Mapa de Giros -->
  <div class="painel">
    <div class="painel-titulo">Mapa de Giros</div>
    <div class="painel-corpo">${mapaGirosContainer}</div>
  </div>

  <!-- Heatmap de eventos (Court Heatmap) -->
  <div class="painel">
    <div class="painel-titulo">Heatmap de Eventos por Área</div>
    <div class="painel-corpo">${heatmapContainer}</div>
  </div>

  <!-- Mapa de Colisão -->
  <div class="painel">
    <div class="painel-titulo">Colisão</div>
    <div class="painel-corpo">${colisaoContainer}</div>
  </div>

</div>`;

const colDireita = html`<div class="col-direita">

  <!-- Mapa da Lateralidade -->
  <div class="painel">
    <div class="painel-titulo">Mapa da Lateralidade</div>
    <div class="painel-corpo">${lateralidadeContainer}</div>
  </div>

  <!-- Análise Comportamental -->
  <div class="painel">
    <div class="painel-titulo">Análise Comportamental</div>
    <div class="painel-corpo">${phComportamental}</div>
  </div>

  <!-- Evolução por sessão -->
  <div class="painel">
    <div class="painel-titulo">Evolução por Sessão</div>
    <div class="painel-corpo">${evolucaoContainer}</div>
  </div>


  <!-- Sessões recentes -->
  <div class="painel">
    <div class="painel-titulo">Sessões Recentes</div>
    <div class="painel-corpo">${sessionListEl}</div>
  </div>

</div>`;

display(html`<div class="perfil-layout">${colEsquerda}${colCentro}${colDireita}</div>`);

// ── Carga inicial ─────────────────────────────────────────────────────────
await carregarAluno(estado.idAluno);
```
