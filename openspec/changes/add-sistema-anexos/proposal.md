# Change: Implementar Sistema de Anexos (A/B/C/F)

## Why

O sistema de gestão de propriedade intelectual da UPE precisa de um sistema completo de anexos para suportar o fluxo de patenteamento. Atualmente, apenas os formulários principais (PI/MU/CII/RPC) foram implementados, mas os anexos obrigatórios do INPI ainda não existem.

**Impacto**: Os anexos são CRÍTICOS para o processo de patenteamento:
- **Anexo A** (Busca de Anterioridade): OBRIGATÓRIO para avaliar novidade
- **Anexo B** (Matriz Problema x Solução): OBRIGATÓRIO para demonstrar atividade inventiva
- **Anexo C** (Memorial Descritivo): OBRIGATÓRIO para depósito no INPI
- **Anexo F** (Qualificação de Inventores): OBRIGATÓRIO para titularidade e SisGen

Sem estes anexos, o sistema não pode completar o fluxo de submissão.

## What Changes

- **ADICIONAR** 4 componentes de anexos React (AnexoA, AnexoB, AnexoC, AnexoF)
- **ADICIONAR** Sistema de gestão de anexos com CRUD
- **ADICIONAR** Validações específicas por tipo de anexo
- **ADICIONAR** Integração com formulários principais
- **ADICIONAR** Sistema de salvamento progressivo (rascunho)
- **ADICIONAR** Geração automática de PDFs (fase 2)
- **ATUALIZAR** Dashboard para incluir acesso aos anexos
- **ATUALIZAR** Modelos de dados para incluir anexos

**BREAKING**: Nenhuma mudança breaking - é funcionalidade nova.

## Detalhamento dos Anexos

### Anexo A - Busca de Anterioridade (19 campos)
**Objetivo**: Comprovar novidade da invenção através de busca em bases de patentes

**Campos Críticos**:
- Data da Busca, Responsável
- 3 Termos de busca (strings)
- 3 Bases consultadas (INPI, Espacenet, Google Patents)
- Top 3 Documentos Relevantes (cada um com 8 campos)
- Conclusão da Busca (É Nova? + Justificativa)

**Validações Especiais**:
- Data da busca <= Data de submissão
- URL das bases deve ser válida
- Pelo menos 1 documento relevante deve ser "Alta" relevância
- Justificativa de novidade (200-2000 caracteres)

### Anexo B - Matriz Problema x Solução (20 campos)
**Objetivo**: Demonstrar atividade inventiva através de comparação com soluções existentes

**Campos Críticos**:
- Problema Identificado (4 campos)
- 3 Soluções Existentes (cada uma com 5 campos)
- Solução Proposta (5 campos)
- 4 Vantagens Comparativas com cálculo automático de % melhoria

**Validações Especiais**:
- Cálculo automático: `((ValorA - SuaInv) / ValorA) * 100`
- Pelo menos 2 soluções existentes devem ser preenchidas
- Limitações das soluções existentes são OBRIGATÓRIAS
- Valores devem ser numéricos para permitir cálculo

### Anexo C - Memorial Descritivo (18 campos)
**Objetivo**: Documento técnico central do pedido de patente (INPI Form 1.01)

**Campos Críticos**:
- Cabeçalho (3 campos): Título, Campo, Estado da Técnica
- Sumário (3 campos): Objetivos, Características, Vantagens
- Descrição Detalhada (4 campos): Componentes, Funcionamento, Modo de Realização, Parâmetros
- Desenhos/Figuras (4 campos): Número, Descrição, Arquivo PDF/TIFF, Referências
- Reivindicações (mínimo 3): 1 Independente + 2 Dependentes + até 7 adicionais

**Validações Especiais**:
- Reivindicações devem começar com número (1., 2., 3.)
- Reivindicação 1 deve ser independente ("1. Um...")
- Reivindicações 2+ devem ser dependentes ("2. O ... de acordo com a reivindicação 1")
- Arquivos de figuras: PDF ou TIFF apenas
- Mínimo 3 reivindicações, máximo 10

### Anexo F - Qualificação de Inventores (20 campos)
**Objetivo**: Definir titularidade, obrigações legais e conformidade (SisGen, Financiamento)

**Campos Críticos**:
- Dados do Inventor (9 campos × N inventores): Nome, CPF, RG, Email, Telefone, Departamento, Cargo, % Participação, Justificativa
- SisGen (4 campos condicionais): Usa biodiversidade?, Número SisGen, Espécie, Origem
- Financiamento (4 campos condicionais): Financiamento externo?, Agência, Número processo, Valor
- Declarações (3 campos): Originalidade, Cessão de direitos, Assinatura digital

**Validações Especiais**:
- CPF validado com algoritmo
- Soma de % participação deve = 100%
- Se "Usa biodiversidade" = Sim, campos SisGen OBRIGATÓRIOS
- Se "Financiamento externo" = Sim, campos financiamento OBRIGATÓRIOS
- Declarações (checkboxes) devem estar marcadas para avançar
- Assinatura digital (upload de certificado ou assinatura eletrônica)

## Impact

