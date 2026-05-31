# Middleware Auth Matrix

> Version: 1.0.0 | Updated: 2026-05-30
> Defines which routes are public, require app auth, or require admin auth.

## Route categories

| Prefix | Auth level | How enforced |
|---|---|---|
| `/` `/boards` `/quests` `/plans` `/shop` `/memories` `/activate` | Public | No middleware check |
| `/checkout` | Public | No middleware check |
| `/auth/*` | Public | No middleware check |
| `/app/*` | App user (Supabase JWT) | Middleware → redirect `/auth/sign-in` |
| `/admin/*` | Admin user (role=admin) | Middleware → redirect `/auth/admin-sign-in` |
| `/api/me/*` `/api/activate-board` `/api/missions/*` `/api/pins/*` | App user | Route Handler `getSessionOrThrow()` → 401 |
| `/api/admin/*` | Admin user | Route Handler `requireAdmin()` → 403 |
| `/api/boards` `/api/quests` `/api/plans` `/api/products` | Public | No auth |
| `/api/ai/*` | App user + credit check | Route Handler auth + credit guard |

## Current middleware.ts

The middleware currently uses a **POC cookie** (`mock_admin=true`) to guard `/admin/*`.

**M4 migration**: replace the cookie check with Supabase JWT validation:

```ts
// M4 middleware.ts (target state)
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(url, anonKey, { cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith('/app') && !user) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const role = (user?.app_metadata as { role?: string })?.role;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/admin-sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*'],
};
```

## API route auth pattern

Route Handlers do **not** use middleware for auth — they call `getSessionOrThrow()` / `requireAdmin()` from `@/lib/api/auth` directly.  This gives fine-grained per-handler control and proper JSON error responses instead of redirects.

```ts
// App route example
const supabase = await createSupabaseServerClient();
const user = await getSessionOrThrow(supabase);

// Admin route example
const supabase = await createSupabaseServerClient();
const user = await requireAdmin(supabase);
```

## Security notes

- Never trust client-supplied `role` fields — always read from `user.app_metadata` (server-only)
- `getUser()` makes a remote call to Supabase Auth — validates JWT is not revoked
- Bearer tokens expire per Supabase session config (default 1 hour); clients must refresh
- Admin password/email env vars (POC) must be removed before M4 hardening sprint
