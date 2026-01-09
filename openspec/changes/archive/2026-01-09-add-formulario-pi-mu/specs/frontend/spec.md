## ADDED Requirements

### Requirement: Formulário PI/MU Component

O sistema SHALL fornecer um componente de formulário React completo para submissão de pedidos de Patente de Invenção (PI) e Modelo de Utilidade (MU), acessível via rota `/formulario-pi-mu` na aplicação Next.js.

#### Scenario: Acesso ao formulário
- **WHEN** um usuário acessa `/formulario-pi-mu`
- **THEN** o formulário é renderizado com todos os campos disponíveis
- **AND** o usuário pode começar a preencher os dados

#### Scenario: Seleção de tipo de patente
- **WHEN** o usuário seleciona o tipo de patente (PI ou MU)
- **THEN** o formulário adapta os campos e validações conforme o tipo selecionado
- **AND** informações contextuais são exibidas

### Requirement: Validação de Campos com Limites de Caracteres

O formulário SHALL validar todos os campos conforme os limites críticos de caracteres definidos na especificação, utilizando Zod para validação schema-based.

#### Scenario: Validação de título
- **WHEN** o usuário preenche o campo Título
- **THEN** o sistema valida máximo de 150 caracteres
- **AND** exibe feedback visual (verde: 100-120, amarelo: 121-150, vermelho: >150)

#### Scenario: Validação de problema/dor
- **WHEN** o usuário preenche o campo Problema/Dor
- **THEN** o sistema valida mínimo 100 e máximo 1.000 caracteres
- **AND** exibe feedback visual (verde: 400-600, amarelo: <100 ou 601-1000, vermelho: <100 ou >1000)

#### Scenario: Validação de solução técnica
- **WHEN** o usuário preenche o campo Solução Técnica
- **THEN** o sistema valida mínimo 500 e máximo 4.000 caracteres
- **AND** exibe feedback visual contagem em tempo real

#### Scenario: Bloqueio de submissão inválida
- **WHEN** o usuário tenta submeter formulário com campos inválidos
- **THEN** o sistema bloqueia a submissão
- **AND** destaca campos com erros
- **AND** exibe mensagens de erro específicas

### Requirement: Integração com API Mock

O formulário SHALL integrar-se com a API mock existente (`lib/mock-api.ts`) para submissão de pedidos, mantendo compatibilidade com futura implementação de backend real.

#### Scenario: Submissão bem-sucedida
- **WHEN** o usuário submete formulário completamente válido
- **THEN** o sistema chama `apiCriarPedido` com os dados do formulário
- **AND** exibe mensagem de sucesso
- **AND** redireciona para dashboard

#### Scenario: Tratamento de erros da API
- **WHEN** a API retorna erro
- **THEN** o sistema exibe mensagem de erro amigável
- **AND** mantém os dados preenchidos no formulário
- **AND** permite nova tentativa

### Requirement: Salvamento Automático de Rascunho

O formulário SHALL implementar salvamento automático no localStorage a cada 30 segundos ou em cada mudança de campo, permitindo recuperação de dados em caso de fechamento acidental.

#### Scenario: Salvamento automático
- **WHEN** o usuário preenche campos do formulário
- **THEN** o sistema salva automaticamente no localStorage
- **AND** exibe indicador "Salvando..." / "Salvo"

#### Scenario: Recuperação de rascunho
- **WHEN** o usuário retorna ao formulário com rascunho salvo
- **THEN** o sistema detecta dados existentes
- **AND** pergunta: "Deseja continuar de onde parou?"
- **AND** restaura os dados se confirmado

### Requirement: Feedback Visual com Semaforização RAG

O sistema SHALL fornecer feedback visual imediato usando semaforização Red/Amber/Green para indicar status de cada campo em relação aos limites recomendados.

#### Scenario: Campo dentro do recomendado
- **WHEN** campo está dentro da faixa recomendada
- **THEN** borda/indicador exibe verde (#4CAF50)
- **AND** mensagem: "✓ Tamanho adequado"

#### Scenario: Campo aproximando do limite
- **WHEN** campo está fora da faixa recomendada mas dentro dos limites
- **THEN** borda/indicador exibe amarelo (#FFC107)
- **AND** mensagem: "⚠ Considere ajustar o tamanho"

#### Scenario: Campo fora dos limites
- **WHEN** campo está fora dos limites permitidos
- **THEN** borda/indicador exibe vermelho (#f44336)
- **AND** mensagem: "✗ Tamanho inválido"

### Requirement: Responsividade Multi-Device

O formulário SHALL ser completamente responsivo, adaptando layout para mobile (< 768px), tablet (768px - 1024px) e desktop (> 1024px).

#### Scenario: Visualização em mobile
- **WHEN** acessado em dispositivo mobile
- **THEN** campos são empilhados verticalmente
- **AND** labels são posicionadas acima dos inputs
- **AND** botões de ação têm 44px de altura mínima (touch target)

#### Scenario: Visualização em tablet/desktop
- **WHEN** acessado em tablet ou desktop
- **THEN** campos podem ser organizados em colunas
- **AND** espaço é utilizado eficientemente
- **AND** experiência otimizada para mouse/teclado

### Requirement: Gotchas Críticos - Previnição de Erros Comuns

O formulário SHALL implementar validações específicas e tooltips educativos para prevenir erros críticos identificados na documentação de domínio.

#### Scenario: Alerta para biotecnologia
- **WHEN** o usuário usa termos como "temperatura ambiente" ou "otimizado"
- **THEN** o sistema exibe aviso: "⚠️ Evite termos vagos. Use faixas numéricas específicas."
- **AND** sugere exemplos corretos

#### Scenario: Alerta para software CII
- **WHEN** o usuário seleciona tipo PI e menciona "software"
- **THEN** o sistema exibe alerta: "⚠️ Software com efeito técnico deve usar CII"
- **AND** fornece link para documentação CII

### Requirement: Navegação em Wizard Multi-Step

O formulário SHALL implementar navegação em múltiplas etapas (seções) para melhor usabilidade, com progress indicator e possibilidade de navegar entre etapas.

#### Scenario: Navegação entre seções
- **WHEN** o usuário clica em "Próxima" ou "Anterior"
- **THEN** o sistema valida campos da seção atual
- **AND** permite avançar apenas se válidos
- **AND** salva progresso automaticamente

#### Scenario: Progress indicator
- **WHEN** o usuário navega entre seções
- **THEN** o sistema exibe indicador de progresso visual
- **AND** mostra quais seções estão completas/incompletas
