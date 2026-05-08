# Redes de Computadores & Sistemas Operacionais — CentralAI

> Disciplinas: Redes de Computadores · Sistemas Operacionais · UFG · INF  
> Referências: Tanenbaum (2021) · Kurose & Ross (2021) · MDN Web Docs · RFC 7231

---

## Parte 1 — Redes de Computadores

---

## 1. Modelo TCP/IP e como o CentralAI se encaixa

O modelo TCP/IP descreve como dados trafegam entre sistemas em uma rede.

```
┌─────────────────────────────────────────────────────────────┐
│  CAMADA           PROTOCOLO             CentralAI            │
├─────────────────────────────────────────────────────────────┤
│  Aplicação     HTTP/HTTPS, WebSocket    Requests às APIs     │
│                REST, JSON                de IA (OpenAI etc.) │
├─────────────────────────────────────────────────────────────┤
│  Transporte    TCP (confiável)          Garantia de entrega  │
│                UDP (sem confirmação)    das respostas JSON   │
├─────────────────────────────────────────────────────────────┤
│  Internet      IP (IPv4 / IPv6)        Endereçamento dos     │
│                ICMP                    servidores de IA      │
├─────────────────────────────────────────────────────────────┤
│  Enlace        Ethernet, Wi-Fi (802.11)  Hardware do         │
│  Físico        Cabos, ondas de rádio     usuário             │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de uma requisição do CentralAI

```
Usuário clica "enviar mensagem"
        │
        ▼
Browser (JS) → HTTP POST /v1/chat/completions
        │         Header: Authorization: Bearer sk-...
        │         Body: { model, messages } (JSON)
        │
        ▼ TCP — three-way handshake
   SYN →
        ← SYN-ACK
   ACK →
        │
        ▼ TLS handshake (HTTPS)
   ClientHello →
        ← ServerHello + Certificate
   Finished →
        │
        ▼ HTTP Request transmitida (cifrada)
        │
        ▼ Servidor da OpenAI processa
        │
        ▼ HTTP Response 200 OK + JSON body
        │
        ▼ JS desserializa JSON → UI atualizada
```

---

## 2. HTTP — Protocolo de Transferência

O **HTTP (HyperText Transfer Protocol)** é o protocolo da camada de aplicação usado por todas as APIs de IA.

### 2.1 Métodos HTTP e equivalência REST

| Método   | Semântica REST         | Equivalente SQL | Uso no CentralAI                            |
|----------|------------------------|-----------------|---------------------------------------------|
| `GET`    | Recuperar recurso      | SELECT          | `GET /models` — listar modelos disponíveis  |
| `POST`   | Criar recurso          | INSERT          | `POST /chat/completions` — enviar mensagem  |
| `PUT`    | Substituir recurso     | UPDATE (total)  | `PUT /users/{id}` — substituir perfil       |
| `PATCH`  | Atualizar parcialmente | UPDATE (parcial)| `PATCH /users/{id}` — atualizar apenas plano|
| `DELETE` | Remover recurso        | DELETE          | `DELETE /favorites/{id}` — remover favorito |

### 2.2 Códigos de Status HTTP

| Código | Classe        | Significado                          | Cenário no CentralAI                       |
|--------|---------------|--------------------------------------|--------------------------------------------|
| `200`  | Sucesso       | OK — resposta com corpo              | Resposta da IA recebida                    |
| `201`  | Sucesso       | Created — recurso criado             | Usuário cadastrado no BD                   |
| `204`  | Sucesso       | No Content — sem corpo               | Favorito removido com sucesso              |
| `400`  | Erro cliente  | Bad Request — payload inválido       | JSON malformado enviado à API              |
| `401`  | Erro cliente  | Unauthorized — sem autenticação      | API key ausente ou inválida                |
| `403`  | Erro cliente  | Forbidden — autenticado mas negado   | Plano gratuito tentando recurso premium    |
| `404`  | Erro cliente  | Not Found — recurso não existe       | ID de IA não encontrado                    |
| `422`  | Erro cliente  | Unprocessable Entity — validação     | Campo obrigatório ausente no body          |
| `429`  | Erro cliente  | Too Many Requests — rate limit       | Excedeu cota de requisições da API         |
| `500`  | Erro servidor | Internal Server Error                | Falha no servidor da OpenAI                |
| `503`  | Erro servidor | Service Unavailable — sobrecarga     | API de IA temporariamente indisponível     |

### 2.3 HTTP Headers relevantes

```http
# Requisição do CentralAI para API de IA
POST /v1/chat/completions HTTP/1.1
Host: api.openai.com
Authorization: Bearer sk-proj-xxxxxxxxxxxx   ← autenticação
Content-Type: application/json               ← tipo do corpo
Accept: application/json                     ← tipo esperado na resposta
User-Agent: CentralAI/1.0.0                 ← identificação do cliente
Origin: http://localhost:3000               ← para CORS

