# Tasks - Implementar Sistema de Anexos (A/B/C/F)

## 1. Setup e Estrutura
- [ ] 1.1 Criar diretório `web-app/app/anexos/`
- [ ] 1.2 Criar diretório `web-app/components/anexos/`
- [ ] 1.3 Criar diretório `web-app/components/anexos/shared/`
- [ ] 1.4 Criar rota `/anexos` (página gerenciamento anexos)
- [ ] 1.5 Criar rotas específicas: `/anexos/a`, `/anexos/b`, `/anexos/c`, `/anexos/f`

## 2. Anexo A - Busca de Anterioridade (19 campos)

### 2.1 Setup Anexo A
- [ ] 2.1.1 Criar componente `AnexoA.tsx`
- [ ] 2.1.2 Criar rota `/anexos/a/page.tsx`
- [ ] 2.1.3 Criar schema Zod `AnexoASchema`

### 2.2 Cabeçalho da Busca (2 campos)
- [ ] 2.2.1 Campo Data da Busca (date picker, <= data submissão)
- [ ] 2.2.2 Campo Responsável (texto, min 5 caracteres)

### 2.3 Palavras-Chave (3 campos)
- [ ] 2.3.1 Campo Termo 1 (texto, min 3 caracteres)
- [ ] 2.3.2 Campo Termo 2 (texto, min 3 caracteres)
- [ ] 2.3.3 Campo Termo 3 (texto, min 3 caracteres)

### 2.4 Bases Consultadas (3 checkboxes)
- [ ] 2.4.1 INPI - Checkbox + Data + URL
- [ ] 2.4.2 Espacenet - Checkbox + Data + URL
- [ ] 2.4.3 Google Patents - Checkbox + Data + URL

### 2.5 Top 3 Documentos Relevantes (3 × 8 campos = 24 campos)
- [ ] 2.5.1 Criar componente `DocumentoRelevanteCard` (reutilizável)
- [ ] 2.5.2 Documento 1: Título (255 caracteres)
- [ ] 2.5.3 Documento 1: Número da Patente (formato internacional)
- [ ] 2.5.4 Documento 1: Data de Publicação
- [ ] 2.5.5 Documento 1: Inventor(es) (500 caracteres)
- [ ] 2.5.6 Documento 1: Titular (255 caracteres)
- [ ] 2.5.7 Documento 1: Resumo do Conteúdo (200-2000 caracteres)
- [ ] 2.5.8 Documento 1: Lacuna Técnica (200-2000 caracteres)
- [ ] 2.5.9 Documento 1: Relevância (select: Alta/Média/Baixa)
- [ ] 2.5.10 Documento 1: Justificativa (500 caracteres)
- [ ] 2.5.11 Repetir campos para Documento 2
- [ ] 2.5.12 Repetir campos para Documento 3

### 2.6 Conclusão da Busca (2 campos)
- [ ] 2.6.1 Campo É Nova? (radio: Sim/Não)
- [ ] 2.6.2 Campo Justificativa da Novidade (200-2000 caracteres)

### 2.7 Validações Anexo A
- [ ] 2.7.1 Validar data da busca <= data submissão
- [ ] 2.7.2 Validar URLs das bases
- [ ] 2.7.3 Validar pelo menos 1 documento "Alta" relevância
- [ ] 2.7.4 Validar justificativa de novidade

## 3. Anexo B - Matriz Problema x Solução (20 campos)

### 3.1 Setup Anexo B
- [ ] 3.1.1 Criar componente `AnexoB.tsx`
- [ ] 3.1.2 Criar rota `/anexos/b/page.tsx`
- [ ] 3.1.3 Criar schema Zod `AnexoBSchema`

### 3.2 Problema Identificado (4 campos)
- [ ] 3.2.1 Campo Título do Problema (5-100 caracteres)
- [ ] 3.2.2 Campo Descrição do Problema (300-5000 caracteres)
- [ ] 3.2.3 Campo Quem Sofre? (255 caracteres)
- [ ] 3.2.4 Campo Como se Manifesta? (500 caracteres)

