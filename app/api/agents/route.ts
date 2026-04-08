import { NextResponse } from 'next/server';
import { parseAgents } from '@/lib/sessionParser';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const agents = parseAgents();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: agents.length,
      agents
    });
  } catch (error) {
    console.error('Error in /api/agents:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        agents: [] 
      },
      { status: 500 }
    );
  }
}
