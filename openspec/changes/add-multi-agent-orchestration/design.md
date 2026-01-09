# Design: Orquestração Multi-Agentes com CCManager

## Visão Geral

Este documento detalha o design técnico para implementação de orquestração multi-agentes usando CCManager, wshobson/agents marketplace, e MCP task-managers integrados com OpenSpec.

## Arquitetura Detalhada

```
┌────────────────────────────────────────────────────────────────────┐
│                         CCManager                                  │
│                    (Session Orchestrator)                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Multi-Project Mode: /mnt/container-data/projects          │  │
│  └─────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌───────────┐   ┌───────────┐   ┌───────────┐
        │ Worktree  │   │ Worktree  │   │ Worktree  │
        │ Backend   │   │ Frontend  │   │ Security  │
        └───────────┘   └───────────┘   └───────────┘
                │               │               │
        ┌───────┴───────┐ ┌─────┴─────┐ ┌─────┴─────┐
        │ Claude Code   │ │ Claude    │ │ Claude    │
        │ + Agents      │ │ Code      │ │ Code      │
        └───────┬───────┘ └─────┬─────┘ └─────┬─────┘
                │               │               │
                └───────────────┼───────────────┘
                                ▼
                    ┌───────────────────────┐
                    │  MCP Task-Managers    │
                    │  (kazuph + blizzy)    │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │      OpenSpec         │
                    │  (Specs + Delta)      │
                    └───────────────────────┘
```

## Componentes

### 1. CCManager

**Propósito**: Gerenciar múltiplas sessões Claude Code simultaneamente

**Instalação**:
```bash
npm install -g ccmanager
```

**Configuração** (`~/.config/ccmanager/config.json`):
```json
{
  "multiProjectRoot": "/mnt/container-data/projects",
  "presets": [
    {
      "name": "backend-dev",
      "command": "claude",
      "args": ["--model", "opus"]
    },
    {
      "name": "frontend-dev",
      "command": "claude",
      "args": ["--model", "sonnet"]
    },
    {
      "name": "security-scan",
      "command": "claude",
      "args": ["--model", "opus"]
    }
  ],
  "shortcuts": {
    "returnToMenu": {"ctrl": true, "key": "e"},
    "cancel": {"key": "escape"}
  }
}
```

**Status Hooks**:
```bash
# ~/.config/ccmanager/hooks.sh
on_waiting() {
  notify-send "Claude [${session_name}]" "Waiting for input"
}

on_complete() {
  notify-send "Claude [${session_name}]" "Task completed"
}
```

### 2. wshobson/agents Marketplace

**Propósito**: Fornecer agentes especializados para cada domínio

**Instalação**:
```bash
/plugin marketplace add wshobson/agents
```

**Plugins Recomendados**:
```bash
# Backend
/plugin install python-development      # python-pro, django-pro, fastapi-pro
/plugin install backend-development      # backend-architect, graphql-architect

# Frontend
/plugin install javascript-typescript   # typescript-pro, javascript-pro
/plugin install frontend-mobile-development

# Quality
/plugin install code-review-ai           # AI-powered review
/plugin install security-scanning        # SAST, security-hardening
/plugin install comprehensive-review     # architect + security + code review

# Testing
/plugin install python-testing-patterns  # pytest, fixtures
/plugin install unit-testing

# Orchestration
/plugin install full-stack-orchestration # Multi-agent workflows
```

### 3. MCP Task-Managers

**Kazuph TaskManager** (Fila):
```typescript
// Planejar
{
  action: "plan",
  tasks: ["Task 1", "Task 2", "Task 3"]
}

// Executar
{
  action: "execute",
  getNext: true
}

// Completar
{
  action: "complete",
  taskId: "task-123"
}
```

**Blizzy TaskManager** (Criação/Decomposição):
```typescript
// Criar tarefa
await mcp.call("blizzy-taskmanager", "create_task", {
  title: "Implementar API de anexos",
  description: "Spec: openspec/changes/add-sistema-anexos/..."
})

// Decompor
await mcp.call("blizzy-taskmanager", "decompose_task", {
  taskId: "task-123",
  maxSubtasks: 5
})
```

### 4. Integração OpenSpec

**Script de Leitura de Specs**:
```javascript
// scripts/openspec-to-tasks.js
import { readFileSync } from 'fs';
import { parse } from 'yaml';

function loadSpec(changeId) {
  const proposal = parse(readFileSync(`openspec/changes/${changeId}/proposal.md`));
  const tasks = parse(readFileSync(`openspec/changes/${changeId}/tasks.md`));

  return {
    id: changeId,
    title: proposal.metadata.title,
    tasks: tasks.tasks
  };
}

async function createWorkitem(spec) {
  // Usa blizzy para criar e decompor
  const taskId = await blizzy.createTask({
    title: spec.title,
    description: spec.description
  });

  // Usa kazuph para planejar
  await kazuph.plan({
    tasks: spec.tasks
  });

  return taskId;
}
```

## Fluxo de Trabalho

### Fase 1: Inicialização
```bash
# 1. Iniciar CCManager
ccmanager --multi-project

# 2. Selecionar projeto Prof_INPI

# 3. Criar worktrees se não existirem
# Menu → New Worktree → feature/backend-xyz
```

