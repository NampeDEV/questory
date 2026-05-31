---
id: SPEC-12
title: Acceptance Criteria, KPIs & Go / No-Go
version: 2.0.0
status: active
requires: [SPEC-00-INDEX, SPEC-11]
audience: [agent, engineer, pm, qa]
owner: product
last_updated: 2026-05-26
---

# 12 — Acceptance

> Every milestone in `11-BUILD-PLAN.md` is "done" only when its acceptance criteria below pass. AC IDs are stable — reference them in commits and PR titles.

## AC structure

Each criterion is `{id} · {what to verify} · {how to verify}`.

---

## M0 — Foundation

| ID | Criterion | Verify by |
|---|---|---|
| AC-FOUNDATION-001 | `pnpm install && pnpm dev` runs without warnings | manual |
| AC-FOUNDATION-002 | `pnpm lint && pnpm typecheck && pnpm build` exit 0 | CI |
| AC-FOUNDATION-003 | Tailwind tokens from `05-DESIGN-SYSTEM.md` available via `bg-forest-800`, `text-ink`, etc. | grep + visual |
| AC-FOUNDATION-004 | Folder tree matches `04-REPO-STRUCTURE.md` | `tree -L 3` matches expected |
| AC-FOUNDATION-005 | Storybook runs and shows `Button` story | `pnpm storybook` |

## M1 — Design System

| ID | Criterion | Verify by |
|---|---|---|
| AC-DESIGN-001 | All `ui/` primitives have a Storybook story | story count |
| AC-DESIGN-002 | `Button` variants `primary / gold / secondary / ghost / danger` render correctly | Storybook |
| AC-DESIGN-003 | `BadgePinCard` rarity colors match `DS-COMP-BADGE` matrix | visual |
| AC-DESIGN-004 | `ProgressBar` fills via DS-MOTION-003 (600 ms ease-out) | manual |
| AC-DESIGN-005 | `BottomNav` shows 5 items with `gold-500` active state | visual |
| AC-DESIGN-006 | `SiteHeader` collapses to hamburger ≤ 768 px | resize |
| AC-DESIGN-007 | Color contrast on hero passes AA | Axe / Lighthouse |
| AC-DESIGN-008 | `prefers-reduced-motion: reduce` disables DS-MOTION-002, -004, -005 | DevTools toggle |

## M2 — Public Marketing Site

| ID | Criterion |
|---|---|
| AC-LANDING-001 | A first-time visitor understands the product in ≤ 10 s (5-second test on 3 users). |
| AC-LANDING-002 | Hero contains EN headline, TH subheadline, primary CTA `Start Your Quest`, secondary CTA `Explore Boards`, 4 feature bullets. |
| AC-LANDING-003 | Featured Boards section shows the 3 SKUs from `10-PRODUCT-COMMERCE.md` (Starter / Northern / Ultimate). |
| AC-LANDING-004 | How It Works section shows 4 steps: Buy → Activate → Travel → Collect. |
| AC-LANDING-005 | Memory Wall section shows ≥ 6 mock memories from `src/data/memories.ts`. |
| AC-LANDING-006 | Shop section shows Board / Pin Set / Gift Box / Sticker. |
| AC-LANDING-007 | Footer contains brand, social links, privacy, terms placeholders. |
| AC-LANDING-008 | Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95. |
| AC-LANDING-009 | `landing_view`, `start_quest_click`, `board_view` PostHog events fire correctly. |
| AC-LANDING-010 | OG image renders for `/`, `/boards/[slug]`, `/plans/[slug]`. |
| AC-COMMERCE-001 | `/boards/[slug]` shows price, mission list, reward pins, add-to-cart CTA. |
| AC-COMMERCE-002 | `/plans/[slug]` shows day-by-day itinerary with at least 1 day populated. |
| AC-COMMERCE-003 | `/checkout` form validates, submits, shows success page, fires `add_to_cart` event. |
| AC-COMMERCE-004 | All public pages render with both 360 px and 1440 px viewports without overflow. |

## M3 — App MVP

| ID | Criterion |
|---|---|
| AC-APP-001 | User signs in via email or Google. |
| AC-APP-002 | Activation code `BEGINNER10-DEMO` activates the Starter board for the user (seed data). Invalid code returns `INVALID_CODE`. |
| AC-APP-003 | `/app` dashboard shows greeting, active progress card (`0 / 10` initially), quick actions, next mission. |
| AC-APP-004 | `/app/missions/[id]` shows mission status pill that reflects DB state. |
| AC-APP-005 | `/app/submit/[missionId]` accepts a photo + coords + date + memory + mandatory safety checkbox and creates a `mission_submissions` row with status `pending`. |
| AC-APP-006 | After submission, mission detail shows `submitted` status. |
| AC-APP-007 | `/app/pins` shows the user's badge/pin grid; pins not yet earned show locked silhouette. |
| AC-APP-008 | Safety banner is present and verbatim on the submit form. |
| AC-APP-009 | `/app/memories` lists the auto-created memory drafts. |
| AC-APP-010 | PWA installable on iOS / Android; offline page renders for unreachable routes. |

