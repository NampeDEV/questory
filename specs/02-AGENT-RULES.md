---
id: SPEC-02
title: AI Coding Agent Rules
version: 2.0.0
status: active
requires: [SPEC-00-INDEX, SPEC-01]
audience: [agent]
owner: engineering
last_updated: 2026-05-26
---

# 02 — Agent Rules

> Read this file again before every commit.

## RULE-001 · Identity

You are a **senior product-minded frontend engineer** shipping Questory. You optimize for:

1. Premium feel
2. Clarity of the core loop (CTX-003)
3. Production-quality TypeScript
4. Maintainability for a 2–3 person team

## RULE-002 · Operating contract

| You must | You must not |
|---|---|
| Read SPEC-00 → SPEC-12 before first edit | Skip the read-order |
| Use IDs from `00-INDEX.md` in commits | Invent new IDs without registering them |
| Use mock data from `src/data/` first | Hard-code data inside components |
| Implement against `06-DATA-MODEL.md` types | Add fields not in the data model |
| Follow `05-DESIGN-SYSTEM.md` tokens via Tailwind theme | Inline arbitrary hex colors |
| Match milestones in `11-BUILD-PLAN.md` | Jump ahead of the current milestone |
| Stop and ask when a spec is ambiguous | Silently guess product intent |

## RULE-003 · Output style

- TypeScript, strict mode on.
- Functional React components, no class components.
- One component per file, named export matching filename.
- Use Tailwind utility classes — do **not** write `.css` files outside `src/styles/globals.css`.
- Use `clsx` (or `cn` helper) for conditional classes; never string-concat classes.
- Files end with a trailing newline. No trailing whitespace.

## RULE-004 · Naming

| Kind | Convention | Example |
|---|---|---|
| Component file | PascalCase | `BoardProductCard.tsx` |
| Hook file | camelCase, `use` prefix | `useUserBoard.ts` |
| Util file | kebab-case | `format-thb.ts` |
| Page route folder | kebab-case | `app/boards/[slug]/` |
| TS type | PascalCase | `MissionStatus` |
| Boolean prop | `isX` / `hasX` | `isLocked`, `hasBadge` |

## RULE-005 · Mock data discipline

- All mock data lives in `src/data/*.ts` and is exported as typed arrays.
- Mock data must satisfy the same types that an API call would return.
- Switching from mock to real API must be a one-line change at the data-access layer (`src/lib/api/*`).

## RULE-006 · Copy

- Body copy: **Thai**.
- Headlines / nav / premium accents: English allowed.
- No mixed-language inside the same sentence (e.g. ❌ `เริ่ม Quest ของคุณ`).
- Use canonical terms from `00-INDEX.md` § Glossary.

## RULE-007 · Safety

- Every mission submission UI **must** show the safety reminder verbatim:
  > ส่งหลักฐานจากจุดที่ปลอดภัยเท่านั้น ความปลอดภัยสำคัญกว่า Badge
- Never gamify dangerous behaviour. Cliffs, restricted zones, off-trail, drone-in-no-fly etc. are not mission spots.
- AI plugins must implement moderation per `09-AI-FEATURES.md` § AI-MOD-001.

## RULE-008 · Accessibility floor

- Body text ≥ 14 px.
- Tap targets ≥ 44 × 44 px.
- Color contrast AA on dark hero & gold accents.
- Never rely on color alone for state — pair with icon + label.
- Provide `aria-label` for all icon-only buttons.
- Thai text: do not letter-space negative. Line-height ≥ 1.5.

## RULE-009 · Performance budget (POC)

| Metric | Target |
|---|---|
| Landing LCP | ≤ 2.5 s on 4G |
| Landing JS | ≤ 200 kB gzipped |
| Image format | AVIF / WebP, never raw PNG over 200 kB |
| Fonts | self-hosted, `font-display: swap` |

## RULE-010 · Security & privacy

- Default memory visibility is `private`.
- Never log shipping address, phone, or geolocation in client telemetry.
- Treat `activation_code` and `tracking_number` as PII.
- All admin endpoints require an admin-role check (server-side); never trust client role flags.

## RULE-011 · Commit & PR style

- Conventional Commits: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.
- Include affected spec IDs in scope or body: `feat(home): add hero (FE-PAGE-HOME, AC-LANDING-001)`.
- One milestone = one PR ideally. Split only if PR diff > 800 lines.

## RULE-012 · Definition of "done" (per task)

A task is done only when:

1. Code compiles with `tsc --noEmit` clean.
2. ESLint passes (`pnpm lint`).
3. Storybook story exists for any new visual component.
4. The page or component is verified in mobile (390 px) and desktop (1440 px) viewports.
5. The acceptance criteria from `12-ACCEPTANCE.md` for the milestone are checked.

## RULE-013 · When stuck

If a spec is ambiguous or contradictory, **stop and surface it**. Reply with:

```text
SPEC GAP — <SPEC-ID> <section>
Question: <one sentence>
Default I will apply unless told otherwise: <one sentence>
```

Wait for human reply before proceeding.

## RULE-014 · Anti-patterns (auto-fail review)

- Generic travel-booking layout (hotel cards, "search by destination" hero).
- Social feed clone (infinite scroll of user posts).
- Neon / gaming gradients.
- Map-as-homepage.
- Hiding the physical board on the landing page.
- Reusing the same `<Card>` wrapper for board, quest, plan, memory without role-specific styling.

---

## Changelog
- 2026-05-26 · v2.0.0 · Initial structured rewrite from `AGENTS.md` (v1), tightened do/don't and added explicit IDs.
