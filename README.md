# CentralAI — Hub de Inteligências Artificiais

> **Disciplina:** Padrões de Projeto de Software · UFG · INF  
> **Turma 2025** | Engenharia de Software

---

## O que é o CentralAI?

O **CentralAI** é uma plataforma web que integra diversas inteligências artificiais em um único
ambiente — um "HUB de IA". Permite que usuários comparem, entendam e utilizem diferentes IAs de
forma prática, sem precisar alternar entre sites diferentes.

---

## Equipe

| Nome               | GitHub                                                        |
|--------------------|---------------------------------------------------------------|
| Brenner Sardinha   | [@brennerodrigues](https://github.com/brennerodrigues)        |
| Heitor Barbosa     | [@heitor-barbosa](https://github.com/heitor-barbosa)          |
| Enzo Machado       | [@EnzoMachad0](https://github.com/EnzoMachad0)                |
| Danilo Sucupira    | [@danilo-sgalvao](https://github.com/danilo-sgalvao)          |
| Luiz Augusto Godinho | [@luizaugusto01](https://github.com/luizaugusto01)          |

---

## Como executar

Não há build tool nem servidor necessário. Basta abrir:

```
centralai/index.html
```

Diretamente no navegador (Chrome, Firefox, Edge, Safari).

---

## Stack Tecnológica

- **HTML5** semântico com ARIA
- **CSS3** com Custom Properties (Design Tokens)
- **JavaScript ES2022** vanilla (sem framework)
- **localStorage** para persistência de favoritos
- **Google Fonts** (Inter + JetBrains Mono)

---

## Funcionalidades

| Funcionalidade       | Descrição                                                    |
|----------------------|--------------------------------------------------------------|
| 📚 Catálogo          | 12 IAs organizadas por tipo com busca e filtros              |
| ⚡ Comparador        | Comparação lado-a-lado de até 3 IAs em tabela               |
| 🤖 Recomendador      | Formulário inteligente que sugere as 3 melhores IAs          |
| ♥ Favoritos          | Salva IAs preferidas com persistência no localStorage        |
| 📊 Planos            | Exibição de planos Free, Pro e Enterprise com toggle anual   |
| 🔔 Toasts            | Feedback imediato para todas as ações do usuário             |

---

## IAs no Catálogo

| Tipo       | IAs                                                   |
|------------|-------------------------------------------------------|
| Texto      | ChatGPT 4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, Perplexity |
| Imagem     | DALL-E 3, Midjourney v6, Stable Diffusion 3           |
| Código     | GitHub Copilot, Cursor                                |
| Áudio      | ElevenLabs, Whisper                                   |
| Multimodal | Gemini Ultra                                          |

---

## Design Patterns Implementados

| Padrão         | Localização         | Propósito                              |
|----------------|---------------------|----------------------------------------|
| Singleton      | StorageService, App | Instância única garantida              |
| Observer       | EventEmitter        | Desacoplamento entre módulos           |
| Strategy       | RecommendationEngine| Algoritmos de recomendação trocáveis   |
| Factory Method | AIFactory           | Criação polimórfica de IAs             |
| Template Method| AITool              | Contrato da hierarquia de classes      |
| Module         | window.CentralAI    | Namespace sem poluição global          |

---

## Conceitos de JavaScript Aplicados (até `instanceof`)

- `let` / `const` (sem `var`)
- Template literals
- Destructuring (objetos e arrays)
- Spread operator (`...`)
- Arrow functions
- Default parameters
- Classes com `constructor`
- Herança (`extends` / `super`)
- Campos privados (`#field`)
- Getters e setters
- Métodos estáticos (`static`)
- **Operador `instanceof`** — verificação polimórfica em runtime
- Prototype chain
- `Array.prototype.map/filter/find/sort/some`
- `Object.assign`
- DOM manipulation (`querySelector`, `innerHTML`, `dataset`, `createElement`)
- Event listeners + event delegation
- `FormData`
- `localStorage` (Web Storage API)
- `IntersectionObserver`
- `requestAnimationFrame`
- `performance.now()`

---

## Estrutura de Arquivos

```
centralai/
├── index.html              ← SPA principal
├── css/
│   └── style.css           ← Design System completo
├── js/
│   ├── models.js           ← AITool, TextAI, ImageAI, CodeAI, AudioAI, MultimodalAI, AIFactory
│   ├── services.js         ← EventEmitter, StorageService, RecommendationEngine
│   ├── components.js       ← Toast, Modal, Catalog, Comparator, Recommender, StatsCounter
│   └── app.js              ← App (bootstrap + Singleton)
├── docs/
│   ├── ARCHITECTURE.md     ← Arquitetura em camadas + diagramas
│   ├── DESIGN_PATTERNS.md  ← GoF patterns com código e diagramas UML
│   ├── REQUIREMENTS.md     ← RF, RNF, User Stories, Casos de Uso
│   └── HCI.md              ← Nielsen, WCAG, Arquitetura da Informação, Design Visual
└── README.md               ← Este arquivo
```

---

## Documentação

- [Arquitetura de Software](docs/ARCHITECTURE.md)
- [Design Patterns (GoF)](docs/DESIGN_PATTERNS.md)
- [Requisitos de Software](docs/REQUIREMENTS.md)
- [Interação Humano-Computador](docs/HCI.md)

---

*CentralAI © 2025 · UFG · Instituto de Informática · Padrões de Projeto de Software*
