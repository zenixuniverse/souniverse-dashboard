import { NextResponse } from 'next/server';
import { calculateStats } from '@/lib/sessionParser';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = calculateStats();
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats
    });
  } catch (error) {
    console.error('Error in /api/stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stats: null
      },
      { status: 500 }
    );
  }
}
