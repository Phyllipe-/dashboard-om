---
title: Sessões do Aluno
toc: false
---

<style>
  .back-link { font-size:.875rem; color:var(--theme-foreground-muted); text-decoration:none; display:inline-flex; align-items:center; gap:.35rem; margin-bottom:1.25rem; }
  .back-link:hover { color:var(--theme-foreground); }
  .aluno-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem; }
  .aluno-title  { font-size:1.5rem; font-weight:700; margin:0 0 .2rem; }
  .aluno-meta   { font-size:.875rem; color:var(--theme-foreground-muted); }
  .badge { display:inline-block; padding:.18rem .55rem; border-radius:12px; font-size:.78rem; font-weight:600; }
  .badge-ativo   { background:#dcfce7; color:#166534; }
  .badge-inativo { background:#fee2e2; color:#991b1b; }
  .stats-bar { display:flex; gap:1.25rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .stat-card { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.65rem 1.1rem; min-width:110px; }
  .stat-value { font-size:1.5rem; font-weight:700; }
  .stat-label { font-size:.76rem; color:var(--theme-foreground-muted); }
  .table { width:100%; border-collapse:collapse; font-size:.9rem; }
  .table th { text-align:left; padding:.55rem .75rem; border-bottom:2px solid var(--theme-foreground-faint); color:var(--theme-foreground-muted); font-size:.78rem; text-transform:uppercase; letter-spacing:.04em; }
  .table td { padding:.6rem .75rem; border-bottom:1px solid var(--theme-foreground-faintest); vertical-align:middle; }
  .table tr.clickable:hover td { background:var(--theme-background-alt); cursor:pointer; }
  .table tr.detail-row td { padding:0; border-bottom:2px solid var(--theme-foreground-faint); }
  .empty-state { text-align:center; padding:2.5rem 0; color:var(--theme-foreground-muted); }
  .chevron { font-size:.75rem; color:var(--theme-foreground-muted); transition:transform .2s; display:inline-block; }
  .chevron.open { transform:rotate(90deg); }
  /* Análises */
  .analise-panel { padding:1rem 1.25rem; background:var(--theme-background-alt); display:flex; flex-wrap:wrap; gap:.6rem; align-items:center; }
  .analise-chip { padding:.3rem .75rem; border-radius:6px; font-size:.82rem; font-weight:600; text-decoration:none; }
  .analise-disponivel { background:#dbeafe; color:#1d4ed8; }
  .analise-ausente    { background:var(--theme-background); border:1px dashed var(--theme-foreground-faintest); color:var(--theme-foreground-muted); font-style:italic; }
  .analise-label { font-size:.78rem; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:var(--theme-foreground-muted); margin-right:.25rem; }
  .no-data { font-size:.85rem; color:var(--theme-foreground-muted); padding:.5rem .75rem; font-style:italic; }
  .analise-ver-link { margin-left:auto; padding:.28rem .75rem; border-radius:6px; font-size:.8rem; font-weight:600; background:var(--theme-foreground); color:var(--theme-background); text-decoration:none; white-space:nowrap; }
  .analise-ver-link:hover { opacity:.82; }
  .btn-ghost-sm { padding:.35rem .85rem; border-radius:6px; font-size:.875rem; font-weight:600; cursor:pointer; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); text-decoration:none; }
  .btn-ghost-sm:hover { background:var(--theme-background-alt); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAluno, fetchSessoes, fetchAnalises } from "../api.js";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

const params  = new URLSearchParams(window.location.search);
const idAluno = params.get("id") ? parseInt(params.get("id")) : null;

if (!idAluno) {
  display(html`<p style="color:#b91c1c">Parâmetro "id" ausente na URL.</p>`);
  throw new Error("id ausente");
}

// Carregar aluno e sessões em paralelo
let aluno   = null;
let sessoes = [];
try {
  [aluno, { sessoes }] = await Promise.all([
    fetchAluno(idAluno),
    fetchSessoes(idAluno),
  ]);
} catch (e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro: ${e.message}</div>`);
  throw e;
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const statSessoes  = document.createElement("div"); statSessoes.className  = "stat-card";
statSessoes.innerHTML  = `<div class="stat-value">${sessoes.length}</div><div class="stat-label">Sessões</div>`;

// ── Tabela de sessões com detalhe de análises ─────────────────────────────────
const tbody = document.createElement("tbody");
const cacheAnalises = {};
let expandidoLog = null;

const TIPOS_ANALISE = ["lateralidade", "simulacao_trajetoria", "trafego", "giros", "comparacao"];
const LABEL_ANALISE = {
  lateralidade:          "Lateralidade",
  simulacao_trajetoria:  "Trajetória",
  trafego:               "Tráfego",
  giros:                 "Giros",
  comparacao:            "Comparação",
};

function criarPainelAnalises(analises, id_log) {
  const panel = document.createElement("div");
  panel.className = "analise-panel";

  const lbl = document.createElement("span");
  lbl.className = "analise-label";
  lbl.textContent = "Análises:";
  panel.append(lbl);

  for (const tipo of TIPOS_ANALISE) {
    const chip = document.createElement("span");
    chip.className  = analises[tipo] ? "analise-chip analise-disponivel" : "analise-chip analise-ausente";
    chip.textContent = LABEL_ANALISE[tipo] + (analises[tipo] ? " ✔" : " —");
    panel.append(chip);
  }

  const verLink = document.createElement("a");
  verLink.className = "analise-ver-link";
  verLink.href      = `/visualizacao/perfil-detalhado?id=${idAluno}&log=${id_log}`;
  verLink.textContent = "Ver análise →";
  panel.append(verLink);

  return panel;
}

async function toggleDetalhe(id_log, detailTr, chevron) {
  if (expandidoLog === id_log) {
    detailTr.style.display = "none";
    detailTr.querySelector("td").replaceChildren();
    expandidoLog = null;
    chevron.classList.remove("open");
    return;
  }
  if (expandidoLog !== null) {
    const ant = tbody.querySelector(`tr[data-detail-for="${expandidoLog}"]`);
    if (ant) { ant.style.display = "none"; ant.querySelector("td").replaceChildren(); }
    const ca = tbody.querySelector(`tr[data-id="${expandidoLog}"] .chevron`);
    if (ca) ca.classList.remove("open");
  }
  expandidoLog = id_log;
  chevron.classList.add("open");
  detailTr.style.display = "";
  const td = detailTr.querySelector("td");
  td.textContent = "Carregando análises…";
  td.style.padding = ".75rem";
  try {
    if (!cacheAnalises[id_log]) {
      const res = await fetchAnalises(id_log);
      cacheAnalises[id_log] = res.analises;
    }
    td.style.padding = "0";
    td.replaceChildren(criarPainelAnalises(cacheAnalises[id_log], id_log));
  } catch (e) {
    td.textContent = "Erro: " + e.message;
    td.style.color = "#b91c1c";
  }
}

function renderTabela() {
  tbody.replaceChildren();
  if (!sessoes.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td"); td.colSpan = 3; td.className = "empty-state";
    td.textContent = "Nenhuma sessão registada para este aluno.";
    tr.append(td); tbody.append(tr); return;
  }
  for (const s of sessoes) {
    const tr = document.createElement("tr"); tr.className = "clickable"; tr.dataset.id = s.id_log;

    const detailTr = document.createElement("tr"); detailTr.className = "detail-row";
    detailTr.dataset.detailFor = s.id_log; detailTr.style.display = "none";
    const detailTd = document.createElement("td"); detailTd.colSpan = 3; detailTr.append(detailTd);

    const chevron = document.createElement("span"); chevron.className = "chevron"; chevron.textContent = "▶";

    const tdMapa = document.createElement("td"); tdMapa.style.fontWeight = "600";
    tdMapa.append(chevron, document.createTextNode(" " + s.nome_mapa));

    const tdData = document.createElement("td"); tdData.style.cssText = "font-size:.85rem;color:var(--theme-foreground-muted)";
    tdData.textContent = s.data;

    const tdId = document.createElement("td"); tdId.style.cssText = "font-size:.78rem;color:var(--theme-foreground-faint)";
    tdId.textContent = `#${s.id_log}`;

    tr.append(tdMapa, tdData, tdId);
    tr.addEventListener("click", () => toggleDetalhe(s.id_log, detailTr, chevron));

    tbody.append(tr, detailTr);
  }
}
renderTabela();

// ── Render final ──────────────────────────────────────────────────────────────
const statsBar = document.createElement("div"); statsBar.className = "stats-bar";
statsBar.append(statSessoes);

const table = document.createElement("table"); table.className = "table";
const thead = document.createElement("thead");
thead.innerHTML = "<tr><th>Mapa</th><th>Data</th><th>Log #</th></tr>";
table.append(thead, tbody);

display(html`<div>
  <a class="back-link" href="/visualizacao/alunos">← Lista de alunos</a>
  <div class="aluno-header">
    <div>
      <h1 class="aluno-title">${aluno.nome_completo}</h1>
      <p class="aluno-meta">${aluno.idade} anos${aluno.escolaridade ? " · " + aluno.escolaridade : ""} · ${aluno.email}</p>
    </div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.5rem">
      <span class="badge ${aluno.ativo ? "badge-ativo" : "badge-inativo"}">${aluno.ativo ? "Ativo" : "Inativo"}</span>
      <a class="btn-ghost-sm" href="/visualizacao/perfil-aluno?id=${idAluno}">Perfil geral →</a>
    </div>
  </div>
  ${statsBar}
  ${table}
</div>`);
```
