/**
 * src/lib/atividade/comparar.js
 * Helpers visuais para a página de comparação de desempenho por atividade.
 *
 * Exports:
 *   semCor(v)                        → {bg, text}
 *   fmtPct(v)                        → string
 *   mediaMetricas(m)                 → number | null
 *   graficoRanking(dados, chave, Plot)
 *   graficoMultimetrica(dados, Plot)
 *   graficoProgresso(dados, Plot)
 *   tabelaHeatmap(dados, html)
 *
 * Shape de `dados`:
 *   [{ aluno: {id_aluno, nome_completo}, metricas: {precisao,objetivos,fluidez}|null,
 *      finalizada: bool|null, totalSessoes: number }]
 */

// ── Semáforo ──────────────────────────────────────────────────────────────────
export function semCor(v) {
  if (v == null) return { bg: "#f3f4f6", text: "#9ca3af" };
  if (v >= 70)   return { bg: "#dcfce7", text: "#166534" };
  if (v >= 40)   return { bg: "#fef9c3", text: "#854d0e" };
  return           { bg: "#fee2e2", text: "#991b1b" };
}

export function fmtPct(v) {
  return v != null ? `${v.toFixed(1)}%` : "—";
}

export function mediaMetricas(m) {
  if (!m) return null;
  return (m.precisao + m.objetivos + m.fluidez) / 3;
}

// ── Paleta categórica por índice de aluno ─────────────────────────────────────
const CORES = [
  "#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f",
  "#edc948","#b07aa1","#ff9da7","#9c755f","#bab0ac",
];
export function corAluno(i) { return CORES[i % CORES.length]; }

// ── Gráfico 1: Ranking horizontal por métrica ─────────────────────────────────
/**
 * Barras horizontais ordenadas pela métrica selecionada.
 * chave: "precisao" | "objetivos" | "fluidez" | "media"
 */
export function graficoRanking(dados, chave, Plot) {
  const rows = dados
    .filter(d => d.metricas != null)
    .map(d => {
      const v = chave === "media" ? mediaMetricas(d.metricas) : (d.metricas[chave] ?? 0);
      return { nome: d.aluno.nome_completo, valor: v };
    })
    .sort((a, b) => b.valor - a.valor);

  if (!rows.length) return null;

  const metricaLabel = { precisao: "Precisão", objetivos: "Objetivos", fluidez: "Fluidez", media: "Média" }[chave] ?? chave;

  return Plot.plot({
    marginLeft: 140, marginRight: 36, marginTop: 8, marginBottom: 16,
    width: 340, height: Math.max(160, rows.length * 30 + 40),
    style: { fontSize: "11px" },
    x: { label: metricaLabel + " (%)", domain: [0, 100], grid: true },
    y: { label: null },
    marks: [
      Plot.barX(rows, {
        x: "valor", y: "nome",
        fill: d => {
          const c = semCor(d.valor);
          return c.bg === "#dcfce7" ? "#5ba85b" : c.bg === "#fef9c3" ? "#e6a817" : "#e07b54";
        },
        sort: { y: "-x" },
        rx: 3, tip: true,
        title: d => `${d.nome}: ${fmtPct(d.valor)}`,
      }),
      Plot.text(rows, {
        x: "valor", y: "nome",
        text: d => fmtPct(d.valor),
        dx: 5, textAnchor: "start",
        fontSize: 10, fill: "var(--theme-foreground-muted)",
      }),
      Plot.ruleX([0]),
    ],
  });
}

// ── Gráfico 2: Comparação multi-métrica (dot plot) ───────────────────────────
/**
 * Cada linha = um aluno; 3 pontos = Precisão, Objetivos, Fluidez.
 * Facilita ver o perfil de cada aluno e comparar entre si.
 */
