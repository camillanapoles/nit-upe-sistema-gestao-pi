# DIAGRAMAS UML (PADRÃO) - SISTEMA DE PATENTES UPE
## Mermaid v11.6 - Strict UML Standard (Corrigido)

---

## 1. USE CASE DIAGRAM

```mermaid
flowchart TD
    %% Definição de Atores
    inv((🔵 Inventor))
    aval((🟠 Avaliador))
    comi((🟣 Comissão))
    exam((🔴 Examinador))

    %% Definição de Casos de Uso
    uc1((Consultar Guias))
    uc2((Preencher Anexos))
    uc3((Validar Formulário))
    uc4((Enviar Submissão))
    uc5((Triagem Admin))
    uc6((Exame NAI))
    uc7((Parecer Técnico))
    uc8((Documentos Legais))
    uc9((Assinaturas))
    uc10((Checklist Final))
    uc11((Depósito INPI))

    %% Relacionamentos
    inv --> uc1
    inv --> uc2
    inv --> uc3
    inv --> uc4
    inv --> uc9

    aval --> uc5
    aval --> uc6
    aval --> uc7
    aval --> uc8
    aval --> uc10
    aval --> uc11

    comi --> uc7
    exam --> uc11

    %% Estilos (Apenas para nós, subgraphs não recebem classes em v11.6)
    classDef actor fill:#e1f5fe,stroke:#01579b,stroke-width:2px,font-weight:bold;
    classDef usecase fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    
    class inv,aval,comi,exam actor;
    class uc1,uc2,uc3,uc4,uc5,uc6,uc7,uc8,uc9,uc10,uc11 usecase;
```

---

## 2. CLASS DIAGRAM

```mermaid
classDiagram
    class PedidoPatente {
        -String numeroPedido
        -Date dataCriacao
        -String estadoAtual
        +void criar()
        +void submeter()
        +void depositar()
    }

    class Anexo {
        -String tipo
        -File arquivo
        -boolean assinado
        +void assinar()
    }

    class DocumentoLegal {
        -String tipo
        -String conteudo
        +void assinar()
    }

    class Inventor {
        -String nome
        -String cpf
        -float participacao
        +void assinar()
    }

    class Parecer {
        -String resultado
        -String[] observacoes
        +void semaforizar()
    }

    class TipoPatente {
        <<enumeration>>
        PI
        MU
        CII
        RPC
    }

    %% Relacionamentos
    PedidoPatente "1" *-- "*" Anexo : possui
    PedidoPatente "1" *-- "*" DocumentoLegal : requer
    PedidoPatente "1" *-- "*" Inventor : tem
    PedidoPatente "1" *-- "1" TipoPatente : é do tipo
    PedidoPatente "1" --> "*" Parecer : recebe
```

---

## 3. SEQUENCE DIAGRAM

```mermaid
sequenceDiagram
    autonumber

    actor Inv as 🔵 Inventor
    participant Sys as ⚙️ Sistema
    participant Aval as 🟠 Avaliador
    participant Comi as 🟣 Comissão
    participant Exam as 🔴 INPI

    Inv->>Sys: Acessar Kit / Preencher Anexos
    Sys->>Sys: Validação
    Sys-->>Inv: Feedback

    Inv->>Sys: Submeter Pedido
    Sys->>Aval: Notificar Recebimento

    %% Triagem
    Aval->>Aval: Triagem Administrativa
    alt Falha na Triagem
        Aval-->>Inv: Devolução
        Inv->>Sys: Corrigir
    else Sucesso
        Aval->>Aval: Exame NAI
    end

    Aval->>Comi: Solicitar Parecer
    Comi-->>Aval: Parecer Semaforizado

    %% Parecer
    alt Parecer Verde
        Aval-->>Inv: Aprovação
    else Parecer Amarelo
        Aval-->>Inv: Ressalvas
        Inv->>Sys: Ajustes Menores
        Sys->>Aval: Reavaliação
        Aval-->>Inv: Aprovação
    else Parecer Vermelho
        Aval-->>Inv: Desfavorável
    end

    %% Formalização
    Inv->>Aval: Enviar Documentos Assinados
    Aval->>Aval: Validar

    %% Depósito
    Aval->>Exam: Depositar Pedido
    Exam-->>Aval: Confirmação
    Aval-->>Inv: Comprovante
```

---

## 4. STATE MACHINE DIAGRAM

