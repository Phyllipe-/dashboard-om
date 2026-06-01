---
title: Configurar ENA
sidebar: false
toc: false
---

<style>
  #app-header, #app-nav, .observablehq-header, header { display: none !important; }
  body, html { margin: 0; padding: 0; height: 100%; }
  .observablehq-center, .observablehq--article, main { all: unset !important; display: block !important; }

  .qr-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--theme-background);
    padding: 2rem;
  }

  .qr-card {
    background: var(--theme-background-alt);
    border: 1px solid var(--theme-foreground-faintest);
    border-radius: 16px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    text-align: center;
  }

  .qr-title {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0 0 .25rem;
  }

  .qr-subtitle {
    color: var(--theme-foreground-muted);
    font-size: .85rem;
    margin: 0 0 1.75rem;
  }

  .qr-canvas-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  #qr-canvas {
    border-radius: 12px;
    border: 6px solid #fff;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  }

  .qr-info {
    font-size: .8rem;
    color: var(--theme-foreground-muted);
    background: var(--theme-background);
    border-radius: 8px;
    padding: .75rem 1rem;
    margin-bottom: 1.25rem;
    text-align: left;
    line-height: 1.6;
  }

  .qr-info strong { color: var(--theme-foreground); }

  .qr-expiry {
    font-size: .75rem;
    color: var(--theme-foreground-muted);
    margin-bottom: 1.25rem;
  }

  .qr-expiry.expiring { color: #f59e0b; }
  .qr-expiry.expired  { color: #dc2626; font-weight: 600; }

  .btn-refresh {
    width: 100%;
    padding: .65rem;
    background: #1e293b;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: .9rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity .15s;
    margin-bottom: .75rem;
  }
  .btn-refresh:hover { opacity: .82; }

  .btn-voltar {
    display: block;
    font-size: .82rem;
    color: var(--theme-foreground-muted);
    text-decoration: none;
    margin-top: .25rem;
  }
  .btn-voltar:hover { color: var(--theme-foreground); }

  .qr-error {
    padding: .8rem 1rem;
    background: #fef2f2;
    color: #991b1b;
    border-radius: 8px;
    font-size: .85rem;
    margin-bottom: 1rem;
  }
</style>

```js
import QRCode from "qrcode";
import { requireAuth, getToken, getUser } from "./auth.js";

const user  = requireAuth();
const token = getToken();

const API_BASE = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "http://127.0.0.1:5000/api"
  : "https://api.omaproject.com.br/api";

// ── Elementos ─────────────────────────────────────────────────────────────────
const canvas    = html`<canvas id="qr-canvas" width="260" height="260"></canvas>`;
const infoNome  = html`<span></span>`;
const infoEmail = html`<span></span>`;
const expiryEl  = html`<p class="qr-expiry"></p>`;
const btnRefresh = html`<button class="btn-refresh">↻ Gerar novo QR</button>`;
const errorDiv  = html`<div></div>`;

// ── Gera o QR ─────────────────────────────────────────────────────────────────
function gerarQR() {
  const payload = JSON.stringify({
    v:     1,
    url:   API_BASE,
    token: token,
    nome:  user.nome,
    id:    user.id_usuario,
  });

  QRCode.toCanvas(canvas, payload, {
    width:          260,
    margin:         1,
    color: { dark: "#0f172a", light: "#ffffff" },
    errorCorrectionLevel: "M",
  }, (err) => {
    if (err) {
      errorDiv.className   = "qr-error";
      errorDiv.textContent = "Erro ao gerar QR: " + err.message;
    }
  });

  atualizarExpiry();
}

// ── Contador de expiração ─────────────────────────────────────────────────────
let geradoEm = Date.now();

function atualizarExpiry() {
  geradoEm = Date.now();
  const expiresAt = geradoEm + 4 * 60 * 60 * 1000; // 4h (validade do JWT)

  const tick = () => {
    const restante = expiresAt - Date.now();
    if (restante <= 0) {
      expiryEl.className   = "qr-expiry expired";
      expiryEl.textContent = "⚠ QR expirado — gere um novo.";
      return;
    }

    const h = Math.floor(restante / 3_600_000);
    const m = Math.floor((restante % 3_600_000) / 60_000);
    const s = Math.floor((restante % 60_000) / 1_000);
    const label = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

    expiryEl.textContent = `Expira em ${label}`;
    expiryEl.className   = restante < 15 * 60 * 1000 ? "qr-expiry expiring" : "qr-expiry";

    setTimeout(tick, 1000);
  };
  tick();
}

// ── Preenche informações do professor ─────────────────────────────────────────
infoNome.textContent  = user.nome;
infoEmail.textContent = user.email ?? "";

// ── Eventos ───────────────────────────────────────────────────────────────────
btnRefresh.addEventListener("click", gerarQR);

// ── Render inicial ────────────────────────────────────────────────────────────
gerarQR();

display(html`<div class="qr-page">
  <div class="qr-card">
    <h2 class="qr-title">Configurar ENA</h2>
    <p class="qr-subtitle">Aponte a câmera do celular com o ENA instalado para configurar automaticamente.</p>

    ${errorDiv}

    <div class="qr-canvas-wrap">${canvas}</div>

    ${expiryEl}

    <div class="qr-info">
      <strong>Professor:</strong> ${infoNome}<br>
      <strong>API:</strong> ${API_BASE}
    </div>

    ${btnRefresh}
    <a href="/" class="btn-voltar">← Voltar ao início</a>
  </div>
</div>`);
```
