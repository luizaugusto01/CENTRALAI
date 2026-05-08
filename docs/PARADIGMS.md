# Linguagens e Paradigmas de Programação — CentralAI

> Disciplina: Linguagens e Paradigmas de Programação · UFG · INF  
> Referências: Sebesta (2016) · MDN Web Docs · ECMAScript 2022 Specification

---

## 1. O que é um Paradigma de Programação?

Um **paradigma de programação** é um estilo ou abordagem fundamental para estruturar e organizar código. Não é uma característica da linguagem em si, mas de como o programador pensa e resolve problemas.

> JavaScript é **multiparadigma**: suporta imperativo, orientado a objetos (prototípico), funcional e reativo/event-driven no mesmo arquivo.

---

## 2. Paradigma Imperativo

Descreve **como** o computador deve executar cada passo. O programador controla explicitamente o estado e o fluxo.

### 2.1 Características

- Sequência de instruções
- Variáveis mutáveis (estado)
- Estruturas de controle: `if`, `for`, `while`, `switch`
- Funções como sub-rotinas

### 2.2 Exemplos no CentralAI

```javascript
// js/core.js — InsertionSort (imperativo puro)
static sort(arr) {
    const result = [...arr];          // cópia mutável
    for (let i = 1; i < result.length; i++) {   // laço imperativo
        const key = result[i];
        let j = i - 1;
        while (j >= 0 && result[j] > key) {     // controle de fluxo
            result[j + 1] = result[j];           // mutação de estado
            j--;
        }
        result[j + 1] = key;
    }
    return result;
}
```

```javascript
// js/repository.js — BaseRepository.findWhere (imperativo com loop)
findWhere(predicate) {
    const rows = this.#read();        // leitura de estado externo
    const results = [];
    for (const row of rows) {         // iteração imperativa
        if (predicate(row)) results.push(row);
    }
    return results;
}
```

---

## 3. Paradigma Orientado a Objetos (OO)

Organiza o programa em **objetos** que encapsulam estado (atributos) e comportamento (métodos).

### 3.1 Os Quatro Pilares

| Pilar              | Descrição                                          | Exemplo no CentralAI                         |
|--------------------|----------------------------------------------------|----------------------------------------------|
| **Encapsulamento** | Ocultar estado interno; expor só interface pública | `#data` privado em BaseRepository            |
| **Herança**        | Subclasse herda atributos e comportamentos         | `ChatGPT extends AITool`                     |
| **Polimorfismo**   | Mesmo método, comportamentos diferentes por classe | `ai.getCapabilities()` — cada subclasse retorna lista própria |
| **Abstração**      | Modelar conceitos essenciais, ocultar detalhes     | `AITool` abstrata com `getRecommendationScore()` abstrato |

### 3.2 JavaScript: OO Prototípico vs Baseado em Classes

JavaScript usa **herança prototípica** — `class` é açúcar sintático sobre `Object.create`:

```javascript
// Equivalência — ambas as formas fazem o mesmo:

// ES2022 (class syntax — usado no CentralAI)
class Stack {
    #items = [];
    push(item) { this.#items.push(item); }
    pop()      { return this.#items.pop(); }
}

// Prototípico (equivalente interno do motor JS)
function Stack() { this._items = []; }
Stack.prototype.push = function(item) { this._items.push(item); };
Stack.prototype.pop  = function()     { return this._items.pop(); };
```

### 3.3 Hierarquia de Classes no CentralAI

```
AITool (abstract)
├── ChatGPT
├── Claude
├── Gemini
├── Midjourney
└── Copilot

BaseRepository (generic<T>)
├── UserRepository
├── FavoriteRepository
├── ChatMessageRepository
└── UsageLogRepository

BasePlugin (abstract)
├── ThemePlugin
└── ChatPlugin

Command (abstract)
├── AddToComparatorCommand
└── ClearComparatorCommand

AIAPIAdapter (abstract)
├── OpenAIAdapter
├── AnthropicAdapter
└── GeminiAdapter
```

