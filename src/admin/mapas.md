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
  .badge-ativo   { background:var(--om-ok-bg); color:var(--om-ok-text); }
  .badge-inativo { background:var(--om-bad-bg); color:var(--om-bad-text); }

  .btn { padding:.6rem 1.25rem; border-radius:6px; font-size:.95rem; font-weight:600; cursor:pointer; border:1.5px solid transparent; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box; transition:opacity .15s; }
  .btn-primary { background:var(--theme-foreground); border-color:var(--theme-foreground); }
  a.btn-primary, button.btn-primary { color:var(--theme-background); }
  .btn-primary:hover { opacity:.82; }
  .btn-ghost { background:transparent; color:var(--theme-foreground); border-color:var(--theme-foreground-faint); }
  .btn-ghost:hover { background:var(--theme-background-alt); }
  .btn-sm { padding:.22rem .6rem; font-size:.8rem; border-radius:5px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); cursor:pointer; display:inline-flex; align-items:center; gap:.25rem; white-space:nowrap; box-sizing:border-box; }
  .btn-sm:hover { background:var(--theme-background-alt); }
  .btn-sm:disabled { opacity:.4; cursor:not-allowed; }

  .stats-bar { display:flex; gap:1.25rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .stat-card { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.65rem 1.1rem; min-width:110px; }
  .stat-value { font-size:1.5rem; font-weight:700; }
  .stat-label { font-size:.76rem; color:var(--theme-foreground-muted); }

  .empty-state { text-align:center; padding:2.5rem 0; color:var(--theme-foreground-muted); }

  .ext-link { display:inline-flex; align-items:center; gap:.4rem; }
  .ext-link::after { content:"↗"; font-size:.8rem; }

  .badge-original { background:#dbeafe; color:#1d4ed8; }
  .badge-copia    { background:#f3e8ff; color:#7e22ce; }
  .td-acoes { display:flex; gap:.35rem; align-items:stretch; flex-wrap:nowrap; white-space:nowrap; }
  .maps-table th:last-child,
  .maps-table td:last-child { white-space:nowrap; width:1%; }

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
import { fetchTodosMaps, fetchMeusMaps, toggleAtivoMapa, apropriarMapa, checkUsoMapa, copiarMapaProprio } from "../api.js";

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

// --- Conjuntos auxiliares ---
const meusIdsSet      = new Set(meusMapas.map(m => m.id_mapa));
const minhasOrigensSet = new Set(meusMapas.filter(m => m.id_mapa_original).map(m => m.id_mapa_original));

// --- Download ---
function baixarMapa(mapa) {
  const token = sessionStorage.getItem("om_token");
  const a = document.createElement("a");
  a.href = `${API_BASE}/treinos/mapas/${mapa.id_mapa}/download?token=${encodeURIComponent(token)}`;
  a.download = `${mapa.nome_mapa}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// --- Badge de origem ---
function origemBadge(mapa) {
  if (!mapa.id_mapa_original) {
    return `<span class="badge badge-original">Original</span>`;
  }
  let tooltip = "";
  if (mapa.nome_mapa_original) {
    tooltip = `Copiado de: ${mapa.nome_mapa_original}`;
    if (mapa.nome_professor_original) tooltip += `\nCriador: ${mapa.nome_professor_original}`;
  }
  const attr = tooltip ? `title="${tooltip}"` : "";
  return `<span class="badge badge-copia" ${attr}>Cópia</span>`;
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

// --- Tabela todos os mapas ---
const tbodyTodos = html`<tbody></tbody>`;
function renderTodos() {
  tbodyTodos.innerHTML = "";
  if (!todosMapas.length) {
    tbodyTodos.append(html`<tr><td colspan="8" class="empty-state">Nenhum mapa cadastrado.</td></tr>`);
    return;
  }
  for (const m of todosMapas) {
    const eMeu      = meusIdsSet.has(m.id_mapa);
    const jaCopiado = minhasOrigensSet.has(m.id_mapa);

    // Botão Download
    const btnDown = document.createElement("button");
    btnDown.className = "btn-sm";
    btnDown.textContent = "Download";
    btnDown.disabled = !m.ativo;
    btnDown.title = m.ativo ? "Baixar mapa" : "Apenas mapas ativos podem ser baixados";
    if (m.ativo) btnDown.addEventListener("click", () => baixarMapa(m));

    // Botão Copiar
    let acaoCopiar;
    if (eMeu) {
      acaoCopiar = html`<span class="btn-sm" style="opacity:.4;cursor:default">Meu mapa</span>`;
    } else if (jaCopiado) {
      acaoCopiar = html`<button class="btn-sm" disabled style="opacity:.4">Já copiado</button>`;
    } else {
      acaoCopiar = html`<button class="btn-sm">Copiar</button>`;
      acaoCopiar.addEventListener("click", async () => {
        const acao = await modalEditar(
          "Copiar mapa",
          `Copiar <strong>${m.nome_mapa}</strong> para Meus mapas?<br><br>
           Uma cópia ativa será criada com você como responsável. O original permanece inalterado.`,
          [
            { label: "Cancelar", valor: "cancelar", primary: false },
            { label: "Copiar",   valor: "copiar",   primary: true  },
          ]
        );
        if (acao !== "copiar") return;
        acaoCopiar.disabled = true; acaoCopiar.textContent = "Copiando…";
        try {
          const res = await apropriarMapa(m.id_mapa);
          meusMapas.push({ ...m, id_mapa: res.id_mapa, nome_mapa: res.nome_mapa, id_mapa_original: m.id_mapa, nome_mapa_original: m.nome_mapa });
          meusIdsSet.add(res.id_mapa);
          minhasOrigensSet.add(m.id_mapa);
          atualizarStats(); renderTodos(); renderMeus();
        } catch(e) {
          alert("Erro: " + e.message);
          acaoCopiar.disabled = false; acaoCopiar.textContent = "Copiar";
        }
      });
    }

    const tdAcoes = html`<td></td>`;
    const divAcoes = document.createElement("div"); divAcoes.className = "td-acoes";
    divAcoes.append(btnDown, acaoCopiar);
    tdAcoes.append(divAcoes);

    const tdOrigem = document.createElement("td");
    tdOrigem.innerHTML = origemBadge(m);

    const tr = html`<tr></tr>`;
    tr.append(
      celulaPreview(m),
      html`<td>${m.nome_mapa}</td>`,
      html`<td style="color:var(--theme-foreground-muted);font-size:.85rem">${m.nome_professor}</td>`,
      html`<td style="color:var(--theme-foreground-muted);font-size:.85rem">${m.data_criacao}</td>`,
      html`<td><span class="badge ${m.ativo ? "badge-ativo" : "badge-inativo"}">${m.ativo ? "Ativo" : "Inativo"}</span></td>`,
      tdOrigem,
      tdAcoes,
    );
    tbodyTodos.append(tr);
  }
}

// --- Modal informativo (cenário 1 e 2) ---
function modalEditar(titulo, corpo, acoes) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.style.cssText = "backdrop-filter:blur(3px)";

    const box = document.createElement("div");
    box.className = "lightbox-box";
    box.style.cssText = "max-width:420px;gap:.85rem;cursor:default";

    const h = document.createElement("p"); h.className = "lightbox-title"; h.textContent = titulo;
    const p = document.createElement("p"); p.style.cssText = "font-size:.9rem;line-height:1.6;color:var(--theme-foreground-muted);margin:0"; p.innerHTML = corpo;

    const footer = document.createElement("div");
    footer.style.cssText = "display:flex;gap:.6rem;justify-content:flex-end;margin-top:.25rem";

    const fechar = () => { overlay.remove(); resolve(null); };
    overlay.addEventListener("click", e => { if (e.target === overlay) fechar(); });
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") { fechar(); document.removeEventListener("keydown", esc); }
    });

    acoes.forEach(({ label, valor, primary }) => {
      const btn = document.createElement("button");
      btn.className = primary ? "btn btn-primary" : "btn btn-ghost";
      btn.style.cssText = "padding:.45rem 1rem;font-size:.875rem";
      btn.textContent = label;
      btn.addEventListener("click", () => { overlay.remove(); resolve(valor); });
      footer.append(btn);
    });

    box.append(h, p, footer);
    overlay.append(box);
    document.body.append(overlay);
  });
}

// --- Editar mapa: fluxo com 3 cenários ---
async function editarMapa(mapa, btnEditar) {
  btnEditar.disabled = true; btnEditar.textContent = "Verificando…";
  let uso;
  try {
    uso = await checkUsoMapa(mapa.id_mapa);
  } catch(e) {
    alert("Erro ao verificar uso do mapa: " + e.message);
    btnEditar.disabled = false; btnEditar.textContent = "Editar";
    return;
  }

  const token = sessionStorage.getItem("om_token");
  const e3Url = id => `http://localhost:5173/?mode=edit&id=${id}&token=${encodeURIComponent(token)}`;

  // Cenário 1 — mapa em atividade ATIVA
  if (uso.em_atividade_ativa) {
    const nomes = uso.atividades.filter(a => a.ativo).map(a => `<strong>${a.nome}</strong>`).join(", ");
    await modalEditar(
      "Edição não permitida",
      `Este mapa está sendo usado em ${uso.atividades.filter(a=>a.ativo).length > 1 ? "atividades ativas" : "uma atividade ativa"}: ${nomes}.<br><br>
       Enquanto houver atividades ativas usando este mapa, ele não pode ser editado.<br>
       <span style="color:#16a34a">Sugestão: crie um novo mapa no Editor E3.</span>`,
      [{ label: "Entendi", valor: null, primary: true }]
    );
    btnEditar.disabled = false; btnEditar.textContent = "Editar";
    return;
  }

  // Cenário 2 — mapa em atividade INATIVA
  if (uso.em_atividade_inativa) {
    const nomes = uso.atividades.map(a => `<strong>${a.nome}</strong>`).join(", ");
    const acao = await modalEditar(
      "Editar com segurança",
      `Este mapa está em ${uso.atividades.length > 1 ? "atividades inativas" : "uma atividade inativa"}: ${nomes}.<br><br>
       Para preservar o original, será criada uma <strong>cópia ativa</strong> que você editará no E3.
       O mapa original não será alterado.`,
      [
        { label: "Cancelar",       valor: "cancelar", primary: false },
        { label: "Criar cópia e editar", valor: "copiar",   primary: true  },
      ]
    );
    if (acao !== "copiar") { btnEditar.disabled = false; btnEditar.textContent = "Editar"; return; }

    try {
      btnEditar.textContent = "Criando cópia…";
      const copia = await copiarMapaProprio(mapa.id_mapa);
      window.open(e3Url(copia.id_mapa), "_blank");
    } catch(e) {
      alert("Erro ao criar cópia: " + e.message);
    }
    btnEditar.disabled = false; btnEditar.textContent = "Editar";
    return;
  }

  // Cenário 3 — mapa NÃO está em nenhuma atividade
  window.open(e3Url(mapa.id_mapa), "_blank");
  btnEditar.disabled = false; btnEditar.textContent = "Editar";
}

// --- Tabela meus mapas (com toggle) ---
const tbodyMeus = html`<tbody></tbody>`;
function renderMeus() {
  tbodyMeus.innerHTML = "";
  if (!meusMapas.length) {
    tbodyMeus.append(html`<tr><td colspan="6" class="empty-state">Você ainda não criou nenhum mapa.</td></tr>`);
    return;
  }
  for (const m of meusMapas) {
    const btnDown = document.createElement("button");
    btnDown.className = "btn-sm";
    btnDown.textContent = "Download";
    btnDown.disabled = !m.ativo;
    btnDown.title = m.ativo ? "Baixar mapa" : "Apenas mapas ativos podem ser baixados";
    if (m.ativo) btnDown.addEventListener("click", () => baixarMapa(m));

    const btnToggle = html`<button class="btn-sm">${m.ativo ? "Desativar" : "Ativar"}</button>`;
    btnToggle.addEventListener("click", async () => {
      btnToggle.disabled = true;
      try {
        const res = await toggleAtivoMapa(m.id_mapa);
        m.ativo = res.ativo;
        const geral = todosMapas.find(x => x.id_mapa === m.id_mapa);
        if (geral) geral.ativo = res.ativo;
        atualizarStats(); renderMeus(); renderTodos();
      } catch(e) {
        alert("Erro: " + e.message);
        btnToggle.disabled = false;
      }
    });

    const tdAcoes = html`<td></td>`;
    const btnEditar = document.createElement("button");
    btnEditar.className = "btn-sm";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => editarMapa(m, btnEditar));

    const divAcoes = document.createElement("div"); divAcoes.className = "td-acoes";
    divAcoes.append(btnDown, btnEditar, btnToggle);
    tdAcoes.append(divAcoes);

    const tdOrigem = document.createElement("td");
    tdOrigem.innerHTML = origemBadge(m);

    const tr = html`<tr></tr>`;
    tr.append(
      celulaPreview(m),
      html`<td>${m.nome_mapa}</td>`,
      html`<td style="color:var(--theme-foreground-muted);font-size:.85rem">${m.data_criacao}</td>`,
      html`<td><span class="badge ${m.ativo ? "badge-ativo" : "badge-inativo"}">${m.ativo ? "Ativo" : "Inativo"}</span></td>`,
      tdOrigem,
      tdAcoes,
    );
    tbodyMeus.append(tr);
  }
}

// --- Abas ---
const tabTodos = html`<button class="tab-btn">Todos os mapas</button>`;
const tabMeus  = html`<button class="tab-btn active">Meus mapas</button>`;
const panelTodos = html`<div style="display:none"></div>`;
const panelMeus  = html`<div></div>`;

tabTodos.addEventListener("click", () => {
  tabTodos.classList.add("active"); tabMeus.classList.remove("active");
  panelTodos.style.display = ""; panelMeus.style.display = "none";
});
tabMeus.addEventListener("click", () => {
  tabMeus.classList.add("active"); tabTodos.classList.remove("active");
  panelMeus.style.display = ""; panelTodos.style.display = "none";
});

panelTodos.append(html`<table class="maps-table">
  <thead><tr><th>Preview</th><th>Nome</th><th>Professor</th><th>Data</th><th>Status</th><th>Origem</th><th>Ação</th></tr></thead>
  ${tbodyTodos}
</table>`);

panelMeus.append(html`<table class="maps-table">
  <thead><tr><th>Preview</th><th>Nome</th><th>Data</th><th>Status</th><th>Origem</th><th>Ação</th></tr></thead>
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
