/**
 * CentralAI — models.js
 * Camada de Domínio (Domain Layer)
 *
 * Conceitos de JavaScript aplicados (até operador instanceof):
 *  - Classes com constructor, getters, setters e campos privados (#)
 *  - Herança (extends / super)
 *  - Métodos estáticos (static)
 *  - Operador instanceof (verificação polimórfica de tipos)
 *  - Template literals, destructuring, spread operator
 *  - Array methods: map, filter, find, sort
 *
 * Padrão de Projeto: Factory Method (AIFactory)
 */

/* ─── Namespace global da aplicação ──────────────────────────────────────── */
window.CentralAI = window.CentralAI || {};

/* ═══════════════════════════════════════════════════════════════════════════
   CLASSE BASE: AITool
   Representa qualquer ferramenta de IA catalogada na plataforma.
   ═══════════════════════════════════════════════════════════════════════════ */
class AITool {
  /* Campos privados (encapsulamento) */
  #name;
  #company;
  #description;
  #pros;
  #cons;
  #rating;
  #apiAvailable;

  /**
   * @param {Object} data — dados brutos da IA
   */
  constructor({
    id, name, company, description,
    pros = [], cons = [], pricing = {},
    rating = 0, tags = [], apiAvailable = false,
    emoji = '🤖', website = '#'
  }) {
    if (new.target === AITool) {
      throw new TypeError('AITool é uma classe abstrata. Use uma subclasse concreta.');
    }

    this.id           = id;
    this.#name        = name;
    this.#company     = company;
    this.#description = description;
    this.#pros        = pros;
    this.#cons        = cons;
    this.pricing      = pricing;      // { free: bool, startingAt: number, unit: string }
    this.#rating      = rating;
    this.tags         = tags;
    this.#apiAvailable = apiAvailable;
    this.emoji        = emoji;
    this.website      = website;
  }

