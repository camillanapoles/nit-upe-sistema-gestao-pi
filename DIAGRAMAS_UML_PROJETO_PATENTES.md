# DIAGRAMAS UML - SISTEMA DE GESTÃO DE PROPRIEDADE INTELECTUAL
## Projeto Crush - Universidade de Pernambuco (UPE)

---

## ÍNDICE DE DIAGRAMAS UML

1. **Use Case Diagram** - Visão geral dos atores e casos de uso
2. **Activity Diagram - Fase 1 (Preparação)**
3. **Activity Diagram - Fase 2 (Submissão)**
4. **Activity Diagram - Fase 3 (Análise Técnica)**
5. **Activity Diagram - Fase 4 (Formalização)**
6. **Activity Diagram - Fase 5 (Robustez e Conformidade)**
7. **Sequence Diagram - Fluxo Completo do Processo**
8. **State Machine Diagram - Estados do Pedido de Patente**
9. **Class Diagram - Estrutura de Objetos do Sistema**

---

## 1. USE CASE DIAGRAM - Visão Geral dos Atores e Casos de Uso

```plantuml
@startuml UseCaseDiagram
left to right direction
skinparam packageStyle rectangle

actor "Inventor/Pesquisador" as inventor
actor "Avaliador NIT" as avaliador
actor "Comissão de Avaliação" as comissao
actor "Examinador INPI" as inpi
actor "Sistema de Gestão" as sistema
actor "Designer/Desenvolvedor Web" as designer

rectangle "Sistema de Gestão de Propriedade Intelectual" {
  package "Fase 1: Preparação" {
    usecase "Consultar Guia Laboratório vs. Patente" as uc1
    usecase "Diferenciar Tipos de Patente (PI/MU/CII/RPC)" as uc2
    usecase "Preencher Anexo A - Busca de Anterioridade" as uc3
    usecase "Preencher Anexo B - Matriz Problema x Solução" as uc4
    usecase "Preencher Anexo C - Memorial Descritivo" as uc5
    usecase "Preencher Anexo F - Qualificação de Inventores" as uc6
  }

  package "Fase 2: Submissão" {
    usecase "Preencher Formulário de Patente" as uc7
    usecase "Preencher Formulário de Software CII" as uc8
    usecase "Validar Caracteres dos Campos" as uc9
    usecase "Realizar Checklist de Conferência" as uc10
    usecase "Enviar Submissão ao NIT" as uc11
  }

  package "Fase 3: Análise Técnica" {
    usecase "Realizar Triagem Administrativa" as uc12
    usecase "Examinar NAI (Novidade)" as uc13
    usecase "Examinar NAI (Atividade Inventiva)" as uc14
    usecase "Examinar NAI (Aplicação Industrial)" as uc15
    usecase "Elaborar Parecer Técnico Semaforizado" as uc16
    usecase "Devolver Pedido ao Inventor" as uc17
  }

  package "Fase 4: Formalização" {
    usecase "Elaborar Termo de Cessão" as uc18
    usecase "Elaborar Declaração de Inventor" as uc19
    usecase "Registrar SisGen (se aplicável)" as uc20
    usecase "Revisar Documentação Técnica" as uc21
    usecase "Obter Assinaturas de Todos os Inventores" as uc22
  }

  package "Fase 5: Robustez e Conformidade" {
    usecase "Realizar Checklist Final de Conformidade" as uc23
    usecase "Validar Requisitos Formais do INPI" as uc24
    usecase "Realizar Validação Jurídica" as uc25
    usecase "Preparar Protocolo de Depósito" as uc26
    usecase "Depositar Pedido no INPI" as uc27
  }

  package "Portal e UX" {
    usecase "Criar Kit do Inventor" as uc28
    usecase "Criar Templates de Redação" as uc29
    usecase "Criar Checklists de Validação" as uc30
    usecase "Criar E-mails Automáticos de Feedback" as uc31
  }
}

' Relacionamentos - Inventor
inventor --> uc1
inventor --> uc2
inventor --> uc3
inventor --> uc4
inventor --> uc5
inventor --> uc6
inventor --> uc7
inventor --> uc8
inventor --> uc11
inventor --> uc22

' Relacionamentos - Avaliador NIT
avaliador --> uc12
avaliador --> uc13
avaliador --> uc14
avaliador --> uc15
avaliador --> uc16
avaliador --> uc17
avaliador --> uc18
avaliador --> uc19
avaliador --> uc21
avaliador --> uc23
avaliador --> uc24
avaliador --> uc25
avaliador --> uc26
avaliador --> uc27

' Relacionamentos - Comissão de Avaliação
comissao --> uc16
comissao --> uc17

' Relacionamentos - Examinador INPI
inpi --> uc27

' Relacionamentos - Sistema
sistema --> uc9
sistema --> uc10
sistema --> uc20
sistema --> uc31

' Relacionamentos - Designer/Desenvolvedor
designer --> uc28
designer --> uc29
designer --> uc30

' Extensões e Inclusões
uc7 ..> uc9 : <<include>>
uc8 ..> uc9 : <<include>>
uc11 ..> uc10 : <<include>>
uc16 ..> uc13 : <<include>>
uc16 ..> uc14 : <<include>>
uc16 ..> uc15 : <<include>>
uc23 ..> uc24 : <<include>>
uc23 ..> uc25 : <<include>>

@enduml
```

---

## 2. ACTIVITY DIAGRAM - Fase 1: Preparação (Responsabilidade: Inventor)

