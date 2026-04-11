---
title: Detalhe da Sessão
toc: false
---

<style>
  .sessao-layout { display:grid; grid-template-columns:1fr 1fr; gap:1rem; align-items:start; margin-top:1rem; }
  @media(max-width:800px) { .sessao-layout { grid-template-columns:1fr; } }

  .painel { background:var(--theme-background); border:1px solid var(--theme-foreground-faintest); border-radius:12px; overflow:hidden; }
  .painel-titulo { font-size:.78rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--theme-foreground-muted); padding:.65rem 1rem; border-bottom:1px solid var(--theme-foreground-faintest); }
  .painel-corpo { padding:1rem; }

  .stat-row { display:grid; grid-template-columns:repeat(auto-fill, minmax(130px,1fr)); gap:.75rem; margin-bottom:1rem; }
  .stat-box { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.6rem .9rem; }
  .stat-val { font-size:1.5rem; font-weight:800; line-height:1.1; }
  .stat-lbl { font-size:.72rem; color:var(--theme-foreground-muted); margin-top:.1rem; }

  .badge { display:inline-block; font-size:.78rem; font-weight:700; padding:.2rem .6rem; border-radius:5px; }
  .badge-ok { background:var(--om-ok-bg); color:var(--om-ok-text); }
  .badge-no { background:var(--om-bad-bg); color:var(--om-bad-text); }

  .img-wrap { border-radius:8px; overflow:hidden; border:1px solid var(--theme-foreground-faintest); background:var(--theme-background-alt); display:flex; align-items:center; justify-content:center; min-height:180px; }
  .img-wrap img { width:100%; height:auto; display:block; }
  .img-placeholder { color:var(--theme-foreground-muted); font-size:.85rem; font-style:italic; padding:2rem; text-align:center; }

  .page-header { display:flex; align-items:center; gap:.75rem; margin-bottom:1.25rem; flex-wrap:wrap; }
  .btn-back { font-size:.82rem; padding:.3rem .75rem; border-radius:6px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); text-decoration:none; }
  .btn-back:hover { background:var(--theme-background-alt); }

  .info-table { width:100%; border-collapse:collapse; font-size:.88rem; }
  .info-table td { padding:.45rem 0; border-bottom:1px solid var(--theme-foreground-faintest); }
  .info-table tr:last-child td { border-bottom:none; }
  .info-table .lbl { color:var(--theme-foreground-muted); width:50%; }
  .info-table .val { font-weight:600; text-align:right; }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchSessao, fetchMetricas } from "../api.js";

requireAuth();
const headerLogout = document.getElementById("header-logout");
if (headerLogout) headerLogout.addEventListener("click", logout);

const params   = new URLSearchParams(location.search);
const id_log   = parseInt(params.get("id"));
const id_aluno = params.get("aluno");

const API_BASE = "http://127.0.0.1:5000/api";

if (!id_log) {
  display(html`<p style="color:#b91c1c">ID de sessão não informado.</p>`);
  throw new Error("sem id");
}

let sessao, metricas;
try {
  [sessao, metricas] = await Promise.all([
    fetchSessao(id_log),
    fetchMetricas(id_log).catch(() => null),
  ]);
} catch(e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px">Erro: ${e.message}</div>`);
  throw e;
}

function fmtTempo(s) {
  if (s == null) return "—";
  const m = Math.floor(s / 60), seg = Math.round(s % 60);
  return m > 0 ? `${m}m ${seg}s` : `${seg}s`;
}

const cleared  = sessao.cleared_map;
const voltar   = id_aluno ? `/visualizacao/sessoes?aluno=${id_aluno}` : `/visualizacao/alunos`;
const token    = sessionStorage.getItem("om_token");
const m        = metricas?.metricas ?? null;

// ── Badge resultado ───────────────────────────────────────────────────────
const badge = document.createElement("span");
badge.className = `badge ${cleared ? "badge-ok" : "badge-no"}`;
badge.textContent = cleared ? "Mapa concluído" : "Não concluído";

