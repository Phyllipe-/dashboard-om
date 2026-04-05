---
title: Gerenciar Mapas
toc: false
---

<style>
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
  .page-header h1 { margin:0; font-size:1.5rem; }

  .tabs { display:flex; gap:0; margin-bottom:1.5rem; border-bottom:2px solid var(--theme-foreground-faintest); }
  .tab-btn {
    padding:.5rem 1.25rem; background:transparent; border:none;
    border-bottom:2px solid transparent; margin-bottom:-2px;
    font-size:.9rem; font-weight:600; cursor:pointer;
    color:var(--theme-foreground-muted); transition:all .15s;
  }
  .tab-btn.active { color:var(--theme-foreground); border-bottom-color:var(--theme-foreground); }

  .maps-table { width:100%; border-collapse:collapse; font-size:.9rem; }
  .maps-table th {
    text-align:left; padding:.55rem .75rem;
    border-bottom:2px solid var(--theme-foreground-faint);
    color:var(--theme-foreground-muted); font-size:.78rem;
    text-transform:uppercase; letter-spacing:.04em;
  }
  .maps-table td { padding:.6rem .75rem; border-bottom:1px solid var(--theme-foreground-faintest); vertical-align:middle; }
  .maps-table tr:hover td { background:var(--theme-background-alt); }

  .badge { display:inline-block; padding:.18rem .55rem; border-radius:12px; font-size:.78rem; font-weight:600; }
  .badge-ativo   { background:#dcfce7; color:#166534; }
  .badge-inativo { background:#fee2e2; color:#991b1b; }

  .btn { padding:.45rem 1rem; border-radius:6px; font-size:.875rem; font-weight:600; cursor:pointer; border:none; text-decoration:none; display:inline-block; transition:opacity .15s; }
  .btn-primary { background:var(--theme-foreground); color:var(--theme-background); }
  .btn-primary:hover { opacity:.82; }
  .btn-ghost { background:transparent; color:var(--theme-foreground); border:1px solid var(--theme-foreground-faint); }
  .btn-ghost:hover { background:var(--theme-background-alt); }
  .btn-sm { padding:.22rem .6rem; font-size:.8rem; border-radius:5px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); cursor:pointer; }
  .btn-sm:hover { background:var(--theme-background-alt); }
  .btn-sm:disabled { opacity:.4; cursor:not-allowed; }

  .stats-bar { display:flex; gap:1.25rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .stat-card { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.65rem 1.1rem; min-width:110px; }
  .stat-value { font-size:1.5rem; font-weight:700; }
  .stat-label { font-size:.76rem; color:var(--theme-foreground-muted); }

  .empty-state { text-align:center; padding:2.5rem 0; color:var(--theme-foreground-muted); }

  .ext-link { display:inline-flex; align-items:center; gap:.4rem; }
  .ext-link::after { content:"↗"; font-size:.8rem; }

  /* Preview thumbnail */
  .map-thumb {
    width:56px; height:56px; object-fit:cover;
    border-radius:6px; border:1px solid var(--theme-foreground-faintest);
    cursor:pointer; transition:transform .15s;
    background:var(--theme-background-alt);
  }
  .map-thumb:hover { transform:scale(1.1); }
  .no-preview {
    width:56px; height:56px; border-radius:6px;
    border:1px dashed var(--theme-foreground-faintest);
    display:flex; align-items:center; justify-content:center;
    font-size:.65rem; color:var(--theme-foreground-faint);
    background:var(--theme-background-alt);
  }

  /* Lightbox */
  .lightbox-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.7);
    display:flex; align-items:center; justify-content:center;
    z-index:9999; cursor:pointer;
  }
  .lightbox-box {
    background:var(--theme-background); border-radius:12px;
    padding:1.25rem; max-width:90vw; max-height:90vh;
    display:flex; flex-direction:column; gap:.75rem;
    cursor:default;
  }
  .lightbox-title { font-weight:700; font-size:1rem; margin:0; }
  .lightbox-img { max-width:min(480px,80vw); max-height:60vh; object-fit:contain; border-radius:6px; }
  .lightbox-meta { font-size:.8rem; color:var(--theme-foreground-muted); }
  .lightbox-close { align-self:flex-end; background:none; border:none; font-size:1.2rem; cursor:pointer; color:var(--theme-foreground-muted); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchTodosMaps, fetchMeusMaps, toggleAtivoMapa } from "../api.js";

