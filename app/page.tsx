'use client';

import { useEffect, useState } from 'react';
import { Agent, DashboardStats } from '@/lib/types';

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const [agentsRes, statsRes] = await Promise.all([
        fetch('/api/agents', { cache: 'no-store' }),
        fetch('/api/stats', { cache: 'no-store' })
      ]);
      
      const agentsData = await agentsRes.json();
      const statsData = await statsRes.json();
      
      if (agentsData.success) setAgents(agentsData.agents);
      if (statsData.success) setStats(statsData.stats);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'working': return 'text-yellow-400';
      case 'idle': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400 pulse-glow';
      case 'working': return 'bg-yellow-400';
      case 'idle': return 'bg-gray-600';
      default: return 'bg-gray-400';
    }
  };

  const getCategoryAgents = (category: string) => {
    return agents.filter(a => a.category === category);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 blink">⚡</div>
          <div className="text-xl pixel-font retro-glow">LOADING...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 scanline">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-4xl pixel-font retro-glow text-green-400">
            [[ SoUniverse Dashboard ]]
          </h1>
          <div className="text-sm text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        <div className="text-cyan-400 mb-2">ZBJ Agency AI Team</div>
      </header>

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="retro-border bg-card p-4">
            <div className="text-xs text-gray-500 mb-1">TOTAL AGENTS</div>
            <div className="text-3xl font-bold text-green-400">{stats.totalAgents}</div>
          </div>
          <div className="retro-border bg-card p-4">
            <div className="text-xs text-gray-500 mb-1">ACTIVE</div>
            <div className="text-3xl font-bold text-green-400">{stats.activeAgents}</div>
          </div>
          <div className="retro-border bg-card p-4">
            <div className="text-xs text-gray-500 mb-1">IDLE</div>
            <div className="text-3xl font-bold text-gray-600">{stats.idleAgents}</div>
          </div>
          <div className="retro-border bg-card p-4 col-span-2">
            <div className="text-xs text-gray-500 mb-1">TOTAL TOKENS</div>
            <div className="text-3xl font-bold text-cyan-400">
              {stats.totalTokens.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Command Tier */}
      <section className="mb-8">
        <h2 className="text-xl pixel-font text-yellow-400 mb-4 retro-glow">
          👑 COMMAND
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {getCategoryAgents('command').map(agent => (
            <AgentCard key={agent.id} agent={agent} getStatusColor={getStatusColor} getStatusDot={getStatusDot} />
          ))}
        </div>
      </section>

      {/* Powerhouse Tier */}
      <section className="mb-8">
        <h2 className="text-xl pixel-font text-magenta-400 mb-4 retro-glow">
          ⚡ POWERHOUSE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getCategoryAgents('powerhouse').map(agent => (
            <AgentCard key={agent.id} agent={agent} getStatusColor={getStatusColor} getStatusDot={getStatusDot} />
          ))}
        </div>
      </section>

      {/* Specialists Tier */}
      <section className="mb-8">
        <h2 className="text-xl pixel-font text-cyan-400 mb-4 retro-glow">
          🎨 SPECIALISTS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getCategoryAgents('specialists').map(agent => (
            <AgentCard key={agent.id} agent={agent} getStatusColor={getStatusColor} getStatusDot={getStatusDot} />
          ))}
        </div>
      </section>

      {/* Tactical Tier */}
      <section className="mb-8">
        <h2 className="text-xl pixel-font text-green-400 mb-4 retro-glow">
          🎯 TACTICAL
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getCategoryAgents('tactical').map(agent => (
            <AgentCard key={agent.id} agent={agent} getStatusColor={getStatusColor} getStatusDot={getStatusDot} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm mt-12">
        <div className="mb-2">Stack Surge ⚡ Full-Stack Forge</div>
        <div>Built from scratch for Emperor Zenix 👑</div>
      </footer>
    </div>
  );
}

function AgentCard({ 
  agent, 
  getStatusColor, 
  getStatusDot 
}: { 
  agent: Agent;
  getStatusColor: (status: string) => string;
  getStatusDot: (status: string) => string;
}) {
  return (
    <div className="retro-border bg-card p-4 hover:bg-gray-900 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{agent.emoji}</span>
          <div>
            <h3 className="font-bold text-green-400">{agent.name}</h3>
            <div className="text-sm text-gray-500">{agent.role}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusDot(agent.status)}`} />
          <span className={`text-xs uppercase ${getStatusColor(agent.status)}`}>
            {agent.status}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-3">{agent.description}</p>
      {agent.tokenUsage !== undefined && agent.tokenUsage > 0 && (
        <div className="text-xs text-cyan-400">
          Tokens: {agent.tokenUsage.toLocaleString()}
        </div>
      )}
      {agent.lastSeen && (
        <div className="text-xs text-gray-600 mt-1">
          Last seen: {new Date(agent.lastSeen).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
