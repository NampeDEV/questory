---
id: SPEC-05
title: Design System
version: 2.0.0
status: active
requires: [SPEC-00-INDEX, SPEC-02]
audience: [agent, designer]
owner: design
last_updated: 2026-05-26
---

# 05 — Design System

## DS-MOOD-001 · Visual direction

> Premium Thai National Park Passport + Adventure Collector Board + Modern SaaS.

Reference moods: misty mountain at dawn, dim forest, parchment journal, wooden collector frame, enamel pin tray.

## DS-COLOR · Color tokens

Implemented as Tailwind theme via `src/styles/tokens.ts`. Never inline arbitrary hex.

| Token ID | Var | Hex | Tailwind class |
|---|---|---|---|
| DS-COLOR-001 | `--color-forest-950` | `#071B16` | `bg-forest-950` |
| DS-COLOR-002 | `--color-forest-900` | `#0B2A22` | `bg-forest-900` |
| DS-COLOR-003 | `--color-forest-800` | `#12382E` | `bg-forest-800` |
| DS-COLOR-004 | `--color-forest-700` | `#1E4D3E` | `bg-forest-700` |
| DS-COLOR-005 | `--color-moss-500` | `#6F8F4E` | `bg-moss-500` |
| DS-COLOR-006 | `--color-gold-500` | `#D6A84F` | `bg-gold-500` |
| DS-COLOR-007 | `--color-gold-400` | `#E9C46A` | `bg-gold-400` |
| DS-COLOR-008 | `--color-sand-100` | `#F5EFE3` | `bg-sand-100` |
| DS-COLOR-009 | `--color-sand-200` | `#E8DDC8` | `bg-sand-200` |
| DS-COLOR-010 | `--color-parchment` | `#FBF6EA` | `bg-parchment` |
| DS-COLOR-011 | `--color-ink` | `#17211D` | `text-ink` |
| DS-COLOR-012 | `--color-muted` | `#6D746F` | `text-muted` |
| DS-COLOR-013 | `--color-danger` | `#B85C38` | `text-danger` |
| DS-COLOR-014 | `--color-success` | `#2F7D55` | `text-success` |

### DS-COLOR-USAGE · Allowed usage matrix

| Surface | Color |
|---|---|
| Dark hero background | `forest-950` / `forest-900` |
| Primary CTA | `forest-800` (text white) |
| Premium / Limited CTA | `gold-500` (text `forest-950`) |
| Page background (light) | `parchment` |
| Card surface | `rgba(255,250,240,0.92)` (`bg-card`) |
| Body text | `ink` |
| Muted text / meta | `muted` |
| Success state | `success` |
| Warning / "limited" | `gold-500` |
| Error / danger | `danger` |

## DS-TYPE · Typography

```ts
// src/styles/tokens.ts (excerpt)
export const fontSize = {
  xs:   ['12px', { lineHeight: '1.5' }],
  sm:   ['14px', { lineHeight: '1.55' }],
  base: ['16px', { lineHeight: '1.6' }],
  lg:   ['18px', { lineHeight: '1.55' }],
  xl:   ['24px', { lineHeight: '1.4' }],
  '2xl':['32px', { lineHeight: '1.3' }],
  '3xl':['44px', { lineHeight: '1.2' }],
  hero: ['64px', { lineHeight: '1.05', letterSpacing: '-0.01em' }]
};
```

Font families:

```ts
// src/styles/fonts.ts
import { Noto_Sans_Thai, Noto_Serif_Thai, Inter, Playfair_Display } from 'next/font/google';

export const sans = Noto_Sans_Thai({ subsets: ['thai', 'latin'], variable: '--font-sans' });
export const inter = Inter({ subsets: ['latin'], variable: '--font-sans-en' });
export const serif = Noto_Serif_Thai({ subsets: ['thai'], variable: '--font-serif' });
export const display = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });
```

Stack order:

| Token | Stack |
|---|---|
| `font-sans` | `"Noto Sans Thai", "Inter", system-ui, sans-serif` |
| `font-serif` | `"Noto Serif Thai", "Playfair Display", serif` |

## DS-RADIUS

```ts
export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  pill: '9999px'
};
```

## DS-SHADOW

```ts
export const shadow = {
  card:   '0 12px 40px rgba(7, 27, 22, 0.12)',
  lift:   '0 16px 48px rgba(7, 27, 22, 0.18)',
  inset:  'inset 0 1px 0 rgba(255,255,255,0.6)',
  badge:  '0 0 0 2px rgba(214,168,79,0.4)'
};
```

## DS-COMP-BUTTON · Buttons

