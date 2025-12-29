# ESPECIFICAÇÃO DO FORMULÁRIO DE PATENTE PADRÃO (PI/MU)

**Versão do Documento:** 1.0  
**Data de Validação:** 28/12/2025  
**Responsável:** Engenharia de Contexto - Crush  
**Ator:** Inventor/Pesquisador

---

## 1. OBJETIVO

Especificar os campos de dados, regras de validação, tipos de entrada e obrigatoriedade para o formulário de submissão de pedido de Patente de Invenção (PI) ou Modelo de Utilidade (MU) junto ao NIT/UPE.

---

## 2. DICIONÁRIO DE DADOS (DATA DICTIONARY)

Esta seção detalha campo por campo, garantindo a precisão dos dados exigidos pelo INPI e NIT/UPE.

### 2.1. Metadados do Pedido

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| F1_01 | Tipo de Patente | Seleciona se o pedido é PI (20 anos) ou MU (15 anos). | Select (Dropdown) | Valores permitidos: `PI`, `MU`. | SIM | Documentação UPE |
| F1_02 | Título da Invenção | Identificação clara e concisa da invenção. | Text | Min: 1 char; Max: **150 caracteres**. Não pode conter nomes fantasia. | SIM | Fonte Externa [1] |
| F1_03 | Prioridade Unionista | Se houver reivindicação de prioridade estrangeira. | Date + Text | Formato DD/MM/AAAA e Número do Pedido Externo. | Não (Condicional) | Fonte Externa [1] |
| F1_04 | Número do Pedido | Identificação única gerada pelo sistema (após submissão). | Readonly Text | Formato automático: `BR 20XXXXX-Y`. | N/A (Auto) | Sistema |

### 2.2. Resumo Técnico (Para fins de triagem inicial)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| F1_05 | Problema / Dor | O problema técnico que a invenção resolve. | Textarea | Min: **100 caracteres**; Max: **1.000 caracteres**. | SIM | AGENTS.md (Anexo B) |
| F1_06 | Solução Técnica | Descrição da invenção proposta. | Textarea | Min: **500 caracteres**; Max: **4.000 caracteres**. Não conter adjetivos qualitativos. | SIM | AGENTS.md (Template) |
| F1_07 | Estado da Técnica | O que já existe (anterioridades). | Textarea | Min: **200 caracteres**; Max: **2.000 caracteres**. | SIM | AGENTS.md (Anexo C) |
| F1_08 | Vantagens | Benefícios técnicos ou econômicos mensuráveis. | Textarea | Min: **100 caracteres**; Max: **1.500 caracteres**. Uso de métricas (%, R$) incentivado. | SIM | AGENTS.md (Template) |
| F1_09 | Palavras-chave | Termos indexadores para busca de anterioridade. | Text | Min: 1; Max: **100 caracteres**. Separados por vírgula. | SIM | Documentação UPE |

### 2.3. Qualificação dos Depositantes/Inventores

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| F1_10 | Nome Completo | Razão social (PJ) ou Nome (PF). | Text | Mínimo 5 caracteres. Máximo 255. | SIM | Fonte Externa [2] |
| F1_11 | Nacionalidade | País de origem. | Select | Padrão ISO 3166. | SIM | Fonte Externa [2] |
| F1_12 | CPF / CNPJ | Número de identificação fiscal. | Text | Máscara de CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00). Validação via algoritmo (digito verificador). | SIM | Lei Federal (Fonte Externa [3]) |
| F1_13 | Tipo de Participação | Inventor, Depositante, Procurador. | Select | Múltiplo permitido. | SIM | LPI Lei 9.279/96 (Fonte Externa [2]) |

