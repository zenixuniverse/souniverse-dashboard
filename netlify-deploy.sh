#!/bin/bash

# SoUniverse Dashboard - Netlify Deployment Script
# Run this after logging in with: netlify login

echo "🚀 Building SoUniverse Dashboard..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📦 Static files ready in: ./out"
echo ""
echo "To deploy to Netlify:"
echo ""
echo "1. Login (if not already):"
echo "   netlify login"
echo ""
echo "2. Deploy to production:"
echo "   netlify deploy --prod --dir=out"
echo ""
echo "Or use the web interface:"
echo "   https://app.netlify.com/drop"
echo "   (drag and drop the 'out' folder)"
echo ""
echo "Emperor awaits! 👑⚡"
