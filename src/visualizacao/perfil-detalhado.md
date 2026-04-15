---
title: Análise da Atividade
toc: false
---

<style>
  .back-link { font-size:.875rem; color:var(--theme-foreground-muted); text-decoration:none; display:inline-flex; align-items:center; gap:.35rem; margin-bottom:1.25rem; }
  .back-link:hover { color:var(--theme-foreground); }
  .session-title { font-size:1.4rem; font-weight:700; margin:0 0 .75rem; }
  .sessoes-info-table { width:100%; border-collapse:collapse; font-size:.82rem; margin-bottom:1.75rem; }
  .sessoes-info-table th { text-align:left; padding:.4rem .6rem; border-bottom:2px solid var(--theme-foreground-faint); color:var(--theme-foreground-muted); font-weight:600; font-size:.75rem; text-transform:uppercase; letter-spacing:.04em; }
  .sessoes-info-table td { padding:.4rem .6rem; border-bottom:1px solid var(--theme-foreground-faintest); vertical-align:middle; }
  .sessoes-info-table tr.atual td { background:var(--theme-background-alt); font-weight:600; }
  .badge-sm { display:inline-block; padding:.1rem .45rem; border-radius:4px; font-size:.72rem; font-weight:700; }
  .badge-ok  { background:var(--om-ok-bg);  color:var(--om-ok-text); }
  .badge-no  { background:var(--om-bad-bg); color:var(--om-bad-text); }

  /* Barra de cobertura */
  .coverage-bar { display:flex; align-items:center; gap:.75rem; margin-bottom:1.5rem; }
  .coverage-label { font-size:.82rem; color:var(--theme-foreground-muted); white-space:nowrap; }
  .bar-track { flex:1; height:10px; background:var(--theme-foreground-faintest); border-radius:5px; overflow:hidden; }
  .bar-fill  { height:100%; border-radius:5px; background:var(--om-accent); }
  .coverage-pct { font-size:.82rem; font-weight:700; white-space:nowrap; min-width:2.5rem; text-align:right; }

  /* Cards de análise */
  .analise-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.1rem; margin-bottom:2rem; }
  .analise-col { display:flex; flex-direction:column; gap:1.1rem; }
  .analise-card { border:1px solid var(--theme-foreground-faintest); border-radius:10px; overflow:hidden; }
  .analise-card-header { display:flex; align-items:center; justify-content:space-between; padding:.65rem 1rem; background:var(--theme-background-alt); border-bottom:1px solid var(--theme-foreground-faintest); }
  .analise-card-title { font-size:.875rem; font-weight:700; }
  .badge-ok      { background:var(--om-ok-bg); color:var(--om-ok-text); padding:.15rem .5rem; border-radius:10px; font-size:.75rem; font-weight:600; }
  .badge-ausente { background:#f3f4f6; color:#6b7280; padding:.15rem .5rem; border-radius:10px; font-size:.75rem; font-weight:600; }
  .analise-card-body { padding:.85rem 1rem; font-size:.875rem; }
  .analise-field { display:flex; justify-content:space-between; align-items:baseline; padding:.28rem 0; border-bottom:1px solid var(--theme-foreground-faintest); gap:1rem; }
  .analise-field:last-child { border-bottom:none; }
  .field-label { color:var(--theme-foreground-muted); font-size:.82rem; flex-shrink:0; }
  .field-value { font-weight:600; text-align:right; word-break:break-all; }
  .no-data-card { color:var(--theme-foreground-muted); font-style:italic; font-size:.85rem; padding:.3rem 0; }

  /* Navegação entre sessões */

  .section-title { font-size:.82rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--theme-foreground-muted); margin-bottom:.75rem; }

</style>

