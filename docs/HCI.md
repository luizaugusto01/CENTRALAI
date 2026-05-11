# Projeto Final — Interação Humano-Computador (IHC)

> **Disciplina:** Interação Humano-Computador · UFG · INF  
> **Data da entrega final (PF4):** 11/05/2026  
> Referências: Nielsen (1994) · ISO 9241 · WCAG 2.1 · SILVA, B; BARBOSA, S. (2010) · Gestalt (Wertheimer)

---

## Etapa 1 — PF1: Definição do Projeto

### 1.1 Título / Codinome

**CentralAI — Hub de Inteligências Artificiais**

---

### 1.2 Descrição

O **CentralAI** é uma plataforma web que centraliza, organiza e recomenda ferramentas de inteligência artificial. O objetivo é permitir que qualquer usuário — de estudantes a gestores — consiga descobrir, comparar e escolher a IA mais adequada para sua necessidade, sem precisar navegar por dezenas de sites diferentes.

A plataforma oferece: catálogo com 12 IAs categorizadas, comparador lado a lado, recomendador inteligente por formulário, sistema de favoritos persistente e exibição de planos de assinatura.

---

### 1.3 Pessoas-Chave

| Nome                  | Papel no Projeto              | GitHub                                                   |
|-----------------------|-------------------------------|----------------------------------------------------------|
| Brenner Sardinha      | Arquitetura e modelos de dados| [@brennerodrigues](https://github.com/brennerodrigues)   |
| Heitor Barbosa        | Serviços e padrões de projeto | [@heitor-barbosa](https://github.com/heitor-barbosa)     |
| Enzo Machado          | Infraestrutura e algoritmos   | [@EnzoMachad0](https://github.com/EnzoMachad0)           |
| Danilo Sucupira       | Interface e componentes       | [@danilo-sgalvao](https://github.com/danilo-sgalvao)     |
| Luiz Augusto Godinho  | Design, CSS e acessibilidade  | [@luizaugusto01](https://github.com/luizaugusto01)       |

---

### 1.4 Avaliação de Impacto / Análise de Mercado

#### Quem será afetado?

| Perfil                   | Impacto                                                                           |
|--------------------------|-----------------------------------------------------------------------------------|
| Estudantes e pesquisadores | Acesso centralizado a ferramentas de IA para uso acadêmico, sem custo inicial   |
| Profissionais de tecnologia | Comparação técnica rápida (API, linguagens suportadas, preço) em um só lugar   |
| Gestores e empresas       | Decisão de compra fundamentada em dados comparativos de custo-benefício          |
| Educadores                | Plataforma para ensinar e demonstrar diferentes capacidades de IA                |

#### Quais processos de negócio serão alterados?

1. **Pesquisa e seleção de ferramentas:** Hoje feita manualmente via Google, sites de review e vídeos no YouTube — o CentralAI centraliza em um único painel comparativo.
2. **Tomada de decisão de compra de software:** O recomendador e o comparador substituem longas planilhas de comparação que empresas criam manualmente.
3. **Onboarding de equipes em IA:** Gestores conseguem apresentar as ferramentas disponíveis para suas equipes sem precisar de pesquisa extensa.
4. **Treinamento e capacitação:** Instituições de ensino podem usar a plataforma como material didático para mostrar o ecossistema de IA.

#### Análise de Mercado

O mercado de ferramentas de IA cresce acima de 35% ao ano (Gartner, 2024). Existe uma lacuna clara: enquanto existem centenas de IAs disponíveis, não há um hub neutro e gratuito que consolide, compare e recomende essas ferramentas com foco no usuário final. Plataformas como G2, Capterra e Product Hunt não são especializadas em IA e não oferecem comparadores técnicos nem recomendadores personalizados.

---

### 1.5 Processo de Design Utilizado

Foi adotado o **Design Centrado no Usuário (DCU / User-Centered Design — UCD)**, conforme definido pela ISO 9241-210, que organiza o processo em 4 fases iterativas:

```
┌─────────────────────────────────────────────────────────┐
│              Ciclo do Design Centrado no Usuário         │
│                                                          │
│  1. Entender o     2. Especificar os    3. Criar        │
│     contexto   ──►   requisitos     ──►  soluções      │
│     de uso          do usuário          de design      │
│       ▲                                      │          │
│       └──────────── 4. Avaliar ◄─────────────┘          │
│                       o design                          │
└─────────────────────────────────────────────────────────┘
```

**Fase 1 — Entender o contexto:** Brainstorming com a equipe e questionário com potenciais usuários para mapear dores e necessidades.

**Fase 2 — Especificar requisitos:** Criação de personas, cenários de uso, diagrama de casos de uso e requisitos funcionais/não funcionais.

**Fase 3 — Criar soluções:** Protótipo de alta fidelidade em HTML/CSS/JS com todas as funcionalidades navegáveis.

**Fase 4 — Avaliar:** Avaliação heurística com base nas 10 heurísticas de Nielsen (ver PF3).

---

### 1.6 Requisitos de Usabilidade / Experiência do Usuário

#### 1.6.1 Técnica de Coleta de Dados: Brainstorming

**Técnica selecionada:** Brainstorming de necessidades e desejos dos usuários (Aula 6).

**Como foi aplicada:** A equipe realizou uma sessão de 60 minutos onde cada integrante anotou livremente os problemas que já enfrentou ao tentar escolher uma ferramenta de IA. Todas as ideias foram escritas em post-its digitais (Miro) sem julgamento inicial. Após a geração, as ideias foram agrupadas por afinidade temática.

**Resultados do Brainstorming:**

*Problemas identificados:*
- "Não sei qual IA usar para gerar imagens — tem muitas e não sei a diferença"
- "Para saber o preço real tenho que entrar em cada site separado"
- "Quero saber se tem API disponível antes de recomendar para o meu time"
- "Não consigo lembrar todas as IAs que já testei"
- "Cada IA tem pontos fortes diferentes — precisaria de uma tabela comparativa"
- "Não sei qual IA é melhor para minha tarefa específica"
- "Quero salvar as que mais uso sem precisar criar uma lista manualmente"

*Agrupamentos por tema:*

| Tema                   | Ideias relacionadas                                               |
|------------------------|-------------------------------------------------------------------|
| Descoberta             | Hub centralizado, catálogo com filtros, busca por nome/tipo      |
| Comparação             | Tabela lado a lado, prós e contras, rating                       |
| Decisão assistida      | Recomendador por tipo de tarefa, justificativa da recomendação   |
| Persistência pessoal   | Sistema de favoritos, histórico de IAs visitadas                 |
| Informação técnica     | Disponibilidade de API, preços, linguagens suportadas            |

*Funcionalidades priorizadas após brainstorming:*
1. Catálogo com busca e filtros por tipo (Texto, Imagem, Código, Áudio, Multimodal)
2. Modal de detalhes com prós, contras, preço e link para site oficial
3. Comparador de até 3 IAs em tabela
4. Recomendador com formulário (tipo de tarefa + orçamento + prioridade)
5. Favoritos com persistência (localStorage)

---

#### 1.6.2 Técnica de Coleta de Dados: Questionário

**Técnica selecionada:** Questionário online (Aula 6).

**Como foi aplicada:** Formulário com 8 questões enviado a 15 participantes (estudantes de graduação, profissionais de TI e gestores). Período de coleta: 1 semana.

**Questões e Resultados:**

**Q1. Com que frequência você utiliza ferramentas de IA?**

| Resposta        | %  |
|-----------------|----|
| Diariamente     | 47%|
| Semanalmente    | 33%|
| Raramente       | 20%|

**Q2. Qual é a principal dificuldade ao escolher uma ferramenta de IA?**

| Resposta                                      | %  |
|-----------------------------------------------|----|
| Não sei as diferenças entre as ferramentas    | 53%|
| Preço difícil de comparar                     | 27%|
| Muita informação dispersa na internet         | 20%|

**Q3. Você já usou alguma plataforma para comparar ferramentas de IA?**

| Resposta | %  |
|----------|----|
| Não      | 73%|
| Sim      | 27%|

**Q4. Quais funcionalidades você mais valorizaria em um hub de IA?**
*(múltipla escolha)*

| Funcionalidade               | %  |
|------------------------------|----|
| Comparação lado a lado       | 87%|
| Filtro por tipo de tarefa    | 80%|
| Recomendação personalizada   | 73%|
| Lista de favoritos           | 60%|
| Preços atualizados           | 67%|

**Q5. Qual dispositivo você mais usaria para acessar esse tipo de plataforma?**

| Resposta      | %  |
|---------------|----|
| Desktop/Laptop| 67%|
| Celular       | 27%|
| Tablet        | 6% |

**Q6. Qual tipo de IA você mais utiliza atualmente?**

| Tipo        | %  |
|-------------|----|
| Texto/Chat  | 60%|
| Imagem      | 20%|
| Código      | 13%|
| Áudio       | 7% |

**Q7. Qual nível de experiência técnica você tem com IA?**

| Resposta     | %  |
|--------------|----|
| Iniciante    | 33%|
| Intermediário| 47%|
| Avançado     | 20%|

**Q8. Você salvaria ferramentas favoritas se tivesse essa opção?**

| Resposta | %  |
|----------|----|
| Sim      | 87%|
| Não      | 13%|

**Conclusões do questionário:** A maioria dos usuários (73%) nunca usou uma plataforma específica para comparar IAs, confirmando a lacuna de mercado. A comparação lado a lado (87%) e o filtro por tipo (80%) foram as funcionalidades mais solicitadas, alinhadas diretamente com o que foi desenvolvido.

---

#### 1.6.3 Perfis de Usuário

Com base nos dados coletados, foram identificados três perfis principais:

**Perfil 1 — Estudante/Iniciante**
- Faixa etária: 18–25 anos
- Experiência com IA: Baixa a média
- Objetivo: Encontrar a IA certa para uma tarefa escolar ou pessoal
- Frustração: Excesso de opções sem orientação
- Dispositivo: Desktop ou celular

**Perfil 2 — Profissional de TI**
- Faixa etária: 25–40 anos
- Experiência com IA: Alta
- Objetivo: Avaliar qual IA integrar via API em um projeto técnico
- Frustração: Informações técnicas dispersas e difíceis de comparar
- Dispositivo: Desktop

**Perfil 3 — Gestor/Tomador de Decisão**
- Faixa etária: 30–50 anos
- Experiência com IA: Média
- Objetivo: Escolher a IA mais custo-eficiente para a equipe
- Frustração: Falta de comparação clara de preços e planos
- Dispositivo: Desktop ou tablet

---

#### 1.6.4 Personas

**Persona 1 — Ana Luíza, Estudante de Engenharia**

```
┌─────────────────────────────────────────────────────────────┐
│  Nome: Ana Luíza Costa          Idade: 21 anos              │
│  Ocupação: Estudante de Engenharia de Computação            │
│  Experiência com IA: Iniciante                              │
├─────────────────────────────────────────────────────────────┤
│  OBJETIVOS                                                  │
│  • Encontrar a melhor IA para ajudar nos trabalhos da facul.│
│  • Entender as diferenças entre ChatGPT, Gemini e Claude    │
│  • Não gastar dinheiro — prefere ferramentas gratuitas      │
├─────────────────────────────────────────────────────────────┤
│  DORES                                                      │
│  • Fica confusa com tantas opções disponíveis               │
│  • Não sabe se a IA que está usando é a mais adequada       │
│  • Já assinou um plano pago que não usou                    │
├─────────────────────────────────────────────────────────────┤
│  CENÁRIO DE USO                                             │
│  Ana precisa escrever um resumo de artigo científico.       │
│  Ela acessa o CentralAI, usa o recomendador informando      │
│  "Texto" como tipo de tarefa e "Gratuito" como orçamento.   │
│  Recebe 3 recomendações com justificativa e escolhe Claude. │
└─────────────────────────────────────────────────────────────┘
```

**Persona 2 — Rafael Matos, Desenvolvedor Backend**

```
┌─────────────────────────────────────────────────────────────┐
│  Nome: Rafael Matos             Idade: 29 anos              │
│  Ocupação: Desenvolvedor Backend Sênior                     │
│  Experiência com IA: Avançada                               │
├─────────────────────────────────────────────────────────────┤
│  OBJETIVOS                                                  │
│  • Integrar uma IA de código via API no pipeline de CI/CD   │
│  • Comparar Copilot, Cursor e outras ferramentas de código  │
│  • Verificar suporte a linguagens específicas (Go, Rust)    │
├─────────────────────────────────────────────────────────────┤
│  DORES                                                      │
│  • Perde horas verificando documentação técnica separada    │
│  • Preços mudam frequentemente e são difíceis de comparar   │
│  • Quer ver prós/contras sem ler reviews longos             │
├─────────────────────────────────────────────────────────────┤
│  CENÁRIO DE USO                                             │
│  Rafael filtra o catálogo por "Código", abre o modal de     │
│  detalhes do GitHub Copilot e do Cursor, os adiciona ao     │
│  comparador e analisa a tabela com API, preço e linguagens. │
└─────────────────────────────────────────────────────────────┘
```

**Persona 3 — Carla Figueiredo, Gerente de Produto**

```
┌─────────────────────────────────────────────────────────────┐
│  Nome: Carla Figueiredo         Idade: 38 anos              │
│  Ocupação: Gerente de Produto em startup de e-commerce      │
│  Experiência com IA: Intermediária                          │
├─────────────────────────────────────────────────────────────┤
│  OBJETIVOS                                                  │
│  • Escolher uma IA de texto para o time de conteúdo         │
│  • Entender a diferença de custo entre planos               │
│  • Apresentar opções para o CEO com dados concretos         │
├─────────────────────────────────────────────────────────────┤
│  DORES                                                      │
│  • Não tem tempo para pesquisar cada ferramenta             │
│  • Precisa de comparativos claros para justificar a compra  │
│  • Quer saber qual IA entrega o melhor custo-benefício      │
├─────────────────────────────────────────────────────────────┤
│  CENÁRIO DE USO                                             │
│  Carla acessa a seção de Planos, depois usa o comparador    │
│  com ChatGPT, Claude e Gemini. Vê a tabela comparativa,     │
│  destaca a opção mais barata com rating alto e envia o      │
│  print para o CEO na reunião.                               │
└─────────────────────────────────────────────────────────────┘
```

---

#### 1.6.5 Cenários de Uso

**Cenário 1 — Estudante buscando IA gratuita para estudos**

Ana Luíza está na biblioteca preparando um seminário. Precisa de uma IA para resumir textos acadêmicos, mas não quer pagar. Ela acessa o CentralAI pelo notebook, clica em "Recomendador", seleciona "Texto" como tipo de tarefa, "Gratuito" como orçamento e "Qualidade" como prioridade. Em segundos recebe 3 recomendações com justificativa de por que cada uma foi sugerida. Salva a favorita com um clique e vai usar a ferramenta.

**Cenário 2 — Desenvolvedor avaliando IA para integração via API**

Rafael está avaliando qual IA integrar ao pipeline de revisão de código da empresa. Acessa o CentralAI no desktop, filtra o catálogo por "Código" e vê 2 IAs disponíveis. Abre o modal de detalhes para verificar se têm API disponível. Adiciona ambas ao comparador para ver linguagens suportadas, preço e rating lado a lado. Toma a decisão e anota o link para a documentação oficial.

**Cenário 3 — Gestora comparando custo-benefício para apresentação**

Carla tem reunião com o CEO em 30 minutos. Precisa de dados concretos sobre IAs de texto. Acessa o CentralAI, vai direto ao comparador, seleciona ChatGPT, Claude e Gemini. A tabela mostra rating, preço, prós e contras lado a lado. Ela identifica a melhor relação custo-benefício, tira um print e apresenta na reunião com dados embasados.

---

#### 1.6.6 Diagrama de Casos de Uso

```
┌──────────────────────────────────────────────────────────────────┐
│                         <<sistema>>                               │
│                           CentralAI                               │
│                                                                   │
│  (Explorar Catálogo)  ────────────────────────────────► Usuário  │
│  (Filtrar por Tipo)   <<include>> (Explorar Catálogo)    │       │
│  (Buscar por Texto)   <<include>> (Explorar Catálogo)    │       │
│  (Ver Detalhes da IA) <<extend>>  (Explorar Catálogo)    │       │
│  (Favoritar IA)       <<extend>>  (Ver Detalhes da IA)   │       │
│  (Comparar IAs)       ────────────────────────────────►  │       │
│  (Receber Recomendação)───────────────────────────────►  │       │
│  (Escolher Plano)     ────────────────────────────────►  │       │
│                                                          │       │
│  (Gerenciar Catálogo) ─────────────────────────────► Administrador│
│                                                                   │
│  (Integrar via API)   ─────────────────────────────► Desenvolvedor│
└──────────────────────────────────────────────────────────────────┘

Relações entre casos de uso:
  (Filtrar por Tipo)   <<include>> (Explorar Catálogo)
  (Buscar por Texto)   <<include>> (Explorar Catálogo)
  (Ver Detalhes da IA) <<extend>>  (Explorar Catálogo)   [condição: clicou no card]
  (Favoritar IA)       <<extend>>  (Ver Detalhes da IA)  [condição: clicou em ♥]
  (Comparar IAs)       <<extend>>  (Explorar Catálogo)   [condição: selecionou 2+ IAs]
```

---

#### 1.6.7 Diagrama de Atividades — Fluxo do Recomendador

```
Início
  │
  ▼
[Usuário acessa a seção Recomendador]
  │
  ▼
[Preenche formulário: tipo de tarefa, orçamento, prioridade]
  │
  ▼
◇ Campo "Tipo de tarefa" preenchido?
  ├── Não ──► [Exibe mensagem de erro "Campo obrigatório"]
  │                │
  │                └──► [Usuário corrige] ──► (volta ao ◇)
  └── Sim ──► [Sistema seleciona estratégia de recomendação]
                │
                ▼
              [Filtra IAs por tipo de tarefa]
                │
                ▼
              [Aplica estratégia (qualidade / custo / equilíbrio)]
                │
                ▼
              [Ordena e seleciona as 3 melhores IAs]
                │
                ▼
              [Renderiza 3 cards de recomendação com justificativa]
                │
                ▼
              ◇ Usuário quer favoritar alguma?
              ├── Sim ──► [Clica em ♥] ──► [Salva no localStorage]
              │                                    │
              │                             [Toast de confirmação]
              │                                    │
              └── Não ──►──────────────────────────┘
                                                    │
                                                    ▼
                                                  Fim
```

---

## Etapa 2 — PF2: Criação do Protótipo

### 2.1 Ferramenta de Prototipagem

**Ferramenta utilizada:** HTML5 + CSS3 + JavaScript ES2022 (Vanilla)

**Justificativa:** Por ser um protótipo de alta fidelidade totalmente funcional, optou-se por implementá-lo diretamente no navegador sem frameworks ou build tools. Isso garante que o protótipo possa ser aberto com um duplo clique no `index.html` em qualquer navegador, facilitando os testes. A ferramenta escolhida permite interações reais (cliques, filtros, formulários) e não apenas simulações visuais.

**Como abrir o protótipo:**
```
Abrir o arquivo: centralai/index.html
Diretamente no Chrome, Firefox, Safari ou Edge — sem servidor necessário.
```

**O protótipo permite realização de testes:** Sim. Todas as funcionalidades são interativas — filtros, busca, modal de detalhes, comparador, recomendador e favoritos funcionam integralmente, permitindo testes de usabilidade com usuários reais.

---

### 2.2 Princípios da Gestalt Aplicados (Aula 2)

Os princípios da Gestalt foram utilizados para organizar visualmente a interface de modo que o usuário perceba grupos, hierarquias e relações sem esforço cognitivo.

#### Princípio da Proximidade
Elementos relacionados são posicionados próximos entre si. Os botões de ação de cada card de IA (Ver Detalhes, Comparar, Favoritar) ficam agrupados na parte inferior do card, sinalizando que pertencem àquela IA específica. Os filtros de tipo ficam agrupados acima do catálogo, indicando que controlam o conteúdo abaixo.

#### Princípio da Semelhança
Cards de IA com o mesmo tipo visual (badges coloridos) são percebidos como pertencentes ao mesmo grupo. Todos os botões primários têm o mesmo estilo (roxo com gradiente), enquanto botões secundários têm estilo consistentemente diferente, criando famílias visuais reconhecíveis.

#### Princípio da Continuidade
O layout em grid de 3 colunas guia o olho do usuário da esquerda para a direita e de cima para baixo, seguindo a leitura natural. A navbar fixa cria uma linha contínua no topo que ancora o usuário durante a rolagem.

#### Princípio do Fechamento
Os cards têm bordas e sombras que criam formas fechadas, fazendo o usuário perceber cada card como uma unidade completa. O modal de detalhes usa um overlay escuro que "fecha" a tela ao redor do conteúdo central, direcionando o foco.

#### Princípio da Figura-Fundo
O fundo escuro (`#07070d`) faz com que os cards, modais e formulários (em tons mais claros) se destaquem como "figura". Os gradientes roxo-azul nos CTAs criam contraste suficiente para que os elementos interativos saltem visualmente do fundo.

#### Princípio da Pregnância (Boa Forma)
Ícones simples e universais são usados para ações: ♥ para favoritar, ✓ para confirmar, ✗ para fechar. Formas simples e regulares (retângulos arredondados para cards e botões) reduzem a carga cognitiva.

#### Princípio do Destino Comum
Os filtros de tipo (Todas, Texto, Imagem, Código, Áudio, Multimodal) estão em linha horizontal, movendo-se juntos como grupo quando o usuário rola a página, reforçando que são controles do mesmo sistema.

---

### 2.3 Princípios e Diretrizes de SILVA e BARBOSA (2010) (Aula 3)

#### 1. Correspondência com as Expectativas dos Usuários
A interface segue convenções da web que os usuários já conhecem: navbar no topo com logo e menu, grid de cards para catálogos, formulários com labels acima dos campos, modais com overlay escuro. O vocabulário usado ("Catálogo", "Comparar", "Recomendação") é familiar ao domínio de compras de software, evitando jargões técnicos de IA.

**Onde aparece no protótipo:** Navbar com links nomeados, botões com labels claros, ícones semânticos universais.

#### 2. Simplicidade nas Estruturas das Tarefas
Cada tarefa principal foi reduzida ao mínimo de passos necessários. Para receber uma recomendação: 1 clique no menu → 1 seleção de tipo de tarefa → 1 clique em "Recomendar". Para comparar: selecionar IAs nos cards (inline) → rolar até o comparador → 1 clique em "Comparar".

**Onde aparece no protótipo:** Fluxo do recomendador (3 passos), botão "Comparar" direto no card sem precisar acessar outro menu.

#### 3. Equilíbrio entre Controle e Liberdade do Usuário
O usuário pode desfazer qualquer ação: desfavoritar uma IA clicando novamente no ♥, remover IAs do comparador clicando em "Limpar", fechar modais com ESC ou clicando fora deles. Nenhuma ação é irreversível ou destrutiva.

**Onde aparece no protótipo:** Botão ESC fecha modal, botão "Limpar" no comparador, toggle de favorito.

#### 4. Consistência e Padronização
Um Design System completo via CSS Custom Properties garante que cores, tipografia, bordas, sombras, espaçamentos e animações sigam um padrão único em toda a interface. Botões do mesmo tipo têm sempre o mesmo visual; badges de tipo usam cores consistentes em todos os contextos (card, modal, tabela de comparação).

**Onde aparece no protótipo:** Todas as seções usam os mesmos tokens de design (`--purple-600`, `--space-4`, `--radius-lg`).

#### 5. Promoção da Eficiência do Usuário
Busca em tempo real (sem precisar pressionar Enter), filtros que atualizam o catálogo imediatamente, atalho de teclado ESC para fechar modal, smooth scroll ao clicar em links da navbar. Usuários avançados conseguem completar tarefas mais rápido por não precisar aguardar recarregamentos.

**Onde aparece no protótipo:** Input de busca com `oninput`, filtros sem submit, ESC no modal.

#### 6. Antecipação das Necessidades do Usuário
Ao abrir o modal de detalhes de uma IA, já aparecem prós, contras, preço, disponibilidade de API e link para o site oficial — antecipando que o usuário vai querer essas informações para tomar uma decisão. O recomendador exibe uma justificativa para cada recomendação, poupando o usuário de investigar por que aquela IA foi sugerida.

**Onde aparece no protótipo:** Modal com informações completas, cards de recomendação com justificativa textual.

#### 7. Visibilidade e Reconhecimento
O estado atual sempre é visível: filtro ativo tem estilo `aria-pressed="true"`, IAs favoritadas têm o ícone ♥ preenchido, IAs adicionadas ao comparador têm o botão em estado "Adicionado". O contador de IAs visíveis no catálogo ("12 IAs encontradas") informa em tempo real o resultado dos filtros.

**Onde aparece no protótipo:** Badges de estado nos botões, contador de resultados no catálogo.

#### 8. Conteúdo Relevante e Expressão Adequada
Cada seção mostra apenas as informações necessárias para o contexto. Cards no catálogo mostram nome, tipo, rating e preço resumido — apenas o necessário para uma triagem inicial. O modal de detalhes adiciona prós, contras e API — informações para uma decisão mais aprofundada. Nenhuma informação redundante ou irrelevante é exibida.

**Onde aparece no protótipo:** Cards compactos vs. modal detalhado, informação progressiva.

#### 9. Projeto para Erros
O único campo obrigatório do recomendador (tipo de tarefa) tem validação antes de processar, com mensagem de erro específica e associada ao campo via `aria-describedby`. Não há ações irreversíveis. Favoritar acidentalmente pode ser desfeito. Comparador com IAs duplicadas mostra aviso. O botão "Limpar filtros" recupera o estado completo do catálogo se o usuário filtrou demais.

**Onde aparece no protótipo:** Validação do formulário de recomendação, botão "Limpar" no comparador e nos filtros.

---

### 2.4 Critérios de Usabilidade Aplicados — Heurísticas de Nielsen (Aula 1)

| # | Heurística                        | Como foi aplicada no CentralAI                                                    |
|---|-----------------------------------|-----------------------------------------------------------------------------------|
| 1 | Visibilidade do status do sistema | Toasts confirmam toda ação; contador de IAs atualiza ao filtrar; ♥ muda estado visualmente |
| 2 | Correspondência com o mundo real  | Termos familiares (catálogo, comparar, recomendação); ícones universais           |
| 3 | Controle e liberdade do usuário   | Favoritar pode ser desfeito; botão "Limpar" no comparador; ESC fecha modal        |
| 4 | Consistência e padrões            | Design System via CSS Custom Properties; mesmo padrão em todos os componentes     |
| 5 | Prevenção de erros                | Validação antes de recomendar; selects com opção vazia padrão                     |
| 6 | Reconhecimento em vez de recordação| Filtros visíveis permanentemente; badges de tipo em cada card                    |
| 7 | Flexibilidade e eficiência        | Busca em tempo real; ESC para fechar; smooth scroll; botão "Comparar" no card     |
| 8 | Design estético e minimalista     | Dark theme organizado; sem elementos decorativos sem função                       |
| 9 | Ajuda a reconhecer e recuperar erros | Mensagem de erro específica; botão "Limpar filtros"                            |
|10 | Ajuda e documentação              | Hints nos formulários; labels descritivos; seção de planos com recursos listados  |

---

### 2.5 Critérios de Acessibilidade Aplicados — WCAG 2.1 AA (Aula 1)

#### Perceptível
- **Alternativas de texto:** `aria-label` em todos os ícones e botões sem texto visível
- **Conteúdo adaptável:** HTML semântico (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`, `<ul>`)
- **Distinguível:** Contraste de cor ≥ 4.5:1 (texto sobre fundo escuro); cor nunca usada como única distinção

#### Operável
- **Teclado:** Toda funcionalidade acessível via Tab, Enter e Escape
- **Skip Link:** `<a class="skip-link" href="#main">` visível ao focar — pula navbar para leitores de tela
- **Tempo suficiente:** Toasts duram 3s sem ação obrigatória do usuário
- **Sem efeitos de flash:** Nenhuma animação pisca mais de 3 vezes por segundo

#### Compreensível
- **Previsível:** Cada clique tem comportamento consistente e esperado
- **Assistência de entrada:** `aria-required="true"`, mensagem de erro vinculada via `aria-describedby`
- **Idioma da página:** `<html lang="pt-BR">` declarado

#### Robusto
- **Compatibilidade:** HTML válido; ARIA correto; testado em Chrome, Firefox e Safari
- **Live regions:** `role="status" aria-live="polite"` para toasts e resultados dinâmicos

**Elementos implementados no código:**
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

## Etapa 3 — PF3: Autoavaliação do Protótipo

### 3.1 Método de Avaliação Utilizado

**Método:** Avaliação Heurística (Aula 11)

A avaliação heurística é um método de inspeção onde avaliadores especialistas verificam a interface com base em um conjunto de heurísticas de usabilidade reconhecidas. Neste trabalho, foram utilizadas as **10 Heurísticas de Nielsen** como critério de avaliação.

**Avaliadores:** 3 membros da equipe (Luiz Augusto, Danilo e Heitor) avaliaram o protótipo de forma independente.

**Escala de severidade de problemas (Nielsen):**
- **0** — Não é um problema de usabilidade
- **1** — Problema cosmético (baixíssima prioridade)
- **2** — Problema menor (baixa prioridade)
- **3** — Problema maior (alta prioridade — deve ser corrigido)
- **4** — Catástrofe de usabilidade (imperativo corrigir antes de lançar)

---

### 3.2 Atividades Realizadas

1. **Preparação (30 min):** Cada avaliador leu as 10 heurísticas de Nielsen e recebeu uma planilha de registro de problemas.
2. **Inspeção individual (60 min cada):** Cada avaliador navegou pelo protótipo de forma independente, seguindo os fluxos principais: explorar catálogo, comparar IAs, receber recomendação e favoritar.
3. **Consolidação (45 min):** Os três avaliadores reuniram seus registros e eliminaram duplicatas, discutindo divergências de severidade.
4. **Priorização e correção (60 min):** Os problemas com severidade ≥ 3 foram corrigidos imediatamente no protótipo.

---

### 3.3 Resultados da Avaliação Heurística

#### Problemas Identificados e Ações Tomadas

| # | Heurística Violada | Problema Encontrado | Severidade | Ação |
|---|-------------------|---------------------|:---:|------|
| 1 | H5 — Prevenção de erros | O comparador permitia adicionar a mesma IA duas vezes, gerando coluna duplicada | 3 | **Corrigido:** lógica de verificação de duplicata adicionada |
| 2 | H1 — Visibilidade do status | Ao limpar os favoritos, não havia feedback visual imediato no ícone do card | 2 | **Corrigido:** lógica de re-renderização do ícone atualizada |
| 3 | H3 — Controle e liberdade | Não havia forma de remover uma IA específica do comparador sem limpar tudo | 3 | **Corrigido:** botão de remoção individual adicionado ao comparador |
| 4 | H7 — Flexibilidade | Usuário avançado precisava rolar até o topo para acessar o menu — sem atalho de teclado para seções | 2 | **Aceito:** escopo limitado; seria implementado em versão futura |
| 5 | H9 — Recuperação de erros | Mensagem de erro do recomendador desaparecia ao corrigir o campo sem resubmeter | 1 | **Corrigido:** lógica de limpeza de erro vinculada ao evento `onchange` |
| 6 | H10 — Ajuda e documentação | O comparador não exibia mensagem orientando o usuário a selecionar pelo menos 2 IAs antes de usar | 2 | **Corrigido:** mensagem de instrução adicionada acima do comparador |
| 7 | H8 — Design minimalista | Cards de recomendação exibiam informações em excesso (rating, preço, prós, contras), sobrecarregando visualmente | 2 | **Parcialmente corrigido:** prós e contras ocultados por padrão, exibidos ao expandir |
| 8 | H4 — Consistência | Botão "Comparar" em alguns cards estava com texto "Adicionar ao Comparador" — inconsistência de label | 1 | **Corrigido:** padronizado para "Comparar" em todos os cards |

#### Resumo dos Resultados

| Severidade | Quantidade | Status |
|:---:|:---:|---|
| 4 (Catástrofe) | 0 | — |
| 3 (Maior) | 2 | ✅ Ambos corrigidos |
| 2 (Menor) | 4 | ✅ 3 corrigidos / 1 aceito |
| 1 (Cosmético) | 2 | ✅ Ambos corrigidos |

**Total de problemas encontrados:** 8  
**Total de problemas corrigidos:** 7 (87,5%)  
**Problema aceito sem correção:** 1 (H7 — atalho de teclado para seções — escopo futuro)

#### Conclusões da Autoavaliação

A avaliação heurística revelou que o protótipo atende bem às heurísticas de Nielsen, com zero problemas de catástrofe. Os 2 problemas de severidade 3 foram detectados e corrigidos antes da entrega. A heurística mais violada foi a de **Controle e Liberdade (H3)**, indicando que fluxos de desfazer e remover precisaram de atenção especial. No geral, a interface demonstrou boa usabilidade, especialmente nas heurísticas de **Consistência (H4)**, **Reconhecimento (H6)** e **Design Minimalista (H8)**, onde nenhum problema relevante foi encontrado.

---

## Etapa 4 — PF4: Entrega Final

### 4.1 Composição da Entrega

Conforme os requisitos da disciplina, a entrega final (PF4) é composta por:

1. **Documento PDF único** contendo todas as etapas (PF1 + PF2 + PF3) com prints das telas do protótipo — exportado a partir deste documento.

2. **Vídeo de apresentação** (máximo 20 minutos) com participação de todos os integrantes explicando sua contribuição individual no projeto.

3. **Repositório no GitHub** com o código-fonte completo e toda a documentação.

### 4.2 Prints das Telas do Protótipo

*(Inseridos no documento PDF final — capturas de tela das seções: Hero, Catálogo, Modal de Detalhes, Comparador, Recomendador e Planos)*

### 4.3 Distribuição de Responsabilidades para a Apresentação

| Integrante            | Parte da apresentação                                      |
|-----------------------|------------------------------------------------------------|
| Brenner Sardinha      | PF1 — Objetivo, impacto e processo de design               |
| Heitor Barbosa        | PF1 — Coleta de dados, personas e cenários                 |
| Enzo Machado          | PF2 — Protótipo: diagrama de casos de uso e atividades     |
| Danilo Sucupira       | PF2 — Princípios Gestalt e SILVA/BARBOSA aplicados         |
| Luiz Augusto Godinho  | PF3 — Autoavaliação heurística e resultados                |

---

*CentralAI © 2026 · UFG · Instituto de Informática · Interação Humano-Computador*
