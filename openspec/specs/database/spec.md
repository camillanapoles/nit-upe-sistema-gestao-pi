# database Specification

## Purpose
TBD - created by archiving change add-backend-api-postgresql. Update Purpose after archive.
## Requirements
### Requirement: Schema PostgreSQL com Prisma

O sistema SHALL definir schema PostgreSQL usando Prisma ORM, incluindo entidades Pedido, Usuario e Anexo.

#### Scenario: Migrations bem-sucedidas
- **WHEN** migrations são executadas
- **THEN** tabelas são criadas no PostgreSQL
- **AND** relacionamentos são estabelecidos corretamente

### Requirement: Persistência de Dados

O sistema SHALL persistir todos os dados no PostgreSQL, garantindo durabilidade e consistência.

#### Scenario: Dados persistidos
- **WHEN** pedido é criado
- **THEN** dados são salvos permanentemente
- **AND** sobrevivem a restarts da aplicação

