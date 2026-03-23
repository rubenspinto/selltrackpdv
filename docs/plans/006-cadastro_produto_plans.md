# 🛒 Plano de Ação: Cadastro de Produto (Hierárquico)

## 📌 Objetivo
Desenvolver a funcionalidade de Cadastro de Produto no SellTrack PDV, contemplando a estrutura hierárquica de Produto Pai (Informações gerais) e suas Variações (SKU, Tamanho, Cor, Preço, Estoque, etc.), atendendo aos requisitos definidos no documento de Levantamento de Requisitos (RF01) e respeitando as Decisões Técnicas do projeto.

## 🛠️ Contexto Técnico
- **Frontend**: Next.js App Router, React, TypeScript.
- **Backend**: Next.js API Routes (ou Server Actions).
- **Banco de Dados**: PostgreSQL, ORM Prisma.
- **Segurança**: Rotas e endpoints protegidos por sessão de usuário. Somente usuários autenticados têm permissão de alterar a base.

## 🚀 Passos de Implementação

### 1️⃣ Design e Construção da Interface (Frontend)
**Onde:** Arquivos dentro de `src/components/cadastro/` acoplados à página da rota equivalente (ex: `src/app/cadastro/`).
- **Layout do Formulário**:
  - **Seção: Informações Gerais (Produto Pai)**
    - Nome do Produto (Input Texto - Obrigatório)
    - Categoria (Select ou Input - Obrigatório)
    - Descrição (TextArea - Opcional)
  - **Seção: Variações do Produto (Produtos Filhos/SKUs)**
    - Funcionalidade dinâmica ("Adicionar Variação") para gerar inputs lado a lado ou em card para registrar múltiplas variações numa mesma tela.
    - Campos obrigatórios da Variação:
      - SKU (Único, não repetível)
      - Tamanho (Select restrito pelos enums do Prisma: `P, M, G`)
      - Cor (Input de texto livre)
      - Preço (Decimal - Exibição no formato de `R$ 0,00`)
      - Estoque Atual e Estoque Mínimo (Padrão: 10)
- **Gerenciamento de Estado do Formulário**: Adotar biblioteca para abstrair a complexidade de gerenciar arrays de campos dinâmicos, como o **React Hook Form** aliado a um resolver como **Zod**.
- **UX/UI e Feedbacks (RNF03)**:
  - Adicionar máscara/formatação em tempo real no campo de preço.
  - Exibir toast (notificações visuais) de "sucesso", "erro" ou alerts de "aguarde" durante o submit para proteger de duplos cliques.

### 2️⃣ API de Inclusão e Controller (Backend)
**Onde:** `src/app/api/products/route.ts` ou utilizando *Server Actions* no diretório correspondente.
- **Validação Segura dos Dados (Payload Zod)**: Assegurar que os dados recebidos pelo Server-Side sigam rigidamente os tipos declarados para `ProductParent` e Array de `ProductVariant`.
- **Transação de Dados Ativa (`$transaction`)**:
  - Para garantir a integridade do banco (evidenciada nas Decisões Técnicas), a gravação do modelo Pai junto das Variações Filho obrigatoriamente exigirá transação, para que falhas abortem toda a operação.
  - O código Prisma deverá se parecer com:
    ```typescript
    await prisma.productParent.create({
      data: {
        name, description, category,
        variants: {
          create: variaveis.map(v => ({
             sku: v.sku, size: v.size, color: v.color, price: v.price, stockQuantity: v.stockQuantity, minStockLevel: v.minStockLevel
          }))
        }
      }
    })
    ```
- **Tratamento de Exceções**:
  - Capturar o erro **Prisma Client Known Request Error (`P2002`)** referente a violação de chave primária (`@unique`) no `SKU`. Retornar ao frontend mensagem legível sugerindo troca do SKU.
  - Verificar previamente se o usuário encontra-se autenticado com o hook ou validade de sessão atualizada.

### 3️⃣ Validações Manuais & Integração (Checklist do Dev)
- [ ] Construir componentes base do forms isoladamente.
- [ ] Realizar um POST ao backend contendo 1 único produto e 1 variação sem logar para testar que a requisição é negada (Autenticação).
- [ ] Enviar a requisição do formulário com as regras corretas simulando "Camiseta Básica" + "Tamanho P (Azul)" e "Tamanho M (Azul)".
- [ ] Checar no banco pelo `npx prisma studio` se a criação refletiu as UUIDs corretas nos Foreign Keys.
- [ ] Enviar um novo produto intencionalmente usando um `sku` recém salvo para verificar o bloqueio de "SKU já cadastrado".

### 4️⃣ Finalização
- Limpar `console.logs` em excesso para seguir o padrão apontado nas decisões de monitoramento.
- Realizar PR/Merge e disponibilizar a rota no ambiente de Sandbox / Staging se cabível.
