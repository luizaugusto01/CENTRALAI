# Requisitos de Software — CentralAI

> Disciplina: Padrões de Projeto de Software · UFG · INF  
> Versão: 1.0 · Data: 2025-05  
> Método: User Stories + Casos de Uso + Critérios de Aceitação

---

## 1. Stakeholders

| Papel              | Interesse na plataforma                                              |
|--------------------|----------------------------------------------------------------------|
| Usuário Individual | Descobrir e usar IAs sem precisar criar contas em múltiplos sites    |
| Empresa            | Centralizar o uso de IAs pela equipe e controlar custos              |
| Instituição Ensino | Usar IAs como ferramenta pedagógica de forma centralizada            |
| Administrador      | Gerenciar o catálogo, usuários e relatórios da plataforma            |
| Desenvolvedor      | Integrar IAs via API única sem lidar com múltiplas documentações     |

---

## 2. Requisitos Funcionais

### RF-01 — Catálogo de IAs
- O sistema deve exibir uma lista de IAs com nome, empresa, tipo, descrição, prós, contras e preço.
- O catálogo deve ser filtrável por tipo: Texto, Imagem, Código, Áudio e Multimodal.
- O catálogo deve oferecer busca textual por nome, empresa ou descrição.
- **Prioridade:** Alta · **Status:** ✅ Implementado

### RF-02 — Detalhamento de IA
- Ao clicar em "Ver detalhes", o sistema deve abrir um painel com todas as informações da IA.
- O painel deve incluir: prós, contras, preços, disponibilidade de API e link para o site oficial.
- **Prioridade:** Alta · **Status:** ✅ Implementado

### RF-03 — Comparador
- O sistema deve permitir selecionar até 3 IAs para comparação simultânea.
- A comparação deve ser exibida em tabela com critérios: tipo, rating, preço, API, prós e contras.
- Deve destacar visualmente a melhor IA em cada critério.
- **Prioridade:** Alta · **Status:** ✅ Implementado

### RF-04 — Recomendador
- O sistema deve oferecer um formulário para coletar: tipo de tarefa, orçamento e prioridade.
- O sistema deve recomendar as 3 IAs mais adequadas com justificativa para cada recomendação.
- A estratégia de recomendação deve variar com base na prioridade informada.
- **Prioridade:** Alta · **Status:** ✅ Implementado

### RF-05 — Favoritos
- O usuário deve poder favoritar/desfavoritar IAs com feedback visual imediato.
- Os favoritos devem persistir entre sessões (localStorage).
- **Prioridade:** Média · **Status:** ✅ Implementado

### RF-06 — Planos e Preços
- O sistema deve exibir 3 planos: Free, Pro e Enterprise com recursos listados.
- Deve haver alternância entre cobrança mensal e anual com atualização em tempo real dos preços.
- **Prioridade:** Média · **Status:** ✅ Implementado

### RF-07 — Notificações de Feedback
- O sistema deve exibir notificações (toasts) após ações do usuário (favoritar, comparar, recomendar).
- As notificações devem desaparecer automaticamente após 3 segundos.
- **Prioridade:** Média · **Status:** ✅ Implementado

### RF-08 — Navegação
- O sistema deve permitir navegação suave (smooth scroll) entre seções via menu.
- O menu mobile deve ser acessível via botão hamburger com animação.
- **Prioridade:** Média · **Status:** ✅ Implementado

### RF-09 — Animação de Estatísticas
- Os contadores de estatísticas devem animar ao entrar na viewport.
- **Prioridade:** Baixa · **Status:** ✅ Implementado

### RF-10 — Autenticação (Escopo Futuro)
- O sistema deve permitir cadastro e login de usuários.
- Usuários autenticados terão acesso a histórico, relatórios e automações.
- **Prioridade:** Alta · **Status:** 🔜 Versão futura

### RF-11 — Integração via API (Escopo Futuro)
- Usuários do plano Pro/Enterprise poderão enviar requisições às IAs diretamente pela plataforma.
- **Prioridade:** Alta · **Status:** 🔜 Versão futura

### RF-12 — Histórico de Uso (Escopo Futuro)
- O sistema deve registrar e exibir o histórico de IAs utilizadas e requisições feitas.
- **Prioridade:** Média · **Status:** 🔜 Versão futura

---

## 3. Requisitos Não-Funcionais

### RNF-01 — Desempenho
- A página deve carregar em menos de 3 segundos em conexão 4G.
- Eventos de busca no catálogo devem responder em menos de 100ms.
- A renderização de cards deve usar `requestAnimationFrame` e animações CSS quando possível.

