# Change: Implementar Formulário PI/MU

## Why

O sistema de gestão de propriedade intelectual da UPE precisa de um formulário funcional para submissão de pedidos de patente (PI) e modelo de utilidade (MU). Atualmente, o sistema possui apenas uma página de dashboard e uma API mock, sem capacidade de receber submissões reais de inventores.

**Impacto**: Esta é a funcionalidade principal do sistema. Sem formulários funcionais, o fluxo completo de 5 fases do processo de patenteamento não pode ser iniciado.

## What Changes

- **ADICIONAR** Componente de formulário React para PI/MU
- **ADICIONAR** Validação de campos com Zod (limites de caracteres críticos)
- **ADICIONAR** Integração com API mock existente
- **ADICIONAR** Página de rota `/formulario-pi-mu` no Next.js
- **ADICIONAR** Salvamento automático (rascunho local)
- **ADICIONAR** Feedback visual com semaforização RAG (Red/Amber/Green)
- **ATUALIZAR** Dashboard para incluir botão "Novo Pedido"

**BREAKING**: Nenhuma mudança breaking - é funcionalidade nova.

## Impact

### Affected specs
- **frontend** (nova spec a ser criada)

### Affected code
- `web-app/app/formulario-pi-mu/page.tsx` (NOVO)
- `web-app/components/forms/FormularioPI.tsx` (NOVO)
- `web-app/lib/validations.ts` (NOVO)
- `web-app/app/page.tsx` (ATUALIZAR - adicionar botão)
- `web-app/lib/mock-api.ts` (JÁ EXISTE - integrar)

### Dependencies
- Especificação: `SPEC_FORMULARIO_PI.md` (completo)
- API Mock: `web-app/lib/mock-api.ts` (já existe)
- Componentes base: KPICard, Badges (já existem)
- Validação: Zod (já em package.json)

## Success Criteria

1. ✅ Formulário acessível em `/formulario-pi-mu`
2. ✅ Todos os campos da especificação implementados
3. ✅ Validação de caracteres funcionando (limites críticos)
4. ✅ Submissão salva na API mock
5. ✅ Feedback visual (RAG) em todos os campos
6. ✅ Responsivo em mobile/tablet/desktop
7. ✅ Salvamento automático de rascunho

## Timeline Estimate

- **Desenvolvimento**: 2-3 dias
- **Testes**: 1 dia
- **Total**: 3-4 dias

## Related Issues/Docs

- Especificação: `SPEC_FORMULARIO_PI.md`
- Contexto domínio: `openspec/project.md` (linhas 289-355)
- Limites caracteres: `openspec/project.md` (linha 344-354)
- Gotchas críticos: `openspec/project.md` (linha 356-373)