# Resposta da API
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
X-RateLimit-Limit: 10000                    ← limite de requisições
X-RateLimit-Remaining: 9998                 ← requisições restantes
X-Request-Id: req_abc123                    ← ID para rastreabilidade
```

---

## 3. REST — Arquitetura de APIs

**REST (Representational State Transfer)** é um estilo arquitetural para APIs HTTP. As APIs de IA (OpenAI, Anthropic, Gemini) são RESTful.

### 3.1 Constraints REST

| Constraint             | Descrição                                    | Implementação no CentralAI                   |
|------------------------|----------------------------------------------|----------------------------------------------|
| **Client-Server**      | Frontend e backend são separados             | Browser ↔ API de IA                          |
| **Stateless**          | Cada requisição é independente               | JWT/API key em cada header, sem sessão        |
| **Cacheable**          | Respostas podem ser cacheadas                | GET /models pode ser cacheado                 |
| **Uniform Interface**  | URLs identificam recursos, métodos indicam ação | `/chat/completions`, `/models`             |
| **Layered System**     | Cliente não sabe se há proxy entre eles      | CDN, balanceador de carga transparente        |

### 3.2 Design de API REST para o CentralAI (se houvesse backend)

```
# Recursos e endpoints REST hipotéticos

GET    /api/v1/ais                    # listar todas as IAs do catálogo
GET    /api/v1/ais/{id}              # detalhes de uma IA
GET    /api/v1/ais?type=text&rating=4.5  # filtrar com query params

GET    /api/v1/users/{id}/favorites  # favoritos do usuário
POST   /api/v1/users/{id}/favorites  # adicionar favorito
DELETE /api/v1/users/{id}/favorites/{aiId}  # remover favorito

POST   /api/v1/chat/messages         # enviar mensagem ao assistente
GET    /api/v1/chat/messages?userId={id}&limit=20  # histórico paginado

GET    /api/v1/recommendations?userId={id}  # recomendações personalizadas

# Versionamento na URL (/v1/) — boa prática REST
# Substantivos no plural (/ais, /users) — recursos, não ações
# Sub-recursos para relacionamentos (/users/{id}/favorites)
```

### 3.3 JSON — Formato de Troca

```javascript
// js/extensions.js — OpenAIAdapter processa resposta JSON da API REST
class OpenAIAdapter extends AIAPIAdapter {
    adapt(rawResponse) {
        // rawResponse é o JSON retornado por POST /v1/chat/completions:
        // {
        //   "id": "chatcmpl-xxx",
        //   "choices": [{
        //     "message": { "role": "assistant", "content": "..." },
        //     "finish_reason": "stop"
        //   }],
        //   "usage": { "prompt_tokens": 15, "completion_tokens": 42 }
        // }
        return {
            content: rawResponse.choices[0].message.content,
            role:    rawResponse.choices[0].message.role,
            model:   rawResponse.model,
            usage:   rawResponse.usage,
        };
    }

