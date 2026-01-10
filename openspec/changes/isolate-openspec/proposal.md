# Change: Isolar OpenSpec como Orquestrador Central

## Why

A arquitetura atual de multi-agentes tem um **gap crítico**: múltiplos agentes podem tentar editar o OpenSpec simultaneamente, causando conflitos, sobrescrita de mudanças e validações inconsistentes.

**Problemas identificados:**
- Conflito de merge nas proposals quando múltiplos agentes editam
- Sobrescrita acidental de mudanças em `tasks.md`
- Race condition no `openspec apply`
- Validações inconsistentes entre agentes

**Solução:** Isolar OpenSpec como "orquestrador central" onde apenas 1 agente edita por vez.

## What Changes

- **ISOLAR** OpenSpec em branch dedicado (`openspec/main`) ou repositório separado
- **ADICIONAR** sistema de lock (`.openspec-lock`) para prevenir edição simultânea
- **DEFINIR** padrão: agentes trabalham em worktrees (readonly no OpenSpec)
- **CRIAR** papel de "Orchestrator Agent" que coordena via OpenSpec
- **ATUALIZAR** scripts para respeitar o lock

**BREAKING:** Não - melhoria de arquitetura, compatível com existente.

## Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────────┐
│                  OPENSPEC (BRANCH ISOLADO)                     │
│                  openspec/main ou repo separado               │
│                                                                 │
│  ⚠️ SINGLE WRITER - Apenas 1 agente edita por vez           │
│  ✓ MULTI-READER - Todos os agentes leem simultaneamente      │
└─────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼ (lock)                         ▼ (read-only)
┌──────────────────────────┐         ┌──────────────────────────┐
│   ORCHESTRATOR AGENT     │         │   WORKER AGENTS          │
│   (único editor)         │         │   (múltiplos, readonly)   │
├──────────────────────────┤         ├──────────────────────────┤
│ • Adquire lock           │         │ • Leem specs              │
│ • Edita proposals        │         │ • Trabalham em worktrees  │
│ • Valida tasks.md       │         │ • Implementam código       │
│ • Executa merge         │         │ • Reportam progresso       │
│ • Libera lock           │         │                          │
└──────────────────────────┘         └──────────────────────────┘
```

## Sistema de Lock

### `.openspec-lock`

```json
{
  "version": "1.0",
  "locked_by": "orchestrate@session-abc123",
  "locked_at": "2025-01-09T20:00:00Z",
  "change_id": "add-sistema-anexos",
  "reason": "Aplicando changes add-sistema-anexos"
}
```

### Script de Lock: `scripts/openspec-lock.sh`

```bash
# Adquirir lock
./scripts/openspec-lock.sh acquire "Aplicando add-sistema-anexos"

# Editar OpenSpec
# ... trabalha ...

# Liberar lock
./scripts/openspec-lock.sh release
```

## Padrão de Uso com Multi-Agentes

### Fase 1: Planning (Orchestrator - Agent Único)

```bash
# 1. Orchestrator adquire lock
./scripts/openspec-lock.sh acquire "Planning add-sistema-anexos"

# 2. Cria/actualiza proposal
openspec proposal add-nova-feature

# 3. Libera lock
./scripts/openspec-lock.sh release
```

### Fase 2: Distribution (Read-only para todos)

```bash
# Todos os agentes leem a spec (sem lock)
cat openspec/changes/add-sistema-anexos/proposal.md
```

### Fase 3: Execution (Worker Agents - Multi-paralelo)

```
Worktree Backend              Worktree Frontend
     │                              │
     ▼                              ▼
Agent Backend                  Agent Frontend
(readonly OpenSpec)            (readonly OpenSpec)
     │                              │
     ├─ Implementa API              ├─ Implementa UI
     └─ Reporta: "Task 1 completo"   └─ Reporta: "Task 2 completo"
```

### Fase 4: Merge (Orchestrator - Agent Único)

```bash
# 1. Orchestrator adquire lock
./scripts/openspec-lock.sh acquire "Merge add-sistema-anexos"

# 2. Valida e atualiza tasks.md
./scripts/validate-specs.sh add-sistema-anexos
# marca tarefas como completas

# 3. Executa merge
./scripts/merge-worktrees.sh sistema-anexos

# 4. Libera lock
./scripts/openspec-lock.sh release
```

## Implementação

### Scripts Novos

- `scripts/openspec-lock.sh` - Gerencia lock do OpenSpec
- `scripts/openspec-status.sh` - Mostra status do lock
- Atualização de `merge-worktrees.sh` para respeitar lock

### Branch Isolado (Opção A)

```bash
# Criar branch isolado
git checkout -b openspec/main
mkdir openspec && git mv openspec/ openspec/
git commit -m "Isolar OpenSpec como orquestrador central"
```

### Repositório Separado (Opção B - Recomendada)

```bash
# Criar repo separado
mkdir ../Prof_INPI-openspec
cd ../Prof_INPI-openspec
git init
# Adicionar openspec/ como conteúdo
```

## Critérios de Sucesso

- ✅ OpenSpec isolado em branch/repo separado
- ✅ Sistema de lock implementado
- ✅ Padrão definido: 1 editor, N leitores
- ✅ Scripts atualizados para respeitar lock
- ✅ Documentação atualizada

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Sobrecarga no orchestrator | Filas de tarefas via MCP task-managers |
| Lock esquecido (stale) | Timeout automático (30min) |
| Fork do OpenSpec | Rebase periódico |

## Alternativas Consideradas

| Opção | Prós | Contras |
|-------|------|--------|
| Branch isolado | Simples, mesmo repo | Confuso com código |
| **Repositório separado** | **Limpo, versionamento independente** | **Repo extra gerenciar** |
| Lock file only | Implementação rápida | Não previne conflitos git |

**Decisão**: Recomendado repositório separado para maior clareza.
