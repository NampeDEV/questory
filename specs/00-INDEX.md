---
id: SPEC-00-INDEX
title: Master Index & Glossary
version: 2.0.0
status: active
requires: []
audience: [agent, engineer]
owner: product
last_updated: 2026-05-26
---

# 00 — Master Index

This file is the **only** index. If a spec ID is not listed here, it does not exist.

---

## 1. Spec files

| File | ID | Status | Required by |
|---|---|---|---|
| `01-PROJECT-CONTEXT.md` | SPEC-01 | active | all |
| `02-AGENT-RULES.md` | SPEC-02 | active | all coding agents |
| `03-TECH-STACK.md` | SPEC-03 | active | SPEC-04, SPEC-08 |
| `04-REPO-STRUCTURE.md` | SPEC-04 | active | all |
| `05-DESIGN-SYSTEM.md` | SPEC-05 | active | SPEC-08 |
| `06-DATA-MODEL.md` | SPEC-06 | active | SPEC-07, SPEC-08 |
| `07-API-CONTRACT.md` | SPEC-07 | active | SPEC-08, SPEC-09 |
| `08-FRONTEND-SPEC.md` | SPEC-08 | active | SPEC-11 |
| `09-AI-FEATURES.md` | SPEC-09 | active | SPEC-11 |
| `10-PRODUCT-COMMERCE.md` | SPEC-10 | active | SPEC-11 |
| `11-BUILD-PLAN.md` | SPEC-11 | active | SPEC-12 |
| `12-ACCEPTANCE.md` | SPEC-12 | active | — |

---

## 2. ID range allocation

Every spec owns a fixed ID range. Add new IDs at the end of the range — never reuse.

| Spec | Range | Examples |
|---|---|---|
| SPEC-01 | `CTX-001 … CTX-099` | CTX-001 (one-liner), CTX-010 (persona) |
| SPEC-02 | `RULE-001 … RULE-099` | RULE-001 (no Tailwind override) |
| SPEC-03 | `STACK-001 … STACK-099` | STACK-001 (Next.js 15) |
| SPEC-04 | `FS-001 … FS-199` | FS-001 (src/app) |
| SPEC-05 | `DS-COLOR-001 … DS-COLOR-099`, `DS-TYPE-…`, `DS-COMP-…`, `DS-MOTION-…` | DS-COLOR-001 (forest-950) |
| SPEC-06 | `DM-<TABLE>-NNN` | DM-USER-001 (users.id) |
| SPEC-07 | `API-<RESOURCE>-<VERB>` | API-BOARDS-GET |
| SPEC-08 | `FE-PAGE-<NAME>`, `FE-COMP-<NAME>`, `FE-STATE-<NAME>` | FE-PAGE-HOME |
| SPEC-09 | `AI-<PLUGIN>-NNN` | AI-PLANNER-001 |
| SPEC-10 | `PROD-<SKU>` | PROD-STARTER-10 |
| SPEC-11 | `M-N-<NAME>` | M-2-WEBSITE |
| SPEC-12 | `AC-<AREA>-NNN` | AC-LANDING-001 |

---

## 3. Glossary

Canonical terms. AI agents must use these spellings in code, copy, and commits.

| Term | Meaning | Do not say |
|---|---|---|
| **Board** | Physical product (A3/A2/A1) + matching digital board | "stamp card", "passport book" |
| **Board Template** | The catalogue definition of a board | "board type" |
| **User Board** | A board a user activated via QR | "my board entry" |
| **Quest** | A themed set of missions tied to a board template | "challenge" (avoid) |
| **Mission** | One park / objective inside a quest | "task", "stamp" |
| **Submission** | User-uploaded proof for a mission | "post", "check-in" |
| **Memory** | A user-authored note + photos tied to a submission | "review", "diary" |
| **Badge** | Digital reward unlocked when submission approved | "achievement" (avoid) |
| **Pin** | Physical enamel pin claimed against a badge | "stamp" |
| **Pin Claim** | Order to ship a physical pin | "redeem" (avoid) |
| **Plan** | Copyable day-by-day itinerary | "trip" (avoid in product copy) |
| **Activation Code** | One-time code printed on QR card | "key", "license" |
| **Explorer** | Public-facing persona of a registered user | "member" |

---

## 4. Status legend

| Status | Meaning |
|---|---|
| `active` | Current source of truth. Agents must follow. |
| `draft` | Under proposal. Do not implement until promoted. |
| `deprecated` | Kept for history. Do not implement. Will be deleted later. |

---

## 5. Change protocol

1. AI agent may **read** any active spec freely.
2. AI agent may **propose** edits only via a numbered changelog entry at the bottom of the affected file.
3. AI agent must **not** silently rewrite specs. Always surface a diff for human review.
4. Bumping `version:` is human-only.

---

## 6. Reading shortcut for a fresh agent

```text
Order: 00 → 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12
First-pass time budget: ~10 min for an LLM with 200k context.
Re-read 02-AGENT-RULES.md before every commit.
```
