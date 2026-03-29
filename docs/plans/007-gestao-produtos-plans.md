# Plano de Ação: Gestão de Produtos (SellTrack PDV)

## 1. 🎯 Contexto e Objetivo
Com base no *Ideia Refinada*, *Levantamento de Requisitos* e nas *Decisões Técnicas*, o SellTrack PDV necessita de um sistema robusto de gerenciamento do catálogo. Atualmente temos a página de cadastro implementada, mas o fluxo de gestão exige listagem, visualização, edição, exclusão, inativação e suporte a imagens. O objetivo deste documento é traçar o passo a passo técnico para implementar a Gestão de Produtos de ponta a ponta.

---

## 2. 🗄️ Alterações no Banco de Dados (Prisma Schema)
A entidade base de Produtos precisa ser atualizada para suportar imagens e inativação (soft delete/status).

**Ações em `prisma/schema.prisma`:**
- Adicionar `imageUrl String?` no modelo `ProductParent` (para a imagem de exibição do produto na listagem e PDV).
- Adicionar `isActive Boolean @default(true)` no modelo `ProductParent` (para possibilitar ativar/desativar produtos que saíram de linha sem perder o histórico das vendas).
- *Comandos necessários após atualização:*
  - `npx prisma format`
  - `npx prisma migrate dev --name add_product_image_and_status`

*Nota sobre Exclusão:* Como temos relacionamentos com Vendas (`OrderItem`), exclusões definitivas (Hard Delete) não são recomendadas caso o produto já tenha vendas atreladas. Utilizaremos o `isActive` (Soft Delete) como principal forma de inativação.

---

## 3. 🖼️ Tratamento de Imagens
Seguindo as *Decisões Técnicas* que já definem o uso do Supabase (PostgreSQL managed), a recomendação para imagens é a utilização do **Supabase Storage**.
- Criar um bucket público chamado `product-images` no Supabase Storage.
- Desenvolver um componente de *Upload Picker/Dropzone* na interface e um serviço/utilitário no backend (ou via cliente Supabase do lado do frontend) para carregar as imagens, gerando um link público (`publicUrl`) que será salvo no Prisma.

---

## 4. 🔀 API Routes (Backend)

As rotas da API em `src/app/api/products` precisam ser expandidas:

1. **`GET /api/products`**:
   - Funcionalidade atual: listagem básica.
   - **Novas necessidades**: Adicionar suporte a *query parameters* para `search` (buscar por nome ou SKU), além de permitir listar inativos se solicitado.
2. **`PUT /api/products/[id]`**:
   - Responsável por atualizar as informações gerais (`ProductParent`) e atualizar/criar/excluir variantes (`ProductVariant`).
   - Utilizar transações no Prisma (`$transaction`) para garantir a consistência das edições.
3. **`DELETE /api/products/[id]`**:
   - Rota de exclusão e mudança de status.
   - Validação antes de deletar: "O produto já possui vendas associadas?". Se sim, retornar erro solicitando que ele seja apenas **inativado**.
4. **`PATCH /api/products/[id]/status`** (Opcional/Recomendado):
   - Rota leve para habilitar a funcionalidade de "Ativar / Desativar" instântaneamente via tabela, alterando somente o campo `isActive`.

---

## 5. 🖥️ Interface do Usuário (Frontend)

O desenvolvimento frontend na rota protegida precisará das seguintes atualizações:

### 5.1. Página de Listagem (`src/app/(protected)/produtos/page.tsx`)
A página central de gestão de produtos. Conterá:
- **Barra de Pesquisa**: Campo de texto para filtrar produtos em tela (ou via debounce na chamada da API) buscando Nome ou SKU.
- **Tabela/Grid de Dados**:
  - Miniatura da Imagem.
  - Nome do Produto e Categoria.
  - Status (Badge visual: Verde = Ativo | Cinza = Inativo).
  - Preço da Variação Base e Quantidade Total do Estoque Atrelado.
  - Menu de ações (Dropdown ou Ícones: ✏️ Editar, 👁️ Ocultar/Desativar, 🗑️ Excluir).
- **Botão Principal**: "Novo Produto" que redireciona para `/produtos/cadastro`.

### 5.2. Aprimoramento da Edição/Cadastro (`src/components/produtos/CadastroProdutoForm.tsx`)
Este componente, atualmente focado em inserção, será refatorado para suportar Inserção e Edição (padrão de design reusável):
- **Propriedade `initialData`**: Se definida, altera o modo de "Criação" para "Edição", preenchendo o `useForm` (com os dados e variações).
- **Componente de Imagem**: Dropzone/Área de seleção na primeira seção do layout para a adição ou alteração da foto do produto.
- **Botões e Ações**: O onSubmit chamará a API em `POST` ou `PUT` baseado no modo de formulário.

---

## 6. 🚀 Cronograma/Roadmap Sugerido de Execução

- **Etapa 1: Banco de Dados e Modelos**
  - Modificar o `schema.prisma` com `imageUrl` e `isActive`.
  - Executar a migração.
  - Configurar Supabase Storage para lidar com imagens.

- **Etapa 2: API (Backend)**
  - Construir endpoint `PUT` de produtos para edições.
  - Construir funções para Soft Delete / Hard Delete (deletar produto no banco se puder, ou torná-lo inativo se não).
  - Atualizar o `GET /produtos` com busca integrada.

- **Etapa 3: Interface e Refatorações de Componentes**
  - Construir o componente de Upload de Imagem.
  - Refatorar o `CadastroProdutoForm.tsx` para aceitar edição e upload.
  - Criar rota auxiliar `/produtos/[id]/editar`.

- **Etapa 4: Tela "Gestão de Produtos"**
  - Construir `src/app/(protected)/produtos/page.tsx`.
  - Integrar Tabela conectada à listagem da API, construindo busca pelo SKU e filtros rápidos.

- **Etapa 5: Validação Final e Testes**
  - Garantir o correto roteamento através do middleware (`src/middleware.ts` já suporta o prefixo `/produtos`).
  - Validar fluxos (Ativar/desativar). Testes rápidos de usabilidade.
