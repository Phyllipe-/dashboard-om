---
title: Editar Aluno
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

  .hint { font-size: .78rem; color: var(--theme-foreground-muted); }
  .field-feedback { font-size: .78rem; margin-top: .15rem; min-height: 1em; }
  .field-ok  { color: var(--om-ok-text,  #16a34a); }
  .field-err { color: var(--om-bad-text, #dc2626); }

  .section-title {
    grid-column: 1 / -1;
    font-size: .875rem;
    font-weight: 600;
    margin-top: .5rem;
    padding-top: .75rem;
    border-top: 1px solid var(--theme-foreground-faintest);
    color: var(--theme-foreground-muted);
  }

  .cep-wrap { max-width: 160px; }

  .form-actions { display: flex; gap: .75rem; margin-top: 1.75rem; align-items: center; }
  .btn { padding: .6rem 1.25rem; border-radius: 6px; font-size: .95rem; font-weight: 600; cursor: pointer; border: none; text-decoration: none; display: inline-block; transition: opacity .15s; }
  .btn-primary { background: #1e293b; color: #fff; }
  .btn-primary:hover:not(:disabled) { opacity: .82; }
  .btn-primary:disabled { opacity: .45; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: var(--theme-foreground); border: 1.5px solid var(--theme-foreground-faint); }
  .btn-ghost:hover { background: var(--theme-background-alt); }
  .alert { padding: .7rem .9rem; border-radius: 6px; font-size: .875rem; margin-top: 1rem; }
  .alert-error   { background: var(--om-bad-bg); color: var(--om-bad-text); }
  .alert-success { background: var(--om-ok-bg);  color: var(--om-ok-text); }
  .loading { color: var(--theme-foreground-muted); padding: 2rem 0; }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAluno, editarAluno, verificarLoginDisponivel } from "../api.js";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

const params  = new URLSearchParams(window.location.search);
const idAluno = parseInt(params.get("id"));

if (!idAluno) {
  display(html`<div class="alert alert-error">ID de aluno não informado.</div>`);
  throw new Error("ID ausente.");
}

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
const fNome     = html`<input type="text"     placeholder="Nome completo do aluno" />`;
const fEmail    = html`<input type="email"    placeholder="email@exemplo.com" />`;
const fLogin    = html`<input type="text"     placeholder="Ex: joao.silva" />`;
const fNasc     = html`<input type="date" />`;
const fEscol    = html`<select>
  <option value="">— Selecione —</option>
  <option value="Educação Infantil">Educação Infantil</option>
  <option value="Ensino Fundamental I">Ensino Fundamental I</option>
  <option value="Ensino Fundamental II">Ensino Fundamental II</option>
  <option value="Ensino Médio">Ensino Médio</option>
  <option value="Ensino Superior">Ensino Superior</option>
  <option value="Outro">Outro</option>
</select>`;
const fSenha     = html`<input type="password" placeholder="Deixe em branco para não alterar" />`;
const fTelefone  = html`<input type="tel"  placeholder="(XX) XXXXX-XXXX" />`;
const fCep       = html`<input type="text" placeholder="00000-000" />`;
const fLogradouro= html`<input type="text" placeholder="Rua, número, complemento, bairro…" />`;

const loginFeedback = html`<span class="field-feedback"></span>`;
const telFeedback   = html`<span class="field-feedback"></span>`;
const cepFeedback   = html`<span class="field-feedback"></span>`;
const btnSalvar = html`<button class="btn btn-primary">Salvar alterações</button>`;
const alertDiv  = html`<div></div>`;
const container = html`<div class="loading">Carregando…</div>`;
display(container);

// ── Load aluno data ───────────────────────────────────────────────────────────
let aluno;
try {
  aluno = await fetchAluno(idAluno);
  fNome.value      = aluno.nome_completo  ?? "";
  fEmail.value     = aluno.email          ?? "";
  fLogin.value     = aluno.login          ?? aluno.email?.split("@")[0] ?? "";
  fNasc.value      = aluno.data_nascimento ?? "";
  fTelefone.value  = aluno.telefone ? mascaraTelefone(aluno.telefone) : "";
  fCep.value       = aluno.cep       ? mascaraCep(aluno.cep)           : "";
  fLogradouro.value= aluno.logradouro ?? "";
  [...fEscol.options].forEach(o => { if (o.value === aluno.escolaridade) o.selected = true; });
  // dispara verificação do login pré-carregado
  if (fLogin.value) scheduleLoginCheck(fLogin.value.trim());
} catch (e) {
  container.replaceWith(html`<div class="alert alert-error">Erro ao carregar aluno: ${e.message}</div>`);
  throw e;
}

// ── Login uniqueness (exclude self) ──────────────────────────────────────────
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
      const { disponivel } = await verificarLoginDisponivel(login, idAluno);
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
fLogin.addEventListener("input", () => scheduleLoginCheck(fLogin.value.trim()));

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

// ── Submit ────────────────────────────────────────────────────────────────────
btnSalvar.addEventListener("click", async () => {
  if (!fLogin.value.trim()) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "O campo Login é obrigatório.";
    return;
  }
  if (fLogin.value.trim().length < 3) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "O login deve ter pelo menos 3 caracteres.";
    return;
  }
  if (fTelefone.value && !validarTelefone(fTelefone.value)) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Número de telefone inválido.";
    return;
  }
  if (fCep.value && !validarCep(fCep.value)) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "CEP inválido.";
    return;
  }

  const dados = {};
  if (fNome.value.trim()  !== (aluno.nome_completo ?? ""))     dados.nome_completo   = fNome.value.trim();
  if (fEmail.value.trim() !== (aluno.email ?? ""))             dados.email           = fEmail.value.trim();
  if (fNasc.value         !== (aluno.data_nascimento ?? ""))   dados.data_nascimento = fNasc.value;
  if (fEscol.value        !== (aluno.escolaridade ?? ""))      dados.escolaridade    = fEscol.value;
  if (fSenha.value)                                            dados.nova_senha      = fSenha.value;

  // telefone: compare raw digits
  const telRaw     = fTelefone.value.replace(/\D/g, "");
  const telOrigRaw = (aluno.telefone ?? "").replace(/\D/g, "");
  if (telRaw !== telOrigRaw) dados.telefone = fTelefone.value || null;

  const cepRaw     = fCep.value.replace(/\D/g, "");
  const cepOrigRaw = (aluno.cep ?? "").replace(/\D/g, "");
  if (cepRaw !== cepOrigRaw) dados.cep = fCep.value || null;

  const logVal = fLogradouro.value.trim();
  if (logVal !== (aluno.logradouro ?? "")) dados.logradouro = logVal || null;

  // login via separate route
  const novoLogin  = fLogin.value.trim();
  const loginAtual = aluno.login ?? aluno.email?.split("@")[0] ?? "";
  const loginMudou = novoLogin && novoLogin !== loginAtual;

  if (!Object.keys(dados).length && !loginMudou) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Nenhuma alteração detectada.";
    return;
  }

  btnSalvar.disabled = true;
  btnSalvar.textContent = "Salvando…";
  alertDiv.className = ""; alertDiv.textContent = "";

  try {
    if (Object.keys(dados).length) {
      const atualizado = await editarAluno(idAluno, dados);
      Object.assign(aluno, atualizado);
    }
    if (loginMudou) {
      const { atualizarLoginAluno } = await import("../api.js");
      await atualizarLoginAluno(idAluno, novoLogin);
      aluno.login = novoLogin;
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
    <div class="form-field">
      <label>Login *</label>${fLogin}
      ${loginFeedback}
      <span class="hint">Identificador curto usado no app.</span>
    </div>
    <div class="form-field"><label>Data de nascimento</label>${fNasc}</div>
    <div class="form-field"><label>Escolaridade</label>${fEscol}</div>
    <div class="form-field full">
      <label>Telefone</label>${fTelefone}
      ${telFeedback}
    </div>
    <div class="form-field full"><label>Nova senha</label>${fSenha}<span class="hint">Deixe em branco para manter a senha atual.</span></div>
    <div class="section-title">Endereço (opcional)</div>
    <div class="form-field cep-wrap">
      <label>CEP</label>${fCep}${cepFeedback}
    </div>
    <div class="form-field">
      <label>Logradouro</label>${fLogradouro}
      <span class="hint">Rua, número, complemento, bairro, cidade…</span>
    </div>
  </div>
  <div class="form-actions">
    ${btnSalvar}
    <a href="/admin/alunos" class="btn btn-ghost">Cancelar</a>
  </div>
  ${alertDiv}
</div>`);
```
