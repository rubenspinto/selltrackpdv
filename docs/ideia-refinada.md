# 📋 Documento de Concepção de Produto

**Versão:** 1.0  
**Data:** 20/12/2025  

## **Sistema de PDV e Controle de Estoque para Negócios Locais**

---

## 1. 📌 Título da Ideia/Projeto

**SellTrack PDV** — Sistema de Ponto de Venda e Controle de Estoque em Tempo Real para Lojas Locais

---

## 2. 📖 Descrição Geral da Ideia

### **Problema que Resolve:**

Pequenas lojas de roupas e acessórios enfrentam **ineficiência operacional** ao:

- Usar **cadernos e planilhas manuais** para registrar vendas
- Realizar **inventários diários demorados** para controlar estoque
- Gastar **muito tempo e energia** conferindo quantidades ao final do dia
- Ter **dificuldade em visualizar rapidamente** quantas peças de cada produto existem em estoque

### **Solução Proposta:**

Um **sistema de PDV web simplificado** que:

- Permite registrar vendas de forma **rápida e intuitiva** (produto → tamanho/cor → quantidade → forma de pagamento)
- **Atualiza o estoque em tempo real** a cada venda registrada
- Elimina a necessidade de **inventários manuais diários**
- Gera **relatórios simples** de vendas, estoque e formas de pagamento
- Funciona **no notebook via navegador** (sem instalação)
- É **acessível e customizável** para as necessidades específicas do negócio

---

## 3. 🎯 Objetivos da Ideia

### **Objetivo Principal:**

Criar uma solução de PDV + estoque que **elimine processos manuais e poupe tempo** na operação diária de uma loja de roupas.

### **Objetivos Secundários:**

1. **Aumentar eficiência operacional**: reduzir o tempo gasto em inventários manuais
2. **Melhorar acurácia de dados**: manter estoque sempre atualizado e confiável
3. **Facilitar tomada de decisão**: oferecer relatórios simples e práticos
4. **Reduzir custos**: oferecer uma alternativa acessível a softwares PDV caros
5. **Criar um portfólio sólido**: desenvolver um projeto full-stack educacional e comercialmente viável
6. **Preparar para futuras expansões**: arquitetura extensível para offline, nota fiscal e integrações

---

## 4. 👥 Público-Alvo

### **Usuários Primários:**

- **Proprietária da loja** (sua irmã): responsável por gerenciar tudo (vendas, estoque, relatórios)
- **Marido (co-proprietário)**: ajuda na venda e acesso ao sistema

### **Tipo de Negócio:**

- Lojas locais de **roupas e acessórios** de pequeno a médio porte
- Operação **manual/simples** (não é um grande varejo com múltiplas lojas)
- Faturamento **baixo a médio** (10-15 vendas/dia em média)

### **Stakeholders Beneficiados:**

- **Proprietária**: economia de tempo, redução de trabalho manual
- **Marido (co-proprietário)**: dados confiáveis para decisões
- **Clientes**: compra mais rápida com comprovante em mãos

---

## 5. 🏪 Contexto de Uso

### **Situações Típicas de Uso:**

#### **Cenário 1: Registro de Venda Diária**

- **Quando**: Durante o horário de funcionamento da loja (segunda a sábado)
- **Quem**: Proprietária ou marido
- **O que faz**: Cliente chega na loja, escolhe uma blusa vermelha tamanho M
  - Vendedor(a) abre o sistema no notebook
  - Busca o produto "Blusa Social" → seleciona cor "Vermelho" e tamanho "M"
  - Registra quantidade (1 peça)
  - Escolhe forma de pagamento: Pix, Dinheiro ou Cartão
  - Sistema emite comprovante/recibo
  - **Estoque atualiza automaticamente** (Blusa Vermelho M: 5 → 4)

#### **Cenário 2: Consulta Rápida de Estoque**

- **Quando**: Durante o dia, quando cliente pergunta "vocês têm isso em tamanho P?"
- **Quem**: Vendedor(a)
- **O que faz**: Abre o sistema, consulta "Blusa Social Vermelho tamanho P" e vê que tem 2 peças → pode vender com confiança

#### **Cenário 3: Fechamento de Caixa (Final do Dia)**

- **Quando**: Ao final do expediente (17:00 ou 18:00)
- **Quem**: Proprietária
- **O que faz**: Gera relatórios do dia:
  - Total de vendas (quantidade de itens + valor em R$)
  - Estoque restante (quantas peças de cada produto)
  - Formas de pagamento (quanto em Pix, quanto em Dinheiro, quanto em Cartão)
  - Compara com caixa físico (dinheiro/Pix) para reconciliação

#### **Cenário 4: Gestão Semanal**

- **Quando**: Uma vez por semana (fim de semana)
- **Quem**: Proprietária
- **O que faz**: Revisa relatórios acumulados para ver tendências (produtos mais vendidos, estoque baixo)

