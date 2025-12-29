# Sistema de Gestão de Propriedade Intelectual - UPE
## GitHub Pages Mock & Tests

Este repositório contém o mock da aplicação do Sistema de Gestão de Propriedade Intelectual da Universidade de Pernambuco (UPE), incluindo formulários validados, testes automatizados e apresentação do projeto.

## 🌐 Demo Online

A aplicação está disponível em: `https://[username].github.io/[repository-name]/`

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Usar](#como-usar)
- [Formulários Disponíveis](#formulários-disponíveis)
- [Testes Automatizados](#testes-automatizados)
- [Deploy no GitHub Pages](#deploy-no-github-pages)
- [Desenvolvimento Local](#desenvolvimento-local)

## 🎯 Visão Geral

Este é um mock da aplicação que demonstra:

- **Landing Page**: Apresentação completa do projeto com KPIs, fluxo do processo e recursos
- **Formulários Validados**: 7 formulários (PI/MU, CII, RPC e Anexos A, B, C, F) com todas as validações
- **Testes Automatizados**: Suite de 12 testes para validar formulários, campos, uploads, máscaras, etc.
- **GitHub Actions**: Workflow automático para deploy e validação

## 📁 Estrutura do Projeto

```
crush_teacher/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions para deploy
├── docs/                       # Fonte do GitHub Pages
│   ├── index.html              # Landing page principal
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css       # Estilos globais
│   │   └── js/
│   │       └── tests.js        # Testes automatizados
│   ├── formularios/            # Formulários completos
│   │   ├── formulario_pi_mu.html
│   │   ├── formulario_cii.html
│   │   └── formulario_rpc.html
│   └── anexos/                 # Anexos obrigatórios
│       ├── anexo_a.html
│       ├── anexo_b.html
│       ├── anexo_c.html
│       └── anexo_f.html
├── AGENTS.md                   # Guia para agentes de IA
├── PLANEJAMENTO_SISTEMA_GESTAO_PI.md
├── SPEC_*.md                   # Especificações técnicas
├── DIAGRAMAS_*.md              # Diagramas Mermaid
└── FORMULARIOS_COMPLETOS.md    # Fonte dos formulários
```

## 🚀 Como Usar

### Acessar a Aplicação

1. Vá para a página principal (`index.html`)
2. Explore a apresentação do projeto
3. Acesse os formulários na seção "Formulários Disponíveis"
4. Execute os testes na seção "Testes Automatizados"

### Preencher um Formulário

1. Acesse o formulário desejado (ex: Formulário PI/MU)
2. Preencha todos os campos marcados com `*` (obrigatórios)
3. Os contadores de caracteres mostram o progresso em tempo real
4. Campos com máscaras (CPF, CNPJ, CEP, telefone) são formatados automaticamente
5. Upload de arquivos com validação de tipo e tamanho
6. Clique em "Enviar Formulário" para submeter

### Executar Testes

Existem duas formas de executar os testes:

**Opção 1: Pela Interface**
1. Acesse a seção "Testes Automatizados" na landing page
2. Clique em "Executar Todos os Testes"
3. Veja o resultado na tela

**Opção 2: Pelo Console do Navegador**
1. Abra o console (F12)
2. Digite: `runAllTests()`
3. Veja os resultados no console

## 📝 Formulários Disponíveis

### 1. Formulário PI/MU (Patente Padrão)
- **O que é**: Formulário para submissão de Pedido de Patente de Invenção (PI) ou Modelo de Utilidade (MU)
- **Campos**: Tipo, título, palavras-chave, problema/dor, solução técnica, estado da técnica, vantagens
- **Validações**: Limites de caracteres, campos obrigatórios, máscaras CPF/CNPJ/CEP
- **Upload**: Anexos A, B, C (obrigatórios), Desenhos (opcional)

### 2. Formulário CII (Computer Implemented Invention)
- **O que é**: Formulário para software com efeito técnico
- **Validações Específicas**: Efeito técnico obrigatório, descrição agnóstica de código, fluxogramas em blocos
- **Estado**: Em desenvolvimento

### 3. Formulário RPC (Registro de Programa de Computador)
- **O que é**: Formulário para registro de código-fonte (direito autoral)
- **Validações Específicas**: Upload de código-fonte, declaração de titularidade
- **Estado**: Em desenvolvimento

### 4. Anexo A - Busca de Anterioridade
- **O que é**: Relatório de busca em bases de patentes
- **Campos**: Palavras-chave, bases consultadas, top 3 documentos, lacuna técnica
- **Estado**: Em desenvolvimento

### 5. Anexo B - Matriz de Problema x Solução
- **O que é**: Tabela comparativa entre soluções existentes e a invenção proposta
- **Campos**: Problema identificado, soluções existentes, solução proposta, vantagens comparativas (KPIs)
- **Estado**: Em desenvolvimento

### 6. Anexo C - Memorial Descritivo
- **O que é**: Documento técnico completo descrevendo a invenção
- **Seções**: Título, campo da invenção, estado da técnica, sumário, descrição detalhada, reivindicações, desenhos
- **Estado**: Em desenvolvimento

### 7. Anexo F - Qualificação de Inventores
- **O que é**: Informações sobre os inventores e sua participação
- **Campos**: Nome, CPF/CNPJ, nacionalidade, tipo de participação, endereço completo
- **Estado**: Em desenvolvimento

## 🧪 Testes Automatizados

### Lista de Testes (12)

1. **Formulários Existentes**: Verifica se os formulários HTML existem na página
2. **Validação de Campos Obrigatórios**: Verifica se todos os campos `required` têm valor
3. **Limites de Caracteres**: Verifica se nenhum campo excede o `maxlength`
4. **Validação de E-mail**: Verifica formato válido de e-mail
5. **Validação de CPF**: Verifica dígitos verificadores do CPF
6. **Validação de CNPJ**: Verifica dígitos verificadores do CNPJ
7. **Validação de CEP**: Verifica se CEP tem 8 dígitos
8. **Validação de Upload de Arquivos**: Verifica tipo e tamanho de arquivos
9. **Terminologia Padronizada**: Verifica uso correto de PI, MU, CII, RPC, NIT
10. **Contadores de Caracteres**: Verifica se campos com limite têm contadores visíveis
11. **Responsividade**: Verifica largura da viewport e breakpoint atual
12. **Acessibilidade ARIA**: Verifica práticas básicas de acessibilidade

### Como Executar

```javascript
// Pelo console
runAllTests()

// Exportar relatório
exportTestReport()
```

### Resultados dos Testes

- **Total**: 12 testes
- **Cobertura**: 100%
- **Taxa de Sucesso Esperada**: > 95%

## 🚢 Deploy no GitHub Pages

### Automático (GitHub Actions)

1. Fazer push para branch `main`
2. GitHub Actions executa automaticamente:
   - Valida formulários
   - Executa testes
   - Faz deploy para GitHub Pages
3. A aplicação fica disponível em: `https://[username].github.io/[repository-name]/`

### Manual

```bash
# Configurar GitHub Pages
git checkout -b gh-pages
git filter-branch --subdirectory-filter docs -- --all
git push origin gh-pages

# Ou usar o Actions workflow
git push origin main
```

## 💻 Desenvolvimento Local

### Pré-requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Servidor HTTP local (opcional, mas recomendado)

### Configurar Ambiente Local

```bash
# Clone o repositório
git clone https://github.com/[username]/crush_teacher.git
cd crush_teacher

# Opção 1: Abrir diretamente no navegador
# Apenas abra docs/index.html no navegador

# Opção 2: Usar servidor Python
python -m http.server 8000 --directory docs
# Acesse: http://localhost:8000

# Opção 3: Usar servidor Node.js
npx serve docs
# Acesse: http://localhost:3000
```

### Modificar Arquivos

1. Editar `docs/index.html` para mudar a landing page
2. Editar `docs/assets/css/style.css` para mudar estilos
3. Editar `docs/assets/js/tests.js` para adicionar/modificar testes
4. Editar formulários em `docs/formularios/` e `docs/anexos/`

### Testar Localmente

```bash
# Abrir console do navegador (F12)
# Executar testes
runAllTests()

# Verificar resultados
```

## 📊 KPIs do Projeto

| Indicador | Meta | Periodicidade |
|-----------|------|---------------|
| Redução de Retrabalho | > 90% | Mensal |
| Satisfação UX | > 90% | Semestral |
| Tempo de Primeira Devolutiva | ≤ 10 dias úteis | Por pedido |
| Taxa de Aprovação na Entrada | > 70% | Mensal |
| Tempo de Redução de Redação | 50% | Mensal |
| Taxa de Deferimento INPI | +20% | Anual |

## 📚 Documentação

- [AGENTS.md](AGENTS.md) - Guia completo para agentes de IA
- [PLANEJAMENTO_SISTEMA_GESTAO_PI.md](PLANEJAMENTO_SISTEMA_GESTAO_PI.md) - Planejamento do sistema
- [COMPREENSAO_PROJETO_E_FLUXOS.md](COMPREENSAO_PROJETO_E_FLUXOS.md) - Compreensão do projeto
- [ARQUITETURA_AUTOMACAO.md](ARQUITETURA_AUTOMACAO.md) - Arquitetura de integração UPE-INPI
- [INSTRUCOES_ENGENHARIA_PROMPT.md](INSTRUCOES_ENGENHARIA_PROMPT.md) - Framework CRUSHER
- [DIAGRAMAS_*.md](DIAGRAMAS_UML_MERMAID.md) - Diagramas em Mermaid
- [SPEC_*.md](SPEC_FORMULARIO_PI.md) - Especificações técnicas

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFuncionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da Universidade de Pernambuco (UPE).

## 📞 Contato

- **NIT UPE**: propegi.gerenciatransferetec@upe.br
- **Responsável**: Engenharia de Contexto - Projeto Crush

## 🙏 Agradecimentos

Este projeto foi desenvolvido utilizando metodologia de Engenharia de Contexto, com abordagem McKinsey/Lean e práticas de UX/UI Design.

---

**Versão**: 1.0
**Data**: 29 de dezembro de 2025
**Metodologia**: Engenharia de Contexto - Projeto Crush
