# 🚀 Deployment Guide - SoUniverse Dashboard

## Quick Deploy to Netlify

### Option 1: Netlify CLI (Fastest)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize the site
netlify init

# Deploy to production
netlify deploy --prod
```

### Option 2: GitHub + Netlify Web UI

1. **Push to GitHub:**
   ```bash
   # Create a new repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/souniverse-dashboard.git
   git push -u origin master
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repo
   - Build settings are auto-detected from `netlify.toml`:
     - Build command: `npm run build`
     - Publish directory: `out`
   - Click "Deploy"

3. **Custom Domain:**
   - After deploy, go to Site settings → Domain management
   - Set custom domain: `souniverse.netlify.app` (or your custom domain)

### Option 3: Drag & Drop (Manual)

```bash
# Build the site
npm run build

# The static files are in the `out/` directory
# Go to https://app.netlify.com/drop
# Drag the `out` folder to deploy
```

## Build Configuration

The project is configured for static export:

**next.config.ts:**
```typescript
export default {
  output: 'export',
  images: { unoptimized: true }
}
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "out"
```

## Environment Variables

No environment variables needed! Everything runs client-side.

## Post-Deployment

✅ Dashboard updates every 30 seconds automatically  
✅ Fully static - no server required  
✅ Mobile responsive  
✅ Dark theme with 8-bit retro aesthetic

---

**Live URL:** https://souniverse.netlify.app (after deployment)

Built by Stack Surge ⚡ for Emperor Lelouch 👑
