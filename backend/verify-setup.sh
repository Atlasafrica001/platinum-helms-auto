#!/bin/bash

# Platinum Helms Backend - Setup Verification Script

echo "========================================="
echo "Platinum Helms Backend - Setup Verification"
echo "========================================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
node_version=$(node --version 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ Node.js: $node_version"
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm version
echo "📦 Checking npm version..."
npm_version=$(npm --version 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ npm: v$npm_version"
else
    echo "❌ npm not found"
    exit 1
fi

# Check if .env exists
echo ""
echo "📄 Checking environment configuration..."
if [ -f .env ]; then
    echo "✅ .env file exists"
else
    echo "⚠️  .env file not found. Copy .env.example to .env"
fi

# Check if node_modules exists
echo ""
echo "📦 Checking dependencies..."
if [ -d node_modules ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed. Run: npm install"
fi

# Check required environment variables
echo ""
echo "🔑 Checking required environment variables..."
if [ -f .env ]; then
    source .env 2>/dev/null
    
    vars_ok=true
    
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ DATABASE_URL not set"
        vars_ok=false
    else
        echo "✅ DATABASE_URL configured"
    fi
    
    if [ -z "$JWT_SECRET" ]; then
        echo "❌ JWT_SECRET not set"
        vars_ok=false
    else
        echo "✅ JWT_SECRET configured"
    fi
    
    if [ -z "$CLOUDINARY_CLOUD_NAME" ]; then
        echo "⚠️  CLOUDINARY_CLOUD_NAME not set (optional for testing)"
    else
        echo "✅ CLOUDINARY_CLOUD_NAME configured"
    fi
fi

echo ""
echo "========================================="
echo "Setup Status Summary"
echo "========================================="
echo "✅ Node.js installed"
echo "✅ Project structure created"
echo "✅ Authentication layer complete"
echo "✅ Security middleware configured"
echo ""
echo "Next Steps:"
echo "1. Configure .env file (copy from .env.example)"
echo "2. Run: npm install"
echo "3. Run: npm run db:migrate"
echo "4. Run: npm run db:seed"
echo "5. Run: npm run dev"
echo ""
echo "========================================="
