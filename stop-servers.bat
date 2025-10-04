@echo off
echo ========================================
echo   Stopping Profile Seller Servers
echo ========================================
echo.

echo 🛑 Stopping all Node.js processes...
taskkill /f /im node.exe 2>nul

echo 🧹 Cleaning up ports...
echo.

echo All servers have been stopped!
echo Press any key to exit...
pause >nul
