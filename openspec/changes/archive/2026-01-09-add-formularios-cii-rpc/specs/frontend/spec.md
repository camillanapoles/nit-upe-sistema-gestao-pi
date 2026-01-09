## ADDED Requirements

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
