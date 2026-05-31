# Questory — AI-Ready Spec Pack v2

> **Audience:** AI Coding Agents (Cursor / Claude Code / Copilot / Codex) + Human Engineers
> **Format:** Machine-readable Markdown with YAML frontmatter + canonical IDs
> **Source of truth:** This folder. Older root-level `*.md` files are deprecated.

---

## 0. How an AI Agent should read this pack

Read in this exact order. Each file declares its own `requires:` block — never jump ahead.

| Order | File | Role |
|---:|---|---|
| 1 | `00-INDEX.md` | Map of every spec ID, cross-references, glossary |
| 2 | `01-PROJECT-CONTEXT.md` | What we are building and why |
| 3 | `02-AGENT-RULES.md` | Behavioural contract: do / don't / output format |
| 4 | `03-TECH-STACK.md` | Stack pins, dependency versions, conventions |
| 5 | `04-REPO-STRUCTURE.md` | Exact folder tree the agent must materialize |
| 6 | `05-DESIGN-SYSTEM.md` | Tokens, components, motion, a11y |
| 7 | `06-DATA-MODEL.md` | Database schema + TypeScript types |
| 8 | `07-API-CONTRACT.md` | REST endpoints, request/response shapes |
| 9 | `08-FRONTEND-SPEC.md` | Routes, pages, components, states |
| 10 | `09-AI-FEATURES.md` | AI plugins, prompts, cost limits |
| 11 | `10-PRODUCT-COMMERCE.md` | SKUs, pricing, fulfilment rules |
| 12 | `11-BUILD-PLAN.md` | Milestone-by-milestone execution plan |
| 13 | `12-ACCEPTANCE.md` | Definition of done, KPIs, test matrix |

---

## 1. Quick-start prompt for an AI agent

```text
You are implementing the project defined in ./specs/.
1. Read 00-INDEX.md, then 02-AGENT-RULES.md before any edit.
2. Materialize the folder tree from 04-REPO-STRUCTURE.md exactly.
3. Follow milestones in 11-BUILD-PLAN.md in order (M0 → M6).
4. Stop and report at each milestone Definition of Done in 12-ACCEPTANCE.md.
5. Use mock data from /src/data/ until API contracts in 07-API-CONTRACT.md are wired.
6. Never invent fields not in 06-DATA-MODEL.md. Never change tokens in 05-DESIGN-SYSTEM.md.
```

---

## 2. Spec ID Convention

Every requirement has a stable ID so agents and PRs can reference it.

| Prefix | Meaning | Example |
|---|---|---|
| `CTX-` | Project context / vision | `CTX-001` |
| `RULE-` | Agent rule | `RULE-014` |
| `STACK-` | Tech stack pin | `STACK-002` |
| `FS-` | Folder/file requirement | `FS-021` |
| `DS-` | Design system token / component | `DS-COLOR-007` |
| `DM-` | Data model table / column | `DM-USER-001` |
| `API-` | API endpoint | `API-BOARDS-GET` |
| `FE-` | Frontend page / component | `FE-PAGE-HOME` |
| `AI-` | AI feature | `AI-PLANNER-001` |
| `PROD-` | Product / SKU | `PROD-STARTER-10` |
| `M-` | Milestone | `M-2-WEBSITE` |
| `AC-` | Acceptance criterion | `AC-LANDING-001` |

If a commit closes an ID, reference it: `feat(home): hero section (FE-PAGE-HOME, AC-LANDING-001)`.

---

## 3. File frontmatter contract

Every spec file starts with:

```yaml
---
id: <FILE-ID>           # e.g. SPEC-04-REPO-STRUCTURE
title: <Human title>
version: 2.0.0
status: active          # active | draft | deprecated
requires: [SPEC-01-PROJECT-CONTEXT, SPEC-02-AGENT-RULES]
audience: [agent, engineer]
owner: product
last_updated: 2026-05-26
---
```

`requires:` is enforced read-order. An agent must have read every required spec before acting on the current one.

---

## 4. What changed vs. v1

| v1 file | v2 replacement | Why |
|---|---|---|
| `README.md` (root) | `specs/README.md` + `00-INDEX.md` | Index separated from prose |
| `DESIGN.md` | `01-PROJECT-CONTEXT.md` + `08-FRONTEND-SPEC.md` | Vision separated from UI scope |
| `AGENTS.md` | `02-AGENT-RULES.md` | Stricter do/don't, ID references |
| `STYLE_AGENT.md` | `05-DESIGN-SYSTEM.md` | Tokens promoted to canonical IDs |
| `FRONTEND_SCOPE.md` | `04-REPO-STRUCTURE.md` + `08-FRONTEND-SPEC.md` | Folder tree split out |
| `DATA_API.md` | `06-DATA-MODEL.md` + `07-API-CONTRACT.md` | Storage vs. transport separated |
| `AI_FEATURES.md` | `09-AI-FEATURES.md` | Prompts + cost limits formalised |
| `PRODUCT_COMMERCE.md` | `10-PRODUCT-COMMERCE.md` | SKU IDs added |
| `POC_PLAN.md` | `11-BUILD-PLAN.md` + `12-ACCEPTANCE.md` | Plan separated from acceptance |

All v1 content is preserved; only structure and IDs are new.
