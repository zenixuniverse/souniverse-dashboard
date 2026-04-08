#!/bin/bash

echo "🚀 Building AI Team Dashboard..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo ""
  echo "Ready to deploy to Netlify!"
  echo ""
  echo "Option 1: Netlify CLI"
  echo "  netlify deploy --prod --dir=out"
  echo ""
  echo "Option 2: Drag & Drop"
  echo "  1. Go to https://app.netlify.com/drop"
  echo "  2. Drag the 'out' folder"
  echo ""
  echo "The dashboard will be live at: https://[your-site].netlify.app"
else
  echo "❌ Build failed. Check errors above."
  exit 1
fi