```plantuml
@startuml ActivityDiagramFase1
|Inventor/Pesquisador|
start

if (Já divulgou publicamente?) then (Sim)
  :Verificar se está dentro de 12 meses;
  if (Dentro de 12 meses?) then (Não)
    |Inventor/Pesquisador|
    :Invenção entra em Domínio Público;
    stop
  endif
endif

:Educação Prévia;

partition "Compreender Diferenças entre Tipos" {
  :Consultar Guia de Tipos de Patente;
  
  fork
    :PI (Patente de Invenção)\n20 anos;
  fork again
    :MU (Modelo de Utilidade)\n15 anos;
  fork again
    :CII (Software com Efeito Técnico);
  fork again
    :RPC (Registro de Software)\n50 anos;
  end fork
  
  :Selecionar Tipo Apropriado;
}

if (É uma lógica técnica?) then (Sim → PI)
  :Selecionar PI;
elseif (É um objeto físico com nova forma?) then (Sim → MU)
  :Selecionar MU;
elseif (Software melhora hardware?) then (Sim → CII)
  :Selecionar CII;
elseif (Apenas código sem efeito técnico?) then (Sim → RPC)
  :Selecionar RPC;
else
  :Retornar à Seleção;
endif

partition "Compreender Laboratório vs. Patente" {
  fork
    :Laboratório\n• Foco: Descoberta e Publicação\n• Público: Comunidade Científica\n• Linguagem: Técnica Detalhada\n• Resultado: Artigo Científico;
  fork again
    :Patente\n• Foco: Proteção e Comercialização\n• Público: Examinador INPI, Mercado\n• Linguagem: Jurídico-técnica Defensiva\n• Resultado: Direito Exclusivo;
  end fork
}

partition "Preencher Anexos" {
  :Anexo A - Busca de Anterioridade;
  :Realizar Busca em INPI;
  :Buscar em Espacenet;
  :Buscar em Google Patents;
  :Identificar Top 3 Documentos Relevantes;
  :Identificar Lacuna Técnica;
  
  :Anexo B - Matriz Problema x Solução;
  :Definir Problema Claramente;
  :Descrever Solução Proposta;
  :Listar KPIs Comparativos;
  
  :Anexo C - Memorial Descritivo;
  :Preencher Memorial Descritivo;
  :Verificar Prazo 12 Meses;
  
  :Anexo F - Qualificação de Inventores;
  :Listar Qualificação Inventores;
  :Definir % Participação;
  :Registrar SisGen (se necessário);
}

:Validação de Anexos;

if (Anexos Completos e Corretos?) then (Não)
  :Corrigir Anexos;
  repeat
    :Validação de Anexos;
  repeat while (Anexos Completos e Corretos?) is (Não) not (Sim)
endif

:Fase 1 Completa\nPronto para Submissão;

stop

@enduml
```

---

## 3. ACTIVITY DIAGRAM - Fase 2: Submissão (Portão de Entrada)

```plantuml
@startuml ActivityDiagramFase2
|Inventor/Pesquisador|
start

if (Qual Tipo de Patente?) then (PI ou MU)
  :Preencher Formulário de Patente Padrão;
elseif (CII ou RPC)
  :Preencher Formulário de Software CII;
endif

partition "Preencher Campos do Formulário" {
  :Preencher Título\n(Máx 150 caracteres);
  :Preencher Problema/Dor\n(100-1000 caracteres);
  :Preencher Solução Técnica\n(500-4000 caracteres);
  :Preencher Estado da Técnica\n(200-2000 caracteres);
  :Preencher Vantagens\n(100-1500 caracteres);
  :Preencher Palavras-chave\n(50-100 caracteres);
  
  if (Tipo é CII ou RPC) then (Sim)
    :Preencher Fluxograma BPMN;
  endif
}

|Sistema de Gestão|
:Validação de Caracteres;

if (Caracteres Dentro dos Limites?) then (Não)
  |Inventor/Pesquisador|
  :Ajustar Tamanho dos Campos;
  repeat
    |Sistema de Gestão|
    :Validação de Caracteres;
  repeat while (Caracteres Dentro dos Limites?) is (Não) not (Sim)
endif

|Inventor/Pesquisador|
:Checklist de Conferência;

partition "Itens do Checklist" {
  :✓ Anexo A Assinado Presente;
  :✓ Anexo B Completo Presente;
  :✓ Anexo C Memorial Presente;
  :✓ Anexo F Qualificação Presente;
  :✓ Formulário Preenchido;
  :✓ Arquivos em PDF;
}

|Sistema de Gestão|
if (Todos os Itens Presentes?) then (Não)
  |Inventor/Pesquisador|
  :Completar Itens Faltantes;
  repeat
    :Checklist de Conferência;
  repeat while (Todos os Itens Presentes?) is (Não) not (Sim)
endif

|Inventor/Pesquisador|
:Validação Legal;

partition "Itens de Validação Legal" {
  :Verificar Assinaturas Digitais;
  :Verificar SisGen (se aplicável);
  :Verificar Prazo 12 Meses;
}

if (Validação Legal OK?) then (Não)
  :Corrigir Problemas Legais;
  repeat
    :Validação Legal;
  repeat while (Validação Legal OK?) is (Não) not (Sim)
endif

:Enviar para NIT\n(propegi.gerenciatransferetec@upe.br);

|Sistema de Gestão|
:Gerar Protocolo;

if (Protocolo Gerado?) then (Não)
  |Inventor/Pesquisador|
  :Reenviar Submissão;
  repeat
    :Enviar para NIT;
  repeat while (Protocolo Gerado?) is (Não) not (Sim)
endif

|Sistema de Gestão|
:Enviar E-mail de Confirmação Automático;

|Inventor/Pesquisador|
:Fase 2 Completa\nAguardando Análise do NIT;

stop

@enduml
```

---

## 4. ACTIVITY DIAGRAM - Fase 3: Análise Técnica (Responsabilidade: NIT)

