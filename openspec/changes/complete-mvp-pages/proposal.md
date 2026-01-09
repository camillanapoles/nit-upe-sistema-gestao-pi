# Change: Completar MVP para GitHub Pages (branch pages-mvp)

## Why

A branch `pages-mvp` foi criada para deploy estático no GitHub Pages, mas atualmente está incompleta. O MVP precisa ser **100% funcional** conforme o projeto original para ser apresentado como versão demonstrativa do sistema de gestão de propriedade intelectual da UPE.

**Impacto**: Sem o MVP completo, não é possível:
- Demonstrar o sistema completo para stakeholders
- Validar a experiência do usuário final
- Testar o fluxo completo de submissão de pedidos
- Apresentar para avaliação e feedback

**Contexto**:
- Formulários CII/RPC: ✅ 69/69 tarefas completadas (arquivado)
- Formulário PI/MU: ✅ Implementado
- Anexos (A/B/C/F): 🔄 Componentes criados mas NÃO integrados
- Sistema de submissão: 🔄 Parcialmente implementado
- Dashboard: ✅ Implementado

## What Changes

- **COMPLETAR** integração dos Anexos (A/B/C/F) com fluxo principal
- **COMPLETAR** sistema de submissão com geração de PDF
- **COMPLETAR** página de confirmação e dashboard de pedidos
- **ADICIONAR** landing page de apresentação do MVP
- **ATUALIZAR** README com instruções do MVP
- **VALIDAR** build estático e deploy no GitHub Pages

**BREAKING**: Nenhuma - são adições ao frontend estático existente.

## Critérios de Aceite do MVP

O MVP será considerado completo quando:

1. ✅ Todos os formulários (PI/MU, CII, RPC) funcionando
2. ✅ Todos os anexos (A, B, C, F) integrados e acessíveis
3. ✅ Sistema de salvamento automático (rascunho) funcionando
4. ✅ Submissão completa com confirmação visual
5. ✅ Dashboard mostrando pedidos submetidos
6. ✅ Build estático funcionando sem erros
7. ✅ Deploy no GitHub Pages acessível
8. ✅ Responsividade validada em mobile/tablet/desktop
9. ✅ README completo com screenshots
10. ✅ Licença e informações da UPE

## Escopo vs Não-Escopo

### INCLUÍDO no MVP:
| Item | Status |
|------|--------|
| Formulário PI/MU | ✅ Completo |
| Formulário CII | ✅ Completo |
| Formulário RPC | ✅ Completo |
| Anexo A (Busca Anterioridade) | 🔄 Criado, precisa integração |
| Anexo B (Matriz Problema-Solução) | 🔄 Criado, precisa integração |
| Anexo C (Memorial Descritivo) | 🔄 Criado, precisa integração |
| Anexo F (Qualificação Inventores) | 🔄 Criado, precisa integração |
| Auto-save localStorage | ✅ Implementado |
| Mock API | ✅ Implementado |
| Dashboard | ✅ Implementado |
| GitHub Pages CI/CD | ✅ Configurado |

### NÃO INCLUÍDO (Fases Posteriores):
- Backend real (PostgreSQL, API Routes)
- Autenticação real
- Integração INPI e-INPI
- Geração de PDF real (simulado no MVP)
- Notificações por email
- RPI Scraper

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Anexos criados mas não integrados | Alto | Integrar components com formulários principais |
| Validações inconsistentes | Médio | Revisar schemas Zod de todos os anexos |
| Build estático com erros | Alto | Validar `output: 'export'` após cada mudança |
| Responsividade quebrada | Médio | Testar em diferentes tamanhos de tela |
