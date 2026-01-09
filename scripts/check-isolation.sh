#!/bin/bash
# Verifica isolamento da worktree e relata potenciais problemas
# Uso: ./scripts/check-isolation.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          Verificação de Isolamento de Worktree                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

WORKTREE_PATH="${1:-"."}"

if [ ! -d "$WORKTREE_PATH" ]; then
    echo -e "${RED}❌ Worktree não encontrada: $WORKTREE_PATH${NC}"
    exit 1
fi

cd "$WORKTREE_PATH"

issues=0

# Check 1: .env.local existe
echo -n "[$(printf '%02d' $((issues + 1)))] .env.local isolado... "
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ PRESENTE${NC}"
    echo "     → Variáveis de ambiente isoladas"
else
    echo -e "${YELLOW}⚠ AUSENTE${NC}"
    echo "     → Recomendado: criar ./scripts/setup-worktree.sh"
    ((issues++))
fi

# Check 2: .env.local no está sendo commitado
echo -n "[$(printf '%02d' $((issues + 1)))] .env.local no git... "
if git check-ignore .env.local >/dev/null 2>&1; then
    echo -e "${GREEN}✓ IGNORADO${NC}"
else
    echo -e "${RED}✗ VAI SER COMMITADO!${NC}"
    echo "     → Adicione ao .gitignore.local ou .gitignore"
    ((issues++))
fi

# Check 3: Sessão Claude isolada
echo -n "[$(printf '%02d' $((issues + 1)))] Sessão Claude isolada... "
if [ -d ".claude.worktree" ]; then
    echo -e "${GREEN}✓ PRESENTE${NC}"
    echo "     → .claude.worktree/"
else
    echo -e "${YELLOW}⚠ AUSENTE${NC}"
    echo "     → Recomendado: usar ./scripts/setup-worktree.sh"
    ((issues++))
fi

# Check 4: node_modules isolado
echo -n "[$(printf '%02d' $((issues + 1)))] node_modules isolado... "
if [ -f "package.json" ]; then
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓ PRESENTE${NC}"
        echo "     → Dependências locais instaladas"
    else
        echo -e "${YELLOW}⚠ AUSENTE (não instalado)${NC}"
        echo "     → Execute 'npm install' na worktree"
    fi
else
    echo -e "${GREEN}⊘ N/A (sem package.json)${NC}"
fi

# Check 5: Build artifacts não sendo commitados
echo -n "[$(printf '%02d' $((issues + 1)))] Build artifacts ignorados... "
if git check-ignore .next/ out/ dist/ >/dev/null 2>&1 || [ ! -d ".next/" ]; then
    echo -e "${GREEN}✓ SEGURO${NC}"
else
    echo -e "${RED}✗ PODE SER COMMITADO!${NC}"
    echo "     → Adicione .next/ ao .gitignore"
    ((issues++))
fi

# Check 6: Sem dependências compartilhadas externas
echo -n "[$(printf '%02d' $((issues + 1)))] Nenhum symlink para fora... "
external_symlinks=$(find . -maxdepth 1 -type l 2>/dev/null | grep -v "^\./\.git" | grep -v "^\./\.claude" || true)
if [ -z "$external_symlinks" ]; then
    echo -e "${GREEN}✓ SEGURO${NC}"
else
    echo -e "${RED}✗ SYMLINKS EXTERNOS ENCONTRADOS!${NC}"
    echo "$external_symlinks"
    echo "     → Remova symlinks para fora da worktree"
    ((issues++))
fi

# Check 7: Git worktree config habilitado
echo -n "[$(printf '%02d' $((issues + 1)))] Git worktree config... "
if git config extensions.worktreeConfig true >/dev/null 2>&1 || git config --file .git/config worktree.worktree 2>/dev/null; then
    echo -e "${GREEN}✓ HABILITADO${NC}"
else
    echo -e "${YELLOW}⚠ DESABILITADO${NC}"
    echo "     → Recomendado: git config extensions.worktreeConfig true"
fi

# Check 8: Verificar se há .git compartilhado
echo -n "[$(printf '%02d' $((issues + 1)))] .git é worktree própria... "
if git rev-parse --git-common-dir >/dev/null 2>&1; then
    if [ "$(git rev-parse --git-common-dir)" = ".git" ]; then
        echo -e "${YELLOW}⚠ POSSÍVEL WORKTREE LINKADA${NC}"
        echo "     → Verifique com 'git worktree list'"
    else
        echo -e "${GREEN}✓ WORKTREE PRÓPRIA${NC}"
    fi
else
    echo -e "${YELLOW}⊘ NÃO É UM REPOSITÓRIO GIT${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $issues -eq 0 ]; then
    echo -e "${GREEN}✅ ISOLAMENTO COMPLETO${NC}"
    echo ""
    echo "A worktree está totalmente isolada. Nenhum problema detectado."
    exit 0
elif [ $issues -le 2 ]; then
    echo -e "${YELLOW}⚠️ ISOLAMENTO BÁSICO${NC}"
    echo ""
    echo "Encontrados $issues problemas menores. Recomendado corrigir."
    exit 0
else
    echo -e "${RED}❌ ISOLAMENTO PROBLEMÁTICO${NC}"
    echo ""
    echo "Encontrados $issues problemas. Corrija antes de continuar."
    exit 1
fi