# Deploy to Netlify - Quick Start

## Step 1: Install Netlify CLI

\`\`\`bash
npm install -g netlify-cli
\`\`\`

## Step 2: Login to Netlify

\`\`\`bash
netlify login
\`\`\`

This will open a browser for authentication.

## Step 3: Deploy

From the project directory:

\`\`\`bash
# First time deployment
netlify deploy --prod --dir=out

# Follow prompts:
# 1. Create & configure a new site
# 2. Choose team: Your Netlify team
# 3. Site name: ai-team-dashboard (or custom)
# 4. Publish directory: out
\`\`\`

## Alternative: Drag & Drop

1. Go to https://app.netlify.com/drop
2. Drag the `/out` folder onto the page
3. Done!

## Alternative: Git-based Deployment

1. Push code to GitHub:
\`\`\`bash
git init
git add .
git commit -m "Initial commit: AI Team Dashboard"
git remote add origin <your-github-repo-url>
git push -u origin main
\`\`\`

2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
6. Click "Deploy"

## After Deployment

You'll get a URL like: `https://ai-team-dashboard.netlify.app`

Share this with Zenix! 🚀

## Updating the Dashboard

To update agent data:

1. Edit `/public/data/agents.json`
2. Rebuild: `npm run build`
3. Redeploy: `netlify deploy --prod --dir=out`

Or if using Git:
1. Edit `/public/data/agents.json`
2. Commit and push
3. Netlify auto-deploys!

---

Need help? Check README.md for full documentation.
