# Backend Architecture

> Version: 1.0.0 | Updated: 2026-05-30 | Status: active

## Overview

Questory uses a **BaaS-first monolith** pattern:

- **Next.js Route Handlers** serve as the API layer (no separate backend service)
- **Supabase** (Postgres + Auth + Storage) is the entire persistence + auth stack
- No microservices, no gRPC — HTTP JSON via the API envelope in SPEC-07
- All sensitive logic lives in RLS policies and server-side Route Handlers

---

## Stack Decisions

| Concern | Choice | Rationale |
|---|---|---|
| API | Next.js Route Handlers | Co-located with UI, zero infra, Vercel-ready |
| Auth | Supabase Auth (email + Google) | JWT-based, RLS-compatible, magic-link support |
| Database | Supabase Postgres | RLS per SPEC-06, row-level isolation, JSONB for lists |
| File storage | Supabase Storage | Signed URLs, bucket-level ACL, 5 MB photo cap |
| AI inference | Route Handler → provider SDK | Abstract behind `src/lib/ai/provider.ts` |
| Cache | `ai_cache` table in Postgres | Simple, auditable, avoids Redis for POC |
| Currency | Integer THB (no decimals) | SPEC-07 requirement |
| Timestamps | `timestamptz` (UTC) | ISO 8601 UTC returned to clients |

---

## Auth Flow

```
Client                      Route Handler               Supabase Auth
  │                              │                            │
  ├─── POST /api/auth/sign-in ──►│                            │
  │                              ├─── createUser() ──────────►│
  │                              │◄── { access_token, ... } ──┤
  │◄─── { data: { session } } ───┤                            │
  │                              │                            │
  │──── GET /api/me ─────────────►                            │
  │   Authorization: Bearer <jwt>│                            │
  │                              ├─── getUser(jwt) ──────────►│
  │                              │◄── { user } ───────────────┤
  │                              ├─── SELECT * FROM users ───►│  (Postgres+RLS)
  │◄─── { data: { user, stats } }┤                            │
```

**Admin check**: `user.app_metadata.role === 'admin'` — set server-side only via service role key. Cannot be spoofed by client JWT.

---

## Supabase Storage Buckets

| Bucket | Access | Max size | Notes |
|---|---|---|---|
| `mission-photos` | Authenticated upload, public read | 5 MB | Proof photos from submissions |
| `avatars` | Authenticated upload, public read | 1 MB | User profile photos |
| `board-covers` | Admin upload, public read | 2 MB | Board template cover images |
| `pin-images` | Admin upload, public read | 500 KB | Transparent PNGs for pins/badges |

---

## Route Handler Skeleton

Every Route Handler follows this pattern:

```ts
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionOrThrow } from '@/lib/api/auth';
import { apiSuccess, handleRouteError } from '@/lib/api/response';
import { z } from 'zod';

const InputSchema = z.object({ /* ... */ });

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    const user     = await getSessionOrThrow(supabase);   // remove for public routes

    const body   = await req.json();
    const parsed = InputSchema.safeParse(body);
    if (!parsed.success) {
      return apiError('INVALID_INPUT', 'Validation failed', 422, parsed.error.flatten());
    }

    // ... business logic
    return apiSuccess(result, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
```

---

## Deployment

| Environment | URL | Notes |
|---|---|---|
| Local | `http://localhost:3000` | `pnpm dev`, local Supabase via Docker optional |
| Preview | Vercel PR previews | Auto-deployed on every PR |
| Production | `https://npq.app` (placeholder) | Vercel + Supabase cloud |

### Required env vars

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only (admin operations, storage)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
OPENAI_API_KEY=                     # or ANTHROPIC_API_KEY
ADMIN_EMAIL=                        # POC: simple admin guard (remove in M4)
ADMIN_PASSWORD=                     # POC: simple admin guard (remove in M4)
```
