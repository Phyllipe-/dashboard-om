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
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.7rem 1rem;border-top:1px solid var(--theme-foreground-faintest);flex-shrink:0;">
        <button onclick="restaurarPers()" class="btn-pers-sec">Restaurar padrões</button>
        <div style="display:flex;gap:.5rem;">
          <button onclick="abrirPreview()" class="btn-pers-sec">👁 Pré-visualizar</button>
          <button id="btn-salvar-pers" onclick="salvarPers()" class="btn-pers-pri">💾 Salvar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay de pré-visualização -->
  <div id="preview-pers" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:999999;overflow-y:auto;padding:1rem;">
    <div style="background:var(--theme-background);border-radius:12px;border:1px solid var(--theme-foreground-faintest);box-shadow:0 8px 32px rgba(0,0,0,.22);max-width:1100px;margin:0 auto;display:flex;flex-direction:column;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.8rem 1.1rem;border-bottom:1px solid var(--theme-foreground-faintest);flex-shrink:0;">
        <span style="font-weight:700;font-size:.92rem;">👁 Pré-visualização do Layout</span>
        <button onclick="fechPreview()" style="background:none;border:none;cursor:pointer;font-size:1rem;color:var(--theme-foreground-muted);padding:.2rem .45rem;border-radius:4px;line-height:1;">✕</button>
      </div>
      <div id="preview-pers-body" style="padding:1rem;"></div>
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
          });
          const btnDn = document.createElement('button');
          btnDn.textContent = '▼'; btnDn.title = 'Mover para baixo';
          btnDn.disabled = idx === ordemSec.length - 1;
          btnDn.addEventListener('click', e => {
            e.stopPropagation();
            _orderState[secao].splice(idx, 1);
            _orderState[secao].splice(idx + 1, 0, chave);
            _renderPers();
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
      }
      _renderPers();
    }

    // ── Preview ───────────────────────────────────────────────────────────────
    function abrirPreview() {
      document.getElementById('preview-pers').style.display = 'block';
      _buildPreview();
    }
    function fechPreview() {
      document.getElementById('preview-pers').style.display = 'none';
    }
    document.getElementById('preview-pers').addEventListener('click', e => {
      if (e.target === document.getElementById('preview-pers')) fechPreview();
    });

    function _buildPreview() {
      const body = document.getElementById('preview-pers-body');
      body.innerHTML = '';
      if (!_persData.length) {
        body.innerHTML = '<p class="prev-empty">Abra o personalizador primeiro para gerar o preview.</p>';
        return;
      }
      const qMap = Object.fromEntries(_persData.map(q => [q.chave, q]));

      function visiveisDe(secao) {
        const fixos = _persData.filter(q => q.secao === secao && !q.personalizavel && q.ativo_padrao).map(q => q.chave);
        const pers  = (_orderState[secao] || []).filter(k => _persState[k] !== false && qMap[k]);
        return [...fixos, ...pers];
      }

      // ── SVG mock charts ──────────────────────────────────────────────────
      const CHART_TYPE = {
        'mapa-giros':             'mapa',
        'eventos-area':           'heatmap',
        'colisoes-percurso':      'mapa',
        'mapa-permanencia':       'heatmap',
        'analise-comportamental': 'radar',
        'lat-por-sessoes':        'bar',
        'col-por-sessao':         'bar',
        'giros-detalhado':        'bar',
        'giros-por-sessao':       'bargroup',
        'dist-menor-caminho':     'barref',
        'col-giros-sessao':       'line',
        'evolucao-sessao':        'multiline',
      };

      function rnd(min, max) { return min + Math.random() * (max - min); }
      function _vb(W, h) { return '<svg viewBox="0 0 '+W+' '+h+'" width="100%" style="display:block" xmlns="http://www.w3.org/2000/svg">'; }

      function svgMapa(h) {
        var W = 300, cols = 8, rows = 6, cw = W/cols, ch = h/rows;
        var pal = ['#e2e8f0','#e2e8f0','#e2e8f0','#bfdbfe','#60a5fa','#3b82f6','#f59e0b','#10b981'];
        var c = '';
        for (var r = 0; r < rows; r++)
          for (var col = 0; col < cols; col++) {
            var fill = pal[Math.floor(Math.random() * pal.length)];
            c += '<rect x="'+(col*cw+1)+'" y="'+(r*ch+1)+'" width="'+(cw-2)+'" height="'+(ch-2)+'" rx="2" fill="'+fill+'"/>';
          }
        return _vb(W,h)+c+'</svg>';
      }

      function svgHeatmap(h) {
        var W = 300, cols = 10, rows = 7, cw = W/cols, ch = h/rows;
        var pal = ['#eff6ff','#dbeafe','#93c5fd','#3b82f6','#1d4ed8','#f59e0b','#ef4444'];
        var c = '';
        for (var r = 0; r < rows; r++)
          for (var col = 0; col < cols; col++) {
            var v = Math.random();
            c += '<rect x="'+(col*cw+.5)+'" y="'+(r*ch+.5)+'" width="'+(cw-1)+'" height="'+(ch-1)+'" fill="'+pal[Math.floor(v*(pal.length-1))]+'" opacity="'+(0.45+v*0.55)+'"/>';
          }
        return _vb(W,h)+c+'</svg>';
      }

      function svgBar(h) {
        var W = 300, n = 6, pad = 14, gap = (W-pad*2)/n, bw = gap*0.62;
        var bars = '<line x1="'+pad+'" y1="'+(h-10)+'" x2="'+(W-pad)+'" y2="'+(h-10)+'" stroke="#e2e8f0" stroke-width="1"/>';
        for (var i = 0; i < n; i++) {
          var bh = rnd(0.28, 0.88) * (h-18);
          bars += '<rect x="'+(pad+i*gap+gap*0.19)+'" y="'+(h-10-bh)+'" width="'+bw+'" height="'+bh+'" rx="2" fill="#3b82f6" opacity="'+rnd(0.55,0.9)+'"/>';
        }
        return _vb(W,h)+bars+'</svg>';
      }

      function svgBarGroup(h) {
        var W = 300, n = 4, pad = 14, gap = (W-pad*2)/n, bw = gap*0.36;
        var colors = ['#3b82f6','#10b981'];
        var bars = '<line x1="'+pad+'" y1="'+(h-10)+'" x2="'+(W-pad)+'" y2="'+(h-10)+'" stroke="#e2e8f0" stroke-width="1"/>';
        for (var i = 0; i < n; i++)
          for (var s = 0; s < 2; s++) {
            var bh = rnd(0.25, 0.8) * (h-18);
            bars += '<rect x="'+(pad+i*gap+s*bw+gap*0.08)+'" y="'+(h-10-bh)+'" width="'+bw+'" height="'+bh+'" rx="2" fill="'+colors[s]+'" opacity="0.82"/>';
          }
        return _vb(W,h)+bars+'</svg>';
      }

      function svgBarRef(h) {
        var W = 300, n = 5, pad = 14, gap = (W-pad*2)/n, bw = gap*0.58;
        var refY = Math.round((h-10) * 0.38);
        var bars = '<line x1="'+pad+'" y1="'+(h-10)+'" x2="'+(W-pad)+'" y2="'+(h-10)+'" stroke="#e2e8f0" stroke-width="1"/>';
        for (var i = 0; i < n; i++) {
          var bh = rnd(0.22, 0.75) * (h-18);
          bars += '<rect x="'+(pad+i*gap+gap*0.21)+'" y="'+(h-10-bh)+'" width="'+bw+'" height="'+bh+'" rx="2" fill="#3b82f6" opacity="'+rnd(0.55,0.88)+'"/>';
        }
        bars += '<line x1="'+pad+'" y1="'+refY+'" x2="'+(W-pad)+'" y2="'+refY+'" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/>';
        bars += '<text x="'+(W-pad-2)+'" y="'+(refY-4)+'" text-anchor="end" font-size="8" fill="#10b981" font-family="sans-serif">Menor Caminho</text>';
        return _vb(W,h)+bars+'</svg>';
      }

      function svgLine(h) {
        var W = 300, n = 9, pad = 14;
        var pts = [], i;
        for (i = 0; i < n; i++) pts.push([pad + i*(W-pad*2)/(n-1), pad + rnd(0.1,0.85)*(h-pad*2)]);
        var d = pts.map(function(p,i){ return (i?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1); }).join(' ');
        var dots = pts.map(function(p){ return '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="2.5" fill="#3b82f6"/>'; }).join('');
        return _vb(W,h)+'<path d="'+d+'" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round"/>'+dots+'</svg>';
      }

      function svgMultiline(h) {
        var W = 300, n = 9, pad = 14;
        var colors = ['#3b82f6','#10b981','#f59e0b'];
        var paths = '', ci, i;
        for (ci = 0; ci < colors.length; ci++) {
          var pts = [];
          for (i = 0; i < n; i++) pts.push([pad + i*(W-pad*2)/(n-1), pad + rnd(0.1,0.85)*(h-pad*2)]);
          var d = pts.map(function(p,i){ return (i?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1); }).join(' ');
          paths += '<path d="'+d+'" fill="none" stroke="'+colors[ci]+'" stroke-width="1.8" stroke-linejoin="round" opacity="0.85"/>';
        }
        return _vb(W,h)+paths+'</svg>';
      }

      function svgRadar(h) {
        var W = 300, cx = W/2, cy = h/2, r = Math.min(W,h)/2 - 12, n = 6;
        var axes = [], i;
        for (i = 0; i < n; i++) {
          var a = (i/n)*Math.PI*2 - Math.PI/2;
          axes.push([cx + r*Math.cos(a), cy + r*Math.sin(a)]);
        }
        var web = axes.map(function(p){ return '<line x1="'+cx+'" y1="'+cy+'" x2="'+p[0].toFixed(1)+'" y2="'+p[1].toFixed(1)+'" stroke="#e2e8f0" stroke-width="1"/>'; }).join('');
        var rings = [0.33,0.66,1].map(function(f){
          var pts = axes.map(function(p){ return [(cx+(p[0]-cx)*f).toFixed(1),(cy+(p[1]-cy)*f).toFixed(1)]; });
          return '<polygon points="'+pts.map(function(p){return p.join(',');}).join(' ')+'" fill="none" stroke="#e2e8f0" stroke-width="1"/>';
        }).join('');
        var vals = axes.map(function(p){ var v = rnd(0.3,0.92); return [(cx+(p[0]-cx)*v).toFixed(1),(cy+(p[1]-cy)*v).toFixed(1)]; });
        var poly = '<polygon points="'+vals.map(function(p){return p.join(',');}).join(' ')+'" fill="#3b82f6" fill-opacity=".22" stroke="#3b82f6" stroke-width="1.5"/>';
        return _vb(W,h)+web+rings+poly+'</svg>';
      }

      function mkSvg(chave, h) {
        switch(CHART_TYPE[chave] || 'bar') {
          case 'mapa':      return svgMapa(h);
          case 'heatmap':   return svgHeatmap(h);
          case 'bar':       return svgBar(h);
          case 'bargroup':  return svgBarGroup(h);
          case 'barref':    return svgBarRef(h);
          case 'line':      return svgLine(h);
          case 'multiline': return svgMultiline(h);
          case 'radar':     return svgRadar(h);
          default:          return svgBar(h);
        }
      }

      function mkCard(q) {
        const h = q.tamanho === 'grande' ? 130 : 80;
        const card = document.createElement('div');
        card.className = 'prev-card';
        const t = document.createElement('div');
        t.className = 'prev-card-title'; t.textContent = q.nome; t.title = q.nome;
        const b = document.createElement('div');
        b.className = 'prev-card-body';
        b.innerHTML = mkSvg(q.chave, h);
        card.append(t, b);
        return card;
      }

      // ── Layout ───────────────────────────────────────────────────────────
      const wrapper = document.createElement('div');
      wrapper.className = 'prev-wrapper';

      // Sidebar esquerda (menu lateral)
      const sidebar = document.createElement('div');
      sidebar.className = 'prev-sidebar';
      const sideLbl = document.createElement('div');
      sideLbl.className = 'prev-sidebar-title';
      sideLbl.textContent = 'Menu Lateral';
      sidebar.append(sideLbl);

      const esquerdaVisiveis = new Set(visiveisDe('esquerda'));
      for (const q of _persData.filter(q => q.secao === 'esquerda')) {
        const on = !q.personalizavel ? q.ativo_padrao : esquerdaVisiveis.has(q.chave);
        const item = document.createElement('div');
        item.className = 'prev-sidebar-item' + (on ? ' active' : '');
        const dot = document.createElement('span');
        dot.className = 'prev-dot' + (on ? ' active' : '');
        const txt = document.createElement('span');
        txt.textContent = q.nome;
        if (!on) txt.style.opacity = '0.4';
        item.append(dot, txt);
        sidebar.append(item);
      }
      wrapper.append(sidebar);

      // Main: centro + direita + multi
      const main = document.createElement('div');
      main.className = 'prev-main';

      const colsDiv = document.createElement('div');
      colsDiv.className = 'prev-cols';

      const colC = document.createElement('div'); colC.className = 'prev-col';
      for (const k of visiveisDe('centro')) colC.append(mkCard(qMap[k]));
      if (!colC.children.length) { const e = document.createElement('p'); e.className = 'prev-empty'; e.textContent = 'Nenhum quadro visível'; colC.append(e); }

      const colD = document.createElement('div'); colD.className = 'prev-col';
      for (const k of visiveisDe('direita')) colD.append(mkCard(qMap[k]));
      if (!colD.children.length) { const e = document.createElement('p'); e.className = 'prev-empty'; e.textContent = 'Nenhum quadro visível'; colD.append(e); }

      colsDiv.append(colC, colD);
      main.append(colsDiv);

      const multiChaves = visiveisDe('multi');
      if (multiChaves.length) {
        const secLbl = document.createElement('div');
        secLbl.className = 'prev-sec'; secLbl.textContent = 'Sessões Múltiplas';
        main.append(secLbl);

        const multiCols = document.createElement('div');
        multiCols.className = 'prev-cols';
        const mC = document.createElement('div'); mC.className = 'prev-col';
        const mD = document.createElement('div'); mD.className = 'prev-col';
        for (const k of multiChaves) {
          const q = qMap[k];
          (q.tamanho === 'grande' ? mC : mD).append(mkCard(q));
        }
        if (!mC.children.length) { const e = document.createElement('p'); e.className = 'prev-empty'; e.textContent = 'Nenhum'; mC.append(e); }
        if (!mD.children.length) { const e = document.createElement('p'); e.className = 'prev-empty'; e.textContent = 'Nenhum'; mD.append(e); }
        multiCols.append(mC, mD);
        main.append(multiCols);
      }

      wrapper.append(main);
      body.append(wrapper);
    }

    async function salvarPers() {
      const token = sessionStorage.getItem('om_token');
      const btn   = document.getElementById('btn-salvar-pers');
      btn.disabled = true; btn.textContent = 'Salvando…';

      const payload = [];
      for (const [secao, chaves] of Object.entries(_orderState)) {
        chaves.forEach((chave, idx) => {
          payload.push({ chave, visivel: _persState[chave] ?? true, ordem: idx });
        });
      }

      try {
        const resp = await fetch(_API + '/quadros/preferencias/', {
          method: 'PATCH',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!resp.ok) throw new Error('Erro ' + resp.status);
        fechPers();
      } catch(e) {
        alert('Erro ao salvar: ' + e.message);
      } finally {
        btn.disabled = false; btn.textContent = '💾 Salvar';
      }
    }
  </script>`,
};
