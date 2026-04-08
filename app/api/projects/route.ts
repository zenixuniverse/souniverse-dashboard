import { NextResponse } from 'next/server';
import { Project } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects: Project[] = [
      {
        id: 'dashboard-redesign',
        name: 'SoUniverse Dashboard Redesign',
        description: 'Transform static dashboard into live, real-time agent monitoring system',
        agents: [
          {
            agentId: 'agent-main',
            role: 'Lead Developer',
            workingOn: 'API integration and data pipeline',
            progress: 85
          }
        ],
        overallProgress: 85,
        status: 'in-progress',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sogrow-content',
        name: 'SoGrow Content Creation',
        description: 'AI-powered content generation for social media',
        agents: [],
        overallProgress: 0,
        status: 'planning',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Error in /api/projects:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        projects: [] 
      },
      { status: 500 }
    );
  }
}
