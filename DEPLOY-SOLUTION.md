# Deployment Solution for SOUniverse Dashboard

## 🚨 The Challenge

The dashboard needs to read from:
- `/root/.clawdbot/agents/main/sessions/` - Session data
- `/root/clawd/ai-team/team-roster.json` - Team roster

**Problem:** Netlify's serverless functions run in a sandboxed environment and can't access local filesystem paths.

## ✅ Solutions (Pick One)

### Solution 1: API Proxy Approach (RECOMMENDED)
Run a simple API server on this machine that Netlify can call:

**Setup:**
```bash
# Create a simple Express API server
cd /root/clawd/souniverse-dashboard
npm install express cors

# Create server.js
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const { getAgentData } = require('./lib/agentData');

const app = express();
app.use(cors());

app.get('/api/agents', async (req, res) => {
  try {
    const data = await getAgentData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
EOF

# Run it
node server.js
```

**Update Netlify function to proxy:**
```typescript
// netlify/functions/agents.ts
export const handler = async () => {
  const response = await fetch('http://YOUR_SERVER_IP:3002/api/agents');
  const data = await response.json();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
};
```

### Solution 2: Static Export + Client-Side Polling
Deploy as static site, fetch data from API server directly:

```bash
# Update next.config.ts
output: 'export'

# Update app/page.tsx to call API server directly
const response = await fetch('http://YOUR_SERVER_IP:3002/api/agents');
```

**Pros:** Simple, no Netlify functions needed  
**Cons:** API server must be public or you need CORS

### Solution 3: Sync Data to S3/Cloud Storage
Copy session data to cloud storage periodically:

```bash
# Cron job to sync data every minute
* * * * * rsync -a /root/.clawdbot/agents/main/sessions/ s3://your-bucket/sessions/

# Update lib/agentData.ts to read from S3 instead
```

### Solution 4: Self-Host Everything (EASIEST)
Forget Netlify, run Next.js directly on this server:

```bash
cd /root/clawd/souniverse-dashboard
npm run build
npm start # Runs on port 3000

# Set up nginx reverse proxy
# Point dashboard.souniverse.ai → localhost:3000
```

**Pros:** 
- Direct filesystem access
- No proxy needed
- Full control

**Cons:**
- Need to manage server uptime
- No CDN benefits

## 🎯 Recommended Setup

**For Emperor Zenix:**

1. **Self-host the dashboard** on this machine (Solution 4)
2. **Set up systemd service** to keep it running
3. **Use nginx** to proxy & add SSL

```bash
# Create systemd service
sudo cat > /etc/systemd/system/souniverse-dashboard.service << 'EOF'
[Unit]
Description=SOUniverse Dashboard
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/clawd/souniverse-dashboard
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl enable souniverse-dashboard
sudo systemctl start souniverse-dashboard

# Check status
sudo systemctl status souniverse-dashboard
```

## 📊 Current Deployment Status

**Right Now:**
- ✅ Development server running: `http://localhost:3001`
- ✅ API working: `http://localhost:3001/api/agents`
- ✅ Real-time data flowing
- ⏳ Production deployment: Awaiting decision on method

**Next Steps:**
1. Choose deployment method (recommend Solution 4)
2. Set up production server
3. Configure domain/SSL
4. Monitor and enjoy! 👑

## 🚀 Quick Deploy (Self-Host)

```bash
cd /root/clawd/souniverse-dashboard

# Build production version
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "souniverse-dashboard" -- start
pm2 save
pm2 startup
```

Dashboard will be live at `http://localhost:3000` (or configured port).

**Access externally:** Set up nginx reverse proxy or use ngrok/tunneling for testing.