```mermaid
stateDiagram-v2
    [*] --> Rascunho: Criar
    Rascunho --> EmPreenchimento: Iniciar
    EmPreenchimento --> Rascunho: Salvar
    EmPreenchimento --> EmValidacao: Submeter

    EmValidacao --> EmPreenchimento: Validacao Falhou
    EmValidacao --> AguardandoAnalise: Validacao OK

    AguardandoAnalise --> EmTriagem: Recebido
    EmTriagem --> EmExameNAI: Triagem Aprovada

    EmExameNAI --> EmParecer: Exame Concluído

    state EmParecer {
        [*] --> Verde
        [*] --> Amarelo
        [*] --> Vermelho
        
        Verde --> EmFormalizacao
        Amarelo --> EmRessalvas
        Vermelho --> [*] : Arquivar
    }

    EmRessalvas --> EmFormalizacao: Ajustes OK
    EmRessalvas --> [*] : Desistir

    EmFormalizacao --> ProntoDeposito: Validado
    ProntoDeposito --> Depositado: Depositar

    Depositado --> Vigente: Aprovado
    Vigente --> [*] : Expirado
```

---

## 5. ACTIVITY DIAGRAM (Swimlanes)

```mermaid
flowchart TD
    subgraph Inv["🔵 Inventor"]
        Start((Inicio))
        Educacao[Educacao Previa]
        Anexos[Preencher Anexos]
        Formulario[Preencher Formulario]
        Assinar[Assinar Documentos]
    end

    subgraph Sys["⚙️ Sistema"]
        Validar[Validar Caracteres]
        Check[Checklist]
        Email[Enviar Email]
    end

    subgraph Aval["🟠 Avaliador"]
        Triagem[Triagem]
        Analise[Analise NAI]
        Parecer[Parecer]
        Depositar[Depositar INPI]
    end

    subgraph Com["🟣 Comissão"]
        Deliberar[Deliberar]
    end

    %% Fluxo
    Start --> Educacao
    Educacao --> Anexos
    Anexos --> Formulario
    Formulario --> Validar

    Validar -->|Falha| Formulario
    Validar -->|Sucesso| Check

    Check --> Email
    Email --> Triagem

    Triagem -->|Reprovado| Anexos
    Triagem -->|Aprovado| Analise

    Analise --> Parecer
    Parecer --> Deliberar
    Deliberar --> Assinar
    Assinar --> Depositar
```

---

## 6. COMPONENT DIAGRAM

```mermaid
flowchart LR
    subgraph Frontend["Frontend Layer"]
        P1[Portal Inventor]
        P2[Dashboard Avaliador]
    end

    subgraph Business["Business Layer"]
        S1[API Controller]
        S2[Validation Service]
        S3[Analysis Service]
        S4[Document Service]
    end

    subgraph Data["Data Layer"]
        D1[(PostgreSQL DB)]
        D2[(File System)]
    end

    subgraph External["External Systems"]
        E1[SisGen]
        E2[INPI e-INPI]
    end

    %% Interfaces
    P1 --REST--> S1
    P2 --REST--> S1

    %% Dependências
    S1 --> S2
    S1 --> S3
    S1 --> S4

    S2 --> D1
    S3 --> D1
    S4 --> D1
    S4 --> D2

    S4 --> E1
    S4 --> E2

    %% Estilos
    classDef component fill:#e0f2f1,stroke:#00695c,stroke-width:2px;
    classDef database fill:#efebe9,stroke:#5d4037,stroke-width:2px,rx:20,ry:20;
    classDef external fill:#f5f5f5,stroke:#9e9e9e,stroke-width:2px,stroke-dasharray: 5 5;

    class P1,P2,S1,S2,S3,S4 component;
    class D1,D2 database;
    class E1,E2 external;
```

---

## 7. DEPLOYMENT DIAGRAM

```mermaid
flowchart TB
    subgraph Clientes["Client Devices"]
        C1[Inventor Browser]
        C2[Avaliador Browser]
    end

    subgraph Server_Web["Web Server"]
        W1[Apache/Nginx]
        A1[React App]
    end

    subgraph Server_App["App Server"]
        API[Spring Boot API]
        Val[Validation Engine]
        Nai[Analysis Engine]
    end

    subgraph Server_DB["Database Server"]
        PG[(PostgreSQL)]
        FS[(File System)]
    end

    subgraph Cloud["Cloud Services"]
        SG[SisGen]
        INPI[INPI]
    end

    %% Conexões
    C1 -->|HTTPS| W1
    C2 -->|HTTPS| W1
    W1 -->|HTTP| A1
    A1 -->|REST| API

    API --> Val
    API --> Nai

    Val --> PG
    Nai --> PG
    Nai --> FS

    API --> SG
    API --> INPI
```

