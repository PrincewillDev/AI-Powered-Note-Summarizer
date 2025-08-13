#!/bin/bash

# Railway Deployment Script for AI Note Summarizer Backend
# This script helps deploy the backend to Railway platform

echo "🚀 AI Note Summarizer Backend - Railway Deployment"
echo "=================================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found."
    echo "📥 Install it with: npm install -g @railway/cli"
    echo "🔗 Or visit: https://docs.railway.app/develop/cli"
    exit 1
fi

# Check if we're in the backend directory
if [ ! -f "requirements.txt" ] || [ ! -f "app/main.py" ]; then
    echo "❌ Please run this script from the backend directory"
    echo "📂 Current directory should contain requirements.txt and app/main.py"
    exit 1
fi

echo "✅ Railway CLI found"
echo "✅ Backend files detected"
echo ""

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

if [ $? -ne 0 ]; then
    echo "❌ Failed to login to Railway"
    exit 1
fi

echo "✅ Successfully logged into Railway"
echo ""

# Initialize or link project
echo "🔗 Setting up Railway project..."
if [ ! -f ".railway" ]; then
    echo "📝 No existing Railway project found. Creating new project..."
    railway init
else
    echo "✅ Existing Railway project found"
fi

echo ""

# Add PostgreSQL database
echo "🐘 Setting up PostgreSQL database..."
echo "⚠️  If you haven't added PostgreSQL yet, please:"
echo "   1. Go to your Railway dashboard"
echo "   2. Click 'New' → 'Database' → 'Add PostgreSQL'"
echo "   3. Railway will automatically set DATABASE_URL environment variable"
echo ""
read -p "Press Enter when PostgreSQL is set up..."

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "✅ Backend successfully deployed to Railway!"
echo ""

# Get the deployment URL
RAILWAY_URL=$(railway status --json | jq -r '.deployments[0].url' 2>/dev/null)

if [ "$RAILWAY_URL" != "null" ] && [ "$RAILWAY_URL" != "" ]; then
    echo "🌐 Your backend is available at: $RAILWAY_URL"
else
    echo "🌐 Check your Railway dashboard for the deployment URL"
fi

echo ""
echo "📋 Post-deployment checklist:"
echo "  ✓ PostgreSQL database added"
echo "  ⚠️  Set GROQ_API_KEY in Railway environment variables"
echo "  ⚠️  Set FRONTEND_URL after deploying frontend"
echo "  ⚠️  Update ALLOWED_ORIGINS for production domains"
echo ""
echo "🧪 Test your deployment:"
echo "  curl $RAILWAY_URL/health"
echo ""
echo "🎉 Deployment complete! Ready for frontend deployment."
