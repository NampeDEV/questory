---
id: SPEC-06
title: Data Model
version: 2.0.0
status: active
requires: [SPEC-00-INDEX, SPEC-02]
audience: [agent, engineer]
owner: engineering
last_updated: 2026-05-26
---

# 06 — Data Model

> The DB schema below is the **single source of truth**. TypeScript types in `src/types/` must mirror it 1:1. Never add fields here without bumping the version.

## DM-OVERVIEW · ER overview

```text
┌──────────────┐       ┌────────────────────┐
│   users      │1 ────n│    user_boards     │n──┐
└──────┬───────┘       └────────┬───────────┘   │
       │                        │               │
       │1                       │n              │
       │                        │               │
       ▼                        ▼               │
┌──────────────┐       ┌────────────────────┐  │
│  memories    │n─────1│ mission_submissions│  │
└──────┬───────┘       └────────┬───────────┘  │
       │1                       │n             │
       │                        ▼              │
       │              ┌────────────────────┐   │
       │              │   user_badges      │n──┘ via mission_submission_id
       │              └────────┬───────────┘
       │                       │1
       │                       ▼
       │              ┌────────────────────┐
       │              │     badges         │1──n┌──────┐
       │              └────────────────────┘    │ pins │
       │                                        └──┬───┘
       │                                           │1
       │                                           ▼
       │                                  ┌────────────────┐
       │                                  │   pin_claims   │
       │                                  └────────────────┘
       │
       ▼
┌──────────────┐
│ board_templates │1──n missions
└──────────────┘     1──n products
                     1──n plans
```

## DM-USER · users

| Col | Type | Constraint | Notes |
|---|---|---|---|
| `id` | uuid | PK | auth.users foreign id |
| `display_name` | text | not null | |
| `email` | text | unique | |
| `avatar_url` | text | nullable | |
| `created_at` | timestamptz | default now() | |

```ts
// src/types/user.ts
export type User = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
};
```

## DM-BOARD-TEMPLATE · board_templates

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text unique | URL-safe |
| `name` | text | |
| `description` | text | |
| `category` | text | starter / regional / ultimate / custom |
| `quest_count` | int | denormalized for cards |
| `cover_image_url` | text | |
| `price_thb` | int | |
| `status` | text | draft / active / archived |
| `created_at` | timestamptz | |

```ts
export type BoardTemplate = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: 'starter' | 'regional' | 'ultimate' | 'custom';
  questCount: number;
  coverImageUrl: string;
  priceThb: number;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
};
```

## DM-USER-BOARD · user_boards

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | |
| `board_template_id` | uuid FK → board_templates | |
| `activation_code` | text | unique per template |
| `activated_at` | timestamptz | |
| `progress_completed` | int | |
| `progress_total` | int | denormalized for fast reads |
| `status` | text | active / completed / archived |

## DM-MISSION · missions

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `board_template_id` | uuid FK | |
| `name` | text | |
| `description` | text | |
| `park_name` | text | |
| `park_code` | text | e.g. `DOI_INTHANON` |
| `region` | text | north / central / northeast / east / south |
| `category` | text | mountain / waterfall / marine / forest |
| `difficulty` | text | easy / medium / hard |
| `latitude` | numeric | |
| `longitude` | numeric | |
| `cover_image_url` | text | |
| `reward_badge_id` | uuid FK → badges | |
| `sort_order` | int | |
| `status` | text | active / archived |

```ts
export type Mission = {
  id: string;
  boardTemplateId: string;
  name: string;
  description: string;
  parkName: string;
  parkCode: string;
  region: 'north' | 'central' | 'northeast' | 'east' | 'south';
  category: 'mountain' | 'waterfall' | 'marine' | 'forest';
  difficulty: 'easy' | 'medium' | 'hard';
  latitude: number;
  longitude: number;
  coverImageUrl: string;
  rewardBadgeId: string;
  sortOrder: number;
  status: 'active' | 'archived';
};
```

## DM-SUBMISSION · mission_submissions

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `user_board_id` | uuid FK | |
| `mission_id` | uuid FK | |
| `photo_url` | text | Supabase Storage signed URL |
| `latitude` | numeric | |
| `longitude` | numeric | |
| `travel_date` | date | |
| `memory_note` | text | nullable |
| `share_permission` | boolean | default false |
| `status` | text | pending / approved / need_more_info / rejected |
| `reviewer_note` | text | nullable |
| `reviewed_at` | timestamptz | nullable |
| `created_at` | timestamptz | |

