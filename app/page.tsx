'use client';

import { useEffect, useState } from 'react';
import AgentCard from '@/components/AgentCard';
import WorkflowDiagram from '@/components/WorkflowDiagram';

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: 'active' | 'idle' | 'working' | 'blocked';
  currentTask: string;
  description: string;
  metrics: {
    productivity: number;
    quality: number;
    responseTime: number;
    tasksCompleted: number;
    tasksInProgress: number;
    tasksBlocked: number;
  };
  progressBars: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  connections: string[];
  lastUpdate: string;
}

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeTab, setActiveTab] = useState<'AGENTS' | 'PROJECTS' | 'TIMELINE'>('AGENTS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch agent data
    fetch('/data/agents.json')
      .then(res => res.json())
      .then(data => {
        setAgents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load agents:', err);
        setLoading(false);
      });

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetch('/data/agents.json')
        .then(res => res.json())
        .then(data => setAgents(data));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] to-[#0d1520] flex items-center justify-center">
        <div className="text-cyan-400 text-2xl">Loading AI Team Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] to-[#0d1520] text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">AI Team Dashboard</h1>
        <p className="text-gray-400">Real-time agent monitoring and workflow tracking</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-700">
        {(['AGENTS', 'PROJECTS', 'TIMELINE'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === tab
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'AGENTS' && (
        <>
          {/* Workflow Diagram */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Workflow Network</h2>
            <WorkflowDiagram agents={agents} />
          </div>

          {/* Agent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </>
      )}

      {activeTab === 'PROJECTS' && (
        <div className="text-center py-20">
          <h2 className="text-2xl text-gray-400">Projects view coming soon...</h2>
        </div>
      )}

      {activeTab === 'TIMELINE' && (
        <div className="text-center py-20">
          <h2 className="text-2xl text-gray-400">Timeline view coming soon...</h2>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Last updated: {new Date().toLocaleString()}</p>
        <p className="mt-2">Built with ❤️ by Lelouch 👑 for Zenix Universe</p>
      </footer>
    </div>
  );
}
