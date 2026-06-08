---
title: Cadastrar Professor
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
  .btn { padding:.6rem 1.4rem; border-radius:7px; font-size:.9rem; font-weight:600; cursor:pointer; border:1.5px solid transparent; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box; transition:opacity .15s; }
  .btn-primary { background:var(--theme-foreground); border-color:var(--theme-foreground); }
  a.btn-primary, button.btn-primary { color:var(--theme-background); }
  .btn-primary:hover:not(:disabled) { opacity:.82; }
  .btn-primary:disabled { opacity:.45; cursor:not-allowed; }
  .btn-ghost { background:transparent; color:var(--theme-foreground); border-color:var(--theme-foreground-faint); }
  .btn-ghost:hover { background:var(--theme-background-alt); }

  /* ── Alertas ────────────────────────────────────────────────────────── */
  .alert { padding:.7rem .9rem; border-radius:7px; font-size:.85rem; margin-top:1rem; }
  .alert-error   { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }
  .alert-success { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }

  /* ── Acesso negado ──────────────────────────────────────────────────── */
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

// ── Campos do formulário ────────────────────────────────────────────────────
const fNome      = html`<input type="text"     placeholder="Nome completo" />`;
const fEmail     = html`<input type="email"    placeholder="email@exemplo.com" autocomplete="off" />`;
const fSenha     = html`<input type="password" placeholder="Senha inicial" />`;
const fNasc      = html`<input type="date" />`;
const fFormacao  = html`<textarea rows="2" placeholder="Ex: Mestre em Educação Física — UFMG (2018), Especialista em Reabilitação Neurológica (opcional)"></textarea>`;
const fTelefone  = html`<input type="tel" placeholder="(00) 00000-0000" maxlength="15" />`;
const hintTel    = html`<span class="hint"></span>`;

// Endereço
const rPessoal      = html`<input type="radio" name="tipo_endereco" value="pessoal"      checked />`;
const rProfissional = html`<input type="radio" name="tipo_endereco" value="profissional" />`;
const fCep          = html`<input type="text" placeholder="00000-000" maxlength="9" />`;
const hintCep       = html`<span class="hint"></span>`;
const fInstituicao  = html`<input type="text" placeholder="Nome da instituição" />`;
const wrapInstituicao = html`<div class="instituicao-wrap"><label style="font-size:.875rem;font-weight:600;">Nome da instituição</label>${fInstituicao}</div>`;

// Mostrar/ocultar campo de instituição conforme radio
function atualizarInstituicao() {
  const prof = document.querySelector("input[name=tipo_endereco]:checked")?.value;
  wrapInstituicao.classList.toggle("visible", prof === "profissional");
}
rPessoal.addEventListener("change", atualizarInstituicao);
rProfissional.addEventListener("change", atualizarInstituicao);
const fLogradouro   = html`<input type="text" placeholder="Rua, número, complemento, bairro, cidade — UF" />`;

const btnSalvar = html`<button class="btn btn-primary">Cadastrar Professor</button>`;
const alertDiv  = html`<div></div>`;

// ── Máscara e validação: Telefone ───────────────────────────────────────────
// Aceita (XX) XXXX-XXXX (fixo) e (XX) XXXXX-XXXX (celular)
function mascaraTelefone(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 10)
    return v.replace(/^(\d{2})(\d{4})(\d{0,4})/, (_, a, b, c) => `(${a}) ${b}${c ? "-" + c : ""}`);
  return v.replace(/^(\d{2})(\d{5})(\d{0,4})/, (_, a, b, c) => `(${a}) ${b}${c ? "-" + c : ""}`);
}

function validarTelefone(v) {
  return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v);
}

fTelefone.addEventListener("input", () => {
  fTelefone.value = mascaraTelefone(fTelefone.value);
  const v = fTelefone.value;
  if (!v) {
    fTelefone.classList.remove("valid", "invalid");
    hintTel.textContent = "";
    hintTel.className = "hint";
  } else if (validarTelefone(v)) {
    fTelefone.classList.add("valid"); fTelefone.classList.remove("invalid");
    hintTel.textContent = "";
    hintTel.className = "hint";
  } else {
    fTelefone.classList.add("invalid"); fTelefone.classList.remove("valid");
    hintTel.textContent = "Formato inválido. Use (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.";
    hintTel.className = "hint error";
  }
});

