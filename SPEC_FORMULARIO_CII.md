# ESPECIFICAÇÃO DO FORMULÁRIO DE SOFTWARE (CII)

**Versão do Documento:** 1.0  
**Data de Validação:** 28/12/2025  
**Responsável:** Engenharia de Contexto - Crush  
**Ator:** Inventor/Pesquisador

---

## 1. OBJETIVO

Especificar os campos de dados, regras de validação, tipos de entrada e obrigatoriedade para o formulário de submissão de pedido de Patente de Invenção para Computer Implemented Invention (CII) junto ao NIT/UPE.

---

## 2. DICIONÁRIO DE DADOS (DATA DICTIONARY)

### 2.1. Metadados do Pedido (Herdados de PI)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| F2_01 | Título do Software | Nome do software/programa. | Text | Min: 1 char; Max: 150 caracteres. | SIM | AGENTS.md |
| F2_02 | Versão | Versão atual do software. | Text | Padrão SemVer (ex: 1.0.0). | Não | Fonte Externa [4] |
| F2_03 | Plataforma | Ambiente de execução. | Select | Valores: `Windows`, `Linux`, `MacOS`, `Web`, `Mobile`, `Embedded`. | SIM | Fonte Externa [4] |

### 2.2. Efeito Técnico (CRÍTICO PARA CII)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| F2_04 | Descrição do Efeito Técnico | Como o software melhora o hardware/computador. | Textarea | Min: 200 chars; Max: 2.000 chars. Não pode ser vago. | SIM | AGENTS.md (Gotchas) |
| F2_05 | Métrica Quantitativa | Melhoria mensurável (ex: "Reduce memory by 30%"). | Textarea | Min: 100 chars; Max: 500 chars. Obrigatório uso de % ou tempo. | SIM | AGENTS.md (Template) |
| F2_06 | Tipo de Efeito Técnico | Categoria da melhoria técnica. | Select | Valores: `Performance`, `Memória`, `Segurança`, `Precisão`, `Latência`, `Outro`. | SIM | Documentação UPE |

### 2.3. Descrição Funcional

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| F2_07 | Funcionalidades Principais | O que o software faz. | Textarea | Min: 200 chars; Max: 2.000 chars. | SIM | Fonte Externa [4] |
| F2_08 | Inputs (Entradas) | Dados que o sistema recebe. | Textarea | Min: 100 chars; Max: 1.000 chars. | SIM | Fonte Externa [4] |
| F2_09 | Outputs (Saídas) | Dados/processos gerados. | Textarea | Min: 100 chars; Max: 1.000 chars. | SIM | Fonte Externa [4] |

### 2.4. Requisitos de Hardware

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| F2_10 | Processador | Arquitetura e velocidade mínima. | Text | Max 100 caracteres. | SIM | Fonte Externa [4] |
| F2_11 | Memória RAM | Memória mínima necessária. | Text | Max 100 caracteres (ex: "4 GB"). | SIM | Fonte Externa [4] |
| F2_12 | Armazenamento | Espaço em disco. | Text | Max 100 caracteres (ex: "10 GB"). | SIM | Fonte Externa [4] |

### 2.5. Fluxograma BPMN (Obrigatório CII)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| F2_13 | Descrição Textual do Fluxo | Descrição das etapas do algoritmo. | Textarea | Min: 200 chars; Max: 2.000 chars. | SIM | AGENTS.md (Anexo C) |
| F2_14 | Arquivo do Fluxograma | Diagrama visual em blocos. | File Upload | Extensão: `.pdf` (BPMN/Flowchart). Tamanho Máx: 10MB. | SIM | AGENTS.md (Gotchas) |

### 2.6. Tripla Reivindicação (CII)

| ID Campo | Nome do Campo | Descrição | Tipo de Input | Validação / Regras | Obrigatório? | Fonte |
|----------|----------------|-----------|---------------|---------------------|---------------|-------|
| F2_15 | Resumo do Método | Resumo da reivindicação de método. | Text | Max 500 caracteres. | SIM | Fonte Externa [5] |
| F2_16 | Resumo do Sistema | Resumo da reivindicação de sistema (hardware). | Text | Max 500 caracteres. | SIM | Fonte Externa [5] |
| F2_17 | Resumo do Mídia | Resumo da reivindicação de mídia armazenável. | Text | Max 500 caracteres. | SIM | Fonte Externa [5] |

---

## 3. REFERÊNCIAS EXTERNAS (NOVAS INFORMAÇÕES)

> **Justificativa:** Para diferenciar CII (Patente) de RPC (Direito Autoral), é crucial capturar o "Efeito Técnico" e a referência a hardware. O INPI rejeita patentes de software que não tenham efeito técnico sobre o hardware ou processo industrial. Além disso, a prática mundial recomenda a "Tripla Reivindicação" (Method, System, Media) para proteção máxima, que deve ser documentada aqui para guiar o redator.

**Fonte [4]:** WIPO - Intellectual Property and Software.  
*Link:* https://www.wipo.int/patents/en/topics/software/computer-implemented-inventions.html  
*Conteúdo Validado:* Definição de CII, distinção entre lógica abstrata e efeito técnico, categorias de proteção.

**Fonte [5]:** USPTO - Software Inventions: Protecting Software-Related Inventions.  
*Link:* https://www.uspto.gov/patents-application-process/patenting-specific-technologies/software  
*Conteúdo Validado:* Estratégia de reivindicação "Tripla Patente" (Method, System, Article of Manufacture) adaptável ao contexto brasileiro e UPE.

---

## 4. REGRAS DE NEGÓCIO (LÓGICA APLICADA)

1.  **Validação de Efeito Técnico:** O sistema deve alertar se o campo F2_04 não contiver termos técnicos (ex: "algoritmo", "banco de dados") sem associação a hardware (ex: "processador", "memória").
2.  **Tripla Reivindicação:** Os campos F2_15, F2_16, F2_17 não compõem o memorial final, mas servem como rascunho para o redator de patentes criar as 3 primeiras reivindicações independentes.
3.  **Upload de Fluxograma:** O arquivo F2_14 é obrigatório e substitui as screenshots de código (que são proibidas em patentes).
