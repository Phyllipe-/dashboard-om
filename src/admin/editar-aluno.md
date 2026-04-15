---
title: Editar Aluno
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
  .loading { color:var(--theme-foreground-muted); padding:2rem 0; }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAluno, editarAluno } from "../api.js";

const currentUser = requireAuth();
const headerUser = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser) headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

const params = new URLSearchParams(window.location.search);
const idAluno = parseInt(params.get("id"));

if (!idAluno) {
  display(html`<div class="alert alert-error">ID de aluno não informado.</div>`);
  throw new Error("ID ausente.");
}

const fNome  = html`<input type="text" placeholder="Nome completo do aluno" />`;
const fEmail = html`<input type="email" placeholder="email@exemplo.com" />`;
const fLogin = html`<input type="text" placeholder="Ex: joao.silva" />`;
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
const fSenha   = html`<input type="password" placeholder="Deixe em branco para não alterar" />`;
const btnSalvar = html`<button class="btn btn-primary">Salvar alterações</button>`;
const alertDiv  = html`<div></div>`;

const container = html`<div class="loading">Carregando…</div>`;
display(container);

let aluno;
try {
  aluno = await fetchAluno(idAluno);
  fNome.value  = aluno.nome_completo;
  fEmail.value = aluno.email;
  fLogin.value = aluno.login ?? aluno.email?.split("@")[0] ?? "";
  fNasc.value  = aluno.data_nascimento ?? "";
  // selecionar escolaridade
  [...fEscol.options].forEach(o => { if (o.value === aluno.escolaridade) o.selected = true; });
} catch (e) {
  container.replaceWith(html`<div class="alert alert-error">Erro ao carregar aluno: ${e.message}</div>`);
  throw e;
}

btnSalvar.addEventListener("click", async () => {
  const dados = {};
  if (fNome.value.trim()  !== aluno.nome_completo)   dados.nome_completo   = fNome.value.trim();
  if (fEmail.value.trim() !== aluno.email)            dados.email           = fEmail.value.trim();
  if (fNasc.value         !== (aluno.data_nascimento ?? "")) dados.data_nascimento = fNasc.value;
  if (fEscol.value        !== (aluno.escolaridade ?? ""))    dados.escolaridade    = fEscol.value;
  if (fSenha.value)                                   dados.nova_senha      = fSenha.value;

  const novoLogin = fLogin.value.trim();
  const loginAtual = aluno.login ?? aluno.email?.split("@")[0] ?? "";
  if (novoLogin && novoLogin !== loginAtual)          dados.login           = novoLogin;

  if (!Object.keys(dados).length) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Nenhuma alteração detectada.";
    return;
  }

  btnSalvar.disabled = true;
  btnSalvar.textContent = "Salvando…";
  alertDiv.className = ""; alertDiv.textContent = "";

  try {
    // login é atualizado por rota separada
    const { login: loginDados, ...dadosSemLogin } = dados;
    if (Object.keys(dadosSemLogin).length) {
      const atualizado = await editarAluno(idAluno, dadosSemLogin);
      Object.assign(aluno, atualizado);
    }
    if (loginDados) {
      const { atualizarLoginAluno } = await import("../api.js");
      await atualizarLoginAluno(idAluno, loginDados);
      aluno.login = loginDados;
      fLogin.value = loginDados;
    }
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
  <h1>Editar Aluno</h1>
  <p class="form-subtitle">Edite os dados do aluno. Campos em branco não serão alterados.</p>
  <div class="form-grid">
    <div class="form-field full"><label>Nome completo</label>${fNome}</div>
    <div class="form-field"><label>Email</label>${fEmail}</div>
    <div class="form-field"><label>Login</label>${fLogin}<span class="hint">Identificador curto usado no app.</span></div>
    <div class="form-field"><label>Data de nascimento</label>${fNasc}</div>
    <div class="form-field"><label>Escolaridade</label>${fEscol}</div>
    <div class="form-field full"><label>Nova senha</label>${fSenha}<span class="hint">Deixe em branco para manter a senha atual.</span></div>
  </div>
  <div class="form-actions">
    ${btnSalvar}
    <a href="/admin/alunos" class="btn btn-ghost">Cancelar</a>
  </div>
  ${alertDiv}
</div>`);
```
