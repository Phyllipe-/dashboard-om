---
title: Cadastrar Professor
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
  .access-denied { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 1rem; text-align:center; gap:.75rem; color:var(--theme-foreground-muted); }
  .access-denied .icon { font-size:2.5rem; }
  .access-denied h2 { margin:0; font-size:1.2rem; color:var(--theme-foreground); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { cadastrarProfessor } from "../api.js";

const currentUser = requireAuth();
const headerUser = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser) headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

// Acesso restrito ao administrador (id_usuario = 1)
if (currentUser.id_usuario !== 1) {
  display(html`<div class="access-denied">
    <span class="icon">🔒</span>
    <h2>Acesso restrito</h2>
    <p>Esta página está disponível apenas para o administrador do sistema.</p>
    <a href="/admin/mapas" class="btn btn-ghost">← Voltar</a>
  </div>`);
  throw new Error("Acesso negado.");
}

// --- Campos do formulário ---
const fNome     = html`<input type="text"     placeholder="Nome completo" />`;
const fEmail    = html`<input type="email"    placeholder="email@exemplo.com" autocomplete="off" />`;
const fSenha    = html`<input type="password" placeholder="Senha inicial" />`;
const fNasc     = html`<input type="date" />`;
const fRegistro = html`<input type="text"     placeholder="Ex: CREFITO-3 / 12345-F (opcional)" />`;

const btnSalvar = html`<button class="btn btn-primary">Cadastrar Professor</button>`;
const alertDiv  = html`<div></div>`;

btnSalvar.addEventListener("click", async () => {
  const dados = {
    nome_completo:         fNome.value.trim(),
    email:                 fEmail.value.trim(),
    senha:                 fSenha.value,
    data_nascimento:       fNasc.value,
    registro_profissional: fRegistro.value.trim(),
  };

  if (!dados.nome_completo || !dados.email || !dados.senha || !dados.data_nascimento) {
    alertDiv.className   = "alert alert-error";
    alertDiv.textContent = "Preencha todos os campos obrigatórios.";
    return;
  }

  btnSalvar.disabled    = true;
  btnSalvar.textContent = "Salvando…";
  alertDiv.className    = "";
  alertDiv.textContent  = "";

  try {
    await cadastrarProfessor(dados);
    alertDiv.className   = "alert alert-success";
    alertDiv.textContent = `Professor "${dados.nome_completo}" cadastrado com sucesso!`;
    fNome.value = ""; fEmail.value = ""; fSenha.value = ""; fNasc.value = ""; fRegistro.value = "";
  } catch (e) {
    alertDiv.className   = "alert alert-error";
    alertDiv.textContent = e.message;
  } finally {
    btnSalvar.disabled    = false;
    btnSalvar.textContent = "Cadastrar Professor";
  }
});

display(html`<div class="form-page">
  <h1>Cadastrar Professor</h1>
  <p class="form-subtitle">Crie uma nova conta de professor. Os campos marcados com * são obrigatórios.</p>

  <div class="form-grid">
    <div class="form-field full">
      <label>Nome completo *</label>
      ${fNome}
    </div>

    <div class="form-field">
      <label>E-mail *</label>
      ${fEmail}
    </div>

    <div class="form-field">
      <label>Senha inicial *</label>
      ${fSenha}
      <span class="hint">O professor poderá alterá-la após o primeiro acesso.</span>
    </div>

    <div class="form-field">
      <label>Data de nascimento *</label>
      ${fNasc}
    </div>

    <div class="form-field">
      <label>Registro profissional</label>
      ${fRegistro}
      <span class="hint">CREFITO, CRP, CRN etc. — opcional.</span>
    </div>
  </div>

  <div class="form-actions">
    ${btnSalvar}
    <a href="/admin/alunos" class="btn btn-ghost">Cancelar</a>
  </div>

  ${alertDiv}
</div>`);
```
