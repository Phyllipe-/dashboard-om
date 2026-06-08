---
title: Esqueci minha senha
sidebar: false
toc: false
---

<style>
  #app-header, #app-nav, .observablehq-header, header { display: none !important; }
  body, html { margin: 0; padding: 0; height: 100%; }
  .observablehq-center, .observablehq--article, main { all: unset !important; display: block !important; }
  .login-page { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: var(--theme-background); }
  .login-card { background: var(--theme-background-alt); border: 1px solid var(--theme-foreground-faintest); border-radius: 12px; padding: 2.5rem 2rem; width: 100%; max-width: 400px; box-shadow: 0 4px 24px rgba(0,0,0,.12); }
  .login-card h2 { margin: 0 0 .25rem; font-size: 1.4rem; }
  .login-subtitle { color: var(--theme-foreground-muted); font-size: .9rem; margin: 0 0 1.75rem; }
  .login-field { display: flex; flex-direction: column; gap: .35rem; margin-bottom: 1.1rem; }
  .login-field label { font-size: .875rem; font-weight: 600; }
  .login-field input { width: 100%; box-sizing: border-box; padding: .6rem .75rem; border: 1px solid var(--theme-foreground-faint); border-radius: 6px; background: var(--theme-background); color: var(--theme-foreground); font-size: 1rem; outline: none; }
  .login-field input:focus { border-color: var(--om-accent); }
  .login-btn { width: 100%; padding: .7rem; background: #1e293b; color: #fff; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: .25rem; }
  .login-btn:hover:not(:disabled) { opacity: .82; }
  .login-btn:disabled { opacity: .45; cursor: not-allowed; }
  .login-msg { margin-top: .9rem; padding: .6rem .75rem; border-radius: 6px; font-size: .875rem; }
  .login-error { background: var(--om-bad-bg); color: var(--om-bad-text); }
  .login-ok { background: var(--om-ok-bg); color: var(--om-ok-text); }
</style>

```js
import { esqueciSenha } from "./api.js";

const emailInput = html`<input type="email" placeholder="professor@exemplo.com" autocomplete="username" />`;
const btn = html`<button class="login-btn">Enviar link</button>`;
const msg = html`<div></div>`;

async function enviar() {
  const email = emailInput.value.trim();
  if (!email) { msg.className = "login-msg login-error"; msg.textContent = "Informe seu e-mail."; return; }
  btn.disabled = true; btn.textContent = "Enviando…"; msg.className = ""; msg.textContent = "";
  try {
    const r = await esqueciSenha(email);
    msg.className = "login-msg login-ok";
    msg.textContent = r.mensagem || "Se o e-mail estiver cadastrado, enviaremos um link de redefinição.";
  } catch (e) {
    msg.className = "login-msg login-error"; msg.textContent = e.message;
  } finally {
    btn.disabled = false; btn.textContent = "Enviar link";
  }
}
btn.addEventListener("click", enviar);
emailInput.addEventListener("keydown", e => { if (e.key === "Enter") enviar(); });

display(html`<div class="login-page"><div class="login-card">
  <h2>Recuperar senha</h2>
  <p class="login-subtitle">Informe o e-mail da sua conta. Se estiver cadastrado, enviaremos um link para redefinir a senha.</p>
  <div class="login-field"><label>E-mail</label>${emailInput}</div>
  ${btn}
  ${msg}
  <p style="margin-top:1.25rem;font-size:.82rem;text-align:center;"><a href="/login" style="color:#4a90e2;font-weight:600;text-decoration:none;">← Voltar ao login</a></p>
</div></div>`);
```
