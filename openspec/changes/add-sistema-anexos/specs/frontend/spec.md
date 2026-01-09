## ADDED Requirements

### Requirement: Sistema de Anexos Dashboard

O sistema SHALL fornecer um dashboard centralizado para gerenciamento dos 4 anexos obrigatórios do INPI (A/B/C/F), acessível via rota `/anexos`, com indicadores de progresso e navegação intuitiva.

#### Scenario: Acesso ao dashboard de anexos
- **WHEN** um usuário acessa `/anexos`
- **THEN** o dashboard exibe cards para os 4 anexos (A, B, C, F)
- **AND** cada card mostra título, descrição breve e progresso atual
- **AND** o usuário pode clicar em qualquer anexo para acessá-lo

#### Scenario: Indicador de progresso por anexo
- **WHEN** o usuário visualiza o dashboard de anexos
- **THEN** cada anexo exibe um indicador de progresso (0-100%)
- **AND** o progresso é calculado baseado nos campos obrigatórios preenchidos
- **AND** anexos completos exibem badge "Concluído"

#### Scenario: Navegação fluxo recomendado
- **WHEN** o usuário inicia o preenchimento dos anexos
- **THEN** o sistema sugere a ordem recomendada (A → B → C → F)
- **AND** exibe setas/badges indicando o fluxo
- **AND** permite acesso direto a qualquer anexo (não bloqueia)

### Requirement: Anexo A - Busca de Anterioridade

O sistema SHALL fornecer um formulário completo para o Anexo A (Busca de Anterioridade) com 19 campos distribuídos em cabeçalho, termos de busca, bases consultadas, documentos relevantes e conclusão.

#### Scenario: Preenchimento do cabeçalho da busca
- **WHEN** o usuário preenche o cabeçalho do Anexo A
- **THEN** o sistema valida Data da Busca <= Data de Submissão
- **AND** valida Responsável com mínimo 5 caracteres
- **AND** exibe feedback visual (RAG) para cada campo

#### Scenario: Preenchimento dos 3 termos de busca
- **WHEN** o usuário preenche os Termos 1, 2 e 3
- **THEN** o sistema valida mínimo 3 caracteres por termo
- **AND** exibe sugestões de termos relacionados
- **AND** salva automaticamente no localStorage

#### Scenario: Seleção de bases consultadas
- **WHEN** o usuário marca uma base (INPI, Espacenet, Google Patents)
- **THEN** o sistema habilita campos Data e URL
- **AND** valida URL com formato válido
- **AND** exibe link para abrir a base em nova aba

#### Scenario: Adição de documento relevante
- **WHEN** o usuário adiciona um documento relevante
- **THEN** o sistema exibe o componente DocumentoRelevanteCard
- **AND** valida os 8 campos obrigatórios
- **AND** permite até 3 documentos relevantes
- **AND** exige pelo menos 1 com relevância "Alta"

#### Scenario: Validação de conclusão da busca
- **WHEN** o usuário responde "É Nova?" e preenche justificativa
- **THEN** o sistema valida justificativa (200-2000 caracteres)
- **AND** exige conclusão explícita (Sim/Não)
- **AND** bloqueia avanço se justificativa inválida

### Requirement: Anexo B - Matriz Problema x Solução

O sistema SHALL fornecer um formulário completo para o Anexo B (Matriz Problema x Solução) com 20 campos incluindo problema identificado, 3 soluções existentes, solução proposta e 4 vantagens comparativas com cálculo automático de % melhoria.

#### Scenario: Preenchimento do problema identificado
- **WHEN** o usuário preenche o problema identificado
- **THEN** o sistema valida Título (5-100 caracteres)
- **AND** valida Descrição (300-5000 caracteres)
- **AND** valida Quem Sofre? e Como se Manifesta?
- **AND** exibe contadores de caracteres em tempo real

#### Scenario: Adição de solução existente
- **WHEN** o usuário adiciona uma solução existente (A, B ou C)
- **THEN** o sistema exibe o componente SolucaoExistenteCard
- **AND** valida os 5 campos obrigatórios
- **AND** **EXIGE** o campo Limitações (crítico para NAI)
- **AND** bloqueia avanço se Limitações não preenchido
- **AND** permite até 3 soluções existentes (mínimo 2)

#### Scenario: Cálculo automático de % melhoria
- **WHEN** o usuário preenche Valor Solução A e Valor Sua Invenção
- **THEN** o sistema calcula automaticamente: `((ValorA - SuaInv) / ValorA) * 100`
- **AND** exibe o resultado no campo % Melhoria (readonly)
- **AND** valida que ambos valores são numéricos
- **AND** recalcula em tempo real quando valores mudam

