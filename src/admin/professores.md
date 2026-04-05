---
title: Gerenciar Professores
toc: false
---

<style>
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
  .page-header h1 { margin:0; font-size:1.5rem; }
  .btn { padding:.5rem 1.1rem; border-radius:6px; font-size:.9rem; font-weight:600; cursor:pointer; border:none; text-decoration:none; display:inline-block; }
  .btn-primary { background:var(--theme-foreground); color:var(--theme-background); }
  .btn-primary:hover { opacity:.82; }
  .search-input { padding:.4rem .75rem; border:1px solid var(--theme-foreground-faint); border-radius:6px; background:var(--theme-background); color:var(--theme-foreground); font-size:.9rem; outline:none; min-width:220px; }
  .search-input:focus { border-color:#4a90e2; }
  .profs-table { width:100%; border-collapse:collapse; font-size:.9rem; }
  .profs-table th { text-align:left; padding:.6rem .75rem; border-bottom:2px solid var(--theme-foreground-faint); color:var(--theme-foreground-muted); font-weight:600; font-size:.8rem; text-transform:uppercase; letter-spacing:.04em; }
  .profs-table td { padding:.65rem .75rem; border-bottom:1px solid var(--theme-foreground-faintest); vertical-align:middle; }
  .profs-table tr:hover td { background:var(--theme-background-alt); }
  .badge { display:inline-block; padding:.2rem .6rem; border-radius:12px; font-size:.78rem; font-weight:600; }
  .badge-ativo { background:#dcfce7; color:#166534; }
  .badge-inativo { background:#fee2e2; color:#991b1b; }
  .btn-toggle { padding:.25rem .65rem; border-radius:5px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.8rem; cursor:pointer; text-decoration:none; }
  .td-acoes { white-space:nowrap; display:flex; gap:.35rem; align-items:center; }
  .btn-toggle:hover { background:var(--theme-background-alt); }
  .btn-toggle:disabled { opacity:.4; cursor:not-allowed; }
  .empty-state { text-align:center; padding:3rem 0; color:var(--theme-foreground-muted); }
  .access-denied { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 1rem; text-align:center; gap:.75rem; color:var(--theme-foreground-muted); }
  .access-denied h2 { margin:0; font-size:1.2rem; color:var(--theme-foreground); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchProfessores, toggleAtivoProfessor } from "../api.js";

const currentUser = requireAuth();
const headerUser = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser) headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

if (currentUser.id_usuario !== 1) {
  display(html`<div class="access-denied">
    <h2>Acesso restrito</h2>
    <p>Esta página está disponível apenas para o administrador do sistema.</p>
    <a href="/admin/alunos" class="btn btn-primary">← Voltar</a>
  </div>`);
  throw new Error("Acesso negado.");
}

let todosProfessores = [];
let busca = "";

try {
  const resp = await fetchProfessores();
  todosProfessores = resp.professores ?? [];
} catch (e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro ao carregar professores: ${e.message}</div>`);
}

const searchInput = html`<input class="search-input" type="search" placeholder="Buscar por nome ou email…" />`;
const tbody = html`<tbody></tbody>`;

function professoresFiltrados() {
  const q = busca.toLowerCase();
  return todosProfessores.filter(p =>
    !q || p.nome_completo.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
  );
}

function renderTabela() {
  const lista = professoresFiltrados();
  tbody.replaceChildren();
  if (!lista.length) {
    tbody.append(html`<tr><td colspan="5" class="empty-state">Nenhum professor encontrado.</td></tr>`);
    return;
  }
  for (const p of lista) {
    const isAdmin = p.id_usuario === 1;

    const linkNome = document.createElement("a");
    linkNome.href = `/admin/editar-professor?id=${p.id_professor}`;
    linkNome.textContent = p.nome_completo + (isAdmin ? " (admin)" : "");
    linkNome.style.cssText = "font-weight:600;color:inherit;text-decoration:none;";
    linkNome.onmouseenter = () => linkNome.style.textDecoration = "underline";
    linkNome.onmouseleave = () => linkNome.style.textDecoration = "none";

    const badge = document.createElement("span");
    badge.className = `badge ${p.ativo ? "badge-ativo" : "badge-inativo"}`;
    badge.textContent = p.ativo ? "Ativo" : "Inativo";

    const btnEditar = document.createElement("a");
    btnEditar.href = `/admin/editar-professor?id=${p.id_professor}`;
    btnEditar.className = "btn-toggle";
    btnEditar.textContent = "Editar";

    const btnToggle = document.createElement("button");
    btnToggle.className = "btn-toggle";
    btnToggle.textContent = p.ativo ? "Desativar" : "Ativar";
    btnToggle.disabled = isAdmin;
    btnToggle.title = isAdmin ? "O administrador não pode ser desativado." : "";
    btnToggle.addEventListener("click", async () => {
      btnToggle.disabled = true;
      try {
        const res = await toggleAtivoProfessor(p.id_professor);
        p.ativo = res.ativo;
        renderTabela();
      } catch (e) {
        alert("Erro: " + e.message);
        btnToggle.disabled = isAdmin;
      }
    });

    const tdNome    = document.createElement("td"); tdNome.append(linkNome);
    const tdEmail   = document.createElement("td"); tdEmail.style.color = "var(--theme-foreground-muted)"; tdEmail.textContent = p.email;
    const tdRegistro = document.createElement("td"); tdRegistro.textContent = p.registro_profissional || "—";
    const tdBadge   = document.createElement("td"); tdBadge.append(badge);
    const tdAcao    = document.createElement("td");
    const divAcoes  = document.createElement("div"); divAcoes.className = "td-acoes";
    divAcoes.append(btnEditar, btnToggle);
    tdAcao.append(divAcoes);

    const tr = document.createElement("tr");
    tr.append(tdNome, tdEmail, tdRegistro, tdBadge, tdAcao);
    tbody.append(tr);
  }
}

searchInput.addEventListener("input", () => { busca = searchInput.value; renderTabela(); });
renderTabela();

display(html`<div>
  <div class="page-header">
    <h1>Professores</h1>
    <a href="/admin/cadastrar-professor" class="btn btn-primary">+ Cadastrar professor</a>
  </div>
  <div style="margin-bottom:1.25rem;">${searchInput}</div>
  <table class="profs-table">
    <thead><tr><th>Nome</th><th>Email</th><th>Registro profissional</th><th>Status</th><th>Ação</th></tr></thead>
    ${tbody}
  </table>
</div>`);
```