### Fase 2: Planejamento
```bash
# Na sessão principal
/read openspec/changes/add-sistema-anexos/proposal.md
/blizzy-taskmanager create "Implementar Anexo A"
/kazuph-taskmanager plan ["Especificar modelo", "Criar API", "Validar"]
```

### Fase 3: Distribuição
```bash
# CCManager mostra sessões disponíveis:
# [1] Prof_INPI-backend [busy]  - Especificando modelo...
# [2] Prof_INPI-frontend [idle] - Aguardando tarefas
# [3] Prof_INPI-security [idle] - Aguardando tarefas

# Switch para worktree backend (Ctrl+1)
# Executar: /python-development:fastapi-pro "Especificar modelo Prisma"
```

### Fase 4: Execução Paralela
```
Worktree Backend              Worktree Frontend           Worktree Security
     │                              │                           │
     ▼                              ▼                           ▼
/fastapi-pro                  /typescript-pro              /security-scan
     │                              │                           │
     ├─ schema.prisma               ├─ AnexoA.tsx              ├─ sast-scan
     ├─ api/anexos.py               ├─ validations.ts          └─ report
     └─ tests/test_anexos.py        └─ stories/
     │                              │                           │
     └────────────── complete ──────┴───────────────────────────┘
                            │
                            ▼
                    /kazuph execute getNext=true
```

### Fase 5: Sincronização e Merge
```bash
# Após todas as tarefas completas
./scripts/sync-worktrees.sh

# Validação
./scripts/validate-specs.sh

# Merge se validado
git worktree merge feature/backend-xyz --validate
```

## Scripts de Orquestração

### scripts/orchestrate.sh
```bash
#!/bin/bash
CHANGE_ID=$1

if [ -z "$CHANGE_ID" ]; then
  echo "Usage: $0 <change-id>"
  exit 1
fi

# 1. Carregar spec
echo "Loading spec: $CHANGE_ID"
node scripts/openspec-to-tasks.js "$CHANGE_ID"

# 2. Criar worktrees
git worktree add -b "feature/$CHANGE_ID-backend" "../Prof_INPI-$CHANGE_ID-backend" main
git worktree add -b "feature/$CHANGE_ID-frontend" "../Prof_INPI-$CHANGE_ID-frontend" main

# 3. Iniciar CCManager
ccmanager --multi-project
```

### scripts/sync-worktrees.sh
```bash
#!/bin/bash
# Sincroniza mudanças entre worktrees

MAIN_WORKTREE="."
BACKEND_WORKTREE="../Prof_INPI-backend"
FRONTEND_WORKTREE="../Prof_INPI-frontend"

# Sync backend → main
git -C "$BACKEND_WORKTREE" push origin "feature/$1-backend"
git -C "$MAIN_WORKTREE" pull

# Sync frontend → main
git -C "$FRONTEND_WORKTREE" push origin "feature/$1-frontend"
git -C "$MAIN_WORKTREE" pull
```

### scripts/validate-specs.sh
```bash
#!/bin/bash
# Valida specs OpenSpec antes do merge

CHANGE_ID=$1

echo "Validating against OpenSpec..."
openspec validate "$CHANGE_ID" --strict

if [ $? -eq 0 ]; then
  echo "✅ Spec validation passed"
  exit 0
else
  echo "❌ Spec validation failed"
  exit 1
fi
```

## Estrutura de Diretórios

```
/mnt/container-data/projects/
├── Prof_INPI/                    # Main worktree (principal)
├── Prof_INPI-backend/            # Backend worktree
├── Prof_INPI-frontend/           # Frontend worktree
├── Prof_INPI-security/           # Security worktree
└── Prof_INPI-testing/            # Testing worktree

Cada worktree tem:
├── .claude/                      # Sessão Claude isolada
├── web-app/                      # Código do projeto
└── scripts/                      # Scripts de orquestração
```

## Considerações de Performance

### Token Optimization
- Use `Haiku` para tarefas operacionais
- Use `Sonnet` para desenvolvimento
- Use `Opus` para arquitetura e segurança
- Skills com progressive disclosure reduzem tokens

### Parallelização
- 3-4 worktrees máximo para evitar sobrecarga
- Worktrees dedicadas por domínio
- Merge frequentes para evitar conflitos grandes

### Sincronização
- Push/pull a cada tarefa completa
- Status hooks notificam progresso
- CCManager mostra estado em tempo real

## Segurança

### Isolamento
- Cada worktree tem seu próprio `.claude/`
- Sessões não compartilham contexto
- Merge apenas após validação

### Validação
- Security agent scanna antes de merge
- Code-review agent valida qualidade
- OpenSpec valida conformidade

## Troubleshooting

### Problema: Worktrees divergentes
```bash
# Solução: Rebase do worktree
git -C ../Prof_INPI-backend rebase main
```

### Problema: CCManager não detecta estados
```bash
# Solução: Verificar state detection
ccmanager --debug-state
```

### Problema: Conflitos de merge
```bash
# Solução: Usar merge strategy
git merge -X theirs feature/backend-xyz
```

## Próximos Passos

1. Implementar seguindo tasks.md
2. Testar com feature simples
3. Medir ganho de performance
4. Documentar lessons learned
