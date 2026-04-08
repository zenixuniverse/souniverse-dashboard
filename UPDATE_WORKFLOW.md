# Update Workflow - AI Team Dashboard

**Purpose:** How to keep the dashboard up-to-date with current agent status  
**Last Updated:** April 8, 2026

---

## 📊 Current System (MVP - Manual Updates)

### Data Source
- **File:** `/public/data/agents.json`
- **Format:** JSON array of 8 agent objects
- **Update Method:** Manual editing

### Data Structure (Per Agent)
```json
{
  "id": "agent-slug",
  "name": "Agent Name",
  "role": "Role Description",
  "icon": "🔥",
  "status": "active|idle|working|blocked",
  "currentTask": "What they're doing right now",
  "description": "Role overview",
  "metrics": {
    "productivity": 0-100,
    "quality": 0-100,
    "responseTime": 0-24 (hours),
    "tasksCompleted": number,
    "tasksInProgress": number,
    "tasksBlocked": number
  },
  "progressBars": [
    { "label": "Task Type", "value": 0-100, "color": "#hex" }
  ],
  "connections": ["other-agent-id"],
  "lastUpdate": "ISO 8601 timestamp"
}
```

---

## 🔄 Update Process (Current)

### When to Update
- **Daily:** Morning check-in (update status, current tasks)
- **After Major Milestones:** Task completion, new project starts
- **On Status Changes:** Agent goes from idle → working → blocked
- **Weekly:** Review and update metrics (productivity, quality, tasks completed)

### How to Update

#### Step 1: Edit agents.json
```bash
cd /root/.clawdbot/workspace/ai-team-dashboard
nano public/data/agents.json

# Or use your preferred editor
code public/data/agents.json
```

#### Step 2: Update Relevant Fields
```json
// Example: Update Content Specialist status
{
  "id": "content-specialist",
  "status": "working",  // Change from "idle"
  "currentTask": "Writing SoGrow landing page copy",  // Update task
  "metrics": {
    "tasksCompleted": 35,  // Increment from 34
    "tasksInProgress": 3   // Increment from 2
  },
  "lastUpdate": "2026-04-08T14:30:00Z"  // Current timestamp
}
```

#### Step 3: Rebuild
```bash
npm run build
```

#### Step 4: Deploy
```bash
# If using Netlify CLI
netlify deploy --prod --dir=out

# Or if using Git
git add public/data/agents.json
git commit -m "Update: Content Specialist working on SoGrow copy"
git push
# Netlify auto-deploys
```

### Quick Update Script
Save this as `update-agent.sh`:
```bash
#!/bin/bash
# Quick update and deploy script
# Usage: ./update-agent.sh "Update message"

if [ -z "$1" ]; then
  echo "Usage: ./update-agent.sh 'commit message'"
  exit 1
fi

echo "Building..."
npm run build

echo "Deploying..."
netlify deploy --prod --dir=out

echo "✅ Dashboard updated with: $1"
```

---

## 🤖 Automated Update (Phase 2 - Future)

### Vision
Dashboard automatically updates by fetching agent status from Clawdbot sessions or a status API.

### Architecture
```
Clawdbot Agent Sessions
    ↓
Status API Endpoint (to build)
    ↓
Fetch Script (cron job every 30 min)
    ↓
Update agents.json
    ↓
Git commit + push
    ↓
Netlify auto-deploy
```

### Implementation Plan

#### 1. Create Status API
```javascript
// api/agent-status.js (future)
// Returns real-time agent data from Clawdbot

export async function getAgentStatus() {
  // Query Clawdbot sessions
  // Return structured JSON matching agents.json schema
}
```

#### 2. Update Script
```bash
#!/bin/bash
# scripts/auto-update.sh

# Fetch latest agent data from API
curl https://api.zenixuniverse.com/agents > /tmp/agents.json

# Validate JSON
if jq empty /tmp/agents.json 2>/dev/null; then
  # Copy to public/data/
  cp /tmp/agents.json /root/.clawdbot/workspace/ai-team-dashboard/public/data/agents.json
  
  # Commit and push
  cd /root/.clawdbot/workspace/ai-team-dashboard
  git add public/data/agents.json
  git commit -m "Auto-update: $(date +%Y-%m-%d\ %H:%M)"
  git push
  
  echo "✅ Dashboard auto-updated"
else
  echo "❌ Invalid JSON from API"
fi
```

#### 3. Cron Job
```bash
# Add to crontab: crontab -e
*/30 * * * * /path/to/scripts/auto-update.sh >> /var/log/dashboard-update.log 2>&1

# Runs every 30 minutes
```

---

## 📝 Update Templates

### Daily Check-In Update
```json
// Morning: Update all agents with current status
// Update fields: status, currentTask, lastUpdate

{
  "id": "lelouch",
  "status": "active",
  "currentTask": "Planning Phase 2 features for dashboard",
  "lastUpdate": "2026-04-08T09:00:00Z"
}
```

