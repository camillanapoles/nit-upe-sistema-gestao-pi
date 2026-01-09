#!/bin/bash
# Script para merge de worktrees após validação completa
# Uso: ./scripts/merge-worktrees.sh <feature-name> [--dry-run]

set -e

FEATURE_NAME=${1:-"multi-agent-orchestration"}
DRY_RUN=${2:-""}
PARENT_DIR="/mnt/cnmfs/Claude/Projects/Code-Terminal"
MAIN_WORKTREE="$PARENT_DIR/Prof_INPI"
BACKEND_WORKTREE="$PARENT_DIR/Prof_INPI-backend"
FRONTEND_WORKTREE="$PARENT_DIR/Prof_INPI-frontend"
SECURITY_WORKTREE="$PARENT_DIR/Prof_INPI-security"

CHANGE_ID="add-${FEATURE_NAME}"
MERGE_BRANCH="merge/${FEATURE_NAME}"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           MERGE DE WORKTREES - Feature: $FEATURE_NAME        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

if [ "$DRY_RUN" = "--dry-run" ]; then
    echo -e "${YELLOW}⚠️  MODO DRY-RUN: Nenhuma mudança será executada${NC}"
    echo ""
fi

# ============================================================================
# CHECKLIST PRÉ-MERGE (Gatekeeping)
# ============================================================================
echo -e "${GREEN}📋 [CHECKLIST PRÉ-MERGE]${NC}"
echo ""

check_passed=true

# 1. Validar OpenSpec
echo -n "  [1/7] OpenSpec validada... "
if ./scripts/validate-specs.sh "$CHANGE_ID" >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    check_passed=false
fi

# 2. Verificar worktrees existem
echo -n "  [2/7] Worktrees existem... "
if [ -d "$BACKEND_WORKTREE" ] && [ -d "$FRONTEND_WORKTREE" ] && [ -d "$SECURITY_WORKTREE" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    check_passed=false
fi

# 3. Verificar branches estão limpas (sem uncommitted changes)
echo -n "  [3/7] Worktrees limpas... "
clean=true
for worktree in "$BACKEND_WORKTREE" "$FRONTEND_WORKTREE" "$SECURITY_WORKTREE"; do
    if ! git -C "$worktree" diff-index --quiet HEAD --; then
        clean=false
        break
    fi
done
if [ "$clean" = true ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ (uncommitted changes)${NC}"
    check_passed=false
fi

# 4. Verificar testes (placeholder para CI/CD)
echo -n "  [4/7] Testes passaram... "
echo -e "${YELLOW}⊘ (configure CI/CD integration)${NC}"

# 5. Verificar code review (placeholder)
echo -n "  [5/7] Code review aprovado... "
echo -e "${YELLOW}⊘ (configure PR workflow)${NC}"

# 6. Verificar main está atualizado
echo -n "  [6/7] Main branch atualizado... "
cd "$MAIN_WORKTREE"
if git fetch origin main >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    check_passed=false
fi

# 7. Backup antes do merge
echo -n "  [7/7] Backup criado... "
BACKUP_FILE="/tmp/backup-before-merge-$(date +%Y%m%d-%H%M%S).txt"
git rev-parse HEAD > "$BACKUP_FILE"
echo -e "${GREEN}✓ (SHA em $BACKUP_FILE)${NC}"

echo ""

if [ "$check_passed" = false ]; then
    echo -e "${RED}❌ CHECKLIST FALHOU - Abortando merge${NC}"
    echo ""
    echo "Corrija os problemas acima e tente novamente."
    exit 1
fi

if [ "$DRY_RUN" = "--dry-run" ]; then
    echo -e "${YELLOW}⚠️  DRY-RUN: Checklist passou, mas merge não executado${NC}"
    exit 0
fi

# ============================================================================
# ESTRATÉGIA DE MERGE (Squash Merge)
# ============================================================================
echo ""
echo -e "${GREEN}🔄 [EXECUTANDO MERGE]${NC}"
echo "Estratégia: Squash Merge (commits únicos por domínio)"
echo ""

cd "$MAIN_WORKTREE"

# Criar branch de merge
echo "Criando branch de merge: $MERGE_BRANCH"
git checkout -b "$MERGE_BRANCH" main 2>/dev/null || git checkout "$MERGE_BRANCH"

# Merge de cada worktree com squash
merge_worktree() {
    local WORKTREE=$1
    local BRANCH=$2
    local DOMAIN=$3

    echo ""
    echo "Merge $DOMAIN..."

    # Fetch branch
    git fetch "$WORKTREE" "$BRANCH:$BRANCH" 2>/dev/null || true

    # Squash merge
    if git merge --squash "$BRANCH" 2>/dev/null; then
        git commit -m "feat($DOMAIN): Merge $BRANCH para $FEATURE_NAME

- Implementações de $DOMAIN para feature $FEATURE_NAME
- Validado conforme OpenSpec $CHANGE_ID
- Worktree: $WORKTREE
" 2>/dev/null || echo "  (nada para merge de $DOMAIN)"
    else
        echo "  ⚠️  Conflitos em $DOMAIN - resolva manualmente"
        return 1
    fi
}

# Executar merges sequencialmente
merge_worktree "$BACKEND_WORKTREE" "feature/$FEATURE_NAME-backend" "backend"
merge_worktree "$FRONTEND_WORKTREE" "feature/$FEATURE_NAME-frontend" "frontend"
merge_worktree "$SECURITY_WORKTREE" "feature/$FEATURE_NAME-security" "security"

echo ""
echo -e "${GREEN}✓ Merge completo em branch: $MERGE_BRANCH${NC}"
echo ""
echo "Próximos passos:"
echo "  1. Review as mudanças: git diff main"
echo "  2. Execute testes: npm test"
echo "  3. Merge para main: git checkout main && git merge $MERGE_BRANCH"
echo "  4. Push: git push origin $MERGE_BRANCH e abra PR"
echo ""
echo "Para rollback:"
echo "  git reset --hard $MAIN_WORKTREE/main"

# ============================================================================
# PÓS-MERGE
# ============================================================================
echo ""
echo -e "${GREEN}🧹 [PÓS-MERGE]${NC}"
echo ""

# Opcional: Limpar worktrees após merge bem-sucedido
read -p "Deseja remover worktrees? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removendo worktrees..."
    git worktree remove "$BACKEND_WORKTREE" 2>/dev/null || true
    git worktree remove "$FRONTEND_WORKTREE" 2>/dev/null || true
    git worktree remove "$SECURITY_WORKTREE" 2>/dev/null || true
    echo "Worktrees removidas."
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    MERGE CONCLUÍDO!                            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
