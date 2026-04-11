---
title: Editar Professor
toc: false
---

<style>
  .form-page { max-width:560px; }
  .form-page h1 { font-size:1.5rem; margin-bottom:.25rem; }
  .form-subtitle { color:var(--theme-foreground-muted); font-size:.9rem; margin-bottom:2rem; }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem 1.25rem; }
  .form-field { display:flex; flex-direction:column; gap:.35rem; }
  .form-field.full { grid-column:1 / -1; }
  .form-field label { font-size:.875rem; font-weight:600; }
  .form-field input { padding:.55rem .75rem; border:1px solid var(--theme-foreground-faint); border-radius:6px; background:var(--theme-background); color:var(--theme-foreground); font-size:.95rem; outline:none; transition:border-color .15s; }
  .form-field input:focus { border-color:var(--om-accent); }
  .hint { font-size:.78rem; color:var(--theme-foreground-muted); }
  .form-actions { display:flex; gap:.75rem; margin-top:1.75rem; align-items:center; }
  .btn { padding:.6rem 1.25rem; border-radius:6px; font-size:.95rem; font-weight:600; cursor:pointer; border:none; text-decoration:none; display:inline-block; transition:opacity .15s; }
  .btn-primary { background:#1e293b; color:#fff; }
  .btn-primary:hover:not(:disabled) { opacity:.82; }
  .btn-primary:disabled { opacity:.45; cursor:not-allowed; }
  .btn-ghost { background:transparent; color:var(--theme-foreground); border:1px solid var(--theme-foreground-faint); }
  .btn-ghost:hover { background:var(--theme-background-alt); }
  .alert { padding:.7rem .9rem; border-radius:6px; font-size:.875rem; margin-top:1rem; }
  .alert-error   { background:var(--om-bad-bg); color:var(--om-bad-text); }
  .alert-success { background:var(--om-ok-bg); color:var(--om-ok-text); }
  .loading { color:var(--theme-foreground-muted); padding:2rem 0; }
  .access-denied { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 1rem; text-align:center; gap:.75rem; color:var(--theme-foreground-muted); }
  .access-denied h2 { margin:0; font-size:1.2rem; color:var(--theme-foreground); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchProfessor, editarProfessor } from "../api.js";

const currentUser = requireAuth();
const headerUser = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser) headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

if (currentUser.id_usuario !== 1) {
  display(html`<div class="access-denied">
    <h2>Acesso restrito</h2>
    <p>Esta página está disponível apenas para o administrador do sistema.</p>
    <a href="/admin/alunos" class="btn btn-ghost">← Voltar</a>
  </div>`);
  throw new Error("Acesso negado.");
}

const params = new URLSearchParams(window.location.search);
const idProfessor = parseInt(params.get("id"));

if (!idProfessor) {
  display(html`<div class="alert alert-error">ID de professor não informado.</div>`);
  throw new Error("ID ausente.");
}

const fNome     = html`<input type="text"     placeholder="Nome completo" />`;
const fEmail    = html`<input type="email"    placeholder="email@exemplo.com" />`;
const fNasc     = html`<input type="date" />`;
const fRegistro = html`<input type="text"     placeholder="Ex: CREFITO-3 / 12345-F" />`;
const fSenha    = html`<input type="password" placeholder="Deixe em branco para não alterar" />`;
const btnSalvar = html`<button class="btn btn-primary">Salvar alterações</button>`;
const alertDiv  = html`<div></div>`;

const container = html`<div class="loading">Carregando…</div>`;
display(container);

let prof;
try {
  prof = await fetchProfessor(idProfessor);
  fNome.value     = prof.nome_completo;
  fEmail.value    = prof.email;
  fNasc.value     = prof.data_nascimento ?? "";
  fRegistro.value = prof.registro_profissional ?? "";
} catch (e) {
  container.replaceWith(html`<div class="alert alert-error">Erro ao carregar professor: ${e.message}</div>`);
  throw e;
}

btnSalvar.addEventListener("click", async () => {
  const dados = {};
  if (fNome.value.trim()     !== prof.nome_completo)                dados.nome_completo          = fNome.value.trim();
  if (fEmail.value.trim()    !== prof.email)                        dados.email                  = fEmail.value.trim();
  if (fNasc.value            !== (prof.data_nascimento ?? ""))      dados.data_nascimento         = fNasc.value;
  if (fRegistro.value.trim() !== (prof.registro_profissional ?? "")) dados.registro_profissional  = fRegistro.value.trim();
  if (fSenha.value)                                                  dados.nova_senha              = fSenha.value;

  if (!Object.keys(dados).length) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Nenhuma alteração detectada.";
    return;
  }

  btnSalvar.disabled = true;
  btnSalvar.textContent = "Salvando…";
  alertDiv.className = ""; alertDiv.textContent = "";

  try {
    const atualizado = await editarProfessor(idProfessor, dados);
    Object.assign(prof, atualizado);
    fSenha.value = "";
    alertDiv.className = "alert alert-success";
    alertDiv.textContent = "Alterações salvas com sucesso!";
  } catch (e) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = e.message;
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = "Salvar alterações";
  }
});

container.replaceWith(html`<div class="form-page">
  <h1>Editar Professor</h1>
  <p class="form-subtitle">Edite os dados do professor. Campos em branco não serão alterados.</p>
  <div class="form-grid">
    <div class="form-field full"><label>Nome completo</label>${fNome}</div>
    <div class="form-field"><label>Email</label>${fEmail}</div>
    <div class="form-field"><label>Data de nascimento</label>${fNasc}</div>
    <div class="form-field"><label>Registro profissional</label>${fRegistro}<span class="hint">CREFITO, CRP, CRN etc. — opcional.</span></div>
    <div class="form-field full"><label>Nova senha</label>${fSenha}<span class="hint">Deixe em branco para manter a senha atual.</span></div>
  </div>
  <div class="form-actions">
    ${btnSalvar}
    <a href="/admin/professores" class="btn btn-ghost">Cancelar</a>
  </div>
  ${alertDiv}
</div>`);
```
