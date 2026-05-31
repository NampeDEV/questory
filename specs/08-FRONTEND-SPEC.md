---
id: SPEC-08
title: Frontend Spec — Pages, Components, States
version: 2.0.0
status: active
requires: [SPEC-00-INDEX, SPEC-04, SPEC-05, SPEC-06, SPEC-07]
audience: [agent, engineer, designer]
owner: engineering
last_updated: 2026-05-26
---

# 08 — Frontend Spec

## FE-NAV · Navigation

### Marketing (desktop top nav)

```text
[Logo NPQ]   Boards · Quests · Plans · Memories · Shop      TH/EN   [Start Your Quest]
```

### Marketing (mobile)

Hamburger drawer → same items + sticky `Start Your Quest` CTA at bottom.

### App (bottom nav, 5 items)

```text
Home  |  Boards  |  Missions  |  Pins  |  Profile
```

Icons (lucide): `Home`, `LayoutGrid`, `Compass`, `Pin`, `User`. Active state: `gold-500` icon + label.

## FE-STATE · Shared enums

```ts
// src/types/mission.ts
export type MissionStatus =
  | 'locked'
  | 'available'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'need_more_info'
  | 'rejected'
  | 'completed';

// src/types/pin.ts
export type PinStatus =
  | 'locked'
  | 'unlocked'
  | 'claim_available'
  | 'claimed'
  | 'shipped'
  | 'delivered';

// src/types/order.ts
export type OrderStatus =
  | 'draft' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
```

Status-to-color map lives in `src/lib/utils/status-style.ts` and never inside components.

## FE-RESPONSIVE

| Breakpoint | Width | Behaviour |
|---|---|---|
| `sm` | ≥ 640 px | 2-col card grid where applicable |
| `md` | ≥ 768 px | Tablet — hero stacked or reduced height |
| `lg` | ≥ 1024 px | 3-col grid, side nav for app where relevant |
| `xl` | ≥ 1280 px | Max content width 1280 px |

App screens are mobile-first (390 px reference). All marketing pages must look acceptable from 360 px upward.

---

## Pages

### FE-PAGE-HOME · `/`

Sections, in order:

1. `SiteHeader`
2. `HeroSection`  (FE-COMP-HERO)
3. `FeaturedBoards` — 3 cards, carousel on mobile
4. `HowItWorks` — 4 steps (Buy → Activate → Travel → Collect)
5. `PopularPlans` — 4 cards
6. `MemoryWall` — 6–8 user memory tiles (mock content)
7. `ShopProducts` — board, pin set, gift box, sticker
8. `JoinQuestCTA` — gold CTA band
9. `SiteFooter`

#### FE-COMP-HERO

```ts
type HeroSectionProps = {
  headlineEn: string;     // default: "Turn Every Journey into an Achievement"
  headlineTh: string;     // default: "ออกเดินทาง เก็บภารกิจ สร้างความทรงจำ และสะสม Pin จากอุทยานไทย"
  primaryCta: { label: string; href: string };   // "Start Your Quest" → /activate
  secondaryCta: { label: string; href: string }; // "Explore Boards" → /boards
  bullets: string[];      // 4 items, right-side feature list
};
```

Layout: full-bleed image, dark gradient overlay (`forest-950 → transparent`), headline serif EN + sans TH. Right side feature bullets:

- `Quests in all 77 provinces`
- `Copy proven travel plans`
- `Collect pins and track achievements`
- `Your memories forever saved`

### FE-PAGE-BOARDS · `/boards`

- Filter chips: `All / Starter / Regional / Ultimate / Custom`
- 3-col grid of `BoardProductCard`
- Sticky "How boards work" explainer below grid.

### FE-PAGE-BOARD-DETAIL · `/boards/[slug]`

Sections:
1. Hero with board photo + price + CTA ("Add to cart").
2. Tabs: `Overview · Missions · Rewards · What's in the box`
3. Mission grid (uses `MissionCard`).
4. Reward pins gallery (uses `BadgePinCard` locked state).
5. FAQ accordion.
6. Related boards.

### FE-PAGE-QUESTS · `/quests`

Catalogue of quest packs (same data as boards, marketing-framed). 3-col grid. Filter by region / difficulty.

### FE-PAGE-QUEST-DETAIL · `/quests/[slug]`

Same data as board detail; emphasis on missions and rewards. Bottom CTA: `ดูบอร์ดยอดนิยม` → `/boards`.

### FE-PAGE-PLANS · `/plans`

Plan marketplace.

