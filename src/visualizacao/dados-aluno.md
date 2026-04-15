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
  .badge-ativo   { background:var(--om-ok-bg); color:var(--om-ok-text); }
  .badge-inativo { background:var(--om-bad-bg); color:var(--om-bad-text); }
  .badge-ok { background:var(--om-ok-bg); color:var(--om-ok-text); }
  .badge-no { background:var(--om-bad-bg); color:var(--om-bad-text); }
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
  .analise-dot { display:inline-block; width:8px; height:8px; border-radius:50%; }
  .dot-ok  { background:var(--om-ok-text); }
  .dot-no  { background:var(--theme-foreground-faintest); }
  .btn-ghost-sm { padding:.35rem .85rem; border-radius:6px; font-size:.875rem; font-weight:600; cursor:pointer; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); text-decoration:none; }
  .btn-ghost-sm:hover { background:var(--theme-background-alt); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAluno, fetchSessoes, fetchSessao, fetchAnalises } from "../api.js";
import { detectarGiros } from "../lib/sessao/giros.js";

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

// Buscar detalhe e análises de todas as sessões em paralelo
const detalhesPorLog = {};
const analisesPorLog = {};
await Promise.all(sessoes.map(async s => {
  const [det, analRes] = await Promise.all([
    fetchSessao(s.id_log).catch(() => null),
    fetchAnalises(s.id_log).catch(() => ({ analises: {} })),
  ]);
  detalhesPorLog[s.id_log] = det ?? {};
  analisesPorLog[s.id_log] = analRes.analises ?? {};
}));

// ── Tabela Análise Comportamental por Sessão ──────────────────────────────────
const tbody = document.createElement("tbody");

function fmtData(str) {
  if (!str) return "—";
  const d = new Date(str);
  if (isNaN(d)) return str.slice(0, 10);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  return `${dd}/${mm}/${yy}`;
}

function fmtTempo(seg) {
  if (seg == null) return "—";
  const m = Math.floor(seg / 60), s = Math.round(seg % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function contarGiros(dadosLog) {
  try { return detectarGiros(dadosLog).length; } catch { return "—"; }
}

function renderTabela() {
  tbody.replaceChildren();
  if (!sessoes.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td"); td.colSpan = 7; td.className = "empty-state";
    td.textContent = "Nenhuma sessão registada para este aluno.";
    tr.append(td); tbody.append(tr); return;
  }
  for (const s of sessoes) {
    const an = analisesPorLog[s.id_log] ?? {};
    const d  = detalhesPorLog[s.id_log] ?? {};
    const tr = document.createElement("tr");

    const cell = (text, opts = {}) => {
      const td = document.createElement("td");
      td.textContent = text;
      if (opts.color) td.style.color = opts.color;
      if (opts.center) td.style.textAlign = "center";
      if (opts.muted) td.style.color = "var(--theme-foreground-muted)";
      return td;
    };

    tr.append(
      cell(s.id_mapa ?? d.id_mapa ?? "—", { muted: true }),
      cell(fmtData(s.data)),
      cell(fmtTempo(d.tempo_sessao ?? s.tempo_sessao)),
      cell(d.total_acoes ?? "—", { center: true }),
      cell(d.total_colisoes ?? "—", { center: true, color: d.total_colisoes > 0 ? "#b91c1c" : null }),
      cell(contarGiros(d.dados_log), { center: true }),
      cell(d.total_objetivos != null ? `${d.objetivos_concluidos ?? 0} / ${d.total_objetivos}` : "—", { center: true }),
    );

    tbody.append(tr);
  }
}
renderTabela();

// ── Render final ──────────────────────────────────────────────────────────────
const statsBar = document.createElement("div"); statsBar.className = "stats-bar";
statsBar.append(statSessoes);

const table = document.createElement("table"); table.className = "table";
const thead = document.createElement("thead");
thead.innerHTML = `<tr>
  <th>ID Mapa</th><th>Data</th><th>Tempo Total</th>
  <th style="text-align:center">Nº Ações</th>
  <th style="text-align:center">Nº Colisões</th>
  <th style="text-align:center">Giros</th>
  <th style="text-align:center">Objetivos</th>
</tr>`;
table.append(thead, tbody);

display(html`<div>
  <div class="aluno-header">
    <div>
      <h1 class="aluno-title">${aluno.nome_completo} <span style="font-size:.75rem;font-weight:400;color:var(--theme-foreground-muted)">#${idAluno}</span></h1>
      <p class="aluno-meta">${aluno.idade} anos${aluno.escolaridade ? " · " + aluno.escolaridade : ""} · ${aluno.email} (${aluno.ativo ? "Ativo" : "Inativo"})</p>
    </div>
    </div>
  </div>
  ${statsBar}
  <p style="font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--theme-foreground-muted);margin-bottom:.5rem">Análise Comportamental por Sessão</p>
  ${table}
</div>`);
```
