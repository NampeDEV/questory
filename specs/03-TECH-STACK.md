---
id: SPEC-03
title: Tech Stack & Conventions
version: 2.0.0
status: active
requires: [SPEC-00-INDEX, SPEC-02]
audience: [agent, engineer]
owner: engineering
last_updated: 2026-05-26
---

# 03 — Tech Stack

## STACK-001 · Runtime & framework

| Layer | Choice | Version pin | Reason |
|---|---|---|---|
| Node | Node.js | `>=20.11 <21` | LTS, native fetch, undici |
| Package manager | pnpm | `>=9` | Strict, fast, monorepo-friendly |
| Framework | Next.js | `^15.0.0` (App Router) | RSC, route handlers, image opt |
| Language | TypeScript | `^5.4` strict | Type safety end-to-end |
| Styling | Tailwind CSS | `^3.4` | Token-driven, design system fit |
| UI primitives | Radix UI + custom | latest | Headless, a11y |
| Forms | React Hook Form + Zod | `^7` / `^3` | Schema-validated |
| State (client) | Zustand | `^4` | Tiny, no boilerplate |
| State (server) | TanStack Query | `^5` | Cache + suspense |
| Auth | Supabase Auth | latest | Email + Google |
| DB / Storage | Supabase (Postgres + Storage) | latest | One BaaS, RLS, signed URLs |
| Maps | Mapbox GL JS | `^3` | Better Thai tiles than GMaps for outdoor |
| Analytics | PostHog (self-host or cloud) | latest | Product analytics + flags |
| Errors | Sentry | latest | Source maps, RUM |
| Image hosting | Supabase Storage (POC), Cloudflare R2 (prod) | — | — |
| Deploy | Vercel (POC) | — | Zero-config Next.js |

## STACK-002 · Required dev tooling

```jsonc
// package.json (excerpt)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint && eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "storybook": "storybook dev -p 6006",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "@types/node": "^20",
    "@typescript-eslint/eslint-plugin": "^7",
    "@typescript-eslint/parser": "^7",
    "eslint": "^9",
    "eslint-config-next": "^15",
    "prettier": "^3",
    "prettier-plugin-tailwindcss": "^0.5",
    "storybook": "^8",
    "vitest": "^1",
    "@testing-library/react": "^14",
    "playwright": "^1"
  }
}
```

## STACK-003 · ESLint baseline

```jsonc
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react/self-closing-comp": "error",
    "no-restricted-imports": ["error", {
      "patterns": [{
        "group": ["@/data/*"],
        "message": "Import mock data through src/lib/api/* facade only."
      }]
    }]
  }
}
```

## STACK-004 · Tailwind config (tokens come from SPEC-05)

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { colors, fontSize, radius, shadow } from './src/styles/tokens';

export default {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: { colors, fontSize, borderRadius: radius, boxShadow: shadow }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
} satisfies Config;
```

## STACK-005 · TypeScript config

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```

## STACK-006 · Folder-level conventions

- `src/app/`            → Next.js App Router routes (server components by default).
- `src/components/`     → Reusable React components (client by default if interactive).
- `src/data/`           → Typed mock data (replaced by API later).
- `src/lib/api/`        → Data-access facade. Swap mock ↔ real here.
- `src/lib/utils/`      → Pure helpers (currency, date, slug).
- `src/lib/hooks/`      → Custom hooks.
- `src/types/`          → Shared TypeScript types (mirror `06-DATA-MODEL.md`).
- `src/styles/`         → Tokens + globals.
- `src/config/`         → Static config (site metadata, nav, feature flags).

Full tree in `04-REPO-STRUCTURE.md`.

## STACK-007 · Environment variables

| Var | Purpose | POC value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | — |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | — |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | — |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token | — |
| `OPENAI_API_KEY` or `AZURE_OPENAI_*` | AI plugins | — |
| `NEXT_PUBLIC_POSTHOG_KEY` | Analytics | — |
| `SENTRY_DSN` | Error reporting | — |
| `NEXT_PUBLIC_FEATURE_AI_PLANNER` | Flag | `"false"` until M5 |

Use `.env.example` checked into the repo; never commit `.env.local`.

## STACK-008 · Feature flags

All non-MVP features ship behind a `NEXT_PUBLIC_FEATURE_*` env flag. Defaults to off.

- `NEXT_PUBLIC_FEATURE_AI_PLANNER`
- `NEXT_PUBLIC_FEATURE_PUBLIC_MEMORY_WALL`
- `NEXT_PUBLIC_FEATURE_PLAN_MARKETPLACE`

## STACK-009 · Deployment targets

| Env | URL | Trigger | Notes |
|---|---|---|---|
| Local | `localhost:3000` | `pnpm dev` | — |
| Preview | `*.vercel.app` per PR | Push to PR branch | Mock data only |
| Staging | `staging.npq.app` | Merge to `develop` | Supabase staging |
| Prod | `npq.app` | Tag `v*.*.*` | Manual approval gate |

---

## Changelog
- 2026-05-26 · v2.0.0 · New file — extracted tech stack from `README.md` v1, pinned versions, added env vars and feature flags.
