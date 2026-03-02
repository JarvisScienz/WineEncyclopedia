@echo off
REM ==============================
REM  Build & Deploy Frontend Script
REM  Project: Wine Encyclopedia
REM ==============================

echo 🔧 Avvio build e deploy del frontend Wine Encyclopedia...

REM Vai nella cartella del progetto frontend
cd wine-encyclopedia-frontend

echo 🚀 Costruzione del progetto Angular in modalità production...
ng build --configuration production
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Errore durante la build. Interruzione del processo.
    exit /b %ERRORLEVEL%
)

REM Torna alla cartella principale
cd ..

echo 📦 Deploy su Firebase Hosting...
firebase deploy --only hosting --project wineencyclopedia-245f5
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Errore durante il deploy su Firebase.
    exit /b %ERRORLEVEL%
)

echo ✅ Build e deploy completati con successo!
pause
