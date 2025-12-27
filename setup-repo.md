# Setup do Repositório GitHub

## Passo 1: Criar o repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `subpremium`
3. Descrição: "SGA - Sistema de Gestão de Assinaturas"
4. Escolha: **Private** (recomendado) ou **Public**
5. **NÃO** marque "Initialize this repository with a README"
6. Clique em "Create repository"

## Passo 2: Conectar e fazer push

Após criar o repositório, execute os comandos abaixo (substitua `SEU-USUARIO` pelo seu username do GitHub):

```bash
git remote add origin https://github.com/SEU-USUARIO/subpremium.git
git push -u origin main
```

## Passo 3: Criar o primeiro Pull Request (opcional)

Se quiser criar um PR para revisão:

1. Crie uma branch de desenvolvimento:
```bash
git checkout -b develop
git push -u origin develop
```

2. No GitHub, vá em "Pull requests" > "New pull request"
3. Base: `main` ← Compare: `develop`
4. Título: "feat: Initial project setup - SGA System"
5. Descrição: "Initial commit with complete SGA system including Landing Page, Admin Dashboard, and Supabase integration"
6. Crie o PR

---

**Alternativa com GitHub CLI (se instalado):**

```bash
gh repo create subpremium --private --source=. --remote=origin --push
```

