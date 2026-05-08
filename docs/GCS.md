# Gerência de Configuração de Software — CentralAI

> Disciplina: Gerência de Configuração de Software (GCS) · UFG · INF  
> Referências: IEEE 828 · CMMI · Git SCM · Semantic Versioning 2.0.0

---

## 1. O que é GCS?

**Gerência de Configuração de Software** é a disciplina que controla a evolução de um sistema ao longo do tempo, garantindo:

- **Identificação**: saber exatamente o que compõe o sistema em cada versão
- **Controle de mudanças**: aprovar, registrar e rastrear toda alteração
- **Auditoria de status**: saber o estado atual e histórico de cada artefato
- **Revisão e entrega**: garantir a integridade do produto nas entregas

> "Se você não pode reproduzir uma versão passada do seu software, você não tem controle sobre ele." — IEEE 828

---

## 2. Sistema de Controle de Versão — Git

### 2.1 Fluxo de trabalho (Gitflow adaptado)

```
main ──────────────────●────────────────────────●──────── (produção)
                       ↑                        ↑
                  merge PR                 merge PR
                       │                        │
develop ──────●────────●──────●─────────────────●──────── (integração)
              ↑        │      ↑
         branch        │  branch
              │        │      │
feature/catalog──●──●──┘      │
                               │
feature/chat──────────●──●────┘
```

### 2.2 Estratégia de branches

| Branch             | Propósito                                        | Criada a partir de | Merge em          |
|--------------------|--------------------------------------------------|--------------------|-------------------|
| `main`             | Código de produção — sempre estável              | —                  | —                 |
| `develop`          | Integração de features — código testado          | `main`             | `main` (release)  |
| `feature/<nome>`   | Nova funcionalidade                              | `develop`          | `develop`         |
| `hotfix/<nome>`    | Correção urgente em produção                     | `main`             | `main` + `develop`|
| `release/<versão>` | Preparação para uma nova versão                  | `develop`          | `main` + `develop`|

### 2.3 Branches do CentralAI

```bash
# Branches criadas durante o desenvolvimento
git branch --list

  main                        # v1.0.0 — versão entregue
  develop                     # integração contínua
  feature/catalog-filters     # RF-01: filtros do catálogo
  feature/comparator          # RF-03: comparador lado a lado
  feature/recommender         # RF-04: recomendador
  feature/chat-plugin         # ChatPlugin + extensões
  feature/data-structures     # core.js: Stack, Queue, LinkedList
  feature/database-layer      # repository.js: Repository Pattern
  hotfix/mobile-menu          # correção do menu hamburger
```

---

## 3. Política de Commits (Conventional Commits)

Padrão que torna o histórico legível e permite geração automática de CHANGELOG.

### Formato

```
<tipo>(<escopo>): <descrição curta>

[corpo opcional — explica O QUÊ e POR QUÊ, não o COMO]

[rodapé opcional — BREAKING CHANGE, closes #issue]
```

### Tipos de commit

| Tipo       | Quando usar                                              | Exemplo                                          |
|------------|----------------------------------------------------------|--------------------------------------------------|
| `feat`     | Nova funcionalidade                                      | `feat(catalog): add text search with SearchIndex`|
| `fix`      | Correção de bug                                          | `fix(modal): restore focus on ESC key close`     |
| `docs`     | Documentação apenas                                      | `docs(database): add ER diagram and SQL DDL`     |
| `style`    | Formatação, sem mudança de lógica                        | `style(css): reorder media query breakpoints`    |
| `refactor` | Refatoração sem nova feat ou fix                         | `refactor(services): extract EventEmitter base`  |
| `perf`     | Melhoria de performance                                  | `perf(search): replace linear scan with index`   |
| `test`     | Adicionar ou corrigir testes                             | `test(repository): add transaction rollback test`|
| `chore`    | Tarefas de build, ferramentas, config                    | `chore: add .gitignore and package.json`         |
| `ci`       | Mudanças em CI/CD                                        | `ci: add github actions lint workflow`           |

### Exemplos do histórico do CentralAI

```bash
git log --oneline

a1b2c3d feat(models): add AIFactory with polymorphic create()
b2c3d4e feat(services): implement Strategy pattern for recommendations
c3d4e5f feat(css): upgrade to glassmorphism dark theme v2
d4e5f6g feat(core): add Stack, Queue, LinkedList data structures
e5f6g7h feat(extensions): add Command pattern with undo/redo
f6g7h8i feat(chat): implement ChatPlugin with mock responses
g7h8i9j docs(modeling): add 12 UML diagrams in ASCII
h8i9j0k docs(database): add ER diagram and PostgreSQL DDL
i9j0k1l chore: add .gitignore, package.json, CHANGELOG.md
j0k1l2m fix(comparator): prevent duplicate AI selection
k1l2m3n perf(search): replace ai.matches() with inverted index
l2m3n4o docs(gcs): add branching strategy and commit policy
```

---

## 4. Versionamento Semântico (SemVer 2.0.0)

Formato: **MAJOR.MINOR.PATCH** — exemplo: `1.3.2`

