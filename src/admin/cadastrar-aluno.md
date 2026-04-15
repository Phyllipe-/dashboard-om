---
title: Cadastrar Aluno
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
  .form-field input, .form-field select { padding:.55rem .75rem; border:1px solid var(--theme-foreground-faint); border-radius:6px; background:var(--theme-background); color:var(--theme-foreground); font-size:.95rem; outline:none; transition:border-color .15s; }
  .form-field input:focus, .form-field select:focus { border-color:var(--om-accent); }
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
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { cadastrarAluno } from "../api.js";

const currentUser = requireAuth();
const headerUser = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser) headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

const fNome  = html`<input type="text" placeholder="Nome completo do aluno" />`;
const fEmail = html`<input type="email" placeholder="email@exemplo.com" autocomplete="off" />`;
const fLogin = html`<input type="text" placeholder="Ex: joao.silva" autocomplete="off" />`;
const fSenha = html`<input type="password" placeholder="Senha inicial" />`;
const fNasc  = html`<input type="date" />`;
const fEscol = html`<select>
  <option value="">— Selecione —</option>
  <option value="Educação Infantil">Educação Infantil</option>
  <option value="Ensino Fundamental I">Ensino Fundamental I</option>
  <option value="Ensino Fundamental II">Ensino Fundamental II</option>
  <option value="Ensino Médio">Ensino Médio</option>
  <option value="Ensino Superior">Ensino Superior</option>
  <option value="Outro">Outro</option>
</select>`;

const btnSalvar = html`<button class="btn btn-primary">Cadastrar</button>`;
const alertDiv  = html`<div></div>`;

// Preenche o login automaticamente a partir do email (parte antes do @)
fEmail.addEventListener("input", () => {
  if (!fLogin.dataset.edited) fLogin.value = fEmail.value.split("@")[0];
});
fLogin.addEventListener("input", () => { fLogin.dataset.edited = "1"; });

btnSalvar.addEventListener("click", async () => {
  const loginVal = fLogin.value.trim() || fEmail.value.trim().split("@")[0];
  const dados = {
    nome_completo:   fNome.value.trim(),
    email:           fEmail.value.trim(),
    login:           loginVal,
    senha:           fSenha.value,
    data_nascimento: fNasc.value,
    escolaridade:    fEscol.value,
  };
  if (!dados.nome_completo || !dados.email || !dados.senha || !dados.data_nascimento) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Preencha todos os campos obrigatórios.";
    return;
  }
  btnSalvar.disabled = true;
  btnSalvar.textContent = "Salvando…";
  alertDiv.className = ""; alertDiv.textContent = "";
  try {
    await cadastrarAluno(dados);
    alertDiv.className = "alert alert-success";
    alertDiv.textContent = `Aluno "${dados.nome_completo}" cadastrado com sucesso!`;
    fNome.value = ""; fEmail.value = ""; fLogin.value = ""; delete fLogin.dataset.edited;
    fSenha.value = ""; fNasc.value = ""; fEscol.value = "";
  } catch (e) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = e.message;
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = "Cadastrar";
  }
});

display(html`<div class="form-page">
  <h1>Cadastrar Aluno</h1>
  <p class="form-subtitle">O aluno será vinculado automaticamente ao professor logado.</p>
  <div class="form-grid">
    <div class="form-field full"><label>Nome completo *</label>${fNome}</div>
    <div class="form-field"><label>Email *</label>${fEmail}</div>
    <div class="form-field"><label>Login</label>${fLogin}<span class="hint">Preenchido automaticamente com a parte antes do @. Pode ser alterado pelo professor.</span></div>
    <div class="form-field"><label>Senha inicial *</label>${fSenha}<span class="hint">O aluno poderá alterar depois.</span></div>
    <div class="form-field"><label>Data de nascimento *</label>${fNasc}</div>
    <div class="form-field"><label>Escolaridade</label>${fEscol}</div>
  </div>
  <div class="form-actions">
    ${btnSalvar}
    <a href="/admin/alunos" class="btn btn-ghost">Cancelar</a>
  </div>
  ${alertDiv}
</div>`);
```
