// Tooltip explicativa das métricas de O&M (Precisão / Fluidez / Objetivos).
// Usa os mesmos elementos visuais do modal do sistema. Texto em linguagem simples.

const METRICA_DESC = {
  precisao:  { titulo: "Precisão",  texto: "Mostra o quanto o aluno evitou bater em obstáculos durante o percurso. Quanto menos colisões, maior a precisão." },
  fluidez:   { titulo: "Fluidez",   texto: "Mostra o quanto o caminho foi direto, sem voltas ou desvios desnecessários. Quanto mais perto do menor caminho possível, maior a fluidez." },
  objetivos: { titulo: "Objetivos", texto: "Mostra quantas metas do percurso o aluno conseguiu concluir. Quanto mais metas alcançadas, maior o valor." },
};

/** Normaliza um rótulo (ex.: "Objetivos %", "Precisão média") para a chave da métrica. */
export function metricaKey(label) {
  const l = (label ?? "").toString().toLowerCase();
  if (l.startsWith("precis"))  return "precisao";
  if (l.startsWith("fluid"))   return "fluidez";
  if (l.startsWith("objetiv")) return "objetivos";
  return null;
}

let _tip;
function getTip() {
  if (_tip) return _tip;
  _tip = document.createElement("div");
  _tip.style.cssText = "position:fixed;z-index:10000;max-width:260px;display:none;pointer-events:none;background:var(--theme-background);border:1px solid var(--theme-foreground-faint);border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.35);padding:.7rem .85rem;font-size:.8rem;line-height:1.45;color:var(--theme-foreground);";
  document.body.append(_tip);
  return _tip;
}

/**
 * Liga a tooltip a um elemento cujo texto/rótulo seja uma das três métricas.
 * @param {Element} el  elemento que dispara a tooltip no hover
 * @param {string}  label  rótulo para identificar a métrica (default: textContent do elemento)
 */
export function attachMetricaTip(el, label) {
  if (!el) return;
  const key = metricaKey(label ?? el.textContent);
  const d = key && METRICA_DESC[key];
  if (!d) return;
  const tip = getTip();
  el.style.cursor = "help";
  el.addEventListener("mouseenter", () => {
    tip.innerHTML = `<div style="font-weight:700;margin-bottom:.25rem;color:#2E9B96;">${d.titulo}</div>${d.texto}`;
    tip.style.display = "block";
  });
  el.addEventListener("mousemove", (e) => {
    const pad = 14, r = tip.getBoundingClientRect();
    let x = e.clientX + pad, y = e.clientY + pad;
    if (x + r.width  > window.innerWidth)  x = e.clientX - r.width  - pad;
    if (y + r.height > window.innerHeight) y = e.clientY - r.height - pad;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  });
  el.addEventListener("mouseleave", () => { tip.style.display = "none"; });
}

/**
 * Liga a tooltip a todos os elementos com class "metrica" ainda não processados
 * (rótulos do radar, títulos de KPI, cabeçalhos de tabela, etc.). Idempotente.
 */
export function applyMetricaTips(root = document) {
  root.querySelectorAll(".metrica:not([data-mtip])").forEach((el) => {
    el.dataset.mtip = "1";
    attachMetricaTip(el, el.textContent);
  });
}