## M4 — Admin + Fulfilment

| ID | Criterion |
|---|---|
| AC-ADMIN-001 | Non-admin users cannot reach `/admin/*` (server-side check). |
| AC-ADMIN-002 | `/admin/submissions` lists pending submissions with photo thumbnail, user, mission, location. |
| AC-ADMIN-003 | Admin approves a submission → `user_badges` row inserted → matching pin becomes `claim_available` for that user. |
| AC-ADMIN-004 | Admin rejects with `reviewer_note` → user sees rejection state in app. |
| AC-ADMIN-005 | Pin claim form validates, submits, creates `pin_claims` row with `status='claimed'`. |
| AC-ADMIN-006 | Admin marks pin claim shipped with tracking number → user sees `shipped` state. |
| AC-APP-008b | Share card endpoint `/api/og/share/:submissionId` returns a PNG containing user name, mission name, badge image, progress. |

## M5 — AI

| ID | Criterion |
|---|---|
| AC-AI-001 | Trip Planner JSON output validates against the `09-AI-FEATURES.md` schema. |
| AC-AI-002 | Caption Generator returns 3 options with hashtags ≤ 8. |
| AC-AI-003 | Memory Writer respects character limits (short ≤ 280, long 600–900). |
| AC-AI-004 | Calls with the same normalized input produce a cache hit and do not decrement credits. |
| AC-AI-005 | Calls beyond free quota return `RATE_LIMITED` with `Retry-After`, or prompt the credit-pack purchase modal. |
| AC-AI-006 | Moderation blocks an input containing `ปีนหน้าผา` (off-trail risky) and returns `AI_BLOCKED`. |

## M6 — Pilot

| ID | Criterion |
|---|---|
| AC-PILOT-001 | ≥ 20 pilot users completed sign-in. |
| AC-PILOT-002 | ≥ 5 pilot users submitted at least one proof. |
| AC-PILOT-003 | ≥ 1 share card was downloaded and posted publicly. |
| AC-PILOT-004 | KPI dashboard shows ≥ 7 days of data for all events in `08-FRONTEND-SPEC.md` § FE-ANALYTICS. |
| AC-PILOT-005 | Feedback report `docs/pilot-report.md` exists with at least 10 documented user quotes / observations. |

---

## KPI targets (POC)

| KPI | Target |
|---|---:|
| Landing → signup conversion | 10–20 % |
| Product page → preorder interest | 5–10 % |
| Copy plan click | 20–30 % of plan-page views |
| Submit proof completion | 20 % of activated users |
| Share card usage | 10–15 % of approvals |
| Willingness to pay (board pack) | 590–1,290 THB band |
| Repeat intent for next quest | 20 % |

PostHog dashboards live at: `dashboards/poc-funnel`, `dashboards/post-activation`, `dashboards/ai-usage`.

---

## Go / No-Go (end of M6)

### Go if (≥ 3 of the below)

- 50+ waitlist or preorder interest signups
- Users explain the concept back in ≤ 1 sentence
- 5–10 users say they would buy the board at 990–1,290 THB
- Share cards generate organic comments
- Pin claim concept produces excitement in usability sessions

### No-Go / Pivot if

- Users only want free travel plans (no board demand)
- Users do not care about the physical board
- Pin reward does not move motivation
- Board production cost destroys margin

---

## QA test matrix

| Area | Browsers | Viewports | Tools |
|---|---|---|---|
| Marketing | Chrome, Safari, Edge, Firefox | 360 / 768 / 1280 / 1440 | Playwright + Lighthouse |
| App | Chrome (Android), Safari (iOS), Chrome desktop | 360 / 390 / 768 / 1024 | Playwright + manual install-to-home |
| Admin | Chrome desktop | 1280+ | Playwright |
| AI | Chrome desktop | 1280+ | Vitest (schema) + Playwright (flow) |

## Test budgets

- Unit tests: ≥ 80 % branch coverage on `src/lib/`.
- E2E suites in `tests/e2e/*` must pass on every PR (Vercel preview URL).

---

## Changelog
- 2026-05-26 · v2.0.0 · Replaced v1 `POC_PLAN.md` KPI section with explicit AC IDs per milestone, QA matrix.
