---
title: Entrar
sidebar: false
toc: false
---

<style>
  /* Oculta header global nesta página */
  #app-header { display: none !important; }

  body { margin: 0; }

  .login-page {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-card {
    background: var(--theme-background-alt);
    border: 1px solid var(--theme-foreground-faintest);
    border-radius: 12px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  }

  .login-card h2 {
    margin: 0 0 0.25rem;
    font-size: 1.5rem;
  }

  .login-subtitle {
    color: var(--theme-foreground-muted);
    font-size: 0.9rem;
    margin: 0 0 1.75rem;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 1.1rem;
  }

  .login-field label {
    font-size: 0.875rem;
    font-weight: 600;
  }

  .login-field input {
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--theme-foreground-faint);
    border-radius: 6px;
    background: var(--theme-background);
    color: var(--theme-foreground);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.15s;
  }

  .login-field input:focus {
    border-color: #4a90e2;
  }

  .login-btn {
    width: 100%;
    padding: 0.7rem;
    background: var(--theme-foreground);
    color: var(--theme-background);
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0.25rem;
    transition: opacity 0.15s;
  }

  .login-btn:hover:not(:disabled) { opacity: 0.82; }
  .login-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .login-error {
    margin-top: 0.9rem;
    padding: 0.6rem 0.75rem;
    background: #fee2e2;
    color: #b91c1c;
    border-radius: 6px;
    font-size: 0.875rem;
  }
</style>

```js
import { login, saveSession, getToken } from "./auth.js";

if (getToken()) window.location.href = "/";

const emailInput = html`<input type="email" id="email" placeholder="professor@exemplo.com" autocomplete="username" />`;
const senhaInput = html`<input type="password" id="senha" placeholder="••••••••" autocomplete="current-password" />`;
const btnEntrar  = html`<button class="login-btn">Entrar</button>`;
const erroDiv    = html`<div></div>`;

const card = html`<div class="login-page">
  <div class="login-card">
    <h2>Dashboard OM</h2>
    <p class="login-subtitle">Entre com suas credenciais de professor.</p>
    <div class="login-field">
      <label>Email</label>
      ${emailInput}
    </div>
    <div class="login-field">
      <label>Senha</label>
      ${senhaInput}
    </div>
    ${btnEntrar}
    ${erroDiv}
  </div>
</div>`;

display(card);

async function tentarLogin() {
  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  if (!email || !senha) {
    erroDiv.className = "login-error";
    erroDiv.textContent = "Preencha o email e a senha.";
    return;
  }

  erroDiv.textContent = "";
  erroDiv.className = "";
  btnEntrar.disabled = true;
  btnEntrar.textContent = "Entrando…";

  try {
    const { token, usuario } = await login(email, senha);
    saveSession(token, usuario);
    window.location.href = "/";
  } catch (err) {
    erroDiv.className = "login-error";
    erroDiv.textContent = err.message;
  } finally {
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
  }
}

btnEntrar.addEventListener("click", tentarLogin);
emailInput.addEventListener("keydown", e => { if (e.key === "Enter") tentarLogin(); });
senhaInput.addEventListener("keydown", e => { if (e.key === "Enter") tentarLogin(); });
```
