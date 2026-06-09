// See https://observablehq.com/framework/config for documentation.
export default {
  title: "MOVA",

  pager: false,
  footer: false,
  sidebar: false,

  theme: ["light", "alt"],

  head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  root: "src",

  header: `<nav id="app-nav" style="
    display:flex; align-items:center; gap:0; padding:0 1rem;
    height:100%; width:100%; box-sizing:border-box;
    font-size:.82rem;
  ">
    <!-- Logo / título -->
    <a href="/" title="Mobility &amp; Orientation Visualization Analytics" style="font-weight:700; font-size:.95rem; text-decoration:none; color:inherit; margin-right:1.5rem; white-space:nowrap;">
      MOVA
    </a>

    <!-- Grupo: Mapas -->
    <div class="nav-group" style="position:relative; display:flex; align-items:center;">
      <button class="nav-btn" onclick="toggleMenu('menu-mapas')"
        style="background:none;border:none;cursor:pointer;padding:.3rem .6rem;border-radius:5px;font-size:.82rem;color:inherit;display:flex;align-items:center;gap:.3rem;">
        Mapas <span style="font-size:.65rem;">▾</span>
      </button>
      <div id="menu-mapas" class="nav-dropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;background:var(--theme-background);border:1px solid var(--theme-foreground-faintest);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1);min-width:160px;z-index:9999;padding:.3rem 0;">
        <a href="/admin/mapas" class="nav-item">Gerenciar Mapas</a>
      </div>
    </div>

    <!-- Grupo: Alunos -->
    <div class="nav-group" style="position:relative; display:flex; align-items:center;">
      <button class="nav-btn" onclick="toggleMenu('menu-alunos')"
        style="background:none;border:none;cursor:pointer;padding:.3rem .6rem;border-radius:5px;font-size:.82rem;color:inherit;display:flex;align-items:center;gap:.3rem;">
        Alunos <span style="font-size:.65rem;">▾</span>
      </button>
      <div id="menu-alunos" class="nav-dropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;background:var(--theme-background);border:1px solid var(--theme-foreground-faintest);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1);min-width:180px;z-index:9999;padding:.3rem 0;">
        <a href="/admin/alunos"             class="nav-item">Lista de Alunos</a>
        <a href="/admin/cadastrar-aluno"    class="nav-item">Cadastrar Aluno</a>
      </div>
    </div>

    <!-- Grupo: Atividades -->
    <div class="nav-group" style="position:relative; display:flex; align-items:center;">
      <button class="nav-btn" onclick="toggleMenu('menu-atividades')"
        style="background:none;border:none;cursor:pointer;padding:.3rem .6rem;border-radius:5px;font-size:.82rem;color:inherit;display:flex;align-items:center;gap:.3rem;">
        Atividades <span style="font-size:.65rem;">▾</span>
      </button>
      <div id="menu-atividades" class="nav-dropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;background:var(--theme-background);border:1px solid var(--theme-foreground-faintest);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1);min-width:180px;z-index:9999;padding:.3rem 0;">
        <a href="/admin/atividades"                class="nav-item">Gerenciar Atividades</a>
        <a href="/admin/criar-atividade"           class="nav-item">Nova Atividade</a>
        <a href="/visualizacao/comparar-atividade" class="nav-item">Comparar por Atividade</a>
      </div>
    </div>

    <!-- Grupo: Administração (somente id_usuario = 1) -->
    <div id="nav-group-admin" class="nav-group" style="position:relative; display:none; align-items:center;">
      <button class="nav-btn" onclick="toggleMenu('menu-admin')"
        style="background:none;border:none;cursor:pointer;padding:.3rem .6rem;border-radius:5px;font-size:.82rem;color:inherit;display:flex;align-items:center;gap:.3rem;">
        Administração <span style="font-size:.65rem;">▾</span>
      </button>
      <div id="menu-admin" class="nav-dropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;background:var(--theme-background);border:1px solid var(--theme-foreground-faintest);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1);min-width:200px;z-index:9999;padding:.3rem 0;">
        <a href="/admin/professores"         class="nav-item">Professores</a>
        <a href="/admin/cadastrar-professor" class="nav-item">Cadastrar Professor</a>
        <a href="/admin/quadros"             class="nav-item">Gerenciar Quadros</a>
      </div>
    </div>

    <!-- Espaço flexível -->
    <div style="flex:1;"></div>

    <!-- Configurar ENA -->
    <a href="/configurar-ena" title="Configurar ENA via QR Code"
      style="margin-right:.4rem;font-size:.78rem;padding:.28rem .7rem;border:1px solid var(--theme-foreground-faint);border-radius:5px;cursor:pointer;background:transparent;color:inherit;text-decoration:none;white-space:nowrap;">
      📱 Configurar ENA
    </a>

    <!-- Usuário + Logout -->
    <span id="header-user" style="font-size:.82rem; color:var(--theme-foreground-muted);"></span>

    <!-- Botão personalizar (só para autenticados) -->
    <button id="btn-pers" onclick="abrirPers()" title="Personalizar quadros"
      style="display:none;margin-left:.6rem;background:none;border:none;cursor:pointer;font-size:1.05rem;padding:.28rem .45rem;border-radius:5px;color:var(--theme-foreground-muted);line-height:1;">
      ⚙
    </button>

    <button id="header-logout"
      style="margin-left:.5rem;font-size:.78rem;padding:.28rem .7rem;border:1px solid var(--theme-foreground-faint);border-radius:5px;cursor:pointer;background:transparent;color:inherit;">
      Sair
    </button>
  </nav>

  <!-- Modal de personalização -->
  <div id="modal-pers" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99999;align-items:flex-start;justify-content:flex-end;padding:3.5rem 1rem 1rem;">
    <div style="background:var(--theme-background);border-radius:12px;border:1px solid var(--theme-foreground-faintest);box-shadow:0 8px 32px rgba(0,0,0,.2);width:420px;max-height:calc(100vh - 5rem);display:flex;flex-direction:column;overflow:hidden;">

      <!-- Cabeçalho -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.8rem 1rem;border-bottom:1px solid var(--theme-foreground-faintest);flex-shrink:0;">
        <span style="font-weight:700;font-size:.92rem;">⚙ Personalizar Quadros</span>
        <button onclick="fechPers()" style="background:none;border:none;cursor:pointer;font-size:1rem;color:var(--theme-foreground-muted);padding:.2rem .45rem;border-radius:4px;line-height:1;">✕</button>
      </div>

      <!-- Corpo (scroll) -->
      <div id="modal-pers-body" style="overflow-y:auto;padding:.6rem .75rem;flex:1;"></div>

      <!-- Rodapé -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.7rem 1rem;border-top:1px solid var(--theme-foreground-faintest);flex-shrink:0;gap:.6rem;">
        <button onclick="restaurarPers()" class="btn-pers-sec">Restaurar padrões</button>
        <span style="font-size:.72rem;color:var(--theme-foreground-muted);text-align:right;">As alterações são aplicadas e salvas na hora.</span>
      </div>
    </div>
  </div>

  <style>
    .nav-btn:hover  { background: var(--theme-background-alt) !important; }
    .nav-item {
      display: block; padding: .42rem 1rem;
      text-decoration: none; color: var(--theme-foreground);
      font-size: .82rem; white-space: nowrap;
    }
    .nav-item:hover { background: var(--theme-background-alt); }
    #btn-pers:hover { background: var(--theme-background-alt) !important; color:var(--theme-foreground) !important; }

    /* Toggle switch */
    .pref-toggle { position:relative; display:inline-block; width:36px; height:20px; flex-shrink:0; }
    .pref-toggle input { opacity:0; width:0; height:0; position:absolute; }
    .pref-slider { position:absolute; cursor:pointer; inset:0; background:var(--theme-foreground-faint); border-radius:20px; transition:background .2s; }
    .pref-slider:before { content:""; position:absolute; height:16px; width:16px; left:2px; bottom:2px; background:#fff; border-radius:50%; transition:left .2s; box-shadow:0 1px 3px rgba(0,0,0,.25); }
    .pref-toggle input:checked + .pref-slider { background:var(--om-accent, #3b82f6); }
    .pref-toggle input:checked + .pref-slider:before { left:18px; }

    /* Linhas e seções do modal */
    .pref-sec-label { font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--theme-foreground-muted); padding:.35rem .5rem; background:var(--theme-background-alt); border-radius:6px; margin-bottom:.2rem; margin-top:.55rem; }
    .pref-row { display:grid; grid-template-columns:1fr auto auto; gap:.5rem; align-items:center; padding:.38rem .5rem; border-radius:6px; }
    .pref-row:hover { background:var(--theme-background-alt); }
    .pref-row-left { display:flex; align-items:center; gap:.4rem; min-width:0; }
    .pref-nome { font-size:.84rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .pref-tam { font-size:.64rem; padding:.1rem .35rem; border-radius:10px; background:var(--theme-background-alt); color:var(--theme-foreground-muted); border:1px solid var(--theme-foreground-faintest); flex-shrink:0; }
    .pref-order { display:flex; flex-direction:column; gap:1px; }
    .pref-order button { background:none; border:1px solid var(--theme-foreground-faintest); border-radius:3px; cursor:pointer; font-size:.6rem; line-height:1; padding:1px 4px; color:var(--theme-foreground-muted); }
    .pref-order button:hover:not(:disabled) { background:var(--theme-background-alt); color:var(--theme-foreground); }
    .pref-order button:disabled { opacity:.25; cursor:not-allowed; }
    .pref-right { display:flex; align-items:center; gap:.35rem; }
    .pref-status { font-size:.72rem; color:var(--theme-foreground-muted); width:24px; }

    /* Botões do rodapé */
    .btn-pers-sec { background:none; border:1px solid var(--theme-foreground-faint); border-radius:6px; padding:.38rem .85rem; font-size:.82rem; cursor:pointer; color:var(--theme-foreground); }
    .btn-pers-sec:hover { background:var(--theme-background-alt); }
    .btn-pers-pri { background:var(--om-accent, #3b82f6); border:none; border-radius:6px; padding:.38rem .85rem; font-size:.82rem; cursor:pointer; color:#fff; font-weight:600; }
    .btn-pers-pri:hover:not(:disabled) { opacity:.85; }
    .btn-pers-pri:disabled { opacity:.5; cursor:not-allowed; }

    /* Preview de layout */
    .prev-wrapper { display:flex; gap:.75rem; align-items:flex-start; }
    .prev-sidebar { width:175px; flex-shrink:0; background:var(--theme-background-alt); border-radius:8px; border:1px solid var(--theme-foreground-faintest); padding:.4rem 0; }
    .prev-sidebar-title { font-size:.64rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--theme-foreground-muted); padding:.3rem .75rem .25rem; }
    .prev-sidebar-item { display:flex; align-items:center; gap:.4rem; padding:.28rem .75rem; font-size:.77rem; color:var(--theme-foreground-muted); border-left:2px solid transparent; }
    .prev-sidebar-item.active { color:var(--theme-foreground); border-left-color:var(--om-accent,#3b82f6); background:rgba(59,130,246,.06); }
    .prev-dot { width:6px; height:6px; border-radius:50%; background:var(--theme-foreground-faintest); flex-shrink:0; }
    .prev-dot.active { background:var(--om-accent,#3b82f6); }
    .prev-main { flex:1; min-width:0; display:flex; flex-direction:column; gap:.6rem; }
    .prev-cols { display:grid; grid-template-columns:1fr 230px; gap:.6rem; align-items:start; }
    .prev-col  { display:flex; flex-direction:column; gap:.45rem; }
    .prev-card { border:1px solid var(--theme-foreground-faintest); border-radius:8px; overflow:hidden; }
    .prev-card-title { padding:.3rem .6rem; font-size:.72rem; font-weight:700; background:var(--theme-background-alt); border-bottom:1px solid var(--theme-foreground-faintest); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .prev-card-body  { padding:.4rem .5rem; }
    .prev-sec  { font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--theme-foreground-muted); padding:.5rem 0 .3rem; border-bottom:1px solid var(--theme-foreground-faintest); }
    .prev-empty { font-size:.8rem; color:var(--theme-foreground-muted); font-style:italic; padding:.5rem 0; }
  </style>

  <script>
    const _API = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
      ? 'http://127.0.0.1:5000/api'
      : 'https://api.omaproject.com.br/api';
    let _persData   = [];  // quadros do catálogo com preferências mescladas
    let _persState  = {};  // chave -> visivel
    let _orderState = {};  // secao -> [chave, chave, ...]

    function toggleMenu(id) {
      const el = document.getElementById(id);
      if (!el) return;
      const open = el.style.display === 'block';
      document.querySelectorAll('.nav-dropdown').forEach(d => d.style.display = 'none');
      if (!open) el.style.display = 'block';
    }
    document.addEventListener('click', e => {
      if (!e.target.closest('.nav-group') && !e.target.closest('#modal-pers'))
        document.querySelectorAll('.nav-dropdown').forEach(d => d.style.display = 'none');
    });

    // Exibe menu Administração e botão ⚙ conforme perfil
    (function() {
      try {
        const user = JSON.parse(sessionStorage.getItem('om_user') || '{}');
        if (user.id_usuario === 1) {
          const g = document.getElementById('nav-group-admin');
          if (g) g.style.display = 'flex';
        }
        if (user.id_usuario) {
          const b = document.getElementById('btn-pers');
          if (b) b.style.display = 'inline-block';
        }
      } catch(_) {}
    })();

    // ── Personalizar ─────────────────────────────────────────────────────────
    async function abrirPers() {
      const modal = document.getElementById('modal-pers');
      modal.style.display = 'flex';
      document.getElementById('modal-pers-body').innerHTML =
        '<p style="text-align:center;padding:2rem;color:var(--theme-foreground-muted);font-size:.85rem;">Carregando…</p>';
      await _carregarPers();
    }

    function fechPers() {
      document.getElementById('modal-pers').style.display = 'none';
    }
    document.getElementById('modal-pers').addEventListener('click', e => {
      if (e.target === document.getElementById('modal-pers')) fechPers();
    });

    async function _carregarPers() {
      const token = sessionStorage.getItem('om_token');
      const body  = document.getElementById('modal-pers-body');
      try {
        const resp = await fetch(_API + '/quadros/preferencias/', {
          headers: { Authorization: 'Bearer ' + token }
        });
        if (!resp.ok) throw new Error('Erro ' + resp.status);
        _persData   = await resp.json();
        _persState  = {};
        _orderState = {};
        for (const q of _persData) {
          _persState[q.chave] = q.visivel;
          if (q.personalizavel)
            (_orderState[q.secao] = _orderState[q.secao] || []).push(q.chave);
        }
        _renderPers();
      } catch(e) {
        body.innerHTML = '<p style="color:#dc2626;padding:1rem;font-size:.85rem;">Erro ao carregar: ' + e.message + '</p>';
      }
    }

    const _SECOES = [
      { chave:'esquerda', label:'Coluna Esquerda' },
      { chave:'centro',   label:'Coluna Centro'   },
      { chave:'direita',  label:'Coluna Direita'  },
      { chave:'multi',    label:'Sessões Múltiplas'},
    ];

    function _renderPers() {
      const body = document.getElementById('modal-pers-body');
      body.innerHTML = '';
      const quadroMap = Object.fromEntries(_persData.map(q => [q.chave, q]));

      for (const { chave: secao, label } of _SECOES) {
        const ordemSec = _orderState[secao] || [];
        if (!ordemSec.length) continue;

        const secLabel = document.createElement('div');
        secLabel.className = 'pref-sec-label';
        secLabel.textContent = label;
        body.append(secLabel);

        ordemSec.forEach((chave, idx) => {
          const q = quadroMap[chave];

          const row = document.createElement('div');
          row.className = 'pref-row';

          // ── Esquerda: nome + badge ──
          const left = document.createElement('div');
          left.className = 'pref-row-left';
          const nome = document.createElement('span');
          nome.className = 'pref-nome';
          nome.textContent = q.nome;
          const tam = document.createElement('span');
          tam.className = 'pref-tam';
          tam.textContent = q.tamanho;
          left.append(nome, tam);

          // ── Centro: botões ↑↓ ──
          const orderWrap = document.createElement('div');
          orderWrap.className = 'pref-order';
          const btnUp = document.createElement('button');
          btnUp.textContent = '▲'; btnUp.title = 'Mover para cima';
          btnUp.disabled = idx === 0;
          btnUp.addEventListener('click', e => {
            e.stopPropagation();
            _orderState[secao].splice(idx, 1);
            _orderState[secao].splice(idx - 1, 0, chave);
            _renderPers();
            _persistPrefs();
          });
          const btnDn = document.createElement('button');
          btnDn.textContent = '▼'; btnDn.title = 'Mover para baixo';
          btnDn.disabled = idx === ordemSec.length - 1;
          btnDn.addEventListener('click', e => {
            e.stopPropagation();
            _orderState[secao].splice(idx, 1);
            _orderState[secao].splice(idx + 1, 0, chave);
            _renderPers();
            _persistPrefs();
          });
          orderWrap.append(btnUp, btnDn);

          // ── Direita: toggle + ON/OFF ──
          const right = document.createElement('div');
          right.className = 'pref-right';

          const lbl = document.createElement('label');
          lbl.className = 'pref-toggle';
          lbl.onclick = e => e.stopPropagation();
          const chk = document.createElement('input');
          chk.type = 'checkbox';
          chk.checked = _persState[chave] ?? true;
          const slider = document.createElement('span');
          slider.className = 'pref-slider';
          lbl.append(chk, slider);

          const status = document.createElement('span');
          status.className = 'pref-status';
          status.textContent = chk.checked ? 'ON' : 'OFF';

          chk.addEventListener('change', () => {
            _persState[chave] = chk.checked;
            status.textContent = chk.checked ? 'ON' : 'OFF';
            _aplicarVivo(chave, chk.checked);
            _persistPrefs();
          });
          row.addEventListener('click', () => {
            chk.checked = !chk.checked;
            chk.dispatchEvent(new Event('change'));
          });

          right.append(lbl, status);
          row.append(left, orderWrap, right);
          body.append(row);
        });
      }
    }

    function restaurarPers() {
      _persState  = {};
      _orderState = {};
      for (const q of _persData) {
        if (!q.personalizavel) continue;
        _persState[q.chave] = q.ativo_padrao ?? true;
        (_orderState[q.secao] = _orderState[q.secao] || []).push(q.chave);
        _aplicarVivo(q.chave, _persState[q.chave]);
      }
      _renderPers();
      _persistPrefs();
    }

    // ── Aplicacao ao vivo + persistencia automatica ───────────────────────────
    function _aplicarVivo(chave, visivel) {
      document.querySelectorAll('[data-quadro-chave="' + chave + '"]').forEach(el => {
        el.style.display = visivel ? '' : 'none';
      });
    }

    let _persistTimer = null;
    function _persistPrefs() {
      clearTimeout(_persistTimer);
      _persistTimer = setTimeout(async () => {
        const token = sessionStorage.getItem('om_token');
        const payload = [];
        for (const [secao, chaves] of Object.entries(_orderState)) {
          chaves.forEach((chave, idx) => {
            payload.push({ chave, visivel: _persState[chave] ?? true, ordem: idx });
          });
        }
        try {
          await fetch(_API + '/quadros/preferencias/', {
            method: 'PATCH',
            headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch(e) { console.error('Erro ao salvar preferencias:', e); }
      }, 350);
    }

  </script>`,
};
