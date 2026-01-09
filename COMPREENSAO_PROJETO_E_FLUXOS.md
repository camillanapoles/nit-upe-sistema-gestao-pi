# COMPREENSÃO DO PROJETO E DIAGRAMAS DE FLUXO
## Sistema de Gestão de Propriedade Intelectual UPE - Projeto Crush

---

## 1. O QUE EU DEPREENDO DO PROJETO

### 1.1 Resumo Executivo

Este é um projeto de **transformação digital do processo de patenteamento** da Universidade de Pernambuco (UPE), com objetivo de criar um sistema integral de gestão de propriedade intelectual que resolva problemas crônicos e posicione a instituição como referência nacional.

### 1.2 O Problema Atual (Dor)

**Cenário Atual:**
- **Alto índice de falhas** no registro de patentes
- Inventores sem orientação adequada para escrever na linguagem técnica do INPI
- **Sobrecarga** dos avaliadores do NIT (Núcleo de Inovação Tecnológica)
- **Demora excessiva** na protocolização
- **Retrabalho constante** (inventores e avaliadores)
- **Taxa de indeferimento** elevada

**Causa Raiz:**
- Falta de estrutura documental clara
- Ausência de templates validados
- Inventores desconhecem a diferença entre tipos de patente (PI, MU, CII, RPC)
- Processos sem padronização
- Filtros de qualidade inexistentes na entrada
- Falta de formação conceitual prévia

### 1.3 A Solução Proposta

**Abordagem:** Sistema Integral de Alta Performance com Engenharia de Contexto

**Pilares da Solução:**

1. **Educação Preventiva (Fase 1)**
   - Antes de escrever, o inventor entende conceitos
   - Diferenciação clara entre tipos de patente
   - Compreensão de "Laboratório vs. Patente"

2. **Coleta Estruturada (Fase 2)**
   - Formulários digitais validados
   - Campos essenciais pré-definidos
   - Validação automática de caracteres
   - Separado por tipo de patente

3. **Documentação Técnica Padronizada (Fase 3)**
   - Templates validados para cada componente do pedido
   - Guias passo-a-passo
   - Exemplos "Certo/Errado"
   - Limites de caracteres/palavras explícitos

4. **Formalização Jurídica (Fase 4)**
   - Modelos de termos de cessão
   - Declarações de inventores
   - Checklists de documentos legais

5. **Blindagem Contra Indeferimento (Fase 5)**
   - Checklists finais de conformidade
   - Verificações extras
   - Validação de requisitos formais do INPI

### 1.4 Metodologia Aplicada

**Engenharia de Contexto:**
- Compreensão profunda do ecossistema de inovação acadêmica
- Análise de 21 documentos existentes
- Identificação de padrões e lacunas

**Alta Performance (McKinsey/Lean):**
- Eliminação de desperdícios (retrabalho)
- Foco em KPIs mensuráveis
- Melhoria contínua (PDCA)

**UX/UI Design:**
- Poka-Yoke (prevenção de erros) em cada etapa
- Semaforização visual (RAG)
- Exemplos contrastantes (Certo/Errado)
- Interface amigável e intuitiva

**Framework CRUSHER (Engenharia de Prompt):**
- **C**ontext → Compreensão do cenário
- **R**ole → Definição de papéis
- **U**ser Task → Tarefas específicas
- **S**tyle → Estilo consistente
- **H**igh-Level Objectives → KPIs alinhados
- **E**xamples → Exemplos práticos
- **R**equirements → Requisitos explícitos

### 1.5 KPIs e Objetivos

| KPI | Meta | Impacto |
|-----|------|---------|
| **Redução de Retrabalho** | > 90% | Inventores e avaliadores poupam tempo |
| **Satisfação UX** | > 90% | Inventores felizes com o processo |
| **Tempo Primeira Devolutiva** | ≤ 10 dias úteis | Agilidade no processo |
| **Taxa Aprovação Entrada** | > 70% | Menos devoluções |
| **Tempo Redução Redação** | 50% | Inventores escrevem mais rápido |
| **Taxa Deferimento INPI** | +20% | Mais patentes aprovadas |

### 1.6 Estrutura do Sistema

**5 Fases Principais:**
1. **Preparação** (Responsabilidade: Inventor/Pesquisador)
2. **Submissão** (Portão de Entrada: Filtro de Qualidade)
3. **Análise** (Responsabilidade: NIT/Comissão)
4. **Depósito** (Finalização no INPI)
5. **Robustez e Conformidade** (Garantia de Qualidade)

**21 Documentos Analizados → 49 Documentos Sistematizados**

---

## 2. DIAGRAMAS DE FLUXO SEQUENCIAL

### 2.1 Visão Macro: Fluxo Completo do Processo

