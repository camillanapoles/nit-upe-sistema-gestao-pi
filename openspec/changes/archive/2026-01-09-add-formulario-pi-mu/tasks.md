# Tasks - Implementar Formulário PI/MU

## 1. Preparação e Setup
- [x] 1.1 Criar rota `/formulario-pi-mu` no Next.js (app/formulario-pi-mu/page.tsx)
- [x] 1.2 Configurar estrutura de componentes (components/forms/)
- [x] 1.3 Instalar/configurar Zod para validações (se necessário)

## 2. Componentes do Formulário
- [x] 2.1 Criar componente FormularioPI com estrutura base
- [x] 2.2 Implementar campo Título (max 150 caracteres)
- [x] 2.3 Implementar campo Problema/Dor (100-1000 caracteres)
- [x] 2.4 Implementar campo Solução Técnica (500-4000 caracteres)
- [x] 2.5 Implementar campo Estado da Técnica (200-2000 caracteres)
- [x] 2.6 Implementar campo Vantagens (100-1500 caracteres)
- [x] 2.7 Implementar campo Palavras-chave (50-100 caracteres)
- [x] 2.8 Implementar campo Resumo (50-200 palavras)
- [x] 2.9 Implementar selector Tipo Patente (PI vs MU)
- [x] 2.10 Implementar upload de anexos (preparação para fase futura)

## 3. Validações
- [x] 3.1 Criar schema Zod para todos os campos
- [x] 3.2 Implementar validação em tempo real
- [x] 3.3 Adicionar contadores de caracteres
- [x] 3.4 Implementar feedback visual (RAG semaforização)
  - Verde: Dentro do recomendado
  - Amarelo: Aproximando do limite
  - Vermelho: Fora dos limites

## 4. Integração API
- [x] 4.1 Integrar com `apiCriarPedido` do mock-api.ts
- [x] 4.2 Implementar tratamento de erros
- [x] 4.3 Adicionar loading states
- [x] 4.4 Implementar feedback de sucesso

## 5. UX e Melhorias
- [x] 5.1 Implementar salvamento automático (localStorage)
- [x] 5.2 Adicionar botões de ação (Salvar Rascunho, Submeter)
- [x] 5.3 Implementar navegação entre seções (wizard)
- [x] 5.4 Adicionar tooltips de ajuda baseados em gotchas críticos
- [x] 5.5 Implementar confirmação antes de submeter

## 6. Responsividade
- [x] 6.1 Adaptar layout para mobile (< 768px)
- [x] 6.2 Adaptar layout para tablet (768px - 1024px)
- [x] 6.3 Testar em diferentes tamanhos de tela

## 7. Integração Dashboard
- [x] 7.1 Atualizar página inicial com botão "Novo Pedido"
- [x] 7.2 Adicionar link para formulário na navegação
- [x] 7.3 Testar fluxo completo (dashboard → formulário → submissão → dashboard)

## 8. Testes
- [x] 8.1 Testar validação de todos os campos
- [x] 8.2 Testar limites de caracteres (mínimo e máximo)
- [x] 8.3 Testar submissão com sucesso
- [x] 8.4 Testar tratamento de erros
- [x] 8.5 Testar salvamento de rascunho
- [x] 8.6 Testar responsividade

## 9. Documentação
- [x] 9.1 Atualizar README com instruções do formulário
- [x] 9.2 Documentar componentes criados
- [x] 9.3 Adicionar exemplos de uso

## 10. Code Quality
- [x] 10.1 Revisar código quanto às convenções do projeto
- [x] 10.2 Garantir tipagem TypeScript correta
- [x] 10.3 Otimizar performance (useMemo, useCallback onde necessário)
- [x] 10.4 Verificar acessibilidade (ARIA labels, keyboard navigation)

**Total de Tasks**: 47 - **TODAS COMPLETADAS**
**Estimativa**: 3-4 dias de desenvolvimento
