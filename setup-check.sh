#!/bin/bash

# Quick Start Script for QR Menu System (Base64 Version)
# This script helps verify your environment is ready

echo "🚀 QR Menu System - Setup Verification"
echo "========================================"
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js v18+"
    exit 1
fi

# Check npm
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

echo ""
echo "📋 Checking environment variables..."

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file found"
    
    # Check Firebase vars
    if grep -q "NEXT_PUBLIC_FIREBASE_API_KEY" .env; then
        echo "✅ Firebase API Key configured"
    else
        echo "⚠️  Firebase API Key missing"
    fi
    
    if grep -q "NEXT_PUBLIC_FIREBASE_PROJECT_ID" .env; then
        echo "✅ Firebase Project ID configured"
    else
        echo "⚠️  Firebase Project ID missing"
    fi
    
else
    echo "❌ .env file not found"
    echo "📖 Please copy ENV_TEMPLATE.md to .env and fill in your credentials"
    exit 1
fi

echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed"
    echo "Running npm install..."
    npm install
fi

echo ""
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Setup complete! You can now:"
    echo ""
    echo "   1. Run the dev server:"
    echo "      npm run dev"
    echo ""
    echo "   2. Open http://localhost:3000"
    echo ""
    echo "   3. Upload dishes at:"
    echo "      http://localhost:3000/admin/add-dish"
    echo ""
    echo "   4. View menu at:"
    echo "      http://localhost:3000/menu"
    echo ""
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    echo ""
    echo "Common fixes:"
    echo "  1. Ensure .env has all required variables"
    echo "  2. Run: npm install"
    exit 1
fi