const API_BASE = "http://127.0.0.1:5000/api";

const currentUser = requireAuth();
const headerUser = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser) headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

// --- Estado ---
let todosMapas = [];
let meusMapas  = [];

// --- Carrega dados em paralelo ---
try {
  [{ mapas: todosMapas }, { mapas: meusMapas }] = await Promise.all([
    fetchTodosMaps(),
    fetchMeusMaps(),
  ]);
} catch (e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro ao carregar mapas: ${e.message}</div>`);
}

// --- Lightbox ---
function abrirLightbox(mapa) {
  const overlay = html`<div class="lightbox-overlay"></div>`;
  const box = html`<div class="lightbox-box"></div>`;

  const btnClose = html`<button class="lightbox-close" aria-label="Fechar">✕</button>`;
  const title    = html`<p class="lightbox-title">${mapa.nome_mapa}</p>`;
  const meta     = html`<p class="lightbox-meta">
    ${mapa.nome_professor ? `Professor: ${mapa.nome_professor} · ` : ""}Data: ${mapa.data_criacao}
  </p>`;

  const fechar = () => overlay.remove();
  btnClose.addEventListener("click", fechar);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) fechar(); });

  if (mapa.caminho_preview) {
    const previewUrl = `${API_BASE}/treinos/mapas/${mapa.id_mapa}/preview`;
    const img = html`<img class="lightbox-img" src="${previewUrl}" alt="Preview ${mapa.nome_mapa}" />`;
    box.append(btnClose, title, img, meta);
  } else {
    const noImg = html`<p style="color:var(--theme-foreground-muted);font-size:.9rem;">Nenhum preview disponível para este mapa.</p>`;
    box.append(btnClose, title, noImg, meta);
  }

  overlay.append(box);
  document.body.append(overlay);
}

// --- Helper: célula de preview ---
function celulaPreview(mapa) {
  if (mapa.caminho_preview) {
    const previewUrl = `${API_BASE}/treinos/mapas/${mapa.id_mapa}/preview`;
    const img = html`<img class="map-thumb" src="${previewUrl}" alt="preview" title="Ver detalhes" />`;
    img.addEventListener("click", () => abrirLightbox(mapa));
    return html`<td>${img}</td>`;
  }
  const placeholder = html`<div class="no-preview" title="Sem preview">—</div>`;
  placeholder.addEventListener("click", () => abrirLightbox(mapa));
  return html`<td>${placeholder}</td>`;
}

// --- Stats ---
const statTotal  = html`<div class="stat-card"><div class="stat-value"></div><div class="stat-label">Total (todos)</div></div>`;
const statMeus   = html`<div class="stat-card"><div class="stat-value"></div><div class="stat-label">Meus mapas</div></div>`;
const statAtivos = html`<div class="stat-card"><div class="stat-value" style="color:#166534"></div><div class="stat-label">Ativos (meus)</div></div>`;

function atualizarStats() {
  statTotal.querySelector(".stat-value").textContent  = todosMapas.length;
  statMeus.querySelector(".stat-value").textContent   = meusMapas.length;
  statAtivos.querySelector(".stat-value").textContent = meusMapas.filter(m => m.ativo).length;
}

// --- Tabela todos os mapas (somente leitura) ---
const tbodyTodos = html`<tbody></tbody>`;
function renderTodos() {
  tbodyTodos.innerHTML = "";
  if (!todosMapas.length) {
    tbodyTodos.append(html`<tr><td colspan="6" class="empty-state">Nenhum mapa cadastrado.</td></tr>`);
    return;
  }
  for (const m of todosMapas) {
    const tr = html`<tr></tr>`;
    tr.append(
      celulaPreview(m),
      html`<td>${m.nome_mapa}</td>`,
      html`<td style="color:var(--theme-foreground-muted);font-size:.85rem">${m.nome_professor}</td>`,
      html`<td style="color:var(--theme-foreground-muted);font-size:.85rem">${m.data_criacao}</td>`,
      html`<td><span class="badge ${m.ativo ? "badge-ativo" : "badge-inativo"}">${m.ativo ? "Ativo" : "Inativo"}</span></td>`,
      html`<td style="color:var(--theme-foreground-muted);font-size:.8rem">${m.caminho_arquivo_xml}</td>`,
    );
    tbodyTodos.append(tr);
  }
}

// --- Tabela meus mapas (com toggle) ---
const tbodyMeus = html`<tbody></tbody>`;
function renderMeus() {
  tbodyMeus.innerHTML = "";
  if (!meusMapas.length) {
    tbodyMeus.append(html`<tr><td colspan="5" class="empty-state">Você ainda não criou nenhum mapa.</td></tr>`);
    return;
  }
  for (const m of meusMapas) {
    const btnToggle = html`<button class="btn-sm">${m.ativo ? "Desativar" : "Ativar"}</button>`;
    btnToggle.addEventListener("click", async () => {
      btnToggle.disabled = true;
      try {
        const res = await toggleAtivoMapa(m.id_mapa);
        m.ativo = res.ativo;
        const geral = todosMapas.find(x => x.id_mapa === m.id_mapa);
        if (geral) geral.ativo = res.ativo;
        atualizarStats();
        renderMeus();
        renderTodos();
      } catch(e) {
        alert("Erro: " + e.message);
        btnToggle.disabled = false;
      }
    });
    const tr = html`<tr></tr>`;
    tr.append(
      celulaPreview(m),
      html`<td>${m.nome_mapa}</td>`,
      html`<td style="color:var(--theme-foreground-muted);font-size:.85rem">${m.data_criacao}</td>`,
      html`<td><span class="badge ${m.ativo ? "badge-ativo" : "badge-inativo"}">${m.ativo ? "Ativo" : "Inativo"}</span></td>`,
      html`<td>${btnToggle}</td>`,
    );
    tbodyMeus.append(tr);
  }
}

// --- Abas ---
const tabTodos = html`<button class="tab-btn active">Todos os mapas</button>`;
const tabMeus  = html`<button class="tab-btn">Meus mapas</button>`;
const panelTodos = html`<div></div>`;
const panelMeus  = html`<div style="display:none"></div>`;

tabTodos.addEventListener("click", () => {
  tabTodos.classList.add("active"); tabMeus.classList.remove("active");
  panelTodos.style.display = ""; panelMeus.style.display = "none";
});
tabMeus.addEventListener("click", () => {
  tabMeus.classList.add("active"); tabTodos.classList.remove("active");
  panelMeus.style.display = ""; panelTodos.style.display = "none";
});

panelTodos.append(html`<table class="maps-table">
  <thead><tr><th>Preview</th><th>Nome</th><th>Professor</th><th>Data</th><th>Status</th><th>Arquivo</th></tr></thead>
  ${tbodyTodos}
</table>`);

panelMeus.append(html`<table class="maps-table">
  <thead><tr><th>Preview</th><th>Nome</th><th>Data</th><th>Status</th><th>Ação</th></tr></thead>
  ${tbodyMeus}
</table>`);

atualizarStats();
renderTodos();
renderMeus();

display(html`<div>
  <div class="page-header">
    <h1>Mapas</h1>
    <a class="btn btn-primary ext-link" href="http://localhost:5173/" target="_blank" rel="noopener">Criar novo mapa (Editor-E3)</a>
  </div>

  <div class="stats-bar">${statTotal}${statMeus}${statAtivos}</div>

  <div class="tabs">${tabTodos}${tabMeus}</div>
  ${panelTodos}
  ${panelMeus}
</div>`);
```
