@echo off
title Profile Seller - Portfolio Hub

echo.
echo ==========================================
echo    Portfolio Hub - Development Server    
echo ==========================================
echo.
echo Starting development servers...
echo.

REM Start Backend server
echo 🔧 Starting Backend Server (Port 3000)...
start "Backend Server" cmd /k "cd /d %~dp0backend && node test-server.js"

REM Wait a moment for backend to start
timeout /t 2 /nobreak > nul

REM Start Frontend server  
echo 🌐 Starting Frontend Server (Port 5173)...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

REM Show URLs
timeout /t 3 /nobreak > nul
echo.
echo ✅ Servers are starting up...
echo.
echo 📡 Server URLs:
echo    🌐 Frontend: http://localhost:5173
echo    🔧 Backend:  http://localhost:3000
echo    📱 Health:   http://localhost:3000/api/health
echo.
echo 📝 Demo Accounts:
echo    👑 Admin: admin@profile-seller.com / admin123
echo    👤 User:  user@profile-seller.com / user123
echo.
echo Press any key to close this window...
pause > nul
