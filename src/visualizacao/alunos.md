---
title: Lista de Alunos
toc: false
---

<style>
  /* ── Layout ────────────────────────────────── */
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; flex-wrap:wrap; gap:.75rem; }
  .page-header h1 { margin:0; font-size:1.5rem; }

  /* ── Stats bar ──────────────────────────────── */
  .stats-bar { display:flex; gap:1rem; margin-bottom:1.25rem; flex-wrap:wrap; }
  .stat-card { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.6rem 1rem; min-width:90px; }
  .stat-value { font-size:1.4rem; font-weight:700; }
  .stat-label { font-size:.74rem; color:var(--theme-foreground-muted); }

  /* ── Filtros ────────────────────────────────── */
  .filters { display:flex; gap:.65rem; margin-bottom:1.25rem; align-items:center; flex-wrap:wrap; }
  .filter-label { font-size:.875rem; font-weight:600; color:var(--theme-foreground-muted); }
  .filter-btn { padding:.28rem .8rem; border-radius:20px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.82rem; cursor:pointer; }
  .filter-btn.active { background:var(--theme-foreground); color:var(--theme-background); border-color:var(--theme-foreground); }
  .search-input { padding:.38rem .7rem; border:1px solid var(--theme-foreground-faint); border-radius:6px; background:var(--theme-background); color:var(--theme-foreground); font-size:.88rem; outline:none; min-width:200px; }
  .search-input:focus { border-color:#4a90e2; }

  /* ── Grid de cards ──────────────────────────── */
  .alunos-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:1rem; }

  /* ── Card ───────────────────────────────────── */
  .aluno-card { border:1px solid var(--theme-foreground-faintest); border-radius:12px; overflow:hidden; background:var(--theme-background); transition:box-shadow .15s, transform .15s; }
  .aluno-card:hover { box-shadow:0 4px 16px rgba(0,0,0,.1); transform:translateY(-2px); }

  .card-header { padding:.85rem 1rem .75rem; border-bottom:1px solid var(--theme-foreground-faintest); display:flex; gap:.75rem; align-items:flex-start; }
  .avatar { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1rem; color:#fff; flex-shrink:0; }
  .card-info { flex:1; min-width:0; }
  .card-name { font-weight:700; font-size:.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .card-meta { font-size:.78rem; color:var(--theme-foreground-muted); line-height:1.5; margin-top:.1rem; }
  .card-meta span { display:block; }
  .badge-finalizada { display:inline-block; font-size:.7rem; font-weight:700; padding:.1rem .45rem; border-radius:4px; margin-top:.25rem; }
  .badge-sim { background:#dcfce7; color:#166534; }
  .badge-nao { background:#fee2e2; color:#991b1b; }
  .badge-sd  { background:var(--theme-background-alt); color:var(--theme-foreground-muted); border:1px solid var(--theme-foreground-faintest); }

  /* ── Radar ──────────────────────────────────── */
  .card-radar { padding:.75rem 1rem 1rem; display:flex; flex-direction:column; align-items:center; }
  .radar-wrap { position:relative; width:210px; height:210px; }
  .radar-wrap svg { width:100%; height:100%; }

  /* ── Link para perfil ───────────────────────── */
  .card-footer { padding:.5rem 1rem .75rem; display:flex; justify-content:flex-end; gap:.5rem; }
  .btn-ver { font-size:.78rem; font-weight:600; padding:.28rem .75rem; border-radius:6px; background:var(--theme-foreground); color:var(--theme-background); text-decoration:none; }
  .btn-sessao { font-size:.78rem; font-weight:600; padding:.28rem .75rem; border-radius:6px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); text-decoration:none; cursor:pointer; }
  .btn-ver:hover { opacity:.82; }

  /* ── Header clicável ─────────────────────────── */
  .card-header-link {
    display:flex; gap:.75rem; align-items:flex-start;
    flex:1; text-decoration:none; color:inherit; cursor:pointer;
  }
  .card-header-link:hover .card-name { text-decoration:underline; color:#4a90e2; }
  .card-header-link:hover .avatar { opacity:.88; }

  .empty-state { text-align:center; padding:3rem 0; color:var(--theme-foreground-muted); grid-column:1/-1; }

  /* ── Radar clicável ─────────────────────────── */
  .radar-clickable { cursor:pointer; }
  .radar-clickable:hover svg { filter:drop-shadow(0 0 6px rgba(255,255,255,.15)); }

  /* ── Modal overlay ──────────────────────────── */
  .modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.6); backdrop-filter:blur(3px);
    display:flex; align-items:center; justify-content:center;
    z-index:9999; padding:1rem;
    animation:fadeIn .18s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .modal-box {
    background:var(--theme-background);
    border:1px solid var(--theme-foreground-faint);
    border-radius:16px; overflow:hidden;
    width:100%; max-width:480px;
    box-shadow:0 24px 60px rgba(0,0,0,.4);
    animation:slideUp .2s ease;
  }
  @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }

  .modal-header {
    display:flex; align-items:center; gap:1rem;
    padding:1.25rem 1.4rem 1rem;
    border-bottom:3px solid var(--modal-accent, #888);
  }
  .modal-avatar {
    width:52px; height:52px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-weight:800; font-size:1.2rem; color:#fff; flex-shrink:0;
  }
  .modal-name  { font-size:1.2rem; font-weight:700; margin-bottom:.1rem; }
  .modal-meta  { font-size:.82rem; color:var(--theme-foreground-muted); line-height:1.6; }
  .modal-close {
    margin-left:auto; background:none; border:none; cursor:pointer;
    color:var(--theme-foreground-muted); font-size:1.4rem; line-height:1;
    padding:.2rem .4rem; border-radius:4px;
  }
  .modal-close:hover { background:var(--theme-background-alt); color:var(--theme-foreground); }

  .modal-radar {
    display:flex; justify-content:center; padding:1rem 1rem .5rem;
    background:var(--theme-background-alt);
  }
  .modal-radar .radar-wrap { width:280px; height:280px; }

  .modal-badges {
    display:flex; gap:.75rem; padding:.85rem 1.4rem;
    border-top:1px solid var(--theme-foreground-faintest);
    flex-wrap:wrap; align-items:center;
  }
  .modal-badge-label { font-size:.75rem; color:var(--theme-foreground-muted); font-weight:600; }

  .modal-footer {
    padding:.85rem 1.4rem 1.1rem;
    display:flex; justify-content:space-between; align-items:center;
    border-top:1px solid var(--theme-foreground-faintest);
  }
  .btn-primary-modal {
    padding:.5rem 1.1rem; border-radius:8px; font-size:.9rem; font-weight:700;
    background:var(--theme-foreground); color:var(--theme-background);
    text-decoration:none; border:none; cursor:pointer;
  }
  .btn-primary-modal:hover { opacity:.82; }
  .btn-ghost-modal {
    padding:.5rem 1rem; border-radius:8px; font-size:.9rem; font-weight:600;
    border:1px solid var(--theme-foreground-faint); background:transparent;
    color:var(--theme-foreground); cursor:pointer;
  }
  .btn-ghost-modal:hover { background:var(--theme-background-alt); }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAlunos, fetchSessoes, fetchMetricasAluno } from "../api.js";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

// ── Paleta de avatares ────────────────────────────────────────────────────
const AVATAR_COLORS = ["#e07b54","#4a90d9","#5ba85b","#c9a227","#9b59b6","#2eaaa8"];
function avatarColor(id) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }
function initials(nome) {
  const p = nome.trim().split(/\s+/);
  return p.length >= 2 ? (p[0][0] + p[p.length-1][0]).toUpperCase() : p[0].slice(0,2).toUpperCase();
}

// As métricas vêm diretamente da rota GET /analises/sessao/:id/metricas
// Precisão  = 100 − proporção de colisões (0–100%)
// Objetivos = metas alcançadas / metas totais × 100
// Fluidez   = distância ótima / distância percorrida × 100

// ── Cor do radar por desempenho médio ─────────────────────────────────────
function radarColor(m) {
  const avg = (m.precisao + m.objetivos + m.fluidez) / 3;
  if (avg >= 60) return { stroke:"#2e7d32", fill:"rgba(46,125,50,.18)" };
  if (avg >= 35) return { stroke:"#e6a817", fill:"rgba(230,168,23,.18)" };
  return { stroke:"#c0392b", fill:"rgba(192,57,43,.15)" };
}

// ── SVG Radar ─────────────────────────────────────────────────────────────
function makeRadar(m, color) {
  // Centro e raio da grade — viewBox maior para acomodar labels nos vértices
  const cx = 105, cy = 105, R = 62;

  // 3 eixos: topo=Precisão, inferior-direita=Objetivos, inferior-esquerda=Fluidez
  const eixos = [
    { angulo: -90, label: "Precisão",  valor: m.precisao  },
    { angulo:  30, label: "Objetivos", valor: m.objetivos },
    { angulo: 150, label: "Fluidez",   valor: m.fluidez   },
  ];

  function pt(r, deg) {
    const rad = deg * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  // Grade (25 / 50 / 75 / 100%)
  let grid = "";
  for (const pct of [0.25, 0.5, 0.75, 1]) {
    const pts = eixos.map(e => pt(R * pct, e.angulo)).map(([x,y]) => `${x},${y}`).join(" ");
    grid += `<polygon points="${pts}" fill="none" stroke="rgba(128,128,128,.25)" stroke-width="${pct === 1 ? 1 : .5}"/>`;
  }

  // Eixos
  const axes = eixos.map(e => {
    const [x, y] = pt(R, e.angulo);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(128,128,128,.25)" stroke-width=".8"/>`;
  }).join("");

  // Polígono de dados
  const dataPts = eixos.map(e => pt(R * e.valor / 100, e.angulo)).map(([x,y]) => `${x},${y}`).join(" ");
  const polygon = `<polygon points="${dataPts}" fill="${color.fill}" stroke="${color.stroke}" stroke-width="2" stroke-linejoin="round"/>`;

  // Pontos + labels no vértice de cada eixo (no R máximo)
  // O texto fica um pouco além do vértice da grade (offset 22px na direção do eixo)
  const LABEL_OFFSET = 24;
  const labels = eixos.map(e => {
    const [lx, ly] = pt(R + LABEL_OFFSET, e.angulo);
    const [dx, dy] = pt(R * e.valor / 100, e.angulo);

    // Ancoragem horizontal conforme posição
    const anchor = lx < cx - 5 ? "end" : lx > cx + 5 ? "start" : "middle";

    // Linha guia do vértice da grade até o label (sutil)
    const [gx, gy] = pt(R, e.angulo);
    const guide = `<line x1="${gx}" y1="${gy}" x2="${lx}" y2="${ly}" stroke="rgba(128,128,128,.18)" stroke-width=".6"/>`;

    return `
      ${guide}
      <circle cx="${dx}" cy="${dy}" r="3.5" fill="${color.stroke}"/>
      <text x="${lx}" y="${ly - 6}" font-size="9.5" fill="rgba(180,180,180,.8)"
            text-anchor="${anchor}" font-family="system-ui,sans-serif">${e.label}</text>
      <text x="${lx}" y="${ly + 8}" font-size="11" font-weight="700" fill="${color.stroke}"
            text-anchor="${anchor}" font-family="system-ui,sans-serif">${Math.round(e.valor)}%</text>
    `;
  }).join("");

  return `<svg viewBox="0 0 210 210" xmlns="http://www.w3.org/2000/svg">
    ${grid}${axes}${polygon}${labels}
  </svg>`;
}

// ── Carregar dados ────────────────────────────────────────────────────────
let todosAlunos = [];
try {
  ({ alunos: todosAlunos } = await fetchAlunos());
} catch(e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px">Erro: ${e.message}</div>`);
}

// Buscar última sessão + análises de cada aluno em paralelo
const alunosMeta = await Promise.all(todosAlunos.map(async a => {
  try {
    const [{ sessoes }, respMetricas] = await Promise.all([
      fetchSessoes(a.id_aluno),
      fetchMetricasAluno(a.id_aluno).catch(() => null),
    ]);
    const ultima      = sessoes?.[0] ?? null;
    const totalSessoes = sessoes?.length ?? 0;
    const metricas    = respMetricas?.metricas ?? null;
    const finalizada  = respMetricas?.atividade_finalizada ?? null;
    return { ...a, ultimaSessao: ultima, totalSessoes, metricas, finalizada };
  } catch {
    return { ...a, ultimaSessao: null, totalSessoes: 0, metricas: null, finalizada: null };
  }
}));

// ── Modal ─────────────────────────────────────────────────────────────────
function abrirModal(a) {
  const sessao   = a.ultimaSessao;
  const metricas = a.metricas;
  const cor      = metricas ? radarColor(metricas) : { stroke:"#aaa", fill:"rgba(180,180,180,.12)" };
  const fin      = a.finalizada === true ? "SIM" : a.finalizada === false ? "NÃO" : "—";

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  // Fechar ao clicar fora
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", esc); }
  });

  // Médias para exibição no rodapé do modal
  const media = metricas
    ? Math.round((metricas.precisao + metricas.objetivos + metricas.fluidez) / 3)
    : null;

  const badgeFin = fin === "SIM"
    ? `<span class="badge-finalizada badge-sim">Atividade Finalizada: SIM</span>`
    : fin === "NÃO"
    ? `<span class="badge-finalizada badge-nao">Atividade Finalizada: NÃO</span>`
    : `<span class="badge-finalizada badge-sd">Sem sessão</span>`;

  const radarGrande = metricas
    ? `<div class="radar-wrap">${makeRadar(metricas, cor)}</div>`
    : `<div style="height:200px;display:flex;align-items:center;justify-content:center;
        color:var(--theme-foreground-muted);font-size:.9rem;font-style:italic">Sem dados de análise</div>`;

  overlay.innerHTML = `
    <div class="modal-box" style="--modal-accent:${cor.stroke}">
      <div class="modal-header" style="border-bottom-color:${cor.stroke}">
        <div class="modal-avatar" style="background:${avatarColor(a.id_aluno)}">${initials(a.nome_completo)}</div>
        <div>
          <div class="modal-name">${a.nome_completo}</div>
          <div class="modal-meta">
            ${a.escolaridade ? a.escolaridade + " · " : ""}${a.idade ? a.idade + " anos" : ""}
          </div>
        </div>
        <button class="modal-close" title="Fechar">×</button>
      </div>

      <div class="modal-radar">${radarGrande}</div>

      <div class="modal-badges">
        <span class="modal-badge-label">Última sessão:</span>
        <span style="font-size:.82rem">Mapa: <strong>${sessao?.nome_mapa ?? "—"}</strong></span>
        <span style="font-size:.82rem">Sessões jogadas: <strong>${a.totalSessoes}</strong></span>
        ${badgeFin}
        ${media !== null ? `<span style="margin-left:auto;font-size:.82rem;color:${cor.stroke};font-weight:700">Média: ${media}%</span>` : ""}
      </div>

      <div class="modal-footer">
        <button class="btn-ghost-modal" id="modal-fechar">Fechar</button>
        <a class="btn-primary-modal" href="/visualizacao/perfil-aluno?id=${a.id_aluno}">Ver perfil completo →</a>
      </div>
    </div>`;

  overlay.querySelector(".modal-close").addEventListener("click", () => overlay.remove());
  overlay.querySelector("#modal-fechar").addEventListener("click", () => overlay.remove());
  document.body.append(overlay);
}

