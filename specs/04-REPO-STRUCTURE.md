---
id: SPEC-04
title: Repository & Folder Structure
version: 2.0.0
status: active
requires: [SPEC-00-INDEX, SPEC-02, SPEC-03]
audience: [agent, engineer]
owner: engineering
last_updated: 2026-05-26
---

# 04 — Repo Structure

> Materialize this tree **exactly**. Do not rename folders. Do not add top-level folders without registering them here.

## FS-001 · Top-level layout

```text
national-park-quest/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                       # lint + typecheck + test + build
│   │   └── preview.yml                  # Vercel preview deploy
│   └── PULL_REQUEST_TEMPLATE.md
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── .vscode/
│   └── settings.json
├── docs/                                # Human docs (architecture, ADRs)
│   ├── adr/
│   │   ├── 0001-app-router.md
│   │   └── 0002-supabase-baas.md
│   └── architecture.md
├── public/
│   ├── images/
│   │   ├── boards/
│   │   ├── pins/
│   │   ├── parks/
│   │   └── hero/
│   ├── icons/
│   ├── fonts/
│   └── favicon.svg
├── specs/                               # ← This pack. Read-only for agents.
│   ├── README.md
│   ├── 00-INDEX.md
│   └── … (rest)
├── src/                                 # ← All app code lives here.
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── data/
│   ├── lib/
│   ├── styles/
│   └── types/
├── tests/
│   ├── e2e/                             # Playwright
│   └── unit/                            # Vitest
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## FS-002 · `src/app/` — App Router

```text
src/app/
├── (marketing)/                         # Route group: public website
│   ├── layout.tsx                       # SiteHeader + SiteFooter
│   ├── page.tsx                         # FE-PAGE-HOME
│   ├── boards/
│   │   ├── page.tsx                     # FE-PAGE-BOARDS
│   │   └── [slug]/
│   │       └── page.tsx                 # FE-PAGE-BOARD-DETAIL
│   ├── quests/
│   │   ├── page.tsx                     # FE-PAGE-QUESTS
│   │   └── [slug]/
│   │       └── page.tsx                 # FE-PAGE-QUEST-DETAIL
│   ├── plans/
│   │   ├── page.tsx                     # FE-PAGE-PLANS
│   │   └── [slug]/
│   │       └── page.tsx                 # FE-PAGE-PLAN-DETAIL
│   ├── memories/
│   │   └── page.tsx                     # FE-PAGE-MEMORY-WALL
│   ├── shop/
│   │   ├── page.tsx                     # FE-PAGE-SHOP
│   │   └── [slug]/
│   │       └── page.tsx                 # FE-PAGE-PRODUCT-DETAIL
│   ├── checkout/
│   │   └── page.tsx                     # FE-PAGE-CHECKOUT (mock)
│   └── activate/
│       └── page.tsx                     # FE-PAGE-ACTIVATE
│
├── (app)/                               # Route group: authenticated PWA
│   ├── layout.tsx                       # AppShell + BottomNav
│   ├── app/
│   │   ├── page.tsx                     # FE-PAGE-DASHBOARD
│   │   ├── boards/
│   │   │   ├── page.tsx                 # FE-PAGE-MY-BOARDS
│   │   │   └── [id]/
│   │   │       └── page.tsx             # FE-PAGE-MY-BOARD-DETAIL
│   │   ├── missions/
│   │   │   └── [id]/
│   │   │       └── page.tsx             # FE-PAGE-MISSION-DETAIL
│   │   ├── submit/
│   │   │   └── [missionId]/
│   │   │       └── page.tsx             # FE-PAGE-SUBMIT
│   │   ├── pins/
│   │   │   └── page.tsx                 # FE-PAGE-PINS
│   │   ├── memories/
│   │   │   └── page.tsx                 # FE-PAGE-MY-MEMORIES
│   │   ├── profile/
│   │   │   └── page.tsx                 # FE-PAGE-PROFILE
│   │   └── ai-planner/
│   │       └── page.tsx                 # FE-PAGE-AI-PLANNER (flag-gated)
│   └── auth/
│       ├── sign-in/page.tsx
│       └── sign-up/page.tsx
│
├── (admin)/                             # Route group: admin review console
│   ├── layout.tsx                       # AdminShell
│   └── admin/
│       ├── page.tsx                     # FE-PAGE-ADMIN-DASH
│       ├── submissions/page.tsx         # FE-PAGE-ADMIN-SUBMISSIONS
│       └── pin-claims/page.tsx          # FE-PAGE-ADMIN-PIN-CLAIMS
│
├── api/                                 # Route handlers (server-only)
│   ├── boards/route.ts                  # API-BOARDS-GET
│   ├── boards/[slug]/route.ts
│   ├── quests/route.ts
│   ├── plans/route.ts
│   ├── products/route.ts
│   ├── me/
│   │   ├── route.ts
│   │   ├── boards/route.ts
│   │   ├── missions/route.ts
│   │   ├── pins/route.ts
│   │   └── memories/route.ts
│   ├── activate-board/route.ts
│   ├── missions/[id]/submit/route.ts
│   ├── pins/[id]/claim/route.ts
│   ├── plans/[id]/copy/route.ts
│   ├── ai/
│   │   ├── planner/route.ts             # AI-PLANNER-001
│   │   ├── memory/route.ts              # AI-MEMORY-001
│   │   ├── caption/route.ts             # AI-CAPTION-001
│   │   ├── checklist/route.ts           # AI-CHECKLIST-001
│   │   └── recommend/route.ts           # AI-RECO-001
│   └── admin/
│       ├── submissions/route.ts
│       ├── submissions/[id]/approve/route.ts
│       ├── submissions/[id]/reject/route.ts
│       ├── submissions/[id]/request-info/route.ts
│       └── pin-claims/[id]/ship/route.ts
│
├── opengraph-image.tsx                  # Default OG image
├── robots.ts
├── sitemap.ts
├── not-found.tsx
└── global-error.tsx
```

## FS-003 · `src/components/`

```text
src/components/
├── ui/                                  # Primitives (Button, Input, Dialog, Tabs…)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Select.tsx
│   ├── Dialog.tsx
│   ├── Tabs.tsx
│   ├── Tooltip.tsx
│   ├── Badge.tsx
│   ├── ProgressBar.tsx
│   ├── Skeleton.tsx
│   └── index.ts
│
├── layout/                              # Shells
│   ├── SiteHeader.tsx
│   ├── SiteFooter.tsx
│   ├── AppShell.tsx
│   ├── BottomNav.tsx
│   ├── AdminShell.tsx
│   └── Container.tsx
│
├── marketing/                           # Landing-only sections
│   ├── HeroSection.tsx
│   ├── FeaturedBoards.tsx
│   ├── HowItWorks.tsx
│   ├── PopularPlans.tsx
│   ├── MemoryWall.tsx
│   ├── ShopProducts.tsx
│   └── JoinQuestCTA.tsx
│
├── cards/                               # Domain cards
│   ├── BoardProductCard.tsx
│   ├── QuestCard.tsx
│   ├── PlanCard.tsx
│   ├── MissionCard.tsx
│   ├── BadgePinCard.tsx
│   ├── MemoryCard.tsx
│   ├── ProgressCard.tsx
│   └── ShareCard.tsx
│
├── app/                                 # App-area specific
│   ├── MissionList.tsx
│   ├── MissionStatusPill.tsx
│   ├── SubmitProofForm.tsx
│   ├── PinCollectionGrid.tsx
│   ├── PinClaimForm.tsx
│   ├── ActivateBoardForm.tsx
│   ├── DashboardGreeting.tsx
│   └── AIPlannerPanel.tsx
│
├── admin/
│   ├── SubmissionRow.tsx
│   ├── SubmissionReviewDrawer.tsx
│   └── PinClaimRow.tsx
│
└── icons/                               # Wrapped lucide / custom SVGs
    ├── Mountain.tsx
    ├── Waterfall.tsx
    ├── Marine.tsx
    ├── Forest.tsx
    └── index.ts
