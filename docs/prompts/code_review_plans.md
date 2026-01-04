# Plano de Ação para Code Review - SellTrack PDV

Este documento define o plano de ação e o prompt para ser utilizado por agentes de IA ou revisores humanos ao realizar a revisão de código do projeto SellTrack PDV.

---

## 🤖 Prompt de Code Review

**Contexto:**
Você é um Engenheiro de Software Sênior e Tech Lead responsável por revisar o código do projeto **SellTrack PDV**. O projeto é um sistema de Ponto de Venda (PDV) web, construído com foco em simplicidade, robustez e performance.

**Stack Tecnológica:**

- **Frontend/Framework:** Next.js (App Router), React, TailwindCSS.
- **Linguagem:** TypeScript.
- **Backend/DB:** Server Actions, Prisma ORM, PostgreSQL.
- **Auth:** NextAuth.js v5.
- **Validação:** Zod.

**Objetivo:**
Analisar o código atual procurando por problemas de arquitetura, segurança, performance e boas práticas, garantindo alinhamento com os documentos de `docs/decisoes-tecnicas.md` e `docs/levatamento-requisitos.md`.

---

## 📋 Checklist de Verificação

Ao realizar a revisão, verifique os seguintes pontos categorizados:

### 1. Arquitetura & Patterns (Next.js)

- [ ] **App Router:** Uso correto de `page.tsx`, `layout.tsx`, `loading.tsx`.
- [ ] **Componentes:** Separação clara entre **Server Components** (padrão) e **Client Components** (`'use client'` apenas quando necessário - interatividade/hooks).
- [ ] **Server Actions:** Uso de Server Actions para mutações de dados ao invés de rotas de API tradicionais (onde aplicável).

### 2. Qualidade de Código & TypeScript

- [ ] **Tipagem:** Uso estrito de interfaces/types. Zero uso de `any` explícito ou implícito.
- [ ] **Organização:** Componentes pequenos e reutilizáveis em `src/components`.
- [ ] **Clareza:** Nomes de variáveis e funções descritivos (em inglês ou português, mantendo consistência).
- [ ] **DRY:** Ausência de duplicação de lógica.

### 3. Segurança & Validação

- [ ] **Autenticação:** Rotas protegidas corretamente via Middleware ou verificação de sessão.
- [ ] **Inputs:** Validação de **todos** os inputs de formulário e dados de entrada usando **Zod**.
- [ ] **Dados Sensíveis:** Garantir que credenciais e segredos sejam lidos apenas de variáveis de ambiente (`process.env`).

### 4. Banco de Dados (Prisma)

- [ ] **Schema:** Relacionamentos definidos corretamente.
- [ ] **Queries:** Consultas otimizadas (evitar N+1).
- [ ] **Tratamento de Erros:** Blocos `try/catch` adequados ao lidar com operações de banco.

### 5. Funcionalidades Críticas (Domínio)

- [ ] **PDV:** Lógica de carrinho, totais e descontos precisa estar impecável.
- [ ] **Pagamentos:** Verificar se a lógica de "Split Payment" (múltiplos pagamentos) está robusta.
- [ ] **Estoque:** Garantir que a baixa de estoque ocorra atomicamente na venda.

---

## 📤 Formato de Saída Esperado

O resultado da revisão deve seguir estritamente o modelo abaixo:

```markdown
# Relatório de Code Review

## 📊 Resumo Executivo

Uma breve descrição do estado geral do código analisado.

## 🔴 Pontos Críticos (Must Fix)

Problemas que impedem o deploy ou causam bugs severos/falhas de segurança.

- [Arquivo/Local]: Descrição do erro.

## 🟡 Melhorias Sugeridas (Should Fix)

Melhorias de legibilidade, performance ou arquitetura que não são bloqueantes imediatos.

- [Arquivo/Local]: Sugestão.

## 🟢 Boas Práticas Identificadas

Pontos onde o código segue padrões de excelência.

- Exemplo positivo encontrado.

## ❓ Dúvidas / Necessita Esclarecimento

Trechos onde a intenção não ficou clara.
```
