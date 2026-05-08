/**
 * CentralAI — repository.js
 * Padrão Repository + Simulação de Banco de Dados Relacional
 *
 * Disciplina: Banco de Dados (PostgreSQL / Modelo Relacional)
 *
 * Este módulo demonstra como os conceitos de BD relacional se aplicam
 * em um frontend sem servidor:
 *
 *   · Tabelas         → objetos JSON armazenados no localStorage
 *   · Chaves primárias→ campos `id` gerados por UUID simplificado
 *   · Chaves estrang. → IDs que referenciam registros de outra "tabela"
 *   · SELECT          → métodos findAll(), findById(), findWhere()
 *   · INSERT          → método create()
 *   · UPDATE          → método update()
 *   · DELETE          → método remove()
 *   · JOIN            → método join() que cruza duas tabelas por FK
 *   · Normalização    → cada entidade em sua própria "tabela" (3FN)
 *   · Transação       → método transaction() que reverte em caso de erro
 *
 * Schema relacional simulado (equivalente ao PostgreSQL):
 *
 *   users          (id PK, name, email, createdAt)
 *   favorites      (id PK, userId FK→users, aiId FK→AI_DATABASE, addedAt)
 *   chat_messages  (id PK, userId FK→users, role, content, ts)
 *   usage_logs     (id PK, userId FK→users, aiId FK→AI_DATABASE, action, ts)
 *
 * Equivalente SQL completo em docs/DATABASE.md
 */

window.CentralAI = window.CentralAI || {};

/* ════════════════════════════════════════════════════════════════════════
   UTILITÁRIOS
   ════════════════════════════════════════════════════════════════════════ */

/**
 * Gera um ID único no formato UUID v4 simplificado.
 * Equivalente ao SERIAL / gen_random_uuid() do PostgreSQL.
 */
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Retorna o timestamp ISO atual.
 * Equivalente ao NOW() / CURRENT_TIMESTAMP do PostgreSQL.
 */
const now = () => new Date().toISOString();

/* ════════════════════════════════════════════════════════════════════════
   BASE REPOSITORY — classe genérica para qualquer "tabela"
   ════════════════════════════════════════════════════════════════════════

   No PostgreSQL, cada tabela tem seu próprio esquema e operações CRUD.
   Aqui, o BaseRepository abstrai isso para qualquer entidade,
   usando localStorage como "banco de dados".

   Analogia:
     PostgreSQL table    ↔  tableName no localStorage
     row                 ↔  objeto JavaScript
     primary key (id)    ↔  campo id gerado por generateId()
     pg_dump             ↔  export() / JSON.stringify()
     pg_restore          ↔  import() / JSON.parse()
*/
class BaseRepository {
  #tableName;
  #storage;

