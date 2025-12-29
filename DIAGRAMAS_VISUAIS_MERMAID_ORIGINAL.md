# DIAGRAMAS VISUAIS MERMAID
## Mermaid v11.6 - Visual Flowcharts

---

## 1. USE CASE DIAGRAM

```mermaid
flowchart TD
    %% Definição de Atores (IDs explícitos)
    inv["🔵 Inventor"]
    aval["🟠 Avaliador"]
    comi["🟣 Comissão"]
    INPI["🔴 Examinador"]

    %% Definição de Casos de Uso
    UC1["Consultar Guias"]
    UC2["Diferenciar Tipos"]
    UC3["Preencher Anexos"]
    UC4["Validar Formulário"]
    UC5["Enviar Submissão"]

    inv --> UC1
    inv --> UC2
    inv --> UC3
    inv --> UC4
    inv --> UC6["Assinar"]
    
    aval --> UC5
    aval --> UC6

    style inv fill:#2196F3,color:#fff
    style aval fill:#FF9800,color:#000
    style comi fill:#9C27B0,color:#fff
    style INPI fill:#f44336,color:#fff
```

---

## 2. ACTIVITY DIAGRAM - FASE 1

```mermaid
flowchart TD
    Educacao["Educação Prévia"]
    Tipos["Diferenciar Tipos"]
    Anexos["Preencher Anexos"]

    Educacao --> Tipos
    Tipos --> Anexos

    style Educacao fill:#E3F2FD,stroke:#2196F3,stroke-width:2px
    style Tipos fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
    style Anexos fill:#F3E5F5,stroke:#9C27B0,stroke-width:2px
```

---

## 3. SEQUENCE DIAGRAM

```mermaid
sequenceDiagram
    actor Inv
    participant Sys
    participant Aval

    Inv->>Sys: Submeter Pedido
    Sys->>Aval: Notificar
    Aval->>Inv: Devolução (se falha)
```

---

## 4. STATE DIAGRAM

```mermaid
stateDiagram-v2
    [*] --> Rascunho
    Rascunho --> EmValidacao
    EmValidacao --> Rascunho : Erro
    EmValidacao --> [*] : OK
```

---

## 5. FLOWCHART MACRO (PROCESSO COMPLETO)

```mermaid
flowchart LR
    subgraph Inicio["🚀 INÍCIO"]
        Start(["Inventor com Ideia"])
    end
    
    subgraph Fase1["📚 FASE 1: PREPARAÇÃO"]
        F1_Educacao["Educação Prévia"]
        F1_Tipos["Diferenciar Tipos"]
        F1_Anexos["Preencher Anexos"]
    end
    
    subgraph Fase2["📝 FASE 2: SUBMISSÃO"]
        F2_Form["Preencher Formulário"]
        F2_Valid["Validação"]
        F2_Enviar["Enviar NIT"]
    end
    
    subgraph Fase3["🔬 FASE 3: ANÁLISE"]
        F3_Triagem["Triagem Admin"]
        F3_NAI["Exame NAI"]
        F3_Parecer["Parecer"]
    end
    
    subgraph Fase4["📄 FASE 4: FORMALIZAÇÃO"]
        F4_Docs["Documentos Legais"]
        F4_Assin["Assinaturas"]
        F4_Rev["Revisão Final"]
    end
    
    subgraph Fase5["✅ FASE 5: ROBUSTEZ"]
        F5_Check["Checklist Final"]
        F5_Dep["Depositar INPI"]
    end
    
    subgraph Fim["🏁 FIM"]
        Fim1(["Patente Depositada"])
    end
    
    Start --> F1_Educacao
    F1_Educacao --> F1_Tipos
    F1_Tipos --> F1_Anexos
    F1_Anexos --> F2_Form
    
    F2_Form --> F2_Valid
    F2_Valid -->|OK| F2_Enviar
    F2_Valid -->|Falha| F2_Form
    
    F2_Enviar --> F3_Triagem
    F3_Triagem -->|Aprovado| F3_NAI
    F3_Triagem -->|Reprovado| F1_Anexos
    
    F3_NAI -->|Aprovado| F3_Parecer
    F3_NAI -->|Reprovado| F1_Anexos
    
    F3_Parecer -->|Verde| F4_Docs
    F3_Parecer -->|Amarelo| F4_Docs
    F3_Parecer -->|Vermelho| F1_Anexos
    
    F4_Docs --> F4_Assin
    F4_Assin --> F4_Rev
    F4_Rev --> F5_Check
    
    F5_Check -->|OK| F5_Dep
    F5_Check -->|Falha| F4_Rev
    
    F5_Dep --> Fim1
    
    style Start fill:#4CAF50,color:#fff
    style Fim1 fill:#9C27B0,color:#fff
    style Fase1 fill:#E3F2FD
    style Fase2 fill:#FFF3E0
    style Fase3 fill:#F3E5F5
    style Fase4 fill:#E8F5E9
    style Fase5 fill:#FFEBEE
```

