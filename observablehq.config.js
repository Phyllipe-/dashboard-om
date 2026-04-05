// See https://observablehq.com/framework/config for documentation.
export default {
  title: "Dashboard OM",

  pages: [
    {
      name: "Administração",
      pages: [
        { name: "Mapas",                path: "/admin/mapas" },
        { name: "Alunos",               path: "/admin/alunos" },
        { name: "Cadastrar Aluno",      path: "/admin/cadastrar-aluno" },
        { name: "Professores",          path: "/admin/professores" },
        { name: "Cadastrar Professor",  path: "/admin/cadastrar-professor" },
        { name: "Atividades",         path: "/admin/atividades" },
        { name: "Nova Atividade",     path: "/admin/criar-atividade" },
      ]
    },
    {
      name: "Visualização",
      pages: [
        { name: "Lista de Alunos",  path: "/visualizacao/alunos" },
        { name: "Dados do Aluno",   path: "/visualizacao/dados-aluno" },
        { name: "Perfil Geral",     path: "/visualizacao/perfil-aluno" },
        { name: "Perfil Detalhado", path: "/visualizacao/perfil-detalhado" },
      ]
    },
  ],

  head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  root: "src",

  header: '<div id="app-header" style="display:flex;align-items:center;justify-content:flex-end;gap:1rem;padding:0 1rem;"><span id="header-user" style="font-size:0.875rem;"></span><button id="header-logout" style="font-size:0.8rem;padding:0.3rem 0.75rem;border:1px solid #ccc;border-radius:4px;cursor:pointer;background:transparent;">Sair</button></div>',
};