export function graficoMultimetrica(dados, Plot) {
  const METRICAS = [
    { label: "Precisão",  chave: "precisao",  cor: "#4a90e2" },
    { label: "Objetivos", chave: "objetivos", cor: "#5ba85b" },
    { label: "Fluidez",   chave: "fluidez",   cor: "#e07b54" },
  ];

  const rows = dados.filter(d => d.metricas).flatMap(d =>
    METRICAS.map(m => ({
      nome:    d.aluno.nome_completo,
      metrica: m.label,
      valor:   d.metricas[m.chave] ?? 0,
    }))
  );

  if (!rows.length) return null;

  const nomes = [...new Set(rows.map(d => d.nome))];

  return Plot.plot({
    marginLeft: 140, marginRight: 8, marginTop: 8, marginBottom: 28,
    width: 340, height: Math.max(160, nomes.length * 28 + 60),
    style: { fontSize: "11px" },
    x: { label: "%", domain: [0, 100], grid: true },
    y: { label: null, domain: nomes },
    color: {
      domain: METRICAS.map(m => m.label),
      range:  METRICAS.map(m => m.cor),
      legend: true,
    },
    marks: [
      // Linha de referência 70% (Bom)
      Plot.ruleX([70], { stroke: "#5ba85b", strokeDasharray: "4,3", strokeOpacity: 0.5 }),
      // Linha de referência 40% (Regular)
      Plot.ruleX([40], { stroke: "#e6a817", strokeDasharray: "4,3", strokeOpacity: 0.5 }),
      // Pontos
      Plot.dot(rows, {
        x: "valor", y: "nome", fill: "metrica",
        r: 6, tip: true,
        title: d => `${d.nome} — ${d.metrica}: ${fmtPct(d.valor)}`,
      }),
      Plot.ruleX([0]),
    ],
  });
}

// ── Gráfico 3: Progresso — sessões por aluno ─────────────────────────────────
/**
 * Barras verticais: número de sessões realizadas por aluno nesta atividade.
 * A cor indica se o aluno finalizou (verde) ou não (azul/vermelho).
 */
export function graficoProgresso(dados, Plot) {
  const rows = dados
    .map(d => ({
      nome:       d.aluno.nome_completo,
      sessoes:    d.totalSessoes,
      finalizada: d.finalizada,
    }))
    .sort((a, b) => b.sessoes - a.sessoes);

  if (!rows.length || rows.every(r => r.sessoes === 0)) return null;

  const nomes = rows.map(r => r.nome);

  return Plot.plot({
    marginLeft: 8, marginRight: 8, marginTop: 8,
    marginBottom: nomes.length > 5 ? 70 : 50,
    width: 340, height: 220,
    style: { fontSize: "11px" },
    x: {
      label: null, domain: nomes,
      tickRotate: nomes.length > 4 ? -35 : 0,
    },
    y: { label: "Sessões", grid: true, ticks: 4 },
    marks: [
      Plot.barY(rows, {
        x: "nome", y: "sessoes",
        fill: d => d.finalizada === true ? "#5ba85b" : d.finalizada === false ? "#4a90e2" : "#9ca3af",
        rx: 3, tip: true,
        title: d => `${d.nome}: ${d.sessoes} sessão(ões)${d.finalizada === true ? " · Finalizado" : d.finalizada === false ? " · Em progresso" : ""}`,
      }),
      Plot.ruleY([0]),
    ],
  });
}

// ── Tabela heatmap: alunos × métricas ────────────────────────────────────────
/**
 * Tabela com semáforo de cores: Precisão, Objetivos, Fluidez, Média, Sessões, Status.
 * Ordenada por média decrescente. Retorna um Element DOM (não usa html tagged template).
 */
