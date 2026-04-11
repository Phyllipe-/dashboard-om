---
title: Comparar Alunos por Atividade
toc: false
---

<style>
  /* ── Filtros ────────────────────────────────────────────────────────────── */
  .comp-filters {
    display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;
    margin-bottom: 1.25rem;
  }
  .comp-filter-group { display: flex; align-items: center; gap: .5rem; }
  .comp-filter-label { font-size: .82rem; font-weight: 600; color: var(--theme-foreground-muted); white-space: nowrap; }
  .comp-select {
    padding: .3rem .6rem; border-radius: 6px;
    border: 1px solid var(--theme-foreground-faint);
    background: var(--theme-background); color: var(--theme-foreground);
    font-size: .85rem; cursor: pointer; min-width: 160px;
  }
  .comp-select:focus { outline: none; border-color: #4a90e2; }

  /* ── KPIs ───────────────────────────────────────────────────────────────── */
  .comp-kpis {
    display: grid; grid-template-columns: repeat(5, 1fr); gap: .75rem;
    margin-bottom: 1.25rem;
  }
  @media(max-width:800px) { .comp-kpis { grid-template-columns: repeat(3,1fr); } }
  .kpi-card {
    background: var(--theme-background-alt);
    border: 1px solid var(--theme-foreground-faintest);
    border-radius: 8px; padding: .65rem 1rem;
  }
  .kpi-label { font-size: .74rem; color: var(--theme-foreground-muted); margin-bottom: .2rem; }
  .kpi-valor { font-size: 1.4rem; font-weight: 700; line-height: 1.1; }
  .kpi-sub   { font-size: .72rem; color: var(--theme-foreground-muted); margin-top: .15rem; }

  /* ── 3 gráficos ─────────────────────────────────────────────────────────── */
  .comp-charts { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: .75rem; margin-bottom: .75rem; }
  @media(max-width:900px) { .comp-charts { grid-template-columns: 1fr 1fr; } }
  @media(max-width:600px) { .comp-charts { grid-template-columns: 1fr; } }

  .chart-card {
    background: var(--theme-background-alt);
    border: 1px solid var(--theme-foreground-faintest);
    border-radius: 8px; padding: .85rem 1rem;
  }
  .chart-title { font-size: .82rem; font-weight: 700; margin-bottom: .15rem; color: var(--theme-foreground); }
  .chart-sub   { font-size: .72rem; color: var(--theme-foreground-muted); margin-bottom: .5rem; }

  /* ── Tabela ─────────────────────────────────────────────────────────────── */
  .comp-table-wrap {
    background: var(--theme-background-alt);
    border: 1px solid var(--theme-foreground-faintest);
    border-radius: 8px; padding: 1rem;
  }
  .comp-table-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: .75rem; flex-wrap: wrap; gap: .5rem;
  }
  .comp-table-title { font-size: .82rem; font-weight: 700; }

  /* ── Estados ────────────────────────────────────────────────────────────── */
  .comp-loading { text-align: center; padding: 2.5rem 0; color: var(--theme-foreground-muted); font-size: .9rem; }
  .comp-empty   { text-align: center; padding: 1.5rem 0; color: var(--theme-foreground-muted); font-style: italic; font-size: .85rem; }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAtividades, fetchAtividade, fetchSessoes, fetchMetricasAluno } from "../api.js";
import * as Plot from "npm:@observablehq/plot";
import {
  semCor, fmtPct, mediaMetricas, corAluno,
  graficoRanking, graficoMultimetrica, graficoProgresso, tabelaHeatmap,
} from "../lib/atividade/comparar.js";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

