/**
 * CentralAI — extensions.js
 * Padrões de Projeto Avançados (GoF) + Sistema de Plugins
 *
 * P5 — Padrões de Projeto de Software (GoF):
 *
 *   Command      → encapsula ações como objetos para undo/redo no comparador
 *   Decorator    → adiciona responsabilidades a IAs sem alterar a hierarquia
 *   Adapter      → normaliza diferentes formatos de resposta de APIs de IA
 *   Chain of Responsibility → pipeline de filtros em cadeia desacoplada
 *
 * Sistema de Plugins (Extensibilidade — P5):
 *   BasePlugin   → interface do ciclo de vida de qualquer plugin
 *   PluginManager → Singleton que gerencia registro e ativação de plugins
 *   ThemePlugin  → demonstra plugin de tema visual
 *   ChatPlugin   → interface de chat extensível para futuras integrações reais
 *
 * Todos os padrões seguem os princípios SOLID:
 *   S — cada classe tem uma responsabilidade
 *   O — aberto para extensão (novos decoradores/strategies/plugins)
 *   L — subclasses substituíveis (todos os Command implementam execute/undo)
 *   I — interfaces mínimas (BasePlugin define apenas o essencial)
 *   D — depende de abstrações, não de implementações concretas
 */

window.CentralAI = window.CentralAI || {};

/* ════════════════════════════════════════════════════════════════════════
   PADRÃO COMMAND — GoF Comportamental
   ════════════════════════════════════════════════════════════════════════

   Problema: como desfazer/refazer ações no comparador?
   Solução: encapsular cada ação como um objeto com execute() e undo().

   Benefícios:
   · Desfazer/refazer (undo/redo) sem acoplamento
   · Log de operações (CommandHistory.history)
   · Fila de comandos para execução assíncrona
   · Macro-comando: agrupar vários comandos em um
*/

/**
 * Classe base abstrata para todos os comandos.
 * Qualquer ação reversível do sistema deve herdar desta.
 */
class Command {
  execute() { throw new Error(`${this.constructor.name}: implemente execute()`); }
  undo()    { throw new Error(`${this.constructor.name}: implemente undo()`); }

  /** Descrição legível para o log (sobrescreva nas subclasses) */
  get description() { return this.constructor.name; }
}

/** Adiciona uma IA à seleção do comparador */
class AddToComparatorCommand extends Command {
  #comparatorEl;
  #aiId;
  #selectIndex;
  #previousValue;

  constructor(comparatorEl, aiId, selectIndex) {
    super();
    this.#comparatorEl = comparatorEl;
    this.#aiId         = aiId;
    this.#selectIndex  = selectIndex;
  }

