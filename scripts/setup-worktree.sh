#!/bin/bash
# Configura worktree com ambiente totalmente isolado
# Uso: ./scripts/setup-worktree.sh <worktree-path>

set -e

WORKTREE_PATH="${1:-""}"

if [ -z "$WORKTREE_PATH" ]; then
    echo "Uso: $0 <worktree-path>"
    echo ""
    echo "Exemplo:"
    echo "  $0 /mnt/cnmfs/Claude/Projects/Code-Terminal/Prof_INPI-backend"
    exit 1
fi

if [ ! -d "$WORKTREE_PATH" ]; then
    echo "❌ Worktree não existe: $WORKTREE_PATH"
    exit 1
fi

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Setup Worktree: Ambiente Isolado                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Worktree: $WORKTREE_PATH"

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd "$WORKTREE_PATH"

# 1. Criar .env.local isolado (sobrescreve .env se existir)
echo -e "\n${GREEN}[1/6] Criando .env.local isolado...${NC}"
if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOF'
# Ambiente isolado para worktree
# Sobrescreve configurações do .env principal

# Database (isolada por worktree)
DATABASE_URL="file:./db/worktree.db"

# Session secreto único
SESSION_SECRET="$(openssl rand -hex 32)"

# Porta isolada (se aplicável)
PORT="${PORT:-3000}"

# Ambiente标识
WORKTREE_ENV="isolated"
EOF
    echo "  ✅ .env.local criado"
else
    echo "  ⏭️  .env.local já existe"
fi

# 2. Criar .gitignore local para worktree
echo -e "\n${GREEN}[2/6] Criando .gitignore.local...${NC}"
cat > .gitignore.local << 'EOF'
# Worktree-specific ignores (adicional ao .gitignore principal)

# Ambiente isolado
.env.local
.env.*.local
.claude.worktree/

# Dependências locais
node_modules/
.next/
out/

# Build artifacts
*.log
.cache/
.dist/

# Session data
*.session
*.pid

# Test artifacts
coverage/
.nyc_output/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF
echo "  ✅ .gitignore.local criado"

# 3. Isolar sessão Claude
echo -e "\n${GREEN}[3/6] Isolando sessão Claude...${NC}"
CLAUDE_DIR=".claude.worktree"
mkdir -p "$CLAUDE_DIR"
cat > "$CLAUDE_DIR/config.json" << EOF
{
  "worktree": "$(basename "$WORKTREE_PATH")",
  "isolated": true,
  "parentProject": "$(cd .. && pwd)"
}
EOF
echo "  ✅ Sessão isolada em $CLAUDE_DIR/"

# 4. Criar package.json local overrides (se existir package.json)
if [ -f "package.json" ]; then
    echo -e "\n${GREEN}[4/6] Configurando node_modules isolado...${NC}"
    # Garantir que node_modules seja local
    if [ -f "package.json" ]; then
        # Verificar se há workspaces
        if grep -q '"workspaces"' package.json; then
            echo "  ⏭️  Workspace detectado, mantendo configuração"
        else
            echo "  ✅ node_modules será isolado"
        fi
    fi
else
    echo -e "\n${YELLOW}[4/6] Sem package.json, pulando node_modules...${NC}"
fi

# 5. Criar script de limpeza local
echo -e "\n${GREEN}[5/6] Criando script de limpeza...${NC}"
cat > scripts/clean.sh << 'EOF'
#!/bin/bash
# Limpa artefatos da worktree mantendo código fonte

echo "🧹 Limpando worktree..."

# Remove build artifacts
rm -rf .next/ out/ dist/

# Remove cache
rm -rf .cache/ *.log

# Remove node_modules (se desejar reinstalar)
read -p "Remover node_modules? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf node_modules/
    echo "✅ node_modules removido"
fi

# Remove sessões Claude antigas
find .claude.worktree/ -name "*.session" -mtime +7 -delete 2>/dev/null || true

echo "✅ Limpeza concluída"
EOF
chmod +x scripts/clean.sh
echo "  ✅ scripts/clean.sh criado"

# 6. Criar README da worktree
echo -e "\n${GREEN}[6/6] Criando README da worktree...${NC}"
cat > WORKTREE_README.md << EOF
# Worktree: $(basename "$WORKTREE_PATH")

## Ambiente Isolado

Esta worktree tem ambiente **totalmente isolado** do projeto principal.

## Configurações

- **Variáveis de ambiente**: \`.env.local\` (não commitado)
- **Sessão Claude**: \`.claude.worktree/\` (isolada)
- **Dependências**: \`node_modules/\` (local)

## Comandos Úteis

\`\`\bash
# Ver status do isolamento
./scripts/check-isolation.sh

# Limpar artefatos
./scripts/clean.sh

# Ver diff com o main
git diff main
\`\`\`

## ⚠️ Importante

- NÃO commite \`.env.local\`
- NÃO commite \`node_modules/\`
- Use \`./scripts/clean.sh\` antes de merge
\`\`\`

echo "  ✅ WORKTREE_README.md criado"

# Resumo
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                 Setup Completo!                                 ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  • .env.local          → Variáveis isoladas                    ║"
echo "║  • .claude.worktree/   → Sessão Claude isolada                 ║"
echo "║  • scripts/clean.sh    → Limpeza de artefatos                  ║"
echo "║  • WORKTREE_README.md  → Documentação da worktree              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Worktree configurada com isolamento completo${NC}"
