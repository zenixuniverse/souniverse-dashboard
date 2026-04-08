interface Agent {
  id: string;
  name: string;
  icon: string;
  connections: string[];
  status: 'active' | 'idle' | 'working' | 'blocked';
}

const statusColors = {
  active: '#10b981',
  idle: '#6b7280',
  working: '#3b82f6',
  blocked: '#ef4444',
};

export default function WorkflowDiagram({ agents }: { agents: Agent[] }) {
  // Find Lelouch (captain) to place at center
  const captain = agents.find(a => a.id === 'lelouch');
  const team = agents.filter(a => a.id !== 'lelouch');

  if (!captain) return null;

  return (
    <div className="bg-[#1e3a5f] bg-opacity-40 backdrop-blur-sm rounded-lg p-8 border border-cyan-900/30 min-h-[400px] relative overflow-hidden">
      {/* Center: Lelouch */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div 
          className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 bg-[#1a2332] shadow-xl"
          style={{ borderColor: statusColors[captain.status] }}
        >
          <div className="text-4xl">{captain.icon}</div>
          <div className="text-xs mt-1 text-white font-bold">{captain.name}</div>
        </div>
      </div>

      {/* Team members in circle around captain */}
      {team.map((agent, idx) => {
        const angle = (idx / team.length) * 2 * Math.PI - Math.PI / 2;
        const radius = 180;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div key={agent.id}>
            {/* Connection line */}
            <svg
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{ overflow: 'visible' }}
            >
              <line
                x1="0"
                y1="0"
                x2={x}
                y2={y}
                stroke={statusColors[agent.status]}
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.4"
              />
            </svg>

            {/* Agent node */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ marginLeft: `${x}px`, marginTop: `${y}px` }}
            >
              <div
                className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-3 bg-[#1a2332] shadow-lg hover:scale-110 transition-transform cursor-pointer"
                style={{ borderColor: statusColors[agent.status], borderWidth: '3px' }}
                title={agent.name}
              >
                <div className="text-2xl">{agent.icon}</div>
                <div className="text-[10px] mt-1 text-white text-center px-1">{agent.name.split(' ')[0]}</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex gap-4 text-xs">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
            <span className="text-gray-400 capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
