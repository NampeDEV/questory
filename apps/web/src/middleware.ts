import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// S-013 — Route protection middleware.
//
// Admin routes (/admin/*):
//   Checks `mock_admin=true` cookie (POC). Swap for Supabase JWT in M4.
//
// App routes (/app/*):
//   Checks Supabase `sb-*-auth-token` cookie to decide if the user has a
//   session. This is a lightweight presence check only — the actual JWT
//   validation happens inside Route Handlers via `getSessionOrThrow()`.
//   Without @supabase/ssr we cannot refresh the session here, so on cookie
//   absence we redirect to sign-in. The client will auto-refresh the session
//   on the next full page load when the cookie is present but stale.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

/** Returns true if a Supabase auth cookie exists for this project. */
function hasSupabaseSession(request: NextRequest): boolean {
  // Cookie name pattern: sb-<project-ref>-auth-token
  const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];
  const cookieName = projectRef ? `sb-${projectRef}-auth-token` : null;

  if (cookieName) {
    const tokenCookie = request.cookies.get(cookieName);
    if (tokenCookie?.value) return true;
  }

  // Fallback: any cookie starting with 'sb-' and ending with '-auth-token'
  for (const [name] of request.cookies) {
    if (name.startsWith('sb-') && name.endsWith('-auth-token')) return true;
  }

  return false;
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // ── Admin guard (redirects only the /admin root — sub-routes are accessible in POC) ────
  if (pathname === '/admin') {
    const mockAdminCookie = request.cookies.get('mock_admin');
    const isAdmin = mockAdminCookie?.value === 'true';

    if (!isAdmin) {
      const loginUrl = new URL('/auth/admin-sign-in', request.url);
      loginUrl.searchParams.set('redirect', `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── App guard ────────────────────────────────────────────────────────────
  // When Supabase is not configured (local dev / E2E without credentials) skip auth check.
  if (pathname.startsWith('/app')) {
    if (SUPABASE_URL && !hasSupabaseSession(request)) {
      const signInUrl = new URL('/auth/sign-in', request.url);
      signInUrl.searchParams.set('redirect', `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/app/:path*'],
};

