# INSTRUÇÕES DE ENGENHARIA DE PROMPT
## Sistema de Gestão de Propriedade Intelectual UPE - Projeto Crush

---

## 1. Estrutura de Prompt para Engenharia de Contexto

### 1.1 Framework CRUSHER

Toda interação com IA deve seguir o framework **CRUSHER**:

```
C - CONTEXT (Contexto)
R - ROLE (Persona/Papel)
U - TASK (Tarefa Específica)
S - STYLE (Estilo/Tom)
H - HIGH-LEVEL OBJECTIVES (Objetivos de Alto Nível)
E - EXAMPLES (Exemplos Práticos)
R - REQUIREMENTS (Requisitos e Restrições)
```

---

## 2. Template Padrão de Prompt

### 2.1 Prompt Mestre para Criação de Documentos

```markdown
# [NOME DO DOCUMENTO - TEMPLATE]

## 1. CONTEXT
[Descrever o contexto específico do documento]
- O que este documento deve resolver?
- Em que etapa do processo de patente ele se encaixa?
- Quem são os usuários finais?

## 2. ROLE
Atue como um [ESPECIALISTA] em [ÁREA TÉCNICA], com profundo conhecimento em:
- Exigências do INPI (Lei 9.279/96)
- Critérios NAI (Novidade, Atividade Inventiva, Aplicação Industrial)
- Experiência em documentação técnica de alta qualidade
- Capacidade de simplificar conceitos complexos

## 3. TASK
Criar um documento de [TIPO] que:
- [Objetivo específico 1]
- [Objetivo específico 2]
- [Objetivo específico 3]

## 4. STYLE
- Linguagem acessível para [PÚBLICO-ALVO] (especialistas/não especialistas)
- Tom profissional e educativo
- Estrutura clara com seções bem definidas
- Exemplos práticos de "Certo" e "Errado"

## 5. HIGH-LEVEL OBJECTIVES
O documento deve:
1. Reduzir o retrabalho em > 90%
2. Garantir satisfação UX > 90%
3. Alinhar-se com KPIs do projeto
4. Ser actionável e executável
5. Incluir gotchas e armadilhas comuns

## 6. EXAMPLES

### Exemplo "Certo" ✅
[Exemplo correto do que o documento deve conter]

### Exemplo "Errado" ❌
[Exemplo incorreto de como não fazer]

## 7. REQUIREMENTS

### Conteúdo Obrigatório:
- [ ] Seção "1. Objetivo"
- [ ] Seção "2. Público-Alvo"
- [ ] Seção "3. Pré-requisitos"
- [ ] Seção "4. Conteúdo Principal"
- [ ] Seção "5. Limites e Restrições"
- [ ] Seção "6. Exemplos Práticos" (Certo/Errado)
- [ ] Seção "7. Pontos de Atenção (Gotchas)"
- [ ] Seção "8. Checklist de Validação"
- [ ] Seção "9. Referências Cruzadas"
- [ ] Seção "10. Versão e Histórico"

### Limites de Caracteres (se aplicável):
- Título: Máx 150 caracteres
- Problema/Dor: 100-1.000 caracteres
- Solução Técnica: 500-4.000 caracteres
- Estado da Técnica: 200-2.000 caracteres
- Vantagens: 100-1.500 caracteres

### Terminologia Obrigatória:
- Use "PI" para Patente de Invenção
- Use "MU" para Modelo de Utilidade
- Use "CII" para Computer Implemented Invention
- Use "RPC" para Registro de Programa de Computador
- Use "NAI" para Novidade, Atividade Inventiva, Aplicação Industrial
- Use "Estado da Técnica" para anterioridade
- Use "Suficiência Descritiva" para capacidade de reprodução

### Semaforização (RAG):
- 🟢 VERDE: Aprovado, pronto para avançar
- 🟡 AMARELO: Com ressalvas, ajustes necessários
- 🔴 VERMELHO: Inviável ou crítico

## 8. OUTPUT FORMAT
Retorne o documento completo em formato Markdown, estruturado e pronto para uso imediato.
```

