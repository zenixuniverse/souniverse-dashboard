# 👑 SoUniverse Dashboard

Live dashboard for ZBJ Agency's 15-agent AI empire.

## Features

- 🎯 Real-time agent status monitoring
- 🎨 Dark theme with 8-bit retro aesthetic  
- 📱 Fully mobile responsive
- ⚡ Auto-refresh every 30 seconds
- 👑 Command hierarchy visualization

## Deployment

### Netlify

1. Push this repo to GitHub/GitLab
2. Connect to Netlify
3. Build settings are in `netlify.toml`
4. Deploy!

Or use Netlify CLI:

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS v4
- Static Export

## Data Source

Team data is loaded from `/public/team-roster.json` which contains all 15 agents:

- 👑 Command (Lelouch)
- 💪 Powerhouse (Stack Surge, Pixel Sage, Spectrum, Apex)
- 🎯 Specialists (7 focused agents)
- ⚔️ Tactical (Nexus, Scout, Pulse, Bolt)

---

Built with ⚡ by Stack Surge for Emperor Lelouch 👑