```js
import { requireAuth, logout } from "../auth.js";
const mapasData = await FileAttachment("../data/mapas.json").json().catch(() => []);
import { fetchAluno, fetchSessoes, fetchSessao, fetchAnalises, fetchMetricas, fetchAtividades, fetchAtividade } from "../api.js";
import * as Plot from "npm:@observablehq/plot";
import { parseMapaXML }   from "../lib/mapa/parser.js";
import { mapaParaGeoJSON } from "../lib/mapa/geojson.js";
import {
  graficoLateralidade,
  graficoTrafego,
  graficoGiros,
  graficoGirosTreemap,
  graficoComparacao,
  graficoEvolucaoLongitudinal,
  graficoEficienciaRota,
} from "../lib/sessao/detalhamento.js";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

const params   = new URLSearchParams(window.location.search);
const idAluno  = params.get("aluno") ? parseInt(params.get("aluno")) : null;
const nomeMapa = params.get("mapa")  ?? null;

if (!idAluno || !nomeMapa) {
  display(html`<div style="padding:1.5rem;background:#fee2e2;border-radius:8px;color:#b91c1c;">
    <strong>Atividade não especificada.</strong>
    <p style="margin:.5rem 0 0;font-size:.875rem;">Acesse esta página a partir do perfil do aluno. Redirecionando…</p>
  </div>`);
  setTimeout(() => { window.location.href = "/visualizacao/alunos"; }, 2500);
  throw new Error("parâmetros ausentes");
}

let aluno = null;
let sessoes = [];
try {
  [aluno, { sessoes }] = await Promise.all([
    fetchAluno(idAluno),
    fetchSessoes(idAluno),
  ]);
} catch (e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro: ${e.message}</div>`);
  throw e;
}

const nomesMapas = new Set([nomeMapa]);

// Buscar nome da atividade a partir do mapa
let nomeAtividade = nomeMapa;
try {
  const res = await fetchAtividades();
  const lista = Array.isArray(res) ? res : (res.atividades ?? []);
  const detalhes = await Promise.all(lista.map(a => fetchAtividade(a.id_atividade).catch(() => null)));
  const at = detalhes.find(d =>
    d && (d.mapas ?? []).some(m =>
      m.nome_mapa === nomeMapa || m.nome === nomeMapa || m.nomeAmigavel === nomeMapa
    )
  );
  if (at?.nome) nomeAtividade = at.nome;
} catch(e) { console.warn("fetchAtividades falhou:", e); }

// Todas as sessões da atividade ordenadas desc
const sessoesAtividade = sessoes
  .filter(s => nomesMapas.has(s.nome_mapa))
  .sort((a, b) => b.id_log - a.id_log);

// Agrupar sessões por mapa
const mapasSessoes = new Map(); // nome_mapa → [sessao]
for (const s of sessoesAtividade) {
  if (!mapasSessoes.has(s.nome_mapa)) mapasSessoes.set(s.nome_mapa, []);
  mapasSessoes.get(s.nome_mapa).push(s);
}

const sessaoRef = sessoesAtividade[0] ?? null;
const idLog     = sessaoRef?.id_log ?? null;

// Buscar análises de todas as sessões da atividade
const todasAnalises = await Promise.all(
  sessoesAtividade.map(s =>
    fetchAnalises(s.id_log)
      .then(r => r.analises ?? {})
      .catch(() => ({}))
  )
);

// Para compat com código legado (cards de análise usam a mais recente)
const analises = todasAnalises[0] ?? {};

