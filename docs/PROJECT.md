# Gerência de Projeto — CentralAI

> Disciplina: Padrões de Projeto de Software · UFG · INF  
> Referências: PMBOK 7ª Ed. · Scrum Guide 2020 · ISO/IEC 25010 · MoSCoW Method

---

## 1. Termo de Abertura do Projeto (TAP)

| Campo                | Descrição                                                                 |
|----------------------|---------------------------------------------------------------------------|
| **Nome do projeto**  | CentralAI — Hub de Inteligências Artificiais                              |
| **Patrocinador**     | UFG — Instituto de Informática (INF)                                      |
| **Gerente**          | Equipe de desenvolvimento (Brenner, Heitor, Enzo, Danilo, Luiz Augusto)  |
| **Data de início**   | Março 2025                                                                |
| **Data de entrega**  | Julho 2025                                                                |
| **Objetivo**         | Desenvolver uma plataforma web que centralize, compare e recomende IAs   |
| **Justificativa**    | Usuários perdem tempo alternando entre múltiplos sites de IA              |
| **Restrições**       | Sem backend, sem build tool, sem banco de dados externo                   |
| **Premissas**        | Navegadores modernos (Chrome, Firefox, Safari, Edge — últimas 2 versões) |
| **Orçamento**        | R$ 0 (projeto acadêmico — recursos = tempo da equipe)                    |

---

## 2. Stakeholders

### 2.1 Identificação

| ID  | Stakeholder            | Papel                              | Tipo     |
|-----|------------------------|------------------------------------|----------|
| S01 | Usuário individual     | Usa a plataforma para pesquisar IA | Externo  |
| S02 | Empresa / equipe       | Centraliza uso e controla custos   | Externo  |
| S03 | Instituição de ensino  | Usa IAs como ferramenta pedagógica | Externo  |
| S04 | Desenvolvedor          | Integra IAs via API                | Externo  |
| S05 | Equipe de desenvolvimento | Desenvolve e mantém a plataforma | Interno  |
| S06 | Professor orientador   | Avalia e valida as entregas        | Interno  |
| S07 | Administrador da plataforma | Gerencia catálogo e usuários  | Interno  |

### 2.2 Matriz de Stakeholders (Poder × Interesse)

```
         Baixo Interesse       Alto Interesse
              │                      │
Alto   ┌──────┴──────────────────────┴──────┐
Poder  │  MANTER SATISFEITO      GERENCIAR  │
       │  • Administrador        • Professor│
       │                         • Equipe   │
       ├─────────────────────────────────────┤
Baixo  │  MONITORAR          MANTER INFORMADO│
Poder  │  (ninguém aqui)     • Usuário indiv.│
       │                     • Empresa       │
       │                     • Desenvolvedor │
       └─────────────────────────────────────┘
```

---

## 3. Escopo do Projeto

### 3.1 Dentro do escopo (In Scope)

- Catálogo de 12+ IAs com busca, filtros e detalhes
- Comparador lado a lado de até 3 IAs
- Recomendador baseado em formulário inteligente
- Sistema de favoritos com persistência (localStorage)
- Assistente de chat com respostas por palavras-chave
- Exibição de planos (Free, Pro, Enterprise) com toggle mensal/anual
- Documentação técnica completa (Arquitetura, Padrões, Requisitos, IHC, UML, Gerência)
- Acessibilidade WCAG 2.1 AA
- Design responsivo (mobile, tablet, desktop)

### 3.2 Fora do escopo (Out of Scope) — versão atual

- Autenticação de usuários (login/cadastro)
- Integração real com APIs de IA (chat usa mock)
- Backend / banco de dados persistente
- Pagamento e assinatura de planos
- Relatórios e dashboards de uso
- Notificações push

---

## 4. EAP — Estrutura Analítica do Projeto

