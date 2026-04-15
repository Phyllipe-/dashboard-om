---
title: Atividades
toc: false
---

<style>
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
  .page-header h1 { margin:0; font-size:1.5rem; }
  .stats-bar { display:flex; gap:1.25rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .stat-card { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.65rem 1.1rem; min-width:110px; }
  .stat-value { font-size:1.5rem; font-weight:700; }
  .stat-label { font-size:.76rem; color:var(--theme-foreground-muted); }

  /* Tabela */
  .table { width:100%; border-collapse:collapse; font-size:.9rem; }
  .table th { text-align:left; padding:.55rem .75rem; border-bottom:2px solid var(--theme-foreground-faint); color:var(--theme-foreground-muted); font-size:.78rem; text-transform:uppercase; letter-spacing:.04em; }
  .table td { padding:.6rem .75rem; border-bottom:1px solid var(--theme-foreground-faintest); vertical-align:middle; }
  .table tr.clickable:hover td { background:var(--theme-background-alt); cursor:pointer; }
  .table tr.detail-row td { padding:0; border-bottom:2px solid var(--theme-foreground-faint); }

  .badge { display:inline-block; padding:.18rem .55rem; border-radius:12px; font-size:.78rem; font-weight:600; }
  .badge-ativo   { background:var(--om-ok-bg); color:var(--om-ok-text); }
  .badge-inativo { background:var(--om-bad-bg); color:var(--om-bad-text); }

  .btn { padding:.45rem 1rem; border-radius:6px; font-size:.875rem; font-weight:600; cursor:pointer; border:none; text-decoration:none; display:inline-block; transition:opacity .15s; }
  .btn-primary { background:#1e293b; color:#fff; }
  .btn-primary:hover { opacity:.82; }
  .btn-sm { padding:.22rem .6rem; font-size:.8rem; border-radius:5px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); cursor:pointer; }
  .btn-sm:hover { background:var(--theme-background-alt); }
  .btn-sm:disabled { opacity:.4; cursor:not-allowed; }
  .empty-state { text-align:center; padding:2.5rem 0; color:var(--theme-foreground-muted); }

  /* Painel de detalhes inline */
  .detail-panel {
    padding:1rem 1.25rem 1.25rem;
    background:var(--theme-background-alt);
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:1rem 2rem;
  }
  .detail-section-title {
    font-size:.78rem; font-weight:700; text-transform:uppercase;
    letter-spacing:.05em; color:var(--theme-foreground-muted);
    margin-bottom:.5rem;
  }
  .detail-desc {
    grid-column: 1 / -1;
    font-size:.88rem;
    color:var(--theme-foreground-muted);
    font-style:italic;
  }
  /* Sequência de mapas */
  .seq-ol { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.3rem; }
  .seq-ol li { display:flex; align-items:center; gap:.55rem; font-size:.85rem; }
  .seq-num { display:inline-flex; align-items:center; justify-content:center; width:1.35rem; height:1.35rem; border-radius:50%; background:#1e293b; color:#fff; font-size:.72rem; font-weight:700; flex-shrink:0; }
  /* Preview thumbnail */
  .thumb { width:36px; height:36px; object-fit:cover; border-radius:4px; border:1px solid var(--theme-foreground-faintest); flex-shrink:0; }
  /* Alunos */
  .aluno-chips { display:flex; flex-wrap:wrap; gap:.35rem; }
  .aluno-chip { background:var(--theme-background); border:1px solid var(--theme-foreground-faintest); border-radius:20px; padding:.18rem .65rem; font-size:.82rem; }
  .no-data { font-size:.85rem; color:var(--theme-foreground-muted); font-style:italic; }

  /* chevron */
  .chevron { font-size:.75rem; color:var(--theme-foreground-muted); transition:transform .2s; display:inline-block; }
  .chevron.open { transform:rotate(90deg); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAtividades, fetchAtividade, toggleAtivoAtividade } from "../api.js";

const API_BASE = "http://127.0.0.1:5000/api";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

let atividades = [];
try {
  ({ atividades } = await fetchAtividades());
} catch (e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro ao carregar atividades: ${e.message}</div>`);
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const statTotal  = document.createElement("div");
statTotal.className = "stat-card";

const statAtivas = document.createElement("div");
statAtivas.className = "stat-card";

function atualizarStats() {
  statTotal.innerHTML  = `<div class="stat-value">${atividades.length}</div><div class="stat-label">Total</div>`;
  statAtivas.innerHTML = `<div class="stat-value" style="color:#166534">${atividades.filter(a=>a.ativo).length}</div><div class="stat-label">Ativas</div>`;
}
atualizarStats();

// ── Tabela ────────────────────────────────────────────────────────────────────
const tbody = document.createElement("tbody");

// Rastrea qual atividade está expandida e seu cache de detalhes
let expandidoId   = null;
const cacheDetalhes = {};

async function obterDetalhe(id) {
  if (cacheDetalhes[id]) return cacheDetalhes[id];
  const dados = await fetchAtividade(id);
  cacheDetalhes[id] = dados;
  return dados;
}

function criarPainelDetalhe(detalhe) {
  const panel = document.createElement("div");
  panel.className = "detail-panel";

  // Descrição (full width, só se existir)
  if (detalhe.descricao) {
    const desc = document.createElement("p");
    desc.className = "detail-desc";
    desc.textContent = detalhe.descricao;
    panel.append(desc);
  }

  // ── Coluna esquerda: sequência de mapas ────────────────────────────────────
  const colMapas = document.createElement("div");

  const titleMapas = document.createElement("p");
  titleMapas.className = "detail-section-title";
  titleMapas.textContent = `Sequência de mapas (${detalhe.mapas.length})`;
  colMapas.append(titleMapas);

  if (!detalhe.mapas.length) {
    const p = document.createElement("p");
    p.className = "no-data";
    p.textContent = "Nenhum mapa associado.";
    colMapas.append(p);
  } else {
    const ol = document.createElement("ol");
    ol.className = "seq-ol";
    for (const m of detalhe.mapas) {
      const li = document.createElement("li");

      const num = document.createElement("span");
      num.className   = "seq-num";
      num.textContent = m.ordem;

      // Preview thumbnail se existir
      const previewUrl = `${API_BASE}/treinos/mapas/${m.id_mapa}/preview`;
      const img = document.createElement("img");
      img.className = "thumb";
      img.src   = previewUrl;
      img.alt   = "";
      img.onerror = () => img.remove(); // se não tiver preview, esconde

      const nome = document.createElement("span");
      nome.textContent = m.nome_mapa;

      li.append(num, img, nome);
      ol.append(li);
    }
    colMapas.append(ol);
  }

  // ── Coluna direita: alunos ─────────────────────────────────────────────────
  const colAlunos = document.createElement("div");

  const titleAlunos = document.createElement("p");
  titleAlunos.className = "detail-section-title";
  titleAlunos.textContent = `Alunos atribuídos (${detalhe.alunos.length})`;
  colAlunos.append(titleAlunos);

  if (!detalhe.alunos.length) {
    const p = document.createElement("p");
    p.className = "no-data";
    p.textContent = "Nenhum aluno atribuído.";
    colAlunos.append(p);
  } else {
    const chips = document.createElement("div");
    chips.className = "aluno-chips";
    for (const a of detalhe.alunos) {
      const chip = document.createElement("span");
      chip.className   = "aluno-chip";
      chip.textContent = a.nome_completo;
      chips.append(chip);
    }
    colAlunos.append(chips);
  }

  panel.append(colMapas, colAlunos);
  return panel;
}

async function toggleDetalhe(id, detailTr, chevron) {
  if (expandidoId === id) {
    // Fechar
    detailTr.style.display = "none";
    detailTr.querySelector("td").replaceChildren();
    expandidoId = null;
    chevron.classList.remove("open");
    return;
  }

  // Fechar anterior se houver
  if (expandidoId !== null) {
    const anterior = tbody.querySelector(`tr[data-detail-for="${expandidoId}"]`);
    if (anterior) {
      anterior.style.display = "none";
      anterior.querySelector("td").replaceChildren();
    }
    const chevAnterior = tbody.querySelector(`tr[data-id="${expandidoId}"] .chevron`);
    if (chevAnterior) chevAnterior.classList.remove("open");
  }

  expandidoId = id;
  chevron.classList.add("open");
  detailTr.style.display = "";

  const td = detailTr.querySelector("td");
  td.textContent = "Carregando…";
  td.style.padding = ".75rem";

  try {
    const detalhe = await obterDetalhe(id);
    td.style.padding = "0";
    td.replaceChildren(criarPainelDetalhe(detalhe));
  } catch (e) {
    td.textContent = "Erro ao carregar detalhes: " + e.message;
    td.style.color = "#b91c1c";
  }
}

function renderTabela() {
  tbody.replaceChildren();
  expandidoId = null;

  if (!atividades.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.className = "empty-state";
    td.textContent = "Nenhuma atividade criada ainda.";
    tr.append(td); tbody.append(tr);
    return;
  }

  for (const a of atividades) {
    // ── linha principal ──────────────────────────────────────────────────────
    const tr = document.createElement("tr");
    tr.className = "clickable";
    tr.dataset.id = a.id_atividade;

    // Linha oculta de detalhe
    const detailTr = document.createElement("tr");
    detailTr.className = "detail-row";
    detailTr.dataset.detailFor = a.id_atividade;
    detailTr.style.display = "none";
    const detailTd = document.createElement("td");
    detailTd.colSpan = 6;
    detailTr.append(detailTd);

    // Chevron
    const chevron = document.createElement("span");
    chevron.className = "chevron";
    chevron.textContent = "▶";

    // Nome (clicável para expandir)
    const tdNome = document.createElement("td");
    tdNome.style.fontWeight = "600";
    tdNome.append(chevron, document.createTextNode(" " + a.nome));
    tr.append(tdNome);

    const tdMapas = document.createElement("td");
    tdMapas.style.cssText = "font-size:.82rem;color:var(--theme-foreground-muted)";
    tdMapas.textContent = `${a.total_mapas} mapa${a.total_mapas !== 1 ? "s" : ""}`;
    tr.append(tdMapas);

    const tdAlunos = document.createElement("td");
    tdAlunos.style.cssText = "font-size:.82rem;color:var(--theme-foreground-muted)";
    tdAlunos.textContent = `${a.total_alunos} aluno${a.total_alunos !== 1 ? "s" : ""}`;
    tr.append(tdAlunos);

    const tdData = document.createElement("td");
    tdData.style.cssText = "font-size:.82rem;color:var(--theme-foreground-muted)";
    tdData.textContent = a.data_criacao;
    tr.append(tdData);

    const tdBadge = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge " + (a.ativo ? "badge-ativo" : "badge-inativo");
    badge.textContent = a.ativo ? "Ativa" : "Inativa";
    tdBadge.append(badge);
    tr.append(tdBadge);

    const tdAcao = document.createElement("td");
    const btnToggle = document.createElement("button");
    btnToggle.className   = "btn-sm";
    btnToggle.textContent = a.ativo ? "Desativar" : "Ativar";
    btnToggle.addEventListener("click", async (e) => {
      e.stopPropagation(); // não abre o detalhe ao clicar no botão
      btnToggle.disabled = true;
      try {
        const res = await toggleAtivoAtividade(a.id_atividade);
        a.ativo = res.ativo;
        delete cacheDetalhes[a.id_atividade]; // invalida cache
        atualizarStats();
        renderTabela();
      } catch(err) { alert("Erro: " + err.message); btnToggle.disabled = false; }
    });
    tdAcao.append(btnToggle);
    tr.append(tdAcao);

    // Clicar na linha abre/fecha detalhe
    tr.addEventListener("click", () => toggleDetalhe(a.id_atividade, detailTr, chevron));

    tbody.append(tr, detailTr);
  }
}

renderTabela();

// ── Render final ──────────────────────────────────────────────────────────────
const statsBar = document.createElement("div");
statsBar.className = "stats-bar";
statsBar.append(statTotal, statAtivas);

const table = document.createElement("table");
table.className = "table";
const thead = document.createElement("thead");
thead.innerHTML = "<tr><th>Nome</th><th>Mapas</th><th>Alunos</th><th>Criada em</th><th>Status</th><th>Ação</th></tr>";
table.append(thead, tbody);

display(html`<div>
  <div class="page-header">
    <h1>Atividades</h1>
    <a class="btn btn-primary" href="/admin/criar-atividade">+ Nova Atividade</a>
  </div>
  ${statsBar}
  ${table}
</div>`);
```