```

## FS-004 · `src/data/` — Typed mock data

```text
src/data/
├── boards.ts                            # board_templates fixtures
├── missions.ts                          # mission fixtures
├── plans.ts                             # plan + plan_items fixtures
├── products.ts                          # products fixtures
├── badges.ts
├── pins.ts
├── memories.ts
├── parks.ts                             # Static park reference data
└── index.ts                             # Re-export
```

All data files export typed arrays whose element type lives in `src/types/`.

## FS-005 · `src/lib/`

```text
src/lib/
├── api/                                 # Data access facade — mock ↔ real swap
│   ├── client.ts                        # fetch wrapper
│   ├── boards.ts
│   ├── quests.ts
│   ├── plans.ts
│   ├── products.ts
│   ├── me.ts
│   ├── submissions.ts
│   ├── pins.ts
│   ├── ai.ts
│   └── admin.ts
├── auth/
│   ├── supabase-client.ts
│   ├── supabase-server.ts
│   └── session.ts
├── hooks/
│   ├── useUserBoard.ts
│   ├── useMissionStatus.ts
│   ├── usePinClaim.ts
│   ├── useShareCard.ts
│   └── useFeatureFlag.ts
├── ai/                                  # AI plugin orchestration
│   ├── planner.ts
│   ├── memory.ts
│   ├── caption.ts
│   ├── checklist.ts
│   ├── recommend.ts
│   ├── moderation.ts
│   └── prompts/                         # Prompt templates
│       ├── planner.md
│       ├── memory.md
│       └── caption.md
├── utils/
│   ├── cn.ts                            # clsx + tailwind-merge
│   ├── format-thb.ts
│   ├── format-date.ts
│   ├── slugify.ts
│   ├── distance.ts                      # haversine
│   └── share-card.ts                    # OG image generator
└── validation/                          # Zod schemas
    ├── submission.ts
    ├── pin-claim.ts
    ├── activate.ts
    └── ai-planner.ts
