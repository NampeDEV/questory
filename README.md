# Questory

> เปลี่ยนการท่องเที่ยวอุทยานแห่งชาติไทยให้กลายเป็น Mission System สะสมได้ — ซื้อ Board → สแกน QR → ทำ Mission → ปลดล็อก Badge → รับ Enamel Pin → แชร์ความสำเร็จ

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.4 strict |
| Styling | Tailwind CSS 3.4 |
| UI Primitives | Radix UI + custom |
| Auth / DB / Storage | Supabase (Postgres + RLS + Storage) |
| State (server) | TanStack Query v5 |
| State (client) | Zustand v4 |
| Forms | React Hook Form v7 + Zod v3 |
| Package Manager | pnpm 9 (monorepo) |
| Deploy | Vercel |

---

## Monorepo Structure

```
Trailstory/
├── apps/
│   └── web/               # Next.js 15 app (@questory/web)
│       ├── src/
│       │   ├── app/       # App Router — (marketing), (app), (admin), api/
│       │   ├── components/
│       │   ├── data/      # Mock data (POC)
│       │   ├── lib/       # Supabase, API helpers, hooks, utils
│       │   ├── styles/
│       │   └── types/
│       └── tests/
│           ├── e2e/       # Playwright
│           └── unit/      # Vitest
├── packages/
│   ├── config/            # Shared TypeScript configs
│   └── types/             # Shared TypeScript types (@questory/types)
├── docs/                  # Architecture docs & ADRs
└── specs/                 # Product specs (source of truth)
```

---

## Getting Started

### Prerequisites

- Node.js `>=20.11 <21`
- pnpm `>=9`

### Install

```bash
pnpm install
```

### Environment

```bash
cp .env.example apps/web/.env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Run Dev Server

```bash
pnpm dev
# → http://localhost:3000
```

---

## Commands

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

## Specs

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

Commit convention: `feat(home): hero section (FE-PAGE-HOME, AC-LANDING-001)`

---

## Core Loop

```
Buy Board → Activate via QR → Travel & Complete Mission
  → Submit Photo + Location → Verify → Unlock Badge
    → Claim Physical Pin → Share → Invite / Copy Plan / Buy next Board
```
| `POC_PLAN.md` | `11-BUILD-PLAN.md` + `12-ACCEPTANCE.md` | Plan separated from acceptance |

All v1 content is preserved; only structure and IDs are new.