  /* Getters — acesso somente-leitura aos campos privados */
  get name()         { return this.#name; }
  get company()      { return this.#company; }
  get description()  { return this.#description; }
  get pros()         { return [...this.#pros]; }     // cópia defensiva
  get cons()         { return [...this.#cons]; }
  get rating()       { return this.#rating; }
  get apiAvailable() { return this.#apiAvailable; }

  /* Propriedade calculada */
  get isFree() { return Boolean(this.pricing?.free); }

  /** Verifica se a IA possui uma tag específica */
  hasTag(tag) {
    return this.tags.includes(tag.toLowerCase());
  }

  /**
   * Verifica se a IA bate com o termo de busca
   * @param {string} query
   * @returns {boolean}
   */
  matches(query) {
    const q = query.toLowerCase();
    return (
      this.#name.toLowerCase().includes(q) ||
      this.#company.toLowerCase().includes(q) ||
      this.#description.toLowerCase().includes(q) ||
      this.tags.some(t => t.includes(q))
    );
  }

  /** Serializa para JSON simples (para localStorage) */
  toJSON() {
    return {
      id:           this.id,
      name:         this.#name,
      company:      this.#company,
      type:         this.type,        // definido pela subclasse
      rating:       this.#rating,
      pricing:      this.pricing,
      apiAvailable: this.#apiAvailable,
      emoji:        this.emoji,
    };
  }

  /**
   * OPERADOR instanceof — determina o tipo real de qualquer AITool
   * Demonstra polimorfismo com instanceof no contexto de herança.
   *
   * @param {AITool} ai
   * @returns {{ label: string, icon: string, cssClass: string }}
   */
  static getTypeInfo(ai) {
    if (!(ai instanceof AITool)) {
      throw new TypeError(`Esperado AITool, recebido: ${typeof ai}`);
    }

    /* instanceof verifica a cadeia de protótipos */
    if (ai instanceof MultimodalAI) return { label: 'Multimodal', icon: '🌐', cssClass: 'multimodal' };
    if (ai instanceof TextAI)       return { label: 'Texto',      icon: '📝', cssClass: 'text'       };
    if (ai instanceof ImageAI)      return { label: 'Imagem',     icon: '🎨', cssClass: 'image'      };
    if (ai instanceof CodeAI)       return { label: 'Código',     icon: '💻', cssClass: 'code'       };
    if (ai instanceof AudioAI)      return { label: 'Áudio',      icon: '🎵', cssClass: 'audio'      };

    return { label: 'IA', icon: '🤖', cssClass: 'default' };
  }

  /**
   * OPERADOR instanceof — filtra uma lista de IAs por tipo
   * @param {AITool[]} ais
   * @param {string}   type  — 'text'|'image'|'code'|'audio'|'multimodal'|'all'
   * @returns {AITool[]}
   */
  static filterByType(ais, type) {
    if (type === 'all') return ais;

    const typeMap = {
      text:       TextAI,
      image:      ImageAI,
      code:       CodeAI,
      audio:      AudioAI,
      multimodal: MultimodalAI,
    };

    const TargetClass = typeMap[type];
    if (!TargetClass) return ais;

    /* instanceof dentro de filter — coração do polimorfismo */
    return ais.filter(ai => ai instanceof TargetClass);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUBCLASSE: TextAI — IAs especializadas em texto e linguagem natural
   ═══════════════════════════════════════════════════════════════════════════ */
class TextAI extends AITool {
  #maxTokens;
  #languages;

  constructor(data) {
    super({ ...data, type: 'text' });
    this.type       = 'text';
    this.#maxTokens = data.maxTokens  ?? 0;
    this.#languages = data.languages  ?? ['en'];
  }

  get maxTokens()  { return this.#maxTokens; }
  get languages()  { return [...this.#languages]; }

  get formattedTokens() {
    return this.#maxTokens.toLocaleString('pt-BR');
  }

  /* Feature específica de texto: suporte a português */
  get supportsPT() {
    return this.#languages.includes('pt') || this.#languages.includes('pt-BR');
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUBCLASSE: ImageAI — IAs geradoras de imagens
   ═══════════════════════════════════════════════════════════════════════════ */
class ImageAI extends AITool {
  #resolutions;
  #styles;

  constructor(data) {
    super({ ...data, type: 'image' });
    this.type         = 'image';
    this.#resolutions = data.resolutions ?? [];
    this.#styles      = data.styles      ?? [];
  }

  get resolutions() { return [...this.#resolutions]; }
  get styles()      { return [...this.#styles]; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUBCLASSE: CodeAI — IAs de assistência a programação
   ═══════════════════════════════════════════════════════════════════════════ */
class CodeAI extends AITool {
  #languages;
  #features;

  constructor(data) {
    super({ ...data, type: 'code' });
    this.type       = 'code';
    this.#languages = data.languages ?? [];
    this.#features  = data.features  ?? [];
  }

  get languages() { return [...this.#languages]; }
  get features()  { return [...this.#features]; }

  get topLanguages() {
    return this.#languages.slice(0, 4).join(', ');
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUBCLASSE: AudioAI — IAs de síntese, transcrição e análise de áudio
   ═══════════════════════════════════════════════════════════════════════════ */
class AudioAI extends AITool {
  #formats;
  #maxDurationMin;

  constructor(data) {
    super({ ...data, type: 'audio' });
    this.type            = 'audio';
    this.#formats        = data.formats        ?? [];
    this.#maxDurationMin = data.maxDurationMin ?? 0;
  }

  get formats()        { return [...this.#formats]; }
  get maxDurationMin() { return this.#maxDurationMin; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUBCLASSE: MultimodalAI — IAs que combinam múltiplas modalidades
   ═══════════════════════════════════════════════════════════════════════════ */
class MultimodalAI extends AITool {
  #capabilities;

  constructor(data) {
    super({ ...data, type: 'multimodal' });
    this.type          = 'multimodal';
    this.#capabilities = data.capabilities ?? [];
  }

  get capabilities() { return [...this.#capabilities]; }

  /* Multimodal herda de AITool, então também é instanceof AITool */
  get capabilityList() {
    return this.#capabilities.join(' · ');
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   PADRÃO FACTORY METHOD — AIFactory
   Centraliza a criação de instâncias corretas sem expor a lógica de
   construção ao código cliente. (GoF, criacional)
   ═══════════════════════════════════════════════════════════════════════════ */
class AIFactory {
  /* Mapa type → classe construtora */
  static #registry = {
    text:       TextAI,
    image:      ImageAI,
    code:       CodeAI,
    audio:      AudioAI,
    multimodal: MultimodalAI,
  };

  /**
   * Cria e retorna a instância correta com base no campo `type`.
   * @param {Object} config — objeto de configuração da IA
   * @returns {AITool}
   */
  static create(config) {
    const Cls = AIFactory.#registry[config.type];
    if (!Cls) {
      throw new RangeError(`Tipo de IA desconhecido: "${config.type}". Tipos válidos: ${Object.keys(AIFactory.#registry).join(', ')}`);
    }
    return new Cls(config);
  }

  /**
   * Cria múltiplas instâncias a partir de um array de configurações.
   * @param {Object[]} configs
   * @returns {AITool[]}
   */
  static createAll(configs) {
    return configs.map(cfg => AIFactory.create(cfg));
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   BASE DE DADOS — 12 IAs do catálogo CentralAI
   Cada objeto é transformado na instância correta pelo AIFactory.
   ═══════════════════════════════════════════════════════════════════════════ */
const AI_CONFIGS = [
  /* ── Texto ─────────────────────────────────────────────────────────────── */
  {
    id: 'chatgpt-4o', type: 'text', emoji: '🟢',
    name: 'ChatGPT 4o', company: 'OpenAI',
    description: 'Modelo multimodal de última geração da OpenAI. Processa texto, imagem e áudio em uma única interface, com raciocínio avançado e respostas em tempo real.',
    pros: ['Raciocínio avançado', 'Grande comunidade', 'API robusta e madura', 'Suporte a 50+ idiomas', 'Memória persistente'],
    cons: ['Custo elevado no plano Plus', 'Dados de treinamento com corte', 'Pode alucinar em tópicos técnicos'],
    pricing: { free: true, startingAt: 20, unit: '/mês', currency: 'USD' },
    rating: 4.8, tags: ['texto', 'análise', 'chat', 'resumo'],
    apiAvailable: true, maxTokens: 128000, languages: ['pt', 'en', 'es', 'fr', 'de', 'ja'],
    website: 'https://openai.com/chatgpt',
  },
  {
    id: 'claude-sonnet', type: 'text', emoji: '🟠',
    name: 'Claude 3.5 Sonnet', company: 'Anthropic',
    description: 'IA da Anthropic focada em segurança e alinhamento. Excelente em análise de documentos longos, programação e escrita criativa. Janela de contexto de 200k tokens.',
    pros: ['Maior janela de contexto (200k tokens)', 'Excelente em análise de textos longos', 'Resposta segura e calibrada', 'Bom em tarefas de código'],
    cons: ['API com custo moderado', 'Sem navegação web nativa', 'Menos integrado a ferramentas terceiras'],
    pricing: { free: true, startingAt: 20, unit: '/mês', currency: 'USD' },
    rating: 4.7, tags: ['texto', 'análise', 'documentos', 'código'],
    apiAvailable: true, maxTokens: 200000, languages: ['pt', 'en', 'es', 'fr'],
    website: 'https://claude.ai',
  },
  {
    id: 'gemini-pro', type: 'text', emoji: '🔵',
    name: 'Gemini 1.5 Pro', company: 'Google',
    description: 'Modelo de linguagem do Google com integração nativa ao Google Workspace. Janela de contexto de 1 milhão de tokens — ideal para analisar livros ou repositórios inteiros.',
    pros: ['Janela de contexto gigantesca (1M tokens)', 'Integração Google Workspace', 'Gratuito com conta Google', 'Pesquisa na web nativa'],
    cons: ['Respostas às vezes prolixas', 'Integração com APIs de terceiros limitada', 'Privacidade de dados pelo Google'],
    pricing: { free: true, startingAt: 0, unit: '', currency: 'BRL' },
    rating: 4.5, tags: ['texto', 'pesquisa', 'documentos', 'google'],
    apiAvailable: true, maxTokens: 1000000, languages: ['pt', 'en', 'es', 'fr', 'de', 'ja', 'ko'],
    website: 'https://gemini.google.com',
  },
  {
    id: 'perplexity', type: 'text', emoji: '🟣',
    name: 'Perplexity AI', company: 'Perplexity',
    description: 'Motor de busca com IA que combina respostas em linguagem natural com fontes citadas e verificáveis. Ideal para pesquisa acadêmica e jornalística.',
    pros: ['Fontes citadas e verificáveis', 'Pesquisa em tempo real', 'Interface limpa', 'Versão gratuita generosa'],
    cons: ['Foco em pesquisa, não em geração criativa', 'Sem API pública robusta', 'Pode citar fontes desatualizadas'],
    pricing: { free: true, startingAt: 20, unit: '/mês', currency: 'USD' },
    rating: 4.4, tags: ['pesquisa', 'busca', 'citações', 'texto'],
    apiAvailable: false, maxTokens: 32000, languages: ['pt', 'en', 'es'],
    website: 'https://perplexity.ai',
  },

  /* ── Imagem ─────────────────────────────────────────────────────────────── */
  {
    id: 'dalle3', type: 'image', emoji: '🎨',
    name: 'DALL-E 3', company: 'OpenAI',
    description: 'Gerador de imagens da OpenAI integrado ao ChatGPT. Interpreta descrições textuais complexas com alta fidelidade e permite revisões via conversa.',
    pros: ['Integração nativa ao ChatGPT', 'Alta fidelidade a prompts complexos', 'API disponível via OpenAI', 'Segurança por padrão'],
    cons: ['Não permite edição fino de imagens', 'Caro para uso intensivo via API', 'Restrições de conteúdo rígidas'],
    pricing: { free: false, startingAt: 20, unit: '/mês (incluso no Plus)', currency: 'USD' },
    rating: 4.6, tags: ['imagem', 'geração', 'arte'],
    apiAvailable: true, resolutions: ['1024×1024', '1792×1024', '1024×1792'],
    styles: ['Natural', 'Vívido'],
    website: 'https://openai.com/dall-e-3',
  },
  {
    id: 'midjourney', type: 'image', emoji: '🖼️',
    name: 'Midjourney v6', company: 'Midjourney',
    description: 'O modelo mais artístico do mercado. Produz imagens com qualidade fotográfica e estilo autoral inconfundível. Favorito de designers e artistas digitais.',
    pros: ['Qualidade artística excepcional', 'Estilo visual único', 'Comunidade ativa no Discord', 'Alta variabilidade criativa'],
    cons: ['Sem API pública', 'Interface apenas via Discord', 'Sem plano gratuito permanente'],
    pricing: { free: false, startingAt: 10, unit: '/mês', currency: 'USD' },
    rating: 4.9, tags: ['imagem', 'arte', 'design', 'fotografia'],
    apiAvailable: false, resolutions: ['1024×1024', '2048×2048'],
    styles: ['Fotorrealista', 'Anime', 'Pintura', '3D'],
    website: 'https://midjourney.com',
  },
  {
    id: 'stable-diffusion', type: 'image', emoji: '⚙️',
    name: 'Stable Diffusion 3', company: 'Stability AI',
    description: 'Modelo open-source de geração de imagens. Pode ser rodado localmente, oferecendo total privacidade e controle. Base de modelos personalizados (LoRA, ControlNet).',
    pros: ['Open-source e gratuito', 'Pode rodar localmente', 'Ecossistema de modelos enorme', 'Total controle e privacidade'],
    cons: ['Requer hardware potente para local', 'Curva de aprendizado alta', 'Qualidade varia muito por configuração'],
    pricing: { free: true, startingAt: 0, unit: '', currency: 'BRL' },
    rating: 4.3, tags: ['imagem', 'open-source', 'local', 'arte'],
    apiAvailable: true, resolutions: ['512×512', '768×768', '1024×1024', '2048×2048'],
    styles: ['Fotorrealista', 'Anime', 'Pixel Art', 'Pintura a óleo'],
    website: 'https://stability.ai',
  },

  /* ── Código ─────────────────────────────────────────────────────────────── */
  {
    id: 'github-copilot', type: 'code', emoji: '🐙',
    name: 'GitHub Copilot', company: 'GitHub / Microsoft',
    description: 'Assistente de programação integrado ao VS Code, JetBrains e outros editores. Autocompleta código, gera funções completas e explica trechos complexos.',
    pros: ['Integração nativa aos editores', 'Suporte a 40+ linguagens', 'Chat inline no editor', 'Revisão de PR automática'],
    cons: ['Assinatura obrigatória (sem free permanente)', 'Pode sugerir código inseguro', 'Requer internet'],
    pricing: { free: false, startingAt: 10, unit: '/mês', currency: 'USD' },
    rating: 4.7, tags: ['código', 'IDE', 'autocomplete', 'programação'],
    apiAvailable: false,
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP'],
    features: ['Autocomplete', 'Chat', 'Revisão de PR', 'Geração de testes'],
    website: 'https://github.com/features/copilot',
  },
  {
    id: 'cursor-ai', type: 'code', emoji: '⌨️',
    name: 'Cursor', company: 'Anysphere',
    description: 'Editor de código com IA embutida (fork do VS Code). Permite editar múltiplos arquivos simultaneamente via chat, fazer refatorações em cascata e debugar com linguagem natural.',
    pros: ['Edição multi-arquivo via chat', 'Baseado no VS Code (familiar)', 'Usa GPT-4 e Claude', 'Entende todo o codebase'],
    cons: ['Substitui o editor, não é extensão', 'Plano gratuito limitado', 'Dados de código enviados ao servidor'],
    pricing: { free: true, startingAt: 20, unit: '/mês', currency: 'USD' },
    rating: 4.8, tags: ['código', 'IDE', 'editor', 'refatoração'],
    apiAvailable: false,
    languages: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'Java', 'C++'],
    features: ['Chat multi-arquivo', 'Composer', 'Debugger IA', 'Geração de testes'],
    website: 'https://cursor.sh',
  },

  /* ── Áudio ──────────────────────────────────────────────────────────────── */
  {
    id: 'elevenlabs', type: 'audio', emoji: '🔊',
    name: 'ElevenLabs', company: 'ElevenLabs',
    description: 'Plataforma de síntese de voz ultra-realista. Clone sua própria voz, gere narrações em 29 idiomas e crie personagens de áudio com emoções naturais.',
    pros: ['Voz mais realista do mercado', 'Clone de voz com poucos segundos', '29 idiomas com sotaque natural', 'API bem documentada'],
    cons: ['Plano gratuito com limite de caracteres', 'Custo elevado para uso intensivo', 'Preocupações éticas com clone de voz'],
    pricing: { free: true, startingAt: 5, unit: '/mês', currency: 'USD' },
    rating: 4.8, tags: ['áudio', 'voz', 'narração', 'clone'],
    apiAvailable: true, formats: ['MP3', 'WAV', 'PCM', 'OGG'],
    maxDurationMin: 0,
    website: 'https://elevenlabs.io',
  },
  {
    id: 'whisper', type: 'audio', emoji: '🎙️',
    name: 'Whisper', company: 'OpenAI',
    description: 'Modelo open-source de reconhecimento de fala (ASR) da OpenAI. Transcreve e traduz áudio em 99 idiomas com precisão surpreendente, mesmo com sotaque.',
    pros: ['Open-source e gratuito', 'Suporte a 99 idiomas', 'Alta precisão com sotaque', 'Pode rodar localmente'],
    cons: ['Não é tempo real (offline)', 'Requer GPU para uso local fluido', 'Sem síntese de voz (só transcrição)'],
    pricing: { free: true, startingAt: 0, unit: '', currency: 'BRL' },
    rating: 4.6, tags: ['áudio', 'transcrição', 'open-source', 'tradução'],
    apiAvailable: true, formats: ['MP3', 'MP4', 'WAV', 'M4A', 'FLAC'],
    maxDurationMin: 0,
    website: 'https://openai.com/research/whisper',
  },

  /* ── Multimodal ─────────────────────────────────────────────────────────── */
  {
    id: 'gemini-ultra', type: 'multimodal', emoji: '✨',
    name: 'Gemini Ultra', company: 'Google DeepMind',
    description: 'O modelo mais avançado do Google. Processa texto, imagem, áudio e vídeo simultaneamente. Integrado ao Google Workspace e com capacidade de raciocínio de nível especialista.',
    pros: ['Processa texto, imagem, áudio e vídeo', 'Integração total ao Google Workspace', 'Raciocínio de nível especialista', 'Janela de 2M tokens (experimental)'],
    cons: ['Acesso restrito (Google One AI Premium)', 'Alto custo no plano premium', 'Dados processados pelo Google'],
    pricing: { free: false, startingAt: 20, unit: '/mês (Google One)', currency: 'USD' },
    rating: 4.7, tags: ['multimodal', 'texto', 'imagem', 'vídeo', 'áudio'],
    apiAvailable: true,
    capabilities: ['Texto', 'Imagem', 'Áudio', 'Vídeo', 'Código', 'Raciocínio'],
    website: 'https://deepmind.google/technologies/gemini/ultra',
  },
];

/* Instancia todas as IAs via Factory (único ponto de criação) */
const AI_DATABASE = AIFactory.createAll(AI_CONFIGS);

/* ─── Exporta para o namespace global ───────────────────────────────────── */
Object.assign(window.CentralAI, {
  /* Classes */
  AITool, TextAI, ImageAI, CodeAI, AudioAI, MultimodalAI, AIFactory,
  /* Dados */
  AI_DATABASE,
});

/* ─── DEMO do operador instanceof no console (para fins didáticos) ───────── */
console.group('🔬 CentralAI — Demonstração do operador instanceof');
AI_DATABASE.forEach(ai => {
  const info = AITool.getTypeInfo(ai);  // usa instanceof internamente
  const checks = [
    `instanceof AITool:       ${ai instanceof AITool}`,
    `instanceof TextAI:       ${ai instanceof TextAI}`,
    `instanceof ImageAI:      ${ai instanceof ImageAI}`,
    `instanceof CodeAI:       ${ai instanceof CodeAI}`,
    `instanceof AudioAI:      ${ai instanceof AudioAI}`,
    `instanceof MultimodalAI: ${ai instanceof MultimodalAI}`,
  ].join(' | ');
  console.log(`${info.icon} ${ai.name.padEnd(22)} → ${checks}`);
});
console.groupEnd();
