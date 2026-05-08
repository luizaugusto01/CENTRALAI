/**
 * CentralAI — app.js
 * Entry point / Bootstrapper da aplicação
 *
 * Padrão de Projeto: Singleton (App)
 * Responsável por:
 *  - Inicializar todos os componentes em ordem
 *  - Comportamento do navbar (scroll / mobile)
 *  - Smooth scroll da navegação
 *  - Toggle de plano mensal/anual
 *  - API pública em window.CentralAI.app
 */

window.CentralAI = window.CentralAI || {};

/* ═══════════════════════════════════════════════════════════════════════════
   PADRÃO SINGLETON — App
   Garante que a aplicação seja inicializada uma única vez.
   ═══════════════════════════════════════════════════════════════════════════ */
class App {
  static #instance = null;
  #initialized = false;

  static getInstance() {
    if (!App.#instance) App.#instance = new App();
    return App.#instance;
  }

  /** Inicializa todos os módulos e registra listeners globais */
  init() {
    if (this.#initialized) return;
    this.#initialized = true;

    const { components } = window.CentralAI;
    const {
      Toast, Modal, CatalogComponent,
      ComparatorComponent, RecommenderComponent, StatsCounter,
    } = components;

    /* Inicializa componentes */
    Toast.init();
    Modal.init();
    CatalogComponent.init();
    ComparatorComponent.init();
    RecommenderComponent.init();
    StatsCounter.init();

    /* Navbar */
    this._initNavbar();

    /* Smooth scroll dos links de navegação */
    this._initSmoothScroll();

    /* Toggle mensal/anual nos planos */
    this._initBillingToggle();

    /* Botões de auth (demo) */
    this._initAuthButtons();

    /* Sistema de plugins (extensions.js) */
    this._initPlugins();

    console.info('✅ CentralAI iniciado. Namespace disponível em window.CentralAI');
  }

  /* ─── Navbar: adiciona sombra ao rolar + menu mobile ─────────────────── */
  _initNavbar() {
    const navbar    = document.getElementById('navbar');
    const toggle    = document.getElementById('mobile-menu-toggle');
    const mobileMenu= document.getElementById('mobile-menu');

    /* Sombra ao rolar */
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    /* Hamburger → abrir/fechar menu mobile */
    toggle.addEventListener('click', () => {
      const isOpen = !mobileMenu.hidden;
      mobileMenu.hidden = isOpen;
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    /* Fecha menu mobile ao clicar em qualquer link interno */
    mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ─── Smooth scroll: intercepta links âncora internos ────────────────── */
  _initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const targetId = link.getAttribute('href').slice(1);
        const target   = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        /* Atualiza URL sem reload */
        history.pushState(null, '', `#${targetId}`);

        /* Devolve foco para o destino (acessibilidade) */
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      });
    });
  }

  /* ─── Billing toggle: mensal ↔ anual ─────────────────────────────────── */
  _initBillingToggle() {
    const toggle = document.getElementById('billing-toggle');
    if (!toggle) return;

    toggle.addEventListener('change', () => {
      const isAnnual = toggle.checked;
      document.querySelectorAll('.plan-card__amount[data-monthly]').forEach(el => {
        const value = isAnnual ? el.dataset.annual : el.dataset.monthly;
        el.textContent = `R$ ${value}`;
      });

      const { Toast } = window.CentralAI.components;
      Toast.info(isAnnual ? '💰 Preços anuais aplicados (20% de desconto)' : 'Preços mensais aplicados');
    });
  }

  /* ─── Botões de auth (simulação de feedback) ──────────────────────────── */
  _initAuthButtons() {
    const { Toast } = window.CentralAI.components;

    document.getElementById('btn-login')?.addEventListener('click', () => {
      Toast.info('Login disponível na versão completa da plataforma.');
    });
    document.getElementById('btn-signup')?.addEventListener('click', () => {
      Toast.success('Cadastro disponível na versão completa! 🚀');
    });
  }

  /* ─── Plugin System ────────────────────────────────────────────────── */
  _initPlugins() {
    const { pluginManager, ThemePlugin, ChatPlugin, AI_DATABASE, searchHandler } = window.CentralAI;
    if (!pluginManager) return;

    pluginManager.init(this);
    pluginManager.register(new ThemePlugin());
    pluginManager.register(new ChatPlugin());

    /* Ativa o chat (renderiza a interface no #chat-panel) */
    pluginManager.activate('chat');
    pluginManager.activate('theme');

    /* Constrói o índice de busca invertido para o SearchFilterHandler */
    if (searchHandler && AI_DATABASE) {
      searchHandler.buildIndex(AI_DATABASE);
    }

    /* Conecta os chips de sugestão ao chat */
    document.querySelectorAll('.chat-suggestion').forEach(btn => {
      btn.addEventListener('click', () => {
        const chatPlugin = pluginManager.get('chat');
        const input = document.getElementById('chat-input');
        if (input && chatPlugin) {
          input.value = btn.dataset.query;
          input.focus();
        }
      });
    });

    this.pluginManager = pluginManager;
    console.info('🔌 Plugins:', pluginManager.list().map(p => `${p.name}@${p.version}`).join(', '));
  }

  /* ─── API pública: chamada de qualquer lugar via CentralAI.app.xxx ─── */

  /** Reseta todos os filtros do catálogo */
  resetFilters() {
    window.CentralAI.components.CatalogComponent.resetFilters();
  }

  /** Retorna as IAs favoritadas */
  getFavorites() {
    const { storage, AI_DATABASE } = window.CentralAI;
    const ids = storage.get('favorites', []);
    return AI_DATABASE.filter(ai => ids.includes(ai.id));
  }

  /** Retorna os dados de uma IA pelo ID */
  getAI(id) {
    return window.CentralAI.AI_DATABASE.find(ai => ai.id === id) ?? null;
  }
}

/* ─── Bootstrap: inicializa quando o DOM estiver pronto ─────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const app = App.getInstance();
  app.init();

  /* Expõe a instância da app publicamente */
  window.CentralAI.app = app;
});
