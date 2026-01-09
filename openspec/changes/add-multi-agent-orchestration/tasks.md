# Tasks: Implementar Orquestração Multi-Agentes

## Task 1: Instalar e Configurar CCManager ✅
- [x] Instalar CCManager globalmente: `npm install -g ccmanager` (v3.2.8)
- [x] Configurar multi-project root: `/mnt/cnmfs/Claude/Projects/Code-Terminal`
- [x] Criar diretório de projetos se não existir
- [x] Testar ccmanager com `ccmanager --version`

## Task 2: Adicionar wshobson/agents Marketplace ⏳
- [ ] `/plugin marketplace add wshobson/agents` (usuário deve executar no CLI)
- [ ] Verificar plugins disponíveis com `/plugin`
- [ ] Instalar plugins essenciais:
  - [ ] `/plugin install python-development`
  - [ ] `/plugin install javascript-typescript`
  - [ ] `/plugin install code-review-ai`
  - [ ] `/plugin install security-scanning`
- [ ] Testar um agente: `/python-development:python-pro --help`
> **Nota**: wshobson/agents marketplace requer instalação manual via Claude Code CLI.
> Documentação fornecida em `scripts/README.md` e `ORCHESTRATION.md`.

## Task 3: Criar Estrutura de Worktrees ✅
- [x] Habilitar git worktree config: `git config extensions.worktreeConfig true`
- [x] Criar script `scripts/create-worktrees.sh` para criação automatizada
- [x] Criar script `scripts/sync-worktrees.sh` para sincronização
- [x] Validar scripts: `ls -la scripts/`
> **Nota**: Worktrees são criadas sob demanda por feature. Use `./scripts/create-worktrees.sh <feature-name>`.

## Task 4: Configurar CCManager para o Projeto ✅
- [x] Criar script `scripts/start-ccmanager.sh` com configuração do projeto
- [x] Configurar variável de ambiente `CCMANAGER_MULTI_PROJECT_ROOT`
- [x] Documentar atalhos e uso
> **Nota**: Configuração está no nível do projeto via script, não global.

## Task 5: Integrar Task-Managers com OpenSpec ✅
- [x] MCP task-managers já instalados (kazuph + blizzy)
- [x] Documentar integração em `ORCHESTRATION.md`
- [x] Criar script `scripts/validate-specs.sh` para validação
- [x] Criar script `scripts/orchestrate.sh` com workflow completo
> **Nota**: Task-managers MCP são usados diretamente nas sessões Claude.

## Task 6: Criar Scripts de Orquestração ✅
- [x] `scripts/orchestrate.sh` - Inicia workflow multi-agente
- [x] `scripts/sync-worktrees.sh` - Sincroniza mudanças entre worktrees
- [x] `scripts/validate-specs.sh` - Valida specs OpenSpec
- [x] `scripts/start-ccmanager.sh` - Inicia CCManager
- [x] `scripts/create-worktrees.sh` - Cria worktrees
- [x] `scripts/README.md` - Documentação dos scripts

## Task 7: Documentação e Testes ✅
- [x] Atualizar CLAUDE.md com instruções de orquestração
- [x] Criar guia: ORCHESTRATION.md
- [x] Documentar troubleshooting
- [x] Criar exemplos de uso
> **Nota**: Testes completos requerem wshobson/agents marketplace instalado.

## Task 8: Validação Final ⏳
- [ ] Executar workflow completo ponta a ponta (requer marketplace instalado)
- [ ] Verificar paralelização funcionando (requer worktrees criadas)
- [ ] Validar integração OpenSpec
- [ ] Medir ganho de tempo
> **Nota**: Validação completa depende de instalação do wshobson/agents marketplace pelo usuário.
