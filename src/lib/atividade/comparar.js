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

  for (const d of ordenados) {
    const media = mediaMetricas(d.metricas) ?? 0;
    const cor   = media >= 70 ? "#166534" : media >= 40 ? "#854d0e" : "#991b1b";
    const alpha = comMetricas.length > 6 ? 0.45 : 0.7;

    const pts = METRICAS.map((m, i) => {
      const v = d.metricas[m.chave] ?? 0;
      return `${axisX(i)},${valY(v)}`;
    }).join(" ");

    const poly = document.createElementNS(ns, "polyline");
    poly.setAttribute("points", pts);
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke", cor);
    poly.setAttribute("stroke-width", comMetricas.length > 10 ? "1.2" : "1.8");
    poly.setAttribute("stroke-opacity", alpha);

    const title = document.createElementNS(ns, "title");
    title.textContent = [
      d.aluno.nome_completo,
      ...METRICAS.map(m => `${m.label}: ${(d.metricas[m.chave] ?? 0).toFixed(1)}%`),
      `Média: ${media.toFixed(1)}%`,
    ].join("\n");
    poly.append(title);
    svg.append(poly);

    // Pontos nos eixos (omitir se muitos alunos)
    if (comMetricas.length <= 10) {
      METRICAS.forEach((m, i) => {
        const v = d.metricas[m.chave] ?? 0;
        const dot = document.createElementNS(ns, "circle");
        dot.setAttribute("cx", axisX(i)); dot.setAttribute("cy", valY(v));
        dot.setAttribute("r", "3");
        dot.setAttribute("fill", cor); dot.setAttribute("fill-opacity", "0.8");
        dot.setAttribute("stroke", "white"); dot.setAttribute("stroke-width", "1");
        svg.append(dot);
      });
    }
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
  return wrap;
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

// ── Gráfico 3b: Progresso — Bullet Graph ─────────────────────────────────────
/**
 * Bullet graph por aluno:
 *   - Faixas de fundo: Atenção (0–40%), Regular (40–70%), Bom (70–100%)
 *   - Barra principal: Média Geral do aluno (Precisão + Objetivos + Fluidez)
 *   - Marcador (linha vertical): 70% — meta de referência
 * Ordenado por média decrescente.
 */
export function graficoBulletProgresso(dados) {
  const rows = dados
    .filter(d => d.metricas)
    .map(d => ({
      nome:  d.aluno.nome_completo,
      media: mediaMetricas(d.metricas) ?? 0,
      precisao:  d.metricas.precisao  ?? 0,
      objetivos: d.metricas.objetivos ?? 0,
      fluidez:   d.metricas.fluidez   ?? 0,
    }))
    .sort((a, b) => b.media - a.media);

  if (!rows.length) return null;

  const COL_W  = 48;   // largura por aluno
  const TOP    = 24;   // margem topo (rótulo de valor)
  const BOTTOM = 72;   // margem inferior (nome + ticks)
  const LEFT   = 38;   // margem esquerda (eixo Y)
  const RIGHT  = 10;
  const BAR_W  = 16;   // largura da barra principal
  const BAND_W = 26;   // largura das faixas de fundo
  const META   = 70;   // marcador de referência (%)
  const innerH = 210;
  const W      = rows.length * COL_W + LEFT + RIGHT;
  const H      = TOP + innerH + BOTTOM;

  const ns = "http://www.w3.org/2000/svg";

  // Y: 0% → base, 100% → topo
  const valY = pct => TOP + innerH * (1 - pct / 100);

  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", W);
  svg.setAttribute("height", H);
  svg.style.cssText = "display:block;overflow:visible;font-family:inherit;";

  const bands = [
    { y1: 0,   y2: 40,  fill: "#fee2e2", label: "Atenção" },
    { y1: 40,  y2: 70,  fill: "#fef9c3", label: "Regular" },
    { y1: 70,  y2: 100, fill: "#dcfce7", label: "Bom"     },
  ];

  // ── Eixo Y: ticks e linhas de grade ──────────────────────────────────────────
  for (const tick of [0, 40, 70, 100]) {
    const ty = valY(tick);
    const gl = document.createElementNS(ns, "line");
    gl.setAttribute("x1", LEFT); gl.setAttribute("x2", LEFT + rows.length * COL_W);
    gl.setAttribute("y1", ty); gl.setAttribute("y2", ty);
    gl.setAttribute("stroke", "#e5e7eb"); gl.setAttribute("stroke-width", "1");
    svg.append(gl);
    const tl = document.createElementNS(ns, "text");
    tl.setAttribute("x", LEFT - 4); tl.setAttribute("y", ty + 4);
    tl.setAttribute("text-anchor", "end"); tl.setAttribute("font-size", "9");
    tl.setAttribute("fill", "#aaa");
    tl.textContent = `${tick}%`;
    svg.append(tl);
  }

  // ── Bullet por aluno ──────────────────────────────────────────────────────────
  rows.forEach((r, i) => {
    const cx = LEFT + i * COL_W + COL_W / 2;
    const cor = r.media >= 70 ? "#166534" : r.media >= 40 ? "#854d0e" : "#991b1b";

    // Faixas de fundo
    for (const b of bands) {
      const by = valY(b.y2);
      const bh = valY(b.y1) - valY(b.y2);
      const rect = document.createElementNS(ns, "rect");
      rect.setAttribute("x", cx - BAND_W / 2); rect.setAttribute("y", by);
      rect.setAttribute("width", BAND_W); rect.setAttribute("height", bh);
      rect.setAttribute("fill", b.fill);
      svg.append(rect);
    }

    // Borda das faixas
    const border = document.createElementNS(ns, "rect");
    border.setAttribute("x", cx - BAND_W / 2); border.setAttribute("y", valY(100));
    border.setAttribute("width", BAND_W); border.setAttribute("height", innerH);
    border.setAttribute("fill", "none");
    border.setAttribute("stroke", "rgba(0,0,0,.08)"); border.setAttribute("stroke-width", "1");
    svg.append(border);

    // Barra principal (média)
    const barH = valY(0) - valY(r.media);
    const bar = document.createElementNS(ns, "rect");
    bar.setAttribute("x", cx - BAR_W / 2); bar.setAttribute("y", valY(r.media));
    bar.setAttribute("width", BAR_W); bar.setAttribute("height", barH);
    bar.setAttribute("fill", cor); bar.setAttribute("rx", "2");
    svg.append(bar);

    // Marcador de meta (70%) — linha horizontal
    const my = valY(META);
    const mark = document.createElementNS(ns, "line");
    mark.setAttribute("x1", cx - BAND_W / 2 - 2); mark.setAttribute("x2", cx + BAND_W / 2 + 2);
    mark.setAttribute("y1", my); mark.setAttribute("y2", my);
    mark.setAttribute("stroke", "#1a3a5c"); mark.setAttribute("stroke-width", "2.5");
    svg.append(mark);

    // Rótulo de valor (acima da barra)
    const lbl = document.createElementNS(ns, "text");
    lbl.setAttribute("x", cx); lbl.setAttribute("y", valY(r.media) - 4);
    lbl.setAttribute("text-anchor", "middle"); lbl.setAttribute("font-size", "10");
    lbl.setAttribute("font-weight", "600"); lbl.setAttribute("fill", cor);
    lbl.textContent = `${r.media.toFixed(1)}%`;
    svg.append(lbl);

    // Nome (baixo, rotacionado)
    const nome = document.createElementNS(ns, "text");
    nome.setAttribute("x", cx); nome.setAttribute("y", TOP + innerH + 10);
    nome.setAttribute("text-anchor", "end");
    nome.setAttribute("font-size", "11"); nome.setAttribute("fill", "var(--theme-foreground)");
    nome.setAttribute("transform", `rotate(-35, ${cx}, ${TOP + innerH + 10})`);
    nome.textContent = r.nome.length > 16 ? r.nome.slice(0, 15) + "…" : r.nome;
    svg.append(nome);

    // Tooltip
    const title = document.createElementNS(ns, "title");
    title.textContent = `${r.nome}\nMédia: ${r.media.toFixed(1)}%\nPrecisão: ${r.precisao.toFixed(1)}%  Objetivos: ${r.objetivos.toFixed(1)}%  Fluidez: ${r.fluidez.toFixed(1)}%`;
    svg.append(title);
  });

  // ── Legenda no rodapé (DOM) ───────────────────────────────────────────────────
  const footer = document.createElement("div");
  footer.style.cssText = "display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:6px;font-size:12px;color:#555;";
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
  metaLine.style.cssText = "display:inline-block;width:14px;height:2px;background:#1a3a5c;flex-shrink:0;";
  metaItem.append(metaLine, "Meta (70%)");
  footer.append(metaItem);

  const wrap = document.createElement("div");
  wrap.style.cssText = "overflow-x:auto;";
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
