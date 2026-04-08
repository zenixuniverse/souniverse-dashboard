# AI Team Dashboard

Real-time monitoring dashboard for Zenix's 8-member AI team.

## Features

- ✅ **Visual Workflow Diagram** - See how agents connect and collaborate
- ✅ **Agent Status Cards** - Real-time progress bars and metrics for each team member
- ✅ **Live Updates** - Auto-refreshes every 30 seconds
- ✅ **Dark Theme** - Modern aesthetic matching Zenix's vision
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Team Members

1. **Lelouch** 👑 - Strategic Captain
2. **Content Specialist** ✍️ - Copywriter
3. **Designer** 🎨 - Visual Creator
4. **Video Editor** 🎬 - Content Creator
5. **Client Manager** 🤝 - Communication Lead
6. **Research Assistant** 🔍 - Intel Gatherer
7. **Social Media Manager** 📱 - Growth Hacker
8. **Personal Assistant** 📋 - Workflow Optimizer

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Static Export** (for Netlify)

## Local Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Netlify

### Option 1: Netlify CLI

\`\`\`bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=out
\`\`\`

### Option 2: Git-based Deployment

1. Push this repo to GitHub
2. Connect to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `out`
5. Deploy!

### Option 3: Drag & Drop

1. Run `npm run build`
2. Drag the `/out` folder to Netlify's deploy interface

## Updating Agent Data

Edit `/public/data/agents.json` to update:
- Agent status (active, idle, working, blocked)
- Current tasks
- Progress bars
- Metrics (productivity, quality, tasks completed)

After editing, rebuild and redeploy:

\`\`\`bash
npm run build
netlify deploy --prod --dir=out
\`\`\`

## Auto-Update with GitHub Actions (Future)

You can set up GitHub Actions to automatically update agent data and trigger Netlify deploys:

1. Create `.github/workflows/update-agents.yml`
2. Set up script to fetch agent status from AI team
3. Commit updated `agents.json`
4. Netlify auto-deploys on push

## Tabs

- **AGENTS** - Main view with workflow diagram and agent cards
- **PROJECTS** - (Coming soon) Track active projects
- **TIMELINE** - (Coming soon) Historical events and completed tasks

## Color Scheme

- Background: Dark blue gradient (`#1a2332` → `#0d1520`)
- Cards: Semi-transparent dark blue (`#1e3a5f`)
- Accent: Bright cyan (`#00d4ff`)
- Status indicators:
  - Active: Green (`#10b981`)
  - Idle: Gray (`#6b7280`)
  - Working: Blue (`#3b82f6`)
  - Blocked: Red (`#ef4444`)

---

Built with ❤️ by Lelouch 👑 for Zenix Universe 🚀