### 3.3 Soluções Existentes (3 soluções × 5 campos = 15 campos)
- [ ] 3.3.1 Criar componente `SolucaoExistenteCard` (reutilizável)
- [ ] 3.3.2 Solução A: Nome (100 caracteres)
- [ ] 3.3.3 Solução A: Descrição (100-2000 caracteres)
- [ ] 3.3.4 Solução A: Vantagens (1000 caracteres)
- [ ] 3.3.5 Solução A: Limitações (1000 caracteres) - OBRIGATÓRIO
- [ ] 3.3.6 Solução A: Referências (255 caracteres)
- [ ] 3.3.7 Repetir campos para Solução B
- [ ] 3.3.8 Repetir campos para Solução C

### 3.4 Solução Proposta (5 campos)
- [ ] 3.4.1 Campo Título da Invenção (herdado do form PI)
- [ ] 3.4.2 Campo Descrição Solução (500-10000 caracteres)
- [ ] 3.4.3 Campo Como Funciona (200-5000 caracteres)
- [ ] 3.4.4 Campo Diferencial (500 caracteres)

### 3.5 Vantagens Comparativas (4 campos × 4 métricas = 16 campos)
- [ ] 3.5.1 Métrica 1: Select + Text (Tempo/Custo/Eficiência)
- [ ] 3.5.2 Métrica 1: Valor Solução A (number)
- [ ] 3.5.3 Métrica 1: Valor Sua Invenção (number)
- [ ] 3.5.4 Métrica 1: % Melhoria (readonly, calculado automaticamente)
- [ ] 3.5.5 Métrica 1: Justificativa KPI (500 caracteres)
- [ ] 3.5.6 Repetir para Métrica 2
- [ ] 3.5.7 Repetir para Métrica 3
- [ ] 3.5.8 Repetir para Métrica 4

### 3.6 Validações Anexo B
- [ ] 3.6.1 Validar cálculo automático: `((ValorA - SuaInv) / ValorA) * 100`
- [ ] 3.6.2 Validar mínimo 2 soluções existentes
- [ ] 3.6.3 Validar limitações obrigatórias preenchidas
- [ ] 3.6.4 Validar valores numéricos para cálculo

## 4. Anexo C - Memorial Descritivo (18 campos)

### 4.1 Setup Anexo C
- [ ] 4.1.1 Criar componente `AnexoC.tsx`
- [ ] 4.1.2 Criar rota `/anexos/c/page.tsx`
- [ ] 4.1.3 Criar schema Zod `AnexoCSchema`

### 4.2 Cabeçalho (3 campos)
- [ ] 4.2.1 Campo Título da Invenção (150 caracteres, herdado)
- [ ] 4.2.2 Campo Campo da Invenção (10-500 caracteres)
- [ ] 4.2.3 Campo Estado da Técnica (500-5000 caracteres)

### 4.3 Sumário da Invenção (3 campos)
- [ ] 4.3.1 Campo Objetivos (50-500 caracteres)
- [ ] 4.3.2 Campo Características Principais (200-2000 caracteres)
- [ ] 4.3.3 Campo Vantagens (100-1500 caracteres)

### 4.4 Descrição Detalhada (4 campos)
- [ ] 4.4.1 Campo Componentes/Elementos (3000 caracteres)
- [ ] 4.4.2 Campo Funcionamento (500-10000 caracteres)
- [ ] 4.4.3 Campo Modo de Realização (500-10000 caracteres)
- [ ] 4.4.4 Campo Parâmetros Específicos (faixas: 40-45°C)

### 4.5 Desenhos/Figuras (4 campos × N figuras)
- [ ] 4.5.1 Campo Número da Figura (automático: Fig. 1, Fig. 2...)
- [ ] 4.5.2 Campo Descrição da Figura (200 caracteres)
- [ ] 4.5.3 Campo Arquivo da Figura (upload PDF/TIFF)
- [ ] 4.5.4 Campo Referências Numéricas (1: Bloco, 2: Dispositivo)
- [ ] 4.5.5 Permitir adicionar/remover figuras dinamicamente

