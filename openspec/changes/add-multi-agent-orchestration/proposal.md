# Change: Implementar Orquestração Multi-Agentes com CCManager

## Why

O projeto atual executa tarefas sequencialmente através de um único agente Claude. Para acelerar o desenvolvimento e garantir cumprimento rigoroso das especificações OpenSpec, precisamos de um sistema de orquestração que permita:

1. **Paralelização**: Múltiplos agentes trabalhando simultaneamente em diferentes aspectos do projeto
2. **Especialização**: Cada agente focado em um domínio específico (backend, frontend, security, testing)
3. **Coordenação**: MCP Task-managers orquestrando tarefas entre agentes
5. **Rastreabilidade**: CCManager gerenciando sessões em worktrees separados

**Impacto**: A orquestração multi-agentes permitirá:
- Desenvolvimento 3-5x mais rápido através de paralelização
- Maior qualidade através de revisão cruzada entre agentes
- Cumprimento garantido de specs OpenSpec através de validação distribuída
- Isolamento de riscos (worktrees separadas)

## What Changes

- **ADICIONAR** CCManager para gerenciamento de sessões paralelas
- **ADICIONAR** wshobson/agents marketplace com 67 plugins especializados
- **CONFIGURAR** MCP task-managers (kazuph + blizzy) para orquestração
- **ADICIONAR** Estrutura de worktrees para desenvolvimento paralelo
- **ATUALIZAR** OpenSpec para suportar validação multi-agente
- **ADICIONAR** Scripts de orquestração e sincronização

**BREAKING**: Nenhuma mudança breaking - é capacidade nova.

## Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────┐
│                    CCManager                                 │
│  (Gerencia múltiplas sessões Claude em worktrees)          │
└─────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌──────────┐          ┌──────────┐          ┌──────────┐
    │Worktree 1│          │Worktree 2│          │Worktree 3│
    │backend   │          │frontend  │          │security  │
    └──────────┘          └──────────┘          └──────────┘
           │                    │                    │
           └────────────────────┼────────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │  MCP Task-Managers  │
                    │  - kazuph: fila     │
                    │  - blizzy: create   │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     OpenSpec        │
                    │  (Validação)        │
                    └─────────────────────┘
```

## Componentes

### 1. CCManager (Gerenciador de Sessões)
- **Repositório**: https://github.com/kbwo/ccmanager
- **Função**: Gerenciar múltiplas sessões Claude Code em paralelo
- **Instalação**: `npm install -g ccmanager`
- **Configuração**:
  - Multi-project mode para Prof_INPI
  - Worktrees separadas por domínio
  - Status hooks para sincronização

### 2. wshobson/agents (Marketplace)
- **Repositório**: https://github.com/wshobson/agents
- **Função**: 67 plugins com 99 agentes especializados
- **Instalação**: `/plugin marketplace add wshobson/agents`
- **Plugins Relevantes**:
  - `backend-development` - backend-architect, graphql-architect
  - `python-development` - python-pro, django-pro, fastapi-pro
  - `code-review-ai` - AI-powered code review
  - `security-scanning` - SAST e auditoria
  - `full-stack-orchestration` - Workflow multi-agente

### 3. MCP Task-Managers (Já instalados)
- **kazuph-taskmanager**: Sistema de fila (plan → execute → complete)
- **blizzy-taskmanager**: Criação e decomposição de tarefas

### 4. Integração OpenSpec
- Task-managers leem specs do OpenSpec
- Cada worktree valida sua parte da spec
- Sincronização via CCManager

## Fluxo de Trabalho Proposto

### Fase 1: Planejamento (Task Manager)
```typescript
action: "plan"
tasks: [
  "Especificar API de anexos",
  "Implementar componentes React",
  "Adicionar validações backend",
  "Criar testes E2E",
  "Configurar CI/CD"
]
```

### Fase 2: Distribuição (CCManager)
- Worktree 1 (backend): `/python-development:fastapi-pro`
- Worktree 2 (frontend): `/javascript-typescript:typescript-pro`
- Worktree 3 (security): `/security-scanning:security-hardening`
- Worktree 4 (testing): `/python-development:python-testing-patterns`

### Fase 3: Execução (Paralela)
- Cada agente trabalha em sua worktree
- MCPs auxiliam (zread, web-search, browser-tools)
- Task-managers coordenam progresso

### Fase 4: Sincronização
```typescript
action: "complete"
taskId: "task-123"
// Próxima tarefa da fila é executada
```

## Especificação Técnica

### Estrutura de Worktrees
```
/mnt/container-data/projects/Prof_INPI/
├── main/              (branch principal)
├── feature/backend/   (worktree - backend agent)
├── feature/frontend/  (worktree - frontend agent)
├── feature/security/  (worktree - security agent)
└── feature/testing/   (worktree - testing agent)
```

### Configuração CCManager
```json
{
  "multiProjectRoot": "/mnt/container-data/projects",
  "presets": [
    {
      "name": "backend-dev",
      "args": ["--model", "opus"],
      "env": {"PLUGIN": "python-development"}
    }
  ],
  "statusHooks": {
    "onWaiting": "notify-send 'Claude precisa input'",
    "onComplete": "notify-send 'Tarefa completa'"
  }
}
```

### Integração com MCP Task-Managers
```javascript
// Task Manager consulta OpenSpec
const spec = await openspec.getSpec('sistema-anexos');
const tasks = await blizzy.createTask(spec);
await kazuph.plan(tasks);
```

## Cenários de Uso

### Cenário 1: Desenvolvimento de Feature
```
1. Product Owner define feature no OpenSpec
2. Task-manager cria e decompose tarefas
3. CCManager cria worktrees para cada domínio
4. Agentes especializados executam em paralelo
5. Code-review agent valida entre worktrees
6. Merge após validação completa
```

### Cenário 2: Security Hardening
```
1. Security agent scan via worktree dedicada
2. Task-manager distribui correções
3. Backend/Frontend agents aplicam fixes
4. Re-scan para validação
5. Merge quando clean
```

## Critérios de Sucesso

- ✅ CCManager instalado e configurado
- ✅ wshobson/agents marketplace adicionado
- ✅ 3+ worktrees criadas e funcionando
- ✅ Task-managers orquestrando entre worktrees
- ✅ Primeira feature desenvolvida com workflow multi-agente
- ✅ Documentação de uso atualizada

## Riscos e Mitigações

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| Conflitos de merge entre worktrees | Alta | CCManager com merge automático + hooks |
| Sobrecarga de tokens com múltiplos agentes | Média | Skills com progressive disclosure |
| Complexidade de coordenação | Média | Task-managers centralizados |
| Divergência de specs OpenSpec | Baixa | Validação cruzada entre agentes |

## Próximos Passos

Ver `tasks.md` para implementação detalhada.
