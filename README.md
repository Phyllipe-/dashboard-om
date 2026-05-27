# dashboard-om

Dashboard administrativo do **OMA Project** (Orientação e Mobilidade). Permite que professores gerenciem alunos, mapas e atividades, e visualizem análises das sessões de treino.

Construído com [Observable Framework](https://observablehq.com/framework/) — gera um site estático a partir de arquivos `.md` com JavaScript.

Requer a [api-om](../api-om) em execução.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Observable Framework 1.x |
| Linguagem | JavaScript ES Modules |
| Autenticação | JWT em `sessionStorage` (não persiste entre abas) |
| Testes | Vitest 2 |
| Deploy | Nginx (Hetzner) via GitHub Actions |

## Pré-requisitos

- Node.js 18+
- [api-om](../api-om) rodando localmente

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
```

A URL da API é detectada automaticamente:
- `localhost` → `http://127.0.0.1:5000/api`
- qualquer outro host → `https://api.omaproject.com.br/api`

Não é necessário nenhum `.env` para desenvolvimento local.

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Gera o site estático em `dist/` |
| `npm run clean` | Limpa o cache dos data loaders |
| `npm test` | Roda os testes unitários (Vitest) |
| `npm run test:watch` | Testes em modo watch |

## Estrutura

```
dashboard-om/
├── src/
│   ├── auth.js                        # Gerenciamento de sessão JWT
│   ├── api.js                         # Funções de acesso à api-om
│   ├── index.md                       # Página inicial / redirect
│   ├── login.md                       # Tela de login
│   ├── registro.md                    # Cadastro de professor
│   ├── admin/
│   │   ├── alunos.md                  # Lista e gerencia alunos
│   │   ├── cadastrar-aluno.md
│   │   ├── editar-aluno.md
│   │   ├── professores.md             # Somente admin
│   │   ├── cadastrar-professor.md
│   │   ├── editar-professor.md
│   │   ├── mapas.md                   # Upload, download e edição de mapas
│   │   ├── atividades.md
│   │   └── criar-atividade.md
│   └── visualizacao/
│       ├── alunos.md
│       ├── dados-aluno.md
│       ├── sessao.md                  # Análise detalhada de sessão (heatmap, giros, colisão)
│       └── perfil-aluno.md
├── src/lib/                           # Lógica pura — testável
│   ├── mapa/
│   │   └── parser.js                  # parseMapaXML() — lê XML do mapa ENA
│   └── sessao/
│       ├── giros.js                   # detectarGiros(), posicoesIguais()
│       ├── heatmap.js                 # contarMovimentos(), heatTilesParaRects()
│       ├── colisao.js                 # extrairSegmentos(), extrairColisoes()
│       └── lateralidade.js            # extrairLateralidade()
├── observablehq.config.js             # Navegação e sidebar do app
├── .github/workflows/deploy.yml       # CI/CD
└── package.json
```

## Testes

Os testes cobrem as funções puras em `src/lib/` — algoritmos de processamento do log de sessão e parser de XML:

```bash
npm test
```

```
✓ src/lib/sessao/giros.test.js        (15 testes)
✓ src/lib/sessao/heatmap.test.js      (11 testes)
✓ src/lib/sessao/colisao.test.js      (16 testes)
✓ src/lib/sessao/lateralidade.test.js  (6 testes)
✓ src/lib/mapa/parser.test.js          (8 testes)
```

O que **não** está coberto por testes: páginas `.md`, gráficos Observable Plot, chamadas à API, fluxo de autenticação. Para esses, seria necessário Playwright (testes de navegador).

Para adicionar um novo teste, crie um arquivo `<modulo>.test.js` ao lado do arquivo correspondente em `src/lib/`.

## CI/CD

Push para `master` dispara o workflow em `.github/workflows/deploy.yml`:

1. **Job `test`** — roda `npm test` no runner self-hosted
2. **Job `deploy`** — só executa se os testes passarem; faz build e copia `dist/` para `/var/www/dashboard-om/` no servidor Hetzner

O runner self-hosted (`ghrunner` user) está instalado no mesmo servidor Hetzner que serve o site.

## Controle de acesso

| Perfil | Permissões |
|---|---|
| **Professor** | Gerencia seus próprios alunos, mapas e atividades |
| **Admin** (`id_usuario = 1`) | Acesso total, incluindo gerenciamento de professores |

A verificação é feita pela api-om. O dashboard apenas lê o papel do usuário pelo token JWT.

## Convenções

- Cada página `.md` é autônoma — carrega seus próprios dados via `fetch` + JWT do `sessionStorage`
- Lógica reutilizável (parsing, cálculos) vai em `src/lib/` como funções puras exportadas
- Imagens protegidas (minimap, render 3D) são carregadas via `fetch` com `Authorization` header + `URL.createObjectURL` — nunca com token na URL
- `E3_BASE` é detectado por `location.hostname` para apontar ao e3-react correto (dev vs prod)

## Ambientes

| Ambiente | URL |
|---|---|
| Desenvolvimento | `http://localhost:3000` |
| Produção | `https://mova.omaproject.com.br` |