```mermaid
flowchart TD
    Start(["Início"]) --> Edu1["Educação Prévia"]
    Edu1 --> Edu2["Diferenciação Tipos Patente"]
    Edu2 --> Edu3["Compreensão Laboratório vs Patente"]
    Edu3 --> Kit1["Kit Inventor Prévio FASE 1"]
    
    Kit1 --> AnexoA["Anexo A Busca de Anterioridade"]
    Kit1 --> AnexoB["Anexo B Matriz Problema x Solução"]
    Kit1 --> AnexoC["Anexo C Memorial Descritivo"]
    Kit1 --> AnexoF["Anexo F Qualificação Inventores"]
    
    AnexoA --> Subm1["Kit Requerimento FASE 2"]
    AnexoB --> Subm1
    AnexoC --> Subm1
    AnexoF --> Subm1
    
    Subm1 --> FormPat["Formulário Patente Padrão"]
    Subm1 --> FormSoft["Formulário Software CII"]
    FormPat --> Val1["Validação de Caracteres"]
    FormSoft --> Val1
    Val1 --> Check1["Checklist Submissão"]
    
    Check1 --> Dec1{Passou na Validação?}
    
    Dec1 -->|Não| Corr1["Correções pelo Inventor"]
    Corr1 --> Subm1
    
    Dec1 -->|Sim| DocTec["Kit Documentação Técnica FASE 3"]
    
    DocTec --> Resumo["Template Resumo 50-200 palavras"]
    DocTec --> RelDesc["Template Relatório Descritivo"]
    DocTec --> Reiv["Template Reivindicações 3-6"]
    DocTec --> Desenho["Template Desenhos Figuras"]
    DocTec --> MatComp["Matriz Estado da técnica x Invenção"]
    
    Resumo --> SubmFinal["Submissão ao NIT"]
    RelDesc --> SubmFinal
    Reiv --> SubmFinal
    Desenho --> SubmFinal
    MatComp --> SubmFinal
    
    SubmFinal --> Analise["Fase 3 Análise Técnica"]
    
    Analise --> Triagem1["Triagem Administrativa"]
    Triagem1 --> ExameNAI["Exame NAI Novidade Atividade Inventiva Aplicação Industrial"]
    
    ExameNAI --> Parecer["Template Parecer Semaforizado"]
    
    Parecer --> Dec2{Resultado}
    
    Dec2 -->|🟢 Verde Aprovado| Formal["Kit Formalização FASE 4"]
    Dec2 -->|🟡 Amarelo Com Ressalvas| Ajuste1["Ajustes Menores"]
    Ajuste1 --> DocTec
    Dec2 -->|🔴 Vermelho Desfavorável| Refute["Reformulação Completa"]
    Refute --> Kit1
    
    Formal --> Termos["Termos de Cessão"]
    Formal --> Decl["Declarações Inventores"]
    Formal --> DocLeg["Documentos Legais SisGen"]
    
    Termos --> Robustez["Kit Robustez Conformidade FASE 5"]
    Decl --> Robustez
    DocLeg --> Robustez
    
    Robustez --> CheckFinal["Checklist Final Conformidade"]
    CheckFinal --> ValFinal["Validação de Requisitos Formais INPI"]
    
    ValFinal --> Dec3{Passou na Validação Final?}
    
    Dec3 -->|Não| Ajuste2["Ajustes Finais"]
    Ajuste2 --> Robustez
    
    Dec3 -->|Sim| Deposito["Protocolo no INPI"]
    
    Deposito --> Acompanh["Acompanhamento do Pedido"]
    Acompanh --> Status(["Status Monitoramento"])
    
    style Start fill:#4CAF50,color:#fff;
    style Status fill:#9C27B0,color:#fff;
    style Kit1 fill:#2196F3,color:#fff;
    style Subm1 fill:#2196F3,color:#fff;
    style DocTec fill:#2196F3,color:#fff;
    style Analise fill:#FF9800,color:#fff;
    style Formal fill:#FF9800,color:#fff;
    style Robustez fill:#FF9800,color:#fff;
    style CheckFinal fill:#f44336,color:#fff;
    style Dec1 fill:#ffeb3b;
    style Dec2 fill:#ffeb3b;
    style Dec3 fill:#ffeb3b;
```

### 2.2 Detalhamento: Fase 1 - Preparação (Responsabilidade: Inventor)

