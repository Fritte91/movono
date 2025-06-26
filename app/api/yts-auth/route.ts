import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

interface YtsSession {
  cookies: string[];
  timestamp: number;
}

const SESSION_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

let ytsSession: YtsSession | null = null;

async function loginToYts() {
  try {
    const YTS_USERNAME = config.yts.username;
    const YTS_PASSWORD = config.yts.password;

    if (!YTS_USERNAME || !YTS_PASSWORD) {
      throw new Error('YTS credentials not configured');
    }

    // First, get the CSRF token
    const csrfResponse = await fetch('https://yts.mx/login', {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!csrfResponse.ok) {
      throw new Error('Failed to get CSRF page');
    }

    const csrfHtml = await csrfResponse.text();
    const csrfMatch = csrfHtml.match(/name="csrf_token" value="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : null;

    if (!csrfToken) {
      throw new Error('Failed to get CSRF token');
    }

    // Perform login
    const loginResponse = await fetch('https://yts.mx/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Origin': 'https://yts.mx',
        'Referer': 'https://yts.mx/login'
      },
      body: new URLSearchParams({
        'csrf_token': csrfToken,
        'username': YTS_USERNAME,
        'password': YTS_PASSWORD,
        'remember': '1'
      }),
      redirect: 'manual'
    });

    if (!loginResponse.ok) {
      throw new Error('Login request failed');
    }

    const cookies = loginResponse.headers.getSetCookie();
    
    if (!cookies.length) {
      throw new Error('Login failed - no cookies received');
    }

    return {
      cookies,
      timestamp: Date.now()
    };
  } catch (error) {
    throw error;
  }
}

async function getYtsSession(): Promise<YtsSession> {
  // Check if we have a valid cached session
  if (ytsSession && Date.now() - ytsSession.timestamp < SESSION_CACHE_DURATION) {
    return ytsSession;
  }

  // If no valid session, perform login
  ytsSession = await loginToYts();
  return ytsSession;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getYtsSession();
    
    return NextResponse.json({
      success: true,
      session: {
        timestamp: session.timestamp,
        cookieCount: session.cookies.length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to authenticate with YTS',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 