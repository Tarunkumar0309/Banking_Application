@echo off
echo 🚀 Starting Banking Application - Complete System
echo.

echo 📱 Starting Frontend (Angular)...
start "Frontend" cmd /k "cd Banking_Application_Files\banking-application\webapp && npm start"

echo.
echo 🔧 Starting Backend Services...
echo.

echo 🏦 Starting Account Service (Port 5001)...
start "Account Service" cmd /k "cd Banking_Application_Files\banking_app_backend\account_service && .\venv\Scripts\activate && python app.py"

echo 💳 Starting Transaction Service (Port 5002)...
start "Transaction Service" cmd /k "cd Banking_Application_Files\banking_app_backend\transaction_service && .\venv\Scripts\activate && python app.py"

echo 🌐 Starting API Gateway (Port 5000)...
start "API Gateway" cmd /k "cd Banking_Application_Files\banking_app_backend\api_gateway && .\venv\Scripts\activate && python app.py"

echo.
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo 🧪 Testing system...
echo.

echo Testing API Gateway...
curl -s http://127.0.0.1:5000/ > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API Gateway is running on http://127.0.0.1:5000
) else (
    echo ❌ API Gateway not responding
)

echo Testing Account Service...
curl -s http://127.0.0.1:5001/accounts > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Account Service is running on http://127.0.0.1:5001
) else (
    echo ❌ Account Service not responding
)

echo Testing Transaction Service...
curl -s http://127.0.0.1:5002/transactions > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Transaction Service is running on http://127.0.0.1:5002
) else (
    echo ❌ Transaction Service not responding
)

echo.
echo 🎯 System Status:
echo Frontend: http://localhost:4200
echo API Gateway: http://127.0.0.1:5000
echo Account Service: http://127.0.0.1:5001
echo Transaction Service: http://127.0.0.1:5002
echo.
echo 🚀 Your Banking Application is ready!
echo Press any key to exit...
pause > nul
