# Tasks - Completar MVP para GitHub Pages

## 1. Anexos - Integração e Validação
- [ ] 1.1 Revisar componentes AnexoA/B/C/F existentes
- [ ] 1.2 Adicionar validações Zod em todos os anexos
- [ ] 1.3 Implementar auto-save para cada anexo (localStorage)
- [ ] 1.4 Adicionar indicadores de completude em cada anexo
- [ ] 1.5 Testar navegação entre anexos
- [ ] 1.6 Validar limites de caracteres em todos os campos
- [ ] 1.7 Implementar recuperação de rascunho por anexo

## 2. Integração Formulários ↔ Anexos
- [ ] 2.1 Adicionar botão "Adicionar Anexos" nos formulários PI/MU/CII/RPC
- [ ] 2.2 Criar mecanismo de passagem de pedidoId entre formulário e anexos
- [ ] 2.3 Implementar contador de anexos preenchidos no formulário
- [ ] 2.4 Adicionar validação: anexos obrigatórios antes da submissão
- [ ] 2.5 Implementar estado compartido entre formulário e anexos
- [ ] 2.6 Testar fluxo: formulário → anexo → voltar ao formulário
- [ ] 2.7 Adicionar links diretos para cada anexo na tela de revisão

## 3. Página de Anexos (Index)
- [ ] 3.1 Criar cards visuais para cada anexo (A/B/C/F)
- [ ] 3.2 Mostrar status de completude de cada anexo
- [ ] 3.3 Adicionar descrições do propósito de cada anexo
- [ ] 3.4 Implementar ordenamento: anexos obrigatórios primeiro
- [ ] 3.5 Adicionar filtros: todos / pendentes / completos
- [ ] 3.6 Responsividade para mobile (cards empilhados)
- [ ] 3.7 Adicionar progress bar geral do processo

## 4. Tela de Confirmação/Revisão
- [ ] 4.1 Criar componente de revisão pré-submissão
- [ ] 4.2 Exibir resumo do formulário principal
- [ ] 4.3 Exibir status de cada anexo (completo/incompleto)
- [ ] 4.4 Adicionar checkbox de confirmação obrigatória
- [ ] 4.5 Implementar botão "Voltar e Editar" por seção
- [ ] 4.6 Adicionar modo de visualização em PDF (simulado)
- [ ] 4.7 Testar fluxo completo até a submissão

## 5. Tela de Sucesso
- [ ] 5.1 Criar página de sucesso após submissão
- [ ] 5.2 Exibir número do pedido gerado (simulado)
- [ ] 5.3 Adicionar botão "Novo Pedido"
- [ ] 5.4 Adicionar botão "Ver Meus Pedidos"
- [ ] 5.5 Implementar confete/celebração visual
- [ ] 5.6 Mostrar resumo do que foi submetido
- [ ] 5.7 Oferecer opção de imprimir/compartilhar

## 6. Dashboard de Pedidos
- [ ] 6.1 Criar página "/pedidos" para listar pedidos submetidos
- [ ] 6.2 Buscar pedidos do localStorage
- [ ] 6.3 Exibir cards com resumo de cada pedido
- [ ] 6.4 Adicionar filtros por tipo (PI/MU/CII/RPC)
- [ ] 6.5 Adicionar filtros por status (rascunho/submetido)
- [ ] 6.6 Implementar opção de excluir pedido
- [ ] 6.7 Implementar opção de continuar rascunho
- [ ] 6.8 Adicionar data de criação em cada pedido

## 7. Landing Page MVP
- [ ] 7.1 Criar hero section com título e call-to-action
- [ ] 7.2 Adicionar seção "Como Funciona" (3 passos)
- [ ] 7.3 Adicionar seção "Tipos de Patente" (cards)
- [ ] 7.4 Adicionar seção "Sobre o NIT/UPE"
- [ ] 7.5 Implementar smooth scroll para seções
- [ ] 7.6 Adicionar botão "Começar Agora" destacado
- [ ] 7.7 Responsividade completa

## 8. Anexo A - Busca de Anterioridade
- [ ] 8.1 Validar todos os 19 campos do Anexo A
- [ ] 8.2 Implementar validação de datas (busca <= submissão)
- [ ] 8.3 Adicionar validação de URLs de bases consultadas
- [ ] 8.4 Implementar cálculo de relevância (automático)
- [ ] 8.5 Validar que pelo menos 1 documento é "Alta relevância"
- [ ] 8.6 Adicionar exemplos de preenchimento correto
- [ ] 8.7 Testar fluxo completo do Anexo A