    formatPrompt(messages, options = {}) {
        return {
            model:    options.model ?? 'gpt-4o',
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            max_tokens: options.maxTokens ?? 1000,
            temperature: options.temperature ?? 0.7,
        };
    }
}
```

---

## 4. HTTPS e Segurança

**HTTPS = HTTP + TLS (Transport Layer Security)**. Toda comunicação com APIs de IA deve usar HTTPS.

### 4.1 O que TLS garante

| Propriedade        | O que protege                                    | Sem TLS (HTTP puro)                   |
|--------------------|--------------------------------------------------|---------------------------------------|
| **Confidencialidade** | Dados cifrados — ninguém no meio lê            | API keys visíveis em texto claro      |
| **Integridade**    | Dados não foram alterados em trânsito            | Man-in-the-middle pode modificar body |
| **Autenticidade**  | Servidor é realmente api.openai.com (certificado)| Possível conectar ao servidor errado  |

### 4.2 Boas práticas de segurança no CentralAI

```javascript
// ✅ CORRETO — API key nunca no código-fonte ou frontend
// js/extensions.js — adaptadores usam key do ambiente/config
class OpenAIAdapter extends AIAPIAdapter {
    async request(messages, options) {
        // Em produção: key vem de variável de ambiente no servidor
        // No frontend demo: mock sem key real
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.#apiKey}`,  // nunca hardcoded
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.formatPrompt(messages, options)),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return this.adapt(await response.json());
    }
}

// ❌ ERRADO — nunca fazer:
// const API_KEY = "sk-proj-xxxx"; // exposta no código
// fetch(`http://api.openai.com/...`) // sem HTTPS
```

---

## 5. CORS — Cross-Origin Resource Sharing

**CORS** é um mecanismo de segurança do browser que controla quais origens podem fazer requisições a um servidor.

### 5.1 O Problema e a Solução

```
Sem CORS (política de mesma origem):
  http://centralai.app ──► http://centralai.app/api  ✅ mesma origem
  http://centralai.app ──► https://api.openai.com    ❌ bloqueado pelo browser

Com CORS (headers de permissão):
  https://api.openai.com responde com:
  Access-Control-Allow-Origin: https://centralai.app  ✅ permitido
  Access-Control-Allow-Methods: GET, POST
  Access-Control-Allow-Headers: Authorization, Content-Type
```

### 5.2 Preflight Request (OPTIONS)

```http
# Para métodos não-simples (POST com JSON), o browser envia um "preflight":
OPTIONS /v1/chat/completions HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Authorization, Content-Type

# Servidor responde liberando:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400   ← cache preflight por 24h
```

---

## 6. WebSocket — Comunicação Bidirecional

Para chat em tempo real, **WebSocket** é mais eficiente que HTTP:

```
HTTP (request-response):          WebSocket (full-duplex):
  Client: POST /chat              Client ←──────────── Server
  Server: 200 + resposta          Client ──────────── Server
  (nova conexão por mensagem)     (conexão persistente)
```

```javascript
// Exemplo de WebSocket para streaming de resposta da IA
// (demonstra conceito — CentralAI atual usa mock síncrono)
function connectWebSocket(endpoint) {
    const ws = new WebSocket(endpoint);   // ws:// ou wss:// (seguro)

    ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'auth', token: 'Bearer sk-...' }));
    };

    ws.onmessage = (event) => {
        const chunk = JSON.parse(event.data);
        // Streaming: cada chunk atualiza a UI progressivamente
        appendToLastMessage(chunk.delta);
    };

    ws.onclose = (event) => {
        console.log(`WebSocket closed: ${event.code} ${event.reason}`);
    };

    ws.onerror = (error) => console.error('WebSocket error:', error);

    return ws;
}
```

---

## Parte 2 — Sistemas Operacionais

---

## 7. JavaScript e o Sistema Operacional

JavaScript roda sobre o **motor V8** (Chrome/Node.js), que por sua vez usa os recursos do SO.

```
┌─────────────────────────────────────────────┐
│              Código JavaScript              │
├─────────────────────────────────────────────┤
│         V8 Engine (JIT compiler)            │
├─────────────────────────────────────────────┤
│     Web APIs (Browser) / libuv (Node.js)    │
│   setTimeout, fetch, DOM, localStorage      │
├─────────────────────────────────────────────┤
│      Sistema Operacional (Windows/Linux)    │
│   Threads, Sockets, File System, Timer      │
└─────────────────────────────────────────────┘
```

---

## 8. Event Loop — Concorrência sem Threads

JavaScript é **single-threaded** mas executa operações assíncronas via **Event Loop**.

### 8.1 Estrutura do Event Loop

```
┌──────────────────────────────────────────────────────┐
│                    V8 Heap                           │
│  (objetos AITool, Repository, plugins...)            │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                    Call Stack                        │
│  Frame 3: getRecommendations()                       │
│  Frame 2: app._renderRecommendations()               │
│  Frame 1: app.init()                                 │
└──────────────────────────────────────────────────────┘
              ↑ (pilha vazia → event loop pega próximo)
