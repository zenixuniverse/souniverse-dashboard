import { NextResponse } from 'next/server';
import { getAgentData } from '@/lib/agentData';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = await getAgentData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching agent data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent data', details: String(error) },
      { status: 500 }
    );
  }
}
