---
title: Gerenciar Alunos
toc: false
---

<style>
  .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:.75rem; }
  .page-header h1 { margin:0; font-size:1.5rem; }
  .btn { padding:.6rem 1.25rem; border-radius:6px; font-size:.95rem; font-weight:600; cursor:pointer; border:1.5px solid transparent; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box; transition:opacity .15s; }
  .btn-primary { background:var(--theme-foreground); border-color:var(--theme-foreground); }
  a.btn-primary, button.btn-primary { color:var(--theme-background); }
  .btn-primary:hover { opacity:.82; }
  .filters { display:flex; gap:1rem; margin-bottom:1.25rem; align-items:center; flex-wrap:wrap; }
  .filter-label { font-size:.875rem; font-weight:600; color:var(--theme-foreground-muted); }
  .filter-btn { padding:.35rem .9rem; border-radius:20px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.85rem; cursor:pointer; transition:all .15s; }
  .filter-btn.active { background:#1e293b; color:#fff; border-color:#1e293b; }
  .search-input { padding:.4rem .75rem; border:1px solid var(--theme-foreground-faint); border-radius:6px; background:var(--theme-background); color:var(--theme-foreground); font-size:.9rem; outline:none; min-width:220px; }
  .search-input:focus { border-color:var(--om-accent); }
  .alunos-table { width:100%; border-collapse:collapse; font-size:.9rem; }
  .alunos-table th { text-align:left; padding:.6rem .75rem; border-bottom:2px solid var(--theme-foreground-faint); color:var(--theme-foreground-muted); font-weight:600; font-size:.8rem; text-transform:uppercase; letter-spacing:.04em; }
  .alunos-table td { padding:.65rem .75rem; border-bottom:1px solid var(--theme-foreground-faintest); vertical-align:middle; }
  .alunos-table tr:hover td { background:var(--theme-background-alt); }
  .badge { display:inline-block; padding:.2rem .6rem; border-radius:12px; font-size:.78rem; font-weight:600; }
  .badge-ativo { background:var(--om-ok-bg); color:var(--om-ok-text); }
  .badge-inativo { background:var(--om-bad-bg); color:var(--om-bad-text); }
  .btn-toggle { padding:.25rem .65rem; border-radius:5px; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); font-size:.8rem; cursor:pointer; text-decoration:none; }
  .td-acoes { white-space:nowrap; display:flex; gap:.35rem; align-items:center; }
  .btn-toggle:hover { background:var(--theme-background-alt); }
  .btn-toggle:disabled { opacity:.4; cursor:not-allowed; }
  .empty-state { text-align:center; padding:3rem 0; color:var(--theme-foreground-muted); }
  .stats-bar { display:flex; gap:1.5rem; margin-bottom:1.5rem; flex-wrap:wrap; }
  .stat-card { background:var(--theme-background-alt); border:1px solid var(--theme-foreground-faintest); border-radius:8px; padding:.75rem 1.25rem; min-width:120px; }
  .stat-value { font-size:1.6rem; font-weight:700; }
  .stat-label { font-size:.78rem; color:var(--theme-foreground-muted); margin-top:.1rem; }
  /* ── Modal padrão do sistema ─────────────────────────────── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.6); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; z-index:9999; padding:1rem; animation:fadeIn .18s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal-box { background:var(--theme-background); border:1px solid var(--theme-foreground-faint); border-radius:16px; overflow:hidden; width:100%; max-width:520px; box-shadow:0 24px 60px rgba(0,0,0,.4); animation:slideUp .2s ease; }
  @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
  .modal-header { display:flex; align-items:center; gap:1rem; padding:1.25rem 1.4rem 1rem; border-bottom:3px solid var(--modal-accent,#888); }
  .modal-name  { font-size:1.15rem; font-weight:700; margin-bottom:.1rem; }
  .modal-meta  { font-size:.82rem; color:var(--theme-foreground-muted); line-height:1.5; }
  .modal-close { margin-left:auto; background:none; border:none; cursor:pointer; color:var(--theme-foreground-muted); font-size:1.4rem; line-height:1; padding:.2rem .4rem; border-radius:4px; }
  .modal-close:hover { background:var(--theme-background-alt); color:var(--theme-foreground); }
  .modal-footer { padding:.85rem 1.4rem 1.1rem; display:flex; justify-content:flex-end; gap:.5rem; align-items:center; border-top:1px solid var(--theme-foreground-faintest); }
  .btn-primary-modal, .btn-ghost-modal { padding:.5rem 1.1rem; border-radius:8px; font-size:.9rem; font-weight:600; border:1px solid var(--theme-foreground-faint); background:transparent; color:var(--theme-foreground); cursor:pointer; }
  .btn-primary-modal { background:var(--theme-foreground); color:var(--theme-background); border-color:var(--theme-foreground); }
  .btn-primary-modal:hover, .btn-ghost-modal:hover { opacity:.85; background:var(--theme-background-alt); }
  .btn-primary-modal:hover { background:var(--theme-foreground); }
  .link-input { width:100%; padding:.55rem; border:1px solid var(--theme-foreground-faint); border-radius:6px; font-size:.85rem; background:var(--theme-background-alt); color:var(--theme-foreground); box-sizing:border-box; }
</style>

```js
import { requireAuth, logout } from "../auth.js";
import { fetchAlunos, toggleAtivoAluno, atualizarLoginAluno, gerarLinkPratica } from "../api.js";

const currentUser = requireAuth();
const headerUser = document.getElementById("header-user");
const headerLogout = document.getElementById("header-logout");
if (headerUser) headerUser.textContent = currentUser.nome;
if (headerLogout) headerLogout.addEventListener("click", logout);

let todosAlunos = [];
let filtroAtivo = "todos";
let busca = "";

try {
  const resp = await fetchAlunos();
  todosAlunos = resp.alunos ?? [];
} catch (e) {
  display(html`<div style="color:#b91c1c;padding:1rem;background:#fee2e2;border-radius:8px;">Erro ao carregar alunos: ${e.message}</div>`);
}

const searchInput = html`<input class="search-input" type="search" placeholder="Buscar por nome ou email…" />`;
const btnTodos    = html`<button class="filter-btn active">Todos</button>`;
const btnAtivos   = html`<button class="filter-btn">Ativos</button>`;
const btnInativos = html`<button class="filter-btn">Inativos</button>`;
const statTotal   = html`<div class="stat-card"><div class="stat-value"></div><div class="stat-label">Total</div></div>`;
const statAtivos  = html`<div class="stat-card"><div class="stat-value" style="color:#166534"></div><div class="stat-label">Ativos</div></div>`;
const statInat    = html`<div class="stat-card"><div class="stat-value" style="color:#991b1b"></div><div class="stat-label">Inativos</div></div>`;
const tbody       = html`<tbody></tbody>`;

function atualizarStats() {
  const ativos = todosAlunos.filter(a => a.ativo).length;
  statTotal.querySelector(".stat-value").textContent  = todosAlunos.length;
  statAtivos.querySelector(".stat-value").textContent = ativos;
  statInat.querySelector(".stat-value").textContent   = todosAlunos.length - ativos;
}

function alunosFiltrados() {
  return todosAlunos.filter(a => {
    const matchFiltro = filtroAtivo === "todos" ? true : filtroAtivo === "ativo" ? a.ativo : !a.ativo;
    const q = busca.toLowerCase();
    const loginEfetivo = a.login || a.email?.split("@")[0] || "";
    const matchBusca = !q || a.nome_completo.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || loginEfetivo.toLowerCase().includes(q);
    return matchFiltro && matchBusca;
  });
}

// Copia para a área de transferência com fallback (execCommand).
async function copiarTexto(texto, input) {
  try { await navigator.clipboard.writeText(texto); return true; }
  catch {
    try { input.select(); return document.execCommand("copy"); }
    catch { return false; }
  }
}

// Modal padrão do sistema confirmando que o link foi copiado.
function mostrarModalLinkCopiado(url, nomeAluno, horas, copiado) {
  const input = html`<input class="link-input" type="text" readonly />`;
  input.value = url;
  const btnFechar = html`<button class="btn-ghost-modal">Fechar</button>`;
  const btnCopiar = html`<button class="btn-primary-modal">Copiar novamente</button>`;
  const btnX = html`<button class="modal-close" title="Fechar">×</button>`;

  const titulo = copiado ? "Link copiado" : "Link de prática gerado";
  const aviso = copiado
    ? "O link foi copiado para a área de transferência."
    : "Não foi possível copiar automaticamente. Use o botão Copiar novamente.";

  const overlay = html`<div class="modal-overlay">
    <div class="modal-box" style="--modal-accent:#16a34a">
      <div class="modal-header">
        <div>
          <div class="modal-name">${titulo}</div>
          <div class="modal-meta">${nomeAluno} · válido ${horas}h para abrir</div>
        </div>
        ${btnX}
      </div>
      <div style="padding:1rem 1.4rem .25rem;">
        <p style="margin:0 0 .85rem;font-size:.9rem;line-height:1.45;color:var(--theme-foreground);">
          ${aviso} Envie ao aluno — ele deve abri-lo no aparelho em até ${horas} horas.
          Depois de aberto, a prática vale até o aluno tocar em <em>Encerrar Sessão</em>, quando será preciso um novo link.
        </p>
        ${input}
      </div>
      <div class="modal-footer">${btnFechar}${btnCopiar}</div>
    </div>
  </div>`;

  btnCopiar.addEventListener("click", async () => {
    const ok = await copiarTexto(url, input);
    btnCopiar.textContent = ok ? "Copiado!" : "Selecione e copie";
    setTimeout(() => { btnCopiar.textContent = "Copiar novamente"; }, 1500);
  });
  const fechar = () => overlay.remove();
  btnFechar.addEventListener("click", fechar);
  btnX.addEventListener("click", fechar);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) fechar(); });
  document.body.append(overlay);
}

function renderTabela() {
  const lista = alunosFiltrados();
  tbody.replaceChildren();
  if (!lista.length) {
    tbody.append(html`<tr><td colspan="6" class="empty-state">Nenhum aluno encontrado.</td></tr>`);
    return;
  }
  for (const a of lista) {
    const btnEditar = document.createElement("a");
    btnEditar.href = `/admin/editar-aluno?id=${a.id_aluno}`;
    btnEditar.className = "btn-toggle";
    btnEditar.textContent = "Editar";

    const btnToggle = html`<button class="btn-toggle">${a.ativo ? "Desativar" : "Ativar"}</button>`;
    btnToggle.addEventListener("click", async () => {
      btnToggle.disabled = true;
      try {
        const res = await toggleAtivoAluno(a.id_aluno);
        a.ativo = res.ativo;
        atualizarStats();
        renderTabela();
      } catch (e) {
        alert("Erro: " + e.message);
        btnToggle.disabled = false;
      }
    });
    const linkNome = document.createElement("a");
    linkNome.href = `/visualizacao/dados-aluno?id=${a.id_aluno}`;
    linkNome.textContent = a.nome_completo;
    linkNome.style.cssText = "font-weight:600;color:inherit;text-decoration:none;";
    linkNome.onmouseenter = () => linkNome.style.textDecoration = "underline";
    linkNome.onmouseleave = () => linkNome.style.textDecoration = "none";

    // Célula de login editável inline
    const loginEfetivo = a.login || a.email?.split("@")[0] || "";
    const loginSpan = document.createElement("span");
    loginSpan.textContent = loginEfetivo;
    loginSpan.style.cssText = "cursor:pointer;border-bottom:1px dashed var(--theme-foreground-faint);";
    loginSpan.title = "Clique para editar";
    const loginInput = document.createElement("input");
    loginInput.value = loginEfetivo;
    loginInput.style.cssText = "display:none;width:120px;padding:.2rem .4rem;border:1px solid #4a90e2;border-radius:4px;font-size:.9rem;";
    loginInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const novoLogin = loginInput.value.trim();
        if (!novoLogin || novoLogin === loginEfetivo) { loginInput.style.display = "none"; loginSpan.style.display = ""; return; }
        try {
          await atualizarLoginAluno(a.id_aluno, novoLogin);
          a.login = novoLogin;
          loginSpan.textContent = novoLogin;
        } catch (err) { alert("Erro: " + err.message); }
        loginInput.style.display = "none"; loginSpan.style.display = "";
      }
      if (e.key === "Escape") { loginInput.style.display = "none"; loginSpan.style.display = ""; }
    });
    loginInput.addEventListener("blur", () => { loginInput.style.display = "none"; loginSpan.style.display = ""; });
    loginSpan.addEventListener("click", () => { loginSpan.style.display = "none"; loginInput.style.display = ""; loginInput.focus(); loginInput.select(); });

    const tdNome   = document.createElement("td"); tdNome.append(linkNome);
    const tdEmail  = document.createElement("td"); tdEmail.style.color = "var(--theme-foreground-muted)"; tdEmail.textContent = a.email;
    const tdLogin  = document.createElement("td"); tdLogin.append(loginSpan, loginInput);
    const faixa = a.menor_idade === true ? "Menor de idade"
                : a.menor_idade === false ? "Maior de idade"
                : (a.idade != null ? `${a.idade} anos` : "—");
    const tdIdade  = document.createElement("td"); tdIdade.textContent = `${faixa}${a.escolaridade ? " · " + a.escolaridade : ""}`;
    const tdBadge  = document.createElement("td");
    const badge    = document.createElement("span"); badge.className = `badge ${a.ativo ? "badge-ativo" : "badge-inativo"}`; badge.textContent = a.ativo ? "Ativo" : "Inativo";
    tdBadge.append(badge);
    const dicaLink = a.ativo
      ? "Gera um link de prática autônoma e copia para a área de transferência (válido 48h para o aluno abrir)"
      : "Ative o aluno para gerar o link de prática";
    const btnLink = html`<button class="btn-toggle" title="${dicaLink}" ${a.ativo ? "" : "disabled"}>Link</button>`;
    btnLink.addEventListener("click", async () => {
      btnLink.disabled = true;
      const txt = btnLink.textContent;
      btnLink.textContent = "…";
      try {
        const res = await gerarLinkPratica(a.id_aluno);
        const tmp = document.createElement("input");
        tmp.value = res.url;
        const copiado = await copiarTexto(res.url, tmp);
        mostrarModalLinkCopiado(res.url, a.nome_completo, res.validade_horas ?? 48, copiado);
      } catch (e) {
        alert("Erro ao gerar link: " + e.message);
      } finally {
        btnLink.disabled = !a.ativo;
        btnLink.textContent = txt;
      }
    });

    const tdAcao   = document.createElement("td");
    const divAcoes = document.createElement("div"); divAcoes.className = "td-acoes";
    divAcoes.append(btnEditar, btnLink, btnToggle);
    tdAcao.append(divAcoes);

    const tr = document.createElement("tr");
    tr.append(tdNome, tdEmail, tdLogin, tdIdade, tdBadge, tdAcao);
    tbody.append(tr);
  }
}

function setFiltro(f) {
  filtroAtivo = f;
  [btnTodos, btnAtivos, btnInativos].forEach(b => b.classList.remove("active"));
  (f === "todos" ? btnTodos : f === "ativo" ? btnAtivos : btnInativos).classList.add("active");
  renderTabela();
}

btnTodos.addEventListener("click",    () => setFiltro("todos"));
btnAtivos.addEventListener("click",   () => setFiltro("ativo"));
btnInativos.addEventListener("click", () => setFiltro("inativo"));
searchInput.addEventListener("input", () => { busca = searchInput.value; renderTabela(); });

atualizarStats();
renderTabela();

display(html`<div>
  <div class="page-header">
    <h1>Alunos</h1>
    <a href="/admin/cadastrar-aluno" class="btn btn-primary">+ Cadastrar aluno</a>
  </div>
  <div class="stats-bar">${statTotal}${statAtivos}${statInat}</div>
  <div class="filters">
    <span class="filter-label">Filtrar:</span>
    ${btnTodos}${btnAtivos}${btnInativos}
    ${searchInput}
  </div>
  <table class="alunos-table">
    <thead><tr><th>Nome</th><th>Email</th><th>Login</th><th>Maioridade / Escolaridade</th><th>Status</th><th>Ação</th></tr></thead>
    ${tbody}
  </table>
</div>`);
```
