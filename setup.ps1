# Blog System Quick Setup Script (PowerShell)
# This script automates the initial setup process

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Blog System Setup..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Warning: Docker is not installed. Please install Docker to run MySQL." -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is installed
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "Warning: Docker Compose is not installed." -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Warning: Node.js is not installed. Please install Node.js v18 or higher." -ForegroundColor Yellow
    exit 1
}

Write-Host "1. Starting MySQL Database..." -ForegroundColor Blue
docker-compose up -d
Write-Host "✓ MySQL started" -ForegroundColor Green
Write-Host ""

# Wait for MySQL to be ready
Write-Host "Waiting for MySQL to be ready..." -ForegroundColor Blue
Start-Sleep -Seconds 5

Write-Host "2. Setting up Backend..." -ForegroundColor Blue
Set-Location server

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..."
    npm install
}

Write-Host "Creating database migration..."
npx prisma migrate dev --name init_blog_system

Write-Host "Generating Prisma client..."
npx prisma generate

Write-Host "Seeding database..."
npm run prisma:seed

Write-Host "✓ Backend setup complete" -ForegroundColor Green
Write-Host ""

Set-Location ..

Write-Host "3. Setting up Frontend..." -ForegroundColor Blue
Set-Location client-fitsystem

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..."
    npm install
}

Write-Host "✓ Frontend setup complete" -ForegroundColor Green
Write-Host ""

Set-Location ..

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Blue
Write-Host ""
Write-Host "  Terminal 1 - Backend:" -ForegroundColor Yellow
Write-Host "  cd server; npm run start:dev"
Write-Host ""
Write-Host "  Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "  cd client-fitsystem; npm start"
Write-Host ""
Write-Host "Access points:" -ForegroundColor Blue
Write-Host "  Frontend: http://localhost:4200"
Write-Host "  Backend API: http://localhost:3000/api"
Write-Host "  Prisma Studio: cd server; npx prisma studio"
Write-Host ""
Write-Host "Default Admin:" -ForegroundColor Blue
Write-Host "  Email: admin@normad-system.com"
Write-Host "  Password: admin123"
Write-Host ""
Write-Host "⚠️  Don't forget to change the admin password!" -ForegroundColor Yellow
Write-Host ""