// ── Carregar lista de atividades ──────────────────────────────────────────────
let atividades = [];
try {
  ({ atividades } = await fetchAtividades());
} catch(e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro ao carregar atividades: ${e.message}</div>`);
  throw e;
}

if (!atividades.length) {
  display(html`<div style="padding:2rem;text-align:center;color:#888;">Nenhuma atividade disponível.</div>`);
  throw new Error("sem atividades");
}

// ── Seletores de filtro ───────────────────────────────────────────────────────
const selAtividade = document.createElement("select");
selAtividade.className = "comp-select";
for (const a of atividades) {
  const opt = document.createElement("option");
  opt.value = a.id_atividade;
  opt.textContent = a.nome;
  selAtividade.append(opt);
}

const METRICAS_OPTS = [
  { label: "Média Geral",  chave: "media"     },
  { label: "Precisão",     chave: "precisao"  },
  { label: "Objetivos",    chave: "objetivos" },
  { label: "Fluidez",      chave: "fluidez"   },
];
const selMetrica = document.createElement("select");
selMetrica.className = "comp-select";
selMetrica.style.minWidth = "130px";
for (const m of METRICAS_OPTS) {
  const opt = document.createElement("option");
  opt.value = m.chave; opt.textContent = m.label;
  selMetrica.append(opt);
}

// ── Container principal ───────────────────────────────────────────────────────
const root = document.createElement("div");

// ── Área de conteúdo dinâmico ─────────────────────────────────────────────────
const kpisEl   = document.createElement("div"); kpisEl.className = "comp-kpis";
const chartsEl = document.createElement("div"); chartsEl.className = "comp-charts";
const tableEl  = document.createElement("div");

function loading(el, msg = "Carregando…") {
  el.innerHTML = `<div class="comp-loading">${msg}</div>`;
}

// ── Funções auxiliares de KPI ─────────────────────────────────────────────────
function avgMetrica(dados, chave) {
  const vals = dados.filter(d => d.metricas).map(d => d.metricas[chave] ?? 0);
  return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
}

function kpiCard(label, valor, sub, accentColor) {
  const d = document.createElement("div");
  d.className = "kpi-card";
  d.innerHTML = `
    <div class="kpi-label">${label}</div>
    <div class="kpi-valor" style="color:${accentColor ?? "inherit"}">${valor}</div>
    ${sub ? `<div class="kpi-sub" style="color:${accentColor ?? "#888"}">${sub}</div>` : ""}`;
  return d;
}

// ── Renderizar dashboard com os dados carregados ──────────────────────────────
async function renderizar(idAtividade) {
  const atividadeInfo = atividades.find(a => a.id_atividade == idAtividade);
  const chaveMetrica  = selMetrica.value;
  const labelMetrica  = METRICAS_OPTS.find(m => m.chave === chaveMetrica)?.label ?? chaveMetrica;

  // Mostrar estado de carregamento
  kpisEl.innerHTML   = `<div style="grid-column:1/-1;" class="comp-loading">Carregando dados…</div>`;
  chartsEl.innerHTML = `<div style="grid-column:1/-1;" class="comp-loading">Carregando gráficos…</div>`;
  tableEl.innerHTML  = `<div class="comp-loading">Carregando tabela…</div>`;

  // Buscar detalhe da atividade (mapas + alunos)
  let detalhe;
  try {
    detalhe = await fetchAtividade(idAtividade);
  } catch(e) {
    kpisEl.innerHTML = `<div style="grid-column:1/-1;color:#b91c1c;padding:.5rem;">Erro: ${e.message}</div>`;
    return;
  }

  const alunosAtividade = detalhe.alunos ?? [];
  const nomesMapas = new Set((detalhe.mapas ?? []).map(m => m.nome_mapa).filter(Boolean));

  if (!alunosAtividade.length) {
    kpisEl.innerHTML   = "";
    chartsEl.innerHTML = `<div style="grid-column:1/-1;" class="comp-empty">Nenhum aluno atribuído a esta atividade.</div>`;
    tableEl.innerHTML  = "";
    return;
  }

  // Buscar métricas e sessões de cada aluno em paralelo
  const dadosBrutos = await Promise.all(
    alunosAtividade.map(async (a) => {
      const [respMetricas, respSessoes] = await Promise.all([
        fetchMetricasAluno(a.id_aluno).catch(() => null),
        fetchSessoes(a.id_aluno).catch(() => ({ sessoes: [] })),
      ]);
      const todasSessoes = respSessoes.sessoes ?? [];
      // Contar apenas sessões nesta atividade (filtrar pelo nome do mapa)
      const sessoesAtividade = nomesMapas.size > 0
        ? todasSessoes.filter(s => nomesMapas.has(s.nome_mapa))
        : todasSessoes;
      return {
        aluno:       a,
        metricas:    respMetricas?.metricas ?? null,
        finalizada:  respMetricas?.atividade_finalizada ?? null,
        totalSessoes: sessoesAtividade.length,
      };
    })
  );

  // ── KPIs ───────────────────────────────────────────────────────────────────
  const comMetricas  = dadosBrutos.filter(d => d.metricas);
  const avgPrec      = avgMetrica(dadosBrutos, "precisao");
  const avgObj       = avgMetrica(dadosBrutos, "objetivos");
  const avgFlui      = avgMetrica(dadosBrutos, "fluidez");
  const nFinalizados = dadosBrutos.filter(d => d.finalizada === true).length;
  const nSemDados    = dadosBrutos.filter(d => !d.metricas).length;

  kpisEl.replaceChildren(
    kpiCard("Total de alunos",  alunosAtividade.length, `${nSemDados > 0 ? nSemDados + " sem dados de análise" : "Todos com dados"}`, "#1a3a5c"),
    kpiCard("Precisão média",   fmtPct(avgPrec),  "proporção de colisões evitadas", semCor(avgPrec).text),
    kpiCard("Objetivos médios", fmtPct(avgObj),   "metas alcançadas",               semCor(avgObj).text),
    kpiCard("Fluidez média",    fmtPct(avgFlui),  "eficiência do percurso",         semCor(avgFlui).text),
    (() => {
      const d = document.createElement("div");
      d.className = "kpi-card";
      d.style.background = nFinalizados > 0 ? "#f0fdf4" : "white";
      d.style.borderColor = nFinalizados > 0 ? "#bbf7d0" : "";
      d.innerHTML = `
        <div class="kpi-label" style="color:${nFinalizados > 0 ? "#166534" : "#888"}">Finalizaram</div>
        <div class="kpi-valor" style="color:${nFinalizados > 0 ? "#166534" : "inherit"}">${nFinalizados} / ${alunosAtividade.length}</div>
        <div class="kpi-sub" style="color:#888;">${Math.round(nFinalizados / alunosAtividade.length * 100)}% de conclusão</div>`;
      return d;
    })()
  );

  // ── 3 Gráficos ─────────────────────────────────────────────────────────────
  chartsEl.replaceChildren();

  function mountChart(title, sub, plotEl) {
    const card = document.createElement("div");
    card.className = "chart-card";
    const t = document.createElement("div"); t.className = "chart-title"; t.textContent = title;
    const s = document.createElement("div"); s.className = "chart-sub";   s.textContent = sub;
    card.append(t, s);
    if (plotEl) {
      card.append(plotEl);
    } else {
      const p = document.createElement("p"); p.className = "comp-empty"; p.textContent = "Dados insuficientes.";
      card.append(p);
    }
    chartsEl.append(card);
  }

  try { mountChart(`Ranking — ${labelMetrica}`, "Desempenho médio por aluno", graficoRanking(dadosBrutos, chaveMetrica, Plot)); }
  catch(e) { console.error("graficoRanking:", e); mountChart(`Ranking — ${labelMetrica}`, "", null); }

  try { mountChart("Comparação de métricas", "Precisão · Objetivos · Fluidez por aluno", graficoMultimetrica(dadosBrutos, Plot)); }
  catch(e) { console.error("graficoMultimetrica:", e); mountChart("Comparação de métricas", "", null); }

  try { mountChart("Progresso", "Sessões concluídas nesta atividade", graficoProgresso(dadosBrutos, Plot)); }
  catch(e) { console.error("graficoProgresso:", e); mountChart("Progresso", "", null); }

  // ── Legenda do gráfico de progresso ───────────────────────────────────────
  const legProgresso = ["#5ba85b:Finalizado","#4a90e2:Em progresso","#9ca3af:Sem status"].map(s => {
    const [cor, lbl] = s.split(":");
    return `<span style="display:inline-flex;align-items:center;gap:3px;font-size:9px;color:#555;margin-right:8px;">
      <span style="width:8px;height:8px;border-radius:2px;background:${cor};display:inline-block;"></span>${lbl}</span>`;
  }).join("");
  chartsEl.lastElementChild?.insertAdjacentHTML("beforeend", `<div style="margin-top:4px;line-height:2;">${legProgresso}</div>`);

  // ── Tabela heatmap ─────────────────────────────────────────────────────────
  tableEl.replaceChildren();
  const tableWrap = document.createElement("div");
  tableWrap.className = "comp-table-wrap";
  const tableHeader = document.createElement("div");
  tableHeader.className = "comp-table-header";
  const tableTitle = document.createElement("span");
  tableTitle.className = "comp-table-title";
  tableTitle.textContent = `Desempenho detalhado — ${atividadeInfo?.nome ?? "Atividade"}`;
  tableHeader.append(tableTitle);
  tableWrap.append(tableHeader);
  try {
    const tabEl = tabelaHeatmap(dadosBrutos);
    tableWrap.append(tabEl);
  } catch(e) {
    console.error("tabelaHeatmap:", e);
    tableWrap.innerHTML += `<p class="comp-empty">Erro ao renderizar tabela.</p>`;
  }
  tableEl.append(tableWrap);
}

// ── Montar estrutura do dashboard ─────────────────────────────────────────────
const filtersEl = document.createElement("div");
filtersEl.className = "comp-filters";
const grpAtiv = document.createElement("div"); grpAtiv.className = "comp-filter-group";
const lblAtiv = document.createElement("span"); lblAtiv.className = "comp-filter-label"; lblAtiv.textContent = "Atividade:";
grpAtiv.append(lblAtiv, selAtividade);
const grpMet = document.createElement("div"); grpMet.className = "comp-filter-group";
const lblMet = document.createElement("span"); lblMet.className = "comp-filter-label"; lblMet.textContent = "Ranking por:";
grpMet.append(lblMet, selMetrica);
filtersEl.append(grpAtiv, grpMet);

const bodyEl = document.createElement("div");
bodyEl.append(chartsEl, tableEl);

root.append(filtersEl, kpisEl, bodyEl);

display(root);

// ── Reação a mudanças nos seletores ──────────────────────────────────────────
selAtividade.addEventListener("change", () => renderizar(selAtividade.value));
selMetrica.addEventListener("change",   () => renderizar(selAtividade.value));

// ── Render inicial ────────────────────────────────────────────────────────────
renderizar(atividades[0].id_atividade);
```
