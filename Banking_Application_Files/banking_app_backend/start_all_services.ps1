# Start All Banking Services
Write-Host "🚀 Starting Banking Application Backend Services..." -ForegroundColor Green

# Function to start a service
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$Directory,
        [string]$Port
    )
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Directory'; .\venv\Scripts\Activate.ps1; python app.py" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Start Account Service (Port 5001)
Start-Service -ServiceName "Account Service" -Directory "account_service" -Port "5001"

# Start Transaction Service (Port 5002)  
Start-Service -ServiceName "Transaction Service" -Directory "transaction_service" -Port "5002"

# Start API Gateway (Port 5000)
Start-Service -ServiceName "API Gateway" -Directory "api_gateway" -Port "5000"

Write-Host "✅ All services started! Waiting for them to initialize..." -ForegroundColor Green
Start-Sleep -Seconds 5

# Test the system
Write-Host "🧪 Testing the complete system..." -ForegroundColor Cyan

# Test API Gateway health
try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:5000/" -Method Get
    Write-Host "✅ API Gateway is running: $($health.msg)" -ForegroundColor Green
} catch {
    Write-Host "❌ API Gateway not responding: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Account Service
try {
    $accountHealth = Invoke-RestMethod -Uri "http://127.0.0.1:5001/accounts" -Method Get
    Write-Host "✅ Account Service is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Account Service not responding: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Transaction Service
try {
    $txnHealth = Invoke-RestMethod -Uri "http://127.0.0.1:5002/transactions" -Method Get
    Write-Host "✅ Transaction Service is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Transaction Service not responding: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎯 System test complete! Frontend should be accessible at http://localhost:4200" -ForegroundColor Green
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

