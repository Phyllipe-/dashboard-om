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

  .hint { font-size: .78rem; color: var(--theme-foreground-muted); }
  .field-feedback { font-size: .78rem; margin-top: .15rem; min-height: 1em; }
  .field-ok  { color: var(--om-ok-text,  #16a34a); }
  .field-err { color: var(--om-bad-text, #dc2626); }

  .section-label {
    grid-column: 1 / -1;
    display: flex; align-items: center; gap: .6rem;
    font-size: .875rem; font-weight: 600; margin-top: .5rem;
    cursor: pointer; user-select: none;
  }
  .section-label input[type="checkbox"] { width: auto; cursor: pointer; }
  .declaracao-wrap { grid-column: 1 / -1; display: none; }
  .declaracao-wrap.visible { display: contents; }
  .declaracao-box {
    border: 1.5px solid #f59e0b; background: #fffbeb; color: #92400e;
    border-radius: 8px; padding: .8rem 1rem;
  }
  .declaracao-box .section-label { margin-top: 0; align-items: flex-start; color: inherit; }

  .aviso-privacidade {
    font-size: .8rem; color: var(--theme-foreground-muted);
    background: var(--theme-background-alt); border: 1px solid var(--theme-foreground-faintest);
    border-radius: 8px; padding: .7rem .9rem; margin-top: 1.25rem; line-height: 1.45;
  }
  .aviso-privacidade a { color: var(--om-accent, #4a90e2); font-weight: 600; }

  .form-actions { display: flex; gap: .75rem; margin-top: 1.5rem; align-items: stretch; }
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

// ── Campos ──────────────────────────────────────────────────────────────────
const fNome  = html`<input type="text"     placeholder="Nome completo do aluno" />`;
const fEmail = html`<input type="email"    placeholder="email@exemplo.com" autocomplete="off" />`;
const fLogin = html`<input type="text"     placeholder="Ex: joao.silva" autocomplete="off" />`;
const fSenha = html`<input type="password" placeholder="Senha inicial" />`;
const fEscol = html`<select>
  <option value="">— Selecione —</option>
  <option value="Educação Infantil">Educação Infantil</option>
  <option value="Ensino Fundamental I">Ensino Fundamental I</option>
  <option value="Ensino Fundamental II">Ensino Fundamental II</option>
  <option value="Ensino Médio">Ensino Médio</option>
  <option value="Ensino Superior">Ensino Superior</option>
  <option value="Outro">Outro</option>
</select>`;

const chkMenor      = html`<input type="checkbox" />`;
const chkDeclaracao = html`<input type="checkbox" />`;
const declaracaoWrap = html`<div class="declaracao-wrap"></div>`;

const loginFeedback = html`<span class="field-feedback"></span>`;
const btnSalvar = html`<button class="btn btn-primary">Cadastrar</button>`;
const alertDiv  = html`<div></div>`;

// ── Login: sugestão + verificação de unicidade ────────────────────────────────
function emailBasicoValido(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

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
      loginFeedback.className = "field-feedback " + (disponivel ? "field-ok" : "field-err");
      loginFeedback.textContent = disponivel ? "Login disponível" : "Login indisponível";
    } catch { loginFeedback.textContent = ""; }
  }, 500);
}

// ── Menor de idade → mostra a declaração ──────────────────────────────────────
chkMenor.addEventListener("change", () => {
  declaracaoWrap.className = chkMenor.checked ? "declaracao-wrap visible" : "declaracao-wrap";
});

// ── Envio ─────────────────────────────────────────────────────────────────────
btnSalvar.addEventListener("click", async () => {
  const loginVal = fLogin.value.trim() || fEmail.value.trim().split("@")[0];

  if (!fNome.value.trim() || !fEmail.value.trim() || !loginVal || !fSenha.value) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Preencha todos os campos obrigatórios.";
    return;
  }
  if (loginVal.length < 3) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "O login deve ter pelo menos 3 caracteres.";
    return;
  }
  if (chkMenor.checked && !chkDeclaracao.checked) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Para aluno menor de idade, confirme a declaração do professor.";
    return;
  }

  const dados = {
    nome_completo: fNome.value.trim(),
    email:         fEmail.value.trim(),
    login:         loginVal,
    senha:         fSenha.value,
    escolaridade:  fEscol.value,
    menor_idade:   chkMenor.checked,
  };
  if (chkMenor.checked) dados.declaracao = true;

  btnSalvar.disabled = true;
  btnSalvar.textContent = "Salvando…";
  alertDiv.className = ""; alertDiv.textContent = "";
  try {
    await cadastrarAluno(dados);
    alertDiv.className = "alert alert-success";
    alertDiv.textContent = `Aluno "${dados.nome_completo}" cadastrado com sucesso!`;
    fNome.value = ""; fEmail.value = ""; fLogin.value = ""; delete fLogin.dataset.edited;
    fSenha.value = ""; fEscol.value = "";
    chkMenor.checked = false; chkDeclaracao.checked = false;
    declaracaoWrap.className = "declaracao-wrap";
    loginFeedback.textContent = "";
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
    <div class="form-field">
      <label>Login *</label>${fLogin}
      ${loginFeedback}
      <span class="hint">Sugerido a partir do e-mail. Pode ser alterado.</span>
    </div>
    <div class="form-field"><label>Senha inicial *</label>${fSenha}<span class="hint">O aluno poderá alterar depois.</span></div>
    <div class="form-field"><label>Escolaridade</label>${fEscol}</div>
    <label class="section-label">${chkMenor} Aluno é menor de idade</label>
    ${declaracaoWrap}
  </div>
  <div class="aviso-privacidade">
    Coletamos apenas o mínimo necessário para a orientação e mobilidade do aluno.
    O tratamento segue a <a href="/privacidade" target="_blank">Política de Privacidade</a>.
  </div>
  <div class="form-actions">
    ${btnSalvar}
    <a href="/admin/alunos" class="btn btn-ghost">Cancelar</a>
  </div>
  ${alertDiv}
</div>`);

// Conteúdo da declaração (inserido após o display, dentro do grid)
declaracaoWrap.innerHTML = "";
declaracaoWrap.append(html`<div class="form-field full declaracao-box">
  <label class="section-label">${chkDeclaracao} Declaro estar autorizado a cadastrar este aluno menor de idade (sob tutela escolar / com ciência do responsável).</label>
  <span class="hint" style="color:inherit;opacity:.8;">Sua declaração é registrada (autor e data) para fins de auditoria.</span>
</div>`);
```