---

## 3. Prompts Específicos por Tipo de Documento

### 3.1 Prompt para Templates Técnicos (Resumo, Relatório Descritivo, Reivindicações)

```markdown
# CRIAÇÃO DE TEMPLATE TÉCNICO - [NOME]

## 1. CONTEXT
Este template será usado por [PÚBLICO-ALVO] para escrever [TIPO DE DOCUMENTO] de patentes no INPI. O template deve ser suficientemente detalhado para garantir qualidade, mas acessível para não especialistas.

## 2. ROLE
Atue como um Especialista Sênior em Propriedade Intelectual e Redação Técnica, com:
- 10+ anos de experiência em patentes
- Profundo conhecimento de redação técnica INPI
- Capacidade de simplificar conceitos complexos
- Experiência em criação de templates educativos

## 3. TASK
Criar um template de [TIPO] que:
- Guie passo a passo a escrita do documento
- Inclua exemplos de preenchimento
- Especifique claramente o que incluir e excluir
- Respeite os limites de caracteres do INPI
- Inclua gotchas comuns

## 4. STYLE
- Instruções claras e concisas
- Linguagem acessível (evite jargões desnecessários)
- Exemplos práticos concretos
- Estrutura visualmente organizada (listas, tabelas)

## 5. HIGH-LEVEL OBJECTIVES
- Reduzir o tempo de redação em 50%
- Garantir conformidade com requisitos INPI em 100% dos casos
- Eliminar erros comuns de redação
- Aumentar a taxa de deferimento INPI

## 6. EXAMPLES

### Exemplo de Resumo "Certo" ✅
```
RESUMO

A presente invenção refere-se a um método de extração de compostos bioativos a partir de folhas de [PLANTA], caracterizado por compreender as etapas de: a) secagem das folhas a 40-45°C por 120-180 minutos; b) moagem em moinho de facas com peneira de 1-2 mm; c) extração por maceração em etanol 70% na proporção 1:10 (m/v) por 48-72 horas a 20-25°C; d) filtração e concentração sob vácuo a 40-45°C. O método proposto aumenta o rendimento de extração em 25-30% em comparação com métodos tradicionais, reduzindo o tempo de processamento de 72 para 48 horas e o consumo de solvente de 10:1 para 1:10 (m/v). (155 palavras)
```

### Exemplo de Resumo "Errado" ❌
```
RESUMO

Este trabalho apresenta um método inovador e eficiente para extração de compostos bioativos. O método é excelente e otimizado, oferecendo vantagens significativas sobre os métodos atuais. A extração é feita de forma simples e rápida, com resultados superiores. Os compostos obtidos são muito importantes e podem ser usados em diversas aplicações industriais. O método é fácil de implementar e de baixo custo. (73 palavras)

PROBLEMAS:
- ❌ Adjetivos qualitativos ("inovador", "excelente", "otimizado")
- ❌ "Otimizado" sem especificar parâmetros
- ❌ Vago e não técnico
- ❌ Não especifica componentes, etapas, faixas
- ❌ Não menciona rendimentos ou métricas
```

## 7. REQUIREMENTS

### Estrutura Obrigatória:
```markdown
# TEMPLATE [TIPO]

## 1. Objetivo
[O que este documento deve conter]

## 2. Limites e Restrições
[Quantas palavras/caracteres, o que incluir/excluir]

## 3. Estrutura
[Seções obrigatórias em ordem]

## 4. Guia de Preenchimento
[Instruções passo a passo]

## 5. Exemplo Completo Preenchido
[Exemplo de um documento preenchido corretamente]

## 6. Erros Comuns a Evitar
[Lista de gotchas e armadilhas]

