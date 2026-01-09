# Change: Implementar Backend API + PostgreSQL

## Why

O sistema atual utiliza apenas API mock para simulação, sem capacidade de persistência real de dados. Para tornar o sistema funcional em produção, é necessário implementar backend real com banco de dados PostgreSQL, permitindo armazenamento permanente de pedidos de patente e multi-usuários simultâneos.

## What Changes

- **ADICIONAR** Next.js API Routes para endpoints REST
- **ADICIONAR** PostgreSQL como banco de dados principal
- **ADICIONAR** Prisma ORM para gerenciamento de schema
- **ADICIONAR** Autenticação JWT (preparação para sistema completo)
- **ADICIONAR** Sistema de migrations
- **ATUALIZAR** API mock para ser compatível com backend real

## Impact

### Affected specs
- **backend** (nova spec)
- **database** (nova spec)

### Affected code
- `web-app/app/api/` (NOVO - endpoints REST)
- `web-app/lib/db.ts` (NOVO - cliente Prisma)
- `web-app/prisma/` (NOVO - schema + migrations)
- `web-app/lib/auth.ts` (NOVO - JWT utilities)

## Success Criteria

1. ✅ API REST funcional com endpoints CRUD
2. ✅ PostgreSQL configurado e conectado
3. ✅ Prisma schema definido
4. ✅ Migrations executando com sucesso
5. ✅ Autenticação JWT implementada
6. ✅ Integração com frontend existente

## Timeline Estimate

- **Desenvolvimento**: 7-10 dias
- **Testes**: 2 dias
- **Total**: 9-12 dias