```
CentralAI
│
├── 1. Gerência do Projeto
│   ├── 1.1 Termo de Abertura
│   ├── 1.2 Planejamento de sprints
│   ├── 1.3 Registro de riscos
│   └── 1.4 Encerramento e lições aprendidas
│
├── 2. Documentação
│   ├── 2.1 Levantamento de requisitos (RF + RNF)
│   ├── 2.2 User Stories e Casos de Uso
│   ├── 2.3 Arquitetura de software
│   ├── 2.4 Design Patterns (GoF)
│   ├── 2.5 Modelagem UML
│   ├── 2.6 IHC (Nielsen + WCAG)
│   └── 2.7 Gerência de Projeto (este documento)
│
├── 3. Design System
│   ├── 3.1 Design Tokens (cores, tipografia, espaçamento)
│   ├── 3.2 Componentes base (botões, badges, cards)
│   └── 3.3 Animações e responsividade
│
├── 4. Domínio (models.js)
│   ├── 4.1 Classe abstrata AITool
│   ├── 4.2 Subclasses concretas (Text, Image, Code, Audio, Multimodal)
│   └── 4.3 AIFactory + AI_DATABASE (12 IAs)
│
├── 5. Serviços (services.js)
│   ├── 5.1 EventEmitter (Observer)
│   ├── 5.2 StorageService (Singleton)
│   └── 5.3 RecommendationEngine (Strategy)
│
├── 6. Infraestrutura (core.js)
│   ├── 6.1 Estruturas de dados (Stack, Queue, LinkedList)
│   ├── 6.2 Algoritmos (BinarySearch, MergeSort)
│   ├── 6.3 SearchIndex (índice invertido)
│   └── 6.4 Iteradores, Generators, Symbol, WeakMap, Proxy
│
├── 7. Extensões (extensions.js)
│   ├── 7.1 Command + CommandHistory
│   ├── 7.2 Decorator (badges em IAs)
│   ├── 7.3 Adapter (OpenAI, Anthropic, Google)
│   ├── 7.4 Chain of Responsibility (filtros)
│   └── 7.5 Sistema de Plugins (BasePlugin, PluginManager)
│
├── 8. Interface (components.js + index.html)
│   ├── 8.1 Catálogo (busca, filtros, cards)
│   ├── 8.2 Comparador (tabela lado a lado)
│   ├── 8.3 Recomendador (formulário + resultados)
│   ├── 8.4 Chat Assistente (ChatPlugin)
│   ├── 8.5 Planos (toggle mensal/anual)
│   └── 8.6 Toast, Modal, StatsCounter
│
└── 9. Testes e Entrega
    ├── 9.1 Testes manuais em múltiplos navegadores
    ├── 9.2 Validação de acessibilidade
    └── 9.3 Revisão final e entrega
```

---

## 5. Cronograma — Sprints (Scrum)

| Sprint | Período        | Objetivo                                | Entregas                                               | Status      |
|--------|----------------|-----------------------------------------|--------------------------------------------------------|-------------|
| 0      | Sem 1, Mar/25  | Kick-off e planejamento                 | TAP, EAP, backlog inicial, setup do repositório        | ✅ Concluída |
| 1      | Sem 2, Mar/25  | Domínio e dados                         | models.js: AITool, subclasses, AIFactory, 12 IAs       | ✅ Concluída |
| 2      | Sem 3, Mar/25  | Serviços e padrões base                 | services.js: Observer, Singleton, Strategy             | ✅ Concluída |
| 3      | Sem 1-2, Abr/25| Interface principal                     | index.html + style.css: hero, catálogo, filtros        | ✅ Concluída |
| 4      | Sem 3, Abr/25  | Comparador + Recomendador               | components.js: comparação, formulário, toasts          | ✅ Concluída |
| 5      | Sem 1, Mai/25  | Design premium + acessibilidade         | CSS v2: glassmorphism, animações, WCAG 2.1 AA          | ✅ Concluída |
| 6      | Sem 2, Mai/25  | Infraestrutura (P1-P4)                  | core.js: estruturas de dados, algoritmos, JS avançado  | ✅ Concluída |
| 7      | Sem 3, Mai/25  | Padrões avançados + plugins             | extensions.js: Command, Decorator, Adapter, Chain, Plugin | ✅ Concluída |
| 8      | Sem 1, Jun/25  | Chat assistente + UML                   | ChatPlugin ativo, docs/MODELING.md, docs/PROJECT.md    | ✅ Concluída |
| 9      | Sem 2, Jun/25  | Revisão final + testes                  | Testes navegadores, validação acessibilidade           | 🔜 Pendente  |
| 10     | Jul/25         | Entrega final                           | Apresentação, defesa, lições aprendidas                | 🔜 Pendente  |

**Duração total estimada:** ~16 semanas  
**Velocidade média da equipe:** 2–3 entregas por sprint

---

## 6. Backlog do Produto — Priorização MoSCoW

> **M**ust Have · **S**hould Have · **C**ould Have · **W**on't Have (nesta versão)

### Must Have — Essencial para entrega

