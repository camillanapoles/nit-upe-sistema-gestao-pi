#!/bin/bash
# Script principal de orquestração multi-agente
# Uso: ./scripts/orchestrate.sh <change-id> [--create-worktrees]

set -e

CHANGE_ID=$1
CREATE_WORKTREES=${2:-""}

FEATURE_NAME="${CHANGE_ID#add-}"
FEATURE_NAME="${FEATURE_NAME#update-}"
PROJECT_ROOT="/mnt/cnmfs/Claude/Projects/Code-Terminal"
PARENT_DIR="/mnt/cnmfs/Claude/Projects/Code-Terminal"

if [ -z "$CHANGE_ID" ]; then
    echo "Uso: $0 <change-id> [--create-worktrees]"
    echo ""
    echo "Exemplo:"
    echo "  $0 add-sistema-anexos"
    echo "  $0 add-sistema-anexos --create-worktrees"
    echo ""
    echo "Changes disponíveis:"
    openspec list --changes 2>/dev/null || ls -1 openspec/changes/ | grep -v archive
    exit 1
fi

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Orquestração Multi-Agentes - Feature: $CHANGE_ID      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 1. Validar spec
echo "📋 [1/5] Validando spec OpenSpec..."
./scripts/validate-specs.sh "$CHANGE_ID"
echo ""

# 2. Criar worktrees se solicitado
if [ "$CREATE_WORKTREES" = "--create-worktrees" ]; then
    echo "🌳 [2/5] Criando worktrees..."
    ./scripts/create-worktrees.sh "$FEATURE_NAME"
    echo ""
else
    echo "🌳 [2/5] Worktrees (use --create-worktrees para criar)..."
    git worktree list || echo "Nenhuma worktree criada ainda"
    echo ""
fi

# 3. Ler tarefas da spec
echo "📝 [3/5] Tarefas da spec:"
if [ -f "openspec/changes/$CHANGE_ID/tasks.md" ]; then
    grep -E "^\- \[ \]" "openspec/changes/$CHANGE_ID/tasks.md" | head -10
    echo "   ..."
else
    echo "   Arquivo tasks.md não encontrado"
fi
echo ""

# 4. Instruir sobre task-managers
echo "🔄 [4/5] Orquestração com MCP Task-Managers:"
echo ""
echo "   Kazuph TaskManager (fila):"
echo "   - action: plan → criar fila de tarefas"
echo "   - action: execute → executar próxima tarefa"
echo "   - action: complete → marcar tarefa como completa"
echo ""
echo "   Blizzy TaskManager (criação/decomposição):"
echo "   - create_task → criar nova tarefa"
echo "   - decompose_task → dividir em sub-tarefas"
echo ""

# 5. Instruir sobre CCManager
echo "🚀 [5/5] Iniciando CCManager..."
echo ""
echo "   Execute:"
echo "   CCMANAGER_MULTI_PROJECT_ROOT=$PARENT_DIR ccmanager --multi-project"
echo ""
echo "   Ou use o atalho:"
echo "   ./scripts/start-ccmanager.sh"
echo ""

# Criar arquivo de instruções para a sessão
cat > "/tmp/orchestration-$CHANGE_ID.txt" << EOF
# Orquestração: $CHANGE_ID

## Worktrees Disponíveis
- Backend: $PARENT_DIR/Prof_INPI-backend
- Frontend: $PARENT_DIR/Prof_INPI-frontend
- Security: $PARENT_DIR/Prof_INPI-security

## Agentes por Worktree
- Backend: /python-development:fastapi-pro ou /python-development:django-pro
- Frontend: /javascript-typescript:typescript-pro
- Security: /security-scanning:security-hardening
- Review: /code-review-ai:ai-review

## Fluxo de Trabalho
1. Ler spec: /read openspec/changes/$CHANGE_ID/proposal.md
2. Criar tarefas: blizzy-taskmanager create "$CHANGE_ID"
3. Planejar: kazuph-taskmanager plan [lista de tarefas]
4. Distribuir entre worktrees via CCManager
5. Executar em paralelo
6. Sincronizar: ./scripts/sync-worktrees.sh $FEATURE_NAME
7. Validar: ./scripts/validate-specs.sh $CHANGE_ID
8. Merge quando completo

## MCPs Auxiliares
- zread: Ler arquivos do GitHub
- web-search-prime: Buscar informações
- browser-tools: Testar UI
- puppeteer: Automatizar browser
EOF

echo "📄 Instruções salvas em: /tmp/orchestration-$CHANGE_ID.txt"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    Pronto para orquestrar!                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