#### Scenario: Validação de vantagens comparativas
- **WHEN** o usuário preenche as 4 vantagens comparativas
- **THEN** o sistema valida que todas as 4 métricas estão preenchidas
- **AND** valida que Valores são numéricos para permitir cálculo
- **AND** exibe feedback visual (verde) se cálculo mostra melhoria
- **AND** exibe aviso (amarelo) se não há melhoria

### Requirement: Anexo C - Memorial Descritivo

O sistema SHALL fornecer um formulário completo para o Anexo C (Memorial Descritivo) com 18 campos incluindo cabeçalho, sumário, descrição detalhada, desenhos/figuras e reivindicações (mínimo 3, máximo 10).

#### Scenario: Preenchimento do cabeçalho e sumário
- **WHEN** o usuário preenche o cabeçalho do Anexo C
- **THEN** o sistema herda Título do formulário principal
- **AND** valida Campo da Invenção (10-500 caracteres)
- **AND** valida Estado da Técnica (500-5000 caracteres)
- **AND** valida os 3 campos do Sumário

#### Scenario: Adição de figura/desenho
- **WHEN** o usuário adiciona uma figura
- **THEN** o sistema exibe o componente FiguraInput
- **AND** gera automaticamente o número (Fig. 1, Fig. 2...)
- **AND** valida Descrição (máx 200 caracteres)
- **AND** valida upload de arquivo (PDF ou TIFF apenas)
- **AND** valida Referências Numéricas (1: Bloco, 2: Dispositivo)
- **AND** permite adicionar/remover figuras dinamicamente

#### Scenario: Adição de reivindicação
- **WHEN** o usuário adiciona uma reivindicação
- **THEN** o sistema exibe o componente ReivindicacaoInput
- **AND** gera automaticamente o número (1., 2., 3...)
- **AND** valida que o texto começa com o número
- **AND** valida formato: "1. Um..." para independentes
- **AND** valida formato: "2. O ... de acordo com a reivindicação 1..." para dependentes
- **AND** exige mínimo 3 reivindicações
- **AND** limita a máximo 10 reivindicações
- **AND** permite adicionar/remover reivindicações dinamicamente

#### Scenario: Validação de formato de reivindicações
- **WHEN** o usuário preenche o texto de uma reivindicação
- **THEN** o sistema valida o formato usando regex
- **AND** para reivindicação 1: exige "1. Um" ou "1. Uma"
- **AND** para reivindicações 2+: exige "de acordo com a reivindicação X"
- **AND** exibe erro em vermelho se formato inválido
- **AND** exibe sugestão de formato correto

### Requirement: Anexo F - Qualificação de Inventores

O sistema SHALL fornecer um formulário completo para o Anexo F (Qualificação de Inventores) suportando múltiplos inventores, campos condicionais (SisGen, Financiamento) e declarações obrigatórias.

#### Scenario: Adição de inventor
- **WHEN** o usuário adiciona um inventor
- **THEN** o sistema exibe o componente InventorCard
- **AND** valida os 9 campos obrigatórios
- **AND** valida CPF usando algoritmo de dígitos verificadores
- **AND** valida E-mail com formato válido
- **AND** aplica máscaras (CPF, RG, Telefone)
- **AND** permite adicionar/remover inventores dinamicamente (mínimo 1)

#### Scenario: Validação de soma de % participação
- **WHEN** o usuário preenche % Participação dos inventores
- **THEN** o sistema soma todas as porcentagens em tempo real
- **AND** exibe feedback visual se soma ≠ 100%
- **AND** bloqueia submissão se soma ≠ 100%
- **AND** exibe aviso: "A soma deve ser exatamente 100%"

#### Scenario: Preenchimento de SisGen (condicional)
- **WHEN** o usuário marca "Usa Biodiversidade?" = Sim
- **THEN** o sistema habilita campos Número SisGen, Espécie, Origem
- **AND** valida Número SisGen com formato UUID
- **AND** **EXIGE** preenchimento dos 3 campos condicionais
- **AND** bloqueia avanço se campos não preenchidos

#### Scenario: Preenchimento de Financiamento (condicional)
- **WHEN** o usuário marca "Financiamento Externo?" = Sim
- **THEN** o sistema habilita campos Agência, Número Processo, Valor
- **AND** valida Valor com formato currency (R$ X.XXX,XX)
- **AND** **EXIGE** preenchimento dos 3 campos condicionais
- **AND** bloqueia avanço se campos não preenchidos

#### Scenario: Marcção de declarações obrigatórias
- **WHEN** o usuário tenta avançar no Anexo F
- **THEN** o sistema verifica se as 2 declarações estão marcadas
- **AND** **EXIGE** "Declaro Originalidade" marcado
- **AND** **EXIGE** "Declaro Cessão de Direitos" marcado
- **AND** bloqueia avanço se declarações não marcadas
- **AND** exibe aviso: "As declarações são obrigatórias"

