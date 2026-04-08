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
  lastUpdate: string;
}

const statusColors = {
  active: 'bg-green-500',
  idle: 'bg-gray-500',
  working: 'bg-blue-500',
  blocked: 'bg-red-500',
};

const statusLabels = {
  active: 'Active',
  idle: 'Idle',
  working: 'Working',
  blocked: 'Blocked',
};

export default function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="bg-[#1e3a5f] bg-opacity-60 backdrop-blur-sm rounded-lg p-5 border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{agent.icon}</div>
          <div>
            <h3 className="text-lg font-bold text-white">{agent.name}</h3>
            <p className="text-sm text-cyan-400">{agent.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[agent.status]} animate-pulse`}></div>
          <span className="text-xs text-gray-400">{statusLabels[agent.status]}</span>
        </div>
      </div>

      {/* Current Task */}
      <div className="mb-4 p-3 bg-black/20 rounded-md border border-gray-700/50">
        <p className="text-xs text-gray-400 mb-1">Current Task:</p>
        <p className="text-sm text-white">{agent.currentTask}</p>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 mb-4 line-clamp-2">{agent.description}</p>

      {/* Progress Bars */}
      <div className="space-y-3 mb-4">
        {agent.progressBars.map((bar, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-300">{bar.label}</span>
              <span className="text-xs font-bold" style={{ color: bar.color }}>
                {bar.value}%
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${bar.value}%`,
                  backgroundColor: bar.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-black/20 rounded-md">
          <p className="text-xs text-gray-400">Completed</p>
          <p className="text-sm font-bold text-green-400">{agent.metrics.tasksCompleted}</p>
        </div>
        <div className="text-center p-2 bg-black/20 rounded-md">
          <p className="text-xs text-gray-400">In Progress</p>
          <p className="text-sm font-bold text-blue-400">{agent.metrics.tasksInProgress}</p>
        </div>
        <div className="text-center p-2 bg-black/20 rounded-md">
          <p className="text-xs text-gray-400">Quality</p>
          <p className="text-sm font-bold text-purple-400">{agent.metrics.quality}%</p>
        </div>
      </div>

      {/* Last Update */}
      <div className="text-xs text-gray-500 text-right">
        Updated: {new Date(agent.lastUpdate).toLocaleTimeString()}
      </div>
    </div>
  );
}