```

## FS-006 · `src/types/`

```text
src/types/
├── board.ts
├── quest.ts
├── mission.ts
├── plan.ts
├── product.ts
├── badge.ts
├── pin.ts
├── memory.ts
├── order.ts
├── user.ts
├── api.ts                               # Request/response envelopes
└── index.ts
```

## FS-007 · `src/config/`

```text
src/config/
├── site.ts                              # site name, social, default OG
├── nav.ts                               # marketing + app nav definitions
├── flags.ts                             # feature flag accessors
└── seo.ts                               # default metadata factory
```

## FS-008 · `src/styles/`

```text
src/styles/
├── tokens.ts                            # Re-exports tokens for Tailwind
├── globals.css                          # Tailwind base + font-face
└── fonts.ts                             # next/font definitions
```

## FS-009 · `tests/`

```text
tests/
├── e2e/
│   ├── landing.spec.ts                  # AC-LANDING-001..010
│   ├── activate-flow.spec.ts            # AC-APP-001
│   ├── submit-proof.spec.ts             # AC-APP-005
│   └── pin-claim.spec.ts                # AC-APP-008
├── unit/
│   ├── lib/utils/format-thb.test.ts
│   ├── lib/validation/submission.test.ts
│   └── components/BoardProductCard.test.tsx
└── fixtures/
    └── images/
```

## FS-010 · Files outside `src/` an agent must create

| Path | Purpose |
|---|---|
| `.env.example` | All required env vars (STACK-007) |
| `next.config.mjs` | Image domains, headers, redirects |
| `postcss.config.js` | Tailwind + autoprefixer |
| `tailwind.config.ts` | Theme bound to `src/styles/tokens.ts` |
| `tsconfig.json` | Per STACK-005 |
| `.eslintrc.json` | Per STACK-003 |
| `.prettierrc` | `{ "singleQuote": true, "trailingComma": "all" }` |
| `docs/architecture.md` | High-level diagram |
| `docs/adr/0001-app-router.md` | Why App Router |
| `docs/adr/0002-supabase-baas.md` | Why Supabase |

## FS-011 · Image directory contract

```text
public/images/
├── boards/<slug>.webp                   # 1200×800 hero, ≤200 kB
├── parks/<park-code>.webp               # 800×600, ≤120 kB
├── pins/<pin-sku>.webp                  # 512×512 transparent
├── hero/landing-hero.webp               # 2400×1400, ≤320 kB
└── og/<route-key>.png                   # 1200×630
```

Image SKUs are owned by `src/data/*` — never hardcode a path inside a component.

---

## Changelog
- 2026-05-26 · v2.0.0 · New file — formalised v1's "Suggested Folder Structure" with route groups, API handlers, admin shell, tests, and ADR folders.
