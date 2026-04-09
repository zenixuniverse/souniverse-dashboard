'use client';

import { useEffect, useState } from 'react';

interface Agent {
  name: string;
  emoji: string;
  role: string;
  description: string;
  type: string;
  active: boolean;
  skills?: string[];
}

interface TeamData {
  meta: {
    name: string;
    totalAgents: number;
  };
  command: Record<string, Agent>;
  powerhouse: Record<string, Agent>;
  specialists: Record<string, Agent>;
  tactical: Record<string, Agent>;
}

export default function Dashboard() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const response = await fetch('/team-roster.json');
      const data = await response.json();
      setTeamData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch team data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading || !teamData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="pixel-text text-4xl text-cyan-400 animate-pulse">
          LOADING AGENTS...
        </div>
      </div>
    );
  }

  const allAgents = [
    ...Object.values(teamData.command),
    ...Object.values(teamData.powerhouse),
    ...Object.values(teamData.specialists),
    ...Object.values(teamData.tactical),
  ];

  const activeCount = allAgents.filter(a => a.active).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="pixel-text text-5xl md:text-7xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient">
          👑 SoUniverse Dashboard
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-2">
          {teamData.meta.name}
        </p>
        <div className="flex justify-center gap-6 text-sm md:text-base flex-wrap">
          <div className="pixel-border px-4 py-2 bg-gray-800/50">
            <span className="text-cyan-400">Total Agents:</span>{' '}
            <span className="font-bold">{teamData.meta.totalAgents}</span>
          </div>
          <div className="pixel-border px-4 py-2 bg-gray-800/50">
            <span className="text-green-400">Active:</span>{' '}
            <span className="font-bold">{activeCount}</span>
          </div>
          <div className="pixel-border px-4 py-2 bg-gray-800/50">
            <span className="text-gray-400">Idle:</span>{' '}
            <span className="font-bold">{teamData.meta.totalAgents - activeCount}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </header>

      {/* Command Section */}
      <Section title="👑 COMMAND" agents={Object.values(teamData.command)} />

      {/* Powerhouse Section */}
      <Section title="💪 POWERHOUSE" agents={Object.values(teamData.powerhouse)} />

      {/* Specialists Section */}
      <Section title="🎯 SPECIALISTS" agents={Object.values(teamData.specialists)} />

      {/* Tactical Section */}
      <Section title="⚔️ TACTICAL" agents={Object.values(teamData.tactical)} />
    </div>
  );
}

function Section({ title, agents }: { title: string; agents: Agent[] }) {
  return (
    <section className="mb-12">
      <h2 className="pixel-text text-3xl mb-6 text-cyan-300">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((agent, idx) => (
          <AgentCard key={idx} agent={agent} />
        ))}
      </div>
    </section>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div
      className={`pixel-border p-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        agent.active
          ? 'bg-gradient-to-br from-green-900/30 to-cyan-900/30 border-green-400 glow-green'
          : 'bg-gray-800/50 border-gray-600'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-5xl">{agent.emoji}</span>
        <div
          className={`pixel-badge ${
            agent.active
              ? 'bg-green-500 text-black animate-pulse'
              : 'bg-gray-600 text-gray-300'
          }`}
        >
          {agent.active ? 'ACTIVE' : 'IDLE'}
        </div>
      </div>
      
      <h3 className="pixel-text text-xl mb-1 text-white">{agent.name}</h3>
      <p className="text-sm text-cyan-300 mb-2">{agent.role}</p>
      <p className="text-xs text-gray-400 leading-relaxed">{agent.description}</p>
      
      {agent.skills && agent.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {agent.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-purple-900/50 text-purple-300 rounded pixel-text"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
