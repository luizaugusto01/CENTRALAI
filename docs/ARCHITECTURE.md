# Arquitetura de Software — CentralAI

> Disciplina: Padrões de Projeto de Software · UFG · INF  
> Equipe: Brenner Sardinha, Heitor Barbosa, Enzo Machado, Danilo Sucupira, Luiz Augusto Godinho

---

## 1. Visão Geral

O **CentralAI** é uma Single Page Application (SPA) construída com HTML, CSS e JavaScript
vanilla, sem framework ou build tool. A ausência de dependências externas é intencional para
demonstrar os fundamentos de Engenharia de Software aplicados diretamente na linguagem.

---

## 2. Stack Tecnológica

| Camada         | Tecnologia                             | Justificativa                                      |
|----------------|----------------------------------------|----------------------------------------------------|
| Estrutura      | HTML5 semântico                        | Acessibilidade e SEO                               |
| Estilo         | CSS3 + Custom Properties (variáveis)   | Design tokens, tema consistente sem pré-processador|
| Comportamento  | JavaScript ES2022 (vanilla)            | Demonstrar fundamentos sem abstrações de framework |
| Persistência   | localStorage (Web Storage API)         | Favoritos e preferências do usuário                |
| Fontes         | Google Fonts (Inter + JetBrains Mono)  | Tipografia profissional                            |

---

## 3. Arquitetura em Camadas

A aplicação segue o padrão **Layered Architecture** com separação clara de responsabilidades.
Cada camada conhece apenas a camada imediatamente abaixo.

```
┌────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                        │
│  index.html · css/style.css · js/components.js · js/app.js │
│  Responsável por: DOM, eventos, renderização, UX            │
├────────────────────────────────────────────────────────────┤
│                    SERVICE LAYER                             │
│                    js/services.js                           │
│  Responsável por: regras de negócio, recomendação,          │
│                   persistência, comunicação entre módulos   │
├────────────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                              │
│                    js/models.js                             │
│  Responsável por: entidades de domínio (AITool e subclasses)│
│                   hierarquia de tipos, validações           │
└────────────────────────────────────────────────────────────┘
         ↑ cada camada conhece apenas a imediata abaixo ↑
```

---

## 4. Estrutura de Arquivos

```
centralai/
├── index.html              ← Ponto de entrada único (SPA)
├── css/
│   └── style.css           ← Todos os estilos (Design Tokens + componentes)
├── js/
│   ├── models.js           ← Domain Layer: AITool, TextAI, ImageAI, CodeAI, AudioAI, MultimodalAI, AIFactory
│   ├── services.js         ← Service Layer: EventEmitter, StorageService, RecommendationEngine
│   ├── components.js       ← Presentation Layer: Toast, Modal, CatalogComponent, ComparatorComponent, RecommenderComponent
│   └── app.js              ← Bootstrapper: App (Singleton), inicialização, navegação
├── docs/
│   ├── ARCHITECTURE.md     ← Este arquivo
│   ├── DESIGN_PATTERNS.md  ← Detalhamento dos padrões GoF aplicados
│   ├── REQUIREMENTS.md     ← Requisitos funcionais e não-funcionais
│   └── HCI.md              ← Interação Humano-Computador
└── README.md               ← Visão geral e quickstart
```

---

## 5. Diagrama de Componentes

```
                    ┌─── window.CentralAI ───────────────────────┐
                    │                                              │
   models.js ──────►  AITool ◄── TextAI, ImageAI, CodeAI,       │
                    │             AudioAI, MultimodalAI           │
                    │  AIFactory                                   │
                    │  AI_DATABASE (12 instâncias)                │
                    │                                              │
   services.js ────►  EventEmitter (Observer)                    │
                    │  StorageService (Singleton)                  │
                    │  RecommendationEngine (Strategy)             │
                    │  STRATEGIES { quality, cost, task, balance }│
                    │                                              │
   components.js ──►  Toast · Modal                              │
                    │  CatalogComponent                            │
                    │  ComparatorComponent                         │
                    │  RecommenderComponent                        │
                    │  StatsCounter                                │
                    │                                              │
   app.js ─────────►  App (Singleton)                            │
                    │  ↳ inicializa todos os componentes          │
                    │  ↳ expõe CentralAI.app                      │
                    └──────────────────────────────────────────────┘
```

---

## 6. Fluxo de Dados

### 6.1 Fluxo de Renderização do Catálogo

```
Usuário clica em filtro
        │
        ▼
CatalogComponent._updateFilterUI()
        │
        ▼
AITool.filterByType(AI_DATABASE, tipo)
  └── usa `instanceof` para filtrar por subclasse
        │
        ▼
ai.matches(query)  ← busca textual
        │
        ▼
AICardRenderer.createCard(ai, favIds)
  └── usa `instanceof` para features específicas por tipo
        │
        ▼
DOM: list.appendChild(card)
```

### 6.2 Fluxo de Recomendação

```
Usuário submete formulário
        │
        ▼
RecommenderComponent._recommend()
        │
        ├── Seleciona estratégia: TaskBasedStrategy | RatingBasedStrategy | CostBasedStrategy
        │
        ▼
RecommendationEngine.setStrategy(strategy)
  └── instanceof RecommendationStrategy (validação em runtime)
        │
        ▼
RecommendationEngine.recommend(AI_DATABASE, params, 3)
  └── delega para strategy.recommend()
        │
        ▼
buildRecommendationReason(ai, params)
  └── usa instanceof para mensagem específica por tipo
        │
        ▼
DOM: renderiza os 3 cards de resultado
```

---

## 7. Namespace Global

Para evitar poluição do escopo global sem usar ES Modules, todos os módulos
compartilham um único namespace:

```javascript
window.CentralAI = {
  // Domain Layer (models.js)
  AITool, TextAI, ImageAI, CodeAI, AudioAI, MultimodalAI,
  AIFactory, AI_DATABASE,

  // Service Layer (services.js)
  EventEmitter, StorageService, RecommendationEngine,
  storage, recEngine, STRATEGIES, buildRecommendationReason,

  // Presentation Layer (components.js)
  components: { Toast, Modal, CatalogComponent, ComparatorComponent,
                RecommenderComponent, StatsCounter },

  // Bootstrapper (app.js)
  app,   // instância Singleton de App
};
```

---

## 8. Decisões de Arquitetura

| Decisão                          | Alternativa Considerada  | Motivo da Escolha                                    |
|----------------------------------|--------------------------|------------------------------------------------------|
| Vanilla JS (sem framework)       | React / Vue              | Demonstrar fundamentos sem abstrações de framework   |
| Namespace global via window      | ES Modules               | Compatibilidade direta ao abrir index.html sem server|
| localStorage para persistência   | IndexedDB / Backend      | Simplicidade e ausência de servidor                  |
| CSS com Custom Properties        | SCSS / Tailwind          | Nativo, sem toolchain, mesma flexibilidade           |
| IntersectionObserver p/ stats    | scroll listener          | Performance: sem polling contínuo                    |
| Event delegation no catálogo     | Listener por card        | Performance: 1 listener para N cards                 |
