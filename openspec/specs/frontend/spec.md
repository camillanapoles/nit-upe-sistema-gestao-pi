# frontend Specification

## Purpose
TBD - created by archiving change add-formulario-pi-mu. Update Purpose after archive.
## Requirements
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

### Requirement: Formulário CII Component

O sistema SHALL fornecer um componente de formulário React completo para submissão de pedidos de Computer Implemented Invention (CII - Patente de Software com Efeito Técnico), acessível via rota `/formulario-cii` na aplicação Next.js.

#### Scenario: Acesso ao formulário CII
- **WHEN** um usuário acessa `/formulario-cii`
- **THEN** o formulário CII é renderizado com todos os 17 campos disponíveis
- **AND** o usuário pode começar a preencher os dados

#### Scenario: Preenchimento de efeito técnico
- **WHEN** o usuário preenche o campo Descrição do Efeito Técnico
- **THEN** o sistema valida mínimo de 200 e máximo de 2000 caracteres
- **AND** o sistema valida que não é vago (contém palavras-chave técnicas)
- **AND** exibe feedback visual (RAG) baseado na qualidade

#### Scenario: Preenchimento de métrica quantitativa
- **WHEN** o usuário preenche o campo Métrica Quantitativa
- **THEN** o sistema valida mínimo de 100 e máximo de 500 caracteres
- **AND** o sistema valida que contém percentual (%) ou unidade de tempo
- **AND** exibe erro se não atender aos requisitos

#### Scenario: Upload de fluxograma
- **WHEN** o usuário faz upload de fluxograma em PDF
- **THEN** o sistema valida que é um arquivo PDF
- **AND** valida que o tamanho máximo é 10MB
- **AND** exibe feedback visual do progresso de upload

### Requirement: Formulário RPC Component

O sistema SHALL fornecer um componente de formulário React completo para submissão de pedidos de Registro de Programa de Computador (RPC - Direito Autoral), acessível via rota `/formulario-rpc` na aplicação Next.js.

#### Scenario: Acesso ao formulário RPC
- **WHEN** um usuário acessa `/formulario-rpc`
- **THEN** o formulário RPC é renderizado com todos os 13 campos disponíveis
- **AND** o usuário pode começar a preencher os dados

#### Scenario: Validação de CPF
- **WHEN** o usuário preenche o campo CPF do Autor
- **THEN** o sistema aplica a máscara 000.000.000-00
- **AND** valida o CPF usando algoritmo de dígitos verificadores
- **AND** exibe feedback visual (verde se válido, vermelho se inválido)

#### Scenario: Upload de código-fonte
- **WHEN** o usuário faz upload de código-fonte em ZIP
- **THEN** o sistema valida que é um arquivo ZIP
- **AND** valida que o tamanho máximo é 50MB
- **AND** exibe feedback visual do progresso de upload

#### Scenario: Upload de manual do usuário
- **WHEN** o usuário faz upload do manual em PDF
- **THEN** o sistema valida que é um arquivo PDF
- **AND** valida que o tamanho máximo é 10MB
- **AND** exibe feedback visual do progresso de upload

### Requirement: Validação de Efeito Técnico CII

O formulário CII SHALL validar que o campo Efeito Técnico contém descrição técnica específica de como o software melhora o hardware ou processamento, rejeitando descrições vagas ou genéricas.

#### Scenario: Validação de efeito técnico válido
- **WHEN** o usuário preenche efeito técnico com descrição específica (ex: "Reduz uso de memória em 30% através de compressão LZ4")
- **THEN** o sistema aceita a descrição
- **AND** exibe feedback visual verde

#### Scenario: Validação de efeito técnico vago
- **WHEN** o usuário preenche efeito técnico com descrição vaga (ex: "Melhora a performance")
- **THEN** o sistema rejeita a descrição
- **AND** exibe mensagem de erro explicativa
- **AND** sugere exemplos de descrições válidas

#### Scenario: Validação de efeito técnico curto
- **WHEN** o usuário preenche efeito técnico com menos de 200 caracteres
- **THEN** o sistema bloqueia a submissão
- **AND** exibe feedback visual vermelho
- **AND** mostra contador de caracteres

### Requirement: Validação de Métrica Quantitativa CII

O formulário CII SHALL validar que o campo Métrica Quantitativa contém obrigatoriamente um percentual (%) ou unidade de tempo (ms, s, min), rejeitando descrições sem mensuração quantitativa.

#### Scenario: Validação de métrica com percentual
- **WHEN** o usuário preenche métrica com percentual (ex: "Redução de 30% no tempo de processamento")
- **THEN** o sistema aceita a métrica
- **AND** exibe feedback visual verde

#### Scenario: Validação de métrica com tempo
- **WHEN** o usuário preenche métrica com tempo (ex: "Processamento reduzido de 5s para 500ms")
- **THEN** o sistema aceita a métrica
- **AND** exibe feedback visual verde

