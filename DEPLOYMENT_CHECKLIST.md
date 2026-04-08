# Deployment Checklist - AI Team Dashboard

**Version:** MVP v1.0  
**Target:** Netlify  
**Date:** April 8, 2026

---

## 🎯 Pre-Deployment Checklist

### Code & Build
- [x] Build completes successfully (`npm run build`)
- [x] `/out` directory contains all static files
- [x] `agents.json` data file is in `/out/data/`
- [ ] **CRITICAL:** Update page title (currently "Create Next App")
- [ ] **CRITICAL:** Update meta description
- [x] All dependencies installed
- [x] No build errors or warnings (critical ones)
- [x] `.gitignore` configured properly

### Content Review
- [x] All 8 agent descriptions are accurate
- [x] Agent metrics are reasonable/realistic
- [x] Current tasks reflect actual work
- [x] Status indicators match reality
- [ ] **OPTIONAL:** Add custom favicon for ZBJ/Zenix branding

### Documentation
- [x] README.md is complete
- [x] DEPLOY.md has clear instructions
- [x] QA_TEST_REPORT.md documents testing
- [x] This checklist exists!

---

## 🚀 Deployment Methods

### Method 1: Netlify CLI (Recommended for First Deploy)

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login
```bash
netlify login
```
- Opens browser for authentication
- Confirm you're logged into correct Netlify account

#### Step 3: Build
```bash
cd /root/.clawdbot/workspace/ai-team-dashboard
npm run build
```

#### Step 4: Deploy (Staging First)
```bash
netlify deploy --dir=out
```
- Choose: "Create & configure a new site"
- Team: Select your Netlify team
- Site name: `ai-team-dashboard` (or custom)
- Review the draft URL

#### Step 5: Test Staging
- [ ] Visit the draft URL provided
- [ ] Check all agent cards load
- [ ] Verify workflow diagram displays
- [ ] Test tab switching
- [ ] Check mobile view (Chrome DevTools)
- [ ] Verify auto-refresh (wait 30+ seconds)

#### Step 6: Deploy to Production
```bash
netlify deploy --prod --dir=out
```
- [ ] Note the production URL
- [ ] Share with Zenix for approval

---

### Method 2: Git-Based Deployment (For Ongoing Updates)

#### Step 1: Create GitHub Repo
```bash
cd /root/.clawdbot/workspace/ai-team-dashboard

# If not already initialized
git init
git add .
git commit -m "Initial commit: AI Team Dashboard MVP"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ai-team-dashboard.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Netlify
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select `ai-team-dashboard` repo
5. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
   - **Branch:** `main`
6. Click "Deploy site"

#### Step 3: Configure Auto-Deploy
- [ ] Verify GitHub webhook is active (Netlify settings → Build hooks)
- [ ] Test: Make a small commit and push → should auto-deploy

---

### Method 3: Drag & Drop (Quickest for Testing)

#### Step 1: Build
```bash
cd /root/.clawdbot/workspace/ai-team-dashboard
npm run build
```

#### Step 2: Deploy
1. Go to https://app.netlify.com/drop
2. Drag the entire `/out` folder onto the page
3. Wait for upload to complete
4. Get the random URL (e.g., `https://random-name-12345.netlify.app`)

#### Step 3: Claim Site (Optional)
- [ ] Click "Claim this site" in Netlify dashboard
- [ ] Rename to `ai-team-dashboard` or custom domain

---

## ✅ Post-Deployment Verification

### Immediate Checks (5 minutes)
- [ ] **Homepage Loads:** Visit the deployed URL
- [ ] **No Console Errors:** Open browser DevTools → Console
- [ ] **All Agent Cards Visible:** Count 8 cards on screen
- [ ] **Workflow Diagram Renders:** SVG diagram displays in center
- [ ] **Tabs Present:** AGENTS, PROJECTS, TIMELINE tabs visible
- [ ] **Responsive Design:** Test mobile view (Chrome DevTools or phone)
- [ ] **Data Accuracy:** Verify agent names, statuses, tasks match `agents.json`

### Functional Testing (10 minutes)
- [ ] **Auto-Refresh Works:** Wait 30+ seconds, check if "Loading..." appears
- [ ] **Tab Switching:** Click PROJECTS/TIMELINE (should show "Coming soon")
- [ ] **Hover Effects:** Hover over agent cards and diagram nodes
- [ ] **Progress Bars Animate:** Check smooth transitions
- [ ] **Status Colors Correct:**
  - Lelouch: Active (green) ✅
  - Content Specialist: Working (blue) ✅
  - Designer: Idle (gray) ✅
  - Research Assistant: Working (blue) ✅
  - Social Media Manager: Active (green) ✅
  - Personal Assistant: Active (green) ✅

