#!/bin/bash

echo "🧹 Cleaning up backend dependencies..."

# Remove node_modules and package-lock.json
rm -rf node_modules
rm -f package-lock.json

# Clear npm cache
npm cache clean --force

# Install dependencies fresh
echo "📦 Installing dependencies..."
npm install

echo "✅ Clean installation completed!"
echo "🔍 Current dependencies:"
npm list --depth=0 