```plantuml
@startuml ActivityDiagramFase3
|Avaliador NIT|
start

:Triagem Administrativa;

partition "Itens da Triagem" {
  :Verificar Arquivos Obrigatórios;
  :Verificar Assinaturas;
  :Verificar SisGen;
  :Verificar Prazo 12 Meses;
}

if (Passou na Triagem?) then (Não)
  :Devolução Administrativa;
  :Enviar E-mail de Devolução\n(Técnica Sanduíche);
  
  |Inventor/Pesquisador|
  :Corrigir Problemas Administrativos;
  repeat
    |Avaliador NIT|
    :Triagem Administrativa;
  repeat while (Passou na Triagem?) is (Não) not (Sim)
endif

:Exame de Viabilidade NAI;

partition "Análise de Novidade" {
  :Analisar Busca de Anterioridade;
  :Verificar Existência de Documentos Similares;
}

if (É Novo?) then (Não)
  :Devolução por Falta de Novidade;
  :Enviar E-mail Explicando Falta de Novidade;
  
  |Inventor/Pesquisador|
  if (Reformular?) then (Sim)
    :Reformular Pedido;
    repeat
      |Avaliador NIT|
      :Análise de Novidade;
    repeat while (É Novo?) is (Não) not (Sim)
  else (Não - Desistir)
    :Arquivar Pedido;
    stop
  endif
endif

partition "Análise de Atividade Inventiva" {
  :Verificar se É Óbvio para Técnico no Assunto;
  :Comparar com Estado da Técnica;
}

if (É Não Óbvio?) then (Não)
  :Devolução por Óbvio;
  :Enviar E-mail Explicando Falta de Atividade Inventiva;
  
  |Inventor/Pesquisador|
  if (Reformular?) then (Sim)
    :Reformular Pedido;
    repeat
      |Avaliador NIT|
      :Análise de Atividade Inventiva;
    repeat while (É Não Óbvio?) is (Não) not (Sim)
  else (Não - Desistir)
    :Arquivar Pedido;
    stop
  endif
endif

partition "Análise de Aplicação Industrial" {
  :Verificar Capacidade de Produção;
  :Verificar Viabilidade Comercial;
}

if (Tem Aplicação Industrial?) then (Não)
  :Devolução por Falta de Aplicação Industrial;
  :Enviar E-mail Explicando Falta de Aplicação Industrial;
  
  |Inventor/Pesquisador|
  if (Reformular?) then (Sim)
    :Reformular Pedido;
    repeat
      |Avaliador NIT|
      :Análise de Aplicação Industrial;
    repeat while (Tem Aplicação Industrial?) is (Não) not (Sim)
  else (Não - Desistir)
    :Arquivar Pedido;
    stop
  endif
endif

|Avaliador NIT|
:Elaborar Parecer Técnico Semaforizado;

partition "Semaforização do Parecer" {
  fork
    :🟢 Verde\nAprovado Sem Ressalvas;
  fork again
    :🟡 Amarelo\nAprovado Com Ressalvas;
  fork again
    :🔴 Vermelho\nDesfavorável;
  end fork
}

if (Resultado do Parecer?) then (🟢 Verde)
  :Prosseguir para Formalização (Fase 4);
elseif (🟡 Amarelo)
  :Comunicar Ressalvas ao Inventor;
  
  |Inventor/Pesquisador|
  if (Aceita Ajustes?) then (Sim)
    :Fazer Ajustes Menores;
    |Avaliador NIT|
    :Reavaliação;
    
    if (Passou?) then (Sim)
      :Prosseguir para Formalização (Fase 4);
    else (Não)
      :Devolução Desfavorável;
      |Inventor/Pesquisador|
      if (Reformular?) then (Sim)
        :Reformular Completo;
        |Avaliador NIT|
        :Retornar ao Início do Exame NAI;
      else (Não)
        :Arquivar Pedido;
        stop
      endif
    endif
  else (Não)
    :Devolução Desfavorável;
    |Inventor/Pesquisador|
    :Arquivar Pedido;
    stop
  endif
elseif (🔴 Vermelho)
  :Comunicar Desfavorável ao Inventor;
  
  |Inventor/Pesquisador|
  if (Reformular?) then (Sim)
    :Reformular Completo;
    repeat
      |Avaliador NIT|
      :Retornar ao Início do Exame NAI;
    repeat while (É Novo?) is (Não) not (Sim)
  else (Não)
    :Arquivar Pedido;
    stop
  endif
endif

:Fase 3 Completa\nPronto para Formalização;

stop

@enduml
```

---

## 5. ACTIVITY DIAGRAM - Fase 4: Formalização (Responsabilidade: NIT + Inventor)

```plantuml
@startuml ActivityDiagramFase4
|Avaliador NIT|
start

:Kit de Formalização;

partition "Termo de Cessão de Direitos" {
  :Definir Instituição Beneficiária (UPE);
  :Definir % de Cessão;
  :Listar Invenção;
  :Obter Assinaturas de Todos os Inventores;
}

partition "Declaração de Inventor" {
  :Listar Todos os Inventores;
  :Definir % de Participação;
  :Declaração de Originalidade;
  :Obter Assinaturas de Todos;
}

if (Usa Biodiversidade?) then (Sim)
  |Inventor/Pesquisador|
  :Registrar SisGen;
  :Preencher Registro SisGen;
  :Obter Número de Registro;
else (Não)
  :Documentos SisGen Não Necessários;
endif

partition "Outros Documentos" {
  if (Requer Comitê de Ética?) then (Sim)
    :Obter Aprovação Comitê de Ética;
  endif
  
  if (Teve Financiamento?) then (Sim)
    :Obter Documentos de Financiamento;
  endif
}

|Avaliador NIT|
if (Todos os Documentos Assinados?) then (Não)
  |Inventor/Pesquisador|
  :Obter Assinaturas Pendentes;
  repeat
    |Avaliador NIT|
    :Verificar Assinaturas;
  repeat while (Todos os Documentos Assinados?) is (Não) not (Sim)
endif

|Inventor/Pesquisador|
:Digitalizar Documentos Assinados;
:Converter para PDF;
:Organizar Documentos;

|Avaliador NIT|
:Checklist de Formalização;

partition "Itens do Checklist" {
  :✓ Termo de Cessão Assinado;
  :✓ Declaração de Inventor Assinada;
  :✓ Documentos SisGen Presentes (se aplicável);
  :✓ Comitê de Ética (se aplicável);
  :✓ Documentos em PDF;
}

if (Checklist Completo?) then (Não)
  |Inventor/Pesquisador|
  :Completar Itens Faltantes;
  repeat
    |Avaliador NIT|
    :Checklist de Formalização;
  repeat while (Checklist Completo?) is (Não) not (Sim)
endif

:Ajustes Finais no Pedido;

partition "Revisão da Documentação Técnica" {
  :Revisar Relatório Descritivo;
  :Revisar Reivindicações;
  :Revisar Resumo;
  :Revisar Desenhos/Figuras;
}

|Avaliador NIT|
:Validação Técnica Final;

if (Tudo Técnico Correto?) then (Não)
  |Inventor/Pesquisador|
  :Corrigir Problemas Técnicos;
  repeat
    |Avaliador NIT|
    :Validação Técnica Final;
  repeat while (Tudo Técnico Correto?) is (Não) not (Sim)
endif

|Avaliador NIT|
:Confirmar com Inventor;

|Inventor/Pesquisador|
if (Confirma?) then (Não)
  :Solicitar Ajustes Adicionais;
  repeat
    :Ajustes Finais no Pedido;
  repeat while (Confirma?) is (Não) not (Sim)
endif

:Fase 4 Completa\nPronto para Conformidade Final;

stop

@enduml
```

