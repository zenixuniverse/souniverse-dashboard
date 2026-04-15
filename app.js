// SOUniverse Dashboard v3.0 - Live Data Fetcher

const API_URL = 'https://asian-civil-lid-workshops.trycloudflare.com';
const REFRESH_INTERVAL = 15000; // 15 seconds

let refreshTimer = 15;
let timerInterval;
let refreshTimeout;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SOUniverse Dashboard v3.0 initialized');
    fetchAllData();
    startRefreshTimer();
});

// Fetch all data from API
async function fetchAllData() {
    try {
        updateConnectionStatus('FETCHING...');
        
        // Fetch all endpoints in parallel
        const [agentsRes, projectsRes, statsRes] = await Promise.all([
            fetch(`${API_URL}/api/agents`),
            fetch(`${API_URL}/api/projects`),
            fetch(`${API_URL}/api/stats`)
        ]);
        
        const agents = await agentsRes.json();
        const projects = await projectsRes.json();
        const stats = await statsRes.json();
        
        // Update UI
        updateStats(stats.stats);
        updateAgentsGrid(agents.agents);
        updateProjectsList(projects.projects);
        updateConnectionStatus('CONNECTED');
        updateLastUpdate();
        
        console.log('✅ Data updated successfully');
    } catch (error) {
        console.error('❌ Error fetching data:', error);
        updateConnectionStatus('ERROR');
    }
}

// Update stats bar
function updateStats(stats) {
    document.getElementById('total-agents').textContent = stats.totalAgents || '--';
    document.getElementById('working-agents').textContent = stats.working || '--';
    document.getElementById('active-agents').textContent = stats.active || '--';
    document.getElementById('idle-agents').textContent = stats.idle || '--';
    document.getElementById('completed-tasks').textContent = stats.completedTasks || '--';
    document.getElementById('productivity-score').textContent = `${stats.productivityScore || 0}%`;
}

// Update agents grid
function updateAgentsGrid(agents) {
    const grid = document.getElementById('agents-grid');
    
    if (!agents || agents.length === 0) {
        grid.innerHTML = '<div class="no-data">NO AGENTS DETECTED</div>';
        return;
    }
    
    grid.innerHTML = agents.map(agent => `
        <div class="agent-card status-${agent.status.toLowerCase()}">
            <div class="agent-header">
                <div class="agent-name">${agent.name}</div>
                <div class="agent-status ${agent.status.toLowerCase()}">${agent.status}</div>
            </div>
            <div class="agent-role">${agent.role || 'Specialist'}</div>
            <div class="agent-task">
                ${escapeHtml(agent.currentTask)}
            </div>
            <div class="agent-metrics">
                <div class="metric spawn-count">
                    <span class="metric-label">SPAWNS:</span>
                    <span class="metric-value">${agent.spawnCount}x</span>
                </div>
                <div class="metric">
                    <span class="metric-label">COMPLETION:</span>
                    <span class="metric-value">${Math.round(agent.metrics.completionRate)}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">PRODUCTIVITY:</span>
                    <span class="metric-value">${agent.metrics.productivityScore}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">TOOLS:</span>
                    <span class="metric-value">${agent.metrics.toolCalls}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Update projects list
function updateProjectsList(projects) {
    const list = document.getElementById('projects-list');
    
    if (!projects || projects.length === 0) {
        list.innerHTML = '<div class="no-data">NO ACTIVE PROJECTS</div>';
        return;
    }
    
    list.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-agent">${project.agentName} • ${project.status}</div>
            <div class="project-task">${escapeHtml(project.task)}</div>
        </div>
    `).join('');
}

// Update connection status
function updateConnectionStatus(status) {
    const statusEl = document.getElementById('connection-status');
    statusEl.textContent = status;
    
    const colors = {
        'CONNECTED': '#00ff41',
        'FETCHING...': '#ffb700',
        'ERROR': '#ff3366',
        'CONNECTING...': '#00d4ff'
    };
    
    statusEl.style.color = colors[status] || '#666677';
}

// Update last update timestamp
function updateLastUpdate() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    });
    document.getElementById('last-update').textContent = timeStr;
}

// Format timestamp to relative time
function formatTime(timestamp) {
    if (!timestamp) return 'N/A';
    
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'NOW';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start refresh timer
function startRefreshTimer() {
    // Update timer display
    timerInterval = setInterval(() => {
        refreshTimer--;
        document.getElementById('refresh-timer').textContent = refreshTimer;
        
        if (refreshTimer <= 0) {
            refreshTimer = 15;
        }
    }, 1000);
    
    // Refresh data
    refreshTimeout = setInterval(() => {
        fetchAllData();
        refreshTimer = 15;
    }, REFRESH_INTERVAL);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    clearInterval(timerInterval);
    clearInterval(refreshTimeout);
});
