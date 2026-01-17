# Script d'installation PowerShell pour les dépendances
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation des dépendances Python" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Aller dans le dossier du script
Set-Location $PSScriptRoot

# Vérifier que l'environnement virtuel existe
if (-not (Test-Path "venv\Scripts\python.exe")) {
    Write-Host "❌ L'environnement virtuel n'existe pas !" -ForegroundColor Red
    Write-Host "Création de l'environnement virtuel..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "Mise à jour de pip..." -ForegroundColor Yellow
& "venv\Scripts\python.exe" -m pip install --upgrade pip --quiet

Write-Host "Installation des packages depuis requirements.txt..." -ForegroundColor Yellow
& "venv\Scripts\python.exe" -m pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ Installation terminée avec succès !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Vous pouvez maintenant démarrer le serveur avec:" -ForegroundColor Cyan
    Write-Host "  venv\Scripts\python.exe main.py" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
    Write-Host ""
}


