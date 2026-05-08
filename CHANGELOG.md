# Changelog — CentralAI

Todas as mudanças notáveis deste projeto são documentadas aqui.  
Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)  
Versionamento: [Semantic Versioning 2.0.0](https://semver.org/lang/pt-BR/)

---

## [1.0.0] — 2025-12-01

### Adicionado
- `docs/GCS.md` — Gerência de Configuração de Software: Gitflow, Conventional Commits, SemVer
- `docs/PROCESS.md` — Processos de Software: Waterfall, RUP, Scrum, XP, Kanban
- `docs/DATABASE.md` — Banco de Dados: ER diagram, DDL SQL, DML, normalização
- `docs/PARADIGMS.md` — Linguagens e Paradigmas: imperativo, OO, funcional, declarativo, event-driven
- `docs/NETWORKS.md` — Redes e SO: TCP/IP, HTTP, REST, CORS, Event Loop, localStorage
- `docs/MODELING.md` — 12 diagramas UML, tabela de padrões, complexidade Big-O
- `docs/PROJECT.md` — TAP, EAP, backlog MoSCoW, cronograma 10 sprints
- `.gitignore`, `package.json`, `CHANGELOG.md`

### Alterado
- `index.html` — seção de chat, nav links, scripts core.js/extensions.js
- `css/style.css` — seção 17: estilos completos do chat assistente

---

## [0.9.0] — 2025-11-15

### Adicionado
- `js/repository.js` — Repository Pattern + simulação relacional (CRUD, JOIN, transaction)
- `docs/DATABASE.md` — documentação inicial do BD

---

## [0.8.0] — 2025-11-01

### Adicionado
- `js/extensions.js` — Command, Decorator, Adapter, Chain of Responsibility, Plugin System
- Seção de chat na UI com `ChatPlugin` e respostas mock
- `ThemePlugin` com 4 temas (glassmorphism, minimal, neon, classic)

---

## [0.7.0] — 2025-10-15

### Adicionado
- `js/core.js` — estruturas de dados (LinkedList, Stack, Queue), algoritmos (BinarySearch, InsertionSort, MergeSort), iteradores, generators, Proxy/Reflect/Symbol/WeakMap

---

## [0.6.0] — 2025-10-01

### Adicionado
- Seções de recomendação e comparação na UI
- `js/components.js` — CatalogComponent, ComparatorComponent, RecommenderComponent

---

## [0.5.0] — 2025-09-15

### Adicionado
- CSS v2: glassmorphism dark theme, animações, design premium
- Sistema de Design com custom properties CSS

---

## [0.4.0] — 2025-09-01

### Adicionado
- `js/services.js` — EventEmitter, Singleton (CatalogService), Strategy (RecStrategy)

---

## [0.3.0] — 2025-08-15

### Adicionado
- `js/models.js` — AITool (classe base), subclasses (ChatGPT, Claude, Gemini…), AIFactory

---

## [0.2.0] — 2025-08-01

### Adicionado
- Estrutura de pastas: `js/`, `css/`, `docs/`
- `index.html` base com layout de catálogo
- `css/style.css` inicial

---

## [0.1.0] — 2025-07-15

### Adicionado
- Inicialização do repositório Git
- `.gitignore` inicial
- `README.md` com descrição do projeto

---

*Gerado conforme [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)*
