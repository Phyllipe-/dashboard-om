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

  /* Seção de análise — espelha colunas do perfil-layout para alinhar com colCentro */
  .analise-section { display:grid; grid-template-columns:260px 1fr 380px; gap:1rem; margin-top:1rem; }
  .analise-section-corpo { grid-column:2/3; }
  @media(max-width:1100px) { .analise-section { grid-template-columns:220px 1fr; } }
  @media(max-width:700px)  { .analise-section { grid-template-columns:1fr; } .analise-section-corpo { grid-column:1/-1; } }

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
  .sel-select:focus { border-color:var(--om-accent); }

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
  .filtro-check input[type=checkbox] { accent-color:var(--om-accent); width:14px; height:14px; }
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
  .bar-fill  { height:100%; border-radius:3px; background:var(--om-accent); transition:width .4s; }
  .bar-count { width:36px; text-align:right; font-size:.78rem; color:var(--theme-foreground-muted); }

  /* ── Detalhes da atividade ────────────────────── */
  .session-list { display:flex; flex-direction:column; gap:.3rem; }
  .mapa-group { margin-bottom:.2rem; }
  .mapa-header {
    display:flex; align-items:center; gap:.65rem;
    padding:.4rem .65rem; border-radius:6px;
    border:1px solid transparent; font-size:.82rem;
  }
  .mapa-header:hover { background:var(--theme-background-alt); }
  .mapa-sessoes { display:flex; flex-direction:column; padding:.1rem .65rem .2rem 2.1rem; }
  .mapa-sessao-row { display:flex; align-items:center; gap:.65rem; font-size:.78rem; color:var(--theme-foreground-muted); padding:.18rem 0; border-bottom:1px solid var(--theme-foreground-faintest); }
  .mapa-sessao-row:last-child { border-bottom:none; }
  .si-count { color:var(--theme-foreground-muted); font-size:.76rem; flex-shrink:0; }
  .si-id { color:var(--theme-foreground-faint); font-size:.72rem; }
  .session-item {
    display:flex; align-items:center; gap:.65rem;
    padding:.4rem .65rem; border-radius:6px;
    border:1px solid var(--theme-foreground-faintest);
    font-size:.82rem; cursor:pointer; transition:background .12s;
  }
  .session-item:hover, .session-item.ativa { background:var(--theme-background-alt); }
  .session-item.ativa { border-color:var(--om-accent); }
  .si-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .si-nome { flex:1; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .si-data { color:var(--theme-foreground-muted); font-size:.76rem; flex-shrink:0; }
  .si-link { font-size:.76rem; font-weight:600; color:var(--om-accent); text-decoration:none; flex-shrink:0; }
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
  .giro-btn.active { background:#1e293b; color:#fff; border-color:#1e293b; }
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
  .filtro-sessoes-row select:focus { border-color:var(--om-accent); }
  .filtro-concl-btns { display:flex; gap:.35rem; }
  .filtro-concl-btns button {
    flex:1; padding:.28rem .4rem;
    border-radius:16px; border:1px solid var(--theme-foreground-faint);
    background:transparent; color:var(--theme-foreground);
    font-size:.75rem; cursor:pointer; white-space:nowrap;
  }
  .filtro-concl-btns button.active {
    background:#1e293b; color:#fff;
    border-color:#1e293b;
  }
  .filtro-badge {
    font-size:.75rem; font-weight:700; text-align:right;
    color:var(--theme-foreground-muted);
    padding:.2rem 0 0;
  }
  .filtro-badge span { color:var(--om-accent); }

  /* ── Toggle "Análise por Mapa" ────────────────────── */
  /* Cards de análise por mapa */
  .analise-grid { display:flex; flex-direction:column; gap:1rem; margin-top:1rem; }
  .analise-section-direita { grid-column:3/4; display:flex; flex-direction:column; gap:1rem; margin-top:1rem; }
  @media(max-width:1100px) { .analise-section-direita { grid-column:2/3; } }
  @media(max-width:700px)  { .analise-section-direita { grid-column:1/-1; } }
  .analise-card { border:1px solid var(--theme-foreground-faintest); border-radius:10px; overflow:hidden; }
  .analise-card-header { display:flex; align-items:center; justify-content:space-between; padding:.65rem 1rem; background:var(--theme-background-alt); border-bottom:1px solid var(--theme-foreground-faintest); }
  .analise-card-title { font-size:.875rem; font-weight:700; }
  .analise-card-body { padding:.85rem 1rem; font-size:.875rem; }
  .no-data-card { color:var(--theme-foreground-muted); font-style:italic; font-size:.85rem; padding:.3rem 0; }

  .multi-analise-toggle {
    width:100%; display:flex; align-items:center; justify-content:space-between;
    padding:.3rem .55rem; border-radius:8px;
    border:1px solid var(--theme-foreground-faint);
    background:transparent; cursor:pointer;
    font-size:.78rem; color:var(--theme-foreground-muted);
    gap:.5rem; margin:.5rem 0 .3rem;
    transition:border-color .15s, background .15s;
  }
  .multi-analise-toggle.on {
    border-color:var(--om-accent);
    background:color-mix(in srgb, var(--om-accent) 10%, transparent);
    color:var(--theme-foreground);
  }
  .multi-toggle-knob {
    position:relative; width:32px; height:18px; border-radius:9px;
    background:var(--theme-foreground-faintest); flex-shrink:0;
    transition:background .15s;
  }
  .multi-toggle-knob::after {
    content:""; position:absolute; top:3px; left:3px;
    width:12px; height:12px; border-radius:50%;
    background:var(--theme-foreground-muted);
    transition:transform .15s, background .15s;
  }
  .multi-analise-toggle.on .multi-toggle-knob { background:var(--om-accent); }
  .multi-analise-toggle.on .multi-toggle-knob::after { transform:translateX(14px); background:#fff; }

  .multi-analise-list {
    display:flex; flex-direction:column; gap:0;
    max-height:300px; overflow-y:auto;
    margin:.2rem 0 .35rem;
    border:1px solid var(--theme-foreground-faintest); border-radius:8px;
  }
  .multi-mapa-group { border-bottom:1px solid var(--theme-foreground-faintest); }
  .multi-mapa-group:last-child { border-bottom:none; }
  .multi-mapa-header {
    display:flex; align-items:center; gap:.55rem;
    padding:.3rem .65rem .2rem; font-size:.76rem; font-weight:700;
    background:var(--theme-background-alt);
    cursor:pointer; user-select:none;
  }
  .multi-mapa-header:hover { filter:brightness(0.97); }
  .multi-mapa-group.open .multi-mapa-header { border-bottom:1px solid var(--theme-foreground-faintest); }
  .multi-mapa-arrow { font-size:.55rem; color:var(--theme-foreground-muted); flex-shrink:0; transition:transform .18s; }
  .multi-mapa-group.open .multi-mapa-arrow { transform:rotate(90deg); }
  .multi-sessoes-body { display:none; }
  .multi-mapa-group.open .multi-sessoes-body { display:block; }
  .multi-mapa-chk { accent-color:var(--om-accent); flex-shrink:0; cursor:pointer; }
  .multi-sessao-row {
    display:flex; align-items:center; gap:.5rem;
    font-size:.78rem; color:var(--theme-foreground-muted);
    padding:.2rem .65rem; border-bottom:1px solid var(--theme-foreground-faintest);
    cursor:pointer;
  }
  .multi-sessao-row:last-child { border-bottom:none; }
  .multi-sessao-row:hover { background:var(--theme-background-alt); }
  .multi-sessao-row input[type=checkbox] { accent-color:var(--om-accent); flex-shrink:0; }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAlunos, fetchAluno, fetchSessoes, fetchSessao, fetchAnalises, fetchMetricas, fetchPreferenciasQuadros } from "../api.js";
import * as Plot from "npm:@observablehq/plot";
import * as d3   from "npm:d3";
import { detectarGiros, MARCADORES_GIRO } from "../lib/sessao/giros.js";
import { contarMovimentos, heatTilesParaRects, corHeatmap, PALETA_HEATMAP } from "../lib/sessao/heatmap.js";
import { extrairSegmentos, extrairColisoes, corSegmento, raioColisao } from "../lib/sessao/colisao.js";
import { extrairLateralidade, corpoSVGElement, COR_DIREITA as LAT_COR_DIR, COR_ESQUERDA as LAT_COR_ESQ } from "../lib/sessao/lateralidade.js";
import { parseMapaXML } from "../lib/mapa/parser.js";
import { mapaParaGeoJSON } from "../lib/mapa/geojson.js";
import {
  graficoLateralidade,
  graficoTrafego,
  graficoGiros,
  graficoGirosTreemap,
  graficoEvolucaoLongitudinal,
  graficoEficienciaRota,
} from "../lib/sessao/detalhamento.js";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

// ── Preferências de quadros (visibilidade por padrão ou customizada) ──────────
let _prefMap = {};       // chave → visivel
let _sessaoUnicaMap = {}; // chave → exclusivo_sessao_unica
try {
  const prefs = await fetchPreferenciasQuadros();
  for (const p of prefs) {
    _prefMap[p.chave] = p.visivel;
    if (p.exclusivo_sessao_unica) _sessaoUnicaMap[p.chave] = true;
  }
} catch(_) {}

function _visivel(chave) {
  return _prefMap[chave] !== undefined ? _prefMap[chave] : true;
}
function _exclusivoSessaoUnica(chave) {
  return !!_sessaoUnicaMap[chave];
}

function aplicarVisibilidade() {
  document.querySelectorAll("[data-quadro-chave]").forEach(el => {
    const chave = el.dataset.quadroChave;
    el.style.display = (_visivel(chave) && !(_exclusivoSessaoUnica(chave) && multiAnalise)) ? "" : "none";
  });
}

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
  sessoesMultiSelecionadas: [],  // ids selecionados no modo multi-análise
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
[chkObjetos, chkMoveis, chkInicio].forEach(c => c.addEventListener("change", () => {
  const sy = window.scrollY;
  if (giroState.camadas) renderizarMapaGiros();
  if (giroState.camadas) renderizarHeatmap();
  if (giroState.camadas) renderizarColisao();
  if (giroState.camadas) renderizarDwell();
  if (giroState.camadas) renderizarReplay();
  requestAnimationFrame(() => window.scrollTo({ top: sy, behavior: "instant" }));
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

// ── Toggle "Análise por Mapa" ─────────────────────────────────────────────
const multiAnaliseBtn = document.createElement("button");
multiAnaliseBtn.className = "multi-analise-toggle";
multiAnaliseBtn.type = "button";
{ const lbl = document.createElement("span"); lbl.textContent = "Sessões Múltiplas";
  const knob = document.createElement("span"); knob.className = "multi-toggle-knob";
  multiAnaliseBtn.append(lbl, knob); }

const multiAnaliseContainer = document.createElement("div");
multiAnaliseContainer.className = "multi-analise-list";
multiAnaliseContainer.style.display = "none";

let multiAnalise = false;

function setMultiAnalise(val) {
  multiAnalise = val;
  if (!val) estado.sessoesMultiSelecionadas = [];
  multiAnaliseBtn.classList.toggle("on", val);
  filtroSessaoSelect.disabled = val;
  filtroSessaoSelect.style.opacity = val ? "0.4" : "";
  multiAnaliseContainer.style.display = val ? "" : "none";
  if (val) atualizarMultiAnaliseList();
  document.querySelectorAll("[data-quadro-chave]").forEach(el => {
    const chave = el.dataset.quadroChave;
    if (_exclusivoSessaoUnica(chave)) {
      el.style.display = (val || !_visivel(chave)) ? "none" : "";
    }
  });
}

function atualizarMultiAnaliseList() {
  multiAnaliseContainer.replaceChildren();
  const { sessoes, filtroConcl } = estado;

  if (!sessoes.length) {
    const hint = document.createElement("div");
    hint.style.cssText = "font-size:.78rem;color:var(--theme-foreground-muted);font-style:italic;padding:.5rem .7rem;";
    hint.textContent = "Nenhuma sessão disponível.";
    multiAnaliseContainer.append(hint); return;
  }

  const grupos = new Map();
  for (const s of sessoes) {
    if (filtroConcl === "concluidas"     && !s.cleared_map) continue;
    if (filtroConcl === "nao_concluidas" &&  s.cleared_map) continue;
    const key = s.nome_mapa ?? "—";
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key).push(s);
  }

  const mapaAtivo = estado.sessoesMultiSelecionadas.length > 0 ? estado.filtroMapa : null;

  function triggerUpdate() {
    const sel = estado.sessoesMultiSelecionadas;
    const mapaAtual = sel.length > 0
      ? (estado.sessoes.find(ss => ss.id_log === sel[0])?.nome_mapa ?? "todas")
      : "todas";
    estado.filtroMapa     = mapaAtual;
    estado.filtroSessaoId = sel.length ? sel[sel.length - 1] : null;
    filtroMapaSelect.value = estado.filtroMapa;
    const n = sel.length;
    filtroBadge.innerHTML = n
      ? `<span>${n}</span> sess${n > 1 ? "ões" : "ão"} selecionada${n > 1 ? "s" : ""}`
      : "Nenhuma sessão selecionada";
    const filtradas = sessoesFiltradas();
    atualizarStats(filtradas);
    atualizarAnaliseBar(filtradas);
    atualizarSessionList(filtradas);

    if (estado.filtroSessaoId) carregarMapaGiros(estado.filtroSessaoId);
    atualizarDetalhesPorMapa().catch(e => console.error("atualizarDetalhesPorMapa:", e));
  }

  let cidx = 0;
  for (const [nomeMapa, sessoesDoMapa] of grupos) {
    const cor = COR_SESSAO[cidx % COR_SESSAO.length]; cidx++;
    const isOpen = nomeMapa === mapaAtivo || grupos.size === 1;
    const idsDoMapa = sessoesDoMapa.map(s => s.id_log);

    const group = document.createElement("div");
    group.className = "multi-mapa-group" + (isOpen ? " open" : "");

    // ── Cabeçalho ──────────────────────────────────────────────────────────
    const mapaHdr = document.createElement("div");
    mapaHdr.className = "multi-mapa-header";

    const arrow = document.createElement("span");
    arrow.className = "multi-mapa-arrow";
    arrow.textContent = "▶";

    const dot = document.createElement("div");
    dot.style.cssText = `width:7px;height:7px;border-radius:50%;background:${cor};flex-shrink:0;`;

    const nm = document.createElement("span");
    nm.textContent = nomeMapa;
    nm.style.color = cor;

    const ct = document.createElement("span");
    ct.style.cssText = "font-weight:400;color:var(--theme-foreground-muted);font-size:.72rem;margin-right:auto;";
    ct.textContent = `${sessoesDoMapa.length} sess${sessoesDoMapa.length !== 1 ? "ões" : "ão"}`;

    const hdrChk = document.createElement("input");
    hdrChk.type = "checkbox";
    hdrChk.className = "multi-mapa-chk";
    hdrChk.dataset.mapa = nomeMapa;
    hdrChk.title = "Selecionar todas as sessões deste mapa";

    const updateHdrState = () => {
      const nSel = idsDoMapa.filter(id => estado.sessoesMultiSelecionadas.includes(id)).length;
      hdrChk.checked       = nSel > 0 && nSel === idsDoMapa.length;
      hdrChk.indeterminate = nSel > 0 && nSel < idsDoMapa.length;
    };
    updateHdrState();

    mapaHdr.append(arrow, dot, nm, ct, hdrChk);

    // ── Sessões ────────────────────────────────────────────────────────────
    const body = document.createElement("div");
    body.className = "multi-sessoes-body";

    for (const s of sessoesDoMapa) {
      const row = document.createElement("label");
      row.className = "multi-sessao-row";

      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.dataset.mapa = nomeMapa;
      chk.checked = estado.sessoesMultiSelecionadas.includes(s.id_log);

      const dataEl = document.createElement("span"); dataEl.className = "si-data";
      dataEl.textContent = s.data?.slice(0,10) ?? "—";
      const idEl = document.createElement("span"); idEl.className = "si-id";
      idEl.textContent = `#${s.id_log}`;
      const badgeWrap = document.createElement("span");
      badgeWrap.style.cssText = "flex:1;display:flex;justify-content:flex-end;";
      const badge = document.createElement("span");
      badge.className = s.cleared_map ? "badge-ok" : "badge-no";
      badge.style.cssText = "font-size:.62rem;padding:.05rem .35rem;";
      badge.textContent = s.cleared_map ? "Concluída" : "Não concluída";
      badgeWrap.append(badge);

      row.append(chk, dataEl, idEl, badgeWrap);

      chk.addEventListener("change", () => {
        if (chk.checked) {
          multiAnaliseContainer.querySelectorAll("input[type=checkbox]").forEach(other => {
            if (other.dataset.mapa !== nomeMapa) other.checked = false;
          });
          estado.sessoesMultiSelecionadas = estado.sessoesMultiSelecionadas
            .filter(id => estado.sessoes.find(ss => ss.id_log === id && ss.nome_mapa === nomeMapa));
          if (!estado.sessoesMultiSelecionadas.includes(s.id_log)) {
            estado.sessoesMultiSelecionadas = [...estado.sessoesMultiSelecionadas, s.id_log];
          }
        } else {
          estado.sessoesMultiSelecionadas = estado.sessoesMultiSelecionadas.filter(id => id !== s.id_log);
        }
        updateHdrState();
        triggerUpdate();
      });

      body.append(row);
    }

    // Accordion: clique no cabeçalho (mas não no checkbox)
    mapaHdr.addEventListener("click", (e) => {
      if (e.target === hdrChk) return;
      group.classList.toggle("open");
    });

    // Checkbox do cabeçalho: selecionar/desselecionar todas as sessões do mapa
    hdrChk.addEventListener("change", (e) => {
      e.stopPropagation();
      multiAnaliseContainer.querySelectorAll("input[type=checkbox]").forEach(other => {
        if (other.dataset.mapa !== nomeMapa) other.checked = false;
      });
      estado.sessoesMultiSelecionadas = estado.sessoesMultiSelecionadas
        .filter(id => estado.sessoes.find(ss => ss.id_log === id && ss.nome_mapa === nomeMapa));

      if (hdrChk.checked) {
        body.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = true);
        estado.sessoesMultiSelecionadas = [...new Set([...estado.sessoesMultiSelecionadas, ...idsDoMapa])];
        group.classList.add("open");
      } else {
        body.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false);
        estado.sessoesMultiSelecionadas = [];
      }
      updateHdrState();
      triggerUpdate();
    });

    group.append(mapaHdr, body);
    multiAnaliseContainer.append(group);
  }
}

multiAnaliseBtn.addEventListener("click", () => setMultiAnalise(!multiAnalise));

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
  for (const { sessao: s } of pool) {
    const op  = document.createElement("option");
    op.value  = s.id_log;
    const data = s.data?.slice(0, 10) ?? "—";
    const concl = s.cleared_map ? "✓" : "✗";
    op.textContent = `#${s.id_log} — ${s.nome_mapa} (${data}) ${concl}`;
    filtroSessaoSelect.append(op);
  }
  // Se não há sessão selecionada, seleciona a primeira disponível
  if (estado.filtroSessaoId === null && pool.length > 0) {
    estado.filtroSessaoId = pool[0].sessao.id_log;
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
  if (multiAnalise) atualizarMultiAnaliseList();

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
    renderizarDwell();
    renderizarReplay();
    renderizarReplayD3();
    renderizarLateralidade();
    renderizarComportamental();
  }
  atualizarDetalhesPorMapa().catch(e => console.error("atualizarDetalhesPorMapa:", e));
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
    const c = f.geometry.type === "Polygon" ? f.geometry.coordinates[0] : f.geometry.coordinates;
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
  const wallFeature   = getCamada("walls")?.geojson.features[0];
  const wallEdges     = (wallFeature?.geometry.coordinates ?? []).map(([p1, p2]) => ({
    x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
  }));
  const personPoints  = (getCamada("persons")?.geojson.features ?? []).map(f => ({
    x: f.geometry.coordinates[0], y: f.geometry.coordinates[1], label: "Início",
  }));

  // interactive_elements: polígonos com centro e índice numerado (ordenado por distância do início)
  const interRects = mostrarObjetos
    ? sortInterByStart(getCamada("interactive_elements")?.geojson.features ?? [], polyToRect, personPoints[0])
        .map(({ r, cx, cy }, si) => ({ ...r, cx, cy, idx: si + 1 }))
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
  const LEGENDA_W = 140;
  const W = (mapaGirosContainer.getBoundingClientRect().width || 500) - LEGENDA_W - 16;
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
        fill: "none",
        stroke: d => d.areaInterna ? "#cccccc" : "#e0e0e0", strokeWidth: 0.5,
      }),
      Plot.rect(doorRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: "#f0f0f0", stroke: "none",
      }),
      Plot.link(wallEdges, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        stroke: "#3a3a3a", strokeWidth: Math.max(1, scale * 0.07),
      }),
      ...furnRects.length ? [Plot.rect(furnRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: "#b0b0b0", fillOpacity: 0.35, stroke: "#888", strokeWidth: 0.7,
      })] : [],
      // Objetivos da cena: contorno verde (sem fill) — tamanho reduzido 50%
      ...interRects.length ? [
        Plot.rect(interRects.map(r => {
          const mx = (r.x1 + r.x2) / 2, my = (r.y1 + r.y2) / 2;
          const hw = (r.x2 - r.x1) * 0.25, hh = (r.y2 - r.y1) * 0.25;
          return { ...r, x1: mx - hw, x2: mx + hw, y1: my - hh, y2: my + hh };
        }), {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          fill: "none",
          stroke: "#5ba85b", strokeWidth: 1.2,
        }),
        Plot.text(interRects, {
          x: "cx", y: "cy",
          text: d => String(d.idx),
          fontSize: Math.max(5, scale * 0.25),
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

  const giroPersonOverlay = personPoints.length ? mkPersonOverlay(personPoints, W2, H2, cols, rows) : null;
  if (giroPersonOverlay && !chkInicio.checked) giroPersonOverlay.style.display = "none";

  // ── Wrapper: mapa + legenda lado a lado ───────────────────────────────
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;align-items:flex-start;gap:10px;width:100%;";
  const giroChartWrap = document.createElement("div");
  giroChartWrap.style.cssText = "position:relative;flex-shrink:0;";
  giroChartWrap.append(chart);
  if (giroPersonOverlay) giroChartWrap.append(giroPersonOverlay);
  wrapper.append(giroChartWrap);

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
  legend.style.cssText = `flex-shrink:0;width:${LEGENDA_W}px;
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

  // ── Legenda de ponto inicial ─────────────────────────────────────────────
  if (personPoints.length) {
    const sepIn = document.createElement("div");
    sepIn.style.cssText = "border-top:1px solid var(--theme-foreground-faintest);margin:4px 0;";
    legend.append(sepIn);
    const rowIn = document.createElement("div");
    rowIn.style.cssText = "display:flex;align-items:center;gap:6px;cursor:pointer;padding:2px 4px;border-radius:4px;";
    const dotIn = document.createElement("div");
    dotIn.style.cssText = "width:9px;height:9px;border-radius:50%;background:#222;flex-shrink:0;border:1.5px solid #fff;box-shadow:0 0 0 1px #222;";
    const lblIn = document.createElement("span");
    lblIn.style.cssText = "font-size:.7rem;font-weight:600;color:var(--theme-foreground-muted);white-space:nowrap;";
    lblIn.textContent = "Ponto Inicial";
    rowIn.append(dotIn, lblIn);
    if (giroPersonOverlay) {
      let _show = chkInicio.checked;
      rowIn.style.opacity = _show ? "1" : "0.35";
      rowIn.addEventListener("click", () => {
        _show = !_show;
        giroPersonOverlay.style.display = _show ? "" : "none";
        rowIn.style.opacity = _show ? "1" : "0.35";
      });
    }
    legend.append(rowIn);
  }

  // ── Objetivos da cena (agrupados na legenda) ──────────────────────────────
  const allInterRects = sortInterByStart(getCamada("interactive_elements")?.geojson.features ?? [], polyToRect, personPoints[0])
    .map(({ r, cx, cy }, si) => {
      const logObj = giroState.dadosLog?.objectives?.[si] ?? null;
      const nome = logObj?.objectiveName ?? `Objetivo ${si + 1}`;
      const concluido = logObj ? (logObj.endTime ?? 0) > 0 : false;
      return { ...r, cx, cy, idx: si + 1, nome, concluido, logObj };
    });

  const sepObj = document.createElement("div");
  sepObj.style.cssText = "border-top:1px solid var(--theme-foreground-faintest);margin:4px 0;";
  legend.append(sepObj);

  const lblObj = document.createElement("div");
  lblObj.style.cssText = "font-size:.65rem;font-weight:700;color:var(--theme-foreground-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;";
  lblObj.textContent = "Objetivos";
  legend.append(lblObj);

  if (allInterRects.length === 0) {
    const vazio = document.createElement("span");
    vazio.style.cssText = "font-size:.72rem;color:var(--theme-foreground-muted);font-style:italic;";
    vazio.textContent = "Nenhum objetivo no mapa";
    legend.append(vazio);
  } else {
    allInterRects.forEach(obj =>
      legend.append(mkObjLegendaRow(obj.logObj, obj.idx))
    );
  }

  wrapper.append(legend);
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
    const c = f.geometry.type === "Polygon" ? f.geometry.coordinates[0] : f.geometry.coordinates;
    return { x1: c[0][0], y1: c[2][1], x2: c[2][0], y2: c[0][1], ...f.properties };
  };
  const floorRects = (getCamada("floor")?.geojson.features ?? []).map(polyToRect);
  const doorRects  = (getCamada("door_and_windows")?.geojson.features ?? []).map(polyToRect);
  const wallFeature   = getCamada("walls")?.geojson.features[0];
  const wallEdges     = (wallFeature?.geometry.coordinates ?? []).map(([p1, p2]) => ({
    x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
  }));
  const personPoints  = (getCamada("persons")?.geojson.features ?? []).map(f => ({
    x: f.geometry.coordinates[0], y: f.geometry.coordinates[1], label: "Início",
  }));

  // interactive_elements numerados (responde ao chkObjetos)
  const mostrarObjetos = chkObjetos.checked;
  const mostrarMoveis  = chkMoveis.checked;
  const allInterFeatures = getCamada("interactive_elements")?.geojson.features ?? [];
  const interRects = mostrarObjetos
    ? sortInterByStart(allInterFeatures, polyToRect, personPoints[0])
        .map(({ r, cx, cy }, si) => ({ ...r, cx, cy, idx: si + 1 }))
    : [];
  const furnRects = mostrarMoveis ? [
    ...(getCamada("furniture")?.geojson.features  ?? []),
    ...(getCamada("eletronics")?.geojson.features ?? []),
    ...(getCamada("utensils")?.geojson.features   ?? []),
  ].map(polyToRect) : [];

  // ── Dimensões ─────────────────────────────────────────────────────────────
  const LEGENDA_W = 140; // largura reservada para a legenda lateral
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
        fill: "none",
        stroke: d => d.areaInterna ? "#cccccc" : "#e0e0e0", strokeWidth: 0.5,
      }),
      Plot.rect(doorRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: "#f0f0f0", stroke: "none",
      }),
      // Tiles de calor — azuis com transparência (mapa visível por baixo)
      Plot.rect(heatTiles, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: d => corHeatmap(d.count),
        stroke: "none",
        title: d => `${d.count} ação${d.count > 1 ? "ões" : ""}`,
      }),
      ...furnRects.length ? [Plot.rect(furnRects, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        fill: "#b0b0b0", fillOpacity: 0.35,
        stroke: "#888", strokeWidth: 0.7,
      })] : [],
      Plot.link(wallEdges, {
        x1: "x1", y1: "y1", x2: "x2", y2: "y2",
        stroke: "#3a3a3a", strokeWidth: Math.max(1, scale * 0.07),
      }),
      // Objetivos da cena: contorno verde (sem fill) — tamanho reduzido 50%
      ...interRects.length ? [
        Plot.rect(interRects.map(r => {
          const mx = (r.x1 + r.x2) / 2, my = (r.y1 + r.y2) / 2;
          const hw = (r.x2 - r.x1) * 0.25, hh = (r.y2 - r.y1) * 0.25;
          return { ...r, x1: mx - hw, x2: mx + hw, y1: my - hh, y2: my + hh };
        }), {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          fill: "none",
          stroke: "#5ba85b", strokeWidth: 1.2,
        }),
        Plot.text(interRects, {
          x: "cx", y: "cy",
          text: d => String(d.idx),
          fontSize: Math.max(5, scale * 0.25),
          fill: "#2d6a2d", fontWeight: "bold",
          textAnchor: "middle", dy: "0.35em",
          title: "nomeAmigavel",
        }),
      ] : [],
    ],
  });

  const heatPersonOverlay = personPoints.length ? mkPersonOverlay(personPoints, W2, H2, cols, rows) : null;
  if (heatPersonOverlay && !chkInicio.checked) heatPersonOverlay.style.display = "none";

  // ── Legenda lateral ───────────────────────────────────────────────────────
  const legenda = document.createElement("div");
  legenda.style.cssText = `
    flex-shrink:0;width:${LEGENDA_W}px;
    display:flex;flex-direction:column;gap:0;
    background:var(--theme-background-alt);
    border:1px solid var(--theme-foreground-faintest);
    border-radius:8px;padding:8px 10px 8px;`;

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
  swatchesWrap.style.cssText = "display:flex;gap:4px;align-items:stretch;align-self:center;";

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

  // Label horizontal "N° de Ações"
  const rotLabel = document.createElement("div");
  rotLabel.style.cssText = "align-self:center;font-size:.6rem;color:var(--theme-foreground-muted);margin-top:4px;letter-spacing:.03em;";
  rotLabel.textContent = "N° de Ações";
  legenda.append(rotLabel);

  if (personPoints.length) {
    const sepIn = document.createElement("div");
    sepIn.style.cssText = "border-top:1px solid var(--theme-foreground-faintest);margin:4px 0;";
    const rowIn = document.createElement("div");
    rowIn.style.cssText = "display:flex;align-items:center;gap:5px;margin-top:2px;cursor:pointer;padding:2px 4px;border-radius:4px;";
    const dotIn = document.createElement("div");
    dotIn.style.cssText = "width:9px;height:9px;border-radius:50%;background:#222;flex-shrink:0;border:1.5px solid #fff;box-shadow:0 0 0 1px #222;";
    const lblIn = document.createElement("div");
    lblIn.style.cssText = "font-size:.65rem;color:var(--theme-foreground-muted);";
    lblIn.textContent = "Ponto Inicial";
    rowIn.append(dotIn, lblIn);
    if (heatPersonOverlay) {
      let _show = chkInicio.checked;
      rowIn.style.opacity = _show ? "1" : "0.35";
      rowIn.addEventListener("click", () => {
        _show = !_show;
        heatPersonOverlay.style.display = _show ? "" : "none";
        rowIn.style.opacity = _show ? "1" : "0.35";
      });
    }
    legenda.append(sepIn, rowIn);
  }

  // ── Objetivos da cena (agrupados na legenda) ──────────────────────────────
  const objData = sortInterByStart(allInterFeatures, polyToRect, personPoints[0])
    .map((_, si) => {
      const logObj = giroState.dadosLog?.objectives?.[si] ?? null;
      const nome = logObj?.objectiveName ?? `Objetivo ${si + 1}`;
      return { idx: si + 1, nome, logObj };
    });

  const sepObj = document.createElement("div");
  sepObj.style.cssText = "border-top:1px solid var(--theme-foreground-faintest);margin:4px 0;";
  legenda.append(sepObj);

  const lblObj = document.createElement("div");
  lblObj.style.cssText = "font-size:.65rem;font-weight:700;color:var(--theme-foreground-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;";
  lblObj.textContent = "Objetivos";
  legenda.append(lblObj);

  if (objData.length === 0) {
    const vazio = document.createElement("span");
    vazio.style.cssText = "font-size:.72rem;color:var(--theme-foreground-muted);font-style:italic;";
    vazio.textContent = "Nenhum objetivo no mapa";
    legenda.append(vazio);
  } else {
    objData.forEach(obj =>
      legenda.append(mkObjLegendaRow(obj.logObj, obj.idx))
    );
  }

  // ── Wrapper mapa + legenda ────────────────────────────────────────────────
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;align-items:flex-start;gap:8px;";
  const heatChartWrap = document.createElement("div");
  heatChartWrap.style.cssText = "position:relative;flex-shrink:0;";
  heatChartWrap.append(chart);
  if (heatPersonOverlay) heatChartWrap.append(heatPersonOverlay);
  wrapper.append(heatChartWrap, legenda);
  heatmapContainer.append(wrapper);
}

// ── Mapa de Colisão — checkboxes internos ─────────────────────────────────
const chkColisaoPoints  = Object.assign(document.createElement("input"),  { type: "checkbox", tabIndex: -1 }); chkColisaoPoints.checked  = true;
const chkObjetivosCol   = { checked: true };
chkColisaoPoints.addEventListener("change", () => {
  if (giroState.camadas) {
    const sy = window.scrollY;
    renderizarColisao();
    requestAnimationFrame(() => window.scrollTo({ top: sy, behavior: "instant" }));
  }
});

function renderizarColisao() { try { _renderizarColisao(); } catch(e) { console.error("renderizarColisao:", e); } }
function _renderizarColisao() {
  colisaoContainer.replaceChildren();

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

  const mostrarObjetosCol = chkObjetos.checked;
  const mostrarMoveisCol  = chkMoveis.checked;
  const allInterFeatures = getCamada("interactive_elements")?.geojson.features ?? [];
  const interRectsCol = mostrarObjetosCol
    ? sortInterByStart(allInterFeatures, polyToRect, personPoints[0])
        .map(({ f, r, cx, cy }, si) => {
          const hw = (r.x2 - r.x1) * 0.25, hh = (r.y2 - r.y1) * 0.25;
          return { x1: cx - hw, x2: cx + hw, y1: cy - hh, y2: cy + hh, cx, cy, idx: si + 1, ...f.properties };
        })
    : [];
  const furnRectsCol = mostrarMoveisCol ? [
    ...(getCamada("furniture")?.geojson.features  ?? []),
    ...(getCamada("eletronics")?.geojson.features ?? []),
    ...(getCamada("utensils")?.geojson.features   ?? []),
  ].map(polyToRect) : [];

  // ── Colisões: snap por nome + proximidade ("imã") ────────────────────────
  // Para cada hit individual:
  //   distância efetiva = distância geométrica + penalidade de nome
  // Elementos cujo nome contém tokens do objectID (ou vice-versa) têm
  // penalidade 0 e são preferidos; os demais recebem +1000 (último recurso).
  // Após o snap individual, os pontos são agrupados e a média é calculada.
  {
    // Extrai todos os valores string das propriedades de uma feature como
    // string pesquisável em minúsculas.
    function fNameStr(f) {
      return Object.values(f.properties ?? {})
        .filter(v => typeof v === "string").join(" ").toLowerCase();
    }
    // Penalidade de nome: 0 se algum token do objectID aparece no nameStr
    // ou algum token do nameStr aparece no objectID; 1000 caso contrário.
    function namePenalty(objectID, nameStr) {
      const objLow  = objectID.toLowerCase();
      const objToks = objLow.split(/[_\-\s]+/).filter(t => t.length > 2);
      const nmToks  = nameStr.split(/\s+/).filter(t => t.length > 2);
      const match   = objToks.some(t => nameStr.includes(t))
                   || nmToks.some(t => objLow.includes(t));
      return match ? 0 : 1000;
    }

    // Features de rect com string de nome para matching
    const snapFeatures = [
      ...(getCamada("door_and_windows")?.geojson.features     ?? []),
      ...(getCamada("furniture")?.geojson.features             ?? []),
      ...(getCamada("eletronics")?.geojson.features            ?? []),
      ...(getCamada("utensils")?.geojson.features              ?? []),
      ...(getCamada("interactive_elements")?.geojson.features  ?? []),
    ].map(f => {
      const c = f.geometry.type === "Polygon" ? f.geometry.coordinates[0] : f.geometry.coordinates;
      const xs = c.map(p => p[0]), ys = c.map(p => p[1]);
      return { x1: Math.min(...xs), y1: Math.min(...ys),
               x2: Math.max(...xs), y2: Math.max(...ys), nameStr: fNameStr(f) };
    });
    // Paredes não têm propriedades por segmento; atribuímos um nome sintético.
    const wallNameStr = "wall brick stone fence barrier";

    function nearestOnRect(px, py, r) {
      const cx = Math.max(r.x1, Math.min(r.x2, px));
      const cy = Math.max(r.y1, Math.min(r.y2, py));
      return [cx, cy, Math.hypot(px - cx, py - cy)];
    }
    function nearestOnSeg(px, py, x1, y1, x2, y2) {
      const dx = x2 - x1, dy = y2 - y1, len2 = dx*dx + dy*dy;
      if (len2 === 0) return [x1, y1, Math.hypot(px - x1, py - y1)];
      const t = Math.max(0, Math.min(1, ((px - x1)*dx + (py - y1)*dy) / len2));
      const nx = x1 + t*dx, ny = y1 + t*dy;
      return [nx, ny, Math.hypot(px - nx, py - ny)];
    }

    const MAX_SNAP = 2.0; // tiles — limiar geométrico máximo para aceitar o snap
    const colGrupos = new Map();
    for (const obj of dadosLog?.objectives ?? []) {
      for (const c of obj.collisions ?? []) {
        const key = c.objectID ?? "";
        let px = c.position?.x ?? 0;
        let py = (c.position?.z ?? 0) - rows;

        let bestEff = Infinity, bestGeo = Infinity, bestX = px, bestY = py;
        for (const r of snapFeatures) {
          const [cx, cy, geo] = nearestOnRect(px, py, r);
          const eff = geo + namePenalty(key, r.nameStr);
          if (eff < bestEff) { bestEff = eff; bestGeo = geo; bestX = cx; bestY = cy; }
        }
        for (const e of wallEdges) {
          const [nx, ny, geo] = nearestOnSeg(px, py, e.x1, e.y1, e.x2, e.y2);
          const eff = geo + namePenalty(key, wallNameStr);
          if (eff < bestEff) { bestEff = eff; bestGeo = geo; bestX = nx; bestY = ny; }
        }
        if (bestGeo <= MAX_SNAP) { px = bestX; py = bestY; }

        if (!colGrupos.has(key)) colGrupos.set(key, { sumX: 0, sumY: 0, count: 0 });
        const g = colGrupos.get(key);
        g.sumX += px; g.sumY += py; g.count++;
      }
    }
    var colisoes = [...colGrupos.entries()].map(([objectID, g]) => ({
      geoX: g.sumX / g.count, geoY: g.sumY / g.count,
      count: g.count, objectID,
    }));
  }

  // ── Dimensões ─────────────────────────────────────────────────────────────
  const LEGENDA_W = 140;
  const W     = (colisaoContainer.getBoundingClientRect().width || 500) - LEGENDA_W - 16;
  const scale = Math.min((W - 8) / cols, 480 / rows);
  const W2    = Math.round(cols * scale);
  const H2    = Math.round(rows * scale);
  const dotR    = 2;  // raio dos nós da trajetória (diâmetro 4px fixo)
  const maxCount = colisoes.length ? Math.max(...colisoes.map(c => c.count)) : 1;
  const rMin = Math.max(2, scale * 0.12);   // ~12% do tile, mínimo legível
  const rMax = Math.max(rMin, scale * 0.42); // ~42% do tile — cabe dentro do tile
  const colRadius = count => maxCount <= 1
    ? rMin
    : rMin + (rMax - rMin) * Math.sqrt((count - 1) / (maxCount - 1));

  // ── Plot ─────────────────────────────────────────────────────────────────
  let selColMult = null;
  function colBand(count) { return count === 1 ? 1 : count <= 4 ? 2 : 3; }

  function buildColChart(sc) {
    const colVis = sc === null ? colisoes : colisoes.filter(c => colBand(c.count) === sc);
    return Plot.plot({
      width: W2, height: H2,
      marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0,
      x: { domain: [0, cols], axis: null },
      y: { domain: [-rows, 0], axis: null },
      style: { background: "transparent", overflow: "visible" },
      marks: [
        // Mapa base
        Plot.rect(floorRects, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          fill: "none",
          stroke: d => d.areaInterna ? "#cccccc" : "#e0e0e0", strokeWidth: 0.5,
        }),
        Plot.rect(doorRects, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          fill: "#f0f0f0", stroke: "none",
        }),
        ...furnRectsCol.length ? [Plot.rect(furnRectsCol, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          fill: "#b0b0b0", fillOpacity: 0.35,
          stroke: "#888", strokeWidth: 0.7,
        })] : [],
        // Trajetórias ortogonais
        ...segmentos.length ? [Plot.link(segmentos, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          stroke:      d => corHeatmap(d.count),
          strokeWidth: 12,
          strokeLinecap: "butt",
          title: d => `${d.count} travessia${d.count > 1 ? "s" : ""}`,
        })] : [],
        // Paredes (sobre tudo exceto colisões e objetivos)
        Plot.link(wallEdges, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          stroke: "#3a3a3a", strokeWidth: Math.max(1.5, scale * 0.07),
        }),
        // Objetivos: rect sem fill com contorno verde — tamanho reduzido 50%
        ...interRectsCol.length ? [
          Plot.rect(interRectsCol, {
            x1: "x1", y1: "y1", x2: "x2", y2: "y2",
            fill: "none",
            stroke: "#5ba85b", strokeWidth: 1.2,
          }),
          Plot.text(interRectsCol, {
            x: "cx", y: "cy",
            text: d => String(d.idx),
            fontSize: Math.max(5, scale * 0.25),
            fill: "#2d6a2d", fontWeight: "bold",
            textAnchor: "middle", dy: "0.35em",
          }),
        ] : [],
        // Colisões: círculo vermelho — sem fill, contorno (posição real do log)
        ...chkColisaoPoints.checked && colVis.length ? [
          Plot.dot(colVis, {
            x: "geoX", y: "geoY",
            r: { value: d => colRadius(d.count), scale: null },
            fill: "none",
            stroke: "rgba(200,20,20,0.90)",
            strokeWidth: 1.8,
          }),
          Plot.tip(colVis, Plot.pointer({
            x: "geoX", y: "geoY",
            title: d => `${d.objectID}\n${d.count} colisão${d.count !== 1 ? "ões" : ""}\nX: ${d.geoX.toFixed(1)}  Z: ${(d.geoY + rows).toFixed(1)}`,
          })),
        ] : [],
        // person dot rendered in external overlay
      ],
    });
  }

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
  const trajWrap = document.createElement("div");
  trajWrap.style.cssText = "display:flex;gap:4px;align-items:stretch;align-self:center;";
  const trajSwatchCol = document.createElement("div");
  trajSwatchCol.style.cssText = "display:flex;flex-direction:column;gap:2px;";
  const trajLabelCol = document.createElement("div");
  trajLabelCol.style.cssText = "display:flex;flex-direction:column;gap:2px;justify-content:space-around;";
  for (const entry of [...PALETA_HEATMAP].reverse()) {
    const sw = document.createElement("div");
    sw.style.cssText = `width:22px;height:16px;border-radius:3px;background:${entry.cor};border:1px solid rgba(0,0,0,.1);`;
    trajSwatchCol.append(sw);
    const lbl = document.createElement("div");
    lbl.style.cssText = "font-size:.65rem;color:var(--theme-foreground-muted);line-height:16px;";
    lbl.textContent = entry.label;
    trajLabelCol.append(lbl);
  }
  trajWrap.append(trajSwatchCol, trajLabelCol);
  secTraj.append(trajWrap);
  const trajFooter = document.createElement("div");
  trajFooter.style.cssText = "align-self:center;font-size:.6rem;color:var(--theme-foreground-muted);margin-top:4px;letter-spacing:.03em;";
  trajFooter.textContent = "N° de Passagens";
  secTraj.append(trajFooter);
  legenda.append(secTraj);

  // — Colisões — SVG inline; raios fixos proporcionais 1×/2×/3×
  const secCol = mkSec("Colisões");
  const svgNS = "http://www.w3.org/2000/svg";
  const R_LEG = 4;
  const SZ_LEG = R_LEG * 3 * 2 + 4; // tamanho fixo = maior círculo
  const colLegRows = [];
  const colLegMultipliers = [1, 2, 3];
  for (const { mult, label } of [{ mult: 1, label: "1 colisão" }, { mult: 2, label: "3 colisões" }, { mult: 3, label: "+5 colisões" }]) {
    const r  = R_LEG * mult;
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:6px;padding:3px 4px;border-radius:4px;cursor:pointer;";
    const svg  = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width",  SZ_LEG); svg.setAttribute("height", SZ_LEG);
    svg.style.flexShrink = "0";
    const circ = document.createElementNS(svgNS, "circle");
    circ.setAttribute("cx", SZ_LEG / 2); circ.setAttribute("cy", SZ_LEG / 2);
    circ.setAttribute("r",  r);
    circ.setAttribute("fill",         "none");
    circ.setAttribute("stroke",       "rgba(200,20,20,0.90)");
    circ.setAttribute("stroke-width", "1.8");
    svg.append(circ);
    const lbl = document.createElement("span");
    lbl.style.cssText = "font-size:.68rem;color:var(--theme-foreground-muted);";
    lbl.textContent = label;
    row.append(svg, lbl);
    row.addEventListener("click", () => {
      selColMult = selColMult === mult ? null : mult;
      colLegRows.forEach((r, i) => {
        const m = colLegMultipliers[i];
        r.style.opacity    = selColMult === null || m === selColMult ? "1" : "0.35";
        r.style.background = m === selColMult ? "var(--theme-background)" : "";
        r.style.boxShadow  = m === selColMult ? "inset 0 0 0 2px rgba(200,20,20,0.35)" : "";
      });
      colChartWrap.firstElementChild.replaceWith(buildColChart(selColMult));
    });
    colLegRows.push(row);
    secCol.append(row);
  }
  legenda.append(secCol);

  // — Ponto Inicial —
  if (personPoints.length) {
    const secInicio = document.createElement("div");
    secInicio.style.cssText = "display:flex;flex-direction:column;gap:5px;border-top:1px solid var(--theme-foreground-faintest);padding-top:8px;";
    const inicioRow = document.createElement("div");
    inicioRow.style.cssText = "display:flex;align-items:center;gap:6px;padding:3px 4px;";
    const SZ_INI = 14;
    const svgIni = document.createElementNS(svgNS, "svg");
    svgIni.setAttribute("width", SZ_INI); svgIni.setAttribute("height", SZ_INI);
    svgIni.style.flexShrink = "0";
    const circIni = document.createElementNS(svgNS, "circle");
    circIni.setAttribute("cx", SZ_INI / 2); circIni.setAttribute("cy", SZ_INI / 2);
    circIni.setAttribute("r", "5");
    circIni.setAttribute("fill", "#222");
    circIni.setAttribute("stroke", "#fff");
    circIni.setAttribute("stroke-width", "1.5");
    svgIni.append(circIni);
    const lblIni = document.createElement("span");
    lblIni.style.cssText = "font-size:.68rem;color:var(--theme-foreground-muted);";
    lblIni.textContent = "Ponto Inicial";
    inicioRow.style.cursor = "pointer";
    inicioRow.addEventListener("click", () => {
      if (!colPersonOverlay) return;
      const isHidden = colPersonOverlay.style.display === "none";
      colPersonOverlay.style.display = isHidden ? "" : "none";
      inicioRow.style.opacity    = isHidden ? "1" : "0.35";
      inicioRow.style.background = isHidden ? "" : "var(--theme-background)";
      inicioRow.style.boxShadow  = isHidden ? "" : "inset 0 0 0 2px rgba(34,34,34,0.35)";
    });
    inicioRow.append(svgIni, lblIni);
    secInicio.append(inicioRow);
    legenda.append(secInicio);
  }

  // — Início —
  const colPersonOverlay = personPoints.length ? mkPersonOverlay(personPoints, W2, H2, cols, rows) : null;
  if (colPersonOverlay && !chkInicio.checked) colPersonOverlay.style.display = "none";

  // — Objetivos —
  if (chkObjetivosCol.checked && allInterFeatures.length > 0) {
    const secObj = mkSec("Objetivos");
    secObj.style.borderTop = "1px solid var(--theme-foreground-faintest)";
    secObj.style.paddingTop = "8px";
    sortInterByStart(allInterFeatures, polyToRect, personPoints[0])
      .forEach((_, si) =>
        secObj.append(mkObjLegendaRow(giroState.dadosLog?.objectives?.[si] ?? null, si + 1, "88px"))
      );
    legenda.append(secObj);
  }

  // ── Wrapper ───────────────────────────────────────────────────────────────
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;align-items:flex-start;gap:8px;";
  const colChartWrap = document.createElement("div");
  colChartWrap.style.cssText = "position:relative;flex-shrink:0;";
  colChartWrap.append(buildColChart(null));
  if (colPersonOverlay) colChartWrap.append(colPersonOverlay);
  wrapper.append(colChartWrap, legenda);
  colisaoContainer.append(wrapper);
}

// ── Helper: encontra o objetivo do log que visitou a tile desta feature ──
function objetivoParaFeature(feature, dadosLog, rows) {
  const coords = feature.geometry.type === "Polygon"
    ? feature.geometry.coordinates[0] : feature.geometry.coordinates;
  const xs = coords.map(p => p[0]), ys = coords.map(p => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  let best = null, bestHits = 0;
  for (const obj of dadosLog?.objectives ?? []) {
    let hits = 0;
    for (const a of obj.actions ?? []) {
      if (!a.position) continue;
      const px = Math.round(a.position.x) + 0.5;
      const py = Math.round(a.position.z) - rows + 0.5;
      if (Math.abs(px - cx) <= 1.5 && Math.abs(py - cy) <= 1.5) hits++;
    }
    if (hits > bestHits) { bestHits = hits; best = obj; }
  }
  return best;
}

// ── Helper: linha de objetivo na legenda ──────────────────────────────────
function mkObjLegendaRow(logObj, idx, maxWidth = "130px") {
  const concluido = (logObj?.endTime  ?? 0) > 0;
  const iniciado  = (logObj?.startTime ?? 0) > 0;
  const nome = logObj?.objectiveName ?? `Objetivo ${idx}`;

  const row = document.createElement("div");
  row.style.cssText = "display:flex;align-items:center;gap:6px;";

  // Badge SVG — replica exatamente o visual do mapa (rect sem fill + número)
  const active = concluido || iniciado;
  const badge = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  badge.setAttribute("width", "16"); badge.setAttribute("height", "16");
  badge.style.flexShrink = "0";
  const br = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  br.setAttribute("x", "1.5"); br.setAttribute("y", "1.5");
  br.setAttribute("width", "13"); br.setAttribute("height", "13");
  br.setAttribute("fill", "none");
  br.setAttribute("stroke", active ? "#5ba85b" : "#bbb");
  br.setAttribute("stroke-width", "1.5");
  const bt = document.createElementNS("http://www.w3.org/2000/svg", "text");
  bt.setAttribute("x", "8"); bt.setAttribute("y", "8");
  bt.setAttribute("text-anchor", "middle"); bt.setAttribute("dominant-baseline", "central");
  bt.setAttribute("font-size", "8"); bt.setAttribute("font-weight", "bold");
  bt.setAttribute("fill", active ? "#2d6a2d" : "#aaa");
  bt.textContent = String(idx);
  badge.append(br, bt);

  const nomeEl = document.createElement("span");
  const cor = iniciado ? "var(--theme-foreground)" : "var(--theme-foreground-muted)";
  nomeEl.style.cssText = `font-size:.72rem;color:${cor};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:${maxWidth};`;
  nomeEl.textContent = nome;
  nomeEl.title = nome;

  row.append(badge, nomeEl);
  return row;
}

// ── Helper: ordena features de interactive_elements por distância do ponto inicial ──
function sortInterByStart(features, polyToRectFn, startPt) {
  return features
    .map(f => { const r = polyToRectFn(f); const cx = (r.x1 + r.x2) / 2, cy = (r.y1 + r.y2) / 2; return { f, r, cx, cy }; })
    .sort((a, b) => !startPt ? 0 :
      (Math.abs(a.cx - startPt.x) + Math.abs(a.cy - startPt.y)) -
      (Math.abs(b.cx - startPt.x) + Math.abs(b.cy - startPt.y)));
}

// ── Helper: overlay SVG com ponto inicial ────────────────────────────────
function mkPersonOverlay(personPoints, chartW, chartH, cols, rows) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", chartW); svg.setAttribute("height", chartH);
  svg.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;";
  for (const p of personPoints) {
    const cx = p.x * chartW / cols;
    const cy = -p.y * chartH / rows;
    const c = document.createElementNS(svgNS, "circle");
    c.setAttribute("cx", cx); c.setAttribute("cy", cy); c.setAttribute("r", "5");
    c.setAttribute("fill", "#222"); c.setAttribute("stroke", "#fff"); c.setAttribute("stroke-width", "1.5");
    svg.append(c);
  }
  return svg;
}

// ── Mapa de Permanência ───────────────────────────────────────────────────
function renderizarDwell() { try { _renderizarDwell(); } catch(e) { console.error("renderizarDwell:", e); } }
function _renderizarDwell() {
  dwellContainer.replaceChildren();

  const { camadas, cols, rows, dadosLog } = giroState;
  if (!camadas || cols === 0 || !dadosLog) {
    const hint = document.createElement("div"); hint.className = "giro-hint";
    hint.textContent = "Selecione uma sessão para ver os pontos de permanência.";
    dwellContainer.append(hint); return;
  }

  const objetivos = dadosLog.objectives ?? [];

  function fmtSec(s) {
    return s >= 60 ? `${Math.floor(s/60)}m ${Math.round(s%60)}s` : `${s.toFixed(0)}s`;
  }

  // ── Pré-computar dwell, giros e colisões por tile ─────────────────────────
  const allActions = [];
  for (const obj of objetivos) {
    for (const a of obj.actions ?? []) {
      if (a.position) allActions.push({ ...a, objEndTime: obj.endTime });
    }
  }
  allActions.sort((a, b) => a.timestamp - b.timestamp);

  const dwellMap = new Map();  // "x,z" → segundos
  const turnsMap = new Map();  // "x,z" → contagem de giros
  for (let i = 0; i < allActions.length; i++) {
    const a = allActions[i];
    const key = `${Math.round(a.position.x)},${Math.round(a.position.z)}`;
    const tNext = i + 1 < allActions.length ? allActions[i + 1].timestamp
      : (a.objEndTime > 0 ? a.objEndTime : a.timestamp);
    const dt = tNext - a.timestamp;
    if (dt > 0) dwellMap.set(key, (dwellMap.get(key) ?? 0) + dt);
    if (a.actionType === 1) turnsMap.set(key, (turnsMap.get(key) ?? 0) + 1);
  }

  const colsMap = new Map(); // "x,z" → [{objectID, timestamp}]
  for (const obj of objetivos) {
    for (const c of obj.collisions ?? []) {
      if (!c.position) continue;
      const key = `${Math.round(c.position.x)},${Math.round(c.position.z)}`;
      if (!colsMap.has(key)) colsMap.set(key, []);
      colsMap.get(key).push({ objectID: c.objectID ?? "?", timestamp: c.timestamp });
    }
  }

  const dwellPoints = [];
  for (const [key, totalSec] of dwellMap) {
    if (totalSec < 30) continue;
    const [rawX, rawZ] = key.split(",").map(Number);
    dwellPoints.push({ geoX: rawX + 0.5, geoY: rawZ - rows + 0.5, totalSec, rawX, rawZ,
      cat: totalSec >= 240 ? 2 : totalSec >= 120 ? 1 : 0 });
  }

  if (dwellPoints.length === 0) {
    const hint = document.createElement("div"); hint.className = "giro-hint";
    hint.textContent = "Nenhum ponto de permanência ≥ 30 s encontrado.";
    dwellContainer.append(hint); return;
  }

  const LEGENDA_W = 140;
  const W = (dwellContainer.getBoundingClientRect().width || 500) - LEGENDA_W - 16;
  const scale = W / cols;
  const H = scale * rows;

  const getCamada  = name => camadas.find(c => c.layerName === name);
  const polyToRect = f => {
    const c = f.geometry.type === "Polygon" ? f.geometry.coordinates[0] : f.geometry.coordinates;
    return { x1: c[0][0], y1: c[2][1], x2: c[2][0], y2: c[0][1], ...f.properties };
  };
  const floorRects = (getCamada("floor")?.geojson.features ?? []).map(polyToRect);
  const doorRects  = (getCamada("door_and_windows")?.geojson.features ?? []).map(polyToRect);
  const wallFeature = getCamada("walls")?.geojson.features[0];
  const wallEdges   = (wallFeature?.geometry.coordinates ?? []).map(([p1, p2]) => ({
    x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
  }));
  const dwellPersonPoints = (getCamada("persons")?.geojson.features ?? []).map(f => ({
    x: f.geometry.coordinates[0], y: f.geometry.coordinates[1],
  }));
  const furnRects = chkMoveis.checked ? [
    ...(getCamada("furniture")?.geojson.features  ?? []),
    ...(getCamada("eletronics")?.geojson.features ?? []),
    ...(getCamada("utensils")?.geojson.features   ?? []),
  ].map(polyToRect) : [];
  const interRects = chkObjetos.checked
    ? sortInterByStart(getCamada("interactive_elements")?.geojson.features ?? [], polyToRect, dwellPersonPoints[0])
        .map(({ r, cx, cy }, si) => {
          const hw = (r.x2 - r.x1) * 0.25, hh = (r.y2 - r.y1) * 0.25;
          return { x1: cx - hw, x2: cx + hw, y1: cy - hh, y2: cy + hh, cx, cy, idx: si + 1 };
        })
    : [];

  const CAT_COLORS  = ["#f5c518", "#e07b54", "#c0392b"];
  const CAT_OPACITY = [0.35, 0.50, 0.65];
  const CAT_CLOCK   = Math.max(8, Math.round(scale * 0.38));
  const CAT_LABELS  = ["≥ 30 seg", "≥ 2 min", "+4 min"];

  // ── Sub-painel de detalhes ────────────────────────────────────────────────
  const detailPanel = document.createElement("div");
  detailPanel.style.cssText = "margin-top:10px;background:var(--theme-background-alt);border:1px solid var(--theme-foreground-faintest);border-radius:8px;padding:8px 12px;";

  function renderDetailPanel(header, totalDwell, totalTurns, colItems) {
    const colByObj = new Map();
    for (const c of colItems) colByObj.set(c.objectID, (colByObj.get(c.objectID) ?? 0) + 1);
    detailPanel.replaceChildren();

    const hdr = document.createElement("div");
    hdr.style.cssText = "font-size:.65rem;font-weight:700;color:var(--theme-foreground-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;";
    hdr.textContent = header;
    detailPanel.append(hdr);

    const grid = document.createElement("div");
    grid.style.cssText = "display:flex;gap:16px;flex-wrap:wrap;";

    function mkMetric(label, value) {
      const card = document.createElement("div");
      card.style.cssText = "background:var(--theme-background);border:1px solid var(--theme-foreground-faintest);border-radius:6px;padding:6px 12px;min-width:80px;";
      const v = document.createElement("div");
      v.style.cssText = "font-size:1.1rem;font-weight:700;color:var(--theme-foreground);";
      v.textContent = value;
      const l = document.createElement("div");
      l.style.cssText = "font-size:.62rem;color:var(--theme-foreground-muted);margin-top:1px;";
      l.textContent = label;
      card.append(v, l); return card;
    }

    grid.append(
      mkMetric("T. parado", fmtSec(totalDwell)),
      mkMetric("Giros", totalTurns),
      mkMetric("Colisões", colItems.length),
    );
    detailPanel.append(grid);

    const colHdr = document.createElement("div");
    colHdr.style.cssText = "font-size:.63rem;font-weight:600;color:var(--theme-foreground-muted);margin-top:8px;margin-bottom:4px;";
    colHdr.textContent = "Objetos colididos:";
    detailPanel.append(colHdr);
    if (colByObj.size > 0) {
      const colList = document.createElement("div");
      colList.style.cssText = "display:flex;flex-wrap:wrap;gap:5px;";
      for (const [obj, cnt] of colByObj) {
        const tag = document.createElement("span");
        tag.style.cssText = "font-size:.65rem;background:#c0392b22;color:#c0392b;border:1px solid #c0392b55;border-radius:4px;padding:2px 7px;";
        tag.textContent = cnt > 1 ? `${obj} ×${cnt}` : obj;
        colList.append(tag);
      }
      detailPanel.append(colList);
    } else {
      const noneList = document.createElement("div");
      noneList.style.cssText = "display:flex;flex-wrap:wrap;gap:5px;";
      const none = document.createElement("span");
      none.style.cssText = "font-size:.65rem;background:#88888811;color:#888;border:1px solid #88888844;border-radius:4px;padding:2px 7px;font-style:italic;";
      none.textContent = "Sem objetos colididos";
      noneList.append(none);
      detailPanel.append(noneList);
    }
  }

  function showAllData() {
    let totalDwell = 0, totalTurns = 0;
    const colItems = [];
    for (const v of dwellMap.values()) totalDwell += v;
    for (const v of turnsMap.values()) totalTurns += v;
    for (const items of colsMap.values()) for (const c of items) colItems.push(c);
    renderDetailPanel("Todos as zonas de permanência", totalDwell, totalTurns, colItems);
  }

  function showDetail(dp) {
    let totalDwell = 0, totalTurns = 0;
    const colItems = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const key = `${dp.rawX + dx},${dp.rawZ + dz}`;
        totalDwell += dwellMap.get(key) ?? 0;
        totalTurns += turnsMap.get(key) ?? 0;
        for (const c of colsMap.get(key) ?? []) colItems.push(c);
      }
    }
    renderDetailPanel(`Área (raio 1 tile) — permanência: ${fmtSec(dp.totalSec)}`, totalDwell, totalTurns, colItems);
  }

  showAllData();

  // ── Chart builder (reutilizado a cada clique na legenda) ─────────────────
  const _svgNS = "http://www.w3.org/2000/svg";
  const _cr = Math.max(3, CAT_CLOCK * 0.52);
  let selCat = null;

  function buildChart(sc) {
    const c = Plot.plot({
      width: W, height: H,
      marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0,
      x: { domain: [0, cols], axis: null },
      y: { domain: [-rows, 0], axis: null },
      style: { background: "transparent", overflow: "visible" },
      marks: [
        Plot.rect(floorRects, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          fill: "none", stroke: d => d.areaInterna ? "#cccccc" : "#e0e0e0", strokeWidth: 0.5,
        }),
        Plot.rect(dwellPoints, {
          x1: d => d.rawX, x2: d => d.rawX + 1,
          y1: d => d.rawZ - rows, y2: d => d.rawZ - rows + 1,
          fill: d => CAT_COLORS[d.cat],
          fillOpacity: d => sc === null || d.cat === sc ? CAT_OPACITY[d.cat] : 0.05,
          stroke: "none",
          title: d => fmtSec(d.totalSec),
        }),
        Plot.rect(doorRects, { x1: "x1", y1: "y1", x2: "x2", y2: "y2", fill: "#f0f0f0", stroke: "none" }),
        ...furnRects.length ? [Plot.rect(furnRects, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          fill: "#b0b0b0", fillOpacity: 0.35, stroke: "#888", strokeWidth: 0.7,
        })] : [],
        Plot.link(wallEdges, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          stroke: "#3a3a3a", strokeWidth: Math.max(1, scale * 0.07),
        }),
        ...interRects.length ? [
          Plot.rect(interRects, { x1: "x1", y1: "y1", x2: "x2", y2: "y2", fill: "none", stroke: "#5ba85b", strokeWidth: 1.2 }),
          Plot.text(interRects, { x: "cx", y: "cy", text: d => String(d.idx), fontSize: Math.max(5, scale * 0.25), fill: "#2d6a2d", fontWeight: "bold", textAnchor: "middle", dy: "0.35em" }),
        ] : [],
      ],
    });
    for (const dp of dwellPoints) {
      const dim = sc !== null && dp.cat !== sc;
      const cx = dp.geoX * W / cols, cy = (-dp.geoY) * H / rows;
      const face = document.createElementNS(_svgNS, "circle");
      face.setAttribute("cx", cx); face.setAttribute("cy", cy); face.setAttribute("r", _cr);
      face.setAttribute("fill", "#fff"); face.setAttribute("fill-opacity", "0.88");
      face.setAttribute("stroke", "#444"); face.setAttribute("stroke-width", "0.9");
      face.setAttribute("opacity", dim ? "0.15" : "1");
      const hh = document.createElementNS(_svgNS, "line");
      hh.setAttribute("x1", cx); hh.setAttribute("y1", cy);
      hh.setAttribute("x2", cx); hh.setAttribute("y2", cy - _cr * 0.62);
      hh.setAttribute("stroke", "#444"); hh.setAttribute("stroke-width", "1.1");
      hh.setAttribute("stroke-linecap", "round"); hh.setAttribute("opacity", dim ? "0.15" : "1");
      const mh = document.createElementNS(_svgNS, "line");
      mh.setAttribute("x1", cx); mh.setAttribute("y1", cy);
      mh.setAttribute("x2", cx + _cr * 0.62); mh.setAttribute("y2", cy);
      mh.setAttribute("stroke", "#444"); mh.setAttribute("stroke-width", "0.85");
      mh.setAttribute("stroke-linecap", "round"); mh.setAttribute("opacity", dim ? "0.15" : "1");
      c.append(face, hh, mh);
    }
    c.style.cursor = "pointer";
    c.addEventListener("click", (e) => {
      const r = c.getBoundingClientRect();
      const domX = (e.clientX - r.left) * cols / W;
      const domY = -(e.clientY - r.top) * rows / H;
      const hit = dwellPoints.find(dp =>
        domX >= dp.rawX && domX < dp.rawX + 1 &&
        domY >= dp.rawZ - rows && domY < dp.rawZ - rows + 1
      );
      if (hit) showDetail(hit);
    });
    return c;
  }

  function showCategoryData(cat) {
    let totalDwell = 0, totalTurns = 0;
    const colItems = [];
    for (const dp of dwellPoints.filter(d => d.cat === cat)) {
      const key = `${dp.rawX},${dp.rawZ}`;
      totalDwell += dwellMap.get(key) ?? 0;
      totalTurns += turnsMap.get(key) ?? 0;
      for (const c of colsMap.get(key) ?? []) colItems.push(c);
    }
    renderDetailPanel(`Categoria: ${CAT_LABELS[cat]}`, totalDwell, totalTurns, colItems);
  }

  // ── Legenda interativa ────────────────────────────────────────────────────
  const legenda = document.createElement("div");
  legenda.style.cssText = `flex-shrink:0;width:${LEGENDA_W}px;display:flex;flex-direction:column;gap:0;background:var(--theme-background-alt);border:1px solid var(--theme-foreground-faintest);border-radius:8px;padding:8px 10px;`;
  const lblT = document.createElement("div");
  lblT.style.cssText = "font-size:.65rem;font-weight:700;color:var(--theme-foreground-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;";
  lblT.textContent = "Permanência"; legenda.append(lblT);

  const legendRows = [];
  for (let ci = 0; ci < 3; ci++) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:7px;margin-bottom:6px;cursor:pointer;border-radius:4px;padding:2px 4px;transition:opacity .15s;";
    const svgEl = document.createElementNS(_svgNS, "svg");
    svgEl.setAttribute("width", "20"); svgEl.setAttribute("height", "20");
    svgEl.style.cssText = "flex-shrink:0;border-radius:2px;display:block;";
    const rEl = document.createElementNS(_svgNS, "rect");
    rEl.setAttribute("width", "20"); rEl.setAttribute("height", "20");
    rEl.setAttribute("fill", CAT_COLORS[ci]); rEl.setAttribute("fill-opacity", CAT_OPACITY[ci]);
    const lFace = document.createElementNS(_svgNS, "circle");
    lFace.setAttribute("cx", "10"); lFace.setAttribute("cy", "10"); lFace.setAttribute("r", "5");
    lFace.setAttribute("fill", "#fff"); lFace.setAttribute("fill-opacity", "0.88");
    lFace.setAttribute("stroke", "#444"); lFace.setAttribute("stroke-width", "0.9");
    const lHH = document.createElementNS(_svgNS, "line");
    lHH.setAttribute("x1", "10"); lHH.setAttribute("y1", "10");
    lHH.setAttribute("x2", "10"); lHH.setAttribute("y2", "6.9");
    lHH.setAttribute("stroke", "#444"); lHH.setAttribute("stroke-width", "1.1"); lHH.setAttribute("stroke-linecap", "round");
    const lMH = document.createElementNS(_svgNS, "line");
    lMH.setAttribute("x1", "10"); lMH.setAttribute("y1", "10");
    lMH.setAttribute("x2", "13.1"); lMH.setAttribute("y2", "10");
    lMH.setAttribute("stroke", "#444"); lMH.setAttribute("stroke-width", "0.85"); lMH.setAttribute("stroke-linecap", "round");
    svgEl.append(rEl, lFace, lHH, lMH);
    const lbl = document.createElement("span");
    lbl.style.cssText = "font-size:.68rem;color:var(--theme-foreground-muted);";
    lbl.textContent = CAT_LABELS[ci];
    row.append(svgEl, lbl);

    row.addEventListener("click", () => {
      selCat = selCat === ci ? null : ci;
      legendRows.forEach((r, i) => {
        const active = selCat === null || i === selCat;
        r.style.opacity = active ? "1" : "0.35";
        r.style.background = i === selCat ? "var(--theme-background)" : "";
        r.style.boxShadow = i === selCat ? `inset 0 0 0 2px ${CAT_COLORS[i]}55` : "";
      });
      dwellChartWrap.firstElementChild.replaceWith(buildChart(selCat));
      if (selCat === null) showAllData(); else showCategoryData(selCat);
    });

    legendRows.push(row);
    legenda.append(row);
  }

  // — Ponto Inicial —
  const dwellPersonOverlay = dwellPersonPoints.length ? mkPersonOverlay(dwellPersonPoints, W, H, cols, rows) : null;
  if (dwellPersonOverlay && !chkInicio.checked) dwellPersonOverlay.style.display = "none";
  if (dwellPersonPoints.length) {
    const sepIn = document.createElement("div");
    sepIn.style.cssText = "border-top:1px solid var(--theme-foreground-faintest);margin:6px 0 4px;";
    legenda.append(sepIn);
    const rowIn = document.createElement("div");
    rowIn.style.cssText = "display:flex;align-items:center;gap:7px;cursor:pointer;padding:2px 4px;border-radius:4px;";
    const dotIn = document.createElement("div");
    dotIn.style.cssText = "width:9px;height:9px;border-radius:50%;background:#222;flex-shrink:0;border:1.5px solid #fff;box-shadow:0 0 0 1px #222;";
    const lblIn = document.createElement("span");
    lblIn.style.cssText = "font-size:.68rem;color:var(--theme-foreground-muted);";
    lblIn.textContent = "Ponto Inicial";
    rowIn.append(dotIn, lblIn);
    let _show = chkInicio.checked;
    rowIn.style.opacity = _show ? "1" : "0.35";
    rowIn.addEventListener("click", () => {
      _show = !_show;
      dwellPersonOverlay.style.display = _show ? "" : "none";
      rowIn.style.opacity = _show ? "1" : "0.35";
    });
    legenda.append(rowIn);
  }

  // — Objetivos —
  const allInterFeatsDwell = getCamada("interactive_elements")?.geojson.features ?? [];
  if (allInterFeatsDwell.length > 0) {
    const sepObj = document.createElement("div");
    sepObj.style.cssText = "border-top:1px solid var(--theme-foreground-faintest);margin:6px 0 4px;";
    legenda.append(sepObj);
    const lblObjD = document.createElement("div");
    lblObjD.style.cssText = "font-size:.65rem;font-weight:700;color:var(--theme-foreground-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;";
    lblObjD.textContent = "Objetivos";
    legenda.append(lblObjD);
    sortInterByStart(allInterFeatsDwell, polyToRect, dwellPersonPoints[0])
      .forEach((_, si) =>
        legenda.append(mkObjLegendaRow(dadosLog?.objectives?.[si] ?? null, si + 1, "100px"))
      );
  }

  const dwellChartWrap = document.createElement("div");
  dwellChartWrap.style.cssText = "position:relative;flex-shrink:0;";
  dwellChartWrap.append(buildChart(null));
  if (dwellPersonOverlay) dwellChartWrap.append(dwellPersonOverlay);

  const mapRow = document.createElement("div");
  mapRow.style.cssText = "display:flex;align-items:flex-start;gap:8px;";
  mapRow.append(dwellChartWrap, legenda);
  dwellContainer.append(mapRow, detailPanel);
}

// ── Replay de Trajetória ──────────────────────────────────────────────────
function renderizarReplay() { try { _renderizarReplay(); } catch(e) { console.error("renderizarReplay:", e); } }
function _renderizarReplay() {
  if (replayTimer) { clearInterval(replayTimer); replayTimer = null; }
  replayContainer.replaceChildren();

  const { camadas, cols, rows, dadosLog, giros: girosDetectados } = giroState;
  if (!camadas || cols === 0 || !dadosLog) {
    const hint = document.createElement("div"); hint.className = "giro-hint";
    hint.textContent = "Selecione uma sessão para ver o replay de trajetória.";
    replayContainer.append(hint); return;
  }

  const CORES_OBJ = ["#4a90d9","#e07b54","#5ba85b","#c9a227","#9b59b6","#2eaaa8","#e41a1c","#ff7f00"];
  const COR_RETORNO = "#999";
  const objetivos = dadosLog.objectives ?? [];
  const nObj = objetivos.length;
  const mapaFinalizado = dadosLog.results?.clearedMap === true;

  // ── Helpers de mapa (necessários antes da construção dos passos) ─────────────
  const getCamada = name => camadas.find(c => c.layerName === name);
  const polyToRect = f => {
    const c = f.geometry.type === "Polygon" ? f.geometry.coordinates[0] : f.geometry.coordinates;
    return { x1: c[0][0], y1: c[2][1], x2: c[2][0], y2: c[0][1], ...f.properties };
  };
  const allInterFeatures = getCamada("interactive_elements")?.geojson.features ?? [];
  const personPoints = (getCamada("persons")?.geojson.features ?? []).map(f => ({
    x: f.geometry.coordinates[0], y: f.geometry.coordinates[1],
    direcaoIndex: f.properties?.direcaoIndex,
  }));

  // Seta de visão do jogador — definida aqui para que startX/startY (usados na
  // construção de passos) possam referenciar personArrows[0].
  const BASIC_TO_DEG = [270, 315, 0, 45, 90, 135, 180, 225];
  const gpsArrow = {
    draw(context, size) {
      const r = Math.sqrt(size / Math.PI) * 1.1;
      context.moveTo(0, -r * 1.4);
      context.lineTo(r * 0.8, r * 0.9);
      context.lineTo(0, r * 0.3);
      context.lineTo(-r * 0.8, r * 0.9);
      context.closePath();
    }
  };
  const personArrows = personPoints.map(p => ({
    x: p.x, y: p.y,
    heading: BASIC_TO_DEG[p.direcaoIndex] ?? 0,
  }));

  // Cruz de 5 tiles centrada em cada objetivo (para visualização e lógica de corte)
  function inCross(px, py, cx, cy) {
    const dx = Math.abs(px - cx), dy = Math.abs(py - cy);
    return (dx <= 0.5 && dy <= 1.5) || (dy <= 0.5 && dx <= 1.5);
  }

  // ── Sequência de posições ────────────────────────────────────────────────
  // Todas as ações walk de todos os objetivos, ordenadas por timestamp.
  const allActions = [];
  for (const [oi, obj] of objetivos.entries()) {
    for (const a of obj.actions ?? []) {
      if (a.position == null || a.actionType !== 0) continue;
      allActions.push({ ...a, srcObjIdx: oi });
    }
  }
  allActions.sort((a, b) => a.timestamp - b.timestamp);

  // Posição inicial do jogador (primeiro step registrado) em coordenadas de Plot
  const startPx = allActions.length > 0 ? Math.round(allActions[0].position.x) + 0.5 : 0;
  const startPy = allActions.length > 0 ? Math.round(allActions[0].position.z) - rows + 0.5 : 0;

  // Para cada feature interativa do mapa, conta passos dentro da cruz (hits)
  // e determina o cutoff de segmento = último passo da PRIMEIRA visita contígua
  // à cruz (ignora revisitas posteriores que contaminariam o corte de cor).
  const featureStats = allInterFeatures.map((f, fi) => {
    const r = polyToRect(f);
    const cx = (r.x1 + r.x2) / 2, cy = (r.y1 + r.y2) / 2;
    let hits = 0;
    let inVisit = false, firstExitT = null, lastInCrossT = null, visitEnded = false;
    for (const a of allActions) {
      const px = Math.round(a.position.x) + 0.5;
      const py = Math.round(a.position.z) - rows + 0.5;
      const inC = inCross(px, py, cx, cy);
      if (inC) hits++;
      if (!visitEnded) {
        if (inC) { inVisit = true; lastInCrossT = a.timestamp; }
        else if (inVisit) { firstExitT = lastInCrossT; visitEnded = true; }
      }
    }
    // Se a sessão terminou dentro da cruz, usa o último passo registrado
    if (inVisit && !visitEnded) firstExitT = lastInCrossT;
    return { cx, cy, origIdx: fi, hits, lastInCrossT: firstExitT };
  });

  // Seleciona nObj features: prioriza as mais visitadas (hits > 0 = jogador passou
  // pela cruz), completa com não-visitadas apenas se necessário (sessão incompleta).
  // Depois ordena por distância Manhattan do ponto inicial (mais próximo = segmento 0).
  const visited   = featureStats.filter(f => f.hits > 0).sort((a, b) => b.hits - a.hits);
  const unvisited = featureStats.filter(f => f.hits === 0);
  const objCenters = [...visited, ...unvisited]
    .slice(0, nObj)
    .sort((a, b) =>
      (Math.abs(a.cx - startPx) + Math.abs(a.cy - startPy)) -
      (Math.abs(b.cx - startPx) + Math.abs(b.cy - startPy))
    );

  // Cortes de segmento i→i+1: último passo dentro da cruz do objetivo i.
  const cutoffs = objCenters.slice(0, nObj - 1).map(c => c.lastInCrossT ?? Infinity);

  // Retorno ao ponto inicial: começa ao sair da cruz do último objetivo.
  // Fallback: endTime do último objetivo quando cross-zone não foi detectado.
  const lastObjEndTime = objetivos.reduce((maxT, obj) => Math.max(maxT, obj.endTime ?? 0), 0);
  const returnCutoff = nObj > 0 && objCenters[nObj - 1]
    ? (objCenters[nObj - 1].lastInCrossT ?? (mapaFinalizado && lastObjEndTime > 0 ? lastObjEndTime : Infinity))
    : Infinity;


  // Walk + turn em ordem temporal — turns criam passos próprios para que
  // a seta só gire quando o usuário clicar "próximo" naquele passo.
  const allEventsRaw = [];
  for (const [, obj] of objetivos.entries()) {
    for (const a of obj.actions ?? []) {
      if (a.position == null) continue;
      allEventsRaw.push(a);
    }
  }
  allEventsRaw.sort((a, b) => a.timestamp - b.timestamp);

  const passos = [];

  // Turns e walks que ocorrem antes de o jogador sair do tile inicial são tratados
  // como "estado inicial" (step 0) e não entram em passos.
  // • initHeadingOffset: rotação acumulada dos turns iniciais
  let hadFirstWalk  = false;         // true após o jogador sair do tile de partida
  let initHeadingOffset = 0;         // graus acumulados dos turns pré-walk

  // Tile de partida (posição XML do personagem — âncora da linha)
  const startX = personArrows.length > 0 ? personArrows[0].x : null;
  const startY = personArrows.length > 0 ? personArrows[0].y : null;

  let ei = 0;
  while (ei < allEventsRaw.length) {
    const a = allEventsRaw[ei];

    if (a.actionType === 0) {
      let segIdx = 0;
      for (let i = 0; i < cutoffs.length; i++) {
        if (a.timestamp > cutoffs[i]) segIdx = i + 1;
      }
      const isReturn = segIdx === nObj - 1 && a.timestamp > returnCutoff;
      const cor = mapaFinalizado
        ? (isReturn ? COR_RETORNO : CORES_OBJ[segIdx % CORES_OBJ.length])
        : CORES_OBJ[0];
      const nx = Math.round(a.position.x) + 0.5;
      const ny = Math.round(a.position.z) - rows + 0.5;

      // Pula walks no tile de partida enquanto o jogador ainda não saiu de lá
      if (!hadFirstWalk && startX !== null &&
          Math.abs(nx - startX) < 0.01 && Math.abs(ny - startY) < 0.01) {
        ei++; continue;
      }

      const prevP = passos[passos.length - 1];
      if (!prevP || prevP.x !== nx || prevP.y !== ny) {
        passos.push({ x: nx, y: ny, cor, objIdx: segIdx, isTurn: false });
        hadFirstWalk = true;
      }
      ei++;

    } else if (a.actionType === 1) {
      // Conta quantos turns consecutivos têm mesma direção e mesma posição (= um grupo de giro)
      const dir = a.direction;
      const px = a.position?.x ?? 0, pz = a.position?.z ?? 0;
      let count = 0;
      while (
        ei + count < allEventsRaw.length &&
        allEventsRaw[ei + count].actionType === 1 &&
        allEventsRaw[ei + count].direction === dir &&
        Math.abs((allEventsRaw[ei + count].position?.x ?? 0) - px) < 0.1 &&
        Math.abs((allEventsRaw[ei + count].position?.z ?? 0) - pz) < 0.1
      ) count++;

      if (!hadFirstWalk) {
        // Turn inicial (antes de sair do tile de partida): vai para o estado inicial, não para passos
        for (let k = 0; k < count; k++) {
          initHeadingOffset = (initHeadingOffset + (dir === 4 ? 90 : -90) + 360) % 360;
        }
      } else {
        // Turn mid-rota: cria passos próprios (um por evento, herdando posição do paso anterior)
        const prev = passos[passos.length - 1];
        const baseX    = prev ? prev.x      : Math.round(px) + 0.5;
        const baseY    = prev ? prev.y      : Math.round(pz) - rows + 0.5;
        const baseCor  = prev ? prev.cor    : CORES_OBJ[0];
        const baseObjI = prev ? prev.objIdx : 0;
        for (let k = 0; k < count; k++) {
          passos.push({
            x: baseX, y: baseY, cor: baseCor, objIdx: baseObjI,
            isTurn: true, direction: dir,
          });
        }
      }
      ei += count;

    } else {
      ei++;
    }
  }
  // Trecho sintético de retorno: só adicionado quando não há passos reais de retorno
  // (sessão sem AddStartingPoint, ou log encerrado antes do aluno voltar ao início).
  // Quando o retorno foi gravado, os passos reais já têm cor COR_RETORNO e mostram
  // o trajeto real — adicionar âncoras extras causaria uma diagonal artificial.
  const hasRealReturn = mapaFinalizado && passos.some(p => p.cor === COR_RETORNO);
  if (mapaFinalizado && !hasRealReturn && passos.length > 0 && nObj > 0 && objCenters[nObj - 1]) {
    const { cx, cy } = objCenters[nObj - 1];
    const dest = startX !== null ? { x: startX, y: startY } : passos[0];
    passos.push({ x: cx, y: cy, cor: COR_RETORNO, objIdx: nObj - 1 });
    if (Math.abs(cx - dest.x) > 0.5 || Math.abs(cy - dest.y) > 0.5)
      passos.push({ x: dest.x, y: dest.y, cor: COR_RETORNO, objIdx: nObj - 1 });
  }
  const temRetorno = mapaFinalizado && passos.some(p => p.cor === COR_RETORNO);
  if (temRetorno && startX !== null) {
    const lastRW = [...passos].reverse().find(p => p.cor === COR_RETORNO && !p.isTurn);
    if (lastRW) {
      const adx = Math.abs(startX - lastRW.x);
      const ady = Math.abs(startY - lastRW.y);
      if (adx + ady === 1) {
        passos.push({ x: startX, y: startY, cor: COR_RETORNO, objIdx: nObj - 1, isTurn: false });
      }
    }
  }

  // Índices de fim de cada segmento de cor (última posição antes da troca de cor).
  // Usado pelos botões ⏮/⏭ para navegar trecho a trecho.
  // segmentEnds guarda valores de step (não índices de passos):
  // step s = estado após passos[0..s-1] aplicados. O fim de um segmento em passos[i-1]
  // corresponde a step i (inclui aquela ação mas não a próxima).
  const segmentEnds = [];
  for (let i = 1; i < passos.length; i++) {
    if (passos[i].cor !== passos[i - 1].cor) segmentEnds.push(i);
  }
  segmentEnds.push(passos.length);

  if (passos.length === 0) {
    const hint = document.createElement("div"); hint.className = "giro-hint";
    hint.textContent = "Nenhum dado de movimentação nessa sessão.";
    replayContainer.append(hint); return;
  }

  // Âncora de linha: posição XML do personagem. Injetada no início da trail de
  // linha para que o step 1 (primeiro walk real) já tenha 2 pontos → linha visível.
  const lineAnchor = startX !== null
    ? { x: startX, y: startY, cor: passos[0]?.cor ?? CORES_OBJ[0], objIdx: 0 }
    : null;
  // Heading inicial efetivo: heading do XML + rotação dos turns iniciais
  const effectiveInitialH = ((personArrows[0]?.heading ?? 0) + initHeadingOffset + 360) % 360;

  // ── Camadas base ──────────────────────────────────────────────────────────
  const floorRects  = (getCamada("floor")?.geojson.features ?? []).map(polyToRect);
  const doorRects   = (getCamada("door_and_windows")?.geojson.features ?? []).map(polyToRect);
  const wallFeature = getCamada("walls")?.geojson.features[0];
  const wallEdges   = (wallFeature?.geometry.coordinates ?? []).map(([p1, p2]) => ({
    x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
  }));
  // Numeração dos objetivos pelo índice ordenado por distância (mesmo que objCenters)
  const interRects = chkObjetos.checked && mapaFinalizado
    ? objCenters.map((c, sortedIdx) => {
        const r = polyToRect(allInterFeatures[c.origIdx]);
        return { ...r, cx: c.cx, cy: c.cy, idx: sortedIdx + 1 };
      })
    : [];
  const furnRects = chkMoveis.checked ? [
    ...(getCamada("furniture")?.geojson.features  ?? []),
    ...(getCamada("eletronics")?.geojson.features ?? []),
    ...(getCamada("utensils")?.geojson.features   ?? []),
  ].map(polyToRect) : [];

  // ── Dimensões ─────────────────────────────────────────────────────────────
  const LEGENDA_W = 140;
  const W = (replayContainer.getBoundingClientRect().width || 500) - LEGENDA_W - 16;
  const scale = Math.min((W - 8) / cols, 480 / rows);
  const W2 = Math.round(cols * scale);
  const H2 = Math.round(rows * scale);


  // ── Segmentos de cor por objetivo ─────────────────────────────────────────
  function buildSegments(trail) {
    const segs = [];
    let cur = null;
    for (const p of trail) {
      if (!cur || cur.cor !== p.cor) {
        const pts = cur ? [cur.pts[cur.pts.length - 1], p] : [p];
        cur = { cor: p.cor, pts };
        segs.push(cur);
      } else {
        cur.pts.push(p);
      }
    }
    return segs;
  }

  // ── Containers DOM ────────────────────────────────────────────────────────
  const mapDiv = document.createElement("div");

  // ── Função de desenho ─────────────────────────────────────────────────────
  // Pré-computa ghost trail (walk-only + âncora) uma vez — é imutável
  const ghostWalkTrail = passos.filter(p => !p.isTurn);
  const ghostLineTrail = lineAnchor ? [lineAnchor, ...ghostWalkTrail] : ghostWalkTrail;
  const ghostSegs = buildSegments(ghostLineTrail);

  function drawStep(s) {
    const trail = passos.slice(0, s);           // s=0 → vazio; s=N → N ações aplicadas
    const head  = trail.length > 0 ? trail[trail.length - 1] : null;

    // Para desenho de linha: apenas walks + âncora inicial.
    // Turns não deslocam o jogador — ficam no mesmo tile — e distorceriam a linha.
    const walkTrail = trail.filter(p => !p.isTurn);
    const lineTrail = lineAnchor ? [lineAnchor, ...walkTrail] : walkTrail;
    const segs = buildSegments(lineTrail);

    // Segmento em destaque: filtra apenas os walks do si selecionado
    const hasSel = selectedAuxSi >= 0;
    const activeSegs = hasSel ? buildSegments(walkTrail.filter(p =>
      selectedAuxSi < nObj ? (p.objIdx === selectedAuxSi && p.cor !== COR_RETORNO) : p.cor === COR_RETORNO
    )) : [];

    const chart = Plot.plot({
      width: W2, height: H2,
      marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0,
      x: { domain: [0, cols], axis: null },
      y: { domain: [-rows, 0], axis: null },
      style: { background: "transparent", overflow: "visible" },
      marks: [
        Plot.rect(floorRects, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          fill: "none", stroke: d => d.areaInterna ? "#cccccc" : "#e0e0e0", strokeWidth: 0.5,
        }),
        Plot.rect(doorRects, { x1: "x1", y1: "y1", x2: "x2", y2: "y2", fill: "#f0f0f0", stroke: "none" }),
        // rota fantasma — mais apagada quando há seleção ativa
        ...(mapaFinalizado ? ghostSegs.map(seg => Plot.line(seg.pts, { x: "x", y: "y", stroke: seg.cor, strokeOpacity: hasSel ? 0.07 : 0.2, strokeWidth: Math.max(scale * 0.49, 6.12), strokeLinecap: "round", strokeLinejoin: "round", curve: "linear" })) : []),
        // trilha percorrida: ghost quando há seleção, cor plena quando não há
        ...segs.map(seg => Plot.line(seg.pts, { x: "x", y: "y", stroke: seg.cor, strokeOpacity: hasSel ? 0.12 : 1, strokeWidth: Math.max(scale * 0.255, 2), strokeLinecap: "round", strokeLinejoin: "round", curve: "linear" })),
        // segmento ativo em destaque (por cima, cor plena)
        ...(hasSel ? activeSegs.map(seg => Plot.line(seg.pts, { x: "x", y: "y", stroke: seg.cor, strokeWidth: Math.max(scale * 0.255, 2), strokeLinecap: "round", strokeLinejoin: "round", curve: "linear" })) : []),
        ...furnRects.length ? [Plot.rect(furnRects, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          fill: "#b0b0b0", fillOpacity: 0.35, stroke: "#888", strokeWidth: 0.7,
        })] : [],
        Plot.link(wallEdges, {
          x1: "x1", y1: "y1", x2: "x2", y2: "y2",
          stroke: "#3a3a3a", strokeWidth: Math.max(1, scale * 0.07),
        }),
        ...interRects.length ? [
          Plot.rect(interRects.map(r => {
            const mx = (r.x1 + r.x2) / 2, my = (r.y1 + r.y2) / 2;
            const hw = (r.x2 - r.x1) * 0.25, hh = (r.y2 - r.y1) * 0.25;
            return { ...r, x1: mx - hw, x2: mx + hw, y1: my - hh, y2: my + hh };
          }), { x1: "x1", y1: "y1", x2: "x2", y2: "y2", fill: "none", stroke: "#5ba85b", strokeWidth: 1.2 }),
          Plot.text(interRects, {
            x: "cx", y: "cy", text: d => String(d.idx),
            fontSize: Math.max(5, scale * 0.25), fill: "#2d6a2d", fontWeight: "bold",
            textAnchor: "middle", dy: "0.35em",
          }),
        ] : [],
        // Seta: effectiveInitialH já inclui turns pré-walk; trail acumula turns mid-rota
        ...(() => {
          if (!personArrows.length) return [];
          const arrowPos = head
            ? { x: head.x, y: head.y }
            : { x: personArrows[0].x, y: personArrows[0].y };
          const currentH = trail
            .filter(p => p.isTurn)
            .reduce((h, p) => (h + (p.direction === 4 ? 90 : -90) + 360) % 360, effectiveInitialH);
          return [Plot.dot([{ ...arrowPos, heading: currentH }], {
            x: "x", y: "y", symbol: gpsArrow, r: 9,
            rotate: d => d.heading,
            fill: "#222", stroke: "#fff", strokeWidth: 1.5,
          })];
        })(),
      ],
    });

    mapDiv.replaceChildren(chart);
  }

  // ── Controles ─────────────────────────────────────────────────────────────
  let step = passos.length;   // exibe replay completo na abertura

  // ── Legenda + Painel auxiliar (compartilham auxRows para highlight) ───────
  const auxRows = [];
  let selectedAuxSi = -1;
  function selectSeg(si, newStep) {
    if (selectedAuxSi >= 0 && auxRows[selectedAuxSi]) auxRows[selectedAuxSi].style.background = "";
    selectedAuxSi = si;
    if (auxRows[si]) auxRows[si].style.background = "var(--theme-background)";
    step = newStep; drawStep(step);
  }

  // ── Legenda ───────────────────────────────────────────────────────────────
  const legenda = document.createElement("div");
  legenda.style.cssText = `
    flex-shrink:0;width:${LEGENDA_W}px;
    display:flex;flex-direction:column;gap:0;
    background:var(--theme-background-alt);
    border:1px solid var(--theme-foreground-faintest);
    border-radius:8px;padding:8px 10px 8px;`;

  const lblSeg = document.createElement("div");
  lblSeg.style.cssText = "font-size:.65rem;font-weight:700;color:var(--theme-foreground-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;";
  lblSeg.textContent = mapaFinalizado ? "Segmentos" : "Trajetória";
  legenda.append(lblSeg);

  // Linhas coloridas por objetivo + segmento de retorno
  const mkSegRow = (cor, label, num) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:6px;margin-bottom:3px;";
    if (num != null) {
      const badge = document.createElement("div");
      badge.style.cssText = `width:16px;height:16px;border-radius:3px;background:${cor};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700;color:#fff;`;
      badge.textContent = num;
      row.append(badge);
    } else {
      const linha = document.createElement("div");
      linha.style.cssText = `width:22px;height:3px;border-radius:2px;background:${cor};flex-shrink:0;`;
      row.append(linha);
    }
    const lbl = document.createElement("span");
    lbl.style.cssText = "font-size:.68rem;color:var(--theme-foreground-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100px;";
    lbl.textContent = label; lbl.title = label;
    row.append(lbl); return row;
  };
  if (mapaFinalizado) {
    for (const [si, oc] of objCenters.entries()) {
      const t = oc.lastInCrossT;
      const obj = t != null
        ? objetivos.find(o => t >= (o.startTime ?? 0) && (!(o.endTime > 0) || t <= o.endTime))
        : null;
      const nome = obj?.objectiveName ?? `Objetivo ${si + 1}`;
      const rowSeg = mkSegRow(CORES_OBJ[si % CORES_OBJ.length], nome, si + 1);
      rowSeg.style.cursor = "pointer";
      rowSeg.title = `Ver segmento: ${nome}`;
      rowSeg.addEventListener("mouseenter", () => rowSeg.style.opacity = "0.7");
      rowSeg.addEventListener("mouseleave", () => rowSeg.style.opacity = "1");
      rowSeg.addEventListener("click", () => selectSeg(si, segmentEnds[si]));
      legenda.append(rowSeg);
    }
    const rowFull = mkSegRow("#aaa", "Rota completa", nObj + 1);
    rowFull.style.cursor = "pointer";
    rowFull.title = "Mostrar rota completa";
    rowFull.addEventListener("mouseenter", () => rowFull.style.opacity = "0.7");
    rowFull.addEventListener("mouseleave", () => rowFull.style.opacity = "1");
    rowFull.addEventListener("click", () => selectSeg(nObj, passos.length));
    legenda.append(rowFull);
  } else {
    legenda.append(mkSegRow(CORES_OBJ[0], "Trajetória"));
  }

  const sepHead = document.createElement("div");
  sepHead.style.cssText = "border-top:1px solid var(--theme-foreground-faintest);margin:4px 0;";
  const rowHead = document.createElement("div");
  rowHead.style.cssText = "display:flex;align-items:center;gap:6px;";
  const arSvgH = document.createElementNS("http://www.w3.org/2000/svg","svg");
  arSvgH.setAttribute("width","14"); arSvgH.setAttribute("height","18");
  arSvgH.setAttribute("viewBox","-9 -14 18 24");
  arSvgH.style.cssText = "flex-shrink:0;display:block;overflow:visible;";
  const arPathH = document.createElementNS("http://www.w3.org/2000/svg","path");
  arPathH.setAttribute("d","M 0,-12 L 8,9 L 0,3 L -8,9 Z");
  arPathH.style.cssText = "fill:#222;stroke:#fff;stroke-width:2;stroke-linejoin:round;";
  arSvgH.append(arPathH);
  const lblHead = document.createElement("span");
  lblHead.style.cssText = "font-size:.68rem;color:var(--theme-foreground-muted);";
  lblHead.textContent = "Posição atual";
  rowHead.append(arSvgH, lblHead); legenda.append(sepHead, rowHead);

  // ── Painel Auxiliar ───────────────────────────────────────────────────────
  const auxPanel = document.createElement("div");
  auxPanel.style.cssText = "margin-top:10px;background:var(--theme-background-alt);border:1px solid var(--theme-foreground-faintest);border-radius:8px;padding:8px 10px;overflow-x:auto;";

  const auxLbl = document.createElement("div");
  auxLbl.style.cssText = "font-size:.65rem;font-weight:700;color:var(--theme-foreground-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;";
  auxLbl.textContent = "Dados por Segmento";
  auxPanel.append(auxLbl);

  const auxTable = document.createElement("table");
  auxTable.style.cssText = "width:100%;border-collapse:collapse;font-size:.68rem;";

  const auxThead = document.createElement("thead");
  const auxHRow = document.createElement("tr");
  for (const h of ["Segmento","Duração","Passos","Giros","T. Parado","Colisões","Distância"]) {
    const th = document.createElement("th");
    th.style.cssText = "text-align:left;padding:3px 10px 3px 0;color:var(--theme-foreground-muted);font-weight:600;border-bottom:1px solid var(--theme-foreground-faintest);white-space:nowrap;";
    th.textContent = h; auxHRow.append(th);
  }
  auxThead.append(auxHRow); auxTable.append(auxThead);

  const auxTbody = document.createElement("tbody");

  function computeTempoParado(obj) {
    const actions = obj?.actions ?? [];
    let total = 0, i = 0;
    while (i < actions.length) {
      if (actions[i].actionType === 1) {
        const tStart = actions[i].timestamp;
        let j = i + 1;
        while (j < actions.length && actions[j].actionType === 1) j++;
        const tEnd = j < actions.length ? actions[j].timestamp : (obj.endTime > 0 ? obj.endTime : tStart);
        total += tEnd - tStart; i = j;
      } else { i++; }
    }
    return total;
  }

  function mkAuxCell(content, isFirst) {
    const td = document.createElement("td");
    td.style.cssText = `padding:5px 10px 5px 0;border-bottom:1px solid var(--theme-foreground-faintest);white-space:nowrap;${isFirst ? "" : "color:var(--theme-foreground-muted);"}`;
    if (typeof content === "string" && content.startsWith("<")) td.innerHTML = content;
    else td.textContent = content;
    return td;
  }

  if (mapaFinalizado) {
    for (const [si, oc] of objCenters.entries()) {
      const t = oc.lastInCrossT;
      const obj = t != null
        ? objetivos.find(o => t >= (o.startTime ?? 0) && (!(o.endTime > 0) || t <= o.endTime))
        : null;
      const nome = obj?.objectiveName ?? `Objetivo ${si + 1}`;
      const cor = CORES_OBJ[si % CORES_OBJ.length];

      const segPassos = passos.filter(p => p.objIdx === si && p.cor !== COR_RETORNO);
      const walks = segPassos.filter(p => !p.isTurn);
      const turns = segPassos.filter(p => p.isTurn);
      let dist = 0;
      for (let k = 1; k < walks.length; k++)
        dist += Math.abs(walks[k].x - walks[k-1].x) + Math.abs(walks[k].y - walks[k-1].y);

      const _dur = obj && obj.endTime > 0 && obj.startTime > 0 ? obj.endTime - obj.startTime : null;
      const duracao = _dur == null ? "—" : _dur >= 60 ? `${Math.floor(_dur / 60)}m ${Math.round(_dur % 60)}s` : `${_dur.toFixed(1)}s`;
      const colisoes = obj?.collisions?.length ?? 0;
      const tParado = obj ? computeTempoParado(obj).toFixed(1) + "s" : "—";

      const tr = document.createElement("tr");
      tr.style.cssText = "cursor:pointer;transition:background .15s;";
      tr.addEventListener("mouseenter", () => { if (selectedAuxSi !== si) tr.style.background = "var(--theme-background)"; });
      tr.addEventListener("mouseleave", () => { if (selectedAuxSi !== si) tr.style.background = ""; });
      tr.addEventListener("click", () => selectSeg(si, segmentEnds[si]));
      auxRows.push(tr);

      const badge = `<span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:14px;height:14px;border-radius:3px;background:${cor};display:inline-flex;align-items:center;justify-content:center;font-size:.55rem;font-weight:700;color:#fff;flex-shrink:0;">${si+1}</span>${nome}</span>`;
      tr.append(mkAuxCell(badge, true), mkAuxCell(duracao), mkAuxCell(walks.length), mkAuxCell(turns.length), mkAuxCell(tParado), mkAuxCell(colisoes), mkAuxCell(Math.round(dist) + " blocos"));
      auxTbody.append(tr);
    }

    // Linha do retorno
    const retWalks = passos.filter(p => p.cor === COR_RETORNO && !p.isTurn);
    const retTurns = passos.filter(p => p.cor === COR_RETORNO && p.isTurn);
    let retDist = 0;
    for (let k = 1; k < retWalks.length; k++)
      retDist += Math.abs(retWalks[k].x - retWalks[k-1].x) + Math.abs(retWalks[k].y - retWalks[k-1].y);

    const retTr = document.createElement("tr");
    retTr.style.cssText = "cursor:pointer;transition:background .15s;";
    retTr.addEventListener("mouseenter", () => { if (selectedAuxSi !== nObj) retTr.style.background = "var(--theme-background)"; });
    retTr.addEventListener("mouseleave", () => { if (selectedAuxSi !== nObj) retTr.style.background = ""; });
    retTr.addEventListener("click", () => selectSeg(nObj, passos.length));
    auxRows.push(retTr);

    const retBadge = `<span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:14px;height:14px;border-radius:3px;background:#aaa;display:inline-flex;align-items:center;justify-content:center;font-size:.55rem;font-weight:700;color:#fff;flex-shrink:0;">${nObj+1}</span>Rota completa</span>`;
    retTr.append(mkAuxCell(retBadge, true), mkAuxCell("—"), mkAuxCell(retWalks.length), mkAuxCell(retTurns.length), mkAuxCell("—"), mkAuxCell("—"), mkAuxCell(Math.round(retDist) + " blocos"));
    auxTbody.append(retTr);
  }

  auxTable.append(auxTbody);
  auxPanel.append(auxTable);

  // ── Montar ────────────────────────────────────────────────────────────────
  const mapRow = document.createElement("div");
  mapRow.style.cssText = "display:flex;align-items:flex-start;gap:8px;";
  mapRow.append(mapDiv, legenda);

  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;flex-direction:column;gap:0;";
  wrapper.append(mapRow, auxPanel);
  replayContainer.append(wrapper);

  drawStep(step);
}

