# Scripts de Orquestração Multi-Agentes

Este diretório contém scripts para automatizar a orquestração de multi-agentes
usando CCManager, wshobson/agents marketplace e MCP task-managers.

## Setup Inicial

### 1. Instalar Marketplace de Agentes

Dentro do Claude Code CLI, execute:

```bash
# Adicionar marketplace
/plugin marketplace add wshobson/agents

# Listar plugins disponíveis
/plugin

# Instalar plugins essenciais
/plugin install python-development
/plugin install javascript-typescript
/plugin install code-review-ai
/plugin install security-scanning
/plugin install full-stack-orchestration
```

### 2. Criar Worktrees

```bash
# Habilitar worktree config
git config extensions.worktreeConfig true

# Criar worktrees
./scripts/create-worktrees.sh
```

### 3. Iniciar CCManager

```bash
# Modo multi-projeto
ccmanager --multi-project

# Ou com diretório específico
CCMANAGER_MULTI_PROJECT_ROOT=/mnt/cnmfs/Claude/Projects/Code-Terminal ccmanager --multi-project
```

## Scripts Disponíveis

- `create-worktrees.sh` - Cria worktrees para desenvolvimento paralelo
- `sync-worktrees.sh` - Sincroniza mudanças entre worktrees
- `validate-specs.sh` - Valida specs OpenSpec
- `orchestrate.sh` - Inicia workflow completo de orquestração

## Uso dos MCP Task-Managers

### Kazuph TaskManager (Fila)

```typescript
// Planejar tarefas
{
  action: "plan",
  tasks: ["Task 1", "Task 2", "Task 3"]
}

// Executar próxima
{
  action: "execute",
  getNext: true
}

// Completar tarefa
{
  action: "complete",
  taskId: "task-123"
}
```

### Blizzy TaskManager (Criação/Decomposição)

```typescript
// Criar tarefa
await mcp.call("blizzy-taskmanager", "create_task", {
  title: "Implementar API de anexos",
  description: "Spec: openspec/changes/add-sistema-anexos/..."
})
```
