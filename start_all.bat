@echo off
echo ========================================
echo 🚀 Démarrage du Chatbot IUC
echo ========================================
echo.

cd /d "%~dp0"

REM Démarrer le backend dans une nouvelle fenêtre
echo Démarrage du backend...
cd backend
start "Backend IUC Chatbot" cmd /k "venv\Scripts\python.exe main.py"
cd ..

REM Attendre un peu
timeout /t 5 /nobreak > nul

REM Démarrer le frontend
echo Démarrage du frontend...
echo.

REM Essayer pnpm d'abord
where pnpm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Utilisation de pnpm...
    pnpm dev
) else (
    REM Sinon utiliser npm
    where npm >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Utilisation de npm...
        npm run dev
    ) else (
        echo ❌ Ni pnpm ni npm n'est installé !
        echo Installez Node.js depuis https://nodejs.org
        pause
        exit /b 1
    )
)

pause

