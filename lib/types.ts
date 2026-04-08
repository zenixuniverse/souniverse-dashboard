// Core TypeScript interfaces for the dashboard

export interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: 'active' | 'idle' | 'working' | 'blocked';
  currentTask: string;
  description: string;
  projectId?: string;
  metrics: {
    productivity: number;
    quality: number;
    responseTime: number;
    tasksCompleted: number;
    tasksInProgress: number;
    tasksBlocked: number;
    tokenUsage: number;
  };
  progressBars: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  connections: string[];
  lastUpdate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  agents: {
    agentId: string;
    role: string;
    workingOn: string;
    progress: number;
  }[];
  overallProgress: number;
  status: 'planning' | 'in-progress' | 'blocked' | 'complete';
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEntry {
  timestamp: string;
  agentId: string;
  agentName: string;
  type: 'task_start' | 'task_complete' | 'message' | 'tool_use' | 'thinking' | 'user_input';
  message: string;
  metadata?: {
    toolName?: string;
    duration?: number;
    status?: string;
    [key: string]: any;
  };
}

export interface SessionMetadata {
  key: string;
  kind: string;
  updatedAt: number;
  sessionId: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  model?: string;
}

export interface JSONLEntry {
  type: string;
  id?: string;
  timestamp: string;
  message?: {
    role: string;
    content?: string | any[];
    toolName?: string;
    toolCallId?: string;
    params?: any;
  };
  [key: string]: any;
}

export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalProjects: number;
  totalTasksCompleted: number;
  totalTokens: number;
  avgProductivity: number;
}
