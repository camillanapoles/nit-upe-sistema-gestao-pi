# Orquestração Multi-Agentes

Este documento descreve como usar orquestração multi-agentes no projeto Prof_INPI usando CCManager, wshobson/agents marketplace e MCP task-managers.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    CCManager                                 │
│              Multi-Project Session Manager                   │
└─────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌──────────┐          ┌──────────┐          ┌──────────┐
    │Worktree  │          │Worktree  │          │Worktree  │
    │Backend   │          │Frontend  │          │Security  │
    └──────────┘          └──────────┘          └──────────┘
           │                    │                    │
           └────────────────────┼────────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │  MCP Task-Managers  │
                    │  ✓ kazuph (fila)    │
                    │  ✓ blizzy (create)  │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     OpenSpec        │
                    │  (Specs + Delta)    │
                    └─────────────────────┘
```

## Componentes Instalados

| Componente | Status | Localização |
|-----------|--------|-------------|
| CCManager | ✅ v3.2.8 | Global (npm) |
| kazuph-taskmanager | ✅ | Local (MCP) |
| blizzy-taskmanager | ✅ | Local (MCP) |
| wshobson/agents | ⏳ Para instalar | Claude Code CLI |
| Scripts de orquestração | ✅ | `scripts/` |

## Quando Executar Cada Script

| Script | Frequência | Quando Executar |
|--------|-----------|-----------------|
| `orchestrate.sh <feature> --create-worktrees` | **1x por FEATURE** | Início de cada nova feature |
| `start-ccmanager.sh` | **1x por SESSÃO** | Cada vez que for trabalhar |
| `sync-worktrees.sh <feature>` | **Várias vezes** | Após concluir tarefas |
| `validate-specs.sh <change-id>` | **Várias vezes** | Antes de commits importantes |
| `merge-worktrees.sh <feature>` | **1x por FEATURE** | Final da feature |

### Exemplo de Timeline

```
Dia 1     ▶ orchestrate.sh --create-worktrees  (cria worktrees)
Dia 2-10  ▶ start-ccmanager.sh                 (sessões de trabalho)
Dia 10    ▶ merge-worktrees.sh                 (merge final)
```

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
# Criar worktrees para uma feature
./scripts/orchestrate.sh add-sistema-anexos --create-worktrees

# Ou criar manualmente
./scripts/create-worktrees.sh minha-feature
```

### 3. Iniciar CCManager

```bash
# Iniciar com configuração do projeto
./scripts/start-ccmanager.sh

# Ou manualmente
CCCMANAGER_MULTI_PROJECT_ROOT=/mnt/cnmfs/Claude/Projects/Code-Terminal ccmanager --multi-project
```

## Fluxo de Trabalho Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                     WORKFLOW COMPLETO                           │
└─────────────────────────────────────────────────────────────────┘

   1. PLANEJAMENTO           2. DISTRIBUIÇÃO           3. EXECUÇÃO
        │                         │                       │
        ▼                         ▼                       ▼
   ┌─────────┐              ┌──────────┐          ┌──────────┐
   │ OpenSpec│              │Task Mgrs │          │Worktrees │
   │ Spec    │─────────────▶│ Blizzy   │─────────▶│ Isoladas │
   └─────────┘              │ Kazuph   │          │  Parallel │
                            └──────────┘          └─────┬────┘
                                                       │
   5. MERGE                  4. SYNC                  │
        │                         │                   │
        ▼                         ▼                   ▼
   ┌─────────┐              ┌──────────┐          ┌──────────┐
   │ PR/main │◀─────────────▶│Validate  │◀─────────┤ Complete │
   │ Deploy  │              │ Specs    │          │ Tasks    │
   └─────────┘              └──────────┘          └──────────┘
```

### Fase 1: Planejamento

```bash
# 1. Validar e preparar spec
./scripts/orchestrate.sh add-minha-feature

# 2. Ler spec
/read openspec/changes/add-minha-feature/proposal.md
```

### Fase 2: Distribuição de Tarefas

Usar o **Blizzy TaskManager** para criar e decompor tarefas:

```typescript
// Criar tarefa principal
mcp.call("blizzy-taskmanager", "create_task", {
  title: "Implementar Minha Feature",
  description: "Spec: openspec/changes/add-minha-feature/..."
})

// Decompor em sub-tarefas
mcp.call("blizzy-taskmanager", "decompose_task", {
  taskId: "task-123",
  maxSubtasks: 5
})
```

Usar o **Kazuph TaskManager** para planejar execução:

```typescript
// Planejar fila de execução
mcp.call("kazuph-taskmanager", "plan", {
  tasks: [
    "Especificar API backend",
    "Implementar componentes frontend",
    "Adicionar validações security",
    "Criar testes"
  ]
})
```

### Fase 3: Execução Paralela

Com CCManager aberto, selecione a worktree e execute:

```
Worktree Backend              Worktree Frontend           Worktree Security
     │                              │                           │
     ▼                              ▼                           ▼
/python-development:        /javascript-typescript:      /security-scanning:
  fastapi-pro                  typescript-pro              security-hardening
     │                              │                           │
     ├─ schema.prisma               ├─ Component.tsx            ├─ sast-scan
     ├─ api/endpoint.py             ├─ validation.ts           └─ report
     └─ tests/                      └─ stories/
```

### Fase 4: Sincronização e Validação

```bash
# Sincronizar worktrees (após tarefas completas)
./scripts/sync-worktrees.sh minha-feature

# Validar specs
./scripts/validate-specs.sh add-minha-feature
```

### Fase 5: MERGE FINAL ⚠️ **CRÍTICO**

Esta fase integra todas as worktrees de volta ao branch principal.

```bash
# 1. Pré-merge checklist (dry-run para validar)
./scripts/merge-worktrees.sh minha-feature --dry-run

