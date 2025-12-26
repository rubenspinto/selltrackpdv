# 📋 Plano de Implementação: Página de Cadastro de Usuário

**Versão:** 1.0  
**Data:** 21/12/2025  
**Status:** Aprovado

---

## 1. Objetivo

Implementar a página de cadastro de usuário do SellTrack PDV com:

- Formulário para receber dados do usuário (nome, email, senha, confirmação de senha)
- Botão para submeter os dados
- Botão para cancelar a operação
- Botão para retornar à página de login
- Validações completas (client-side e server-side)
- Persistência dos dados em PostgreSQL via Docker/Docker Compose
- Redirecionamento para página de login após cadastro bem-sucedido

---

## 2. Revisão do Usuário

> [!IMPORTANT] > **Infraestrutura Nova:** Este plano inclui a configuração inicial de Docker Compose e Prisma ORM, que ainda não existem no projeto.

> [!IMPORTANT] > **Backend com API Routes:** O Next.js será usado para criar as API Routes (Route Handlers), dispensando um backend separado no MVP.

---

## 3. Contexto Técnico Atual

| Aspecto            | Situação Atual                                             |
| ------------------ | ---------------------------------------------------------- |
| **Framework**      | Next.js 16.1.0 com App Router                              |
| **Estilização**    | Tailwind CSS v4                                            |
| **Ícones**         | Phosphor Icons (já instalado)                              |
| **Tipografia**     | Geist Sans / Geist Mono                                    |
| **Docker/Compose** | ❌ Não configurado                                         |
| **ORM/Database**   | ❌ Não configurado                                         |
| **Validação**      | ❌ Não configurado (usar `zod` conforme decisões técnicas) |
| **Hash de Senha**  | ❌ Não configurado (usar `argon2` conforme decisões)       |

---

## 4. Arquivos a Serem Criados/Modificados

### 4.1 Infraestrutura (Docker + Database)

| Arquivo                | Propósito                                       |
| ---------------------- | ----------------------------------------------- |
| `docker-compose.yml`   | Configuração do PostgreSQL para desenvolvimento |
| `.env.example`         | Template de variáveis de ambiente               |
| `.env`                 | Variáveis de ambiente (não commitado)           |
| `prisma/schema.prisma` | Schema do banco com modelo User                 |

### 4.2 Backend (API Routes)

| Arquivo                              | Propósito                   |
| ------------------------------------ | --------------------------- |
| `src/lib/prisma.ts`                  | Cliente Prisma singleton    |
| `src/lib/validations/user.ts`        | Schema de validação com Zod |
| `src/app/api/auth/register/route.ts` | Route Handler para registro |

### 4.3 Frontend

| Arquivo                            | Propósito                            |
| ---------------------------------- | ------------------------------------ |
| `src/app/cadastro/page.tsx`        | Página de cadastro (substituir)      |
| `src/components/ui/Input.tsx`      | Componente de input reutilizável     |
| `src/components/ui/FormButton.tsx` | Componente de botão para formulários |

---

## 5. Dependências a Instalar

```bash
# Prisma ORM
npm install prisma @prisma/client

# Validação
npm install zod

# Hash de senha
npm install argon2
```

> [!NOTE]
> As bibliotecas seguem o documento de decisões técnicas (`decisoes-tecnicas.md`).

---

## 6. Modelo de Dados: User

Baseado no diagrama ERD do documento de requisitos:

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // Hash com argon2
  role      String   @default("STAFF") // ADMIN | STAFF
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 7. Especificação do Formulário de Cadastro

### 7.1 Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                     [ÍCONE/LOGO]                        │
│                                                         │
│                   Criar sua conta                       │
│           Preencha os dados para se cadastrar           │
│                                                         │
│     ┌───────────────────────────────────────────┐       │
│     │  Nome completo                            │       │
│     └───────────────────────────────────────────┘       │
│                                                         │
│     ┌───────────────────────────────────────────┐       │
│     │  Email                                    │       │
│     └───────────────────────────────────────────┘       │
│                                                         │
│     ┌───────────────────────────────────────────┐       │
│     │  Senha                                    │       │
│     └───────────────────────────────────────────┘       │
│                                                         │
│     ┌───────────────────────────────────────────┐       │
│     │  Confirmar senha                          │       │
│     └───────────────────────────────────────────┘       │
│                                                         │
│     ┌─────────────────────────────────────────┐         │
│     │            Criar conta                  │         │
│     └─────────────────────────────────────────┘         │
│                                                         │
│     ┌─────────────────────────────────────────┐         │
│     │              Cancelar                   │         │
│     └─────────────────────────────────────────┘         │
│                                                         │
│               Já tem uma conta? Entrar                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Campos do Formulário

| Campo               | Tipo     | Validações                                    |
| ------------------- | -------- | --------------------------------------------- |
| **Nome**            | text     | Obrigatório, mínimo 3 caracteres              |
| **Email**           | email    | Obrigatório, formato válido, único no sistema |
| **Senha**           | password | Obrigatório, mínimo 8 caracteres              |
| **Confirmar Senha** | password | Obrigatório, deve ser igual ao campo senha    |

### 7.3 Validações

**Client-side (UX):**

- Validação em tempo real ao sair do campo (onBlur)
- Mensagens de erro abaixo de cada campo
- Botão de submit desabilitado enquanto houver erros

**Server-side (Segurança):**

- Revalidação de todos os campos com Zod
- Verificação de email único no banco
- Hash da senha antes de salvar

### 7.4 Comportamento dos Botões

| Botão             | Ação                                                  |
| ----------------- | ----------------------------------------------------- |
| **Criar conta**   | Submete o formulário, salva no banco, redireciona     |
| **Cancelar**      | Limpa o formulário e redireciona para página de login |
| **Voltar/Entrar** | Navega para `/login`                                  |

