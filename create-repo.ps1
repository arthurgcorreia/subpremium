# Script para criar repositório GitHub e fazer push inicial
Write-Host "🚀 Configurando repositório GitHub para subpremium..." -ForegroundColor Cyan

# Verificar se GitHub CLI está instalado
$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue

if ($null -ne $ghInstalled) {
    Write-Host "✓ GitHub CLI encontrado" -ForegroundColor Green
    
    # Verificar autenticação
    gh auth status 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Autenticado no GitHub" -ForegroundColor Green
        Write-Host "📦 Criando repositório no GitHub..." -ForegroundColor Yellow
        
        gh repo create subpremium --private --source=. --remote=origin --push --description "SGA - Sistema de Gestão de Assinaturas"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Repositório criado e código enviado com sucesso!" -ForegroundColor Green
            $username = gh api user --jq .login
            Write-Host "🔗 Acesse: https://github.com/$username/subpremium" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Erro ao criar repositório." -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  Não autenticado. Execute: gh auth login" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  GitHub CLI não encontrado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para criar manualmente:" -ForegroundColor Cyan
    Write-Host "1. Acesse: https://github.com/new" -ForegroundColor Gray
    Write-Host "2. Nome: subpremium" -ForegroundColor Gray
    Write-Host "3. Execute: git remote add origin https://github.com/SEU-USUARIO/subpremium.git" -ForegroundColor Gray
    Write-Host "4. Execute: git push -u origin main" -ForegroundColor Gray
}
