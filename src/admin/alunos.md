---
title: Gerenciar Alunos
toc: false
---

<style>
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
  .page-header h1 { margin:0; font-size:1.5rem; }
  .btn { padding:.6rem 1.25rem; border-radius:6px; font-size:.95rem; font-weight:600; cursor:pointer; border:1.5px solid transparent; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box; transition:opacity .15s; }
  .btn-primary { background:var(--theme-foreground); border-color:var(--theme-foreground); }
  a.btn-primary, button.btn-primary { color:var(--theme-background); }
  .btn-primary:hover { opacity:.82; }
  .filters { display:flex; gap:1rem; margin-bottom:1.25rem; align-items:center; flex-wrap:wrap; }
  .filter-label { font-size:.875rem; font-weight:600; color:var(--theme-foreground-muted); }
  .filter-btn { padding:.35rem .9rem; border-radius:20px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.85rem; cursor:pointer; transition:all .15s; }
  .filter-btn.active { background:#1e293b; color:#fff; border-color:#1e293b; }
  .search-input { padding:.4rem .75rem; border:1px solid var(--theme-foreground-faint); border-radius:6px; background:var(--theme-background); color:var(--theme-foreground); font-size:.9rem; outline:none; min-width:220px; }
  .search-input:focus { border-color:var(--om-accent); }
  .alunos-table { width:100%; border-collapse:collapse; font-size:.9rem; }
  .alunos-table th { text-align:left; padding:.6rem .75rem; border-bottom:2px solid var(--theme-foreground-faint); color:var(--theme-foreground-muted); font-weight:600; font-size:.8rem; text-transform:uppercase; letter-spacing:.04em; }
  .alunos-table td { padding:.65rem .75rem; border-bottom:1px solid var(--theme-foreground-faintest); vertical-align:middle; }
  .alunos-table tr:hover td { background:var(--theme-background-alt); }
  .badge { display:inline-block; padding:.2rem .6rem; border-radius:12px; font-size:.78rem; font-weight:600; }
  .badge-ativo { background:var(--om-ok-bg); color:var(--om-ok-text); }
  .badge-inativo { background:var(--om-bad-bg); color:var(--om-bad-text); }
  .btn-toggle { padding:.25rem .65rem; border-radius:5px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.8rem; cursor:pointer; text-decoration:none; }
  .td-acoes { white-space:nowrap; display:flex; gap:.35rem; align-items:center; }
  .btn-toggle:hover { background:var(--theme-background-alt); }
  .btn-toggle:disabled { opacity:.4; cursor:not-allowed; }
  .empty-state { text-align:center; padding:3rem 0; color:var(--theme-foreground-muted); }
  .stats-bar { display:flex; gap:1.5rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .stat-card { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.75rem 1.25rem; min-width:120px; }
  .stat-value { font-size:1.6rem; font-weight:700; }
  .stat-label { font-size:.78rem; color:var(--theme-foreground-muted); margin-top:.1rem; }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAlunos, toggleAtivoAluno, atualizarLoginAluno } from "../api.js";

const currentUser = requireAuth();
const headerUser = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser) headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

let todosAlunos = [];
let filtroAtivo = "todos";
let busca = "";

