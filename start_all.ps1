# Script pour démarrer le backend et le frontend ensemble
# Usage: .\start_all.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 Démarrage du Chatbot IUC" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = $PSScriptRoot

# Vérifier que nous sommes à la racine du projet
if (-not (Test-Path (Join-Path $PSScriptRoot "package.json"))) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis la racine du projet" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Étapes de démarrage:" -ForegroundColor Yellow
Write-Host "  1. Vérification de l'environnement..." -ForegroundColor Gray
Write-Host "  2. Démarrage du backend (port 8000)..." -ForegroundColor Gray
Write-Host "  3. Démarrage du frontend (port 3000)..." -ForegroundColor Gray
Write-Host ""

# ========================================
# ÉTAPE 1: Vérifications
# ========================================

Write-Host "✅ Vérification de l'environnement..." -ForegroundColor Yellow

# Vérifier le backend
if (-not (Test-Path (Join-Path $backendPath "venv"))) {
    Write-Host "❌ L'environnement virtuel Python n'existe pas !" -ForegroundColor Red
    Write-Host "   Exécutez: cd backend; python -m venv venv" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path (Join-Path $backendPath ".env"))) {
    Write-Host "❌ Le fichier .env n'existe pas dans backend/ !" -ForegroundColor Red
    Write-Host "   Exécutez: cd backend; python setup_env.py" -ForegroundColor Yellow
    exit 1
}

# Vérifier pnpm/npm
$packageManager = $null
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    $packageManager = "pnpm"
    Write-Host "✅ pnpm trouvé" -ForegroundColor Green
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
    $packageManager = "npm"
    Write-Host "✅ npm trouvé (pnpm recommandé)" -ForegroundColor Yellow
} else {
    Write-Host "❌ Ni pnpm ni npm n'est installé !" -ForegroundColor Red
    Write-Host "   Installez Node.js depuis https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# ========================================
# ÉTAPE 2: Démarrer le Backend
# ========================================

Write-Host "🔧 Démarrage du backend..." -ForegroundColor Yellow

$backendScript = Join-Path $backendPath "main.py"
$backendPython = Join-Path $backendPath "venv\Scripts\python.exe"

if (-not (Test-Path $backendPython)) {
    Write-Host "❌ Python de l'environnement virtuel non trouvé !" -ForegroundColor Red
    exit 1
}

# Démarrer le backend en arrière-plan
Write-Host "   Backend démarré sur http://localhost:8000" -ForegroundColor Gray
Start-Process -FilePath $backendPython -ArgumentList $backendScript -WindowStyle Normal

# Attendre que le backend démarre
Write-Host "   Attente du démarrage du backend..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Vérifier que le backend répond
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -Method GET -UseBasicParsing -TimeoutSec 2
    Write-Host "✅ Backend démarré avec succès !" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Le backend semble démarrer mais n'est pas encore prêt" -ForegroundColor Yellow
    Write-Host "   Vérifiez manuellement: http://localhost:8000/api/health" -ForegroundColor Gray
}

Write-Host ""

# ========================================
# ÉTAPE 3: Démarrer le Frontend
# ========================================

Write-Host "🎨 Démarrage du frontend..." -ForegroundColor Yellow

# Vérifier si node_modules existe
if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "   Installation des dépendances..." -ForegroundColor Gray
    & $packageManager install
}

Write-Host "   Frontend démarré sur http://localhost:3000" -ForegroundColor Gray
Write-Host ""

# Démarrer le frontend (dans le terminal actuel)
Set-Location $frontendPath
& $packageManager dev

# Note: Le script s'arrêtera ici car pnpm/npm dev bloque
# Pour arrêter, utilisez CTRL+C et arrêtez aussi le processus backend