### Cross-Browser Testing (15 minutes)
- [ ] **Chrome/Edge:** Desktop + mobile view
- [ ] **Firefox:** Desktop
- [ ] **Safari:** Desktop (if on Mac) + iOS (if available)
- [ ] **Mobile Devices:** Test on actual phone if possible

### Performance Check
- [ ] **Lighthouse Score:** Run audit in Chrome DevTools
  - Target: >90 Performance, >95 Accessibility
- [ ] **Load Time:** Should be <3 seconds on fast connection
- [ ] **No Layout Shift:** Content shouldn't jump during load

---

## 🐛 Troubleshooting

### Build Fails
**Error:** `npm run build` fails
- Check Node.js version: `node -v` (should be 18+)
- Delete `node_modules` and `.next`: `rm -rf node_modules .next`
- Reinstall: `npm install`
- Try again: `npm run build`

### Netlify Deploy Fails
**Error:** "Publish directory not found"
- Ensure you ran `npm run build` first
- Check `--dir=out` flag is correct
- Verify `/out` folder exists: `ls -la out/`

### Page Loads Blank
**Symptoms:** White screen or "Loading..." stuck
- **Check Console:** Look for JavaScript errors
- **Verify Data File:** Ensure `out/data/agents.json` exists
- **Check Build:** Rebuild with `npm run build`

### Workflow Diagram Missing
**Symptoms:** Agent cards show but no center diagram
- **SVG Rendering Issue:** Try different browser
- **Check Console:** Look for errors in WorkflowDiagram component
- **Viewport Issue:** Try desktop view (not mobile)

### Auto-Refresh Not Working
**Symptoms:** Data doesn't update after 30 seconds
- **Expected:** With static JSON, it will just re-fetch the same data
- **Future Fix:** Phase 2 will connect to live API

---

## 📊 Success Criteria

Deployment is considered **successful** when:
- ✅ URL is accessible publicly
- ✅ All 8 agent cards display correctly
- ✅ Workflow diagram renders
- ✅ Mobile view is responsive
- ✅ No critical console errors
- ✅ Zenix approves the look and feel

---

## 🔄 Update Workflow (Post-Launch)

### Updating Agent Data

#### Manual Update (Current)
1. Edit `/public/data/agents.json`
2. Update status, tasks, metrics, etc.
3. Rebuild: `npm run build`
4. Redeploy: `netlify deploy --prod --dir=out`

#### Git-Based Update (If using GitHub)
1. Edit `/public/data/agents.json`
2. Commit: `git add . && git commit -m "Update agent statuses"`
3. Push: `git push`
4. Netlify auto-deploys within 1-2 minutes

### Automated Update Script (Phase 2)
```bash
#!/bin/bash
# Future: update-dashboard.sh
# Fetch agent data from API → update agents.json → commit → push
# Run via cron: */30 * * * * /path/to/update-dashboard.sh
```

---

## 🎨 Phase 2 Features (Post-MVP)

After successful MVP deployment, plan for:
- [ ] **Live API Integration:** Real-time agent status from Clawdbot
- [ ] **PROJECTS Tab:** Track SoGrow dashboard, client work
- [ ] **TIMELINE Tab:** Historical log of completed tasks
- [ ] **Custom Domain:** `dashboard.zenixuniverse.com` or similar
- [ ] **Analytics:** Add Plausible or Google Analytics
- [ ] **Dark/Light Mode Toggle:** User preference
- [ ] **Filters:** Filter by agent, status, project
- [ ] **Export Reports:** Download PDF/CSV summaries

---

## 📝 Notes for Zenix

**Deployment Recommendation:**
1. Start with **Netlify CLI** for staging deploy
2. Test thoroughly on staging URL
3. Approve look/feel
4. Deploy to production
5. Switch to **Git-based deployment** for easy updates

**Custom Domain Setup (Optional):**
- If you have a domain, Netlify makes it easy:
  1. Go to Site settings → Domain management
  2. Add custom domain (e.g., `ai-dashboard.zbj.com`)
  3. Update DNS records as instructed
  4. SSL cert auto-provisions

**Cost:**
- Netlify free tier: 100GB bandwidth, 300 build minutes/month
- This dashboard: ~5MB total → plenty of headroom
- Upgrade only if you get massive traffic (unlikely for internal dashboard)

---

**Prepared by:** Personal Assistant Agent  
**Date:** April 8, 2026  
**Status:** ✅ Ready for deployment  
**Recommended Next Step:** Deploy to Netlify staging using Method 1 (CLI)