  execute() {
    const select = this.#comparatorEl.querySelectorAll('.comparator__select')[this.#selectIndex];
    if (select) {
      this.#previousValue = select.value;  // salva estado anterior para undo
      select.value = this.#aiId;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return this;
  }

  undo() {
    const select = this.#comparatorEl.querySelectorAll('.comparator__select')[this.#selectIndex];
    if (select) {
      select.value = this.#previousValue ?? '';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return this;
  }

  get description() { return `Adicionar "${this.#aiId}" ao slot ${this.#selectIndex + 1} do comparador`; }
}

/** Remove uma IA do comparador */
class ClearComparatorCommand extends Command {
  #comparatorEl;
  #snapshot = [];   // estado antes da limpeza

  constructor(comparatorEl) {
    super();
    this.#comparatorEl = comparatorEl;
  }

  execute() {
    const selects = [...this.#comparatorEl.querySelectorAll('.comparator__select')];
    /* Salva snapshot antes de limpar */
    this.#snapshot = selects.map(s => s.value);
    selects.forEach(s => { s.value = ''; });
    return this;
  }

  undo() {
    const selects = [...this.#comparatorEl.querySelectorAll('.comparator__select')];
    selects.forEach((s, i) => { s.value = this.#snapshot[i] ?? ''; });
    return this;
  }

  get description() { return 'Limpar comparador (snapshot restaurável)'; }
}

/**
 * HISTÓRICO DE COMANDOS
 *
 * Mantém duas pilhas (Stack de core.js):
 *   #done   → comandos já executados (undo vai pegar daqui)
 *   #undone → comandos desfeitos (redo vai pegar daqui)
 *
 * Ao executar um novo comando, a pilha #undone é limpa
 * (como acontece no undo history do VS Code, Word, etc.)
 */
class CommandHistory {
  #done;
  #undone;
  #maxSize;

  constructor(maxSize = 30) {
    const { Stack } = window.CentralAI;
    this.#done    = new Stack();
    this.#undone  = new Stack();
    this.#maxSize = maxSize;
  }

  /**
   * Executa um comando e adiciona ao histórico.
   * @param {Command} command
   */
  execute(command) {
    if (!(command instanceof Command)) {
      throw new TypeError('CommandHistory.execute() requer um Command.');
    }
    command.execute();
    this.#done.push(command);
    this.#undone.clear();   // novo comando invalida o histórico de redo

    /* Limita o tamanho da pilha de histórico */
    if (this.#done.size > this.#maxSize) {
      const arr = this.#done.toArray();
      arr.pop();
      this.#done.clear();
      arr.reverse().forEach(c => this.#done.push(c));
    }
    return this;
  }

  /** Desfaz o último comando */
  undo() {
    if (this.#done.isEmpty()) return null;
    const cmd = this.#done.pop();
    cmd.undo();
    this.#undone.push(cmd);
    return cmd;
  }

  /** Refaz o último comando desfeito */
  redo() {
    if (this.#undone.isEmpty()) return null;
    const cmd = this.#undone.pop();
    cmd.execute();
    this.#done.push(cmd);
    return cmd;
  }

  get canUndo() { return !this.#done.isEmpty(); }
  get canRedo() { return !this.#undone.isEmpty(); }

  /** Retorna o histórico como array de strings descritivas */
  get history() { return this.#done.toArray().map(c => c.description); }
}

/* ════════════════════════════════════════════════════════════════════════
   PADRÃO DECORATOR — GoF Estrutural
   ════════════════════════════════════════════════════════════════════════

   Problema: como adicionar badge "Destaque" ou "Novo" a uma IA específica
   sem criar ChatGPTFeatured, ClaudeNew, etc. para cada combinação?

   Solução: envolver o objeto com um Decorator que repassa todas as
   mensagens, mas modifica apenas o que é necessário.

   Vantagem sobre herança: combinação livre em runtime:
     decorateAI(chatgpt, FeaturedDecorator, VerifiedDecorator)
*/

/**
 * Decorador base — envolve um AITool (ou outro Decorator) e repassa tudo.
 * Subclasses sobrescrevem apenas os getters que precisam modificar.
 */
class AIDecorator {
  #wrapped;

  constructor(ai) {
    const { AITool } = window.CentralAI;
    if (!(ai instanceof AITool) && !(ai instanceof AIDecorator)) {
      throw new TypeError(
        'AIDecorator: argumento deve ser AITool ou outro AIDecorator (encadeamento permitido).'
      );
    }
    this.#wrapped = ai;
    /* Marca o objeto como decorado usando Symbol (P4) */
    this[window.CentralAI.AI_SYMBOLS?.DECORATED] = true;
  }

  /* Repasse transparente para o objeto decorado */
  get id()           { return this.#wrapped.id; }
  get name()         { return this.#wrapped.name; }
  get company()      { return this.#wrapped.company; }
  get description()  { return this.#wrapped.description; }
  get pros()         { return this.#wrapped.pros; }
  get cons()         { return this.#wrapped.cons; }
  get rating()       { return this.#wrapped.rating; }
  get apiAvailable() { return this.#wrapped.apiAvailable; }
  get isFree()       { return this.#wrapped.isFree; }
  get pricing()      { return this.#wrapped.pricing; }
  get tags()         { return this.#wrapped.tags; }
  get emoji()        { return this.#wrapped.emoji; }
  get website()      { return this.#wrapped.website; }
  get type()         { return this.#wrapped.type; }

  matches(query) { return this.#wrapped.matches(query); }
  hasTag(tag)    { return this.#wrapped.hasTag(tag); }
  toJSON()       { return this.#wrapped.toJSON(); }

  get wrapped()  { return this.#wrapped; }  // acesso ao original
}

/** Marca a IA como "Destaque" — adiciona badge e boost de popularidade */
class FeaturedDecorator extends AIDecorator {
  get name()       { return `⭐ ${super.name}`; }
  get tags()       { return [...super.tags, 'destaque', 'em-alta']; }
  get isFeatured() { return true; }
}

/** Marca como nova versão recente */
class NewReleaseDecorator extends AIDecorator {
  get name()   { return `🆕 ${super.name}`; }
  get tags()   { return [...super.tags, 'novo', 'recente']; }
  get isNew()  { return true; }
}

/** Adiciona verificação de autenticidade da empresa */
class VerifiedDecorator extends AIDecorator {
  get company()    { return `${super.company} ✓`; }
  get isVerified() { return true; }
}

/** Marca como open-source com link para repositório */
class OpenSourceDecorator extends AIDecorator {
  get tags()         { return [...super.tags, 'open-source', 'gratuito']; }
  get isOpenSource() { return true; }
  get name()         { return `⚙️ ${super.name}`; }
}

/**
 * Função utilitária para aplicar múltiplos decoradores em sequência.
 * Equivalente ao encadeamento fluente:
 *   new VerifiedDecorator(new FeaturedDecorator(chatgpt))
 *
 * @param {AITool}      ai
 * @param {...Function} decorators — classes de decorador
 * @returns {AIDecorator}
 */
function decorateAI(ai, ...decorators) {
  return decorators.reduce((wrapped, Decorator) => new Decorator(wrapped), ai);
}

/* ════════════════════════════════════════════════════════════════════════
   PADRÃO ADAPTER — GoF Estrutural
   ════════════════════════════════════════════════════════════════════════

   Problema: OpenAI, Anthropic e Google retornam formatos JSON completamente
   diferentes. Como normalizar sem acoplar o código ao formato de cada API?

   Solução: um Adapter por fonte transforma o formato externo para o
   formato interno padrão da CentralAI:
     { text: string, tokens: number, model: string, source: string }

   Quando integrar a API real: basta substituir o mock em ChatPlugin.sendMessage()
   por um fetch() real, o Adapter já normaliza a resposta.
*/

/**
 * Interface base do adapter de API.
 * Toda integração real deve herdar desta classe.
 */
class AIAPIAdapter {
  /**
   * Normaliza a resposta bruta da API para o formato interno.
   * @param {Object} rawResponse
   * @returns {{ text: string, tokens: number, model: string, source: string }}
   */
  adapt(rawResponse) {
    throw new Error(`${this.constructor.name}: implemente adapt(rawResponse)`);
  }

  /**
   * Formata um prompt para o formato que a API espera.
   * @param {string} text
   * @returns {Object}
   */
  formatPrompt(text) {
    throw new Error(`${this.constructor.name}: implemente formatPrompt(text)`);
  }
}

/** Adapta o formato da API da OpenAI (GPT-4o, DALL-E, Whisper) */
class OpenAIAdapter extends AIAPIAdapter {
  adapt(raw) {
    // Formato real: { choices:[{message:{content:'...'}}], usage:{total_tokens:N}, model:'...' }
    return {
      text:   raw?.choices?.[0]?.message?.content ?? '',
      tokens: raw?.usage?.total_tokens ?? 0,
      model:  raw?.model ?? 'gpt-4o',
      source: 'openai',
    };
  }

  formatPrompt(text) {
    return { model: 'gpt-4o', messages: [{ role: 'user', content: text }] };
  }
}

/** Adapta o formato da API da Anthropic (Claude 3.5 Sonnet) */
class AnthropicAdapter extends AIAPIAdapter {
  adapt(raw) {
    // Formato real: { content:[{text:'...'}], usage:{input_tokens:N, output_tokens:N}, model:'...' }
    return {
      text:   raw?.content?.[0]?.text ?? '',
      tokens: (raw?.usage?.input_tokens ?? 0) + (raw?.usage?.output_tokens ?? 0),
      model:  raw?.model ?? 'claude-3-5-sonnet-20241022',
      source: 'anthropic',
    };
  }

  formatPrompt(text) {
    return {
      model:      'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages:   [{ role: 'user', content: text }],
    };
  }
}

/** Adapta o formato da API do Google (Gemini 1.5 Pro) */
class GeminiAdapter extends AIAPIAdapter {
  adapt(raw) {
    // Formato real: { candidates:[{content:{parts:[{text:'...'}]}}], usageMetadata:{totalTokenCount:N} }
    return {
      text:   raw?.candidates?.[0]?.content?.parts?.[0]?.text ?? '',
      tokens: raw?.usageMetadata?.totalTokenCount ?? 0,
      model:  'gemini-1.5-pro',
      source: 'google',
    };
  }

  formatPrompt(text) {
    return { contents: [{ parts: [{ text }] }] };
  }
}

/**
 * Factory de adapters — cria o adapter correto por nome da fonte.
 * Registre novos adapters aqui sem alterar código existente (Princípio Aberto/Fechado).
 */
function createAdapter(source) {
  const registry = {
    openai:    new OpenAIAdapter(),
    anthropic: new AnthropicAdapter(),
    google:    new GeminiAdapter(),
  };
  if (!registry[source]) {
    throw new RangeError(
      `createAdapter: fonte desconhecida "${source}". Disponíveis: ${Object.keys(registry).join(', ')}`
    );
  }
  return registry[source];
}

/* ════════════════════════════════════════════════════════════════════════
   PADRÃO CHAIN OF RESPONSIBILITY — GoF Comportamental
   ════════════════════════════════════════════════════════════════════════

   Problema: o catálogo precisa de vários filtros (tipo, orçamento, rating,
   busca textual) aplicados em sequência. Como evitar um if/else gigante?

   Solução: cada filtro é um handler independente com um próximo na cadeia.
   Cada handler processa o que pode e delega o resto para o próximo.

   Benefício: adicionar/remover/reordenar filtros sem tocar no código existente.
*/

/** Handler base — define a interface e o encadeamento fluente */
class FilterHandler {
  #next = null;

  /**
   * Configura o próximo handler na cadeia.
   * Retorna o próximo para permitir encadeamento:
   *   type.setNext(budget).setNext(rating).setNext(search)
   */
  setNext(handler) {
    this.#next = handler;
    return handler;
  }

  /** Processa e delega ao próximo */
  handle(ais, params) {
    if (this.#next) return this.#next.handle(ais, params);
    return ais;
  }
}

/** Filtra por tipo de IA usando instanceof (reutiliza AITool.filterByType) */
class TypeFilterHandler extends FilterHandler {
  handle(ais, params) {
    const { AITool } = window.CentralAI;
    const filtered = (params.type && params.type !== 'all')
      ? AITool.filterByType(ais, params.type)
      : ais;
    return super.handle(filtered, params);
  }
}

/** Filtra por orçamento (apenas gratuitas ou todas) */
class BudgetFilterHandler extends FilterHandler {
  handle(ais, params) {
    const filtered = params.freeOnly ? ais.filter(ai => ai.isFree) : ais;
    return super.handle(filtered, params);
  }
}

/** Filtra por rating mínimo */
class RatingFilterHandler extends FilterHandler {
  handle(ais, params) {
    const minRating = params.minRating ?? 0;
    const filtered  = minRating > 0 ? ais.filter(ai => ai.rating >= minRating) : ais;
    return super.handle(filtered, params);
  }
}

/**
 * Filtra por busca textual usando o SearchIndex de core.js.
 * Combina o índice invertido com busca lazy para eficiência máxima.
 */
class SearchFilterHandler extends FilterHandler {
  #searchIndex;

  constructor() {
    super();
    const { SearchIndex } = window.CentralAI;
    this.#searchIndex = new SearchIndex();
  }

  /** Constrói o índice a partir da lista de IAs (chamar uma vez no init) */
  buildIndex(ais) {
    this.#searchIndex.build(ais);
    return this;
  }

  handle(ais, params) {
    if (!params.query || params.query.trim().length < 2) {
      return super.handle(ais, params);
    }
    const matchIds = this.#searchIndex.search(params.query);
    const filtered = matchIds ? ais.filter(ai => matchIds.has(ai.id)) : ais;
    return super.handle(filtered, params);
  }
}

/**
 * Constrói a cadeia de filtros padrão do catálogo.
 * Ordem: tipo → orçamento → rating → busca textual
 *
 * @returns {{ chain: FilterHandler, searchHandler: SearchFilterHandler }}
 */
function buildFilterChain() {
  const type   = new TypeFilterHandler();
  const budget = new BudgetFilterHandler();
  const rating = new RatingFilterHandler();
  const search = new SearchFilterHandler();

  /* Encadeamento fluente — cada setNext() retorna o próximo handler */
  type.setNext(budget).setNext(rating).setNext(search);

  return { chain: type, searchHandler: search };
}

/* ════════════════════════════════════════════════════════════════════════
   SISTEMA DE PLUGINS — Extensibilidade (P5)
   ════════════════════════════════════════════════════════════════════════

   Motivação: "se futuramente quiser mudar o design, evoluir o chat e tudo"
   → o sistema de plugins permite adicionar funcionalidades sem modificar
     o código existente (Princípio Aberto/Fechado do SOLID).

   Ciclo de vida de um plugin:
     register() → install(app) → activate() → onActivate()
                                    ...uso...
                               → deactivate() → onDeactivate()
*/

/**
 * Plugin base — define a interface mínima de todos os plugins.
 * Qualquer nova funcionalidade (chat, analytics, tema) herda daqui.
 */
class BasePlugin {
  #name;
  #version;

  constructor(name, version = '1.0.0') {
    if (new.target === BasePlugin) {
      throw new TypeError('BasePlugin é abstrato. Crie uma subclasse concreta.');
    }
    this.#name    = name;
    this.#version = version;
    this.active   = false;
  }

  get name()    { return this.#name; }
  get version() { return this.#version; }

  /** Chamado uma vez ao registrar no PluginManager (injeção de dependência) */
  install(app) {}    // eslint-disable-line no-unused-vars

  /** Ativa o plugin — pode ser chamado várias vezes */
  activate() {
    this.active = true;
    this.onActivate();
  }

  /** Desativa sem remover */
  deactivate() {
    this.active = false;
    this.onDeactivate();
  }

  /** Hooks para subclasses — implementação opcional */
  onActivate()   {}
  onDeactivate() {}
  onUninstall()  {}

  toString() { return `[Plugin:${this.#name}@${this.#version} active=${this.active}]`; }
}

/**
 * PLUGIN MANAGER — Singleton
 *
 * Gerencia o ciclo de vida completo de todos os plugins registrados.
 * Inspirado nos sistemas de plugins do Vue.js, Webpack e VS Code.
 */
class PluginManager {
  static #instance = null;
  #plugins = new Map();   // name → BasePlugin
  #app     = null;

  static getInstance() {
    if (!PluginManager.#instance) PluginManager.#instance = new PluginManager();
    return PluginManager.#instance;
  }

  constructor() {
    if (PluginManager.#instance) {
      throw new Error('PluginManager é Singleton. Use PluginManager.getInstance().');
    }
  }

  /** Injeta a referência ao app principal */
  init(app) { this.#app = app; return this; }

  /**
   * Registra e instala um plugin.
   * @param {BasePlugin} plugin
   */
  register(plugin) {
    if (!(plugin instanceof BasePlugin)) {
      throw new TypeError(`PluginManager.register(): requer BasePlugin. Recebeu: ${typeof plugin}`);
    }
    if (this.#plugins.has(plugin.name)) {
      console.warn(`PluginManager: plugin "${plugin.name}" já está registrado. Ignorando.`);
      return this;
    }
    plugin.install(this.#app);
    this.#plugins.set(plugin.name, plugin);
    console.log(`[PluginManager] ✓ Registrado: ${plugin}`);
    return this;
  }

  /** Recupera plugin pelo nome */
  get(name) { return this.#plugins.get(name) ?? null; }

  activate(name) {
    const p = this.#getOrThrow(name);
    p.activate();
    return this;
  }

  deactivate(name) {
    const p = this.#getOrThrow(name);
    p.deactivate();
    return this;
  }

  #getOrThrow(name) {
    const p = this.#plugins.get(name);
    if (!p) throw new ReferenceError(`PluginManager: plugin "${name}" não encontrado.`);
    return p;
  }

  /** Lista todos os plugins com status */
  list() {
    return [...this.#plugins.values()].map(p => ({
      name:    p.name,
      version: p.version,
      active:  p.active,
    }));
  }
}

/* ── Plugin Concreto: ThemePlugin ──────────────────────────────────────── */

/**
 * Permite trocar o tema de cores da aplicação em runtime.
 * Demonstra como um plugin pode interagir com CSS Custom Properties.
 */
class ThemePlugin extends BasePlugin {
  #current = 'dark';
  #themes  = {
    dark:   { '--bg-page': '#050508', '--purple-600': '#7c3aed', '--blue-600': '#2563eb' },
    purple: { '--bg-page': '#080415', '--purple-600': '#9333ea', '--blue-600': '#7c3aed' },
    ocean:  { '--bg-page': '#030d18', '--purple-600': '#0ea5e9', '--blue-600': '#0284c7' },
    forest: { '--bg-page': '#040d08', '--purple-600': '#16a34a', '--blue-600': '#15803d' },
  };

  constructor() { super('theme', '1.2.0'); }

  install() {
    console.log('[ThemePlugin] Instalado. Temas:', Object.keys(this.#themes).join(', '));
  }

  onActivate() { this.apply(this.#current); }

  /**
   * Aplica um tema alterando as CSS Custom Properties do :root.
   * @param {string} name — chave do tema
   */
  apply(name) {
    const vars = this.#themes[name];
    if (!vars) { console.warn(`ThemePlugin: tema "${name}" não existe.`); return this; }
    this.#current = name;
    const root = document.documentElement;
    Object.entries(vars).forEach(([prop, val]) => root.style.setProperty(prop, val));
    console.log(`[ThemePlugin] Tema aplicado: "${name}"`);
    return this;
  }

  onDeactivate() {
    /* Restaura o tema dark (padrão) ao desativar */
    const root = document.documentElement;
    Object.keys(this.#themes.dark).forEach(prop => root.style.removeProperty(prop));
  }

  getThemes()       { return Object.keys(this.#themes); }
  getCurrentTheme() { return this.#current; }
}

/* ── Plugin Concreto: ChatPlugin ────────────────────────────────────────── */

/**
 * CHAT PLUGIN — Interface de chat extensível para futuras integrações.
 *
 * Estrutura preparada para evolução:
 *   Fase 1 (atual): respostas mock baseadas em palavras-chave
 *   Fase 2 (futura): integrar um Adapter real com fetch() para uma API de IA
 *                    basta chamar this.setAdapter('openai') e implementar o fetch
 *
 * Padrões utilizados internamente:
 *   · Adapter → ChatPlugin usa AIAPIAdapter para normalizar respostas de API
 *   · Observer → emite eventos que outros componentes podem ouvir
 */
class ChatPlugin extends BasePlugin {
  #messages  = [];
  #adapter   = null;
  #container = null;
  #typing    = false;

  constructor() { super('chat', '0.2.0-beta'); }

  install(app) {
    console.log('[ChatPlugin] Instalado. Aguardando ativação. Adapter: nenhum (mock ativo).');
  }

  onActivate() {
    this.#container = document.getElementById('chat-panel');
    if (this.#container) {
      this.#render();
      console.log('[ChatPlugin] Interface renderizada em #chat-panel.');
    }
  }

  onDeactivate() {
    if (this.#container) this.#container.innerHTML = '';
  }

  /**
   * Configura o adapter de API real a usar.
   * Quando implementar a integração real, chame este método com a fonte correta.
   * @param {'openai'|'anthropic'|'google'} source
   */
  setAdapter(source) {
    this.#adapter = createAdapter(source);
    console.log(`[ChatPlugin] Adapter configurado: ${source}`);
    return this;
  }

  /**
   * Envia uma mensagem e obtém resposta.
   * Fase atual: mock. Fase futura: trocar #mockReply() por fetch() real.
   * @param {string} text
   */
  async sendMessage(text) {
    const content = text?.trim();
    if (!content) return;

    this.#messages.push({ role: 'user', content, ts: Date.now() });
    this.#typing = true;
    this.#renderMessages();

    /* Simula latência realista (800-1200ms) */
    await new Promise(r => setTimeout(r, 800 + Math.random() * 400));

    /*
     * PONTO DE EXTENSÃO: substituir a linha abaixo por fetch() real:
     *
     *   const raw    = await fetch('/api/chat', { method: 'POST', body: JSON.stringify(this.#adapter.formatPrompt(content)) });
     *   const json   = await raw.json();
     *   const result = this.#adapter.adapt(json);
     *   const reply  = result.text;
     */
    const reply = this.#mockReply(content);

    this.#typing = false;
    this.#messages.push({ role: 'assistant', content: reply, ts: Date.now() });
    this.#renderMessages();
    return reply;
  }

  /** Respostas baseadas em palavras-chave (fase mock) */
  #mockReply(text) {
    const t = text.toLowerCase();
    const { AI_DATABASE } = window.CentralAI;
    const total = AI_DATABASE?.length ?? 12;

    if (t.match(/melhor ia|ia melhor|recomend/))
      return `Com base no catálogo de **${total} IAs**, minha recomendação depende do contexto.\n\nPara uso geral: **ChatGPT 4o** (⭐4.8). Para textos longos: **Claude 3.5 Sonnet** (200k tokens). Para código: **Cursor** (⭐4.8). Use o **Recomendador** para uma sugestão personalizada!`;

    if (t.match(/grat(is|uito|ui)|free|sem custo/))
      return `Opções **100% gratuitas** no catálogo:\n• **Gemini 1.5 Pro** — Google, pesquisa com 1M tokens\n• **Perplexity AI** — busca com fontes citadas\n• **Whisper** — transcrição open-source em 99 idiomas\n• **Stable Diffusion** — geração de imagens local`;

    if (t.match(/cod(e|igo|igo)|program|desenvolv/))
      return `Para **programação e código**, os destaques são:\n• **GitHub Copilot** — integrado ao VS Code/JetBrains (40+ linguagens)\n• **Cursor** — editor completo com chat multi-arquivo\n\nAmbos têm compreensão profunda do contexto do projeto.`;

    if (t.match(/imagem|arte|design|foto|visual/))
      return `Para **geração de imagens**:\n• **Midjourney v6** — melhor qualidade artística (⭐4.9)\n• **DALL-E 3** — integrado ao ChatGPT, ótima interpretação de prompts\n• **Stable Diffusion 3** — open-source, gratuito e personalizável`;

    if (t.match(/audio|voz|narr|transcri|podcast/))
      return `Para **áudio e voz**:\n• **ElevenLabs** — síntese de voz ultra-realista, 29 idiomas, clone de voz\n• **Whisper** (OpenAI) — transcrição open-source em 99 idiomas`;

    if (t.match(/api|integr|desenvolvedores?/))
      return `IAs com **API robusta** disponível:\n• **ChatGPT 4o** (OpenAI) — API mais madura e documentada\n• **Claude 3.5 Sonnet** (Anthropic) — 200k tokens de contexto\n• **Gemini 1.5 Pro** (Google) — 1M tokens, integração Workspace\n\nUse o **Comparador** para ver preços de API lado a lado.`;

    if (t.match(/compar|diferenc|vs|versus/))
      return `Para comparar IAs, use a seção **Comparador** da plataforma!\nVocê pode selecionar até 3 IAs e ver uma tabela completa com rating, preço, API, vantagens e desvantagens lado a lado. Role a página para baixo! ⬇️`;

    return `Ótima pergunta sobre IA! O catálogo tem **${total} ferramentas** organizadas por tipo:\n📝 Texto · 🎨 Imagem · 💻 Código · 🎵 Áudio · 🌐 Multimodal\n\nUse o **Recomendador** para uma sugestão personalizada, ou o **Comparador** para análise detalhada. Como posso ajudar mais especificamente?`;
  }

  /** Parseia markdown mínimo (bold e quebra de linha) */
  #parseMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  #render() {
    if (!this.#container) return;
    this.#container.innerHTML = `
      <div class="chat__messages" id="chat-messages" role="log" aria-live="polite" aria-label="Histórico de conversa"></div>
      <form class="chat__form" id="chat-form" novalidate>
        <label for="chat-input" class="sr-only">Mensagem para o assistente</label>
        <input
          type="text"
          class="chat__input"
          id="chat-input"
          placeholder="Pergunte sobre qualquer IA do catálogo…"
          autocomplete="off"
          aria-label="Mensagem para o assistente CentralAI"
          maxlength="500"
        />
        <button type="submit" class="btn btn--primary chat__send" aria-label="Enviar mensagem">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    `;

    this.#renderMessages();

    const form  = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input?.value?.trim();
      if (!text || this.#typing) return;

      input.value    = '';
      input.disabled = true;
      await this.sendMessage(text);
      input.disabled = false;
      input.focus();
    });
  }

  #renderMessages() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    if (this.#messages.length === 0) {
      container.innerHTML = `
        <div class="chat__welcome">
          <div class="chat__welcome-icon" aria-hidden="true">🤖</div>
          <p>Olá! Sou o assistente do <strong>CentralAI</strong>.</p>
          <p class="chat__welcome-hint">Pergunte sobre qualquer IA do catálogo.<br>
          Exemplo: <em>"Qual a melhor IA gratuita para código?"</em></p>
        </div>
      `;
      return;
    }

    const msgs = this.#messages.map(m => `
      <div class="chat__message chat__message--${m.role}">
        <div class="chat__bubble">${this.#parseMarkdown(m.content)}</div>
        <time class="chat__time" datetime="${new Date(m.ts).toISOString()}">
          ${new Date(m.ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
    `).join('');

    /* Indicador de "digitando..." */
    const typing = this.#typing
      ? `<div class="chat__message chat__message--assistant chat__message--typing">
           <div class="chat__bubble"><span class="chat__dot"></span><span class="chat__dot"></span><span class="chat__dot"></span></div>
         </div>`
      : '';

    container.innerHTML = msgs + typing;
    container.scrollTop = container.scrollHeight;
  }

  getHistory()   { return [...this.#messages]; }
  clearHistory() { this.#messages = []; this.#renderMessages(); }
}

/* ─── Instâncias globais ─────────────────────────────────────────────── */
const pluginManager  = PluginManager.getInstance();
const commandHistory = new CommandHistory();
const { chain: filterChain, searchHandler } = buildFilterChain();

/* ─── Exporta para o namespace global ───────────────────────────────── */
Object.assign(window.CentralAI, {
  /* Command */
  Command, AddToComparatorCommand, ClearComparatorCommand, CommandHistory,
  /* Decorator */
  AIDecorator, FeaturedDecorator, NewReleaseDecorator, VerifiedDecorator,
  OpenSourceDecorator, decorateAI,
  /* Adapter */
  AIAPIAdapter, OpenAIAdapter, AnthropicAdapter, GeminiAdapter, createAdapter,
  /* Chain of Responsibility */
  FilterHandler, TypeFilterHandler, BudgetFilterHandler, RatingFilterHandler,
  SearchFilterHandler, buildFilterChain,
  /* Plugin System */
  BasePlugin, PluginManager, ThemePlugin, ChatPlugin,
  /* Instâncias */
  pluginManager, commandHistory, filterChain, searchHandler,
});

console.log('[CentralAI] extensions.js carregado: Command, Decorator, Adapter, Chain, Plugins ✓');
