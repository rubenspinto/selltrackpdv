# 📚 Decisões Técnicas — SellTrack PDV (Resumo)

**Versão:** 1.0  
**Gerado em:** 20/12/2025

---

**Contexto rápido:** com base no levantamento de requisitos (MVP focado em PDV web, backup na nuvem, sem modo offline, necessidade de operações rápidas no PDV e controle de variações de produto), escolhemos arquitetura e stack que favoreçam entrega rápida, robustez transacional e fácil evolução.

**Decisões principais (resumo):**

- Arquitetura: **Monolito Modular**
- Linguagem: **Node.js + TypeScript**
- Framework Back-end: **NestJS** (recomendado) — alternativa: Express para protótipo rápido
- ORM: **Prisma**
- Banco de dados: **PostgreSQL** (managed) + **Redis** (cache/filas)
- Autenticação: **Sessions + Cookies** com `passport-local` (hash `argon2`) — alternativa gerenciada: Supabase Auth
- Filas / Jobs: **BullMQ** (com `ioredis`)
- Export .xlsx: **exceljs**
- Validação: **zod**
- Logging: **pino** + integração com **Sentry**
- Websockets: **socket.io** (se precisar de atualizações em tempo real no PDV)
- Ícones front-end: **Phosphor Icons** (ou Heroicons se usar Tailwind)
- Deploy: `Docker` + Docker Compose para dev; produção: VPS (DigitalOcean/Hetzner) ou PaaS (Render/Railway)
- CI/CD: **GitHub Actions**

---

## 1. Arquitetura

- Decisão: Monolito Modular.
- Justificativa: equipe pequena, prazo curto para MVP, necessidade de rodar PDV rápido. Monolito modular permite desenvolver rápido e manter separação de responsabilidades (módulos: products, pos, orders, payments, auth, reports), facilitando extração futura de serviços.
- Risco e mitigação: acoplamento se não modularizar — mitigação: regras claras de boundaries entre módulos, contratos/DTOs e testes de integração sobre fluxos críticos (venda/estoque/pagamento).

## 2. Linguagem e Framework

- Linguagem: Node.js com TypeScript — combina com front-end JS/TS e acelera integração entre camadas.
- Framework: NestJS — opinionated, injeção de dependência, modularização clara, integrações com Prisma/Bull/etc. Alternativa para protótipo menor: Express + estrutura modular.

## 3. Persistência e ORM

- Banco primário: PostgreSQL (managed preferível: Supabase/RDS/Neon/ElephantSQL). Razões: ACID, complexidade relacional (produto pai/filho), maturidade em transações.
- Cache/Store para sessões e filas: Redis.
- ORM: Prisma — vantagens: excelente DX em TypeScript, migrations, tipagem automática, fácil modelagem de relações pai/filho.

Regras para consistência de estoque (importante para PDV):

- Executar operação de fechamento de venda em uma transação que envolve `ORDER`, `ORDER_ITEM` e `PAYMENT`.
- Para concorrência, usar `UPDATE ... WHERE stock >= qty` com checagem de linhas afetadas ou `SELECT ... FOR UPDATE` dentro de transação.

## 4. Autenticação e Autorização

- Estratégia MVP: `Sessions + Cookies` (store em Redis ou Postgres via `connect-pg-simple`) + `passport-local` para login com senha. Senhas com `argon2`.
- Motivo: simplicidade, controle de sessão e facilidade na UX do PDV (evita lidar com refresh tokens/expiração complexa no início).
- Alternativa: JWT se a API for consumida por mobile/terceiros; Auth0/Supabase Auth se preferir offload.

## 5. Bibliotecas recomendadas (detalhado)

- ORM: `prisma` + `@prisma/client`
- Hash de senha: `argon2`
- Sessões: `express-session` + `connect-pg-simple` ou `connect-redis`
- Auth: `passport`, `@nestjs/passport`, `passport-local`
- Validação: `zod` (server-side + contratos)
- Filas: `bullmq` + `ioredis`
- Exportação: `exceljs` (XLSX) e `fast-csv` (CSV)
- Logging: `pino`, `pino-http` e `@sentry/node`
- Websocket: `socket.io`
- HTTP client: `axios` (ou `undici` se performance for crítica)
- Ícones front-end: `phosphor-react` (React) ou `phosphor-vue` (Vue)

## 6. Observabilidade / DevOps

- Logs estruturados com `pino`, envio de erros/exceptions para `Sentry`.
- Métricas: Prometheus + Grafana (ou soluções managed se preferir simplificar).
- CI: GitHub Actions para lint/test/build/docker image.
- Backups: snapshots do Postgres (managed) + export periódico de dados para storage (S3 / Supabase Storage). Testar restauração.

## 7. Deploy e Infra (MVP)

- Local/dev: `docker-compose` (Postgres + Redis + app).
- Produção: opções:
  - VPS (DigitalOcean, Hetzner) com Docker Compose / systemd — maior controle, bom custo.
  - PaaS (Render, Railway) — menos operação, deploy rápido.
- Gerenciar secrets em `.env` no deploy; preferir secret manager do provedor quando disponível.

## 8. Estrutura de código sugerida (monolito modular)

```
./
├─ package.json
├─ tsconfig.json
├─ .env.example
├─ Dockerfile
├─ docker-compose.yml
├─ prisma/
│  └─ schema.prisma
└─ src/
   ├─ main.ts
   ├─ app.module.ts
   ├─ modules/
   │  ├─ products/
   │  ├─ pos/
   │  ├─ orders/
   │  ├─ payments/
   │  ├─ auth/
   │  └─ reports/
   ├─ common/ (pipes, interceptors, filters)
   ├─ infra/ (db, redis, queue clients)
   └─ jobs/ (workers)
```

## 9. Fluxos críticos a testar / primeira priorização de testes

- Fluxo de venda com split payment (cenário de aceitação descrito no requisito).
- Concorrência de vendas no mesmo SKU (simular múltiplas requisições simultâneas).
- Geração de `.xlsx` com volume médio/alto (garantir performance <5s ou mover para background job e link de download).
- Backup e restore do banco (validar procedimento de recuperação).

## 10. Pontos de atenção e recomendações finais

- UX no PDV deve priorizar menos cliques; considerar pré-carregamento e busca por SKU com autocompletar.
- Validar UX em conexão instável: exibir aviso de conexão, tratar erros de forma clara (mesmo sem modo offline).
- Monitorar uso de recursos e latência das queries, otimizar índices no Postgres (por exemplo, index em `sku`, `variant_id`).
- Planejar tempo de refatoração: caso o produto escale, será simples extrair módulos (payments, reports) para microsserviços.

## 11. Próximos passos sugeridos (implementação)

1. Gerar boilerplate do projeto (NestJS + Prisma + Docker + GitHub Actions).
2. Implementar modelos Prisma iniciais (ProductParent, ProductVariant, Order, OrderItem, Payment, User).
3. Implementar endpoints e fluxos do PDV (buscar produto por SKU, adicionar ao carrinho, fechar venda em transação).
4. Testes automatizados para fluxos críticos e scripts de load/concurrency para validação do estoque.
5. Configurar monitoramento mínimo (Sentry + logs) e backup automático do banco.

---