┌──────────────────────────────────────────────────────┐
│                  Microtask Queue                     │
│  Promise.then(), async/await continuations           │
│  [processados ANTES do próximo event do macro-queue] │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                  Macrotask Queue                     │
│  setTimeout, setInterval, I/O callbacks              │
│  [cada iteração do event loop pega UM macrotask]     │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│             Web APIs (Browser) / libuv               │
│  - fetch() → rede via SO → callback quando resolve  │
│  - localStorage → File System via SO                │
│  - setTimeout → timer do SO                         │
└──────────────────────────────────────────────────────┘
```

### 8.2 Por que JS não bloqueia a UI?

```javascript
// js/extensions.js — ChatPlugin.sendMessage() não bloqueia a UI
async sendMessage(text) {
    // 1. Renderiza mensagem do usuário IMEDIATAMENTE (síncrono)
    this.messages.push({ role: 'user', content: text });
    this.#render();   // DOM atualizado antes de esperar a resposta

    // 2. Despacha para Web APIs (não bloqueia Call Stack)
    const reply = await this.#mockReply(text);
    //            ↑ a partir daqui, o Event Loop pode processar outros eventos
    //              (o usuário pode scrollar, clicar, etc. enquanto aguarda)

    // 3. Quando Promise resolve, volta ao Call Stack via Microtask Queue
    this.messages.push({ role: 'assistant', content: reply });
    this.#render();
}

// Se fosse SÍNCRONO (bloquearia a UI):
// const reply = fetch(...).responseText;  // NÃO existe — browsers não permitem
```

---

## 9. Gerenciamento de Memória

### 9.1 Garbage Collection

JavaScript usa **coleta de lixo automática** (Mark and Sweep). O programador não aloca/desaloca memória manualmente.

```javascript
// Ciclo de vida de um objeto AITool

// 1. Alocação no heap
const ai = new ChatGPT('chatgpt-4o', 'GPT-4o', ...);

// 2. Referência forte — NÃO coletado pelo GC
window.CentralAI.catalog.add(ai);

// 3. Referência fraca (WeakMap) — NÃO impede coleta
const metadataCache = new WeakMap();
metadataCache.set(ai, { featured: true });

// 4. Se todas as referências fortes forem removidas → GC coleta
window.CentralAI.catalog.remove(ai.id);
// ai agora pode ser coletado
// metadataCache.get(ai) → undefined automaticamente
```

### 9.2 WeakMap vs Map — Implicação de Memória

```javascript
// ❌ Map — mantém referência forte, impede GC (vazamento de memória)
const metaMap = new Map();
metaMap.set(aiObject, { score: 0.9 });
// Mesmo que aiObject seja removido do catálogo,
// metaMap ainda mantém referência → NUNCA coletado pelo GC

// ✅ WeakMap — referência fraca, permite GC
const metaWeakMap = new WeakMap();
metaWeakMap.set(aiObject, { score: 0.9 });
// Quando aiObject não tem mais referências fortes,
// GC coleta aiObject E remove a entrada do WeakMap automaticamente
```

### 9.3 Vazamentos de Memória Comuns (e como o CentralAI evita)

```javascript
// PROBLEMA: Event listeners não removidos
element.addEventListener('click', handler);
// Se element for removido do DOM, handler ainda está na memória

// SOLUÇÃO no CentralAI: EventEmitter retorna função de remoção (closure)
const unsubscribe = this.catalogService.on('filter:applied', handler);
// Quando componente é destruído:
unsubscribe();  // remove o listener — GC pode coletar handler
```

---

## 10. Processos e Threads no Contexto do Browser

### 10.1 Arquitetura Multi-Processo do Chrome

```
┌─────────────────────────────────────────────────────┐
│                  Browser Process                    │
│  (UI, gerenciamento de abas, rede)                  │
└─────────────────────────────────────────────────────┘
        │                │                │
        ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Renderer   │  │  Renderer   │  │  Renderer   │