## 7. Checklist de Validação
[Verificar antes de considerar completo]
```

### Limites Específicos:
- [INSERIR LIMITES ESPECÍFICOS DO DOCUMENTO]

### Terminologia Obrigatória:
- [LISTAR TERMOS QUE DEVEM SER USADOS]

### Elementos Obrigatórios:
- [LISTAR ELEMENTOS QUE DEVEM ESTAR PRESENTES]

### Elementos Proibidos:
- [LISTAR ELEMENTOS QUE NÃO PODEM ESTAR PRESENTES]

## 8. OUTPUT FORMAT
Retorne o template completo em Markdown, pronto para uso imediato.
```

### 3.2 Prompt para Guias Educativos (Laboratório vs. Patente, Tipos de Patente)

```markdown
# CRIAÇÃO DE GUIA EDUCATIVO - [TÍTULO]

## 1. CONTEXT
Este guia educará [PÚBLICO-ALVO] sobre [TÓPICO], esclarecendo conceitos fundamentais e diferenciações importantes para evitar erros comuns no processo de patenteamento.

## 2. ROLE
Atue como um Educador Especialista em Propriedade Intelectual, com:
- Capacidade de explicar conceitos complexos de forma simples
- Experiência em treinamento de pesquisadores
- Conhecimento profundo de mitos e mal-entendidos comuns
- Habilidade de criar exemplos práticos e memoráveis

## 3. TASK
Criar um guia educativo sobre [TÓPICO] que:
- Explique o conceito de forma clara e acessível
- Diferencie [CONCEITO A] de [CONCEITO B]
- Inclua exemplos práticos de aplicação
- Liste mitos e verdades comuns
- Forneça um checklist rápido de decisão

## 4. STYLE
- Tom educativo e encorajador
- Analogias comuns do dia a dia
- Exemplos visuais e concretos
- Linguagem não técnica quando possível

## 5. HIGH-LEVEL OBJECTIVES
- Reduzir a confusão conceitual em > 90%
- Eliminar submissões incorretas do tipo de patente
- Aumentar a confiança do inventor no processo
- Reduzir o tempo de entendimento em 70%

## 6. EXAMPLES

### Exemplo: Diferenciação Laboratório x Patente
**Laboratório:**
- Foco: Descoberta e publicação
- Público: Comunidade científica
- Linguagem: Técnica e detalhada
- Resultado: Artigo científico

**Patente:**
- Foco: Proteção e comercialização
- Público: Examinador INPI, mercado
- Linguagem: Jurídico-técnica e defensiva
- Resultado: Direito exclusivo de exploração

### Exemplo: Quando Usar Cada Tipo
**PI (Patente de Invenção):**
- "Eu desenvolvi um novo MÉTODO de tratar câncer"
- "Eu criei um novo COMPOSTO químico"
- "Eu inventei um novo ALGORITMO que melhora a segurança de dados"

**MU (Modelo de Utilidade):**
- "Eu melhorei a FORMA de uma ferramenta cirúrgica"
- "Eu modifiquei a estrutura de um dispositivo"
- "Eu adicionei uma funcionalidade nova a um objeto físico"

**RPC (Registro de Programa):**
- "Eu quero proteger o CÓDIGO-FONTE do meu software"
- "Meu software é uma regra de negócio sem efeito técnico"
- "Quero direitos autorais sobre a expressão do software"

**CII (Computer Implemented Invention):**
- "Meu algoritmo melhora a performance do computador em 30%"
- "Meu software reduz o consumo de memória do sistema"
- "Meu algoritmo aumenta a precisão de processamento de sinais"

## 7. REQUIREMENTS

### Estrutura Obrigatória:
```markdown
# GUIA: [TÍTULO]

## 1. O que é?
[Definição clara e simples]

## 2. Para que serve?
[Objetivo e utilidade]

## 3. Quando usar?
[Cenários de aplicação]

## 4. Quando NÃO usar?
[Cenários de não aplicação]

## 5. Diferença entre [A] e [B]
[Comparativo claro]

## 6. Exemplos Práticos
[Casos reais de uso]

## 7. Mitos e Verdades
[Desmistificação de conceitos]

