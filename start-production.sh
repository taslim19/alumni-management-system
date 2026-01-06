#!/bin/bash

# Production Start Script for Alumni Management System

echo "🚀 Starting Alumni Management System in Production Mode..."

# Start Backend with PM2
echo "📦 Starting Backend..."
cd backend
pm2 start server.js --name alumni-backend --env production
cd ..

# Build Frontend
echo "📦 Building Frontend..."
cd frontend
npm run build
cd ..

# Serve Frontend (you can use PM2 with serve or nginx)
echo "📦 Starting Frontend Server..."
cd frontend
pm2 serve dist 3000 --name alumni-frontend --spa
cd ..

echo "✅ Application started!"
echo ""
echo "📊 Check status: pm2 status"
echo "📋 View logs: pm2 logs"
echo "🛑 Stop: pm2 stop all"
echo "🔄 Restart: pm2 restart all"

