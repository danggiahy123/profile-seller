@echo off
chcp 65001 >nul

echo.
echo ========================================
echo    Profile Seller - Development
echo ========================================
echo.
echo [1] Kiem tra dependencies...
call npm install >nul 2>&1

echo [2] Build CSS...
call npx tailwindcss -i ./scripts/style.css -o ./scripts/style-bundled.css --config ./config/tailwind.config.js -m >nul 2>&1

echo [3] Khoi dong servers...
echo.
echo URLs:
echo - Entry Point: http://localhost:5173/
echo - Login: http://localhost:5173/pages/login.html
echo - Products: http://localhost:5173/pages/products.html
echo - Admin: http://localhost:5173/pages/admin-dashboard.html
echo.
echo Demo Accounts:
echo - Admin: admin@profile-seller.com / admin123
echo - User: user@profile-seller.com / user123
echo.
echo ========================================

start "Profile Seller Backend" cmd /min /c "cd /d %~dp0 && echo Backend Server && node backend/test-server.js && pause"
timeout /t 2 >nul
start "Profile Seller Frontend" cmd /min /c "cd /d %~dp0 && echo Frontend Server && npm run dev && pause"

start http://localhost:5173/

echo Servers started. Press any key to exit...
pause >nul
