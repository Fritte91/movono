import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { accessToken, refreshToken } = await req.json();
    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
    }

    // REMOVE syncSession usage and related code, as it no longer exists.
    return NextResponse.json({ message: 'Session sync functionality removed' });
  } catch (error) {
    console.error('Error in sync-session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}