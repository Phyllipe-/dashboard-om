---
title: Lista de Alunos
toc: false
---

<style>
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
  .page-header h1 { margin:0; font-size:1.5rem; }
  .filters { display:flex; gap:.75rem; margin-bottom:1.25rem; align-items:center; flex-wrap:wrap; }
  .filter-label { font-size:.875rem; font-weight:600; color:var(--theme-foreground-muted); }
  .filter-btn { padding:.3rem .85rem; border-radius:20px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.85rem; cursor:pointer; transition:all .15s; }
  .filter-btn.active { background:var(--theme-foreground); color:var(--theme-background); border-color:var(--theme-foreground); }
  .search-input { padding:.4rem .75rem; border:1px solid var(--theme-foreground-faint); border-radius:6px; background:var(--theme-background); color:var(--theme-foreground); font-size:.9rem; outline:none; min-width:220px; }
  .search-input:focus { border-color:#4a90e2; }
  .alunos-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:.85rem; }
  .aluno-card { border:1px solid var(--theme-foreground-faintest); border-radius:10px; padding:1rem 1.1rem; text-decoration:none; color:inherit; display:block; transition:all .15s; }
  .aluno-card:hover { background:var(--theme-background-alt); border-color:var(--theme-foreground-faint); transform:translateY(-1px); }
  .aluno-name { font-weight:700; font-size:.95rem; margin-bottom:.2rem; }
  .aluno-meta { font-size:.82rem; color:var(--theme-foreground-muted); }
  .badge { display:inline-block; padding:.15rem .5rem; border-radius:10px; font-size:.75rem; font-weight:600; margin-top:.4rem; }
  .badge-ativo   { background:#dcfce7; color:#166534; }
  .badge-inativo { background:#fee2e2; color:#991b1b; }
  .empty-state { text-align:center; padding:3rem 0; color:var(--theme-foreground-muted); }
  .stats-bar { display:flex; gap:1.25rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .stat-card { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.65rem 1.1rem; min-width:100px; }
  .stat-value { font-size:1.5rem; font-weight:700; }
  .stat-label { font-size:.76rem; color:var(--theme-foreground-muted); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAlunos } from "../api.js";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

let todosAlunos = [];
try {
  ({ alunos: todosAlunos } = await fetchAlunos());
} catch (e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro: ${e.message}</div>`);
}

let filtro = "ativo";
let busca  = "";

// Stats
const statTotal  = document.createElement("div"); statTotal.className  = "stat-card";
const statAtivos = document.createElement("div"); statAtivos.className = "stat-card";

function atualizarStats() {
  statTotal.innerHTML  = `<div class="stat-value">${todosAlunos.length}</div><div class="stat-label">Total</div>`;
  statAtivos.innerHTML = `<div class="stat-value" style="color:#166534">${todosAlunos.filter(a=>a.ativo).length}</div><div class="stat-label">Ativos</div>`;
}
atualizarStats();

// Filtros
const searchInput = document.createElement("input");
searchInput.type = "search"; searchInput.className = "search-input";
searchInput.placeholder = "Buscar por nome…";
searchInput.addEventListener("input", () => { busca = searchInput.value; renderGrid(); });

const btnAtivos   = document.createElement("button"); btnAtivos.className   = "filter-btn active"; btnAtivos.textContent = "Ativos";
const btnTodos    = document.createElement("button"); btnTodos.className    = "filter-btn";         btnTodos.textContent  = "Todos";
const btnInativos = document.createElement("button"); btnInativos.className = "filter-btn";         btnInativos.textContent = "Inativos";

function setFiltro(f) {
  filtro = f;
  [btnAtivos, btnTodos, btnInativos].forEach(b => b.classList.remove("active"));
  (f === "ativo" ? btnAtivos : f === "todos" ? btnTodos : btnInativos).classList.add("active");
  renderGrid();
}
btnAtivos.addEventListener("click",   () => setFiltro("ativo"));
btnTodos.addEventListener("click",    () => setFiltro("todos"));
btnInativos.addEventListener("click", () => setFiltro("inativo"));

// Grid
const grid = document.createElement("div");
grid.className = "alunos-grid";

function renderGrid() {
  grid.replaceChildren();
  const lista = todosAlunos.filter(a => {
    const ok = filtro === "todos" ? true : filtro === "ativo" ? a.ativo : !a.ativo;
    const q  = busca.toLowerCase();
    return ok && (!q || a.nome_completo.toLowerCase().includes(q));
  });
  if (!lista.length) {
    const p = document.createElement("p"); p.className = "empty-state"; p.textContent = "Nenhum aluno encontrado.";
    grid.append(p); return;
  }
  for (const a of lista) {
    const card = document.createElement("a");
    card.className = "aluno-card";
    card.href = `/visualizacao/dados-aluno?id=${a.id_aluno}`;
    card.innerHTML = `
      <div class="aluno-name">${a.nome_completo}</div>
      <div class="aluno-meta">${a.idade} anos${a.escolaridade ? " · " + a.escolaridade : ""}</div>
      <div class="aluno-meta">${a.email}</div>
      <span class="badge ${a.ativo ? "badge-ativo" : "badge-inativo"}">${a.ativo ? "Ativo" : "Inativo"}</span>
    `;
    grid.append(card);
  }
}
renderGrid();

// Render
const statsBar = document.createElement("div"); statsBar.className = "stats-bar";
statsBar.append(statTotal, statAtivos);

const filters = document.createElement("div"); filters.className = "filters";
const lbl = document.createElement("span"); lbl.className = "filter-label"; lbl.textContent = "Mostrar:";
filters.append(lbl, btnAtivos, btnTodos, btnInativos, searchInput);

display(html`<div>
  <div class="page-header"><h1>Alunos</h1></div>
  ${statsBar}
  ${filters}
  ${grid}
</div>`);
```