### DM-SUBMISSION-STATE · State machine

```text
pending ──(admin approve)──► approved ──► (unlocks badge → enables pin claim)
   │
   ├──(admin request-info)──► need_more_info ──(user resubmits)──► pending
   │
   └──(admin reject)─────────► rejected (terminal)
```

## DM-MEMORY · memories

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `mission_submission_id` | uuid FK | |
| `title` | text | |
| `note` | text | |
| `photo_urls` | jsonb | array of strings |
| `location_name` | text | |
| `travel_date` | date | |
| `visibility` | text | **default `private`** |
| `created_at` | timestamptz | |

Visibility is `private` unless user explicitly opts to `public` or `unlisted` (RULE-010).

## DM-BADGE · badges

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `name` | text | |
| `description` | text | |
| `image_url` | text | |
| `rarity` | text | common / uncommon / rare / epic / legendary |
| `category` | text | mountain / waterfall / marine / forest / completion / region |

## DM-USER-BADGE · user_badges

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `badge_id` | uuid FK | |
| `mission_submission_id` | uuid | nullable (region/completion badges) |
| `unlocked_at` | timestamptz | |

## DM-PIN · pins

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `badge_id` | uuid FK → badges | 1:1 with the badge it physicalizes |
| `name` | text | |
| `sku` | text unique | e.g. `PIN-DOI-INTHANON-V1` |
| `image_url` | text | transparent PNG |
| `rarity` | text | mirrors badge |
| `inventory_count` | int | |

## DM-PIN-CLAIM · pin_claims

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `pin_id` | uuid FK | |
| `mission_submission_id` | uuid FK | |
| `shipping_name` | text | PII |
| `shipping_phone` | text | PII |
| `shipping_address` | text | PII |
| `shipping_fee_thb` | int | |
| `status` | text | available / claimed / processing / shipped / delivered |
| `tracking_number` | text | nullable |
| `created_at` | timestamptz | |

### DM-PIN-CLAIM-STATE

```text
available → claimed → processing → shipped → delivered
```

## DM-PLAN · plans

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text unique | |
| `title` | text | |
| `description` | text | |
| `cover_image_url` | text | |
| `duration_days` | int | |
| `budget_min_thb` | int | |
| `budget_max_thb` | int | |
| `difficulty` | text | easy / medium / hard |
| `creator_id` | uuid | nullable (official plans) |
| `copy_count` | int | denormalized |
| `status` | text | draft / active / archived |

## DM-PLAN-ITEM · plan_items

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `plan_id` | uuid FK | |
| `day_number` | int | |
| `title` | text | |
| `description` | text | |
| `location_name` | text | |
| `latitude` | numeric | |
| `longitude` | numeric | |
| `estimated_cost_thb` | int | |
| `sort_order` | int | |

## DM-PRODUCT · products

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text unique | |
| `name` | text | |
| `description` | text | |
| `type` | text | board / pin_set / gift_box / sticker / passport |
| `price_thb` | int | |
| `image_urls` | jsonb | |
| `stock_count` | int | |
| `status` | text | active / sold_out / archived |

## DM-ORDER · orders

| Col | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `total_thb` | int | |
| `status` | text | draft / paid / processing / shipped / delivered / cancelled |
| `shipping_address` | text | PII |
| `tracking_number` | text | nullable |
| `created_at` | timestamptz | |

## DM-RLS · Row-level security baseline

| Table | Policy |
|---|---|
| `users` | Self read/update. Admin full. |
| `user_boards` | Self read/update. Admin full. |
| `mission_submissions` | Self insert/read. Admin update status. |
| `memories` | Self all. Public read when `visibility = 'public'`. |
| `pin_claims` | Self insert/read. Admin update status. |
| `orders` | Self read. Admin full. |
| `board_templates` / `missions` / `plans` / `products` / `badges` / `pins` | Public read where `status = 'active'`. Admin write. |

## DM-INDEXES

- `mission_submissions (user_id, status, created_at desc)`
- `user_boards (user_id, status)`
- `pin_claims (user_id, status)`
- `plans (status, copy_count desc)`
- `missions (board_template_id, sort_order)`

## DM-MIGRATIONS

Live in `supabase/migrations/<timestamp>_<name>.sql`. One table or change per migration.

---

## Changelog
- 2026-05-26 · v2.0.0 · Formalized v1 `DATA_API.md` schema with state machines, RLS baseline, TS-type stubs, indexes.
