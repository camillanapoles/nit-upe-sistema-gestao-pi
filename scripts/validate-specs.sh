#!/bin/bash
# Script para validar specs OpenSpec antes do merge
# Uso: ./scripts/validate-specs.sh <change-id>

set -e

CHANGE_ID=$1

if [ -z "$CHANGE_ID" ]; then
    echo "Uso: $0 <change-id>"
    echo ""
    echo "Exemplo:"
    echo "  $0 add-sistema-anexos"
    echo ""
    echo "Changes disponíveis:"
    openspec list --changes 2>/dev/null || ls -1 openspec/changes/
    exit 1
fi

echo "=== Validando OpenSpec: $CHANGE_ID ==="

# Validar com openspec
if command -v openspec &> /dev/null; then
    openspec validate "$CHANGE_ID" --strict
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Spec validation passed"
        exit 0
    else
        echo ""
        echo "❌ Spec validation failed"
        exit 1
    fi
else
    echo "⚠️  openspec CLI não encontrado"
    echo "Verificando estrutura manualmente..."

    # Verificação manual básica
    CHANGE_DIR="openspec/changes/$CHANGE_ID"

    if [ ! -d "$CHANGE_DIR" ]; then
        echo "❌ Change não encontrado: $CHANGE_DIR"
        exit 1
    fi

    # Verificar arquivos obrigatórios
    for file in proposal.md tasks.md; do
        if [ ! -f "$CHANGE_DIR/$file" ]; then
            echo "❌ Arquivo obrigatório faltando: $file"
            exit 1
        fi
    done

    # Verificar specs
    if [ ! -d "$CHANGE_DIR/specs" ] || [ -z "$(ls -A $CHANGE_DIR/specs 2>/dev/null)" ]; then
        echo "❌ Specs directory vazio ou inexistente"
        exit 1
    fi

    echo "✅ Estrutura básica válida (openspec CLI não instalado para validação completa)"
fi