  /**
   * @param {string} tableName — nome da "tabela" (chave no localStorage)
   */
  constructor(tableName) {
    this.#tableName = `centralai_db_${tableName}`;
    this.#storage   = window.CentralAI.storage ?? {
      get: (k, d) => {
        try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
      },
      set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    };
  }

  get tableName() { return this.#tableName; }

  /* ── Leitura da "tabela" completa ────────────────────────────────────── */
  #read() {
    return this.#storage.get(this.#tableName, []);
  }

  /* ── Gravação da "tabela" completa ───────────────────────────────────── */
  #write(rows) {
    this.#storage.set(this.#tableName, rows);
  }

  /**
   * SELECT * FROM table
   * @returns {Object[]}
   */
  findAll() {
    return [...this.#read()];
  }

  /**
   * SELECT * FROM table WHERE id = $1
   * @param {string} id
   * @returns {Object|null}
   */
  findById(id) {
    return this.#read().find(row => row.id === id) ?? null;
  }

  /**
   * SELECT * FROM table WHERE <predicado>
   * Equivalente ao WHERE clause do SQL.
   *
   * @param {Function} predicate — (row) => boolean
   * @returns {Object[]}
   *
   * Exemplo:
   *   favoriteRepo.findWhere(f => f.userId === '123')
   *   ≡ SELECT * FROM favorites WHERE userId = '123'
   */
  findWhere(predicate) {
    return this.#read().filter(predicate);
  }

  /**
   * SELECT * FROM table WHERE <campo> = <valor>
   * Atalho para o caso mais comum de WHERE com igualdade.
   *
   * @param {string} field
   * @param {*}      value
   * @returns {Object[]}
   */
  findBy(field, value) {
    return this.findWhere(row => row[field] === value);
  }

  /**
   * INSERT INTO table VALUES (...)
   * Gera o id automaticamente (equivale a SERIAL / gen_random_uuid()).
   *
   * @param {Object} data — campos da linha (sem id, sem createdAt)
   * @returns {Object} linha inserida com id e createdAt
   */
  create(data) {
    const rows = this.#read();
    const newRow = {
      id:        generateId(),
      createdAt: now(),
      ...data,
    };
    rows.push(newRow);
    this.#write(rows);
    return { ...newRow };
  }

  /**
   * UPDATE table SET ... WHERE id = $1
   *
   * @param {string} id
   * @param {Object} changes — apenas os campos a alterar
   * @returns {Object|null} linha atualizada ou null se não encontrada
   */
  update(id, changes) {
    const rows    = this.#read();
    const index   = rows.findIndex(row => row.id === id);
    if (index === -1) return null;

    rows[index] = { ...rows[index], ...changes, updatedAt: now() };
    this.#write(rows);
    return { ...rows[index] };
  }

  /**
   * DELETE FROM table WHERE id = $1
   *
   * @param {string} id
   * @returns {boolean} true se deletado, false se não encontrado
   */
  remove(id) {
    const rows    = this.#read();
    const filtered = rows.filter(row => row.id !== id);
    if (filtered.length === rows.length) return false;
    this.#write(filtered);
    return true;
  }

  /**
   * DELETE FROM table WHERE <predicado>
   * Equivalente ao DELETE com WHERE genérico.
   */
  removeWhere(predicate) {
    const rows    = this.#read();
    const filtered = rows.filter(row => !predicate(row));
    this.#write(filtered);
    return rows.length - filtered.length;  // retorna quantidade deletada
  }

  /**
   * SELECT COUNT(*) FROM table
   */
  count() {
    return this.#read().length;
  }

  /**
   * JOIN simulado — cruza esta tabela com outra por chave estrangeira.
   *
   * Equivalente ao INNER JOIN do SQL:
   *   SELECT t1.*, t2.*
   *   FROM thisTable t1
   *   INNER JOIN otherTable t2 ON t1[localKey] = t2[foreignKey]
   *
   * @param {BaseRepository} otherRepo  — repositório da outra tabela
   * @param {string}         localKey   — campo desta tabela (FK)
   * @param {string}         foreignKey — campo da outra tabela (geralmente 'id')
   * @returns {Object[]} linhas mescladas
   *
   * Exemplo (equivale ao SQL abaixo):
   *   favoriteRepo.join(userRepo, 'userId', 'id')
   *
   *   SELECT f.*, u.name, u.email
   *   FROM favorites f
   *   INNER JOIN users u ON f.userId = u.id
   */
  join(otherRepo, localKey, foreignKey = 'id') {
    const thisRows  = this.#read();
    const otherRows = otherRepo.findAll();

    /* Cria um Map para lookup O(1) — como um índice no BD */
    const otherIndex = new Map(otherRows.map(r => [r[foreignKey], r]));

    return thisRows
      .map(row => {
        const related = otherIndex.get(row[localKey]);
        if (!related) return null;  // simula INNER JOIN (exclui sem match)
        return { ...row, _joined: related };
      })
      .filter(Boolean);
  }

  /**
   * TRANSACTION simulada — executa operações em lote.
   * Se qualquer operação lançar erro, reverte para o estado anterior.
   *
   * No PostgreSQL: BEGIN; ... COMMIT; (ou ROLLBACK em caso de erro)
   *
   * @param {Function} operations — async (repo) => { ... }
   * @returns {boolean} true = commit, false = rollback
   */
  async transaction(operations) {
    const snapshot = this.#read();  // salva estado anterior (checkpoint)
    try {
      await operations(this);
      return true;   // COMMIT
    } catch (err) {
      this.#write(snapshot);         // ROLLBACK
      console.error(`[Repository:${this.#tableName}] ROLLBACK — erro:`, err.message);
      return false;
    }
  }

  /**
   * Exporta a tabela como JSON (equivale ao pg_dump de uma tabela).
   */
  export() {
    return JSON.stringify(this.#read(), null, 2);
  }

  /**
   * Importa linhas (equivale ao pg_restore / COPY ... FROM stdin).
   * @param {string} json
   * @param {boolean} [merge=false] — false = substitui, true = faz upsert
   */
  import(json, merge = false) {
    const imported = JSON.parse(json);
    if (merge) {
      const existing = this.#read();
      const existingIds = new Set(existing.map(r => r.id));
      const newRows = imported.filter(r => !existingIds.has(r.id));
      this.#write([...existing, ...newRows]);
    } else {
      this.#write(imported);
    }
  }

  /** DROP TABLE — limpa todos os dados */
  truncate() {
    this.#write([]);
  }
}

/* ════════════════════════════════════════════════════════════════════════
   REPOSITÓRIOS CONCRETOS — uma classe por entidade (tabela)
   ════════════════════════════════════════════════════════════════════════ */

/**
 * Tabela: users
 *
 * SQL equivalente:
 *   CREATE TABLE users (
 *     id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     name       VARCHAR(100) NOT NULL,
 *     email      VARCHAR(255) UNIQUE NOT NULL,
 *     plan       VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free','pro','enterprise')),
 *     createdAt  TIMESTAMP DEFAULT NOW(),
 *     updatedAt  TIMESTAMP
 *   );
 */
class UserRepository extends BaseRepository {
  constructor() { super('users'); }

  /**
   * SELECT * FROM users WHERE email = $1
   * Equivale a busca por chave única (índice UNIQUE).
   */
  findByEmail(email) {
    return this.findWhere(u => u.email === email)[0] ?? null;
  }

  /**
   * SELECT * FROM users WHERE plan = $1
   */
  findByPlan(plan) {
    return this.findBy('plan', plan);
  }

  /**
   * Cria usuário com validação de email único (constraint UNIQUE).
   * Equivale ao ON CONFLICT DO NOTHING do PostgreSQL.
   */
  createUser({ name, email, plan = 'free' }) {
    if (!email || !name) throw new TypeError('name e email são obrigatórios.');
    if (this.findByEmail(email)) {
      throw new Error(`Usuário com email "${email}" já existe. (UNIQUE violation)`);
    }
    return this.create({ name, email, plan });
  }
}

/**
 * Tabela: favorites
 *
 * SQL equivalente:
 *   CREATE TABLE favorites (
 *     id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     userId    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *     aiId      VARCHAR(50) NOT NULL,
 *     addedAt   TIMESTAMP DEFAULT NOW(),
 *     UNIQUE (userId, aiId)   -- impede favoritar a mesma IA duas vezes
 *   );
 *   CREATE INDEX idx_favorites_userId ON favorites(userId);
 */
class FavoriteRepository extends BaseRepository {
  constructor() { super('favorites'); }

  /**
   * SELECT * FROM favorites WHERE userId = $1
   * Usa o índice simulado (findBy é O(n), mas representa a query com índice).
   */
  findByUser(userId) {
    return this.findBy('userId', userId);
  }

  /**
   * SELECT * FROM favorites WHERE userId = $1 AND aiId = $2
   */
  findUserAI(userId, aiId) {
    return this.findWhere(f => f.userId === userId && f.aiId === aiId)[0] ?? null;
  }

  /**
   * Toggle: favorita se não existe, desfavorita se já existe.
   * Padrão comum em SQL: INSERT ... ON CONFLICT DO DELETE (upsert reverso)
   *
   * @returns {{ action: 'added'|'removed', record: Object }}
   */
  toggle(userId, aiId) {
    const existing = this.findUserAI(userId, aiId);
    if (existing) {
      this.remove(existing.id);
      return { action: 'removed', record: existing };
    }
    const record = this.create({ userId, aiId, addedAt: now() });
    return { action: 'added', record };
  }

  /**
   * JOIN com AI_DATABASE — retorna os objetos AITool favoritados.
   * Equivale a:
   *   SELECT ai.* FROM favorites f
   *   INNER JOIN ai_catalog ai ON f.aiId = ai.id
   *   WHERE f.userId = $1
   */
  getAIsForUser(userId) {
    const { AI_DATABASE } = window.CentralAI;
    const favs = this.findByUser(userId);
    const favIds = new Set(favs.map(f => f.aiId));
    return AI_DATABASE.filter(ai => favIds.has(ai.id));
  }
}

/**
 * Tabela: chat_messages
 *
 * SQL equivalente:
 *   CREATE TABLE chat_messages (
 *     id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     userId    UUID REFERENCES users(id) ON DELETE SET NULL,
 *     role      VARCHAR(10) NOT NULL CHECK (role IN ('user','assistant')),
 *     content   TEXT NOT NULL,
 *     ts        TIMESTAMP DEFAULT NOW(),
 *     createdAt TIMESTAMP DEFAULT NOW()
 *   );
 *   CREATE INDEX idx_chat_userId ON chat_messages(userId);
 *   CREATE INDEX idx_chat_ts ON chat_messages(ts DESC);
 */
class ChatMessageRepository extends BaseRepository {
  constructor() { super('chat_messages'); }

  /**
   * SELECT * FROM chat_messages WHERE userId = $1 ORDER BY ts ASC
   */
  getHistory(userId) {
    return this.findBy('userId', userId)
      .sort((a, b) => new Date(a.ts) - new Date(b.ts));
  }

  /**
   * SELECT * FROM chat_messages WHERE userId = $1 ORDER BY ts DESC LIMIT $2
   */
  getRecent(userId, limit = 10) {
    return this.findBy('userId', userId)
      .sort((a, b) => new Date(b.ts) - new Date(a.ts))
      .slice(0, limit);
  }

  addMessage(userId, role, content) {
    if (!['user', 'assistant'].includes(role)) {
      throw new RangeError(`role inválido: "${role}". Use 'user' ou 'assistant'.`);
    }
    return this.create({ userId, role, content, ts: now() });
  }

  /**
   * DELETE FROM chat_messages WHERE userId = $1
   */
  clearHistory(userId) {
    return this.removeWhere(m => m.userId === userId);
  }
}

/**
 * Tabela: usage_logs
 * Log de auditoria — equivalente a uma tabela de auditoria no PostgreSQL.
 *
 * SQL equivalente:
 *   CREATE TABLE usage_logs (
 *     id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     userId    UUID REFERENCES users(id) ON DELETE SET NULL,
 *     aiId      VARCHAR(50),
 *     action    VARCHAR(50) NOT NULL,  -- 'view','favorite','compare','recommend'
 *     metadata  JSONB,
 *     ts        TIMESTAMP DEFAULT NOW(),
 *     createdAt TIMESTAMP DEFAULT NOW()
 *   );
 */
class UsageLogRepository extends BaseRepository {
  constructor() { super('usage_logs'); }

  log(userId, action, aiId = null, metadata = {}) {
    return this.create({ userId, action, aiId, metadata, ts: now() });
  }

  /**
   * SELECT action, COUNT(*) as total
   * FROM usage_logs WHERE userId = $1
   * GROUP BY action
   *
   * Simulação de GROUP BY + COUNT com reduce.
   */
  getStats(userId) {
    const logs = this.findBy('userId', userId);
    return logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] ?? 0) + 1;
      return acc;
    }, {});
  }

  /**
   * SELECT aiId, COUNT(*) as views
   * FROM usage_logs WHERE action = 'view'
   * GROUP BY aiId ORDER BY views DESC LIMIT $1
   *
   * Simula um relatório de IAs mais vistas.
   */
  getMostViewed(limit = 5) {
    const views = this.findBy('action', 'view');
    const counts = views.reduce((acc, log) => {
      acc[log.aiId] = (acc[log.aiId] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([aiId, views]) => ({ aiId, views }));
  }
}

/* ════════════════════════════════════════════════════════════════════════
   DATABASE — objeto central que agrupa todos os repositórios
   Equivalente ao objeto de conexão / pool do PostgreSQL (pg.Pool)
   ════════════════════════════════════════════════════════════════════════ */
const Database = {
  users:    new UserRepository(),
  favorites: new FavoriteRepository(),
  messages: new ChatMessageRepository(),
  logs:     new UsageLogRepository(),

  /**
   * Retorna estatísticas gerais do banco.
   * Equivale a:
   *   SELECT tablename, n_live_tup FROM pg_stat_user_tables;
   */
  stats() {
    return {
      users:    this.users.count(),
      favorites: this.favorites.count(),
      messages: this.messages.count(),
      logs:     this.logs.count(),
    };
  },

  /**
   * Exporta todo o banco como JSON (pg_dump simplificado).
   */
  dump() {
    return JSON.stringify({
      exportedAt: now(),
      version:    '1.0.0',
      tables: {
        users:    JSON.parse(this.users.export()),
        favorites: JSON.parse(this.favorites.export()),
        messages: JSON.parse(this.messages.export()),
        logs:     JSON.parse(this.logs.export()),
      }
    }, null, 2);
  },
};

/* ─── Exporta para o namespace global ─────────────────────────────────── */
Object.assign(window.CentralAI, {
  BaseRepository,
  UserRepository, FavoriteRepository, ChatMessageRepository, UsageLogRepository,
  Database,
  generateId,
});

/* ─── DEMO no console ──────────────────────────────────────────────────── */
console.group('🗄️ CentralAI — Banco de Dados (Repository Pattern)');
console.log('Tabelas disponíveis:', Object.keys(Database).filter(k => typeof Database[k] !== 'function'));
console.log('Stats:', Database.stats());
console.log('Acesse window.CentralAI.Database para interagir com o banco.');
console.groupEnd();
