# 🚀 GUIA DE DEPLOY NO GITHUB

## Passo a Passo para Colocar a Aplicação Online

### 1️⃣ Preparar o Repositório Local

```bash
# Verificar arquivos criados
tree docs -L 2
tree .github -L 2

# Inicializar git (se ainda não iniciado)
git init
```

### 2️⃣ Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `crush-teacher` (ou outro nome)
3. Visibilidade: Private ou Public
4. NÃO inicialize com README, .gitignore ou license
5. Clique em "Create repository"

### 3️⃣ Fazer Push para GitHub

```bash
# Adicionar remote
git remote add origin https://github.com/SEU_USERNAME/crush-teacher.git

# Branch main
git branch -M main

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "feat: initial commit - GitHub Pages mock with forms and tests"

# Push para GitHub
git push -u origin main
```

### 4️⃣ Configurar GitHub Pages

**Método A: Via Interface do GitHub (Mais Simples)**

1. Vá para o repositório no GitHub
2. Clique em **Settings** (engrenagem)
3. No menu lateral, clique em **Pages**
4. Em "Build and deployment":
   - Source: Selecione **Deploy from a branch**
   - Branch: Selecione **main** → **/docs** (IMPORTANTE: pasta docs!)
   - Clique em **Save**

**Método B: Via GitHub Actions (Automático com Testes)**

1. O workflow `.github/workflows/deploy.yml` já está configurado
2. Após fazer push, o Actions vai executar automaticamente:
   - Valida formulários
   - Executa testes
   - Faz deploy para GitHub Pages
3. URL será: `https://SEU_USERNAME.github.io/crush-teacher/`

### 5️⃣ Aguardar o Deploy

- **Método A**: Aguarde 1-3 minutos, GitHub Pages irá fazer o build
- **Método B**: Vá em "Actions" para acompanhar o workflow

### 6️⃣ Acessar a Aplicação

URL será: `https://SEU_USERNAME.github.io/crush-teacher/`

Substitua:
- `SEU_USERNAME` = seu username do GitHub
- `crush-teacher` = nome do seu repositório

### 7️⃣ Testar a Aplicação

1. **Landing Page**
   - Navegue pela página
   - Teste scroll suave
   - Verifique responsividade (F12 → device toolbar)

2. **Formulário PI/MU**
   - Acesse: `https://SEU_USERNAME.github.io/crush-teacher/formularios/formulario_pi_mu.html`
   - Preencha campos
   - Teste validações
   - Teste upload de arquivos
   - Clique em "Enviar Formulário"

3. **Testes Automatizados**
   - Vá para seção "Testes Automatizados" na landing page
   - Clique em "Executar Todos os Testes"
   - Ou abra console (F12) e digite: `runAllTests()`

## 🔧 Troubleshooting

### Problema: Página não carrega (404)

**Solução:**
1. Verifique se configurou Pages para usar a pasta `/docs`
2. Aguarde 3-5 minutos (GitHub Pages pode demorar)
3. Verifique se o arquivo `docs/index.html` existe

### Problema: Styles não carregam

**Solução:**
1. Verifique caminhos dos CSS/JS (devem ser relativos: `../assets/css/style.css`)
2. Verifique se arquivos existem no repositório
3. Limpar cache do navegador (Ctrl+Shift+R)

### Problema: Actions falha

**Solução:**
1. Vá em "Actions" no GitHub
2. Clique no workflow que falhou
3. Veja o log do erro
4. Corrija o erro e faça novo commit

### Problema: Formulários não funcionam

**Solução:**
1. Verifique se JavaScript está habilitado no navegador
2. Abra console (F12) para ver erros
3. Verifique se caminho do tests.js está correto

## 📊 Checklist de Deploy

- [ ] Repositório criado no GitHub
- [ ] Git inicializado e configurado
- [ ] Arquivos commitados e pushed
- [ ] GitHub Pages configurado (branch main → /docs)
- [ ] Deploy realizado (aguardou 1-3 min)
- [ ] URL acessível
- [ ] Landing page funcionando
- [ ] Formulários funcionando
- [ ] Testes executando
- [ ] Responsividade testada (mobile, tablet, desktop)

## 🎉 Parabéns!

Sua aplicação está online! 🎊

Agora você tem:
- ✅ Landing page profissional
- ✅ Formulários validados
- ✅ Testes automatizados
- ✅ Deploy automático via GitHub Actions
- ✅ URL pública acessível

## 📝 URLs Importantes

### Aplicação
- **Principal**: `https://SEU_USERNAME.github.io/crush-teacher/`
- **Formulário PI/MU**: `https://SEU_USERNAME.github.io/crush-teacher/formularios/formulario_pi_mu.html`

### GitHub
- **Repositório**: `https://github.com/SEU_USERNAME/crush-teacher`
- **Actions**: `https://github.com/SEU_USERNAME/crush-teacher/actions`
- **Settings**: `https://github.com/SEU_USERNAME/crush-teacher/settings`

## 🔄 Como Atualizar

Para fazer mudanças e atualizar a aplicação:

```bash
# 1. Fazer as mudanças
# Editar arquivos em docs/

# 2. Commit e push
git add .
git commit -m "feat: descrição das mudanças"
git push origin main

# 3. Aguardar Actions/Deploy
# GitHub Pages irá atualizar automaticamente em 1-3 min
```

## 📚 Documentação Adicional

- `README_GITHUB_PAGES.md` - Documentação completa do projeto
- `ESTRUTURA_GITHUB_PAGES.md` - Estrutura criada
- `AGENTS.md` - Guia para desenvolvedores
- `PLANEJAMENTO_SISTEMA_GESTAO_PI.md` - Planejamento do sistema

---

**Pronto para colocar online?** Siga os passos acima! 🚀