### Affected specs
- **frontend** (atualizar - adicionar requisitos anexos)
- **database** (atualizar - adicionar tabelas anexos)

### Affected code
- `web-app/app/anexos/` (NOVO - diretório de anexos)
  - `anexo-a/page.tsx` (NOVO)
  - `anexo-b/page.tsx` (NOVO)
  - `anexo-c/page.tsx` (NOVO)
  - `anexo-f/page.tsx` (NOVO)
- `web-app/components/anexos/` (NOVO)
  - `AnexoA.tsx` (NOVO)
  - `AnexoB.tsx` (NOVO)
  - `AnexoC.tsx` (NOVO)
  - `AnexoF.tsx` (NOVO)
- `web-app/components/anexos/shared/` (NOVO)
  - `InventorCard.tsx` (NOVO - reutilizável para AnexoF)
  - `SolucaoExistenteCard.tsx` (NOVO - reutilizável para AnexoB)
  - `DocumentoRelevanteCard.tsx` (NOVO - reutilizável para AnexoA)
  - `ReivindicacaoInput.tsx` (NOVO - reutilizável para AnexoC)
- `web-app/lib/validations/anexos.ts` (NOVO - schemas Zod)
- `web-app/lib/mock-api-anexos.ts` (NOVO - endpoints mock)
- `web-app/app/page.tsx` (ATUALIZAR - adicionar cards anexos)

### Dependencies
- Especificações: `SPEC_ANEXO_*.md` (completas)
- Formulários principais: Já implementados (PI/MU/CII/RPC)
- Componentes base: Já existem (CampoTexto, CampoSelect, etc.)
- Validação: Zod (já em package.json)
- PDF: jsPDF ou similar (para geração futura)

## Success Criteria

### Funcionalidade Geral
1. ✅ Sistema de anexos acessível via `/anexos`
2. ✅ 4 anexos implementados (A/B/C/F)
3. ✅ Total de 77 campos distribuídos
4. ✅ Validações específicas por anexo funcionando
5. ✅ Salvamento automático de rascunho
6. ✅ Integração com formulários principais

### Anexo A - Busca Anterioridade
1. ✅ 19 campos implementados
2. ✅ Validação de datas (busca <= submissão)
3. ✅ Validação de URLs
4. ✅ Mínimo 1 documento "Alta" relevância
5. ✅ Justificativa de novidade validada

### Anexo B - Matriz Problema x Solução
1. ✅ 20 campos implementados
2. ✅ Cálculo automático de % melhoria
3. ✅ Mínimo 2 soluções existentes
4. ✅ Validação de campos numéricos
5. ✅ Limitações obrigatórias preenchidas

### Anexo C - Memorial Descritivo
1. ✅ 18 campos implementados
2. ✅ Mínimo 3 reivindicações
3. ✅ Validação de formato reivindicações
4. ✅ Upload de figuras PDF/TIFF
5. ✅ Máximo 10 reivindicações

### Anexo F - Qualificação Inventores
1. ✅ 20 campos implementados (× N inventores)
2. ✅ Soma % participação = 100%
3. ✅ CPF validado com algoritmo
4. ✅ Campos condicionais funcionando
5. ✅ Declarações obrigatórias marcadas

## Timeline Estimate

- **Desenvolvimento Anexo A**: 2-3 dias (19 campos, validações complexas)
- **Desenvolvimento Anexo B**: 2-3 dias (20 campos, cálculo automático)
- **Desenvolvimento Anexo C**: 3-4 dias (18 campos, estrutura complexa)
- **Desenvolvimento Anexo F**: 2-3 dias (20 campos, multi-inventores)
- **Testes e Integração**: 2 dias
- **Total**: 11-15 dias

## Related Issues/Docs

- Especificações: `SPEC_ANEXO_A.md`, `SPEC_ANEXO_B.md`, `SPEC_ANEXO_C.md`, `SPEC_ANEXO_F.md`
- Contexto domínio: `openspec/project.md` (linhas sobre 5 fases)
- INPI Form 1.01: Formulário oficial de depósito
- Lei 9.279/96: Lei de Propriedade Industrial
- Lei 13.123/15: Lei de Biodiversidade (SisGen)

## Open Questions

1. **Geração de PDF**: Devemos implementar geração automática de PDFs dos anexos?
   - **Recomendação**: Fase 2 - primeiro implementar edição HTML, depois PDF

2. **Assinatura Digital**: Como implementar assinatura digital no Anexo F?
   - **Recomendação**: Fase 2 - primeiro upload de certificado, depois integração com ICP-Brasil

3. **Persistência de Dados**: Como salvar progresso dos anexos (multi-inventores, figuras)?
   - **Recomendação**: Usar localStorage para rascunho, backend real para dados finais

4. **Ordem Obrigatória**: Os anexos têm ordem recomendada (A → B → C → F)?
   - **Recomendação**: Sim, seguir ordem do fluxo INPI, mas permitir acesso direto

## Dependências

- Formulários principais (PI/MU/CII/RPC): ✅ COMPLETO
- Backend API: ✅ COMPLETO
- Validações Zod: ✅ COMPLETO
- Sistema de upload: ✅ COMPLETO (parcialmente - formulários CII/RPC)
