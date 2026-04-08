# SoUniverse Dashboard - Live Data Architecture

## Overview
Transform the static dashboard into a **fully functional, real-time agent monitoring system** that pulls data directly from Clawdbot session logs.

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Clawdbot Sessions                         │
│  /root/.clawdbot/agents/main/sessions/*.jsonl              │
│  + sessions.json (session metadata)                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Data Aggregator (lib/sessionParser.ts)         │
│  • Parse .jsonl files (tool calls, messages, completions)  │
│  • Extract agent activity, status, progress                │
│  • Calculate metrics (tasks completed, productivity)       │
│  • Track project assignments                               │
│  • Build timeline entries                                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 Next.js API Routes                          │
│  • /api/agents     → Current agent status & metrics        │
│  • /api/projects   → Project tracking with agent breakdown │
│  • /api/timeline   → Chronological activity feed           │
│  • /api/stats      → Overall system statistics             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│  • AGENTS tab:    Auto-updating progress bars              │
│  • PROJECTS tab:  Kanban/list view with agent assignments  │
│  • TIMELINE tab:  Slack-style activity feed                │
│  • Auto-refresh:  Poll every 30s for updates               │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

### Agent
```typescript
interface Agent {
  id: string;                    // Session key
  name: string;                  // Derived from session type
  role: string;                  // e.g., "Main Agent", "Subagent"
  status: 'active' | 'idle' | 'working' | 'blocked';
  currentTask: string;           // Last tool call or message
  projectId?: string;            // Linked project
  progress: {
    label: string;               // "Task Progress", "Code Quality"
    value: number;               // 0-100, calculated from activity
  }[];
  metrics: {
    tasksCompleted: number;      // Count of completed tool calls
    tasksInProgress: number;     // Active tasks
    productivity: number;        // Activity score
    tokenUsage: number;          // Total tokens used
  };
  lastUpdate: string;            // ISO timestamp
}
```

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  agents: {
    agentId: string;
    role: string;                // "Developer", "Designer", etc.
    workingOn: string;           // Current task within project
    progress: number;            // 0-100
  }[];
  overallProgress: number;       // Weighted average
  status: 'planning' | 'in-progress' | 'blocked' | 'complete';
  createdAt: string;
  updatedAt: string;
}
```

### TimelineEntry
```typescript
interface TimelineEntry {
  timestamp: string;
  agentId: string;
  agentName: string;
  type: 'task_start' | 'task_complete' | 'message' | 'tool_use' | 'thinking';
  message: string;
  metadata?: {
    toolName?: string;
    duration?: number;
    status?: string;
  };
}
```

## Session Log Parsing Strategy

### JSONL Format
Each `.jsonl` file contains lines like:
```json
{"type":"session","id":"...", "timestamp":"..."}
{"type":"message","role":"user","content":"..."}
{"type":"message","role":"toolCall","toolName":"exec","params":{...}}
{"type":"message","role":"toolResult","toolName":"exec","content":"..."}
{"type":"message","role":"assistant","content":"..."}
```

### Key Extraction Points
1. **Agent Status**: Latest message timestamp → active/idle
2. **Current Task**: Last tool call or assistant message
3. **Progress Calculation**:
   - Count completed tool calls vs. total messages
   - Parse specific tools (read, write, exec) for task types
4. **Project Assignment**: Parse message content for project names/keywords
5. **Timeline**: Convert each message to a timeline entry

## Deployment Considerations

### Netlify Serverless Functions
- API routes run as serverless functions
- Cold start: ~1-2s (acceptable for 30s polling)
- File system access: Available in functions
- Path: `/root/.clawdbot/agents/main/sessions/` (absolute)

### Caching Strategy
- Cache parsed session data for 10s to reduce file I/O
- Incremental parsing: Only read new lines since last parse
- Store last-read position per session file

### Security
- API routes are public but read-only
- No sensitive data exposure (session content filtered)
- Rate limiting: Built into Netlify (not needed for internal use)

## Implementation Phases

### ✅ Phase 1: Architecture & Data Integration
- [x] Design architecture (this document)
- [ ] Build session parser library
- [ ] Create API routes
- [ ] Test with live session data

### Phase 2: Projects Tab
- [ ] Design UI
- [ ] Implement project detection logic
- [ ] Build project tracking components

### Phase 3: Timeline Tab
- [ ] Design chat-style UI
- [ ] Implement timeline data fetching
- [ ] Add filtering and search

### Phase 4: Enhanced Agents Tab
- [ ] Connect to live API
- [ ] Animate progress bars
- [ ] Remove static data dependency

## File Structure
```
souniverse-dashboard/
├── lib/
│   ├── sessionParser.ts      # Core parsing logic
│   ├── types.ts              # TypeScript interfaces
│   └── cache.ts              # Simple in-memory cache
├── app/api/
│   ├── agents/route.ts       # GET /api/agents
│   ├── projects/route.ts     # GET /api/projects
│   ├── timeline/route.ts     # GET /api/timeline
│   └── stats/route.ts        # GET /api/stats
├── components/
│   ├── AgentCard.tsx         # (existing, update)
│   ├── ProjectCard.tsx       # (new)
│   ├── TimelineEntry.tsx     # (new)
│   └── ...
└── app/page.tsx              # (update to use APIs)
```

## Success Metrics
- ✅ Real-time data: Progress bars reflect actual work
- ✅ Accurate metrics: Task counts match session logs
- ✅ Low latency: API responses < 500ms
- ✅ Auto-update: Dashboard refreshes every 30s
- ✅ No manual updates: Data flows automatically

---

**Next Steps**: Build `lib/sessionParser.ts` and first API route (`/api/agents`)
