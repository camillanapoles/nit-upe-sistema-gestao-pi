#!/bin/bash
# Script para sincronizar mudanças entre worktrees
# Uso: ./scripts/sync-worktrees.sh <feature-name>

set -e

FEATURE_NAME=${1:-"multi-agent-orchestration"}
PARENT_DIR="/mnt/cnmfs/Claude/Projects/Code-Terminal"
MAIN_WORKTREE="$PARENT_DIR/Prof_INPI"
BACKEND_WORKTREE="$PARENT_DIR/Prof_INPI-backend"
FRONTEND_WORKTREE="$PARENT_DIR/Prof_INPI-frontend"
SECURITY_WORKTREE="$PARENT_DIR/Prof_INPI-security"

echo "=== Sincronizando Worktrees: $FEATURE_NAME ==="

# Function para sync worktree
sync_worktree() {
    local WORKTREE=$1
    local BRANCH=$2

    if [ -d "$WORKTREE" ]; then
        echo ""
        echo "Syncing $BRANCH..."
        cd "$WORKTREE"
        git add -A
        git commit -m "WIP: Auto-sync from $BRANCH" || echo "Nothing to commit"
        git push origin "$BRANCH" || echo "Push failed or up-to-date"
    else
        echo "Worktree não existe: $WORKTREE"
    fi
}

# Sync cada worktree
sync_worktree "$BACKEND_WORKTREE" "feature/$FEATURE_NAME-backend"
sync_worktree "$FRONTEND_WORKTREE" "feature/$FEATURE_NAME-frontend"
sync_worktree "$SECURITY_WORKTREE" "feature/$FEATURE_NAME-security"

# Pull no main
echo ""
echo "Atualizando main..."
cd "$MAIN_WORKTREE"
git pull main

echo ""
echo "=== Sync Completo ==="
