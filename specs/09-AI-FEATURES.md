---
id: SPEC-09
title: AI Plugin Specifications
version: 2.0.0
status: active
requires: [SPEC-00-INDEX, SPEC-02, SPEC-07]
audience: [agent, engineer]
owner: ai
last_updated: 2026-05-26
---

# 09 — AI Features

> AI must **support** the core loop, not replace it. Every plugin is opt-in, behind a button, and metered.

## AI-ARCH · Architecture

```text
Client (form button click)
   │
   ▼
Next.js Route Handler  /api/ai/*
   │
   ├─ Credit ledger check (per-user, monthly)
   ├─ Moderation pre-check (input)
   ├─ Provider call (OpenAI / Azure OpenAI / etc.)
   ├─ Moderation post-check (output)
   ├─ Cache write (Supabase: ai_cache table)
   └─ Telemetry (PostHog: ai_plugin_call)
```

Provider abstraction lives in `src/lib/ai/provider.ts`. Swap providers by env (`AI_PROVIDER=openai|azure`).

## AI-COST-001 · Cost control

| Plugin | Free / month | Paid pack |
|---|---|---|
| Trip Planner | 1 generation | 49–99 THB/gen, premium pack includes 5 |
| Memory Writer | unlimited (≤500 tokens out) | — |
| Caption Generator | 3 generations | 49 THB / 5 generations |
| Checklist Generator | unlimited | — |
| Mission Recommender | unlimited | — |

Rules:
- Trigger only on explicit button click. No background generation.
- Always cache successful generations keyed by `(plugin, hash(input))`.
- Return `meta.cached: true` for cache hits (free, no credit decrement).
- Decrement credits **after** moderation pass + successful generation.

## AI-MOD-001 · Moderation

Pre-call: reject inputs that mention restricted/dangerous spots, off-trail routes, drone in no-fly zones, illegal substances, hate, NSFW.

Post-call: reject outputs that suggest dangerous behaviour, undocumented routes, or specific risky photo spots (e.g. "stand on the cliff edge for sunrise").

Implementation: provider-side moderation API + a small Thai keyword list in `src/lib/ai/moderation.ts`.

On block:
```ts
{ error: { code: 'AI_BLOCKED', message: 'เนื้อหานี้ไม่สามารถสร้างได้เพื่อความปลอดภัย' } }
```

---

## AI-PLANNER-001 · Trip Planner

Endpoint: `POST /api/ai/planner`

### Request

```ts
{
  input: {
    startLocation: string;           // e.g. "Bangkok"
    destination: string;             // park name or park_code
    days: number;                    // 1–7
    budgetThb: number;
    travelStyle: Array<'nature' | 'photo' | 'easy' | 'adventure' | 'family' | 'solo'>;
    people: number;                  // 1–8
    travelMonth?: number;            // 1-12
  }
}
```

### Response

```ts
{
  data: {
    title: string;
    summary: string;
    estimatedBudget: string;          // "4,200 - 5,300 THB"
    days: Array<{
      day: number;
      items: string[];                // 3–6 items, Thai
    }>;
    checklist: string[];              // 6–12 items
    safetyNotes: string[];            // 1–3 items
  };
  meta: { creditsRemaining: number; cached: boolean };
}
```

### Prompt skeleton

```text
You are a Thai national park travel planner.
Output STRICT JSON matching the schema. No extra prose.
Constraints:
- Body language: Thai.
- Days array length must equal {input.days}.
- Never suggest restricted zones, off-trail routes, or risky photo spots.
- Budget guidance must fit within ±20% of {input.budgetThb}.
Input: {input}
```

---

## AI-MEMORY-001 · Memory Writer

Endpoint: `POST /api/ai/memory`

### Request

```ts
{
  input: {
    parkName: string;
    travelDate: string;          // ISO date
    mood?: 'proud' | 'peaceful' | 'tired-but-happy' | 'awe' | 'grateful';
    rawNote?: string;            // user-jotted snippet
    photoContext?: string;       // user-typed scene description; do not auto-OCR
  }
}
```

### Response