Filters: duration, budget, difficulty, region.
Sort: most-copied, newest.

### FE-PAGE-PLAN-DETAIL · `/plans/[slug]`

Sections:
1. Hero image + title + duration / budget / difficulty pills.
2. Creator card (avatar, name, "copied by X people").
3. Day-by-day itinerary (timeline).
4. Map preview (Mapbox static image first; interactive later).
5. Checklist.
6. CTA: `คัดลอกแผน` (Copy Plan). Auth-gated.

### FE-PAGE-MEMORY-WALL · `/memories` (flag-gated)

Public memories only (`visibility = 'public'`). Masonry grid. Click → memory detail dialog.

### FE-PAGE-SHOP · `/shop`

Sections by product type: Board, Pin Set, Gift Box, Sticker, Passport.

### FE-PAGE-PRODUCT-DETAIL · `/shop/[slug]`

Image gallery, description, price, add to cart, "What's included".

### FE-PAGE-CHECKOUT · `/checkout`

POC: mock checkout (form: name, email, phone, address, quantity). On submit → success page + log to PostHog. No payment integration.

### FE-PAGE-ACTIVATE · `/activate`

Form with one field: `Activation Code`. On submit, calls `POST /api/activate-board`. Success → `/app/boards/[id]`.

---

### FE-PAGE-DASHBOARD · `/app`

Sections:
1. `DashboardGreeting` — "สวัสดี Chayachai" + day greeting.
2. Active `ProgressCard` for current board (`3 / 10 Parks`).
3. Quick actions: 4 buttons — `เริ่มภารกิจ`, `ดูภารกิจถัดไป`, `Claim Pin`, `บันทึกความทรงจำ`.
4. Next mission card.
5. Recent memories carousel (3 items).
6. AI Planner entry (flag-gated).
7. Featured board promo (cross-sell).

### FE-PAGE-MY-BOARDS · `/app/boards`

Grid of user-activated boards (`UserBoard` + template).

### FE-PAGE-MY-BOARD-DETAIL · `/app/boards/[id]`

Same shape as board detail but mission grid reflects each mission's per-user status.

### FE-PAGE-MISSION-DETAIL · `/app/missions/[id]`

- Cover image
- Park name, region, category, difficulty pills
- Description
- Reward pin preview
- CTA: `ส่งหลักฐาน` → `/app/submit/[missionId]` (only when status `available` or `need_more_info`)

### FE-PAGE-SUBMIT · `/app/submit/[missionId]`

Form (uses `SubmitProofForm` — see FE-COMP-SUBMIT). On success → toast + redirect to mission detail with `submitted` state.

### FE-PAGE-PINS · `/app/pins`

Sections:
1. Stats row: Total / Common / Rare / Epic / Legendary.
2. Filter row: category pills + rarity dropdown.
3. Latest unlocked spotlight.
4. Grid of all pins (locked + unlocked). Locked → silhouette + lock icon.
5. Latest claim status banner.

### FE-PAGE-MY-MEMORIES · `/app/memories`

Tabs: `Timeline / Grid`. Filter by mission or year.

### FE-PAGE-PROFILE · `/app/profile`

- Explorer level (derived from completed missions).
- Stats: parks, memories, pins.
- Public share link (toggle).
- Account settings link.

### FE-PAGE-AI-PLANNER · `/app/ai-planner` (flag-gated)

Chat panel: structured form on left (start, destination, days, budget, style, people), result on right. See `09-AI-FEATURES.md`.

---

### Admin

### FE-PAGE-ADMIN-DASH · `/admin`

KPIs: pending submissions, pin claims to ship, new signups.

### FE-PAGE-ADMIN-SUBMISSIONS · `/admin/submissions`

Table with photo thumbnail, user, mission, park, location, submitted at, action drawer (approve / reject / request-info).

### FE-PAGE-ADMIN-PIN-CLAIMS · `/admin/pin-claims`

Table with claim, shipping address, status. Action: mark shipped + tracking number.

---

## Components — Domain cards

### FE-COMP-BOARD-PRODUCT-CARD

```ts
type BoardProductCardProps = {
  title: string;
  subtitle: string;
  imageUrl: string;
  questCount: number;
  priceThb: number;
  badge?: 'BEST_START' | 'POPULAR' | 'ULTIMATE' | 'LIMITED';
  href: string;
  ctaLabel?: string;       // default: "ดูรายละเอียด"
};
```

Visual: large image top, parchment body, gold ribbon badge top-right when set.

### FE-COMP-QUEST-CARD

