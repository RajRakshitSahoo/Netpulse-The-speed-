@echo off
echo.
echo  ========================================
echo    NetPulse Analyzer - Starting...
echo  ========================================
echo.
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo  ERROR: Node.js not installed!
  echo  Download from: https://nodejs.org
  pause
  exit /b
)
echo  Installing packages...
call npm install
echo.
echo  Starting server...
start "" http://localhost:3000
node server.js
pause
