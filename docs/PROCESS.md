        # Processos de Software — CentralAI

> Disciplina: Processos de Software · UFG · INF  
> Referências: Sommerville (2019) · Pressman (2016) · Scrum Guide 2020 · RUP (Rational)

---

## 1. O que é um Processo de Software?

Um **processo de software** é um conjunto estruturado de atividades necessárias para desenvolver um sistema. Ele define:

- **O que** fazer (atividades e tarefas)
- **Quem** faz (papéis e responsabilidades)
- **Quando** fazer (ordem e dependências)
- **Como** fazer (práticas, ferramentas e técnicas)

Todo projeto de software usa algum processo — explícito ou não. Escolher o processo certo para o contexto do projeto é uma decisão de engenharia.

---

## 2. Modelos de Processo

### 2.1 Modelo Cascata (Waterfall)

Processo **sequencial e linear**: cada fase só começa quando a anterior termina.

```
Requisitos → Projeto → Implementação → Testes → Manutenção
    ↓             ↓            ↓           ↓          ↓
 (concluído)  (concluído)  (concluído) (concluído) (produção)
```

**Características:**
- Documentação extensa antes do código
- Mudanças de requisitos são caras (exigem revisão de todas as fases)
- Adequado para projetos com requisitos **estáveis e bem definidos**

**Aplicado no CentralAI?** Parcialmente: os requisitos foram definidos antes da implementação (docs/REQUIREMENTS.md), mas houve iterações.

---

### 2.2 RUP — Rational Unified Process

Processo **iterativo e incremental** com 4 fases e 9 disciplinas.

```
Fases:      Iniciação → Elaboração → Construção → Transição
            │           │             │             │
Iterações:  1           2–3           4–6           7

Disciplinas (aplicadas em todas as fases, com intensidade variável):
  · Modelagem de Negócio    · Requisitos      · Análise e Projeto
  · Implementação           · Teste           · Implantação
  · Gerência de Configuração · Gerência do Projeto · Ambiente
```

**Características:**
- Orientado a casos de uso (Use Case driven)
- Centrado na arquitetura
- Usa UML extensivamente
- Pesado para equipes pequenas

**Aplicado no CentralAI?** A documentação UML (docs/MODELING.md) e os casos de uso (docs/REQUIREMENTS.md) seguem a abordagem RUP.

---

### 2.3 Scrum (Ágil)

Framework **iterativo e incremental** com ciclos curtos (sprints) e auto-organização.

#### Papéis (Roles)

| Papel             | Responsabilidade                                                    |
|-------------------|---------------------------------------------------------------------|
| **Product Owner** | Define e prioriza o backlog; representa o cliente                   |
| **Scrum Master**  | Remove impedimentos; garante que o time siga o Scrum               |
| **Dev Team**      | Desenvolve o incremento; auto-organizado e multifuncional (3–9 membros) |

*No CentralAI: a equipe de 5 membros atua como Dev Team; o professor como Product Owner.*

#### Artefatos

| Artefato              | Descrição                                                          |
|-----------------------|--------------------------------------------------------------------|
| **Product Backlog**   | Lista priorizada de todas as funcionalidades desejadas             |
| **Sprint Backlog**    | Itens selecionados para a sprint atual + plano de entrega          |
| **Incremento**        | Versão funcional e potencialmente entregável do produto            |

#### Cerimônias (Eventos)

| Cerimônia              | Duração        | Objetivo                                              |
|------------------------|----------------|-------------------------------------------------------|
| **Sprint Planning**    | ≤ 8h (sprint 4 sem.) | Selecionar itens do backlog e planejar a sprint  |
| **Daily Scrum**        | 15 min/dia     | Sincronizar o time: o que fiz, o que farei, impedimentos |
| **Sprint Review**      | ≤ 4h           | Apresentar o incremento ao Product Owner              |
| **Sprint Retrospective**| ≤ 3h          | Inspecionar o processo e melhorar na próxima sprint   |

#### Fluxo do Scrum no CentralAI

```
Product Backlog (priorizado)
        │
        ▼ Sprint Planning
Sprint Backlog (itens da sprint)
        │
        ▼ Desenvolvimento (1–2 semanas)
        ┌───────────────────────────────┐
        │  Daily Scrum (15 min/dia)     │
        │  ·O que fiz ontem?            │
        │  ·O que farei hoje?           │
        │  ·Algum impedimento?          │
        └───────────────────────────────┘
        │
        ▼ Sprint Review
Incremento Funcional
        │
        ▼ Sprint Retrospective
Melhoria do Processo
        │
        └──► Próxima Sprint
```

