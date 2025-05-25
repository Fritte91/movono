import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Log all environment variables to the server console for debugging
  console.log('Available process.env:', Object.keys(process.env).reduce((acc, key) => {
    acc[key] = process.env[key];
    return acc;
  }, {} as Record<string, string | undefined>));

  console.log('process.env.NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('process.env.NEXT_PUBLIC_TMDB_API_KEY:', process.env.NEXT_PUBLIC_TMDB_API_KEY);
  console.log('process.env.YTS_USERNAME:', process.env.YTS_USERNAME);

  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    tmdbApiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY,
    ytsUsername: process.env.YTS_USERNAME,
    ytsPassword: process.env.YTS_PASSWORD,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    omdbApiKey: process.env.OMDB_API_KEY,
    // Add a dump of all env keys for debugging
    allEnvKeys: Object.keys(process.env),
  });
} 