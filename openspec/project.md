# Contexto do Projeto

## Propósito

O **Sistema de Gestão de Propriedade Intelectual da Universidade de Pernambuco (UPE)** é uma plataforma transformacional de alta performance que visa revolucionar o processo de patenteamento acadêmico no Brasil. O sistema integral abrange desde a pré-qualificação de invenções até o depósito no INPI, eliminando retrabalho, maximizando aprovações e otimizando a experiência do inventor.

### Objetivos Estratégicos

Transformar o NIT/UPE em referência nacional em patentes de alta qualidade através de:

1. **Eliminação de Retrabalho**: Reduzir >90% do retrabalho de inventores e avaliadores
2. **Excelência em UX**: Atingir >90% de satisfação dos usuários com o processo
3. **Agilidade Processual**: Primeira devolutiva em ≤10 dias úteis
4. **Qualidade de Entrada**: Taxa de aprovação na entrada >70%
5. **Eficiência na Redação**: Reduzir tempo de redação pela metade
6. **Sucesso no INPI**: Aumentar taxa de deferimento em +20%

### Metodologia

O projeto utiliza uma abordagem multidisciplinar de ponta:

- **Engenharia de Contexto**: Compreensão profunda do ecossistema de inovação acadêmica
- **Abordagem McKinsey/Lean**: Alta performance, eliminação de desperdícios, foco em KPIs
- **UX/UI Design Moderno**: Poka-Yoke (prevenção de erros), semaforização visual RAG
- **Melhoria Contínua**: Ciclo PDCA (Plan-Do-Check-Act)
- **Documentação Sistêmica**: 49 documentos estruturados em 5 fases do processo

## Stack Tecnológico

### Frontend

- **Framework**: Next.js 14 (App Router) - Framework React com renderização híbrida
- **Linguagem**: TypeScript 5.3.3 - Tipagem estática para JavaScript
- **Estilização**: Tailwind CSS 3.4.1 - Framework CSS utilitário
- **Componentes**: React 18.2.0 - Biblioteca UI declarativa
- **Ícones**: Lucide React 0.344.0 - Biblioteca de ícones consistente
- **Linter**: ESLint 8.57.0 - Qualidade de código

### Backend (Planejado)

- **API**: REST/GraphQL com Next.js API Routes
- **Banco de Dados**: PostgreSQL (recomendado para integridade relacional)
- **Autenticação**: OAuth2 / JWT
- **Validação**: Zod / Yup
- **Upload**: Multer / Next.js built-in
- **Email**: Nodemailer / Resend
- **Filas**: BullMQ (para processamento assíncrono)

### Integrações Externas

- **INPI e-INPI**: REST API oficial para protocolização
- **RPI Scraper**: Web scraping da Revista da Propriedade Industrial
- **SisGen**: Integração com Sistema Nacional de Gestão do Patrimônio Genético
- **Notificações**: Email (SMTP), WhatsApp API, Push Notifications

### Deploy e Infraestrutura

- **Hosting Atual**: GitHub Pages (Static Export)
- **CI/CD**: GitHub Actions (workflow: `nextjs-github-pages.yml`)
- **Branch Source**: `pages-mvp` ← Código fonte do MVP estático
- **Branch Deploy**: `gh-pages` ← GitHub Pages serve este branch
- **Branch Docs**: `master` ← Documentação OpenSpec, scripts, orquestração
- **Workflow**: Push em `pages-mvp` → build → deploy em `gh-pages`
- **Node Version**: 20.x
- **Package Manager**: npm

