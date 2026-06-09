---
title: Gerenciar Quadros
toc: false
---

<style>
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; }
  .page-header h1 { margin:0; font-size:1.4rem; }

  .quadros-wrap { border:1px solid var(--theme-foreground-faintest); border-radius:10px; overflow:hidden; margin-bottom:2rem; }

  .secao-header {
    padding:.55rem 1rem;
    font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em;
    color:var(--theme-foreground-muted);
    background:var(--theme-background-alt);
    border-bottom:1px solid var(--theme-foreground-faintest);
  }

  .quadros-table { width:100%; border-collapse:collapse; font-size:.85rem; }
  .quadros-table thead th {
    padding:.5rem .85rem;
    text-align:left;
    font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em;
    color:var(--theme-foreground-muted);
    background:var(--theme-background);
    border-bottom:1px solid var(--theme-foreground-faintest);
    white-space:nowrap;
  }
  .quadros-table thead th.th-center { text-align:center; }
  .quadros-table td {
    padding:.6rem .85rem;
    border-bottom:1px solid var(--theme-foreground-faintest);
    vertical-align:middle;
  }
  .quadros-table tbody tr:last-child td { border-bottom:none; }
  .quadros-table tbody tr:hover td { background:var(--theme-background-alt); }

  /* Nome + save inline */
  .nome-cell { display:flex; align-items:center; gap:.5rem; }
  .edit-nome {
    flex:1; min-width:0;
    border:1px solid var(--theme-foreground-faintest);
    border-radius:6px; padding:.3rem .55rem;
    font-size:.85rem;
    background:var(--theme-background);
    color:var(--theme-foreground);
    transition:border-color .15s;
  }
  .edit-nome:focus { border-color:var(--om-accent,#3b82f6); outline:none; }
  .btn-save {
    flex-shrink:0;
    padding:.3rem .7rem; border-radius:6px; border:none;
    background:var(--om-accent,#3b82f6); color:#fff;
    font-size:.78rem; font-weight:600; cursor:pointer; white-space:nowrap;
    opacity:0; transition:opacity .15s;
    pointer-events:none;
  }
  .btn-save.visible { opacity:1; pointer-events:auto; }
  .btn-save:hover { opacity:.85 !important; }
  .btn-save:disabled { opacity:.45 !important; cursor:not-allowed; }

  /* Chave monospace */
  .td-chave { font-family:monospace; font-size:.78rem; color:var(--theme-foreground-muted); white-space:nowrap; }

  /* Badge tamanho */
  .badge-tam {
    display:inline-block; padding:.15rem .5rem; border-radius:10px;
    font-size:.72rem; font-weight:600; white-space:nowrap;
    background:var(--theme-background-alt);
    color:var(--theme-foreground-muted);
    border:1px solid var(--theme-foreground-faintest);
  }

  /* Toggle switch */
  .adm-toggle { position:relative; display:inline-block; width:38px; height:21px; cursor:pointer; }
  .adm-toggle input { opacity:0; width:0; height:0; position:absolute; }
  .adm-slider {
    position:absolute; inset:0;
    background:var(--theme-foreground-faint); border-radius:21px;
    transition:background .2s;
  }
  .adm-slider:before {
    content:""; position:absolute;
    height:17px; width:17px; left:2px; bottom:2px;
    background:#fff; border-radius:50%;
    transition:left .2s;
    box-shadow:0 1px 3px rgba(0,0,0,.2);
  }
  .adm-toggle input:checked + .adm-slider { background:var(--om-accent,#3b82f6); }
  .adm-toggle input:checked + .adm-slider:before { left:19px; }
  .adm-toggle input:disabled + .adm-slider { opacity:.45; cursor:not-allowed; }
  .td-toggle { text-align:center; }

  .toast { position:fixed; bottom:1.5rem; right:1.5rem; background:var(--theme-foreground); color:var(--theme-background); padding:.6rem 1.2rem; border-radius:8px; font-size:.85rem; z-index:9999; display:none; }
  .access-denied { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 1rem; text-align:center; gap:.75rem; color:var(--theme-foreground-muted); }
  .access-denied h2 { margin:0; font-size:1.2rem; color:var(--theme-foreground); }
</style>

```js
import { requireAuth } from "../auth.js";
import { fetchQuadros, editarQuadro } from "../api.js";

const currentUser = requireAuth();
const headerUser  = document.getElementById("header-user");
if (headerUser) headerUser.textContent = currentUser?.nome_completo ?? "";

if (currentUser?.id_usuario !== 1) {
  display(html`<div class="access-denied">
    <h2>Acesso Restrito</h2>
    <p>Esta área é exclusiva para o administrador do sistema.</p>
  </div>`);
  throw new Error("Acesso negado");
}

const toast = document.createElement("div");
toast.className = "toast";
document.body.append(toast);
function showToast(msg, ok = true) {
  toast.textContent = msg;
  toast.style.display = "block";
  toast.style.background = ok ? "var(--theme-foreground)" : "#dc2626";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.display = "none"; }, 2500);
}

let quadros = [];
try {
  quadros = await fetchQuadros();
} catch(e) {
  display(html`<p style="color:#dc2626">Erro ao carregar quadros: ${e.message}</p>`);
  throw e;
}

const SECOES = [
  { chave: "esquerda", label: "Menu Lateral" },
  { chave: "centro",   label: "Coluna Centro" },
  { chave: "direita",  label: "Coluna Direita" },
  { chave: "multi",    label: "Sessões Múltiplas" },
];

const grupos = Object.fromEntries(SECOES.map(s => [s.chave, []]));
for (const q of quadros) {
  if (grupos[q.secao]) grupos[q.secao].push(q);
}

// ── Ações ─────────────────────────────────────────────────────────────────────
async function salvarNome(q, input, btn) {
  const nome = input.value.trim();
  if (!nome || nome === q.nome) return;
  btn.disabled = true;
  try {
    const ok = await editarQuadro(q.id, { nome });
    q.nome = ok.nome;
    input.defaultValue = ok.nome;
    btn.classList.remove("visible");
    showToast("Nome atualizado.");
  } catch(e) {
    showToast(e.message, false);
  } finally {
    btn.disabled = false;
  }
}

function mkToggle(q, campo) {
  const lbl = document.createElement("label");
  lbl.className = "adm-toggle";
  lbl.title = campo;
  const chk = document.createElement("input");
  chk.type = "checkbox";
  chk.checked = !!q[campo];
  const slider = document.createElement("span");
  slider.className = "adm-slider";
  lbl.append(chk, slider);
  chk.addEventListener("change", async () => {
    chk.disabled = true;
    try {
      const ok = await editarQuadro(q.id, { [campo]: chk.checked });
      q[campo] = ok[campo];
      chk.checked = !!q[campo];
      showToast("Alterado.");
    } catch(e) {
      chk.checked = !chk.checked;
      showToast(e.message, false);
    } finally {
      chk.disabled = false;
    }
  });
  return lbl;
}

// ── Render ────────────────────────────────────────────────────────────────────
const wrap = document.createElement("div");

for (const { chave, label } of SECOES) {
  const lista = grupos[chave];
  if (!lista.length) continue;

  const bloco = document.createElement("div");
  bloco.className = "quadros-wrap";

  const secHeader = document.createElement("div");
  secHeader.className = "secao-header";
  secHeader.textContent = label;
  bloco.append(secHeader);

  const table = document.createElement("table");
  table.className = "quadros-table";
  table.innerHTML = `<thead><tr>
    <th>Nome</th>
    <th>Chave</th>
    <th>Tamanho</th>
    <th class="th-center">Ativo<br>padrão</th>
    <th class="th-center">Personali-<br>zável</th>
    <th class="th-center">Sessão<br>única</th>
  </tr></thead>`;

  const tbody = document.createElement("tbody");

  for (const q of lista) {
    const tr = document.createElement("tr");

    // Nome editável + Salvar
    const tdNome = document.createElement("td");
    const nomeCell = document.createElement("div");
    nomeCell.className = "nome-cell";
    const input = document.createElement("input");
    input.className    = "edit-nome";
    input.type         = "text";
    input.value        = q.nome;
    input.defaultValue = q.nome;
    const btnSave = document.createElement("button");
    btnSave.className   = "btn-save";
    btnSave.textContent = "Salvar";
    input.addEventListener("input", () => {
      btnSave.classList.toggle("visible", input.value.trim() !== input.defaultValue && !!input.value.trim());
    });
    input.addEventListener("keydown", e => { if (e.key === "Enter") salvarNome(q, input, btnSave); });
    btnSave.addEventListener("click", () => salvarNome(q, input, btnSave));
    nomeCell.append(input, btnSave);
    tdNome.append(nomeCell);

    // Chave
    const tdChave = document.createElement("td");
    tdChave.className   = "td-chave";
    tdChave.textContent = q.chave;

    // Tamanho
    const tdTam = document.createElement("td");
    const badge = document.createElement("span");
    badge.className   = "badge-tam";
    badge.textContent = q.tamanho;
    tdTam.append(badge);

    // Toggles
    const tdAtivo = document.createElement("td"); tdAtivo.className = "td-toggle";
    const tdPers  = document.createElement("td"); tdPers.className  = "td-toggle";
    const tdSess  = document.createElement("td"); tdSess.className  = "td-toggle";

    tdAtivo.append(mkToggle(q, "ativo_padrao"));
    tdPers.append(mkToggle(q, "personalizavel"));
    tdSess.append(mkToggle(q, "exclusivo_sessao_unica"));

    tr.append(tdNome, tdChave, tdTam, tdAtivo, tdPers, tdSess);
    tbody.append(tr);
  }

  table.append(tbody);
  bloco.append(table);
  wrap.append(bloco);
}

// ── Editor de parâmetros da Análise Comportamental ─────────────────────────────
const PARAMS_COMP_DEFAULT = {
  exploracao:   { meta_cobertura: 100 },
  precisao:     { peso_colisao: 1 },
  lateralidade: { peso_desequilibrio: 1 },
  concentracao: { top_pct: 20 },
  orientacao:   { giros_max: 30 },
  pesos:        { exploracao: 25, precisao: 25, lateralidade: 15, concentracao: 20, orientacao: 15 },
  cor:          { verde: 70, amarelo: 40 },
};

function campoNum(refs, refKey, labelTxt, value, step, suf) {
  const w = document.createElement("label");
  w.style.cssText = "display:flex;flex-direction:column;gap:.25rem;font-size:.74rem;color:var(--theme-foreground-muted);";
  const t = document.createElement("span"); t.textContent = labelTxt;
  const row = document.createElement("span"); row.style.cssText = "display:flex;align-items:center;gap:.35rem;";
  const i = document.createElement("input");
  i.type = "number"; i.step = String(step); i.value = String(value); i.min = "0";
  i.style.cssText = "width:78px;border:1px solid var(--theme-foreground-faintest);border-radius:6px;padding:.3rem .5rem;background:var(--theme-background);color:var(--theme-foreground);font-size:.85rem;";
  row.append(i);
  if (suf) { const s = document.createElement("span"); s.textContent = suf; row.append(s); }
  w.append(t, row);
  refs[refKey] = i;
  return w;
}

function grupoTitulo(txt) {
  const h = document.createElement("div");
  h.textContent = txt;
  h.style.cssText = "font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--theme-foreground-muted);margin-bottom:.1rem;";
  return h;
}
function gridCampos() {
  const g = document.createElement("div");
  g.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:.7rem;";
  return g;
}

function buildEditorParametros(q) {
  const refs = {};
  const cur  = q.parametros || {};
  const val  = (grp, key) => Number(cur?.[grp]?.[key] ?? PARAMS_COMP_DEFAULT[grp][key]);

  const card = document.createElement("div");
  card.className = "quadros-wrap";
  const head = document.createElement("div");
  head.className = "secao-header";
  head.textContent = `Parâmetros — ${q.nome}`;
  card.append(head);

  const body = document.createElement("div");
  body.style.cssText = "padding:1rem;display:flex;flex-direction:column;gap:1.2rem;";

  // Dimensões
  const gDim = gridCampos();
  gDim.append(
    campoNum(refs, "exploracao.meta_cobertura",     "Exploração — meta de cobertura",  val("exploracao", "meta_cobertura"),     1,   "%"),
    campoNum(refs, "precisao.peso_colisao",          "Precisão — peso da colisão",      val("precisao", "peso_colisao"),         0.1, "×"),
    campoNum(refs, "lateralidade.peso_desequilibrio","Lateralidade — peso desequilíbrio", val("lateralidade", "peso_desequilibrio"), 0.1, "×"),
    campoNum(refs, "concentracao.top_pct",           "Concentração — top de áreas",     val("concentracao", "top_pct"),          1,   "%"),
    campoNum(refs, "orientacao.giros_max",           "Orientação — giros que zeram",    val("orientacao", "giros_max"),          1,   "%"),
  );

  // Pesos da Pontuação Composta
  const gPeso = gridCampos();
  for (const k of ["exploracao", "precisao", "lateralidade", "concentracao", "orientacao"]) {
    const lbl = k.charAt(0).toUpperCase() + k.slice(1);
    gPeso.append(campoNum(refs, `pesos.${k}`, lbl, val("pesos", k), 1, "%"));
  }

  // Faixas de cor
  const gCor = gridCampos();
  gCor.append(
    campoNum(refs, "cor.verde",   "Verde (bom) ≥",     val("cor", "verde"),   1, "pts"),
    campoNum(refs, "cor.amarelo", "Amarelo (médio) ≥", val("cor", "amarelo"), 1, "pts"),
  );

  body.append(
    grupoTitulo("Dimensões"), gDim,
    grupoTitulo("Pesos da Pontuação Composta (normalizados pela soma)"), gPeso,
    grupoTitulo("Faixas de cor da nota"), gCor,
  );

  // Ações
  const acoes = document.createElement("div");
  acoes.style.cssText = "display:flex;gap:.6rem;align-items:center;";
  const btnSalvar = document.createElement("button");
  btnSalvar.className = "btn-save visible"; btnSalvar.textContent = "Salvar parâmetros";
  const btnReset = document.createElement("button");
  btnReset.textContent = "Restaurar padrão";
  btnReset.style.cssText = "padding:.3rem .7rem;border-radius:6px;border:1px solid var(--theme-foreground-faintest);background:transparent;color:var(--theme-foreground-muted);font-size:.78rem;font-weight:600;cursor:pointer;";

  function coletar() {
    const n = (k) => Number(refs[k].value);
    return {
      exploracao:   { meta_cobertura: n("exploracao.meta_cobertura") },
      precisao:     { peso_colisao: n("precisao.peso_colisao") },
      lateralidade: { peso_desequilibrio: n("lateralidade.peso_desequilibrio") },
      concentracao: { top_pct: n("concentracao.top_pct") },
      orientacao:   { giros_max: n("orientacao.giros_max") },
      pesos: {
        exploracao:   n("pesos.exploracao"),
        precisao:     n("pesos.precisao"),
        lateralidade: n("pesos.lateralidade"),
        concentracao: n("pesos.concentracao"),
        orientacao:   n("pesos.orientacao"),
      },
      cor: { verde: n("cor.verde"), amarelo: n("cor.amarelo") },
    };
  }

  btnSalvar.addEventListener("click", async () => {
    btnSalvar.disabled = true;
    try {
      const ok = await editarQuadro(q.id, { parametros: coletar() });
      q.parametros = ok.parametros;
      showToast("Parâmetros salvos.");
    } catch(e) {
      showToast(e.message, false);
    } finally {
      btnSalvar.disabled = false;
    }
  });

  btnReset.addEventListener("click", async () => {
    btnReset.disabled = true;
    try {
      const ok = await editarQuadro(q.id, { parametros: null });
      q.parametros = ok.parametros;
      for (const grp of Object.keys(PARAMS_COMP_DEFAULT)) {
        for (const key of Object.keys(PARAMS_COMP_DEFAULT[grp])) {
          if (refs[`${grp}.${key}`]) refs[`${grp}.${key}`].value = String(PARAMS_COMP_DEFAULT[grp][key]);
        }
      }
      showToast("Restaurado ao padrão.");
    } catch(e) {
      showToast(e.message, false);
    } finally {
      btnReset.disabled = false;
    }
  });

  acoes.append(btnSalvar, btnReset);
  body.append(acoes);
  card.append(body);
  return card;
}

const qComp = quadros.find(q => q.chave === "analise-comportamental");
if (qComp) wrap.append(buildEditorParametros(qComp));

display(html`<div>
  <div class="page-header">
    <h1>Gerenciar Quadros</h1>
  </div>
  ${wrap}
</div>`);
```
