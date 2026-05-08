# Interação Humano-Computador (IHC) — CentralAI

> Disciplina: Padrões de Projeto de Software · UFG · INF  
> Referências: Nielsen (1994) · ISO 9241 · WCAG 2.1 · Don Norman — *The Design of Everyday Things*

---

## 1. Princípios de IHC Aplicados

### 1.1 Heurísticas de Usabilidade de Nielsen

As 10 heurísticas de Nielsen foram adotadas como guia de design para toda a interface.

| # | Heurística                       | Como foi aplicada no CentralAI                                                    |
|---|----------------------------------|-----------------------------------------------------------------------------------|
| 1 | Visibilidade do status do sistema| Toasts confirmam toda ação; contador de IAs atualiza ao filtrar; rating visível nos cards |
| 2 | Correspondência com o mundo real | Terminologia familiar (catálogo, comparar, recomendação); ícones semânticos (♥, ✓, ✗) |
| 3 | Controle e liberdade do usuário  | Favoritar pode ser desfeito; botão "Limpar" no comparador; ESC fecha modal         |
| 4 | Consistência e padrões           | Design System via CSS Custom Properties; botões, badges e cards com padrão único  |
| 5 | Prevenção de erros               | Validação de campo obrigatório antes de recomendar; selects com opção vazia padrão|
| 6 | Reconhecimento em vez de recordação| Filtros visíveis o tempo todo; badges de tipo em cada card; botões com labels claros |
| 7 | Flexibilidade e eficiência       | Busca em tempo real; atalho "Comparar" direto no card; smooth scroll rápido       |
| 8 | Design estético e minimalista    | Dark theme com informação densa mas organizada; sem elementos decorativos sem função|
| 9 | Ajuda a reconhecer e recuperar erros | Mensagem de erro específica ("Selecione o tipo de tarefa"); botão "Limpar filtros" |
|10 | Ajuda e documentação            | Hints nos formulários; tooltips nos botões; seção de planos com recursos listados |

---

## 2. Acessibilidade — WCAG 2.1 AA

### 2.1 Perceptível