#### Estratégia de Deploy (v1.1 - 2026-01-09)

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFLOW DE DEPLOY                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  pages-mvp (source)     →    GitHub Actions    →   gh-pages    │
│  ┌──────────────────┐         ┌─────────────┐      ┌─────────┐ │
│  │ web-app/         │         │ npm run     │      │ out/    │ │
│  │   app/           │   ───▶  │   build     │  ───▶ │         │ │
│  │   components/    │         │ next export │      │ .nojekyll│ │
│  │   lib/           │         └─────────────┘      └─────────┘ │
│  └──────────────────┘                                    ↓      │
│                                                         GHPAGES  │
│                                                           SERVE │
│                                                                 │
│  GitHub Pages Config: source = gh-pages, path = /              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Histórico de Merge:**
- `master` → `pages-mvp` (2026-01-09): Merge para unificar documentação
- `pages-mvp` contém código MVP funcional
- `master` contém OpenSpec atualizado + scripts de orquestração

### Ferramentas de Desenvolvimento

- **Versionamento**: Git + GitHub
- **Editor**: VS Code (recomendado)
- **Testes**: Jest + React Testing Library (planejado)
- **Documentação**: Markdown + Mermaid v11.6 (diagramas)
- **PlantUML**: Para diagramas UML específicos

## Convenções do Projeto

### Estilo de Código

#### TypeScript/React

- **Nomenclatura**:
  - Componentes: `PascalCase` (ex: `FormularioPI`)
  - Funções: `camelCase` (ex: `handleSubmit`)
  - Constantes: `UPPER_SNAKE_CASE` (ex: `MAX_CHARS_TITULO`)
  - Tipos/Interfaces: `PascalCase` (ex: `FormularioData`)

- **Estrutura de Componentes**:
  ```typescript
  'use client'; // Se necessário

  import { useState, useEffect } from 'react';

  interface ComponentProps {
    // props tipadas
  }

  export function ComponentName({ prop }: ComponentProps) {
    // Hooks no topo
    const [state, setState] = useState();

    // Efeitos após hooks
    useEffect(() => {
      // effect
    }, []);

    // Handlers
    const handleClick = () => {
      // handler logic
    };

    // Render
    return (
      <div>
        {/* JSX */}
      </div>
    );
  }
  ```

- **Padrões de Importação**:
  ```typescript
  // 1. React/core
  import { useState } from 'react';

  // 2. Bibliotecas externas
  import { Icon } from 'lucide-react';

  // 3. Componentes internos
  import { Button } from '@/components/ui/button';

  // 4. Utilitários/Helpers
  import { formatDate } from '@/lib/utils';

  // 5. Tipos
  import type { FormData } from '@/types/forms';
  ```

#### CSS (Tailwind)

- **Cores Institucionais UPE**:
  - Primary: `#2196F3` (Azul UPE)
  - Primary Dark: `#1976D2`
  - Primary Light: `#BBDEFB`
  - Success: `#4CAF50`
  - Warning: `#FFC107`
  - Danger: `#f44336`

- **Responsividade**:
  - Mobile: `< 768px`
  - Tablet: `768px - 1024px`
  - Desktop: `> 1024px`

- **Convenções de Classes**:
  ```tsx
  <div className="
    flex flex-col gap-4 p-6
    bg-white rounded-lg shadow-md
    hover:shadow-lg transition-shadow
    md:flex-row md:gap-6
  ">
    {/* conteúdo */}
  </div>
  ```

### Padrões de Arquitetura

#### Estrutura de Diretórios (Planejada)

```
web-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rotas autenticadas
│   ├── (dashboard)/       # Dashboard principal
│   ├── api/               # API Routes
│   ├── formulario/        # Formulários públicos
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base
│   ├── forms/            # Componentes de formulário
│   └── layout/           # Componentes de layout
├── lib/                  # Utilitários e configurações
│   ├── db.ts            # Cliente de banco
│   ├── auth.ts          # Autenticação
│   └── utils.ts         # Helpers gerais
├── types/                # Tipos TypeScript
├── public/               # Arquivos estáticos
└── styles/               # Estilos globais
```

#### Padrões de Backend

