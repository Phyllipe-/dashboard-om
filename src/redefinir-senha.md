---
title: Redefinir senha
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
  .hint { font-size: .75rem; color: var(--theme-foreground-muted); }
</style>

```js
import { redefinirSenha } from "./api.js";

const token = new URLSearchParams(window.location.search).get("t") || "";

const senhaInput   = html`<input type="password" placeholder="Mínimo 8 caracteres" autocomplete="new-password" />`;
const confirmInput = html`<input type="password" placeholder="Repita a nova senha" autocomplete="new-password" />`;
const btn = html`<button class="login-btn">Redefinir senha</button>`;
const msg = html`<div></div>`;

async function enviar() {
  const nova = senhaInput.value;
  const conf = confirmInput.value;
  if (nova.length < 8) { msg.className = "login-msg login-error"; msg.textContent = "A senha deve ter pelo menos 8 caracteres."; return; }
  if (nova !== conf)   { msg.className = "login-msg login-error"; msg.textContent = "As senhas não conferem."; return; }

  btn.disabled = true; btn.textContent = "Salvando…"; msg.className = ""; msg.textContent = "";
  try {
    const r = await redefinirSenha(token, nova);
    msg.className = "login-msg login-ok";
    msg.innerHTML = (r.mensagem || "Senha redefinida com sucesso.") + ' <a href="/login" style="color:inherit;font-weight:700;">Fazer login</a>';
    btn.style.display = "none";
    senhaInput.disabled = confirmInput.disabled = true;
  } catch (e) {
    msg.className = "login-msg login-error"; msg.textContent = e.message;
    btn.disabled = false; btn.textContent = "Redefinir senha";
  }
}
btn.addEventListener("click", enviar);
confirmInput.addEventListener("keydown", e => { if (e.key === "Enter") enviar(); });

const corpo = !token
  ? html`<div class="login-msg login-error">Link inválido ou incompleto. Solicite um novo link de redefinição.</div>
         <p style="margin-top:1.25rem;font-size:.82rem;text-align:center;"><a href="/esqueci-senha" style="color:#4a90e2;font-weight:600;text-decoration:none;">Pedir novo link</a></p>`
  : html`<div>
      <div class="login-field"><label>Nova senha</label>${senhaInput}<span class="hint">Mínimo 8 caracteres.</span></div>
      <div class="login-field"><label>Confirmar nova senha</label>${confirmInput}</div>
      ${btn}
      ${msg}
      <p style="margin-top:1.25rem;font-size:.82rem;text-align:center;"><a href="/login" style="color:#4a90e2;font-weight:600;text-decoration:none;">← Voltar ao login</a></p>
    </div>`;

display(html`<div class="login-page"><div class="login-card">
  <h2>Redefinir senha</h2>
  <p class="login-subtitle">Defina uma nova senha para sua conta.</p>
  ${corpo}
</div></div>`);
```