---

## 6. ACTIVITY DIAGRAM - Fase 5: Robustez e Conformidade (Blindagem Final)

```plantuml
@startuml ActivityDiagramFase5
|Avaliador NIT|
start

:Kit de Robustez e Conformidade;

partition "Checklist Final de Conformidade" {
  :✓ Suficiência Descritiva (Art. 24 LPI);
  :✓ Reivindicações Hierárquicas;
  :✓ Referências Numéricas Consistentes;
  :✓ Desenhos em P&B sem Cores;
  :✓ Limite de Reivindicações (3-6, máx 10);
}

partition "Validação de Requisitos Formais INPI" {
  :✓ Título (Máx 150 Caracteres);
  :✓ Resumo (50-200 Palavras);
  :✓ Relatório Descritivo Completo;
  :✓ Estado da Técnica Claro;
  :✓ Exemplo de Concretização;
}

partition "Verificação de Anexos Extras" {
  :✓ Anexo A (Busca de Anterioridade);
  :✓ Anexo B (Matriz Problema x Solução);
  :✓ Anexo C (Memorial Descritivo);
  :✓ Anexo F (Qualificação de Inventores);
  :✓ Termo de Cessão;
  :✓ Declaração de Inventor;
  :✓ SisGen (se aplicável);
}

if (Todos os Checklists Passaram?) then (Não)
  |Inventor/Pesquisador|
  :Corrigir Itens Reprovados;
  repeat
    |Avaliador NIT|
    :Checklist Final de Conformidade;
  repeat while (Todos os Checklists Passaram?) is (Não) not (Sim)
endif

|Avaliador NIT|
:Validação Jurídica;

partition "Itens de Validação Jurídica" {
  :Verificar Suficiência Descritiva;
  :Verificar Reivindicações (Independente/Dependente);
  :Verificar Não Divulgação Anterior;
  :Verificar Ausência de Conteúdo Público;
}

if (Validação Jurídica OK?) then (Não)
  :Realizar Ajustes Jurídicos;
  repeat
    :Validação Jurídica;
  repeat while (Validação Jurídica OK?) is (Não) not (Sim)
endif

:Semaforização Final;

if (Resultado da Validação?) then (🟢 Verde)
  :Preparar Protocolo no INPI;
elseif (🟡 Amarelo)
  :Ajustes Menores Requeridos;
  |Inventor/Pesquisador|
  :Realizar Ajustes Menores;
  repeat
    |Avaliador NIT|
    :Checklist Final de Conformidade;
  repeat while (🟢 Verde?) is (Não) not (Sim)
elseif (🔴 Vermelho)
  :Revisão Completa Necessária;
  |Inventor/Pesquisador|
  :Realizar Revisão Completa;
  repeat
    |Avaliador NIT|
    :Retornar ao Início da Fase 5;
  repeat while (🟢 Verde?) is (Não) not (Sim)
endif

:Preparar Arquivos Finais;
:Converter para Formato Aceito pelo INPI;
:Organizar por Ordem do Pedido;

:Verificação Última Minuto;

partition "Itens da Verificação" {
  :✓ Todos os Arquivos Presentes;
  :✓ Ordem Correta;
  :✓ Nomes de Arquivos Corretos;
  :✓ Tamanhos Aceitos;
}

if (Verificação Final OK?) then (Não)
  |Inventor/Pesquisador|
  :Correções de Última Minuto;
  repeat
    |Avaliador NIT|
    :Preparar Arquivos Finais;
  repeat while (Verificação Final OK?) is (Não) not (Sim)
endif

|Avaliador NIT|
:Gerar Protocolo de Depósito;

|Examinador INPI|
:Receber Pedido;
:Enviar Confirmação;

|Avaliador NIT|
:Receber Número do Pedido;
:Receber Data de Depósito;

|Inventor/Pesquisador|
:Entregar Comprovante ao Inventor;

|Avaliador NIT|
:Iniciar Acompanhamento do Pedido;

partition "Acompanhamento" {
  :Monitorar Prazos;
  :Monitorar Publicações;
  :Monitorar Exigências;
}

:Fase 5 Completa\nPedido Depositado\nAcompanhamento Iniciado;

stop

@enduml
```

---

## 7. SEQUENCE DIAGRAM - Fluxo Completo do Processo

