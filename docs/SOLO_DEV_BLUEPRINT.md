# Solo Developer Blueprint — Questory
> **วิเคราะห์ + ออกแบบ + แผนปฏิบัติงาน สำหรับ Developer คนเดียว**  
> Version: 1.0.0 · Created: 2026-05-29  
> Stack: Next.js 15 · Supabase · TypeScript · Vercel

---

## 1. สถานะปัจจุบัน (As-Is)

```
✅ Frontend (Marketing)   — 31 pages · build clean
✅ Mock Data              — boards, plans, missions, pins, products, memories
✅ TypeScript Types       — src/types/* ครบทุก entity
✅ UI Components          — Button, Card, ProgressBar, BadgePill, AdminStatsCard …
✅ Admin Dashboard UI     — layout + pages (mock data)
⬜ Real API (Route Handlers)   — ยังไม่มี
⬜ Supabase Schema / RLS       — ยังไม่มี
⬜ Auth (real Supabase Auth)   — ยังไม่มี
⬜ File Upload / Storage       — ยังไม่มี
⬜ AI Features                 — ยังไม่มี
⬜ Order / Checkout flow       — mock เท่านั้น
```

---

## 2. สถาปัตยกรรมแนะนำ (To-Be)

```
┌─────────────────────────────────────────────────────────────┐
│                 Browser / PWA (React)                       │
│   Marketing Pages  │  App Pages (/app/*)  │  Admin (/admin) │
└────────────────────┴───────────────────────┴────────────────┘
           │ fetch/TanStack Query
           ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js 15 — Vercel (1 project)                │
│                                                             │
│  RSC (Server Components)  ←→  Route Handlers /api/*        │
│       public pages SSR          thin controller layer       │
│                                        │                    │
│                          src/lib/services/*  (business)     │
│                          src/lib/repositories/* (DB)        │
│                          src/lib/api/* (helpers)            │
└──────────────────────────────┬──────────────────────────────┘
                               │
           ┌───────────────────┼──────────────────┐
           ▼                   ▼                  ▼
   ┌──────────────┐   ┌──────────────┐   ┌─────────────────┐
   │  Supabase    │   │  Supabase    │   │  OpenAI /       │
   │  Postgres    │   │  Auth +      │   │  Azure OpenAI   │
   │  + RLS       │   │  Storage     │   │  (AI features)  │
   └──────────────┘   └──────────────┘   └─────────────────┘
```

**กฎสำคัญ 3 ข้อ:**
1. Route Handler = 얇은 controller เท่านั้น (validate → call service → return response)
2. Business logic อยู่ใน `src/lib/services/` เท่านั้น
3. DB query อยู่ใน `src/lib/repositories/` เท่านั้น

---

## 3. โครงสร้างโฟลเดอร์ที่ควรเป็น

```
src/
├── app/
│   ├── api/                       ← Route Handlers (controller only)
│   │   ├── boards/route.ts
│   │   ├── me/route.ts
│   │   ├── activate-board/route.ts
│   │   ├── missions/[id]/submit/route.ts
│   │   ├── pins/[id]/claim/route.ts
│   │   ├── orders/route.ts
│   │   ├── ai/*/route.ts
│   │   └── admin/*/route.ts
│   ├── (marketing)/               ← Public pages (RSC)
│   ├── (app)/                     ← Auth-required pages
│   └── (admin)/                   ← Admin pages
│
├── components/                    ← UI ล้วนๆ ไม่มี logic
├── config/
├── data/                          ← Mock data (ใช้ระหว่าง dev)
├── types/                         ← TypeScript types mirror DB schema
│
└── lib/
    ├── api/                       ← HTTP helpers
    │   ├── response.ts            ← apiSuccess(), apiError()
    │   ├── auth.ts                ← getSessionOrThrow(), isAdmin()
    │   ├── rate-limit.ts          ← rate limiting
    │   ├── storage.ts             ← file upload helpers
    │   └── schemas/               ← Zod validation schemas
    │       ├── activate.schema.ts
    │       ├── mission-submit.schema.ts
    │       ├── pin-claim.schema.ts
    │       └── order.schema.ts
    │
    ├── services/                  ← Business logic
    │   ├── board.service.ts
    │   ├── mission.service.ts
    │   ├── pin.service.ts
    │   ├── order.service.ts
    │   └── ai.service.ts
    │
    ├── repositories/              ← DB queries (Supabase)
    │   ├── board.repository.ts
    │   ├── mission.repository.ts
    │   ├── pin.repository.ts
    │   └── order.repository.ts
    │
    ├── supabase/                  ← Supabase clients
    │   ├── server.ts              ← server-side (cookies)
    │   ├── client.ts              ← browser-side
    │   └── admin.ts              ← service role (admin only)
    │
    ├── ai/                        ← AI abstraction
    │   ├── provider.ts            ← AIProvider interface
    │   └── moderation.ts
    │
    ├── hooks/                     ← React hooks (client)
    └── utils/                     ← cn, format-thb, status-style …
```

