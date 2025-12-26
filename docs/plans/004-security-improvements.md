# Plano de Ação: Melhorias de Segurança e Qualidade

## Estratégia Escolhida

Duas opções disponíveis:

### 🔵 Opção A: Migração para NextAuth.js (Recomendada)

- **Tempo total**: ~3-4 horas
- **Complexidade**: Baixa
- **Resultado**: Auth seguro, foco no PDV
- **Ideal para**: Entregar projeto funcional rapidamente

### 🟠 Opção B: Correção Manual Completa

- **Tempo total**: ~5-7 dias
- **Complexidade**: Alta
- **Resultado**: Entendimento profundo de segurança
- **Ideal para**: Aprendizado técnico

---

## 📋 OPÇÃO A: Migração para NextAuth.js

### Fase 1: Preparação (30 min)

#### 1.1 Criar branch

```bash
git checkout -b feature/migrate-to-nextauth
```

#### 1.2 Instalar dependências

```bash
npm install next-auth@beta
```

#### 1.3 Gerar segredo forte

```bash
openssl rand -base64 32
```

Adicionar ao `.env`:

```env
AUTH_SECRET=<resultado_do_comando_acima>
NEXTAUTH_URL=http://localhost:3000
```

---

### Fase 2: Configuração do NextAuth (1h)

#### 2.1 Criar arquivo de configuração

**Arquivo**: `src/lib/auth.config.ts`

```typescript
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { loginSchema } from "@/lib/validations/user";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validar
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Buscar usuário
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) return null;

        // Verificar senha
        const isValid = await argon2.verify(user.password, password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
```

#### 2.2 Criar route handler

**Arquivo**: `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
```

#### 2.3 Atualizar middleware

**Arquivo**: `src/middleware.ts`

```typescript
import { auth } from "@/lib/auth.config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Rotas públicas
  const isPublicRoute = ["/", "/login", "/cadastro"].includes(pathname);

  // Rotas protegidas
  const isProtectedRoute =
    pathname.startsWith("/pdv") || pathname.startsWith("/dashboard");

  // Usuário logado tentando acessar login/cadastro → /pdv
  if (isLoggedIn && (pathname === "/login" || pathname === "/cadastro")) {
    return NextResponse.redirect(new URL("/pdv", req.url));
  }

  // Usuário não logado tentando acessar rota protegida → /login
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

---

### Fase 3: Adaptar Frontend (1h)

#### 3.1 Atualizar página de login

**Arquivo**: `src/app/login/page.tsx`

Substituir a chamada `fetch('/api/auth/login')` por:

```typescript
import { signIn } from "next-auth/react";

// No handleSubmit:
const result = await signIn("credentials", {
  email: formData.email,
  password: formData.password,
  redirect: false,
});

if (result?.error) {
  toast.error("Credenciais inválidas");
  return;
}

toast.success("Login realizado com sucesso!");
router.push("/pdv");
```

#### 3.2 Atualizar página de logout

**Arquivo**: `src/app/pdv/page.tsx`

```typescript
import { signOut } from "next-auth/react";

const handleLogout = async () => {
  await signOut({ redirect: true, callbackUrl: "/login" });
  toast.success("Logout realizado com sucesso!");
};
```

---

### Fase 4: Limpeza (30 min)

#### 4.1 Remover arquivos antigos

```bash
rm src/app/api/auth/login/route.ts
rm src/app/api/auth/logout/route.ts
rm src/lib/auth.ts  # (manter só validations)
```

#### 4.2 Atualizar .gitignore

```
.env
.env.local
```

---

### Fase 5: Testes (30 min)

- [ ] Login com credenciais válidas
- [ ] Login com credenciais inválidas
- [ ] Logout
- [ ] Acesso a /pdv sem login (deve redirecionar)
- [ ] Acesso a /login estando logado (deve redirecionar para /pdv)
- [ ] Cadastro de novo usuário + login

---

## 📋 OPÇÃO B: Correção Manual Completa

### 🔴 Fase 1: Correções Críticas (Dia 1-2)

#### 1.1 Segredo JWT obrigatório

**Arquivo**: `src/lib/auth.ts`

```typescript
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido. Configure a variável de ambiente.");
}

const secret = new TextEncoder().encode(JWT_SECRET);
```

**Arquivo**: `.env.example`

```env
JWT_SECRET=your-super-secret-key-here-min-32-chars
```

**Teste**: Rodar app sem JWT_SECRET deve falhar

---

#### 1.2 Proteção CSRF

**Instalar**:

```bash
npm install csrf
```

**Arquivo**: `src/lib/csrf.ts`

```typescript
import { createCsrfProtect } from "csrf";

const csrfProtect = createCsrfProtect({
  secret: process.env.CSRF_SECRET || "csrf-secret-change-me",
});

export async function generateCsrfToken(): Promise<string> {
  return csrfProtect.generateToken();
}

export async function validateCsrfToken(token: string): Promise<boolean> {
  try {
    await csrfProtect.verifyToken(token);
    return true;
  } catch {
    return false;
  }
}
```

**Atualizar rotas**:

```typescript
// src/app/api/auth/login/route.ts
export async function POST(request: NextRequest) {
  const csrfToken = request.headers.get("x-csrf-token");

  if (!csrfToken || !(await validateCsrfToken(csrfToken))) {
    return NextResponse.json(
      { success: false, errors: { _form: ["Token CSRF inválido"] } },
      { status: 403 }
    );
  }

  // ... resto do código
}
```

**Frontend** (`login/page.tsx`):

```typescript
const [csrfToken, setCsrfToken] = useState('');