- **API Routes**: Seguir estrutura RESTful
  ```
  GET    /api/pedidos        - Listar pedidos
  POST   /api/pedidos        - Criar pedido
  GET    /api/pedidos/:id    - Detalhes do pedido
  PUT    /api/pedidos/:id    - Atualizar pedido
  DELETE /api/pedidos/:id    - Deletar pedido
  ```

- **Validação**: Usar Zod schemas
  ```typescript
  import { z } from 'zod';

  const formularioSchema = z.object({
    titulo: z.string().min(1).max(150),
    problema: z.string().min(100).max(1000),
    // ...
  });
  ```

- **Error Handling**: Padronizar respostas de erro
  ```typescript
  {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Descrição detalhada',
      fields: { /* campos com erro */ }
    }
  }
  ```

### Estratégia de Testes

#### Testes Unitários

- **Framework**: Jest
- **Objetivo**: Testar funções puras, hooks, utilitários
- **Cobertura**: Mínimo 80%

#### Testes de Integração

- **Framework**: React Testing Library
- **Objetivo**: Testar fluxos de usuário, formulários
- **Foco**: Comportamento, não implementação

#### Testes E2E

- **Framework**: Playwright (planejado)
- **Objetivo**: Testar fluxos críticos de negócio
- **Cenários**: Submissão completa de pedido

### Git Workflow

#### Branches

- **`pages-mvp`**: **ATUAL** - MVP estático completo para GitHub Pages
- **`feature/github-pages-cicd`**: Desenvolvimento com API Routes
- **`main`**: Produção (após merge completo)
- **`feature/*`**: Features em desenvolvimento
- **`fix/*`**: Corrections e hotfixes
- **`docs/*`**: Atualizações de documentação

#### Convenções de Commit

```
<tipo>(<escopo>): <descrição>

[opcional: corpo]

[opcional: footer]
```

**Tipos**:
- `feat`: Nova funcionalidade
- `fix`: Bug fix
- `docs`: Documentação
- `style`: Formatação, missing semicolons
- `refactor`: Refatoração
- `test`: Adicionar testes
- `chore`: Atualizar tasks, configs

**Exemplos**:
```
feat(forms): implementar validação de CPF
fix(auth): corrigir timeout de sessão
docs(readme): atualizar instruções de deploy
```

#### Processo de Pull Request

1. Criar branch a partir de `main`
2. Desenvolver com commits frequentes e descritivos
3. Testar localmente (`npm run build`, `npm test`)
4. Abrir PR com template preenchido
5. Revisão por peer
6. Merge com squash

## Contexto de Domínio

### Propriedade Intelectual (PI)

**Conceitos Fundamentais**:

- **PI (Patente de Invenção)**: Protege lógica técnica, 20 anos
- **MU (Modelo de Utilidade)**: Protege forma física, 15 anos
- **CII (Computer Implemented Invention)**: Software com efeito técnico
- **RPC (Registro de Programa de Computador)**: Protege código, 50 anos
- **NIT**: Núcleo de Inovação Tecnológica (unidade de gestão)
- **NAI**: Novidade, Atividade Inventiva, Aplicação Industrial
- **SisGen**: Sistema de biodiversidade brasileira
- **RPI**: Revista da Propriedade Industrial

### Processo de Patenteamento (5 Fases)

1. **Fase 1 - Preparação** (Inventor)
   - Educação prévia sobre tipos de patente
   - Diferenciação Laboratório vs. Patente
   - Preenchimento de Anexos (A, B, C, F)

2. **Fase 2 - Submissão** (Portão de Entrada)
   - Formulários validados (PI/MU, CII, RPC)
   - Validação de caracteres
   - Checklists de conferência

3. **Fase 3 - Análise Técnica** (NIT)
   - Triagem administrativa
   - Exame NAI (Novidade, Atividade Inventiva, Aplicação Industrial)
   - Parecer semaforizado (Verde/Amarelo/Vermelho)

4. **Fase 4 - Formalização** (NIT + Inventor)
   - Termos de cessão
   - Declarações de inventores
   - Documentos legais

