import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { config } from '@/lib/config';

// Cache the YTS session for 24 hours
const SESSION_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface YtsSession {
  cookies: string[];
  timestamp: number;
}

let ytsSession: YtsSession | null = null;

async function loginToYts() {
  try {
    const YTS_USERNAME = config.yts.username;
    const YTS_PASSWORD = config.yts.password;

    // Debug logging
    console.log('YTS Auth Debug:', {
      hasUsername: !!YTS_USERNAME,
      hasPassword: !!YTS_PASSWORD
    });

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
      console.error('CSRF Response Error:', {
        status: csrfResponse.status,
        statusText: csrfResponse.statusText
      });
      throw new Error('Failed to get CSRF page');
    }

    const csrfHtml = await csrfResponse.text();
    const csrfMatch = csrfHtml.match(/name="csrf_token" value="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : null;

    if (!csrfToken) {
      console.error('CSRF Token not found in response');
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
      console.error('Login Response Error:', {
        status: loginResponse.status,
        statusText: loginResponse.statusText
      });
      throw new Error('Login request failed');
    }

    const cookies = loginResponse.headers.getSetCookie();
    
    if (!cookies.length) {
      console.error('No cookies received from login response');
      throw new Error('Login failed - no cookies received');
    }

    console.log('Login successful, received cookies:', cookies.length);

    return {
      cookies,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('YTS login error:', error);
    throw error;
  }
}

async function getYtsSession(): Promise<YtsSession> {
  // Check if we have a valid cached session
  if (ytsSession && Date.now() - ytsSession.timestamp < SESSION_CACHE_DURATION) {
    console.log('Using cached YTS session');
    return ytsSession;
  }

  console.log('No valid session found, performing login');
  // If no valid session, perform login
  ytsSession = await loginToYts();
  return ytsSession;
}

export async function GET(request: Request) {
  try {
    console.log('YTS Auth route called');
    const session = await getYtsSession();
    
    // Create response with success status
    const response = NextResponse.json({ success: true });
    
    // Set all cookies from the YTS session
    session.cookies.forEach(cookie => {
      response.headers.append('Set-Cookie', cookie);
    });
    
    return response;
  } catch (error) {
    console.error('Error in YTS auth route:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with YTS', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 