# Project Overview — Questory

> **Updated**: 2026-05-30  
> **Status**: POC complete — all 111 tasks done · Ready to wire Supabase + deploy

---

## 1. Product in One Sentence

> เปลี่ยนการท่องเที่ยวอุทยานแห่งชาติไทยให้กลายเป็น Mission System สะสมได้  
> ซื้อ Board → สแกน QR → ทำ Mission → ปลดล็อก Badge → รับ Enamel Pin → แชร์ความสำเร็จ

**ไม่ใช่**: travel booking, OTA, social feed, หรือ generic gamified app  
**คือ**: Mission + Memory + Collectible Achievement

---

## 2. Core Loop

```
Buy Board → Activate via QR
  → Travel & Complete Mission
    → Submit Photo + Location + Memory
      → Admin Verifies → Unlock Digital Badge
        → Claim Physical Pin
          → Share → Invite / Copy Plan / Buy next Board
```

---

## 3. Current State (POC)

| Layer | Status | หมายเหตุ |
|---|---|---|
| Frontend — Marketing | ✅ Done | `/` `/boards` `/plans` `/quests` `/memories` `/shop` `/checkout` `/activate` |
| Frontend — App (User) | ✅ Done | `/app` `/app/boards` `/app/missions` `/app/submit` `/app/pins` `/app/memories` `/app/profile` `/app/ai-planner` |
| Frontend — Admin | ✅ Done | 25 admin pages ครบ |
| API Routes (Public) | ✅ Done | boards, quests, plans, products |
| API Routes (Auth) | ✅ Done | me, activate-board, missions/submit, pins/claim, orders, memories |
| API Routes (AI) | ✅ Done | trip-planner, memory-writer, caption, checklist, recommend |
| API Routes (Admin) | ✅ Done | stats, submissions, orders, users, analytics |
| UI Components | ✅ Done | ProgressCard, BadgePinCard, MemoryCard, QuestCard, AdminDataTable, ฯลฯ |
| Design System | ✅ Done | Tokens, Tailwind config, DS-COLOR, DS-TYPE, DS-COMP |
| Security Audit | ✅ Done | OWASP Top 10, JWT, RLS, rate-limit, upload validation |
| Unit Tests | ✅ Done | response, auth, storage, AI helpers, UI components |
| E2E Tests | ✅ Done | homepage, boards, checkout, activate, admin-guard, quest-loop, admin-submissions, acceptance |
| **Data** | ✅ Wired | env-guarded facades — Supabase when URL set, mock fallback |
| **Auth** | ✅ Wired | sign-in · sign-up · callback · /app/* guard |
| **AI** | ⚠️ Mock only | route handlers พร้อม แต่ยังไม่มี API key |
| **Env vars** | ⚠️ ไม่มี `.env.local` | ดู Section 6 |

---

## 4. Architecture

```
Browser
  └── Next.js 15 App Router (Vercel)
        ├── (marketing)/   — Public pages, SSG/ISR
        ├── (app)/         — Auth-gated user app, client components
        ├── (admin)/       — Admin-only, server-side guard
        └── api/           — Route Handlers
              ├── /boards, /quests, /plans, /products  (public)
              ├── /me/*, /activate-board, /missions/*/submit
              │    /pins/*/claim, /orders, /me/memories  (JWT required)
              ├── /ai/*    (JWT + credit ledger + moderation)
              └── /admin/* (JWT + role=admin)

Supabase
  ├── Postgres (RLS on every table)
  ├── Auth (email + Google)
  └── Storage (mission-photos, avatars, pin-images)

AI Provider (env: AI_PROVIDER=openai|azure)
  └── src/lib/ai/provider.ts → credits → moderation → cache (ai_cache table)
```

---

## 5. All Pages

### Marketing (Public)

| Route | Page |
|---|---|
| `/` | Homepage — Hero, HowItWorks, FeaturedBoards, MemoryWall, CTA |
| `/boards` | Board listing + category filter |
| `/boards/[slug]` | Board detail — Missions / Rewards tabs, add-to-cart |
| `/quests` | Quest listing |
| `/quests/[slug]` | Quest detail |
| `/plans` | Travel plan listing + filter |
| `/plans/[slug]` | Day-by-day itinerary, copy plan CTA |
| `/memories` | Public memory wall |
| `/shop` | Product listing |
| `/shop/[slug]` | Product detail |
| `/checkout` | Interest capture form (pre-payment POC) |
| `/activate` | Board activation code form |

### App (User, Auth Required)

| Route | Page |
|---|---|
| `/app` | Dashboard — greeting, progress, quick actions, next mission |
| `/app/boards` | User's active boards |
| `/app/boards/[id]` | Board detail + mission list |
| `/app/missions` | All missions with status pills |
| `/app/missions/[id]` | Mission detail |
| `/app/submit/[missionId]` | Submit proof — photo, date, safety banner |
| `/app/pins` | Pin/badge collection grid |
| `/app/memories` | Personal memory list |
| `/app/profile` | User profile |
| `/app/ai-planner` | AI Trip Planner (feature-flag gated) |
| `/auth/sign-in` | Email / Google sign-in |
| `/auth/sign-up` | Sign-up |

### Admin (role=admin Required)

| Route | Page |
|---|---|
| `/admin` | Dashboard — KPI cards, weekly chart, pending reviews |
| `/admin/submissions` | ตรวจหลักฐาน — photo viewer + approve/reject drawer |
| `/admin/pin-claims` | Claim Pin queue — mark shipped + tracking number |
| `/admin/shipping` | Shipping queue |
| `/admin/orders` | คำสั่งซื้อ |
| `/admin/products` | สินค้า |
| `/admin/bundles` | Bundle / Gift Set |
| `/admin/coupons` | คูปอง |
| `/admin/boards` | Mission Boards CRUD |
| `/admin/quests` | Quests + activate toggle |
| `/admin/missions` | Mission CRUD |
| `/admin/plans` | Travel Plans review |
| `/admin/parks` | Parks database |
| `/admin/badges` | Badge / Pin inventory |
| `/admin/qr-activation` | QR code management |
| `/admin/users` | ผู้ใช้งาน |
| `/admin/analytics` | Revenue + quest stats |
| `/admin/notifications` | การแจ้งเตือน |
| `/admin/settings` | Feature flags, site config |
| `/admin/ai-settings` | AI model config, prompts |
| + 6 more | content-review, cms, roles, audit-log, reports, support |

---

## 6. Environment Setup (⚠️ Required Before Running)

ไฟล์ `.env.example` อยู่ที่ **root ของ monorepo** (ไม่ใช่ใน `apps/web/`)

```bash
# Copy env file (correct path)
cp .env.example apps/web/.env.local
```

จากนั้นเปิด `apps/web/.env.local` และกรอก:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (ต้องสร้าง project ที่ supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # Admin-only operations

# Mapbox (optional — maps on mission detail)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...

# AI Provider (optional — for AI features)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Feature Flags
NEXT_PUBLIC_AI_PLANNER_ENABLED=false
```

---

## 7. Solutions ที่ควรทำต่อ

### 🔴 P0 — Unblock Development (ทำก่อน)

| # | งาน | เหตุผล |
|---|---|---|
| **S-001** | สร้าง Supabase project + รัน `docs/schema.sql` | ไม่มี DB = ทุก API route ใช้ mock data เท่านั้น |
| **S-002** | Copy `.env.example` → `apps/web/.env.local` แล้วกรอก keys | Dev server ยังทำงานได้แต่ API จะ fallback mock |
| **S-003** | รัน E2E tests (`pnpm test:e2e`) เพื่อยืนยัน AC ทั้งหมดผ่าน | Tests เขียนแล้วแต่ยังไม่ได้รัน |

### 🟠 P1 — Wire Real Backend (M3 Milestone)

| # | งาน | ไฟล์ที่เกี่ยวข้อง |
|---|---|---|
| **S-010** | Replace mock data ใน API routes ด้วย Supabase queries จริง | `src/lib/supabase/server.ts` พร้อมแล้ว |
| **S-011** | Wire Supabase Auth — sign-in/sign-up flow จริง | `src/app/auth/` pages พร้อมแล้ว |
| **S-012** | เพิ่ม `SUPABASE_SERVICE_ROLE_KEY` ใน env แล้ว enable admin routes จริง | `src/lib/api/auth.ts` → `requireAdmin()` |
| **S-013** | ต่อ `src/middleware.ts` กับ Supabase session refresh | `docs/middleware-auth.md` เป็น guide |
| **S-014** | Upload จริงผ่าน Supabase Storage | `src/lib/api/storage.ts` → `uploadMissionPhoto()` |

### 🟡 P2 — Wire AI Features (M5 Milestone)

| # | งาน | หมายเหตุ |
|---|---|---|
| **S-020** | เพิ่ม `AI_PROVIDER=openai` + `OPENAI_API_KEY` ใน env | Provider abstraction พร้อมที่ `src/lib/ai/provider.ts` |
| **S-021** | เปิด `NEXT_PUBLIC_AI_PLANNER_ENABLED=true` | Feature-flag ใน `/app/ai-planner/page.tsx` |
| **S-022** | สร้าง `ai_cache` table ใน Supabase ตาม schema.sql | Cache layer พร้อมที่ `src/lib/ai/cache.ts` |
| **S-023** | ต่อ credit ledger กับ `users` table | `src/lib/ai/credits.ts` พร้อมแล้ว |

### 🟡 P2 — Commerce (M4 Milestone)

| # | งาน | หมายเหตุ |
|---|---|---|
| **S-030** | เพิ่ม payment gateway (PromptPay / Omise / Stripe TH) | `/checkout` ปัจจุบันเป็น interest-capture form เท่านั้น |
| **S-031** | Wire `/api/orders` กับ `orders` + `activation_codes` tables จริง | Route handler พร้อมแล้ว |
| **S-032** | Email notification เมื่อ order สำเร็จ + ส่ง activation code | ต้องเพิ่ม email provider (Resend / SendGrid) |

### 🔵 P3 — Production Readiness

| # | งาน | หมายเหตุ |
|---|---|---|
| **S-040** | Deploy to Vercel — เพิ่ม env vars ใน Vercel dashboard | `vercel.json` ยังไม่มี |
| **S-041** | Lighthouse audit — Performance ≥ 90, Accessibility ≥ 95 (AC-LANDING-008) | รัน `npx lighthouse` หลัง deploy |
| **S-042** | สร้าง Storybook stories ที่ยังขาด — ProgressCard, MemoryCard, QuestCard | `.storybook/` setup พร้อมแล้ว |
| **S-043** | PostHog integration จริง — `landing_view`, `start_quest_click`, `board_view` | `src/lib/utils/analytics.ts` stub พร้อมแล้ว |
| **S-044** | PWA manifest + offline page (AC-APP-010) | `public/manifest.json` มีแล้ว ต้อง test install |
| **S-045** | OG image endpoints — `/api/og/share/:submissionId` (AC-APP-008b) | `src/app/og-boards/`, `og-plans/` มีแล้ว |

---

## 8. Known Issues / Bugs

| ID | ปัญหา | วิธีแก้ |
|---|---|---|
| **BUG-001** | `cp apps/web/.env.example` ใน README ผิด path — ไฟล์อยู่ที่ root | ใช้ `cp .env.example apps/web/.env.local` |
| **BUG-002** | `[planId]` folder ถูกลบแล้ว → `plans/[slug]/copy` ทำงานได้แล้ว | ✅ Fixed |
| **BUG-003** | E2E tests ยังไม่ได้รัน — อาจมี selector ที่ต้อง adjust | รัน `pnpm test:e2e` แล้ว fine-tune |
| **BUG-004** | `supabase/client.ts` สร้าง client ที่ module load → SSG crash เมื่อไม่มี env vars | ✅ Fixed — lazy Proxy singleton |
| **BUG-005** | `useSearchParams()` ใน `/auth/sign-in` ไม่มี Suspense boundary → build fail | ✅ Fixed — extract `SignInForm` + `<Suspense>` |

---

## 9. Test Commands

```bash
# Unit tests
pnpm test

# E2E tests (ต้องรัน dev server ก่อน หรือ playwright จะ spin up เอง)
pnpm test:e2e

# Typecheck
pnpm typecheck

# Lint
pnpm lint

# Build (ต้องผ่าน 0 errors)
pnpm build
```

---

## 10. Milestone Progress

| Milestone | Description | Status |
|---|---|---|
| **M0** | Foundation (install, lint, build clean) | ✅ Done |
| **M1** | Design System (tokens, components, Storybook) | ✅ Done |
| **M2** | Public Marketing Site (pages, SEO, OG) | ✅ Done |
| **M3** | App MVP (auth, missions, submit proof) | ✅ Done — Supabase auth + facades + submit wired |
| **M4** | Admin + Fulfilment (submissions, orders, pin claims) | ✅ Done — admin routes + orders + pin-claim wired to Supabase |
| **M5** | AI Features (planner, writer, caption) | ⚠️ POC done — ต้อง OpenAI API key |
| **M6** | Production Deploy | ❌ Not started |

---

## 11. Repo Quick Reference

```
specs/          ← Source of truth — อ่านก่อนแก้ code ทุกครั้ง
docs/           ← Architecture, schema.sql, ADRs
apps/web/src/
  app/          ← Next.js pages & API routes
  components/   ← Reusable UI
  data/         ← Mock data (POC)
  lib/          ← Supabase, AI, API helpers, hooks
  types/        ← TypeScript types
apps/web/tests/
  unit/         ← Vitest
  e2e/          ← Playwright
packages/types/ ← @questory/types (shared across monorepo)
```