| Variant | Background | Text | Use |
|---|---|---|---|
| `primary` | `forest-800` | white | Default CTA |
| `gold` | `gold-500` | `forest-950` | "Start Quest", "Sign Up", "Limited Box" |
| `secondary` | transparent / sand | `forest-900`, border `forest-700` | Tertiary actions |
| `ghost` | transparent | `forest-900` | Inline links |
| `danger` | `danger` | white | Destructive only |

Geometry: radius `md` (12px), padding `14px 24px`, font weight 600, optional left icon.

Tap target ≥ 44 × 44 px on mobile (RULE-008).

## DS-COMP-CARD · Card

```css
background: rgba(255, 250, 240, 0.92);   /* bg-card */
border: 1px solid rgba(13, 43, 35, 0.08);
border-radius: 20px;                      /* rounded-xl */
box-shadow: var(--shadow-card);
```

Hover: lift 4 px (`translate-y-[-4px] shadow-lift`), transition 200 ms ease-out.

## DS-COMP-BADGE · Rarity color matrix

| Rarity | Background | Text | Glow on unlock |
|---|---|---|---|
| common | `moss-500` | white | none |
| uncommon | `#5F9080` (blue-green) | white | subtle |
| rare | `gold-500` | `forest-950` | soft gold |
| epic | `#7B5BA6` (purple accent) | white | strong purple |
| legendary | linear-gradient(`gold-500`, `forest-950`) | white | gold pulse |

## DS-COMP-PROGRESS · Progress bar

- Track: `sand-200`
- Fill (default): `forest-700`
- Fill (completed milestone): `gold-500`
- Height: 8 px on cards, 12 px on board detail.
- Label: `3 / 10 Parks` (Thai context allowed: `3 / 10 อุทยาน`).

## DS-COMP-ICON

- Library: `lucide-react` (line, slight rounded).
- Custom park-category icons live in `src/components/icons/`.
- Always pair with a text label or `aria-label`.

Required categories: Mountain, Waterfall, Marine, Forest, Compass, Map, Camera, Badge, Pin, QR, Backpack, Shield, Truck.

## DS-COMP-INPUT

- Border: 1px `forest-700` at 30% opacity.
- Background: `parchment`.
- Focus: ring `gold-400` 2 px outside, `forest-700` 1 px inside.
- Error: ring `danger`, helper text `danger`.

## DS-MOTION · Motion catalog

| Token | Use | Spec |
|---|---|---|
| DS-MOTION-001 | Card hover lift | translateY(-4px), 200ms ease-out |
| DS-MOTION-002 | Badge unlock glow | 1.2s gold pulse on first paint |
| DS-MOTION-003 | Progress bar fill | width transition 600ms ease-out |
| DS-MOTION-004 | Pin claim confetti | once, 1.5s, ≤20 particles |
| DS-MOTION-005 | Hero fade in | opacity 0→1, 400ms, on mount |
| DS-MOTION-006 | Tab transition | crossfade 150ms |

Avoid: parallax, neon, looping background animations, heavy Lottie.

`prefers-reduced-motion: reduce` → disable DS-MOTION-002, -004, -005.

## DS-LAYOUT · Layout rules

- Desktop max content width: 1280 px.
- 12-column grid, 24 px gutter.
- App (mobile) width: 390 px reference.
- Hero height: 560–720 px.
- Card grid: 3–4 cols desktop / 2 tablet / 1 mobile.

## DS-IMAGE · Image direction

| Surface | Style |
|---|---|
| Hero | Misty mountain, person with backpack, cinematic dawn/dusk, wide landscape |
| Product | Wooden board on table, enamel pins macro, gift box, QR card, passport booklet |
| App backgrounds | Cream parchment with subtle contour-line texture |
| Pin renders | Transparent PNG, soft drop shadow, hexagon backing |

Asset format: WebP / AVIF preferred. PNG only when transparency required.

## DS-A11Y

- Body text ≥ 14 px.
- All interactive ≥ 44 × 44 px.
- Color contrast AA on hero / gold.
- Status never color-only — pair with icon + label.
- All icon-only buttons require `aria-label`.
- Thai text line-height ≥ 1.5; never letter-space negative.

## DS-NEG · What to never produce

- Generic travel-booking layout.
- Facebook-style social feed.
- Childish or gaming neon.
- Map as homepage hero.
- Hiding the physical board / pins.
- Cheap-ecommerce shop aesthetics (orange "Buy Now" banners etc).

---

## Changelog
- 2026-05-26 · v2.0.0 · Rewrote `STYLE_AGENT.md` v1 with canonical token IDs and motion catalog.