## 8. Checklist Rápido de Decisão
[Fluxograma ou tabela de decisão]

## 9. Referências Adicionais
[Links para documentos relacionados]
```

### Elementos Obrigatórios:
- [ ] Definição clara do conceito
- [ ] Diferenciação com conceitos relacionados
- [ ] Exemplos práticos concretos
- [ ] Lista de mitos e verdades
- [ ] Checklist de decisão

### Terminologia Padrão:
- Usar termos definidos no glossário do AGENTS.md
- Explicar jargões técnicos na primeira menção
- Incluir termos alternativos entre parênteses

## 8. OUTPUT FORMAT
Retorne o guia completo em Markdown, educativo e pronto para uso imediato.
```

### 3.3 Prompt para Checklists de Validação

```markdown
# CRIAÇÃO DE CHECKLIST DE VALIDAÇÃO - [NOME]

## 1. CONTEXT
Este checklist será usado para validar [TIPO DE DOCUMENTO/SUBMISSÃO] antes de avançar para a próxima fase do processo de patenteamento. O objetivo é capturar erros antes que causem retrabalho.

## 2. ROLE
Atue como um Especialista em Controle de Qualidade e Detecção de Erros, com:
- Capacidade de prever pontos de falha comuns
- Conhecimento profundo de requisitos INPI
- Experiência em auditoria de documentos técnicos
- Habilidade de criar checklists efetivos e não burocráticos

## 3. TASK
Criar um checklist de validação para [TIPO] que:
- Liste todos os itens obrigatórios para aprovação
- Priorize itens por criticidade (Crítico/Importante/Opcional)
- Inclua critérios claros de aprovação
- Especifique consequências de falha em cada item
- Seja executável (não teórico)

## 4. STYLE
- Itilos concisos e acionáveis
- Estrutura visual clara (checkboxes, seções)
- Priorização clara (Crítico vs. Importante)
- Consequências especificadas

## 5. HIGH-LEVEL OBJECTIVES
- Reduzir o retrabalho em > 90%
- Garantir que 100% dos itens obrigatórios sejam verificados
- Reduzir o tempo de validação em 70%
- Eliminar indeferimentos por omissão de requisitos

## 6. EXAMPLES

### Exemplo: Checklist de Validação de Submissão
```markdown
# CHECKLIST DE VALIDAÇÃO - SUBMISSÃO DE PATENTE

## SEÇÃO 1: Documentação Obrigatória 🔴 CRÍTICO
- [ ] Anexo A (Busca de Anterioridade) preenchido e assinado
  - **Consequência de falha:** Submissão rejeitada
  - **Como verificar:** Verificar se arquivo existe e tem assinaturas

- [ ] Anexo B (Matriz Problema x Solução) completo
  - **Consequência de falha:** Devolução imediata
  - **Como verificar:** Verificar se problema, soluções existentes e invenção estão descritas

- [ ] Anexo C (Memorial Descritivo) completo
  - **Consequência de falha:** Análise técnica impossível
  - **Como verificar:** Verificar se todas as seções (1-8) estão presentes

## SEÇÃO 2: Validação Técnica 🔴 CRÍTICO
- [ ] Resumo: 50-200 palavras
  - **Consequência de falha:** Indeferimento formal do INPI
  - **Como verificar:** `wc -w resumo.txt` → deve estar entre 50 e 200

- [ ] Reivindicações: 3-6 (máximo 10)
  - **Consequência de falha:** Incompreensão do escopo de proteção
  - **Como verificar:** Contar reivindicações numeradas

- [ ] Desenhos/Figuras: Referências numéricas consistentes
  - **Consequência de falha:** Ambiguidade na descrição
  - **Como verificar:** Verificar se toda numeração no texto existe nas figuras

## SEÇÃO 3: Validação Legal 🟡 IMPORTANTE
- [ ] SisGen preenchido (se usar biodiversidade brasileira)
  - **Consequência de falha:** Indeferimento e sanções legais
  - **Como verificar:** Verificar se número SisGen está declarado

