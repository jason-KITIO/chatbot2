# Script de démarrage du serveur backend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Démarrage du serveur Backend IUC Chatbot" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Aller dans le dossier du script
Set-Location $PSScriptRoot

# Vérifier que l'environnement virtuel existe
if (-not (Test-Path "venv\Scripts\python.exe")) {
    Write-Host "❌ L'environnement virtuel n'existe pas !" -ForegroundColor Red
    Write-Host "Exécutez d'abord: .\install.ps1" -ForegroundColor Yellow
    exit 1
}

# Vérifier que .env existe et contient la clé API
if (-not (Test-Path ".env")) {
    Write-Host "❌ Le fichier .env n'existe pas !" -ForegroundColor Red
    Write-Host "Exécutez: python setup_env.py" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environnement virtuel trouvé" -ForegroundColor Green
Write-Host "✅ Fichier .env trouvé" -ForegroundColor Green
Write-Host ""
Write-Host "Démarrage du serveur sur http://localhost:8000" -ForegroundColor Yellow
Write-Host "Appuyez sur CTRL+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""
Write-Host "Documentation API disponible sur: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

# Démarrer le serveur
& "venv\Scripts\python.exe" main.py


