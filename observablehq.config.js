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

    <!-- Grupo: Administração -->
    <div class="nav-group" style="position:relative; display:flex; align-items:center;">
      <button class="nav-btn" onclick="toggleMenu('menu-admin')"
        style="background:none;border:none;cursor:pointer;padding:.3rem .6rem;border-radius:5px;font-size:.82rem;color:inherit;display:flex;align-items:center;gap:.3rem;">
        Administração <span style="font-size:.65rem;">▾</span>
      </button>
      <div id="menu-admin" class="nav-dropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;background:var(--theme-background);border:1px solid var(--theme-foreground-faintest);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1);min-width:180px;z-index:9999;padding:.3rem 0;">
        <a href="/admin/mapas"               class="nav-item">Mapas</a>
        <a href="/admin/alunos"              class="nav-item">Alunos</a>
        <a href="/admin/cadastrar-aluno"     class="nav-item">Cadastrar Aluno</a>
        <a href="/admin/professores"         class="nav-item">Professores</a>
        <a href="/admin/cadastrar-professor" class="nav-item">Cadastrar Professor</a>
        <hr style="margin:.3rem 0;border:none;border-top:1px solid var(--theme-foreground-faintest);">
        <a href="/admin/atividades"          class="nav-item">Atividades</a>
        <a href="/admin/criar-atividade"     class="nav-item">Nova Atividade</a>
      </div>
    </div>

    <!-- Grupo: Visualização -->
    <div class="nav-group" style="position:relative; display:flex; align-items:center;">
      <button class="nav-btn" onclick="toggleMenu('menu-vis')"
        style="background:none;border:none;cursor:pointer;padding:.3rem .6rem;border-radius:5px;font-size:.82rem;color:inherit;display:flex;align-items:center;gap:.3rem;">
        Visualização <span style="font-size:.65rem;">▾</span>
      </button>
      <div id="menu-vis" class="nav-dropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;background:var(--theme-background);border:1px solid var(--theme-foreground-faintest);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1);min-width:200px;z-index:9999;padding:.3rem 0;">
        <a href="/visualizacao/alunos"              class="nav-item">Lista de Alunos</a>
        <a href="/visualizacao/dados-aluno"         class="nav-item">Dados do Aluno</a>
        <a href="/visualizacao/perfil-aluno"        class="nav-item">Perfil Geral</a>
        <a href="/visualizacao/perfil-detalhado"    class="nav-item">Perfil Detalhado</a>
        <a href="/visualizacao/comparar-atividade"  class="nav-item">Comparar por Atividade</a>
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
      // Fecha todos os dropdowns
      document.querySelectorAll('.nav-dropdown').forEach(d => d.style.display = 'none');
      if (!open) el.style.display = 'block';
    }
    // Fecha ao clicar fora
    document.addEventListener('click', e => {
      if (!e.target.closest('.nav-group')) {
        document.querySelectorAll('.nav-dropdown').forEach(d => d.style.display = 'none');
      }
    });
  </script>`,
};