- [ ] Prazo de 12 meses não extrapolado
  - **Consequência de falha:** Invenção entra em domínio público
  - **Como verificar:** Calcular data de primeira divulgação

- [ ] Assinaturas de todos os inventores
  - **Consequência de falha:** Submissão incompleta
  - **Como verificar:** Contar assinaturas vs. lista de inventores

## STATUS FINAL
🟢 APROVADO: Todos os itens CRÍTICOS marcados → Prosseguir
🟡 APROVADO COM RESSALVAS: Falta itens IMPORTANTES → Ajustar antes
🔴 REPROVADO: Falta itens CRÍTICOS → Devolução obrigatória
```

## 7. REQUIREMENTS

### Estrutura Obrigatória:
```markdown
# CHECKLIST DE VALIDAÇÃO - [NOME]

## SEÇÃO [NÚMERO]: [Nome da Seção] [Prioridade: 🔴 Crítico / 🟡 Importante / 🔵 Opcional]

- [ ] Item 1
  - **Consequência de falha:** [O que acontece se este item falhar]
  - **Como verificar:** [Instrução específica de verificação]

- [ ] Item 2
  - **Consequência de falha:** [O que acontece se este item falhar]
  - **Como verificar:** [Instrução específica de verificação]

## STATUS FINAL
[Regras de aprovação baseadas em seções marcadas]
```

### Critérios de Prioridade:
- **🔴 CRÍTICO:** Falha causa rejeição/devolução imediata
- **🟡 IMPORTANTE:** Falha causa problemas mas não impede avanço
- **🔵 OPCIONAL:** Recomendado mas não obrigatório

### Comandos de Validação Automática:
```bash
# Exemplo: Verificar número de palavras no resumo
wc -w resumo.txt

# Exemplo: Verificar se arquivo existe e tem conteúdo
if [ -f arquivo.txt ] && [ -s arquivo.txt ]; then echo "OK"; else echo "FALHA"; fi

# Exemplo: Contar reivindicações
grep -E "^## [0-9]+\." reivindicacoes.txt | wc -l
```

## 8. OUTPUT FORMAT
Retorne o checklist completo em Markdown, priorizado e pronto para uso imediato.
```

---

## 4. Melhores Práticas de Engenharia de Prompt

### 4.1 Regras de Ouro

1. **SEMPRE começar com CONTEXT:**
   - O que estamos tentando resolver?
   - Qual o cenário específico?
   - Quem são os usuários?

2. **DEFINIR ROLE claro:**
   - Quem a IA deve ser?
   - Qual a expertise necessária?
   - Qual a experiência desejada?

3. **TASK específica e mensurável:**
   - O que exatamente deve ser criado?
   - Quais são os objetivos específicos?
   - Como será medido o sucesso?

4. **STYLE consistente:**
   - Qual o tom de voz?
   - Qual o nível de linguagem?
   - Qual a estrutura visual?

5. **HIGH-LEVEL OBJECTIVES claros:**
   - Qual o impacto esperado?
   - Quais KPIs são relevantes?
   - Como isso se conecta ao projeto maior?

6. **EXAMPLES concretos:**
   - Como é o resultado "Certo"?
   - Como NÃO deve ser feito?
   - Exemplos do mundo real

7. **REQUIREMENTS explícitos:**
   - O que é OBRIGATÓRIO?
   - O que é PROIBIDO?
   - Quais são os limites?

### 4.2 Evitar Pitfalls Comuns

❌ **NÃO FAZER:**
- Prompts genéricos ("Escreva um documento sobre patentes")
- Falta de exemplos práticos
- Ignorar público-alvo (criar algo técnico para leigos)
- Esquecer limites de caracteres/palavras
- Não especificar estrutura ou formato
- Ignorar terminologia padrão
- Não incluir gotchas ou armadilhas