// Por cada mapa: carregar logs, métricas e XML
async function carregarXML(sessaoLog) {
  const caminhoXml = sessaoLog?.nome_arquivo_xml ?? null;
  if (!caminhoXml) return null;
  try {
    const token  = sessionStorage.getItem("om_token");
    const partes = caminhoXml.replace(/^\//, "").split("/");
    const pasta  = partes[0], arquivo = partes.slice(1).join("/");
    const resp = await fetch(`http://127.0.0.1:5000/api/treinos/arquivos/${pasta}/${arquivo}?token=${token}`);
    if (resp.ok) return mapaParaGeoJSON(parseMapaXML(await resp.text()));
  } catch(e) { console.warn("falha ao carregar XML:", e); }
  return null;
}

// Estrutura por mapa: { nome, sessoesComLog, camadas, metricas, idLogRef }
const gruposPorMapa = await Promise.all(
  [...mapasSessoes.entries()].map(async ([nome, sessoesDoGrupo]) => {
    const sessoesSlice = sessoesDoGrupo.slice(0, 15);
    const refSessao    = sessoesSlice[0];

    const [sessaoLogRef, sessoesComLogRaw, metricasGrupo] = await Promise.all([
      fetchSessao(refSessao.id_log).catch(() => null),
      Promise.all(sessoesSlice.map(s =>
        fetchSessao(s.id_log)
          .then(r => ({ sessao: s, dadosLog: r.dados_log ?? null }))
          .catch(() => ({ sessao: s, dadosLog: null }))
      )),
      Promise.all(sessoesDoGrupo.map(s =>
        fetchMetricas(s.id_log)
          .then(r => ({ sessao: s, metricas: r.metricas ?? null }))
          .catch(() => ({ sessao: s, metricas: null }))
      )),
    ]);

    const camadas = await carregarXML(sessaoLogRef);
    const sessoesComLog = sessoesComLogRaw
      .filter(s => s.dadosLog)
      .sort((a, b) => a.sessao.id_log - b.sessao.id_log);

    return { nome, sessoesComLog, camadas, metricas: metricasGrupo, idLogRef: refSessao.id_log };
  })
);

// Para o gráfico de evolução: sessões da atividade com métricas
const sessoesComMetricas = await Promise.all(
  sessoesAtividade.slice(0, 20).map(s =>
    fetchMetricas(s.id_log)
      .then(r => ({ sessao: s, metricas: r.metricas ?? null }))
      .catch(() => ({ sessao: s, metricas: null }))
  )
);

// Compat: variáveis legadas usadas abaixo nos gráficos de cobertura
const sessoesDoMapa        = sessoesAtividade;
const sessoesComLog        = gruposPorMapa.flatMap(g => g.sessoesComLog);
const sessoesDoMapaComMetricas = gruposPorMapa.flatMap(g => g.metricas);
const camadas              = gruposPorMapa[0]?.camadas ?? null;
const dadosLog             = null; // não mais usado

// ── Tipos de análise ──────────────────────────────────────────────────────────
const TIPOS = [
  { key: "lateralidade",         label: "Lateralidade",   desc: "Preferência e padrão lateral de movimento" },
  { key: "trafego",              label: "Tráfego",         desc: "Frequência de passagem por cada célula do mapa" },
  { key: "giros",                label: "Giros",           desc: "Quantidade e direção das rotações realizadas" },
  { key: "comparacao",           label: "Comparação",      desc: "Diferença em relação às sessões anteriores" },
];

// ── Barra de cobertura ────────────────────────────────────────────────────────
const sessoesConcluidas = sessoesAtividade.filter(s => s.cleared_map).length;
const totalSessoes = sessoesAtividade.length;
const pct = totalSessoes > 0 ? Math.round((sessoesConcluidas / totalSessoes) * 100) : 0;

const coverageBar = document.createElement("div");
coverageBar.className = "coverage-bar";
const lbl = document.createElement("span"); lbl.className = "coverage-label"; lbl.textContent = "Sessões analisadas:";
const track = document.createElement("div"); track.className = "bar-track";
const fillColor = pct >= 70 ? "#5ba85b" : pct >= 40 ? "#e8a838" : "#e05454";
const fill  = document.createElement("div"); fill.className = "bar-fill"; fill.style.width = pct + "%"; fill.style.background = fillColor;
track.append(fill);
const pctLbl = document.createElement("span"); pctLbl.className = "coverage-pct"; pctLbl.style.color = fillColor; pctLbl.textContent = `${sessoesConcluidas}/${totalSessoes}`;
coverageBar.append(lbl, track, pctLbl);

// ── Cards de análise por mapa ─────────────────────────────────────────────────
const grid = document.createElement("div");
grid.className = "analise-grid";

function makeCard(label, graficoFn, temDados) {
  const card = document.createElement("div"); card.className = "analise-card";
  const header = document.createElement("div"); header.className = "analise-card-header";
  const title  = document.createElement("span"); title.className = "analise-card-title"; title.textContent = label;
  header.append(title);
  const body = document.createElement("div"); body.className = "analise-card-body";
  try {
    const g = graficoFn();
    if (g) body.append(g);
    else { const p = document.createElement("p"); p.className = "no-data-card"; p.textContent = "Sem dados disponíveis."; body.append(p); }
  } catch(e) {
    const p = document.createElement("p"); p.className = "no-data-card"; p.textContent = "Erro ao gerar gráfico.";
    console.error(label, e); body.append(p);
  }
  card.append(header, body);
  return card;
}

for (const grupo of gruposPorMapa) {
  const { nome, sessoesComLog: scl, metricas: met, idLogRef } = grupo;

  // Separador de mapa (só se houver mais de um)
  if (gruposPorMapa.length > 1) {
    const sep = document.createElement("p");
    sep.style.cssText = "grid-column:1/-1;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--theme-foreground-muted);margin:1rem 0 .25rem;border-top:1px solid var(--theme-foreground-faintest);padding-top:.75rem;";
    sep.textContent = `Mapa: ${nome}`;
    grid.append(sep);
  }

  const col = document.createElement("div"); col.className = "analise-col";
  col.append(
    makeCard("Lateralidade por Sessões", () => scl.length ? graficoLateralidade(scl, Plot) : null, scl.length > 0),
    makeCard("Colisões por Sessão",      () => scl.length ? graficoTrafego(scl, Plot)      : null, scl.length > 0),
  );
  grid.append(
    col,
    makeCard("Giros por Sessão",         () => scl.length ? graficoGiros(scl, Plot)        : null, scl.length > 0),
    makeCard("Comparação",               () => graficoComparacao(met, idLogRef, Plot),            met.some(m => m.metricas)),
    (() => { const c = makeCard("Giros por Sessão (Mapa)", () => scl.length ? graficoGirosTreemap(scl) : null, scl.length > 0); c.style.gridColumn = "span 3"; return c; })(),
  );
}

// ── Evolução por Sessão ───────────────────────────────────────────────────────
function renderizarEvolucao(sessoesComMetricas) {
  const comMetricas = [...sessoesComMetricas].reverse().filter(a => a.metricas);

  if (!comMetricas.length) {
    const p = document.createElement("p");
    p.style.cssText = "font-style:italic;font-size:.85rem;color:var(--theme-foreground-muted);";
    p.textContent = "Nenhuma métrica disponível para as sessões deste aluno.";
    return p;
  }

  const COR_RANGE    = ["#4a90e2", "#5ba85b", "#e07b54"];
  const labelsDomain = comMetricas.map(a => `#${a.sessao.id_log}`);
  const grafRows     = comMetricas.flatMap(a => {
    const label = `#${a.sessao.id_log}`;
    const m = a.metricas;
    return [
      { label, metrica: "Precisão",  valor: m.precisao  },
      { label, metrica: "Objetivos", valor: m.objetivos },
      { label, metrica: "Fluidez",   valor: m.fluidez   },
    ];
  });

  // Destacar a sessão atual com banda vertical
  const marcas = [
    Plot.line(grafRows,  { x: "label", y: "valor", stroke: "metrica", strokeWidth: 2, tip: true }),
    Plot.dot(grafRows,   { x: "label", y: "valor", fill: "metrica", r: 3.5 }),
  ];
  const sessaoAtualLabel = `#${idLog}`;
  if (labelsDomain.includes(sessaoAtualLabel)) {
    marcas.unshift(Plot.barX(
      [{ label: sessaoAtualLabel }],
      { x: "label", fill: "var(--theme-background-alt)", inset: -0.5 }
    ));
  }

  const wrap = document.createElement("div");
  try {
    const chart = Plot.plot({
      width: 680,
      height: 220,
      marginLeft: 36, marginRight: 8, marginBottom: 44, marginTop: 12,
      x: {
        label: null,
        domain: labelsDomain,
        tickRotate: labelsDomain.length > 6 ? -40 : 0,
      },
      y: { label: "%", domain: [0, 100], grid: true, ticks: 5 },
      color: { domain: ["Precisão", "Objetivos", "Fluidez"], range: COR_RANGE },
      marks: marcas,
    });

    const leg = document.createElement("div");
    leg.style.cssText = "display:flex;gap:1rem;justify-content:center;margin-top:6px;";
    ["Precisão", "Objetivos", "Fluidez"].forEach((m, i) => {
      const item = document.createElement("span");
      item.style.cssText = "font-size:.72rem;font-weight:600;display:flex;align-items:center;gap:4px;color:var(--theme-foreground-muted);";
      const dot = document.createElement("span");
      dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${COR_RANGE[i]};flex-shrink:0;display:inline-block;`;
      item.append(dot, m);
      leg.append(item);
    });

    wrap.append(chart, leg);
  } catch(e) {
    console.error("renderizarEvolucao:", e);
    wrap.textContent = "Erro ao renderizar o gráfico.";
  }
  return wrap;
}

// ── Render ────────────────────────────────────────────────────────────────────
display(html`<div>
  <a class="back-link" href="/visualizacao/perfil-aluno?id=${idAluno}">← Perfil de ${aluno.nome_completo}</a>

  <h1 class="session-title">${nomeAtividade}</h1>
  <p class="section-title">Cobertura de análises</p>
  ${coverageBar}

  <p class="section-title">Detalhamento por tipo</p>
  ${grid}

  <p class="section-title">Eficiência da Rota (mesmo mapa)</p>
  <div class="analise-card" style="margin-bottom:1.5rem;">
    <div class="analise-card-header">
      <span class="analise-card-title">Distância Percorrida vs Rota Ideal</span>
    </div>
    <div class="analise-card-body">${(() => {
      try {
        const g = sessoesComLog.length >= 1 ? graficoEficienciaRota(sessoesComLog, Plot) : null;
        if (g) return g;
        const p = document.createElement("p");
        p.className = "no-data-card";
        p.textContent = "Logs insuficientes para calcular eficiência da rota.";
        return p;
      } catch(e) {
        console.error("graficoEficienciaRota:", e);
        const p = document.createElement("p");
        p.className = "no-data-card";
        p.textContent = "Erro ao gerar gráfico de eficiência da rota.";
        return p;
      }
    })()}</div>
  </div>

  <p class="section-title">Evolução Longitudinal (mesmo mapa)</p>
  <div class="analise-card" style="margin-bottom:1.5rem;">
    <div class="analise-card-header">
      <span class="analise-card-title">Colisões e Giros por Sessão</span>
    </div>
    <div class="analise-card-body">${(() => {
      try {
        const g = sessoesComLog.length >= 1 ? graficoEvolucaoLongitudinal(sessoesComLog, idLog, Plot) : null;
        if (g) return g;
        const p = document.createElement("p");
        p.className = "no-data-card";
        p.textContent = "Logs insuficientes para exibir evolução longitudinal.";
        return p;
      } catch(e) {
        console.error("graficoEvolucaoLongitudinal:", e);
        const p = document.createElement("p");
        p.className = "no-data-card";
        p.textContent = "Erro ao gerar gráfico de evolução longitudinal.";
        return p;
      }
    })()}</div>
  </div>

  <p class="section-title">Evolução por Sessão</p>
  <div class="analise-card" style="margin-bottom:1.5rem;">
    <div class="analise-card-header">
      <span class="analise-card-title">Evolução por Sessão</span>
    </div>
    <div class="analise-card-body">${renderizarEvolucao(sessoesComMetricas)}</div>
  </div>

  <p class="section-title">Sessões</p>
  ${(() => {
    const tbody = sessoesAtividade.map(s => {
      const status = s.cleared_map
        ? `<span class="badge-sm badge-ok">Concluída</span>`
        : `<span class="badge-sm badge-no">Não concluída</span>`;
      const mapaCol = gruposPorMapa.length > 1 ? `<td>${s.nome_mapa}</td>` : "";
      return `<tr>
        <td>#${s.id_log}</td>
        <td>${s.data?.slice(0, 10) ?? "—"}</td>
        ${mapaCol}
        <td>${status}</td>
      </tr>`;
    }).join("");
    const mapaHeader = gruposPorMapa.length > 1 ? "<th>Mapa</th>" : "";
    const el = document.createElement("div");
    el.innerHTML = `<table class="sessoes-info-table">
      <thead><tr><th>Sessão</th><th>Data</th>${mapaHeader}<th>Status</th></tr></thead>
      <tbody>${tbody}</tbody>
    </table>`;
    return el;
  })()}

</div>`);
```