```mermaid
flowchart TD
    Start(["Inventor tem uma Invenção"]) --> Q1{Já divulgou publicamente?}
    
    Q1 -->|Sim| Prazo12["Verificar se está dentro de 12 meses"]
    Q1 -->|Não| Educa1["Educação Prévia"]
    
    Prazo12 --> Q2{Dentro de 12 meses?}
    Q2 -->|Não| Perdido(["Invenção em Domínio Público"])
    Q2 -->|Sim| Educa1
    
    Educa1 --> Diff1["Compreender Diferenças entre Tipos"]
    Diff1 --> PI1["PI Patente de Invenção 20 anos"]
    Diff1 --> MU1["MU Modelo de Utilidade 15 anos"]
    Diff1 --> CII1["CII Software com Efeito Técnico"]
    Diff1 --> RPC1["RPC Registro de Software 50 anos"]
    
    PI1 --> Q3{É uma lógica técnica?}
    MU1 --> Q4{É um objeto físico com nova forma?}
    CII1 --> Q5{Software melhora hardware?}
    RPC1 --> Q6{Apenas código sem efeito técnico?}
    
    Q3 -->|Sim| Tipo1["Selecionar PI"]
    Q3 -->|Não| Diff1
    
    Q4 -->|Sim| Tipo2["Selecionar MU"]
    Q4 -->|Não| Diff1
    
    Q5 -->|Sim| Tipo3["Selecionar CII"]
    Q5 -->|Não| RPC1
    
    Q6 -->|Sim| Tipo4["Selecionar RPC"]
    Q6 -->|Não| CII1
    
    Tipo1 --> Comp1["Compreender Laboratório vs Patente"]
    Tipo2 --> Comp1
    Tipo3 --> Comp1
    Tipo4 --> Comp1
    
    Comp1 --> Laboratorio["Laboratório"]
    Comp1 --> Patente["Patente"]
    
    Laboratorio --> Lab1["Foco: Descoberta e Publicação"]
    Laboratorio --> Lab2["Público: Comunidade Científica"]
    Laboratorio --> Lab3["Linguagem: Técnica Detalhada"]
    Laboratorio --> Lab4["Resultado: Artigo Científico"]
    
    Patente --> Pat1["Foco: Proteção e Comercialização"]
    Patente --> Pat2["Público: Examinador INPI Mercado"]
    Patente --> Pat3["Linguagem: Jurídico-técnica Defensiva"]
    Patente --> Pat4["Resultado: Direito Exclusivo de Exploração"]
    
    Lab1 --> Anexos["Começar Preencher Anexos"]
    Lab2 --> Anexos
    Lab3 --> Anexos
    Lab4 --> Anexos
    Pat1 --> Anexos
    Pat2 --> Anexos
    Pat3 --> Anexos
    Pat4 --> Anexos
    
    Anexos --> AnexoA["Anexo A Busca de Anterioridade"]
    Anexos --> AnexoB["Anexo B Matriz Problema x Solução"]
    Anexos --> AnexoC["Anexo C Memorial Descritivo"]
    Anexos --> AnexoF["Anexo F Qualificação Inventores"]
    
    AnexoA --> Busca1["Realizar Busca em INPI"]
    AnexoA --> Busca2["Buscar em Espacenet"]
    AnexoA --> Busca3["Buscar em Google Patents"]
    AnexoA --> Top3["Identificar Top 3 Documentos Relevantes"]
    Top3 --> Lacuna["Identificar Lacuna Técnica"]
    
    AnexoB --> Prob["Definir Problema Claramente"]
    AnexoB --> Soluc["Descrever Solução Proposta"]
    AnexoB --> KPIs["Listar KPIs Comparativos"]
    
    AnexoC --> Mem["Preencher Memorial Descritivo"]
    AnexoC --> Ver12["Verificar Prazo 12 Meses"]
    
    AnexoF --> Qual1["Listar Qualificação Inventores"]
    AnexoF --> Partic["Definir % Participação"]
    AnexoF --> SisGen1["Registrar SisGen se necessário"]
    
    Lacuna --> Val1A["Validação Anexos"]
    KPIs --> Val1A
    Mem --> Val1A
    SisGen1 --> Val1A
    
    Val1A --> DecF1{Anexos Completos?}
    DecF1 -->|Não| CorrA["Corrigir Anexos"]
    CorrA --> AnexoA
    DecF1 -->|Sim| FimFase1(["Fase 1 Completa Pronto para Submissão"])
    
    style Start fill:#4CAF50,color:#fff;
    style Perdido fill:#f44336,color:#fff;
    style FimFase1 fill:#9C27B0,color:#fff;
    style DecF1 fill:#ffeb3b;
    style Q3 fill:#ffeb3b;
    style Q4 fill:#ffeb3b;
    style Q5 fill:#ffeb3b;
    style Q6 fill:#ffeb3b;
```

### 2.3 Detalhamento: Fase 2 - Submissão (Portão de Entrada)