### 2.4. Endereço para Correspondência

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| F1_14 | Logradouro | Rua, Avenida, Praça, etc. | Text | Max 100 caracteres. | SIM | Fonte Externa [2] |
| F1_15 | Número | Número do endereço. | Text | Max 20 caracteres. | SIM | Fonte Externa [2] |
| F1_16 | Complemento | Bloco, Apto, Sala. | Text | Max 100 caracteres. | Não | Fonte Externa [2] |
| F1_17 | Bairro/Distrito | Nome do bairro. | Text | Max 50 caracteres. | SIM | Fonte Externa [2] |
| F1_18 | CEP | Código de Endereçamento Postal. | Text | Formato: 00000-000 (8 dígitos). | SIM | Correios (Fonte Externa [2]) |
| F1_19 | UF | Unidade da Federação. | Select | 27 unidades (26 estados + DF). | SIM | Fonte Externa [2] |
| F1_20 | Município | Nome do município. | Select ou Text | Dependente da UF. | SIM | Fonte Externa [2] |
| F1_21 | Países | País (Brasil para endereços nacionais). | Select | ISO 3166. | SIM | Fonte Externa [2] |
| F1_22 | E-mail | Endereço eletrônico para notificações. | Email | Formato de e-mail válido. | SIM | Fonte Externa [2] |
| F1_23 | Telefone | Número de contato. | Text | Formato: (XX) XXXXX-XXXX (DDD + 10 dígitos). | SIM | Fonte Externa [2] |

### 2.5. Upload de Arquivos (Anexos)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| F1_24 | Anexo A - Busca | Relatório de busca de anterioridade. | File Upload | Extensão: `.pdf`. Tamanho Máx: 10MB. | SIM | Documentação UPE |
| F1_25 | Anexo B - Matriz | Matriz de Problema x Solução. | File Upload | Extensão: `.pdf`. Tamanho Máx: 10MB. | SIM | Documentação UPE |
| F1_26 | Anexo C - Memorial | Relatório descritivo completo. | File Upload | Extensão: `.pdf`. Tamanho Máx: 20MB. | SIM | Documentação UPE |
| F1_27 | Desenhos / Figuras | Ilustrações técnicas (P&B). | File Upload | Extensão: `.pdf` ou `.tiff`. Tamanho Máx: 20MB. | Condicional (Verificar) | Fonte Externa [2] |

---

## 3. REFERÊNCIAS EXTERNAS (NOVAS INFORMAÇÕES)

> **Justificativa:** O documento inicial (Instrocoes.md) focou na metodologia (Fases, Templates). A especificação técnica do formulário de depósito requer estrita conformidade com os campos do formulário oficial do INPI (Formulário 1.01) e as regras da Lei da Propriedade Industrial (LPI). Os campos de endereço e nacionalidade são mandatórios para a publicação do pedido e correspondência oficial.

**Fonte [1]:** INPI - Manual do Usuário do Sistema e-INPI.  
*Link:* https://www.gov.br/inpi/pt-br/servicos/patente/manual-do-usuario-do-sistema-e-inpi  
*Conteúdo Validado:* Seção de "Cadastro de Usuários", "Prioridade Unionista", "Endereço para Correspondência".

**Fonte [2]:** INPI - Formulário 1.01 (Pedido de Patente).  
*Link:* https://www.gov.br/inpi/pt-br/servicos/formularios/patente/formulario-1-01  
*Conteúdo Validado:* Estrutura de campos (Logradouro, Bairro, CEP, Município), Obrigatoriedade de CPF/CNPJ para depositantes brasileiros.

**Fonte [3]:** Lei nº 9.279, de 14 de maio de 1996 (Lei da Propriedade Industrial).  
*Link:* http://www.planalto.gov.br/ccivil_03/leis/l9279.htm  
*Conteúdo Validado:* Art. 6º (O que é patenteável), Art. 8º (Não patenteável), Art. 16º (Titularidade).

---

## 4. REGRAS DE NEGÓCIO (LÓGICA APLICADA)

1.  **Máscaras de Entrada:** O campo F1_12 (CPF/CNPJ) deve aceitar apenas números e aplicar a máscara correta (CPF: 3.3.3.2; CNPJ: 2.3.3.4.2).
2.  **Validação de CEP:** Ao preencher o CEP (F1_18), o sistema deve tentar preencher automaticamente Logradouro, Bairro e Município (Integração via API de Correios), permitindo edição manual.
3.  **Prioridade:** Se F1_03 (Prioridade Unionista) for marcado, o campo deve exigir o número do pedido estrangeiro e a data de depósito.
4.  **Tamanho de Arquivos:** Limite estrito de 20MB para o Memorial e Desenhos (PDF/TIFF) para evitar erro no upload do INPI.
