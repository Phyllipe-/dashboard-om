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
    marginLeft: 49, marginRight: 16, marginTop: 16, marginBottom: 80,
    width: 340, height: 340,
    style: { fontSize: "14px" },
    x: { label: null, tickRotate: -35 },
    y: { label: "↑ " + metricaLabel + " (%)", labelAnchor: "center", labelArrow: "none", domain: [0, 100], grid: true },
    marks: [
      Plot.barY(rows, {
        x: "nome", y: "valor",
        fill: d => {
          const c = semCor(d.valor);
          return c.bg === "#dcfce7" ? "#5ba85b" : c.bg === "#fef9c3" ? "#e6a817" : "#e07b54";
        },
        sort: { x: "-y" },
        rx: 3, tip: true,
        title: d => `${d.nome}: ${fmtPct(d.valor)}`,
      }),
      Plot.text(rows, {
        x: "nome", y: "valor",
        text: d => fmtPct(d.valor),
        dy: -6, textAnchor: "middle",
        fontSize: 10, fill: "var(--theme-foreground-muted)",
      }),
      Plot.ruleY([0]),
    ],
  });
}

export function graficoRankingHorizontal(dados, chave, Plot) {
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
    marginLeft: 140, marginRight: 40, marginTop: 8, marginBottom: 36,
    width: 340, height: 340,
    style: { fontSize: "14px" },
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
    style: { fontSize: "14px" },
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
    style: { fontSize: "14px" },
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

// ── Gráfico 2f: Comparação de métricas — Coordenadas Paralelas ───────────────
/**
 * Parallel coordinates: cada aluno = uma linha conectando seus valores nos
 * 3 eixos verticais (Precisão, Objetivos, Fluidez).
 * Cor da linha = desempenho médio (semáforo clínico).
 * Escala sem limite de alunos: feixes revelam padrões coletivos.
 */
export function graficoParaleloMultimetrica(dados) {
  const METRICAS = [
    { label: "Precisão",  chave: "precisao"  },
    { label: "Objetivos", chave: "objetivos" },
    { label: "Fluidez",   chave: "fluidez"   },
  ];

  const comMetricas = dados.filter(d => d.metricas);
  if (!comMetricas.length) return null;

  const ns   = "http://www.w3.org/2000/svg";
  const W    = 500, H = 300;
  const ML   = 60, MR = 60, MT = 30, MB = 32;
  const innerW = W - ML - MR;
  const innerH = H - MT - MB;
  const N      = METRICAS.length;
  const axisX  = (i) => ML + (i / (N - 1)) * innerW;
  const valY   = (v) => MT + innerH - (v / 100) * innerH;

  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", W); svg.setAttribute("height", H);
  svg.style.cssText = "display:block;font-family:inherit;overflow:visible;";

  // ── Faixas de referência horizontal (40% e 70%) ───────────────────────────
  for (const { pct, cor, lbl } of [
    { pct: 70, cor: "#5ba85b", lbl: "Meta 70%" },
    { pct: 40, cor: "#e6a817", lbl: "40%"      },
  ]) {
    const y = valY(pct);
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", ML); line.setAttribute("x2", W - MR);
    line.setAttribute("y1", y);  line.setAttribute("y2", y);
    line.setAttribute("stroke", cor);
    line.setAttribute("stroke-width", "1");
    line.setAttribute("stroke-dasharray", "4,3");
    line.setAttribute("stroke-opacity", "0.5");
    svg.append(line);

    const t = document.createElementNS(ns, "text");
    t.setAttribute("x", W - MR + 3); t.setAttribute("y", y + 3);
    t.setAttribute("font-size", "10"); t.setAttribute("fill", cor);
    t.setAttribute("font-weight", "600");
    t.textContent = lbl;
    svg.append(t);
  }

  // ── Linhas dos alunos ─────────────────────────────────────────────────────
  // Ordenar por média para que alunos melhores fiquem por cima (z-order)
  const ordenados = [...comMetricas].sort(
    (a, b) => (mediaMetricas(a.metricas) ?? 0) - (mediaMetricas(b.metricas) ?? 0)
  );

  const lineEls = new Map();
  const dotEls  = new Map();
  const defaultAlpha = comMetricas.length > 6 ? 0.45 : 0.7;
  const defaultSW    = comMetricas.length > 10 ? "1.2" : "1.8";

  for (const d of ordenados) {
    const media = mediaMetricas(d.metricas) ?? 0;
    const cor   = media >= 70 ? "#166534" : media >= 40 ? "#854d0e" : "#991b1b";

    const pts = METRICAS.map((m, i) => {
      const v = d.metricas[m.chave] ?? 0;
      return `${axisX(i)},${valY(v)}`;
    }).join(" ");

    const poly = document.createElementNS(ns, "polyline");
    poly.setAttribute("points", pts);
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke", cor);
    poly.setAttribute("stroke-width", defaultSW);
    poly.setAttribute("stroke-opacity", defaultAlpha);

    const title = document.createElementNS(ns, "title");
    title.textContent = [
      d.aluno.nome_completo,
      ...METRICAS.map(m => `${m.label}: ${(d.metricas[m.chave] ?? 0).toFixed(1)}%`),
      `Média: ${media.toFixed(1)}%`,
    ].join("\n");
    poly.append(title);
    svg.append(poly);
    lineEls.set(d.aluno.nome_completo, poly);

    // Pontos nos eixos
    if (comMetricas.length <= 10) {
      const dots = [];
      METRICAS.forEach((m, i) => {
        const v = d.metricas[m.chave] ?? 0;
        const dot = document.createElementNS(ns, "circle");
        dot.setAttribute("cx", axisX(i)); dot.setAttribute("cy", valY(v));
        dot.setAttribute("r", "3");
        dot.setAttribute("fill", cor); dot.setAttribute("fill-opacity", "0.8");
        dot.setAttribute("stroke", "white"); dot.setAttribute("stroke-width", "1");
        svg.append(dot);
        dots.push(dot);
      });
      dotEls.set(d.aluno.nome_completo, dots);
    }
  }

  function highlightParalelo(nome) {
    lineEls.forEach((poly, n) => {
      if (!nome || n === nome) {
        poly.setAttribute("stroke-opacity", n === nome ? "0.9" : defaultAlpha);
        poly.setAttribute("stroke-width",   n === nome ? "3"   : defaultSW);
        if (n === nome) poly.parentNode?.appendChild(poly);
      } else {
        poly.setAttribute("stroke-opacity", "0.07");
        poly.setAttribute("stroke-width", defaultSW);
      }
    });
    dotEls.forEach((dots, n) => {
      dots.forEach(dot => dot.setAttribute("fill-opacity", !nome || n === nome ? "0.8" : "0.07"));
    });
  }

  // ── Eixos verticais + ticks + labels ─────────────────────────────────────
  METRICAS.forEach(({ label }, i) => {
    const x = axisX(i);

    // Eixo
    const axis = document.createElementNS(ns, "line");
    axis.setAttribute("x1", x); axis.setAttribute("x2", x);
    axis.setAttribute("y1", MT); axis.setAttribute("y2", MT + innerH);
    axis.setAttribute("stroke", "#9ca3af"); axis.setAttribute("stroke-width", "1.5");
    svg.append(axis);

    // Ticks 0/50/100
    for (const pct of [0, 50, 100]) {
      const ty = valY(pct);
      const tick = document.createElementNS(ns, "line");
      tick.setAttribute("x1", x - 4); tick.setAttribute("x2", x + 4);
      tick.setAttribute("y1", ty); tick.setAttribute("y2", ty);
      tick.setAttribute("stroke", "#9ca3af"); tick.setAttribute("stroke-width", "1");
      svg.append(tick);

      if (i === 0) {
        const tl = document.createElementNS(ns, "text");
        tl.setAttribute("x", x - 8); tl.setAttribute("y", ty + 4);
        tl.setAttribute("text-anchor", "end"); tl.setAttribute("font-size", "11");
        tl.setAttribute("fill", "#6b7280");
        tl.textContent = `${pct}%`;
        svg.append(tl);
      }
    }

    // Label do eixo no SVG
    const t = document.createElementNS(ns, "text");
    t.setAttribute("x", x); t.setAttribute("y", H - MB + 19);
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("font-size", "12"); t.setAttribute("font-weight", "700");
    t.setAttribute("fill", "var(--theme-foreground)");
    t.textContent = label;
    svg.append(t);
  }); // fim METRICAS.forEach

  // ── Footer: legenda cores + legenda alunos (DOM) ──────────────────────────
  const footer = document.createElement("div");
  footer.style.cssText = "display:flex;flex-direction:column;gap:12px;margin-top:8px;padding:0 4px;";

  // Legenda de cores
  const rowCores = document.createElement("div");
  rowCores.style.cssText = "display:flex;gap:18px;";
  for (const [cor, lbl] of [["#166534","≥ 70%"], ["#854d0e","40–70%"], ["#991b1b","< 40%"]]) {
    const item = document.createElement("span");
    item.style.cssText = "display:inline-flex;align-items:center;gap:5px;font-size:12px;color:#555;";
    const sq = document.createElement("span");
    sq.style.cssText = `width:10px;height:10px;border-radius:2px;background:${cor};flex-shrink:0;`;
    item.append(sq, lbl);
    rowCores.append(item);
  }

  // Legenda de alunos
  const rowAlunos = document.createElement("div");
  rowAlunos.style.cssText = "display:flex;flex-wrap:wrap;gap:8px 18px;";
  for (const d of [...ordenados].reverse()) {
    const media = mediaMetricas(d.metricas) ?? 0;
    const cor   = media >= 70 ? "#166534" : media >= 40 ? "#854d0e" : "#991b1b";
    const item  = document.createElement("span");
    item.style.cssText = "display:inline-flex;align-items:center;gap:6px;font-size:13px;";
    const line = document.createElement("span");
    line.style.cssText = `display:inline-block;width:18px;height:2.5px;border-radius:2px;background:${cor};flex-shrink:0;`;
    const lbl = document.createElement("span");
    lbl.style.cssText = `color:${cor};font-weight:600;`;
    lbl.textContent = `${d.aluno.nome_completo} (${media.toFixed(0)}%)`;
    item.append(line, lbl);
    rowAlunos.append(item);
  }

  footer.append(rowCores, rowAlunos);

  const wrap = document.createElement("div");
  wrap.append(svg, footer);
  return { el: wrap, highlight: highlightParalelo };
}

// ── Gráfico 2e: Comparação de métricas — Radar ───────────────────────────────
/**
 * Radar chart (spider) por aluno — cada polígono = perfil de um aluno.
 * 3 eixos: Precisão, Objetivos, Fluidez (0–100).
 * Referência tracejada em 70% (meta clínica).
 * Implementado em SVG puro — Observable Plot não tem suporte polar nativo.
 */
export function graficoRadarMultimetrica(dados) {
  const METRICAS = [
    { label: "Precisão",  chave: "precisao"  },
    { label: "Objetivos", chave: "objetivos" },
    { label: "Fluidez",   chave: "fluidez"   },
  ];
  const CORES = [
    "#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f",
    "#edc948","#b07aa1","#ff9da7","#9c755f","#bab0ac",
  ];

  const comMetricas = dados.filter(d => d.metricas);
  if (!comMetricas.length) return null;

  const ns   = "http://www.w3.org/2000/svg";
  const CX   = 130, CY = 120, R = 90;
  const N    = METRICAS.length;
  const W    = 340, H = 260;

  // ângulo de cada eixo (topo = primeiro)
  const angulo = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const polar  = (v, i) => {
    const r = (v / 100) * R;
    const a = angulo(i);
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  };

  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", W); svg.setAttribute("height", H);
  svg.style.cssText = "display:block;font-family:inherit;overflow:visible;";

  // ── Anéis de fundo (20%, 40%, 60%, 80%, 100%) ────────────────────────────
  for (const pct of [20, 40, 60, 80, 100]) {
    const pts = METRICAS.map((_, i) => polar(pct, i).join(",")).join(" ");
    const poly = document.createElementNS(ns, "polygon");
    poly.setAttribute("points", pts);
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke", pct === 100 ? "#d1d5db" : "#e5e7eb");
    poly.setAttribute("stroke-width", pct === 100 ? "1.2" : "0.8");
    svg.append(poly);

    // Rótulo do anel
    const [lx, ly] = polar(pct, 0);
    const lbl = document.createElementNS(ns, "text");
    lbl.setAttribute("x", lx + 3); lbl.setAttribute("y", ly - 2);
    lbl.setAttribute("font-size", "7"); lbl.setAttribute("fill", "#bbb");
    lbl.textContent = `${pct}%`;
    svg.append(lbl);
  }

  // ── Anel de meta clínica (70%) ────────────────────────────────────────────
  const metaPts = METRICAS.map((_, i) => polar(70, i).join(",")).join(" ");
  const metaPoly = document.createElementNS(ns, "polygon");
  metaPoly.setAttribute("points", metaPts);
  metaPoly.setAttribute("fill", "rgba(91,168,91,.08)");
  metaPoly.setAttribute("stroke", "#5ba85b");
  metaPoly.setAttribute("stroke-width", "1.2");
  metaPoly.setAttribute("stroke-dasharray", "4,3");
  svg.append(metaPoly);

  // ── Eixos radiais + labels ────────────────────────────────────────────────
  METRICAS.forEach(({ label }, i) => {
    const [ex, ey] = polar(100, i);
    const axis = document.createElementNS(ns, "line");
    axis.setAttribute("x1", CX); axis.setAttribute("y1", CY);
    axis.setAttribute("x2", ex); axis.setAttribute("y2", ey);
    axis.setAttribute("stroke", "#d1d5db"); axis.setAttribute("stroke-width", "1");
    svg.append(axis);

    // Label do eixo
    const [lx, ly] = polar(115, i);
    const t = document.createElementNS(ns, "text");
    t.setAttribute("x", lx); t.setAttribute("y", ly);
    t.setAttribute("text-anchor", "middle"); t.setAttribute("dominant-baseline", "middle");
    t.setAttribute("font-size", "10"); t.setAttribute("font-weight", "600");
    t.setAttribute("fill", "var(--theme-foreground)");
    t.textContent = label;
    svg.append(t);
  });

  // ── Polígono por aluno ────────────────────────────────────────────────────
  comMetricas.forEach((d, idx) => {
    const cor  = CORES[idx % CORES.length];
    const vals = METRICAS.map(m => d.metricas[m.chave] ?? 0);
    const pts  = vals.map((v, i) => polar(v, i).join(",")).join(" ");

    const poly = document.createElementNS(ns, "polygon");
    poly.setAttribute("points", pts);
    poly.setAttribute("fill", cor);
    poly.setAttribute("fill-opacity", "0.12");
    poly.setAttribute("stroke", cor);
    poly.setAttribute("stroke-width", "1.8");
    svg.append(poly);

    // Pontos nos vértices com tooltip
    vals.forEach((v, i) => {
      const [px, py] = polar(v, i);
      const dot = document.createElementNS(ns, "circle");
      dot.setAttribute("cx", px); dot.setAttribute("cy", py);
      dot.setAttribute("r", "3.5");
      dot.setAttribute("fill", cor);
      dot.setAttribute("stroke", "white"); dot.setAttribute("stroke-width", "1.5");
      const title = document.createElementNS(ns, "title");
      title.textContent = `${d.aluno.nome_completo}\n${METRICAS[i].label}: ${v.toFixed(1)}%`;
      dot.append(title);
      svg.append(dot);
    });
  });

  // ── Legenda lateral ───────────────────────────────────────────────────────
  const legX = CX * 2 + 8, legY0 = 20;
  comMetricas.forEach((d, idx) => {
    const cor = CORES[idx % CORES.length];
    const y   = legY0 + idx * 18;

    const sq = document.createElementNS(ns, "rect");
    sq.setAttribute("x", legX); sq.setAttribute("y", y - 7);
    sq.setAttribute("width", 10); sq.setAttribute("height", 10);
    sq.setAttribute("rx", 2); sq.setAttribute("fill", cor); sq.setAttribute("fill-opacity", "0.8");
    svg.append(sq);

    const media = mediaMetricas(d.metricas);
    const t = document.createElementNS(ns, "text");
    t.setAttribute("x", legX + 14); t.setAttribute("y", y + 1);
    t.setAttribute("font-size", "9.5"); t.setAttribute("fill", "var(--theme-foreground)");
    const nome = d.aluno.nome_completo.split(" ")[0]; // primeiro nome
    t.textContent = `${nome} (${media?.toFixed(0) ?? "—"}%)`;
    svg.append(t);
  });

  // ── Legenda meta ──────────────────────────────────────────────────────────
  const metaY = legY0 + comMetricas.length * 18 + 10;
  const metaLine = document.createElementNS(ns, "line");
  metaLine.setAttribute("x1", legX); metaLine.setAttribute("x2", legX + 10);
  metaLine.setAttribute("y1", metaY - 2); metaLine.setAttribute("y2", metaY - 2);
  metaLine.setAttribute("stroke", "#5ba85b"); metaLine.setAttribute("stroke-width", "1.5");
  metaLine.setAttribute("stroke-dasharray", "4,2");
  svg.append(metaLine);
  const metaT = document.createElementNS(ns, "text");
  metaT.setAttribute("x", legX + 14); metaT.setAttribute("y", metaY + 1);
  metaT.setAttribute("font-size", "9"); metaT.setAttribute("fill", "#5ba85b");
  metaT.textContent = "Meta 70%";
  svg.append(metaT);

  const wrap = document.createElement("div");
  wrap.append(svg);
  return wrap;
}

// ── Gráfico 2d: Comparação de métricas — Barras Empilhadas ───────────────────
/**
 * Barra horizontal empilhada por aluno: Precisão + Objetivos + Fluidez.
 * Cada segmento = valor da métrica. Total máximo visível = 300 (3×100).
 * Ordenado por soma decrescente.
 */
export function graficoBarraEmpilhadaMultimetrica(dados, Plot) {
  const METRICAS = [
    { label: "Precisão",  chave: "precisao",  cor: "#4a90e2" },
    { label: "Objetivos", chave: "objetivos", cor: "#5ba85b" },
    { label: "Fluidez",   chave: "fluidez",   cor: "#e07b54" },
  ];

  const comMetricas = dados.filter(d => d.metricas);
  if (!comMetricas.length) return null;

  const rows = comMetricas.flatMap(d =>
    METRICAS.map(m => ({
      nome:    d.aluno.nome_completo,
      metrica: m.label,
      valor:   d.metricas[m.chave] ?? 0,
    }))
  );

  const nomes = [...comMetricas]
    .sort((a, b) => mediaMetricas(b.metricas) - mediaMetricas(a.metricas))
    .map(d => d.aluno.nome_completo);

  return Plot.plot({
    marginLeft: 130, marginRight: 40, marginTop: 8, marginBottom: 16,
    width: 340,
    height: Math.max(160, nomes.length * 32 + 48),
    style: { fontSize: "14px" },
    x: { label: "Soma (%)", domain: [0, 300], grid: true, ticks: 4 },
    y: { label: null, domain: nomes },
    color: {
      domain: METRICAS.map(m => m.label),
      range:  METRICAS.map(m => m.cor),
      legend: true,
    },
    marks: [
      Plot.barX(rows, Plot.stackX({
        x: "valor", y: "nome", fill: "metrica",
        order: METRICAS.map(m => m.label),
        tip: true,
        title: d => `${d.metrica}: ${fmtPct(d.valor)}`,
      })),
      Plot.ruleX([0]),
    ],
  });
}

// ── Gráfico 2c: Comparação de métricas — Linha ────────────────────────────────
/**
 * Linha por métrica (Precisão, Objetivos, Fluidez) ao longo dos alunos.
 * Alunos ordenados por média decrescente no eixo X.
 * Referências tracejadas em 70% (Bom) e 40% (Regular).
 */
export function graficoLinhaMultimetrica(dados, Plot) {
  const METRICAS = [
    { label: "Precisão",  chave: "precisao",  cor: "#4a90e2" },
    { label: "Objetivos", chave: "objetivos", cor: "#5ba85b" },
    { label: "Fluidez",   chave: "fluidez",   cor: "#e07b54" },
  ];

  const comMetricas = dados.filter(d => d.metricas);
  if (!comMetricas.length) return null;

  // Ordenar alunos por média decrescente
  const ordenados = [...comMetricas].sort((a, b) => mediaMetricas(b.metricas) - mediaMetricas(a.metricas));
  const nomes = ordenados.map(d => d.aluno.nome_completo);

  const rows = ordenados.flatMap(d =>
    METRICAS.map(m => ({
      nome:    d.aluno.nome_completo,
      metrica: m.label,
      valor:   d.metricas[m.chave] ?? 0,
    }))
  );

  return Plot.plot({
    marginLeft: 28, marginRight: 8, marginTop: 8,
    marginBottom: nomes.length > 4 ? 70 : 48,
    width: 340,
    height: 220,
    style: { fontSize: "14px" },
    x: {
      label: null,
      domain: nomes,
      tickRotate: nomes.length > 3 ? -35 : 0,
    },
    y: { label: "↑ %", domain: [0, 100], grid: true, ticks: 5 },
    color: {
      domain: METRICAS.map(m => m.label),
      range:  METRICAS.map(m => m.cor),
      legend: true,
    },
    marks: [
      Plot.ruleY([70], { stroke: "#5ba85b", strokeDasharray: "4,3", strokeOpacity: 0.5 }),
      Plot.ruleY([40], { stroke: "#e6a817", strokeDasharray: "4,3", strokeOpacity: 0.5 }),
      Plot.line(rows, {
        x: "nome", y: "valor", stroke: "metrica",
        strokeWidth: 2, curve: "monotone-x",
      }),
      Plot.dot(rows, {
        x: "nome", y: "valor", fill: "metrica",
        r: 4, tip: true,
        title: d => `${d.nome}\n${d.metrica}: ${fmtPct(d.valor)}`,
      }),
    ],
  });
}

// ── Gráfico 2b: Comparação de métricas — Waffle ───────────────────────────────
/**
 * Waffle chart por métrica (Precisão, Objetivos, Fluidez).
 * Cada faceta mostra a média dos alunos numa escala 0–100.
 * Círculos de fundo = 100 unidades; círculos preenchidos = média da métrica.
 */
export function graficoWaffleMultimetrica(dados, Plot) {
  const comMetricas = dados.filter(d => d.metricas);
  if (!comMetricas.length) return null;

  const avg = (chave) => {
    const vals = comMetricas.map(d => d.metricas[chave] ?? 0);
    return vals.reduce((s, v) => s + v, 0) / vals.length;
  };

  const survey = [
    { question: "Precisão",  yes: Math.round(avg("precisao")),  cor: "#4a90e2" },
    { question: "Objetivos", yes: Math.round(avg("objetivos")), cor: "#5ba85b" },
    { question: "Fluidez",   yes: Math.round(avg("fluidez")),   cor: "#e07b54" },
  ];

  const TOTAL = 100;

  return Plot.plot({
    axis: null,
    label: null,
    height: 260,
    marginTop: 20,
    marginBottom: 60,
    marks: [
      Plot.axisFx({ lineWidth: 10, anchor: "bottom", dy: 20, fontSize: 11 }),
      Plot.waffleY({ length: 1 }, {
        y: TOTAL,
        fillOpacity: 0.15,
        rx: "100%",
      }),
      Plot.waffleY(survey, {
        fx: "question",
        y: "yes",
        fill: "cor",
        rx: "100%",
        tip: true,
        title: d => `${d.question}: ${d.yes}%`,
      }),
      Plot.text(survey, {
        fx: "question",
        text: d => `${d.yes}%`,
        frameAnchor: "bottom",
        lineAnchor: "top",
        dy: 6,
        fill: "cor",
        fontSize: 20,
        fontWeight: "bold",
      }),
    ],
  });
}

// ── Gráfico 3b: Progresso — Bullet Graph (horizontal) ────────────────────────
export function graficoBulletProgresso(dados, onSelect) {
  const rows = dados
    .filter(d => d.metricas)
    .map(d => ({
      nome:      d.aluno.nome_completo,
      media:     mediaMetricas(d.metricas) ?? 0,
      precisao:  d.metricas.precisao  ?? 0,
      objetivos: d.metricas.objetivos ?? 0,
      fluidez:   d.metricas.fluidez   ?? 0,
    }))
    .sort((a, b) => b.media - a.media);

  if (!rows.length) return null;

  const NAME_W  = 220;
  const INNER_W = 280;
  const LABEL_W = 84;
  const TOP     = 8;
  const BOTTOM  = 28;
  const W       = NAME_W + INNER_W + LABEL_W;
  const ROW_H   = Math.min(112, Math.round((680 - TOP - BOTTOM) / rows.length));
  const BAR_H   = Math.round(ROW_H * 0.85);
  const H       = TOP + rows.length * ROW_H + BOTTOM;

  const valX = (pct) => NAME_W + (pct / 100) * INNER_W;

  const ns  = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", W);
  svg.setAttribute("height", H);
  svg.style.cssText = "display:block;overflow:visible;font-family:system-ui,sans-serif;";

  const bands = [
    { x1: 0,  x2: 40,  fill: "#fee2e2", label: "Atenção" },
    { x1: 40, x2: 70,  fill: "#fef9c3", label: "Regular" },
    { x1: 70, x2: 100, fill: "#dcfce7", label: "Bom"     },
  ];

  for (const b of bands) {
    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", NAME_W + (b.x1 / 100) * INNER_W);
    rect.setAttribute("y", TOP);
    rect.setAttribute("width", ((b.x2 - b.x1) / 100) * INNER_W);
    rect.setAttribute("height", rows.length * ROW_H);
    rect.setAttribute("fill", b.fill);
    rect.setAttribute("fill-opacity", "0.5");
    svg.append(rect);
  }

  for (const tick of [0, 40, 70, 100]) {
    const tx     = valX(tick);
    const isMeta = tick === 70;

    const gl = document.createElementNS(ns, "line");
    gl.setAttribute("x1", tx); gl.setAttribute("x2", tx);
    gl.setAttribute("y1", TOP); gl.setAttribute("y2", TOP + rows.length * ROW_H);
    gl.setAttribute("stroke", isMeta ? "#1a3a5c" : "#e5e7eb");
    gl.setAttribute("stroke-width", isMeta ? "2" : "1");
    if (isMeta) gl.setAttribute("stroke-dasharray", "4,3");
    svg.append(gl);

    const tl = document.createElementNS(ns, "text");
    tl.setAttribute("x", tx);
    tl.setAttribute("y", TOP + rows.length * ROW_H + 16);
    tl.setAttribute("text-anchor", "middle");
    tl.setAttribute("font-size", "14");
    tl.setAttribute("fill", isMeta ? "#1a3a5c" : "#aaa");
    if (isMeta) tl.setAttribute("font-weight", "700");
    tl.textContent = `${tick}%`;
    svg.append(tl);
  }

  const barEls  = new Map();
  const nomeEls = new Map();
  const lblEls  = new Map();
  let currentSelected = null;

  function highlight(nome) {
    currentSelected = nome;
    barEls.forEach((bar, n) => {
      bar.setAttribute("opacity", !nome || n === nome ? "1" : "0.18");
      bar.setAttribute("stroke", n === nome ? "#1a3a5c" : "none");
      bar.setAttribute("stroke-width", "2");
    });
    nomeEls.forEach((el, n) => el.setAttribute("opacity", !nome || n === nome ? "1" : "0.18"));
    lblEls.forEach((el, n)  => el.setAttribute("opacity", !nome || n === nome ? "1" : "0.18"));
  }

  rows.forEach((r, rowIdx) => {
    const cy       = TOP + rowIdx * ROW_H + ROW_H / 2;
    const barColor = r.media >= 70 ? "#5ba85b" : r.media >= 40 ? "#e6a817" : "#e07b54";

    const nomeEl = document.createElementNS(ns, "text");
    nomeEl.setAttribute("x", NAME_W - 8);
    nomeEl.setAttribute("y", cy + 5);
    nomeEl.setAttribute("text-anchor", "end");
    nomeEl.setAttribute("font-size", "14");
    nomeEl.setAttribute("fill", "var(--theme-foreground)");
    nomeEl.textContent = r.nome.length > 13 ? r.nome.slice(0, 12) + "…" : r.nome;
    svg.append(nomeEl);
    nomeEls.set(r.nome, nomeEl);

    const bar = document.createElementNS(ns, "rect");
    bar.setAttribute("x", NAME_W);
    bar.setAttribute("y", cy - BAR_H / 2);
    bar.setAttribute("width", (r.media / 100) * INNER_W);
    bar.setAttribute("height", BAR_H);
    bar.setAttribute("fill", barColor);
    bar.setAttribute("rx", "2");
    const title = document.createElementNS(ns, "title");
    title.textContent = `${r.nome}\nMédia: ${r.media.toFixed(1)}%\nPrecisão: ${r.precisao.toFixed(1)}%  Objetivos: ${r.objetivos.toFixed(1)}%  Fluidez: ${r.fluidez.toFixed(1)}%`;
    bar.append(title);
    svg.append(bar);
    barEls.set(r.nome, bar);

    const lbl = document.createElementNS(ns, "text");
    lbl.setAttribute("x", NAME_W + (r.media / 100) * INNER_W + 5);
    lbl.setAttribute("y", cy + 5);
    lbl.style.fontSize = "10px";
    lbl.setAttribute("fill", "var(--theme-foreground-muted)");
    lbl.textContent = `${r.media.toFixed(1)}%`;
    svg.append(lbl);
    lblEls.set(r.nome, lbl);

    // Área clicável cobrindo toda a linha
    const hit = document.createElementNS(ns, "rect");
    hit.setAttribute("x", "0");
    hit.setAttribute("y", cy - ROW_H / 2);
    hit.setAttribute("width", W);
    hit.setAttribute("height", ROW_H);
    hit.setAttribute("fill", "transparent");
    hit.style.cursor = "pointer";
    hit.addEventListener("click", () => {
      const next = currentSelected === r.nome ? null : r.nome;
      highlight(next);
      if (onSelect) onSelect(next);
    });
    svg.append(hit);
  });

  // ── Legenda no rodapé ─────────────────────────────────────────────────────
  const footer = document.createElement("div");
  footer.style.cssText = "display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:6px;font-size:14px;color:#555;";
  for (const b of bands) {
    const item = document.createElement("span");
    item.style.cssText = "display:inline-flex;align-items:center;gap:5px;";
    const sq = document.createElement("span");
    sq.style.cssText = `width:10px;height:10px;border-radius:2px;background:${b.fill};border:1px solid rgba(0,0,0,.1);flex-shrink:0;`;
    item.append(sq, b.label);
    footer.append(item);
  }
  const metaItem = document.createElement("span");
  metaItem.style.cssText = "display:inline-flex;align-items:center;gap:5px;";
  const metaLine = document.createElement("span");
  metaLine.style.cssText = "display:inline-block;width:2px;height:12px;background:#1a3a5c;flex-shrink:0;";
  metaItem.append(metaLine, "Meta (70%)");
  footer.append(metaItem);

  const wrap = document.createElement("div");
  wrap.append(svg, footer);
  return { el: wrap, highlight };
}

// ── Gráfico Ternário ──────────────────────────────────────────────────────────
/**
 * Triângulo equilátero onde cada vértice = 100% de uma métrica.
 * Posição do ponto revela o perfil relativo do aluno:
 * perto de um vértice → forte naquela métrica em relação às demais.
 * Os valores são normalizados pela soma (Precisão + Objetivos + Fluidez).
 */
export function graficoTernario(dados) {
  const rows = dados
    .filter(d => d.metricas)
    .map(d => ({
      nome:      d.aluno.nome_completo,
      media:     mediaMetricas(d.metricas) ?? 0,
      precisao:  d.metricas.precisao  ?? 0,
      objetivos: d.metricas.objetivos ?? 0,
      fluidez:   d.metricas.fluidez   ?? 0,
    }));

  if (!rows.length) return null;

  const SIDE = 370;
  const ML = 80, MR = 80, MT = 58, MB = 48;
  const W  = SIDE + ML + MR;
  const H  = Math.round(SIDE * Math.sqrt(3) / 2) + MT + MB;

  // Vértices SVG: A = Precisão (esq), B = Objetivos (dir), C = Fluidez (topo)
  const vA = [ML,            H - MB];
  const vB = [ML + SIDE,     H - MB];
  const vC = [ML + SIDE / 2, MT];

  function bary(a, b, c) {
    const S = (a + b + c) || 1;
    return [
      (a / S) * vA[0] + (b / S) * vB[0] + (c / S) * vC[0],
      (a / S) * vA[1] + (b / S) * vB[1] + (c / S) * vC[1],
    ];
  }

  const ns  = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width",  W);
  svg.setAttribute("height", H);
  svg.style.cssText = "display:block;overflow:visible;font-family:system-ui,sans-serif;";

  function mkLine(p1, p2, stroke, sw, dash) {
    const el = document.createElementNS(ns, "line");
    el.setAttribute("x1", p1[0]); el.setAttribute("y1", p1[1]);
    el.setAttribute("x2", p2[0]); el.setAttribute("y2", p2[1]);
    el.setAttribute("stroke", stroke);
    el.setAttribute("stroke-width", sw);
    if (dash) el.setAttribute("stroke-dasharray", dash);
    return el;
  }

  function mkText(x, y, str, anchor, size, fill, weight) {
    const el = document.createElementNS(ns, "text");
    el.setAttribute("x", x); el.setAttribute("y", y);
    el.setAttribute("text-anchor", anchor);
    el.setAttribute("font-size", size);
    el.setAttribute("fill", fill);
    if (weight) el.setAttribute("font-weight", weight);
    el.textContent = str;
    return el;
  }

  // ── Fundo do triângulo ────────────────────────────────────────────────────
  const bg = document.createElementNS(ns, "polygon");
  bg.setAttribute("points", [vA, vB, vC].map(v => v.join(",")).join(" "));
  bg.setAttribute("fill",         "#f9fafb");
  bg.setAttribute("stroke",       "#9ca3af");
  bg.setAttribute("stroke-width", "1.5");
  svg.append(bg);

  // ── Grade e ticks em 25 / 50 / 75 % ──────────────────────────────────────
  for (const t of [0.25, 0.5, 0.75]) {
    const col = t === 0.5 ? "#d1d5db" : "#e5e7eb";
    const sw  = t === 0.5 ? "1"       : "0.6";
    const pct = String(Math.round(t * 100));

    // Precisão = t → paralela a BC
    svg.append(mkLine(bary(t, 1 - t, 0), bary(t, 0, 1 - t), col, sw));
    // Objetivos = t → paralela a AC
    svg.append(mkLine(bary(1 - t, t, 0), bary(0, t, 1 - t), col, sw));
    // Fluidez = t   → paralela a AB
    svg.append(mkLine(bary(1 - t, 0, t), bary(0, 1 - t, t), col, sw));

    // Ticks: Precisão no lado esquerdo (AC: a=t, b=0, c=1-t)
    const [lx, ly] = bary(t, 0, 1 - t);
    svg.append(mkText(lx - 6, ly + 4, pct, "end", "9", "#aaa"));

    // Ticks: Objetivos no lado inferior (AB: a=1-t, b=t, c=0)
    const [bx, by] = bary(1 - t, t, 0);
    svg.append(mkText(bx, by + 14, pct, "middle", "9", "#aaa"));

    // Ticks: Fluidez no lado direito (BC: a=0, b=1-t, c=t)
    const [rx, ry] = bary(0, 1 - t, t);
    svg.append(mkText(rx + 6, ry + 4, pct, "start", "9", "#aaa"));
  }

  // ── Labels dos vértices ───────────────────────────────────────────────────
  svg.append(mkText(vA[0] - 10, vA[1] + 5,  "Precisão",  "end",    "13", "var(--theme-foreground)", "700"));
  svg.append(mkText(vA[0] - 10, vA[1] + 18, "100%",      "end",    "9",  "#888"));
  svg.append(mkText(vB[0] + 10, vB[1] + 5,  "Objetivos", "start",  "13", "var(--theme-foreground)", "700"));
  svg.append(mkText(vB[0] + 10, vB[1] + 18, "100%",      "start",  "9",  "#888"));
  svg.append(mkText(vC[0],      vC[1] - 13, "Fluidez",   "middle", "13", "var(--theme-foreground)", "700"));
  svg.append(mkText(vC[0],      vC[1] - 25, "100%",      "middle", "9",  "#888"));

  // ── Centroide de referência (1/3, 1/3, 1/3) ───────────────────────────────
  const [cx, cy] = bary(1, 1, 1);
  const cRef = document.createElementNS(ns, "circle");
  cRef.setAttribute("cx", cx); cRef.setAttribute("cy", cy); cRef.setAttribute("r", "3");
  cRef.setAttribute("fill", "none"); cRef.setAttribute("stroke", "#9ca3af");
  cRef.setAttribute("stroke-width", "1"); cRef.setAttribute("stroke-dasharray", "2,2");
  svg.append(cRef);
  svg.append(mkText(cx + 5, cy - 5, "equil.", "start", "8", "#bbb"));

  // ── Pontos dos alunos ─────────────────────────────────────────────────────
  for (const r of rows) {
    const [px, py] = bary(r.precisao, r.objetivos, r.fluidez);
    const cor = r.media >= 70 ? "#166534" : r.media >= 40 ? "#854d0e" : "#991b1b";

    const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("cx", px); dot.setAttribute("cy", py); dot.setAttribute("r", "7");
    dot.setAttribute("fill", cor); dot.setAttribute("stroke", "white"); dot.setAttribute("stroke-width", "1.5");
    const title = document.createElementNS(ns, "title");
    title.textContent = `${r.nome}\nPrecisão: ${r.precisao.toFixed(1)}%\nObjetivos: ${r.objetivos.toFixed(1)}%\nFluidez: ${r.fluidez.toFixed(1)}%\nMédia: ${r.media.toFixed(1)}%`;
    dot.append(title);
    svg.append(dot);

    const lbl = document.createElementNS(ns, "text");
    lbl.setAttribute("x", px); lbl.setAttribute("y", py - 11);
    lbl.setAttribute("text-anchor", "middle");
    lbl.setAttribute("font-size", "10"); lbl.setAttribute("font-weight", "600");
    lbl.setAttribute("fill", cor);
    lbl.textContent = r.nome.split(" ")[0];
    svg.append(lbl);
  }

  // ── Legenda ───────────────────────────────────────────────────────────────
  const footer = document.createElement("div");
  footer.style.cssText = "display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:8px;font-size:12px;color:#555;";
  for (const [cor, lbl] of [["#166534","Bom (≥ 70%)"], ["#854d0e","Regular (40–70%)"], ["#991b1b","Atenção (< 40%)"]]) {
    const item = document.createElement("span");
    item.style.cssText = "display:inline-flex;align-items:center;gap:5px;";
    const dot = document.createElement("span");
    dot.style.cssText = `width:10px;height:10px;border-radius:50%;background:${cor};flex-shrink:0;`;
    item.append(dot, lbl);
    footer.append(item);
  }

  const wrap = document.createElement("div");
  wrap.append(svg, footer);
  return wrap;
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
  const rowEls = new Map();
  rows.forEach((r, i) => {
    const tr = tbody.insertRow();
    tr.style.background = i % 2 === 0 ? "transparent" : "rgba(0,0,0,.02)";
    tr.style.cursor = "default";
    rowEls.set(r.nome, tr);

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

  function highlightTable(nome) {
    rowEls.forEach((tr, n) => {
      tr.style.opacity = !nome || n === nome ? "1" : "0.2";
      tr.style.outline = n === nome ? "2px solid #1a3a5c" : "";
      tr.style.outlineOffset = "-1px";
    });
  }

  const scrollWrap = document.createElement("div");
  scrollWrap.style.overflowX = "auto";
  scrollWrap.append(table);

  const wrap = document.createElement("div");
  wrap.append(legWrap, scrollWrap);
  return { el: wrap, highlight: highlightTable };
}
