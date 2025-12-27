# 🚀 Quick Start - Criar Repositório GitHub

## Opção 1: Via GitHub Web (Recomendado - Mais Rápido)

### Passo 1: Criar Repositório
1. Acesse: **https://github.com/new**
2. **Repository name:** `subpremium`
3. **Description:** `SGA - Sistema de Gestão de Assinaturas`
4. Escolha: **Private** ✅
5. **NÃO marque** "Add a README file"
6. Clique em **"Create repository"**

### Passo 2: Conectar e Fazer Push
Execute estes comandos (substitua `SEU-USUARIO` pelo seu username):

```bash
git remote add origin https://github.com/SEU-USUARIO/subpremium.git
git branch -M main
git push -u origin main
```

**Pronto!** Seu código está no GitHub! 🎉

---

## Opção 2: Via GitHub CLI (Se Instalado)

```bash
# Instalar GitHub CLI (se não tiver)
winget install --id GitHub.cli

# Autenticar
gh auth login

# Criar repositório e fazer push
gh repo create subpremium --private --source=. --remote=origin --push --description "SGA - Sistema de Gestão de Assinaturas"
```

---

## ✅ Verificação

Após o push, acesse:
- **https://github.com/SEU-USUARIO/subpremium**

Você deve ver todos os arquivos do projeto!

