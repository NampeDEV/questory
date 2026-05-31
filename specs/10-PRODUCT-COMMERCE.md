---
id: SPEC-10
title: Product Lines, Pricing & Fulfilment
version: 2.0.0
status: active
requires: [SPEC-00-INDEX, SPEC-06]
audience: [agent, engineer, pm]
owner: product
last_updated: 2026-05-26
---

# 10 — Product & Commerce

## PROD-MOAT

> Physical Board + Digital Quest + Verified Achievement + Claimable Pin

Why it's hard to replace:
1. User owns a physical board.
2. User accumulates progress on that board.
3. Pins are tied to verified missions.
4. Digital memories accumulate per mission.
5. Emotional switching cost rises over time.
6. Creator plans + community data compound.

---

## Product lines

### PROD-STARTER-10 · Starter Quest Pack

| Field | Value |
|---|---|
| Internal SKU | `PROD-STARTER-10` |
| Display name | Beginner 10 National Parks |
| Includes | A3 Board · QR Activation Card · Digital Quest access · 10 missions · 1 sticker sheet · Quest guide PDF · Pin claim eligibility |
| Suggested price | **990 – 1,290 THB** |
| Target | New users, gift buyers, beginner travelers |
| Pin eligibility | Mission pin per approved submission |

### PROD-REGIONAL · Regional Quest Boards

Variants (each its own SKU):

| SKU | Display |
|---|---|
| `PROD-REGIONAL-NORTH` | Northern Park Quest |
| `PROD-REGIONAL-SOUTH-MARINE` | Southern Marine Quest |
| `PROD-REGIONAL-WATERFALL` | Waterfall Quest |
| `PROD-REGIONAL-SEA-OF-MIST` | Sea of Mist Quest |

| Field | Value |
|---|---|
| Includes | Regional board · 15–25 missions · Region completion pin · Copyable plans · AI planner credit |
| Suggested price | **1,490 – 1,990 THB** |

### PROD-ULTIMATE-156 · Ultimate Collector Board

| Field | Value |
|---|---|
| Internal SKU | `PROD-ULTIMATE-156` |
| Display name | Ultimate 156 Parks |
| Includes | Premium A2/A1 board · 156 mission slots · QR digital passport · Collector guide · Rare completion badge · Limited packaging |
| Suggested price | **2,990 – 3,990+ THB** |

### PROD-PIN-SET · Pin Collector Set

| Field | Value |
|---|---|
| Internal SKU | `PROD-PIN-SET-*` (per theme) |
| Includes | 6–12 enamel pins · category pins (Mountain / Waterfall / Marine / Forest / Rare) · pin board backing card |
| Suggested price | **390 – 990 THB** |

### PROD-GIFT-PACK · Gift Adventure Pack

| Field | Value |
|---|---|
| Internal SKU | `PROD-GIFT-PACK` |
| Includes | Board · Pin pouch · Passport booklet · Sticker sheet · QR activation card · Gift box |
| Suggested price | **1,990 – 3,590 THB** |

---

## PROD-PIN-MODEL

### Principle (RULE-PROD-001)

> Pins must feel **earned**, not simply bought. Standalone pin packs are decorative SKUs; the canonical pin path is `Mission Approved → Badge Unlocked → Pin Claimed`.

### Pin types

| Type | Earned by |
|---|---|
| Mission Pin | Approval of a specific park mission |
| Region Pin | Completing all missions in a region |
| Category Pin | Completing all of mountain / waterfall / marine / forest |
| Rare Pin | Special seasonal / event spots |
| Completion Pin | Completing an entire board |
| Creator Pin | Quests created by creators |
| Sponsored Pin | Brand-partner quests |

---

## PROD-CLAIM-FLOW

```text
Mission Approved
   ↓
Digital Badge Unlocked
   ↓
"Claim Physical Pin" enabled on /app/pins
   ↓
User submits shipping form
   ↓
Pay shipping fee  (or redeem included credit)
   ↓
Admin batches weekly → marks shipped + tracking number
   ↓
User notified → status `shipped`
   ↓
Delivered (manual or carrier webhook later)
```

User-facing copy:

> เมื่อภารกิจผ่านการตรวจสอบ คุณจะได้รับสิทธิ์ Claim Pin จริง อาจมีค่าจัดส่งตามรอบจัดส่ง

---

## PROD-REVENUE · Monetization streams

| Stream | Priority | Notes |
|---|---|---|
| Board Pack | Very High | Core SKU |
| Pin Claim shipping | High | Recurring micro-revenue |
| Premium Plans | High | 49–199 THB |
| AI Planner credits | Medium | 49–99 THB / generation |
| Custom Board | High | 790–2,990 THB |
| Gift Box | High | Higher margin |
| Creator Quest revenue share | Medium | Post-MVP |
| Sponsored Quest | Later | Brand campaigns |
| Subscription | Later | Storage, AI, unlimited boards |
| Photo Book export | Later | Print-on-demand |

## PROD-PRICING · Suggested pricing reference

| Product | Range (THB) |
|---|---|
| Digital Quest Only | 99 – 299 |
| Starter Board Pack | 990 – 1,290 |
| Regional Board Pack | 1,490 – 1,990 |
| Ultimate Board | 2,990 – 3,990 |
| Pin Claim shipping | 49 – 89 |
| Extra Pin Pack | 199 – 599 |
| Premium Plan | 49 – 199 |
| AI Custom Plan | 49 – 299 |
| Custom Board | 790 – 2,990 |
| Gift Box | 1,990 – 3,590 |

---

## PROD-PACKAGING

| Tier | Packaging |
|---|---|
| Starter | Kraft envelope · board · QR activation card · sticker |
| Premium | Dark forest box · gold foil logo · pin pouch · passport booklet · wooden/acrylic board |

---

## PROD-CAMPAIGNS · Launch campaign ideas

| Campaign | Hero product |
|---|---|
| Winter Sea of Mist | Limited mountain pin |
| Songkran Road Trip | Regional quest |
| National Park Month | Beginner Quest discount |
| Couple Adventure | Couple board |
| Family Explorer | Family memory board |
| Corporate Wellness | Team quest board |

---

## PROD-FULFILMENT-POC

Rules for POC, encoded in admin tooling:

1. Ship boards first; never bundle board + pin in the same parcel.
2. Pin claims are batched once per week.
3. Use a simple spreadsheet or admin table — no carrier API in POC.
4. Never promise free shipping forever; surface "claim eligible" language only.
5. Shipping fee is a per-claim line item; not included in board price.
6. Acknowledge claim within 24 h with expected ship window.

---

## Changelog
- 2026-05-26 · v2.0.0 · Promoted v1 `PRODUCT_COMMERCE.md` with formal SKUs + claim/fulfilment rules.