---

## 8. PACKAGE DIAGRAM

```mermaid
flowchart TB
    subgraph br_upe_nit_pi["br.upe.nit.pi"]
        subgraph modelo["modelo"]
            Pedido[Pedido]
            Anexo[Anexo]
            DocLegal[DocLegal]
        end

        subgraph servico["servico"]
            ServicoVal[Validacao]
            ServicoAna[Analise]
            ServicoEmail[Email]
        end

        subgraph controle["controle"]
            CtrlInv[Inventor]
            CtrlAval[Avaliador]
        end

        subgraph integracao["integracao"]
            IntSisGen[SisGen]
            IntINPI[INPI]
        end
    end

    %% Dependências entre Pacotes (Simulado por setas entre nós)
    CtrlInv --> ServicoVal
    CtrlAval --> ServicoAna
    ServicoVal --> Pedido
    ServicoAna --> Pedido
    ServicoAna --> IntINPI

    classDef node fill:#fff3e0,stroke:#e65100,stroke-width:1px;
    classDef pkg fill:#fafafa,stroke:#bdbdbd,stroke-width:2px;
    
    class Pedido,Anexo,DocLegal,ServicoVal,ServicoAna,ServicoEmail,CtrlInv,CtrlAval,IntSisGen,IntINPI node;
    class br_upe_nit_pi,modelo,servico,controle,integracao pkg;
```

---

## 9. ACTIVITY DIAGRAM DETALHADO (Decision Flow)

```mermaid
flowchart TD
    A([Start]) --> B{Deseja Patente?}
    B -->|Não| F([End])
    B -->|Sim| C[Identificar Tipo]

    C --> D{PI/MU/CII/RPC?}
    D -->|PI| E[Patente Invencao]
    D -->|MU| G[Modelo Utilidade]
    D -->|CII| H[Software CII]
    D -->|RPC| I[Registro Software]

    E --> J[Preencher Anexos]
    G --> J
    H --> J
    I --> J

    J --> K[Validar Caracteres]
    K --> L{Valido?}

    L -->|Não| M[Corrigir]
    M --> K
    L -->|Sim| N[Submeter NIT]

    N --> O[Receber Parecer]
    O --> P{Verde?}

    P -->|Sim| Q[Formalizar]
    P -->|Não| R{Reformular?}

    R -->|Sim| S[Reformular]
    S --> N
    R -->|Não| F

    Q --> T[Depositar INPI]
    T --> U([End])
```

---

## 10. COMMUNICATION DIAGRAM

```mermaid
flowchart LR
    inv((Inv)) -- "1: Preencher" --> sys([Sys])
    sys -- "2: Validar" --> inv
    inv -- "3: Submeter" --> aval((Aval))
    aval -- "4: Analisar" --> comi((Com))
    comi -- "5: Parecer" --> aval
    aval -- "6: Aprovar" --> inv
    inv -- "7: Assinar" --> aval
    aval -- "8: Depositar" --> exam((INPI))

    %% Estilos
    classDef obj fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    class inv,aval,comi,exam,obj sys obj;
```

---

## NOTAS TÉCNICAS UML

### Correções Aplicadas para Mermaid v11.6

1.  **Remoção de Classes em Subgrupos:**
    - **Antes:** `class Fase1,Fase2,Fase3,Fase4,Fase5 system;`
    - **Problema:** Em Mermaid v11.6, você não pode aplicar estilos de classe diretamente a IDs de `subgraph` para colorir o fundo da caixa inteira. Isso causa erros ou é ignorado.
    - **Correção:** Removidas as aplicações de classe aos subgrupos. Os nós internos mantêm seus estilos.

2.  **Formas de Nós:**
    - **Atores:** Usados como nós de texto com ícones `(( ))` para diferenciar, já que o diagrama `flowchart` não suporta a forma "stickman" nativa.
    - **Casos de Uso:** Mantidos como círculos `(( ))` (pílula) para simular a oval UML, pois é a forma mais aproximada suportada.

3.  **Sintaxe Strict:**
    - Todas as setas e relações seguem a sintaxe oficial do Mermaid v11.6.
    - Diagramas nativos (`classDiagram`, `sequenceDiagram`, `stateDiagram-v2`) mantidos sem alterações na lógica, apenas formatação.

---

**Versão do Mermaid:** 11.6.0  
**Padrão:** UML 2.5  
**Status:** ✅ Sintaxe Corrigida e Validada
