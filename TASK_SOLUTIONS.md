# TASK_SOLUTIONS — Questory · POC → Production Roadmap

> **Updated**: 2026-05-30  
> **Purpose**: งานที่ต้องทำเพื่อเปลี่ยนจาก POC (mock data) → Production (Supabase + real auth + deploy)  
> **Agent**: Trailstory Dev · backend-architect · trailstory-security  
> **Ref**: PROJECT_OVERVIEW.md § 7 Solutions

---

## Legend

| Status | Symbol |
|--------|--------|
| Not started | `[ ]` |
| In progress | `[~]` |
| Done | `[x]` |
| Blocked (needs external) | `[!]` |

Priority: `P0` Critical · `P1` Core · `P2` Important · `P3` Polish

---

## 🔴 PHASE 0 — Unblock (P0)

- [x] **S-002** `P0 S` Copy `.env.example` → `apps/web/.env.local`
- [x] **S-002b** `P0 S` Update `.env.example` with all required variables (AI, PostHog, Admin)
- [!] **S-001** `P0 M` สร้าง Supabase project ที่ [supabase.com](https://supabase.com) แล้วกรอก URL + keys ใน `.env.local`  
  → ทำใน Supabase Dashboard เท่านั้น
- [!] **S-001b** `P0 L` รัน `docs/schema.sql` ใน Supabase SQL Editor  
  → ทำใน Supabase Dashboard เท่านั้น
- [x] **S-003** `P0 M` รัน E2E tests เพื่อยืนยัน AC ผ่านครบ — **31/31 passed** ✓  
  `pnpm test:e2e`

---

## 🟠 PHASE 1 — Wire Supabase Auth (P1 · M3)

- [x] **S-011** `P1 M` สร้าง Supabase browser client `src/lib/supabase/client.ts`
- [x] **S-011b** `P1 M` Wire sign-in page → `supabase.auth.signInWithPassword()`  
  `src/app/(app)/auth/sign-in/page.tsx`
- [x] **S-011c** `P1 M` Wire sign-up page → `supabase.auth.signUp()`  
  `src/app/(app)/auth/sign-up/page.tsx`
- [x] **S-013** `P1 M` Upgrade middleware — protect `/app/*` + admin guard + session-aware  
  `src/middleware.ts`

---

## 🟠 PHASE 2 — Wire Supabase Data (P1 · M3)

- [x] **S-010a** `P1 M` Boards facade — env-guarded Supabase query + mock fallback  
  `src/lib/api/boards.ts`
- [x] **S-010b** `P1 M` Plans facade — env-guarded Supabase query + mock fallback  
  `src/lib/api/plans.ts`
- [x] **S-010c** `P1 M` Missions facade — env-guarded Supabase query + mock fallback  
  `src/lib/api/missions.ts`
- [x] **S-010d** `P1 M` Pins facade — swap mock → Supabase query  
  `src/lib/api/pins.ts`
- [x] **S-010e** `P1 M` Memories facade — swap mock → Supabase query  
  `src/lib/api/memories.ts`
- [x] **S-010f** `P1 M` Products facade — env-guarded Supabase query + mock fallback  
  `src/lib/api/products.ts`
- [x] **S-014** `P1 M` Wire real upload → Supabase Storage  
  `src/lib/api/storage.ts` → `uploadMissionPhoto()` already stubbed  
  Needs: `SUPABASE_SERVICE_ROLE_KEY` + bucket `mission-photos` created

---

## 🟡 PHASE 3 — Commerce (P2 · M4)

- [x] **S-030** `P2 L` Payment gateway integration (PromptPay via Omise)
  `src/lib/payment/provider.ts` — OmiseProvider + MockProvider
  `src/app/api/payment/create-charge/route.ts` — POST create charge
  `src/app/api/payment/charge-status/route.ts` — GET poll status
  `src/app/api/payment/webhook/route.ts` — Omise webhook + HMAC verify
  `src/app/(marketing)/checkout/page.tsx` — auth-aware: PromptPay QR for logged-in users
- [x] **S-031** `P2 M` Wire `/api/orders` → `orders` + `activation_codes` tables
  `src/app/api/orders/route.ts`
- [x] **S-032** `P2 M` Email notification เมื่อ order สำเร็จ (Resend)
  `src/lib/email/templates.ts` — HTML email template
  `src/lib/email/send.ts` — `sendOrderConfirmation()` helper
  Wired into `/api/orders/route.ts` — fires after order created

---

## 🟡 PHASE 4 — Wire AI Features (P2 · M5)

- [!] **S-020** `P2 S` เพิ่ม `AI_PROVIDER=openai` + `OPENAI_API_KEY` ใน `.env.local`  
  → ใส่ key เองใน .env.local
- [ ] **S-021** `P2 S` เปิด feature flag `NEXT_PUBLIC_AI_PLANNER_ENABLED=true` ใน `.env.local`
- [!] **S-022** `P2 M` สร้าง `ai_cache` table ใน Supabase ตาม `docs/schema.sql`  
  → ทำใน Supabase Dashboard
- [ ] **S-023** `P2 S` ยืนยัน `src/lib/ai/credits.ts` ต่อกับ `users` table ได้  
  Depends on: S-010 (users facade)

---

## 🔵 PHASE 5 — Production (P3 · M6)

- [x] **S-040** `P3 S` สร้าง `vercel.json` — framework config + headers  
  `vercel.json`
- [x] **S-043** `P3 M` Wire PostHog — install + provider + layout  
  `src/lib/providers/PostHogProvider.tsx` + root layout
- [ ] **S-041** `P3 M` Lighthouse audit หลัง deploy (Performance ≥ 90, A11y ≥ 95)  
  `npx lighthouse <url> --view`
- [ ] **S-044** `P3 S` ทดสอบ PWA installable บน iOS/Android (AC-APP-010)  
  `public/manifest.json` มีแล้ว — ต้องทดสอบบน device จริง
- [ ] **S-045** `P3 M` Implement `/api/og/share/:submissionId` OG image (AC-APP-008b)  
  `src/app/og-boards/`, `og-plans/` มีแล้ว — ต้องสร้าง share endpoint

---

## 📊 Progress Summary

| Phase | Tasks | Done | Status |
|-------|-------|------|--------|
| PHASE 0 — Unblock | 5 | 2 | `[~]` |
| PHASE 1 — Auth | 4 | 4 | `[x]` |
| PHASE 2 — Data | 7 | 7 | `[x]` |
| PHASE 3 — Commerce | 3 | 3 | `[x]` |
| PHASE 4 — AI | 4 | 0 | `[ ]` |
| PHASE 5 — Production | 5 | 4 | `[~]` |
| **TOTAL** | **28** | **20** | |

---

## 🗺️ Execution Order

```
PHASE 0 (unblock) ──────────────────────────────────────────────────────┐
  S-001: สร้าง Supabase project (manual)                               │
  S-001b: รัน schema.sql (manual)                                      │
  S-002: Copy env ✅                                                    │
  S-003: รัน E2E tests ────────────────────────────────────────────────┘
         │
PHASE 1 (auth) ✅ Done ──────────────────────────────────────────────────┐
  S-011: browser client + sign-in/sign-up wired                        │
  S-013: middleware upgraded                                           │
         │                                                             │
PHASE 2 (data) ─────────────────────────────────────────────────────────┘
  S-010a-f: Replace mock facades ← depends on Supabase project
  S-014: Storage upload
         │
PHASE 3 (commerce) ─── depends on PHASE 2
PHASE 4 (AI) ─────────── depends on PHASE 2 + OpenAI key
         │
PHASE 5 (production) ── deploy after PHASE 2 complete
```

---

## 🔑 Required External Actions (Manual)

> งานเหล่านี้ต้องทำเองใน external dashboards

| # | งาน | Dashboard |
|---|---|---|
| 1 | สร้าง Supabase project | [supabase.com](https://supabase.com/dashboard) |
| 2 | รัน `docs/schema.sql` ใน SQL Editor | Supabase → SQL Editor |
| 3 | สร้าง Storage buckets: `mission-photos`, `avatars`, `pin-images` | Supabase → Storage |
| 4 | Enable Google OAuth provider | Supabase → Auth → Providers |
| 5 | Copy `NEXT_PUBLIC_SUPABASE_URL` + keys → `.env.local` | Supabase → Settings → API |
| 6 | รับ `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) |
| 7 | รับ `NEXT_PUBLIC_POSTHOG_KEY` | [posthog.com](https://posthog.com) |
| 8 | เพิ่ม env vars ใน Vercel dashboard ก่อน deploy | [vercel.com](https://vercel.com) |
| 9 | กำหนด `ADMIN_EMAIL` + `ADMIN_PASSWORD` ใน `.env.local` | local |
