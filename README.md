# 🌌 SoUniverse Dashboard

**Real-time monitoring for the ZBJ Agency AI Team**

Built from scratch with ⚡ by Stack Surge (Full-Stack Forge)

---

## 🎯 Overview

A clean, modern 8-bit/retro-styled dashboard displaying all 16 AI agents from the ZBJ Agency team with real-time status updates from Clawdbot sessions.

### ✨ Features

- **16 AI Agents** - All team members from the roster
- **Real-Time Status** - Live session data (active/working/idle)
- **Token Tracking** - Monitor usage across all agents
- **8-Bit Aesthetic** - Retro scanlines, pixel fonts, glow effects
- **Auto-Refresh** - Updates every 30 seconds
- **Mobile Responsive** - Works on all devices

---

## 🏗️ Tech Stack

- **Next.js 16.2.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Press Start 2P** - Pixel-perfect retro font
- **Serverless API** - Real-time data endpoints

---

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

### Deploy to Netlify

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full guide.

---

## 📊 Dashboard Sections

### Stats Bar
- Total Agents
- Active Count
- Idle Count  
- Total Tokens Used

### Agent Tiers

**👑 COMMAND (1 agent)**
- Lelouch - Strategic Captain

**⚡ POWERHOUSE (4 agents)**
- Stack Surge - Full-Stack Forge
- Pixel Sage - Visual Architect
- Spectrum - Creative Specialist
- Apex - Growth Architect

**🎨 SPECIALISTS (7 agents)**
- Content Specialist
- Designer
- Video Editor
- Client Manager
- Research Assistant
- Social Media Manager
- Personal Assistant

**🎯 TACTICAL (4 agents)**
- Nexus - Task Nexus
- Scout - Customer Research
- Pulse - Content Planning
- Bolt - Video Script Writer

---

## 🔌 API Endpoints

### GET /api/agents
Returns all 16 agents with status and metrics.

```json
{
  "success": true,
  "count": 16,
  "agents": [...]
}
```

### GET /api/stats
Returns dashboard-wide statistics.

```json
{
  "success": true,
  "stats": {
    "totalAgents": 16,
    "activeAgents": 0,
    "idleAgents": 16,
    "totalTokens": 96968,
    "totalSpawns": 0
  }
}
```

---

## 📁 Project Structure

```
souniverse-dashboard/
├── app/
│   ├── api/
│   │   ├── agents/route.ts    # Agents API
│   │   └── stats/route.ts     # Stats API
│   ├── globals.css            # Retro styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main dashboard
├── lib/
│   ├── data.ts                # Data fetching logic
│   └── types.ts               # TypeScript definitions
├── public/                    # Static assets
├── netlify.toml               # Deployment config
└── package.json
```

---

## 🎨 Design System

### Colors
- Primary: `#00ff00` (Matrix green)
- Secondary: `#00ffff` (Cyan)
- Accent: `#ff00ff` (Magenta)
- Background: `#000000` (Pure black)
- Card: `#0a0a0a` (Near black)

### Effects
- Scanlines
- Retro glow
- Pixel borders
- Pulse animations
- Custom scrollbars

---

## 🔧 Configuration

### Data Sources

The dashboard reads from:
- `/root/clawd/ai-team/team-roster.json` - Agent definitions
- `/root/.clawdbot/agents/main/sessions/sessions.json` - Live sessions

Update paths in `lib/data.ts` if deploying elsewhere.

### Auto-Refresh

Change refresh interval in `app/page.tsx`:
```typescript
setInterval(fetchData, 30000); // 30 seconds
```

---

## 🧪 Testing

### API Tests
```bash
curl http://localhost:3000/api/agents | jq
curl http://localhost:3000/api/stats | jq
```

### Build Test
```bash
npm run build
# Should complete without errors
```

---

## 🎯 Status Indicators

- 🟢 **Active** - Activity within last 5 minutes
- 🟡 **Working** - Activity within last 30 minutes  
- ⚫ **Idle** - No recent activity

---

## 📝 License

Built for ZBJ Agency by Stack Surge.

---

## 🤖 About Stack Surge

**Full-Stack Forge** ⚡

*"Frontend + Backend + DevOps + QA - I handle the entire stack"*

This dashboard was built fresh from scratch with:
- Clean architecture
- Modern best practices
- Retro aesthetics
- Real-time data flow

---

## 🚀 Ready to Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

**Live URL:** https://souniverse.netlify.app/

---

**Emperor Zenix's AI Team - Visualized** 👑

Made with 🔥 by Stack Surge