useEffect(() => {
  fetch('/api/auth/csrf')
    .then(r => r.json())
    .then(data => setCsrfToken(data.token));
}, []);

// No fetch:
headers: {
  'Content-Type': 'application/json',
  'X-CSRF-Token': csrfToken,
}
```

---

#### 1.3 Invalidação de JWT no logout

**Criar tabela**:

```prisma
// prisma/schema.prisma
model RevokedToken {
  id        String   @id @default(cuid())
  token     String   @unique
  revokedAt DateTime @default(now())
  expiresAt DateTime
}
```

**Migrar**:

```bash
npx prisma migrate dev --name add_revoked_tokens
```

**Arquivo**: `src/lib/auth.ts`

```typescript
export async function revokeToken(token: string): Promise<void> {
  const payload = await verifySession(token);
  if (!payload?.exp) return;

  await prisma.revokedToken.create({
    data: {
      token,
      expiresAt: new Date(payload.exp * 1000),
    },
  });
}

export async function isTokenRevoked(token: string): Promise<boolean> {
  const revoked = await prisma.revokedToken.findUnique({
    where: { token },
  });
  return !!revoked;
}

// Atualizar verifySession:
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    // Verificar se foi revogado
    if (await isTokenRevoked(token)) {
      return null;
    }

    const { payload } = await jwtVerify(token, secret);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
```

**Rota de logout**:

```typescript
// src/app/api/auth/logout/route.ts
export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (token) {
    await revokeToken(token);
  }

  await deleteSession();

  return NextResponse.json({
    success: true,
    message: "Logout realizado com sucesso",
  });
}
```

---

#### 1.4 Forçar HTTPS em produção

**Arquivo**: `next.config.ts`

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};
```

**Middleware**:

```typescript
// src/middleware.ts
if (process.env.NODE_ENV === "production" && !request.url.startsWith("https")) {
  return NextResponse.redirect(
    `https://${request.headers.get("host")}${request.nextUrl.pathname}`,
    301
  );
}
```

---

### ⚡ Fase 2: Melhorias Importantes (Dia 3-4)

#### 2.1 Rate Limiting

**Instalar**:

```bash
npm install express-rate-limit
```

**Arquivo**: `src/lib/rate-limit.ts`

```typescript
import { LRUCache } from "lru-cache";

type RateLimitOptions = {
  interval: number;
  uniqueTokenPerInterval: number;
};

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        return isRateLimited ? reject() : resolve();
      }),
  };
}

export const loginLimiter = rateLimit({
  interval: 60 * 1000, // 1 minuto
  uniqueTokenPerInterval: 500,
});
```

**Aplicar nas rotas**:

```typescript
// src/app/api/auth/login/route.ts
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  try {
    await loginLimiter.check(5, ip); // 5 tentativas por minuto
  } catch {
    return NextResponse.json(
      {
        success: false,
        errors: { _form: ["Muitas tentativas. Aguarde 1 minuto."] },
      },
      { status: 429 }
    );
  }

  // ... resto do código
}
```

---

#### 2.2 Logger estruturado

**Instalar**:

```bash
npm install pino pino-pretty
```

**Arquivo**: `src/lib/logger.ts`

```typescript
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});
```

**Substituir console.error**:

```typescript
// Antes:
console.error("Login error:", error);

// Depois:
logger.error({ err: error }, "Login error");
```

---

#### 2.3 Testes básicos

**Instalar**:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Arquivo**: `src/__tests__/auth/login.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/auth/login/route";

describe("Login API", () => {
  it("deve retornar erro com credenciais inválidas", async () => {
    const request = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "invalid@test.com", password: "wrong" }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });
});
```

---

### 📚 Fase 3: Melhorias Desejáveis (Dia 5-7)

#### 3.1 Documentação

**Arquivo**: `SECURITY.md`

```markdown
# Política de Segurança

## Medidas Implementadas

- ✅ JWT com segredo forte obrigatório
- ✅ Proteção CSRF em todas as rotas de mutação
- ✅ Invalidação de tokens no logout
- ✅ HTTPS forçado em produção
- ✅ Rate limiting (5 tentativas/minuto)
- ✅ Senhas com Argon2
- ✅ Cookies com HttpOnly, Secure, SameSite

## Reportar Vulnerabilidades

Email: security@seudominio.com
```

#### 3.2 CI/CD básico

**Arquivo**: `.github/workflows/test.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run test
      - run: npm run build
```

---

## 📊 Checklist de Conclusão

### Opção A (NextAuth)

- [ ] NextAuth instalado e configurado
- [ ] Middleware atualizado
- [ ] Frontend adaptado
- [ ] Arquivos antigos removidos
- [ ] Todos os testes passando

### Opção B (Manual)

- [ ] JWT_SECRET obrigatório
- [ ] CSRF implementado
- [ ] Invalidação de tokens no logout
- [ ] HTTPS forçado
- [ ] Rate limiting aplicado
- [ ] Logger estruturado
- [ ] Testes básicos criados
- [ ] Documentação atualizada

---

## 🎯 Resultado Esperado

| Aspecto        | Antes  | Depois (A) | Depois (B) |
| -------------- | ------ | ---------- | ---------- |
| **Nota geral** | 5.5/10 | 8.5/10     | 8.0/10     |
| **Segurança**  | 4/10   | 9/10       | 9/10       |
| **Tempo dev**  | -      | 3-4h       | 5-7 dias   |
| **Manutenção** | Alta   | Baixa      | Média      |
