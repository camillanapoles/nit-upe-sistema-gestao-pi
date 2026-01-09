# ESPECIFICAÇÃO DO FORMULÁRIO DE REGISTRO DE PROGRAMA (RPC)

**Versão do Documento:** 1.0  
**Data de Validação:** 28/12/2025  
**Responsável:** Engenharia de Contexto - Crush  
**Ator:** Inventor/Pesquisador

---

## 1. OBJETIVO

Especificar os campos de dados, regras de validação, tipos de entrada e obrigatoriedade para o formulário de submissão de pedido de Registro de Programa de Computador (Direito Autoral) junto ao NIT/UPE.

---

## 2. DICIONÁRIO DE DADOS (DATA DICTIONARY)

### 2.1. Dados do Programa

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| RPC_01 | Nome do Programa | Nome comercial. | Text | Min: 3 chars; Max: 150 caracteres. | **SIM** | Fonte Externa [12] |
| RPC_02 | Versão | Versão atual. | Text | Padrão SemVer (1.0.0). | Não | Fonte Externa [12] |
| RPC_03 | Linguagem | Python, Java, C++, etc. | Select | Lista pré-definida + "Outros". | **SIM** | Fonte Externa [12] |
| RPC_04 | Plataforma | Windows, Linux, Web, Mobile. | Select | Lista pré-definida. | **SIM** | Fonte Externa [12] |
| RPC_05 | Descrição Funcional | O que o software faz. | Textarea | Min: 200 chars; Max: 5.000 chars. | **SIM** | Fonte Externa [12] |

### 2.2. Dados do Autor

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| RPC_06 | Nome do Autor | Nome civil. | Text | Mínimo 5 caracteres; Máximo 255 caracteres. | **SIM** | Lei Federal |
| RPC_07 | CPF do Autor | Identificação fiscal. | Text | Máscara: 000.000.000-00. Validação algorítmica. | **SIM** | Lei Federal |
| RPC_08 | E-mail | Contato. | Email | Formato válido. | **SIM** | Documentação UPE |
| RPC_09 | Tipo de Vínculo | Empregado, Estagiário, Bolsista. | Select | Lista pré-definida. | **SIM** | Documentação UPE |
| RPC_10 | Vínculo com a UPE | Se o autor é servidor ou estudante. | Radio | Valores: `Sim`, `Não`. | **SIM** | Documentação UPE |

### 2.3. Arquivos de Upload

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| RPC_11 | Código-Fonte | Arquivo(s) fonte compactados. | File Upload | Extensão: `.zip`. Tamanho Máx: 50MB. Obrigatório conter `.h`, `.cpp`, `.py`, `.java`, etc. | **SIM** | Fonte Externa [12] |
| RPC_12 | Executável | Binário compilado (se aplicável). | File Upload | Extensão: `.exe`, `.app`, `.deb`. Tamanho Máx: 100MB. | Não | Fonte Externa [12] |
| RPC_13 | Manual do Usuário | Documento PDF. | File Upload | Extensão: `.pdf`. Tamanho Máx: 10MB. | **SIM** | Fonte Externa [12] |

---

## 3. REFERÊNCIAS EXTERNAS (NOVAS INFORMAÇÕES)

> **Justificativa:** O Registro de Programa de Computador (RPC) é uma modalidade de Direito Autoral, diferente de Patente. O INPI exige o depósito do código-fonte ou, alternativamente, de partes do código ("trechos"). Para fins de segurança da UPE, o formulário deve exigir o código-fonte completo compactado. Adicionei o campo "Vínculo com a UPE" pois, para a UPE reivindicar titularidade em nome próprio (ou cessão), é necessário provar que o desenvolvimento ocorreu no âmbito da universidade.

**Fonte [12]:** INPI - Registro de Programa de Computador (RPC).  
*Link:* https://www.gov.br/inpi/pt-br/servicos/registro-de-programa-de-computador  
*Conteúdo Validado:** Requisitos formais do RPC, necessidade de Código-Fonte ou Executável, Manual do Usuário, e diferença de titularidade entre autor e titular.

---

## 4. REGRAS DE NEGÓCIO (LÓGICA APLICADA)

1.  **Código-Fonte ZIP:** O arquivo RPC_11 deve ser validado (via script de servidor) para garantir que contém arquivos de código-fonte válidos (extensões .c, .h, .cpp, .java, .py, etc.) e não apenas lixo ou dados.
2.  **Cessão de Direitos:** Se RPC_10 (Vínculo UPE) for "Sim", o sistema deve gerar automaticamente o Termo de Cessão de Direitos Autorais (diferente do Termo de Patente) para assinatura.
3.  **Manual PDF:** O campo RPC_13 é obrigatório para fins de publicação no boletim RPC.

---

## 5. HISTÓRICO DE VERSÕES

| Versão | Data | Autor | Mudança |
|--------|------|-------|---------|
| 1.0 | 28/12/2025 | Crush | Criação inicial da Especificação Funcional |