| ID   | Item                                         | Story Points | Sprint |
|------|----------------------------------------------|:---:|:---:|
| B01  | Catálogo de IAs com filtros por tipo         | 5  | 3  |
| B02  | Busca textual em tempo real                  | 3  | 3  |
| B03  | Modal de detalhes de cada IA                 | 3  | 3  |
| B04  | Comparador lado a lado (até 3 IAs)           | 5  | 4  |
| B05  | Recomendador com formulário validado         | 5  | 4  |
| B06  | Persistência de favoritos (localStorage)     | 2  | 4  |
| B07  | Design responsivo (mobile + tablet + desktop)| 3  | 5  |
| B08  | Acessibilidade WCAG 2.1 AA                   | 3  | 5  |
| B09  | Documentação técnica completa                | 5  | 8  |
| B10  | Padrões GoF implementados e documentados     | 8  | 1–7|

### Should Have — Importante, mas não bloqueia

| ID   | Item                                         | Story Points | Sprint |
|------|----------------------------------------------|:---:|:---:|
| B11  | Sistema de plugins extensível                | 5  | 7  |
| B12  | Chat assistente com respostas mock           | 5  | 8  |
| B13  | Toggle de plano mensal/anual                 | 2  | 4  |
| B14  | Animações e micro-interações premium         | 3  | 5  |
| B15  | Toasts de feedback para toda ação            | 2  | 4  |
| B16  | Estruturas de dados educacionais (core.js)   | 5  | 6  |

### Could Have — Agrega valor se houver tempo

| ID   | Item                                         | Story Points |
|------|----------------------------------------------|:---:|
| B17  | ThemePlugin — alternância de temas           | 3  |
| B18  | Undo/redo no comparador (CommandHistory)     | 3  |
| B19  | Chips de sugestão no chat                    | 1  |
| B20  | Índice de busca invertido (SearchIndex)      | 3  |
| B21  | Adapter para APIs reais (OpenAI/Anthropic)   | 5  |

### Won't Have — Fora do escopo desta versão

| ID   | Item                                         | Motivo                              |
|------|----------------------------------------------|-------------------------------------|
| B22  | Autenticação de usuários                     | Requer backend                      |
| B23  | Integração real com APIs de IA               | Requer chaves de API e servidor     |
| B24  | Banco de dados persistente                   | Sem backend nesta versão            |
| B25  | Pagamento e assinatura                       | Fora do escopo acadêmico            |
| B26  | Notificações push                            | Requer service worker + backend     |

**Total de story points entregues:** ~65 pontos  
**Velocidade média por sprint:** ~8 pontos

---

## 7. Registro de Riscos

| ID  | Risco                                        | Probabilidade | Impacto  | Exposição | Estratégia       | Plano de Resposta                                      |
|-----|----------------------------------------------|:---:|:---:|:---:|:---:|--------------------------------------------------------|
| R01 | localStorage indisponível no navegador       | Baixa   | Alto   | Média  | Mitigar   | `StorageService` detecta e usa fallback em memória     |
| R02 | Incompatibilidade com navegadores antigos    | Média   | Alto   | Alta   | Mitigar   | Restringir escopo às últimas 2 versões; documentar     |
| R03 | Membro da equipe indisponível                | Média   | Alto   | Alta   | Contingência | Redistribuir tarefas; backlog priorizado (MoSCoW)  |
| R04 | Escopo crescente (scope creep) sem controle  | Alta    | Médio  | Alta   | Mitigar   | MoSCoW rigoroso; Won't Have claramente definido        |
| R05 | CSS quebrando em mobile específico           | Média   | Médio  | Média  | Aceitar   | Testes em múltiplos dispositivos na Sprint 9           |
| R06 | Conflito de merge no repositório             | Alta    | Baixo  | Média  | Mitigar   | Uma branch por feature; PRs com revisão antes do merge |
| R07 | Plágio de código sem entendimento            | Baixa   | Alto   | Média  | Prevenir  | Cada membro documenta e apresenta seu módulo           |
| R08 | Entrega fora do prazo                        | Média   | Alto   | Alta   | Mitigar   | Buffer de 1 semana antes da deadline; sprints curtas   |
| R09 | Dependência de CDN externo (Google Fonts)    | Baixa   | Baixo  | Baixa  | Aceitar   | Fallback de fonte no CSS: `font-family: Inter, sans-serif` |
| R10 | Mudança de requisitos pela banca avaliadora  | Baixa   | Médio  | Baixa  | Contingência | Arquitetura extensível (plugins, Strategy, Factory) |