| Componente | Quando incrementar                                        | Exemplo                           |
|------------|-----------------------------------------------------------|-----------------------------------|
| **MAJOR**  | Mudança incompatível com versão anterior (breaking change)| API pública removida ou alterada  |
| **MINOR**  | Nova funcionalidade compatível com versão anterior        | Novo padrão de projeto adicionado |
| **PATCH**  | Correção de bug compatível com versão anterior            | Fix no menu mobile                |

### Histórico de versões do CentralAI

```
v0.1.0  — Estrutura inicial: HTML + CSS base
v0.2.0  — Domain Layer: models.js (AITool, subclasses, AIFactory)
v0.3.0  — Service Layer: services.js (EventEmitter, Singleton, Strategy)
v0.4.0  — Presentation Layer: components.js (Catalog, Comparator, Recommender)
v0.5.0  — CSS v2: glassmorphism, animações, design premium
v0.6.0  — core.js: estruturas de dados, algoritmos, JS avançado (P1-P4)
v0.7.0  — extensions.js: Command, Decorator, Adapter, Chain, Plugins
v0.8.0  — Chat assistente + seção na UI
v0.9.0  — repository.js: Repository Pattern + simulação de BD
v1.0.0  — Documentação completa: todos os docs entregues (versão final)
```

---

## 5. Itens de Configuração (ICs)

Todo artefato controlado pelo GCS é um **Item de Configuração (IC)**:

| IC                         | Tipo         | Versão   | Responsável        |
|----------------------------|--------------|----------|--------------------|
| `index.html`               | Código-fonte | v1.0.0   | Equipe             |
| `css/style.css`            | Código-fonte | v2.0.0   | Equipe             |
| `js/models.js`             | Código-fonte | v1.0.0   | Equipe             |
| `js/services.js`           | Código-fonte | v1.0.0   | Equipe             |
| `js/core.js`               | Código-fonte | v1.0.0   | Equipe             |
| `js/extensions.js`         | Código-fonte | v1.0.0   | Equipe             |
| `js/repository.js`         | Código-fonte | v1.0.0   | Equipe             |
| `js/components.js`         | Código-fonte | v1.0.0   | Equipe             |
| `js/app.js`                | Código-fonte | v1.0.0   | Equipe             |
| `docs/REQUIREMENTS.md`     | Documento    | v1.0.0   | Equipe             |
| `docs/ARCHITECTURE.md`     | Documento    | v1.0.0   | Equipe             |
| `docs/DESIGN_PATTERNS.md`  | Documento    | v1.0.0   | Equipe             |
| `docs/MODELING.md`         | Documento    | v1.0.0   | Equipe             |
| `docs/HCI.md`              | Documento    | v1.0.0   | Equipe             |
| `docs/DATABASE.md`         | Documento    | v1.0.0   | Equipe             |
| `docs/PROCESS.md`          | Documento    | v1.0.0   | Equipe             |
| `docs/GCS.md`              | Documento    | v1.0.0   | Equipe             |
| `docs/PARADIGMS.md`        | Documento    | v1.0.0   | Equipe             |
| `docs/NETWORKS.md`         | Documento    | v1.0.0   | Equipe             |
| `docs/PROJECT.md`          | Documento    | v1.0.0   | Equipe             |
| `.gitignore`               | Configuração | v1.0.0   | Equipe             |
| `package.json`             | Configuração | v1.0.0   | Equipe             |
| `CHANGELOG.md`             | Registro     | v1.0.0   | Equipe             |

---

## 6. Processo de Controle de Mudanças

```
Solicitação de Mudança (Change Request)
         │
         ▼
  ◇ É urgente? (hotfix)
  ├── Sim ──► Branch hotfix/* → fix → PR → merge main+develop → tag PATCH
  └── Não ──► Registrar no backlog
                 │
                 ▼
          Sprint Planning — selecionar a mudança
                 │
                 ▼
          Branch feature/* → implementar → testes → PR
                 │
                 ▼
          Code Review (mínimo 1 aprovação)
                 │
                 ▼
          Merge em develop → CI (lint + testes)
                 │
                 ▼
          Sprint Review — demonstrar para o Product Owner
                 │
                 ▼
          Release branch → merge em main → tag nova versão → CHANGELOG
```

---

## 7. Comandos Git Essenciais

```bash
# Configuração inicial
git config --global user.name  "Seu Nome"
git config --global user.email "email@ufg.br"

# Criar e trabalhar em uma feature
git checkout develop
git pull origin develop
git checkout -b feature/nova-funcionalidade

git add js/novomodulo.js docs/NOVODOC.md
git commit -m "feat(novomodulo): add X with Y pattern"
git push origin feature/nova-funcionalidade

# Criar Pull Request (GitHub CLI)
gh pr create --title "feat(novomodulo): add X" --base develop

# Após aprovação e merge — limpar branch local
git checkout develop
git pull origin develop
git branch -d feature/nova-funcionalidade

# Criar tag de versão
git tag -a v1.1.0 -m "feat: add chat plugin and database layer"
git push origin v1.1.0

# Ver histórico formatado
git log --oneline --graph --decorate --all
```

---

*CentralAI © 2025 · UFG · Instituto de Informática · Gerência de Configuração de Software*
