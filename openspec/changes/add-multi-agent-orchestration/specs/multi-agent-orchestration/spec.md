# Capability: Multi-Agent Orquestration

## ADDED Requirements

### Requirement: CCManager Integration
The system SHALL support multi-agent orchestration through CCManager to manage multiple Claude Code sessions simultaneously.

#### Scenario: Iniciar CCManager em modo multi-projeto
**Given** CCManager está instalado globalmente
**When** O usuário executa `ccmanager --multi-project` com root configurado
**Then** O CCManager exibe interface com todos os worktrees do projeto
**And** Cada worktree representa uma sessão Claude independente

#### Scenario: Criar nova worktree para domínio específico
**Given** O CCManager está ativo
**When** O usuário cria worktree via menu "New Worktree"
**And** Define branch `feature/backend-{feature-name}`
**Then** Uma nova sessão Claude é iniciada na worktree
**And** A worktree aparece no menu com status [idle]

### Requirement: wshobson/agents Marketplace
The system SHALL integrate the wshobson/agents marketplace providing 67 plugins with 99 specialized agents.

#### Scenario: Adicionar marketplace de agentes
**Given** Claude Code está ativo
**When** O usuário executa `/plugin marketplace add wshobson/agents`
**Then** O marketplace é adicionado com 67 plugins disponíveis
**And** O comando `/plugin` lista todos os plugins

#### Scenario: Instalar plugin especializado
**Given** O marketplace wshobson/agents está adicionado
**When** O usuário executa `/plugin install python-development`
**Then** O plugin python-development é instalado
**And** Os agentes python-pro, django-pro, fastapi-pro ficam disponíveis
**And** As 5 skills do plugin são carregadas sob demanda

### Requirement: MCP Task-Manager Orchestration
The system SHALL orchestrate tasks between agents through MCP task-managers (kazuph and blizzy).

#### Scenario: Planejar tarefas com kazuph-taskmanager
**Given** Uma feature é definida no OpenSpec
**When** O agente executa `action: plan` com lista de tarefas
**Then** O kazuph-taskmanager cria uma fila de execução
**And** Retorna o plano com task IDs e status

#### Scenario: Distribuir tarefas entre worktrees
**Given** O plano de tarefas foi criado
**When** CCManager tem 3+ worktrees ativas
**Then** Cada tarefa é atribuída a uma worktree disponível
**And** As tarefas executam em paralelo

#### Scenario: Completar tarefa e avançar fila
**Given** Uma tarefa está em execução
**When** O agente executa `action: complete` com task ID
**Then** A tarefa é removida da fila
**And** A próxima tarefa é retornada

### Requirement: OpenSpec Integration
The system SHALL integrate OpenSpec with task-managers to ensure specification compliance.

#### Scenario: Ler spec do OpenSpec e criar tarefas
**Given** Uma proposta existe em `openspec/changes/{id}/`
**When** O script `openspec-to-tasks.js` é executado
**Then** As tarefas são extraídas de `tasks.md`
**And** Tarefas são criadas no blizzy-taskmanager
**And** O plano é enviado ao kazuph-taskmanager

#### Scenario: Validação de spec antes de merge
**Given** Todas as tarefas de uma feature foram completadas
**When** O script `validate-specs.sh` é executado
**Then** `openspec validate --strict` é executado
**And** Merge é permitido apenas se validação passar

### Requirement: Worktree Synchronization
The system SHALL synchronize changes between worktrees automatically.

#### Scenario: Sincronizar worktree após tarefa completa
**Given** Uma worktree completou uma tarefa
**When** Status hook `onComplete` é disparado
**Then** Mudanças são pushadas para origin
**And** Worktree principal é atualizada
**And** Outras worktrees são notificadas

#### Scenario: Resolver conflitos entre worktrees
**Given** Duas worktrees modificaram o mesmo arquivo
**When** Sync é executado
**Then** Conflito é detectado
**And** CCManager exibe alerta visual
**And** Merge manual é necessário

### Requirement: Performance Metrics
The system SHALL measure performance gains from multi-agent orchestration.

#### Scenario: Medir tempo de execução paralela
**Given** Uma feature é desenvolvida com multi-agentes
**When** Todas as tarefas são completadas
**Then** O tempo total é registrado
**And** É comparado com execução sequencial
**And** Speedup é calculado (esperado: 3-5x)

#### Scenario: Medir qualidade do código
**Given** Uma feature é desenvolvida com multi-agentes
**When** Code-review agent valida
**Then** Métricas de qualidade são registradas
**And** Bugs encontrados pós-deploy são rastreados
