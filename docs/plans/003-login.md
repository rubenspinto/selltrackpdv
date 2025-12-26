# Implementação da Página de Login

Este plano detalha a implementação da funcionalidade de login, incluindo autenticação, gerenciamento de sessão via cookies JWT seguras e a página de login.

## Revisão do Usuário

> [!IMPORTANT]
> A implementação utilizará JWT em cookies (`jose`) em vez de sessões em banco de dados (`express-session`), pois é a abordagem padrão e mais performática para Next.js App Router (Server Actions/Route Handlers) e Edge Middleware.
>
> A biblioteca `jose` será adicionada às dependências.

## Alterações Propostas

### Dependências

#### [MODIFY] package.json

- Adicionar `jose` para manipulação de JWT no Edge Runtime (Middleware).

### Validação

#### [MODIFY] src/lib/validations/user.ts

- Adicionar `loginSchema` (email, senha).

### Autenticação (Backend)

#### [NEW] src/lib/auth.ts

- Criar funções utilitárias:
  - `signSession(payload)`: Gera JWT.
  - `verifySession(token)`: Verifica JWT.
  - `createSession(userId)`: Gera token e define cookie.
  - `deleteSession()`: Remove cookie.
  - `getSession()`: Recupera dados da sessão atual.

#### [NEW] src/app/api/auth/login/route.ts

- Endpoint POST.
- Valida corpo da requisição com `loginSchema`.
- Busca usuário no banco (`prisma.user.findUnique`).
- Verifica senha com `argon2.verify`.
- Cria sessão (`createSession`) se credenciais válidas.
- Retorna sucesso ou erro.

#### [NEW] src/app/api/auth/logout/route.ts

- Endpoint POST.
- Remove sessão (`deleteSession`).
- Retorna sucesso (redirecionamento será feito no front).

### Middleware

#### [NEW] src/middleware.ts

- Implementar middleware para proteger rotas.
- Definir rotas públicas (`/login`, `/cadastro`, `/api/auth/*`).
- Definir rotas protegidas (`/pdv`, `/dashboard` no futuro).
- Redirecionar para `/login` se tentar acessar rota protegida sem sessão.
- Redirecionar para `/pdv` se acessar `/login` já estando autenticado.

### Frontend

#### [MODIFY] src/app/login/page.tsx

- Implementar formulário de login usando componentes `Input` e `FormButton` existentes.
- Usar `useState` para controle local (padrão visto em `cadastro/page.tsx`).
- Integração com API `/api/auth/login`.
- Feedback com `react-toastify`.
- Redirecionar para `/pdv` ao logar.

#### [NEW] src/app/pdv/page.tsx

- Página em branco (placeholder) para validar redirecionamento.
- Título "Area de PDV (Em construção)".
- Botão simples de "Logout" para testar o fluxo de saída.

## Plano de Verificação

### Testes Manuais

1. **Login com Sucesso**:

   - Acessar `/login`.
   - Inserir credenciais válidas (criadas anteriormente via `/cadastro`).
   - Verificar redirecionamento para `/pdv`.
   - Verificar se cookie de sessão foi criado (DevTools > Application > Cookies).

2. **Login com Credenciais Inválidas**:

   - Tentar logar com email não cadastrado.
   - Tentar logar com senha errada.
   - Verificar mensagens de erro (toast/campo).

3. **Validação de Campos**:

   - Tentar enviar formulário vazio.
   - Tentar enviar email com formato inválido.

4. **Proteção de Rota (Middleware)**:

   - Tentar acessar `/pdv` sem estar logado -> deve redirecionar para `/login`.
   - Tentar acessar `/login` estando logado -> deve redirecionar para `/pdv`.

5. **Logout**:
   - Na tela `/pdv`, clicar em Logout.
   - Verificar redirecionamento para `/login`.
   - Verificar se cookie foi removido.
