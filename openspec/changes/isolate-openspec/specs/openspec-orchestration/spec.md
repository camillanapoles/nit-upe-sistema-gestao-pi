# Capability: OpenSpec Orchestration

## ADDED Requirements

### Requirement: OpenSpec Single Writer
The OpenSpec SHALL support a single-writer model where only one agent at a time can edit proposals, while multiple agents can read simultaneously.

#### Scenario: Acquire exclusive lock for editing
**Given** OpenSpec lock file does not exist or is expired
**When** Orchestrator agent executes lock acquire command
**Then** Lock is granted with current agent ID and timestamp
**And** `.openspec-lock` file is created

#### Scenario: Block concurrent edits
**Given** OpenSpec is locked by another agent
**When** A different agent attempts to acquire lock
**Then** Lock is denied with error message
**And** Current lock holder and timestamp are displayed

#### Scenario: Allow multiple readers
**Given** OpenSpec is locked
**When** Multiple agents read proposals or specs
**Then** All reads succeed without blocking
**And** Read operations do not require lock

### Requirement: Lock Timeout
The OpenSpec lock system SHALL implement automatic timeout to prevent stale locks.

#### Scenario: Auto-release after timeout
**Given** OpenSpec is locked
**When** Lock age exceeds 30 minutes
**Then** Lock is automatically released
**And** Next agent can acquire lock

#### Scenario: Refresh active lock
**Given** Agent holds current lock
**When** Agent executes lock refresh command
**Then** Lock timestamp is updated
**And** Timeout counter resets

### Requirement: Lock Validation
The OpenSpec SHALL validate lock status before allowing write operations.

#### Scenario: Validate before proposal edit
**Given** Orchestrator agent attempts to edit proposal.md
**When** Lock validation runs
**Then** Operation proceeds only if lock is held by current agent
**Otherwise** Operation is blocked with error

#### Scenario: Validate before merge
**Given** merge-worktrees.sh is executed
**When** Lock validation runs
**Then** Script acquires lock if available
**And** Proceeds with merge operations
**And** Releases lock after completion

### Requirement: Orchestrator Agent Pattern
The system SHALL define the Orchestrator Agent pattern where a single agent coordinates OpenSpec operations.

#### Scenario: Orchestrator acquires lock for planning
**Given** New feature needs to be planned
**When** Orchestrator agent starts planning phase
**Then** Agent acquires OpenSpec lock
**And** Creates or updates proposal.md
**And** Creates tasks.md with task breakdown
**And** Releases lock after planning complete

#### Scenario: Workers read without lock
**Given** Worker agents need to understand requirements
**When** Workers read OpenSpec proposals
**Then** Read operations succeed without acquiring lock
**And** Multiple workers can read simultaneously

#### Scenario: Orchestrator validates completion
**Given** Worker agents complete their tasks
**When** Orchestrator starts merge phase
**Then** Agent acquires OpenSpec lock
**And** Validates all tasks completed
**And** Updates tasks.md with completion status
**And** Executes merge-worktrees.sh
**And** Releases lock after merge

### Requirement: Lock Status Monitoring
The system SHALL provide visibility into OpenSpec lock status.

#### Scenario: Show current lock status
**Given** Agent needs to know OpenSpec status
**When** openspec-status.sh is executed
**Then** Displays current lock holder (if locked)
**And** Displays lock age
**And** Displays active worktrees
**And** Displays changes in progress

#### Scenario: Detect stale lock
**Given** Lock exists but is expired
**When** openspec-status.sh is executed
**Then** Displays lock as STALE
**And** Offers option to force release

### Requirement: Worker Agent Isolation
Worker agents SHALL NOT edit OpenSpec directly, only read.

#### Scenario: Worker reads spec for implementation
**Given** Worker agent is assigned a task
**When** Worker reads proposal.md and tasks.md
**Then** Read succeeds without lock
**And** Worker proceeds to implement in worktree

#### Scenario: Worker reports completion (no OpenSpec edit)
**Given** Worker agent completes a task
**When** Worker reports completion
**Then** Worker does NOT edit tasks.md directly
**And** Worker signals Orchestrator (via MCP or file)
**And** Orchestrator updates OpenSpec with lock

### Requirement: Concurrent Read Support
The OpenSpec SHALL support unlimited concurrent readers without performance degradation.

#### Scenario: Multiple workers read simultaneously
**Given** 3+ worker agents need to read specs
**When** All agents read proposal.md simultaneously
**Then** All reads succeed without blocking
**And** No performance degradation occurs
