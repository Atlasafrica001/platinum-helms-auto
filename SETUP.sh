#!/bin/bash

# Platinum Helms Full Stack - Automated Setup Script
# Run this script to set up both backend and frontend

echo "========================================="
echo "🚗 PLATINUM HELMS AUTOS"
echo "Full Stack Setup Script"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📦 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm: v$(npm --version)${NC}"

# Check PostgreSQL
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL installed${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL not detected. Make sure it's installed and running.${NC}"
fi

echo ""
echo "========================================="
echo "🔧 BACKEND SETUP"
echo "========================================="
echo ""

cd backend

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

# Check for .env
if [ ! -f .env ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Backend .env file not found${NC}"
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo -e "${BLUE}📝 Please edit backend/.env with your credentials:${NC}"
    echo "   - DATABASE_URL (PostgreSQL connection)"
    echo "   - JWT_SECRET (run: openssl rand -base64 32)"
    echo "   - CLOUDINARY credentials"
    echo ""
    read -p "Press Enter after editing .env to continue..."
fi

# Database setup
echo ""
echo "🗄️  Setting up database..."

echo "   Generating Prisma client..."
npm run db:generate > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ Prisma client generated${NC}"
else
    echo -e "${RED}   ❌ Failed to generate Prisma client${NC}"
    exit 1
fi

echo "   Running migrations..."
npm run db:migrate > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ Migrations complete${NC}"
else
    echo -e "${RED}   ❌ Migration failed. Check DATABASE_URL in .env${NC}"
    exit 1
fi

echo "   Seeding database..."
npm run db:seed > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ Database seeded with sample data${NC}"
else
    echo -e "${YELLOW}   ⚠️  Seeding failed (may already be seeded)${NC}"
fi

cd ..

echo ""
echo "========================================="
echo "🎨 FRONTEND SETUP"
echo "========================================="
echo ""

cd frontend

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

# Check for .env
if [ ! -f .env ]; then
    echo "📝 Creating frontend .env from template..."
    cp .env.example .env
    echo -e "${GREEN}✅ Frontend .env created${NC}"
fi

cd ..

echo ""
echo "========================================="
echo "✅ SETUP COMPLETE!"
echo "========================================="
echo ""
echo -e "${GREEN}🎉 Both backend and frontend are ready!${NC}"
echo ""
echo "📝 Default Admin Credentials:"
echo "   Email: admin@platinumhelms.com"
echo "   Password: Admin123!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   $ cd backend"
echo "   $ npm run dev"
echo "   ${BLUE}→ Backend will run at http://localhost:5000${NC}"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   $ cd frontend"
echo "   $ npm run dev"
echo "   ${BLUE}→ Frontend will run at http://localhost:3000${NC}"
echo ""
echo "📚 Documentation:"
echo "   - Root: README.md"
echo "   - Backend: backend/QUICKSTART.md"
echo "   - Frontend: frontend/README.md"
echo ""
echo "========================================="