```plantuml
@startuml SequenceDiagram
actor "Inventor" as inventor
participant "Sistema\nWeb" as sistema
participant "Avaliador\nNIT" as avaliador
participant "Comissão\nAvaliação" as comissao
participant "Examinador\nINPI" as inpi

== Fase 1: Preparação ==
inventor -> sistema : Acessar Kit do Inventor
activate sistema
sistema --> inventor : Apresentar Guias Educativos
inventor -> inventor : Consultar Diferenças entre Tipos
inventor -> inventor : Compreender Laboratório vs. Patente
inventor -> sistema : Preencher Anexos (A, B, C, F)
sistema --> sistema : Validar Preenchimento
sistema --> inventor : Anexos Prontos

== Fase 2: Submissão ==
inventor -> sistema : Preencher Formulário
activate sistema
sistema -> sistema : Validar Caracteres
sistema --> inventor : Feedback de Validação
inventor -> sistema : Enviar Submissão
sistema --> inventor : Gerar Protocolo
sistema -> inventor : E-mail de Confirmação

== Fase 3: Análise Técnica ==
sistema -> avaliador : Notificar Nova Submissão
activate avaliador
avaliador -> avaliador : Triagem Administrativa
alt Passou na Triagem
    avaliador -> avaliador : Exame NAI
    alt NAI Aprovado
        avaliador -> comissao : Solicitar Parecer
        activate comissao
        comissao --> avaliador : Parecer Semaforizado
        deactivate comissao
        alt Parecer Verde
            avaliador --> inventor : Notificar Aprovação
        else Parecer Amarelo
            avaliador --> inventor : Comunicar Ressalvas
            inventor -> sistema : Fazer Ajustes Menores
            sistema -> avaliador : Solicitar Reavaliação
            avaliador --> inventor : Notificar Aprovação Ajustada
        else Parecer Vermelho
            avaliador --> inventor : Notificar Desfavorável
            alt Inventor Aceita Reformular
                inventor -> sistema : Reformular Completo
                sistema -> avaliador : Retornar ao Início
            else Inventor Desiste
                avaliador --> inventor : Arquivar Pedido
            end
        end
    else NAI Reprovado
        avaliador --> inventor : Devolução com Explicação
        alt Inventor Aceita Reformular
            inventor -> sistema : Reformular Pedido
            sistema -> avaliador : Retornar ao Exame NAI
        else Inventor Desiste
            avaliador --> inventor : Arquivar Pedido
        end
    end
else Falhou na Triagem
    avaliador --> inventor : Devolução Administrativa
    inventor -> sistema : Corrigir Problemas
    sistema -> avaliador : Retornar à Triagem
end
deactivate avaliador

== Fase 4: Formalização ==
avaliador -> inventor : Solicitar Documentos Legais
inventor -> inventor : Elaborar Termo de Cessão
inventor -> inventor : Elaborar Declaração de Inventor
inventor -> sistema : Registrar SisGen (se aplicável)
sistema --> inventor : Número SisGen
inventor -> inventor : Obter Assinaturas de Todos
inventor -> avaliador : Enviar Documentos Assinados
avaliador -> avaliador : Validar Documentação
avaliador -> avaliador : Ajustes Finais Técnicos
avaliador -> inventor : Confirmar Aprovação
inventor --> avaliador : Confirmação

== Fase 5: Robustez e Conformidade ==
avaliador -> avaliador : Checklist Final de Conformidade
avaliador -> avaliador : Validação Jurídica
avaliador -> avaliador : Validação de Requisitos Formais INPI
alt Validação Verde
    avaliador -> avaliador : Preparar Protocolo
    avaliador -> inpi : Depositar Pedido
    activate inpi
    inpi --> avaliador : Confirmação de Recebimento
    inpi --> avaliador : Número do Pedido
    inpi --> avaliador : Data de Depósito
    deactivate inpi
    avaliador -> inventor : Entregar Comprovante
    avaliador -> avaliador : Iniciar Acompanhamento
else Validação Amarela
    avaliador -> inventor : Solicitar Ajustes Menores
    inventor -> sistema : Realizar Ajustes
    sistema -> avaliador : Retornar à Validação
else Validação Vermelha
    avaliador -> inventor : Solicitar Revisão Completa
    inventor -> sistema : Realizar Revisão Completa
    sistema -> avaliador : Retornar ao Início da Fase 5
end

== Fim do Processo ==
avaliador -> inventor : Pedido Depositado com Sucesso
inventor --> avaliador : Agradecimento
avaliador --> avaliador : Monitorar Prazos e Publicações

@enduml
```

---

## 8. STATE MACHINE DIAGRAM - Estados do Pedido de Patente

```plantuml
@startuml StateMachineDiagram
[*] --> Rascunho : Criar Pedido

Rascunho --> EmPreenchimento : Iniciar Preenchimento

EmPreenchimento --> Rascunho : Salvar Rascunho
EmPreenchimento --> EmValidacaoLocal : Submeter

EmValidacaoLocal --> EmPreenchimento : Validacao Falhou\n(Corrigir)
EmValidacaoLocal --> AguardandoAnaliseNIT : Validacao OK

AguardandoAnaliseNIT --> EmTriagemAdministrativa : Recebido pelo NIT

EmTriagemAdministrativa --> AguardandoAnaliseNIT : Devolucao Administrativa
EmTriagemAdministrativa --> EmExameNAI : Triagem Aprovada

EmExameNAI --> AguardandoAnaliseNIT : NAI Reprovado\n(Devolucao)
EmExameNAI --> EmAnaliseNovidade : Triagem Aprovada

EmAnaliseNovidade --> AguardandoAnaliseNIT : Falta Novidade\n(Devolucao)
EmAnaliseNovidade --> EmAnaliseAtividadeInventiva : Novidade Confirmada

EmAnaliseAtividadeInventiva --> AguardandoAnaliseNIT : Obvio\n(Devolucao)
EmAnaliseAtividadeInventiva --> EmAnaliseAplicacaoIndustrial : Nao Obvio

EmAnaliseAplicacaoIndustrial --> AguardandoAnaliseNIT : Sem Aplicacao Industrial\n(Devolucao)
EmAnaliseAplicacaoIndustrial --> EmParecer : Aplicacao Industrial OK

EmParecer --> AguardandoAnaliseNIT : Parecer Vermelho\n(Reformular)
EmParecer --> EmRessalvas : Parecer Amarelo
EmParecer --> EmFormalizacao : Parecer Verde

EmRessalvas --> EmFormalizacao : Ajustes Menores Realizados
EmRessalvas --> AguardandoAnaliseNIT : Recusado\n(Desistir)

EmFormalizacao --> AguardandoAnaliseNIT : Documentos Incompletos
EmFormalizacao --> EmValidacaoFinal : Documentos Completos

EmValidacaoFinal --> EmFormalizacao : Validacao Falhou\n(Ajustar)
EmValidacaoFinal --> ProntoDeposito : Validacao Verde
EmValidacaoFinal --> EmAjustesFinais : Validacao Amarela
EmValidacaoFinal --> EmRevisaoCompleta : Validacao Vermelha

EmAjustesFinais --> ProntoDeposito : Ajustes Realizados
EmRevisaoCompleta --> EmValidacaoFinal : Revisao Completa

ProntoDeposito --> DepositadoINPI : Depositar no INPI

DepositadoINPI --> EmExaminacaoINPI : Recebido pelo INPI

EmExaminacaoINPI --> Publicado18Meses : Periodo de Sigilo (18 meses)

Publicado18Meses --> EmExigenciaINPI : Exigencia do Examinador
Publicado18Meses --> EmConcessao : Sem Exigencias

EmExigenciaINPI --> EmConcessao : Exigencias Respondidas e Aprovadas
EmExigenciaINPI --> IndeferidoINPI : Exigencias Reprovadas

EmConcessao --> Concedido : Pagamento de GRU
EmConcessao --> Arquivado : Não Pago

IndeferidoINPI --> Arquivado : Arquivamento
Arquivado --> [*] : Fim do Processo

Concedido --> Vigente : Publicação da Patente
Vigente --> Expirado : 20 Anos (PI) ou 15 Anos (MU)
Expirado --> [*] : Dominio Publico

note right of EmExameNAI
  NAI = Novidade,
  Atividade Inventiva,
  Aplicacao Industrial
end note

note right of EmParecer
  Semaforizacao:
  Verde = Aprovado
  Amarelo = Com Ressalvas
  Vermelho = Desfavoravel
end note

@enduml
```

