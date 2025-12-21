# 📋 Plano de Implementação: Homepage

**Versão:** 1.0  
**Data:** 21/12/2025  
**Status:** Aguardando Aprovação

---

## 1. Objetivo

Implementar a página inicial (homepage) do SellTrack PDV contendo:

- Ícone representativo da aplicação
- Nome do projeto ("SellTrack PDV")
- Frase curta descrevendo o propósito da aplicação
- Dois botões: Login e Cadastro
- Navegação funcional para as páginas de login e cadastro (páginas em branco para validação)

---

## 2. Contexto Técnico Atual

| Aspecto         | Situação Atual                                           |
| --------------- | -------------------------------------------------------- |
| **Framework**   | Next.js 16.1.0 com App Router                            |
| **Estilização** | Tailwind CSS v4                                          |
| **Ícones**      | A instalar (Phosphor Icons - conforme decisões técnicas) |
| **Tipografia**  | Geist Sans / Geist Mono (já configurado)                 |
| **Estrutura**   | App Router em `src/app/`                                 |

---

## 3. Arquivos a Serem Criados/Modificados

### 3.1 Arquivos Novos

| Arquivo                         | Propósito                             |
| ------------------------------- | ------------------------------------- |
| `src/app/page.tsx`              | Homepage (substituir conteúdo atual)  |
| `src/app/login/page.tsx`        | Página de login (placeholder)         |
| `src/app/cadastro/page.tsx`     | Página de cadastro (placeholder)      |
| `src/components/ui/Button.tsx`  | Componente de botão reutilizável      |
| `src/components/icons/Logo.tsx` | Componente do ícone/logo da aplicação |

### 3.2 Arquivos a Modificar

| Arquivo               | Modificação                                       |
| --------------------- | ------------------------------------------------- |
| `src/app/layout.tsx`  | Atualizar metadata (título e descrição)           |
| `src/app/globals.css` | Adicionar variáveis/estilos globais se necessário |

---

## 4. Dependências a Instalar

```bash
npm install @phosphor-icons/react
```

> [!NOTE]
> Phosphor Icons foi escolhido conforme documento de decisões técnicas (`decisoes-tecnicas.md`).

---

## 5. Especificação Visual da Homepage

### 5.1 Layout

```
┌─────────────────────────────────────────┐
│                                         │
│              [ÍCONE/LOGO]               │
│                                         │
│            SellTrack PDV                │
│                                         │
│    "Sistema completo de ponto de        │
│     venda para sua loja de roupas"      │
│                                         │
│     ┌──────────┐  ┌──────────────┐      │
│     │  Login   │  │   Cadastro   │      │
│     └──────────┘  └──────────────┘      │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 Elementos

| Elemento           | Especificação                                                |
| ------------------ | ------------------------------------------------------------ |
| **Ícone**          | `Storefront` do Phosphor Icons (representa loja/PDV)         |
| **Título**         | "SellTrack PDV" em fonte principal, tamanho grande           |
| **Descrição**      | "Sistema completo de ponto de venda para sua loja de roupas" |
| **Botão Login**    | Estilo primário (preenchido)                                 |
| **Botão Cadastro** | Estilo secundário (outline/contorno)                         |

### 5.3 Design

- **Fundo**: Gradiente suave ou cor sólida neutra
- **Centralização**: Conteúdo centralizado vertical e horizontalmente
- **Responsividade**: Adaptável a diferentes tamanhos de tela
- **Tema**: Escuro (dark mode) para modernidade

---

## 6. Estrutura de Componentes

```
src/
├── app/
│   ├── page.tsx           # Homepage
│   ├── login/
│   │   └── page.tsx       # Página de login (placeholder)
│   ├── cadastro/
│   │   └── page.tsx       # Página de cadastro (placeholder)
│   ├── layout.tsx         # Layout raiz (modificar metadata)
│   └── globals.css        # Estilos globais
└── components/
    └── ui/
        └── Button.tsx     # Componente de botão reutilizável
```

---

## 7. Checklist de Implementação

### Fase 1: Configuração

- [ ] Instalar `@phosphor-icons/react`
- [ ] Atualizar metadata no `layout.tsx`

### Fase 2: Componentes Base

- [ ] Criar componente `Button.tsx`

### Fase 3: Páginas

- [ ] Implementar homepage (`page.tsx`)
- [ ] Criar página de login (`login/page.tsx`)
- [ ] Criar página de cadastro (`cadastro/page.tsx`)

### Fase 4: Estilização

- [ ] Aplicar estilos responsivos
- [ ] Implementar dark theme
- [ ] Adicionar hover states e transições

### Fase 5: Validação

- [ ] Testar navegação entre páginas
- [ ] Verificar responsividade
- [ ] Validar acessibilidade básica

---

## 8. Código de Exemplo

### 8.1 Homepage (`src/app/page.tsx`)

```tsx
import Link from "next/link";
import { Storefront } from "@phosphor-icons/react/dist/ssr";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center space-y-8 p-8">
        {/* Ícone */}
        <div className="flex justify-center">
          <Storefront className="w-24 h-24 text-emerald-500" weight="duotone" />
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          SellTrack PDV
        </h1>

        {/* Descrição */}
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Sistema completo de ponto de venda para sua loja de roupas
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="px-8 py-3 border-2 border-emerald-600 text-emerald-500 hover:bg-emerald-600 hover:text-white font-semibold rounded-lg transition-colors"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </main>
  );
}
```

### 8.2 Página de Login (Placeholder)

```tsx
// src/app/login/page.tsx
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Página de Login</h1>
        <p className="text-gray-400">Em construção...</p>
        <Link href="/" className="text-emerald-500 hover:underline">
          ← Voltar para Home
        </Link>
      </div>
    </main>
  );
}
```

---

## 9. Critérios de Aceitação

1. **Cenário: Visualização da Homepage**

   - **Dado** que o usuário acessa a URL raiz (`/`)
   - **Então** deve visualizar o ícone, nome do projeto, descrição e dois botões

2. **Cenário: Navegação para Login**

   - **Dado** que o usuário está na homepage
   - **Quando** clicar no botão "Entrar"
   - **Então** deve ser redirecionado para `/login`

3. **Cenário: Navegação para Cadastro**

   - **Dado** que o usuário está na homepage
   - **Quando** clicar no botão "Cadastrar"
   - **Então** deve ser redirecionado para `/cadastro`

4. **Cenário: Responsividade**
   - **Dado** que o usuário acessa em dispositivo móvel
   - **Então** os botões devem ser exibidos em coluna
   - **E** o layout deve permanecer centralizado

---

## 10. Estimativa de Tempo

| Tarefa                      | Estimativa   |
| --------------------------- | ------------ |
| Configuração e dependências | 10 min       |
| Componentes base            | 15 min       |
| Páginas                     | 20 min       |
| Estilização e refinamentos  | 20 min       |
| Testes e validação          | 10 min       |
| **Total**                   | **~1h15min** |

---

## 11. Próximos Passos (Após Aprovação)

1. Aprovar este plano
2. Executar implementação seguindo o checklist
3. Validar navegação e responsividade
4. Commit com mensagem: `feat: implementa homepage com navegação para login e cadastro`
