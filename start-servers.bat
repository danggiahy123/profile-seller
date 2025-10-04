@echo off
echo ========================================
echo   Khởi động Profile Seller Application
echo ========================================
echo.

echo 🔧 Building CSS...
call npm run build:css
echo.

echo ⚡ Starting Backend Server...
start "Backend Server" /min cmd /k "cd /d %~dp0 && node backend/test-server.js"

echo ⏳ Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ✅ Both servers are starting!
echo 🌐 Frontend: http://localhost:5174/
echo 🔧 Backend: http://localhost:3000
echo 📚 Login: admin@profile-seller.com / admin123
echo.
echo Press any key to exit...
pause >nul
