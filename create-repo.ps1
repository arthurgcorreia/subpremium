# Script para criar repositório GitHub e fazer push inicial
# Requer: GitHub CLI (gh) instalado OU token GITHUB_TOKEN configurado

Write-Host "🚀 Configurando repositório GitHub para subpremium..." -ForegroundColor Cyan

# Verificar se GitHub CLI está instalado
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue

if ($ghInstalled) {
    Write-Host "✓ GitHub CLI encontrado" -ForegroundColor Green
    
    # Verificar se está autenticado
    $authStatus = gh auth status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Autenticado no GitHub" -ForegroundColor Green
        
        # Criar repositório
        Write-Host "📦 Criando repositório no GitHub..." -ForegroundColor Yellow
        gh repo create subpremium --private --source=. --remote=origin --push --description "SGA - Sistema de Gestão de Assinaturas"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Repositório criado e código enviado com sucesso!" -ForegroundColor Green
            Write-Host "🔗 Acesse: https://github.com/$(gh api user --jq .login)/subpremium" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Erro ao criar repositório. Verifique se já existe ou se você tem permissões." -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  Não autenticado no GitHub CLI" -ForegroundColor Yellow
        Write-Host "Execute: gh auth login" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  GitHub CLI não encontrado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opção 1: Instalar GitHub CLI" -ForegroundColor Cyan
    Write-Host "  winget install --id GitHub.cli" -ForegroundColor Gray
    Write-Host "  Depois execute: gh auth login" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Opção 2: Criar manualmente" -ForegroundColor Cyan
    Write-Host "  1. Acesse: https://github.com/new" -ForegroundColor Gray
    Write-Host "  2. Nome: subpremium" -ForegroundColor Gray
    Write-Host "  3. Depois execute:" -ForegroundColor Gray
    Write-Host "     git remote add origin https://github.com/SEU-USUARIO/subpremium.git" -ForegroundColor Gray
    Write-Host "     git push -u origin main" -ForegroundColor Gray
}