---

## 6. 🎨 Principais Funcionalidades Desejadas

### **Funcionalidade 1: Cadastro de Produtos**

- Criar/editar produtos com variações de **tamanho e cor**
- Estrutura flexível: produtos simples (sem variações) e complexos (múltiplas variações)
- **Exemplo**: "Blusa Social" pode ter 5 cores × 4 tamanhos = 20 variações, mas "Cinto de Couro" é simples

### **Funcionalidade 2: Registro de Venda (PDV)**

- Interface simples e rápida para registrar venda
- Fluxo: Selecionar produto → selecionar tamanho/cor → quantidade → forma de pagamento
- Suporta 3 formas de pagamento: **Pix, Dinheiro, Cartão** (apenas registro, sem integração com máquina por enquanto)
- Gera **comprovante/recibo** pra imprimir ou exibir (fase 1)

### **Funcionalidade 3: Controle de Estoque em Tempo Real**

- Atualiza estoque **automaticamente** após cada venda
- Mostra saldo atual de cada variação de produto
- Permite **consulta rápida** de estoque durante o dia
- Registra **histórico de movimentação** (venda = saída)

### **Funcionalidade 4: Relatórios Simples**

- **Relatório de Vendas do Dia**: total de itens vendidos + valor total em R$
- **Relatório de Estoque Atual**: saldo de cada produto/variação
- **Relatório de Formas de Pagamento**: quanto entrou em Pix, Dinheiro, Cartão

### **Funcionalidade 5: Autenticação Básica**

- Login simples (e-mail/senha) para proteger dados
- Acesso apenas para proprietária e marido

### **Funcionalidade 6: Dashboard/Tela Principal**

- Visão geral do dia: vendas até o momento, estoque crítico
- Atalhos para as ações principais (nova venda, consultar estoque, gerar relatório)

---

## 7. ✨ Diferenciais e Benefícios

### **Diferenciais:**

1. **Customização Local**

   - Sistema feito especificamente para as necessidades dela
   - Qualquer ajuste/pedido pode ser implementado rapidinho
   - Não é engessado como softwares prontos

2. **Custo Acessível**

   - Sem mensalidade cara como softwares PDV comerciais (Vindi, Gerencianet, etc.)
   - Investimento único, sem custos recorrentes

3. **Simplicidade Extrema**

   - Interface minimalista, sem funcionalidades desnecessárias
   - Qualquer pessoa aprende a usar em poucos minutos
   - Foco 100% no que importa: vender rápido e controlar estoque

4. **Suporte Próximo**

   - Você está próximo, entende o negócio dela
   - Pode dar suporte pessoal e ágil
   - Iterações rápidas baseadas em feedback real

5. **Escalabilidade**
   - Arquitetura preparada para adicionar offline, nota fiscal e integrações depois
   - Não é um "gambiarra", é uma solução pensada

### **Benefícios Tangíveis:**

1. **Elimina inventários manuais diários** → economiza 30-60 min por dia
2. **Reduz erros de estoque** → dados sempre atualizados
3. **Facilita fechamento de caixa** → relatórios automáticos em segundos
4. **Aumenta confiabilidade** → proprietária sabe exatamente o que tem em estoque
5. **Melhora experiência do cliente** → venda mais rápida, comprovante imediato
6. **Deixa caminho aberto** → pode expandir com offline, nota fiscal, etc. depois

---

## 8. ⚠️ Possíveis Desafios e Limitações Iniciais

### **Desafios Técnicos:**

1. **Conexão de Internet Instável**

   - **Limitação**: Versão 1 funciona apenas online (com internet)
   - **Desafio**: Sem internet, a loja não consegue registrar vendas
   - **Solução Futura**: Implementar modo offline com sincronização (fase 2)
   - **Mitigação temporária**: Garantir Internet 4G ou WIFI estável, ou ter plano B (papel + registrar depois)

2. **Integração com Nota Fiscal Complexa**

   - **Limitação**: Fase 1 não inclui nota fiscal automática
   - **Desafio**: Exige certificado digital (e-CNPJ), APIs fiscais rigorosas
   - **Solução**: Deixar pra fase 2 ou integrar com serviço terceirizado (Nuvem Fiscal, etc.)
   - **Temporário**: Proprietária continua emitindo nota fiscal manualmente se necessário

3. **Integração com Máquina de Cartão**
   - **Limitação**: Fase 1 não integra com máquina de pagamento (Stone, Sumup, etc.)
   - **Desafio**: Cada máquina tem sua API, diferentes certificações
   - **Solução**: Deixar pra fase 2
   - **Temporário**: Máquina continua desconectada, sistema apenas registra a forma de pagamento

### **Desafios Operacionais:**

