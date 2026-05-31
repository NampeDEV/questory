# API Route Structure

> Version: 1.0.0 | Updated: 2026-05-30
> All routes live under `apps/web/src/app/api/`

## Public routes (no auth)

```
api/
├── boards/
│   ├── route.ts              GET /api/boards          ?category=
│   └── [slug]/
│       └── route.ts          GET /api/boards/:slug
├── quests/
│   ├── route.ts              GET /api/quests
│   └── [slug]/
│       └── route.ts          GET /api/quests/:slug
├── plans/
│   ├── route.ts              GET /api/plans           ?duration=&difficulty=&park_code=
│   └── [slug]/
│       └── route.ts          GET /api/plans/:slug
└── products/
    ├── route.ts              GET /api/products
    └── [slug]/
        └── route.ts          GET /api/products/:slug
```

## Auth routes (Supabase Auth)

```
api/auth/
├── sign-in/route.ts          POST /api/auth/sign-in
├── sign-up/route.ts          POST /api/auth/sign-up
├── sign-out/route.ts         POST /api/auth/sign-out
├── admin-login/route.ts      POST /api/auth/admin-login  (POC cookie-based)
└── callback/route.ts         GET  /api/auth/callback     (OAuth redirect)
```

## Authenticated user routes (Bearer JWT required)

```
api/
├── me/
│   ├── route.ts              GET /api/me
│   ├── boards/
│   │   └── route.ts          GET /api/me/boards
│   ├── missions/
│   │   └── route.ts          GET /api/me/missions      ?boardId=&status=
│   ├── pins/
│   │   └── route.ts          GET /api/me/pins
│   ├── memories/
│   │   └── route.ts          GET /api/me/memories
│   └── orders/
│       └── route.ts          GET /api/me/orders
├── activate-board/
│   └── route.ts              POST /api/activate-board
├── missions/
│   └── [missionId]/
│       └── submit/
│           └── route.ts      POST /api/missions/:missionId/submit  (multipart)
└── pins/
    └── [pinId]/
        └── claim/
            └── route.ts      POST /api/pins/:pinId/claim
```

## Admin routes (Bearer JWT + app_metadata.role === 'admin')

```
api/admin/
├── stats/route.ts            GET  /api/admin/stats
├── submissions/
│   ├── route.ts              GET  /api/admin/submissions    ?status=&page=
│   └── [id]/
│       └── review/route.ts   POST /api/admin/submissions/:id/review
├── orders/
│   ├── route.ts              GET  /api/admin/orders
│   └── [id]/
│       └── ship/route.ts     POST /api/admin/orders/:id/ship
├── pin-claims/
│   ├── route.ts              GET  /api/admin/pin-claims
│   └── [id]/
│       └── ship/route.ts     POST /api/admin/pin-claims/:id/ship
└── users/route.ts            GET  /api/admin/users
```

## AI routes (Authenticated + credit-gated)

```
api/ai/
├── suggest-plan/route.ts     POST /api/ai/suggest-plan
├── generate-memory/route.ts  POST /api/ai/generate-memory
├── moderate/route.ts         POST /api/ai/moderate         (internal)
└── credits/route.ts          GET  /api/ai/credits
```

## OG image routes (public, cached)

```
api/
├── og/ (see src/app/og-*/route.tsx)
└── activate-board/route.ts   (legacy path — delegates to /api/activate-board)
```
