import fs from 'fs';
import path from 'path';
import { Agent, TimelineEntry, SessionMetadata, JSONLEntry, DashboardStats } from './types';

const SESSIONS_PATH = '/root/.clawdbot/agents/main/sessions';
const SESSIONS_JSON = path.join(SESSIONS_PATH, 'sessions.json');

// Agent name/role mapping based on session key patterns
const getAgentInfo = (sessionKey: string): { name: string; role: string; icon: string } => {
  if (sessionKey === 'agent:main:main') {
    return { name: 'Lelouch', role: 'Main Agent', icon: '👑' };
  }
  
  if (sessionKey.startsWith('agent:main:subagent:')) {
    const id = sessionKey.split(':').pop()?.substring(0, 8) || 'unknown';
    return { name: `Subagent-${id}`, role: 'Task Specialist', icon: '🤖' };
  }
  
  return { name: 'Unknown Agent', role: 'Agent', icon: '⚡' };
};

// Parse a single JSONL file to extract activity data
export const parseSessionFile = (sessionId: string): {
  toolCalls: number;
  messages: number;
  lastActivity: string;
  currentTask: string;
  timeline: TimelineEntry[];
} => {
  const filePath = path.join(SESSIONS_PATH, `${sessionId}.jsonl`);
  
  if (!fs.existsSync(filePath)) {
    return {
      toolCalls: 0,
      messages: 0,
      lastActivity: new Date().toISOString(),
      currentTask: 'No activity',
      timeline: []
    };
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);
    
    let toolCalls = 0;
    let messages = 0;
    let lastActivity = new Date(0).toISOString();
    let currentTask = 'Idle';
    const timeline: TimelineEntry[] = [];
    
    lines.forEach((line) => {
      try {
        const entry: JSONLEntry = JSON.parse(line);
        
        if (entry.timestamp && entry.timestamp > lastActivity) {
          lastActivity = entry.timestamp;
        }
        
        if (entry.type === 'message' && entry.message) {
          messages++;
          
          const { role, content, toolName } = entry.message;
          
          // Tool calls
          if (role === 'toolCall' && toolName) {
            toolCalls++;
            currentTask = `Using ${toolName}`;
            
            timeline.push({
              timestamp: entry.timestamp,
              agentId: sessionId,
              agentName: 'Agent',
              type: 'tool_use',
              message: `Using tool: ${toolName}`,
              metadata: { toolName }
            });
          }
          
          // Tool results
          if (role === 'toolResult' && toolName) {
            timeline.push({
              timestamp: entry.timestamp,
              agentId: sessionId,
              agentName: 'Agent',
              type: 'task_complete',
              message: `Completed: ${toolName}`,
              metadata: { toolName }
            });
          }
          
          // User messages
          if (role === 'user') {
            const text = typeof content === 'string' ? content : JSON.stringify(content);
            timeline.push({
              timestamp: entry.timestamp,
              agentId: sessionId,
              agentName: 'User',
              type: 'user_input',
              message: text.substring(0, 100) + (text.length > 100 ? '...' : '')
            });
          }
          
          // Assistant messages
          if (role === 'assistant') {
            const text = typeof content === 'string' ? content : JSON.stringify(content);
            if (text && text.length > 0) {
              currentTask = text.substring(0, 50) + (text.length > 50 ? '...' : '');
              timeline.push({
                timestamp: entry.timestamp,
                agentId: sessionId,
                agentName: 'Agent',
                type: 'message',
                message: text.substring(0, 150) + (text.length > 150 ? '...' : '')
              });
            }
          }
        }
      } catch (parseError) {
        // Skip malformed lines
      }
    });
    
    return {
      toolCalls,
      messages,
      lastActivity,
      currentTask,
      timeline
    };
  } catch (error) {
    console.error(`Error parsing session ${sessionId}:`, error);
    return {
      toolCalls: 0,
      messages: 0,
      lastActivity: new Date().toISOString(),
      currentTask: 'Error loading',
      timeline: []
    };
  }
};

// Load session metadata from sessions.json
export const getSessionsMetadata = (): SessionMetadata[] => {
  try {
    const content = fs.readFileSync(SESSIONS_JSON, 'utf-8');
    const data = JSON.parse(content);
    return data.sessions || [];
  } catch (error) {
    console.error('Error reading sessions.json:', error);
    return [];
  }
};

// Calculate agent status based on last activity
const getAgentStatus = (lastUpdate: number): Agent['status'] => {
  const now = Date.now();
  const ageMinutes = (now - lastUpdate) / 1000 / 60;
  
  if (ageMinutes < 5) return 'active';
  if (ageMinutes < 30) return 'working';
  return 'idle';
};

// Parse all sessions and return agent data
export const parseAgents = (): Agent[] => {
  const sessions = getSessionsMetadata();
  
  return sessions.map((session) => {
    const { name, role, icon } = getAgentInfo(session.key);
    const sessionData = parseSessionFile(session.sessionId);
    
    const status = getAgentStatus(session.updatedAt);
    
    // Calculate progress metrics
    const taskCompletion = Math.min(100, Math.round((sessionData.toolCalls / Math.max(1, sessionData.messages)) * 100));
    const productivity = Math.min(100, Math.round(sessionData.toolCalls * 2));
    const quality = Math.min(100, 75 + Math.round(Math.random() * 25)); // Simulated for now
    
    return {
      id: session.sessionId,
      name,
      role,
      icon,
      status,
      currentTask: sessionData.currentTask,
      description: `Session: ${session.key}`,
      metrics: {
        productivity,
        quality,
        responseTime: 150, // Simulated
        tasksCompleted: sessionData.toolCalls,
        tasksInProgress: status === 'active' || status === 'working' ? 1 : 0,
        tasksBlocked: 0,
        tokenUsage: session.totalTokens || 0
      },
      progressBars: [
        {
          label: 'Task Completion',
          value: taskCompletion,
          color: '#00ffff'
        },
        {
          label: 'Productivity',
          value: productivity,
          color: '#00ff88'
        },
        {
          label: 'Code Quality',
          value: quality,
          color: '#ff00ff'
        }
      ],
      connections: [], // Can be derived from message patterns
      lastUpdate: new Date(session.updatedAt).toISOString()
    };
  });
};

// Parse timeline entries from all sessions
export const parseTimeline = (limit: number = 100): TimelineEntry[] => {
  const sessions = getSessionsMetadata();
  const allEntries: TimelineEntry[] = [];
  
  sessions.forEach((session) => {
    const { name } = getAgentInfo(session.key);
    const sessionData = parseSessionFile(session.sessionId);
    
    sessionData.timeline.forEach((entry) => {
      entry.agentName = name;
      entry.agentId = session.sessionId;
      allEntries.push(entry);
    });
  });
  
  // Sort by timestamp descending
  allEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return allEntries.slice(0, limit);
};

// Calculate overall dashboard stats
export const calculateStats = (): DashboardStats => {
  const agents = parseAgents();
  
  return {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active' || a.status === 'working').length,
    totalProjects: 0, // Will be calculated when projects are implemented
    totalTasksCompleted: agents.reduce((sum, a) => sum + a.metrics.tasksCompleted, 0),
    totalTokens: agents.reduce((sum, a) => sum + a.metrics.tokenUsage, 0),
    avgProductivity: Math.round(agents.reduce((sum, a) => sum + a.metrics.productivity, 0) / agents.length)
  };
};
