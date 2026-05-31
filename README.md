<div align="center">

# ⬡ Questory

### เปลี่ยนการท่องเที่ยวอุทยานแห่งชาติไทยให้กลายเป็น Mission System สะสมได้

**ซื้อ Board → สแกน QR → ทำ Mission → ปลดล็อก Badge → รับ Enamel Pin → แชร์ความสำเร็จ**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ECF8E?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

</div>

---

## ✨ What is Questory?

Questory คือ **premium gamified adventure platform** สำหรับอุทยานแห่งชาติไทย
ผู้ใช้ซื้อ *Mission Board* (กระดาษ/กล่อง) → สแกน QR → เดินทางไปทำ Mission จริง → ส่งรูปภาพเป็นหลักฐาน → รับ Digital Badge และ Physical Enamel Pin สะสมได้

> **ไม่ใช่**: travel booking, OTA, social feed, หรือ generic gamified app
> **คือ**: Mission + Memory + Collectible Achievement

---

## 🔄 Core Loop

```
🛒 Buy Board
    └─▶ 📲 Activate via QR Code
              └─▶ 🥾 Travel & Complete Mission
                        └─▶ 📸 Submit Photo + Location + Memory
                                  └─▶ ✅ Admin Verifies
                                            └─▶ 🏅 Unlock Digital Badge
                                                      └─▶ 📦 Claim Physical Enamel Pin
                                                                └─▶ 🔗 Share → Invite / Buy Next Board
```

---

## 🗂 Project Status

| Layer | Status | หมายเหตุ |
|---|:---:|---|
| Frontend — Marketing | ✅ Done | `/` `/boards` `/plans` `/quests` `/memories` `/shop` `/checkout` `/activate` |
| Frontend — App (User) | ✅ Done | `/app` dashboard, missions, submit, pins, memories, ai-planner |
| Frontend — Admin | ✅ Done | 25+ admin pages ครบ |
| API Routes | ✅ Done | public, auth-gated, AI, admin |
| Design System | ✅ Done | Tokens, Tailwind config, components |
| Security Audit | ✅ Done | OWASP Top 10, JWT, RLS, rate-limit, upload validation |
| Unit Tests (Vitest) | ✅ Done | response, auth, storage, AI helpers, UI components |
| E2E Tests (Playwright) | ✅ Done | homepage, boards, checkout, quest-loop, admin-guard |
| Supabase Integration | ⚠️ Env-gated | URL set → real DB, fallback → mock data |
| AI Features | ⚠️ Mock only | Route handlers พร้อม ยังไม่มี API key |

---

## 🏗 Architecture

```
Browser
  └── Next.js 15 App Router (Vercel)
        ├── (marketing)/   — Public pages, SSG/ISR
        ├── (app)/         — Auth-gated user app, client components
        ├── (admin)/       — Admin-only, server-side role guard
        └── api/           — Route Handlers (REST)
              ├── /boards /quests /plans /products   → public
              ├── /me/* /activate-board /missions/*/submit
              │    /pins/*/claim /orders /me/memories → JWT required
              ├── /ai/*                               → JWT + credit ledger
              └── /admin/*                            → JWT + role=admin

Supabase
  ├── Postgres  (Row Level Security on every table)
  ├── Auth      (email + Google OAuth)
  └── Storage   (mission-photos · avatars · pin-images)

AI Provider  (env: AI_PROVIDER=openai|azure)
  └── src/lib/ai/provider.ts → credit ledger → moderation → ai_cache table
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.4 — `strict` + `noUncheckedIndexedAccess` |
| Styling | Tailwind CSS 3.4 + custom design tokens |
| UI Primitives | Radix UI + custom components |
| Auth / DB / Storage | Supabase (Postgres + RLS + Storage) |
| Server State | TanStack Query v5 |
| Client State | Zustand v4 |
| Forms | React Hook Form v7 + Zod v3 |
| Package Manager | pnpm 9 (monorepo workspace) |
| Deploy | Vercel |

---

## 📁 Monorepo Structure

```
questory/
├── apps/
│   └── web/                    # Next.js 15 app  (@questory/web)
│       ├── src/
│       │   ├── app/            # App Router
│       │   │   ├── (marketing)/  — Public pages
│       │   │   ├── (app)/        — Auth-gated user area
│       │   │   ├── (admin)/      — Admin panel
│       │   │   └── api/          — Route Handlers
│       │   ├── components/     # UI components
│       │   ├── data/           # Mock data (POC fallback)
│       │   ├── lib/            # Supabase · AI · hooks · utils
│       │   └── types/          # App-level types
│       └── tests/
│           ├── e2e/            # Playwright E2E
│           └── unit/           # Vitest unit tests
├── packages/
│   ├── config/                 # Shared TypeScript configs
│   └── types/                  # Shared types  (@questory/types)
├── docs/                       # Architecture docs & ADRs
└── specs/                      # Product specs (source of truth)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>=20.11 <21`
- **pnpm** `>=9`

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example apps/web/.env.local
```

เปิด `apps/web/.env.local` และกรอก:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase — สร้าง project ที่ supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# AI Features (optional)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Feature Flags
NEXT_PUBLIC_AI_PLANNER_ENABLED=false
```

