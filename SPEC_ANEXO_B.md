# ESPECIFICAÇÃO DO ANEXO B - MATRIZ DE PROBLEMA X SOLUÇÃO

**Versão do Documento:** 1.0  
**Data de Validação:** 28/12/2025  
**Responsável:** Engenharia de Contexto - Crush  
**Ator:** Inventor/Pesquisador

---

## 1. OBJETIVO

Especificar os campos de dados, regras de validação, tipos de entrada e obrigatoriedade para o preenchimento do Anexo B (Matriz de Problema x Solução), fundamental para definir a Atividade Inventiva (NAI).

---

## 2. DICIONÁRIO DE DADOS (DATA DICTIONARY)

### 2.1. Problema Identificado

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AB_01 | Título do Problema | Nome curto e descritivo. | Text | Min: 5 chars; Max: 100 chars. | SIM | Documentação UPE |
| AB_02 | Descrição do Problema | Detalhamento (300-500 palavras). | Textarea | Min: 300 chars; Max: 5.000 chars. | SIM | AGENTS.md (Template) |
| AB_03 | Quem Sofre? | Público-alvo afetado. | Text | Max 255 caracteres. | SIM | Documentação UPE |
| AB_04 | Como se Manifesta? | Sintomas/consequências. | Text | Max 500 caracteres. | SIM | Documentação UPE |

### 2.2. Soluções Existentes (Estado da Técnica)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AB_05 | Nome da Solução A | Identificação. | Text | Max 100 caracteres. | SIM | Documentação UPE |
| AB_06 | Descrição Solução A | (100-200 palavras). | Textarea | Min: 100 chars; Max: 2.000 chars. | SIM | Documentação UPE |
| AB_07 | Vantagens A | Lista. | Textarea | Max 1.000 chars. | SIM | Documentação UPE |
| AB_08 | Limitações A | Lista (crítico). | Textarea | Max 1.000 chars. | SIM | AGENTS.md (Gotchas) |
| AB_09 | Referências A | Patentes/Artigos. | Text | Max 255 caracteres (URL ou Título). | SIM | Documentação UPE |
| AB_10 | Solução B | (Estrutura igual a A) | | | | |
| AB_11 | Solução C | (Estrutura igual a A) | | | | |

### 2.3. Solução Proposta (Invenção)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AB_12 | Título da Invenção | (Igual ao Formulário PI). | Text | Herdado do Form PI. | SIM | Documentação UPE |
| AB_13 | Descrição Solução | (500-1.000 palavras). | Textarea | Min: 500 chars; Max: 10.000 chars. | SIM | AGENTS.md (Template) |
| AB_14 | Como Funciona | Passo a passo. | Textarea | Min: 200 chars; Max: 5.000 chars. | SIM | Documentação UPE |
| AB_15 | Diferencial | Único/Superior. | Text | Max 500 caracteres. | SIM | Documentação UPE |

### 2.4. Vantagens Comparativas (KPIs)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AB_16 | Métrica 1 | Tempo, Custo, Eficiência, etc. | Select + Text | Deve ser numérico ou % para comparação. | SIM | AGENTS.md (Template) |
| AB_17 | Valor Solução A | Valor base da solução existente. | Number | Pode ser segundos, R$, %. | SIM | Documentação UPE |
| AB_18 | Valor Sua Invenção | Valor da invenção proposta. | Number | Pode ser segundos, R$, %. | SIM | Documentação UPE |
| AB_19 | % Melhoria | Calculado automaticamente. | Readonly Number | Formula: `((Valor A - Sua Inv) / Valor A) * 100`. | SIM | AGENTS.md (Template) |
| AB_20 | Justificativa KPI | Por que é melhor? | Text | Max 500 caracteres. | SIM | Documentação UPE |

---

## 3. REFERÊNCIAS EXTERNAS (NOVAS INFORMAÇÕES)

> **Justificativa:** A seção de "Vantagens Comparativas" e o cálculo de "% Melhoria" são essenciais para demonstrar a Atividade Inventiva (NAI). A LPI não exige KPIs numéricos no depósito, mas para fins de triagem interna e robustez (Objetivo do Projeto), quantificar a melhoria é a melhor forma de evitar indeferimentos por "óbvio". Adicionei o campo "Referências" às Soluções Existentes para permitir citação de prioridade artística (artigos científicos), que também compõem o Estado da Técnica.

**Fonte [7]:** LPI Lei 9.279/96 - Artigo 13 (Atividade Inventiva).  
*Link:* http://www.planalto.gov.br/ccivil_03/leis/l9279.htm  
*Conteúdo Validado:* Definição legal de "óbvio" e "atividade inventiva". A solução não deve resultar de maneira óbvia para o técnico no assunto. A Matriz de Problema x Solução é a ferramenta de prova documental disso.

---

## 4. REGRAS DE NEGÓCIO (LÓGICA APLICADA)

1.  **Cálculo Automático de Melhoria:** O sistema deve calcular `AB_19` automaticamente ao alterar `AB_17` ou `AB_18`.
2.  **Mínimo 2 Soluções Existentes:** Para garantir análise comparativa justa, o inventor deve preencher pelo menos 2 soluções existentes (A e B) ou explicar a ausência.
3.  **Alerta de Métrica:** Se `% Melhoria` for negativa (pior que o estado da técnica), o sistema deve gerar um aviso de risco de rejeição por não-inventividade.

---

## 5. HISTÓRICO DE VERSÕES

| Versão | Data | Autor | Mudança |
|--------|------|-------|---------|
| 1.0 | 28/12/2025 | Crush | Criação inicial da Especificação Funcional |
