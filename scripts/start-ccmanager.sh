#!/bin/bash
# Script para iniciar CCManager com configuração do projeto
# Uso: ./scripts/start-ccmanager.sh

PROJECT_ROOT="/mnt/cnmfs/Claude/Projects/Code-Terminal"
export CCMANAGER_MULTI_PROJECT_ROOT="$PROJECT_ROOT"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  CCManager - Multi-Project                    ║"
echo "║                                                                ║"
echo "║  Project Root: $PROJECT_ROOT"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar se ccmanager está instalado
if ! command -v ccmanager &> /dev/null; then
    echo "❌ CCManager não encontrado."
    echo "   Instale com: npm install -g ccmanager"
    exit 1
fi

echo "🚀 Iniciando CCManager..."
echo ""
echo "Atalhos úteis:"
echo "  Ctrl+E  - Voltar ao menu"
echo "  Esc     - Cancelar"
echo "  B       - Voltar à lista de projetos"
echo "  /       - Buscar projetos/worktrees"
echo ""

ccmanager --multi-project
