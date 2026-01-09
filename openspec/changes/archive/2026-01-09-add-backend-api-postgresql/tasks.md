# Tasks - Backend API + PostgreSQL

## 1. Setup PostgreSQL
- [x] 1.1 Instalar/configurar PostgreSQL local ou Docker
- [x] 1.2 Criar database para o projeto
- [x] 1.3 Configurar variáveis de ambiente (.env.local)

## 2. Prisma ORM
- [x] 2.1 Instalar Prisma
- [x] 2.2 Inicializar Prisma (npx prisma init)
- [x] 2.3 Definir schema (Pedido, Usuario, Anexo)
- [x] 2.4 Criar migrations iniciais
- [x] 2.5 Executar migrations (npx prisma migrate dev)

## 3. API Routes - Pedidos
- [x] 3.1 GET /api/pedidos - Listar todos
- [x] 3.2 GET /api/pedidos/:id - Detalhes de um pedido
- [x] 3.3 POST /api/pedidos - Criar novo pedido
- [x] 3.4 PUT /api/pedidos/:id - Atualizar pedido
- [x] 3.5 DELETE /api/pedidos/:id - Deletar pedido

## 4. API Routes - Usuarios
- [x] 4.1 POST /api/auth/register - Registro
- [x] 4.2 POST /api/auth/login - Login
- [x] 4.3 GET /api/auth/me - Perfil do usuário atual

## 5. Validações
- [x] 5.1 Configurar Zod para validação de requests
- [x] 5.2 Implementar validação em todos os endpoints
- [x] 5.3 Retornar erros formatados consistentemente

## 6. Autenticação JWT
- [x] 6.1 Implementar geração de tokens
- [x] 6.2 Implementar middleware de autenticação
- [x] 6.3 Proteger endpoints privados

## 7. Testes
- [x] 7.1 Testar todos os endpoints
- [x] 7.2 Testar validações
- [x] 7.3 Testar autenticação
- [x] 7.4 Testar integração com PostgreSQL

**Total de Tasks**: 27 - **TODAS COMPLETADAS**
**Estimativa**: 7-10 dias
