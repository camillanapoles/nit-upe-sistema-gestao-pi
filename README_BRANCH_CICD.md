# 🚀 Branch: feature/github-pages-cicd

## 📋 Descrição

Este branch contém a implementação completa de CI/CD (Continuous Integration/Continuous Deployment) para o GitHub Pages do Sistema de Gestão de Propriedade Intelectual da UPE (Projeto Crush).

## ✨ O Que Foi Implementado

### 1. Workflows CI/CD Completos

#### 🚀 Workflow Principal: `github-pages-cicd.yml`
Workflow principal para build, validação e deploy automático no GitHub Pages.

**Jobs:**
- **build-and-validate**: Validação de HTML, CSS, JavaScript, estrutura de arquivos, formulários e links
- **security-scan**: Scan de vulnerabilidades com Trivy
- **accessibility**: Testes de acessibilidade com Pa11y
- **performance**: Testes de performance com Lighthouse CI
- **deploy**: Deploy automático para GitHub Pages
- **verify-deployment**: Verificação pós-deployment

**Triggers:**
- Push para branches: `main`, `master`, `feature/github-pages-cicd`
- Pull Requests para: `main`, `master`
- Manual (workflow_dispatch)

#### 🔍 Workflow de PR: `pr-validation.yml`
Validação automática de Pull Requests.

**Jobs:**
- **validate**: Validação de código (HTML, CSS, JS, MD)
- **validate-specs**: Validação de arquivos SPEC
- **test-forms**: Testes de formulários
- **validate-links**: Validação de links internos
- **validate-changelog**: Verificação de changelog
- **pr-status**: Status geral do PR com labels automáticos

**Triggers:**
- Pull Requests para: `main`, `master`
- Quando PR é aberto, atualizado ou recebe labels

#### 🎉 Workflow de Release: `release.yml`
Gerenciamento automático de releases.

**Jobs:**
- **prepare-release**: Preparação de artifacts e notas de release
- **create-release**: Criação de release no GitHub com artifacts
- **post-release**: Tarefas pós-release (metrics, notifications)

**Triggers:**
- Push de tags: `v*.*.*`
- Manual (workflow_dispatch) com input de versão

### 2. Arquivos de Configuração

#### 📝 `.markdownlint.json`
Configuração do linter de Markdown.

#### 🟨 `.eslintrc.json`
Configuração do linter de JavaScript.

#### 🎨 `.stylelintrc.json`
Configuração do linter de CSS.

#### 🤖 `.github/dependabot.yml`
Configuração do Dependabot para atualizações automáticas de dependências.

#### 📦 `package.json`
Gerenciamento de dependências de desenvolvimento.

#### 🔧 `.nvmrc`
Especificação da versão do Node.js (v20).

#### 📄 `.gitattributes`
Configuração de atributos Git para melhor compatibilidade.

## 🚀 Como Usar

### Setup Inicial

1. **Fazer checkout do branch:**
```bash
git checkout feature/github-pages-cicd
```

2. **Instalar dependências (local):**
```bash
npm install
```

3. **Testar localmente:**
```bash
# Validar código
npm run validate

# Executar testes
npm test

# Servir localmente
npm run serve
```

### Configurar no GitHub

1. **Configurar GitHub Pages:**
   - Vá em: `Settings` → `Pages`
   - Source: `GitHub Actions`
   - Clique em `Save`

2. **Configurar Branch Protection (recomendado):**
   - Vá em: `Settings` → `Branches`
   - Adicionar regra para `main`:
     - Require pull request before merging
     - Require status checks to pass
     - Selecione: `build-and-validate`, `security-scan`, `accessibility`, `performance`
     - Require branches to be up to date

3. **Habilitar GitHub Actions:**
   - Vá em: `Actions` → `General`
   - Habilitar: `Allow all actions and reusable workflows`

### Fluxo de Trabalho

#### Deploy Automático

```bash
# Fazer push para main/master
git checkout main
git merge feature/github-pages-cicd
git push origin main

# Deploy acontece automaticamente em ~5 minutos
```

#### Criar Pull Request

```bash
# Criar branch de feature
git checkout -b feature/nova-funcionalidade

# Fazer mudanças
# ...

# Commit e push
git add .
git commit -m "feat: nova funcionalidade"
git push origin feature/nova-funcionalidade

# Criar PR no GitHub
# Validações executam automaticamente
```

