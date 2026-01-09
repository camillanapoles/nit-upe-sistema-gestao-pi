# Setup Guide - Backend API + PostgreSQL

Este guia orienta a configuracao do backend com PostgreSQL para o Sistema de Gestao de Propriedade Intelectual UPE.

## Requisitos

- Node.js 20+ (verificado com `node --version`)
- PostgreSQL 14+ (local ou Docker)
- npm ou yarn

---

## Opcao 1: PostgreSQL Local

### 1. Instalar PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
- Baixe o instalador em: https://www.postgresql.org/download/windows/

### 2. Configurar Banco de Dados

```bash
# Acessar o PostgreSQL
sudo -u postgres psql

# Criar usuario e banco
CREATE USER nit_upe WITH PASSWORD 'nit_upe_password';
CREATE DATABASE nit_upe OWNER nit_upe;
GRANT ALL PRIVILEGES ON DATABASE nit_upe TO nit_upe;
\q
```

---

## Opcao 2: PostgreSQL com Docker

### 1. Criar docker-compose.yml

Crie o arquivo `docker-compose.yml` na raiz do projeto:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: nit-upe-postgres
    restart: always
    environment:
      POSTGRES_USER: nit_upe
      POSTGRES_PASSWORD: nit_upe_password
      POSTGRES_DB: nit_upe
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 2. Iniciar o Container

```bash
docker-compose up -d
```

---

## Configuracao do Projeto

### 1. Copiar Variaveis de Ambiente

```bash
cd web-app
cp .env.example .env.local
```

### 2. Editar .env.local

Edite conforme sua configuracao:

```bash
# Para PostgreSQL local (Opcao 1)
DATABASE_URL="postgresql://nit_upe:nit_upe_password@localhost:5432/nit_upe"

# Para PostgreSQL Docker (Opcao 2)
DATABASE_URL="postgresql://nit_upe:nit_upe_password@localhost:5432/nit_upe"

# JWT Secret (mude em producao!)
JWT_SECRET="change-this-to-a-secure-random-string-in-production"
JWT_EXPIRES_IN="7d"

NODE_ENV="development"
```

### 3. Instalar Dependencias e Gerar Cliente Prisma

```bash
cd web-app

# Gerar cliente Prisma
npm run db:generate

# Criar migrations (primeira vez apenas)
npm run db:migrate:dev

# Opcional: Popular com dados de teste
npm run db:seed
```

### 4. Verificar Configuracao

```bash
# Listar migrations
npx prisma migrate status

# Visualizar dados (abre UI no navegador)
npm run db:studio
```

---

## Iniciar Servidor de Desenvolvimento

```bash
cd web-app
npm run dev
```

O servidor estara disponivel em: http://localhost:3000

---

## Testar a API

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@upe.br",
    "nome": "Usuario Teste",
    "senha": "Senha123",
    "confirmarSenha": "Senha123"
  }'
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@upe.br",
    "senha": "Senha123"
  }'
```

Salve o token retornado para usar nas proximas requisicoes.

### 3. Criar Pedido (com token)

```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "tipo": "PI",
    "titulo": "Meu Primeiro Pedido de Patente",
    "problema": "Descricao detalhada do problema tecnico que sera resolvido pela invencao...",
    "solucao": "Descricao detalhada da solucao tecnica proposta...",
    "estadoTecnica": "Estado da tecnica atual e solucoes existentes...",
    "vantagens": "Vantagens e melhorias em relacao ao estado da tecnica...",
    "palavrasChave": "palavra1, palavra2, palavra3"
  }'
```

### 4. Listar Pedidos

```bash
curl -X GET http://localhost:3000/api/pedidos
```

---

## Comandos Uteis

```bash
# Gerar cliente Prisma (apos mudar schema)
npm run db:generate

# Criar nova migration
npm run db:migrate:dev

# Resetar banco (cuidado: apaga todos os dados)
npm run db:reset

# Fazer push do schema sem migration (desenvolvimento)
npm run db:push

# Abrir Prisma Studio
npm run db:studio

# Verificar conexao com banco
npx prisma db push
```

---

## Troubleshooting

### Erro: "Connection refused"

Verifique se o PostgreSQL esta rodando:
```bash
# Linux/macOS
sudo systemctl status postgresql

# Docker
docker ps
```

### Erro: "Authentication failed"

Verifique as credenciais no `DATABASE_URL` e crie o usuario corretamente no PostgreSQL.

### Erro: "Database does not exist"

Crie o banco:
```bash
sudo -u postgres psql
CREATE DATABASE nit_upe;
\q
```

### Erro: "relation does not exist"

Rode as migrations:
```bash
npm run db:migrate:dev
```

### Erro com TypeScript

```bash
# Limpar cache e reinstalar
rm -rf .next node_modules
npm install
npm run db:generate
```

---

## Estrutura do Banco

Apos as migrations, o banco tera as seguintes tabelas:

- `Usuario` - Usuarios do sistema (inventores, avaliadores, admin)
- `Pedido` - Pedidos de patente
- `Anexo` - Arquivos anexados aos pedidos
- `Avaliacao` - Avaliacoes tecnicas dos pedidos
- `Historico` - Auditoria de alteracoes

Veja `prisma/schema.prisma` para detalhes.

---

## Proximos Passos

1. Desenvolver frontend para consumir a API
2. Implementar upload de arquivos (anexos)
3. Adicionar testes automatizados
4. Configurar deploy em producao

---

## Documentacao Adicional

- [API Documentation](./README_API.md) - Documentacao completa da API
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
