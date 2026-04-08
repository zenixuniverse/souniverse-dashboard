import { NextResponse } from 'next/server';
import { parseTimeline } from '@/lib/sessionParser';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    
    const timeline = parseTimeline(limit);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: timeline.length,
      timeline
    });
  } catch (error) {
    console.error('Error in /api/timeline:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timeline: [] 
      },
      { status: 500 }
    );
  }
}
