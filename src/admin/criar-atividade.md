---
title: Nova Atividade
toc: false
---

<style>
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; }
  .page-header h1 { margin:0; font-size:1.5rem; }
  .section { margin-bottom:2rem; }
  .section-title { font-size:1rem; font-weight:700; margin-bottom:.75rem; display:flex; align-items:center; gap:.5rem; }
  .section-num { display:inline-flex; align-items:center; justify-content:center; width:1.5rem; height:1.5rem; border-radius:50%; background:#1e293b; color:#fff; font-size:.78rem; font-weight:700; flex-shrink:0; }
  .form-field { display:flex; flex-direction:column; gap:.35rem; margin-bottom:1rem; }
  .form-field label { font-size:.875rem; font-weight:600; }
  .form-field input, .form-field textarea { padding:.55rem .75rem; border:1px solid var(--theme-foreground-faint); border-radius:6px; background:var(--theme-background); color:var(--theme-foreground); font-size:.95rem; outline:none; transition:border-color .15s; }
  .form-field input:focus, .form-field textarea:focus { border-color:var(--om-accent); }
  .form-field textarea { resize:vertical; min-height:72px; }
  .divider { border:none; border-top:1px solid var(--theme-foreground-faintest); margin:1.5rem 0; }

  /* Pool tabs */
  .pool-tabs { display:flex; gap:0; border-bottom:2px solid var(--theme-foreground-faintest); margin-bottom:.5rem; }
  .pool-tab { padding:.35rem .9rem; background:transparent; border:none; border-bottom:2px solid transparent; margin-bottom:-2px; font-size:.82rem; font-weight:600; cursor:pointer; color:var(--theme-foreground-muted); transition:all .15s; }
  .pool-tab.active { color:var(--theme-foreground); border-bottom-color:var(--theme-foreground); }

  /* Mapa pool */
  .map-pool { display:flex; flex-direction:column; gap:.4rem; max-height:280px; overflow-y:auto; border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.5rem; }
  .map-pool-item { display:flex; align-items:center; justify-content:space-between; padding:.4rem .65rem; border-radius:6px; background:var(--theme-background-alt); font-size:.85rem; cursor:pointer; user-select:none; gap:.5rem; }
  .map-pool-item:hover { background:var(--theme-foreground-faintest); }
  .map-pool-name { flex:1; }
  .map-pool-meta { font-size:.75rem; color:var(--theme-foreground-muted); white-space:nowrap; }
  .btn-apropriar { padding:.15rem .5rem; font-size:.75rem; border-radius:4px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); cursor:pointer; white-space:nowrap; flex-shrink:0; }
  .btn-apropriar:hover { background:var(--theme-background-alt); }
  .btn-apropriar:disabled { opacity:.4; cursor:not-allowed; }
  .btn-add { padding:.15rem .5rem; font-size:.75rem; border-radius:4px; border:none; background:#1e293b; color:#fff; cursor:pointer; white-space:nowrap; flex-shrink:0; }
  .btn-add:hover { opacity:.82; }

  /* Sequência */
  .seq-list { display:flex; flex-direction:column; gap:.4rem; min-height:56px; border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.5rem; }
  .seq-item { display:flex; align-items:center; gap:.5rem; padding:.4rem .65rem; border:1px solid var(--theme-foreground-faintest); border-radius:6px; background:var(--theme-background); font-size:.85rem; }
  .seq-order { font-weight:700; color:var(--theme-foreground-muted); width:1.4rem; text-align:center; flex-shrink:0; }
  .seq-name  { flex:1; }
  .seq-btns  { display:flex; gap:.25rem; }
  .icon-btn  { background:transparent; border:1px solid var(--theme-foreground-faintest); border-radius:4px; padding:.1rem .35rem; cursor:pointer; font-size:.8rem; line-height:1.4; }
  .icon-btn:hover:not(:disabled) { background:var(--theme-background-alt); }
  .icon-btn:disabled { opacity:.3; cursor:not-allowed; }

  /* Alunos */
  .aluno-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:.5rem; }
  .aluno-card { display:flex; align-items:center; gap:.6rem; padding:.5rem .75rem; border:1px solid var(--theme-foreground-faintest); border-radius:6px; cursor:pointer; user-select:none; transition:all .1s; font-size:.88rem; }
  .aluno-card:hover { background:var(--theme-background-alt); }
  .aluno-card.selected { border-color:var(--om-accent); background:#eff6ff; color:#1d4ed8; }
  .check-icon { font-size:1rem; flex-shrink:0; }

  /* Actions */
  .form-actions { display:flex; gap:.75rem; margin-top:1.75rem; align-items:stretch; }
  .btn { padding:.6rem 1.25rem; border-radius:6px; font-size:.95rem; font-weight:600; cursor:pointer; border:1.5px solid transparent; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box; transition:opacity .15s; }
  .btn-primary { background:var(--theme-foreground); border-color:var(--theme-foreground); }
  a.btn-primary, button.btn-primary { color:var(--theme-background); }
  .btn-primary:hover:not(:disabled) { opacity:.82; }
  .btn-primary:disabled { opacity:.45; cursor:not-allowed; }
  .btn-ghost { background:transparent; color:var(--theme-foreground); border-color:var(--theme-foreground-faint); }
  .btn-ghost:hover { background:var(--theme-background-alt); }
  .alert { padding:.7rem .9rem; border-radius:6px; font-size:.875rem; margin-top:1rem; }
  .alert-error   { background:var(--om-bad-bg); color:var(--om-bad-text); }
  .alert-success { background:var(--om-ok-bg); color:var(--om-ok-text); }
  .hint { font-size:.78rem; color:var(--theme-foreground-muted); }
  .empty-hint { font-size:.85rem; color:var(--theme-foreground-muted); padding:.5rem .75rem; font-style:italic; }
  .col-label { font-size:.8rem; font-weight:600; margin-bottom:.4rem; color:var(--theme-foreground-muted); letter-spacing:.03em; }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchMeusMaps, fetchTodosMaps, fetchAlunos, criarAtividade, apropriarMapa } from "../api.js";

