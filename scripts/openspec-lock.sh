#!/bin/bash
# Sistema de Lock para OpenSpec
# Previne edição simultânea por múltiplos agentes
# Uso: ./scripts/openspec-lock.sh (acquire|release|status|refresh)

set -e

LOCK_FILE=".openspec-lock"
LOCK_TIMEOUT=1800  # 30 minutos em segundos
OPENSPEC_DIR="openspec/changes"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções
show_help() {
    echo "Uso: $0 <comando> [razão]"
    echo ""
    echo "Comandos:"
    echo "  acquire  - Adquire lock do OpenSpec"
    echo "  release  - Libera lock do OpenSpec"
    echo "  status   - Mostra status do lock"
    echo "  refresh  - Atualiza timestamp do lock (previne timeout)"
    echo ""
    echo "Exemplos:"
    echo "  $0 acquire \"Aplicando add-sistema-anexos\""
    echo "  $0 release"
    echo "  $0 status"
}

check_lock_stale() {
    if [ -f "$LOCK_FILE" ]; then
        local lock_age=$(($(date +%s) - $(date -r "$LOCK_FILE" +%s)))
        if [ $lock_age -gt $LOCK_TIMEOUT ]; then
            echo -e "${YELLOW}⚠️  Lock expirado ($(lock_age/$LOCK_TIMEOUT segundos)${NC}"
            echo "Removendo lock stale..."
            rm -f "$LOCK_FILE"
            return 0
        fi
        return 1
    fi
    return 0
}

acquire_lock() {
    local reason="${1:-"Edição OpenSpec"}"

    # Verificar se já existe lock
    if [ -f "$LOCK_FILE" ]; then
        # Verificar se lock está stale
        if check_lock_stale; then
            # Lock foi removido, continua
            :
        else
            # Lock ativo
            local locked_by=$(jq -r '.locked_by // "unknown"' "$LOCK_FILE" 2>/dev/null || echo "unknown")
            local locked_at=$(jq -r '.locked_at // "unknown"' "$LOCK_FILE" 2>/dev/null || echo "unknown")
            local change_id=$(jq -r '.change_id // "unknown"' "$LOCK_FILE" 2>/dev/null || echo "unknown")

            echo -e "${RED}❌ OpenSpec está locked${NC}"
            echo ""
            echo "Locked by: $locked_by"
            echo "Locked at: $locked_at"
            echo "Change: $change_id"
            echo ""
            echo "Para forçar release: rm -f $LOCK_FILE"
            exit 1
        fi
    fi

    # Criar lock
    local agent_id="agent@session-$$@$(hostname)@$(date +%s)"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    cat > "$LOCK_FILE" << EOF
{
  "version": "1.0",
  "locked_by": "$agent_id",
  "locked_at": "$timestamp",
  "change_id": "",
  "reason": "$reason"
}
EOF

    echo -e "${GREEN}✅ Lock adquirido${NC}"
    echo "Agent: $agent_id"
    echo "Reason: $reason"
    echo ""
    echo "⚠️  Não se esqueça de liberar o lock: $0 release"
}

release_lock() {
    if [ ! -f "$LOCK_FILE" ]; then
        echo -e "${YELLOW}⚠️  Nenhum lock ativo${NC}"
        exit 0
    fi

    local locked_by=$(jq -r '.locked_by // "unknown"' "$LOCK_FILE" 2>/dev/null)
    rm -f "$LOCK_FILE"

    echo -e "${GREEN}✅ Lock liberado${NC}"
    echo "Was locked by: $locked_by"
}

show_status() {
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    OpenSpec Lock Status                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""

    # Verificar se lock existe
    if [ ! -f "$LOCK_FILE" ]; then
        echo -e "${GREEN}Status: UNLOCKED${NC}"
        echo ""
        echo "OpenSpec está disponível para edição."
        echo ""
        echo "Para adquirir lock: $0 acquire \"<razão>\""
        exit 0
    fi

    # Lock existe, mostrar detalhes
    local locked_by=$(jq -r '.locked_by // "unknown"' "$LOCK_FILE" 2>/dev/null)
    local locked_at=$(jq -r '.locked_at // "unknown"' "$LOCK_FILE" 2>/dev/null)
    local change_id=$(jq -r '.change_id // "none"' "$LOCK_FILE" 2>/dev/null)
    local reason=$(jq -r '.reason // "none"' "$LOCK_FILE" 2>/dev/null)
    local lock_age=$(($(date +%s) - $(date -r "$LOCK_FILE" +%s)))
    local lock_age_min=$((lock_age / 60))

    # Verificar se está stale
    if [ $lock_age -gt $LOCK_TIMEOUT ]; then
        echo -e "${YELLOW}Status: LOCKED (STALE)${NC}"
        echo -e "${YELLOW}⚠️  Lock expirou há ${lock_age_min} minutos${NC}"
        echo ""
        echo "Para liberar: $0 release --force"
    else
        echo -e "${RED}Status: LOCKED${NC}"
    fi

    echo ""
    echo "Locked by: $locked_by"
    echo "Locked at: $locked_at"
    echo "Age: ${lock_age_min} minutos"
    echo "Change: $change_id"
    echo "Reason: $reason"
    echo ""

    # Mostrar changes em progresso
    if [ -d "$OPENSPEC_DIR" ]; then
        echo "Changes em progresso:"
        ls -1 "$OPENSPEC_DIR" | grep -v archive | head -5
    fi
}

refresh_lock() {
    if [ ! -f "$LOCK_FILE" ]; then
        echo -e "${RED}❌ Nenhum lock para refresh${NC}"
        exit 1
    fi

    # Atualizar timestamp
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    jq --arg ts "$timestamp" '.locked_at = $ts' "$LOCK_FILE" > "${LOCK_FILE}.tmp"
    mv "${LOCK_FILE}.tmp" "$LOCK_FILE"

    echo -e "${GREEN}✅ Lock refreshado${NC}"
    echo "Novo timestamp: $timestamp"
}

# Main
case "${1:-}" in
    acquire)
        acquire_lock "${2:-}"
        ;;
    release)
        release_lock
        ;;
    status)
        show_status
        ;;
    refresh)
        refresh_lock
        ;;
    *)
        show_help
        exit 1
        ;;
esac
