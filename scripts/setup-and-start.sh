#!/bin/bash

# Profile Seller - Setup and Start Script

echo "========================================"
echo "   Profile Seller - Development Setup"
echo "========================================"

# Build CSS
echo "[1] Building CSS..."
npx tailwindcss -i ./scripts/style.css -o ./scripts/style-bundled.css --config ./config/tailwind.config.js -m

echo "[2] Starting servers..."

# Start both servers in parallel
echo "🚀 Backend: http://localhost:3000"
echo "🎨 Frontend: http://localhost:5173"

concurrently \
  "echo 'Starting Backend Server...' && node backend/test-server.js" \
  "echo 'Starting Frontend Server...' && npm run dev"
