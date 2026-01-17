@echo off
echo ========================================
echo Demarrage du serveur Backend IUC Chatbot
echo ========================================
echo.

cd /d "%~dp0"

echo Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

echo.
echo Demarrage du serveur sur http://localhost:8000
echo Appuyez sur CTRL+C pour arreter le serveur
echo.

python main.py

pause