### RNF-02 — Acessibilidade (WCAG 2.1 AA)
- Todos os elementos interativos devem ser operáveis via teclado.
- Componentes devem ter atributos ARIA corretos (role, aria-label, aria-pressed, aria-live).
- Skip link deve estar disponível para usuários de leitores de tela.
- Contraste mínimo de 4.5:1 para texto sobre fundo.
- Focus ring visível em todos os elementos focáveis.

### RNF-03 — Responsividade
- O layout deve funcionar em dispositivos móveis (320px), tablets (768px) e desktops (1024px+).
- O menu deve colapsar para hamburger em telas menores que 768px.

### RNF-04 — Compatibilidade
- A aplicação deve funcionar nos navegadores Chrome, Firefox, Safari e Edge (últimas 2 versões).
- Não deve depender de build tools (funciona ao abrir index.html diretamente).

### RNF-05 — Manutenibilidade
- O código deve ser organizado em camadas (Domain, Service, Presentation).
- Cada arquivo deve ter responsabilidade única (SRP — Single Responsibility Principle).
- Design patterns devem ser documentados com justificativa.

### RNF-06 — Segurança
- Nenhum dado sensível deve ser armazenado no localStorage.
- Links externos devem usar `rel="noopener noreferrer"` para prevenir tabnapping.
- Conteúdo HTML injetado dinamicamente deve ser tratado (sem `eval`, sem injeção de HTML não sanitizado).

### RNF-07 — Usabilidade (Nielsen)
- Feedback imediato para toda ação do usuário (≤1s).
- Mensagens de erro descritivas e acionáveis.
- Possibilidade de desfazer ações (favoritar/desfavoritar).
- Consistência visual em toda a aplicação (Design System via CSS Custom Properties).

### RNF-08 — Escalabilidade do Catálogo
- O sistema deve suportar a adição de novas IAs apenas via objeto de configuração em `AI_CONFIGS`.
- O AIFactory deve instanciar automaticamente novos tipos sem modificar código existente.

---

## 4. User Stories

### US-01
> **Como** usuário individual,  
> **quero** filtrar IAs por tipo de tarefa,  
> **para que** eu encontre rapidamente a ferramenta certa sem ler todas as opções.

**Critério de Aceitação:**
- [ ] Botões de filtro mudam de estado visual ao serem selecionados
- [ ] O catálogo atualiza imediatamente sem recarregar a página
- [ ] O contador de resultados reflete a quantidade filtrada

### US-02
> **Como** empresário,  
> **quero** comparar o custo-benefício de até 3 IAs simultaneamente,  
> **para que** eu possa tomar uma decisão de compra fundamentada.

**Critério de Aceitação:**
- [ ] Seleção de pelo menos 2 IAs habilita o botão "Comparar"
- [ ] A tabela destaca a melhor IA em rating e preço
- [ ] O botão "Limpar" reseta os selects e a tabela

### US-03
> **Como** estudante,  
> **quero** receber uma recomendação personalizada de IA,  
> **para que** eu use a mais adequada à minha tarefa sem pesquisar manualmente.

**Critério de Aceitação:**
- [ ] Formulário valida campo obrigatório (tipo de tarefa) antes de recomendar
- [ ] São exibidas 3 recomendações com justificativa
- [ ] As recomendações mudam conforme a prioridade selecionada

### US-04
> **Como** usuário recorrente,  
> **quero** salvar minhas IAs favoritas,  
> **para que** eu as acesse rapidamente em próximas visitas.

**Critério de Aceitação:**
- [ ] Ícone de coração muda imediatamente ao favoritar
- [ ] Toast confirma a ação
- [ ] Favoritos persistem após fechar e reabrir o navegador

---

## 5. Casos de Uso Principais

```
┌─────────────────────────────────────────────────────┐
│                    CentralAI                         │
│                                                      │
│  [Explorar Catálogo]──────────────► Usuário          │
│  [Comparar IAs]───────────────────► Usuário          │
│  [Receber Recomendação]───────────► Usuário          │
│  [Favoritar IA]───────────────────► Usuário          │
│  [Ver Detalhes da IA]─────────────► Usuário          │
│  [Assinar Plano]──────────────────► Usuário          │
│                                                      │
│  [Gerenciar Catálogo]─────────────► Administrador    │
│  [Acessar via API]────────────────► Desenvolvedor    │
└─────────────────────────────────────────────────────┘
```