---

## 8. Estrutura de Arquivos Final

```
selltrackpdv/
├── docker-compose.yml                 # [NEW]
├── .env.example                       # [NEW]
├── prisma/
│   └── schema.prisma                  # [NEW]
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── register/
│   │   │           └── route.ts       # [NEW]
│   │   └── cadastro/
│   │       └── page.tsx               # [MODIFY]
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx             # (existente)
│   │       ├── Input.tsx              # [NEW]
│   │       └── FormButton.tsx         # [NEW]
│   └── lib/
│       ├── prisma.ts                  # [NEW]
│       └── validations/
│           └── user.ts                # [NEW]
```

---

## 9. Checklist de Implementação

### Fase 1: Infraestrutura

- [ ] Criar `docker-compose.yml` com PostgreSQL
- [ ] Criar `.env.example` e `.env`
- [ ] Instalar dependências (prisma, zod, argon2)
- [ ] Configurar Prisma e criar schema
- [ ] Executar migrations

### Fase 2: Backend

- [ ] Criar cliente Prisma (`lib/prisma.ts`)
- [ ] Criar schema de validação (`lib/validations/user.ts`)
- [ ] Criar API Route de registro (`api/auth/register/route.ts`)

### Fase 3: Frontend - Componentes

- [ ] Criar componente Input (`components/ui/Input.tsx`)
- [ ] Criar componente FormButton (`components/ui/FormButton.tsx`)

### Fase 4: Frontend - Página de Cadastro

- [ ] Substituir placeholder por formulário completo
- [ ] Implementar validações client-side
- [ ] Integrar com API de registro
- [ ] Implementar redirecionamento após sucesso

### Fase 5: Estilização

- [ ] Aplicar estilos consistentes com o restante da aplicação
- [ ] Implementar estados de loading, erro e sucesso
- [ ] Garantir responsividade

---

## 10. Detalhes de Implementação

### 10.1 Docker Compose (`docker-compose.yml`)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: selltrackpdv-db
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-selltrack}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-selltrack123}
      POSTGRES_DB: ${POSTGRES_DB:-selltrackpdv}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 10.2 Schema Prisma (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("STAFF")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

### 10.3 Validação com Zod

```typescript
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
```

---

## 11. Critérios de Aceitação

1. **Cenário: Cadastro com sucesso**

   - **Dado** que o usuário preenche todos os campos corretamente
   - **Quando** clicar em "Criar conta"
   - **Então** os dados devem ser salvos no PostgreSQL
   - **E** o usuário deve ser redirecionado para `/login`

2. **Cenário: Validação de email duplicado**

   - **Dado** que já existe um usuário com email "teste@email.com"
   - **Quando** tentar cadastrar com o mesmo email
   - **Então** deve exibir erro "Email já cadastrado"

3. **Cenário: Validação de senhas diferentes**

   - **Dado** que o usuário inseriu senhas diferentes nos campos
   - **Quando** tentar submeter
   - **Então** deve exibir erro "As senhas não coincidem"

4. **Cenário: Cancelar operação**

   - **Dado** que o usuário está preenchendo o formulário
   - **Quando** clicar em "Cancelar"
   - **Então** deve ser redirecionado para `/login`

5. **Cenário: Navegação para login**
   - **Dado** que o usuário já tem uma conta
   - **Quando** clicar em "Já tem uma conta? Entrar"
   - **Então** deve ser redirecionado para `/login`

---

## 12. Plano de Verificação

### 12.1 Validação Manual (Recomendado)

**Pré-requisitos:**

```bash
# Iniciar o banco de dados
docker-compose up -d

# Executar migrations
npx prisma migrate dev

# Iniciar aplicação
npm run dev
```

**Testes a realizar:**

1. **Acesso à página:** Navegar para http://localhost:3000/cadastro e verificar se o formulário é exibido
2. **Validações de campos:**
   - Tentar submeter formulário vazio → deve exibir erros
   - Preencher email inválido → deve exibir erro de formato
   - Preencher senhas diferentes → deve exibir erro
3. **Cadastro bem-sucedido:** Preencher todos os campos válidos → deve redirecionar para `/login`
4. **Verificar banco:** Executar `npx prisma studio` e confirmar que o usuário foi criado na tabela `users`
5. **Email duplicado:** Tentar cadastrar novamente com o mesmo email → deve exibir erro
6. **Botão cancelar:** Clicar em "Cancelar" → deve redirecionar para `/login`
7. **Responsividade:** Testar em diferentes tamanhos de tela

### 12.2 Verificação via Prisma Studio

```bash
# Abrir interface visual do banco
npx prisma studio
```

Acessar http://localhost:5555 e verificar a tabela `users`.

---

## 13. Estimativa de Tempo

| Tarefa                          | Estimativa   |
| ------------------------------- | ------------ |
| Infraestrutura (Docker, Prisma) | 30 min       |
| Backend (API Route)             | 30 min       |
| Componentes UI (Input, Button)  | 20 min       |
| Página de cadastro              | 40 min       |
| Estilização e refinamentos      | 20 min       |
| Testes e validação              | 20 min       |
| **Total**                       | **~2h40min** |

---

## 14. Próximos Passos (Após Aprovação)

1. Aprovar este plano
2. Executar implementação seguindo o checklist
3. Validar registro e navegação manualmente
4. Commit com mensagem: `feat: implementa página de cadastro com validação e persistência PostgreSQL`

---

## 15. Considerações Futuras

> [!TIP]
> Este plano prepara a infraestrutura base (Docker + Prisma) que será reutilizada para:
>
> - Implementação da página de login (autenticação)
> - Gestão de produtos
> - Ponto de venda (PDV)
> - Demais funcionalidades do MVP