✅ **FAZER SEMPRE:**
- Incluir seção CONTEXT com cenário específico
- Definir ROLE com expertise clara
- Especificar TASK com objetivos mensuráveis
- Dar exemplos "Certo" e "Errado"
- Incluir limites e restrições
- Usar terminologia padrão (PI, MU, CII, etc.)
- Semear gotchas e armadilhas comuns
- Incluir checklist de validação

### 4.3 Iteração e Refinamento

**Ciclo de Criação de Prompt:**
1. **Rascunho:** Criar prompt inicial seguindo framework CRUSHER
2. **Teste:** Executar prompt e avaliar resultado
3. **Análise:** Identificar lacunas, inconsistências, problemas
4. **Refinamento:** Ajustar prompt baseado em feedback
5. **Repetir:** Testar novamente até resultado satisfatório

**Critérios de Qualidade do Prompt:**
- O resultado está completo? (todas as seções obrigatórias)
- O resultado está claro? (linguagem acessível)
- O resultado está correto? (informações técnicas precisas)
- O resultado está actionável? (pode ser executado)
- O resultado está alinhado com KPIs? (suporta os objetivos)

---

## 5. Exemplos de Prompts Completo

### 5.1 Prompt Completo para Template de Resumo

```markdown
# TEMPLATE RESUMO - CRIAÇÃO

## 1. CONTEXT
Este template será usado por pesquisadores da UPE para escrever o resumo de patentes de invenção (PI) a serem depositadas no INPI. O resumo é a "vitrine" da tecnologia e deve ser conciso, informativo e tecnicamente preciso. A maioria dos inventores tem dificuldade em escrever resumos que atendam aos requisitos do INPI, resultando em indeferimentos formais.

## 2. ROLE
Atue como um Especialista Sênior em Propriedade Intelectual e Redação Técnica, com:
- 10+ anos de experiência em redação de patentes
- Profundo conhecimento dos requisitos de resumo do INPI
- Capacidade de simplificar conceitos técnicos complexos
- Experiência em treinamento de inventores acadêmicos

## 3. TASK
Criar um template de resumo que:
- Guie passo a passo a escrita do resumo
- Especifique exatamente o que incluir e excluir
- Respeite o limite de 50-200 palavras
- Inclua um exemplo completo preenchido
- Liste erros comuns a evitar

## 4. STYLE
- Instruções claras e concisas
- Linguagem acessível (evite jargões desnecessários)
- Exemplos práticos e concretos
- Estrutura visualmente organizada

## 5. HIGH-LEVEL OBJECTIVES
- Reduzir o tempo de escrita do resumo em 70%
- Garantir conformidade com limites de 50-200 palavras em 100% dos casos
- Eliminar erros comuns de redação
- Aumentar a taxa de deferimento de resumos no INPI

## 6. EXAMPLES

### Exemplo "Certo" ✅
```
RESUMO

A presente invenção refere-se a um método de extração de compostos bioativos a partir de folhas de [PLANTA], caracterizado por compreender as etapas de: a) secagem das folhas a 40-45°C por 120-180 minutos; b) moagem em moinho de facas com peneira de 1-2 mm; c) extração por maceração em etanol 70% na proporção 1:10 (m/v) por 48-72 horas a 20-25°C; d) filtração e concentração sob vácuo a 40-45°C. O método proposto aumenta o rendimento de extração em 25-30% em comparação com métodos tradicionais, reduzindo o tempo de processamento de 72 para 48 horas e o consumo de solvente de 10:1 para 1:10 (m/v). (155 palavras)

VANTAGENS:
✓ Rendimento 25-30% superior
✓ Tempo de processamento 33% menor
✓ Consumo de solvente 90% menor
✓ Temperaturas moderadas (≤45°C) preservam compostos termossensíveis
```

### Exemplo "Errado" ❌
```
RESUMO

Este trabalho apresenta um método inovador e eficiente para extração de compostos bioativos. O método é excelente e otimizado, oferecendo vantagens significativas sobre os métodos atuais. A extração é feita de forma simples e rápida, com resultados superiores. Os compostos obtidos são muito importantes e podem ser usados em diversas aplicações industriais. O método é fácil de implementar e de baixo custo. (73 palavras)

