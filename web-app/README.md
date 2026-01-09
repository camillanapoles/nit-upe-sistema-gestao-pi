# 🚀 Mock System - Next.js Application

Este é o **Sistema Mock de Gestão de Propriedade Intelectual** desenvolvido em Next.js 14, configurado para rodar no **GitHub Pages**.

## 📦 Estrutura

- **Framework:** Next.js 14 (App Router)
- **Estilo:** Tailwind CSS
- **Ícones:** Lucide React
- **Deploy:** GitHub Pages (Static Export)

## ⚙️ Configuração para GitHub Pages

Este projeto foi configurado especificamente para o GitHub Pages usando **Static Export**.

### Pré-requisitos no GitHub

1. **Repositório:** Este projeto está no branch `feature/mock-system-github-pages`.
2. **GitHub Pages:**
   - Vá em Settings > Pages
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`

3. **Secrets:**
   - O GitHub Actions usa automaticamente `${{ secrets.GITHUB_TOKEN }}` (padrão do GitHub).

## 🔄 Fluxo de Deploy Automático

### Workflow CI/CD

O arquivo `.github/workflows/deploy-mock.yml` gerencia o deploy:

1. **Trigger:** Push no branch `feature/mock-system-github-pages`.
2. **Checkout:** Baixa o código.
3. **Setup Node:** Instala Node.js 20 e cache `npm`.
4. **Install:** Roda `npm ci` na pasta `web-app`.
5. **Build:** Roda `npm run build` (gera pasta `web-app/out/` com arquivos estáticos).
6. **Deploy:** Usa `peaceiris/actions-gh-pages` para enviar `web-app/out/` para o branch `gh-pages`.
7. **Publish:** GitHub Pages detecta mudanças no `gh-pages` e atualiza o site.

### Acesso

Após o commit, aguarde ~2-3 minutos. O site estará disponível em:
`https://[SEU_USERNAME].github.io/crush-teacher/` (se este for o repo root)
ou `https://[SEU_USERNAME].github.io/crush-teacher/` (se configurado como custom domain).

## 🛠️ Como Executar Localmente

```bash
# Entrar na pasta da app
cd web-app

# Instalar dependências (se ainda não instalou)
npm install

# Rodar em modo dev
npm run dev

# Acessar: http://localhost:3000
```

## 📄 Arquivos Chave

- `next.config.js`: Configura `output: 'export'` (CRÍTICO para GitHub Pages).
- `lib/mock-api.ts`: Simula backend com dados em memória.
- `app/page.tsx`: Landing page principal.
- `tailwind.config.ts`: Cores UPE.

## ✅ Validação de Funcionalidades no GitHub Pages

Assegurar que o workflow execute e o site carregue corretamente:
1. **Loading States:** Verifique se o loading inicial aparece.
2. **API Mock:** Verifique se os KPIs aparecem (os dados vêm do `mock-api.ts`).
3. **Responsividade:** Teste zoom no celular (GitHub Pages é responsivo).
4. **Icons:** Lucide icons devem renderizar corretamente.
5. **Estilo:** Classes Tailwind devem aplicar (cores UPE azul).

---
**Desenvolvido por:** Sistema Crush - Engenharia de Contexto