#### Scenario: Validação de métrica sem quantificação
- **WHEN** o usuário preenche métrica sem % ou tempo (ex: "Melhoria significativa no desempenho")
- **THEN** o sistema rejeita a métrica
- **AND** exibe mensagem de erro
- **AND** sugere adicionar quantificação

### Requirement: Validação de CPF com Algoritmo

O formulário RPC SHALL validar o CPF usando o algoritmo oficial brasileiro de dígitos verificadores, garantindo que o número é matematicamente válido.

#### Scenario: Validação de CPF válido
- **WHEN** o usuário preenche um CPF válido (ex: 123.456.789-09)
- **THEN** o sistema aplica a máscara corretamente
- **AND** valida os dígitos verificadores
- **AND** exibe feedback visual verde

#### Scenario: Validação de CPF inválido
- **WHEN** o usuário preenche um CPF inválido (dígitos verificadores incorretos)
- **THEN** o sistema detecta a invalidade
- **AND** exibe feedback visual vermelho
- **AND** mostra mensagem "CPF inválido"

#### Scenario: Validação de CPF com dígitos repetidos
- **WHEN** o usuário preenche um CPF com todos os dígitos iguais (ex: 111.111.111-11)
- **THEN** o sistema rejeita o CPF
- **AND** exibe mensagem "CPF inválido"

### Requirement: Upload de Arquivos com Validação

O sistema SHALL suportar upload de arquivos (PDF para fluxogramas e manuais, ZIP para código-fonte) com validação de extensão e tamanho no cliente, preparando para futura validação de conteúdo no servidor.

#### Scenario: Upload de PDF válido
- **WHEN** o usuário seleciona um arquivo PDF válido (<10MB)
- **THEN** o sistema aceita o arquivo
- **AND** exibe nome do arquivo e tamanho
- **AND** mostra progresso de upload simulado

#### Scenario: Upload de PDF inválido
- **WHEN** o usuário seleciona um arquivo não-PDF ou >10MB
- **THEN** o sistema rejeita o arquivo
- **AND** exibe mensagem de erro específica
- **AND** limpa o input

#### Scenario: Upload de ZIP válido
- **WHEN** o usuário seleciona um arquivo ZIP válido (<50MB)
- **THEN** o sistema aceita o arquivo
- **AND** exibe nome do arquivo e tamanho
- **AND** mostra progresso de upload simulado

#### Scenario: Upload de ZIP inválido
- **WHEN** o usuário seleciona um arquivo não-ZIP ou >50MB
- **THEN** o sistema rejeita o arquivo
- **AND** exibe mensagem de erro específica
- **AND** limpa o input

### Requirement: Selector de Tipo de Patente

A homepage SHALL fornecer um selector visual para escolher o tipo de patente (PI, MU, CII, RPC), redirecionando para o formulário apropriado baseado na seleção do usuário.

#### Scenario: Seleção de formulário PI/MU
- **WHEN** o usuário seleciona "Patente de Invenção" ou "Modelo de Utilidade"
- **THEN** o sistema redireciona para `/formulario-pi-mu`
- **AND** o formulário PI/MU é exibido

#### Scenario: Seleção de formulário CII
- **WHEN** o usuário seleciona "Computer Implemented Invention (CII)"
- **THEN** o sistema redireciona para `/formulario-cii`
- **AND** o formulário CII é exibido
- **AND** informações contextuais sobre efeito técnico são mostradas

#### Scenario: Seleção de formulário RPC
- **WHEN** o usuário seleciona "Registro de Programa (RPC)"
- **THEN** o sistema redireciona para `/formulario-rpc`
- **AND** o formulário RPC é exibido
- **AND** informações contextuais sobre código-fonte são mostradas

### Requirement: Integração com API Mock para CII/RPC

Os formulários CII e RPC SHALL integrar-se com a API mock existente, adicionando endpoints específicos para submissão de pedidos CII e RPC, mantendo compatibilidade com futura implementação de backend real.

#### Scenario: Submissão bem-sucedida CII
- **WHEN** o usuário submete formulário CII completamente válido
- **THEN** o sistema envia dados para `apiCriarPedidoCII`
- **AND** recebe confirmação com ID do pedido
- **AND** redireciona para dashboard
- **AND** exibe mensagem de sucesso

#### Scenario: Submissão bem-sucedida RPC
- **WHEN** o usuário submete formulário RPC completamente válido
- **THEN** o sistema envia dados para `apiCriarPedidoRPC`
- **AND** recebe confirmação com ID do pedido
- **AND** redireciona para dashboard
- **AND** exibe mensagem de sucesso

#### Scenario: Tratamento de erro de validação
- **WHEN** a API retorna erro de validação
- **THEN** o sistema exibe mensagem de erro amigável
- **AND** destaca campos com erros
- **AND** permite correção e re-submissão