// ── Máscara e validação: CEP ────────────────────────────────────────────────
function mascaraCep(v) {
  v = v.replace(/\D/g, "").slice(0, 8);
  return v.replace(/^(\d{5})(\d{0,3})/, (_, a, b) => b ? `${a}-${b}` : a);
}

function validarCep(v) {
  return /^\d{5}-\d{3}$/.test(v);
}

fCep.addEventListener("input", () => {
  fCep.value = mascaraCep(fCep.value);
  const v = fCep.value;
  if (!v) {
    fCep.classList.remove("valid", "invalid");
    hintCep.textContent = "";
    hintCep.className = "hint";
  } else if (validarCep(v)) {
    fCep.classList.add("valid"); fCep.classList.remove("invalid");
    hintCep.textContent = "";
    hintCep.className = "hint";
  } else {
    fCep.classList.add("invalid"); fCep.classList.remove("valid");
    hintCep.textContent = "CEP inválido. Use o formato 00000-000.";
    hintCep.className = "hint error";
  }
});

// ── Envio ───────────────────────────────────────────────────────────────────
btnSalvar.addEventListener("click", async () => {
  const telefone = fTelefone.value.trim();
  const cep      = fCep.value.trim();

  // Validações
  if (!fNome.value.trim() || !fEmail.value.trim() || !fSenha.value) {
    alertDiv.className   = "alert alert-error";
    alertDiv.textContent = "Preencha todos os campos obrigatórios (Nome, E-mail, Senha).";
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

  const tipoEndereco = document.querySelector("input[name=tipo_endereco]:checked")?.value ?? "pessoal";

  const dados = {
    nome_completo:      fNome.value.trim(),
    email:              fEmail.value.trim(),
    senha:              fSenha.value,
    formacao_academica: fFormacao.value.trim(),
  };

  btnSalvar.disabled    = true;
  btnSalvar.textContent = "Salvando…";
  alertDiv.className    = "";
  alertDiv.textContent  = "";

  try {
    await cadastrarProfessor(dados);
    alertDiv.className   = "alert alert-success";
    alertDiv.textContent = `Professor "${dados.nome_completo}" cadastrado com sucesso!`;
    fNome.value = ""; fEmail.value = ""; fSenha.value = ""; fNasc.value = "";
    fFormacao.value = ""; fTelefone.value = ""; fCep.value = ""; fLogradouro.value = ""; fInstituicao.value = "";
    fTelefone.classList.remove("valid", "invalid");
    fCep.classList.remove("valid", "invalid");
    rPessoal.checked = true;
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

    <!-- Nome -->
    <div class="form-field full">
      <label>Nome completo *</label>
      ${fNome}
    </div>

    <!-- Email + Senha -->
    <div class="form-field">
      <label>E-mail *</label>
      ${fEmail}
    </div>

    <div class="form-field">
      <label>Senha inicial *</label>
      ${fSenha}
      <span class="hint">O professor poderá alterá-la após o primeiro acesso.</span>
    </div>

    <!-- Formação acadêmica -->
    <div class="form-field full">
      <label>Formação acadêmica</label>
      ${fFormacao}
      <span class="hint">Graduação, pós-graduação, especializações etc. — opcional.</span>
    </div>

  </div>

  <div style="font-size:.8rem;color:var(--theme-foreground-muted);background:var(--theme-background-alt);border:1px solid var(--theme-foreground-faintest);border-radius:8px;padding:.7rem .9rem;margin-top:1.25rem;line-height:1.45;">
    Coletamos apenas o mínimo necessário para operar o sistema. O tratamento dos dados segue a
    <a href="/privacidade" target="_blank" style="color:var(--om-accent,#4a90e2);font-weight:600;">Política de Privacidade</a>.
  </div>

  <div class="form-actions">
    ${btnSalvar}
    <a href="/admin/alunos" class="btn btn-ghost">Cancelar</a>
  </div>

  ${alertDiv}
</div>`);
```