### 3.4 Campos Privados ES2022

```javascript
// js/core.js — Stack com campo privado real (#items)
class Stack {
    #items = [];           // campo privado — inacessível fora da classe

    push(item) {
        if (item === undefined) throw new TypeError('Item cannot be undefined');
        this.#items.push(item);
    }

    pop() {
        if (this.isEmpty()) throw new RangeError('Stack is empty');
        return this.#items.pop();
    }

    get size() { return this.#items.length; }  // getter público
}

const s = new Stack();
s.push(42);
s.#items;   // SyntaxError: private field — encapsulamento real, não convencional
```

---

## 4. Paradigma Funcional

Trata computação como **avaliação de funções matemáticas**, evitando estado mutável e efeitos colaterais.

### 4.1 Conceitos Principais

| Conceito                  | Descrição                                               | Exemplo no CentralAI                          |
|---------------------------|---------------------------------------------------------|-----------------------------------------------|
| **Funções puras**         | Mesmo input → mesmo output, sem efeitos colaterais      | `BinarySearch.search(arr, target)`            |
| **Imutabilidade**         | Não modificar dados — criar novas versões               | `[...arr]` antes de sort, Object.freeze()     |
| **Funções de alta ordem** | Funções que recebem ou retornam funções                 | `findWhere(predicate)`, `filter`, `map`       |
| **Composição**            | Combinar funções pequenas em funções maiores            | `buildFilterChain()` — handlers encadeados    |
| **Closures**              | Função que captura variáveis do escopo externo          | Callbacks em EventEmitter                     |

### 4.2 Array Methods Funcionais

```javascript
// js/services.js — uso de map, filter, reduce (paradigma funcional)
getRecommendations(userProfile, limit = 5) {
    return this.#ais
        .filter(ai => ai.isAvailable())           // filter — função pura
        .map(ai => ({                              // map — transforma sem mutar
            ai,
            score: this.#strategy.score(ai, userProfile)
        }))
        .filter(({ score }) => score > 0)         // filter em cadeia
        .sort((a, b) => b.score - a.score)        // sort declarativo
        .slice(0, limit)                           // slice — não muta
        .map(({ ai }) => ai);                      // projeta de volta para AITool
}
```

### 4.3 Closures no CentralAI

```javascript
// js/services.js — EventEmitter usa closure para encapsular listeners
class EventEmitter {
    #listeners = new Map();

    on(event, callback) {
        if (!this.#listeners.has(event)) {
            this.#listeners.set(event, []);
        }
        this.#listeners.get(event).push(callback);
        // Retorna função de remoção (closure capturando event e callback)
        return () => this.off(event, callback);
    }
}

// Uso: a função retornada é uma closure que "lembra" event e callback
const unsubscribe = emitter.on('change', handler);
// ...
unsubscribe();  // remove o listener sem expor internals
```

### 4.4 Imutabilidade e Object.freeze

```javascript
// js/core.js — AI_SYMBOLS congelado (imutabilidade)
const AI_SYMBOLS = Object.freeze({
    FEATURED:    Symbol.for('ai.featured'),
    NEW_RELEASE: Symbol.for('ai.newRelease'),
    VERIFIED:    Symbol.for('ai.verified'),
    OPEN_SOURCE: Symbol.for('ai.openSource'),
});

// Tentativa de mutação — silenciosa em modo não-strict, erro em strict
AI_SYMBOLS.FEATURED = Symbol('hack');  // não tem efeito — objeto congelado
```

---

## 5. Paradigma Declarativo

Descreve **o que** deve ser obtido, não **como** obtê-lo.

### 5.1 Declarativo vs Imperativo

```javascript
// IMPERATIVO — descreve cada passo
function getHighRatedAIs(ais) {
    const result = [];
    for (let i = 0; i < ais.length; i++) {
        if (ais[i].rating >= 4.5) {
            result.push(ais[i].name);
        }
    }
    return result;
}

// DECLARATIVO — descreve a intenção
const getHighRatedAIs = ais =>
    ais
        .filter(ai => ai.rating >= 4.5)
        .map(ai => ai.name);
```

