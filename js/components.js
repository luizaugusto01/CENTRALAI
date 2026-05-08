/**
 * CentralAI — components.js
 * Camada de Apresentação (Presentation Layer)
 *
 * Responsabilidades:
 *  - Renderização dinâmica de AI Cards no catálogo
 *  - Modal de detalhes de cada IA
 *  - Comparador lado-a-lado
 *  - Recomendador interativo
 *  - Toasts (feedback ao usuário)
 *  - Animação de contadores nas estatísticas
 *
 * Conceitos JS aplicados:
 *  - DOM manipulation (querySelector, createElement, innerHTML, dataset)
 *  - Event listeners (addEventListener, removeEventListener)
 *  - Template literals para HTML dinâmico
 *  - instanceof para renderização polimórfica
 *  - Array methods: map, filter, find, some
 *  - Destructuring e spread
 *  - Closures e arrow functions
 *  - IntersectionObserver (observação de visibilidade)
 */

window.CentralAI = window.CentralAI || {};

/* ═══════════════════════════════════════════════════════════════════════════
   TOAST — Sistema de notificações (feedback ao usuário — Nielsen #1)
   ═══════════════════════════════════════════════════════════════════════════ */
const Toast = {
  _container: null,

  init() {
    this._container = document.getElementById('toast-container');
  },

  /**
   * Exibe um toast por 3 segundos.
   * @param {string} message
   * @param {'success'|'error'|'info'} type
   */
  show(message, type = 'info') {
    if (!this._container) return;

    const icons = { success: '✓', error: '✕', info: 'ℹ' };

    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.innerHTML = `<span>${icons[type] ?? 'ℹ'}</span><span>${message}</span>`;

    this._container.appendChild(el);

    /* Remove após 3s com animação de saída */
    setTimeout(() => {
      el.classList.add('toast--out');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }, 3000);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg)   { this.show(msg, 'error');   },
  info(msg)    { this.show(msg, 'info');     },
};

/* ═══════════════════════════════════════════════════════════════════════════
   MODAL — Exibição de detalhes de uma IA
   ═══════════════════════════════════════════════════════════════════════════ */
