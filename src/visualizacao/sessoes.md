---
title: Sessões do Aluno
toc: false
---

<style>
  .page-header { display:flex; align-items:center; gap:.75rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .page-header h1 { margin:0; font-size:1.5rem; flex:1; }
  .btn-back { padding:.35rem .85rem; border-radius:6px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.85rem; cursor:pointer; text-decoration:none; }
  .btn-back:hover { background:var(--theme-background-alt); }

  .stats-bar { display:flex; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .stat-card { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.65rem 1.1rem; min-width:110px; }
  .stat-value { font-size:1.5rem; font-weight:700; }
  .stat-label { font-size:.75rem; color:var(--theme-foreground-muted); margin-top:.1rem; }

  .sessoes-table { width:100%; border-collapse:collapse; font-size:.9rem; }
  .sessoes-table th { text-align:left; padding:.6rem .75rem; border-bottom:2px solid var(--theme-foreground-faint); color:var(--theme-foreground-muted); font-weight:600; font-size:.78rem; text-transform:uppercase; letter-spacing:.04em; }
  .sessoes-table td { padding:.65rem .75rem; border-bottom:1px solid var(--theme-foreground-faintest); vertical-align:middle; }
  .sessoes-table tr:hover td { background:var(--theme-background-alt); }

  .badge { display:inline-block; padding:.18rem .55rem; border-radius:12px; font-size:.75rem; font-weight:600; }
  .badge-ok  { background:#dcfce7; color:#166534; }
  .badge-no  { background:#fee2e2; color:#991b1b; }
  .btn-ver { padding:.25rem .65rem; border-radius:5px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.8rem; cursor:pointer; text-decoration:none; }
  .btn-ver:hover { background:var(--theme-background-alt); }
  .empty-state { text-align:center; padding:3rem 0; color:var(--theme-foreground-muted); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAluno, fetchSessoes } from "../api.js";

requireAuth();
const headerLogout = document.getElementById("header-logout");
if (headerLogout) headerLogout.addEventListener("click", logout);

const params   = new URLSearchParams(location.search);
const id_aluno = parseInt(params.get("aluno"));

if (!id_aluno) {
  display(html`<p style="color:#b91c1c">ID do aluno não informado.</p>`);
  throw new Error("sem id_aluno");
}

let aluno, sessoes = [];
try {
  [aluno, { sessoes }] = await Promise.all([
    fetchAluno(id_aluno),
    fetchSessoes(id_aluno),
  ]);
} catch(e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px">Erro: ${e.message}</div>`);
  throw e;
}

function fmtTempo(s) {
  if (s == null) return "—";
  const m = Math.floor(s / 60), seg = Math.round(s % 60);
  return m > 0 ? `${m}m ${seg}s` : `${seg}s`;
}

// ── Stats ─────────────────────────────────────────────────────────────────
const total      = sessoes.length;
const concluidas = sessoes.filter(s => s.cleared_map).length;
const mapas      = new Set(sessoes.map(s => s.id_mapa)).size;

const statTotal = document.createElement("div"); statTotal.className = "stat-card";
statTotal.innerHTML = `<div class="stat-value">${total}</div><div class="stat-label">Total de sessões</div>`;

const statConc = document.createElement("div"); statConc.className = "stat-card";
statConc.innerHTML = `<div class="stat-value" style="color:#166534">${concluidas}</div><div class="stat-label">Mapas concluídos</div>`;

const statMapas = document.createElement("div"); statMapas.className = "stat-card";
statMapas.innerHTML = `<div class="stat-value" style="color:#1d4ed8">${mapas}</div><div class="stat-label">Mapas diferentes</div>`;

// ── Tabela ────────────────────────────────────────────────────────────────
const tbody = document.createElement("tbody");

if (!sessoes.length) {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td colspan="6" class="empty-state">Nenhuma sessão registrada.</td>`;
  tbody.append(tr);
} else {
  for (const s of sessoes) {
    const badgeEl = document.createElement("span");
    badgeEl.className = `badge ${s.cleared_map ? "badge-ok" : "badge-no"}`;
    badgeEl.textContent = s.cleared_map ? "Concluído" : "Não concluído";

    const btnVer = document.createElement("a");
    btnVer.href = `/visualizacao/sessao?id=${s.id_log}&aluno=${id_aluno}`;
    btnVer.className = "btn-ver";
    btnVer.textContent = "Ver detalhes";

    const tdId    = document.createElement("td"); tdId.textContent = `#${s.id_log}`; tdId.style.color = "var(--theme-foreground-muted)";
    const tdMapa  = document.createElement("td"); tdMapa.textContent = s.nome_mapa; tdMapa.style.fontWeight = "600";
    const tdData  = document.createElement("td"); tdData.textContent = s.data;
    const tdTempo = document.createElement("td"); tdTempo.textContent = fmtTempo(s.tempo_sessao);
    const tdRes   = document.createElement("td"); tdRes.append(badgeEl);
    const tdAcao  = document.createElement("td"); tdAcao.append(btnVer);

    const tr = document.createElement("tr");
    tr.append(tdId, tdMapa, tdData, tdTempo, tdRes, tdAcao);
    tbody.append(tr);
  }
}

// ── Render ────────────────────────────────────────────────────────────────
const nomeAluno = aluno?.nome_completo ?? `Aluno #${id_aluno}`;
const voltar = `/visualizacao/perfil-aluno?id=${id_aluno}`;

display(html`<div>
  <div class="page-header">
    <a class="btn-back" href="${voltar}">← Voltar</a>
    <h1>Sessões — ${nomeAluno}</h1>
  </div>
  <div class="stats-bar">${statTotal}${statConc}${statMapas}</div>
  <table class="sessoes-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Mapa</th>
        <th>Data</th>
        <th>Tempo</th>
        <th>Resultado</th>
        <th></th>
      </tr>
    </thead>
    ${tbody}
  </table>
</div>`);
```