# 2. Executar merge (se checklist passar)
./scripts/merge-worktrees.sh minha-feature
```

**O que o merge-worktrees.sh faz:**

1. **Gatekeeping Pré-Merge:**
   - ✅ OpenSpec validada
   - ✅ Worktrees existem e são alcançáveis
   - ✅ Worktrees limpas (sem uncommitted changes)
   - ✅ Branch principal atualizado
   - ✅ Backup criado

2. **Squash Merge (Estratégia):**
   - Cria branch `merge/<feature-name>`
   - Merge cada worktree com commit único:
     - `feat(backend): Merge da worktree backend`
     - `feat(frontend): Merge da worktree frontend`
     - `feat(security): Merge da worktree security`

3. **Pós-Merge:**
   - Review das mudanças: `git diff master`
   - Testes: `npm test && npm run build`
   - Merge para master: `git checkout master && git merge merge/<feature-name>`
   - Push e PR: `git push origin merge/<feature-name> && gh pr create`

**Rollback se necessário:**
```bash
# Restaurar para backup
git reset --hard $(cat /tmp/backup-before-merge-*.txt)
```

## Scripts Disponíveis

| Script | Fase | Descrição |
|--------|------|-----------|
| `orchestrate.sh` | 1 | Inicia workflow completo |
| `create-worktrees.sh` | 1 | Cria worktrees para feature |
| `sync-worktrees.sh` | 4 | Sincroniza mudanças entre worktrees |
| `validate-specs.sh` | 4 | Valida specs OpenSpec |
| `merge-worktrees.sh` | **5** | **MERGE FINAL com gatekeeping** |
| `start-ccmanager.sh` | 3 | Inicia CCManager |

## Agentes por Domínio

### Backend (Python/FastAPI)
```bash
# Instalar plugin
/plugin install python-development

# Agentes disponíveis
/python-development:python-pro      # Python 3.12+ geral
/python-development:django-pro      # Django 5.x
/python-development:fastapi-pro     # FastAPI + SQLAlchemy
```

### Frontend (TypeScript/Next.js)
```bash
# Instalar plugin
/plugin install javascript-typescript

# Agentes disponíveis
/javascript-typescript:typescript-pro   # TypeScript avançado
/javascript-typescript:javascript-pro   # JavaScript moderno
```

### Security
```bash
# Instalar plugin
/plugin install security-scanning

# Agentes disponíveis
/security-scanning:security-hardening   # Hardening completo
/security-scanning:security-sast        # SAST scan
```

### Code Review
```bash
# Instalar plugin
/plugin install code-review-ai

# Agentes disponíveis
/code-review-ai:ai-review               # Review completo
```

## MCPs Auxiliares

| MCP | Uso |
|-----|-----|
| kazuph-taskmanager | Fila de tarefas |
| blizzy-taskmanager | Criação/decomposição |
| web-search-prime | Buscar informações |
| web-reader | Ler páginas web |
| zread | Ler arquivos do GitHub |
| browser-tools | Testar UI |
| puppeteer | Automatizar browser |

## Exemplo Completo

```bash
# 1. Iniciar orquestração
./scripts/orchestrate.sh add-sistema-anexos --create-worktrees

# 2. Iniciar CCManager
./scripts/start-ccmanager.sh

# 3. Na worktree backend:
/python-development:fastapi-pro "Implementar API de anexos conforme spec"

# 4. Na worktree frontend:
/javascript-typescript:typescript-pro "Criar componentes para Anexo A"

# 5. Na worktree security:
/security-scanning:security-hardening "Validar security da API de anexos"

# 6. Sincronizar e validar
./scripts/sync-worktrees.sh sistema-anexos
./scripts/validate-specs.sh add-sistema-anexos
```

## Troubleshooting

### CCManager não inicia
```bash
# Verificar instalação
ccmanager --version

# Verificar variável de ambiente
echo $CCMANAGER_MULTI_PROJECT_ROOT
```

### Worktrees não aparecem
```bash
# Listar worktrees
git worktree list

# Recriar se necessário
git worktree prune
./scripts/create-worktrees.sh
```

### Plugins não carregam
```bash
# Verificar plugins instalados
/plugin

# Limpar cache e reinstalar
rm -rf ~/.claude/plugins/cache/
/plugin marketplace add wshobson/agents
```

## Referências

- [CCManager GitHub](https://github.com/kbwo/ccmanager)
- [wshobson/agents GitHub](https://github.com/wshobson/agents)
- [OpenSpec Documentation](openspec/AGENTS.md)
- [Estratégia de Merge Completa](docs/MERGE_STRATEGY.md) ⚠️ **IMPORTANTE**

---

## Checklist de Validação Final

Use este checklist antes de considerar uma feature completa:

### Pré-Merge
- [ ] OpenSpec validada: `./scripts/validate-specs.sh <change-id>`
- [ ] Worktrees sincronizadas: `./scripts/sync-worktrees.sh <feature>`
- [ ] Testes passando em todas as worktrees
- [ ] Code review executado (usando `/code-review-ai:ai-review`)
- [ ] Security scan executado (usando `/security-scanning:security-sast`)

### Merge
- [ ] Dry-run passou: `./scripts/merge-worktrees.sh <feature> --dry-run`
- [ ] Merge executado: `./scripts/merge-worktrees.sh <feature>`
- [ ] Branch `merge/<feature>` criada
- [ ] Diff revisado: `git diff master`
- [ ] Testes finais passando

### Pós-Merge
- [ ] Merge para master executado
- [ ] Push para origin
- [ ] PR criada e aprovada
- [ ] Deploy planejado/executado