#### Criar Release

```bash
# Criar tag
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# Release é criado automaticamente
```

Ou via GitHub Actions manual:
1. Vá em: `Actions` → `Release Management`
2. Clique em: `Run workflow`
3. Insira versão: `1.0.0`
4. Clique em: `Run workflow`

## 📊 Status Checks

O seguintes status checks serão executados em cada commit/PR:

- ✅ Build & Validate
- ✅ Security Scan
- ✅ Accessibility Tests
- ✅ Performance Tests
- ✅ Deploy (apenas no push para main/master)

## 🔍 Validações Executadas

### HTML
- Validação de sintaxe W3C
- Verificação de tags obrigatórias
- Validação de atributos

### CSS
- Validação de sintaxe CSS
- Verificação de regras
- Conformidade com padrões

### JavaScript
- Validação de sintaxe ES6+
- Linting com ESLint
- Verificação de erros

### Markdown
- Validação de sintaxe CommonMark
- Verificação de links
- Formatação consistente

### Especificações (SPEC)
- Verificação de seções obrigatórias
- Validação de tabelas de dados
- Consistência de IDs de campos

### Formulários
- Verificação de campos obrigatórios
- Validação de limites de caracteres
- Verificação de máscaras de input
- Validação de uploads

### Links
- Verificação de links internos
- Validação de links externos (se configurado)
- Detecção de links quebrados

### Segurança
- Scan de vulnerabilidades com Trivy
- Análise de dependências
- CodeQL Security Analysis

### Acessibilidade
- Testes de WCAG 2.1 com Pa11y
- Verificação de contraste
- Validação de ARIA

### Performance
- Testes de Lighthouse CI
- Verificação de Core Web Vitals
- Otimização de assets

## 📈 Monitoramento

### GitHub Actions Dashboard

Acompanhe todos os workflows em: `Actions` → `Workflows`

### Status Checks

Verifique o status dos checks na aba `Checks` de cada commit/PR.

### Deployment History

Ver histórico de deploys em: `Settings` → `Pages` → `Deploys`

## 🐛 Troubleshooting

### Workflow falhou

1. Vá em: `Actions` → Clique no workflow falhado
2. Veja o log detalhado em cada step
3. Identifique o erro
4. Corrija o código
5. Faça novo commit

### Deploy não aconteceu

1. Verifique se o branch é `main` ou `master`
2. Verifique se GitHub Pages está configurado para `GitHub Actions`
3. Verifique se há erros no workflow
4. Verifique se há problemas de permissões

### Validações falhando

1. Veja o log detalhado
2. Instale ferramentas localmente e teste:
```bash
npm install -g html-validator stylelint eslint markdownlint-cli
```
3. Corrija os erros
4. Faça novo commit

## 📚 Documentação Relacionada

- [AGENTS.md](AGENTS.md) - Guia para desenvolvedores
- [DEPLOY_GITHUB.md](DEPLOY_GITHUB.md) - Guia de deploy no GitHub
- [README_GITHUB_PAGES.md](README_GITHUB_PAGES.md) - Documentação do GitHub Pages

## 🔄 Fluxo de Branches

```
main/master
  ├── feature/github-pages-cicd (este branch)
  └── feature/* (branches de funcionalidade)
```

### Merges

- `feature/*` → `feature/github-pages-cicd` (desenvolvimento)
- `feature/github-pages-cicd` → `main` (deploy)

## 🎯 Próximos Passos

1. ✅ Workflows CI/CD criados
2. ✅ Validações implementadas
3. ✅ Security scans configurados
4. ✅ Accessibility tests configurados
5. ✅ Performance tests configurados
6. ✅ Deploy automático configurado
7. ⏳ Merge com branch `main`
8. ⏳ Testar em produção
9. ⏳ Documentar processo

## 📞 Suporte

- **Issues**: https://github.com/username/crush-teacher/issues
- **Discussions**: https://github.com/username/crush-teacher/discussions
- **NIT UPE**: propegi.gerenciatransferetec@upe.br

---

**Branch:** `feature/github-pages-cicd`
**Status:** ✅ Ativo e funcional
**Última atualização:** 29 de dezembro de 2025
**Metodologia:** Engenharia de Contexto - Projeto Crush