> หากไม่กรอก `NEXT_PUBLIC_SUPABASE_URL` — app จะทำงานด้วย **mock data** โดยอัตโนมัติ

### 3. Run Dev Server

```bash
pnpm dev
# → http://localhost:3000
```

---

## 📦 Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint across all packages |
| `pnpm typecheck` | TypeScript check across all packages |
| `pnpm test` | Run Vitest unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm format` | Prettier format |

---

## 📋 Pages Overview

<details>
<summary><strong>🌐 Marketing (Public)</strong></summary>

| Route | Description |
|---|---|
| `/` | Homepage — Hero, HowItWorks, FeaturedBoards, MemoryWall |
| `/boards` | Board listing + category filter |
| `/boards/[slug]` | Board detail — Missions / Rewards tabs |
| `/quests` | Quest listing |
| `/quests/[slug]` | Quest detail |
| `/plans` | Travel plan listing |
| `/plans/[slug]` | Day-by-day itinerary |
| `/memories` | Public memory wall |
| `/shop` | Product listing |
| `/shop/[slug]` | Product detail |
| `/checkout` | Interest capture form |
| `/activate` | Board activation via code |

</details>

<details>
<summary><strong>🔐 App (Auth Required)</strong></summary>

| Route | Description |
|---|---|
| `/app` | Dashboard — greeting, progress, quick actions |
| `/app/boards` | User's active boards |
| `/app/missions` | All missions with status |
| `/app/submit/[missionId]` | Submit proof — photo + location |
| `/app/pins` | Pin & badge collection grid |
| `/app/memories` | Personal memory list |
| `/app/profile` | User profile |
| `/app/ai-planner` | AI Trip Planner (feature-flag gated) |

</details>

<details>
<summary><strong>⚙️ Admin (role=admin Required)</strong></summary>

| Route | Description |
|---|---|
| `/admin` | Dashboard — KPIs, weekly chart, pending reviews |
| `/admin/submissions` | ตรวจหลักฐาน — photo viewer + approve/reject |
| `/admin/pin-claims` | Claim queue — mark shipped + tracking |
| `/admin/boards` | Mission Boards CRUD |
| `/admin/missions` | Mission CRUD |
| `/admin/users` | ผู้ใช้งาน |
| `/admin/analytics` | Revenue + quest stats |
| `/admin/ai-settings` | AI model config, system prompts |
| + more | shipping, orders, products, coupons, badges, parks, QR, notifications, settings |

</details>

---

## 📚 Specs

ทุก requirement มี stable ID สำหรับอ้างอิงใน commit และ PR

| File | ID | Content |
|---|---|---|
| `specs/01-PROJECT-CONTEXT.md` | SPEC-01 | Vision, core loop, personas |
| `specs/02-AGENT-RULES.md` | SPEC-02 | Agent behavioural contract |
| `specs/03-TECH-STACK.md` | SPEC-03 | Stack versions & conventions |
| `specs/04-REPO-STRUCTURE.md` | SPEC-04 | Folder tree |
| `specs/05-DESIGN-SYSTEM.md` | SPEC-05 | Tokens, components, motion |
| `specs/06-DATA-MODEL.md` | SPEC-06 | DB schema + TypeScript types |
| `specs/07-API-CONTRACT.md` | SPEC-07 | REST endpoints |
| `specs/08-FRONTEND-SPEC.md` | SPEC-08 | Pages, components, states |
| `specs/09-AI-FEATURES.md` | SPEC-09 | AI Planner, prompts, cost limits |
| `specs/10-PRODUCT-COMMERCE.md` | SPEC-10 | SKUs, pricing, fulfilment |
| `specs/12-ACCEPTANCE.md` | SPEC-12 | Definition of done, test matrix |

**Commit convention:** `feat(home): hero section (FE-PAGE-HOME, AC-LANDING-001)`

---

## ⚡ Next Steps

| Priority | Task | Notes |
|:---:|---|---|
| 🔴 P0 | สร้าง Supabase project + รัน `docs/schema.sql` | ไม่มี DB = API ใช้ mock data เท่านั้น |
| 🔴 P0 | กรอก `.env.local` ด้วย Supabase keys | Dev server ทำงานได้ แต่ API fallback mock |
| 🟠 P1 | Wire Supabase Auth (sign-in / sign-up flow จริง) | `src/app/auth/` pages พร้อมแล้ว |
| 🟠 P1 | Replace mock data ด้วย Supabase queries | `src/lib/supabase/server.ts` พร้อมแล้ว |
| 🟡 P2 | เพิ่ม `OPENAI_API_KEY` → enable AI features | `src/lib/ai/provider.ts` พร้อมแล้ว |

---

<div align="center">

Made with ❤️ for Thailand's national parks

</div>
