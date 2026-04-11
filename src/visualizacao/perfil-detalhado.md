---
title: Análise da Sessão
toc: false
---

<style>
  .back-link { font-size:.875rem; color:var(--theme-foreground-muted); text-decoration:none; display:inline-flex; align-items:center; gap:.35rem; margin-bottom:1.25rem; }
  .back-link:hover { color:var(--theme-foreground); }
  .session-title { font-size:1.4rem; font-weight:700; margin:0 0 .2rem; }
  .session-meta  { font-size:.875rem; color:var(--theme-foreground-muted); margin-bottom:1.75rem; }

  /* Barra de cobertura */
  .coverage-bar { display:flex; align-items:center; gap:.75rem; margin-bottom:1.5rem; }
  .coverage-label { font-size:.82rem; color:var(--theme-foreground-muted); white-space:nowrap; }
  .bar-track { flex:1; height:10px; background:var(--theme-foreground-faintest); border-radius:5px; overflow:hidden; }
  .bar-fill  { height:100%; border-radius:5px; background:var(--om-accent); }
  .coverage-pct { font-size:.82rem; font-weight:700; white-space:nowrap; min-width:2.5rem; text-align:right; }

  /* Cards de análise */
  .analise-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.1rem; margin-bottom:2rem; }
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
  .session-nav { display:flex; align-items:center; justify-content:space-between; margin-top:2rem; padding-top:1rem; border-top:1px solid var(--theme-foreground-faintest); }
  .nav-btn { padding:.4rem .9rem; border-radius:6px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.875rem; cursor:pointer; text-decoration:none; display:inline-block; transition:background .1s; }
  .nav-btn:hover { background:var(--theme-background-alt); }
  .nav-btn-disabled { padding:.4rem .9rem; border-radius:6px; border:1px solid var(--theme-foreground-faintest); color:var(--theme-foreground-faint); font-size:.875rem; display:inline-block; }
  .nav-center { font-size:.82rem; color:var(--theme-foreground-muted); }

  .section-title { font-size:.82rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--theme-foreground-muted); margin-bottom:.75rem; }

</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAluno, fetchSessoes, fetchSessao, fetchAnalises, fetchMetricas } from "../api.js";
import * as Plot from "npm:@observablehq/plot";
import { parseMapaXML }   from "../lib/mapa/parser.js";
import { mapaParaGeoJSON } from "../lib/mapa/geojson.js";
import {
  graficoLateralidade,
  graficoTrajetoria,
  graficoTrafego,
  graficoGiros,
  graficoComparacao,
  graficoEvolucaoLongitudinal,
  graficoEficienciaRota,
} from "../lib/sessao/detalhamento.js";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

const params  = new URLSearchParams(window.location.search);
const idAluno = params.get("id")  ? parseInt(params.get("id"))  : null;
const idLog   = params.get("log") ? parseInt(params.get("log")) : null;

if (!idAluno || !idLog) {
  display(html`<div style="padding:1.5rem;background:#fee2e2;border-radius:8px;color:#b91c1c;">
    <strong>Sessão não especificada.</strong>
    <p style="margin:.5rem 0 0;font-size:.875rem;">Acesse esta página a partir da lista de sessões de um aluno. Redirecionando…</p>
  </div>`);
  setTimeout(() => { window.location.href = "/visualizacao/alunos"; }, 2500);
  throw new Error("parâmetros ausentes");
}

// Carregar aluno, lista de sessões, análises e dados da sessão em paralelo
let aluno     = null;
let sessoes   = [];
let analises  = null;
let sessaoLog = null;

