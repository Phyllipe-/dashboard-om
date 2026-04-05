---
title: Perfil do Aluno
toc: false
---

<style>
  .back-link { font-size:.875rem; color:var(--theme-foreground-muted); text-decoration:none; display:inline-flex; align-items:center; gap:.35rem; margin-bottom:1.25rem; }
  .back-link:hover { color:var(--theme-foreground); }
  .aluno-title { font-size:1.5rem; font-weight:700; margin:0 0 .25rem; }
  .aluno-meta  { font-size:.875rem; color:var(--theme-foreground-muted); margin-bottom:1.5rem; }
  .profile-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; margin-bottom:2rem; }
  .stat-card { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:10px; padding:1rem 1.1rem; }
  .stat-value { font-size:2rem; font-weight:700; }
  .stat-label { font-size:.78rem; color:var(--theme-foreground-muted); margin-top:.2rem; }
  .section-title { font-size:.82rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--theme-foreground-muted); margin-bottom:.65rem; }
  /* Análises disponíveis */
  .analise-bar { display:flex; flex-direction:column; gap:.4rem; margin-bottom:2rem; }
  .analise-row { display:flex; align-items:center; gap:.75rem; font-size:.875rem; }
  .analise-name { width:160px; flex-shrink:0; }
  .bar-track { flex:1; height:8px; background:var(--theme-foreground-faintest); border-radius:4px; overflow:hidden; }
  .bar-fill  { height:100%; border-radius:4px; background:#4a90e2; }
  .bar-count { width:40px; text-align:right; font-size:.82rem; color:var(--theme-foreground-muted); flex-shrink:0; }
  /* Mapa mais usado */
  .map-rank { display:flex; flex-direction:column; gap:.35rem; }
  .map-rank-item { display:flex; align-items:center; gap:.65rem; font-size:.875rem; padding:.4rem .65rem; border-radius:6px; background:var(--theme-background-alt); }
  .rank-num  { font-weight:700; color:var(--theme-foreground-muted); width:1.25rem; text-align:center; flex-shrink:0; }
  .rank-name { flex:1; }
  .rank-count { font-size:.8rem; color:var(--theme-foreground-muted); }
  .empty-hint { font-size:.88rem; color:var(--theme-foreground-muted); font-style:italic; }
  /* Últimas sessões */
  .session-list { display:flex; flex-direction:column; gap:.35rem; margin-bottom:2rem; }
  .session-item { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:.45rem .75rem; border:1px solid var(--theme-foreground-faintest); border-radius:6px; font-size:.875rem; }
  .session-item-name { flex:1; font-weight:600; }
  .session-item-date { font-size:.8rem; color:var(--theme-foreground-muted); }
  .session-item-link { font-size:.8rem; font-weight:600; color:#1d4ed8; text-decoration:none; white-space:nowrap; }
  .session-item-link:hover { text-decoration:underline; }
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

// Buscar todas as análises em paralelo (uma por sessão)
const todasAnalises = await Promise.all(
  sessoes.map(s => fetchAnalises(s.id_log).then(r => r.analises).catch(() => null))
);

// ── Estatísticas derivadas ─────────────────────────────────────────────────────
const TIPOS = ["lateralidade", "simulacao_trajetoria", "trafego", "giros", "comparacao"];
const LABELS = { lateralidade:"Lateralidade", simulacao_trajetoria:"Trajetória", trafego:"Tráfego", giros:"Giros", comparacao:"Comparação" };

// Contagem por tipo de análise disponível
const contagem = {};
TIPOS.forEach(t => contagem[t] = 0);
for (const a of todasAnalises) {
  if (!a) continue;
  for (const t of TIPOS) if (a[t]) contagem[t]++;
}

// Mapa mais utilizado
const mapaCount = {};
for (const s of sessoes) {
  mapaCount[s.nome_mapa] = (mapaCount[s.nome_mapa] || 0) + 1;
}
const mapaRank = Object.entries(mapaCount).sort((a,b) => b[1]-a[1]).slice(0, 5);

const maxAnalises = Math.max(...Object.values(contagem), 1);
const totalSessoes = sessoes.length;

// ── Construção do DOM ──────────────────────────────────────────────────────────
const profileGrid = document.createElement("div"); profileGrid.className = "profile-grid";

function statCard(value, label, color) {
  const c = document.createElement("div"); c.className = "stat-card";
  c.innerHTML = `<div class="stat-value"${color ? ` style="color:${color}"` : ""}>${value}</div><div class="stat-label">${label}</div>`;
  return c;
}

const analisesCom = todasAnalises.filter(a => a && TIPOS.some(t => a[t])).length;
profileGrid.append(
  statCard(totalSessoes, "Sessões registadas"),
  statCard(analisesCom, "Sessões analisadas", "#166534"),
  statCard(totalSessoes - analisesCom, "Sem análise", totalSessoes > analisesCom ? "#991b1b" : undefined),
  statCard(mapaRank.length, "Mapas distintos"),
);

// Análises por tipo
const analiseBar = document.createElement("div"); analiseBar.className = "analise-bar";
for (const t of TIPOS) {
  const row = document.createElement("div"); row.className = "analise-row";
  const pct = totalSessoes ? (contagem[t] / totalSessoes) * 100 : 0;
  row.innerHTML = `
    <span class="analise-name">${LABELS[t]}</span>
    <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
    <span class="bar-count">${contagem[t]}/${totalSessoes}</span>
  `;
  analiseBar.append(row);
}

// Rank de mapas
const mapRankEl = document.createElement("div"); mapRankEl.className = "map-rank";

if (!mapaRank.length) {
  const p = document.createElement("p"); p.className = "empty-hint"; p.textContent = "Nenhuma sessão registada.";
  mapRankEl.append(p);
} else {
  mapaRank.forEach(([nome, count], i) => {
    const item = document.createElement("div"); item.className = "map-rank-item";
    item.innerHTML = `<span class="rank-num">${i+1}</span><span class="rank-name">${nome}</span><span class="rank-count">${count} sessão${count !== 1 ? "ões" : ""}</span>`;
    mapRankEl.append(item);
  });
}

// Últimas 5 sessões
const sessionListEl = document.createElement("div"); sessionListEl.className = "session-list";
sessoes.slice(0, 5).forEach(s => {
  const item = document.createElement("div"); item.className = "session-item";
  const name = document.createElement("span"); name.className = "session-item-name"; name.textContent = s.nome_mapa;
  const date = document.createElement("span"); date.className = "session-item-date"; date.textContent = s.data;
  const link = document.createElement("a"); link.className = "session-item-link";
  link.href = `/visualizacao/perfil-detalhado?id=${idAluno}&log=${s.id_log}`;
  link.textContent = "Ver análise →";
  item.append(name, date, link);
  sessionListEl.append(item);
});

display(html`<div>
  <a class="back-link" href="/visualizacao/dados-aluno?id=${idAluno}">← Sessões</a>
  <h1 class="aluno-title">${aluno.nome_completo}</h1>
  <p class="aluno-meta">${aluno.idade} anos${aluno.escolaridade ? " · " + aluno.escolaridade : ""}</p>

  ${profileGrid}

  <p class="section-title">Cobertura de análises</p>
  ${analiseBar}

  <p class="section-title">Mapas mais utilizados</p>
  ${mapRankEl}

  <p class="section-title">Últimas sessões</p>
  ${sessionListEl}
</div>`);
```