```mermaid
flowchart TD
    Start(["Anexos Prontos"]) --> Tipo1{Qual Tipo de Patente?}
    
    Tipo1 -->|PI ou MU| FormPat["Formulário Patente Padrão"]
    Tipo1 -->|CII ou RPC| FormSoft["Formulário Software CII"]
    
    FormPat --> Campo1["Preencher Título Máx 150 caracteres"]
    FormPat --> Campo2["Preencher Problema Dor 100-1000 caracteres"]
    FormPat --> Campo3["Preencher Solução Técnica 500-4000 caracteres"]
    FormPat --> Campo4["Preencher Estado da Técnica 200-2000 caracteres"]
    FormPat --> Campo5["Preencher Vantagens 100-1500 caracteres"]
    FormPat --> Campo6["Preencher Palavras-chave 50-100 caracteres"]
    
    FormSoft --> Campo1S["Preencher Título Máx 150 caracteres"]
    FormSoft --> Campo2S["Preencher Problema Dor 100-1000 caracteres"]
    FormSoft --> Campo3S["Preencher Solução Técnica 500-4000 caracteres"]
    FormSoft --> Campo4S["Preencher Estado da Técnica 200-2000 caracteres"]
    FormSoft --> Campo5S["Preencher Vantagens 100-1500 caracteres"]
    FormSoft --> Campo6S["Preencher Palavras-chave 50-100 caracteres"]
    FormSoft --> Campo7S["Preencher Fluxograma BPMN"]
    
    Campo1 --> ValCar1["Validação de Caracteres"]
    Campo2 --> ValCar1
    Campo3 --> ValCar1
    Campo4 --> ValCar1
    Campo5 --> ValCar1
    Campo6 --> ValCar1
    
    Campo1S --> ValCar2["Validação de Caracteres"]
    Campo2S --> ValCar2
    Campo3S --> ValCar2
    Campo4S --> ValCar2
    Campo5S --> ValCar2
    Campo6S --> ValCar2
    Campo7S --> ValCar2
    
    ValCar1 --> Dec1{Caracteres Dentro dos Limites?}
    ValCar2 --> Dec1
    
    Dec1 -->|Não| Ajuste1["Ajustar Tamanho dos Campos"]
    Ajuste1 --> Campo1
    Dec1 -->|Sim| Check1["Checklist de Conferência"]
    
    Check1 --> Item1["✓ Anexo A Assinado Presente"]
    Check1 --> Item2["✓ Anexo B Completo Presente"]
    Check1 --> Item3["✓ Anexo C Memorial Presente"]
    Check1 --> Item4["✓ Anexo F Qualificação Presente"]
    Check1 --> Item5["✓ Formulário Preenchido"]
    Check1 --> Item6["✓ Arquivos em PDF"]
    
    Item1 --> Val1{Todos os Itens Presentes?}
    Item2 --> Val1
    Item3 --> Val1
    Item4 --> Val1
    Item5 --> Val1
    Item6 --> Val1
    
    Val1 -->|Não| Comp1["Completar Itens Faltantes"]
    Comp1 --> Check1
    Val1 -->|Sim| ValLegal["Validação Legal"]
    
    ValLegal --> Legal1["Verificar Assinaturas Digitais"]
    ValLegal --> Legal2["Verificar SisGen se Aplicável"]
    ValLegal --> Legal3["Verificar Prazo 12 Meses"]
    
    Legal1 --> Dec2{Validação Legal OK?}
    Legal2 --> Dec2
    Legal3 --> Dec2
    
    Dec2 -->|Não| CorrLegal["Corrigir Problemas Legais"]
    CorrLegal --> ValLegal
    Dec2 -->|Sim| Envio["Enviar para NIT propegi gerenciatransferetec@upe.br"]
    
    Envio --> Receb["Recebimento de Protocolo"]
    Receb --> EmailConf["E-mail de Confirmação Automático"]
    
    EmailConf --> Dec3{Protocolo Gerado?}
    Dec3 -->|Não| Reenv1["Reenviar Submissão"]
    Reenv1 --> Envio
    Dec3 -->|Sim| FimFase2(["Fase 2 Completa Aguardando Análise do NIT"])
    
    style Start fill:#4CAF50,color:#fff;
    style FimFase2 fill:#9C27B0,color:#fff;
    style Dec1 fill:#ffeb3b;
    style Dec2 fill:#ffeb3b;
    style Dec3 fill:#ffeb3b;
    style Val1 fill:#ffeb3b;
```

### 2.4 Detalhamento: Fase 3 - Análise Técnica (Responsabilidade: NIT)