try {
  const resp = await fetchAlunos();
  todosAlunos = resp.alunos ?? [];
} catch (e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro ao carregar alunos: ${e.message}</div>`);
}

const searchInput = html`<input class="search-input" type="search" placeholder="Buscar por nome ou email…" />`;
const btnTodos    = html`<button class="filter-btn active">Todos</button>`;
const btnAtivos   = html`<button class="filter-btn">Ativos</button>`;
const btnInativos = html`<button class="filter-btn">Inativos</button>`;
const statTotal   = html`<div class="stat-card"><div class="stat-value"></div><div class="stat-label">Total</div></div>`;
const statAtivos  = html`<div class="stat-card"><div class="stat-value" style="color:#166534"></div><div class="stat-label">Ativos</div></div>`;
const statInat    = html`<div class="stat-card"><div class="stat-value" style="color:#991b1b"></div><div class="stat-label">Inativos</div></div>`;
const tbody       = html`<tbody></tbody>`;

function atualizarStats() {
  const ativos = todosAlunos.filter(a => a.ativo).length;
  statTotal.querySelector(".stat-value").textContent  = todosAlunos.length;
  statAtivos.querySelector(".stat-value").textContent = ativos;
  statInat.querySelector(".stat-value").textContent   = todosAlunos.length - ativos;
}

function alunosFiltrados() {
  return todosAlunos.filter(a => {
    const matchFiltro = filtroAtivo === "todos" ? true : filtroAtivo === "ativo" ? a.ativo : !a.ativo;
    const q = busca.toLowerCase();
    const loginEfetivo = a.login || a.email?.split("@")[0] || "";
    const matchBusca = !q || a.nome_completo.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || loginEfetivo.toLowerCase().includes(q);
    return matchFiltro && matchBusca;
  });
}

function renderTabela() {
  const lista = alunosFiltrados();
  tbody.replaceChildren();
  if (!lista.length) {
    tbody.append(html`<tr><td colspan="6" class="empty-state">Nenhum aluno encontrado.</td></tr>`);
    return;
  }
  for (const a of lista) {
    const btnEditar = document.createElement("a");
    btnEditar.href = `/admin/editar-aluno?id=${a.id_aluno}`;
    btnEditar.className = "btn-toggle";
    btnEditar.textContent = "Editar";

    const btnToggle = html`<button class="btn-toggle">${a.ativo ? "Desativar" : "Ativar"}</button>`;
    btnToggle.addEventListener("click", async () => {
      btnToggle.disabled = true;
      try {
        const res = await toggleAtivoAluno(a.id_aluno);
        a.ativo = res.ativo;
        atualizarStats();
        renderTabela();
      } catch (e) {
        alert("Erro: " + e.message);
        btnToggle.disabled = false;
      }
    });
    const linkNome = document.createElement("a");
    linkNome.href = `/visualizacao/dados-aluno?id=${a.id_aluno}`;
    linkNome.textContent = a.nome_completo;
    linkNome.style.cssText = "font-weight:600;color:inherit;text-decoration:none;";
    linkNome.onmouseenter = () => linkNome.style.textDecoration = "underline";
    linkNome.onmouseleave = () => linkNome.style.textDecoration = "none";

    // Célula de login editável inline
    const loginEfetivo = a.login || a.email?.split("@")[0] || "";
    const loginSpan = document.createElement("span");
    loginSpan.textContent = loginEfetivo;
    loginSpan.style.cssText = "cursor:pointer;border-bottom:1px dashed var(--theme-foreground-faint);";
    loginSpan.title = "Clique para editar";
    const loginInput = document.createElement("input");
    loginInput.value = loginEfetivo;
    loginInput.style.cssText = "display:none;width:120px;padding:.2rem .4rem;border:1px solid #4a90e2;border-radius:4px;font-size:.9rem;";
    loginInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const novoLogin = loginInput.value.trim();
        if (!novoLogin || novoLogin === loginEfetivo) { loginInput.style.display = "none"; loginSpan.style.display = ""; return; }
        try {
          await atualizarLoginAluno(a.id_aluno, novoLogin);
          a.login = novoLogin;
          loginSpan.textContent = novoLogin;
        } catch (err) { alert("Erro: " + err.message); }
        loginInput.style.display = "none"; loginSpan.style.display = "";
      }
      if (e.key === "Escape") { loginInput.style.display = "none"; loginSpan.style.display = ""; }
    });
    loginInput.addEventListener("blur", () => { loginInput.style.display = "none"; loginSpan.style.display = ""; });
    loginSpan.addEventListener("click", () => { loginSpan.style.display = "none"; loginInput.style.display = ""; loginInput.focus(); loginInput.select(); });

    const tdNome   = document.createElement("td"); tdNome.append(linkNome);
    const tdEmail  = document.createElement("td"); tdEmail.style.color = "var(--theme-foreground-muted)"; tdEmail.textContent = a.email;
    const tdLogin  = document.createElement("td"); tdLogin.append(loginSpan, loginInput);
    const tdIdade  = document.createElement("td"); tdIdade.textContent = `${a.idade} anos${a.escolaridade ? " · " + a.escolaridade : ""}`;
    const tdBadge  = document.createElement("td");
    const badge    = document.createElement("span"); badge.className = `badge ${a.ativo ? "badge-ativo" : "badge-inativo"}`; badge.textContent = a.ativo ? "Ativo" : "Inativo";
    tdBadge.append(badge);
    const tdAcao   = document.createElement("td");
    const divAcoes = document.createElement("div"); divAcoes.className = "td-acoes";
    divAcoes.append(btnEditar, btnToggle);
    tdAcao.append(divAcoes);

    const tr = document.createElement("tr");
    tr.append(tdNome, tdEmail, tdLogin, tdIdade, tdBadge, tdAcao);
    tbody.append(tr);
  }
}

function setFiltro(f) {
  filtroAtivo = f;
  [btnTodos, btnAtivos, btnInativos].forEach(b => b.classList.remove("active"));
  (f === "todos" ? btnTodos : f === "ativo" ? btnAtivos : btnInativos).classList.add("active");
  renderTabela();
}

btnTodos.addEventListener("click",    () => setFiltro("todos"));
btnAtivos.addEventListener("click",   () => setFiltro("ativo"));
btnInativos.addEventListener("click", () => setFiltro("inativo"));
searchInput.addEventListener("input", () => { busca = searchInput.value; renderTabela(); });

atualizarStats();
renderTabela();

display(html`<div>
  <div class="page-header">
    <h1>Alunos</h1>
    <a href="/admin/cadastrar-aluno" class="btn btn-primary">+ Cadastrar aluno</a>
  </div>
  <div class="stats-bar">${statTotal}${statAtivos}${statInat}</div>
  <div class="filters">
    <span class="filter-label">Filtrar:</span>
    ${btnTodos}${btnAtivos}${btnInativos}
    ${searchInput}
  </div>
  <table class="alunos-table">
    <thead><tr><th>Nome</th><th>Email</th><th>Login</th><th>Idade / Escolaridade</th><th>Status</th><th>Ação</th></tr></thead>
    ${tbody}
  </table>
</div>`);
```
