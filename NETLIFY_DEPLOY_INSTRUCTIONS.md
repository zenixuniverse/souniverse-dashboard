# Netlify Deployment Instructions for SoUniverse Dashboard

## ✅ Static Build Ready!

The pre-built static files are now on the `static-deploy` branch and ready to deploy.

**Branch:** `static-deploy`  
**Repo:** https://github.com/zenixuniverse/souniverse-dashboard.git  
**Target Site:** https://souniverse.netlify.app/

---

## 🚀 Option 1: Deploy via Netlify UI (Recommended)

### Steps:

1. **Log into Netlify** (https://app.netlify.com/)

2. **Go to your site settings** for souniverse.netlify.app

3. **Update Site Settings:**
   - Go to **Site settings** → **Build & deploy** → **Build settings**
   - Change the following:

   ```
   Branch to deploy: static-deploy
   Build command: (leave empty or set to echo "Using pre-built files")
   Publish directory: out
   ```

4. **Set Environment Variables** (if needed):
   - Go to **Site settings** → **Environment variables**
   - Add:
     ```
     NEXT_PUBLIC_API_URL = https://factful-noncaffeinic-kaiya.ngrok-free.dev
     NEXT_PUBLIC_API_KEY = 07f125ead1672bb900a77b73752a85bd3bcd3c070aaf3edce97f2283dbc78751
     ```
   - **Note:** These are already baked into the static files, so this is optional.

5. **Trigger Deploy:**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

6. **Verify:**
   - Once deployed, visit https://souniverse.netlify.app/
   - You should see the dashboard with 20 AI agents from the API

---

## 🔄 Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to existing site
cd /root/.clawdbot/workspace/souniverse-dashboard
netlify link

# Deploy the out/ directory directly
netlify deploy --prod --dir=out
```

---

## 📋 What Was Done

1. ✅ Created a new `static-deploy` branch
2. ✅ Modified `.gitignore` to allow the `out/` folder
3. ✅ Updated `netlify.toml` to publish from `out/` with no build command
4. ✅ Committed all pre-built static files (43 files including HTML, JS, CSS, fonts)
5. ✅ Pushed to GitHub: https://github.com/zenixuniverse/souniverse-dashboard/tree/static-deploy

---

## 🔍 Troubleshooting

### If Netlify still tries to build:
- Make sure you selected the `static-deploy` branch (not `main`)
- Ensure the build command is empty or harmless (`echo "Using pre-built files"`)
- Confirm publish directory is set to `out`

### If the site loads but shows no agents:
- Check browser console for API errors
- Verify the API is accessible: https://factful-noncaffeinic-kaiya.ngrok-free.dev/api/agents
- Ensure CORS is configured on the API server

### If you get a 404 on refresh:
- Add a `_redirects` file to the `out/` directory:
  ```
  /*    /index.html   200
  ```

---

## 🎯 Alternative: GitHub Pages

If Netlify continues to have issues, you can deploy to GitHub Pages instead:

```bash
cd /root/.clawdbot/workspace/souniverse-dashboard

# Create gh-pages branch
git checkout --orphan gh-pages
git rm -rf .
git checkout static-deploy -- out/
mv out/* .
rm -rf out

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

# Enable GitHub Pages in repo settings:
# Settings → Pages → Source: gh-pages branch, / (root)
```

**Site will be at:** https://zenixuniverse.github.io/souniverse-dashboard/

---

## ✨ Expected Result

Once deployed successfully, https://souniverse.netlify.app/ should show:

- ✅ SoUniverse AI Team Dashboard
- ✅ 20 active AI agents with live data from the API
- ✅ Real-time metrics, status indicators, and task information
- ✅ Network graph showing agent connections
- ✅ Timeline of recent activities

The dashboard is fully static and fetches data client-side from the ngrok API endpoint.