---

## 6. DIAGRAMA DE ARQUITETURA (VERSÃO CORRIGIDA - Diagrama 7)

```mermaid
flowchart TB
    subgraph Clientes["👥 CLIENTES"]
        Browser1["🔵 Inventor - Navegador"]
        Browser2["🟠 Avaliador - Navegador"]
    end
    
    subgraph Frontend["🎨 FRONTEND"]
        Portal["Portal Kit Inventor"]
        Dashboard["Dashboard Avaliador"]
    end
    
    subgraph Backend["⚙️ BACKEND"]
        API["API REST - Spring Boot"]
        Valid["Validador"]
        Analise["Analisador NAI"]
        Docs["Gerador Docs"]
    end
    
    subgraph Database["💾 BANCO DE DADOS"]
        DB1[(PostgreSQL)]
        Files[(Sistema Arquivos)]
    end
    
    subgraph Externos["☁️ SISTEMAS EXTERNOS"]
        SisGen["SisGen"]
        INPI_Serv["INPI"]
        EmailServ["SMTP - Email"]
    end
    
    Browser1 -->|HTTPS| Portal
    Browser2 -->|HTTPS| Dashboard
    
    Portal -->|REST API| API
    Dashboard -->|REST API| API
    
    API --> Valid
    API --> Analise
    API --> Docs
    
    Valid --> DB1
    Analise --> DB1
    Docs --> DB1
    Docs --> Files
    
    API --> SisGen
    API --> INPI_Serv
    API --> EmailServ
    
    EmailServ --> Browser1
    
    style Browser1 fill:#2196F3,color:#fff
    style Browser2 fill:#FF9800,color:#000
    style Frontend fill:#E3F2FD
    style Backend fill:#FFF3E0
    style Database fill:#E8F5E9
    style Externos fill:#F3E5F5
```

---

## 7. DIAGRAMA DE DADOS (ER)

```mermaid
erDiagram
    PEDIDO_PATENTE ||--o{ ANEXO : possui
    PEDIDO_PATENTE ||--o{ DOCUMENTO_LEGAL : requer
    PEDIDO_PATENTE ||--o{ INVENTOR : tem
    PEDIDO_PATENTE ||--|| TIPO_PATENTE : é do tipo
    PEDIDO_PATENTE ||--o{ PARECER : recebe
    PEDIDO_PATENTE ||--o{ EXIGENCIA : possui
    
    PEDIDO_PATENTE {
        string numero_pedido PK
        date data_criacao
        string estado_atual
        string titulo
    }
    
    ANEXO {
        string tipo PK
        file arquivo
        boolean assinado
    }
    
    DOCUMENTO_LEGAL {
        string tipo PK
        string conteudo
        date data_assinatura
    }
    
    INVENTOR {
        string cpf PK
        string nome
        string email
        float participacao
    }
    
    TIPO_PATENTE {
        string tipo PK
        int validade_anos
    }
    
    PARECER {
        string resultado PK
        string[] observacoes
        date data_parecer
    }
    
    EXIGENCIA {
        string numero PK
        string descricao
        date prazo_resposta
        string estado
    }
```

---

## 8. DIAGRAMA DE CRONOGRAMA (GANTT - CORRIGIDO)

```mermaid
gantt
    title Cronograma do Processo de Patenteamento (KPIs Alvo)
    dateFormat  YYYY-MM-DD
    
    section Fase 1
    Educação Prévia          :f1-1, 2025-01-01, 3d
    Preencher Anexos         :f1-2, after f1-1, 5d
    
    section Fase 2
    Preencher Formulário     :f2-1, after f1-2, 1d
    Validação                :f2-2, after f2-1, 1d
    Enviar NIT               :f2-3, after f2-2, 1d
    
    section Fase 3
    Triagem Admin            :f3-1, after f2-3, 2d
    Exame NAI                :f3-2, after f3-1, 5d
    Parecer Comissão         :f3-3, after f3-2, 3d
    
    section Fase 4
    Documentos Legais        :f4-1, after f3-3, 2d
    Assinaturas              :f4-2, after f4-1, 3d
    Revisão Final            :f4-3, after f4-2, 2d
    
    section Fase 5
    Checklist Final          :f5-1, after f4-3, 2d
    Validação Jurídica       :f5-2, after f5-1, 2d
    Deposito INPI            :milestone, f5-3, after f5-2, 0d
    
    section Pós-Depósito
    Período Sigilo           :f6-1, after f5-3, 540d
    Exame INPI               :f6-2, after f6-1, 365d
```

---