// ── Estado UI ─────────────────────────────────────────────────────────────
let filtro = "ativo";
let busca  = "";

// Stats
const statTotal   = document.createElement("div"); statTotal.className  = "stat-card";
const statAtivos  = document.createElement("div"); statAtivos.className = "stat-card";
const statComDados = document.createElement("div"); statComDados.className = "stat-card";

function atualizarStats() {
  statTotal.innerHTML    = `<div class="stat-value">${todosAlunos.length}</div><div class="stat-label">Total</div>`;
  statAtivos.innerHTML   = `<div class="stat-value" style="color:#166534">${todosAlunos.filter(a=>a.ativo).length}</div><div class="stat-label">Ativos</div>`;
  const comSessao = alunosMeta.filter(a => a.ultimaSessao).length;
  statComDados.innerHTML = `<div class="stat-value" style="color:#1d4ed8">${comSessao}</div><div class="stat-label">Com sessões</div>`;
}
atualizarStats();

// Filtros
const searchInput = document.createElement("input");
searchInput.type = "search"; searchInput.className = "search-input";
searchInput.placeholder = "Buscar por nome…";
searchInput.addEventListener("input", () => { busca = searchInput.value; renderGrid(); });

const btnAtivos   = document.createElement("button"); btnAtivos.className = "filter-btn active"; btnAtivos.textContent = "Ativos";
const btnTodos    = document.createElement("button"); btnTodos.className  = "filter-btn";        btnTodos.textContent  = "Todos";
const btnInativos = document.createElement("button"); btnInativos.className = "filter-btn";      btnInativos.textContent = "Inativos";