### Requirement: Componentes Reutilizáveis de Anexos

O sistema SHALL fornecer componentes reutilizáveis para gerenciar estruturas repetitivas nos anexos (inventores, soluções existentes, documentos relevantes, reivindicações, figuras).

#### Scenario: Uso do InventorCard
- **WHEN** o Anexo F precisa exibir um inventor
- **THEN** o sistema renderiza o componente InventorCard
- **AND** exibe os 9 campos do inventor
- **AND** permite edição inline
- **AND** permite remover (se mais de 1 inventor)
- **AND** exibe validação de CPF em tempo real

#### Scenario: Uso do SolucaoExistenteCard
- **WHEN** o Anexo B precisa exibir uma solução existente
- **THEN** o sistema renderiza o componente SolucaoExistenteCard
- **AND** exibe os 5 campos da solução
- **AND** destaca campo Limitações (obrigatório)
- **AND** permite remover (se mais de 2 soluções)
- **AND** exibe indicador de preenchimento

#### Scenario: Uso do DocumentoRelevanteCard
- **WHEN** o Anexo A precisa exibir um documento relevante
- **THEN** o sistema renderiza o componente DocumentoRelevanteCard
- **AND** exibe os 8 campos do documento
- **AND** permite seleção de Relevância (Alta/Média/Baixa)
- **AND** exibe badge visual de relevância

#### Scenario: Uso do ReivindicacaoInput
- **WHEN** o Anexo C precisa exibir uma reivindicação
- **THEN** o sistema renderiza o componente ReivindicacaoInput
- **AND** exibe número e texto da reivindicação
- **AND** valida formato em tempo real
- **AND** permite remover (se mais de 3 reivindicações)
- **AND** exibe contador de caracteres

### Requirement: Salvamento Automático de Rascunho

O sistema SHALL implementar salvamento automático no localStorage para todos os anexos, permitindo recuperação de dados em caso de fechamento acidental ou navegação entre páginas.

#### Scenario: Salvamento automático durante preenchimento
- **WHEN** o usuário preenche campos de qualquer anexo
- **THEN** o sistema salva automaticamente no localStorage
- **AND** exibe indicador "Salvando..." durante o salvamento
- **AND** exibe indicador "Salvo" quando concluído
- **AND** salva a cada mudança de campo ou 30 segundos

#### Scenario: Recuperação de rascunho
- **WHEN** o usuário retorna a um anexo com rascunho salvo
- **THEN** o sistema detecta dados existentes no localStorage
- **AND** exibe modal: "Deseja continuar de onde parou?"
- **AND** restaura os dados se confirmado
- **AND** limpa o rascunho se negado

#### Scenario: Persistência de estruturas complexas
- **WHEN** o usuário adiciona/remove inventores, figuras ou reivindicações
- **THEN** o sistema serializa as estruturas em JSON
- **AND** salva no localStorage com chave específica (ex: `anexo-f-rascunho`)
- **AND** recupera exatamente o estado anterior

### Requirement: Validações Específicas por Anexo

O sistema SHALL implementar validações específicas para cada anexo, incluindo cálculo automático de % melhoria (Anexo B), validação de CPF (Anexo F), formato de reivindicações (Anexo C) e relevância de documentos (Anexo A).

#### Scenario: Cálculo automático no Anexo B
- **WHEN** o usuário preenche Valor Solução A e Valor Sua Invenção
- **THEN** o sistema calcula automaticamente: `((A - B) / A) * 100`
- **AND** exibe resultado no campo % Melhoria (readonly)
- **AND** recalcula em tempo real quando valores mudam
- **AND** exibe "100%" se valores iguais, "0%" se pior

#### Scenario: Validação de CPF no Anexo F
- **WHEN** o usuário preenche o campo CPF
- **THEN** o sistema aplica máscara 000.000.000-00
- **AND** valida CPF usando algoritmo de dígitos verificadores
- **AND** rejeita CPFs com dígitos repetidos (111.111.111-11)
- **AND** exibe feedback visual (verde se válido, vermelho se inválido)

#### Scenario: Validação de formato de reivindicações no Anexo C
- **WHEN** o usuário preenche uma reivindicação
- **THEN** o sistema valida formato com regex
- **AND** exige "1. Um..." para reivindicação 1
- **AND** exige "... de acordo com a reivindicação X..." para reivindicações 2+
- **AND** exibe erro específico se formato inválido
- **AND** sugere formato correto

#### Scenario: Validação de relevância no Anexo A
- **WHEN** o usuário adiciona documentos relevantes
- **THEN** o sistema valida pelo menos 1 documento com relevância "Alta"
- **AND** bloqueia submissão se nenhum documento for "Alta"
- **AND** exibe aviso: "Pelo menos 1 documento deve ter relevância Alta"
