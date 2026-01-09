# backend Specification

## Purpose
TBD - created by archiving change add-backend-api-postgresql. Update Purpose after archive.
## Requirements
### Requirement: API REST para Pedidos de Patente

O sistema SHALL fornecer endpoints REST completos para gerenciamento de pedidos de patente (CRUD) via Next.js API Routes.

#### Scenario: Listar pedidos
- **WHEN** cliente faz GET /api/pedidos
- **THEN** retorna array de pedidos com status 200
- **AND** inclui paginação (page, limit)

#### Scenario: Criar pedido
- **WHEN** cliente faz POST /api/pedidos com dados válidos
- **THEN** cria pedido no banco
- **AND** retorna pedido criado com status 201

#### Scenario: Atualizar pedido
- **WHEN** cliente faz PUT /api/pedidos/:id com dados válidos
- **THEN** atualiza pedido no banco
- **AND** retorna pedido atualizado com status 200

### Requirement: Validação de Requests

A API SHALL validar todos os requests usando schemas Zod, retornando erros formatados consistentemente.

#### Scenario: Request inválido
- **WHEN** cliente envia dados inválidos
- **THEN** retorna erro 400
- **AND** mensagem detalha campos inválidos

### Requirement: Autenticação JWT

A API SHALL implementar autenticação JWT para proteção de endpoints privados.

#### Scenario: Login bem-sucedido
- **WHEN** usuário faz POST /api/auth/login com credenciais válidas
- **THEN** retorna token JWT
- **AND** token inclui claims necessários

#### Scenario: Acesso a endpoint protegido
- **WHEN** cliente acessa endpoint privado sem token
- **THEN** retorna erro 401
- **AND** mensagem "Unauthorized"