---

## 4. Core User Journey & State Machine

### 4.1 Core Loop (ห้ามข้าม)

```
ซื้อ Board
    ↓
Activate QR Code  →  POST /api/activate-board
    ↓
เดินทาง + ทำ Mission
    ↓
Submit หลักฐาน   →  POST /api/missions/:id/submit
    ↓
Admin Review      →  PATCH /api/admin/submissions/:id
    ↓
Unlock Badge      →  (auto on approve)
    ↓
Claim Pin         →  POST /api/pins/:id/claim
    ↓
Share / Buy Next Board
```

### 4.2 Mission Status Machine

```
locked
  ↓ (board activated)
available
  ↓ (user starts)
in_progress
  ↓ (photo submitted)
submitted
  ↓ admin review
 ├─→ approved  →  completed  →  (unlock badge)
 ├─→ need_more_info  →  in_progress
 └─→ rejected
```

### 4.3 Pin Status Machine

```
locked
  ↓ (mission approved)
unlocked
  ↓ (all missions in set done)
claim_available
  ↓ (user claims)
claimed
  ↓ (admin ships)
shipped
  ↓ (delivered)
delivered
```

### 4.4 Order Status Machine

```
draft → paid → processing → shipped → delivered
                          ↘ cancelled
```

---

## 5. API ที่ต้องสร้าง (เรียงลำดับความสำคัญ)

### 🔴 P0 — ต้องมีก่อนระบบ core ทำงานได้

| ID | Endpoint | Method | Auth |
|----|----------|--------|------|
| API-001 | `/api/boards` | GET | Public |
| API-002 | `/api/boards/:slug` | GET | Public |
| API-003 | `/api/me` | GET | User |
| API-004 | `/api/me/boards` | GET | User |
| API-005 | `/api/activate-board` | POST | User |
| API-006 | `/api/missions/:id/submit` | POST | User |
| API-007 | `/api/admin/submissions` | GET/PATCH | Admin |
| API-008 | `/api/admin/stats` | GET | Admin |

### 🟠 P1 — ต้องมีก่อน launch

| ID | Endpoint | Method | Auth |
|----|----------|--------|------|
| API-009 | `/api/me/missions` | GET | User |
| API-010 | `/api/me/pins` | GET | User |
| API-011 | `/api/pins/:id/claim` | POST | User |
| API-012 | `/api/orders` | POST | User |
| API-013 | `/api/plans` | GET | Public |
| API-014 | `/api/products` | GET | Public |
| API-015 | `/api/admin/orders` | GET/PATCH | Admin |

### 🟡 P2 — ก่อน scale

| ID | Endpoint | Method | Auth |
|----|----------|--------|------|
| API-016 | `/api/ai/trip-planner` | POST | User |
| API-017 | `/api/ai/memory-writer` | POST | User |
| API-018 | `/api/me/memories` | GET/PATCH | User |
| API-019 | `/api/admin/analytics` | GET | Admin |
| API-020 | `/api/admin/users` | GET | Admin |

---

## 6. Database Tables ที่ต้องสร้าง

```sql
-- Priority 1: Core tables
users               ← mirror auth.users
board_templates     ← products catalogue
activation_codes    ← generated per order
user_boards         ← activated boards per user
missions            ← missions per board template

-- Priority 2: Submission + reward
mission_submissions ← photo proof + location
memories            ← auto-created from submission
badges              ← reward definitions
user_badges         ← earned badges per user

-- Priority 3: Physical fulfillment
pins                ← pin definitions
pin_claims          ← shipping requests
orders              ← purchase orders
order_items         ← line items

-- Priority 4: AI + analytics
ai_cache            ← cache AI generations
ai_credits          ← usage quota per user
plans               ← travel plans
plan_items          ← plan day items
```

---

## 7. แผนปฏิบัติงาน 6 สัปดาห์ (Solo Dev)

### สัปดาห์ 1 — Foundation

```
จันทร์  Supabase setup: init project, schema Phase 1 (users, board_templates, missions)
อังคาร  Auth: Supabase Auth → middleware → getSessionOrThrow()
พุธ     Response helpers: apiSuccess(), apiError(), ErrorCode enum
พฤหัส  Zod schemas: activate, mission-submit, pin-claim
ศุกร์   CI: pnpm build + test + typecheck ผ่านก่อน commit
```

### สัปดาห์ 2 — Public APIs

```
จันทร์  GET /api/boards + GET /api/boards/:slug
อังคาร  GET /api/plans + GET /api/products
พุธ     Integration test: boards, plans, products
พฤหัส  Frontend: เปลี่ยนจาก mock data facade → real API call
ศุกร์   E2E test: public pages load จาก API จริง
```

### สัปดาห์ 3 — Core User APIs