// ── Replay de Trajetória — versão D3 ──────────────────────────────────────
function renderizarReplayD3() { try { _renderizarReplayD3(); } catch(e) { console.error("renderizarReplayD3:", e); } }
function _renderizarReplayD3() {
  if (replayD3Timer) { clearInterval(replayD3Timer); replayD3Timer = null; }
  replayD3Container.replaceChildren();

  const { camadas, cols, rows, dadosLog } = giroState;
  if (!camadas || cols === 0 || !dadosLog) {
    const hint = document.createElement("div"); hint.className = "giro-hint";
    hint.textContent = "Selecione uma sessão para ver o replay de trajetória.";
    replayD3Container.append(hint); return;
  }

  const CORES_OBJ  = ["#4a90d9","#e07b54","#5ba85b","#c9a227","#9b59b6","#2eaaa8","#e41a1c","#ff7f00"];
  const COR_RETORNO = "#999";
  const objetivos   = dadosLog.objectives ?? [];
  const nObj        = objetivos.length;
  const mapaFinalizado = dadosLog.results?.clearedMap === true;

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getCamada  = name => camadas.find(c => c.layerName === name);
  const polyToRect = f => {
    const c = f.geometry.type === "Polygon" ? f.geometry.coordinates[0] : f.geometry.coordinates;
    return { x1: c[0][0], y1: c[2][1], x2: c[2][0], y2: c[0][1], ...f.properties };
  };
  const allInterFeatures = getCamada("interactive_elements")?.geojson.features ?? [];
  const personPoints = (getCamada("persons")?.geojson.features ?? []).map(f => ({
    x: f.geometry.coordinates[0], y: f.geometry.coordinates[1],
    direcaoIndex: f.properties?.direcaoIndex,
  }));
  const BASIC_TO_DEG = [270, 315, 0, 45, 90, 135, 180, 225];
  const personArrows = personPoints.map(p => ({
    x: p.x, y: p.y, heading: BASIC_TO_DEG[p.direcaoIndex] ?? 0,
  }));

  function inCross(px, py, cx, cy) {
    const dx = Math.abs(px - cx), dy = Math.abs(py - cy);
    return (dx <= 0.5 && dy <= 1.5) || (dy <= 0.5 && dx <= 1.5);
  }

  // ── Sequência de walks para cálculo de cutoffs ────────────────────────────
  const allActions = [];
  for (const [oi, obj] of objetivos.entries()) {
    for (const a of obj.actions ?? []) {
      if (a.position == null || a.actionType !== 0) continue;
      allActions.push({ ...a, srcObjIdx: oi });
    }
  }
  allActions.sort((a, b) => a.timestamp - b.timestamp);

  const startPx = allActions.length > 0 ? Math.round(allActions[0].position.x) + 0.5 : 0;
  const startPy = allActions.length > 0 ? Math.round(allActions[0].position.z) - rows + 0.5 : 0;

  const featureStats = allInterFeatures.map((f, fi) => {
    const r = polyToRect(f);
    const cx = (r.x1 + r.x2) / 2, cy = (r.y1 + r.y2) / 2;
    let hits = 0, inVisit = false, firstExitT = null, lastInCrossT = null, visitEnded = false;
    for (const a of allActions) {
      const px = Math.round(a.position.x) + 0.5;
      const py = Math.round(a.position.z) - rows + 0.5;
      const inC = inCross(px, py, cx, cy);
      if (inC) hits++;
      if (!visitEnded) {
        if (inC) { inVisit = true; lastInCrossT = a.timestamp; }
        else if (inVisit) { firstExitT = lastInCrossT; visitEnded = true; }
      }
    }
    if (inVisit && !visitEnded) firstExitT = lastInCrossT;
    return { cx, cy, origIdx: fi, hits, lastInCrossT: firstExitT };
  });

  const visited   = featureStats.filter(f => f.hits > 0).sort((a, b) => b.hits - a.hits);
  const unvisited = featureStats.filter(f => f.hits === 0);
  const objCenters = [...visited, ...unvisited].slice(0, nObj)
    .sort((a, b) =>
      (Math.abs(a.cx - startPx) + Math.abs(a.cy - startPy)) -
      (Math.abs(b.cx - startPx) + Math.abs(b.cy - startPy))
    );

  const cutoffs     = objCenters.slice(0, nObj - 1).map(c => c.lastInCrossT ?? Infinity);
  const lastObjEndTime = objetivos.reduce((maxT, obj) => Math.max(maxT, obj.endTime ?? 0), 0);
  const returnCutoff = nObj > 0 && objCenters[nObj - 1]
    ? (objCenters[nObj - 1].lastInCrossT ?? (mapaFinalizado && lastObjEndTime > 0 ? lastObjEndTime : Infinity))
    : Infinity;

  // ── Construção de passos ──────────────────────────────────────────────────
  const allEventsRaw = [];
  for (const [, obj] of objetivos.entries()) {
    for (const a of obj.actions ?? []) {
      if (a.position == null) continue;
      allEventsRaw.push(a);
    }
  }
  allEventsRaw.sort((a, b) => a.timestamp - b.timestamp);

  // ── Extração bruta: TURN e WALK do log ───────────────────────────────────
  const logBruto = allEventsRaw.filter(a => a.actionType === 0 || a.actionType === 1);
  console.group(`[LOG BRUTO] ${logBruto.length} ações (TURN=1, WALK=0)`);
  logBruto.forEach((a, i) => {
    const tipo = a.actionType === 1 ? "TURN" : "WALK";
    const dir  = a.actionType === 1 ? ` dir=${a.direction}` : "";
    console.log(`#${String(i).padStart(2,"0")} ${tipo}${dir}  x=${a.position.x} z=${a.position.z}  t=${a.timestamp.toFixed(2)}`);
  });
  console.groupEnd();

  // ── Verificação de consistência de movimentação ──────────────────────────
  {
    const walks = logBruto.filter(a => a.actionType === 0);
    const problemas = [];
    for (let i = 1; i < walks.length; i++) {
      const prev = walks[i - 1], curr = walks[i];
      const px = Math.round(prev.position.x), pz = Math.round(prev.position.z);
      const cx = Math.round(curr.position.x), cz = Math.round(curr.position.z);
      const dx = cx - px, dz = cz - pz;
      const manhattan = Math.abs(dx) + Math.abs(dz);
      // posição fracionária no log bruto (antes do round)
      const fracX = Math.abs(curr.position.x - Math.round(curr.position.x));
      const fracZ = Math.abs(curr.position.z - Math.round(curr.position.z));
      const isFrac = fracX > 0.01 || fracZ > 0.01;
      let tipo = null;
      if (manhattan === 0)      tipo = "DUPLICATA";
      else if (manhattan > 1)   tipo = `SALTO(${manhattan})`;
      else if (Math.abs(dx) === 1 && Math.abs(dz) === 1) tipo = "DIAGONAL";
      if (tipo || isFrac) {
        problemas.push({ i, tipo: tipo ?? "FRACIONÁRIA", dx, dz,
          prev: `(${prev.position.x},${prev.position.z})`,
          curr: `(${curr.position.x},${curr.position.z})`,
          dt: (curr.timestamp - prev.timestamp).toFixed(3) });
      }
    }
    if (problemas.length === 0) {
      console.log("[CONSISTÊNCIA] ✓ Todos os WALKs são ortogonais de 1 tile.");
    } else {
      console.group(`[CONSISTÊNCIA] ⚠ ${problemas.length} inconsistências detectadas`);
      problemas.forEach(p =>
        console.log(`walk#${p.i} ${p.tipo}  dx=${p.dx} dz=${p.dz}  prev=${p.prev} curr=${p.curr}  Δt=${p.dt}s`));
      console.groupEnd();
    }
  }

  const passos = [];
  const startX = personArrows.length > 0 ? personArrows[0].x : null;
  const startY = personArrows.length > 0 ? personArrows[0].y : null;
  let currentH = personArrows[0]?.heading ?? 0; // heading acumulado — atualizado a cada turn

  let ei = 0;
  while (ei < allEventsRaw.length) {
    const a = allEventsRaw[ei];
    if (a.actionType === 0) {
      let segIdx = 0;
      for (let i = 0; i < cutoffs.length; i++) { if (a.timestamp > cutoffs[i]) segIdx = i + 1; }
      const isReturn = segIdx === nObj - 1 && a.timestamp > returnCutoff;
      const cor = mapaFinalizado
        ? (isReturn ? COR_RETORNO : CORES_OBJ[segIdx % CORES_OBJ.length]) : CORES_OBJ[0];
      const nx = Math.round(a.position.x) + 0.5;
      const ny = Math.round(a.position.z) - rows + 0.5;
      const noWalkYet = passos.filter(p => !p.isTurn).length === 0;
      if (noWalkYet && startX !== null &&
          Math.abs(nx - startX) < 0.01 && Math.abs(ny - startY) < 0.01) { ei++; continue; }
      const prevP = passos[passos.length - 1];
      if (!prevP || prevP.x !== nx || prevP.y !== ny) {
        passos.push({ x: nx, y: ny, cor, objIdx: segIdx, isTurn: false });
      }
      ei++;
    } else if (a.actionType === 1) {
      const dir = a.direction;
      const px = a.position?.x ?? 0, pz = a.position?.z ?? 0;
      let count = 0;
      while (
        ei + count < allEventsRaw.length &&
        allEventsRaw[ei + count].actionType === 1 &&
        allEventsRaw[ei + count].direction === dir &&
        Math.abs((allEventsRaw[ei + count].position?.x ?? 0) - px) < 0.1 &&
        Math.abs((allEventsRaw[ei + count].position?.z ?? 0) - pz) < 0.1
      ) count++;
      const prev = passos[passos.length - 1];
      const baseX = prev ? prev.x : (startX ?? Math.round(px) + 0.5);
      const baseY = prev ? prev.y : (startY ?? Math.round(pz) - rows + 0.5);
      const baseCor  = prev ? prev.cor    : CORES_OBJ[0];
      const baseObjI = prev ? prev.objIdx : 0;
      // Acumula heading para todos os turns do grupo e cria UM único passo
      for (let k = 0; k < count; k++) {
        currentH = (currentH + (dir === 4 ? 90 : -90) + 360) % 360;
      }
      passos.push({
        x: baseX, y: baseY, cor: baseCor, objIdx: baseObjI,
        isTurn: true, direction: dir, headingAfter: currentH,
      });
      ei += count;
    } else { ei++; }
  }

  const hasRealReturn = mapaFinalizado && passos.some(p => p.cor === COR_RETORNO);
  if (mapaFinalizado && !hasRealReturn && passos.length > 0 && nObj > 0 && objCenters[nObj - 1]) {
    const { cx, cy } = objCenters[nObj - 1];
    const dest = startX !== null ? { x: startX, y: startY } : passos[0];
    passos.push({ x: cx, y: cy, cor: COR_RETORNO, objIdx: nObj - 1 });
    if (Math.abs(cx - dest.x) > 0.5 || Math.abs(cy - dest.y) > 0.5)
      passos.push({ x: dest.x, y: dest.y, cor: COR_RETORNO, objIdx: nObj - 1 });
  }
  const temRetorno = mapaFinalizado && passos.some(p => p.cor === COR_RETORNO);
  // Último passo de retorno até spawn pode estar ausente do log (sessão fecha no chegada).
  // Se o último WALK de retorno está a 1 tile de spawn, adiciona passo sintético de conclusão.
  if (temRetorno && startX !== null) {
    const lastRW = [...passos].reverse().find(p => p.cor === COR_RETORNO && !p.isTurn);
    if (lastRW) {
      const adx = Math.abs(startX - lastRW.x);
      const ady = Math.abs(startY - lastRW.y);
      if (adx + ady === 1) {
        passos.push({ x: startX, y: startY, cor: COR_RETORNO, objIdx: nObj - 1, isTurn: false });
      }
    }
  }

  const segmentEnds = [];
  for (let i = 1; i < passos.length; i++) {
    if (passos[i].cor !== passos[i - 1].cor) segmentEnds.push(i);
  }
  segmentEnds.push(passos.length);

  if (logBruto.length === 0) {
    const hint = document.createElement("div"); hint.className = "giro-hint";
    hint.textContent = "Nenhum dado de movimentação nessa sessão.";
    replayD3Container.append(hint); return;
  }

  const lineAnchor = startX !== null
    ? { x: startX, y: startY, cor: passos[0]?.cor ?? CORES_OBJ[0], objIdx: 0 } : null;
  const effectiveInitialH = personArrows[0]?.heading ?? 0; // heading puro do XML
  // Posição e orientação de spawn (do XML) — usada na seta inicial e preservada para uso posterior
  const setaInicial = startX !== null
    ? { x: startX, y: startY, heading: effectiveInitialH }
    : null;

  // Diagnóstico: compara setaInicial (XML) com o primeiro WALK (Unity log)
  { const fw = logBruto.find(a => a.actionType === 0);
    if (setaInicial && fw) {
      const fx = Math.round(fw.position.x) + 0.5, fy = Math.round(fw.position.z) - rows + 0.5;
      console.log(`[SPAWN] XML=(${setaInicial.x},${setaInicial.y})  firstWALK=(${fx},${fy})  Δ=(${(fx-setaInicial.x).toFixed(2)},${(fy-setaInicial.y).toFixed(2)})`);
    }
  }

  // ── Debug: dump da sequência de passos ───────────────────────────────────
  console.group(`[ReplayD3] passos (${passos.length}) — effectiveInitialH=${effectiveInitialH}`);
  passos.forEach((p, i) => {
    const idx  = String(i).padStart(2, "0");
    const tipo = p.isTurn ? "TURN" : "WALK";
    const dir  = p.isTurn ? ` dir=${p.direction}` : "        ";
    const hAfter = p.isTurn ? ` H→${p.headingAfter}°` : "";
    console.log(`#${idx} ${tipo}${dir}${hAfter}  pos=(${p.x.toFixed(1)}, ${p.y.toFixed(1)})  cor=${p.cor}`);
  });
  console.groupEnd();

  // Detecta posições onde o jogador ficou parado (mesma tile por ≥ STOP_THRESHOLD_S s)
  const STOP_THRESHOLD_S = 2;
  const paradas = [];
  { let i = 0;
    while (i < logBruto.length) {
      const a = logBruto[i];
      const tx = Math.round(a.position.x), tz = Math.round(a.position.z);
      let j = i + 1;
      while (j < logBruto.length &&
             Math.round(logBruto[j].position.x) === tx &&
             Math.round(logBruto[j].position.z) === tz) j++;
      const dt = logBruto[j - 1].timestamp - a.timestamp;
      if (dt >= STOP_THRESHOLD_S)
        paradas.push({ geoX: tx + 0.5, geoY: tz - rows + 0.5, stepStart: i + 1, stepEnd: j });
      i = j;
    }
  }

  // ── Camadas estáticas ─────────────────────────────────────────────────────
  const floorRects  = (getCamada("floor")?.geojson.features ?? []).map(polyToRect);
  const doorRects   = (getCamada("door_and_windows")?.geojson.features ?? []).map(polyToRect);
  const wallFeature = getCamada("walls")?.geojson.features[0];
  const wallEdges   = (wallFeature?.geometry.coordinates ?? []).map(([p1, p2]) => ({
    x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1],
  }));
  const interRects = chkObjetos.checked && mapaFinalizado
    ? objCenters.map((c, si) => {
        const r = polyToRect(allInterFeatures[c.origIdx]);
        return { ...r, cx: c.cx, cy: c.cy, idx: si + 1 };
      })
    : [];
  const furnRects = chkMoveis.checked ? [
    ...(getCamada("furniture")?.geojson.features  ?? []),
    ...(getCamada("eletronics")?.geojson.features ?? []),
    ...(getCamada("utensils")?.geojson.features   ?? []),
  ].map(polyToRect) : [];

  // ── Colisões: snap idêntico ao quadro Colisão + janela de proximidade ────
  {
    const snapFeats = [
      ...(getCamada("door_and_windows")?.geojson.features    ?? []),
      ...(getCamada("furniture")?.geojson.features            ?? []),
      ...(getCamada("eletronics")?.geojson.features           ?? []),
      ...(getCamada("utensils")?.geojson.features             ?? []),
      ...(getCamada("interactive_elements")?.geojson.features ?? []),
    ].map(f => {
      const cs = f.geometry.type === "Polygon" ? f.geometry.coordinates[0] : f.geometry.coordinates;
      const xs = cs.map(p => p[0]), ys = cs.map(p => p[1]);
      const nameStr = Object.values(f.properties ?? {}).filter(v => typeof v === "string").join(" ").toLowerCase();
      return { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys), nameStr };
    });
    const wallNm = "wall brick stone fence barrier";
    const MAX_SNAP = 2.0;
    function colNearRect(px, py, r) {
      const cx = Math.max(r.x1, Math.min(r.x2, px)), cy = Math.max(r.y1, Math.min(r.y2, py));
      return [cx, cy, Math.hypot(px-cx, py-cy)];
    }
    function colNearSeg(px, py, x1, y1, x2, y2) {
      const dx=x2-x1, dy=y2-y1, l2=dx*dx+dy*dy;
      if (!l2) return [x1, y1, Math.hypot(px-x1, py-y1)];
      const t=Math.max(0,Math.min(1,((px-x1)*dx+(py-y1)*dy)/l2));
      const nx=x1+t*dx, ny=y1+t*dy; return [nx, ny, Math.hypot(px-nx, py-ny)];
    }
    function colSnapPos(px, py, objectID) {
      const objLow=objectID.toLowerCase(), objToks=objLow.split(/[_\-\s]+/).filter(t=>t.length>2);
      const pen = nm => { const ts=nm.split(/\s+/).filter(t=>t.length>2); return objToks.some(t=>nm.includes(t))||ts.some(t=>objLow.includes(t))?0:1000; };
      let bestEff=Infinity, bestGeo=Infinity, bestX=px, bestY=py;
      for (const r of snapFeats) { const [cx,cy,g]=colNearRect(px,py,r); const e=g+pen(r.nameStr); if(e<bestEff){bestEff=e;bestGeo=g;bestX=cx;bestY=cy;} }
      for (const e of wallEdges)  { const [nx,ny,g]=colNearSeg(px,py,e.x1,e.y1,e.x2,e.y2); const ef=g+pen(wallNm); if(ef<bestEff){bestEff=ef;bestGeo=g;bestX=nx;bestY=ny;} }
      if (bestGeo <= MAX_SNAP) { px=bestX; py=bestY; }
      return { px, py };
    }
    var colisoes = [];
    for (const obj of objetivos) {
      for (const c of obj.collisions ?? []) {
        if (c.position == null) continue;
        let { px, py } = colSnapPos(c.position.x, c.position.z - rows, c.objectID ?? "");
        colisoes.push({ geoX: px, geoY: py, objectID: c.objectID });
      }
    }
    const NEAR_TILES = 1.5;
    for (const c of colisoes) {
      c.firstNearStep = -1; c.lastNearStep = -1;
      for (let i = 0; i < passos.length; i++) {
        const d = Math.abs(passos[i].x - c.geoX) + Math.abs(passos[i].y - c.geoY);
        if (d <= NEAR_TILES) {
          if (c.firstNearStep < 0) c.firstNearStep = i + 1;
          c.lastNearStep = i + 1;
        } else if (c.firstNearStep >= 0) { break; } // fim da primeira janela contígua
      }
    }
  }

  // ── Dimensões e escalas ───────────────────────────────────────────────────
  const LEGENDA_W = 140;
  const W  = (replayD3Container.getBoundingClientRect().width || 500) - LEGENDA_W - 16;
  const sc = Math.min((W - 8) / cols, 480 / rows);
  const W2 = Math.round(cols * sc);
  const H2 = Math.round(rows * sc);

  const xSc = d3.scaleLinear().domain([0, cols]).range([0, W2]);
  const ySc = d3.scaleLinear().domain([-rows, 0]).range([H2, 0]);

  // Aplica x,y,width,height a partir de {x1,y1,x2,y2} em GeoJSON
  const rAttrs = sel => sel
    .attr("x",      d => xSc(d.x1))
    .attr("y",      d => ySc(d.y2))          // y2 = menos negativo = topo
    .attr("width",  d => xSc(d.x2) - xSc(d.x1))
    .attr("height", d => ySc(d.y1) - ySc(d.y2)); // y1 = mais negativo = base

  // ── Cria SVG com grupos em ordem de z ────────────────────────────────────
  const svg    = d3.create("svg").attr("width", W2).attr("height", H2).style("overflow","visible").style("display","block");
  const gFloor    = svg.append("g");
  const gDoors    = svg.append("g");
  const gGhost    = svg.append("g");
  const gTrail    = svg.append("g");
  const gFurn     = svg.append("g");
  const gWalls    = svg.append("g");
  const gInter    = svg.append("g");
  const gColFixed = svg.append("g"); // círculos fixos de colisão (PIN já passou)
  const gArrow    = svg.append("g");
  const gColPulse = svg.append("g"); // anéis pulsantes (PIN próximo)
  const gStop  = svg.append("g"); // indicador de parada — PIN piscando

  // CSS para efeito de PIN piscando (injetado uma vez por sessão de página)
  { const styleId = "ena-stop-pin-style";
    if (!document.getElementById(styleId)) {
      const st = document.createElement("style"); st.id = styleId;
      st.textContent = "@keyframes ena-pin-blink{0%,100%{opacity:1}50%{opacity:0.1}} .ena-pin-blink{animation:ena-pin-blink .85s ease-in-out infinite;}";
      document.head.append(st);
    }
  }
  const stopPin = gStop.append("circle")
    .attr("r", 0)
    .attr("fill", "#e07b54").attr("fill-opacity", 0.85)
    .attr("stroke", "#a84400").attr("stroke-width", 1.5)
    .style("display", "none");

  // Piso
  rAttrs(gFloor.selectAll("rect").data(floorRects).join("rect"))
    .attr("fill", "none")
    .attr("stroke", d => d.areaInterna ? "#cccccc" : "#e0e0e0")
    .attr("stroke-width", 0.5);

  // Portas / janelas
  rAttrs(gDoors.selectAll("rect").data(doorRects).join("rect"))
    .attr("fill", "#f0f0f0").attr("stroke", "none");

  // Ghost trail (walk-only + âncora, apenas sessões finalizadas)
  if (mapaFinalizado) {
    const ghostWalk = passos.filter(p => !p.isTurn);
    const ghostAll  = lineAnchor ? [lineAnchor, ...ghostWalk] : ghostWalk;
    const ghostSegs = [];
    for (let i = 1; i < ghostAll.length; i++) {
      ghostSegs.push({ x1: ghostAll[i-1].x, y1: ghostAll[i-1].y,
                       x2: ghostAll[i].x,   y2: ghostAll[i].y,   cor: ghostAll[i].cor });
    }
    // Agrupa segmentos consecutivos de mesma cor em paths — evita círculos nos extremos intermediários
    const ghostGroups = [];
    for (const seg of ghostSegs) {
      if (!ghostGroups.length || ghostGroups[ghostGroups.length-1].cor !== seg.cor) {
        ghostGroups.push({ cor: seg.cor, pts: [{ x: seg.x1, y: seg.y1 }, { x: seg.x2, y: seg.y2 }] });
      } else {
        ghostGroups[ghostGroups.length-1].pts.push({ x: seg.x2, y: seg.y2 });
      }
    }
    gGhost.selectAll("path").data(ghostGroups).join("path")
      .attr("d", g => "M" + g.pts.map(p => `${xSc(p.x)},${ySc(p.y)}`).join("L"))
      .attr("stroke", g => g.cor).attr("fill", "none").attr("stroke-opacity", 0.2)
      .attr("stroke-width", Math.max(sc * 0.49, 6.12))
      .attr("stroke-linecap", "round").attr("stroke-linejoin", "round");
  }

  // Móveis
  if (furnRects.length) {
    rAttrs(gFurn.selectAll("rect").data(furnRects).join("rect"))
      .attr("fill","#b0b0b0").attr("fill-opacity",0.35)
      .attr("stroke","#888").attr("stroke-width",0.7);
  }

  // Paredes
  gWalls.selectAll("line").data(wallEdges).join("line")
    .attr("x1", d => xSc(d.x1)).attr("y1", d => ySc(d.y1))
    .attr("x2", d => xSc(d.x2)).attr("y2", d => ySc(d.y2))
    .attr("stroke","#3a3a3a").attr("stroke-width", Math.max(1, sc * 0.07));

  // Elementos interativos (objetivos)
  if (interRects.length) {
    const irS = interRects.map(r => {
      const mx = (r.x1+r.x2)/2, my = (r.y1+r.y2)/2;
      const hw = (r.x2-r.x1)*0.25, hh = (r.y2-r.y1)*0.25;
      return { ...r, sx1: mx-hw, sx2: mx+hw, sy1: my-hh, sy2: my+hh };
    });
    gInter.selectAll("rect").data(irS).join("rect")
      .attr("x", d => xSc(d.sx1)).attr("y", d => ySc(d.sy2))
      .attr("width", d => xSc(d.sx2)-xSc(d.sx1)).attr("height", d => ySc(d.sy1)-ySc(d.sy2))
      .attr("fill","none").attr("stroke","#5ba85b").attr("stroke-width",1.2);
    gInter.selectAll("text").data(interRects).join("text")
      .attr("x", d => xSc(d.cx)).attr("y", d => ySc(d.cy))
      .attr("text-anchor","middle").attr("dominant-baseline","central")
      .attr("font-size", Math.max(5, sc*0.25)).attr("fill","#2d6a2d").attr("font-weight","bold")
      .text(d => String(d.idx));
  }

  // Seta do jogador
  const ar = Math.max(5, Math.min(sc * 0.45, 12));
  const arD = `M 0,${-ar*1.4} L ${ar*0.8},${ar*0.9} L 0,${ar*0.3} L ${-ar*0.8},${ar*0.9} Z`;
  const arrowEl = personArrows.length
    ? gArrow.append("path").attr("d", arD).attr("fill","#222").attr("stroke","#fff").attr("stroke-width",1.5)
    : null;

  // CSS de pulsação de colisão (injetado uma vez)
  { const styleId = "ena-col-pulse-style";
    if (!document.getElementById(styleId)) {
      const st = document.createElement("style"); st.id = styleId;
      st.textContent =
        "@keyframes ena-col-pulse{0%{transform:scale(1);stroke-opacity:.85}100%{transform:scale(3.2);stroke-opacity:0}}" +
        ".ena-col-pulse{animation:ena-col-pulse 1.4s ease-out infinite;transform-box:fill-box;transform-origin:center;}";
      document.head.append(st);
    }
  }
  const colR = Math.max(4, sc * 0.11);
  const colFixedEls = colisoes.map(c =>
    gColFixed.append("circle")
      .attr("cx", xSc(c.geoX)).attr("cy", ySc(c.geoY)).attr("r", colR)
      .attr("fill", "none").attr("stroke", "#e53935").attr("stroke-width", 1.8)
      .style("display", "none")
  );
  const colPulseEls = colisoes.map(c =>
    gColPulse.append("circle")
      .attr("cx", xSc(c.geoX)).attr("cy", ySc(c.geoY)).attr("r", colR * 1.2)
      .attr("fill", "none").attr("stroke", "#e53935").attr("stroke-width", 2.2)
      .style("display", "none")
  );

  // ── Containers DOM ────────────────────────────────────────────────────────
  const mapDiv    = document.createElement("div");
  const stepLabel = document.createElement("span");
  stepLabel.style.cssText = "font-size:.7rem;color:var(--theme-foreground-muted);min-width:72px;text-align:center;font-variant-numeric:tabular-nums;flex-shrink:0;";

  mapDiv.append(svg.node());

  // ── drawStep — usa passos[], uma entrada por vez ─────────────────────────
  function drawStep(s) {
    if (s === 0) { drawInicial(); return; }

    const trail = passos.slice(0, s);
    const head  = trail.length > 0 ? trail[trail.length - 1] : null;

    // Trail: somente passos de caminhada, segmentos ortogonais de 1 tile
    const walkTrail = trail.filter(p => !p.isTurn);
    const lineSegs  = [];
    // Segmento do spawn (XML) até o primeiro WALK
    if (setaInicial && walkTrail.length > 0) {
      const adx = Math.abs(walkTrail[0].x - setaInicial.x);
      const ady = Math.abs(walkTrail[0].y - setaInicial.y);
      if (adx + ady === 1) {
        lineSegs.push({ x1: setaInicial.x, y1: setaInicial.y,
                        x2: walkTrail[0].x, y2: walkTrail[0].y, cor: walkTrail[0].cor });
      }
    }
    for (let i = 1; i < walkTrail.length; i++) {
      const adx = Math.abs(walkTrail[i].x - walkTrail[i-1].x);
      const ady = Math.abs(walkTrail[i].y - walkTrail[i-1].y);
      // Segmentos de retorno (cor cinza) passam pelo filtro sem restrição de 1 tile
      // para que o trecho sintético (último obj → spawn) seja sempre desenhado.
      const isReturn = walkTrail[i].cor === COR_RETORNO && walkTrail[i-1].cor === COR_RETORNO;
      if (isReturn || adx + ady === 1) {
        lineSegs.push({ x1: walkTrail[i-1].x, y1: walkTrail[i-1].y,
                        x2: walkTrail[i].x,   y2: walkTrail[i].y, cor: walkTrail[i].cor });
      }
    }
    // Segmento terminal: último WALK de retorno → spawn (real: 1 tile; sem efeito se já lá)
    if (setaInicial && temRetorno && walkTrail.length > 0) {
      const last = walkTrail[walkTrail.length - 1];
      if (last.cor === COR_RETORNO) {
        const adx = Math.abs(setaInicial.x - last.x);
        const ady = Math.abs(setaInicial.y - last.y);
        if (adx + ady === 1) {
          lineSegs.push({ x1: last.x, y1: last.y,
                          x2: setaInicial.x, y2: setaInicial.y, cor: COR_RETORNO });
        }
      }
    }
    const trailGroups = [];
    for (const seg of lineSegs) {
      if (!trailGroups.length || trailGroups[trailGroups.length-1].cor !== seg.cor) {
        trailGroups.push({ cor: seg.cor, pts: [{ x: seg.x1, y: seg.y1 }, { x: seg.x2, y: seg.y2 }] });
      } else {
        trailGroups[trailGroups.length-1].pts.push({ x: seg.x2, y: seg.y2 });
      }
    }
    gTrail.selectAll("path").data(trailGroups, (_, i) => i).join("path")
      .attr("d", g => "M" + g.pts.map(p => `${xSc(p.x)},${ySc(p.y)}`).join("L"))
      .attr("stroke", g => g.cor).attr("fill", "none")
      .attr("stroke-width", Math.max(sc * 0.255, 2))
      .attr("stroke-linecap", "round").attr("stroke-linejoin", "round");

    // Seta: posição = último passo; heading = headingAfter do último turn
    if (arrowEl) {
      const pos      = head ?? setaInicial;
      const lastTurn = trail.filter(p => p.isTurn).at(-1);
      const H        = lastTurn?.headingAfter ?? effectiveInitialH;
      if (pos) arrowEl.attr("transform", `translate(${xSc(pos.x)},${ySc(pos.y)}) rotate(${H})`);
    }

    // PIN piscando (paradas calculadas sobre logBruto — desativado por ora)
    stopPin.style("display", "none").classed("ena-pin-blink", false);

    // Colisões: anel pulsante na primeira janela de proximidade, fixo após sair
    colisoes.forEach((c, ci) => {
      if (c.firstNearStep < 0 || s < c.firstNearStep) {
        // ainda não chegou
        colFixedEls[ci].style("display", "none");
        colPulseEls[ci].style("display", "none").classed("ena-col-pulse", false);
      } else if (s <= c.lastNearStep) {
        // dentro da janela de proximidade original — fixo + pulsante
        colFixedEls[ci].style("display", null);
        colPulseEls[ci].style("display", null).classed("ena-col-pulse", true);
      } else {
        // já passou — só círculo fixo
        colFixedEls[ci].style("display", null);
        colPulseEls[ci].style("display", "none").classed("ena-col-pulse", false);
      }
    });

    stepLabel.textContent = `${s} / ${passos.length}`;
    slider.value = s;
  }

  // ── Controles ─────────────────────────────────────────────────────────────
  // Pontos de troca de segmento (para ⏮⏭), calculados sobre passos
  const segEnds = [];
  for (let i = 1; i < passos.length; i++) {
    if (passos[i].cor !== passos[i - 1].cor) segEnds.push(i);
  }
  segEnds.push(passos.length);

  let step = 0, playing = false, speed = 50;

  // Pinta o estado inicial: seta na posição de spawn do XML, trail ativo vazio
  function drawInicial() {
    gTrail.selectAll("path").data([]).join("path");
    stopPin.style("display", "none").classed("ena-pin-blink", false);
    colisoes.forEach((_, ci) => {
      colFixedEls[ci].style("display", "none");
      colPulseEls[ci].style("display", "none").classed("ena-col-pulse", false);
    });
    if (arrowEl && setaInicial) {
      arrowEl.attr("transform",
        `translate(${xSc(setaInicial.x)},${ySc(setaInicial.y)}) rotate(${setaInicial.heading})`);
    }
    stepLabel.textContent = "Início";
    slider.value = 0;
  }

  const slider = document.createElement("input");
  slider.type = "range"; slider.min = 0; slider.max = passos.length; slider.value = step;
  slider.style.cssText = "flex:1;accent-color:#4a90d9;min-width:80px;cursor:pointer;";
  slider.addEventListener("input", () => { step = +slider.value; drawStep(step); });

  const playBtn = document.createElement("button");
  playBtn.style.cssText = "padding:.22rem .6rem;border-radius:4px;border:1px solid var(--theme-foreground-faint);background:transparent;color:var(--theme-foreground);cursor:pointer;font-size:.85rem;font-weight:700;flex-shrink:0;";

  function stopPlay() {
    if (replayD3Timer) { clearInterval(replayD3Timer); replayD3Timer = null; }
    playing = false; playBtn.textContent = "▶";
  }
  function startPlay() {
    playing = true; playBtn.textContent = "⏸";
    if (step >= passos.length) step = 0;
    replayD3Timer = setInterval(() => { step++; drawStep(step); if (step >= passos.length) stopPlay(); }, speed);
  }
  playBtn.textContent = "▶";
  playBtn.addEventListener("click", () => playing ? stopPlay() : startPlay());

  const mkBtn = (txt, title, fn) => {
    const b = document.createElement("button"); b.textContent = txt; b.title = title;
    b.style.cssText = "padding:.22rem .5rem;border-radius:4px;border:1px solid var(--theme-foreground-faint);background:transparent;color:var(--theme-foreground);cursor:pointer;font-size:.8rem;flex-shrink:0;";
    b.addEventListener("click", fn); return b;
  };
  const speedSel = document.createElement("select");
  speedSel.style.cssText = "font-size:.72rem;border:1px solid var(--theme-foreground-faint);border-radius:4px;background:var(--theme-background);color:var(--theme-foreground);padding:.1rem .3rem;cursor:pointer;flex-shrink:0;";
  for (const [lbl, ms] of [["Super Lento",400],["Lento",120],["Normal",50],["Rápido",20]]) {
    const op = document.createElement("option"); op.value = ms; op.textContent = lbl;
    if (ms === speed) op.selected = true; speedSel.append(op);
  }
  speedSel.addEventListener("change", () => { speed = +speedSel.value; if (playing) { stopPlay(); startPlay(); } });

  const controls = document.createElement("div");
  controls.style.cssText = "display:flex;align-items:center;gap:5px;margin-bottom:6px;flex-wrap:wrap;";
  const btnPrev = mkBtn("◀","Passo anterior",()=>{ stopPlay(); if(step>0){step--;drawStep(step);} });
  const btnNext = mkBtn("▷","Próximo passo", ()=>{ stopPlay(); if(step<passos.length){step++;drawStep(step);} });
  const goSegPrev = () => { stopPlay(); const p=[...segEnds].reverse().find(e=>e<step); step=p??0; drawStep(step); };
  const goSegNext = () => { stopPlay(); const n=segEnds.find(e=>e>step); step=n??passos.length; drawStep(step); };
  controls.append(mkBtn("⏮","Seg. anterior",goSegPrev), btnPrev, playBtn, btnNext, mkBtn("⏭","Próx. segmento",goSegNext), slider, stepLabel, speedSel);

  // ── Legenda ───────────────────────────────────────────────────────────────
  const legenda = document.createElement("div");
  legenda.style.cssText = `flex-shrink:0;width:${LEGENDA_W}px;display:flex;flex-direction:column;gap:0;background:var(--theme-background-alt);border:1px solid var(--theme-foreground-faintest);border-radius:8px;padding:8px 10px;`;
  const lblSeg = document.createElement("div");
  lblSeg.style.cssText = "font-size:.65rem;font-weight:700;color:var(--theme-foreground-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;";
  lblSeg.textContent = mapaFinalizado ? "Segmentos" : "Trajetória";
  legenda.append(lblSeg);
  const mkSegRow = (cor, label, num) => {
    const row=document.createElement("div"); row.style.cssText="display:flex;align-items:center;gap:6px;margin-bottom:3px;";
    if (num != null) {
      const badge=document.createElement("div");
      badge.style.cssText=`width:16px;height:16px;border-radius:3px;background:${cor};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700;color:#fff;`;
      badge.textContent=num;
      row.append(badge);
    } else {
      const ln=document.createElement("div"); ln.style.cssText=`width:22px;height:3px;border-radius:2px;background:${cor};flex-shrink:0;`;
      row.append(ln);
    }
    const lb=document.createElement("span"); lb.style.cssText="font-size:.68rem;color:var(--theme-foreground-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100px;";
    lb.textContent=label; lb.title=label; row.append(lb); return row;
  };
  if (mapaFinalizado) {
    for (const [si, oc] of objCenters.entries()) {
      const t = oc.lastInCrossT;
      const obj = t != null
        ? objetivos.find(o => t >= (o.startTime ?? 0) && (!(o.endTime > 0) || t <= o.endTime))
        : null;
      const nome = obj?.objectiveName ?? `Objetivo ${si+1}`;
      legenda.append(mkSegRow(CORES_OBJ[si%CORES_OBJ.length], nome, si+1));
    }
    legenda.append(mkSegRow("#aaa","Rota completa", nObj + 1));
  } else { legenda.append(mkSegRow(CORES_OBJ[0],"Trajetória")); }

  const sepH=document.createElement("div"); sepH.style.cssText="border-top:1px solid var(--theme-foreground-faintest);margin:4px 0;";
  const rowH=document.createElement("div"); rowH.style.cssText="display:flex;align-items:center;gap:6px;";
  const arSvg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  arSvg.setAttribute("width","14"); arSvg.setAttribute("height","18");
  arSvg.setAttribute("viewBox","-9 -14 18 24"); arSvg.style.flexShrink="0";
  const arPath=document.createElementNS("http://www.w3.org/2000/svg","path");
  arPath.setAttribute("d","M 0,-12 L 8,9 L 0,3 L -8,9 Z");
  arPath.setAttribute("fill","#222"); arPath.setAttribute("stroke","#fff");
  arPath.setAttribute("stroke-width","2"); arPath.setAttribute("stroke-linejoin","round");
  arSvg.append(arPath);
  const lbH=document.createElement("span"); lbH.style.cssText="font-size:.68rem;color:var(--theme-foreground-muted);"; lbH.textContent="Posição atual";
  rowH.append(arSvg,lbH); legenda.append(sepH,rowH);

  // ── Montar ────────────────────────────────────────────────────────────────
  const mapRow=document.createElement("div"); mapRow.style.cssText="display:flex;align-items:flex-start;gap:8px;";
  mapRow.append(mapDiv,legenda);
  const wrapper=document.createElement("div"); wrapper.style.cssText="display:flex;flex-direction:column;gap:0;";
  wrapper.append(controls,mapRow);
  replayD3Container.append(wrapper);

  drawInicial(); // exibe apenas o ponto de spawn do XML; controles bloqueados até próxima fase
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
    renderizarDwell();
    renderizarReplay();
    renderizarReplayD3();
    renderizarLateralidade();
    renderizarComportamental();
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
const replayContainer   = document.createElement("div");
replayContainer.style.cssText = "min-height:180px";
const replayD3Container = document.createElement("div");
replayD3Container.style.cssText = "min-height:180px";
let replayTimer   = null;
let replayD3Timer = null;
const heatmapContainer = document.createElement("div");
heatmapContainer.style.cssText = "min-height:180px";
const colisaoContainer = document.createElement("div");
colisaoContainer.style.cssText = "min-height:180px";
const dwellContainer = document.createElement("div");
dwellContainer.style.cssText = "min-height:180px";
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
  barWrap.style.cssText = "margin-bottom:40px;";

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
  barOuter.append(bar, marca50);

  // Escala de % abaixo da barra
  const barScale = document.createElement("div");
  barScale.style.cssText = "display:flex;justify-content:space-between;font-size:.6rem;color:var(--theme-foreground-muted);margin-top:6px;";
  for (let p = 0; p <= 100; p += 10) {
    const s = document.createElement("span"); s.textContent = p + "%";
    barScale.append(s);
  }
  barWrap.append(barTitle, barOuter, barScale);

  // ── Silhueta + gráfico lado a lado ───────────────────────────────────────
  const row = document.createElement("div");
  row.style.cssText = "display:flex;align-items:flex-start;gap:16px;margin-top:40px;";

  // Silhueta com labels DIREITA / ESQUERDA verticais nas laterais
  const figWrap = document.createElement("div");
  figWrap.style.cssText = "flex:0 0 auto;display:flex;flex-direction:row;align-items:center;gap:6px;";

  const mkLblV = (txt, cor) => {
    const s = document.createElement("span");
    s.style.cssText = `writing-mode:vertical-lr;font-size:.7rem;font-weight:bold;color:${cor};letter-spacing:.08em;`;
    s.textContent = txt;
    return s;
  };

  const bodyCol = document.createElement("div");
  bodyCol.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:4px;";

  const svgEl = corpoSVGElement(lat);
  svgEl.style.width = "100px";

  const pctRow = document.createElement("div");
  pctRow.style.cssText = "display:flex;width:100px;justify-content:space-between;";
  const mkPct = (v, cor) => {
    const s = document.createElement("span");
    s.style.cssText = `font-size:.8rem;font-weight:bold;color:${cor};`;
    s.textContent = (v * 100).toFixed(2) + "%";
    return s;
  };
  pctRow.append(mkPct(lat.pctDireita, LAT_COR_DIR), mkPct(lat.pctEsquerda, LAT_COR_ESQ));

  bodyCol.append(svgEl, pctRow);
  figWrap.append(mkLblV("DIREITA", LAT_COR_DIR), bodyCol, mkLblV("ESQUERDA", LAT_COR_ESQ));

  // Gráfico de barras
  const chartWrap = document.createElement("div");
  chartWrap.style.cssText = "flex:1;min-width:0;";

  const barData = [
    { lado: "Direita",  n: lat.direita  },
    { lado: "Esquerda", n: lat.esquerda },
  ];
  const chartW = Math.max(140, (lateralidadeContainer.getBoundingClientRect().width || 420) - 185);
  const barChart = Plot.plot({
    width: chartW,
    height: 360,
    marginTop: 28,
    marginBottom: 55,
    marginLeft: 55,
    x: { label: null, tickRotate: -30 },
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

  row.append(chartWrap, figWrap);
  lateralidadeContainer.append(barWrap, row);
}

const lateralidadeContainer = document.createElement("div");
lateralidadeContainer.style.cssText = "min-height:260px";
const phRadar          = ph("ph-radar",         "🕸️",  "Radar de Métricas");

// ── Análise Comportamental ────────────────────────────────────────────────
function calcularComportamental(dadosLog, rows, cols, giros) {
  // 1. Exploração — tiles únicos visitados / total de tiles do mapa
  const contagem    = contarMovimentos(dadosLog);
  const tilesUnicos = contagem.size;
  const totalTiles  = (rows * cols) || 1;
  const exploracaoScore = Math.min(tilesUnicos / totalTiles, 1) * 100;

  // 2. Controle — ausência de colisões (taxa colisão/ação invertida)
  let totalAcoes = 0, totalColisoes = 0;
  for (const obj of dadosLog?.objectives ?? []) {
    totalAcoes    += (obj.actions    ?? []).length;
    totalColisoes += (obj.collisions ?? []).length;
  }
  const taxaColisao    = totalAcoes > 0 ? totalColisoes / totalAcoes : 0;
  // 0 colisões = 100 pts; >=20% de ações são colisões = 0 pts
  const controleScore  = Math.max(0, Math.min(100, (1 - taxaColisao * 5) * 100));

  // 3. Lateralidade — equilíbrio entre direita e esquerda
  const lat            = extrairLateralidade(dadosLog);
  const equilibrioScore = (1 - Math.abs(lat.pctDireita - lat.pctEsquerda)) * 100;

  // 4. Concentração — percentual do movimento nos 20% de tiles mais visitados
  const counts       = [...contagem.values()].sort((a, b) => b - a);
  const totalVisitas = counts.reduce((s, v) => s + v, 0) || 1;
  const nTop         = Math.max(1, Math.ceil(counts.length * 0.2));
  const visitasTop   = counts.slice(0, nTop).reduce((s, v) => s + v, 0);
  const concentracaoScore = (visitasTop / totalVisitas) * 100;

  // 5. Orientação — poucos giros em relação ao total de ações
  const girosRate      = totalAcoes > 0 ? giros.length / totalAcoes : 0;
  // 0% giros = 100 pts; >=30% das ações são giros = 0 pts
  const orientacaoScore = Math.max(0, Math.min(100, (1 - girosRate / 0.3) * 100));

  const dimensoes = [
    { nome: "Exploração",     score: exploracaoScore,    desc: "Área do mapa percorrida" },
    { nome: "Controle",       score: controleScore,      desc: "Ausência de colisões" },
    { nome: "Lateralidade",   score: equilibrioScore,    desc: "Equilíbrio direita / esquerda" },
    { nome: "Concentração",   score: concentracaoScore,  desc: "Foco nas áreas mais visitadas" },
    { nome: "Orientação",     score: orientacaoScore,    desc: "Navegação sem giros excessivos" },
  ];

  // Pontuação composta ponderada
  const pesos    = [0.25, 0.25, 0.15, 0.20, 0.15];
  const composta = dimensoes.reduce((s, d, i) => s + d.score * pesos[i], 0);

  return { dimensoes, composta };
}

function corScore(v) {
  return v >= 70 ? "#5ba85b" : v >= 40 ? "#e8a838" : "#e05454";
}

function renderizarComportamental() {
  try { _renderizarComportamental(); } catch(e) { console.error("renderizarComportamental:", e); }
}
function _renderizarComportamental() {
  comportamentalContainer.replaceChildren();

  const { dadosLog, rows, cols, giros } = giroState;
  if (!dadosLog) {
    const hint = document.createElement("div");
    hint.className = "giro-hint";
    hint.textContent = "Selecione uma sessão para ver a análise comportamental.";
    comportamentalContainer.append(hint);
    return;
  }

  const { dimensoes, composta } = calcularComportamental(dadosLog, rows, cols, giros);

  // ── Barras de dimensões ──────────────────────────────────────────────────
  const grid = document.createElement("div");
  grid.style.cssText = "display:flex;flex-direction:column;gap:8px;margin-bottom:14px;";

  for (const d of dimensoes) {
    const row = document.createElement("div");
    row.style.cssText = "display:grid;grid-template-columns:90px 1fr 36px;align-items:center;gap:6px;";

    const lbl = document.createElement("span");
    lbl.style.cssText = "font-size:.72rem;color:var(--theme-foreground-muted);white-space:nowrap;";
    lbl.title = d.desc;
    lbl.textContent = d.nome;

    const track = document.createElement("div");
    track.style.cssText = "background:var(--theme-background-alt,#e8e8e8);border-radius:4px;height:10px;overflow:hidden;";
    const fill = document.createElement("div");
    fill.style.cssText = `width:${d.score.toFixed(1)}%;height:100%;border-radius:4px;background:${corScore(d.score)};transition:width .4s;`;
    track.append(fill);

    const val = document.createElement("span");
    val.style.cssText = `font-size:.72rem;font-weight:700;color:${corScore(d.score)};text-align:right;`;
    val.textContent = Math.round(d.score);

    row.append(lbl, track, val);
    grid.append(row);
  }

  // ── Pontuação composta ───────────────────────────────────────────────────
  const compostoWrap = document.createElement("div");
  compostoWrap.style.cssText = "border-top:1px solid var(--theme-background-alt,#ddd);padding-top:10px;";

  const compostoLbl = document.createElement("div");
  compostoLbl.style.cssText = "font-size:.7rem;color:var(--theme-foreground-muted);margin-bottom:5px;display:flex;justify-content:space-between;align-items:center;";
  compostoLbl.innerHTML = `<span>Pontuação Composta</span><span style="font-size:.85rem;font-weight:700;color:${corScore(composta)}">${composta.toFixed(0)}<span style="font-size:.65rem;font-weight:400;color:var(--theme-foreground-muted)"> / 100</span></span>`;

  const compostoTrack = document.createElement("div");
  compostoTrack.style.cssText = "position:relative;background:var(--theme-background-alt,#e8e8e8);border-radius:6px;height:14px;overflow:visible;";

  const compostoFill = document.createElement("div");
  compostoFill.style.cssText = `width:${composta.toFixed(1)}%;height:100%;border-radius:6px;background:${corScore(composta)};transition:width .4s;`;

  // Marcador de 50%
  const m50 = document.createElement("div");
  m50.style.cssText = "position:absolute;left:50%;top:-3px;bottom:-3px;width:2px;margin-left:-1px;background:#555;opacity:.5;border-radius:1px;pointer-events:none;";
  const m50lbl = document.createElement("div");
  m50lbl.style.cssText = "position:absolute;left:50%;top:-14px;transform:translateX(-50%);font-size:.55rem;color:#555;white-space:nowrap;";
  m50lbl.textContent = "50";

  compostoTrack.append(compostoFill, m50, m50lbl);
  compostoWrap.append(compostoLbl, compostoTrack);

  comportamentalContainer.append(grid, compostoWrap);
}

const comportamentalContainer = document.createElement("div");
comportamentalContainer.style.cssText = "min-height:200px";

// ── Análise por Mapa (multi-sessão) ───────────────────────────────────────
const detalhesPorMapaContainer = document.createElement("div");
detalhesPorMapaContainer.style.cssText = "min-height:120px";
const detalhesDireitaContainer = document.createElement("div");
detalhesDireitaContainer.style.cssText = "display:flex;flex-direction:column;gap:1rem;";
const mapaRawCache2 = new Map();
let detalhesPorMapaVersion = 0;

function makeCard(label, graficoFn, chave = null) {
  const card = document.createElement("div"); card.className = "painel";
  if (chave) {
    card.dataset.quadroChave = chave;
    if (!_visivel(chave)) card.style.display = "none";
  }
  const header = document.createElement("div"); header.className = "painel-titulo";
  header.textContent = label;
  const body = document.createElement("div"); body.className = "painel-corpo";
  try {
    const g = graficoFn();
    if (g) body.append(g);
    else { const p = document.createElement("p"); p.className = "no-data-card"; p.textContent = "Sem dados disponíveis."; body.append(p); }
  } catch(e) {
    const p = document.createElement("p"); p.className = "no-data-card"; p.textContent = "Erro ao gerar gráfico.";
    console.error(label, e); body.append(p);
  }
  card.append(header, body);
  return card;
}

function renderizarEvolucaoPorMapa(sessoesComMetricas) {
  const comMetricas = [...sessoesComMetricas].reverse().filter(a => a.metricas);

  if (!comMetricas.length) {
    const p = document.createElement("p");
    p.style.cssText = "font-style:italic;font-size:.85rem;color:var(--theme-foreground-muted);";
    p.textContent = "Nenhuma métrica disponível para as sessões deste mapa.";
    return p;
  }

  const COR_RANGE    = ["#4a90e2", "#5ba85b", "#e07b54"];
  const METRICAS     = ["Precisão", "Objetivos", "Fluidez"];
  const FIELD_MAP    = { "Precisão": "precisao", "Objetivos": "objetivos", "Fluidez": "fluidez" };
  const labelsDomain = comMetricas.map(a => `#${a.sessao.id_log}`);
  const sessaoAtualLabel = estado.filtroSessaoId ? `#${estado.filtroSessaoId}` : null;
  const ultimaLabel  = labelsDomain[labelsDomain.length - 1];

  const medias = {};
  METRICAS.forEach(m => {
    const vals = comMetricas.map(a => a.metricas[FIELD_MAP[m]]).filter(v => v != null && !isNaN(v));
    medias[m] = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
  });

  let serieDestaque = null;
  const container = document.createElement("div");

  function render() {
    container.innerHTML = "";

    const allRows = comMetricas.flatMap(a => {
      const label = `#${a.sessao.id_log}`;
      return METRICAS.map(m => ({ label, metrica: m, valor: a.metricas[FIELD_MAP[m]] }));
    });

    const marcas = [];

    if (sessaoAtualLabel && labelsDomain.includes(sessaoAtualLabel)) {
      marcas.push(Plot.barX(
        [{ label: sessaoAtualLabel }],
        { x: "label", fill: "var(--theme-background-alt)", inset: -0.5 }
      ));
    }

    METRICAS.forEach((m, i) => {
      if (medias[m] == null) return;
      const apagado = serieDestaque !== null && serieDestaque !== m;
      marcas.push(Plot.ruleY([medias[m]], {
        stroke: COR_RANGE[i], strokeWidth: 1.5,
        strokeDasharray: "4,3", strokeOpacity: apagado ? 0.08 : 0.5,
      }));
    });

    METRICAS.forEach((m, i) => {
      const rows = allRows.filter(r => r.metrica === m);
      const apagado = serieDestaque !== null && serieDestaque !== m;
      const op = apagado ? 0.1 : 1;
      marcas.push(Plot.line(rows, {
        x: "label", y: "valor",
        stroke: COR_RANGE[i], strokeWidth: apagado ? 1.5 : 2.5,
        strokeOpacity: op, tip: true,
      }));
      marcas.push(Plot.dot(rows.filter(r => r.label !== ultimaLabel), {
        x: "label", y: "valor",
        stroke: COR_RANGE[i], fill: "white", r: 3.5,
        strokeOpacity: op, fillOpacity: op,
      }));
      marcas.push(Plot.dot(rows.filter(r => r.label === ultimaLabel), {
        x: "label", y: "valor",
        fill: COR_RANGE[i], r: apagado ? 3.5 : 5, fillOpacity: op,
      }));
    });

    try {
      const chart = Plot.plot({
        width: 680, height: 220,
        marginLeft: 48, marginRight: 8, marginBottom: 44, marginTop: 12,
        x: {
          label: null, domain: labelsDomain,
          tickRotate: labelsDomain.length > 6 ? -40 : 0,
        },
        y: { label: "↑ %", domain: [0, 100], grid: true, ticks: 5 },
        marks: marcas,
      });

      const leg = document.createElement("div");
      leg.style.cssText = `display:flex;gap:.75rem;justify-content:center;margin-top:6px;
        padding:5px 12px;background:var(--theme-background-alt);
        border:1px solid var(--theme-foreground-faintest);border-radius:8px;
        width:fit-content;margin-left:auto;margin-right:auto;user-select:none;`;

      METRICAS.forEach((m, i) => {
        const isDestaque = serieDestaque === m;
        const apagado    = serieDestaque !== null && !isDestaque;
        const item = document.createElement("div");
        item.style.cssText = `display:flex;align-items:center;gap:5px;cursor:pointer;
          opacity:${apagado ? 0.3 : 1};transition:opacity .15s;`;
        const dot = document.createElement("span");
        dot.style.cssText = `width:9px;height:9px;border-radius:50%;background:${COR_RANGE[i]};
          flex-shrink:0;display:inline-block;
          box-shadow:${isDestaque ? `0 0 0 2px ${COR_RANGE[i]}44` : "none"};`;
        const txt = document.createElement("span");
        txt.style.cssText = `font-size:.72rem;font-weight:${isDestaque ? 700 : 600};
          color:${isDestaque ? COR_RANGE[i] : "var(--theme-foreground-muted)"};white-space:nowrap;`;
        txt.textContent = m;
        const media = document.createElement("span");
        media.style.cssText = `font-size:.65rem;color:var(--theme-foreground-faint);margin-left:1px;white-space:nowrap;`;
        media.textContent = medias[m] != null ? `⌀ ${Math.round(medias[m])}%` : "";
        item.append(dot, txt, media);
        item.addEventListener("click", () => { serieDestaque = serieDestaque === m ? null : m; render(); });
        leg.append(item);
      });

      container.append(chart, leg);
    } catch(e) {
      console.error("renderizarEvolucaoPorMapa:", e);
      container.textContent = "Erro ao renderizar o gráfico.";
    }
  }

  render();
  return container;
}

function renderizarDetalhesPorMapa(sessoesComLog, sessoesComMetricas, mapaRaw) {
  detalhesPorMapaContainer.replaceChildren();
  detalhesDireitaContainer.replaceChildren();

  if (!sessoesComLog.length) {
    const hint = document.createElement("div"); hint.className = "giro-hint";
    hint.textContent = "Sem dados de log disponíveis para as sessões deste mapa.";
    detalhesPorMapaContainer.append(hint); return;
  }

  // Coluna direita: quadros menores alinhados com colDireita
  detalhesDireitaContainer.append(
    makeCard("Lateralidade por Sessões",   () => graficoLateralidade(sessoesComLog, Plot), "lat-por-sessoes"),
    makeCard("Colisões por Sessão",        () => graficoTrafego(sessoesComLog, Plot),      "col-por-sessao"),
    makeCard("Giros por Sessão Detalhado", () => graficoGiros(sessoesComLog, Plot),        "giros-detalhado"),
  );

  // Coluna centro: quadros maiores alinhados com colCentro
  const treemapCard = makeCard("Giros por Sessão",                       () => graficoGirosTreemap(sessoesComLog),   "giros-por-sessao");
  const rotaCard    = makeCard("Distância Percorrida vs Menor Caminho", () => {
    const g = graficoEficienciaRota(sessoesComLog, Plot, mapaRaw);
    if (g) return g;
    const p = document.createElement("p"); p.className = "no-data-card";
    p.textContent = "Logs insuficientes para calcular eficiência da rota."; return p;
  }, "dist-menor-caminho");
  const evLongCard  = makeCard("Colisões e Giros por Sessão",           () => {
    const g = graficoEvolucaoLongitudinal(sessoesComLog, estado.filtroSessaoId, Plot);
    if (g) return g;
    const p = document.createElement("p"); p.className = "no-data-card";
    p.textContent = "Logs insuficientes para exibir evolução longitudinal."; return p;
  }, "col-giros-sessao");
  const evolCard    = makeCard("Evolução por Sessão",                   () => renderizarEvolucaoPorMapa(sessoesComMetricas), "evolucao-sessao");

  const grid = document.createElement("div"); grid.className = "analise-grid";
  grid.append(treemapCard, rotaCard, evLongCard, evolCard);
  detalhesPorMapaContainer.append(grid);
}

async function atualizarDetalhesPorMapa() {
  const myVersion = ++detalhesPorMapaVersion;
  const { filtroMapa, sessoes, sessoesMultiSelecionadas } = estado;

  detalhesPorMapaContainer.replaceChildren();
  detalhesDireitaContainer.replaceChildren();

  if (filtroMapa === "todas") {
    const hint = document.createElement("div"); hint.className = "giro-hint";
    hint.textContent = "Selecione um mapa específico para ver a análise por sessões.";
    detalhesPorMapaContainer.append(hint); return;
  }

  const loadingDiv = document.createElement("div"); loadingDiv.className = "giro-hint";
  loadingDiv.textContent = "Carregando análise por sessões…";
  detalhesPorMapaContainer.append(loadingDiv);

  try {
    const todasDoMapa = sessoes.filter(s => s.nome_mapa === filtroMapa);
    const sessoesDoMapa = (multiAnalise && sessoesMultiSelecionadas.length > 0
      ? todasDoMapa.filter(s => sessoesMultiSelecionadas.includes(s.id_log))
      : todasDoMapa
    ).slice(0, 15);
    if (!sessoesDoMapa.length) {
      if (myVersion !== detalhesPorMapaVersion) return;
      detalhesPorMapaContainer.replaceChildren();
      detalhesDireitaContainer.replaceChildren();
      const hint = document.createElement("div"); hint.className = "giro-hint";
      hint.textContent = "Nenhuma sessão encontrada para este mapa.";
      detalhesPorMapaContainer.append(hint); return;
    }

    const sessoesCompletas = await Promise.all(
      sessoesDoMapa.map(s =>
        fetchSessao(s.id_log)
          .then(r => ({ sessao: s, dadosLog: r.dados_log ?? null, nomeArquivoXml: r.nome_arquivo_xml ?? null, idMapa: r.id_mapa ?? null }))
          .catch(() => ({ sessao: s, dadosLog: null, nomeArquivoXml: null, idMapa: null }))
      )
    );
    if (myVersion !== detalhesPorMapaVersion) return;

    const sessoesComLog = sessoesCompletas
      .filter(s => s.dadosLog)
      .sort((a, b) => a.sessao.id_log - b.sessao.id_log);

    let mapaRaw = null;
    for (const sc of sessoesCompletas) {
      if (!sc.nomeArquivoXml) continue;
      const cacheKey = sc.idMapa ?? sc.nomeArquivoXml;
      if (mapaRawCache2.has(cacheKey)) { mapaRaw = mapaRawCache2.get(cacheKey); break; }
      try {
        const token = sessionStorage.getItem("om_token");
        const partes = sc.nomeArquivoXml.replace(/^\//, "").split("/");
        const pasta = partes[0], arquivo = partes.slice(1).join("/");
        const resp = await fetch(`http://127.0.0.1:5000/api/treinos/arquivos/${pasta}/${arquivo}?token=${token}`);
        if (resp.ok) { mapaRaw = parseMapaXML(await resp.text()); mapaRawCache2.set(cacheKey, mapaRaw); break; }
      } catch(e) { console.warn("falha ao carregar XML:", e); }
    }
    if (myVersion !== detalhesPorMapaVersion) return;

    const sessoesComMetricas = await Promise.all(
      sessoesDoMapa.map(s =>
        fetchMetricas(s.id_log)
          .then(r => ({ sessao: s, metricas: r.metricas ?? null }))
          .catch(() => ({ sessao: s, metricas: null }))
      )
    );
    if (myVersion !== detalhesPorMapaVersion) return;

    renderizarDetalhesPorMapa(sessoesComLog, sessoesComMetricas, mapaRaw);
  } catch(e) {
    if (myVersion !== detalhesPorMapaVersion) return;
    console.error("atualizarDetalhesPorMapa:", e);
    detalhesPorMapaContainer.replaceChildren();
    detalhesDireitaContainer.replaceChildren();
    const hint = document.createElement("div"); hint.className = "giro-hint";
    hint.textContent = `Erro ao carregar análise: ${e.message}`;
    detalhesPorMapaContainer.append(hint);
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
  const todasSessoes = estado.sessoes ?? [];
  if (!todasSessoes.length) {
    const p = document.createElement("p"); p.className = "empty-hint";
    p.textContent = "Nenhuma sessão encontrada."; sessionListEl.append(p); return;
  }


  // Agrupar por nome_mapa mantendo ordem de aparecimento
  const grupos = new Map();
  for (const s of todasSessoes) {
    const key = s.nome_mapa ?? "—";
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key).push(s);
  }

  let idx = 0;
  for (const [nomeMapa, sessoesDoMapa] of grupos) {
    const cor = COR_SESSAO[idx % COR_SESSAO.length];
    const qtd = sessoesDoMapa.length;

    const group = document.createElement("div");
    group.className = "mapa-group";

    const header = document.createElement("div");
    header.className = "mapa-header";
    header.innerHTML = `
      <div class="si-dot" style="background:${cor}"></div>
      <span class="si-nome">${nomeMapa}</span>
      <span class="si-count">${qtd} sess${qtd !== 1 ? "ões" : "ão"}</span>
      `;

    const subList = document.createElement("div");
    subList.className = "mapa-sessoes";
    sessoesDoMapa.forEach(s => {
      const row = document.createElement("div");
      row.className = "mapa-sessao-row";

      const concluida = !!s.cleared_map;
      const badgeHtml = concluida
        ? `<span class="badge-ok" style="font-size:.62rem;padding:.05rem .35rem;">Concluída</span>`
        : `<span class="badge-no" style="font-size:.62rem;padding:.05rem .35rem;">Não concluída</span>`;

      row.innerHTML = `
        <span class="si-data">${s.data?.slice(0,10) ?? "—"}</span>
        <span class="si-id">#${s.id_log}</span>
        <span style="flex:1;display:flex;justify-content:flex-end;">${badgeHtml}</span>`;
      subList.append(row);
    });

    group.append(header, subList);
    sessionListEl.append(group);
    idx++;
  }
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
  if (multiAnalise) setMultiAnalise(false);
  estado.idAluno                 = idAluno;
  estado.filtroMapa              = "todas";
  estado.filtroConcl             = "todas";
  estado.filtroSessaoId          = null;
  estado.sessoesMultiSelecionadas = [];

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
        <label>Tipos de sessão</label>
        <div class="filtro-concl-btns">
          ${filtroBtnTodas}${filtroBtnConcl}${filtroBtnNaoConcl}
        </div>
      </div>
      ${multiAnaliseBtn}
      <div class="filtro-sessoes-row" style="margin-top:.35rem">
        <label>Sessão</label>
        ${filtroSessaoSelect}
      </div>
      ${multiAnaliseContainer}
      ${filtroBadge}
    </div>
  </div>

  <!-- Filtros -->
  <div class="painel">
    <div class="painel-titulo">Filtros dos mapas</div>
    <div class="painel-corpo">

      <div class="filtro-titulo">Camadas do Mapa</div>
      <div class="filtro-check">
        <label>${chkInicio} <span class="filtro-icon">⬤</span> Ponto Inicial</label>
        <label>${chkObjetos}<span class="filtro-icon">◎</span> Objetivos da cena</label>
        <label>${chkMoveis} <span class="filtro-icon">▭</span> Móveis / objetos</label>
      </div>

      <div class="filtro-titulo" style="margin-top:.75rem">Colisão</div>
      <div class="filtro-check">
        <label>${chkColisaoPoints}<span class="filtro-icon">○</span> Pontos de Colisão</label>
      </div>
    </div>
  </div>

  <!-- Sessões recentes -->
  <div class="painel painel-sessao-unica" data-quadro-chave="detalhes-atividade">
    <div class="painel-titulo">Detalhes da atividade</div>
    <div class="painel-corpo">${sessionListEl}</div>
  </div>

</div>`;

const colCentro = html`<div class="col-centro">

  <!-- Replay de Trajetória (Plot) -->
  <div class="painel painel-sessao-unica" data-quadro-chave="analise-segmento">
    <div class="painel-titulo">Análise de Segmento</div>
    <div class="painel-corpo">${replayContainer}</div>
  </div>

  <!-- Replay de Trajetória (D3) -->
  <div class="painel painel-sessao-unica" data-quadro-chave="simulador-trajetoria">
    <div class="painel-titulo">Simulador de Trajetória</div>
    <div class="painel-corpo">${replayD3Container}</div>
  </div>

  <!-- Mapa de Giros -->
  <div class="painel" data-quadro-chave="mapa-giros">
    <div class="painel-titulo">Mapa de Giros</div>
    <div class="painel-corpo">${mapaGirosContainer}</div>
  </div>

  <!-- Heatmap de eventos (Court Heatmap) -->
  <div class="painel" data-quadro-chave="eventos-area">
    <div class="painel-titulo">Eventos por Área</div>
    <div class="painel-corpo">${heatmapContainer}</div>
  </div>

  <!-- Mapa de Colisão -->
  <div class="painel" data-quadro-chave="colisoes-percurso">
    <div class="painel-titulo">Colisões no Percurso</div>
    <div class="painel-corpo">${colisaoContainer}</div>
  </div>

  <!-- Mapa de Permanência -->
  <div class="painel" data-quadro-chave="mapa-permanencia">
    <div class="painel-titulo">Mapa de Permanência</div>
    <div class="painel-corpo">${dwellContainer}</div>
  </div>


</div>`;

const colDireita = html`<div class="col-direita">



  <!-- Mapa da Lateralidade -->
  <div class="painel" data-quadro-chave="mapa-lateralidade">
    <div class="painel-titulo">Mapa da Lateralidade</div>
    <div class="painel-corpo">${lateralidadeContainer}</div>
  </div>

  <!-- Análise Comportamental -->
  <div class="painel" data-quadro-chave="analise-comportamental">
    <div class="painel-titulo">Análise Comportamental</div>
    <div class="painel-corpo">${comportamentalContainer}</div>
  </div>

</div>`;

display(html`<div>
  <div class="perfil-layout">${colEsquerda}${colCentro}${colDireita}</div>
  <div class="analise-section">
    <div class="analise-section-corpo">${detalhesPorMapaContainer}</div>
    <div class="analise-section-direita">${detalhesDireitaContainer}</div>
  </div>
</div>`);

// Aplica visibilidade dos painéis conforme preferências carregadas
aplicarVisibilidade();

// ── Carga inicial ─────────────────────────────────────────────────────────
await carregarAluno(estado.idAluno);
```