│  Process    │  │  Process    │  │  Process    │
│ (Aba 1)     │  │ (Aba 2)     │  │ (Aba 3)     │
│ CentralAI   │  │ outra página│  │ outra página│
│ V8 + DOM    │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
```

Cada aba roda em **processo separado** — isolamento de memória e falhas.

### 10.2 Web Workers — Paralelismo Verdadeiro

```javascript
// Para tarefas pesadas (ex: indexação de todos as IAs), Web Worker evita
// travar a UI — roda em thread separada

// main.js
const worker = new Worker('js/indexWorker.js');
worker.postMessage({ ais: AI_DATABASE });  // serializa e envia para outra thread

worker.onmessage = (event) => {
    // Recebe índice pronto — não bloqueou a UI durante processamento
    searchIndex = event.data.index;
};

// indexWorker.js (thread separada — sem acesso ao DOM)
self.onmessage = (event) => {
    const index = new SearchIndex();
    index.build(event.data.ais);   // processamento pesado em outra thread
    self.postMessage({ index: index.export() });
};

// No CentralAI atual (frontend puro, sem Worker):
// O SearchIndex é construído sincronamente (poucos itens → aceitável)
// Em produção com milhares de IAs: Worker seria necessário
```

---

## 11. localStorage — Persistência no Browser

`localStorage` é a camada de persistência do CentralAI — implementada pelo browser usando o **sistema de arquivos do SO**.

```
JavaScript (Repository Pattern)
        │
        ▼
  localStorage API (Web API)
        │
        ▼
  Browser Storage Engine (IndexedDB internamente em alguns casos)
        │
        ▼
  Sistema de Arquivos do SO
  (AppData/Local/Google/Chrome/User Data/Default/Storage/...)
```

### 11.1 Limites e Características

| Característica    | localStorage           | sessionStorage          | IndexedDB             |
|-------------------|------------------------|-------------------------|-----------------------|
| Persistência      | Permanente             | Só na aba/sessão         | Permanente            |
| Capacidade        | ~5 MB por origem       | ~5 MB por sessão         | Centenas de MB        |
| Tipo de dados     | Strings (JSON.stringify)| Strings                 | Objetos estruturados  |
| Acesso            | Síncrono               | Síncrono                | Assíncrono (Promise)  |
| Threads           | Bloqueante (main thread)| Bloqueante             | Non-blocking          |
| Uso no CentralAI  | ✅ BaseRepository       | —                       | Roadmap futuro        |

```javascript
// js/repository.js — BaseRepository.#read() / #write()
#read() {
    const raw = localStorage.getItem(this.#store);   // I/O síncrono com SO
    return raw ? JSON.parse(raw) : [];               // deserialização JSON
}

#write(rows) {
    localStorage.setItem(this.#store, JSON.stringify(rows));  // serialização
}
// O browser lida com o I/O de arquivo — JS não gerencia o SO diretamente
```

---

## 12. Resumo — Conceitos de SO aplicados ao Browser

| Conceito SO              | Equivalente no Browser/JS                          | Onde no CentralAI              |
|--------------------------|-----------------------------------------------------|-------------------------------|
| **Processo**             | Aba do browser (Renderer Process isolado)           | CentralAI roda em 1 aba       |
| **Thread**               | Event Loop thread (single) + Worker threads         | Todo o JS é single-threaded   |
| **Escalonamento**        | Event Loop — gerencia qual callback executa         | setTimeout, Promises          |
| **Memória virtual**      | V8 Heap — alocação e GC automático                  | Objetos AITool, Repository    |
| **I/O não-bloqueante**   | fetch(), localStorage (via Web APIs → libuv)        | ChatPlugin, Repository        |
| **IPC**                  | postMessage() entre tabs/workers                    | Web Worker pattern            |
| **Sistema de arquivos**  | localStorage / IndexedDB (abstração do SO)          | BaseRepository#read/#write    |
| **Sincronização**        | Promises, async/await, microtask queue              | ChatPlugin.sendMessage()      |

---

*CentralAI © 2025 · UFG · Instituto de Informática · Redes de Computadores & Sistemas Operacionais*
