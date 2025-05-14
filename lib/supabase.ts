import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseServerClient() {
  return createServerClient(
    'https://ylvgvgkyawmialfcudex.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsdmd2Z2t5YXdtaWFsZmN1ZGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDM0OTEsImV4cCI6MjA2MjY3OTQ5MX0.7EMJcWM1e1LfwY1cbTmlyPYCwmEtZwZwg1fe6YGxo_0',
    {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    }
  );
}

export const supabaseClient = createBrowserClient(
  'https://ylvgvgkyawmialfcudex.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsdmd2Z2t5YXdtaWFsZmN1ZGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDM0OTEsImV4cCI6MjA2MjY3OTQ5MX0.7EMJcWM1e1LfwY1cbTmlyPYCwmEtZwZwg1fe6YGxo_0'
);

export async function syncSession(accessToken: string, refreshToken: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (error) {
    console.error('Error syncing session:', error);
  }
  return !error;
}