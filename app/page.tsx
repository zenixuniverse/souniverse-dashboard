'use client';

import { useEffect, useState } from 'react';
import AgentCard from '@/components/AgentCard';
import WorkflowDiagram from '@/components/WorkflowDiagram';
import { Agent, Project, TimelineEntry, DashboardStats } from '@/lib/types';

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'AGENTS' | 'PROJECTS' | 'TIMELINE'>('AGENTS');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchData = async () => {
    try {
      // Fetch all data in parallel
      const [agentsRes, projectsRes, timelineRes, statsRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/projects'),
        fetch('/api/timeline?limit=50'),
        fetch('/api/stats')
      ]);

      const [agentsData, projectsData, timelineData, statsData] = await Promise.all([
        agentsRes.json(),
        projectsRes.json(),
        timelineRes.json(),
        statsRes.json()
      ]);

      if (agentsData.success) setAgents(agentsData.agents);
      if (projectsData.success) setProjects(projectsData.projects);
      if (timelineData.success) setTimeline(timelineData.timeline);
      if (statsData.success) setStats(statsData.stats);
      
      setLastUpdate(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    fetchData();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a2332] to-[#0d1520] flex items-center justify-center">
        <div className="text-cyan-400 text-2xl animate-pulse">Loading Live AI Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] to-[#0d1520] text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400 mb-2">
              SoUniverse AI Dashboard 🌌
            </h1>
            <p className="text-gray-400">Real-time agent monitoring • Live data integration</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Last updated: {lastUpdate}</div>
            {stats && (
              <div className="flex gap-4 mt-2">
                <div className="px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm">
                  ✓ {stats.activeAgents} Active
                </div>
                <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-sm">
                  📊 {stats.totalTasksCompleted} Tasks
                </div>
                <div className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-sm">
                  🧠 {Math.round(stats.totalTokens / 1000)}K Tokens
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-700">
        {(['AGENTS', 'PROJECTS', 'TIMELINE'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === tab
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab}
            {tab === 'AGENTS' && (
              <span className="ml-2 px-2 py-0.5 bg-cyan-500/20 rounded-full text-xs">
                {agents.length}
              </span>
            )}
            {tab === 'PROJECTS' && (
              <span className="ml-2 px-2 py-0.5 bg-blue-500/20 rounded-full text-xs">
                {projects.length}
              </span>
            )}
            {tab === 'TIMELINE' && (
              <span className="ml-2 px-2 py-0.5 bg-purple-500/20 rounded-full text-xs">
                {timeline.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* AGENTS Tab */}
      {activeTab === 'AGENTS' && (
        <>
          {/* Workflow Diagram */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Agent Network</h2>
            <WorkflowDiagram agents={agents} />
          </div>

          {/* Agent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          {agents.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No active agents found</p>
            </div>
          )}
        </>
      )}

      {/* PROJECTS Tab */}
      {activeTab === 'PROJECTS' && (
        <div className="space-y-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-[#1e3a5f] bg-opacity-60 backdrop-blur-sm rounded-lg p-6 border border-cyan-900/30 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{project.name}</h3>
                  <p className="text-gray-400">{project.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                    project.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                    project.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Overall Progress</span>
                  <span className="text-sm font-bold text-cyan-400">{project.overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${project.overallProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Agents Working on Project */}
              {project.agents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-300">Team:</h4>
                  {project.agents.map((agent, idx) => (
                    <div key={idx} className="bg-black/20 rounded p-3 flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{agent.role}</p>
                        <p className="text-sm text-gray-400">{agent.workingOn}</p>
                      </div>
                      <div className="text-cyan-400 font-bold">{agent.progress}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No active projects</p>
            </div>
          )}
        </div>
      )}

      {/* TIMELINE Tab */}
      {activeTab === 'TIMELINE' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1e3a5f] bg-opacity-40 backdrop-blur-sm rounded-lg border border-cyan-900/30 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Agent Activity Feed</h2>
              <p className="text-sm text-gray-400">Real-time log of agent actions and communications</p>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
              {timeline.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-4 border-b border-gray-800/50 hover:bg-white/5 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 text-2xl">
                      {entry.type === 'tool_use' ? '🔧' :
                       entry.type === 'task_complete' ? '✅' :
                       entry.type === 'user_input' ? '👤' :
                       entry.type === 'thinking' ? '🧠' :
                       '💬'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-cyan-400">{entry.agentName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                        {entry.metadata?.toolName && (
                          <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
                            {entry.metadata.toolName}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{entry.message}</p>
                    </div>
                  </div>
                </div>
              ))}

              {timeline.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live Data • Auto-refreshing every 30s
        </p>
        <p className="mt-2">Built with ❤️ by Lelouch 👑 for Zenix Universe</p>
      </footer>
    </div>
  );
}
