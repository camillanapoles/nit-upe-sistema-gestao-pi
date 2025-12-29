# ESPECIFICAÇÃO DO ANEXO F - QUALIFICAÇÃO DE INVENTORES

**Versão do Documento:** 1.0  
**Data de Validação:** 28/12/2025  
**Responsável:** Engenharia de Contexto - Crush  
**Ator:** Inventor/Pesquisador

---

## 1. OBJETIVO

Especificar os campos de dados, regras de validação, tipos de entrada e obrigatoriedade para o preenchimento do Anexo F (Qualificação de Inventores), necessário para a definição de titularidade e obrigações legais (SisGen, Financiamento).

---

## 2. DICIONÁRIO DE DADOS (DATA DICTIONARY)

### 2.1. Dados do Inventor (Repetível para N inventores)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AF_01 | Nome Completo | Nome civil do inventor. | Text | Mínimo 5 caracteres; Máximo 255 caracteres. | SIM | Fonte Externa [8] |
| AF_02 | CPF | Cadastro de Pessoa Física. | Text | Máscara: 000.000.000-00. Validação algorítmica. | SIM | Lei Federal |
| AF_03 | RG | Registro Geral. | Text | Máscara: 00.000.000-X. | SIM | Documentação UPE |
| AF_04 | E-mail | Contato eletrônico. | Email | Formato válido. | SIM | Documentação UPE |
| AF_05 | Telefone | Celular ou fixo. | Text | Formato: (XX) XXXXX-XXXX. | SIM | Documentação UPE |
| AF_06 | Departamento/Unidade | Unidade acadêmica. | Text | Máximo 100 caracteres. | SIM | Documentação UPE |
| AF_07 | Cargo/Função | Função na UPE. | Text | Máximo 100 caracteres. | SIM | Documentação UPE |
| AF_08 | % Participação | Total deve ser 100% no final. | Number | Mín 0; Máximo 100. Decimal permitido. | SIM | Documentação UPE |
| AF_09 | Justificativa % | Por que essa %? | Text | Máximo 500 caracteres. | SIM | Documentação UPE |

### 2.2. SisGen (Sistema Nacional de Gestão do Patrimônio Genético)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AF_10 | Usa Biodiversidade? | Recurso genético brasileiro. | Radio | Valores: `Sim`, `Não`. | SIM | Fonte Externa [9] |
| AF_11 | Número SisGen | (Se Sim) | Text | Formato: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX (UUID). | Condicional | Fonte Externa [9] |
| AF_12 | Espécie Utilizada | (Se Sim) | Text | Máximo 255 caracteres. | Condicional | Fonte Externa [9] |
| AF_13 | Origem do Material | (Se Sim) | Text | Máximo 255 caracteres. | Condicional | Fonte Externa [9] |

### 2.3. Financiamento

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AF_14 | Financiamento Externo? | Agências CNPq, FINEP, etc. | Radio | Valores: `Sim`, `Não`. | SIM | Documentação UPE |
| AF_15 | Agência Financiadora | (Se Sim) | Text | Máximo 255 caracteres. | Condicional | Documentação UPE |
| AF_16 | Número do Processo | (Se Sim) | Text | Máximo 100 caracteres. | Condicional | Documentação UPE |
| AF_17 | Valor Financiado | (Se Sim) | Currency | Padrão R$ X.XXX,XX. | Condicional | Documentação UPE |

### 2.4. Declaração

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AF_18 | Declaro Originalidade | Concordância. | Checkbox | Não pode ser desmarcado para avançar. | SIM | Documentação UPE |
| AF_19 | Declaro Cessão de Direitos | Concordância. | Checkbox | Não pode ser desmarcado para avançar. | SIM | Documentação UPE |
| AF_20 | Assinatura Digital | (Upload ou Assinatura Eletrônica) | File / Button | Certificado digital válido. | SIM | ICP-Brasil (Fonte Externa [10]) |

---

## 3. REFERÊNCIAS EXTERNAS (NOVAS INFORMAÇÕES)

> **Justificativa:** O SisGen é uma obrigação legal recente (MP 2.186-16/2001) que pode causar o indeferimento administrativo do pedido de patente se não for declarado corretamente quando se usa biodiversidade. Adicionei o formato específico do número SisGen (UUID) e a obrigatoriedade do CPF para validação da titularidade conforme a LPI.

**Fonte [8]:** INPI - Requisitos de Titularidade.  
*Link:* https://www.gov.br/inpi/pt-br/servicos/patente/titularidade  
*Conteúdo Validado:* Regras de quem pode ser inventor (pessoa física) e titular (pessoa física ou jurídica), e a necessidade de identificação correta (CPF).

**Fonte [9]:** Ministério do Meio Ambiente - SisGen.  
*Link:* http://sisgen.mma.gov.br/  
*Conteúdo Validado:* Definição de acesso ao patrimônio genético, obrigação de cadastro para patentes que utilizem componente genético, e formato do número de registro.

**Fonte [10]:** ICP-Brasil - Assinatura Digital.  
*Link:* https://www.gov.br/iti/pt-br/assuntos/certificado-digital  
*Conteúdo Validado:* Requisitos técnicos para a validade jurídica da assinatura digital em documentos oficiais do INPI.

---

## 4. REGRAS DE NEGÓCIO (LÓGICA APLICADA)

1.  **Soma de Participações:** A soma de todos os campos AF_08 (% Participação) de todos os inventores deve ser igual a 100% (com tolerância de ±0.1%) antes de permitir o envio.
2.  **Ativação SisGen:** Se AF_10 for "Sim", os campos AF_11, AF_12, AF_13 tornam-se **OBRIGATÓRIOS**.
3.  **Ativação Financiamento:** Se AF_14 for "Sim", os campos AF_15, AF_16, AF_17 tornam-se **OBRIGATÓRIOS**.
4.  **Duplicidade de CPF:** O sistema deve impedir a inclusão de dois inventores com o mesmo CPF.

---

## 5. HISTÓRICO DE VERSÕES

| Versão | Data | Autor | Mudança |
|--------|------|-------|---------|
| 1.0 | 28/12/2025 | Crush | Criação inicial da Especificação Funcional |
