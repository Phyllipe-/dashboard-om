---
title: Trocar senha
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
</style>

```js
import { requireAuth, updateUser, logout } from "./auth.js";
import { trocarSenha } from "./api.js";

const user = requireAuth();

const atualInput = html`<input type="password" placeholder="Senha atual" autocomplete="current-password" />`;
const novaInput  = html`<input type="password" placeholder="Mínimo 8 caracteres" autocomplete="new-password" />`;
const confInput  = html`<input type="password" placeholder="Repita a nova senha" autocomplete="new-password" />`;
const btn = html`<button class="login-btn">Salvar nova senha</button>`;
const msg = html`<div></div>`;
const sairLink = html`<a href="#" style="color:#4a90e2;font-weight:600;text-decoration:none;">Sair</a>`;
sairLink.addEventListener("click", (e) => { e.preventDefault(); logout(); });

async function enviar() {
  const atual = atualInput.value, nova = novaInput.value, conf = confInput.value;
  if (!atual)          { msg.className = "login-msg login-error"; msg.textContent = "Informe a senha atual."; return; }
  if (nova.length < 8) { msg.className = "login-msg login-error"; msg.textContent = "A nova senha deve ter pelo menos 8 caracteres."; return; }
  if (nova !== conf)   { msg.className = "login-msg login-error"; msg.textContent = "As senhas não conferem."; return; }

  btn.disabled = true; btn.textContent = "Salvando…"; msg.className = ""; msg.textContent = "";
  try {
    await trocarSenha(atual, nova);
    updateUser({ senha_provisoria: false });
    window.location.href = "/";
  } catch (e) {
    msg.className = "login-msg login-error"; msg.textContent = e.message;
    btn.disabled = false; btn.textContent = "Salvar nova senha";
  }
}
btn.addEventListener("click", enviar);
confInput.addEventListener("keydown", e => { if (e.key === "Enter") enviar(); });

const aviso = user.senha_provisoria
  ? html`<p class="login-subtitle" style="color:#b45309;">Sua senha é provisória. Defina uma nova senha para continuar.</p>`
  : html`<p class="login-subtitle">Altere a sua senha de acesso.</p>`;

display(html`<div class="login-page"><div class="login-card">
  <h2>Trocar senha</h2>
  ${aviso}
  <div class="login-field"><label>Senha atual</label>${atualInput}</div>
  <div class="login-field"><label>Nova senha</label>${novaInput}</div>
  <div class="login-field"><label>Confirmar nova senha</label>${confInput}</div>
  ${btn}
  ${msg}
  <p style="margin-top:1.25rem;font-size:.82rem;text-align:center;">${sairLink}</p>
</div></div>`);
```
