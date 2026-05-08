/**
 * CentralAI — core.js
 * Estruturas de Dados, Algoritmos e JavaScript Avançado
 *
 * Conceitos organizados por período do currículo (UFG — Engenharia de Software):
 *
 *  P1 — Lógica de Programação, Algoritmos de Busca e Ordenação
 *       BinarySearch, InsertionSort, MergeSort, SearchIndex
 *
 *  P2 — Estruturas de Dados Lineares
 *       Node, LinkedList (Symbol.iterator), Stack, Queue
 *
 *  P3 — JavaScript: Iteradores, Generators, Protocolo de Iteração
 *       CatalogIterator, paginate(), lazyFilter(), zip()
 *
 *  P4 — JavaScript Avançado: Symbol, WeakMap, Proxy, Reflect
 *       AI_SYMBOLS, metadataCache (WeakMap), ConfigValidator (Proxy)
 */

window.CentralAI = window.CentralAI || {};

/* ════════════════════════════════════════════════════════════════════════
   P2 — ESTRUTURAS DE DADOS LINEARES
   Fundamentais para eficiência e compreensão de memória e acesso a dados.
   ════════════════════════════════════════════════════════════════════════ */

/**
 * NÓ GENÉRICO (Node)
 * Bloco de construção de estruturas encadeadas.
 * Cada nó carrega um dado e uma referência para o próximo.
 *
 * Complexidade de memória: O(n) para n nós
 */
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

/**
 * LISTA ENCADEADA SIMPLES (Singly LinkedList)
 *
 * Usada internamente para a lista de favoritos: inserção na cabeça é O(1),
 * sem realocação de array como em push() quando o buffer está cheio.
 *
 * Complexidade:
 *   prepend  → O(1)   append → O(n)   remove → O(n)   contains → O(n)
 *
 * Implementa Symbol.iterator → compatível com for…of e spread operator (P3)
 */
class LinkedList {
  #head = null;
  #size = 0;

  /** Insere no início — O(1) */
  prepend(data) {
    const node = new Node(data);
    node.next  = this.#head;
    this.#head = node;
    this.#size++;
    return this;
  }

  /** Insere no fim — O(n) */
  append(data) {
    const node = new Node(data);
    if (!this.#head) {
      this.#head = node;
    } else {
      let cur = this.#head;
      while (cur.next) cur = cur.next;
      cur.next = node;
    }
    this.#size++;
    return this;
  }