// ── Stats gerais ──────────────────────────────────────────────────────────
function makeStatBox(val, label, color) {
  const box = document.createElement("div"); box.className = "stat-box";
  const v = document.createElement("div"); v.className = "stat-val"; v.textContent = val;
  if (color) v.style.color = color;
  const l = document.createElement("div"); l.className = "stat-lbl"; l.textContent = label;
  box.append(v, l); return box;
}
const statRow = document.createElement("div"); statRow.className = "stat-row";
statRow.append(
  makeStatBox(fmtTempo(sessao.tempo_sessao), "Tempo de sessão"),
  makeStatBox(sessao.total_acoes ?? "—", "Ações"),
  makeStatBox(sessao.total_colisoes ?? "—", "Colisões", sessao.total_colisoes > 0 ? "#b91c1c" : null),
  makeStatBox(`${sessao.objetivos_concluidos ?? "—"}/${sessao.total_objetivos ?? "—"}`, "Objetivos"),
);

// ── Radar ─────────────────────────────────────────────────────────────────
function makeRadar(m) {
  const avg = (m.precisao + m.objetivos + m.fluidez) / 3;
  const cor = avg >= 60
    ? { stroke:"#2e7d32", fill:"rgba(46,125,50,.18)" }
    : avg >= 35
    ? { stroke:"#e6a817", fill:"rgba(230,168,23,.18)" }
    : { stroke:"#c0392b", fill:"rgba(192,57,43,.15)" };

  const cx = 130, cy = 130, R = 80;
  const eixos = [
    { angulo:-90, label:"Precisão",  valor:m.precisao  },
    { angulo: 30, label:"Objetivos", valor:m.objetivos },
    { angulo:150, label:"Fluidez",   valor:m.fluidez   },
  ];
  function pt(r, deg) {
    const rad = deg * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }
  let grid = "";
  for (const pct of [.25,.5,.75,1]) {
    const pts = eixos.map(e => pt(R*pct, e.angulo)).map(([x,y]) => `${x},${y}`).join(" ");
    grid += `<polygon points="${pts}" fill="none" stroke="rgba(128,128,128,.25)" stroke-width="${pct===1?1:.5}"/>`;
  }
  const axes = eixos.map(e => {
    const [x,y] = pt(R, e.angulo);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(128,128,128,.25)" stroke-width=".8"/>`;
  }).join("");
  const dataPts = eixos.map(e => pt(R * e.valor / 100, e.angulo)).map(([x,y]) => `${x},${y}`).join(" ");
  const polygon = `<polygon points="${dataPts}" fill="${cor.fill}" stroke="${cor.stroke}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const OFFSET = 28;
  const labels = eixos.map(e => {
    const [lx,ly] = pt(R + OFFSET, e.angulo);
    const [dx,dy] = pt(R * e.valor / 100, e.angulo);
    const anchor  = lx < cx - 5 ? "end" : lx > cx + 5 ? "start" : "middle";
    return `<circle cx="${dx}" cy="${dy}" r="4" fill="${cor.stroke}"/>
      <text x="${lx}" y="${ly-7}" font-size="11" fill="rgba(180,180,180,.8)" text-anchor="${anchor}" font-family="system-ui,sans-serif">${e.label}</text>
      <text x="${lx}" y="${ly+9}" font-size="13" font-weight="700" fill="${cor.stroke}" text-anchor="${anchor}" font-family="system-ui,sans-serif">${Math.round(e.valor)}%</text>`;
  }).join("");

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 260 260");
  svg.style.cssText = "width:100%;max-width:260px";
  svg.innerHTML = grid + axes + polygon + labels;
  return svg;
}

const painelRadar = document.createElement("div"); painelRadar.className = "painel";
const painelRadarTitulo = document.createElement("div"); painelRadarTitulo.className = "painel-titulo"; painelRadarTitulo.textContent = "Desempenho — Radar";
const painelRadarCorpo = document.createElement("div"); painelRadarCorpo.className = "painel-corpo"; painelRadarCorpo.style.cssText = "display:flex;justify-content:center;padding:1.5rem 1rem";
if (m) {
  painelRadarCorpo.append(makeRadar(m));
} else {
  painelRadarCorpo.innerHTML = `<p style="color:var(--theme-foreground-muted);font-style:italic;font-size:.85rem;margin:0">Métricas indisponíveis para esta sessão</p>`;
}
painelRadar.append(painelRadarTitulo, painelRadarCorpo);

// ── Minimap ───────────────────────────────────────────────────────────────
const painelMini = document.createElement("div"); painelMini.className = "painel";
const painelMiniTitulo = document.createElement("div"); painelMiniTitulo.className = "painel-titulo"; painelMiniTitulo.textContent = "Minimap da sessão";
const painelMiniCorpo = document.createElement("div"); painelMiniCorpo.className = "painel-corpo";
const miniWrap = document.createElement("div"); miniWrap.className = "img-wrap";
if (sessao.tem_minimap && sessao.caminho_minimap) {
  const img = document.createElement("img");
  img.src = `${API_BASE}/treinos/arquivos${sessao.caminho_minimap}?token=${token}`;
  img.alt = "Minimap";
  img.loading = "lazy";
  miniWrap.append(img);
} else {
  miniWrap.innerHTML = `<div class="img-placeholder">Minimap não disponível</div>`;
}
painelMiniCorpo.append(miniWrap);
painelMini.append(painelMiniTitulo, painelMiniCorpo);

// ── Render 3D ─────────────────────────────────────────────────────────────
const painelRender = document.createElement("div"); painelRender.className = "painel";
const painelRenderTitulo = document.createElement("div"); painelRenderTitulo.className = "painel-titulo"; painelRenderTitulo.textContent = "Preview 3D do mapa";
const painelRenderCorpo = document.createElement("div"); painelRenderCorpo.className = "painel-corpo";
const renderWrap = document.createElement("div"); renderWrap.className = "img-wrap";
if (sessao.render_3d) {
  const img = document.createElement("img");
  img.src = `${API_BASE}/treinos/mapas/${sessao.id_mapa}/render3d?token=${token}`;
  img.alt = "Render 3D";
  img.loading = "lazy";
  renderWrap.append(img);
} else {
  renderWrap.innerHTML = `<div class="img-placeholder">Render 3D não disponível</div>`;
}
painelRenderCorpo.append(renderWrap);
painelRender.append(painelRenderTitulo, painelRenderCorpo);

// ── Informações gerais ────────────────────────────────────────────────────
const painelInfo = document.createElement("div"); painelInfo.className = "painel";
const painelInfoTitulo = document.createElement("div"); painelInfoTitulo.className = "painel-titulo"; painelInfoTitulo.textContent = "Informações gerais";
const painelInfoCorpo = document.createElement("div"); painelInfoCorpo.className = "painel-corpo";

function infoRow(label, value, color) {
  const tr  = document.createElement("tr");
  const tdL = document.createElement("td"); tdL.className = "lbl"; tdL.textContent = label;
  const tdV = document.createElement("td"); tdV.className = "val";
  if (value instanceof Element) tdV.append(value);
  else tdV.textContent = value ?? "—";
  if (color) tdV.style.color = color;
  tr.append(tdL, tdV);
  return tr;
}

const table = document.createElement("table"); table.className = "info-table";
table.append(
  infoRow("Mapa",        sessao.nome_mapa),
  infoRow("Data",        sessao.data),
  infoRow("Tempo total", fmtTempo(sessao.tempo_sessao)),
  infoRow("Ações",       sessao.total_acoes ?? "—"),
  infoRow("Colisões",    sessao.total_colisoes ?? "—", sessao.total_colisoes > 0 ? "#b91c1c" : null),
  infoRow("Objetivos",   `${sessao.objetivos_concluidos ?? "—"} / ${sessao.total_objetivos ?? "—"}`),
);
if (m) {
  table.append(
    infoRow("Precisão",  `${Math.round(m.precisao)}%`),
    infoRow("Objetivos %", `${Math.round(m.objetivos)}%`),
    infoRow("Fluidez",   `${Math.round(m.fluidez)}%`),
  );
}
const badgeClone = badge.cloneNode(true);
table.append(infoRow("Resultado", badgeClone));
painelInfoCorpo.append(table);
painelInfo.append(painelInfoTitulo, painelInfoCorpo);

// ── Layout ────────────────────────────────────────────────────────────────
const layout = document.createElement("div"); layout.className = "sessao-layout";
layout.append(painelMini, painelRender, painelRadar, painelInfo);

display(html`<div>
  <div class="page-header">
    <a class="btn-back" href="${voltar}">← Voltar</a>
    <h1 style="margin:0;font-size:1.3rem">Sessão #${id_log} — ${sessao.nome_mapa}</h1>
    ${badge}
    <span style="margin-left:auto;font-size:.8rem;color:var(--theme-foreground-muted)">${sessao.data}</span>
  </div>
  ${statRow}
  ${layout}
</div>`);
```