**Aplicado no CentralAI:** As 10 sprints em docs/PROJECT.md seguem o Scrum. Backlog priorizado com MoSCoW.

---

### 2.4 XP — Extreme Programming

Metodologia ágil focada em **qualidade técnica** e **feedback rápido**.

Práticas principais aplicadas ou mencionadas no projeto:

| Prática XP                 | Aplicação no CentralAI                                    |
|----------------------------|-----------------------------------------------------------|
| **Integração contínua**    | Commits frequentes, sem branches de longa duração         |
| **Refatoração**            | CSS reorganizado em Design System; classes reutilizáveis  |
| **Código simples**         | Sem over-engineering; padrões só onde agregam valor       |
| **Testes de aceitação**    | Critérios de aceite nas User Stories (REQUIREMENTS.md)    |
| **Releases pequenas**      | Incrementos funcionais a cada sprint                      |
| **Padrão de código**       | Namespace window.CentralAI; nomes descritivos; sem var    |

---

### 2.5 Kanban

Método de **fluxo contínuo** com quadro visual de tarefas.

```
┌─────────────┬──────────────┬─────────────┬────────────┐
│   Backlog   │  Em Progresso│   Revisão   │   Pronto   │
│─────────────│──────────────│─────────────│────────────│
│ RF-10 Auth  │ RF-08 Chat   │ DATABASE.md │ models.js  │
│ RF-11 API   │ GCS.md       │             │ services.js│
│ RF-12 Hist. │              │             │ components │
│             │  (WIP: 2)    │             │            │
└─────────────┴──────────────┴─────────────┴────────────┘
             ← Limite WIP: 3 itens simultâneos →
```

**WIP (Work In Progress) limit:** Kanban limita itens em progresso para reduzir multitarefa e aumentar foco — princípio aplicado no desenvolvimento do CentralAI (máx. 2–3 features paralelas).

---

## 3. Comparação dos Processos

| Critério              | Cascata   | RUP       | Scrum     | XP        | Kanban    |
|-----------------------|:---------:|:---------:|:---------:|:---------:|:---------:|
| Tipo                  | Sequencial| Iterativo | Iterativo | Iterativo | Contínuo  |
| Documentação          | Pesada    | Moderada  | Leve      | Mínima    | Mínima    |
| Mudanças de requisito | Difícil   | Moderado  | Fácil     | Fácil     | Fácil     |
| Equipe ideal          | Grande    | Média     | Pequena   | Pequena   | Qualquer  |
| Feedback do cliente   | Final     | Por fase  | Por sprint| Contínuo  | Contínuo  |
| Foco                  | Processo  | Arquitet. | Entrega   | Código    | Fluxo     |
| Aplicável ao CentralAI| Parcial  | ✓ (docs)  | ✓ (sprints)| ✓ (práticas)| ✓ (board)|

---

## 4. Processo Adotado no CentralAI

**Scrum adaptado** com elementos de XP e Kanban:

- **Scrum**: sprints de 1–2 semanas, backlog MoSCoW, Definition of Done
- **XP**: código limpo, refatoração contínua, padrões consistentes
- **Kanban**: limite de WIP, fluxo visual das tarefas
- **RUP**: documentação UML completa, casos de uso formais

### Justificativa da escolha

O Scrum foi escolhido porque:

1. Equipe pequena (5 membros) — ideal para times ágeis
2. Requisitos evoluíram durante o desenvolvimento (novas disciplinas, novos padrões)
3. Entregas incrementais permitiram validação com o professor por sprint
4. A flexibilidade ágil permitiu adicionar chat, plugins e BD sem reestruturar tudo

---

## 5. Atividades do Processo × Artefatos Entregues

| Atividade              | Entrada                  | Saída                         | Técnica Usada        |
|------------------------|--------------------------|-------------------------------|----------------------|
| Elicitação de requisitos| Briefing do projeto      | docs/REQUIREMENTS.md          | User Stories, UC     |
| Análise e modelagem    | Requisitos               | docs/MODELING.md              | UML 2.5              |
| Projeto arquitetural   | Modelo de análise        | docs/ARCHITECTURE.md          | Camadas, Padrões GoF |
| Implementação          | Projeto arquitetural     | js/*.js, css/*.css, index.html| JavaScript ES2022    |
| Testes                 | Critérios de aceite      | Testes manuais (Sprint 9)     | Exploratório         |
| Gerência de config.    | Código-fonte             | .gitignore, CHANGELOG.md      | Git + Semver         |
| Gerência de projeto    | Escopo e equipe          | docs/PROJECT.md               | Scrum + MoSCoW       |

---

*CentralAI © 2025 · UFG · Instituto de Informática · Processos de Software*