  /** Remove a primeira ocorrência de `data` — O(n) */
  remove(data) {
    if (!this.#head) return false;
    if (this.#head.data === data) {
      this.#head = this.#head.next;
      this.#size--;
      return true;
    }
    let cur = this.#head;
    while (cur.next) {
      if (cur.next.data === data) {
        cur.next = cur.next.next;
        this.#size--;
        return true;
      }
      cur = cur.next;
    }
    return false;
  }

  /** Verifica se `data` está na lista — O(n) */
  contains(data) {
    let cur = this.#head;
    while (cur) {
      if (cur.data === data) return true;
      cur = cur.next;
    }
    return false;
  }

  /** Converte para Array — O(n) */
  toArray() {
    const arr = [];
    let cur = this.#head;
    while (cur) { arr.push(cur.data); cur = cur.next; }
    return arr;
  }

  get size() { return this.#size; }

  /**
   * SYMBOL.ITERATOR — Protocolo de Iteração (P3)
   *
   * Ao implementar [Symbol.iterator], a LinkedList torna-se iterável:
   *   for (const item of list) { ... }
   *   const arr = [...list]
   *   const [first, ...rest] = list
   */
  [Symbol.iterator]() {
    let cur = this.#head;
    return {
      next() {
        if (cur) {
          const value = cur.data;
          cur = cur.next;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

/**
 * PILHA (Stack) — LIFO (Last In, First Out)
 *
 * Aplicações no CentralAI:
 *   - Histórico de comandos para undo/redo no comparador (CommandHistory)
 *   - Histórico de navegação entre seções
 *
 * Complexidade: push O(1) · pop O(1) · peek O(1) · size O(1)
 */
class Stack {
  #items = [];

  /** Empilha um item — O(1) */
  push(item) { this.#items.push(item); return this; }

  /** Remove e retorna o topo — O(1) */
  pop()  { return this.#items.pop(); }

  /** Retorna o topo sem remover — O(1) */
  peek() { return this.#items[this.#items.length - 1]; }

  isEmpty()  { return this.#items.length === 0; }
  get size() { return this.#items.length; }

  clear() { this.#items = []; return this; }

  /** Retorna array com o topo primeiro */
  toArray() { return [...this.#items].reverse(); }
}

/**
 * FILA (Queue) — FIFO (First In, First Out)
 *
 * Aplicações no CentralAI:
 *   - Fila de notificações (toasts): o primeiro pedido de toast é o primeiro exibido
 *   - Fila de resultados de busca para renderização progressiva
 *
 * Otimização: usa índice de cabeça (#head) para evitar shift() O(n).
 * Compacta o array interno apenas quando head > 100 (amortizado O(1)).
 *
 * Complexidade: enqueue O(1) amortizado · dequeue O(1) amortizado
 */
class Queue {
  #items = [];
  #head  = 0;   // aponta para o primeiro item real (evita shift)

  /** Enfileira um item — O(1) */
  enqueue(item) { this.#items.push(item); return this; }

  /** Remove e retorna o primeiro item — O(1) amortizado */
  dequeue() {
    if (this.isEmpty()) return undefined;
    const item = this.#items[this.#head++];
    /* Compacta quando head é grande o suficiente (evita vazamento de memória) */
    if (this.#head > 100) {
      this.#items = this.#items.slice(this.#head);
      this.#head  = 0;
    }
    return item;
  }

  /** Retorna o primeiro item sem remover */
  peek()    { return this.isEmpty() ? undefined : this.#items[this.#head]; }
  isEmpty() { return this.#head >= this.#items.length; }
  get size(){ return this.#items.length - this.#head; }

  /** SYMBOL.ITERATOR — torna a fila iterável (P3) */
  [Symbol.iterator]() {
    let index = this.#head;
    const items = this.#items;
    return {
      next() {
        if (index < items.length) return { value: items[index++], done: false };
        return { value: undefined, done: true };
      }
    };
  }
}

/* ════════════════════════════════════════════════════════════════════════
   P1-P2 — ALGORITMOS DE BUSCA E ORDENAÇÃO
   Análise de complexidade (Big-O) integrada à implementação.
   ════════════════════════════════════════════════════════════════════════ */

/**
 * BUSCA BINÁRIA — O(log n)
 *
 * Pré-condição: array DEVE estar ordenado pelo mesmo critério do comparator.
 * Divide o espaço de busca pela metade a cada passo.
 *
 * Exemplo: buscar IA por ID numa lista ordenada alfabeticamente.
 *   BinarySearch.search(sorted, 'chatgpt-4o', (a, b) => a.id < b.id ? -1 : 1)
 */
class BinarySearch {
  /**
   * @param {Array}    sorted     — array ordenado
   * @param {*}        target     — valor buscado
   * @param {Function} comparator — (elemento, target) → negativo | 0 | positivo
   * @returns {number} índice encontrado, ou -1
   */
  static search(sorted, target, comparator = (a, b) => a < b ? -1 : a > b ? 1 : 0) {
    let lo = 0, hi = sorted.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;   // unsigned right shift = floor((lo+hi)/2)
      const cmp = comparator(sorted[mid], target);
      if (cmp === 0) return mid;
      if (cmp < 0)   lo = mid + 1;
      else           hi = mid - 1;
    }
    return -1;
  }
}

/**
 * INSERTION SORT — O(n²) no pior caso, O(n) para arrays quase ordenados
 *
 * Didático: útil para entender o conceito de "troca de elementos".
 * Eficiente para arrays pequenos (< 20 elementos) — usado como base do TimSort.
 */
class InsertionSort {
  /**
   * Ordena `arr` in-place usando o comparator fornecido.
   * @param {Array}    arr
   * @param {Function} comparator — (a, b) → negativo | 0 | positivo
   * @returns {Array} o mesmo array ordenado (mutação in-place)
   */
  static sort(arr, comparator = (a, b) => a < b ? -1 : a > b ? 1 : 0) {
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      /* Move elementos maiores que key uma posição à frente */
      while (j >= 0 && comparator(arr[j], key) > 0) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
    }
    return arr;
  }
}

/**
 * MERGE SORT — O(n log n) em todos os casos
 *
 * Divide e conquista: divide o array ao meio recursivamente,
 * ordena cada metade e depois mescla as duas partes ordenadas.
 * Estável: preserva a ordem relativa de elementos iguais.
 */
class MergeSort {
  /**
   * @param {Array}    arr
   * @param {Function} comparator
   * @returns {Array} novo array ordenado (não muta o original)
   */
  static sort(arr, comparator = (a, b) => a < b ? -1 : a > b ? 1 : 0) {
    if (arr.length <= 1) return arr;

    /* Caso base: arrays pequenos usam InsertionSort (otimização do TimSort) */
    if (arr.length <= 8) return InsertionSort.sort([...arr], comparator);

    const mid   = Math.floor(arr.length / 2);
    const left  = MergeSort.sort(arr.slice(0, mid), comparator);
    const right = MergeSort.sort(arr.slice(mid),    comparator);

    return MergeSort.#merge(left, right, comparator);
  }

  static #merge(left, right, cmp) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (cmp(left[i], right[j]) <= 0) result.push(left[i++]);
      else                              result.push(right[j++]);
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}

/**
 * ÍNDICE DE BUSCA INVERTIDO (Inverted Index)
 *
 * Conceito de banco de dados: pré-computa um índice de tokens para que
 * buscas sejam O(1) em vez de O(n × m) (varredura linear por string).
 *
 * Analogia: é o índice remissivo de um livro — em vez de ler tudo,
 * você consulta o índice e vai diretamente à página certa.
 */
class SearchIndex {
  /* Map<token, Set<id>> — cada token aponta para os IDs que o contêm */
  #index = new Map();

  /**
   * Constrói o índice a partir da lista de IAs.
   * Complexidade: O(n × m) uma única vez na construção.
   * @param {AITool[]} ais
   */
  build(ais) {
    this.#index.clear();
    for (const ai of ais) {
      const tokens = this.#tokenize(
        [ai.name, ai.company, ai.description, ...ai.tags].join(' ')
      );
      for (const token of tokens) {
        if (!this.#index.has(token)) this.#index.set(token, new Set());
        this.#index.get(token).add(ai.id);
      }
    }
    return this;
  }

  /**
   * Busca por query — O(k × t) onde k é o número de tokens da query
   * e t é o número de tokens no índice (muito menor que n × m).
   * @param {string} query
   * @returns {Set<string> | null}  null = sem filtro (retorna tudo)
   */
  search(query) {
    const tokens = this.#tokenize(query);
    if (tokens.length === 0) return null;

    let result = null;
    for (const token of tokens) {
      const matches = new Set();
      for (const [key, ids] of this.#index) {
        if (key.startsWith(token) || key.includes(token)) {
          for (const id of ids) matches.add(id);
        }
      }
      /* Lógica AND: interseção dos resultados de cada token */
      result = result === null
        ? matches
        : new Set([...result].filter(id => matches.has(id)));
    }
    return result;
  }

  /** Normaliza texto em tokens comparáveis */
  #tokenize(text) {
    return text
      .toLowerCase()
      .normalize('NFD')                   // decompõe acentos (NFD)
      .replace(/[̀-ͯ]/g, '')    // remove diacríticos
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1);
  }
}

/* ════════════════════════════════════════════════════════════════════════
   P3 — ITERADORES E GENERATORS
   Protocolo de iteração nativo do JavaScript.
   ════════════════════════════════════════════════════════════════════════ */

/**
 * GENERATOR: paginação lazy — não carrega todos os resultados na memória.
 *
 * A palavra-chave `function*` e `yield` criam um gerador:
 * a execução pausa no yield e continua na próxima chamada de .next().
 *
 * @param {Array}  items
 * @param {number} pageSize
 * @yields {Array} fatia de tamanho pageSize
 */
function* paginate(items, pageSize = 4) {
  for (let i = 0; i < items.length; i += pageSize) {
    yield items.slice(i, i + pageSize);
  }
}

/**
 * GENERATOR: filtro lazy — não cria array intermediário.
 * Cada elemento é filtrado e emitido individualmente.
 * Vantagem sobre filter(): economiza memória em listas grandes.
 *
 * @param {Iterable} items
 * @param {Function} predicate — (item) => boolean
 * @yields {*} itens que satisfazem o predicado
 */
function* lazyFilter(items, predicate) {
  for (const item of items) {
    if (predicate(item)) yield item;
  }
}

/**
 * GENERATOR: zip — combina múltiplos iteráveis elemento a elemento.
 * Útil para construir linhas da tabela comparativa alinhando dados de múltiplas IAs.
 *
 * Exemplo: zip([1,2,3], ['a','b','c']) → [1,'a'], [2,'b'], [3,'c']
 *
 * @param {...Iterable} iterables
 * @yields {Array} tupla com um elemento de cada iterável
 */
function* zip(...iterables) {
  const iterators = iterables.map(it => it[Symbol.iterator]());
  while (true) {
    const results = iterators.map(it => it.next());
    if (results.some(r => r.done)) return;
    yield results.map(r => r.value);
  }
}

/**
 * ITERADOR DE CATÁLOGO — implementa o Protocolo do Iterator (P3)
 *
 * Diferença entre Iterator e Iterable:
 *   Iterable: tem [Symbol.iterator]() que retorna um Iterator
 *   Iterator: tem next() que retorna { value, done }
 *
 * CatalogIterator é AMBOS — é seu próprio iterable:
 *   for (const ai of new CatalogIterator(list, filter)) { ... }
 */
class CatalogIterator {
  #items;
  #index = 0;
  #filter;

  /**
   * @param {AITool[]} items
   * @param {Function} [filter] — predicado de inclusão
   */
  constructor(items, filter = () => true) {
    this.#items  = items;
    this.#filter = filter;
  }

  /** Retorna o próximo item que satisfaz o filtro */
  next() {
    while (this.#index < this.#items.length) {
      const item = this.#items[this.#index++];
      if (this.#filter(item)) return { value: item, done: false };
    }
    return { value: undefined, done: true };
  }

  /** Torna o iterador o próprio iterável (convenção padrão) */
  [Symbol.iterator]() { return this; }

  /** Coleta todos os itens restantes em um array */
  toArray() { return [...this]; }

  /** Pula os primeiros n itens (para paginação) */
  skip(n) {
    let count = 0;
    while (count < n) {
      const { done } = this.next();
      if (done) break;
      count++;
    }
    return this;
  }

  /** Coleta no máximo n itens */
  take(n) {
    const result = [];
    for (const item of this) {
      result.push(item);
      if (result.length >= n) break;
    }
    return result;
  }
}

/* ════════════════════════════════════════════════════════════════════════
   P4 — JAVASCRIPT AVANÇADO: Symbol, WeakMap, Proxy
   ════════════════════════════════════════════════════════════════════════ */

/**
 * SYMBOL — identificadores únicos e não-colidíveis (P4)
 *
 * Symbol() cria um valor primitivo único — nunca igual a outro Symbol,
 * mesmo que tenham a mesma descrição.
 *
 * Symbol.for('chave') usa o registro global: o mesmo Symbol é retornado
 * para a mesma chave em qualquer parte do código.
 *
 * Usos práticos:
 *   1. Chaves de propriedade que não aparecem em Object.keys() nem for…in
 *   2. Constantes únicas sem risco de colisão de nomes
 *   3. Well-known symbols: Symbol.iterator, Symbol.toPrimitive, etc.
 */
const AI_SYMBOLS = Object.freeze({
  TYPE_KEY:  Symbol.for('centralai.type'),       // global registry — recuperável
  METADATA:  Symbol.for('centralai.metadata'),   // global registry
  SCORE:     Symbol('centralai.score'),           // local — único e irrecuperável
  DECORATED: Symbol('centralai.decorated'),       // marca objetos decorados
  PLUGIN:    Symbol.for('centralai.plugin'),      // global registry
});

/**
 * WEAKMAP — mapa com chaves fracas (P4)
 *
 * Diferenças em relação ao Map:
 *   1. Chaves DEVEM ser objetos (não primitivos)
 *   2. Chaves são fracas: não impedem o Garbage Collector de coletar o objeto
 *   3. Não é iterável (sem entries(), keys(), forEach())
 *
 * Uso ideal: metadados que acompanham objetos sem alterar sua estrutura
 * e sem vazamento de memória se o objeto for descartado.
 *
 * Aqui: associa metadados (viewCount, addedAt, source) a instâncias de AITool
 * sem adicionar propriedades diretamente ao objeto.
 */
const metadataCache = new WeakMap();

/**
 * Associa metadados a uma IA sem modificar o objeto original.
 * Se o objeto for coletado pelo GC, os metadados são automaticamente descartados.
 * @param {Object} ai
 * @param {Object} meta
 */
function setAIMetadata(ai, meta) {
  const existing = metadataCache.get(ai) ?? {};
  metadataCache.set(ai, { ...existing, ...meta, updatedAt: Date.now() });
}

/**
 * Recupera os metadados de uma IA.
 * @param {Object} ai
 * @returns {Object}
 */
function getAIMetadata(ai) {
  return metadataCache.get(ai) ?? {};
}

/**
 * PROXY — intercepta e redefine operações fundamentais de objetos (P4)
 *
 * O Proxy envolve um objeto alvo (target) e intercepta operações
 * via um handler com traps (armadilhas):
 *   get    → leitura de propriedade
 *   set    → escrita de propriedade
 *   has    → operador `in`
 *   deleteProperty → operador `delete`
 *   apply  → chamada de função
 *
 * Casos de uso: validação, logging, memoização, lazy loading, segurança.
 *
 * Aqui: valida campos obrigatórios de configuração de IA e impede mutação
 * de campos imutáveis (id) após a criação.
 */
const ConfigValidator = {
  /**
   * Cria um Proxy que valida e protege um objeto de configuração de IA.
   * @param {Object} config — objeto de configuração bruto
   * @returns {Proxy<Object>}
   */
  create(config) {
    const REQUIRED = ['id', 'type', 'name', 'company', 'description'];
    const IMMUTABLE = ['id'];

    return new Proxy({ ...config }, {
      /** Intercepta leitura — adiciona computed properties */
      get(target, prop, receiver) {
        if (prop === 'isValid') {
          return REQUIRED.every(f => Boolean(target[f]));
        }
        return Reflect.get(target, prop, receiver);
      },

      /** Intercepta escrita — valida tipo e imutabilidade */
      set(target, prop, value) {
        if (IMMUTABLE.includes(prop) && prop in target) {
          throw new TypeError(`ConfigValidator: campo "${prop}" é imutável após definição.`);
        }
        if (REQUIRED.includes(prop) && (value === '' || value === null || value === undefined)) {
          throw new RangeError(`ConfigValidator: campo "${prop}" não pode ser vazio ou nulo.`);
        }
        target[prop] = value;
        return true;   // retornar false lançaria TypeError em strict mode
      },

      /** Intercepta delete — protege campos obrigatórios */
      deleteProperty(target, prop) {
        if (REQUIRED.includes(prop)) {
          throw new TypeError(`ConfigValidator: campo "${prop}" não pode ser deletado.`);
        }
        return Reflect.deleteProperty(target, prop);
      },

      /** Intercepta `in` — inclui campos computed */
      has(target, prop) {
        if (prop === 'isValid') return true;
        return Reflect.has(target, prop);
      }
    });
  }
};

/* ─── Exporta para o namespace global ─────────────────────────────────── */
Object.assign(window.CentralAI, {
  /* P2 — Estruturas de Dados */
  Node, LinkedList, Stack, Queue,
  /* P1-P2 — Algoritmos */
  BinarySearch, InsertionSort, MergeSort, SearchIndex,
  /* P3 — Iteradores e Generators */
  paginate, lazyFilter, zip, CatalogIterator,
  /* P4 — JavaScript Avançado */
  AI_SYMBOLS, metadataCache, setAIMetadata, getAIMetadata, ConfigValidator,
});

/* ─── DEMO educacional no console ──────────────────────────────────────── */
console.group('🧠 CentralAI — Demonstração: Estruturas de Dados e Algoritmos');

const s = new window.CentralAI.Stack();
s.push('ChatGPT').push('Claude').push('Gemini');
console.log('Stack (topo primeiro):', s.toArray());
console.log('Stack.pop():', s.pop(), '→ restante:', s.toArray());

const q = new window.CentralAI.Queue();
q.enqueue('toast-1').enqueue('toast-2').enqueue('toast-3');
console.log('Queue.dequeue():', q.dequeue(), '→ próximo:', q.peek());

const ll = new window.CentralAI.LinkedList();
ll.append('favorito-1').append('favorito-2').prepend('favorito-0');
console.log('LinkedList (iterable spread):', [...ll]);

const pgs = [...window.CentralAI.paginate([1,2,3,4,5,6,7,8,9], 3)];
console.log('paginate([1..9], 3):', pgs);

console.groupEnd();
