# Plano de Ação: Migração para NextAuth.js

Este plano detalha a migração do sistema de autenticação manual atual para o **NextAuth.js** (versão 5/Auth.js), visando maior segurança, manutenção simplificada e conformidade com boas práticas.

## Objetivos

- Simplificar a lógica de autenticação.
- Aumentar a segurança (proteção CSRF integrada, gestão de sessão segura).
- Padronizar o controle de rotas protegidas.

---

## 📋 Etapas de Implementação

### Fase 1: Preparação e Configuração

#### 1. Instalar dependências

```bash
npm install next-auth
```

#### 2. Configurar Variáveis de Ambiente

Gerar um segredo forte:

```bash
openssl rand -base64 32
```

Adicionar ao arquivo `.env`:

```env
AUTH_SECRET=<resultado_do_comando_acima>
# NEXTAUTH_URL é opcional no Vercel, mas útil localmente se houver problemas
# NEXTAUTH_URL=http://localhost:3000
```

---

### Fase 2: Implementação do NextAuth

#### 1. Criar arquivo de configuração de Autenticação

**Arquivo**: `src/lib/auth.config.ts`
Responsável por definir provedores (Credentials) e lógica de verificação de senha (usando `argon2` já instalado).

- Validar credenciais com Zod (`loginSchema`).
- Buscar usuário no banco via Prisma.
- Verificar hash da senha.
- Configurar callbacks de sessão para incluir o ID do usuário.

#### 2. Criar Route Handler

**Arquivo**: `src/app/api/auth/[...nextauth]/route.ts`
Ponto de entrada para as rotas de API do NextAuth (`/api/auth/signin`, `/api/auth/signout`, etc).

#### 3. Atualizar Middleware

**Arquivo**: `src/middleware.ts`
Substituir a lógica manual atual pela lógica baseada no `auth` do NextAuth.

- Redirecionar usuários não logados de rotas protegidas (`/pdv`, `/dashboard`) para `/login`.
- Redirecionar usuários logados de rotas públicas (`/login`, `/cadastro`) para `/pdv`.

---

### Fase 3: Adaptação do Frontend

#### 1. Atualizar Página de Login

**Arquivo**: `src/app/login/page.tsx`

- Remover chamadas manuais para `fetch('/api/auth/login')`.
- Utilizar `signIn("credentials", { ... })` do `next-auth/react`.
- Tratar erros retornados pelo `signIn`.

#### 2. Atualizar Logout

**Arquivo**: `src/app/pdv/page.tsx` (ou componente de Header futuro)

- Utilizar `signOut({ callbackUrl: "/login" })`.

---

### Fase 4: Limpeza

#### 1. Remover código legado

Arquivos a serem removidos após verificação:

- `src/app/api/auth/login/route.ts` (Substituído por NextAuth)
- `src/app/api/auth/logout/route.ts` (Substituído por NextAuth)
- `src/lib/auth.ts` (Manter apenas utilitários que não sejam de sessão/JWT manual, se houver)

---

## ✅ Critérios de Aceite

- [ ] Login funcionando com usuários existentes do banco de dados.
- [ ] Sessão persistida corretamente (cookies HTTP-only gerados pelo NextAuth).
- [ ] Middleware protegendo efetivamente a rota `/pdv`.
- [ ] Tentativa de acesso a `/pdv` sem logar redireciona para `/login`.
- [ ] Logout destrói a sessão e redireciona para login.