```mermaid
flowchart TD
    Start(["Submissão Recebida"]) --> Admin1["Triagem Administrativa"]
    
    Admin1 --> Adm1["Verificar Arquivos Obrigatórios"]
    Admin1 --> Adm2["Verificar Assinaturas"]
    Admin1 --> Adm3["Verificar SisGen"]
    Admin1 --> Adm4["Verificar Prazo 12 Meses"]
    
    Adm1 --> Dec1{Passou na Triagem?}
    Adm2 --> Dec1
    Adm3 --> Dec1
    Adm4 --> Dec1
    
    Dec1 -->|Não| Devol1["Devolução Administrativa"]
    Devol1 --> Email1["Enviar E-mail de Devolução Técnica Sanduíche"]
    Email1 --> Inven1["Inventor Corrige"]
    Inven1 --> Start
    
    Dec1 -->|Sim| NAI["Exame de Viabilidade NAI"]
    
    NAI --> Nai1["Análise de Novidade"]
    NAI --> Nai2["Análise de Atividade Inventiva"]
    NAI --> Nai3["Análise de Aplicação Industrial"]
    
    Nai1 --> Dec2{É Novo?}
    Dec2 -->|Não| Devol2["Devolução por Falta de Novidade"]
    Devol2 --> Email2["E-mail Explicando Falta de Novidade"]
    Email2 --> Inven2["Inventor Decidi: Reformular ou Desistir"]
    Inven2 --> Desist["Desistir"] --> Fim1(["Fim"])
    Inven2 --> Refor["Reformular"] --> Nai1
    
    Dec2 -->|Sim| Nai2
    
    Nai2 --> Dec3{É Não Óbvio?}
    Dec3 -->|Não| Devol3["Devolução por Óbvio"]
    Devol3 --> Email3["E-mail Explicando Falta de Atividade Inventiva"]
    Email3 --> Inven3["Inventor Decidi: Reformular ou Desistir"]
    Inven3 --> Desist1["Desistir"] --> Fim2(["Fim"])
    Inven3 --> Refor1["Reformular"] --> Nai2
    
    Dec3 -->|Sim| Nai3
    
    Nai3 --> Dec4{Tem Aplicação Industrial?}
    Dec4 -->|Não| Devol4["Devolução por Falta de Aplicação Industrial"]
    Devol4 --> Email4["E-mail Explicando Falta de Aplicação Industrial"]
    Email4 --> Inven4["Inventor Decidi: Reformular ou Desistir"]
    Inven4 --> Desist2["Desistir"] --> Fim3(["Fim"])
    Inven4 --> Refor2["Reformular"] --> Nai3
    
    Dec4 -->|Sim| Parecer["Elaborar Parecer Técnico"]
    
    Parecer --> Semaf1["🟢 Verde Aprovado Sem Ressalvas"]
    Parecer --> Semaf2["🟡 Amarelo Aprovado Com Ressalvas"]
    Parecer --> Semaf3["🔴 Vermelho Desfavorável"]
    
    Semaf1 --> Aprov1["Prosseguir para Formalização Fase 4"]
    Semaf2 --> Ress1["Comunicar Ressalvas ao Inventor"]
    Semaf3 --> Desfav["Comunicar Desfavorável ao Inventor"]
    
    Ress1 --> Dec5{Inventor Aceita Ajustes?}
    Dec5 -->|Sim| Ajust1["Inventor Faz Ajustes Menores"]
    Ajust1 --> ValFinal["Reavaliação"]
    ValFinal --> Dec6{Passou?}
    Dec6 -->|Sim| Aprov1
    Dec6 -->|Não| Desfav
    
    Dec5 -->|Não| Desfav
    
    Desfav --> Dec7{Reformular Completo?}
    Dec7 -->|Sim| Refor3["Reformular Completo"] --> Start
    Dec7 -->|Não| Arq["Arquivar"] --> Fim4(["Fim"])
    
    Aprov1 --> FimFase3(["Fase 3 Completa Pronto para Formalização"])
    
    style Start fill:#4CAF50,color:#fff;
    style Fim1 fill:#9C27B0,color:#fff;
    style Fim2 fill:#9C27B0,color:#fff;
    style Fim3 fill:#9C27B0,color:#fff;
    style Fim4 fill:#9C27B0,color:#fff;
    style FimFase3 fill:#9C27B0,color:#fff;
    style Dec1 fill:#ffeb3b;
    style Dec2 fill:#ffeb3b;
    style Dec3 fill:#ffeb3b;
    style Dec4 fill:#ffeb3b;
    style Dec5 fill:#ffeb3b;
    style Dec6 fill:#ffeb3b;
    style Dec7 fill:#ffeb3b;
    style Semaf1 fill:#4CAF50,color:#fff;
    style Semaf2 fill:#FF9800,color:#000;
    style Semaf3 fill:#f44336,color:#fff;
```