### 4.6 Reivindicações (mínimo 3, máximo 10)
- [ ] 4.6.1 Criar componente `ReivindicacaoInput` (reutilizável)
- [ ] 4.6.2 Reivindicação 1: Textarea (100-5000 caracteres, "1. Um...")
- [ ] 4.6.3 Reivindicação 2: Textarea (100-5000 caracteres, "2. O ... de acordo com a reivindicação 1...")
- [ ] 4.6.4 Reivindicação 3: Textarea (100-5000 caracteres)
- [ ] 4.6.5 Reivindicações 4-10: Opcionais
- [ ] 4.6.6 Permitir adicionar/remover reivindicações dinamicamente (máx 10)

### 4.7 Validações Anexo C
- [ ] 4.7.1 Validar formato reivindicações (começam com número)
- [ ] 4.7.2 Validar reivindicação 1 independente
- [ ] 4.7.3 Validar reivindicações 2+ dependentes
- [ ] 4.7.4 Validar arquivos de figuras (PDF/TIFF)
- [ ] 4.7.5 Validar mínimo 3 reivindicações
- [ ] 4.7.6 Validar máximo 10 reivindicações

## 5. Anexo F - Qualificação de Inventores (20 campos × N inventores)

### 5.1 Setup Anexo F
- [ ] 5.1.1 Criar componente `AnexoF.tsx`
- [ ] 5.1.2 Criar rota `/anexos/f/page.tsx`
- [ ] 5.1.3 Criar schema Zod `AnexoFSchema`

### 5.2 Inventores (9 campos × N inventores)
- [ ] 5.2.1 Criar componente `InventorCard` (reutilizável)
- [ ] 5.2.2 Campo Nome Completo (5-255 caracteres)
- [ ] 5.2.3 Campo CPF (máscara + validação algorítmica)
- [ ] 5.2.4 Campo RG (máscara 00.000.000-X)
- [ ] 5.2.5 Campo E-mail (validação formato)
- [ ] 5.2.6 Campo Telefone (formato (XX) XXXXX-XXXX)
- [ ] 5.2.7 Campo Departamento/Unidade (100 caracteres)
- [ ] 5.2.8 Campo Cargo/Função (100 caracteres)
- [ ] 5.2.9 Campo % Participação (0-100, decimal permitido)
- [ ] 5.2.10 Campo Justificativa % (500 caracteres)
- [ ] 5.2.11 Permitir adicionar/remover inventores dinamicamente
- [ ] 5.2.12 Validar soma % participação = 100%

### 5.3 SisGen (4 campos condicionais)
- [ ] 5.3.1 Campo Usa Biodiversidade? (radio: Sim/Não)
- [ ] 5.3.2 Campo Número SisGen (UUID, condicional)
- [ ] 5.3.3 Campo Espécie Utilizada (255 caracteres, condicional)
- [ ] 5.3.4 Campo Origem do Material (255 caracteres, condicional)
- [ ] 5.3.5 Validar campos OBRIGATÓRIOS se Usa Biodiversidade = Sim

### 5.4 Financiamento (4 campos condicionais)
- [ ] 5.4.1 Campo Financiamento Externo? (radio: Sim/Não)
- [ ] 5.4.2 Campo Agência Financiadora (255 caracteres, condicional)
- [ ] 5.4.3 Campo Número do Processo (100 caracteres, condicional)
- [ ] 5.4.4 Campo Valor Financiado (currency R$, condicional)
- [ ] 5.4.5 Validar campos OBRIGATÓRIOS se Financiamento = Sim

### 5.5 Declaração (3 campos)
- [ ] 5.5.1 Checkbox Declaro Originalidade (obrigatório marcado)
- [ ] 5.5.2 Checkbox Declaro Cessão de Direitos (obrigatório marcado)
- [ ] 5.5.3 Campo Assinatura Digital (upload certificado ou botão assinar)

