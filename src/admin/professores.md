---
title: Gerenciar Professores
toc: false
---

<style>
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
  .page-header h1 { margin:0; font-size:1.5rem; }
  .btn { padding:.6rem 1.25rem; border-radius:6px; font-size:.95rem; font-weight:600; cursor:pointer; border:none; text-decoration:none; display:inline-block; transition:opacity .15s; }
  .btn-primary { background:var(--theme-foreground); }
  a.btn-primary, button.btn-primary { color:var(--theme-background); }
  .btn-primary:hover:not(:disabled) { opacity:.82; }
  .search-input { padding:.4rem .75rem; border:1px solid var(--theme-foreground-faint); border-radius:6px; background:var(--theme-background); color:var(--theme-foreground); font-size:.9rem; outline:none; min-width:220px; }
  .search-input:focus { border-color:var(--om-accent); }
  .profs-table { width:100%; border-collapse:collapse; font-size:.9rem; }
  .profs-table th { text-align:left; padding:.6rem .75rem; border-bottom:2px solid var(--theme-foreground-faint); color:var(--theme-foreground-muted); font-weight:600; font-size:.8rem; text-transform:uppercase; letter-spacing:.04em; }
  .profs-table td { padding:.65rem .75rem; border-bottom:1px solid var(--theme-foreground-faintest); vertical-align:middle; }
  .profs-table tr:hover td { background:var(--theme-background-alt); }
  .badge { display:inline-block; padding:.2rem .6rem; border-radius:12px; font-size:.78rem; font-weight:600; }
  .badge-ativo { background:var(--om-ok-bg); color:var(--om-ok-text); }
  .badge-inativo { background:var(--om-bad-bg); color:var(--om-bad-text); }
  .btn-toggle { padding:.22rem .55rem; border-radius:5px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.78rem; cursor:pointer; text-decoration:none; white-space:nowrap; }
  .btn-toggle:hover { background:var(--theme-background-alt); }
  .btn-toggle:disabled { opacity:.4; cursor:not-allowed; }
  .btn-danger { border-color:#fca5a5; color:#dc2626; }
  .btn-danger:hover:not(:disabled) { background:#fef2f2; }
  .td-acoes { white-space:nowrap; display:flex; gap:.3rem; align-items:center; }
  .th-acao { width:1%; white-space:nowrap; }
  .td-status { width:1%; white-space:nowrap; }
  .empty-state { text-align:center; padding:3rem 0; color:var(--theme-foreground-muted); }
  .access-denied { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 1rem; text-align:center; gap:.75rem; color:var(--theme-foreground-muted); }
  .access-denied h2 { margin:0; font-size:1.2rem; color:var(--theme-foreground); }
  /* ── Modal padrão do sistema ─────────────────────────────── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.6); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; z-index:9999; padding:1rem; animation:fadeIn .18s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal-box { background:var(--theme-background); border:1px solid var(--theme-foreground-faint); border-radius:16px; overflow:hidden; width:100%; max-width:540px; box-shadow:0 24px 60px rgba(0,0,0,.4); animation:slideUp .2s ease; }
  @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
  .modal-header { display:flex; align-items:center; gap:1rem; padding:1.25rem 1.4rem 1rem; border-bottom:3px solid var(--modal-accent,#888); }
  .modal-name  { font-size:1.15rem; font-weight:700; margin-bottom:.1rem; }
  .modal-meta  { font-size:.82rem; color:var(--theme-foreground-muted); line-height:1.5; }
  .modal-close { margin-left:auto; background:none; border:none; cursor:pointer; color:var(--theme-foreground-muted); font-size:1.4rem; line-height:1; padding:.2rem .4rem; border-radius:4px; }
  .modal-close:hover { background:var(--theme-background-alt); color:var(--theme-foreground); }
  .modal-footer { padding:.85rem 1.4rem 1.1rem; display:flex; justify-content:flex-end; gap:.5rem; align-items:center; border-top:1px solid var(--theme-foreground-faintest); }
  .btn-primary-modal, .btn-ghost-modal { padding:.5rem 1.1rem; border-radius:8px; font-size:.9rem; font-weight:600; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); cursor:pointer; }
  .btn-primary-modal { background:var(--theme-foreground); color:var(--theme-background); border-color:var(--theme-foreground); }
  .btn-primary-modal:hover, .btn-ghost-modal:hover { opacity:.85; background:var(--theme-background-alt); }
  .btn-primary-modal:hover { background:var(--theme-foreground); }
  .link-input { width:100%; padding:.55rem; border:1px solid var(--theme-foreground-faint); border-radius:6px; font-size:.85rem; background:var(--theme-background-alt); color:var(--theme-foreground); box-sizing:border-box; }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchProfessores, toggleAtivoProfessor, removerProfessor, gerarLinkResetProfessor } from "../api.js";

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

async function copiarTexto(texto, input) {
  try { await navigator.clipboard.writeText(texto); return true; }
  catch { try { input?.select(); return document.execCommand("copy"); } catch { return false; } }
}

function mostrarModalLinkReset(url, nome, email, horas, copiado) {
  const input = html`<input class="link-input" type="text" readonly />`;
  input.value = url;
  const btnFechar = html`<button class="btn-ghost-modal">Fechar</button>`;
  const btnCopiar = html`<button class="btn-primary-modal">Copiar novamente</button>`;
  const btnX = html`<button class="modal-close" title="Fechar">×</button>`;
  const overlay = html`<div class="modal-overlay">
    <div class="modal-box" style="--modal-accent:#2563eb">
      <div class="modal-header">
        <div><div class="modal-name">Link de redefinição</div><div class="modal-meta">${nome} · ${email} · válido ${horas}h</div></div>
        ${btnX}
      </div>
      <div style="padding:1rem 1.4rem .25rem;">
        <p style="margin:0 0 .85rem;font-size:.9rem;line-height:1.45;color:var(--theme-foreground);">
          ${copiado ? "O link foi copiado para a área de transferência." : "Copie o link abaixo."}
          Envie ao professor — ele define a própria senha. O link expira em ${horas}h e só pode ser usado uma vez.
        </p>
        ${input}
      </div>
      <div class="modal-footer">${btnFechar}${btnCopiar}</div>
    </div>
  </div>`;
  btnCopiar.addEventListener("click", async () => {
    const ok = await copiarTexto(url, input);
    btnCopiar.textContent = ok ? "Copiado!" : "Selecione e copie";
    setTimeout(() => { btnCopiar.textContent = "Copiar novamente"; }, 1500);
  });
  const fechar = () => overlay.remove();
  btnFechar.addEventListener("click", fechar);
  btnX.addEventListener("click", fechar);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) fechar(); });
  document.body.append(overlay);
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

    const btnRemover = document.createElement("button");
    btnRemover.className = "btn-toggle btn-danger";
    btnRemover.textContent = "Remover";
    btnRemover.disabled = isAdmin;
    btnRemover.title = isAdmin ? "O administrador não pode ser removido." : "Remover professor permanentemente";
    btnRemover.addEventListener("click", async () => {
      if (!confirm(`Remover "${p.nome_completo}" permanentemente?\n\nEsta ação não pode ser desfeita.`)) return;
      btnRemover.disabled = true;
      btnRemover.textContent = "Removendo…";
      try {
        await removerProfessor(p.id_professor);
        todosProfessores = todosProfessores.filter(x => x.id_professor !== p.id_professor);
        renderTabela();
      } catch (e) {
        alert("Erro: " + e.message);
        btnRemover.disabled = false;
        btnRemover.textContent = "Remover";
      }
    });

    const btnLinkSenha = document.createElement("button");
    btnLinkSenha.className = "btn-toggle";
    btnLinkSenha.textContent = "Link senha";
    btnLinkSenha.title = "Gerar link de redefinição de senha (válido 24h)";
    btnLinkSenha.disabled = !p.ativo;
    btnLinkSenha.addEventListener("click", async () => {
      btnLinkSenha.disabled = true;
      const txt = btnLinkSenha.textContent; btnLinkSenha.textContent = "…";
      try {
        const res = await gerarLinkResetProfessor(p.id_professor);
        const tmp = document.createElement("input"); tmp.value = res.url;
        const copiado = await copiarTexto(res.url, tmp);
        mostrarModalLinkReset(res.url, p.nome_completo, p.email, res.validade_horas ?? 24, copiado);
      } catch (e) {
        alert("Erro ao gerar link: " + e.message);
      } finally {
        btnLinkSenha.disabled = !p.ativo;
        btnLinkSenha.textContent = txt;
      }
    });

    const tdNome    = document.createElement("td"); tdNome.append(linkNome);
    const tdEmail   = document.createElement("td"); tdEmail.style.color = "var(--theme-foreground-muted)"; tdEmail.textContent = p.email;
    const tdRegistro = document.createElement("td"); tdRegistro.textContent = p.registro_profissional || "—";
    const tdBadge   = document.createElement("td"); tdBadge.className = "td-status"; tdBadge.append(badge);
    const tdAcao    = document.createElement("td");
    const divAcoes  = document.createElement("div"); divAcoes.className = "td-acoes";
    divAcoes.append(btnEditar, btnLinkSenha, btnToggle, btnRemover);
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
    <thead><tr><th>Nome</th><th>Email</th><th>Registro profissional</th><th class="td-status">Status</th><th class="th-acao">Ação</th></tr></thead>
    ${tbody}
  </table>
</div>`);
```
