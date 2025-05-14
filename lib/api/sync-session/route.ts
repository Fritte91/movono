import { NextRequest, NextResponse } from 'next/server';
import { syncSession } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { accessToken, refreshToken } = await req.json();
    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
    }

    const success = await syncSession(accessToken, refreshToken);
    return NextResponse.json({ message: success ? 'Session synced' : 'Failed to sync session' });
  } catch (error) {
    console.error('Error in sync-session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}