try {
  [aluno, { sessoes }, { analises }, sessaoLog] = await Promise.all([
    fetchAluno(idAluno),
    fetchSessoes(idAluno),
    fetchAnalises(idLog),
    fetchSessao(idLog).catch(() => null),
  ]);
} catch (e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro: ${e.message}</div>`);
  throw e;
}

const dadosLog = sessaoLog?.dados_log ?? null;

// Carregar XML do mapa para usar como base do heatmap de trajetória
let camadas = null;
{
  const caminhoXml = sessaoLog?.nome_arquivo_xml ?? null;
  if (caminhoXml) {
    try {
      const token  = sessionStorage.getItem("om_token");
      const partes = caminhoXml.replace(/^\//, "").split("/");
      const pasta  = partes[0];
      const arquivo = partes.slice(1).join("/");
      const xmlResp = await fetch(`http://127.0.0.1:5000/api/treinos/arquivos/${pasta}/${arquivo}?token=${token}`);
      if (xmlResp.ok) {
        const xmlText = await xmlResp.text();
        camadas = mapaParaGeoJSON(parseMapaXML(xmlText));
      }
    } catch(e) {
      console.warn("perfil-detalhado: falha ao carregar XML do mapa", e);
    }
  }
}

// Posição da sessão atual na lista (sessões ordenadas desc por data)
const sessaoAtual    = sessoes.find(s => s.id_log === idLog);
const idxAtual       = sessoes.findIndex(s => s.id_log === idLog);
const sessaoAnterior = sessoes[idxAtual + 1] ?? null; // +1 = mais antiga
const sessaoProxima  = sessoes[idxAtual - 1] ?? null; // -1 = mais recente

// Sessões do mesmo mapa (excluindo a atual, que já foi buscada)
const sessoesMesmoMapa = sessoes.filter(
  s => s.nome_mapa === sessaoAtual?.nome_mapa && s.id_log !== idLog
);

// Buscar logs e métricas de todas as sessões do mesmo mapa em paralelo
const sessoesDoMapa = [sessaoAtual, ...sessoesMesmoMapa].filter(Boolean);
const [sessoesOutrasComLog, sessoesDoMapaComMetricas] = await Promise.all([
  Promise.all(
    sessoesMesmoMapa.slice(0, 15).map(s =>
      fetchSessao(s.id_log)
        .then(r => r.dados_log ?? null)
        .catch(() => null)
    )
  ),
  Promise.all(
    sessoesDoMapa.map(s =>
      fetchMetricas(s.id_log)
        .then(r => ({ sessao: s, metricas: r.metricas ?? null }))
        .catch(() => ({ sessao: s, metricas: null }))
    )
  ),
]);

// Pares { sessao, dadosLog } em ordem cronológica (mais antiga primeiro)
const sessoesComLog = [
  { sessao: sessaoAtual, dadosLog },
  ...sessoesMesmoMapa.slice(0, 15).map((s, i) => ({ sessao: s, dadosLog: sessoesOutrasComLog[i] })),
]
  .filter(s => s.sessao && s.dadosLog)
  .sort((a, b) => a.sessao.id_log - b.sessao.id_log);

// Para o gráfico de evolução: todas as sessões do aluno (não só do mapa)
const sessoesComMetricas = await Promise.all(
  sessoes.slice(0, 20).map(s =>
    fetchMetricas(s.id_log)
      .then(r => ({ sessao: s, metricas: r.metricas ?? null }))
      .catch(() => ({ sessao: s, metricas: null }))
  )
);

// ── Tipos de análise ──────────────────────────────────────────────────────────
const TIPOS = [
  { key: "lateralidade",         label: "Lateralidade",   desc: "Preferência e padrão lateral de movimento" },
  { key: "simulacao_trajetoria", label: "Trajetória",      desc: "Caminho percorrido na simulação" },
  { key: "trafego",              label: "Tráfego",         desc: "Frequência de passagem por cada célula do mapa" },
  { key: "giros",                label: "Giros",           desc: "Quantidade e direção das rotações realizadas" },
  { key: "comparacao",           label: "Comparação",      desc: "Diferença em relação às sessões anteriores" },
];

// ── Barra de cobertura ────────────────────────────────────────────────────────
const disponiveis = TIPOS.filter(t => analises[t.key]).length;
const pct = Math.round((disponiveis / TIPOS.length) * 100);

const coverageBar = document.createElement("div");
coverageBar.className = "coverage-bar";
const lbl = document.createElement("span"); lbl.className = "coverage-label"; lbl.textContent = "Cobertura desta sessão:";
const track = document.createElement("div"); track.className = "bar-track";
const fill  = document.createElement("div"); fill.className = "bar-fill"; fill.style.width = pct + "%";
track.append(fill);
const pctLbl = document.createElement("span"); pctLbl.className = "coverage-pct"; pctLbl.textContent = `${disponiveis}/${TIPOS.length}`;
coverageBar.append(lbl, track, pctLbl);

