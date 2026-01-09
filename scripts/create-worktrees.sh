#!/bin/bash
# Script para criar worktrees de desenvolvimento paralelo
# Uso: ./scripts/create-worktrees.sh <feature-name>

set -e

FEATURE_NAME=${1:-"multi-agent-orchestration"}
PROJECT_ROOT="/mnt/cnmfs/Claude/Projects/Code-Terminal/Prof_INPI"
PARENT_DIR="/mnt/cnmfs/Claude/Projects/Code-Terminal"

echo "=== Criando Worktrees para Feature: $FEATURE_NAME ==="

# Habilitar worktree config
echo "Habilitando git worktree config..."
git config extensions.worktreeConfig true

# Criar worktrees
echo ""
echo "Criando worktree BACKEND..."
git worktree add -b "feature/$FEATURE_NAME-backend" "$PARENT_DIR/Prof_INPI-backend" master

echo "Criando worktree FRONTEND..."
git worktree add -b "feature/$FEATURE_NAME-frontend" "$PARENT_DIR/Prof_INPI-frontend" master

echo "Criando worktree SECURITY..."
git worktree add -b "feature/$FEATURE_NAME-security" "$PARENT_DIR/Prof_INPI-security" master

echo ""
echo "=== Worktrees Criadas ==="
git worktree list

echo ""
echo "Para iniciar CCManager:"
echo "  CCMANAGER_MULTI_PROJECT_ROOT=$PARENT_DIR ccmanager --multi-project"
