# Change: Implementar Formulários CII e RPC

## Why

O sistema de gestão de propriedade intelectual da UPE precisa de formulários funcionais para submissão de pedidos de Computer Implemented Invention (CII - Patente de Software com Efeito Técnico) e Registro de Programa de Computador (RPC - Direito Autoral). Atualmente, apenas o formulário PI/MU foi implementado, deixando lacunas para submissões de software.

**Impacto**: Estas são funcionalidades críticas para o sistema. O formulário CII é essencial para patentes de software (diferente de direito autoral), e o formulário RPC é obrigatório para registro de programas de computador no INPI.

**Diferenças Chave**:
- **CII**: Requer "Efeito Técnico" (como o software melhora o hardware), métricas quantitativas, fluxograma BPMN, e tripla reivindicação (método, sistema, mídia)
- **RPC**: Requer upload de código-fonte ZIP, manual do usuário, dados do autor (CPF), e prova de vínculo com UPE

## What Changes

- **ADICIONAR** Componente de formulário React para CII (Patente de Software)
- **ADICIONAR** Componente de formulário React para RPC (Direito Autoral)
- **ADICIONAR** Validação de campos específicos CII (efeito técnico, métricas, fluxograma)
- **ADICIONAR** Validação de campos específicos RPC (código-fonte ZIP, CPF, vínculo UPE)
- **ADICIONAR** Upload de arquivos (PDF, ZIP) para fluxogramas e código-fonte
- **ADICIONAR** Páginas de rota `/formulario-cii` e `/formulario-rpc` no Next.js
- **ADICIONAR** Selector de tipo de patente na homepage (PI/MU/CII/RPC)
- **ATUALIZAR** Dashboard para incluir links para todos os formulários

**BREAKING**: Nenhuma mudança breaking - é funcionalidade nova.

## Impact

### Affected specs
- **frontend** (atualizar - adicionar requisitos CII/RPC)

### Affected code
- `web-app/app/formulario-cii/page.tsx` (NOVO)
- `web-app/app/formulario-rpc/page.tsx` (NOVO)
- `web-app/components/forms/FormularioCII.tsx` (NOVO)
- `web-app/components/forms/FormularioRPC.tsx` (NOVO)
- `web-app/lib/validations.ts` (ATUALIZAR - adicionar schemas CII/RPC)
- `web-app/app/page.tsx` (ATUALIZAR - adicionar selector tipo)
- `web-app/lib/mock-api.ts` (ATUALIZAR - adicionar endpoints CII/RPC)

### Dependencies
- Especificação CII: `SPEC_FORMULARIO_CII.md` (completo)
- Especificação RPC: `SPEC_FORMULARIO_RPC.md` (completo)
- API Mock existente: `web-app/lib/mock-api.ts`
- Componentes base: KPICard, Badges (já existem)
- Validação: Zod (já em package.json)
- Upload: Next.js built-in file handling

## Success Criteria

### CII Formulário
1. ✅ Formulário acessível em `/formulario-cii`
2. ✅ Todos os 17 campos da especificação implementados
3. ✅ Validação de efeito técnico (mínimo 200, máximo 2000 caracteres)
4. ✅ Validação de métrica quantitativa (obrigatório uso de % ou tempo)
5. ✅ Upload de fluxograma PDF (máx 10MB)
6. ✅ Tripla reivindicação (método, sistema, mídia)
7. ✅ Responsivo em mobile/tablet/desktop

### RPC Formulário
1. ✅ Formulário acessível em `/formulario-rpc`
2. ✅ Todos os 13 campos da especificação implementados
3. ✅ Validação de CPF (máscara e algoritmo)
4. ✅ Upload de código-fonte ZIP (máx 50MB)
5. ✅ Upload de manual PDF (máx 10MB)
6. ✅ Validação de vínculo com UPE
7. ✅ Responsivo em mobile/tablet/desktop

### Integração
1. ✅ Selector de tipo de patente na homepage
2. ✅ Links para todos os formulários (PI/MU/CII/RPC)
3. ✅ Submissão salva na API mock
4. ✅ Salvamento automático de rascunho

## Timeline Estimate

- **Desenvolvimento CII**: 2-3 dias
- **Desenvolvimento RPC**: 2-3 dias
- **Testes**: 1-2 dias
- **Total**: 5-8 dias

## Related Issues/Docs

- Especificação CII: `SPEC_FORMULARIO_CII.md`
- Especificação RPC: `SPEC_FORMULARIO_RPC.md`
- Contexto domínio: `openspec/project.md` (linhas 289-355)
- Gotchas críticos CII: Efeito técnico é OBRIGATÓRIO para patente de software
- Gotchas críticos RPC: Código-fonte completo é obrigatório para registro

## Open Questions

1. **Validação de ZIP**: Devemos validar o conteúdo do ZIP no cliente (limitado) ou apenas no servidor?
   - **Recomendação**: Validar apenas extensão e tamanho no cliente; validar conteúdo no servidor

2. **Fluxograma BPMN**: Devemos fornecer um editor de fluxograma integrado ou apenas upload de PDF?
   - **Recomendação**: Apenas upload de PDF por enquanto (editor seria um projeto separado)

3. **Geração de Termo de Cessão**: RPC requer termo de cessão de direitos autorais se vínculo UPE = "Sim"
   - **Recomendação**: Implementar geração simples de PDF na próxima fase
