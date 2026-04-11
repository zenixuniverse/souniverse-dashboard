'use client';

import { useEffect, useState } from 'react';

interface AgentMetrics {
  id: string;
  name: string;
  emoji: string;
  role: string;
  status: 'WORKING' | 'ACTIVE' | 'IDLE';
  currentTask: string;
  lastActivity: string;
  taskCompletion: number;
  productivity: number;
  codeQuality: number;
  tokenUsage: number;
  messageCount: number;
  sessionId?: string;
}

interface DashboardData {
  agents: AgentMetrics[];
  summary: {
    total: number;
    done: number;
    active: number;
    score: number;
  };
  timestamp: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      // Try Netlify function first, fallback to mock data for development
      const endpoint = process.env.NODE_ENV === 'production' 
        ? '/.netlify/functions/agents' 
        : '/api/agents';
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch agent data:', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">👑</div>
          <div className="text-2xl font-mono text-cyan-400 animate-pulse">
            INITIALIZING EMPIRE VIEW...
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center border-2 border-red-500 p-8 rounded-lg bg-red-950/20">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-2xl font-mono text-red-400 mb-2">SYSTEM ERROR</div>
          <div className="text-sm font-mono text-red-300">{error || 'Failed to load data'}</div>
          <button 
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-mono rounded"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 font-mono">
      {/* Header */}
      <header className="mb-6 border-b-2 border-cyan-500 pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-magenta-400 to-green-400 mb-2">
              👑 SOUniverse - LIVE AGENT TRACKING
            </h1>
            <p className="text-sm text-gray-400">
              Real-time monitoring of AI Empire operations
            </p>
          </div>
          <div className="text-xs text-gray-500">
            <div>AUTO-REFRESH: 15s</div>
            <div>LAST UPDATE: {lastUpdate.toLocaleTimeString()}</div>
          </div>
        </div>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard 
          label="DONE" 
          value={data.summary.done} 
          color="green"
          icon="✅"
        />
        <StatCard 
          label="ACTIVE" 
          value={data.summary.active} 
          color="cyan"
          icon="⚡"
        />
        <StatCard 
          label="SCORE" 
          value={`${data.summary.score}%`} 
          color="magenta"
          icon="🎯"
        />
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  color, 
  icon 
}: { 
  label: string; 
  value: string | number; 
  color: 'green' | 'cyan' | 'magenta';
  icon: string;
}) {
  const colorClasses = {
    green: 'border-green-500 bg-green-950/30 text-green-400',
    cyan: 'border-cyan-500 bg-cyan-950/30 text-cyan-400',
    magenta: 'border-magenta-500 bg-magenta-950/30 text-magenta-400',
  };

  return (
    <div className={`border-2 ${colorClasses[color]} p-4 rounded-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl">{icon}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function AgentCard({ agent }: { agent: AgentMetrics }) {
  const statusColors = {
    WORKING: 'border-green-500 bg-green-950/20',
    ACTIVE: 'border-yellow-500 bg-yellow-950/20',
    IDLE: 'border-gray-600 bg-gray-900/20',
  };

  const statusBadgeColors = {
    WORKING: 'bg-green-500 text-black',
    ACTIVE: 'bg-yellow-500 text-black',
    IDLE: 'bg-gray-600 text-gray-300',
  };

  const getLastActivityDisplay = () => {
    if (agent.lastActivity === 'Never') return 'Never';
    try {
      const activityDate = new Date(agent.lastActivity);
      const now = Date.now();
      const diff = now - activityDate.getTime();
      const minutes = Math.floor(diff / 1000 / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className={`border-2 ${statusColors[agent.status]} rounded-lg p-4 transition-all hover:scale-[1.02]`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{agent.emoji}</div>
          <div>
            <h3 className="text-lg font-bold text-white">{agent.name}</h3>
            <p className="text-xs text-cyan-400">{agent.role}</p>
          </div>
        </div>
        <div className={`px-2 py-1 text-xs font-bold rounded ${statusBadgeColors[agent.status]}`}>
          {agent.status}
        </div>
      </div>

      {/* Current Task */}
      <div className="mb-4 bg-black/50 border border-cyan-800 rounded p-3">
        <div className="text-xs text-cyan-500 mb-1 font-semibold">CURRENT TASK:</div>
        <div className="text-xs text-gray-300 leading-relaxed break-words">
          {agent.currentTask}
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-2 mb-3">
        <MetricBar label="Task Completion" value={agent.taskCompletion} color="cyan" />
        <MetricBar label="Productivity" value={agent.productivity} color="green" />
        <MetricBar label="Code Quality" value={agent.codeQuality} color="magenta" />
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-2">
        <div>
          <span className="text-gray-600">Messages:</span> {agent.messageCount}
        </div>
        <div>
          <span className="text-gray-600">Tokens:</span> {agent.tokenUsage.toLocaleString()}
        </div>
        <div>
          <span className="text-gray-600">Last:</span> {getLastActivityDisplay()}
        </div>
      </div>
    </div>
  );
}

function MetricBar({ 
  label, 
  value, 
  color 
}: { 
  label: string; 
  value: number; 
  color: 'cyan' | 'green' | 'magenta';
}) {
  const barColors = {
    cyan: 'bg-cyan-500',
    green: 'bg-green-500',
    magenta: 'bg-magenta-500',
  };

  const bgColors = {
    cyan: 'bg-cyan-950/30',
    green: 'bg-green-950/30',
    magenta: 'bg-magenta-950/30',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-bold text-white">{value}%</span>
      </div>
      <div className={`h-2 ${bgColors[color]} rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${barColors[color]} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
