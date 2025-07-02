@echo off
echo 🚀 Desktop Sharing Backend Starter
echo ========================================

if not exist "backend\app.py" (
    echo ❌ Error: Please run this script from the project root directory
    echo    (where backend\app.py is located)
    pause
    exit /b 1
)

echo Choose server mode:
echo 1. HTTPS (Secure - recommended)
echo 2. HTTP (Testing - for SSL certificate issues)

set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo 🔒 Starting secure HTTPS server...
    echo    If you see SSL certificate warnings, accept them in your browser
    echo    Server will be available at: https://127.0.0.1:5000
    cd backend
    python app.py
) else if "%choice%"=="2" (
    echo.
    echo 🚀 Starting HTTP server for testing...
    echo    Server will be available at: http://127.0.0.1:5000
    cd backend
    python app.py --http
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
    exit /b 1
) 