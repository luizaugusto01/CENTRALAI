# Banco de Dados — CentralAI

> Disciplina: Banco de Dados · UFG · INF  
> Tecnologia de referência: PostgreSQL 16  
> Implementação frontend: Repository Pattern sobre localStorage (js/repository.js)

---

## 1. Conceitos Fundamentais Aplicados

| Conceito           | PostgreSQL                        | CentralAI (frontend)                        |
|--------------------|-----------------------------------|---------------------------------------------|
| Banco de dados     | Instância PostgreSQL              | localStorage (navegador)                    |
| Tabela             | CREATE TABLE                      | Chave no localStorage (JSON array)          |
| Linha (tupla)      | INSERT INTO                       | `repository.create()`                       |
| Chave primária     | SERIAL / gen_random_uuid()        | `generateId()` (UUID v4 simplificado)       |
| Chave estrangeira  | FOREIGN KEY REFERENCES            | Campo `userId`, `aiId` por convenção        |
| SELECT             | SELECT * FROM tabela WHERE        | `findAll()`, `findWhere()`, `findBy()`      |
| UPDATE             | UPDATE tabela SET ... WHERE id=$1 | `update(id, changes)`                       |
| DELETE             | DELETE FROM tabela WHERE id=$1    | `remove(id)`, `removeWhere(predicate)`      |
| JOIN               | INNER JOIN ... ON                 | `join(otherRepo, localKey, foreignKey)`     |
| Transação          | BEGIN / COMMIT / ROLLBACK         | `transaction(operations)`                   |
| GROUP BY + COUNT   | GROUP BY col                      | `reduce()` sobre o resultado de `findAll()` |
| Índice             | CREATE INDEX                      | Map para lookup O(1) no `join()`            |
| Dump / Restore     | pg_dump / pg_restore              | `Database.dump()` / `repository.import()`  |

---

## 2. Modelo Entidade-Relacionamento (MER)

### 2.1 Diagrama ER Conceitual

```
┌─────────────────┐         ┌─────────────────────┐
│      users      │         │      favorites       │
├─────────────────┤  1   N  ├─────────────────────┤
│ PK id           │────────►│ PK id               │
│    name         │         │ FK userId → users   │
│    email UNIQUE │         │    aiId             │
│    plan         │         │    addedAt          │
│    createdAt    │         └─────────────────────┘
└────────┬────────┘
         │ 1
         │                  ┌─────────────────────┐
         │ N                │    chat_messages     │
         │                  ├─────────────────────┤
         └─────────────────►│ PK id               │
         │                  │ FK userId → users   │
         │                  │    role             │
         │                  │    content          │
         │                  │    ts               │
         │                  └─────────────────────┘
         │ 1
         │ N                ┌─────────────────────┐
         │                  │     usage_logs       │
         └─────────────────►├─────────────────────┤
                            │ PK id               │
                            │ FK userId → users   │
                            │    aiId             │
                            │    action           │
                            │    metadata (JSONB) │
                            │    ts               │
                            └─────────────────────┘
```

### 2.2 Cardinalidades

| Relacionamento          | Cardinalidade | Significado                                   |
|-------------------------|:---:|-----------------------------------------------|
| users → favorites       | 1:N | Um usuário tem muitos favoritos               |
| users → chat_messages   | 1:N | Um usuário tem muitas mensagens               |
| users → usage_logs      | 1:N | Um usuário gera muitos logs de uso            |
| favorites → AI_DATABASE | N:1 | Muitos favoritos referenciam a mesma IA       |
| usage_logs → AI_DATABASE| N:1 | Muitos logs referenciam a mesma IA            |

---

## 3. Modelo Relacional — DDL (Data Definition Language)

Script SQL completo equivalente ao que seria executado no PostgreSQL:

```sql
-- Extensão para UUID (PostgreSQL 13+)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════
-- TABELA: users
-- ═══════════════════════════════════════════
CREATE TABLE users (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    plan       VARCHAR(20)  NOT NULL DEFAULT 'free'
                            CHECK (plan IN ('free', 'pro', 'enterprise')),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Índice na coluna email (buscas por email são frequentes)
CREATE INDEX idx_users_email ON users(email);

-- ═══════════════════════════════════════════
-- TABELA: favorites
-- ═══════════════════════════════════════════
CREATE TABLE favorites (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ai_id      VARCHAR(50) NOT NULL,
    added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Impede que o mesmo usuário favorite a mesma IA duas vezes
    CONSTRAINT uq_favorites_user_ai UNIQUE (user_id, ai_id)
);

-- Índice composto para JOIN user + AI
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- ═══════════════════════════════════════════
-- TABELA: chat_messages
-- ═══════════════════════════════════════════
CREATE TABLE chat_messages (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        REFERENCES users(id) ON DELETE SET NULL,
    role       VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
    content    TEXT        NOT NULL,
    ts         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice por user_id e ts para busca de histórico ordenado
CREATE INDEX idx_chat_user_ts ON chat_messages(user_id, ts DESC);

-- ═══════════════════════════════════════════
-- TABELA: usage_logs
-- ═══════════════════════════════════════════
CREATE TABLE usage_logs (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        REFERENCES users(id) ON DELETE SET NULL,
    ai_id      VARCHAR(50),
    action     VARCHAR(50) NOT NULL
                           CHECK (action IN ('view','favorite','compare','recommend','chat')),
    metadata   JSONB       DEFAULT '{}',
    ts         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para relatórios e analytics
CREATE INDEX idx_logs_user_id   ON usage_logs(user_id);
CREATE INDEX idx_logs_action    ON usage_logs(action);
CREATE INDEX idx_logs_ai_id     ON usage_logs(ai_id);
-- Índice GIN para busca dentro do JSONB (metadata)
CREATE INDEX idx_logs_metadata  ON usage_logs USING GIN (metadata);
```

