# Dashboard OM — Orientação e Mobilidade

Dashboard administrativo para o sistema de **Orientação e Mobilidade (OM)**, construído com [Observable Framework](https://observablehq.com/framework/). Permite que professores gerenciem alunos, mapas e atividades, e visualizem métricas de sessões de treino.

Requer a [api-om](https://github.com/Phyllipe-/api-om) em execução.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | [Observable Framework](https://observablehq.com/framework/) |
| Linguagem | JavaScript ES Modules |
| Autenticação | JWT armazenado em `sessionStorage` |
| Backend | [api-om](https://github.com/Phyllipe-/api-om) (Flask + PostgreSQL) |

---

## Estrutura do projeto

```
dashboard-om/
├── src/
│   ├── auth.js                       # Gerenciamento de sessão JWT
│   ├── api.js                        # Funções de acesso à api-om
│   ├── login.md                      # Página de login
│   ├── index.md                      # Página inicial
│   ├── admin/
│   │   ├── alunos.md                 # Lista e gerencia alunos
│   │   ├── cadastrar-aluno.md        # Formulário de cadastro de aluno
│   │   ├── editar-aluno.md           # Edição de dados do aluno
│   │   ├── professores.md            # Lista professores (admin)
│   │   ├── cadastrar-professor.md    # Formulário de cadastro de professor
│   │   ├── editar-professor.md       # Edição de dados do professor (admin)
│   │   ├── mapas.md                  # Gerencia mapas
│   │   ├── atividades.md             # Lista atividades
│   │   └── criar-atividade.md        # Criação de atividade
│   └── visualizacao/
│       ├── alunos.md                 # Lista geral de alunos
│       ├── dados-aluno.md            # Dados e sessões de um aluno
│       ├── perfil-aluno.md           # Perfil geral do aluno
│       └── perfil-detalhado.md       # Análises detalhadas por sessão
├── observablehq.config.js            # Navegação e configuração do app
└── package.json
```

---

## Controle de acesso

| Perfil | Permissões |
|---|---|
| **Professor** | Gerencia seus próprios alunos, mapas e atividades; visualiza métricas |
| **Administrador** (`id_usuario = 1`) | Acesso total, incluindo gerenciamento de professores |

---

## Configuração

### Pré-requisitos

- Node.js v20.6+
- [api-om](https://github.com/Phyllipe-/api-om) rodando em `http://127.0.0.1:5000`

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Build para produção

```bash
npm run build
```

Os arquivos estáticos são gerados em `dist/`.

---

## Comandos

| Comando | Descrição |
|---|---|
| `npm install` | Instala as dependências |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o site estático em `./dist` |
| `npm run clean` | Limpa o cache dos data loaders |
