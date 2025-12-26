# 📚 Decisões Técnicas — SellTrack PDV (MVP Enxuto)

**Versão:** 1.1  
**Gerado em:** 26/12/2025

---

## 🎯 Contexto

MVP focado em PDV web, com backup na nuvem, sem modo offline (apenas aviso de conexão instável), operações rápidas e controle de variações de produto.  
Objetivo: entrega rápida, robustez transacional e fácil evolução futura.

---

## 🏗️ Arquitetura

- **Modelo:** Monolito Modular
- **Motivo:** equipe pequena, prazo curto, modularização clara por domínio
- **Risco:** acoplamento → mitigado com boundaries e testes de integração

---

## ⚙️ Stack Principal

- **Linguagem:** Node.js + JavaScript/TypeScript
- **Framework:** Express.js (NestJS pode ser considerado futuramente)
- **Banco:** PostgreSQL (Supabase managed)
- **ORM:** Knex.js (mais simples) ou Prisma (se houver familiaridade)
- **Autenticação:** Sessions + Cookies (`express-session` + `bcrypt`)
- **HTTP Client:** Axios
- **Logging/Erros:** Console.log no início + Sentry para erros críticos

---

## 🔐 Autenticação

- **Atual:** Sessions + Cookies
- **Hash:** bcrypt
- **Futuro:** JWT apenas se houver consumo por mobile/terceiros

---

## 📊 Observabilidade / DevOps

- Logs básicos (`console.log`)
- Erros críticos enviados para Sentry
- CI/CD: GitHub Actions (lint/test/build)
- Backups: snapshots automáticos do Postgres (Supabase) + export periódico para S3
- Restore: procedimento documentado e testado

---

## 🚀 Deploy

- **Dev:** Docker Compose (Postgres + app)
- **Produção:** Render (PaaS)
- **Secrets:** `.env` em dev, Secret Manager do Render em produção

---

## 📂 Estrutura de Código

./
├─ package.json
├─ tsconfig.json
├─ .env.example
├─ Dockerfile
├─ docker-compose.yml
├─ db/ (migrations, queries)
└─ src/
├─ index.js
├─ routes/
│ ├─ products.js
│ ├─ pos.js
│ ├─ orders.js
│ ├─ payments.js
│ └─ auth.js
├─ middleware/
└─ utils/

---

## 🧪 Testes Prioritários

- Fluxo de venda básico
- Concorrência simples de vendas no mesmo SKU
- Backup e restore do banco

---

## ⚠️ Pontos de Atenção

- UX no PDV: menos cliques, busca rápida por SKU, autocompletar
- Conexão instável: aviso claro ao usuário
- Índices no Postgres: `sku`, `variant_id`
- Planejar refatoração futura (payments, reports → microsserviços)

---

## ✅ Próximos Passos

1. Criar boilerplate (Express + PostgreSQL + Docker + GitHub Actions)
2. Implementar modelos iniciais (Product, Order, OrderItem, Payment, User)
3. Implementar endpoints e fluxos do PDV
4. Criar testes automatizados e scripts de carga simples
5. Configurar monitoramento mínimo (Sentry + logs) e backup automático

---