**Legenda de Exposição:** Baixa = Prob × Imp ≤ 2 · Média = 3–4 · Alta = ≥ 6

---

## 8. Métricas de Qualidade

### 8.1 Critérios de aceite do projeto

| Métrica                            | Meta           | Como medir                                  |
|------------------------------------|----------------|---------------------------------------------|
| Cobertura de requisitos            | 100% dos RF    | Rastrear RF-01 a RF-09 no REQUIREMENTS.md   |
| Padrões GoF implementados          | ≥ 6 padrões    | Verificar na tabela do DESIGN_PATTERNS.md   |
| Conformidade WCAG 2.1 AA           | 0 violações AA | axe DevTools ou WAVE no navegador           |
| Compatibilidade de navegadores     | 4 navegadores  | Testar Chrome, Firefox, Safari, Edge        |
| Tempo de carregamento              | < 3 segundos   | Lighthouse Performance Score ≥ 80           |
| Tempo de resposta do catálogo      | < 100ms        | performance.now() nos eventos de filtro     |
| Conceitos JS aplicados             | Até instanceof | Verificar checklist no README.md            |
| Documentação entregue              | 6 docs         | ARCHITECTURE, PATTERNS, REQUIREMENTS, HCI, MODELING, PROJECT |

### 8.2 Definição de Pronto (Definition of Done)

Uma funcionalidade é considerada **pronta** quando:

- [ ] Implementada conforme o requisito funcional correspondente
- [ ] Testada manualmente em Chrome e Firefox
- [ ] Acessível via teclado (Tab, Enter, Escape)
- [ ] Com atributos ARIA corretos quando necessário
- [ ] Responsiva em 320px, 768px e 1024px
- [ ] Sem erros no console do navegador
- [ ] Padrão de projeto utilizado documentado no código (comentários)
- [ ] Integrada ao namespace `window.CentralAI`

---

## 9. Plano de Comunicação

| Comunicação              | Frequência     | Participantes              | Canal           |
|--------------------------|----------------|----------------------------|-----------------|
| Reunião de sprint        | A cada sprint  | Equipe completa            | Presencial / Meet |
| Daily standup (informal) | 3× por semana  | Equipe completa            | WhatsApp        |
| Revisão com orientador   | Quinzenal      | Equipe + Professor         | Presencial      |
| Pull Request Review      | Por entrega    | Autor + 1 revisor mínimo   | GitHub          |
| Atualização do backlog   | Por sprint     | Gerente do projeto         | Documento       |
| Demo da sprint           | Final de sprint| Equipe completa            | Presencial      |

---

## 10. Lições Aprendidas (em andamento)

| # | Lição                                                                 | Impacto  |
|---|-----------------------------------------------------------------------|----------|
| 1 | Definir Design Tokens no início evita retrabalho de estilo            | Alto     |
| 2 | Usar namespace global (`window.CentralAI`) eliminou conflitos de módulo | Alto   |
| 3 | Event delegation reduz drasticamente o número de listeners no DOM     | Médio    |
| 4 | Documentar padrões conforme são implementados, não depois             | Alto     |
| 5 | MoSCoW evitou scope creep — Won't Have bem definido desde o início    | Alto     |
| 6 | Arquitetura em camadas facilita testar cada módulo isoladamente       | Médio    |
| 7 | Plugin system desde o início permite evoluir sem quebrar o existente  | Alto     |

---

## 11. Encerramento do Projeto

### Critérios de encerramento

- [ ] Todos os itens Must Have do backlog entregues e testados
- [ ] Documentação completa revisada pela equipe
- [ ] Apresentação preparada com demonstração ao vivo
- [ ] Código no repositório com histórico de commits legível
- [ ] Lições aprendidas registradas neste documento

### Próximas versões (roadmap)

| Versão | Funcionalidade                              | Dependência             |
|--------|---------------------------------------------|-------------------------|
| 1.1    | Login/cadastro de usuários                  | Backend (Node.js/Supabase) |
| 1.2    | Chat com API real (OpenAI ou Anthropic)     | Chave de API + servidor |
| 1.3    | Histórico de uso e relatórios               | Banco de dados          |
| 2.0    | Execução de prompts direto na plataforma    | Backend + autenticação  |

---

*CentralAI © 2025 · UFG · Instituto de Informática · Padrões de Projeto de Software*