```ts
{
  data: {
    shortMemory: string;         // ≤ 280 chars
    longDiary: string;           // 600-900 chars
    shareCaption: string;        // ≤ 220 chars
    hashtags: string[];          // 4-8 Thai/EN tags
  }
}
```

Example output target:

```text
วันนี้ปลดล็อกภารกิจดอยอินทนนท์สำเร็จ วิวทะเลหมอกตอนเช้าทำให้ความเหนื่อยทั้งหมดคุ้มค่า นี่คืออีกหนึ่ง Pin ที่มีเรื่องราวจริง ๆ
```

---

## AI-CAPTION-001 · Caption Generator

Endpoint: `POST /api/ai/caption`

### Request

```ts
{
  input: {
    surface: 'tiktok' | 'ig' | 'facebook' | 'lemon8';
    missionName: string;
    parkName: string;
    badgeName?: string;
    progress?: { completed: number; total: number };
    tone?: 'warm-proud' | 'minimal' | 'adventurous';
    addCopyPlanCta?: boolean;
  }
}
```

### Response

```ts
{
  data: {
    options: Array<{
      caption: string;     // 3 options
      hashtags: string[];
    }>
  }
}
```

Style rule: warm, proud, adventurous, **not** salesy. Include progress where supplied. Include a soft "คัดลอกแผน" invitation when `addCopyPlanCta = true`.

---

## AI-LEMON8-001 · Lemon8 Review Draft

Sub-mode of `AI-CAPTION-001` with `surface = 'lemon8'` and `format = 'full-review'`.

### Output structure (markdown)

```text
หัวข้อ:
งบประมาณ:
วิธีเดินทาง:
แพลนรายวัน:
สิ่งที่ควรเตรียม:
ข้อควรรู้:
เหมาะกับใคร:
สรุปความประทับใจ:
```

---

## AI-CHECKLIST-001 · Checklist Generator

Endpoint: `POST /api/ai/checklist`

### Request

```ts
{
  input: {
    parkCategory: 'mountain' | 'waterfall' | 'marine' | 'forest' | 'camping' | 'family';
    difficulty: 'easy' | 'medium' | 'hard';
    season: 'cool' | 'rainy' | 'hot';
    days: number;
  }
}
```

### Response

```ts
{
  data: {
    items: Array<{
      group: 'clothing' | 'gear' | 'food' | 'safety' | 'photo' | 'admin';
      label: string;
      required: boolean;
    }>
  }
}
```

---

## AI-RECO-001 · Mission Recommendation

Endpoint: `POST /api/ai/recommend`

### Request

```ts
{
  input: {
    completedMissionIds: string[];
    preferredRegion?: 'north' | 'central' | 'northeast' | 'east' | 'south';
    preferredDifficulty?: 'easy' | 'medium' | 'hard';
    travelMonth?: number;
    budgetThb?: number;
  }
}
```

### Response

```ts
{
  data: {
    recommendations: Array<{
      missionId: string;
      reason: string;
      preparation: string[];
      suggestedPlanSlug?: string;
    }>;     // length 3
  }
}
```

---

## AI-MOD-002 · Public memory moderation

When a user toggles `visibility = 'public'`, run the memory note + photo description through moderation. On block: revert to `private` and surface a non-shaming message.

---

## AI-CACHE-001 · Cache table

```sql
create table ai_cache (
  id uuid primary key default gen_random_uuid(),
  plugin text not null,
  input_hash text not null,           -- sha256 of normalized input json
  output jsonb not null,
  created_at timestamptz default now(),
  unique (plugin, input_hash)
);
```

TTL: 30 days. On cache miss, store output on success.

## AI-LOGGING-001

Log per call (PostHog):

```ts
{
  event: 'ai_plugin_call',
  plugin: 'planner' | 'memory' | 'caption' | 'checklist' | 'recommend',
  cached: boolean,
  durationMs: number,
  ok: boolean,
  errorCode?: string,
  creditsBefore: number,
  creditsAfter: number
}
```

No prompt / output bodies in logs (PII risk).

---

## Changelog
- 2026-05-26 · v2.0.0 · Promoted v1 `AI_FEATURES.md` to plugin-by-plugin endpoint contract + cost control + cache.