---

## 9. CLASS DIAGRAM - Estrutura de Objetos do Sistema

```plantuml
@startuml ClassDiagram

' Pacote de Entidades
package "Entidades" {
  class PedidoPatente {
    - String numeroPedido
    - Date dataCriacao
    - Date dataDeposito
    - String estadoAtual
    - TipoPatente tipo
    + void criar()
    + void submeter()
    + void atualizarEstado()
    + boolean isValido()
  }

  class Anexo {
    - String tipo
    - File arquivo
    - boolean assinado
    + void assinar()
    + boolean isAssinado()
    + void validar()
  }

  class DocumentoLegal {
    - String tipo
    - String conteudo
    - Date dataAssinatura
    + void assinar()
    + boolean isAssinado()
  }

  class Inventor {
    - String nome
    - String email
    - String cpf
    - float participacao
    - String qualificacao
    + void assinar()
    + void definirParticipacao()
  }
}

' Pacote de Tipos
package "Tipos de Patente" {
  abstract class TipoPatente <<enumeration>> {
    PI
    MU
    CII
    RPC
  }

  class PatenteInvencao {
    + int validadeAnos = 20
    + String[] categoriasReivindicacao
    + boolean requiresEfeitoTecnico()
  }

  class ModeloUtilidade {
    + int validadeAnos = 15
    + boolean appliesToProcessos() = false
    + boolean appliesToSoftware() = false
  }

  class ComputerImplementedInvention {
    + boolean requiresHardwareReference()
    + boolean requiresTriplaReivindicacao()
    + boolean requiresFluxogramaBPMN()
  }

  class RegistroProgramaComputador {
    + int validadeAnos = 50
    + boolean protectsCodigoFonte()
    + boolean notProtectsLogica()
  }
}

' Pacote de Validação
package "Validacao" {
  class ValidadorCaracteres {
    + boolean validarTitulo(String titulo)
    + boolean validarProblema(String problema)
    + boolean validarSolucao(String solucao)
    + boolean validarEstadoTecnica(String estado)
    + boolean validarVantagens(String vantagens)
  }

  class ValidadorNAI {
    + boolean validarNovidade(AnexoA anexoA)
    + boolean validarAtividadeInventiva(AnexoC anexoC)
    + boolean validarAplicacaoIndustrial(AnexoC anexoC)
  }

  class ValidadorJuridico {
    + boolean validarSuficienciaDescritiva(String relatorio)
    + boolean validarReivindicacoes(String[] reivindicacoes)
    + boolean validarPrioridade(String dataDivulgacao)
  }

  class Semaforizacao {
    - String resultado
    - String[] observacoes
    + void semaforizar(Parecer parecer)
    + String getResultado()
    + String[] getObservacoes()
  }
}

' Pacote de Processamento
package "Processamento" {
  class Avaliador {
    - String nome
    - String especialidade
    + void triagemAdministrativa(PedidoPatente pedido)
    + Parecer analisarNAI(PedidoPatente pedido)
    + void validarFormalizacao(PedidoPatente pedido)
    + void realizarChecklistFinal(PedidoPatente pedido)
  }

  class ComissaoAvaliacao {
    - List<Avaliador> membros
    - Parecer parecerConsolidado
    + void deliberar(PedidoPatente pedido)
    + Parecer emitirParecerSemaforizado()
  }

  class SistemaGestao {
    - ValidadorCaracteres validadorCaracteres
    - ValidadorNAI validadorNAI
    - ValidadorJuridico validadorJuridico
    - Semaforizacao semaforizacao
    + void receberSubmissao(PedidoPatente pedido)
    + void processarPedido(PedidoPatente pedido)
    + void gerarProtocolo(PedidoPatente pedido)
  }
}

' Pacote de INPI
package "INPI" {
  class ExaminadorINPI {
    + void receberPedido(PedidoPatente pedido)
    + void examinarPedido(PedidoPatente pedido)
    + void emitirExigencia(Exigencia exigencia)
    + void concederPatente(PedidoPatente pedido)
    + void indeferirPatente(PedidoPatente pedido)
  }

  class Exigencia {
    - String descricao
    - Date prazoResposta
    - Estado estado
    + void responder()
  }

  class NumeroPedido {
    - String numero
    - Date dataDeposito
    + String getFormatado()
  }
}

' Relacionamentos
PedidoPatente "1" -- "*" Anexo : possui
PedidoPatente "1" -- "*" DocumentoLegal : requer
PedidoPatente "1" -- "*" Inventor : tem
PedidoPatente "1" *-- "1" TipoPatente : é do tipo
PatenteInvencao --|> TipoPatente
ModeloUtilidade --|> TipoPatente
ComputerImplementedInvention --|> TipoPatente
RegistroProgramaComputador --|> TipoPatente

SistemaGestao "1" --> "1" ValidadorCaracteres : usa
SistemaGestao "1" --> "1" ValidadorNAI : usa
SistemaGestao "1" --> "1" ValidadorJuridico : usa
SistemaGestao "1" --> "1" Semaforizacao : usa

Avaliador "1" ..> "1" SistemaGestao : opera
ComissaoAvaliacao "1" *-- "*" Avaliador : composta por
ComissaoAvaliacao "1" --> "1" Semaforizacao : emite
ExaminadorINPI "1" --> "1" NumeroPedido : gera
ExaminadorINPI "1" o-- "*" Exigencia : emite

' Relacionamento de uso
PedidoPatente ..> ValidadorCaracteres : é validado por
PedidoPatente ..> ValidadorNAI : é analisado por
PedidoPatente ..> ValidadorJuridico : é validado juridicamente por

@enduml
```

