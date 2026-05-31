---
id: SPEC-01
title: Project Context & Vision
version: 2.0.0
status: active
requires: [SPEC-00-INDEX]
audience: [agent, engineer, designer, pm]
owner: product
last_updated: 2026-05-26
---

# 01 — Project Context

## CTX-001 · One-liner

> **Questory** turns travel through Thai national parks into a collectible mission system: buy a physical board, scan QR, complete missions, submit proof, unlock badges, claim enamel pins, share progress.

## CTX-002 · Product positioning matrix

```text
TikTok              → Inspiration
Lemon8              → Review
Google Maps         → Navigation
Facebook            → Community
Questory              → Mission + Memory + Collectible Achievement
```

The product is **not** a travel booking site, OTA, social feed, or generic gamified app. Do not blur this line.

## CTX-003 · Core loop (non-negotiable)

```text
Buy Board
  → Activate Digital Quest via QR
    → Travel & Complete Mission
      → Submit Photo + Location + Memory
        → Verify (admin-first, automated-later)
          → Unlock Digital Badge
            → Claim Physical Pin
              → Share Progress
                → Invite / Copy Plan / Buy next Board
```

Every screen the agent builds must obviously serve at least one step of this loop within 10 seconds of scanning.

## CTX-004 · Value propositions

| Pain Point | Solution | Owned by spec |
|---|---|---|
| เห็นรีวิวแล้วอยากไป แต่ไม่รู้จะเริ่ม | Copy Plan / AI Planner | SPEC-08, SPEC-09 |
| รูปกระจัดกระจายในมือถือ | Digital Memory Board | SPEC-08 |
| อยากมีของสะสมที่มีความหมาย | Physical Board + Pins | SPEC-10 |
| รีวิวกระจัดกระจาย ไม่เป็นระบบ | Structured Quest + Plan | SPEC-08 |
| อยากพิสูจน์ว่าไปจริง | Photo + Location Verification | SPEC-07 |
| อยากแชร์ความสำเร็จ | Share Card / Badge Unlock | SPEC-08 |

## CTX-005 · Personas

| ID | Persona | Age | Core need | Drives revenue from |
|---|---|---|---|---|
| `CTX-010` | Weekend Explorer | 20–35 | Easy route + checklist | Starter board, premium plans |
| `CTX-011` | Collector Traveler | 25–45 | Stamps / pins / passport feel | Regional + Ultimate boards, pin sets |
| `CTX-012` | Content Creator | 20–35 | Plan page + share card | Premium plans, creator quests |
| `CTX-013` | Gift Buyer | 25–55 | Premium gift packaging | Gift Adventure Pack |

## CTX-006 · Brand axes

| Axis | Choose | Avoid |
|---|---|---|
| Tone | Warm, explorer, proud, premium | Childish, neon, salesy |
| Aesthetic | National Park Passport + Adventure Map + Wooden Collector Board | Generic SaaS, gaming UI |
| Language | Thai primary; English for headlines / nav | Mixed Thai-English in body copy |
| Mood | Misty mountain at dawn, dim forest, parchment | Bright, tropical-tourism, beach-party |

## CTX-007 · UX Principles (priority order)

1. **Mission-first** — every screen tells the user what to do next.
2. **Collectible feeling** — badges, pins, boards must feel earned.
3. **Low-friction action** — Copy Plan & Submit Proof are ≤2 taps.
4. **Social-ready** — every achievement is shareable.
5. **Physical-digital bridge** — QR + Pin are heroes, not garnishes.
6. **Safety-first** — never reward dangerous behaviour for a badge.

## CTX-008 · Out of scope (POC)

- Real payment gateway
- Real-time GPS verification
- Native iOS/Android apps
- Full ecommerce fulfillment
- Automated fraud detection
- Creator marketplace payouts
- Multi-language beyond TH / EN headlines

## CTX-009 · Success definition

POC is "Go" when ≥ 3 of the following are true:

- 50+ waitlist / preorder interest signups
- Users explain the concept back in ≤ 1 sentence
- 5–10 users say they would buy the board at 990–1,290 THB
- Share cards generate organic comments
- Pin claim concept produces excitement in usability sessions

See `12-ACCEPTANCE.md` for measurable KPIs.

---

## Changelog
- 2026-05-26 · v2.0.0 · Initial structured rewrite from `DESIGN.md` + `README.md` (v1).
