<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

---

## 🔄 Multi-Agent Orchestration

This project supports **multi-agent orchestration** using CCManager, wshobson/agents marketplace, and MCP task-managers.

**Quick Start:**
```bash
# Iniciar orquestração para uma feature
./scripts/orchestrate.sh <change-id> --create-worktrees

# Iniciar CCManager
./scripts/start-ccmanager.sh
```

**Key Concepts:**
- **Worktrees**: Separate git worktrees for backend, frontend, and security
- **Task Managers**: kazuph-taskmanager (queue) + blizzy-taskmanager (create/decompose)
- **Agents**: Specialized agents from wshobson/agents marketplace
- **OpenSpec Integration**: Specs drive task creation and validation

**See `ORCHESTRATION.md` for complete documentation.**

### Setup Required (First Time)

1. **Install wshobson/agents marketplace:**
   ```bash
   /plugin marketplace add wshobson/agents
   /plugin install python-development
   /plugin install javascript-typescript
   /plugin install code-review-ai
   /plugin install security-scanning
   ```

2. **Create worktrees for parallel development:**
   ```bash
   ./scripts/create-worktrees.sh <feature-name>
   ```

3. **Start CCManager:**
   ```bash
   ./scripts/start-ccmanager.sh
   ```

### Available Scripts

| Script | Purpose |
|--------|---------|
| `orchestrate.sh` | Start full workflow |
| `create-worktrees.sh` | Create worktrees |
| `sync-worktrees.sh` | Sync changes between worktrees |
| `validate-specs.sh` | Validate OpenSpec specs |
| `start-ccmanager.sh` | Launch CCManager |

---