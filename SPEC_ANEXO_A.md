# ESPECIFICAÇÃO DO ANEXO A - BUSCA DE ANTERIORIDADE

**Versão do Documento:** 1.0  
**Data de Validação:** 28/12/2025  
**Responsável:** Engenharia de Contexto - Crush  
**Ator:** Inventor/Pesquisador

---

## 1. OBJETIVO

Especificar os campos de dados, regras de validação, tipos de entrada e obrigatoriedade para o preenchimento do Anexo A (Relatório de Busca de Anterioridade), fundamental para a Fase 1 de Preparação.

---

## 2. DICIONÁRIO DE DADOS (DATA DICTIONARY)

### 2.1. Cabeçalho da Busca

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AA_01 | Data da Busca | Data em que a busca foi realizada. | Date | Formato DD/MM/AAAA. Deve ser <= Data de Submissão. | SIM | Documentação UPE |
| AA_02 | Responsável | Nome do inventor ou agente que realizou a busca. | Text | Mínimo 5 caracteres. | SIM | Documentação UPE |

### 2.2. Palavras-Chave (String de Busca)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AA_03 | Termo 1 | Palavra-chave principal. | Text | Mínimo 3 caracteres. | SIM | Documentação UPE |
| AA_04 | Termo 2 | Sinônimo ou termo secundário. | Text | Mínimo 3 caracteres. | SIM | Documentação UPE |
| AA_05 | Termo 3 | Termo técnico específico. | Text | Mínimo 3 caracteres. | SIM | Documentação UPE |

### 2.3. Bases Consultadas

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AA_06 | INPI - Base de Patentes | Busca na base nacional. | Checkbox + Link | Deve preencher Data e URL da busca. | SIM | Documentação UPE |
| AA_07 | Espacenet - Base Europeia | Busca internacional. | Checkbox + Link | Deve preencher Data e URL da busca. | SIM | Documentação UPE |
| AA_08 | Google Patents | Busca geral de patentes. | Checkbox + Link | Deve preencher Data e URL da busca. | SIM | Documentação UPE |

### 2.4. Top 3 Documentos Relevantes (Repetido 3 vezes)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AA_09 | Título da Patente | Título completo do documento encontrado. | Text | Max 255 caracteres. | SIM | Documentação UPE |
| AA_10 | Número da Patente | Código identificador (ex: BR 2020XXXX-Y, US 10,XXX,XXX). | Text | Formato internacional. | SIM | Fonte Externa [6] |
| AA_11 | Data de Publicação | Data de depósito ou publicação. | Date | Formato DD/MM/AAAA. | SIM | Fonte Externa [6] |
| AA_12 | Inventor(es) | Nome do(s) inventor(es). | Text | Max 500 caracteres. | SIM | Fonte Externa [6] |
| AA_13 | Titular | Nome do detentor dos direitos. | Text | Max 255 caracteres. | SIM | Fonte Externa [6] |
| AA_14 | Resumo do Conteúdo | O que a patente faz. | Textarea | Min: 200 chars; Max: 2.000 chars. | SIM | Documentação UPE |
| AA_15 | Lacuna Técnica | O que esta patente NÃO resolve. | Textarea | Min: 200 chars; Max: 2.000 chars. | SIM | AGENTS.md (Gotchas) |
| AA_16 | Relevância | Avaliação de relevância para a invenção. | Select | Valores: `Alta`, `Média`, `Baixa`. | SIM | Documentação UPE |
| AA_17 | Justificativa | Por que é relevante? | Text | Max 500 caracteres. | SIM | Documentação UPE |

### 2.5. Conclusão da Busca

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| AA_18 | É Nova? | A invenção não existe no estado da técnica. | Radio | Valores: `Sim`, `Não`. | SIM | Documentação UPE |
| AA_19 | Justificativa da Novidade | Explicação detalhada. | Textarea | Min: 200 chars; Max: 2.000 chars. | SIM | AGENTS.md (Template) |

---

## 3. REFERÊNCIAS EXTERNAS (NOVAS INFORMAÇÕES)

> **Justificativa:** Para identificar corretamente o "Número da Patente", é necessário validar o formato internacional (INID Code). Além disso, a classificação internacional de patentes (CIP/IPC) é essencial para entender a tecnologia, embora não solicitada no prompt inicial, é um dado padrão em buscas de anterioridade profissional. Adicionei a validação do formato do número.

**Fonte [6]:** WIPO - Patent Cooperation Treaty (PCT).  
*Link:* https://www.wipo.int/pct/en/numbering.html  
*Conteúdo Validado:* Estrutura do número de patente (Código do País + Ano + Número Sequencial + Dígito Verificador). Ex: BR 20XX XXXXX 8.

---

## 4. REGRAS DE NEGÓCIO (LÓGICA APLICADA)

1.  **Validação de Formato INID:** O campo AA_10 (Número da Patente) deve validar se segue o padrão padrão (ex: BR 20XX XXXXX X).
2.  **Seleção de "Não Nova":** Se AA_18 for "Não", o formulário deve alertar fortemente o inventor e recomendar reformulação ou desistência do pedido para evitar gastos com depósito rejeitado.
3.  **Preenchimento dos 3 Documentos:** Embora sejam 3 seções independentes (Doc 1, 2, 3), o formulário deve exigir pelo menos 1 documento preenchido para avançar, recomendando-se 3.

---

## 5. HISTÓRICO DE VERSÕES

| Versão | Data | Autor | Mudança |
|--------|------|-------|---------|
| 1.0 | 28/12/2025 | Crush | Criação inicial da Especificação Funcional |
