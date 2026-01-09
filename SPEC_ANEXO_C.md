# ESPECIFICAÇÃO DO ANEXO C - MEMORIAL DESCRITIVO

**Versão do Documento:** 1.0  
**Data de Validação:** 28/12/2025  
**Responsável:** Engenharia de Contexto - Crush  
**Ator:** Inventor/Pesquisador

---

## 1. OBJETIVO

Especificar os campos de dados, regras de validação, tipos de entrada e obrigatoriedade para o preenchimento do Anexo C (Memorial Descritivo), o documento técnico central do pedido de patente, conforme estruturado nos formulários oficiais do INPI (Form 1.01).

---

## 2. DICIONÁRIO DE DADOS (DATA DICTIONARY)

### 2.1. Cabeçalho

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AC_01 | Título da Invenção | (Herdado do Formulário). | Text | Máx 150 caracteres. | **SIM** | Fonte Externa [11] |
| AC_02 | Campo da Invenção | Área técnica a que se refere. | Text | Min 10 chars; Max 500 chars. | **SIM** | Fonte Externa [11] |
| AC_03 | Estado da Técnica | O que já existe. | Textarea | Min 500 chars; Max 5.000 chars. | **SIM** | Fonte Externa [11] |

### 2.2. Sumário da Invenção (Resumo Técnico)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AC_04 | Objetivos da Invenção | O que se resolve. | Text | Min 50 chars; Max 500 chars. | **SIM** | Fonte Externa [11] |
| AC_05 | Características Principais | Descrição técnica resumida. | Textarea | Min 200 chars; Max 2.000 chars. | **SIM** | Fonte Externa [11] |
| AC_06 | Vantagens da Invenção | Benefícios técnicos. | Textarea | Min 100 chars; Max 1.500 chars. | **SIM** | Fonte Externa [11] |

### 2.3. Descrição Detalhada da Invenção

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AC_07 | Componentes / Elementos | Lista de partes. | Textarea | Lista ou texto corrido. Max 3.000 chars. | **SIM** | Fonte Externa [11] |
| AC_08 | Funcionamento | Como funciona (etapas). | Textarea | Min 500 chars; Max 10.000 chars. | **SIM** | Fonte Externa [11] |
| AC_09 | Modo de Realização | Exemplos práticos (concretização). | Textarea | Min 500 chars; Max 10.000 chars. | **SIM** | Fonte Externa [11] |
| AC_10 | Parâmetros Específicos | Faixas (ex: 40-45°C). | Text | Formato de faixas. | **SIM** | AGENTS.md (Gotchas) |

### 2.4. Desenhos / Figuras

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AC_11 | Número da Figura | Identificador (ex: Fig. 1). | Text | Formato automático. | **SIM** | Fonte Externa [11] |
| AC_12 | Descrição da Figura | Breve legenda. | Text | Max 200 caracteres. | **SIM** | Fonte Externa [11] |
| AC_13 | Arquivo da Figura | Imagem. | File Upload | Extensão: `.pdf`, `.tiff`. | **SIM** | Fonte Externa [11] |
| AC_14 | Referências Numéricas | Mapeamento (1: Bloco, 2: Dispositivo). | Text | Pairs (ID : Label). | **SIM** | AGENTS.md (Template) |

### 2.5. Reivindicações (Claims) - Mínimo 3

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AC_15 | Reivindicação 1 (Independente) | Escopo amplo da proteção. | Textarea | Min 100 chars; Max 5.000 chars. Começa com "1. Um...". | **SIM** | Fonte Externa [11] |
| AC_16 | Reivindicação 2 (Dependente) | Refina a 1. | Textarea | Min 100 chars; Max 5.000 chars. Começa com "2. O ... de acordo com a reivindicação 1, caracterizado por...". | **SIM** | Fonte Externa [11] |
| AC_17 | Reivindicação 3 (Dependente) | Refina a 1 ou 2. | Textarea | Min 100 chars; Max 5.000 chars. | **SIM** | Fonte Externa [11] |
| AC_18 | Reivindicações Adicionais | 4 a 10. | Textarea | Máximo de 10 reivindicações totais. | Não | AGENTS.md (Template) |

### 2.6. Resumo do Pedido (Para Publicação)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AC_19 | Resumo Oficial | Resumo para o boletim RPI. | Textarea | Min: 50 palavras; Max: **200 palavras**. | **SIM** | AGENTS.md (Template) |

---

## 3. REFERÊNCIAS EXTERNAS (NOVAS INFORMAÇÕES)

> **Justificativa:** A estrutura do "Memorial Descritivo" segue rigidamente o modelo do INPI (Formulário 1.01 e Formulário 1.02). A ordem das seções (Cabeçalho, Estado da Técnica, Sumário, Descrição Detalhada, Desenhos, Reivindicações) é fixa. A validação das "Reivindicações" (especialmente a dependência hierárquica "de acordo com a reivindicação X") é crucial. Adicionei a validação de palavras (não caracteres) para o Resumo, que é uma regra estrita do INPI (50-200 palavras).

**Fonte [11]:** INPI - Formulários de Patente (Form 1.01 e Form 1.02).  
*Link:* https://www.gov.br/inpi/pt-br/servicos/formularios/patente  
*Conteúdo Validado:* Estrutura oficial do Relatório Descritivo, ordem das seções, formatação obrigatória de reivindicações (independente/dependente) e limites do Resumo.

---

## 4. REGRAS DE NEGÓCIO (LÓGICA APLICADA)

1.  **Contador de Palavras:** O campo AC_19 (Resumo) deve contar **PALAVRAS**, não caracteres. O sistema deve usar algoritmo de separação por espaço/linguagem portuguesa.
2.  **Numeração de Reivindicações:** O sistema deve impedir a criação de uma reivindicação 2 dependente se a reivindicação 1 não existir.
3.  **Referências Numéricas:** Ao adicionar uma figura (AC_13), o sistema deve gerar automaticamente IDs (1, 2, 3...) para facilitar a montagem da legenda (AC_14).

---

## 5. HISTÓRICO DE VERSÕES

| Versão | Data | Autor | Mudança |
|--------|------|-------|---------|
| 1.0 | 28/12/2025 | Crush | Criação inicial da Especificação Funcional |
