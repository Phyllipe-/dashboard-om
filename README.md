# Dashboard Om

This is an [Observable Framework](https://observablehq.com/framework/) app. To install the required dependencies, run:

```
npm install
```

Then, to start the local preview server, run:

```
npm run dev
```

Then visit <http://localhost:3000> to preview your app.

For more, see <https://observablehq.com/framework/getting-started>.

## Project structure

A typical Framework project looks like this:

```ini
.
├─ src
│  ├─ components
│  │  └─ timeline.js           # an importable module
│  ├─ data
│  │  ├─ launches.csv.js       # a data loader
│  │  └─ events.json           # a static data file
│  ├─ example-dashboard.md     # a page
│  ├─ example-report.md        # another page
│  └─ index.md                 # the home page
├─ .gitignore
├─ observablehq.config.js      # the app config file
├─ package.json
└─ README.md
```

**`src`** - This is the “source root” — where your source files live. Pages go here. Each page is a Markdown file. Observable Framework uses [file-based routing](https://observablehq.com/framework/project-structure#routing), which means that the name of the file controls where the page is served. You can create as many pages as you like. Use folders to organize your pages.

**`src/index.md`** - This is the home page for your app. You can have as many additional pages as you’d like, but you should always have a home page, too.

**`src/data`** - You can put [data loaders](https://observablehq.com/framework/data-loaders) or static data files anywhere in your source root, but we recommend putting them here.

**`src/components`** - You can put shared [JavaScript modules](https://observablehq.com/framework/imports) anywhere in your source root, but we recommend putting them here. This helps you pull code out of Markdown files and into JavaScript modules, making it easier to reuse code across pages, write tests and run linters, and even share code with vanilla web applications.

**`observablehq.config.js`** - This is the [app configuration](https://observablehq.com/framework/config) file, such as the pages and sections in the sidebar navigation, and the app’s title.

## Command reference

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm install`            | Install or reinstall dependencies                        |
| `npm run dev`        | Start local preview server                               |
| `npm run build`      | Build your static site, generating `./dist`              |
| `npm run deploy`     | Deploy your app to Observable                            |
| `npm run clean`      | Clear the local data loader cache                        |
| `npm run observable` | Run commands like `observable help`                      |


Excelente marco! Estabelecer a **Arquitetura 0.1** consolida todo o trabalho de validação visual e lógica que fizemos até aqui, transformando um script de laboratório num pipeline de dados profissional e escalável.

Abaixo está o conteúdo completo para o seu `README.md`. Ele foi redigido para documentar não apenas os comandos técnicos, mas também o propósito do sistema dentro do contexto do apoio à reabilitação em Orientação e Mobilidade.

Pode copiar este texto e guardá-lo na raiz do seu projeto `dashboard-om`.

---

```markdown
# 🗺️ Projeto E3: Dashboard de Apoio à Reabilitação em Orientação e Mobilidade

**Versão:** Arquitetura 0.1 (Baseada no Marco Estável 18.1F)

Este projeto implementa um ecossistema de análise de dados projetado como ferramenta de apoio no treinamento de Orientação e Mobilidade (OM) para pessoas com deficiência visual. O sistema processa mapas de ambientes virtuais/físicos exportados em XML e gera visualizações semânticas limpas, prontas para o cruzamento com dados de navegação e lateralidade de alunos.

## 🏗️ Pilha Tecnológica (Stack)
* **Frontend:** Observable Framework (Markdown + JavaScript)
* **Visualização:** Observable Plot
* **Backend / ETL (Data Loaders):** Node.js
* **Processamento XML:** `@xmldom/xmldom`

## 📁 Arquitetura de Pastas (Pipeline de Dados)

O projeto segue uma arquitetura orientada a dados em tempo de build (*Build-time Data Loaders*):

```text
dashboard-om/
├── docs/                # Arquivos fonte do Observable Framework (versões mais antigas usam src/)
│   ├── index.md         # O Dashboard principal (Interface Visual)
│   └── data/
│       ├── xml/         # 📥 DROP ZONE: Coloque os mapas XML do treino aqui
│       └── mapas.json.js # ⚙️ MOTOR NODE.JS: Processa os XMLs e gera o JSON
├── package.json         # Dependências do projeto
└── README.md            # Este documento

```

## 🚀 Como Iniciar o Projeto (Passo a Passo)

### 1. Configuração do Ambiente

Certifique-se de que possui o Node.js (v20.6+) instalado. Na raiz do projeto, instale as dependências:

```bash
npm install
npm install @xmldom/xmldom

```

### 2. Adição de Dados

Exporte os cenários ou plantas baixas do ambiente de treino em formato `.xml` e coloque-os dentro da pasta `docs/data/xml/` (ou `src/data/xml/`, dependendo da sua versão do Framework).

### 3. Iniciar o Servidor de Desenvolvimento

Para arrancar o dashboard e ativar os Data Loaders, execute:

```bash
npm run dev

```

O painel estará disponível no seu navegador, geralmente em `http://localhost:3000`.

## 🧠 Como Funciona o Motor de Processamento (Estável 18.1F)

O ficheiro `mapas.json.js` não é executado no navegador do utilizador. Ele corre no servidor local para poupar processamento. Ele aplica as seguintes regras de Inteligência Artificial aos mapas XML:

1. **Dicionário Semântico E3:** Traduz índices numéricos vazios (ex: `0.1`, `4.5`) para objetos reais de OM (ex: "Cama de Casal", "Guarda-roupa", "Piso tátil de atenção").
2. **Supressão de Zeros Fantasmas (Parser Seguro):** Limpa as exportações com linhas em branco para evitar poluição visual de falsos objetos geométricos.
3. **Máscara de Colisão e Z-Index:** Garante que a estrutura física do edifício (`walls`) tem prioridade absoluta. Pisos (`floor`) que tentem invadir paredes são matematicamente recortados.
4. **Agrupamento Espacial (Bounding Boxes):** Móveis e utilidades conectadas são fundidos num único bloco limpo com 70% de ocupação do *tile*, criando "respiro" visual para as áreas de circulação.
5. **Deteção Automática de Ambientes (Flood Fill):** Um algoritmo varre a malha descobrindo qual é a maior área contínua. Essa área é classificada como "Ambiente Externo" (perdendo a grelha de passos), enquanto as áreas confinadas por paredes e portas são classificadas como "Ambiente Interno (Salas)" (ganhando a grelha).


Tabelas

Pessoa
-id_pessoa
-tipo_pessoa
-ativo
-login
-email
-senha
Aluno
-id_aluno
-nome
-idade
-escolaridade
-mapa_atual
-mapa_anterior
-registro_mapas
Professor
-id_professor
-lista_alunos_atual
-registro_alunos
-mapas_criados
TipoPessoa
-id_tipo
-descricao
Mapa
-id_mapa
-xml_json_arquivo
-nome_mapa
-criador_mapa
LOG
-id_log
-log_arquivo
-data_criacao_arquivo_log
-id_aluno
-id_criador

Lateralidade, SimulacaoTrajetoria, Trafego, Giros e Comparacao
-data_json