## 9. DIAGRAMA DE DECISÃO (TIPO DE PATENTE)

```mermaid
flowchart TD
    Start(["🔍 Qual Tipo de Proteção?"]) --> Q1{É um\nobjeto físico?}
    
    Q1 -->|Sim| Q2{É uma nova\nforma funcional?}
    Q2 -->|Sim| MU1["🟡 MODELO DE UTILIDADE\n15 anos"]
    Q2 -->|Não| DI["🎨 DESENHO INDUSTRIAL\n10 anos"]
    
    Q1 -->|Não| Q3{É software\nou algoritmo?}
    
    Q3 -->|Sim| Q4{Produz\nefeito técnico?}
    Q4 -->|Sim| CII["🟢 CII - Computer Implemented\n20 anos"]
    Q4 -->|Não| RPC["🔴 RPC - Registro Software\n50 anos"]
    
    Q3 -->|Não| Q5{É um processo\nindustrial/químico?}
    Q5 -->|Sim| PI1["🔵 PI - Processo\n20 anos"]
    
    Q5 -->|Não| Q6{É um produto\nou composição?}
    Q6 -->|Sim| PI2["🔵 PI - Produto\n20 anos"]
    
    Q6 -->|Não| Q7{É uso de\nalgo existente?}
    Q7 -->|Sim| PI3["🔵 PI - Uso\n20 anos"]
    
    Q7 -->|Não| Outro["❓ Consultar Especialista"]
    
    style MU1 fill:#FF9800,color:#000
    style DI fill:#E91E63,color:#fff
    style CII fill:#4CAF50,color:#fff
    style RPC fill:#f44336,color:#fff
    style PI1 fill:#2196F3,color:#fff
    style PI2 fill:#2196F3,color:#fff
    style PI3 fill:#2196F3,color:#fff
```

---

## 10. DIAGRAMA DE ENTIDADES (CORRIGIDO)

```mermaid
flowchart LR
    subgraph Entidades["📦 ENTIDADES DO SISTEMA"]
        subgraph Personas["👥 PERSONAS"]
            Inv["🔵 Inventor"]
            Aval["🟠 Avaliador"]
            Com["🟣 Comissão"]
        end
        
        subgraph Objetos["📋 OBJETOS"]
            Ped["📄 Pedido Patente"]
            Anx["📋 Anexos"]
            Doc["📄 Documentos Legais"]
        end
        
        subgraph Processos["⚙️ PROCESSOS"]
            Val1["✅ Validação"]
            Ana["🔬 Análise NAI"]
            For["📜 Formalização"]
            Rob["🛡️ Robustez"]
        end
        
        subgraph Resultados["🎯 RESULTADOS"]
            Dep["💼 Depósito"]
            Pat["📜 Patente Concedida"]
        end
    end
    
    Inv -->|cria| Ped
    Inv -->|preenche| Anx
    Inv -->|assina| Doc
    
    Ped -->|passa por| Val1
    Ped -->|passa por| Ana
    Ped -->|passa por| For
    Ped -->|passa por| Rob
    
    Aval -->|realiza| Val1
    Aval -->|realiza| Ana
    Aval -->|realiza| For
    Aval -->|realiza| Rob
    
    Com -->|delibera| Ped
    
    Ped -->|resulta em| Dep
    Dep -->|torna-se| Pat
    
    style Inv fill:#2196F3,color:#fff
    style Aval fill:#FF9800,color:#000
    style Com fill:#9C27B0,color:#fff
    style Val1 fill:#4CAF50,color:#fff
    style Ana fill:#2196F3,color:#fff
    style For fill:#FF9800,color:#000
    style Rob fill:#f44336,color:#fff
    style Dep fill:#607D8B,color:#fff
    style Pat fill:#9C27B0,color:#fff
```

---

## RESUMO DAS CORREÇÕES

### Diagrama 1 (Use Case)
- Corrigida definição de nós (IDs explícitos).
- Removida tentativa de aplicar estilo a subgráficos.

### Diagrama 5 (Flowchart Macro)
- Corrigida sintaxe dos subgráficos e links.
- Assegurado que os rótulos de nós estejam corretamente entre colchetes `["Label"]`.

### Diagrama 7 (Arquitetura)
- Corrigido para corresponder ao índice 7 (Diagrama de Arquitetura).
- Assegurada sintaxe correta de banco de dados `[( )]` e estilo.

### Diagrama 8 (Gantt)
- Removido `axisFormat %d/%m` (causa erro em v11.6).
- Removido marcações `active` (causa erro em renderizadores estritos).

### Diagrama 10 (Entidades)
- Corrigida definição de nós (IDs explícitos).
- Removida tentativa de aplicar estilo a subgráficos.

**Status:** ✅ Sintaxe Validada para Mermaid v11.6