5. **Fase 5 - Robustez e Conformidade**
   - Checklist final
   - Validação de requisitos INPI
   - Protocolo e depósito

### Terminologia Padronizada

| Termo Correto | Uso |
|---------------|-----|
| PI | Proteção de lógica técnica (20 anos) |
| MU | Proteção de forma física (15 anos) |
| RPC | Proteção de código (50 anos) |
| CII | Software com efeito técnico |
| NIT | Unidade oficial de PI |
| NAI | Critérios de patenteabilidade |
| Estado da Técnica | Tudo divulgado antes |
| Suficiência Descritiva | Capacidade de reprodução |
| SisGen | Sistema de biodiversidade |
| TRL | Nível de maturidade (1-9) |

### Limites de Caracteres (CRÍTICO)

| Campo | Mínimo | Máximo | Recomendado |
|-------|--------|--------|-------------|
| Título | - | 150 caracteres | 100-120 |
| Problema/Dor | 100 | 1.000 caracteres | 400-600 |
| Solução Técnica | 500 | 4.000 caracteres | 1.500-2.500 |
| Estado da Técnica | 200 | 2.000 caracteres | 800-1.200 |
| Vantagens | 100 | 1.500 caracteres | 400-800 |
| Palavras-chave | 50 | 100 caracteres | 70-90 |
| Resumo | 50 palavras | 200 palavras | 100-150 palavras |

### Gotchas Críticos

**Biotecnologia**:
- ❌ Nunca use "temperatura ambiente" → Use "20°C a 25°C"
- ❌ Nunca use "otimizado" → Use faixas numéricas
- ✅ Sempre use taxonomia exata (Gênero/Espécie)
- ✅ Sempre verifique SisGen se usar biodiversidade brasileira

**Software CII**:
- ❌ Nunca use prints de tela → Use fluxogramas em blocos
- ❌ Nunca coloque código-fonte no relatório
- ✅ Sempre use reivindicação tripla: MÉTODO + SISTEMA + MÍDIA
- ✅ Sempre defina efeito técnico (performance, memória, segurança)

**Produtos Físicos**:
- ❌ Nunca use fotografias → Use desenhos técnicos P&B
- ❌ Nunca use cores → Use P&B com hachuras
- ✅ Sempre inclua todas as vistas (frente, lateral, superior)

## Restrições Importantes

### Regras do Sistema

1. **NUNCA modificar** (via npm/gerenciador de pacotes):
   - `~/.nvm/`
   - `~/.npm-global/`
   - `/usr/local/bin/`
   - Arquivos de configuração global sem aprovação explícita

2. **PROJETO DEVE FICAR EM**:
   - Desenvolvimento local: `~/projetos/` OU este projeto
   - Produção/Cluster: `/mnt/container-data/projects/` (conforme mandato)

3. **Portas Permitidas**:
   - 62648 (SSH)
   - 80, 443 (web)
   - 6443 (k3s API - localhost ou 192.168.68.0/24)
   - **NUNCA abrir outras portas sem autorização**

4. **Kernel/Driver** (Pop!_OS 22.04):
   - **NUNCA mudar**: Kernel 6.17.4-76061704-generic
   - **NUNCA mudar**: Driver NVIDIA 580.82.09
   - **NUNCA mudar**: CUDA 13.0

### Regras de Negócio

1. **Prazo de Anterioridade**: 12 meses após qualquer divulgação
2. **Suficiência Descritiva**: Art. 24 LPI (capacidade de reprodução)
3. **Reivindicação 1**: SEMPRE independente
4. **Reivindicações 2+**: Podem ser dependentes
5. **NAI**: Novidade + Atividade Inventiva + Aplicação Industrial

### Restrições Técnicas

- **Máximo de Reivindicações**: 10 (recomendado: 3-6)
- **Tamanho de Upload**: 10-20MB por arquivo
- **Formatos Aceitos**: PDF, TIFF (desenhos)
- **Assinatura**: Digital obrigatória (ICP-Brasil)