---

## 10. DIAGRAMA DE COMPONENTES - Arquitetura do Sistema

```plantuml
@startuml ComponentDiagram

package "Portal Web" {
  [Kit do Inventor] as kitInventor
  [Formulários Digitais] as formularios
  [Templates de Redação] as templates
  [Checklists de Validação] as checklists
}

package "Sistema de Gestão (Backend)" {
  [Módulo de Validação] as validacao
  [Módulo de Análise NAI] as analiseNAI
  [Módulo de Processamento] as processamento
  [Módulo de Documentação] as documentacao
}

package "NIT (Front Office)" {
  [Interface do Avaliador] as interfaceAvaliador
  [Sistema de Pareceres] as sistemaPareceres
}

package "Comissão de Avaliação" {
  [Sistema de Deliberação] as sistemaDeliberacao
}

package "Integrações Externas" {
  [SisGen] as sisGen
  [INPI - Sistema e-INPI] as inpi
  [Email Service] as emailService
}

package "Banco de Dados" {
  database [DB_Pedidos] as dbPedidos
  database [DB_Documentos] as dbDocumentos
  database [DB_Inventores] as dbInventores
  database [DB_Usuarios] as dbUsuarios
}

package "Arquivos de Documentação" {
  file [PDFs de Templates] as pdfTemplates
  file [Documentos Legais] as docsLegais
  file [Checklists PDF] as pdfChecklists
}

' Relacionamentos entre Componentes
kitInventor --> formularios : usa
kitInventor --> templates : acessa
kitInventor --> checklists : consulta

formularios --> validacao : envia dados
validacao --> dbPedidos : grava
validacao --> dbDocumentos : grava

processamento --> analiseNAI : solicita análise
analiseNAI --> dbPedidos : consulta
analiseNAI --> dbDocumentos : consulta

interfaceAvaliador --> processamento : acessa
interfaceAvaliador --> sistemaPareceres : usa
sistemaPareceres --> sistemaDeliberacao : envia parecer
sistemaDeliberacao --> sistemaPareceres : retorna decisão

documentacao --> pdfTemplates : gerencia
documentacao --> docsLegais : gerencia
documentacao --> pdfChecklists : gerencia

sisGen --> validacao : valida registro
emailService --> processamento : envia notificações
inpi --> processamento : sincroniza pedido

' Conexões com Banco de Dados
processamento --> dbPedidos : lê/escreve
processamento --> dbDocumentos : lê/escreve
processamento --> dbInventores : lê/escreve
processamento --> dbUsuarios : lê/escreve
validacao --> dbPedidos : lê
validacao --> dbDocumentos : lê
analiseNAI --> dbPedidos : lê
analiseNAI --> dbDocumentos : lê

' Atores e Interfaces
actor "Inventor/Pesquisador" as inventor
actor "Avaliador NIT" as avaliador
actor "Comissão de Avaliação" as comissao
actor "Examinador INPI" as inpiActor

inventor --> kitInventor : acessa
inventor --> formularios : preenche
inventor --> emailService : recebe emails

avaliador --> interfaceAvaliador : acessa
avaliador --> processamento : opera
avaliador --> emailService : recebe emails

comissao --> sistemaDeliberacao : acessa
comissao --> emailService : recebe emails

inpiActor --> inpi : acessa
inpi --> processamento : notifica

@enduml
```

---

## 11. DEPLOYMENT DIAGRAM - Arquitetura de Deploy

```plantuml
@startuml DeploymentDiagram

node "Navegador Web\n(Inventor)" {
  component "Portal Kit do Inventor" as portalInventor
}

node "Servidor Web\n(HTTPS)" {
  component "Apache/Nginx" as webServer
  component "Aplicação Web\n(React/Vue)" as appWeb
}

node "Servidor de Aplicação\n(UPE Data Center)" {
  component "API Backend\n(Java/Spring)" as apiBackend
  component "Motor de Validação" as motorValidacao
  component "Motor de Análise NAI" as motorNAI
  component "Motor de Documentação" as motorDoc
}

node "Servidor de Banco de Dados\n(UPE Data Center)" {
  database "PostgreSQL" as dbPostgres
}

node "Servidor de Arquivos\n(UPE Data Center)" {
  component "Sistema de Arquivos\n(NFS/S3)" as fileSystem
}

node "Servidor de Email\n(Servidor SMTP)" {
  component "Postfix/Sendmail" as smtpServer
}

cloud "SisGen\n(Governo Federal)" as sisGenCloud
cloud "INPI e-INPI\n(Governo Federal)" as inpiCloud

' Conexões
portalInventor --> webServer : HTTPS
webServer --> appWeb : HTTP

appWeb --> apiBackend : REST API
apiBackend --> motorValidacao : invoca
apiBackend --> motorNAI : invoca
apiBackend --> motorDoc : invoca

motorValidacao --> dbPostgres : JDBC
motorNAI --> dbPostgres : JDBC
motorDoc --> dbPostgres : JDBC
motorDoc --> fileSystem : NFS

apiBackend --> smtpServer : SMTP
smtpServer --> portalInventor : Email

apiBackend --> sisGenCloud : HTTPS
apiBackend --> inpiCloud : HTTPS

' Atores
actor "Inventor" as inventor
actor "Avaliador" as avaliador
actor "Comissão" as comissao

inventor --> portalInventor : Acessa
avaliador --> apiBackend : Acessa
comissao --> apiBackend : Acessa

@enduml
```

---

## 12. DIAGRAMA DE PACOTES - Organização do Código