### 5.6 Validações Anexo F
- [ ] 5.6.1 Validar CPF com algoritmo
- [ ] 5.6.2 Validar soma % participação = 100%
- [ ] 5.6.3 Validar campos condicionais SisGen
- [ ] 5.6.4 Validar campos condicionais Financiamento
- [ ] 5.6.5 Validar declarações marcadas

## 6. Integração API Mock
- [ ] 6.1 Criar `lib/mock-api-anexos.ts`
- [ ] 6.2 Implementar `apiSalvarAnexoA(data)`
- [ ] 6.3 Implementar `apiSalvarAnexoB(data)`
- [ ] 6.4 Implementar `apiSalvarAnexoC(data)`
- [ ] 6.5 Implementar `apiSalvarAnexoF(data)`
- [ ] 6.6 Implementar `apiCarregarAnexos(pedidoId)`
- [ ] 6.7 Implementar `apiListarAnexos()`

## 7. Dashboard e Navegação
- [ ] 7.1 Criar página `/anexos` (gerenciamento de anexos)
- [ ] 7.2 Adicionar cards para os 4 anexos na homepage
- [ ] 7.3 Implementar indicador de progresso por anexo
- [ ] 7.4 Adicionar links diretos para cada anexo
- [ ] 7.5 Implementar navegação entre anexos (fluxo recomendado)

## 8. Salvamento Automático
- [ ] 8.1 Implementar salvamento automático (localStorage) para todos os anexos
- [ ] 8.2 Implementar recuperação de rascunho
- [ ] 8.3 Implementar indicador "Salvando..." / "Salvo"
- [ ] 8.4 Implementar botões "Salvar Rascunho" / "Concluir Anexo"

## 9. Validações Zod
- [ ] 9.1 Criar `lib/validations/anexos.ts`
- [ ] 9.2 Criar `AnexoASchema` (19 campos + validações específicas)
- [ ] 9.3 Criar `AnexoBSchema` (20 campos + cálculo %)
- [ ] 9.4 Criar `AnexoCSchema` (18 campos + reivindicações)
- [ ] 9.5 Criar `AnexoFSchema` (20 campos × N + soma 100%)

## 10. UX e Componentes Reutilizáveis
- [ ] 10.1 Componente `InventorCard` (Anexo F)
- [ ] 10.2 Componente `SolucaoExistenteCard` (Anexo B)
- [ ] 10.3 Componente `DocumentoRelevanteCard` (Anexo A)
- [ ] 10.4 Componente `ReivindicacaoInput` (Anexo C)
- [ ] 10.5 Componente `FiguraInput` (Anexo C)
- [ ] 10.6 Tooltips de ajuda para campos críticos
- [ ] 10.7 Feedback visual (RAG) para validações

## 11. Responsividade
- [ ] 11.1 Adaptar Anexo A para mobile/tablet/desktop
- [ ] 11.2 Adaptar Anexo B para mobile/tablet/desktop
- [ ] 11.3 Adaptar Anexo C para mobile/tablet/desktop
- [ ] 11.4 Adaptar Anexo F para mobile/tablet/desktop

## 12. Testes
- [ ] 12.1 Testar validações Anexo A (datas, URLs, relevância)
- [ ] 12.2 Testar cálculo automático % (Anexo B)
- [ ] 12.3 Testar formato reivindicações (Anexo C)
- [ ] 12.4 Testar multi-inventores e soma % (Anexo F)
- [ ] 12.5 Testar campos condicionais (SisGen, Financiamento)
- [ ] 12.6 Testar salvamento e recuperação de rascunho
- [ ] 12.7 Testar responsividade em todos os anexos

## 13. Documentação
- [ ] 13.1 Atualizar README com instruções dos anexos
- [ ] 13.2 Documentar componentes reutilizáveis criados
- [ ] 13.3 Adicionar exemplos de uso dos anexos
- [ ] 13.4 Documentar fluxo recomendado (A → B → C → F)

**Total de Tasks**: 150+
**Estimativa**: 11-15 dias de desenvolvimento