export function tabelaHeatmap(dados) {
  const rows = dados
    .map(d => ({
      nome:       d.aluno.nome_completo,
      precisao:   d.metricas?.precisao  ?? null,
      objetivos:  d.metricas?.objetivos ?? null,
      fluidez:    d.metricas?.fluidez   ?? null,
      media:      mediaMetricas(d.metricas),
      sessoes:    d.totalSessoes,
      finalizada: d.finalizada,
    }))
    .sort((a, b) => (b.media ?? -1) - (a.media ?? -1));

  // ── Helper: célula com semáforo ────────────────────────────────────────────
  function mkCell(v, borderLeft) {
    const c = semCor(v);
    const td = document.createElement("td");
    td.style.cssText = `text-align:center;padding:5px 6px;border-radius:4px;background:${c.bg};color:${c.text};font-weight:600;font-size:11px;min-width:58px;${borderLeft ? "border-left:2px solid #e5e7eb;" : ""}`;
    td.textContent = fmtPct(v);
    return td;
  }

  // ── Legenda ────────────────────────────────────────────────────────────────
  const legWrap = document.createElement("div");
  legWrap.style.cssText = "margin-bottom:8px;line-height:2;";
  for (const [bg, col, lbl] of [
    ["#dcfce7","#166534","Bom (≥ 70%)"],
    ["#fef9c3","#854d0e","Regular (≥ 40%)"],
    ["#fee2e2","#991b1b","Atenção (< 40%)"],
    ["#f3f4f6","#9ca3af","Sem dados"],
  ]) {
    const span = document.createElement("span");
    span.style.cssText = `display:inline-flex;align-items:center;gap:4px;margin-right:10px;font-size:10px;color:${col};`;
    const sq = document.createElement("span");
    sq.style.cssText = `width:10px;height:10px;border-radius:2px;background:${bg};display:inline-block;border:1px solid rgba(0,0,0,.08);`;
    span.append(sq, lbl);
    legWrap.append(span);
  }

  // ── Tabela ─────────────────────────────────────────────────────────────────
  const table = document.createElement("table");
  table.style.cssText = "border-collapse:separate;border-spacing:3px;font-size:11px;width:100%;min-width:480px;";

  // Cabeçalho
  const thead = table.createTHead();
  const trHead = thead.insertRow();
  for (const [label, color, extra] of [
    ["Aluno",      "#888",   "text-align:left;padding:4px 10px;white-space:nowrap;font-weight:500;"],
    ["Precisão",   "#4a90e2","text-align:center;padding:4px 6px;font-weight:700;"],
    ["Objetivos",  "#5ba85b","text-align:center;padding:4px 6px;font-weight:700;"],
    ["Fluidez",    "#e07b54","text-align:center;padding:4px 6px;font-weight:700;"],
    ["Média",      "#555",   "text-align:center;padding:4px 6px;font-weight:600;border-left:2px solid #e5e7eb;"],
    ["Sessões",    "#888",   "text-align:center;padding:4px 6px;font-weight:500;"],
    ["Finalizado", "#888",   "text-align:center;padding:4px 6px;font-weight:500;"],
  ]) {
    const th = document.createElement("th");
    th.style.cssText = `${extra}color:${color};font-size:10px;`;
    th.textContent = label;
    trHead.append(th);
  }

  // Corpo
  const tbody = table.createTBody();
  rows.forEach((r, i) => {
    const tr = tbody.insertRow();
    tr.style.background = i % 2 === 0 ? "transparent" : "rgba(0,0,0,.02)";

    // Nome
    const tdNome = tr.insertCell();
    tdNome.style.cssText = "padding:5px 10px;font-size:12px;white-space:nowrap;font-weight:500;";
    tdNome.textContent = r.nome;

    // Métricas
    tr.append(mkCell(r.precisao), mkCell(r.objetivos), mkCell(r.fluidez), mkCell(r.media, true));

    // Sessões
    const tdSess = tr.insertCell();
    tdSess.style.cssText = "text-align:center;padding:5px 6px;font-size:11px;color:#555;";
    tdSess.textContent = r.sessoes;

    // Finalizado
    const tdFin = tr.insertCell();
    tdFin.style.cssText = "text-align:center;padding:5px 6px;";
    const badge = document.createElement("span");
    if (r.finalizada === true)       { badge.style.cssText = "color:#166534;font-weight:600;font-size:11px;"; badge.textContent = "Sim"; }
    else if (r.finalizada === false) { badge.style.cssText = "color:#991b1b;font-weight:600;font-size:11px;"; badge.textContent = "Não"; }
    else                             { badge.style.cssText = "color:#9ca3af;font-size:11px;"; badge.textContent = "—"; }
    tdFin.append(badge);
  });

  const scrollWrap = document.createElement("div");
  scrollWrap.style.overflowX = "auto";
  scrollWrap.append(table);

  const wrap = document.createElement("div");
  wrap.append(legWrap, scrollWrap);
  return wrap;
}