---

## 4. DML — Queries Representativas (Data Manipulation Language)

### 4.1 INSERT — criar usuário e favorito

```sql
-- Inserir usuário
INSERT INTO users (name, email, plan)
VALUES ('João Silva', 'joao@email.com', 'pro')
RETURNING id, name, email, plan, created_at;

-- Favoritar uma IA (ON CONFLICT = não duplica)
INSERT INTO favorites (user_id, ai_id)
VALUES ('uuid-do-usuario', 'chatgpt-4o')
ON CONFLICT (user_id, ai_id) DO NOTHING;
```

### 4.2 SELECT simples e com JOIN

```sql
-- Buscar favoritos de um usuário
SELECT * FROM favorites
WHERE user_id = 'uuid-do-usuario'
ORDER BY added_at DESC;

-- JOIN: buscar usuário junto com quantidade de favoritos
SELECT
    u.id,
    u.name,
    u.email,
    COUNT(f.id) AS total_favorites
FROM users u
LEFT JOIN favorites f ON f.user_id = u.id
GROUP BY u.id, u.name, u.email
ORDER BY total_favorites DESC;

-- Histórico de chat ordenado por tempo
SELECT role, content, ts
FROM chat_messages
WHERE user_id = 'uuid-do-usuario'
ORDER BY ts ASC;
```

### 4.3 Relatório — IAs mais vistas

```sql
-- IAs mais visualizadas (GROUP BY + COUNT + ORDER BY)
SELECT
    ai_id,
    COUNT(*) AS views,
    COUNT(DISTINCT user_id) AS unique_users
FROM usage_logs
WHERE action = 'view'
  AND ts >= NOW() - INTERVAL '30 days'
GROUP BY ai_id
ORDER BY views DESC
LIMIT 10;
```

### 4.4 UPDATE e DELETE

```sql
-- Upgrade de plano
UPDATE users
SET plan = 'pro', updated_at = NOW()
WHERE id = 'uuid-do-usuario'
RETURNING id, plan, updated_at;

-- Deletar favorito específico
DELETE FROM favorites
WHERE user_id = 'uuid-do-usuario'
  AND ai_id = 'chatgpt-4o'
RETURNING id;

-- Limpar histórico de chat mais antigo que 90 dias
DELETE FROM chat_messages
WHERE ts < NOW() - INTERVAL '90 days';
```

### 4.5 Transação

```sql
-- Cadastrar usuário e registrar o log em uma única transação
BEGIN;
    INSERT INTO users (name, email, plan)
    VALUES ('Maria Souza', 'maria@email.com', 'free');

    INSERT INTO usage_logs (user_id, action, metadata)
    VALUES (
        (SELECT id FROM users WHERE email = 'maria@email.com'),
        'signup',
        '{"source": "centralai_web"}'::jsonb
    );
COMMIT;
-- Se qualquer linha falhar: ROLLBACK automático
```

---

## 5. Normalização

### 5.1 Primeira Forma Normal (1FN)
- Todos os atributos são atômicos (sem listas em uma coluna)
- `favorites` tem uma linha por favorito — **não** `favorites TEXT[]` em users
- `metadata` usa JSONB (exceção justificada: dados semiestruturados variáveis)

### 5.2 Segunda Forma Normal (2FN)
- Todas as tabelas têm chave primária simples (UUID)
- Não há dependências parciais em chaves compostas

### 5.3 Terceira Forma Normal (3FN)
- Não há dependências transitivas:
  - `users`: `plan` depende diretamente de `id`, não de `email`
  - `favorites`: `added_at` depende de `(user_id, ai_id)`, não só de `user_id`
  - Dados do catálogo de IAs estão separados em `AI_DATABASE` (modelos.js), não duplicados em `favorites`

---

## 6. Do localStorage ao PostgreSQL — Migração

O `repository.js` foi projetado para que a migração seja uma troca de camada:

```
Versão atual (frontend):          Versão produção (backend):
─────────────────────────         ────────────────────────────
BaseRepository                    TypeORM / Prisma / Sequelize
  └── localStorage                  └── pg.Pool (PostgreSQL)

findWhere(predicate)              SELECT * FROM t WHERE <cláusula>
create(data)                      INSERT INTO t VALUES (...) RETURNING *
update(id, changes)               UPDATE t SET ... WHERE id=$1
remove(id)                        DELETE FROM t WHERE id=$1
join(repo, localKey)              INNER JOIN ... ON
transaction(operations)           BEGIN / COMMIT / ROLLBACK
```

A interface pública dos repositórios (`UserRepository`, `FavoriteRepository` etc.) **não muda** — apenas a implementação interna do `BaseRepository` troca de `localStorage.setItem` para `pool.query(sql, params)`.

---

## 7. Segurança (Boas Práticas)

| Risco                   | SQL (PostgreSQL)                          | Frontend (localStorage)               |
|-------------------------|-------------------------------------------|---------------------------------------|
| SQL Injection           | Queries parametrizadas ($1, $2, ...)      | Sem SQL — predicados são funções JS   |
| Dados sensíveis         | Colunas com `encrypted` / pgcrypto       | Nunca armazenar senhas no localStorage|
| Overflow de dados       | VARCHAR com limite explícito              | `maxlength` no HTML + validação JS    |
| Acesso não autorizado   | Row Level Security (RLS) no PostgreSQL    | Validar `userId` antes de toda query  |
| Integridade referencial | FOREIGN KEY + ON DELETE CASCADE/SET NULL  | Validação manual no Repository        |

---

*CentralAI © 2025 · UFG · Instituto de Informática · Banco de Dados*
