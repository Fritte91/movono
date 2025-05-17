import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    'https://ylvgvgkyawmialfcudex.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsdmd2Z2t5YXdtaWFsZmN1ZGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDM0OTEsImV4cCI6MjA2MjY3OTQ5MX0.7EMJcWM1e1LfwY1cbTmlyPYCwmEtZwZwg1fe6YGxo_0',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  try {
    const { data: { session } } = await supabase.auth.getSession()

    // If user is not signed in and the current path is not /login, /signup, or /
    // redirect the user to /login
    if (!session && !['/login', '/signup', '/'].includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // If user is signed in and the current path is /login or /signup
    // redirect the user to /members
    if (session && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/members', request.url))
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return response
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 