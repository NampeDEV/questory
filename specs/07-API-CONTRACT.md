---
id: SPEC-07
title: API Contract
version: 2.0.0
status: active
requires: [SPEC-00-INDEX, SPEC-06]
audience: [agent, engineer]
owner: engineering
last_updated: 2026-05-26
---

# 07 — API Contract

> All endpoints return JSON. Server time in ISO 8601 UTC. Currency in integer THB (no decimals).

## API-ENVELOPE · Response envelope

```ts
// Success
{ "data": T, "meta"?: { ... } }

// Error
{
  "error": {
    "code": "string",          // e.g. INVALID_INPUT, NOT_FOUND, FORBIDDEN, RATE_LIMITED
    "message": "string",       // human readable, may be Thai
    "details"?: unknown        // field errors etc.
  }
}
```

Status codes: 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500.

## API-AUTH · Authentication

- Public endpoints: no auth.
- App endpoints: Supabase JWT in `Authorization: Bearer <token>` header.
- Admin endpoints: same JWT + server-side role check (`user.app_metadata.role === 'admin'`).

## API-PUBLIC · Public endpoints

### API-BOARDS-LIST · `GET /api/boards`

Query params: `?category=<starter|regional|ultimate|custom>` (optional)

Response:

```ts
{ data: BoardTemplate[] }
```

### API-BOARDS-GET · `GET /api/boards/:slug`

Response:

```ts
{
  data: BoardTemplate & {
    missions: Mission[];     // sorted by sort_order
    rewards: Badge[];
    products: Product[];
  }
}
```

### API-QUESTS-LIST · `GET /api/quests`

Returns the missions catalog grouped by board template.

### API-QUESTS-GET · `GET /api/quests/:slug`

Slug refers to the board template; same response as boards/:slug but `quest`-framed for marketing.

### API-PLANS-LIST · `GET /api/plans`

Query params: `?duration=<int>&difficulty=<easy|medium|hard>&park_code=<code>`

```ts
{
  data: Plan[],
  meta: { total: number; nextCursor: string | null }
}
```

### API-PLANS-GET · `GET /api/plans/:slug`

```ts
{
  data: Plan & {
    items: PlanItem[];      // sorted by day_number, sort_order
    creator?: { id: string; displayName: string; avatarUrl: string | null };
  }
}
```

### API-PRODUCTS-LIST · `GET /api/products`

### API-PRODUCTS-GET · `GET /api/products/:slug`

## API-ME · Authenticated user endpoints

### API-ME-GET · `GET /api/me`

```ts
{
  data: {
    user: User;
    stats: {
      parksCompleted: number;
      pinsUnlocked: number;
      pinsClaimed: number;
      activeBoards: number;
    };
  }
}
```

### API-ME-BOARDS · `GET /api/me/boards`

```ts
{ data: Array<UserBoard & { template: BoardTemplate }> }
```

### API-ACTIVATE · `POST /api/activate-board`

Request:
```ts
{ activationCode: string }
```
Response (201):
```ts
{ data: UserBoard & { template: BoardTemplate } }
```
Errors: `INVALID_CODE`, `ALREADY_ACTIVATED`.

### API-ME-MISSIONS · `GET /api/me/missions`

Query: `?boardId=<id>&status=<MissionStatus>`

```ts
{
  data: Array<Mission & {
    submissionStatus: MissionStatus;   // resolved per-user
    latestSubmissionId: string | null;
  }>
}
```

### API-SUBMIT · `POST /api/missions/:missionId/submit`

Request (multipart/form-data):

| Field | Type | Required | Notes |
|---|---|---|---|
| `photo` | File | yes | image/jpeg or image/png, ≤5 MB |
| `latitude` | number | yes | |
| `longitude` | number | yes | |
| `travelDate` | string | yes | ISO date |
| `memoryNote` | string | no | ≤2,000 chars |
| `sharePermission` | boolean | no | default false |
| `safetyAcknowledged` | boolean | yes | must be `true` |