### 2.5 Detalhamento: Fase 4 - Formalização (Responsabilidade: NIT + Inventor)

```mermaid
flowchart TD
    Start(["Parecer Técnico Aprovado"]) --> Termos["Kit de Formalização"]
    
    Termos --> TermCess["Termo de Cessão de Direitos"]
    Termos --> DeclInv["Declaração de Inventor"]
    Termos --> DocSisGen["Documentos SisGen se Aplicável"]
    Termos --> Outros["Outros Documentos Exigidos"]
    
    TermCess --> TC1["Definir Instituição Beneficiária"]
    TermCess --> TC2["Definir % de Cessão"]
    TermCess --> TC3["Listar Invenção"]
    TermCess --> TC4["Assinaturas de Todos os Inventores"]
    
    DeclInv --> DI1["Listar Todos os Inventores"]
    DeclInv --> DI2["Definir % de Participação"]
    DeclInv --> DI3["Declaração de Originalidade"]
    DeclInv --> DI4["Assinaturas de Todos"]
    
    DocSisGen --> SG1["Verificar Uso de Biodiversidade"]
    DocSisGen --> SG2["Preencher Registro SisGen"]
    DocSisGen --> SG3["Obter Número de Registro"]
    
    Outros --> Out1["Comitê de Ética se Aplicável"]
    Outros --> Out2["Documentos de Financiamento"]
    Outros --> Out3["Outros Requisitos Específicos"]
    
    TC4 --> Val1{Todos os Documentos Assinados?}
    DI4 --> Val1
    SG3 --> Val1
    Out3 --> Val1
    
    Val1 -->|Não| Assinar["Obter Assinaturas Pendentes"]
    Assinar --> TC4
    Val1 -->|Sim| Digitalizar["Digitalizar Documentos Assinados"]
    
    Digitalizar --> PDF["Converter para PDF"]
    PDF --> Org["Organizar Documentos"]
    
    Org --> Check1["Checklist de Formalização"]
    Check1 --> C1["✓ Termo de Cessão Assinado"]
    Check1 --> C2["✓ Declaração de Inventor Assinada"]
    Check1 --> C3["✓ Documentos SisGen Presentes se Aplicável"]
    Check1 --> C4["✓ Comitê de Ética se Aplicável"]
    Check1 --> C5["✓ Documentos em PDF"]
    
    C1 --> Val2{Checklist Completo?}
    C2 --> Val2
    C3 --> Val2
    C4 --> Val2
    C5 --> Val2
    
    Val2 -->|Não| Comp1["Completar Itens Faltantes"]
    Comp1 --> Check1
    Val2 -->|Sim| AjusteFim["Ajustes Finais no Pedido"]
    
    AjusteFim --> RelDesc["Revisar Relatório Descritivo"]
    AjusteFim --> Reiv["Revisar Reivindicações"]
    AjusteFim --> Resumo1["Revisar Resumo"]
    AjusteFim --> Fig["Revisar Desenhos Figuras"]
    
    RelDesc --> ValTec["Validação Técnica Final"]
    Reiv --> ValTec
    Resumo1 --> ValTec
    Fig --> ValTec
    
    ValTec --> Dec1{Tudo Técnico Correto?}
    Dec1 -->|Não| CorrTec["Corrigir Problemas Técnicos"]
    CorrTec --> AjusteFim
    Dec1 -->|Sim| Conf["Confirmar com Inventor"]
    
    Conf --> Dec2{Inventor Confirma?}
    Dec2 -->|Não| Ajuste2["Inventor Solicita Ajustes"]
    Ajuste2 --> AjusteFim
    Dec2 -->|Sim| FimFase4(["Fase 4 Completa Pronto para Conformidade Final"])
    
    style Start fill:#4CAF50,color:#fff;
    style FimFase4 fill:#9C27B0,color:#fff;
    style Val1 fill:#ffeb3b;
    style Val2 fill:#ffeb3b;
    style Dec1 fill:#ffeb3b;
    style Dec2 fill:#ffeb3b;
```

### 2.6 Detalhamento: Fase 5 - Robustez e Conformidade (Blindagem Final)

