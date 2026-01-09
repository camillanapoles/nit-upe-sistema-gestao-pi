# frontend Specification Delta

## Purpose
Define os requisitos para completar o MVP do sistema de gestão de propriedade intelectual da UPE, implementando a integração completa entre formulários principais (PI/MU/CII/RPC) e anexos obrigatórios (A/B/C/F).

## ADDED Requirements

### Requirement: Página de Anexos com Status de Completude

O sistema SHALL fornecer uma página `/anexos` que lista todos os anexos obrigatórios (A, B, C, F) com seus respectivos status de completude, permitindo ao usuário visualizar e acessar cada anexo.

#### Scenario: Acesso à página de anexos
- **WHEN** um usuário acessa `/anexos`
- **THEN** o sistema exibe cards para cada anexo (A, B, C, F)
- **AND** cada card mostra: título, descrição e status (completo/incompleto)
- **AND** anexos obrigatórios são destacados visualmente

#### Scenario: Indicador de completude
- **WHEN** um anexo foi completamente preenchido
- **THEN** o card exibe borda verde e ícone de check
- **AND** o botão mostra "Editar" em vez de "Começar"

#### Scenario: Filtro de anexos pendentes
- **WHEN** o usuário seleciona filtro "Pendentes"
- **THEN** apenas anexos incompletos são exibidos
- **AND** contador mostra "X de 4 anexos pendentes"

### Requirement: Integração entre Formulário e Anexos

O sistema SHALL integrar os formulários principais (PI/MU/CII/RPC) com os anexos, permitindo navegação fluida e compartilhamento de estado entre formulário e anexos.

#### Scenario: Link para anexos a partir do formulário
- **WHEN** o usuário clica em "Adicionar Anexos" no formulário principal
- **THEN** o sistema salva o rascunho atual do formulário
- **AND** redireciona para `/anexos` com o pedidoId
- **AND** mantém referência do formulário de origem

#### Scenario: Retorno ao formulário após preencher anexo
- **WHEN** o usuário completa um anexo e clica "Voltar ao Formulário"
- **THEN** o sistema redireciona para o formulário de origem
- **AND** restaura o rascunho salvo
- **AND** atualiza o contador de anexos preenchidos

#### Scenario: Validação de anexos obrigatórios
- **WHEN** o usuário tenta submeter formulário sem anexos obrigatórios
- **THEN** o sistema bloqueia a submissão
- **AND** exibe mensagem: "Anexos A, B e C são obrigatórios"
- **AND** fornece botões diretos para cada anexo faltante

### Requirement: Tela de Confirmação Pré-Submissão

O sistema SHALL fornecer uma tela de revisão que exibe todos os dados preenchidos (formulário + anexos) antes da submissão final, com opção de editar qualquer seção.

#### Scenario: Visualização do resumo completo
- **WHEN** o usuário acessa a tela de confirmação
- **THEN** o sistema exibe: dados do formulário principal
- **AND** status de cada anexo (completo/incompleto/faltante)
- **AND** resumo visual de todas as seções

#### Scenario: Edição a partir da confirmação
- **WHEN** o usuário clica em "Editar" em qualquer seção
- **THEN** o sistema abre a seção específica com dados preenchidos
- **AND** mantém o contexto da tela de confirmação
- **AND** retorna à confirmação após salvar

#### Scenario: Confirmação obrigatória
- **WHEN** o usuário clica em "Submeter Pedido"
- **THEN** o sistema exibe checkbox de confirmação
- **AND** usuário deve confirmar: "Declaro que as informações são verdadeiras"
- **AND** apenas após confirmação a submissão é processada

### Requirement: Tela de Sucesso Pós-Submissão

O sistema SHALL fornecer uma tela de sucesso após a submissão, com número do pedido gerado e opções de continuidade.

#### Scenario: Exibição do número do pedido
- **WHEN** a submissão é completada com sucesso
- **THEN** o sistema exibe número do pedido no formato "PED-YYYYMMDD-XXXX"
- **AND** exibe mensagem de sucesso com animação
- **AND** oferece opções: "Novo Pedido" ou "Ver Meus Pedidos"

#### Scenario: Download da declaração de submissão
- **WHEN** o usuário clica em "Download Comprovante"
- **THEN** o sistema gera um PDF simulado com os dados submetidos
- **AND** inicia o download automaticamente
- **AND** exibe mensagem "Download iniciado"

### Requirement: Dashboard de Pedidos do Usuário

O sistema SHALL fornecer um dashboard `/pedidos` que lista todos os pedidos do usuário (armazenados no localStorage), com filtros e ações.

#### Scenario: Listagem de pedidos
- **WHEN** o usuário acessa `/pedidos`
- **THEN** o sistema lista todos os pedidos do localStorage
- **AND** cada pedido mostra: tipo, título, data, status
- **AND** pedidos mais recentes aparecem primeiro

#### Scenario: Filtros de pedidos
- **WHEN** o usuário aplica filtro por tipo (PI/MU/CII/RPC)
- **THEN** apenas pedidos do tipo selecionado são exibidos
- **AND** contador mostra total de pedidos filtrados