## Dependências Externas

### APIs e Serviços

- **INPI e-INPI**: https://www.gov.br/inpi/pt-br
  - Protocolização de pedidos
  - Consulta de status
  - Download de RPIs

- **Espacenet**: https://worldwide.espacenet.com
  - Busca de anterioridade internacional

- **Google Patents**: https://patents.google.com
  - Busca de anterioridade

- **SisGen**: http://sisgen.mma.gov.br
  - Registro de biodiversidade

- **WIPO PatentScope**: https://patentscope.wipo.int
  - Busca internacional

### Bibliotecas e Frameworks

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Lucide**: https://lucide.dev

### Ferramentas de Desenvolvimento

- **GitHub Actions**: https://docs.github.com/actions
- **GitHub Pages**: https://docs.github.com/pages
- **Mermaid Live**: https://mermaid.live
- **PlantUML**: https://plantuml.com

## Documentação do Projeto

### Arquivos Principais

- `AGENTS.md`: Guia completo para agentes de IA
- `COMPREENSAO_PROJETO_E_FLUXOS.md`: Visão macro e fluxos detalhados
- `PLANEJAMENTO_SISTEMA_GESTAO_PI.md`: Planejamento estruturado
- `ARQUITETURA_AUTOMACAO.md`: Arquitetura de integração UPE-INPI
- `DEPLOY_GITHUB.md`: Guia de deploy no GitHub
- `README.md`: Documentação principal

### Especificações Técnicas

- `SPEC_FORMULARIO_PI.md`: Formulário de patente padrão
- `SPEC_FORMULARIO_CII.md`: Formulário de software CII
- `SPEC_FORMULARIO_RPC.md`: Formulário de registro de programa
- `SPEC_ANEXO_A.md`: Busca de anterioridade
- `SPEC_ANEXO_B.md`: Matriz problema x solução
- `SPEC_ANEXO_C.md`: Memorial descritivo
- `SPEC_ANEXO_F.md`: Qualificação de inventores

### Diagramas

- `DIAGRAMAS_UML_MERMAID.md`: Diagramas UML estritos
- `DIAGRAMAS_VISUAIS_MERMAID.md`: Fluxos visuais e arquitetura
- `DIAGRAMAS_UML_PROJETO_PATENTES.md`: Diagramas específicos do projeto

## Status Atual do Projeto

### ✅ Completado (pages-mvp)

- [x] Documentação mestra (planejamento, agentes, fluxos)
- [x] Especificações técnicas (SPEC_*.md)
- [x] Diagramas UML em Mermaid
- [x] Mock system em Next.js
- [x] CI/CD para GitHub Pages (workflow funcionando)
- [x] Landing page responsiva
- [x] Branch `pages-mvp` - **MVP estático completo**
- [x] **Formulários** PI/MU, CII, RPC totalmente implementados
- [x] **Anexos** A, B, C, F com componentes e validações
- [x] **Dashboard de Pedidos** (/pedidos) - listagem, filtros, ações
- [x] **Página de Confirmação** (/confirmacao) - revisão pré-submissão
- [x] **Página de Sucesso** (/sucesso) - feedback visual, download comprovante
- [x] **Sistema de Pedidos** - localStorage CRUD + status de anexos
- [x] **Mock API Anexos** - endpoints para A/B/C/F + validações
- [x] **Build estático** - funcionando sem erros
- [x] **Deploy GitHub Pages** - CI/CD automatizado

### 🚧 Em Andamento (próximos passos)

- [ ] Integração completa formulários ↔ anexos (pedidoId)
- [ ] Fluxo de submissão end-to-end
- [ ] Validação de anexos obrigatórios antes da submissão
- [ ] Landing page institucional melhorada
- [ ] Testes E2E do fluxo completo

### 📊 Status Detalhado de Implementação