## 9. Anexo B - Matriz Problema x Solução
- [ ] 9.1 Validar todos os 20 campos do Anexo B
- [ ] 9.2 Implementar cálculo automático de % melhoria
- [ ] 9.3 Validar que pelo menos 2 soluções existentes são preenchidas
- [ ] 9.4 Adicionar validação de campos numéricos
- [ ] 9.5 Implementar sugestões baseadas em problemas preenchidos
- [ ] 9.6 Adicionar visualização comparativa (tabela)
- [ ] 9.7 Testar fluxo completo do Anexo B

## 10. Anexo C - Memorial Descritivo
- [ ] 10.1 Validar todos os 18 campos do Anexo C
- [ ] 10.2 Implementar validação de reivindicações (número 1 independente)
- [ ] 10.3 Adicionar validação: mínimo 3 reivindicações
- [ ] 10.4 Implementar contador de reivindicações
- [ ] 10.5 Validar formato de arquivos de figuras (PDF/TIFF)
- [ ] 10.6 Adicionar preview de figuras carregadas
- [ ] 10.7 Testar fluxo completo do Anexo C

## 11. Anexo F - Qualificação de Inventores
- [ ] 11.1 Validar todos os 20 campos do Anexo F
- [ ] 11.2 Implementar máscara de CPF para cada inventor
- [ ] 11.3 Adicionar validação de % de titulação
- [ ] 11.4 Implementar cálculo automático de % total
- [ ] 11.5 Adicionar campos condicionais (SisGen se biodiversidade)
- [ ] 11.6 Validar obrigatoriedade de declarações
- [ ] 11.7 Testar fluxo completo do Anexo F

## 12. Mock API - Complementação
- [ ] 12.1 Adicionar `apiCriarAnexoA` ao mock-api.ts
- [ ] 12.2 Adicionar `apiCriarAnexoB` ao mock-api.ts
- [ ] 12.3 Adicionar `apiCriarAnexoC` ao mock-api.ts
- [ ] 12.4 Adicionar `apiCriarAnexoF` ao mock-api.ts
- [ ] 12.5 Implementar `apiListarPedidos` (busca do localStorage)
- [ ] 12.6 Implementar `apiDeletarPedido` com confirmação
- [ ] 12.7 Adicionar simulação de delay realista

## 13. Validations - Schemas Zod
- [ ] 13.1 Criar schema Zod para AnexoA (validations/anexos.ts já existe)
- [ ] 13.2 Criar schema Zod para AnexoB
- [ ] 13.3 Criar schema Zod para AnexoC
- [ ] 13.4 Criar schema Zod para AnexoF
- [ ] 13.5 Exportar todos os schemas em validations/index.ts
- [ ] 13.6 Adicionar validações customizadas específicas
- [ ] 13.7 Testar validações com casos de borda

## 14. README e Documentação
- [ ] 14.1 Adicionar seção "Sobre o MVP" ao README
- [ ] 14.2 Documentar fluxo completo de submissão
- [ ] 14.3 Adicionar screenshots dos formulários
- [ ] 14.4 Adicionar diagrama de arquitetura do MVP
- [ ] 14.5 Documentar limitações do MVP (sem backend real)
- [ ] 14.6 Adicionar instruções de deploy local
- [ ] 14.7 Adicionar instruções de contribuição

## 15. Build e Deploy
- [ ] 15.1 Validar `npm run build` sem erros
- [ ] 15.2 Verificar tamanho do bundle output
- [ ] 15.3 Testar navegação entre páginas no build local
- [ ] 15.4 Validar que não há quebras de responsividade
- [ ] 15.5 Testar submissão completa no build
- [ ] 15.6 Verificar CI/CD no GitHub Actions
- [ ] 15.7 Validar deploy no GitHub Pages

## 16. Testes E2E do MVP
- [ ] 16.1 Testar fluxo PI/MU completo
- [ ] 16.2 Testar fluxo CII completo
- [ ] 16.3 Testar fluxo RPC completo
- [ ] 16.4 Testar preenchimento de todos os anexos
- [ ] 16.5 Testar recuperação de rascunho
- [ ] 16.6 Testar responsividade em mobile
- [ ] 16.7 Testar responsividade em tablet
- [ ] 16.8 Validar acessibilidade (teclado, leitor de tela)

## 17. Polish Final
- [ ] 17.1 Adicionar favicon
- [ ] 17.2 Configurar meta tags para SEO
- [ ] 17.3 Adicionar Open Graph images
- [ ] 17.4 Validar contrastes de cores (WCAG AA)
- [ ] 17.5 Adicionar loading states em todas as ações
- [ ] 17.6 Implementar tratamento de erros amigável
- [ ] 17.7 Adicionar página "Sobre o Projeto"

**Total de Tasks**: 103
**Estimativa**: 3-5 dias de desenvolvimento focado
