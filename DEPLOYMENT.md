# 🚀 SoUniverse Dashboard - Deployment Guide

**Built from Scratch by Stack Surge ⚡**

---

## 📊 What's Inside

**Fresh Next.js 16 Dashboard** with:
- ✅ All 16 AI agents from team roster
- ✅ Real-time session data integration
- ✅ 8-bit/retro aesthetic
- ✅ Mobile responsive
- ✅ Auto-refresh (30s)
- ✅ Live token tracking

---

## 🏗️ Build Status

```
✓ Compiled successfully in 3.2s
✓ TypeScript passed
✓ API endpoints working
✓ Local testing passed
```

**Test Results:**
- `/api/agents` → 16 agents ✅
- `/api/stats` → Real metrics ✅
- Lelouch showing 96,968 tokens ✅

---

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)

1. **Create new Netlify site**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"

2. **Connect to GitHub**
   - First, push this repo to GitHub:
     ```bash
     cd /root/clawd/souniverse-dashboard
     git remote add origin https://github.com/zenixuniverse/souniverse-dashboard.git
     git push -u origin master
     ```
   
3. **Configure Netlify**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `.netlify/functions`

4. **Deploy**
   - Netlify will auto-detect Next.js
   - First deploy takes ~2-3 minutes
   - Live at: `https://your-site.netlify.app/`

### Option 2: Vercel (Alternative)

```bash
npm install -g vercel
vercel login
vercel
```

Vercel auto-detects Next.js and deploys in one click.

### Option 3: Manual Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## ⚠️ Important: File Access

The dashboard needs access to:
```
/root/clawd/ai-team/team-roster.json
/root/.clawdbot/agents/main/sessions/sessions.json
```

**If deploying to external server:**
- Copy these files to the deployment server
- Update paths in `lib/data.ts` if needed
- OR set up file sync/API proxy

**If deploying on same server as Clawdbot:**
- ✅ No changes needed - files are already accessible

---

## 🧪 Local Testing

```bash
cd /root/clawd/souniverse-dashboard
npm run dev
# Visit http://localhost:3000
```

Test API endpoints:
```bash
curl http://localhost:3000/api/agents
curl http://localhost:3000/api/stats
```

---

## 📋 Tech Stack

- **Framework:** Next.js 16.2.3
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Fonts:** Press Start 2P (Google Fonts)
- **Deployment:** Serverless (Netlify/Vercel)

---

## ✨ Features

### 8-Bit Retro Aesthetic
- Scanline effects
- Pixel-perfect borders
- Retro glow effects
- Custom scrollbars
- Press Start 2P font

### Real-Time Data
- Fetches from `/api/agents` and `/api/stats`
- Updates every 30 seconds
- Shows live status (active/working/idle)
- Tracks token usage

### Mobile Responsive
- Grid layouts adapt to screen size
- Touch-friendly interface
- Optimized for all devices

---

## 🎯 Post-Deployment Checklist

- [ ] Dashboard loads at production URL
- [ ] All 16 agents displayed
- [ ] Status indicators working
- [ ] Token counts showing
- [ ] Auto-refresh functioning
- [ ] Mobile responsive
- [ ] No console errors

---

## 🔧 Troubleshooting

### "Cannot find module" errors
```bash
npm install
npm run build
```

### API returns empty data
- Check file paths in `lib/data.ts`
- Verify session files exist
- Check file permissions

### Build fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📞 Support

If issues arise:
1. Check browser console for errors
2. Test API endpoints directly
3. Verify file system access
4. Check build logs

---

**Built fresh from scratch!** 🔥  
**Stack Surge ⚡ | Full-Stack Forge**

Ready to deploy to: https://souniverse.netlify.app/