const Modal = {
  _overlay: null,
  _content: null,
  _closeBtn: null,
  _previousFocus: null,   // para devolver o foco após fechar (acessibilidade)

  init() {
    this._overlay  = document.getElementById('modal-overlay');
    this._content  = document.getElementById('modal-content');
    this._closeBtn = document.getElementById('modal-close');

    this._closeBtn.addEventListener('click', () => this.close());

    /* Fecha ao clicar fora do modal */
    this._overlay.addEventListener('click', e => {
      if (e.target === this._overlay) this.close();
    });

    /* Fecha ao pressionar Escape (Nielsen #3 — controle do usuário) */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !this._overlay.hidden) this.close();
    });
  },

  /**
   * Abre o modal com o conteúdo HTML fornecido.
   * @param {string} html
   * @param {string} [titleId] — id do elemento que serve como aria-labelledby
   */
  open(html, titleId = 'modal-title') {
    this._previousFocus = document.activeElement;
    this._content.innerHTML = html;
    this._overlay.removeAttribute('hidden');
    this._overlay.setAttribute('aria-labelledby', titleId);
    document.body.style.overflow = 'hidden';
    this._closeBtn.focus();
  },

  close() {
    this._overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    this._previousFocus?.focus();  // devolve foco (acessibilidade WCAG 2.1)
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   AI CARD RENDERER
   Usa instanceof para renderizar features específicas de cada tipo de IA.
   ═══════════════════════════════════════════════════════════════════════════ */
const AICardRenderer = {
  /**
   * Gera o HTML de um AI Card para o catálogo.
   * @param {AITool} ai
   * @param {Set<string>} favorites — IDs favoritados
   * @returns {HTMLLIElement}
   */
  createCard(ai, favorites = new Set()) {
    const { AITool, TextAI, ImageAI, CodeAI, AudioAI, MultimodalAI } = window.CentralAI;
    const typeInfo  = AITool.getTypeInfo(ai);  // usa instanceof internamente
    const isFav     = favorites.has(ai.id);
    const topPros   = ai.pros.slice(0, 2);

    /* ── Renderização específica por tipo (instanceof) ─────────────────── */
    let specificFeature = '';
    if (ai instanceof TextAI) {
      specificFeature = `Contexto: ${ai.formattedTokens} tokens`;
    } else if (ai instanceof ImageAI) {
      specificFeature = `Resoluções: ${ai.resolutions.slice(0,2).join(', ')}`;
    } else if (ai instanceof CodeAI) {
      specificFeature = `Linguagens: ${ai.topLanguages}`;
    } else if (ai instanceof AudioAI) {
      specificFeature = `Formatos: ${ai.formats.join(', ')}`;
    } else if (ai instanceof MultimodalAI) {
      specificFeature = `Modos: ${ai.capabilityList}`;
    }

    /* Badges */
    const priceBadge = ai.isFree
      ? `<span class="badge badge--free">Grátis</span>`
      : `<span class="badge badge--paid">Pago</span>`;

    const apiBadge = ai.apiAvailable
      ? `<span class="badge badge--api">API</span>`
      : '';

    /* Rating com estrelas */
    const stars = '★'.repeat(Math.round(ai.rating)) + '☆'.repeat(5 - Math.round(ai.rating));

    const li = document.createElement('li');
    li.className  = 'ai-card';
    li.dataset.id = ai.id;
    li.dataset.type = ai.type;

    li.innerHTML = `
      <div class="ai-card__header">
        <div class="ai-card__logo" aria-hidden="true">${ai.emoji}</div>
        <div class="ai-card__meta">
          <h3 class="ai-card__name">${ai.name}</h3>
          <p class="ai-card__company">${ai.company}</p>
          <div class="ai-card__badges">
            <span class="badge badge--${typeInfo.cssClass}">${typeInfo.icon} ${typeInfo.label}</span>
            ${priceBadge}
            ${apiBadge}
          </div>
        </div>
        <div class="ai-card__rating" aria-label="Avaliação ${ai.rating} de 5">
          <span aria-hidden="true">${ai.rating}</span>
          <span aria-hidden="true" style="font-size:.75rem">${stars}</span>
        </div>
      </div>

      <p class="ai-card__desc">${ai.description}</p>

      ${specificFeature ? `<div class="ai-card__specific">${specificFeature}</div>` : ''}

      <ul class="ai-card__pros" aria-label="Principais vantagens">
        ${topPros.map(p => `<li class="ai-card__pro">${p}</li>`).join('')}
      </ul>

      <div class="ai-card__actions">
        <button
          class="ai-card__fav ${isFav ? 'active' : ''}"
          data-action="fav"
          data-id="${ai.id}"
          aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}: ${ai.name}"
          aria-pressed="${isFav}"
          title="${isFav ? 'Remover favorito' : 'Favoritar'}"
        >${isFav ? '♥' : '♡'}</button>

        <button
          class="btn btn--ghost btn--sm"
          data-action="compare"
          data-id="${ai.id}"
          aria-label="Adicionar ${ai.name} ao comparador"
        >Comparar</button>

        <button
          class="btn btn--outline btn--sm"
          style="flex:1"
          data-action="details"
          data-id="${ai.id}"
          aria-label="Ver detalhes de ${ai.name}"
        >Ver detalhes</button>
      </div>
    `;

    return li;
  },

  /** Gera o HTML interno do modal de detalhes de uma IA */
  createModalHTML(ai) {
    const { AITool } = window.CentralAI;
    const typeInfo = AITool.getTypeInfo(ai);

    const pricingText = ai.isFree
      ? `Versão gratuita disponível${ai.pricing?.startingAt ? ` · Plano pago a partir de ${ai.pricing.currency} ${ai.pricing.startingAt}${ai.pricing.unit}` : ''}`
      : `A partir de ${ai.pricing?.currency} ${ai.pricing?.startingAt}${ai.pricing?.unit ?? ''}`;

    return `
      <div class="modal-ai__header">
        <div class="modal-ai__logo" aria-hidden="true">${ai.emoji}</div>
        <div>
          <h2 class="modal-ai__name" id="modal-title">${ai.name}</h2>
          <p class="modal-ai__company">${ai.company} · <span class="badge badge--${typeInfo.cssClass}">${typeInfo.icon} ${typeInfo.label}</span></p>
        </div>
      </div>

      <p class="modal-ai__desc">${ai.description}</p>

      <div class="modal-ai__section">
        <h3 class="modal-ai__section-title">Vantagens</h3>
        <ul class="modal-ai__pros" role="list">
          ${ai.pros.map(p => `<li class="modal-ai__pro">${p}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-ai__section">
        <h3 class="modal-ai__section-title">Desvantagens</h3>
        <ul class="modal-ai__cons" role="list">
          ${ai.cons.map(c => `<li class="modal-ai__con">${c}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-ai__section">
        <h3 class="modal-ai__section-title">Preços</h3>
        <p class="modal-ai__pricing">${pricingText}</p>
        <p class="modal-ai__pricing" style="margin-top:.5rem">
          <strong>API:</strong> ${ai.apiAvailable ? '✓ Disponível' : '✗ Não disponível'}
        </p>
      </div>

      <div class="modal-ai__cta">
        <a href="${ai.website}" class="btn btn--primary" target="_blank" rel="noopener noreferrer" aria-label="Acessar ${ai.name} (abre em nova aba)">Acessar ${ai.name} ↗</a>
        <button class="btn btn--ghost" onclick="CentralAI.components.Modal.close()">Fechar</button>
      </div>
    `;
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   CATALOG COMPONENT
   Gerencia o catálogo: busca, filtros e eventos dos cards.
   ═══════════════════════════════════════════════════════════════════════════ */
const CatalogComponent = {
  _list:       null,
  _empty:      null,
  _count:      null,
  _searchInput:null,
  _filterBtns: null,
  _currentFilter: 'all',
  _currentSearch: '',

  init() {
    this._list        = document.getElementById('ai-catalog');
    this._empty       = document.getElementById('catalog-empty');
    this._count       = document.getElementById('catalog-count');
    this._searchInput = document.getElementById('search-input');
    this._filterBtns  = document.querySelectorAll('.filter-btn');

    /* Delega eventos dos cards (event delegation) */
    this._list.addEventListener('click', e => this._handleCardClick(e));

    /* Busca em tempo real */
    this._searchInput.addEventListener('input', e => {
      this._currentSearch = e.target.value.trim();
      this.render();
    });

    /* Filtros */
    this._filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this._currentFilter = btn.dataset.filter;
        this._updateFilterUI(btn);
        this.render();
      });
    });

    this.render();
  },

  _updateFilterUI(activeBtn) {
    this._filterBtns.forEach(b => {
      b.classList.remove('filter-btn--active');
      b.setAttribute('aria-pressed', 'false');
    });
    activeBtn.classList.add('filter-btn--active');
    activeBtn.setAttribute('aria-pressed', 'true');
  },

  render() {
    const { AI_DATABASE, AITool, storage } = window.CentralAI;

    /* 1. Filtra por tipo (usa instanceof internamente via AITool.filterByType) */
    let ais = AITool.filterByType(AI_DATABASE, this._currentFilter);

    /* 2. Filtra por busca */
    if (this._currentSearch) {
      ais = ais.filter(ai => ai.matches(this._currentSearch));
    }

    /* 3. Recupera favoritos do localStorage */
    const favIds = new Set(storage.get('favorites', []));

    /* 4. Renderiza */
    this._list.innerHTML = '';

    if (ais.length === 0) {
      this._empty.removeAttribute('hidden');
      this._count.textContent = 'Nenhuma IA encontrada.';
    } else {
      this._empty.setAttribute('hidden', '');
      this._count.textContent = `Exibindo ${ais.length} IA${ais.length > 1 ? 's' : ''}`;

      ais.forEach((ai, idx) => {
        const card = AICardRenderer.createCard(ai, favIds);
        card.style.animationDelay = `${idx * 40}ms`;
        this._list.appendChild(card);
      });
    }
  },

  _handleCardClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const { action, id } = btn.dataset;
    const { AI_DATABASE } = window.CentralAI;
    const ai = AI_DATABASE.find(a => a.id === id);
    if (!ai) return;

    switch (action) {
      case 'fav':     this._toggleFav(ai, btn); break;
      case 'details': this._openDetails(ai);    break;
      case 'compare': this._addToCompare(ai);   break;
    }
  },

  _toggleFav(ai, btn) {
    const { storage } = window.CentralAI;
    let favs = storage.get('favorites', []);
    const isFav = favs.includes(ai.id);

    if (isFav) {
      favs = favs.filter(id => id !== ai.id);
      Toast.info(`${ai.emoji} ${ai.name} removido dos favoritos`);
    } else {
      favs.push(ai.id);
      Toast.success(`${ai.emoji} ${ai.name} adicionado aos favoritos ♥`);
    }

    storage.set('favorites', favs);

    /* Atualiza o botão imediatamente (feedback visual) */
    const nowFav = !isFav;
    btn.innerHTML    = nowFav ? '♥' : '♡';
    btn.setAttribute('aria-pressed', String(nowFav));
    btn.setAttribute('aria-label',  `${nowFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}: ${ai.name}`);
    btn.classList.toggle('active', nowFav);
  },

  _openDetails(ai) {
    Modal.open(AICardRenderer.createModalHTML(ai));
  },

  _addToCompare(ai) {
    ComparatorComponent.addAI(ai);
    Toast.info(`${ai.emoji} ${ai.name} adicionado ao comparador`);
    document.getElementById('comparador').scrollIntoView({ behavior: 'smooth' });
  },

  resetFilters() {
    this._currentFilter = 'all';
    this._currentSearch = '';
    this._searchInput.value = '';
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allBtn) this._updateFilterUI(allBtn);
    this.render();
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   COMPARATOR COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
const ComparatorComponent = {
  _selects:  [],
  _result:   null,
  _compareQ: [],  // fila de IAs a comparar (vindas do catálogo)

  init() {
    this._selects = [
      document.getElementById('cmp-1'),
      document.getElementById('cmp-2'),
      document.getElementById('cmp-3'),
    ];
    this._result = document.getElementById('comparator-result');

    document.getElementById('btn-compare').addEventListener('click', () => this.compare());
    document.getElementById('btn-compare-clear').addEventListener('click', () => this.clear());

    this._populateSelects();
  },

  _populateSelects() {
    const { AI_DATABASE, AITool } = window.CentralAI;

    const optionsHTML = AI_DATABASE.map(ai => {
      const { icon } = AITool.getTypeInfo(ai);
      return `<option value="${ai.id}">${ai.emoji} ${ai.name} (${icon})</option>`;
    }).join('');

    this._selects.forEach(sel => {
      sel.innerHTML = `<option value="">Selecione uma IA...</option>` + optionsHTML;
    });
  },

  addAI(ai) {
    /* Preenche o primeiro select vazio disponível */
    const emptySelect = this._selects.find(s => !s.value);
    if (emptySelect) {
      emptySelect.value = ai.id;
    }
  },

  compare() {
    const { AI_DATABASE } = window.CentralAI;

    const selectedIds = this._selects
      .map(s => s.value)
      .filter(Boolean);  // remove strings vazias

    if (selectedIds.length < 2) {
      Toast.error('Selecione pelo menos 2 IAs para comparar.');
      return;
    }

    const ais = selectedIds.map(id => AI_DATABASE.find(a => a.id === id)).filter(Boolean);
    this._renderTable(ais);
  },

  clear() {
    this._selects.forEach(s => { s.value = ''; });
    this._result.innerHTML = '<p class="comparator__hint">Selecione pelo menos 2 IAs para comparar.</p>';
  },

  _renderTable(ais) {
    const { AITool } = window.CentralAI;

    /* Cabeçalhos das IAs */
    const headers = ais.map(ai => {
      const { icon, label } = AITool.getTypeInfo(ai);
      return `<th class="ai-col">${ai.emoji} ${ai.name}<br><small>${icon} ${label} · ${ai.company}</small></th>`;
    }).join('');

    /* Determina a melhor em cada critério */
    const bestRating = Math.max(...ais.map(a => a.rating));

    /* Linhas da tabela */
    const rows = [
      {
        label: 'Avaliação',
        cells: ais.map(ai => {
          const cls = ai.rating === bestRating ? 'compare-best' : '';
          return `<td class="${cls}">⭐ ${ai.rating}/5</td>`;
        }),
      },
      {
        label: 'Tipo',
        cells: ais.map(ai => {
          const { icon, label } = AITool.getTypeInfo(ai);
          return `<td>${icon} ${label}</td>`;
        }),
      },
      {
        label: 'Preço',
        cells: ais.map(ai => {
          const text = ai.isFree
            ? `<span class="compare-best">Grátis disponível</span>${ai.pricing?.startingAt ? `<br><small>A partir de ${ai.pricing.currency} ${ai.pricing.startingAt}${ai.pricing.unit}</small>` : ''}`
            : `A partir de ${ai.pricing?.currency} ${ai.pricing?.startingAt}${ai.pricing?.unit ?? ''}`;
          return `<td>${text}</td>`;
        }),
      },
      {
        label: 'API',
        cells: ais.map(ai => `<td>${ai.apiAvailable ? '<span class="compare-best">✓ Sim</span>' : '<span class="compare-worst">✗ Não</span>'}</td>`),
      },
      {
        label: 'Vantagens',
        cells: ais.map(ai => `<td><ul style="padding-left:1rem;font-size:.8rem">${ai.pros.slice(0,3).map(p => `<li>${p}</li>`).join('')}</ul></td>`),
      },
      {
        label: 'Desvantagens',
        cells: ais.map(ai => `<td><ul style="padding-left:1rem;font-size:.8rem;color:var(--text-3)">${ai.cons.slice(0,2).map(c => `<li>${c}</li>`).join('')}</ul></td>`),
      },
    ];

    const rowsHTML = rows.map(row => `
      <tr>
        <td>${row.label}</td>
        ${row.cells.join('')}
      </tr>
    `).join('');

    this._result.innerHTML = `
      <div style="overflow-x:auto;margin-top:var(--space-6)">
        <table class="compare-table" role="table" aria-label="Tabela de comparação de IAs">
          <thead>
            <tr>
              <th scope="col">Critério</th>
              ${headers}
            </tr>
          </thead>
          <tbody>${rowsHTML}</tbody>
        </table>
      </div>
    `;
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   RECOMMENDER COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
const RecommenderComponent = {
  _form:    null,
  _results: null,

  init() {
    this._form    = document.getElementById('recommender-form');
    this._results = document.getElementById('recommender-results');

    this._form.addEventListener('submit', e => {
      e.preventDefault();
      this._recommend();
    });
  },

  _recommend() {
    const { AI_DATABASE, recEngine, STRATEGIES, buildRecommendationReason } = window.CentralAI;

    const data = new FormData(this._form);
    const taskType = data.get('taskType');
    const budget   = data.get('budget');
    const priority = data.get('priority');

    /* Validação de campo obrigatório */
    if (!taskType) {
      document.getElementById('task-type-err').textContent = 'Selecione o tipo de tarefa para continuar.';
      document.getElementById('task-type').focus();
      return;
    }
    document.getElementById('task-type-err').textContent = '';

    /* Seleciona estratégia com base na prioridade */
    const strategyMap = {
      quality: STRATEGIES.quality,
      cost:    STRATEGIES.cost,
      speed:   STRATEGIES.task,
    };
    recEngine.setStrategy(strategyMap[priority] ?? STRATEGIES.balance);

    const top3 = recEngine.recommend(AI_DATABASE, { taskType, budget }, 3);

    if (top3.length === 0) {
      this._results.innerHTML = `
        <div style="text-align:center;color:var(--text-3);padding:var(--space-8)">
          Nenhuma IA encontrada com esses filtros. Tente remover restrições de orçamento.
        </div>`;
      this._results.removeAttribute('hidden');
      return;
    }

    const cards = top3.map((ai, idx) => {
      const reason = buildRecommendationReason(ai, { taskType, budget });
      return `
        <div class="rec-card">
          <div class="rec-card__rank rec-card__rank--${idx + 1}" aria-label="Posição ${idx + 1}">${idx + 1}</div>
          <div>
            <p class="rec-card__name">${ai.emoji} ${ai.name} <span style="color:var(--warning)">⭐ ${ai.rating}</span></p>
            <p class="rec-card__reason">${reason}</p>
          </div>
        </div>
      `;
    }).join('');

    this._results.innerHTML = `
      <h3 style="font-size:var(--text-base);font-weight:700;margin-bottom:var(--space-4);color:var(--text-2)">
        Top ${top3.length} recomendações para você:
      </h3>
      ${cards}
    `;
    this._results.removeAttribute('hidden');
    Toast.success('Recomendações geradas com sucesso!');
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   STATS COUNTER — Anima contadores com IntersectionObserver
   ═══════════════════════════════════════════════════════════════════════════ */
const StatsCounter = {
  init() {
    const counters = document.querySelectorAll('.stats__count');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        this._animate(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  },

  _animate(el) {
    const target   = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimal ?? '0', 10);
    const duration = 1500;  // ms
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);  // ease-out cubic
      const current  = target * ease;

      el.textContent = decimals
        ? current.toFixed(decimals)
        : Math.floor(current).toString();

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = decimals ? target.toFixed(decimals) : target.toString();
    };

    requestAnimationFrame(step);
  },
};

/* ─── Exporta tudo para o namespace global ───────────────────────────────── */
Object.assign(window.CentralAI, {
  components: {
    Toast,
    Modal,
    AICardRenderer,
    CatalogComponent,
    ComparatorComponent,
    RecommenderComponent,
    StatsCounter,
  },
});
