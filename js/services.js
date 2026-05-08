/**
 * CentralAI — services.js
 * Camada de Serviços (Service Layer)
 *
 * Padrões de Projeto implementados:
 *  - Singleton  → StorageService (garante única instância)
 *  - Observer   → EventEmitter   (comunicação desacoplada entre componentes)
 *  - Strategy   → RecommendationEngine + estratégias concretas
 *
 * Conceitos JS: classes, campos privados (#), static, instanceof,
 *               throw new TypeError, closures, arrow functions.
 */

window.CentralAI = window.CentralAI || {};

/* ═══════════════════════════════════════════════════════════════════════════
   PADRÃO OBSERVER — EventEmitter
   Permite que componentes publiquem e assinem eventos sem acoplamento direto.
   Ex: quando o catálogo muda de filtro, o contador é notificado automaticamente.
   ═══════════════════════════════════════════════════════════════════════════ */
class EventEmitter {
  constructor() {
    this._listeners = {};   // { eventName: [fn, fn, ...] }
  }

  /**
   * Assina (subscribe) um evento
   * @param {string}   event
   * @param {Function} listener
   * @returns {this}  — encadeamento fluente (fluent API)
   */
  on(event, listener) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(listener);
    return this;
  }

  /**
   * Cancela uma assinatura (unsubscribe)
   */
  off(event, listener) {
    if (!this._listeners[event]) return this;
    this._listeners[event] = this._listeners[event].filter(fn => fn !== listener);
    return this;
  }

  /**
   * Publica (emit) um evento com dados opcionais
   * @param {string} event
   * @param {...any}  args
   */
  emit(event, ...args) {
    const fns = this._listeners[event];
    if (!fns || fns.length === 0) return false;
    fns.forEach(fn => fn(...args));
    return true;
  }

  /** Remove todos os listeners de um evento */
  removeAll(event) {
    delete this._listeners[event];
    return this;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   PADRÃO SINGLETON — StorageService
   Uma única instância gerencia todo o acesso ao localStorage,
   garantindo consistência e evitando conflitos de chave.
   ═══════════════════════════════════════════════════════════════════════════ */
class StorageService {
  /* Campo estático privado guarda a única instância */
  static #instance = null;

  static PREFIX = 'centralai_';

  /**
   * Ponto de acesso global ao Singleton.
   * @returns {StorageService}
   */
  static getInstance() {
    if (!StorageService.#instance) {
      StorageService.#instance = new StorageService();
    }
    return StorageService.#instance;
  }

  /* Construtor privado (por convenção — JS não suporta private constructor nativamente) */
  constructor() {
    if (StorageService.#instance) {
      throw new Error(
        'StorageService é um Singleton. Use StorageService.getInstance() em vez de new StorageService().'
      );
    }
    this._available = this._checkAvailability();
  }

  _checkAvailability() {
    try {
      localStorage.setItem('__test__', '1');
      localStorage.removeItem('__test__');
      return true;
    } catch {
      console.warn('StorageService: localStorage indisponível. Usando memória temporária.');
      this._mem = {};
      return false;
    }
  }

  _key(key) { return StorageService.PREFIX + key; }

  get(key, fallback = null) {
    try {
      if (!this._available) return this._mem?.[key] ?? fallback;
      const raw = localStorage.getItem(this._key(key));
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  set(key, value) {
    try {
      if (!this._available) { this._mem[key] = value; return; }
      localStorage.setItem(this._key(key), JSON.stringify(value));
    } catch (e) {
      console.error('StorageService.set falhou:', e);
    }
  }

  remove(key) {
    if (!this._available) { delete this._mem?.[key]; return; }
    localStorage.removeItem(this._key(key));
  }

  /** Retorna todas as chaves com o prefixo da aplicação */
  keys() {
    if (!this._available) return Object.keys(this._mem || {});
    return Object.keys(localStorage)
      .filter(k => k.startsWith(StorageService.PREFIX))
      .map(k => k.slice(StorageService.PREFIX.length));
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   PADRÃO STRATEGY — RecommendationStrategy (interface / classe base)
   Cada estratégia concreta implementa um algoritmo de recomendação diferente.
   O RecommendationEngine delega para a estratégia ativa sem conhecer detalhes.
   ═══════════════════════════════════════════════════════════════════════════ */
class RecommendationStrategy {
  /**
   * @param {AITool[]} ais    — lista completa de IAs
   * @param {Object}   params — parâmetros da consulta
   * @returns {AITool[]}      — lista ordenada/filtrada
   */
  recommend(ais, params) {  // eslint-disable-line no-unused-vars
    throw new Error(`${this.constructor.name} deve implementar o método recommend().`);
  }
}

/* ── Estratégia 1: por tipo de tarefa ─────────────────────────────────────── */
class TaskBasedStrategy extends RecommendationStrategy {
  recommend(ais, { taskType, budget }) {
    const { AITool } = window.CentralAI;

    /* Filtra por tipo usando instanceof internamente em AITool.filterByType */
    let candidates = AITool.filterByType(ais, taskType || 'all');

    /* Restrição de orçamento */
    if (budget === 'free') {
      candidates = candidates.filter(ai => ai.isFree);
    }

    /* Ordena por rating decrescente */
    return candidates.sort((a, b) => b.rating - a.rating);
  }
}

/* ── Estratégia 2: por avaliação (rating) ────────────────────────────────── */
class RatingBasedStrategy extends RecommendationStrategy {
  recommend(ais, { budget } = {}) {
    let list = [...ais];
    if (budget === 'free') list = list.filter(ai => ai.isFree);
    return list.sort((a, b) => b.rating - a.rating);
  }
}

/* ── Estratégia 3: por menor custo ──────────────────────────────────────── */
class CostBasedStrategy extends RecommendationStrategy {
  recommend(ais, { taskType } = {}) {
    const { AITool } = window.CentralAI;
    let list = AITool.filterByType(ais, taskType || 'all');

    /* Gratuitas primeiro, depois por preço crescente */
    return list.sort((a, b) => {
      if (a.isFree && !b.isFree) return -1;
      if (!a.isFree && b.isFree) return 1;
      return (a.pricing?.startingAt ?? 999) - (b.pricing?.startingAt ?? 999);
    });
  }
}

/* ── Estratégia 4: combinada (qualidade × custo) ─────────────────────────── */
class BalancedStrategy extends RecommendationStrategy {
  recommend(ais, { taskType, budget }) {
    const { AITool } = window.CentralAI;
    let list = AITool.filterByType(ais, taskType || 'all');
    if (budget === 'free') list = list.filter(ai => ai.isFree);

    /* Score = rating * 2 + bonus gratuita */
    return list
      .map(ai => ({ ai, score: ai.rating * 2 + (ai.isFree ? 1 : 0) }))
      .sort((a, b) => b.score - a.score)
      .map(({ ai }) => ai);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   RecommendationEngine — contexto do padrão Strategy
   Recebe uma estratégia e delega a ela o algoritmo de recomendação.
   A estratégia pode ser trocada em tempo de execução (sem recompilar).
   ═══════════════════════════════════════════════════════════════════════════ */
class RecommendationEngine extends EventEmitter {
  #strategy;

  constructor(strategy = new BalancedStrategy()) {
    super();
    this.setStrategy(strategy);
  }

  /**
   * Troca a estratégia em tempo de execução.
   * Usa instanceof para garantir tipo correto (segurança de tipo em runtime).
   * @param {RecommendationStrategy} strategy
   */
  setStrategy(strategy) {
    /* instanceof valida que o argumento é uma estratégia válida */
    if (!(strategy instanceof RecommendationStrategy)) {
      throw new TypeError(
        `setStrategy() esperava uma instância de RecommendationStrategy. ` +
        `Tipo recebido: "${strategy?.constructor?.name ?? typeof strategy}". ` +
        `Verifique se passou a classe correta.`
      );
    }
    this.#strategy = strategy;
    this.emit('strategyChanged', strategy.constructor.name);
  }

  get currentStrategyName() {
    return this.#strategy.constructor.name;
  }

  /**
   * Executa a recomendação e retorna os N melhores resultados.
   * @param {AITool[]} ais
   * @param {Object}   params
   * @param {number}   [topN=3]
   * @returns {AITool[]}
   */
  recommend(ais, params, topN = 3) {
    const results = this.#strategy.recommend(ais, params);
    this.emit('recommended', { count: results.length, params });
    return results.slice(0, topN);
  }
}

/* ─── Gera as razões de recomendação para exibir na UI ──────────────────── */
function buildRecommendationReason(ai, params) {
  const { TextAI, ImageAI, CodeAI, AudioAI, MultimodalAI, AITool } = window.CentralAI;
  const typeInfo = AITool.getTypeInfo(ai);

  const reasons = [];

  /* instanceof para mensagem específica por tipo */
  if (ai instanceof MultimodalAI) {
    reasons.push(`Suporta ${ai.capabilities.join(', ')} — perfeito para múltiplas tarefas`);
  } else if (ai instanceof TextAI && ai.supportsPT) {
    reasons.push(`Suporte nativo a português com ${ai.formattedTokens} tokens de contexto`);
  } else if (ai instanceof ImageAI) {
    reasons.push(`Estilos disponíveis: ${ai.styles.join(', ')}`);
  } else if (ai instanceof CodeAI) {
    reasons.push(`Suporta ${ai.topLanguages} e outras linguagens`);
  } else if (ai instanceof AudioAI) {
    reasons.push(`Formatos aceitos: ${ai.formats.join(', ')}`);
  }

  if (ai.isFree && params.budget === 'free') reasons.push('Versão gratuita disponível');
  if (ai.apiAvailable) reasons.push('API disponível para integração');

  reasons.push(`Rating: ${ai.rating}/5 ⭐`);

  return reasons.slice(0, 2).join(' · ');
}

/* ─── Instâncias de serviço (exportadas como singletons) ─────────────────── */
const storage    = StorageService.getInstance();
const recEngine  = new RecommendationEngine();

/* Mapa de estratégias disponíveis */
const STRATEGIES = {
  quality: new RatingBasedStrategy(),
  cost:    new CostBasedStrategy(),
  balance: new BalancedStrategy(),
  task:    new TaskBasedStrategy(),
};

/* ─── Exporta para o namespace global ───────────────────────────────────── */
Object.assign(window.CentralAI, {
  /* Padrões */
  EventEmitter,
  StorageService,
  RecommendationStrategy,
  TaskBasedStrategy, RatingBasedStrategy, CostBasedStrategy, BalancedStrategy,
  RecommendationEngine,
  /* Instâncias */
  storage,
  recEngine,
  STRATEGIES,
  /* Utilitário */
  buildRecommendationReason,
});