#### Frontend (Next.js) - `pages-mvp` ✅

**Páginas Implementadas:**
- [x] `/` - Dashboard principal com KPIs
- [x] `/formulario-pi-mu` - Formulário PI/MU (tipo A+B)
- [x] `/formulario-cii` - Formulário CII (software)
- [x] `/formulario-rpc` - Formulário RPC (registro)
- [x] `/anexos` - Dashboard de Anexos (A/B/C/F)
- [x] `/anexos/a` - Anexo A - Busca de Anterioridade
- [x] `/anexos/b` - Anexo B - Matriz Problema x Solução
- [x] `/anexos/c` - Anexo C - Memorial Descritivo
- [x] `/anexos/f` - Anexo F - Qualificação de Inventores
- [x] `/pedidos` - **NOVO** Dashboard de pedidos do usuário
- [x] `/confirmacao` - **NOVO** Revisão pré-submissão
- [x] `/sucesso` - **NOVO** Página de sucesso pós-submissão

**Componentes:**
- [x] Layout principal e página inicial (dashboard)
- [x] Componentes base (KPICard, Badges)
- [x] Formulários PI/MU, CII, RPC
- [x] Componentes de Anexos (A, B, C, F)
- [x] Componentes compartilhados (InventorCard, SolucaoExistenteCard, etc.)

**Bibliotecas:**
- [x] `lib/mock-api.ts` - API mock para pedidos PI/CII/RPC
- [x] `lib/mock-api-anexos.ts` - **NOVO** API mock para anexos
- [x] `lib/pedido-storage.ts` - **NOVO** Gerenciamento de pedidos (localStorage)
- [x] `lib/validations/anexos.ts` - Schemas Zod para anexos

#### Backend (planejado para `feature/github-pages-cicd`)
- [x] API mock (simulação)
- [ ] API Routes reais (removidas para static export)
- [ ] Banco de dados PostgreSQL
- [ ] Autenticação JWT/OAuth2
- [ ] Upload de arquivos
- [ ] Sistema de notificações

#### Testes
- [ ] Testes unitários (Jest)
- [ ] Testes integração (React Testing Library)
- [ ] Testes E2E (Playwright)

### 📋 Planejado

- [ ] Backend API (Next.js API Routes)
- [ ] Banco de dados PostgreSQL
- [ ] Autenticação e autorização
- [ ] Integração INPI e-INPI
- [ ] RPI Scraper automático
- [ ] Sistema de notificações
- [ ] Dashboard administrativo
- [ ] Relatórios e analytics

## Contatos e Suporte

| Papel | Contato | Responsabilidade |
|-------|---------|------------------|
| NIT UPE | propegi.gerenciatransferetec@upe.br | Submissão de pedidos |
| Comissão de Avaliação | [a definir] | Análise técnica |
| Suporte Técnico | [a definir] | Dúvidas técnicas |
| GitHub Issues | [repo]/issues | Bugs e features |

---

**Versão**: 1.1 (pages-mvp)
**Data**: 9 de janeiro de 2026
**Branch Atual**: `pages-mvp`
**Status**: ✅ MVP estático completo - deploy no GitHub Pages
**Metodologia**: Engenharia de Contexto - Projeto Crush

## Changelog

### v1.1 (2026-01-09) - pages-mvp
- ✅ Adicionada página `/pedidos` - Dashboard de pedidos do usuário
- ✅ Adicionada página `/confirmacao` - Revisão pré-submissão
- ✅ Adicionada página `/sucesso` - Página de sucesso pós-submissão
- ✅ Criado `lib/pedido-storage.ts` - Sistema de gerenciamento de pedidos (localStorage)
- ✅ Criado `lib/mock-api-anexos.ts` - Mock API para anexos A/B/C/F
- ✅ Removido `app/api/` (incompatível com static export)
- ✅ Build estático funcionando sem erros
- ✅ Deploy automatizado via GitHub Actions
