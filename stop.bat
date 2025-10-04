@echo off
title Portfolio Hub - Stop Servers

echo.
echo ==========================================
echo    Portfolio Hub - Stopping Servers     
echo ==========================================
echo.

echo 🛑 Stopping servers...

REM Kill Node.js processes
taskkill /f /im node.exe > nul 2>&1
taskkill /f /im npm.exe > nul 2>&1

REM Kill CMD windows with specific titles
taskkill /f /fi "WINDOWTITLE eq Backend Server*" > nul 2>&1
taskkill /f /fi "WINDOWTITLE eq Frontend Server*" > nul 2>&1

echo ✅ All servers stopped!
echo.
echo Press any key to close this window...
pause > nul
