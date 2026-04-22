---
title: Cadastrar Aluno
toc: false
---

<style>
  .form-page { max-width: 560px; }
  .form-page h1 { font-size: 1.5rem; margin-bottom: .25rem; }
  .form-subtitle { color: var(--theme-foreground-muted); font-size: .9rem; margin-bottom: 2rem; }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.25rem; }
  .form-field { display: flex; flex-direction: column; gap: .35rem; }
  .form-field.full { grid-column: 1 / -1; }
  .form-field label { font-size: .875rem; font-weight: 600; }

  .form-field input,
  .form-field select {
    width: 100%;
    box-sizing: border-box;
    padding: .55rem .75rem;
    border: 1.5px solid var(--theme-foreground-faint);
    border-radius: 6px;
    background: var(--theme-background);
    color: var(--theme-foreground);
    font-size: .95rem;
    outline: none;
    transition: border-color .15s;
  }
  .form-field input:focus, .form-field select:focus { border-color: var(--om-accent); }
  .form-field input.input-err { border-color: var(--om-bad-text); }

  .hint { font-size: .78rem; color: var(--theme-foreground-muted); }
  .field-feedback { font-size: .78rem; margin-top: .15rem; min-height: 1em; }
  .field-ok  { color: var(--om-ok-text,  #16a34a); }
  .field-err { color: var(--om-bad-text, #dc2626); }

  /* Endereço */
  .section-label {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: .6rem;
    font-size: .875rem;
    font-weight: 600;
    margin-top: .5rem;
    cursor: pointer;
    user-select: none;
  }
  .section-label input[type="checkbox"] { width: auto; cursor: pointer; }
  .endereco-fields { grid-column: 1 / -1; display: none; }
  .endereco-fields.visible { display: contents; }
  .cep-wrap { max-width: 160px; }

  .form-actions { display: flex; gap: .75rem; margin-top: 1.75rem; align-items: stretch; }
  .btn { padding: .6rem 1.25rem; border-radius: 6px; font-size: .95rem; font-weight: 600; cursor: pointer; border: 1.5px solid transparent; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; transition: opacity .15s; }
  .btn-primary { background: var(--theme-foreground); border-color: var(--theme-foreground); }
  a.btn-primary, button.btn-primary { color: var(--theme-background); }
  .btn-primary:hover:not(:disabled) { opacity: .82; }
  .btn-primary:disabled { opacity: .45; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: var(--theme-foreground); border-color: var(--theme-foreground-faint); }
  .btn-ghost:hover { background: var(--theme-background-alt); }
  .alert { padding: .7rem .9rem; border-radius: 6px; font-size: .875rem; margin-top: 1rem; }
  .alert-error   { background: var(--om-bad-bg); color: var(--om-bad-text); }
  .alert-success { background: var(--om-ok-bg);  color: var(--om-ok-text); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { cadastrarAluno, verificarLoginDisponivel } from "../api.js";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

// ── Masks ─────────────────────────────────────────────────────────────────────
function mascaraTelefone(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 10) return v.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
  return v.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
}
function validarTelefone(v) { const d = v.replace(/\D/g, ""); return d.length === 10 || d.length === 11; }

function mascaraCep(v) {
  return v.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d{0,3})/, "$1-$2").replace(/-$/, "");
}
function validarCep(v) { return v.replace(/\D/g, "").length === 8; }

// ── Fields ────────────────────────────────────────────────────────────────────
const fNome  = html`<input type="text"     placeholder="Nome completo do aluno" />`;
const fEmail = html`<input type="email"    placeholder="email@exemplo.com" autocomplete="off" />`;
const fLogin = html`<input type="text"     placeholder="Ex: joao.silva" autocomplete="off" />`;
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
const fTelefone = html`<input type="tel" placeholder="(XX) XXXXX-XXXX" />`;

// endereço
const chkEndereco = html`<input type="checkbox" />`;
const fCep        = html`<input type="text" placeholder="00000-000" class="cep-wrap" />`;
const fLogradouro = html`<input type="text" placeholder="Rua, número, complemento, bairro…" />`;
const enderecoFields = html`<div class="endereco-fields"></div>`;

// feedbacks
const loginFeedback   = html`<span class="field-feedback"></span>`;
const telFeedback     = html`<span class="field-feedback"></span>`;
const cepFeedback     = html`<span class="field-feedback"></span>`;
const btnSalvar = html`<button class="btn btn-primary">Cadastrar</button>`;
const alertDiv  = html`<div></div>`;

// ── Login: auto-suggest + uniqueness ─────────────────────────────────────────
function emailBasicoValido(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

fEmail.addEventListener("input", () => {
  if (!fLogin.dataset.edited && emailBasicoValido(fEmail.value)) {
    fLogin.value = fEmail.value.trim().split("@")[0];
    scheduleLoginCheck(fLogin.value.trim());
  }
});
fLogin.addEventListener("input", () => {
  fLogin.dataset.edited = "1";
  scheduleLoginCheck(fLogin.value.trim());
});

let loginTimer;
function scheduleLoginCheck(login) {
  clearTimeout(loginTimer);
  loginFeedback.textContent = "";
  if (!login) return;
  if (login.length < 3) {
    loginFeedback.className = "field-feedback field-err";
    loginFeedback.textContent = "Mínimo 3 caracteres";
    return;
  }
  loginTimer = setTimeout(async () => {
    try {
      const { disponivel } = await verificarLoginDisponivel(login);
      if (disponivel) {
        loginFeedback.className = "field-feedback field-ok";
        loginFeedback.textContent = "✓ Login disponível";
      } else {
        loginFeedback.className = "field-feedback field-err";
        loginFeedback.textContent = "✗ Login indisponível";
      }
    } catch { loginFeedback.textContent = ""; }
  }, 500);
}

// ── Phone mask ────────────────────────────────────────────────────────────────
fTelefone.addEventListener("input", () => {
  fTelefone.value = mascaraTelefone(fTelefone.value);
  if (!fTelefone.value) { telFeedback.textContent = ""; return; }
  if (validarTelefone(fTelefone.value)) {
    telFeedback.className = "field-feedback field-ok";
    telFeedback.textContent = "✓ Número válido";
  } else {
    telFeedback.className = "field-feedback field-err";
    telFeedback.textContent = "Número incompleto";
  }
});

// ── CEP mask ──────────────────────────────────────────────────────────────────
fCep.addEventListener("input", () => {
  fCep.value = mascaraCep(fCep.value);
  if (!fCep.value) { cepFeedback.textContent = ""; return; }
  if (validarCep(fCep.value)) {
    cepFeedback.className = "field-feedback field-ok";
    cepFeedback.textContent = "✓ CEP válido";
  } else {
    cepFeedback.className = "field-feedback field-err";
    cepFeedback.textContent = "CEP incompleto (8 dígitos)";
  }
});

// ── Endereço toggle ───────────────────────────────────────────────────────────
chkEndereco.addEventListener("change", () => {
  enderecoFields.className = chkEndereco.checked ? "endereco-fields visible" : "endereco-fields";
});

// ── Submit ────────────────────────────────────────────────────────────────────
btnSalvar.addEventListener("click", async () => {
  const loginVal = fLogin.value.trim() || fEmail.value.trim().split("@")[0];

  if (!fNome.value.trim() || !fEmail.value.trim() || !loginVal || !fSenha.value || !fNasc.value) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Preencha todos os campos obrigatórios.";
    return;
  }
  if (loginVal.length < 3) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "O login deve ter pelo menos 3 caracteres.";
    return;
  }
  if (fTelefone.value && !validarTelefone(fTelefone.value)) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Número de telefone inválido.";
    return;
  }
  if (chkEndereco.checked && fCep.value && !validarCep(fCep.value)) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "CEP inválido.";
    return;
  }

  const dados = {
    nome_completo:   fNome.value.trim(),
    email:           fEmail.value.trim(),
    login:           loginVal,
    senha:           fSenha.value,
    data_nascimento: fNasc.value,
    escolaridade:    fEscol.value,
    telefone:        fTelefone.value || null,
  };
  if (chkEndereco.checked) {
    dados.cep        = fCep.value || null;
    dados.logradouro = fLogradouro.value.trim() || null;
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
    fTelefone.value = ""; fCep.value = ""; fLogradouro.value = "";
    chkEndereco.checked = false;
    enderecoFields.className = "endereco-fields";
    loginFeedback.textContent = ""; telFeedback.textContent = ""; cepFeedback.textContent = "";
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
    <div class="form-field">
      <label>Email *</label>${fEmail}
    </div>
    <div class="form-field">
      <label>Login *</label>${fLogin}
      ${loginFeedback}
      <span class="hint">Sugerido a partir do e-mail. Pode ser alterado.</span>
    </div>
    <div class="form-field"><label>Senha inicial *</label>${fSenha}<span class="hint">O aluno poderá alterar depois.</span></div>
    <div class="form-field"><label>Data de nascimento *</label>${fNasc}</div>
    <div class="form-field"><label>Escolaridade</label>${fEscol}</div>
    <div class="form-field full">
      <label>Telefone</label>${fTelefone}
      ${telFeedback}
    </div>
    <label class="section-label">${chkEndereco} Cadastrar endereço (opcional)</label>
    ${enderecoFields}
  </div>
  <div class="form-actions">
    ${btnSalvar}
    <a href="/admin/alunos" class="btn btn-ghost">Cancelar</a>
  </div>
  ${alertDiv}
</div>`);

// Populate endereco fields after display so they are inside the grid
enderecoFields.innerHTML = "";
enderecoFields.append(
  html`<div class="form-field cep-wrap"><label>CEP</label>${fCep}${cepFeedback}</div>`,
  html`<div class="form-field"><label>Logradouro</label>${fLogradouro}<span class="hint">Rua, número, complemento, bairro, cidade…</span></div>`
);
```