### Task Completion Update
```json
// When agent completes a task
// Update fields: tasksCompleted, tasksInProgress, progressBars, lastUpdate

{
  "metrics": {
    "tasksCompleted": 48,      // +1
    "tasksInProgress": 2       // -1
  },
  "progressBars": [
    { "label": "Strategic Planning", "value": 95, "color": "#3b82f6" }  // +3%
  ],
  "lastUpdate": "2026-04-08T15:45:00Z"
}
```

### Status Change Update
```json
// When agent changes from idle → working or blocked
// Update fields: status, currentTask, tasksInProgress, lastUpdate

{
  "status": "blocked",  // was "working"
  "currentTask": "Waiting for client feedback on proposal",
  "metrics": {
    "tasksBlocked": 1   // +1
  },
  "lastUpdate": "2026-04-08T16:20:00Z"
}
```

### Weekly Metrics Update
```json
// Every Monday: Review and update productivity/quality scores
// Update fields: metrics (productivity, quality, responseTime)

{
  "metrics": {
    "productivity": 92,    // Adjusted based on week performance
    "quality": 96,         // Adjusted based on reviews
    "responseTime": 3,     // Average hours to respond
    "tasksCompleted": 52   // Total cumulative
  },
  "lastUpdate": "2026-04-14T09:00:00Z"
}
```

---

## 🎯 Data Maintenance Best Practices

### Keep It Current
- Update `currentTask` whenever an agent starts new work
- Update `lastUpdate` timestamp on every change
- Don't let data get stale (>24 hours without update looks inactive)

### Be Accurate
- `productivity`: % of time actively working (not idle)
- `quality`: % of work that passes review without revisions
- `responseTime`: Average hours to respond to requests
- `tasksCompleted`: Cumulative total (always increases)

### Maintain Consistency
- All timestamps: ISO 8601 format (`YYYY-MM-DDTHH:MM:SSZ`)
- All percentages: 0-100 (integers)
- Status values: Only `active`, `idle`, `working`, `blocked`
- Colors: Hex format with `#` prefix

### Don't Break the Schema
- Always validate JSON before deploying: `jq . agents.json`
- Keep all required fields (don't delete properties)
- Use consistent field names and types

---

## 🛠️ Versioning System (Optional)

### Version Tracking
Add a version number to `agents.json`:
```json
{
  "version": "1.2.3",
  "lastUpdate": "2026-04-08T09:00:00Z",
  "agents": [ /* ... */ ]
}
```

### Changelog
Keep `CHANGELOG.md` in `/public/data/`:
```markdown
# Dashboard Data Changelog

## [1.2.3] - 2026-04-08
- Updated Lelouch status to "active" (Phase 2 planning)
- Content Specialist completed Brian Blum proposal (+1 task)
- Designer status changed to "working" (UI polish assignment)

## [1.2.2] - 2026-04-07
- Weekly metrics update for all agents
- Research Assistant productivity increased to 91%
```

---

## 📦 Backup Strategy

### Manual Backups
```bash
# Before major updates, backup current data
cp public/data/agents.json public/data/agents.backup.$(date +%Y%m%d).json
```

### Git History
- If using Git, every commit is a backup
- Restore previous version: `git checkout <commit-hash> public/data/agents.json`

### Automated Backups (Future)
```bash
# Cron: Daily backup to cloud storage
0 0 * * * cp /path/to/agents.json /backup/agents-$(date +%Y%m%d).json
```

---

## 🚀 Quick Reference Commands

### Check Current Data
```bash
cat public/data/agents.json | jq '.[] | {id, status, currentTask}'
```

### Validate JSON
```bash
jq empty public/data/agents.json && echo "✅ Valid" || echo "❌ Invalid"
```

### Find Agent by ID
```bash
cat public/data/agents.json | jq '.[] | select(.id == "lelouch")'
```

### Update Single Field (using jq)
```bash
# Update Lelouch's current task
jq '(.[] | select(.id == "lelouch") | .currentTask) = "New task description"' \
  agents.json > agents.tmp.json && mv agents.tmp.json agents.json
```

### Batch Status Update
```bash
# Set all agents to "idle" (use carefully!)
jq '.[] | .status = "idle"' agents.json > agents.tmp.json && mv agents.tmp.json agents.json
```

---

## 🎓 Training for Team Members

### For Non-Technical Users
1. Use a JSON editor with validation (e.g., VS Code with JSON extension)
2. Make small changes one at a time
3. Always validate before deploying
4. Keep a backup before major changes

### For Developers
1. Automate what you can (scripts, cron jobs)
2. Document your update process
3. Consider building a simple admin UI for non-devs
4. Set up CI/CD for automatic deploys

---

## 📊 Update Log Template

Keep a log in `UPDATE_LOG.md`:
```markdown
# Dashboard Update Log

## 2026-04-08 14:30 UTC
**Updated by:** Personal Assistant  
**Changes:**
- Designer: idle → working (UI polish task)
- Content Specialist: Task completed (+1)
- Lelouch: Updated current task to "Phase 2 planning"

**Deploy:** ✅ Success  
**URL:** https://ai-team-dashboard.netlify.app
```

---

**Maintained by:** Personal Assistant Agent  
**Questions?** Check README.md or ask Lelouch 👑