PROBLEMAS:
❌ Adjetivos qualitativos ("inovador", "excelente", "otimizado")
❌ "Otimizado" sem especificar parâmetros
❌ Vago e não técnico
❌ Não especifica componentes, etapas, faixas
❌ Não menciona rendimentos ou métricas
❌ Não descreve a invenção concretamente
```

## 7. REQUIREMENTS

### Estrutura Obrigatória:
```markdown
# TEMPLATE RESUMO

## 1. Objetivo
[O que o resumo deve conter em 1-2 frases]

## 2. Limites e Restrições
- **Palavras:** 50-200 (recomendado: 100-150)
- **Caracteres:** Máximo 2.000
- **O que INCLUIR:** Campo da invenção, descrição da invenção, vantagens
- **O que EXCLUIR:** Reivindicações, referências numéricas, resultados de testes

## 3. Estrutura do Resumo

### 3.1 Abertura (Obrigatória)
"A presente invenção refere-se a..."

### 3.2 Descrição Técnica (Obrigatória)
- O que a invenção faz
- Componentes/elementos principais
- Etapas/parâmetros críticos (com faixas)

### 3.3 Vantagens (Obrigatória)
- Métricas comparativas (quantitativas)
- Benefícios técnicos (não qualitativos)

## 4. Guia de Preenchimento Passo a Passo

### Passo 1: Abertura
Comece com: "A presente invenção refere-se a..."

Exemplos:
- "A presente invenção refere-se a um método de..."
- "A presente invenção refere-se a um dispositivo para..."
- "A presente invenção refere-se a uma composição caracterizada por..."

### Passo 2: Descrever o Que
Liste os componentes/elementos principais

Exemplo:
- "método de extração"
- "compreendendo as etapas de: a)... b)... c)..."
- "à temperatura de 40-45°C"
- "na proporção 1:10 (m/v)"

### Passo 3: Descrever Como Funciona
Descreva as etapas com parâmetros

Exemplo:
- "secagem das folhas a 40-45°C por 120-180 minutos"
- "extração por maceração em etanol 70% na proporção 1:10 (m/v)"

### Passo 4: Descrever Vantagens (Métricas!)
Compare com o estado da técnica

Exemplo:
- "aumenta o rendimento de extração em 25-30%"
- "reduz o tempo de processamento de 72 para 48 horas"
- "reduz o consumo de solvente de 10:1 para 1:10 (m/v)"

## 5. Exemplo Completo Preenchido
[Inserir exemplo "Certo" acima com comentários]

## 6. Erros Comuns a Evitar

❌ **ERRO 1: Adjetivos Qualitativos**
- "excelente", "ótimo", "eficiente", "inovador", "superior"
- ✅ Use métricas: "aumenta em 25%", "reduz em 50%"

❌ **ERRO 2: "Otimizado" sem Especificação**
- "o método é otimizado"
- ✅ Especifique: "otimizado a 40-45°C por 120-180 minutos"

❌ **ERRO 3: Falta de Faixas Numéricas**
- "a 45°C" → ERRADO
- ✅ "a 40-45°C" → CORRETO

❌ **ERRO 4: Vagueza**
- "o método é rápido e eficiente"
- ✅ "o método reduz o tempo de 72 para 48 horas"

❌ **ERRO 5: Não Descrever a Invenção**
- Focar em resultados sem descrever o método
- ✅ Descreva: componentes, etapas, parâmetros

## 7. Checklist de Validação

Antes de considerar o resumo completo, verifique:

- [ ] Começa com "A presente invenção refere-se a..."
- [ ] Descreve concretamente o que a invenção faz
- [ ] Lista componentes/elementos principais
- [ ] Inclui etapas/parâmetros com faixas (ex: 40-45°C)
- [ ] Descreve vantagens com métricas (ex: 25-30%)
- [ ] NÃO usa adjetivos qualitativos
- [ ] NÃO usa "otimizado" sem especificação
- [ ] Contém 50-200 palavras (recomendado: 100-150)
- [ ] É conciso e direto

