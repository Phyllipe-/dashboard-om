// See https://observablehq.com/framework/config for documentation.
export default {
  title: "Dashboard OM",

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
    <a href="/" style="font-weight:700; font-size:.95rem; text-decoration:none; color:inherit; margin-right:1.5rem; white-space:nowrap;">
      Dashboard OM
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
        <a href="/visualizacao/alunos"      class="nav-item">Lista de Alunos</a>
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
        <a href="/admin/atividades"      class="nav-item">Gerenciar Atividades</a>
        <a href="/admin/criar-atividade" class="nav-item">Nova Atividade</a>
      </div>
    </div>

    <!-- Grupo: Visualização -->
    <div class="nav-group" style="position:relative; display:flex; align-items:center;">
      <button class="nav-btn" onclick="toggleMenu('menu-vis')"
        style="background:none;border:none;cursor:pointer;padding:.3rem .6rem;border-radius:5px;font-size:.82rem;color:inherit;display:flex;align-items:center;gap:.3rem;">
        Visualização <span style="font-size:.65rem;">▾</span>
      </button>
      <div id="menu-vis" class="nav-dropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;background:var(--theme-background);border:1px solid var(--theme-foreground-faintest);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1);min-width:200px;z-index:9999;padding:.3rem 0;">
        <a href="/visualizacao/dados-aluno"         class="nav-item">Dados do Aluno</a>
        <a href="/visualizacao/perfil-aluno"        class="nav-item">Perfil Geral</a>
        <a href="/visualizacao/perfil-detalhado"    class="nav-item">Perfil Detalhado</a>
        <a href="/visualizacao/comparar-atividade"  class="nav-item">Comparar por Atividade</a>
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
      </div>
    </div>

    <!-- Espaço flexível -->
    <div style="flex:1;"></div>

    <!-- Usuário + Logout -->
    <span id="header-user" style="font-size:.82rem; color:var(--theme-foreground-muted);"></span>
    <button id="header-logout"
      style="margin-left:.75rem;font-size:.78rem;padding:.28rem .7rem;border:1px solid var(--theme-foreground-faint);border-radius:5px;cursor:pointer;background:transparent;color:inherit;">
      Sair
    </button>
  </nav>

  <style>
    .nav-btn:hover  { background: var(--theme-background-alt) !important; }
    .nav-item {
      display: block; padding: .42rem 1rem;
      text-decoration: none; color: var(--theme-foreground);
      font-size: .82rem; white-space: nowrap;
    }
    .nav-item:hover { background: var(--theme-background-alt); }
  </style>

  <script>
    function toggleMenu(id) {
      const el = document.getElementById(id);
      if (!el) return;
      const open = el.style.display === 'block';
      document.querySelectorAll('.nav-dropdown').forEach(d => d.style.display = 'none');
      if (!open) el.style.display = 'block';
    }
    // Fecha ao clicar fora
    document.addEventListener('click', e => {
      if (!e.target.closest('.nav-group')) {
        document.querySelectorAll('.nav-dropdown').forEach(d => d.style.display = 'none');
      }
    });
    // Exibe menu Administração somente para id_usuario = 1
    (function() {
      try {
        const user = JSON.parse(sessionStorage.getItem('om_user') || '{}');
        if (user.id_usuario === 1) {
          const g = document.getElementById('nav-group-admin');
          if (g) g.style.display = 'flex';
        }
      } catch(_) {}
    })();
  </script>`,
};
