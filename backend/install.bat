@echo off
echo ========================================
echo Installation des dependances Python
echo ========================================
echo.

cd /d "%~dp0"

echo Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

echo.
echo Installation des packages depuis requirements.txt...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

echo.
echo ========================================
echo Installation terminee !
echo ========================================
echo.
echo Vous pouvez maintenant demarrer le serveur avec:
echo   python main.py
echo.
pause


