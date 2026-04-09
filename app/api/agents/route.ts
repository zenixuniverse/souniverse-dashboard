import { NextResponse } from 'next/server';
import { getAllAgents } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const agents = getAllAgents();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: agents.length,
      agents
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
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
