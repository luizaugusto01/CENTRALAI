# Design Patterns — CentralAI

> Disciplina: Padrões de Projeto de Software · UFG · INF  
> Referência: GoF (Gang of Four) — *Design Patterns: Elements of Reusable Object-Oriented Software*

---

## Índice

1. [Singleton — StorageService e App](#1-singleton)
2. [Observer — EventEmitter](#2-observer)
3. [Strategy — RecommendationEngine](#3-strategy)
4. [Factory Method — AIFactory](#4-factory-method)
5. [Template Method — AITool (classe abstrata)](#5-template-method)
6. [Namespace / Module Pattern](#6-namespace--module-pattern)

---

## 1. Singleton

**Categoria:** Criacional  
**Onde:** `js/services.js` → `StorageService` · `js/app.js` → `App`  
**Intenção:** Garantir que uma classe tenha apenas uma instância e fornecer um ponto de acesso global.

### Problema resolvido
Múltiplos componentes precisam gravar/ler favoritos no `localStorage`. Sem Singleton, cada um
criaria sua própria instância de gerenciador, podendo ler chaves com prefixos inconsistentes.

### Implementação

```javascript
class StorageService {
  static #instance = null;      // campo privado estático

  static getInstance() {
    if (!StorageService.#instance) {
      StorageService.#instance = new StorageService();
    }
    return StorageService.#instance;   // sempre a mesma instância
  }

  constructor() {
    if (StorageService.#instance) {
      throw new Error('Use StorageService.getInstance()');
    }
    /* ... */
  }
}

// Uso:
const storage = StorageService.getInstance();
storage.set('favorites', ['chatgpt-4o']);
```

### Diagrama UML
```
┌─────────────────────────────────┐
│       StorageService            │
├─────────────────────────────────┤
│ - #instance: StorageService     │
│ - _available: boolean           │
├─────────────────────────────────┤
│ + getInstance(): StorageService │  ← ponto de acesso global
│ + get(key, fallback)            │
│ + set(key, value)               │
│ + remove(key)                   │
└─────────────────────────────────┘
```

---

## 2. Observer

**Categoria:** Comportamental  
**Onde:** `js/services.js` → `EventEmitter` (herdado por `RecommendationEngine`)  
**Intenção:** Definir uma dependência um-para-muitos entre objetos, de modo que quando um objeto muda de estado, todos os seus dependentes são notificados automaticamente.

### Problema resolvido
O `RecommendationEngine` precisa notificar componentes externos quando uma recomendação é gerada
ou quando a estratégia muda — sem acoplamento direto entre as classes.

### Implementação

```javascript
class EventEmitter {
  constructor() {
    this._listeners = {};   // { eventName: [fn, fn, ...] }
  }

  on(event, listener) {     // subscribe
    (this._listeners[event] ??= []).push(listener);
    return this;
  }

  off(event, listener) {    // unsubscribe
    this._listeners[event] = this._listeners[event]?.filter(fn => fn !== listener);
    return this;
  }

  emit(event, ...args) {    // publish
    this._listeners[event]?.forEach(fn => fn(...args));
  }
}

// RecommendationEngine estende EventEmitter:
class RecommendationEngine extends EventEmitter {
  recommend(ais, params, topN) {
    const results = this.#strategy.recommend(ais, params);
    this.emit('recommended', { count: results.length, params });  // notifica assinantes
    return results.slice(0, topN);
  }
}

// Assinatura externa:
recEngine.on('recommended', ({ count, params }) => {
  console.log(`${count} IAs recomendadas para tipo: ${params.taskType}`);
});
```

### Diagrama UML
```
┌────────────────────┐         ┌──────────────────────┐
│   EventEmitter     │         │  RecommendationEngine│
│ (Subject/Observable)│◄───────│   extends EventEmitter│
├────────────────────┤         └──────────────────────┘
│ - _listeners: {}   │
├────────────────────┤         ┌──────────────────────┐
│ + on(event, fn)    │◄────────│  RecommenderComponent│
│ + off(event, fn)   │         │  (Observer/Subscriber)│
│ + emit(event, args)│         └──────────────────────┘
└────────────────────┘
```

---

## 3. Strategy

**Categoria:** Comportamental  
**Onde:** `js/services.js` → `RecommendationStrategy` + estratégias concretas  
**Intenção:** Definir uma família de algoritmos, encapsular cada um deles e torná-los intercambiáveis.

### Problema resolvido
A recomendação de IAs muda de acordo com a prioridade do usuário: qualidade, custo ou velocidade.
Sem Strategy, haveria um `if/else` gigante dentro do engine; com Strategy, cada algoritmo fica em
sua própria classe e pode ser trocado em runtime.

### Estratégias implementadas

| Classe                | Algoritmo                                         |
|-----------------------|---------------------------------------------------|
| `TaskBasedStrategy`   | Filtra por tipo de tarefa + ordena por rating     |
| `RatingBasedStrategy` | Ordena por avaliação decrescente                  |
| `CostBasedStrategy`   | Gratuitas primeiro, depois por preço crescente    |
| `BalancedStrategy`    | Score composto: rating × 2 + bônus gratuita       |

### Implementação

```javascript
// Classe base (interface por convenção)
class RecommendationStrategy {
  recommend(ais, params) {
    throw new Error('Subclasse deve implementar recommend()');
  }
}

// Estratégia concreta
class CostBasedStrategy extends RecommendationStrategy {
  recommend(ais, { taskType } = {}) {
    let list = AITool.filterByType(ais, taskType || 'all');
    return list.sort((a, b) => {
      if (a.isFree && !b.isFree) return -1;
      if (!a.isFree && b.isFree) return 1;
      return (a.pricing?.startingAt ?? 999) - (b.pricing?.startingAt ?? 999);
    });
  }
}

// Contexto — troca de estratégia em runtime com validação instanceof
class RecommendationEngine extends EventEmitter {
  setStrategy(strategy) {
    if (!(strategy instanceof RecommendationStrategy)) {   // ← instanceof!
      throw new TypeError('Argumento deve ser RecommendationStrategy');
    }
    this.#strategy = strategy;
  }
}

// Troca em runtime:
recEngine.setStrategy(new CostBasedStrategy());
recEngine.setStrategy(new RatingBasedStrategy());
```

### Diagrama UML
```
┌────────────────────────┐
│  RecommendationEngine  │──── usa ────► «interface»
│  (Contexto)            │            RecommendationStrategy
│  - #strategy           │              ▲        ▲        ▲
│  + setStrategy(s)      │              │        │        │
│  + recommend(...)      │        TaskBased  Rating   CostBased
└────────────────────────┘        Strategy  Based    Strategy
                                            Strategy
```

---

## 4. Factory Method

**Categoria:** Criacional  
**Onde:** `js/models.js` → `AIFactory`  
**Intenção:** Definir uma interface para criar objetos, mas deixar as subclasses decidirem qual classe instanciar.

### Problema resolvido
A base de dados contém objetos de configuração simples (`{ type: 'text', ... }`). O Factory Method
seleciona a subclasse correta (`TextAI`, `ImageAI`, etc.) sem que o código cliente precise saber
quais classes existem.

### Implementação

```javascript
class AIFactory {
  static #registry = {
    text:       TextAI,
    image:      ImageAI,
    code:       CodeAI,
    audio:      AudioAI,
    multimodal: MultimodalAI,
  };

  static create(config) {
    const Cls = AIFactory.#registry[config.type];
    if (!Cls) throw new RangeError(`Tipo desconhecido: "${config.type}"`);
    return new Cls(config);     // ← instancia a subclasse correta
  }

  static createAll(configs) {
    return configs.map(cfg => AIFactory.create(cfg));
  }
}

// Uso (uma linha cria 12 instâncias polimórficas):
const AI_DATABASE = AIFactory.createAll(AI_CONFIGS);
```

---

## 5. Template Method

**Categoria:** Comportamental  
**Onde:** `js/models.js` → `AITool` (classe base abstrata)  
**Intenção:** Definir o esqueleto de um algoritmo na superclasse, deixando subclasses preencherem partes específicas.

`AITool` define o contrato da hierarquia: campos comuns (`name`, `rating`, `pros`, etc.), métodos
compartilhados (`matches()`, `toJSON()`) e um método estático `getTypeInfo()` que usa `instanceof`
para despachar comportamento polimórfico sem `if/else` duplicados nas subclasses.

### O operador `instanceof` no contexto de herança

```javascript
// AITool.getTypeInfo() — despachante polimórfico
static getTypeInfo(ai) {
  if (!(ai instanceof AITool)) throw new TypeError('...');

  // A ordem importa: MultimodalAI antes de AITool (mais específico primeiro)
  if (ai instanceof MultimodalAI) return { label: 'Multimodal', ... };
  if (ai instanceof TextAI)       return { label: 'Texto', ...      };
  if (ai instanceof ImageAI)      return { label: 'Imagem', ...     };
  if (ai instanceof CodeAI)       return { label: 'Código', ...     };
  if (ai instanceof AudioAI)      return { label: 'Áudio', ...      };
}

// AITool.filterByType() — filtragem por tipo via instanceof
static filterByType(ais, type) {
  const typeMap = { text: TextAI, image: ImageAI, ... };
  const TargetClass = typeMap[type];
  return ais.filter(ai => ai instanceof TargetClass);  // ← instanceof no filter
}
```

### Cadeia de protótipos resultante

```
Object.prototype
      ▲
AITool.prototype      (getTypeInfo, filterByType, matches, toJSON)
      ▲
TextAI.prototype      (formattedTokens, supportsPT)
ImageAI.prototype     (resolutions, styles)
CodeAI.prototype      (topLanguages, features)
AudioAI.prototype     (formats, maxDurationMin)
MultimodalAI.prototype(capabilityList, capabilities)
```

---

## 6. Namespace / Module Pattern

**Categoria:** Estrutural (padrão JavaScript)  
**Onde:** todos os arquivos JS  
**Intenção:** Encapsular código em um objeto global único, evitando poluição do escopo global sem
depender de um sistema de módulos (ES Modules requerem servidor HTTP).

```javascript
// Inicialização defensiva (não sobrescreve se já existe)
window.CentralAI = window.CentralAI || {};

// Cada arquivo adiciona ao namespace:
Object.assign(window.CentralAI, { AITool, TextAI, AIFactory, AI_DATABASE });

// Uso entre arquivos:
const { AI_DATABASE, AITool } = window.CentralAI;
```

---

## Resumo dos Padrões

| Padrão         | Arquivo         | Problema resolvido                                    |
|----------------|-----------------|-------------------------------------------------------|
| Singleton      | services.js     | Uma única instância de StorageService e App           |
| Observer       | services.js     | Desacoplamento entre engine e componentes de UI       |
| Strategy       | services.js     | Algoritmos de recomendação intercambiáveis            |
| Factory Method | models.js       | Criação de subclasses corretas a partir de configs    |
| Template Method| models.js       | Contrato e comportamento base compartilhado           |
| Module/Namespace| todos          | Organização sem poluir o escopo global                |
