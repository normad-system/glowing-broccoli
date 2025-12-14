#!/bin/bash

# Blog System Quick Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🚀 Starting Blog System Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Warning: Docker is not installed. Please install Docker to run MySQL.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Warning: Docker Compose is not installed.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Warning: Node.js is not installed. Please install Node.js v18 or higher.${NC}"
    exit 1
fi

echo -e "${BLUE}1. Starting MySQL Database...${NC}"
docker-compose up -d
echo -e "${GREEN}✓ MySQL started${NC}"
echo ""

# Wait for MySQL to be ready
echo -e "${BLUE}Waiting for MySQL to be ready...${NC}"
sleep 5

echo -e "${BLUE}2. Setting up Backend...${NC}"
cd server

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

echo "Creating database migration..."
npx prisma migrate dev --name init_blog_system

echo "Generating Prisma client..."
npx prisma generate

echo "Seeding database..."
npm run prisma:seed

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

cd ..

echo -e "${BLUE}3. Setting up Frontend...${NC}"
cd client-fitsystem

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

cd ..

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}To start the application:${NC}"
echo ""
echo -e "  ${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd server && npm run start:dev"
echo ""
echo -e "  ${YELLOW}Terminal 2 - Frontend:${NC}"
echo "  cd client-fitsystem && npm start"
echo ""
echo -e "${BLUE}Access points:${NC}"
echo "  Frontend: http://localhost:4200"
echo "  Backend API: http://localhost:3000/api"
echo "  Prisma Studio: cd server && npx prisma studio"
echo ""
echo -e "${BLUE}Default Admin:${NC}"
echo "  Email: admin@normad-system.com"
echo "  Password: admin123"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to change the admin password!${NC}"
echo ""
