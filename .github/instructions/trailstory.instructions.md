---
applyTo: "src/**"
---
# Questory — Coding Instructions (SPEC-02 / SPEC-03)

## Identity
You are shipping **Questory** — a premium Thai outdoor adventure app.  
Optimize for: premium feel · clear core loop · production-quality TypeScript · maintainable by a 2–3 person team.

## Mandatory Rules

### Architecture
- Framework: **Next.js 15 App Router** — use Server Components by default; `'use client'` only when needed
- Language: **TypeScript strict** — `strict: true`, `noUncheckedIndexedAccess: true`
- Never use `any` — use proper types or `unknown` with narrowing
- Array index access returns `T | undefined` — always use `arr[0]!` or a type guard

### Component Rules
- One component per file, **named export** matching filename (no default exports for components)
- Functional components only (no class components)
- `'use client'` at the very top of the file when needed
- `Button` with `asChild` must have **exactly one React element child** — no sibling nodes (breaks `Slot`)

### Import Rules
- `@/data/*` only allowed inside `src/lib/api/**` and `src/data/**`
- Components import data via `@/lib/api/*` facade, never `@/data/*` directly
- Use `import type { ... }` for type-only imports
- Internal navigation: always `<Link href="...">` from `next/link`, never `<a href="...">`

### Styling
- Tailwind utility classes only — no `.css` files except `src/styles/globals.css`
- Use `cn()` helper for conditional classes — never string-concatenate class names
- Use design tokens only: colors `forest / gold / sand / parchment / moss / ink / muted / danger / success`
- No inline arbitrary hex colors

### Copy & Language
- Body copy: **Thai**
- Headlines / nav / premium accents: English OK
- No mixed language in same sentence (❌ `เริ่ม Quest ของคุณ`)

### File Conventions
- Component files: `PascalCase.tsx`
- Hook files: `camelCase` with `use` prefix
- Util files: `kebab-case.ts`
- Route folders: `kebab-case`
- Files end with trailing newline, no trailing whitespace

## Security (OWASP Baseline)
- Never interpolate user input into SQL or shell commands — use parameterized queries
- Never use `dangerouslySetInnerHTML`, `innerHTML`, or `eval()` with user data
- Never hardcode API keys, tokens, or passwords — use `.env.local`
- Never log passwords, tokens, PII, or card numbers
- Use `Math.random()` for UI only — never for tokens/IDs (use `crypto.randomUUID()`)
- Cookies must be `Secure`, `HttpOnly`, `SameSite=Lax`

## Safety (RULE-007)
Every mission submission UI must include verbatim:
> ส่งหลักฐานจากจุดที่ปลอดภัยเท่านั้น ความปลอดภัยสำคัญกว่า Badge

Never gamify dangerous behavior (cliffs, restricted zones, drones in no-fly zones).

## Definition of Done
A change is done only when `pnpm lint && pnpm typecheck && pnpm build` all exit 0.
