---
title: Buscar Aluno
toc: false
---

<style>
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
  .page-header h1 { margin:0; font-size:1.5rem; }

  .search-wrap { margin-bottom:1.25rem; display:flex; gap:.75rem; align-items:center; flex-wrap:wrap; }
  .search-input {
    flex:1; min-width:240px; max-width:480px;
    padding:.5rem .85rem;
    border:1.5px solid var(--theme-foreground-faint);
    border-radius:8px;
    background:var(--theme-background);
    color:var(--theme-foreground);
    font-size:.95rem;
    outline:none;
    transition:border-color .15s;
  }
  .search-input:focus { border-color:#4a90e2; box-shadow:0 0 0 3px rgba(74,144,226,.1); }
  .search-count { font-size:.82rem; color:var(--theme-foreground-muted); white-space:nowrap; }

  .alunos-table { width:100%; border-collapse:collapse; font-size:.9rem; }
  .alunos-table th {
    text-align:left; padding:.6rem .75rem;
    border-bottom:2px solid var(--theme-foreground-faint);
    color:var(--theme-foreground-muted); font-weight:600;
    font-size:.78rem; text-transform:uppercase; letter-spacing:.04em;
    white-space:nowrap;
  }
  .alunos-table td { padding:.65rem .75rem; border-bottom:1px solid var(--theme-foreground-faintest); vertical-align:middle; }
  .alunos-table tr:hover td { background:var(--theme-background-alt); }

  .badge { display:inline-block; padding:.18rem .55rem; border-radius:12px; font-size:.75rem; font-weight:600; }
  .badge-ativo   { background:#dcfce7; color:#15803d; }
  .badge-inativo { background:#fef9c3; color:#854d0e; }

  .td-nome a { font-weight:600; color:inherit; text-decoration:none; }
  .td-nome a:hover { text-decoration:underline; color:#4a90e2; }
  .td-muted { color:var(--theme-foreground-muted); }
  .td-acoes { white-space:nowrap; display:flex; gap:.35rem; align-items:center; }
  .btn-sm { padding:.22rem .6rem; font-size:.78rem; border-radius:5px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); text-decoration:none; cursor:pointer; white-space:nowrap; display:inline-block; }
  .btn-sm:hover { background:var(--theme-background-alt); }

  .empty-state { text-align:center; padding:3rem 0; color:var(--theme-foreground-muted); }

  .btn { padding:.6rem 1.25rem; border-radius:6px; font-size:.95rem; font-weight:600; cursor:pointer; border:1.5px solid transparent; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box; transition:opacity .15s; }
  .btn-ghost { background:transparent; color:var(--theme-foreground); border-color:var(--theme-foreground-faint); }
  .btn-ghost:hover { background:var(--theme-background-alt); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { buscarTodosAlunos } from "../api.js";

const currentUser = requireAuth();
if (currentUser.id_usuario !== 1) {
  window.location.href = "/visualizacao/alunos";
  throw new Error("Acesso restrito ao administrador.");
}
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

// Parâmetro inicial vindo da página de visualização
const params       = new URLSearchParams(window.location.search);
const queryInicial = params.get("q") ?? "";

// ── Carregar todos os alunos ──────────────────────────────────────────────
let todosAlunos = [];
const loadingEl = html`<p style="color:var(--theme-foreground-muted);padding:1rem 0">Carregando…</p>`;
display(loadingEl);

try {
  ({ alunos: todosAlunos } = await buscarTodosAlunos());
} catch (e) {
  loadingEl.replaceWith(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px">Erro: ${e.message}</div>`);
  throw e;
}

// ── UI ────────────────────────────────────────────────────────────────────
const searchInput = document.createElement("input");
searchInput.type        = "search";
searchInput.className   = "search-input";
searchInput.placeholder = "Buscar por nome, login ou e-mail…";
searchInput.value       = queryInicial;

const countEl = document.createElement("span");
countEl.className = "search-count";

const tbody = document.createElement("tbody");

// ── Filtro ────────────────────────────────────────────────────────────────
function filtrar(q) {
  const lq = q.toLowerCase();
  return todosAlunos.filter(a =>
    !lq ||
    a.nome_completo.toLowerCase().includes(lq) ||
    (a.login  ?? "").toLowerCase().includes(lq) ||
    (a.email  ?? "").toLowerCase().includes(lq)
  );
}

function highlight(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(re, "<mark style='background:#fef08a;border-radius:2px;padding:0 1px'>$1</mark>");
}

function renderTabela() {
  const q     = searchInput.value.trim();
  const lista = filtrar(q);
  countEl.textContent = `${lista.length} aluno${lista.length !== 1 ? "s" : ""} encontrado${lista.length !== 1 ? "s" : ""}`;

  tbody.replaceChildren();

  if (!lista.length) {
    tbody.append(html`<tr><td colspan="7" class="empty-state">Nenhum aluno encontrado para "${q}".</td></tr>`);
    return;
  }

  for (const a of lista) {
    const badgeClass = a.ativo ? "badge-ativo" : "badge-inativo";
    const badgeText  = a.ativo ? "Ativo" : "Inativo";

    const tdNome   = document.createElement("td"); tdNome.className = "td-nome";
    tdNome.innerHTML = `<a href="/visualizacao/perfil-aluno?id=${a.id_aluno}">${highlight(a.nome_completo, q)}</a>`;

    const tdLogin  = document.createElement("td"); tdLogin.className = "td-muted";
    tdLogin.innerHTML = highlight(a.login ?? "—", q);

    const tdEmail  = document.createElement("td"); tdEmail.className = "td-muted";
    tdEmail.innerHTML = highlight(a.email ?? "—", q);

    const tdEscol  = document.createElement("td"); tdEscol.className = "td-muted";
    tdEscol.textContent = a.escolaridade || "—";

    const tdProf   = document.createElement("td"); tdProf.className = "td-muted";
    tdProf.textContent = a.professor || "—";

    const tdStatus = document.createElement("td");
    tdStatus.innerHTML = `<span class="badge ${badgeClass}">${badgeText}</span>`;

    const tdAcoes  = document.createElement("td");
    const divAcoes = document.createElement("div"); divAcoes.className = "td-acoes";
    const linkPerfil = document.createElement("a");
    linkPerfil.href = `/visualizacao/perfil-aluno?id=${a.id_aluno}`;
    linkPerfil.className = "btn-sm"; linkPerfil.textContent = "Perfil";
    const linkEditar = document.createElement("a");
    linkEditar.href = `/admin/editar-aluno?id=${a.id_aluno}`;
    linkEditar.className = "btn-sm"; linkEditar.textContent = "Editar";
    divAcoes.append(linkPerfil, linkEditar);
    tdAcoes.append(divAcoes);

    const tr = document.createElement("tr");
    tr.append(tdNome, tdLogin, tdEmail, tdEscol, tdProf, tdStatus, tdAcoes);
    tbody.append(tr);
  }
}

searchInput.addEventListener("input", renderTabela);
renderTabela();

// ── Render ────────────────────────────────────────────────────────────────
const searchWrap = document.createElement("div"); searchWrap.className = "search-wrap";
searchWrap.append(searchInput, countEl);

loadingEl.replaceWith(html`<div>
  <div class="page-header">
    <h1>Buscar Aluno</h1>
    <a href="/visualizacao/alunos" class="btn btn-ghost">← Voltar</a>
  </div>
  ${searchWrap}
  <table class="alunos-table">
    <thead>
      <tr>
        <th>Nome</th><th>Login</th><th>E-mail</th><th>Escolaridade</th><th>Professor</th><th>Status</th><th>Ação</th>
      </tr>
    </thead>
    ${tbody}
  </table>
</div>`);

// Foca o campo automaticamente
searchInput.focus();
searchInput.select();
```