```
จันทร์  GET /api/me + GET /api/me/boards
อังคาร  POST /api/activate-board (+ activation_codes table)
พุธ     POST /api/missions/:id/submit (+ Supabase Storage upload)
พฤหัส  GET /api/me/missions + GET /api/me/pins
ศุกร์   Integration test: activate → submit flow
```

### สัปดาห์ 4 — Admin APIs + Review Flow

```
จันทร์  GET/PATCH /api/admin/submissions (approve/reject)
อังคาร  Auto-unlock badge on approve + timeline event
พุธ     GET /api/admin/stats (KPI query)
พฤหัส  GET/PATCH /api/admin/orders
ศุกร์   Admin dashboard เชื่อมกับ real API
```

### สัปดาห์ 5 — Commerce + Pin Claim

```
จันทร์  POST /api/orders (checkout, generate activation codes)
อังคาร  POST /api/pins/:id/claim (+ shipping address validation)
พุธ     Rate limiting: Upstash Redis
พฤหัส  File security: validate MIME type, UUID filename
ศุกร์   E2E: checkout → activate → submit → claim
```

### สัปดาห์ 6 — AI + Polish

```
จันทร์  src/lib/ai/provider.ts abstraction (OpenAI / Azure)
อังคาร  POST /api/ai/trip-planner + POST /api/ai/memory-writer
พุธ     AI cache (ai_cache table) + credit check (ai_credits)
พฤหัส  OpenAPI spec (docs/openapi.yaml)
ศุกร์   Load test + security audit (OWASP Top 10 checklist)
```

---

## 8. สิ่งที่ต้องทำก่อนเริ่มโค้ดจริง (Pre-Flight Checklist)

```
□ สร้าง Supabase project (https://supabase.com)
□ คัดลอก SUPABASE_URL + ANON_KEY ใส่ .env.local
□ รัน docs/schema.sql ใน Supabase SQL Editor
□ เปิด Email + Google Auth ใน Supabase Dashboard
□ สร้าง Storage bucket: mission-photos, avatars
□ สมัคร Upstash Redis (free tier ใช้ได้)
□ สมัคร OpenAI API key (หรือ Azure OpenAI)
□ ตั้ง .env.local ตาม .env.example ที่ update แล้ว
□ pnpm install && pnpm build → ต้องผ่านก่อนเริ่ม
```

---

## 9. กฎการโค้ดที่ต้องยึดถือตลอด (Solo Discipline)

| กฎ | เหตุผล |
|----|--------|
| **Route Handler ≤ 30 บรรทัด** | ถ้าเกินแสดงว่า logic หลุดออกจาก service |
| **ทุก input ผ่าน Zod ก่อนใช้** | OWASP A03: Injection |
| **ทุก protected endpoint เรียก `getSessionOrThrow()`** | OWASP A01: Auth |
| **ไม่มี `any` ใน TypeScript** | จะหา bug ไม่เจอตอน refactor |
| **ทุก DB query ระบุ `select` field ชัด** | ป้องกัน data leak |
| **ทุกไฟล์ใหม่มี test อย่างน้อย 1 ไฟล์** | Happy path + 1 error case |
| **Commit ทุกวัน** | Solo dev ต้องมี history เป็น safety net |
| **ไม่ push ถ้า `pnpm build` fail** | CI discipline |

---

## 10. Definition of Done (แต่ละ API)

```
□ Zod schema validate input
□ Auth check (ถ้า require)
□ Role check (ถ้าเป็น admin)
□ Error response ตาม envelope มาตรฐาน
□ Success response ตาม envelope มาตรฐาน
□ Integration test: happy path
□ Integration test: invalid input
□ Integration test: unauthorized (ถ้า protected)
□ pnpm build ผ่าน
□ pnpm test ผ่าน
```

---

## 11. สัญญาณที่บอกว่า "ถึงเวลาแยก Backend"

> ยังไม่ต้องทำตอนนี้ — แต่เก็บไว้ให้รู้ว่าเมื่อไหร่ต้องทำ

| สัญญาณ | Action |
|--------|--------|
| AI processing นาน > 10s (Vercel timeout) | แยก `apps/ai-service/` เป็น FastAPI บน Railway |
| ต้องใช้ Python / LangChain / vector embed | เพิ่ม microservice Python |
| ทีมโต > 4 คน มี frontend dev แยก backend dev | แยก repo + API contract ชัดเจน |
| Traffic สูง ต้องการ horizontal scale เฉพาะ API | แยก Next.js API → standalone server |

---

## Quick Reference

```bash
# Local dev
pnpm dev

# Supabase local
supabase start
supabase db reset    # reset + seed

# Test
pnpm test            # vitest unit tests
pnpm test:e2e        # playwright

# Before commit
pnpm build && pnpm test && pnpm typecheck
```

---

*Blueprint นี้ใช้คู่กับ: `TASK_LIST.md` · `TASK_ADMIN.md` · `TASK_API_MOCKUP.md`*