// ── Cards de análise ──────────────────────────────────────────────────────────
const grid = document.createElement("div");
grid.className = "analise-grid";

// Mapa tipo.key → função de gráfico
// lateralidade/trafego/giros usam todosLogs (todas as sessões do mesmo mapa)
// trajetoria usa apenas a sessão atual (percurso individual)
// comparacao usa sessoesDoMapaComMetricas (esta sessão vs média do mapa)
const GRAFICOS = {
  lateralidade:         () => sessoesComLog.length ? graficoLateralidade(sessoesComLog, Plot) : null,
  simulacao_trajetoria: () => sessoesComLog.length ? graficoTrajetoria(sessoesComLog, camadas, Plot) : null,
  trafego:              () => sessoesComLog.length ? graficoTrafego(sessoesComLog, Plot)       : null,
  giros:                () => sessoesComLog.length ? graficoGiros(sessoesComLog, Plot)         : null,
  comparacao:           () => graficoComparacao(sessoesDoMapaComMetricas, idLog, Plot),
};

for (const tipo of TIPOS) {
  const caminho = analises[tipo.key];
  const card    = document.createElement("div");
  card.className = "analise-card";

  // Cabeçalho
  const header = document.createElement("div");
  header.className = "analise-card-header";
  const title = document.createElement("span"); title.className = "analise-card-title"; title.textContent = tipo.label;
  const badge = document.createElement("span"); badge.className = caminho ? "badge-ok" : "badge-ausente";
  badge.textContent = caminho ? "Disponível" : "Ausente";
  header.append(title, badge);

  // Corpo — gráfico calculado a partir do log
  const body = document.createElement("div");
  body.className = "analise-card-body";

  try {
    const grafico = GRAFICOS[tipo.key]?.();
    if (grafico) {
      body.append(grafico);
    } else {
      const p = document.createElement("p"); p.className = "no-data-card";
      p.textContent = sessoesComLog.length
        ? `Sem dados de ${tipo.label.toLowerCase()} nestas sessões.`
        : "Logs das sessões não disponíveis.";
      body.append(p);
    }
  } catch(e) {
    const p = document.createElement("p"); p.className = "no-data-card";
    p.textContent = `Erro ao gerar gráfico de ${tipo.label.toLowerCase()}.`;
    console.error(`grafico ${tipo.key}:`, e);
    body.append(p);
  }

  card.append(header, body);
  grid.append(card);
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

// ── Navegação prev / next ─────────────────────────────────────────────────────
const sessionNav = document.createElement("div");
sessionNav.className = "session-nav";

function navEl(sessao, rotulo) {
  if (!sessao) {
    const s = document.createElement("span"); s.className = "nav-btn-disabled"; s.textContent = rotulo;
    return s;
  }
  const a = document.createElement("a");
  a.className   = "nav-btn";
  a.href        = `/visualizacao/perfil-detalhado?id=${idAluno}&log=${sessao.id_log}`;
  a.textContent = rotulo;
  return a;
}

const navCenter = document.createElement("span");
navCenter.className = "nav-center";
navCenter.textContent = `Sessão ${idxAtual + 1} de ${sessoes.length}`;

sessionNav.append(
  navEl(sessaoAnterior, "← Sessão anterior"),
  navCenter,
  navEl(sessaoProxima,  "Sessão seguinte →")
);

// ── Render ────────────────────────────────────────────────────────────────────
display(html`<div>
  <a class="back-link" href="/visualizacao/dados-aluno?id=${idAluno}">← Sessões de ${aluno.nome_completo}</a>

  <h1 class="session-title">${sessaoAtual?.nome_mapa ?? "Sessão"}</h1>
  <p class="session-meta">${aluno.nome_completo} · ${sessaoAtual?.data ?? ""} · Log #${idLog}</p>

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

  ${sessionNav}
</div>`);
```