- **Alternativas de texto:** `aria-label` em todos os ícones e botões sem texto visível
- **Conteúdo adaptável:** HTML semântico (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`, `<ul>`)
- **Distinguível:** Contraste de cor ≥ 4.5:1 (texto sobre fundo escuro); cor nunca usada como única distinção

### 2.2 Operável

- **Teclado:** Toda funcionalidade acessível via Tab, Enter e Escape
- **Skip Link:** `<a class="skip-link" href="#main">` visível ao focar — pula navbar para leitores de tela
- **Tempo suficiente:** Toasts duram 3s sem ação obrigatória do usuário
- **Sem efeitos de flash:** Nenhuma animação pisca mais de 3 vezes por segundo

### 2.3 Compreensível

- **Previsível:** Cada clique tem comportamento consistente e esperado
- **Assistência de entrada:** `aria-required="true"`, mensagem de erro vinculada via `aria-describedby`
- **Idioma da página:** `<html lang="pt-BR">` declarado

### 2.4 Robusto

- **Compatibilidade:** HTML válido; ARIA correto; testado em Chrome, Firefox e Safari
- **Live regions:** `role="status" aria-live="polite"` para toasts e resultados dinâmicos

### 2.5 Elementos de acessibilidade implementados

```html
<!-- Skip Link -->
<a class="skip-link" href="#main">Pular para o conteúdo principal</a>

<!-- Toast (live region) -->
<div role="status" aria-live="polite" aria-atomic="false" id="toast-container"></div>

<!-- Filtros com estado -->
<button aria-pressed="true" data-filter="all">Todas</button>

<!-- Modal com foco gerenciado -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title"></div>

<!-- Formulário acessível -->
<select aria-required="true" aria-describedby="task-type-err"></select>
<span role="alert" id="task-type-err" aria-live="polite"></span>

<!-- Radio buttons agrupados -->
<fieldset><legend>Orçamento</legend>...</fieldset>
```

---

## 3. Arquitetura da Informação

### 3.1 Hierarquia de Conteúdo

```
CentralAI
├── Hero (Apresentação + CTA)
├── Estatísticas (credibilidade)
├── Funcionalidades (o que a plataforma oferece)
├── Catálogo (núcleo — o maior valor)
│   ├── Busca
│   ├── Filtros por tipo
│   └── Cards de IA (detalhes, comparar, favoritar)
├── Comparador (decisão)
├── Recomendador (orientação)
└── Planos (conversão)
```

A ordem segue o modelo **AIDA** (Atenção → Interesse → Desejo → Ação):
- **Atenção:** Hero com headline impactante
- **Interesse:** Estatísticas e funcionalidades
- **Desejo:** Catálogo e comparador (demonstram valor)
- **Ação:** Recomendador + Planos (conversão)

### 3.2 Fluxo de Navegação Principal

```
Página inicial
     │
     ├──► Catálogo → Filtrar/Buscar → Ver Detalhes ──► Modal
     │                              → Adicionar ao Comparador
     │                              → Favoritar
     │
     ├──► Comparador → Selecionar 2-3 IAs → Tabela comparativa
     │
     ├──► Recomendador → Formulário → 3 Recomendações
     │
     └──► Planos → Escolha → CTA de Conversão
```

---

## 4. Design Visual

### 4.1 Sistema de Cores (Teoria das Cores Aplicada)

| Cor                | Hex       | Uso                                     | Psicologia               |
|--------------------|-----------|-----------------------------------------|--------------------------|
| Roxo (#7c3aed)     | Primária  | Botões CTA, badges, bordas ativas       | Inovação, tecnologia     |
| Azul (#2563eb)     | Secundária| Gradiente, links                        | Confiança, profissional  |
| Ciano (#06b6d4)    | Acento    | Detalhes, destaques                     | Modernidade, IA          |
| Verde (#22c55e)    | Sucesso   | Prós, confirmações, plano grátis        | Positivo, go             |
| Vermelho (#ef4444) | Erro      | Contras, erros, campos obrigatórios     | Alerta, atenção          |
| Âmbar (#f59e0b)    | Aviso     | Rating (estrelas), avisos               | Atenção moderada         |

**Fundo escuro** (`#07070d`): reduz fadiga ocular em uso prolongado — alinhado ao público técnico.

### 4.2 Tipografia

- **Inter** (sans-serif): corpo do texto, legibilidade em telas — escala modular completa
- **JetBrains Mono** (monospaced): features técnicas (tokens, linguagens, formatos de áudio)
- **Hierarquia:** H1 (900, 3.75rem) → H2 (800, 2.25rem) → H3 (700, 1.25rem) → Body (400, 1rem)

### 4.3 Espaçamento e Layout

- **Sistema de 4px:** todos os espaçamentos são múltiplos de 4px (--space-1 = 4px, --space-2 = 8px...)
- **Container:** max-width: 1200px com padding lateral consistente
- **Grid responsivo:** 1 coluna (mobile) → 2 colunas (tablet 768px) → 3 colunas (desktop 1024px)

---

## 5. Interação e Feedback

### 5.1 Tempos de Resposta (ISO 9241-110)

| Ação                       | Tempo de resposta | Tipo de feedback               |
|----------------------------|-------------------|-------------------------------|
| Filtrar catálogo           | < 50ms            | Rerender imediato + contador  |
| Favoritar                  | < 50ms            | Ícone muda + toast 3s         |
| Abrir modal                | < 100ms           | Overlay com animação slideUp  |
| Comparar IAs               | < 200ms           | Tabela renderizada             |
| Recomendar                 | < 100ms           | Cards de resultado             |

### 5.2 Animações e Transições

- **Hover em cards:** `transform: translateY(-3px)` + sombra — indica interatividade
- **Cards no catálogo:** `animation: fadeInUp` com delay escalonado — evita flash de conteúdo
- **Orbs do hero:** `animation: orbFloat` infinita — ambiência sem distração
- **Toasts:** `toastIn` / `toastOut` — feedback não-disruptivo
- **Contadores de stats:** `requestAnimationFrame` com easing cubic — chamativo e fluido

### 5.3 Estados de Botões

```css
/* Normal → Hover → Focus → Disabled */
.btn             { /* estado padrão */ }
.btn:hover       { opacity: .88; box-shadow: shadow-purple; }
.btn:focus-visible { outline: 2px solid purple; }
.btn:disabled    { opacity: .5; cursor: not-allowed; }
```

---

## 6. Modelos Mentais dos Usuários

### Usuário Iniciante (ex: estudante sem experiência com IA)
- **Caminho sugerido:** Hero → Recomendador → Catálogo (detalhes da recomendação)
- **Apoios:** Texto explicativo em cada seção; hints nos campos do formulário; modal com links para sites oficiais

### Usuário Experiente (ex: desenvolvedor)
- **Caminho sugerido:** Catálogo (filtra por Código/Multimodal) → Comparador → Link para API
- **Apoios:** Badge "API" visível nos cards; tabela de comparação técnica; features em fonte mono

### Tomador de Decisão (ex: gestor de empresa)
- **Caminho sugerido:** Funcionalidades → Planos → Comparador (custo-benefício)
- **Apoios:** Toggle mensal/anual com desconto; tabela de comparação com preços destacados