### 5.2 Programação Declarativa com Generators

```javascript
// js/core.js — lazyFilter é declarativo: "filtre conforme necessário"
function* lazyFilter(items, predicate) {
    for (const item of items) {
        if (predicate(item)) yield item;  // "dê-me o próximo que passar"
    }
}

// Uso declarativo: o consumidor declara o que quer
const freeAIs = lazyFilter(allAIs, ai => ai.pricing === 'free');
for (const ai of freeAIs) {
    // processa sob demanda — lazy evaluation
}
```

### 5.3 Template Literals como Declarativo

```javascript
// js/extensions.js — ChatPlugin renderiza HTML declarativamente
#renderMessage(msg) {
    return `
        <div class="chat__message chat__message--${msg.role}">
            <div class="chat__bubble">${this.#parseMarkdown(msg.content)}</div>
            <span class="chat__time">${new Date(msg.ts).toLocaleTimeString()}</span>
        </div>
    `;  // descreve o que a mensagem deve parecer, não como criar o DOM
}
```

---

## 6. Paradigma Event-Driven (Reativo)

O fluxo de controle é determinado por **eventos** — ações do usuário, mensagens, timers.

### 6.1 Event Loop do JavaScript

```
┌─────────────────────────────┐
│         Call Stack          │  ← executa código síncrono
│  app.init() → catalog.render│
└──────────┬──────────────────┘
           │ vazio
           ▼
┌─────────────────────────────┐
│         Event Queue         │  ← callbacks de eventos
│  [click handler, timer cb]  │
└──────────┬──────────────────┘
           │ pega próximo
           ▼
┌─────────────────────────────┐
│  Microtask Queue (Promises) │  ← executado antes do Event Queue
│  [.then(), async/await]     │
└─────────────────────────────┘
```

### 6.2 EventEmitter (Observer Pattern)

```javascript
// js/services.js — EventEmitter como hub de eventos
class EventEmitter {
    emit(event, ...args) {
        const handlers = this.#listeners.get(event) ?? [];
        handlers.forEach(fn => fn(...args));  // dispara todos os ouvintes
    }
}

// js/app.js — componentes reagem a eventos
this.catalogService.on('filter:applied', ({ count }) => {
    this._updateResultCount(count);   // reativo — só executa quando evento ocorre
});

this.comparator.on('comparator:changed', (ais) => {
    this._renderComparatorBadge(ais.length);
});
```

### 6.3 Async/Await (Promise-Based Events)

```javascript
// js/extensions.js — ChatPlugin usa async/await para IO não-bloqueante
async sendMessage(text) {
    const userMsg = { role: 'user', content: text, ts: Date.now() };
    this.messages.push(userMsg);
    this.#render();

    // Pausa execução SEM bloquear o event loop
    const reply = await this.#mockReply(text);   // Promise

    const assistantMsg = { role: 'assistant', content: reply, ts: Date.now() };
    this.messages.push(assistantMsg);
    this.#render();
    return assistantMsg;
}
```

---

## 7. Programação com Metaprogramação

Código que inspeciona ou modifica **a si mesmo** em tempo de execução.

### 7.1 Proxy e Reflect

```javascript
// js/core.js — ConfigValidator via Proxy
function createConfigValidator(config, schema) {
    return new Proxy(config, {
        get(target, prop, receiver) {
            // Metaprogramação: intercepta toda leitura de propriedade
            if (!(prop in target)) {
                console.warn(`[Config] Property "${String(prop)}" not found`);
                return schema[prop]?.default ?? undefined;
            }
            return Reflect.get(target, prop, receiver);  // delega ao alvo
        },

        set(target, prop, value) {
            // Metaprogramação: valida antes de permitir escrita
            const rule = schema[prop];
            if (rule?.readonly) throw new TypeError(`"${String(prop)}" is readonly`);
            if (rule?.type && typeof value !== rule.type) {
                throw new TypeError(`"${String(prop)}" must be ${rule.type}`);
            }
            return Reflect.set(target, prop, value);
        }
    });
}
```

### 7.2 Symbol como Protocolo de Extensão

```javascript
// js/core.js — LinkedList implementa protocolo de iteração via Symbol
class LinkedList {
    [Symbol.iterator]() {          // Symbol.iterator é o protocolo padrão
        let current = this.#head;
        return {
            next() {
                if (current) {
                    const value = current.data;
                    current = current.next;
                    return { value, done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
}

// Agora LinkedList funciona com todos os protocolos baseados em Symbol.iterator:
const list = new LinkedList();
list.append(1); list.append(2); list.append(3);

for (const item of list) { /* ... */ }     // for...of
const arr = [...list];                      // spread
const [first, ...rest] = list;             // destructuring
```

### 7.3 WeakMap para Metadados Sem Vazamento

```javascript
// js/core.js — metadataCache com WeakMap
const metadataCache = new WeakMap();   // chave DEVE ser objeto

function setAIMetadata(aiObj, meta) {
    // Associa metadados ao objeto sem adicionar propriedade nele
    const existing = metadataCache.get(aiObj) ?? {};
    metadataCache.set(aiObj, { ...existing, ...meta, updatedAt: Date.now() });
}

// Quando aiObj é garbage collected, a entrada no WeakMap é removida automaticamente
// — sem vazamento de memória, ao contrário de um Map normal
```

---

## 8. Comparação dos Paradigmas no CentralAI

| Paradigma          | Onde aparece no código                              | Benefício principal                          |
|--------------------|-----------------------------------------------------|----------------------------------------------|
| **Imperativo**     | Algoritmos de sort/search, loops de renderização    | Controle preciso de performance              |
| **OO/Classes**     | models.js, services.js, repository.js               | Encapsulamento, herança, padrões GoF         |
| **OO Prototípico** | Herança entre classes (motor JS)                    | Base de toda herança JS                      |
| **Funcional**      | Array methods, closures, imutabilidade              | Código previsível, sem efeitos colaterais    |
| **Declarativo**    | Template literals, filter/map chains, generators    | Legibilidade, intenção clara                 |
| **Event-Driven**   | EventEmitter, addEventListener, async/await         | Resposta a ações do usuário sem bloquear UI  |
| **Metaprogramação**| Proxy, Reflect, Symbol, WeakMap                     | Flexibilidade, protocolos, introspection     |

---

## 9. Características de Linguagem JavaScript Usadas

| Recurso ES                | Versão  | Uso no CentralAI                                     |
|---------------------------|---------|------------------------------------------------------|
| `class`                   | ES6     | Toda hierarquia de classes                           |
| `extends` / `super`       | ES6     | Herança (AITool → ChatGPT, BaseRepository → User...) |
| `#privateField`           | ES2022  | Stack.#items, BaseRepository.#store                  |
| `async` / `await`         | ES2017  | ChatPlugin.sendMessage()                             |
| `Symbol` / `Symbol.for`   | ES6     | Protocolo iterável, AI_SYMBOLS                       |
| `WeakMap`                 | ES6     | metadataCache sem vazamento                          |
| `Proxy` / `Reflect`       | ES6     | ConfigValidator, traps de get/set                    |
| `function*` (generator)   | ES6     | paginate(), lazyFilter(), zip()                      |
| Template literals         | ES6     | Toda renderização HTML em JS                         |
| Destructuring             | ES6     | `const { ai, score } = item`                         |
| Spread / Rest             | ES6     | `[...arr]`, `...args`                                |
| Optional chaining `?.`    | ES2020  | `schema[prop]?.default`                              |
| Nullish coalescing `??`   | ES2020  | `this.#listeners.get(event) ?? []`                   |
| `Object.freeze()`         | ES5     | AI_SYMBOLS imutável                                  |
| `Map` / `Set`             | ES6     | SearchIndex, EventEmitter.#listeners                 |

---

*CentralAI © 2025 · UFG · Instituto de Informática · Linguagens e Paradigmas de Programação*
