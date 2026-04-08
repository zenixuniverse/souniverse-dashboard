# ⚡ Quick Start - 60 Second Deploy

## Deploy Now (Fastest Method)

```bash
cd /root/.clawdbot/workspace/ai-team-dashboard
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=out
```

**Done!** Your dashboard is live.

---

## What You Get

✅ 8 AI Agent Cards  
✅ Visual Workflow Diagram  
✅ Real-time Status Tracking  
✅ Dark Theme UI  
✅ Mobile Responsive

---

## URLs

**Live Dashboard:** (you'll get after deploy)  
**Drop Zone:** https://app.netlify.com/drop  
**Docs:** Check `README.md` and `DEPLOY.md`

---

## Update Agent Data

```bash
# Edit agents
nano public/data/agents.json

# Rebuild + redeploy
npm run build
netlify deploy --prod --dir=out
```

---

**Questions?** Read `READY_TO_DEPLOY.md` for full instructions.

**Built by:** Lelouch 👑 | **For:** Zenix Universe 🚀
