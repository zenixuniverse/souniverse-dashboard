// Type definitions for SoUniverse Dashboard

export interface RosterAgent {
  name: string;
  emoji: string;
  role: string;
  description: string;
  type: string;
  skills?: string[];
  active: boolean;
  sessionKey: string | null;
}

export interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  description: string;
  category: 'command' | 'powerhouse' | 'specialists' | 'tactical';
  status: 'active' | 'idle' | 'working';
  lastSeen?: string;
  tokenUsage?: number;
  spawnCount?: number;
}

export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  idleAgents: number;
  totalTokens: number;
  totalSpawns: number;
}

export interface TeamRoster {
  meta: {
    name: string;
    version: string;
    created: string;
    totalAgents: number;
  };
  command: { [key: string]: RosterAgent };
  powerhouse: { [key: string]: RosterAgent };
  specialists: { [key: string]: RosterAgent };
  tactical: { [key: string]: RosterAgent };
}
