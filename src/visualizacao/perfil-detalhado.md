---
title: Análise da Sessão
toc: false
---

<style>
  .back-link { font-size:.875rem; color:var(--theme-foreground-muted); text-decoration:none; display:inline-flex; align-items:center; gap:.35rem; margin-bottom:1.25rem; }
  .back-link:hover { color:var(--theme-foreground); }
  .session-title { font-size:1.4rem; font-weight:700; margin:0 0 .2rem; }
  .session-meta  { font-size:.875rem; color:var(--theme-foreground-muted); margin-bottom:1.75rem; }

  /* Barra de cobertura */
  .coverage-bar { display:flex; align-items:center; gap:.75rem; margin-bottom:1.5rem; }
  .coverage-label { font-size:.82rem; color:var(--theme-foreground-muted); white-space:nowrap; }
  .bar-track { flex:1; height:10px; background:var(--theme-foreground-faintest); border-radius:5px; overflow:hidden; }
  .bar-fill  { height:100%; border-radius:5px; background:#4a90e2; }
  .coverage-pct { font-size:.82rem; font-weight:700; white-space:nowrap; min-width:2.5rem; text-align:right; }

  /* Cards de análise */
  .analise-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.1rem; margin-bottom:2rem; }
  .analise-card { border:1px solid var(--theme-foreground-faintest); border-radius:10px; overflow:hidden; }
  .analise-card-header { display:flex; align-items:center; justify-content:space-between; padding:.65rem 1rem; background:var(--theme-background-alt); border-bottom:1px solid var(--theme-foreground-faintest); }
  .analise-card-title { font-size:.875rem; font-weight:700; }
  .badge-ok      { background:#dcfce7; color:#166534; padding:.15rem .5rem; border-radius:10px; font-size:.75rem; font-weight:600; }
  .badge-ausente { background:#f3f4f6; color:#6b7280; padding:.15rem .5rem; border-radius:10px; font-size:.75rem; font-weight:600; }
  .analise-card-body { padding:.85rem 1rem; font-size:.875rem; }
  .analise-field { display:flex; justify-content:space-between; align-items:baseline; padding:.28rem 0; border-bottom:1px solid var(--theme-foreground-faintest); gap:1rem; }
  .analise-field:last-child { border-bottom:none; }
  .field-label { color:var(--theme-foreground-muted); font-size:.82rem; flex-shrink:0; }
  .field-value { font-weight:600; text-align:right; word-break:break-all; }
  .no-data-card { color:var(--theme-foreground-muted); font-style:italic; font-size:.85rem; padding:.3rem 0; }

  /* Navegação entre sessões */
  .session-nav { display:flex; align-items:center; justify-content:space-between; margin-top:2rem; padding-top:1rem; border-top:1px solid var(--theme-foreground-faintest); }
  .nav-btn { padding:.4rem .9rem; border-radius:6px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.875rem; cursor:pointer; text-decoration:none; display:inline-block; transition:background .1s; }
  .nav-btn:hover { background:var(--theme-background-alt); }
  .nav-btn-disabled { padding:.4rem .9rem; border-radius:6px; border:1px solid var(--theme-foreground-faintest); color:var(--theme-foreground-faint); font-size:.875rem; display:inline-block; }
  .nav-center { font-size:.82rem; color:var(--theme-foreground-muted); }

  .section-title { font-size:.82rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--theme-foreground-muted); margin-bottom:.75rem; }
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
const idAluno = params.get("id")  ? parseInt(params.get("id"))  : null;
const idLog   = params.get("log") ? parseInt(params.get("log")) : null;

if (!idAluno || !idLog) {
  display(html`<p style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Parâmetros "id" e "log" são obrigatórios na URL.</p>`);
  throw new Error("parâmetros ausentes");
}

// Carregar aluno, lista de sessões e análises desta sessão em paralelo
let aluno    = null;
let sessoes  = [];
let analises = null;

try {
  [aluno, { sessoes }, { analises }] = await Promise.all([
    fetchAluno(idAluno),
    fetchSessoes(idAluno),
    fetchAnalises(idLog),
  ]);
} catch (e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro: ${e.message}</div>`);
  throw e;
}

// Posição da sessão atual na lista (sessões ordenadas desc por data)
const sessaoAtual    = sessoes.find(s => s.id_log === idLog);
const idxAtual       = sessoes.findIndex(s => s.id_log === idLog);
const sessaoAnterior = sessoes[idxAtual + 1] ?? null; // +1 = mais antiga
const sessaoProxima  = sessoes[idxAtual - 1] ?? null; // -1 = mais recente

// ── Tipos de análise ──────────────────────────────────────────────────────────
const TIPOS = [
  { key: "lateralidade",         label: "Lateralidade",   desc: "Preferência e padrão lateral de movimento" },
  { key: "simulacao_trajetoria", label: "Trajetória",      desc: "Caminho percorrido na simulação" },
  { key: "trafego",              label: "Tráfego",         desc: "Frequência de passagem por cada célula do mapa" },
  { key: "giros",                label: "Giros",           desc: "Quantidade e direção das rotações realizadas" },
  { key: "comparacao",           label: "Comparação",      desc: "Diferença em relação às sessões anteriores" },
];

// ── Barra de cobertura ────────────────────────────────────────────────────────
const disponiveis = TIPOS.filter(t => analises[t.key]).length;
const pct = Math.round((disponiveis / TIPOS.length) * 100);

const coverageBar = document.createElement("div");
coverageBar.className = "coverage-bar";
const lbl = document.createElement("span"); lbl.className = "coverage-label"; lbl.textContent = "Cobertura desta sessão:";
const track = document.createElement("div"); track.className = "bar-track";
const fill  = document.createElement("div"); fill.className = "bar-fill"; fill.style.width = pct + "%";
track.append(fill);
const pctLbl = document.createElement("span"); pctLbl.className = "coverage-pct"; pctLbl.textContent = `${disponiveis}/${TIPOS.length}`;
coverageBar.append(lbl, track, pctLbl);

// ── Cards de análise ──────────────────────────────────────────────────────────
const grid = document.createElement("div");
grid.className = "analise-grid";

for (const tipo of TIPOS) {
  const caminho = analises[tipo.key];
  const card    = document.createElement("div");
  card.className = "analise-card";

  const header  = document.createElement("div");
  header.className = "analise-card-header";
  const title   = document.createElement("span"); title.className = "analise-card-title"; title.textContent = tipo.label;
  const badge   = document.createElement("span"); badge.className = caminho ? "badge-ok" : "badge-ausente";
  badge.textContent = caminho ? "Disponível" : "Ausente";
  header.append(title, badge);

  const body = document.createElement("div");
  body.className = "analise-card-body";

  if (!caminho) {
    const p = document.createElement("p"); p.className = "no-data-card";
    p.textContent = `Nenhuma análise de ${tipo.label.toLowerCase()} registada para esta sessão.`;
    body.append(p);
  } else {
    const nomeArquivo = caminho.split("/").pop();

    const rowDesc = document.createElement("div"); rowDesc.className = "analise-field";
    const lblDesc = document.createElement("span"); lblDesc.className = "field-label"; lblDesc.textContent = "Descrição";
    const valDesc = document.createElement("span"); valDesc.className = "field-value"; valDesc.style.fontWeight = "400"; valDesc.textContent = tipo.desc;
    rowDesc.append(lblDesc, valDesc);

    const rowArq = document.createElement("div"); rowArq.className = "analise-field";
    const lblArq = document.createElement("span"); lblArq.className = "field-label"; lblArq.textContent = "Arquivo";
    const valArq = document.createElement("span"); valArq.className = "field-value";
    valArq.style.cssText = "font-size:.75rem;font-family:monospace;font-weight:400";
    valArq.textContent = nomeArquivo;
    rowArq.append(lblArq, valArq);

    body.append(rowDesc, rowArq);
  }

  card.append(header, body);
  grid.append(card);
}

// ── Navegação prev / next ─────────────────────────────────────────────────────
const sessionNav = document.createElement("div");
sessionNav.className = "session-nav";

function navEl(sessao, rotulo) {
  if (!sessao) {
    const s = document.createElement("span"); s.className = "nav-btn-disabled"; s.textContent = rotulo;
    return s;
  }
  const a = document.createElement("a");
  a.className   = "nav-btn";
  a.href        = `/visualizacao/perfil-detalhado?id=${idAluno}&log=${sessao.id_log}`;
  a.textContent = rotulo;
  return a;
}

const navCenter = document.createElement("span");
navCenter.className = "nav-center";
navCenter.textContent = `Sessão ${idxAtual + 1} de ${sessoes.length}`;

sessionNav.append(
  navEl(sessaoAnterior, "← Sessão anterior"),
  navCenter,
  navEl(sessaoProxima,  "Sessão seguinte →")
);

// ── Render ────────────────────────────────────────────────────────────────────
display(html`<div>
  <a class="back-link" href="/visualizacao/dados-aluno?id=${idAluno}">← Sessões de ${aluno.nome_completo}</a>

  <h1 class="session-title">${sessaoAtual?.nome_mapa ?? "Sessão"}</h1>
  <p class="session-meta">${aluno.nome_completo} · ${sessaoAtual?.data ?? ""} · Log #${idLog}</p>

  <p class="section-title">Cobertura de análises</p>
  ${coverageBar}

  <p class="section-title">Detalhamento por tipo</p>
  ${grid}

  ${sessionNav}
</div>`);
```