Response (201):
```ts
{ data: MissionSubmission }
```
Server side effects:
1. Insert `mission_submissions` row with `status = 'pending'`.
2. Upload photo to Supabase Storage; store signed URL on the row.
3. Auto-create a draft `memories` row tied to the submission.

Errors: `INVALID_INPUT`, `SAFETY_NOT_ACKNOWLEDGED`, `DUPLICATE_SUBMISSION`.

### API-ME-PINS · `GET /api/me/pins`

```ts
{
  data: Array<{
    pin: Pin;
    badge: Badge;
    status: PinStatus;          // locked / unlocked / claim_available / claimed / shipped / delivered
    claim?: PinClaim;
  }>
}
```

### API-PIN-CLAIM · `POST /api/pins/:pinId/claim`

Request:
```ts
{
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  missionSubmissionId: string;   // the submission that earned it
}
```
Response (201):
```ts
{ data: PinClaim }
```
Errors: `PIN_NOT_ELIGIBLE`, `ALREADY_CLAIMED`, `OUT_OF_STOCK`.

### API-ME-MEMORIES · `GET /api/me/memories`

Query: `?visibility=<private|public|unlisted>`

### API-PLAN-COPY · `POST /api/plans/:planId/copy`

Increments `copy_count`. Returns:
```ts
{ data: { planId: string; copiedAt: string } }
```

## API-AI · AI plugin endpoints (rate-limited)

All under `/api/ai/*`. Require auth. Enforce per-user credit ledger (`09-AI-FEATURES.md` § AI-COST-001).

| Endpoint | Spec | Free / month | Paid credit |
|---|---|---|---|
| `POST /api/ai/planner` | AI-PLANNER-001 | 1 | 49–99 THB/gen |
| `POST /api/ai/memory` | AI-MEMORY-001 | unlimited (small) | — |
| `POST /api/ai/caption` | AI-CAPTION-001 | 3 | 49 THB/pack |
| `POST /api/ai/checklist` | AI-CHECKLIST-001 | unlimited | — |
| `POST /api/ai/recommend` | AI-RECO-001 | unlimited | — |

Common envelope:

```ts
// Request
{ input: <plugin-specific>, options?: { ... } }

// Response
{
  data: <plugin-specific>,
  meta: { creditsRemaining: number; cached: boolean }
}
```

See `09-AI-FEATURES.md` for plugin-specific request/response shapes.

## API-ADMIN · Admin endpoints

All require `role=admin`.

### `GET /api/admin/submissions`

Query: `?status=<pending|need_more_info>&parkCode=<code>&from=<iso>&to=<iso>`

Response: paginated list with photo URL, user, mission, location.

### `POST /api/admin/submissions/:id/approve`
### `POST /api/admin/submissions/:id/reject`

```ts
{ reviewerNote?: string }
```

### `POST /api/admin/submissions/:id/request-info`

```ts
{ reviewerNote: string }    // required
```

### `POST /api/admin/pin-claims/:id/ship`

```ts
{ trackingNumber: string }
```

## API-RATE-LIMIT

| Bucket | Limit |
|---|---|
| Anonymous public reads | 60 req/min/IP |
| Authenticated reads | 120 req/min/user |
| Submissions | 10/day/user |
| AI endpoints | per AI-COST-001 quotas |
| Admin endpoints | 600 req/min/admin |

Return `429 RATE_LIMITED` with `Retry-After` header on breach.

## API-WEBHOOK · (Future, not POC)

`POST /api/webhooks/shipping` — carrier status updates (NOT in scope for POC).

## API-OPENAPI

Spec is generated from Zod schemas in `src/lib/validation/*` via `zod-to-openapi`. Build target: `public/openapi.json` (excluded from sitemap).

---

## Changelog
- 2026-05-26 · v2.0.0 · Promoted v1 endpoint list to full contract — envelopes, error codes, rate limits, multipart shapes.
