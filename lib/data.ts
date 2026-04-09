import fs from 'fs';
import path from 'path';
import { TeamRoster, Agent, DashboardStats } from './types';

const ROSTER_PATH = '/root/clawd/ai-team/team-roster.json';
const SESSIONS_PATH = '/root/.clawdbot/agents/main/sessions/sessions.json';

// Load team roster
export function loadTeamRoster(): TeamRoster {
  try {
    const data = fs.readFileSync(ROSTER_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading team roster:', error);
    throw new Error('Failed to load team roster');
  }
}

// Load active sessions
export function loadActiveSessions(): any {
  try {
    if (!fs.existsSync(SESSIONS_PATH)) {
      return {};
    }
    const data = fs.readFileSync(SESSIONS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading sessions:', error);
    return {};
  }
}

// Get agent status based on session data
function getAgentStatus(agentKey: string, sessions: any): {
  status: 'active' | 'idle' | 'working';
  lastSeen?: string;
  tokenUsage?: number;
} {
  // Check if agent has an active session
  const sessionKey = `agent:main:subagent:${agentKey}`;
  const mainSession = sessions['agent:main:main'] || sessions['agent:default:main'];
  
  // Check for Lelouch (main agent)
  if (agentKey === 'lelouch' && mainSession) {
    const age = Date.now() - mainSession.updatedAt;
    const minutes = age / 1000 / 60;
    
    return {
      status: minutes < 5 ? 'active' : minutes < 30 ? 'working' : 'idle',
      lastSeen: new Date(mainSession.updatedAt).toISOString(),
      tokenUsage: mainSession.totalTokens || 0
    };
  }
  
  // Check for other agents
  const session = sessions[sessionKey];
  if (session) {
    const age = Date.now() - session.updatedAt;
    const minutes = age / 1000 / 60;
    
    return {
      status: minutes < 5 ? 'active' : minutes < 30 ? 'working' : 'idle',
      lastSeen: new Date(session.updatedAt).toISOString(),
      tokenUsage: session.totalTokens || 0
    };
  }
  
  return { status: 'idle' };
}

// Get all agents with status
export function getAllAgents(): Agent[] {
  const roster = loadTeamRoster();
  const sessions = loadActiveSessions();
  const agents: Agent[] = [];
  
  // Helper to process agents from each category
  const processCategory = (
    category: 'command' | 'powerhouse' | 'specialists' | 'tactical',
    agents: { [key: string]: any }
  ) => {
    return Object.entries(agents).map(([key, agent]) => {
      const statusInfo = getAgentStatus(key, sessions);
      
      return {
        id: key,
        name: agent.name,
        emoji: agent.emoji,
        role: agent.role,
        description: agent.description,
        category,
        ...statusInfo
      };
    });
  };
  
  // Process all categories
  agents.push(...processCategory('command', roster.command));
  agents.push(...processCategory('powerhouse', roster.powerhouse));
  agents.push(...processCategory('specialists', roster.specialists));
  agents.push(...processCategory('tactical', roster.tactical));
  
  return agents;
}

// Calculate dashboard stats
export function getDashboardStats(): DashboardStats {
  const agents = getAllAgents();
  
  return {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    idleAgents: agents.filter(a => a.status === 'idle').length,
    totalTokens: agents.reduce((sum, a) => sum + (a.tokenUsage || 0), 0),
    totalSpawns: 0 // Will track this later
  };
}