```mermaid
flowchart TD
    Start(["Documentos Formalizados"]) --> Robust["Kit de Robustez e Conformidade"]
    
    Robust --> Blind1["Checklist Final de Conformidade"]
    Robust --> Blind2["Validação de Requisitos Formais INPI"]
    Robust --> Blind3["Verificação de Anexos Extras"]
    
    Blind1 --> C1["✓ Suficiência Descritiva Art 24 LPI"]
    Blind1 --> C2["✓ Reivindicações Hierárquicas"]
    Blind1 --> C3["✓ Referências Numéricas Consistentes"]
    Blind1 --> C4["✓ Desenhos em P B sem Cores"]
    Blind1 --> C5["✓ Limite de Reivindicações 3-6 Máx 10"]
    
    Blind2 --> F1["✓ Título Máx 150 Caracteres"]
    Blind2 --> F2["✓ Resumo 50-200 Palavras"]
    Blind2 --> F3["✓ Relatório Descritivo Completo"]
    Blind2 --> F4["✓ Estado da Técnica Claro"]
    Blind2 --> F5["✓ Exemplo de Concretização"]
    
    Blind3 --> E1["✓ Anexo A Busca Anterioridade"]
    Blind3 --> E2["✓ Anexo B Matriz Problema x Solução"]
    Blind3 --> E3["✓ Anexo C Memorial Descritivo"]
    Blind3 --> E4["✓ Anexo F Qualificação Inventores"]
    Blind3 --> E5["✓ Termo de Cessão"]
    Blind3 --> E6["✓ Declaração de Inventor"]
    Blind3 --> E7["✓ SisGen se Aplicável"]
    
    C1 --> Val1{Todos os Checklists Passaram?}
    C2 --> Val1
    C3 --> Val1
    C4 --> Val1
    C5 --> Val1
    F1 --> Val1
    F2 --> Val1
    F3 --> Val1
    F4 --> Val1
    F5 --> Val1
    E1 --> Val1
    E2 --> Val1
    E3 --> Val1
    E4 --> Val1
    E5 --> Val1
    E6 --> Val1
    E7 --> Val1
    
    Val1 -->|Não| Corr1["Corrigir Itens Reprovados"]
    Corr1 --> Blind1
    Val1 -->|Sim| ValJur["Validação Jurídica"]
    
    ValJur --> Jur1["Verificar Suficiência Descritiva"]
    ValJur --> Jur2["Verificar Reivindicações Independent/Dependentes"]
    ValJur --> Jur3["Verificar Não Divulgação Anterior"]
    ValJur --> Jur4["Verificar Ausência de Conteúdo Público"]
    
    Jur1 --> Dec1{Validação Jurídica OK?}
    Jur2 --> Dec1
    Jur3 --> Dec1
    Jur4 --> Dec1
    
    Dec1 -->|Não| AjustJur["Ajustes Jurídicos"]
    AjustJur --> ValJur
    Dec1 -->|Sim| Semaf["Semaforização Final"]
    
    Semaf --> Dec2{Resultado da Validação}
    
    Dec2 -->|🟢 Verde| Deposito["Preparar Protocolo no INPI"]
    Dec2 -->|🟡 Amarelo| AjustMen["Ajustes Menores Requeridos"]
    Dec2 -->|🔴 Vermelho| RevComple["Revisão Completa Necessária"]
    
    AjustMen --> CorrMen["Realizar Ajustes Menores"]
    CorrMen --> Val1
    
    RevComple --> CorrComp["Realizar Revisão Completa"]
    CorrComp --> Robust
    
    Deposito --> Prep1["Preparar Arquivos Finais"]
    Prep1 --> Prep2["Converter para Formato Aceito pelo INPI"]
    Prep2 --> Prep3["Organizar por Ordem do Pedido"]
    
    Prep3 --> VerUlt["Verificação Última Minuto"]
    VerUlt --> V1["✓ Todos os Arquivos Presentes"]
    VerUlt --> V2["✓ Ordem Correta"]
    VerUlt --> V3["✓ Nomes de Arquivos Corretos"]
    VerUlt --> V4["✓ Tamanhos Aceitos"]
    
    V1 --> Dec3{Verificação Final OK?}
    V2 --> Dec3
    V3 --> Dec3
    V4 --> Dec3
    
    Dec3 -->|Não| CorrUlt["Correções de Última Minuto"]
    CorrUlt --> Prep1
    Dec3 -->|Sim| Protocolo["Gerar Protocolo de Depósito"]
    
    Protocolo --> EnvINPI["Enviar para INPI"]
    EnvINPI --> Conf["Receber Confirmação do INPI"]
    
    Conf --> Nume["Receber Número do Pedido"]
    Nume --> Data["Receber Data de Depósito"]
    
    Data --> Invent["Entregar Comprovante ao Inventor"]
    Invent --> Acomp1["Iniciar Acompanhamento do Pedido"]
    
    Acomp1 --> Monitor["Monitorar Prazos"]
    Acomp1 --> Monitor1["Monitorar Publicações"]
    Acomp1 --> Monitor2["Monitorar Exigências"]
    
    Monitor --> FimFase5(["Fase 5 Completa Pedido Depositado Acompanhamento Iniciado"])
    
    style Start fill:#4CAF50,color:#fff;
    style FimFase5 fill:#9C27B0,color:#fff;
    style Val1 fill:#ffeb3b;
    style Dec1 fill:#ffeb3b;
    style Dec2 fill:#ffeb3b;
    style Dec3 fill:#ffeb3b;
    style Deposito fill:#4CAF50,color:#fff;
```

