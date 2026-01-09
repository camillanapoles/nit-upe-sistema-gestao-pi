# Estratégia de Merge - Multi-Agent Orchestration

Este documento define a estratégia de merge para worktrees distribuídas, garantindo que todas as mudanças sejam integradas de forma segura e rastreável.

## Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                     WORKFLOW COMPLETO                           │
└─────────────────────────────────────────────────────────────────┘

   Planejamento              Execução Paralela           Merge
        │                        │                        │
        ▼                        ▼                        ▼
   ┌─────────┐           ┌──────────┐            ┌─────────────┐
   │ OpenSpec│           │Worktrees │            │  Checklist  │
   │ Spec    │──────────▶│  Isoladas│───────────▶│  Pré-Merge  │
   └─────────┘           └──────────┘            └──────┬──────┘
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │   Squash    │
                                            │   Merge     │
                                            └──────┬──────┘
                                                   │
                                                   ▼
                                            ┌─────────────┐
                                            │   PR para   │
                                            │   main      │
                                            └─────────────┘
```

## Estratégia de Merge: Squash Merge

### Por que Squash Merge?

| Critério | Squash Merge | Merge Commit | Rebase |
|----------|--------------|--------------|---------|
| Histórico limpo | ✅ | ❌ | ❌ |
| Flexibilidade | ✅ | ⚠️ | ❌ |
| Debugging | ⚠️ | ✅ | ✅ |
| Conflitos | ✅ | ⚠️ | ❌ |

**Decisão**: Squash Merge para manter histórico limpo em `main`, preservando histórico detalhado nas worktrees.

## Processo de Merge

### Fase 1: Pré-Merge (Gatekeeping)

```bash
# Executar checklist de validação
./scripts/merge-worktrees.sh <feature-name> --dry-run
```

**Checklist Obrigatório:**
- [ ] OpenSpec validada
- [ ] Worktrees existem e são alcançáveis
- [ ] Worktrees limpas (sem uncommitted changes)
- [ ] Testes passaram (placeholder para CI/CD)
- [ ] Code review aprovado (placeholder para PR)
- [ ] Main branch atualizado
- [ ] Backup criado

### Fase 2: Execução do Merge

```bash
# Executar merge
./scripts/merge-worktrees.sh <feature-name>
```

**Estratégia:**
1. Criar branch `merge/<feature-name>`
2. Squash merge de cada worktree sequencialmente:
   - `feature/<name>-backend` → commit único "feat(backend)"
   - `feature/<name>-frontend` → commit único "feat(frontend)"
   - `feature/<name>-security` → commit único "feat(security)"
3. Preservar autor original nos commits

### Fase 3: Pós-Merge

```bash
# Review mudanças
git checkout merge/<feature-name>
git diff master

# Testar (executar em environment limpo)
npm test
npm run build

# Merge para main
git checkout master
git merge merge/<feature-name>
git push origin merge/<feature-name>

# Abrir PR para revisão final
gh pr create --title "feat: <feature-name>" --body "Merge de worktrees"
```

## Resolução de Conflitos

### Estratégia

Quando ocorrem conflitos durante merge:

```bash
# 1. Identificar worktree com conflito
git status

# 2. Resolver conflito interativamente
git merge --squash feature/<name>-<domain>
# Resolver arquivos conflitantes
git add .
git commit -m "feat(<domain>): Merge com resolução de conflitos"

# 3. Continuar com próximos worktrees
```

### Prioridade de Resolução

1. **Backend** → Base de dados e API mudanças primeiro
2. **Frontend** → Componentes dependem de tipos backend
3. **Security** → Pode sobrescrever validações

## Rollback Plan

### Se merge falhar:

```bash
# 1. Restaurar main para estado anterior
git checkout master
git reset --hard <backup-sha>

# 2. Limpar branch de merge
git branch -D merge/<feature-name>

# 3. Reavaliar worktrees
./scripts/sync-worktrees.sh <feature-name>

# 4. Corrigir problemas e tentar novamente
```

### Se problemas em produção:

```bash
# Revert merge commit
git revert <merge-commit-sha>
git push origin master

# Hotfix em branch separada
git checkout -b hotfix/<issue>
# ... corrigir ...
git push origin hotfix/<issue>
```

## Integração CI/CD (TODO)

### Gates Futuros

- [ ] Testes automatizados em cada worktree
- [ ] Linting e type checking
- [ ] Security scan (SAST/DAST)
- [ ] Performance benchmarks
- [ ] Deploy para staging environment

### Pipeline Proposto

```yaml
# .github/workflows/merge-gate.yml
name: Merge Gate

on:
  pull_request:
    branches: [master]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Validate OpenSpec
        run: ./scripts/validate-specs.sh ${{ github.event.pull_request.title }}

      - name: Run tests
        run: npm test

      - name: Security scan
        run: npm audit

      - name: Build
        run: npm run build
```

## Rastreabilidade

### Mensagem de Commit Padronizada

```
feat(<domain>): Merge <feature-name>

- Implementações de <domain> para feature <feature-name>
- Validado conforme OpenSpec <change-id>
- Worktree: <worktree-path>
- Task: <task-manager-id>

Co-authored-by: <agent-name> <agent-type>
```

### Links para Rastreabilidade

- OpenSpec: `openspec/changes/<change-id>/`
- CCManager Session: `/tmp/orchestration-<change-id>.txt`
- Task Manager: `<task-id>`

## Checklist Final

Antes de considerar merge completo:

- [ ] Todas as worktrees mergeadas
- [ ] Testes passando em main
- [ ] Build sucedido
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Changelog atualizado
- [ ] Tags/semaforos aplicados
- [ ] Deploy planejado

## Referências

- [Git Merge Strategies](https://git-scm.com/docs/merge-strategies)
- [Squash Merge Best Practices](https://www.atlassian.com/git/tutorials/using-branches/merge-strategies)
- [OpenSpec Documentation](../openspec/AGENTS.md)
