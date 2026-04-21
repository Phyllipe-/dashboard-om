---
title: Editar Professor
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
  .form-actions { display:flex; gap:.75rem; margin-top:1.75rem; align-items:center; flex-wrap:wrap; }
  .btn { padding:.6rem 1.4rem; border-radius:7px; font-size:.9rem; font-weight:600; cursor:pointer; border:none; text-decoration:none; display:inline-block; transition:opacity .15s, background .15s; }
  .btn-primary { background:#1e293b; color:#fff; }
  .btn-primary:hover:not(:disabled) { background:#334155; }
  .btn-primary:disabled { opacity:.45; cursor:not-allowed; }
  .btn-ghost { background:transparent; color:var(--theme-foreground); border:1.5px solid var(--theme-foreground-faint); }
  .btn-ghost:hover { background:var(--theme-background-alt); }

  /* ── Alertas ────────────────────────────────────────────────────────── */
  .alert { padding:.7rem .9rem; border-radius:7px; font-size:.85rem; margin-top:1rem; }
  .alert-error   { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }
  .alert-success { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; }

  /* ── Loading / Acesso negado ────────────────────────────────────────── */
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

// ── Campos do formulário ────────────────────────────────────────────────────
const fNome      = html`<input type="text"     placeholder="Nome completo" />`;
const fEmail     = html`<input type="email"    placeholder="email@exemplo.com" />`;
const fNasc      = html`<input type="date" />`;
const fFormacao  = html`<textarea rows="2" placeholder="Graduação, pós-graduação, especializações etc."></textarea>`;
const fTelefone  = html`<input type="tel"  placeholder="(00) 00000-0000" maxlength="15" />`;
const hintTel    = html`<span class="hint"></span>`;
const fSenha     = html`<input type="password" placeholder="Deixe em branco para não alterar" />`;

const rPessoal      = html`<input type="radio" name="tipo_endereco" value="pessoal"      checked />`;
const rProfissional = html`<input type="radio" name="tipo_endereco" value="profissional" />`;
const fCep          = html`<input type="text" placeholder="00000-000" maxlength="9" />`;
const hintCep       = html`<span class="hint"></span>`;
const fLogradouro   = html`<input type="text" placeholder="Rua, número, complemento, bairro, cidade — UF" />`;
const fInstituicao  = html`<input type="text" placeholder="Nome da instituição" />`;
const wrapInstituicao = html`<div class="instituicao-wrap"><label style="font-size:.875rem;font-weight:600;">Nome da instituição</label>${fInstituicao}</div>`;

function atualizarInstituicao() {
  const tipo = document.querySelector("input[name=tipo_endereco]:checked")?.value;
  wrapInstituicao.classList.toggle("visible", tipo === "profissional");
}
rPessoal.addEventListener("change", atualizarInstituicao);
rProfissional.addEventListener("change", atualizarInstituicao);

const btnSalvar = html`<button class="btn btn-primary">Salvar alterações</button>`;
const alertDiv  = html`<div></div>`;

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
  if (validarTelefone(v)) { fTelefone.classList.replace("invalid","valid")||fTelefone.classList.add("valid"); hintTel.textContent=""; hintTel.className="hint"; }
  else { fTelefone.classList.replace("valid","invalid")||fTelefone.classList.add("invalid"); hintTel.textContent="Formato inválido. Use (XX) XXXXX-XXXX ou (XX) XXXX-XXXX."; hintTel.className="hint error"; }
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
  if (validarCep(v)) { fCep.classList.replace("invalid","valid")||fCep.classList.add("valid"); hintCep.textContent=""; hintCep.className="hint"; }
  else { fCep.classList.replace("valid","invalid")||fCep.classList.add("invalid"); hintCep.textContent="CEP inválido. Use o formato 00000-000."; hintCep.className="hint error"; }
});

// ── Carregar dados existentes ───────────────────────────────────────────────
const container = html`<div class="loading">Carregando…</div>`;
display(container);

let prof;
try {
  prof = await fetchProfessor(idProfessor);
  fNome.value     = prof.nome_completo         ?? "";
  fEmail.value    = prof.email                 ?? "";
  fNasc.value     = prof.data_nascimento       ?? "";
  fFormacao.value = prof.formacao_academica    ?? prof.registro_profissional ?? "";
  fTelefone.value = mascaraTelefone(prof.telefone ?? "");
  fCep.value      = mascaraCep(prof.cep        ?? "");
  fLogradouro.value   = prof.logradouro       ?? "";
  fInstituicao.value  = prof.nome_instituicao ?? "";
  const tipo = prof.tipo_endereco ?? "pessoal";
  rPessoal.checked      = tipo === "pessoal";
  rProfissional.checked = tipo === "profissional";
  atualizarInstituicao();
} catch (e) {
  container.replaceWith(html`<div class="alert alert-error">Erro ao carregar professor: ${e.message}</div>`);
  throw e;
}

// ── Envio ───────────────────────────────────────────────────────────────────
btnSalvar.addEventListener("click", async () => {
  const telefone = fTelefone.value.trim();
  const cep      = fCep.value.trim();

  if (telefone && !validarTelefone(telefone)) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Telefone inválido. Use o formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.";
    return;
  }
  if (cep && !validarCep(cep)) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "CEP inválido. Use o formato 00000-000.";
    return;
  }

  const tipoEndereco = document.querySelector("input[name=tipo_endereco]:checked")?.value ?? "pessoal";

  const dados = {};
  if (fNome.value.trim()    !== (prof.nome_completo      ?? "")) dados.nome_completo      = fNome.value.trim();
  if (fEmail.value.trim()   !== (prof.email              ?? "")) dados.email              = fEmail.value.trim();
  if (fNasc.value           !== (prof.data_nascimento    ?? "")) dados.data_nascimento    = fNasc.value;
  if (fFormacao.value.trim()!== (prof.formacao_academica ?? prof.registro_profissional ?? "")) dados.formacao_academica = fFormacao.value.trim();
  if (telefone              !== mascaraTelefone(prof.telefone ?? "")) dados.telefone      = telefone || null;
  if (tipoEndereco          !== (prof.tipo_endereco      ?? "pessoal")) dados.tipo_endereco   = tipoEndereco;
  if (cep                   !== mascaraCep(prof.cep      ?? "")) dados.cep                 = cep || null;
  if (fLogradouro.value.trim() !== (prof.logradouro      ?? "")) dados.logradouro          = fLogradouro.value.trim() || null;
  const instAtual = tipoEndereco === "profissional" ? (fInstituicao.value.trim() || null) : null;
  if (instAtual !== (prof.nome_instituicao ?? null))               dados.nome_instituicao  = instAtual;
  if (fSenha.value)                                               dados.nova_senha        = fSenha.value;

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

    <div class="form-field"><label>E-mail</label>${fEmail}</div>
    <div class="form-field"><label>Data de nascimento</label>${fNasc}</div>

    <div class="form-field"><label>Telefone</label>${fTelefone}${hintTel}</div>
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

    <div class="form-field full">
      <label>Nova senha</label>
      ${fSenha}
      <span class="hint">Deixe em branco para manter a senha atual.</span>
    </div>

  </div>

  <div class="form-actions">
    ${btnSalvar}
    <a href="/admin/professores" class="btn btn-ghost">Cancelar</a>
  </div>
  ${alertDiv}
</div>`);
```