const currentUser = requireAuth();
const headerUser   = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser)   headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

// ── Carregar dados base ──────────────────────────────────────────────────────
let meusMapas    = [];
let outrosMapas  = [];
let todosAlunos  = [];

try {
  [{ mapas: meusMapas }, { mapas: outrosMapas }, { alunos: todosAlunos }] = await Promise.all([
    fetchMeusMaps(),
    fetchTodosMaps(),
    fetchAlunos(),
  ]);
  // Filtra mapas ativos e remove os próprios da lista de "outros"
  meusMapas   = meusMapas.filter(m => m.ativo);
  outrosMapas = outrosMapas.filter(m => m.ativo && m.id_criador !== currentUser.id_usuario);
} catch (e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro ao carregar dados: ${e.message}</div>`);
}

// ══════════════════════════════════════════════════════════════════════════════
// SEÇÃO 1 — Informações básicas
// ══════════════════════════════════════════════════════════════════════════════
const fNome      = html`<input type="text" placeholder="Ex: Navegação em ambiente interno" />`;
const fDescricao = html`<textarea placeholder="Descreva o objetivo da atividade (opcional)"></textarea>`;

// ══════════════════════════════════════════════════════════════════════════════
// SEÇÃO 2 — Sequência de mapas
// Containers criados com createElement para suportar mutação confiável.
// ══════════════════════════════════════════════════════════════════════════════
let sequencia    = [];   // [{id_mapa, nome_mapa}]
let abaAtiva     = "meus"; // "meus" | "outros"

// Contêineres DOM — NÃO usar html`` para nós que sofrem replaceChildren()
const poolContainer = document.createElement("div");
const seqContainer  = document.createElement("div");
seqContainer.className = "seq-list";

const tabMeus   = document.createElement("button");
tabMeus.className = "pool-tab active";
tabMeus.textContent = "Meus mapas";

const tabOutros = document.createElement("button");
tabOutros.className = "pool-tab";
tabOutros.textContent = "Outros professores";

tabMeus.addEventListener("click", () => {
  abaAtiva = "meus";
  tabMeus.classList.add("active");
  tabOutros.classList.remove("active");
  renderPool();
});
tabOutros.addEventListener("click", () => {
  abaAtiva = "outros";
  tabOutros.classList.add("active");
  tabMeus.classList.remove("active");
  renderPool();
});

const poolTabs = document.createElement("div");
poolTabs.className = "pool-tabs";
poolTabs.append(tabMeus, tabOutros);

const pool = document.createElement("div");
pool.className = "map-pool";

poolContainer.append(poolTabs, pool);

// ── render pool ──────────────────────────────────────────────────────────────
function renderPool() {
  pool.replaceChildren();
  const idsNaSeq = new Set(sequencia.map(s => s.id_mapa));

  if (abaAtiva === "meus") {
    const lista = meusMapas.filter(m => !idsNaSeq.has(m.id_mapa));
    if (!lista.length) {
      const p = document.createElement("p");
      p.className = "empty-hint";
      p.textContent = idsNaSeq.size ? "Todos os seus mapas já foram adicionados." : "Nenhum mapa ativo encontrado.";
      pool.append(p);
      return;
    }
    for (const m of lista) {
      const item  = document.createElement("div");
      item.className = "map-pool-item";

      const nome  = document.createElement("span");
      nome.className = "map-pool-name";
      nome.textContent = m.nome_mapa;

      const meta  = document.createElement("span");
      meta.className = "map-pool-meta";
      meta.textContent = m.data_criacao;

      const btnAdd = document.createElement("button");
      btnAdd.className = "btn-add";
      btnAdd.textContent = "+ Adicionar";
      btnAdd.addEventListener("click", () => {
        sequencia.push({ id_mapa: m.id_mapa, nome_mapa: m.nome_mapa });
        renderSeq();
        renderPool();
      });

      item.append(nome, meta, btnAdd);
      pool.append(item);
    }

  } else {
    // Aba "outros professores"
    if (!outrosMapas.length) {
      const p = document.createElement("p");
      p.className = "empty-hint";
      p.textContent = "Nenhum mapa ativo de outros professores disponível.";
      pool.append(p);
      return;
    }
    for (const m of outrosMapas) {
      const jaNaSeq     = idsNaSeq.has(m.id_mapa);
      const item         = document.createElement("div");
      item.className     = "map-pool-item";

      const nome         = document.createElement("span");
      nome.className     = "map-pool-name";
      nome.textContent   = m.nome_mapa;

      const prof         = document.createElement("span");
      prof.className     = "map-pool-meta";
      prof.textContent   = m.nome_professor;

      const btnApropriar = document.createElement("button");
      btnApropriar.className   = "btn-apropriar";
      btnApropriar.textContent = "Apropriar →";
      btnApropriar.title       = "Cria uma cópia deste mapa na sua lista";
      btnApropriar.addEventListener("click", async () => {
        btnApropriar.disabled    = true;
        btnApropriar.textContent = "…";
        try {
          const res = await apropriarMapa(m.id_mapa);
          // Adiciona à lista de meus mapas e à sequência automaticamente
          const novoMapa = { id_mapa: res.id_mapa, nome_mapa: res.nome_mapa, ativo: true, data_criacao: "" };
          meusMapas.push(novoMapa);
          outrosMapas = outrosMapas.filter(x => x.id_mapa !== m.id_mapa);
          sequencia.push({ id_mapa: res.id_mapa, nome_mapa: res.nome_mapa });
          abaAtiva = "meus";
          tabMeus.classList.add("active");
          tabOutros.classList.remove("active");
          renderSeq();
          renderPool();
        } catch (e) {
          alert(e.message);
          btnApropriar.disabled    = false;
          btnApropriar.textContent = "Apropriar →";
        }
      });

      if (jaNaSeq) {
        btnApropriar.disabled    = true;
        btnApropriar.textContent = "Na sequência";
      }

      item.append(nome, prof, btnApropriar);
      pool.append(item);
    }
  }
}

// ── render sequência ─────────────────────────────────────────────────────────
function renderSeq() {
  seqContainer.replaceChildren();
  if (!sequencia.length) {
    const p = document.createElement("p");
    p.className = "empty-hint";
    p.textContent = "Nenhum mapa adicionado ainda.";
    seqContainer.append(p);
    return;
  }
  sequencia.forEach((s, i) => {
    const item = document.createElement("div");
    item.className = "seq-item";

    const num = document.createElement("span");
    num.className = "seq-order";
    num.textContent = i + 1;

    const nome = document.createElement("span");
    nome.className = "seq-name";
    nome.textContent = s.nome_mapa;

    const btnUp   = document.createElement("button");
    btnUp.className   = "icon-btn";
    btnUp.textContent = "↑";
    btnUp.title       = "Subir";
    btnUp.disabled    = (i === 0);
    btnUp.addEventListener("click", () => {
      [sequencia[i - 1], sequencia[i]] = [sequencia[i], sequencia[i - 1]];
      renderSeq(); renderPool();
    });

    const btnDown   = document.createElement("button");
    btnDown.className   = "icon-btn";
    btnDown.textContent = "↓";
    btnDown.title       = "Descer";
    btnDown.disabled    = (i === sequencia.length - 1);
    btnDown.addEventListener("click", () => {
      [sequencia[i + 1], sequencia[i]] = [sequencia[i], sequencia[i + 1]];
      renderSeq(); renderPool();
    });

    const btnRem   = document.createElement("button");
    btnRem.className   = "icon-btn";
    btnRem.textContent = "✕";
    btnRem.title       = "Remover";
    btnRem.style.color = "#b91c1c";
    btnRem.addEventListener("click", () => {
      sequencia.splice(i, 1);
      renderSeq(); renderPool();
    });

    const btns = document.createElement("div");
    btns.className = "seq-btns";
    btns.append(btnUp, btnDown, btnRem);

    item.append(num, nome, btns);
    seqContainer.append(item);
  });
}

renderSeq();
renderPool();

// ══════════════════════════════════════════════════════════════════════════════
// SEÇÃO 3 — Seleção de alunos
// ══════════════════════════════════════════════════════════════════════════════
const alunosSelecionados = new Set();
const alunoGrid = document.createElement("div");
alunoGrid.className = "aluno-grid";

function renderAlunos() {
  alunoGrid.replaceChildren();
  if (!todosAlunos.length) {
    const p = document.createElement("p");
    p.className = "empty-hint";
    p.textContent = "Nenhum aluno cadastrado.";
    alunoGrid.append(p);
    return;
  }
  for (const a of todosAlunos) {
    const sel  = alunosSelecionados.has(a.id_aluno);
    const card = document.createElement("div");
    card.className = "aluno-card" + (sel ? " selected" : "");

    const icon = document.createElement("span");
    icon.className = "check-icon";
    icon.textContent = sel ? "✔" : "○";

    const nome = document.createElement("span");
    nome.textContent = a.nome_completo;

    card.append(icon, nome);
    card.addEventListener("click", () => {
      if (alunosSelecionados.has(a.id_aluno)) alunosSelecionados.delete(a.id_aluno);
      else alunosSelecionados.add(a.id_aluno);
      renderAlunos();
    });
    alunoGrid.append(card);
  }
}

renderAlunos();

// ══════════════════════════════════════════════════════════════════════════════
// SUBMIT
// ══════════════════════════════════════════════════════════════════════════════
const btnSalvar = html`<button class="btn btn-primary">Criar Atividade</button>`;
const alertDiv  = html`<div></div>`;

btnSalvar.addEventListener("click", async () => {
  const nome = fNome.value.trim();
  if (!nome) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Informe o nome da atividade.";
    return;
  }
  if (!sequencia.length) {
    alertDiv.className = "alert alert-error";
    alertDiv.textContent = "Adicione ao menos um mapa à sequência.";
    return;
  }
  btnSalvar.disabled    = true;
  btnSalvar.textContent = "Criando…";
  alertDiv.className = ""; alertDiv.textContent = "";
  try {
    await criarAtividade({
      nome,
      descricao: fDescricao.value.trim(),
      mapas:  sequencia.map((s, i) => ({ id_mapa: s.id_mapa, ordem: i + 1 })),
      alunos: [...alunosSelecionados],
    });
    alertDiv.className   = "alert alert-success";
    alertDiv.textContent = `Atividade "${nome}" criada com sucesso!`;
    fNome.value = ""; fDescricao.value = "";
    sequencia = []; alunosSelecionados.clear();
    renderSeq(); renderPool(); renderAlunos();
  } catch (e) {
    alertDiv.className   = "alert alert-error";
    alertDiv.textContent = e.message;
  } finally {
    btnSalvar.disabled    = false;
    btnSalvar.textContent = "Criar Atividade";
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// RENDER FINAL
// ══════════════════════════════════════════════════════════════════════════════
display(html`<div>
  <div class="page-header">
    <h1>Nova Atividade</h1>
    <a class="btn-ghost btn" href="/admin/atividades">← Voltar</a>
  </div>

  <div class="section">
    <p class="section-title"><span class="section-num">1</span> Informações básicas</p>
    <div class="form-field">
      <label>Nome da atividade *</label>
      ${fNome}
    </div>
    <div class="form-field">
      <label>Descrição</label>
      ${fDescricao}
    </div>
  </div>

  <hr class="divider" />

  <div class="section">
    <p class="section-title"><span class="section-num">2</span> Sequência de mapas</p>
    <p class="hint" style="margin-bottom:.75rem">
      Clique em "+ Adicionar" para incluir um mapa à sequência. Use ↑ ↓ para reordenar.
      Na aba <strong>Outros professores</strong> você pode apropriar mapas para sua biblioteca.
    </p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;align-items:start">
      <div>
        <p class="col-label">MAPAS DISPONÍVEIS</p>
        ${poolContainer}
      </div>
      <div>
        <p class="col-label">SEQUÊNCIA</p>
        ${seqContainer}
      </div>
    </div>
  </div>

  <hr class="divider" />

  <div class="section">
    <p class="section-title"><span class="section-num">3</span> Atribuir alunos</p>
    <p class="hint" style="margin-bottom:.75rem">Selecione os alunos que realizarão esta atividade. Pode ficar vazio.</p>
    ${alunoGrid}
  </div>

  <div class="form-actions">
    ${btnSalvar}
    <a href="/admin/atividades" class="btn btn-ghost">Cancelar</a>
  </div>
  ${alertDiv}
</div>`);
```
