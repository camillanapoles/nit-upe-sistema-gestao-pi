# API Documentation - Sistema de Gestao de Propriedade Intelectual UPE

Esta API REST foi desenvolvida com Next.js 14 API Routes, PostgreSQL e Prisma ORM.

## Sumario

- [Configuracao](#configuracao)
- [Autenticacao](#autenticacao)
- [Endpoints - Pedidos](#endpoints---pedidos)
- [Endpoints - Auth](#endpoints---auth)
- [Modelos de Dados](#modelos-de-dados)
- [Codigos de Erro](#codigos-de-erro)

---

## Configuracao

### 1. Variaveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Database PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nit_upe"

# JWT Secret (use uma string forte em producao)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Ambiente
NODE_ENV="development"
```

### 2. Setup do Banco de Dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrations (cria as tabelas)
npm run db:migrate:dev

# (Opcional) Popular com dados de teste
npm run db:seed

# (Opcional) Abrir Prisma Studio para visualizar dados
npm run db:studio
```

### 3. Usuarios de Teste (apos seed)

| Email | Senha | Role |
|-------|-------|------|
| admin@upe.br | Senha123 | ADMIN |
| inventor@upe.br | Senha123 | INVENTOR |
| avaliador@upe.br | Senha123 | AVALIADOR |

---

## Autenticacao

A API utiliza JWT (JSON Web Tokens) para autenticacao.

### Format do Token

```
Authorization: Bearer <token>
```

### Payload do Token

```typescript
{
  userId: string,
  email: string,
  role: 'INVENTOR' | 'AVALIADOR' | 'ADMIN',
  iat: number,
  exp: number
}
```

### Exemplo de Uso

```bash
# 1. Fazer login e obter token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"inventor@upe.br","senha":"Senha123"}'

# Resposta contendo o token
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "nome": "...", "role": "INVENTOR" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

# 2. Usar o token em requisicoes subsequentes
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Endpoints - Pedidos

### GET /api/pedidos

Lista todos os pedidos de patente com suporte a filtros e paginacao.

**Query Parameters:**

| Parametro | Tipo | Default | Descricao |
|-----------|------|---------|-----------|
| page | number | 1 | Numero da pagina |
| limit | number | 20 | Itens por pagina (max: 100) |
| status | string | - | Filtra por status (RASCUNHO, SUBMETIDO, EM_ANALISE, etc.) |
| tipo | string | - | Filtra por tipo (PI, MU, CII, RPC) |
| inventorId | string | - | Filtra por ID do inventor |
| search | string | - | Busca por titulo ou palavras-chave |

**Exemplo:**

```bash
curl -X GET "http://localhost:3000/api/pedidos?page=1&limit=10&status=EM_ANALISE&tipo=PI"
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": {
    "pedidos": [
      {
        "id": "uuid",
        "numeroPedido": "PED-2024-0001",
        "tipo": "PI",
        "titulo": "Dispositivo Odontologico...",
        "status": "EM_ANALISE",
        "faseAtual": "ANALISE",
        "createdAt": "2024-01-15T10:00:00.000Z",
        "inventor": {
          "id": "uuid",
          "nome": "Dr. Joao Silva",
          "email": "inventor@upe.br"
        },
        "_count": { "anexos": 3 }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

### GET /api/pedidos/by-id/[id]

Retorna os detalhes completos de um pedido especifico.

**Exemplo:**

```bash
curl -X GET "http://localhost:3000/api/pedidos/by-id/{id}" \
  -H "Authorization: Bearer <token>"
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "numeroPedido": "PED-2024-0001",
    "numeroProtocolo": null,
    "tipo": "PI",
    "titulo": "Dispositivo Odontologico...",
    "problema": "O tratamento de lesoes...",
    "solucao": "Dispositivo de liberacao...",
    "estadoTecnica": "Existem geis...",
    "vantagens": "Reducao de 40%...",
    "palavrasChave": "cicatrizacao, odontologia...",
    "resumo": "Dispositivo bioadesivo...",
    "faseAtual": "ANALISE",
    "status": "EM_ANALISE",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-20T15:30:00.000Z",
    "inventor": {
      "id": "uuid",
      "nome": "Dr. Joao Silva",
      "email": "inventor@upe.br",
      "departamento": "Departamento de Engenharia"
    },
    "anexos": [],
    "historico": [
      {
        "id": "uuid",
        "acao": "CRIADO",
        "valorNovo": "Pedido criado via seed",
        "createdAt": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

**Erros:**

- `404 NOT_FOUND`: Pedido nao encontrado

---

### POST /api/pedidos

Cria um novo pedido de patente.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <token> (opcional para rascunhos)
```

**Body:**

```json
{
  "tipo": "PI",
  "titulo": "Dispositivo Medico para Tratamento de X",
  "problema": "Descricao detalhada do problema (minimo 100 caracteres)...",
  "solucao": "Descricao detalhada da solucao (minimo 500 caracteres)...",
  "estadoTecnica": "Estado da tecnica atual (minimo 200 caracteres)...",
  "vantagens": "Vantagens da invencao (minimo 100 caracteres)...",
  "palavrasChave": "palavra1, palavra2, palavra3",
  "resumo": "Resumo do pedido (opcional, minimo 50 caracteres)..."
}
```

**Validacoes:**

| Campo | Min | Max | Observacao |
|-------|-----|-----|------------|
| titulo | 1 | 150 | Obrigatorio |
| problema | 100 | 1000 | Obrigatorio |
| solucao | 500 | 4000 | Obrigatorio |
| estadoTecnica | 200 | 2000 | Obrigatorio |
| vantagens | 100 | 1500 | Obrigatorio |
| palavrasChave | 50 | 200 | Obrigatorio |
| resumo | 50 | 2000 | Opcional |
| tipo | - | - | PI, MU, CII ou RPC |

**Exemplo:**

```bash
curl -X POST "http://localhost:3000/api/pedidos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "tipo": "PI",
    "titulo": "Novo Dispositivo Medico",
    "problema": "Problema descrito com detalhes suficientes...",
    "solucao": "Solucao tecnica detalhada...",
    "estadoTecnica": "Estado da tecnica atual...",
    "vantagens": "Vantagens e melhorias...",
    "palavrasChave": "medico, dispositivo, inovacao"
  }'
```

**Resposta (201 CREATED):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "numeroPedido": "PED-2024-0004",
    "tipo": "PI",
    "titulo": "Novo Dispositivo Medico",
    "status": "RASCUNHO",
    "faseAtual": "PREPARACAO",
    "createdAt": "2024-01-25T10:00:00.000Z",
    "inventor": {
      "id": "uuid",
      "nome": "Dr. Joao Silva",
      "email": "inventor@upe.br"
    }
  }
}
```

**Erros:**

- `400 VALIDATION_ERROR`: Dados de entrada invalidos
- `401 UNAUTHORIZED`: Token invalido ou ausente

---

### PUT /api/pedidos/by-id/[id]

Atualiza um pedido existente.

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <token> (obrigatorio)
```

**Permissoes:**

- O inventor do pedido pode editar
- Avaliadores e ADMIN podem editar qualquer pedido

**Body (campos parciais):**

```json
{
  "titulo": "Titulo atualizado",
  "status": "SUBMETIDO",
  "faseAtual": "SUBMISSAO"
}
```

**Exemplo:**

```bash
curl -X PUT "http://localhost:3000/api/pedidos/by-id/{id}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "titulo": "Titulo Atualizado do Pedido",
    "status": "SUBMETIDO"
  }'
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "numeroPedido": "PED-2024-0001",
    "titulo": "Titulo Atualizado do Pedido",
    "status": "SUBMETIDO",
    "updatedAt": "2024-01-25T11:00:00.000Z"
  }
}
```

**Erros:**

- `400 VALIDATION_ERROR`: Dados de entrada invalidos
- `401 UNAUTHORIZED`: Token invalido
- `403 FORBIDDEN`: Sem permissao ou pedido depositado
- `404 NOT_FOUND`: Pedido nao encontrado

---

### DELETE /api/pedidos/by-id/[id]

Deleta um pedido (apenas rascunhos).

**Headers:**

```
Authorization: Bearer <token> (obrigatorio)
```

**Regras:**

- Apenas pedidos com status `RASCUNHO` podem ser deletados
- Apenas o inventor ou ADMIN pode deletar

**Exemplo:**

```bash
curl -X DELETE "http://localhost:3000/api/pedidos/by-id/{id}" \
  -H "Authorization: Bearer <token>"
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "Pedido deletado com sucesso"
  }
}
```

**Erros:**

- `401 UNAUTHORIZED`: Token invalido
- `403 FORBIDDEN`: Sem permissao ou pedido nao e rascunho
- `404 NOT_FOUND`: Pedido nao encontrado

---

## Endpoints - Auth

### POST /api/auth/register

Registra um novo usuario no sistema.

**Body:**

```json
{
  "email": "novo.usuario@upe.br",
  "nome": "Nome do Usuario",
  "senha": "Senha123",
  "confirmarSenha": "Senha123",
  "cpf": "12345678900",
  "telefone": "(81) 99999-9999",
  "departamento": "Departamento de Engenharia"
}
```

**Validacoes:**

| Campo | Requisito |
|-------|-----------|
| email | Email valido e unico |
| nome | Minimo 3 caracteres |
| senha | Minimo 8 caracteres, maiuscula, minuscula, numero |
| confirmarSenha | Deve ser igual a senha |
| cpf | Opcional, deve ser unico se fornecido |

**Exemplo:**

```bash
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo.usuario@upe.br",
    "nome": "Novo Usuario",
    "senha": "Senha123",
    "confirmarSenha": "Senha123"
  }'
```

**Resposta (201 CREATED):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "novo.usuario@upe.br",
    "nome": "Novo Usuario",
    "role": "INVENTOR",
    "ativo": true,
    "createdAt": "2024-01-25T10:00:00.000Z"
  }
}
```

**Erros:**

- `400 VALIDATION_ERROR`: Dados invalidos
- `409 CONFLICT`: Email ou CPF ja cadastrado

---

### POST /api/auth/login

Autentica um usuario e retorna um token JWT.

**Body:**

```json
{
  "email": "inventor@upe.br",
  "senha": "Senha123"
}
```

**Exemplo:**

```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "inventor@upe.br",
    "senha": "Senha123"
  }'
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "inventor@upe.br",
      "nome": "Dr. Joao Silva",
      "role": "INVENTOR",
      "ultimoLoginAt": "2024-01-25T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erros:**

- `400 VALIDATION_ERROR`: Dados invalidos
- `401 UNAUTHORIZED`: Credenciais invalidas
- `403 FORBIDDEN`: Usuario desativado

---

### GET /api/auth/me

Retorna os dados do usuario autenticado.

**Headers:**

```
Authorization: Bearer <token>
```

**Exemplo:**

```bash
curl -X GET "http://localhost:3000/api/auth/me" \
  -H "Authorization: Bearer <token>"
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "inventor@upe.br",
      "nome": "Dr. Joao Silva",
      "role": "INVENTOR",
      "cpf": "98765432100",
      "telefone": "(81) 99999-0002",
      "departamento": "Departamento de Engenharia",
      "ativo": true,
      "ultimoLoginAt": "2024-01-25T10:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "stats": {
      "totalPedidos": 3,
      "pedidosRecentes": [
        {
          "id": "uuid",
          "numeroPedido": "PED-2024-0003",
          "titulo": "Dispositivo de Fixacao...",
          "tipo": "MU",
          "status": "RASCUNHO",
          "createdAt": "2024-01-24T10:00:00.000Z"
        }
      ]
    }
  }
}
```

**Erros:**

- `401 UNAUTHORIZED`: Token invalido ou ausente
- `404 NOT_FOUND`: Usuario nao encontrado

---

## Modelos de Dados

### TipoPatente

| Valor | Descricao |
|-------|-----------|
| PI | Patente de Invencao (20 anos) |
| MU | Modelo de Utilidade (15 anos) |
| CII | Computer Implemented Invention (software + efeito tecnico) |
| RPC | Registro de Programa de Computador (50 anos) |

### StatusPedido

| Valor | Descricao |
|-------|-----------|
| RASCUNHO | Pedido em criacao pelo inventor |
| SUBMETIDO | Pedido enviado para analise do NIT |
| EM_ANALISE | Pedido em analise tecnica |
| APROVADO | Pedido aprovado pelo NIT |
| COM_RESSALVAS | Pedido aprovado com correcoes necessarias |
| REPROVADO | Pedido reprovado pelo NIT |
| DEPOSITADO | Pedido depositado no INPI |

### FaseAtual

| Valor | Descricao |
|-------|-----------|
| PREPARACAO | Fase 1 - Inventor preenchendo formularios |
| SUBMISSAO | Fase 2 - Portao de entrada |
| ANALISE | Fase 3 - Analise tecnica do NIT |
| FORMALIZACAO | Fase 4 - Formalizacao documental |
| ROBUSTEZ | Fase 5 - Robustez e conformidade |

### Role

| Valor | Descricao |
|-------|-----------|
| INVENTOR | Usuario inventor (cria pedidos) |
| AVALIADOR | Usuario avaliador do NIT (analisa pedidos) |
| ADMIN | Administrador do sistema |

---

## Codigos de Erro

| Codigo HTTP | Codigo Erro | Descricao |
|-------------|-------------|-----------|
| 400 | VALIDATION_ERROR | Dados de entrada invalidos |
| 401 | UNAUTHORIZED | Token invalido, expirado ou ausente |
| 403 | FORBIDDEN | Sem permissao para realizar acao |
| 404 | NOT_FOUND | Recurso nao encontrado |
| 409 | CONFLICT | Recurso ja existe (email, CPF duplicados) |
| 500 | INTERNAL_ERROR | Erro interno do servidor |

### Formato de Resposta de Erro

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados de entrada invalidos",
    "fields": {
      "problema": "Problema deve ter no minimo 100 caracteres",
      "solucao": "Solucao deve ter no minimo 500 caracteres"
    }
  }
}
```

---

## Scripts Disponiveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor Next.js

# Banco de Dados
npm run db:generate      # Gera cliente Prisma
npm run db:migrate:dev   # Cria e executa migrations (dev)
npm run db:migrate:deploy # Executa migrations (producao)
npm run db:push          # Push do schema sem migration
npm run db:studio        # Abre Prisma Studio
npm run db:seed          # Popula banco com dados de teste
npm run db:reset         # Reseta banco e roda seed

# Build
npm run build            # Build para producao
npm run start            # Inicia servidor de producao
npm run lint             # Executa linter
```

---

## Arquitetura

```
web-app/
├── app/
│   └── api/
│       ├── pedidos/
│       │   ├── route.ts              # GET (list), POST (create)
│       │   └── by-id/
│       │       └── [id]/
│       │           └── route.ts      # GET (details), PUT (update), DELETE
│       └── auth/
│           ├── register/
│           │   └── route.ts          # POST (register)
│           ├── login/
│           │   └── route.ts          # POST (login)
│           └── me/
│               └── route.ts          # GET (profile)
├── lib/
│   ├── db.ts                         # Prisma client singleton
│   ├── auth.ts                       # JWT e hashing de senha
│   ├── middleware.ts                 # Middleware de autenticacao
│   └── validations.ts                # Schemas Zod
├── prisma/
│   ├── schema.prisma                 # Schema do banco
│   └── seed.ts                       # Dados de teste
└── .env.example                      # Variaveis de ambiente exemplo
```

---

## Consideracoes de Seguranca

1. **Senhas**: Sao hasheadas com bcrypt (10 rounds) antes de serem armazenadas
2. **JWT**: Tokens expiram em 7 dias (configuravel via `JWT_EXPIRES_IN`)
3. **HTTPS**: Use HTTPS em producao para proteger tokens em transito
4. **CORS**: Configure CORS apropriadamente para seu dominio frontend
5. **Rate Limiting**: Considere implementar rate limiting para prevenir abuso

---

## Proximos Passos

1. Implementar upload de arquivos (anexos)
2. Adicionar endpoints para avaliacoes
3. Implementar notificacoes por email
4. Adicionar testes automatizados
5. Implementar refresh tokens
6. Adicionar busca avancada com filtros compostos

---

**Versao**: 1.0.0
**Data**: 25 de Janeiro de 2024
**Stack**: Next.js 14, Prisma, PostgreSQL, Zod, JWT