```ts
type QuestCardProps = {
  title: string;
  imageUrl: string;
  durationDays: number;
  budgetMinThb: number;
  budgetMaxThb: number;
  difficulty: 'easy' | 'medium' | 'hard';
  copiedCount: number;
  href: string;
};
```

Pills: duration, budget, difficulty. Bottom: `คัดลอกแผน · 1,234 ครั้ง`.

### FE-COMP-PROGRESS-CARD

```ts
type ProgressCardProps = {
  title: string;
  completed: number;
  total: number;
  label?: string;      // default "Parks"
  href?: string;       // tap to view detail
};
```

### FE-COMP-BADGE-PIN-CARD

```ts
type BadgePinCardProps = {
  name: string;
  imageUrl: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  status: 'locked' | 'unlocked' | 'claim_available' | 'claimed' | 'shipped' | 'delivered';
  parkCategory?: 'mountain' | 'waterfall' | 'marine' | 'forest';
};
```

Locked: silhouette + 🔒. Unlocked: full art + rarity rim. Claim available: gold `Claim` chip.

### FE-COMP-MEMORY-CARD

```ts
type MemoryCardProps = {
  title: string;
  imageUrl: string;
  locationName: string;
  travelDate: string;
  note: string;
  badgeName?: string;
};
```

### FE-COMP-SHARE-CARD

Renders a portrait social card (1080×1350) on the server using `@vercel/og`. Inputs: user display name, mission name, park image, badge image, progress `n / total`, brand mark. Saves to Supabase Storage and returns URL.

### FE-COMP-SUBMIT · SubmitProofForm

Fields (Zod schema):

```ts
{
  photo: File,                  // required, ≤5 MB, jpg/png
  latitude: number,             // required
  longitude: number,            // required
  travelDate: string,           // ISO date, required, ≤ today
  memoryNote: string,           // optional, ≤ 2000
  sharePermission: boolean,     // default false
  safetyAcknowledged: boolean   // must be true
}
```

UI states: `idle`, `validating`, `submitting`, `success`, `error`. Camera-friendly on mobile (capture="environment"). Mandatory safety banner above submit button (RULE-007).

### FE-COMP-PIN-COLLECTION-GRID

Props: `pins: Array<PinWithStatus>`, `filterCategory?`, `filterRarity?`.

Empty state: locked silhouettes with hint "ส่งหลักฐานเพื่อปลดล็อก Pin แรกของคุณ".

### FE-COMP-AI-PLANNER-PANEL

Two-column on desktop, stacked on mobile. Left = form (Zod-validated), right = streaming result. See `09-AI-FEATURES.md` § AI-PLANNER-001.

---

## FE-COMMERCE · Mock checkout / preorder

For POC, `/checkout` is an interest form:

- Name, email, phone, province
- Product selection (Starter / Regional / Ultimate / Gift)
- Quantity
- Comment

On submit:
1. POST to `/api/checkout-interest` (mock, stores in `interest_signups` table).
2. PostHog event `checkout_interest_submitted` with product slug + price band.
3. Success page with social share.

---

## FE-SEO

- Per-route `metadata` factory in `src/config/seo.ts`.
- OG image: per-page generated via `opengraph-image.tsx`.
- Sitemap: `src/app/sitemap.ts` covers all public routes.
- Robots: allow all except `/app/*`, `/admin/*`.

## FE-ANALYTICS

| Event | Trigger | Properties |
|---|---|---|
| `landing_view` | Page mount | `referrer`, `utm_*` |
| `start_quest_click` | Hero CTA | `cta_position` |
| `board_view` | Board detail mount | `slug` |
| `add_to_cart` | (POC: preorder click) | `slug, price` |
| `activate_success` | Code accepted | `boardTemplateId` |
| `mission_submit` | Submission posted | `missionId, parkCode` |
| `badge_unlock` | Approval delivered | `badgeId, rarity` |
| `pin_claim_open` | Claim form open | `pinId, rarity` |
| `pin_claim_submit` | Claim form submitted | `pinId, shipping_fee` |
| `share_card_export` | Share image downloaded | `surface: tiktok | ig | facebook | lemon8` |
| `plan_copy` | Plan copied | `planId, source: marketing | app` |

## FE-ERRORS

- All async actions show toast + retry option.
- 404: `not-found.tsx` with explorer character illustration + CTA to home.
- 500: `global-error.tsx` with Sentry button.

---

## Changelog
- 2026-05-26 · v2.0.0 · Merged v1 `FRONTEND_SCOPE.md` page table with explicit per-page section lists, expanded component props, analytics events, share card spec.