---

## 3. RESUMO DOS FLUXOS

### 3.1 Pontos de Decisão Críticos (Gates)

| Gate | Localização | Critério | Ação se Reprovado |
|------|-------------|----------|-------------------|
| **Gate 1** | Fase 1 → Fase 2 | Anexos completos e corretos | Retornar à Fase 1 |
| **Gate 2** | Submissão (Fase 2) | Validação de caracteres e legal | Devolução para correções |
| **Gate 3** | Análise Técnica (Fase 3) | NAI (Novidade, Atividade Inventiva, Aplicação Industrial) | Devolução ou arquivamento |
| **Gate 4** | Formalização (Fase 4) | Todos os documentos assinados | Obter assinaturas pendentes |
| **Gate 5** | Robustez (Fase 5) | Conformidade completa com INPI | Ajustes finais ou revisão completa |

### 3.2 Responsabilidades por Fase

| Fase | Responsabilidade Principal | Atividade |
|------|----------------------------|-----------|
| **1. Preparação** | Inventor/Pesquisador | Educação, preenchimento de anexos |
| **2. Submissão** | Portão de Entrada | Validação, filtros de qualidade |
| **3. Análise** | NIT/Comissão de Avaliação | Exame NAI, parecer técnico |
| **4. Formalização** | NIT + Inventor | Documentos legais, ajustes finais |
| **5. Robustez** | Garantia de Qualidade | Validação final, protocolo INPI |

### 3.3 Documentos por Fase

| Fase | Documentos | Total |
|------|------------|-------|
| **1. Preparação** | Guias educativos, Anexos A/B/C/F, Templates | 11 |
| **2. Submissão** | Formulários, Checklists, E-mails automáticos | 6 |
| **3. Análise** | Templates de parecer, Guias de avaliação | 10 |
| **4. Formalização** | Manual de operações, Memorandos, Termos | 10 |
| **5. Robustez** | Checklist final, Validação jurídica, Proteção múltipla | 12 |
| **TOTAL** | | 49 documentos |

---

## 4. MÉTRICAS E INDICADORES

### 4.1 Métricas de Tempo

| Etapa | Tempo Alvo | Tempo Atual | Melhoria |
|-------|------------|-------------|----------|
| **Educação Prévia** | 2-4 horas | 1-2 semanas | 85% |
| **Preenchimento de Anexos** | 1-2 dias | 2-4 semanas | 75% |
| **Submissão** | 1 dia | 1-2 semanas | 92% |
| **Primeira Devolutiva** | ≤ 10 dias úteis | 2-4 semanas | 60% |
| **Formalização** | 2-3 dias | 2-3 semanas | 85% |
| **Depósito** | 1-2 dias | 1-2 semanas | 92% |

### 4.2 Métricas de Qualidade

| Indicador | Meta | Baseline | Melhoria |
|-----------|------|----------|----------|
| **Redução de Retrabalho** | > 90% | 0% | 90%+ |
| **Satisfação UX** | > 90% | Desconhecido | Medir |
| **Taxa Aprovação Entrada** | > 70% | ~30% | +133% |
| **Taxa Deferimento INPI** | +20% | Baseline | Medir |
| **Conformidade Formais** | 100% | ~60% | +67% |

---

## 5. CONCLUSÃO

### O Que Eu Depreendo do Projeto:

1. **É um projeto de transformação digital** do processo de patenteamento da UPE
2. **Usa Engenharia de Contexto** para compreender profundamente o ecossistema
3. **Aborda o problema de forma preventiva** (educação antes da escrita)
4. **Implementa filtros de qualidade** em cada gate de decisão
5. **Padroniza tudo** (templates, checklists, exemplos)
6. **Foca em UX** (experiência do inventor intuitiva e amigável)
7. **Mensura tudo** (KPIs claros e alcançáveis)
8. **É escalável** (pode ser replicado em outras instituições)

### Visão de Futuro:

O sistema posicionará o NIT/UPE como **referência nacional** em gestão de propriedade intelectual, com:
- Menos retrabalho para inventores e avaliadores
- Maior qualidade dos pedidos depositados
- Maior taxa de deferimento no INPI
- Mais valor comercial dos ativos tecnológicos
- Maior satisfação dos inventores

---

**Versão:** 1.0
**Data:** 28 de dezembro de 2025
**Autoria:** Sistema Crush - Engenharia de Contexto
**Status:** ✅ DOCUMENTAÇÃO COMPLETA