#### Scenario: Continuação de rascunho
- **WHEN** o usuário clica em "Continuar" em um rascunho
- **THEN** o sistema carrega os dados salvos
- **AND** redireciona para o formulário apropriado
- **AND** restaura todos os campos preenchidos

### Requirement: Anexo A - Busca de Anterioridade Completo

O componente AnexoA SHALL implementar todos os 19 campos obrigatórios com validações específicas para busca de anterioridade em bases de patentes.

#### Scenario: Preenchimento dos dados da busca
- **WHEN** o usuário preenche o cabeçalho da busca
- **THEN** o sistema valida: data (não futura), responsável (obrigatório)
- **AND** armazena os 3 termos de busca
- **AND** armazena as 3 bases consultadas (INPI, Espacenet, Google Patents)

#### Scenario: Documentos relevantes
- **WHEN** o usuário adiciona um documento relevante
- **THEN** o sistema valida todos os 8 campos do documento
- **AND** calcula automaticamente a relevância (baseado em campos preenchidos)
- **AND** permite até 3 documentos com nível "Alta" relevância

#### Scenario: Conclusão da busca
- **WHEN** o usuário preenche a conclusão
- **THEN** o sistema valida justificativa (200-2000 caracteres)
- **AND** obriga seleção de "É Nova?" com justificativa
- **AND** bloqueia submissão se conclusão inválida

### Requirement: Anexo B - Matriz Problema x Solução Completo

O componente AnexoB SHALL implementar todos os 20 campos com cálculo automático de percentual de melhoria em relação às soluções existentes.

#### Scenario: Cálculo automático de melhoria
- **WHEN** o usuário preenche um valor numérico na Solução Proposta
- **THEN** o sistema calcula automaticamente: `((ValorA - SuaInv) / ValorA) * 100`
- **AND** exibe o percentual de melhoria em tempo real
- **AND** destaca com verde se melhoria > 0%

#### Scenario: Soluções existentes obrigatórias
- **WHEN** o usuário tenta salvar Anexo B
- **THEN** o sistema valida que pelo menos 2 soluções existentes foram preenchidas
- **AND** cada solução deve ter: nome, limitação, valor numérico
- **AND** bloqueia se requisitos mínimos não atendidos

### Requirement: Anexo C - Memorial Descritivo Completo

O componente AnexoC SHALL implementar todos os 18 campos incluindo reivindicações com validação de formatação INPI.

#### Scenario: Reivindicação independente obrigatória
- **WHEN** o usuário preenche as reivindicações
- **THEN** o sistema valida que a reivindicação 1 começa com "1. Um..."
- **AND** valida que é independente (não cita outras reivindicações)
- **AND** bloqueia se formato incorreto

#### Scenario: Reivindicações dependentes
- **WHEN** o usuário adiciona reivindicações 2+
- **THEN** o sistema valida que citam a reivindicação anterior
- **AND** valida formato: "2. O ... conforme a reivindicação 1"
- **AND** permite até 10 reivindicações total

### Requirement: Anexo F - Qualificação de Inventores Completo

O componente AnexoF SHALL implementar todos os 20 campos incluindo validação de CPF e cálculo de titulação.

#### Scenario: Validação de CPF por inventor
- **WHEN** o usuário adiciona um inventor
- **THEN** o sistema aplica máscara 000.000.000-00
- **AND** valida CPF usando algoritmo oficial
- **AND** impede CPFs duplicados na lista

#### Scenario: Cálculo de titulação
- **WHEN** o usuário define % de titulação para cada inventor
- **THEN** o sistema calcula somatório dos percentuais
- **AND** exibe alerta se total != 100%
- **AND** bloqueia submissão se titulação incompleta

## MODIFIED Requirements

### Requirement: Formulário PI/MU Component com Integração de Anexos

O formulário PI/MU SHALL exibir indicador de anexos preenchidos e validar que anexos obrigatórios (A, B, C) estão completos antes de permitir a submissão.

#### Scenario: Indicador de anexos no formulário
- **WHEN** o usuário está no formulário PI/MU
- **THEN** o sistema exibe contador de anexos preenchidos (ex: "2/4 anexos")
- **AND** mostra alerta visual se anexos obrigatórios faltam
- **AND** fornece botão "Completar Anexos" sempre visível

#### Scenario: Validação de anexos antes da submissão
- **WHEN** o usuário clica em "Submeter"
- **THEN** o sistema verifica se Anexo A, B, C estão completos
- **AND** permite submissão apenas se todos obrigatórios estão completos
- **AND** exibe mensagem específica para cada anexo faltante

### Requirement: Salvamento Automático de Rascunho Unificado

O sistema SHALL salvar automaticamente no localStorage todos os dados do pedido (formulário principal + anexos) mantendo referência compartilhada através de um pedidoId comum.

#### Scenario: Salvamento unificado de formulário e anexos
- **WHEN** o usuário preenche qualquer campo (formulário ou anexo)
- **THEN** o sistema salva no localStorage com chave compartilhada
- **AND** mantém referência entre pedidoId e seus anexos
- **AND** permite recuperação completa do contexto

## REMOVED Requirements

Nenhum requisito removido nesta mudança.
