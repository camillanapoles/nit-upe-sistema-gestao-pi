# Tasks: Isolar OpenSpec como Orquestrador Central

## Task 1: Criar Estrutura de Lock
- [ ] Criar script `scripts/openspec-lock.sh` com:
  - [ ] Comando `acquire` - Adquire lock do OpenSpec
  - [ ] Comando `release` - Libera lock do OpenSpec
  - [ ] Comando `status` - Mostra status atual do lock
  - [ ] Timeout automático (30min de inatividade)
  - [ ] Detecção de lock stale (liberar após timeout)

## Task 2: Implementar Sistema de Lock
- [ ] Criar arquivo `.openspec-lock` na raiz do OpenSpec
- [ ] Formato JSON com campos:
  - [ ] `locked_by` - Identificação do agente/sessão
  - [ ] `locked_at` - Timestamp do lock
  - [ ] `change_id` - Change sendo editado
  - [ ] `reason` - Motivo do lock
- [ ] Validação de lock antes de editar proposals
- [ ] Validação de lock antes de executar merge

## Task 3: Atualizar Scripts para Respeitar Lock
- [ ] `scripts/merge-worktrees.sh`:
  - [ ] Verificar lock antes de executar
  - [ ] Adquirir lock automaticamente
  - [ ] Liberar lock após merge
- [ ] `scripts/orchestrate.sh`:
  - [ ] Verificar lock antes de criar worktrees
  - [ ] Adquirir lock para a sessão
- [ ] `scripts/validate-specs.sh`:
  - [ ] Funciona em modo read-only (sem lock)
  - [ ] Apenas escrita requer lock

## Task 4: Criar Script de Status
- [ ] `scripts/openspec-status.sh`:
  - [ ] Mostra status atual do lock
  - [ ] Lista worktrees ativas
  - [ ] Mostra changes em progresso
  - [ ] Identifica locks stale

## Task 5: Definir Padrão de Uso
- [ ] Documentar papel de "Orchestrator Agent"
- [ ] Documentar papel de "Worker Agents"
- [ ] Criar guia: "Como orquestrar multi-agentes"
- [ ] Atualizar ORCHESTRATION.md com padrões

## Task 6: Isolar OpenSpec (Opcional - Repo Separado)
- [ ] Avaliar opção A: Branch isolado
- [ ] Avaliar opção B: Repositório separado (recomendado)
- [ ] Implementar opção escolhida
- [ ] Atualizar scripts para nova localização
- [ ] Migrar proposals existentes

## Task 7: Testar Fluxo Completo
- [ ] Testar acquire/release de lock
- [ ] Testar timeout de lock
- [ ] Testar múltiplos agentes lendo simultaneamente
- [ ] Testar bloqueio de edição simultânea
- [ ] Testar fluxo completo: plan → distribute → merge

## Task 8: Documentação
- [ ] Atualizar CLAUDE.md com novo padrão
- [ ] Atualizar ORCHESTRATION.md
- [ ] Criar diagrama de arquitetura atualizado
- [ ] Documentar troubleshooting de lock