function setFiltro(f) {
  filtro = f;
  [btnAtivos, btnTodos, btnInativos].forEach(b => b.classList.remove("active"));
  (f === "ativo" ? btnAtivos : f === "todos" ? btnTodos : btnInativos).classList.add("active");
  renderGrid();
}
btnAtivos.addEventListener("click",   () => setFiltro("ativo"));
btnTodos.addEventListener("click",    () => setFiltro("todos"));
btnInativos.addEventListener("click", () => setFiltro("inativo"));

// ── Grid ──────────────────────────────────────────────────────────────────
const grid = document.createElement("div");
grid.className = "alunos-grid";

function renderGrid() {
  grid.replaceChildren();
  const q = busca.toLowerCase();
  const lista = alunosMeta.filter(a => {
    const ok = filtro === "todos" ? true : filtro === "ativo" ? a.ativo : !a.ativo;
    return ok && (!q || a.nome_completo.toLowerCase().includes(q));
  });

  if (!lista.length) {
    const p = document.createElement("p");
    p.className = "empty-state"; p.textContent = "Nenhum aluno encontrado.";
    grid.append(p); return;
  }

  for (const a of lista) {
    const sessao   = a.ultimaSessao;
    const metricas = a.metricas;
    const cor      = metricas ? radarColor(metricas) : { stroke:"#aaa", fill:"rgba(180,180,180,.12)" };

    // Badge atividade finalizada
    let badgeHTML = `<span class="badge-finalizada badge-sd">Sem sessão</span>`;
    if (sessao) {
      const fin = a.finalizada === true ? "SIM" : a.finalizada === false ? "NÃO" : "—";
      badgeHTML = `<span class="badge-finalizada ${fin==="SIM"?"badge-sim":fin==="NÃO"?"badge-nao":"badge-sd"}">Atividade Finalizada: ${fin}</span>`;
    }

    const card = document.createElement("div");
    card.className = "aluno-card";
    card.style.borderTop = `3px solid ${cor.stroke}`;

    // Header
    const header = document.createElement("div");
    header.className = "card-header";
    header.innerHTML = `
      <a class="card-header-link" href="/visualizacao/perfil-aluno?id=${a.id_aluno}">
        <div class="avatar" style="background:${avatarColor(a.id_aluno)}">${initials(a.nome_completo)}</div>
        <div class="card-info">
          <div class="card-name">${a.nome_completo}</div>
          <div class="card-meta">
            <span>Último mapa: ${sessao?.nome_mapa ?? "—"}</span>
            <span>Sessões jogadas: ${a.totalSessoes}</span>
          </div>
          ${badgeHTML}
        </div>
      </a>`;

    // Radar
    const radarWrap = document.createElement("div");
    radarWrap.className = "card-radar";

    if (metricas) {
      const radarClickable = document.createElement("div");
      radarClickable.className = "radar-wrap radar-clickable";
      radarClickable.title = "Clique para ampliar";
      radarClickable.innerHTML = makeRadar(metricas, cor);
      radarClickable.addEventListener("click", () => abrirModal(a));
      radarWrap.append(radarClickable);
    } else {
      radarWrap.innerHTML = `<div style="height:120px;display:flex;align-items:center;justify-content:center;color:var(--theme-foreground-muted);font-size:.82rem;font-style:italic">Sem dados de análise</div>`;
    }

    // Footer
    const footer = document.createElement("div");
    footer.className = "card-footer";
    const sessaoHref = a.totalSessoes > 0
      ? `/visualizacao/sessoes?aluno=${a.id_aluno}`
      : null;
    footer.innerHTML = `
      ${sessaoHref ? `<a class="btn-sessao" href="${sessaoHref}">Ver sessões (${a.totalSessoes})</a>` : `<span class="btn-sessao" style="opacity:.4;cursor:default">Sem sessões</span>`}
      <a class="btn-ver" href="/visualizacao/perfil-aluno?id=${a.id_aluno}">Ver perfil →</a>`;

    card.append(header, radarWrap, footer);
    grid.append(card);
  }
}

renderGrid();

// ── Render final ──────────────────────────────────────────────────────────
const statsBar = document.createElement("div"); statsBar.className = "stats-bar";
statsBar.append(statTotal, statAtivos, statComDados);

const filters = document.createElement("div"); filters.className = "filters";
const lbl = document.createElement("span"); lbl.className = "filter-label"; lbl.textContent = "Mostrar:";
filters.append(lbl, btnAtivos, btnTodos, btnInativos, searchInput);

display(html`<div>
  <div class="page-header"><h1>Alunos</h1></div>
  ${statsBar}
  ${filters}
  ${grid}
</div>`);
```