```plantuml
@startuml PackageDiagram

package br.upe.nit.pi {
  
  package "modelo" {
    class PedidoPatente
    class Anexo
    class DocumentoLegal
    class Inventor
    class Parecer
    class Exigencia
  }
  
  package "tipos" {
    enum TipoPatente {
      PI
      MU
      CII
      RPC
    }
    class PatenteInvencao
    class ModeloUtilidade
    class ComputerImplementedInvention
    class RegistroProgramaComputador
  }
  
  package "validacao" {
    class ValidadorCaracteres
    class ValidadorNAI
    class ValidadorJuridico
    class ValidadorFormulario
    interface Validador
  }
  
  package "servico" {
    class ServicoValidacao
    class ServicoAnalise
    class ServicoFormalizacao
    class ServicoDeposito
    class ServicoEmail
    class ServicoSisGen
  }
  
  package "controle" {
    class ControladorInventor
    class ControladorAvaliador
    class ControladorComissao
    class ControladorAdmin
  }
  
  package "repositorio" {
    interface RepositorioPedido
    interface RepositorioInventor
    interface RepositorioDocumento
    class RepositorioPedidoJPA
    class RepositorioInventorJPA
    class RepositorioDocumentoJPA
  }
  
  package "integracao" {
    class IntegracaoSisGen
    class IntegracaoINPI
    class IntegracaoEmail
  }
  
  package "util" {
    class Semaforizacao
    class ValidadorPDF
    class GeradorProtocolo
    class UtilsData
  }
  
  package "excecao" {
    class ExcecaoValidacao
    class ExcecaoNAI
    class ExcecaoJuridica
    class ExcecaoIntegracao
  }
}

' Relacionamentos
Validador <|.. ValidadorCaracteres
Validador <|.. ValidadorNAI
Validador <|.. ValidadorJuridico
Validador <|.. ValidadorFormulario

RepositorioPedido <|.. RepositorioPedidoJPA
RepositorioInventor <|.. RepositorioInventorJPA
RepositorioDocumento <|.. RepositorioDocumentoJPA

ServicoValidacao --> ValidadorCaracteres : usa
ServicoValidacao --> ValidadorFormulario : usa
ServicoAnalise --> ValidadorNAI : usa
ServicoAnalise --> ValidadorJuridico : usa

ControladorInventor --> ServicoValidacao : usa
ControladorInventor --> ServicoAnalise : usa
ControladorAvaliador --> ServicoAnalise : usa
ControladorAvaliador --> ServicoFormalizacao : usa
ControladorComissao --> ServicoAnalise : usa
ControladorAdmin --> ServicoDeposito : usa

ServicoDeposito --> IntegracaoINPI : usa
ServicoSisGen --> IntegracaoSisGen : usa
ServicoEmail --> IntegracaoEmail : usa

ServicoEmail --> Semaforizacao : usa

@enduml
```

---

## RESUMO DOS DIAGRAMAS UML CRIADOS

### Tabela de Correspondência Diagrama x Objetivo

| # | Tipo de Diagrama UML | Objetivo | Elementos Principais |
|---|---------------------|----------|---------------------|
| 1 | **Use Case Diagram** | Visão geral dos atores e casos de uso | Inventor, Avaliador, Comissão, Examinador INPI |
| 2 | **Activity Diagram - Fase 1** | Fluxo de atividades da preparação | Inventor, Anexos A/B/C/F, Validações |
| 3 | **Activity Diagram - Fase 2** | Fluxo de submissão com validações | Formulários, Validação de caracteres, Checklist |
| 4 | **Activity Diagram - Fase 3** | Análise técnica com semaforização | NAI, Parecer (Verde/Amarelo/Vermelho) |
| 5 | **Activity Diagram - Fase 4** | Formalização jurídica | Termos de cessão, Assinaturas, Documentos legais |
| 6 | **Activity Diagram - Fase 5** | Blindagem final e conformidade | Checklists, Validação jurídica, Depósito |
| 7 | **Sequence Diagram** | Interação temporal entre objetos | Comunicação entre atores através do tempo |
| 8 | **State Machine Diagram** | Estados do pedido de patente | Transições de estados do rascunho à concessão |
| 9 | **Class Diagram** | Estrutura de classes e objetos | Entidades, tipos, validadores, processadores |
| 10 | **Component Diagram** | Arquitetura do sistema | Portal, Backend, NIT, Integrações |
| 11 | **Deployment Diagram** | Arquitetura de deploy | Servidores, bancos de dados, serviços |
| 12 | **Package Diagram** | Organização do código | Pacotes do sistema (modelo, serviço, controle) |

---

## CONVENÇÕES UML UTILIZADAS

### Atores (Personas)
- 🔵 **Inventor/Pesquisador** - Responsável pela Fase 1 e 2
- 🟠 **Avaliador NIT** - Responsável pela Fase 3, 4 e 5
- 🟣 **Comissão de Avaliação** - Aprova/rejeita pedidos
- 🔴 **Examinador INPI** - Examinador externo

### Objetos Principais
- **PedidoPatente** - Objeto principal do sistema
- **Anexo** - Anexos A, B, C, F
- **DocumentoLegal** - Termos de cessão, declarações
- **Inventor** - Pessoa física criadora da invenção
- **Parecer** - Parecer técnico semaforizado
- **Validador** - Componentes de validação

### Ações Principais
- `criar()` - Criar novo pedido
- `submeter()` - Submeter para análise
- `validar()` - Validar documento/campo
- `analisar()` - Analisar NAI
- `assinar()` - Assinar documento
- `depositar()` - Depositar no INPI

### Estados do Pedido
- **Rascunho** - Pedido criado
- **Em Validação** - Em validação local
- **Em Análise** - Em análise pelo NIT
- **Em Formalização** - Em formalização jurídica
- **Pronto Depósito** - Pronto para depósito INPI
- **Depositado** - Depositado no INPI
- **Vigente** - Patente concedida

---

**Versão:** 1.0
**Data:** 28 de dezembro de 2025
**Autoria:** Sistema Crush - Engenharia de Contexto
**Status:** ✅ 12 DIAGRAMAS UML COMPLETOS