1. **Mudança de Hábitos**

   - Proprietária está acostumada com caderno/Excel
   - Vai precisar de **treinamento e adaptação**
   - **Solução**: Interface super intuitiva, suporte próximo, feedback constante

2. **Migração de Dados Antigos**

   - Pode haver produtos/histórico em Excel ou papel
   - **Solução**: Importar/transcrever dados antes de usar ou começar do zero

3. **Dependência de Você (Desenvolvedor)**
   - Se você não conseguir dar suporte depois, o sistema fica sem manutenção
   - **Solução**: Documentar bem o código, preparar guide de troubleshooting, estar disponível

### **Desafios Comerciais:**

1. **Modelo de Negócio**

   - Você vai cobrar pela solução? Quanto?
   - Vai querer vender pra outras lojas depois?
   - **Decisão pendente**: definir se é apenas pra irmã ou se é um produto a escalar

2. **Suporte Futuro**
   - Como você vai gerenciar requisições/bugs?
   - **Solução**: Acordar com irmã um SLA simples (ex: responde em 24h)

---

## 9. 🚀 Próximos Passos Sugeridos

### **Fase 1: MVP (Semanas 1-4)**

**Objetivo**: Ter uma versão funcional nas mãos dela para testar

#### **Semana 1: Planejamento e Setup**

- [ ] Definir stack técnico final (Frontend: React/Vue, Backend: Node.js/Python, DB: PostgreSQL/MongoDB)
- [ ] Criar repositório Git
- [ ] Preparar ambiente de desenvolvimento (Docker, dependências)
- [ ] Modelar banco de dados (Produtos, Variações, Vendas, Estoque, Usuários)

#### **Semana 2: Funcionalidades Básicas**

- [ ] Implementar autenticação (login simples)
- [ ] CRUD de Produtos (cadastrar, editar, listar)
- [ ] Estrutura de variações (tamanho, cor, estoque)
- [ ] Dashboard principal (visão geral)

#### **Semana 3: PDV e Estoque**

- [ ] Tela de registro de venda (PDV)
- [ ] Integrar com estoque (atualizar automaticamente)
- [ ] Formas de pagamento (Pix, Dinheiro, Cartão)
- [ ] Gerar comprovante/recibo (tela + impressão)

#### **Semana 4: Relatórios e Testes**

- [ ] Relatório de vendas do dia
- [ ] Relatório de estoque
- [ ] Relatório de formas de pagamento
- [ ] Testes básicos (funcionalidade, usabilidade)
- [ ] Deploy em servidor/hospedagem
- [ ] **Entrega ao cliente para testes reais**

### **Fase 2: Melhorias (Semanas 5-8, após feedback)**

- [ ] Implementar modo offline (LocalStorage/IndexedDB) com sincronização
- [ ] Adicionar integração com nota fiscal (Nuvem Fiscal ou similar)
- [ ] Melhorias de UX baseadas em feedback
- [ ] Relatórios mais avançados
- [ ] Responsividade mobile (bonus)

### **Fase 3: Escalabilidade**

- [ ] Integração com máquina de cartão (Stone, Sumup)
- [ ] Múltiplas lojas (se comercializar)
- [ ] Dashboard gerencial mais avançado
- [ ] Backup e segurança robustos

---

## 📊 Resumo Executivo

| Aspecto               | Descrição                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------ |
| **Nome**              | SellTrack PDV                                                                              |
| **Problema**          | Proprietária de loja gasta muito tempo em inventários manuais e usa sistemas desconectados |
| **Solução**           | Sistema web de PDV + estoque em tempo real, simples e customizável                         |
| **Público**           | Proprietária da loja + marido (2 usuários, acesso total)                                   |
| **Volume**            | 10-15 vendas/dia                                                                           |
| **Tecnologia**        | Web (navegador), sem instalação                                                            |
| **MVP (Fase 1)**      | Registrar venda + atualizar estoque + relatórios básicos (sem offline, sem nota fiscal)    |
| **Timeline**          | 4 semanas                                                                                  |
| **Principal Desafio** | Internet instável (offline = fase 2) e integração com nota fiscal (fase 2)                 |
| **Benefício Chave**   | Eliminar inventários manuais diários, economizando 30-60 min/dia                           |

---

## 🎯 Critério de Sucesso da Fase 1

✅ Sistema funciona bem no notebook da loja  
✅ Proprietária consegue registrar vendas em menos de 30 segundos por venda  
✅ Estoque atualiza corretamente após cada venda  
✅ Relatórios são gerados em segundos  
✅ Proprietária consegue fechar o caixa 50% mais rápido que antes  
✅ Feedback positivo para avançar para fase 2

---

**Documento preparado para iniciar desenvolvimento.**  
**Data**: 20 de dezembro de 2025  
**Status**: Pronto para Fase 1