## 8. Validação Automática

```bash
# Contar palavras
wc -w resumo.txt

# Esperado: entre 50 e 200
# Ideal: entre 100 e 150

# Verificar início
head -1 resumo.txt
# Esperado: "A presente invenção refere-se a..."

# Buscar adjetivos proibidos
grep -i "excelente\|ótimo\|eficiente\|inovador\|superior" resumo.txt
# Esperado: nenhum resultado
```

## 9. Referências Cruzadas
- TEMPLATE_RELATORIO_DESCRITIVO.md → Para detalhamento completo
- GUIA_CERTO_ERRADO.md → Mais exemplos
- ANEXO_C_Memorial_Descritivo.md → Para contexto completo

## 10. Versão e Histórico
| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 28/12/2025 | Crush | Criação inicial |
```

### Elementos Obrigatórios:
- ✅ Abertura: "A presente invenção refere-se a..."
- ✅ Descrição concreta do que faz
- ✅ Componentes/elementos principais
- ✅ Etapas/parâmetros com faixas
- ✅ Vantagens com métricas

### Elementos Proibidos:
- ❌ Adjetivos qualitativos ("excelente", "ótimo", etc.)
- ❌ "Otimizado" sem especificação
- ❌ Números fixos (sempre faixas)
- ❌ Vagueza ou imprecisão

### Limites Específicos:
- **Palavras:** 50-200 (recomendado: 100-150)
- **Caracteres:** Máximo 2.000
- **Tempo estimado de escrita:** 30-45 minutos

## 8. OUTPUT FORMAT
Retorne o template completo em Markdown, pronto para uso imediato.
```

---

## 6. Checklist de Validação de Prompt

Antes de usar um prompt, verifique:

### 6.1 Validação de Estrutura
- [ ] Seção CONTEXT presente e detalhada
- [ ] Seção ROLE presente com expertise clara
- [ ] Seção TASK específica e mensurável
- [ ] Seção STYLE definida (tom, linguagem)
- [ ] Seção HIGH-LEVEL OBJECTIVES com KPIs
- [ ] Seção EXAMPLES com "Certo" e "Errado"
- [ ] Seção REQUIREMENTS completa

### 6.2 Validação de Conteúdo
- [ ] Terminologia padrão usada (PI, MU, CII, RPC, NAI)
- [ ] Limites de caracteres/palavras especificados
- [ ] Elementos OBRIGATÓRIOS listados
- [ ] Elementos PROIBIDOS listados
- [ ] Gotchas identificados
- [ ] Comandos de validação incluídos

### 6.3 Validação de Qualidade
- [ ] Prompt é claro e não ambíguo
- [ ] Exemplos são concretos e aplicáveis
- [ ] Resultado esperado está bem definido
- [ ] Critérios de sucesso são mensuráveis

### 6.4 Validação de Alinhamento
- [ ] Alinhado com KPIs do projeto
- [ ] Suporta redução de retrabalho > 90%
- [ ] Suporta satisfação UX > 90%
- [ ] Referências cruzadas incluídas

---

## 7. Conclusão

Engenharia de prompt eficaz requer:
1. **Compreensão profunda do contexto** (Engenharia de Contexto)
2. **Estrutura clara e sistemática** (Framework CRUSHER)
3. **Exemplos práticos concretos** (Certo/Errado)
4. **Limites e restrições explícitos** (Gotchas)
5. **Validação e iteração contínua** (PDCA)

Seguindo estas instruções, você será capaz de criar prompts consistentes, efetivos e alinhados com os objetivos do Sistema de Gestão de Propriedade Intelectual UPE.

---

**Versão:** 1.0
**Data:** 28 de dezembro de 2025
**Autoria:** Sistema Crush - Engenharia de Contexto
**Status:** ✅ APROVADO PARA USO
