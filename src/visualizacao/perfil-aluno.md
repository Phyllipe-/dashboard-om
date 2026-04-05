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
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAlunos, fetchAluno, fetchSessoes, fetchAnalises, fetchMetricas } from "../api.js";

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
};

// ── Elementos do DOM ──────────────────────────────────────────────────────
const selAvatar   = document.createElement("div");  selAvatar.className = "sel-avatar";
const selSelect   = document.createElement("select"); selSelect.className = "sel-select";

const chkInicio   = html`<input type="checkbox" checked>`;
const chkColisoes = html`<input type="checkbox">`;
const chkObjetivos= html`<input type="checkbox">`;

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

// Placeholders dos gráficos
function ph(classe, icon, label) {
  const d = document.createElement("div");
  d.className = `chart-placeholder ${classe}`;
  d.innerHTML = `<div class="ph-icon">${icon}</div><div class="ph-label">${label}</div>`;
  return d;
}

const phTrafego        = ph("ph-trafego",       "🗺️",  "Mapa de Tráfego e Giros");
const phHeatmap        = ph("ph-heatmap",       "🔥",  "Heatmap de Eventos");
const phLateralidade   = ph("ph-lateralidade",  "↔️",  "Mapa da Lateralidade");
const phComportamental = ph("ph-comportamental","📈",  "Análise Comportamental");
const phRadar          = ph("ph-radar",         "🕸️",  "Radar de Métricas");
const phEvolucao       = ph("ph-evolucao",      "📉",  "Evolução por Sessão");

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
function atualizarStats() {
  const total    = estado.sessoes.length;
  const comAn    = estado.analises.filter(a => a.analises).length;
  const mapas    = new Set(estado.sessoes.map(s => s.nome_mapa)).size;
  const medias   = estado.analises.filter(a => a.metricas).map(a => {
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

function atualizarAnaliseBar() {
  analiseBar.replaceChildren();
  const total = estado.sessoes.length || 1;
  for (const t of TIPOS) {
    const count = estado.analises.filter(a => a.analises?.[t]).length;
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

function atualizarSessionList() {
  sessionListEl.replaceChildren();
  if (!estado.sessoes.length) {
    const p = document.createElement("p"); p.className = "empty-hint";
    p.textContent = "Nenhuma sessão registada."; sessionListEl.append(p); return;
  }
  estado.sessoes.slice(0, 8).forEach((s, i) => {
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
  estado.idAluno = idAluno;

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

    estado.sessaoAtiva = estado.sessoes[0]?.id_log ?? null;
    renderizar();
  } catch(e) {
    console.error("Erro ao carregar aluno:", e.message);
  }
}

// ── Renderizar tudo ───────────────────────────────────────────────────────
function renderizar() {
  atualizarAvatar();
  atualizarStats();
  atualizarAnaliseBar();
  atualizarSessionList();
  popularSeletoressessao();
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

  <!-- Giros e Tráfego -->
  <div class="painel">
    <div class="painel-titulo">Análise de Giros e Eventos em Mapa</div>
    <div class="painel-corpo">
      ${phTrafego}
      <div class="legend-bar">
        <span>1</span>
        <div class="legend-gradient"></div>
        <span>5+</span>
        <span style="margin-left:.5rem;font-size:.72rem">N° de Ações</span>
      </div>
    </div>
  </div>

  <!-- Heatmap de eventos (Court Heatmap) -->
  <div class="painel">
    <div class="painel-titulo">Heatmap de Eventos por Área</div>
    <div class="painel-corpo">${phHeatmap}</div>
  </div>

</div>`;

const colDireita = html`<div class="col-direita">

  <!-- Mapa da Lateralidade -->
  <div class="painel">
    <div class="painel-titulo">Mapa da Lateralidade</div>
    <div class="painel-corpo">${phLateralidade}</div>
  </div>

  <!-- Radar de métricas -->
  <div class="painel">
    <div class="painel-titulo">Radar — Precisão · Objetivos · Fluidez</div>
    <div class="painel-corpo">${phRadar}</div>
  </div>

  <!-- Análise Comportamental -->
  <div class="painel">
    <div class="painel-titulo">Análise Comportamental</div>
    <div class="painel-corpo">${phComportamental}</div>
  </div>

  <!-- Evolução por sessão -->
  <div class="painel">
    <div class="painel-titulo">Evolução por Sessão</div>
    <div class="painel-corpo">${phEvolucao}</div>
  </div>

  <!-- Cobertura de análises -->
  <div class="painel">
    <div class="painel-titulo">Cobertura de Análises</div>
    <div class="painel-corpo">${analiseBar}</div>
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
