---
title: Criar Conta
toc: false
---

<style>
  /* ── Layout ─────────────────────────────────────────────────────────── */
  .form-page { max-width:580px; }
  .form-page h1 { font-size:1.5rem; margin-bottom:.25rem; }
  .form-subtitle { color:var(--theme-foreground-muted); font-size:.875rem; margin-bottom:1.75rem; }

  /* ── Grid de campos ─────────────────────────────────────────────────── */
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.1rem 1.25rem; }
  .form-field { display:flex; flex-direction:column; gap:.3rem; min-width:0; }
  .form-field.full { grid-column:1 / -1; }

  /* ── Labels ─────────────────────────────────────────────────────────── */
  .form-field label,
  .instituicao-wrap label { font-size:.8rem; font-weight:600; color:var(--theme-foreground); letter-spacing:.01em; }

  /* ── Inputs / Textarea ──────────────────────────────────────────────── */
  .form-field input,
  .form-field textarea,
  .instituicao-wrap input {
    width:100%;
    box-sizing:border-box;
    padding:.55rem .75rem;
    border:1.5px solid var(--theme-foreground-faint);
    border-radius:7px;
    background:var(--theme-background);
    color:var(--theme-foreground);
    font-size:.9rem;
    outline:none;
    transition:border-color .15s, box-shadow .15s;
    font-family:inherit;
  }
  .form-field input:focus,
  .form-field textarea:focus,
  .instituicao-wrap input:focus {
    border-color:#4a90e2;
    box-shadow:0 0 0 3px rgba(74,144,226,.12);
  }
  .form-field textarea { resize:vertical; min-height:64px; }
  .form-field input.invalid { border-color:#dc2626; box-shadow:0 0 0 3px rgba(220,38,38,.08); }
  .form-field input.valid   { border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,.08); }

  /* ── Hints ──────────────────────────────────────────────────────────── */
  .hint       { font-size:.75rem; color:var(--theme-foreground-muted); }
  .hint.error { color:#dc2626; }

  /* ── Seção Endereço ─────────────────────────────────────────────────── */
  .endereco-section {
    grid-column:1 / -1;
    border:1.5px solid var(--theme-foreground-faintest);
    border-radius:8px;
    padding:1rem 1.1rem;
    display:flex;
    flex-direction:column;
    gap:.85rem;
    background:var(--theme-background-alt);
  }
  .endereco-section-title { font-size:.8rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--theme-foreground-muted); }
  .radio-group { display:flex; gap:1.5rem; }
  .radio-group label { display:flex; align-items:center; gap:.45rem; font-size:.875rem; font-weight:600; cursor:pointer; color:var(--theme-foreground); }
  .radio-group input[type=radio] { accent-color:#4a90e2; width:15px; height:15px; cursor:pointer; flex-shrink:0; }
  .endereco-fields { display:flex; flex-direction:column; gap:.85rem; }
  .cep-wrap { max-width:160px; }
  .instituicao-wrap { display:none; flex-direction:column; gap:.3rem; }
  .instituicao-wrap.visible { display:flex; }

  /* ── Botões ─────────────────────────────────────────────────────────── */
  .form-actions { display:flex; gap:.75rem; margin-top:1.75rem; align-items:stretch; flex-wrap:wrap; }
  .btn {
    flex:1;
    padding:.7rem 1.4rem;
    border-radius:7px;
    font-size:.95rem;
    font-weight:600;
    cursor:pointer;
    border:none;
    text-decoration:none;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    transition:opacity .15s, background .15s;
    box-sizing:border-box;
  }
  .btn-primary { background:#1e293b; color:#fff; }
  .btn-primary:hover:not(:disabled) { background:#334155; }
  .btn-primary:disabled { opacity:.45; cursor:not-allowed; }
  .btn-ghost { background:transparent; color:var(--theme-foreground); border:1.5px solid var(--theme-foreground-faint); }
  .btn-ghost:hover { background:var(--theme-background-alt); }

  /* ── Alertas ────────────────────────────────────────────────────────── */
  .alert { padding:.7rem .9rem; border-radius:7px; font-size:.85rem; margin-top:1rem; }
  .alert-error   { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }
  .alert-success { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }

  /* ── Validação de e-mail (stub) ─────────────────────────────────────── */
  .email-status { font-size:.75rem; margin-top:.2rem; min-height:1rem; }
  .email-status.checking { color:#888; }
  .email-status.ok       { color:#16a34a; }
  .email-status.taken    { color:#dc2626; }
</style>

```js
import { registrarProfessorPublico, verificarEmailDisponivel } from "./api.js";
import { getToken, saveSession, login } from "./auth.js";

// Já logado → redireciona
if (getToken()) window.location.href = "/";

// ── Flag: validação por e-mail (desabilitada) ───────────────────────────────
const EMAIL_VALIDATION_ENABLED = false;

// ── Campos ──────────────────────────────────────────────────────────────────
const fNome      = html`<input type="text"     placeholder="Nome completo" />`;
const fEmail     = html`<input type="email"    placeholder="email@exemplo.com" autocomplete="off" />`;
const fSenha     = html`<input type="password" placeholder="Crie uma senha" />`;
const fSenha2    = html`<input type="password" placeholder="Confirme a senha" />`;
const fNasc      = html`<input type="date" />`;
const fFormacao  = html`<textarea rows="2" placeholder="Graduação, pós-graduação, especializações etc."></textarea>`;
const fTelefone  = html`<input type="tel" placeholder="(00) 00000-0000" maxlength="15" />`;
const hintTel    = html`<span class="hint"></span>`;
const emailStatus = html`<span class="email-status"></span>`;

// Endereço
const rPessoal      = html`<input type="radio" name="tipo_endereco" value="pessoal"      checked />`;
const rProfissional = html`<input type="radio" name="tipo_endereco" value="profissional" />`;
const fCep          = html`<input type="text" placeholder="00000-000" maxlength="9" />`;
const hintCep       = html`<span class="hint"></span>`;
const fLogradouro   = html`<input type="text" placeholder="Rua, número, complemento, bairro, cidade — UF" />`;
const fInstituicao  = html`<input type="text" placeholder="Nome da instituição" />`;
const wrapInstituicao = html`<div class="instituicao-wrap"><label>Nome da instituição</label>${fInstituicao}</div>`;

const btnSalvar = html`<button class="btn btn-primary">Criar conta</button>`;
const alertDiv  = html`<div></div>`;

// ── Mostrar/ocultar instituição ─────────────────────────────────────────────
function atualizarInstituicao() {
  const tipo = document.querySelector("input[name=tipo_endereco]:checked")?.value;
  wrapInstituicao.classList.toggle("visible", tipo === "profissional");
}
rPessoal.addEventListener("change", atualizarInstituicao);
rProfissional.addEventListener("change", atualizarInstituicao);

// ── Máscara e validação: Telefone ───────────────────────────────────────────
function mascaraTelefone(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 10)
    return v.replace(/^(\d{2})(\d{4})(\d{0,4})/, (_, a, b, c) => `(${a}) ${b}${c ? "-" + c : ""}`);
  return v.replace(/^(\d{2})(\d{5})(\d{0,4})/, (_, a, b, c) => `(${a}) ${b}${c ? "-" + c : ""}`);
}
function validarTelefone(v) { return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v); }

fTelefone.addEventListener("input", () => {
  fTelefone.value = mascaraTelefone(fTelefone.value);
  const v = fTelefone.value;
  if (!v) { fTelefone.classList.remove("valid","invalid"); hintTel.textContent=""; hintTel.className="hint"; return; }
  if (validarTelefone(v)) { fTelefone.classList.add("valid"); fTelefone.classList.remove("invalid"); hintTel.textContent=""; hintTel.className="hint"; }
  else { fTelefone.classList.add("invalid"); fTelefone.classList.remove("valid"); hintTel.textContent="Formato inválido. Use (XX) XXXXX-XXXX ou (XX) XXXX-XXXX."; hintTel.className="hint error"; }
});

// ── Máscara e validação: CEP ────────────────────────────────────────────────
function mascaraCep(v) {
  v = v.replace(/\D/g, "").slice(0, 8);
  return v.replace(/^(\d{5})(\d{0,3})/, (_, a, b) => b ? `${a}-${b}` : a);
}
function validarCep(v) { return /^\d{5}-\d{3}$/.test(v); }

fCep.addEventListener("input", () => {
  fCep.value = mascaraCep(fCep.value);
  const v = fCep.value;
  if (!v) { fCep.classList.remove("valid","invalid"); hintCep.textContent=""; hintCep.className="hint"; return; }
  if (validarCep(v)) { fCep.classList.add("valid"); fCep.classList.remove("invalid"); hintCep.textContent=""; hintCep.className="hint"; }
  else { fCep.classList.add("invalid"); fCep.classList.remove("valid"); hintCep.textContent="CEP inválido. Use o formato 00000-000."; hintCep.className="hint error"; }
});

// ── Verificação de e-mail duplicado (com debounce) ──────────────────────────
let emailCheckTimer = null;
let emailDisponivel = true;

fEmail.addEventListener("blur", async () => {
  const email = fEmail.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

  emailStatus.textContent = "Verificando…";
  emailStatus.className   = "email-status checking";

  clearTimeout(emailCheckTimer);
  emailCheckTimer = setTimeout(async () => {
    try {
      const { disponivel } = await verificarEmailDisponivel(email);
      emailDisponivel = disponivel;
      if (disponivel) {
        emailStatus.textContent = "E-mail disponível.";
        emailStatus.className   = "email-status ok";
        fEmail.classList.add("valid"); fEmail.classList.remove("invalid");
      } else {
        emailStatus.textContent = "Este e-mail já está cadastrado.";
        emailStatus.className   = "email-status taken";
        fEmail.classList.add("invalid"); fEmail.classList.remove("valid");
      }
    } catch {
      // Falha silenciosa — a API valida no submit
      emailStatus.textContent = "";
      emailStatus.className   = "email-status";
      emailDisponivel = true;
    }
  }, 400);
});

fEmail.addEventListener("input", () => {
  emailDisponivel = true;
  emailStatus.textContent = "";
  emailStatus.className   = "email-status";
  fEmail.classList.remove("valid","invalid");
});

// ── Envio ───────────────────────────────────────────────────────────────────
btnSalvar.addEventListener("click", async () => {
  const telefone = fTelefone.value.trim();
  const cep      = fCep.value.trim();
  const email    = fEmail.value.trim();
  const senha    = fSenha.value;
  const senha2   = fSenha2.value;

  // Validações obrigatórias
  if (!fNome.value.trim() || !email || !senha || !fNasc.value) {
    alertDiv.className   = "alert alert-error";
    alertDiv.textContent = "Preencha todos os campos obrigatórios (Nome, E-mail, Senha, Data de nascimento).";
    return;
  }
  if (senha !== senha2) {
    alertDiv.className   = "alert alert-error";
    alertDiv.textContent = "As senhas não coincidem.";
    return;
  }
  if (senha.length < 6) {
    alertDiv.className   = "alert alert-error";
    alertDiv.textContent = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }
  if (telefone && !validarTelefone(telefone)) {
    alertDiv.className   = "alert alert-error";
    alertDiv.textContent = "Telefone inválido. Use o formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.";
    return;
  }
  if (cep && !validarCep(cep)) {
    alertDiv.className   = "alert alert-error";
    alertDiv.textContent = "CEP inválido. Use o formato 00000-000.";
    return;
  }
  if (!emailDisponivel) {
    alertDiv.className   = "alert alert-error";
    alertDiv.textContent = "Este e-mail já está cadastrado. Use outro ou faça login.";
    return;
  }

  const tipoEndereco = document.querySelector("input[name=tipo_endereco]:checked")?.value ?? "pessoal";

  const dados = {
    nome_completo:      fNome.value.trim(),
    email,
    senha,
    data_nascimento:    fNasc.value,
    formacao_academica: fFormacao.value.trim() || null,
    telefone:           telefone || null,
    tipo_endereco:      tipoEndereco,
    nome_instituicao:   tipoEndereco === "profissional" ? (fInstituicao.value.trim() || null) : null,
    cep:                cep || null,
    logradouro:         fLogradouro.value.trim() || null,
    // Validação por e-mail: desabilitada
    // email_verificado: EMAIL_VALIDATION_ENABLED ? false : true,
  };

  btnSalvar.disabled    = true;
  btnSalvar.textContent = "Criando conta…";
  alertDiv.className    = "";
  alertDiv.textContent  = "";

  try {
    await registrarProfessorPublico(dados);

    // Se validação por e-mail estiver habilitada, não faz login automático
    if (EMAIL_VALIDATION_ENABLED) {
      alertDiv.className   = "alert alert-success";
      alertDiv.textContent = "Conta criada! Verifique seu e-mail para ativar o acesso.";
      btnSalvar.disabled   = true;
      btnSalvar.textContent = "Aguardando verificação";
      return;
    }

    // Login automático após cadastro
    alertDiv.className   = "alert alert-success";
    alertDiv.textContent = "Conta criada com sucesso! Entrando…";
    const { token, usuario } = await login(email, senha);
    saveSession(token, usuario);
    window.location.href = "/";

  } catch (e) {
    alertDiv.className   = "alert alert-error";
    alertDiv.textContent = e.message;
    btnSalvar.disabled    = false;
    btnSalvar.textContent = "Criar conta";
  }
});

display(html`<div class="form-page">
  <h1>Criar conta</h1>
  <p class="form-subtitle">
    Crie sua conta de professor para acessar o Dashboard OM.
    Os campos marcados com * são obrigatórios.
  </p>

  <div class="form-grid">

    <div class="form-field full">
      <label>Nome completo *</label>
      ${fNome}
    </div>

    <div class="form-field">
      <label>E-mail *</label>
      ${fEmail}
      ${emailStatus}
    </div>

    <div class="form-field">
      <label>Data de nascimento *</label>
      ${fNasc}
    </div>

    <div class="form-field">
      <label>Senha *</label>
      ${fSenha}
      <span class="hint">Mínimo de 6 caracteres.</span>
    </div>

    <div class="form-field">
      <label>Confirmar senha *</label>
      ${fSenha2}
    </div>

    <div class="form-field">
      <label>Telefone</label>
      ${fTelefone}
      ${hintTel}
    </div>

    <div class="form-field full">
      <label>Formação acadêmica</label>
      ${fFormacao}
      <span class="hint">Graduação, pós-graduação, especializações etc. — opcional.</span>
    </div>

    <div class="endereco-section">
      <div class="endereco-section-title">Endereço</div>
      <div class="radio-group">
        <label>${rPessoal} Pessoal</label>
        <label>${rProfissional} Profissional</label>
      </div>
      <div class="endereco-fields">
        ${wrapInstituicao}
        <div class="form-field cep-wrap"><label>CEP</label>${fCep}${hintCep}</div>
        <div class="form-field"><label>Logradouro completo</label>${fLogradouro}</div>
      </div>
    </div>

  </div>

  <div class="form-actions">
    ${btnSalvar}
    <a href="/login" class="btn btn-ghost">Já tenho conta</a>
  </div>

  ${alertDiv}
</div>`);
```
