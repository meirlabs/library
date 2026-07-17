---
name: design
description: The meirlabs design rules for a product's visual layer — brand tokens, fixed structure, and the rules everything defers to. Load when styling any app in the meirlabs family.
---

# Design Rules

The non-negotiable rules for a meirlabs product's visual layer — the SaaS app surface (`apps/web`). This file is a **template**: the brand lives in the **Start here** token block; everything below it is fixed. Fill the block once per project and the whole document snaps to the new brand — same intricacy, different skin.

Anything not covered here defers to the shared meirlabs design foundation.

In a hurry? **The non-negotiables** at the end are the one-screen version.

| Part | Covers |
|---|---|
| **Start here — brand tokens** | The intake script, the token block, the dark theme, the accent fork |
| **Scaffold manifest** | Where every named artifact actually lives, and how to get it |
| **Foundations** | Typography · Spacing · Color · CSS hygiene · Icons · Favicon · Performance |
| **Layout & surfaces** | Layout stability · Scroll edge fades · Horizontal rails · Touch targets |
| **Components** | Primitives · The label register · Buttons · Inputs · Segmented switcher · Tooltips & hints · Empty states |
| **Motion & feel** | Motion · Haptics · Graphs & charts |
| **The non-negotiables** | Every law, one row each |

---

## Start here — brand tokens

> **For the agent starting a new project:** before writing a single line of UI, run this intake in order.
> **1.** Ask the questions in the order the block below lists them — theme, neutrals, accent (or none), type, shape, identity — each with the meirlabs default pre-selected. "You decide" accepts the default.
> **2.** Status tokens and `--brand-radius-pill` are silent defaults — confirm them only if the user raises them.
> **3.** The law wins over brand requests: if an answer violates a rule below, say so and offer the nearest compliant value.
> **4.** Route the identity values: `{{APP_NAME}}` goes to metadata and the header wordmark; `{{LOGO}}` and `{{FAVICON}}` go to `/public`. The token block receives only CSS values.
> Write the answers into `globals.css` as the `--brand-*` custom properties below, then build against the token names — never hardcode a hex or a font again. Anything this doc doesn't cover defers to `~/.claude/CLAUDE.md`, the shared `design/foundation/` tokens, and `DESIGN-SAAS.md`. Don't guess a brand.

Every brand decision is one named token. The rest of the doc speaks in these tokens (`--brand-fg`, `--brand-primary`, `--brand-font-sans`, …), never a raw value.

```
:root {
  /* ── Theme ──────────────────────────────────────────────────────
     {{THEME}}: light | dark | both        meirlabs default → dark
     As a CSS value "both" is written `light dark` — never the word. */
  color-scheme: {{dark}};

  /* ── Neutrals — 3 background levels, 4 text levels ──────────────
     Light values; the dark ramp is defined below the block.         */
  --brand-bg:            {{#FFFFFF}};  /* base page                    */
  --brand-surface-2:     {{#FAFAFA}};  /* raised / alternating / cards */
  --brand-surface-3:     {{#F5F5F5}};  /* chip track / input fill      */
  --brand-fg:            {{#0A0A0A}};  /* titles, key labels (not #000)*/
  --brand-fg-2:          {{#525252}};  /* body                         */
  --brand-fg-muted:      {{#6B7280}};  /* hints, captions, metadata    */
  --brand-fg-disabled:   {{#9CA3AF}};
  --brand-border:        {{#E5E7EB}};  /* default                      */
  --brand-border-strong: {{#D1D5DB}};  /* emphasized                   */
  --brand-border-subtle: {{#F3F4F6}};  /* hairline dividers            */

  /* ── Accent — the one real branding lever ─────────────────────────
     Does this brand have an accent color?
       NO  (meirlabs default) → --brand-primary IS --brand-fg (near-black).
       YES → set the hue + states; use it for meaning, never decoration. */
  --brand-primary:       {{var(--brand-fg) | #hex}};
  --brand-primary-hover: {{color-mix(in oklch, var(--brand-primary) 88%, black)}};
                         /* ≈ −6% OKLCH lightness; #171717 in the no-accent case */
  --brand-on-primary:    {{#FFFFFF}};  /* text/icon on a primary fill  */

  /* ── Status — functional, rarely rebranded ────────────────────── */
  --brand-success: #16A34A;  --brand-warning: #CA8A04;
  --brand-error:   #DC2626;  --brand-info:    #2563EB;

  /* ── Type ─────────────────────────────────────────────────────── */
  --brand-font-sans: {{Geist}};       --brand-font-mono: {{Geist Mono}};
  --brand-tracking:  {{-0.31px}};     /* global letter-spacing        */
  /* Load --brand-font-sans at weights 400/500/600 only — never load
     700, or the no-700 rule ships broken (next/font config included). */

  /* ── Shape ────────────────────────────────────────────────────── */
  --brand-radius-control: {{8px}};    /* buttons, inputs, small chips */
  --brand-radius-card:    {{12px}};   /* cards, sheets, grouped rows  */
  --brand-radius-pill:    9999px;
}
```

**Identity — fill these too; they just don't live in CSS:** `{{APP_NAME}}` (metadata + the header wordmark) · `{{LOGO}}` and `{{FAVICON}}` (assets in `/public`; the favicon ships environment-aware, → see Favicon).

**If the theme includes dark (the meirlabs default):** define the same `--brand-*` names a second time under a `[data-theme="dark"]` scope on `<html>` — components never branch on theme, only the tokens flip. ui-kit's own tokens key off a separate attribute, `data-meirlabs-theme`, so the theme switch sets **both** attributes on `<html>` in the same tick — `data-theme` flips the brand tokens, `data-meirlabs-theme` flips the kit's; toggle only one and the page renders half-themed. House ramp: backgrounds `#0A0A0A` → `#141414` → `#1C1C1C`, text `#EDEDED` — never pure white (`#FFFFFF`), the same softness rule as light's near-black. Borders lighten to `#262626` / `#3F3F46`; status hues step one shade brighter. Depth inverts too: dark surfaces read as lifted via an inset top-edge highlight and a perimeter ring, not darker drop shadows. The full ramp lives in the shared foundation. Theme switches apply a `.no-transitions` class for one frame so every color transition on the page doesn't strobe at once.

**How the accent decision cascades.** This is the fork that makes two meirlabs apps look like different products:

- **No accent (default).** `--brand-primary` = `--brand-fg`. "Primary / selected / pressed" is just near-black; color is spent only on meaning (success / warning / error / info). This is the restrained house style — reach for it unless the brand genuinely owns a color.
- **Has an accent.** `--brand-primary` is the brand hue. It fills the primary CTA, the segmented-control thumb, and selected states — and **nothing decorative**. One accent, used with discipline, reads as a brand; an accent sprayed across surfaces reads as undesigned.

**Once this block is filled, read the rest as law.**

---

## Scaffold manifest

This doc names artifacts a fresh scaffold doesn't ship. Each has exactly one canonical source — get it from there, in this order, before building screens.

| Artifact | Canonical source | Action |
|---|---|---|
| `ml-scroll-mask-*` utilities · thin scrollbars · stable gutter · motion tokens | `@meir-labs/ui-kit` → `base.css` / `tokens.css` | Ships in the kit — import, never re-declare |
| `.ml-btn-primary` · `Button` · `SegmentedControl` · `Modal` · `Card` · `Dropdown` · `Field` · tables · pagination · status pills · tags · metric values | `@meir-labs/ui-kit` components | Ships in the kit — import |
| `.t-modal` + `.t-modal-backdrop` + `useOverlayTransition` | homebase `apps/web/app/globals.css` + the `/design` catalog (`apps/web/app/(app)/design/primitive-source.ts`) | Copy verbatim |
| `CometLoader` · `Collapse` · `BottomSheet` · `Pill` · the props-based `EmptyState` | the `/design` catalog (`apps/web/app/(app)/design/primitive-source.ts`) | Copy verbatim into `components/ui/` |
| `il-float-down` / `il-pulse` / `il-sway` keyframes + the global reduced-motion rule | homebase `apps/web/app/globals.css` | Copy verbatim |
| `components/Illustrations.tsx` | homebase app | Copy the register; draw new illustrations inside it |
| `lib/haptics` (the ~15-line wrapper) | homebase `apps/web/lib/haptics.ts` | Copy verbatim · install: `npm i web-haptics` |
| `scripts/gen-favicons.mjs` + `public/favicon/*.png` | homebase `apps/web` | Copy the script; run `pnpm gen:favicons` against `public/logo.png` (→ see Favicon) |
| The global focus ring | printed under CSS hygiene below | Copy verbatim into `globals.css` |
| `--app-nav-space` | defined per app | Declare in `globals.css`: `88px` when a floating nav exists, `0px` otherwise |

Never reimplement these from the prose; the prose is the contract, the source is the implementation.

---

## Foundations

### Typography

- **Minimum font size: 12px.** Never `text-[11px]` / `text-[10px]` or smaller, including uppercase tracked micro-labels — those use `text-[12px]` too. If 12px feels too big for the space, change the layout (drop the label, move it to a tooltip, give it its own line), don't shrink the type.
- Computed font sizes clamp at 12px too (`Math.max(12, …)`).
- **Form controls are 16px minimum** — `input`, `textarea`, `select`. Anything smaller makes iOS Safari zoom the page on focus; the 12px floor is for reading text, not text you type into (→ see Inputs).
- **Two body sizes only: 14px and 16px.** No 15px in body copy — the label register's 15px/13px are label sizes, not body sizes (→ see The label register).
- **No display sizes in-app.** Page titles cap around 28px; hero type belongs on the landing page.
- Font family is `--brand-font-sans` / `--brand-font-mono`, set once globally — never `font-family` on a component.
- **Loading the brand sans** (meirlabs apps use Geist; wired 2026-07-10): install the `geist` npm package, add `GeistSans.variable` to the `<html>` className via next/font, and let the sans token pick it up through `var(--font-geist-sans, …)`. Geist has no Hebrew or Cyrillic glyphs — he/ru text intentionally falls back to the system stack. New projects get this from the starter.
- One global letter-spacing (`--brand-tracking`) on the body; don't re-tune tracking per element.
- **No 700 weight.** `font-weight: 700` never ships — medium (500) and semibold (600) carry every emphasis this system needs. Weight is a hierarchy tool, not a shout. The font loads at 400/500/600 only (→ see Start here), so 700 can't sneak in.
- Set `text-wrap: balance` on `h1`–`h3` and `text-wrap: pretty` on body copy, once, globally — no orphan words on two-line headings.
- `-webkit-font-smoothing: antialiased` on the body, set once.
- `tabular-nums` has a caveat: some fonts draw different-looking numerals in tabular mode — verify in `--brand-font-sans` before relying on it (this doc mandates it three times).

### Spacing

- **Everything sits on the 4px grid.** Every margin, padding, gap, and size is a multiple of 4 — when a layout looks subtly off, the fix is almost always snapping back to the grid, not a pixel nudge.
- **App defaults:** card padding 24px, element gap 16px, section gap 32px. On mobile, step each down one notch (24 → 16, 16 → 12).
- **Nested corners share a corner centre:** `outer = inner + padding`. When a nested radius lands off-scale, adjust the **padding** — never invent an in-between radius.
- Whitespace does the work — group with space and borders, not extra containers.
- The full spacing token table lives in the shared foundation; these four rules are the law.

### Color

Use the `--brand-*` tokens via the `[var(--brand-…)]` form the codebase already uses everywhere (`text-[var(--brand-fg-muted)]`, `bg-[var(--brand-surface-3)]`, `border-[var(--brand-border)]`). That form is the only form — no `text-zinc-*`, no `bg-slate-*`, no `text-white/70`, no one-off hex that shadows a token.

- **Backgrounds** — three neutral levels: `--brand-bg` (base page) → `--brand-surface-2` (raised / alternating) → `--brand-surface-3` (the usual chip or input fill).
- **Cards** are a `--brand-surface-2` fill with a 1px `--brand-border` — fill plus border, the house card.
- **Borders** — `--brand-border` (default), `--brand-border-strong` (emphasized), `--brand-border-subtle` (hairline dividers).
- **Text** — three intent levels: `--brand-fg` (titles / key labels), `--brand-fg-2` (body), `--brand-fg-muted` (hints / captions), plus `--brand-fg-disabled`. Use the **intent token**, not raw opacity.
- **Status** (by meaning, used sparingly): `--brand-success`, `--brand-warning`, `--brand-error`, `--brand-info`. Tinted status surfaces follow the `Pill` precedent — a pale tint fill with colored text, no border.
- **Never pure black for text** — `#000000` doesn't ship; `--brand-fg` is a near-black, softer and more legible.
- **No gradient page or section backgrounds** — they read as undesigned, AI-generated UI. The single sanctioned gradient is the primary button's control surface (→ see Buttons); everything else is a flat token.
- **Depth comes from borders and surface shifts — for anything in the page flow.** Cards never carry a shadow; never nest a card in a card. **Floating layers are the exception:** dropdowns, popovers, and modals lift with the shared stacked-shadow elevation system — multi-layer, never a single-layer `box-shadow`; deeper in the stack means more layers (dropdown < modal < command palette). Recipes live in the design foundation.
- **4.5:1** contrast minimum on all text (WCAG AA). Large text (24px+, or 19px+ semibold) may drop to 3:1; `--brand-fg-disabled` and placeholders are exempt (the WCAG inactive-control exemption).
- **3:1 on functional non-text** — input borders, meaningful icons, the focus ring; decorative dividers are exempt. In practice: inputs take a fill or a border darker than `--brand-border-strong` — don't outline a form field with a hairline.
- Status tokens are for fills, borders, and icons. As text they appear only inside tinted pills, where the pill supplies a darker text shade — never free-standing on `--brand-bg`. And don't set `--brand-fg-muted` text on `--brand-surface-3` — 4.43:1, just under the line.

### CSS hygiene

- **Classes and tokens, not inline styles.** Reserve `style={{…}}` for genuinely dynamic values: a data-driven dimension (`width: {pct}%` progress bars), a runtime persona color, a CSS var set for descendants, or a computed SVG transform-origin. Static styling in `style` is a bug — move it to classes.
- **The accepted exception to the inline-style rule:** `animation:` shorthands that reference keyframes defined in `globals.css` (decorative illustrations, the loading bar). Tailwind arbitrary `animate-[…]` with `cubic-bezier` is fragile, so inline `animation` pointing at a named global keyframe is fine.
- Focus rings, motion, and box-sizing are defined once in `globals.css` — don't re-declare them per component.
- **The focus ring, verbatim:**

```css
*:focus-visible { outline: 2px solid var(--brand-fg); outline-offset: 2px; }
```

- It targets `:focus-visible`, not `:focus`, so mouse clicks don't ring — the #1 reason teams delete focus styles. The 2px offset keeps it from blending into the control's own border. The color is neutral — a colored ring would fight the accent discipline. No element opts out.
- z-index comes from a fixed 4-step scale in `globals.css` (`--z-dropdown` / `--z-modal` / `--z-tooltip` / `--z-toast`); inside a component prefer `isolation: isolate` over any z-index.

### Icons

- **Only Hugeicons Pro.** Render with `<HugeiconsIcon>` from `@hugeicons/react`, icons imported from `@hugeicons-pro/core-stroke-rounded` (the default set). No `lucide-react`, no `@heroicons/react`, no raw `<svg>`. One exception: the bespoke decorative `components/Illustrations.tsx`.
- The Pro packages need an `.npmrc` with the Hugeicons Pro registry token — if it's absent, ask the user for their license key before installing.

```tsx
import { HugeiconsIcon } from '@hugeicons/react';
import { FireIcon } from '@hugeicons-pro/core-stroke-rounded';

<HugeiconsIcon icon={FireIcon} size={20} className="text-[var(--brand-fg-muted)]" />
{/* size={20} is the default; size={16} is the floor — never smaller */}
```

- **Default 20px, stroke 1.5**, in a ≥44px touch box where interactive; **16px is the floor**. Need a smaller indicator? Use a dot or a text chip, not a shrunken icon.
- **Color via text tokens only** — `text-[var(--brand-fg)]` / `-fg-2` / `-fg-muted` or a status token. No raw hex, no opacity modifiers; for a dimmer icon use `-fg-muted`.

### Favicon

Every app ships **the same logo, recolored per environment**, so a browser tab tells you at a glance whether you're on production, a preview deploy, or localhost: production is the untouched mark, preview (Vercel) hue-shifts violet, dev hue-shifts orange. **The shape never changes, only the hue.** The tint is the one sanctioned exception to the restrained palette because it only ever appears on browser chrome, never in product UI.

- **Three static PNGs, selected in `metadata.icons`.** Generate them from `public/logo.png` with `pnpm gen:favicons` (`scripts/gen-favicons.mjs`, an ImageMagick hue-rotate that preserves shape and alpha) into `public/favicon/{production,preview,development}.png`. The root layout picks the variant from `process.env.VERCEL_ENV ?? process.env.NODE_ENV` and sets it in `metadata.icons`: `VERCEL_ENV` is baked into each deployment's build, and locally `NODE_ENV` falls through to the orange dev icon.
- **No `app/icon.*` file, static or dynamic.** That convention emits a competing `<link rel="icon">`, can't branch on environment, and the `ImageResponse` route re-renders per request while recoloring a raster unreliably. Three pre-generated files are simpler, cacheable, and keep the production logo pixel-for-pixel intact. (`apple-icon.png`, the home-screen icon, can stay as the production mark; it doesn't need tinting.)
- **One source of truth.** Regenerate the variants whenever `public/logo.png` changes; never hand-edit the variant PNGs. The hue-rotate assumes a roughly single-hue mark: for a multi-colored logo, hand-tune the script's `-modulate` values or export three tinted PNGs from the design file.

### Performance

**The network is the enemy; the fastest request is the one you never make.** Speed is a feature decided at the start, not bolted on before launch. Every perf decision moves one of three levers, and you name which before touching anything: **ship less, load it in parallel** (bytes and round trips on the critical path), **feel instant** (the UI reacts in the same frame; the network happens behind the paint), **stay smooth** (60fps means animations and interactions stay off the layout/paint path and off the main thread). The how-to (recipes, audit workflow, CI) lives in the `web-performance` skill; these are the non-negotiables:

- **Animate only `transform` and `opacity`.** Never `width`, `height`, `top`, `left`, `margin`, `padding`, or `background` on a hot path: they trigger layout/paint every frame. A browser-pipeline fact, not a preference (durations and easing belong to Motion; this is the property rule).
- **`next/image` for every raster.** No raw `<img>` for photos, avatars, or hero art: AVIF/WebP, responsive `srcset`, and lazy-below-the-fold come free, and the one photo above the fold gets `priority`.
- **Fonts must not cost a paint.** Prefer the system stack (zero download). A truly load-bearing webfont is a single variable `woff2`, `font-display: swap`, with a `crossorigin`-matched `<link rel="preload">`; never both preload a font and let CSS fetch it too (that double-fetches).
- **No layout shift.** CLS budget is 0.1; reserve space for images, embeds, and late content (→ see Layout stability).
- **Static by default.** A page that can be static or ISR is never `force-dynamic`; reach for `dynamic` only where auth or per-request data genuinely requires it.
- **Third parties defer.** Analytics, chat widgets, and embeds never block first paint; PostHog loads after the app, not before it.
- **Budgets are per route, not per site.** A route-split app can ship a lot in aggregate and still load any one page fast; measure each route's critical path: LCP < 2.5s (mobile, 4G) · INP < 200ms · CLS < 0.1 · TTFB < 0.8s · first-load JS < ~130KB gzip per route.
- **Steal the feeling, not the engine.** Optimistic UI and no spinners come from SWR/TanStack Query's optimistic APIs; don't cargo-cult a local-first sync engine (IndexedDB as the source of truth, object pools, mutation queues) onto a normal Next.js site; that's a first-line-of-code architectural bet, not a retrofit.

---

## Layout & surfaces

### Layout stability

- **Scrollbars ship in the kit — don't re-declare them.** `@meir-labs/ui-kit` → `base.css` sets `scrollbar-gutter: stable` on `html` and thin scrollbars on every element via the universal `*` selector (`scrollbar-width` does not inherit — that's why it's `*`, not `html, body`). The thumb is `color-mix(in srgb, var(--ml-text-faint) 28%, transparent)` with a hover state. Never a `::-webkit-scrollbar` one-off in app CSS (rails are the sole exception, → see Horizontal rails).
- This deliberately diverges from Emil's "never customize the page scrollbar": the house accepts the grab-ability cost for visual quiet, and inner overflow regions — where thin bars matter most — inherit the same treatment for free.
- Every extra `overflow-y-auto` / `-scroll` region you create (sheet bodies, modals, scroll lists) also gets `[scrollbar-gutter:stable]` so showing/hiding the bar never shifts content.
- **Hiding, case one — the space must stay reserved:** use `visibility: hidden`; it also exits the tab order and the a11y tree for free. If you must fade, pair `opacity-0` with `inert` — or flip to `visibility: hidden` on `transitionend` — so an invisible control is never focusable.
- **Hiding, case two — the space should collapse:** unmount it or use `Collapse`. `display: none` is banned only where it would shift surrounding layout, not absolutely.
- **No layout shift on dynamic content.** `tabular-nums` for changing numbers; reserve space for a floating nav via `--app-nav-space` (e.g. `--app-nav-space: 88px` as bottom padding when a floating nav exists, `0px` otherwise — you declare it in `globals.css`); never change font weight on hover / selected.

### Scroll edge fades

- **Fade scroll edges, never stack gradient overlays.** Any overflow scroll container gets an `ml-scroll-mask-*` utility: the edge with more content fades, the edge you've reached goes crisp. Pure CSS scroll-driven animation, shipped in `@meir-labs/ui-kit` → `base.css` — no JS scroll listeners, no stacked gradient `<div>`.
- Static always-on fades hide content you've already reached — that's why they're banned elsewhere; this mask fades only the edge with more content, which is an affordance, not an obstruction.

| Utility | Fades |
|---|---|
| `ml-scroll-mask-t` / `-b` / `-y` | top / bottom / both (vertical lists) |
| `ml-scroll-mask-l` / `-r` / `-x` | left / right / both (horizontal rails) |

- The masked element must **itself** be the scroll container (`overflow-*`); the mask is tied to `scroll(self …)`. Wrapping it won't work.
- It clips children via `mask-image`, so don't put a sticky header **inside** the masked element — keep headers and handles as siblings above it.
- Fade depth is tunable per element via `--ml-scroll-mask: 32px` (default 24px).
- Under `prefers-reduced-motion` the mask degrades to a calm static both-edge fade — not to no fade.
- `@supports (animation-timeline: scroll())` gates it; unsupported browsers just show no fade. Don't add a JS fallback unless a specific screen needs one.
- **Sticky chrome gets a seam fade, not a hard divider.** Where content scrolls under a sticky nav or toolbar, prefer a small gradient/blur mask at the seam over a 1px border (only where the floating UI actually overlaps content): the content reads as passing under the chrome, not chopped by a line. Keep it subtle, and fall back to a plain border under `prefers-reduced-transparency`.

### Horizontal rails

- **Horizontal side-scroll rails are the default for more than 4 peer items the user samples — never a vertical stack with a scrollbar.** Rails are for homogeneous, fixed-width card or chip collections (suggestions, recents, persona pickers; items roughly 120–280px wide), laid side by side with edge fades and no visible scrollbar. A vertical scroll box's gutter reads as a "sidebar" and looks unfinished.
- Content the user must scan exhaustively — settings groups, feeds, tables, full-width rows — stays vertical on the page scroll, never in an inner scroll box.

```tsx
{/* Bleed ONLY the trailing edge (-mr/pr) so the first card stays aligned with the
    surrounding content and fully visible at rest; the right bleeds off + fades. */}
<ul className="ml-scroll-mask-x -mr-6 flex snap-x snap-mandatory gap-3 overflow-x-auto
               pr-6 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
  {items.map((it) => (
    <li key={it.id} className="snap-start w-[200px] shrink-0 …">…</li>
  ))}
</ul>
```

- `ml-scroll-mask-x` for the fade · `[scrollbar-width:none] [&::-webkit-scrollbar]:hidden` to kill the bar (the only sanctioned `::-webkit-scrollbar` use — rails, not page scroll).
- `shrink-0` + a fixed `w-[…]` per item so they keep width and overflow instead of squishing.
- `snap-x snap-mandatory` + `snap-start` for a settled feel — but only when items are meaningfully narrower than the container. Near viewport width, use `snap-proximity` or drop snapping; mandatory snap can make parts of a wide card unreachable.
- Rail items are keyboard-reachable (real links and buttons), and focus pulls the item out of the fade — `scroll-padding-inline` on the rail or `scrollIntoView({ inline: 'nearest' })` on focus.
- **Bleed the trailing edge only** (`-mr-N pr-N`, matching the parent's padding) so the last card passes under the right fade. Bleeding the leading edge shoves the first card into the resting left fade and clips it — the first item stays aligned with surrounding content and reads crisp at rest.

### Touch targets

- Every interactive control gets a **≥44×44px hit area** on touch. The visual can be smaller; the hit zone can't.
- **Grow the hit area without shifting layout.** When a control must look small (an inline text link, a tight icon button), grow its tap zone with an absolutely-positioned `::before` on a `position: relative` parent. It paints no box, so nothing reflows — unlike the padding or margin that would nudge every neighbor. Compute the inset from the visual size — `(44 − visual) / 2` — it isn't always −10:

```css
.target { position: relative; }
.target::before {
  content: "";
  position: absolute;
  inset: -10px; /* (44 − 24) / 2 for a 24px control — recompute per size */
}
```

- A 40px-tall control (`min-h-10` — the input metric, and roughly what the kit `Button` renders) is the desktop-density visual size — on touch it reaches 44px via the hit-area pseudo-element.
- **No horizontal scroll on mobile, ever** — after any layout change, check at 375px and 390px.
- `touch-action: manipulation` once globally on `button, a, input, [role="button"]` — it kills the ~350ms double-tap-zoom wait so taps feel instant. Custom pan/zoom canvases opt out with `touch-action: none`.
- **Don't let hover states stick after a tap.** Tailwind wraps `hover:` in `@media (hover: hover)` only on v4, or on v3 with `future.hoverOnlyWhenSupported` — the starter enables the flag; verify it's on before trusting utility hovers. Any hand-written `:hover` rule in `globals.css` is guarded with `@media (hover: hover) and (pointer: fine)` so a tap doesn't leave a stuck hover on phones.

---

## Components

### Primitives

**Check ui-kit, then the app-local layer, before hand-rolling any control.** Every meirlabs app ships the same base primitives so a control behaves identically across projects. Build these on scaffold (→ see the Scaffold manifest for every source). Extend with a variant or a size — never override with a `className`, never inline-fork a control across pages.

ui-kit owns data-heavy chrome — tables, pagination, status pills, tags, metric values, `Button`, `SegmentedControl`, `Modal`, `Tooltip` / `Hint`, `Spinner`. `components/ui/` is the app-local layer: `Pill`, `Collapse`, `CometLoader`, `EmptyState` (the props-based one — it supersedes ui-kit's bare `EmptyState` shell), `BottomSheet`. A control you build twice gets promoted — into `components/ui/` within the app, into the kit across apps.

**The token bridge is law.** A small `globals.css` block maps `--ml-*` ← `--brand-*` (e.g. `--ml-radius-pill: var(--brand-radius-pill)`) so ui-kit components inherit the brand automatically. Without it, kit components render off-brand and nothing tells you to notice.

| Primitive | What it is |
|---|---|
| **Button** | ui-kit's `<Button variant>` — `primary` / `secondary` / `ghost` / `danger`. Primary applies `.ml-btn-primary`; secondary is an elevated surface + border. Shape (radius, height, weight) is whatever the shipped kit `Button` renders — today a pill radius at weight 600 with 8/16px padding — this doc doesn't re-legislate it. Never hand-roll `<button className="px-… bg-… rounded-…">`; pick a variant or add one. → see Buttons |
| **SegmentedControl** | ui-kit's joined 2–3 view switcher with a sliding thumb. → see Segmented switcher |
| **EmptyState** | The shared shell for empty collection surfaces — line illustration, title, body, optional CTA. App-local and props-based. → see Empty states |
| **Pill** | `<Pill tone>` — tones follow the kit's naming: `good` / `warn` / `danger` / `neutral`. Tinted status chips: pale tint fill + colored text, no border. |
| **Collapse** | `<Collapse open>` — height expand/collapse via the grid `0fr` to `1fr` trick; content fades, the sibling below glides. Mounts closed, eases in next frame, honors reduced motion. Keep it mounted while closing. Copy from the /design catalog. |
| **CometLoader** | The AI/agentic wait loader (a model thinking, generating, analyzing): a 4×4 dot grid with a bright head + fading tail orbiting a clockwise spiral. Generic async waits (fetches, saves) use ui-kit's `Spinner`, a ring sweep. Both inherit `currentColor`, carry `role="status"` + a hidden label (pass a specific one), and have reduced-motion built in; choose by what the user waits for, never hand-roll a third. Copy `CometLoader` from the /design catalog. → see Motion for the show-delay and the skeleton lane |
| **BottomSheet** | Bottom-anchored sheet; body uses `ml-scroll-mask-y`. Slides up (`translate-y-full` to `0`), not scale-pop. Copy from the /design catalog. |

The app-local layer is intentionally small — before adding to it, check ui-kit: `Card`, `Dropdown`, `Modal`, `Field` already ship there. **The second use makes it a primitive — build it here and reuse it.**

### Default library choices

The sanctioned third-party libraries. Each ships wrapped in ui-kit — use the kit component, never the library directly, and never hand-roll the pattern.

| Pattern | Library | Use via |
|---|---|---|
| Toasts | Sonner | `Toaster` + the re-exported `toast` — themed to `--ml-*` tokens, `dir="auto"` for Hebrew, reduced-motion verified |
| Command menu (Cmd+K) | cmdk | `CommandPalette` — kit portal + z-tier, RTL logical properties, fuzzy filter tested with Hebrew labels |
| Animated numbers | NumberFlow | `MetricValue` with `animated` (+ `MetricGroup` for synced metrics) — never a hand-rolled rAF counter, and no decorative mount-time count-ups on static marketing numbers |
| OTP / segmented inputs | input-otp | `OtpInput` — token-styled slots, reduced-motion-aware caret, `dir="ltr"` hardcoded; test with password managers |
| Virtualization | react-virtuoso | `VirtualDataTable` from `@meir-labs/ui-kit/virtual` — only past ~200–500 rendered rows or infinite scroll; below that use `Pagination`. MIT core only, never the commercial `@virtuoso.dev/*` packages |
| Drag & drop | dnd kit | `SortableList` from `@meir-labs/ui-kit/sortable` — keyboard and screen-reader support stay enabled; Hebrew announcements on HE surfaces; reduced motion disables drag transitions |
| Live streaming charts | Liveline (pre-1.0, pinned) | `LiveChart` from `@meir-labs/ui-kit/charts` — live time-series only, not the general chart library; monochrome token colors, decorative effects off, reduced-motion guard lives in the wrapper |

**Leva** is dev tooling, not a shipped dependency — the standard knob panel for tuning canvas/motion constants on dev/demo routes behind `?knobs=1`. Values graduate back into code as constants; it never appears in ui-kit, the starter, or a public bundle.

### The label register

Reuse these exact recipes anywhere a list, card group, or row needs a label — don't invent a new size/color pairing per surface. The 15px/13px sizes here are label sizes, the named exception to the two body sizes (→ see Typography).

| Label | Recipe | Example |
|---|---|---|
| **Section header** (above a grouped card) | `px-4 text-[15px] leading-none text-[var(--brand-fg-muted)]` | "Public profile" over a settings group |
| **In-card micro-label** | `text-[12px] font-medium uppercase tracking-wide text-[var(--brand-fg-muted)]` | "Visible on your profile" |
| **Row label** | `text-[16px] text-[var(--brand-fg)]` — destructive rows `text-[var(--brand-error)]` | "Invite friends" |
| **Row trailing value** | `max-w-[45%] truncate text-[15px] text-[var(--brand-fg-muted)]` | the iOS-style value cell |
| **Dense row label + description** | label `text-[14px] font-medium text-[var(--brand-fg)]` over `text-[12px] text-[var(--brand-fg-2)]` | visibility toggles |
| **Group footnote** (below a grouped card) | `px-4 text-[13px] leading-relaxed text-[var(--brand-fg-muted)]` | a settings group's helper line |

- Section headers are quiet by design — muted color, **no** uppercase, **no** bold. The uppercase tracked treatment is reserved for the 12px in-card micro-label (and 12px is the floor, → see Typography).
- Grouped cards use 16px (`p-4`) inner padding; the `px-4` on headers and footnotes mirrors it — keep both when the label sits over a `--brand-radius-card` card.

### Buttons

The primary button is ui-kit's `.ml-btn-primary` — the one sanctioned gradient in the system. `Button variant="primary"` applies it; standalone CTAs apply the class directly.

- **Anatomy** — a fixed charcoal two-stop gradient (`linear-gradient(180deg, #323232, #222222)`) with a 1px ring, an inset top highlight, and a bottom shadow. It is not built from `--brand-primary` — accent brands override it through the `--ml-btn-primary-bg` hook.
- **States** — hover brightens (`filter: brightness(1.12)`); active dims and nudges — `filter: brightness(0.95)` + `transform: translateY(0.5px)`, never `top`, never `margin`. The nudge is the primary button's **entire** press feedback — there is no scale in it. Disabled is 50% opacity + `cursor: default`. All of it is reduced-motion-guarded.
- **Chosen by ground.** The charcoal treatment is the primary on light and app surfaces. On near-black marketing grounds it would sink in, so there the primary CTA flips to the **inverted white pill** (white fill, dark text): same role, higher contrast. In `apps/web` the inverted primary ships as `.hb-btn` (secondary: `.hb-btn--ghost`, a bordered transparent pill).
- **Hover intensifies, never dims.** A primary must read as more dominant on hover, not less, so never drop opacity (on a white pill that just grays it). The charcoal primary brightens; the inverted white pill goes fuller white with a subtle lift; a bordered secondary firms its border to full strength.
- **Apply, don't fork** — never re-style or shadow-fork it; apply the class and add only shape or size utilities (`rounded-full`, `h-11`, `px-5`).
- **Radius decision** — the `Button` component keeps the kit's shipped pill shape everywhere; don't re-legislate it per surface (→ see Primitives). When you apply `.ml-btn-primary` directly to a standalone CTA, you supply the shape — `rounded-full h-11` is the house CTA pill (follow, invite, the empty-state CTA). `--brand-radius-control` is the radius for the rectangular controls this doc does legislate — inputs and hand-built chips (→ see Inputs).
- **Pill variants** — solid primary pill: `rounded-full bg-[var(--brand-primary)] text-[var(--brand-on-primary)]`; for the heaviest CTA reach for `.ml-btn-primary` instead. Selected / secondary toggle: elevated surface + `border-[var(--brand-border-strong)]` with `text-[var(--brand-fg)]` (e.g. a "Following" state).
- **Press feedback** — press scale tracks element size: small pills and icons `active:scale-[0.96]` to `active:scale-[0.97]`, larger buttons and cards `active:scale-[0.98]`. Never below 0.96 — past that the control looks like it's collapsing, not being pressed. This scale ladder is for pills, cards, and icon buttons built outside the kit — `.ml-btn-primary`'s press feedback is its built-in nudge alone (→ see States above), so never add `scale` on top of it.
- Confirm-style taps fire a haptic (→ see Haptics); keep `disabled:opacity-60` on async buttons and stay optimistic where the action is reversible.

### Inputs

- **Metrics:** `min-h-10` (40px), `--brand-radius-control`, `px-3`; controls sharing a row share a height. These govern what you build — the kit `Button` keeps its own shipped shape (→ see Primitives), it just lands at the same ~40px row height.
- **16px text.** Form controls (`input`, `textarea`, `select`) are 16px minimum — anything smaller makes iOS Safari zoom the page on focus. The 12px floor is for reading text, not text you type into.
- **Fill and border:** `bg-[var(--brand-bg)]` with `border-[var(--brand-border)]` as the default; the filled variant is `bg-[var(--brand-surface-3)]` — that is what the token is for. Placeholder text is `--brand-fg-disabled`, and a placeholder is never the label.
- **Labels reuse the register** — the dense-row recipe: 14px medium label, optional 12px description. Helper and error lines below the field use the footnote recipe (13px); errors switch text and border to `--brand-error`.
- **Focus is the global ring** — inputs don't invent their own glow.
- Validate on blur or submit, not per keystroke; reserve the error line's height so the field never jumps.
- ui-kit ships `Field` — check it before building (→ see Primitives for the ownership model).

### Segmented switcher

When a surface shows **exactly one of 2–3 sibling views** (sub-tabs within a page), use ui-kit's `<SegmentedControl>` — one bordered track with a sliding thumb, not detached pill chips and not a second row of underline tabs. Hand-rolling it breaks the kit-first rule; the anatomy below is what the kit does, so you can extend it without forking it.

- **Track** — a relative `w-fit` grid with **equal columns** (one per segment), `rounded-full`, a 1px `--brand-border`, a `bg-[var(--brand-bg)]` fill, `p-1`, with `role="tablist"` + an `aria-label`. Equal columns make the thumb exactly one cell wide — don't size columns to content.
- **Thumb** — an `aria-hidden` sibling rendered **before** the buttons: `absolute inset-y-1 left-1 rounded-full`, width `calc((100% - 8px) / N)` for N segments (the kit parameterizes this with `--ml-seg-count`), moved by `translateX(calc(i * 100%))` for selected index i. It transitions `transform var(--ml-duration-slow) ease` (200ms) with a `motion-reduce:transition-none` guard — **transform only**, never animate `left` / `width`. The kit thumb is `var(--ml-text)` with the selected label in `var(--ml-bg)` — equivalent to `--brand-primary` / `--brand-on-primary` only in the no-accent case.
- **Easing exception, stated:** the thumb moves on plain `ease` at `--ml-duration-slow`, not the on-screen-movement `ease-in-out` the taxonomy prescribes — selection feedback prioritizes instant response over physical realism.
- **Labels** — `role="tab"` + `aria-selected`, `relative z-10 rounded-full px-4 py-2 text-[13px] font-medium transition-colors`; the selected label picks up the thumb's contrast color, unselected labels are `text-[var(--brand-fg-muted)]`. **Color is the only thing that changes between states** — same weight, same size, so the row never shifts.
- **Keyboard** — a tablist is one tab stop: the selected tab is `tabindex=0`, the others `tabindex=-1`; Left/Right arrows move selection (roving tabindex). Tab roles without arrow wiring are worse than no roles — if you don't wire arrows, use a labelled radio group instead. The kit's `SegmentedControl` should own this — verify it before shipping.
- **Counts** — optional `· N` suffix in `tabular-nums`, shown only when `N > 0` (never "· 0"), inside the label, not a badge.
- More than 3 options, or long labels? Wrong tool — use a dropdown or a chip rail.

### Tooltips & hints

- **ui-kit's `Tooltip` is the only tooltip.** A dark elevated surface that fades in on hover **and** keyboard focus, wired via `aria-describedby`. Never hand-roll one, and never lean on the native `title` attribute for anything you want styled.
- **`Hint` annotates a term in place** (a table header, a metric label, a section title, jargon): no info icon, no cursor change, no underline. The text looks untouched and the tooltip appearing is the only feedback; an icon-less, decoration-less hint keeps dense UIs calm. Reach for an explicit info icon only when discoverability truly matters.
- Keep tooltip copy to one short sentence (the surface caps around 260px wide).
- `Hint` is keyboard-focusable by default so the tip opens on focus. Pass `focusable={false}` when the text already sits inside an interactive element (a sortable table header button, say), so focusables never nest.
- **Dates in table cells:** show a compact short date ("Jul 6") and put the full, unambiguous timestamp (with timezone) in a `Tooltip`. The cell stays scannable; the exact value is one hover away.

### Empty states

Empty states use a **bespoke line illustration** — never a Hugeicon blown up, never a photo, never a Lottie. The set lives alongside `components/Illustrations.tsx` and follows one visual register so two empty states in a session read as the same product.

- **One shell, no re-inlining.** Use the props-based `EmptyState`: pass `illustration` (a line-art component from the register), `title`, `body`, and an optional `cta={{ href, label }}`. It's padding-less by design; the consumer adds the vertical rhythm. Don't re-inline this layout per surface.
- **Anatomy** — centered column: illustration (`h-36` to `sm:h-40`) → `mt-2` → 18px semibold title (`--brand-fg`, tight tracking) → `mt-1.5` → 14px body (`--brand-fg-muted`, `max-w-[30ch]`) → `mt-5` → a CTA pill (`ml-btn-primary rounded-full h-11`) with a leading 16px `Add01Icon`. Sit it in the page's normal `max-w-xl` column — don't full-bleed it.
- **Illustration register** — a 120×120 `viewBox` SVG, thin strokes (1.2–1.6px), `currentColor` everywhere, and an opacity gradient (1.0 hero → 0.55 sparkle → 0.45 decoration) so the eye lands on the object first. Color picks up the parent's `text-[var(--brand-fg-2)]`; no raw hex, no second hue.
- **Ground the object** — float it above a flat `currentColor / 0.08` ellipse (`rx≈36, ry≈4`) at the baseline. The shadow is what makes a free-floating line drawing feel placed.
- **Subtle motion only** — reuse `il-float-down`, `il-pulse`, or `il-sway` (→ see the Scaffold manifest for the source); never spin, never bounce. Loops are ambient: one cycle takes 6s or longer — nothing that draws the eye on repeat — and looping SVG animation pauses when off-screen. Animate a child group with `transformBox: 'view-box'`; the global reduced-motion rule freezes SVG animation system-wide.
- **The graphic carries meaning** — match the metaphor to the surface (a shelf/cap for a library, an inbox for messages, a magnifier for "no results"). Generic shapes get ignored.
- **Empty ≠ broken.** Title speaks to the next step ("Your library is empty", not "No data"); body explains the payoff in one sentence; the CTA is the obvious next action. **Errors** get `--brand-error` accents on a separate `ErrorIllustration`; **"no results"** reuses this neutral register with copy that names the filter ("No studies match 'quantum'"). Don't conflate them.

---

## Motion & feel

### Motion

Motion craft follows **Emil Kowalski** — the `emil-design-engineering` skill and [Animations on the Web](https://emilkowal.ski). When in doubt whether an animation earns its place, defer there.

- Every animation sits behind the global `prefers-reduced-motion` handling — new motion included.
- **Reduced motion isn't the only accessibility signal.** Anywhere `backdrop-filter: blur` ships (a sticky nav is the only sanctioned use), also degrade the glass for two independent preferences: `prefers-reduced-transparency: reduce` makes the surface solid and drops the blur; `prefers-contrast: more` gets a near-solid background plus a defined border. Both are separate from `prefers-reduced-motion`; a user can set one without the others.
- Durations and easings come from the shipped motion token scale — never a hand-typed duration or bezier. ui-kit ships it as theme-independent custom properties:

| Token | Value | Use |
|---|---|---|
| `--ml-duration-press` | 60ms | `:active` transform feedback |
| `--ml-duration-fast` | 120ms | tight color/border shifts |
| `--ml-duration-base` | 150ms | interactive default (hover color/border/bg, focus) |
| `--ml-duration-slow` | 200ms | expand/collapse (small elements), the segmented thumb |
| `--ml-duration-exit` | 450ms | overlay/list dissolve |
| `--ml-duration-entrance` / `--ml-ease-entrance` | 800ms / `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | landing scroll reveal only, not an in-app duration |
| `--ml-ease` | `ease` | plain interactive default |
| `--ml-ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | strong ease-out for deliberate UI |
| `--ml-stagger` / `--ml-stagger-tight` | 100ms / 80ms | sibling stagger / word-by-word splits |
| `--ml-press-scale` | 0.97 | `:active` press scale (the 0.96–0.98 ladder, → see Buttons) |

- The one off-token duration is the overlays' 250ms open: it lives in the `.t-modal` CSS you copy from the Scaffold manifest, defined once there — don't hand-type new durations elsewhere.

| Context | Movement | Duration | Easing |
|---|---|---|---|
| Enter / exit | fade + small transform | 150–250ms | `--ml-ease-out` |
| Overlay open / close | scale from `0.96` + fade | 250ms open / 150ms close | `--ml-ease-out` |
| Sheet slide | `translate-y-full` to `0` | 250ms open / 150ms close | `--ml-ease-out` |
| Page transitions / navigation | **none** | — | — |

- **The easing taxonomy:** enter / exit → `ease-out` (acceleration at the start reads as instant response); on-screen move / morph → `ease-in-out` (a visible thing accelerates and brakes like a physical object); hover / color → `ease`, ~150ms; `ease-in` → never (it delays visible feedback); `linear` → only constant-speed loops.
- **Paired elements share easing AND duration** — anything animating as a unit (modal + backdrop, tooltip + arrow) moves as one.
- Prefer **specific** transition properties over `transition: all`. Animate `transform` / `opacity`, **not** `width` / `height`.
- **Never animate height to `auto`.** `transition: height` (or `max-height`) to `auto` doesn't interpolate; the panel just snaps open. Two sanctioned expand/collapse mechanisms: the CSS grid trick (animate `grid-template-rows` from `0fr` to `1fr` with a `min-height: 0; overflow: hidden` inner wrapper; this is what `Collapse` and the kit `Accordion` do, so reuse them), or a measured spring for dynamic content (measure via `ResizeObserver` / `offsetHeight` and spring to the **numeric** height, never to `"auto"`). Never the `max-height: 999px` hack: the timing is computed against the fake ceiling, so opening looks delayed and closing abrupt.
- **Skip animation on interactions hit 100+ times a day** — no transitions on keyboard focus traversal, typing feedback, list-row hover, or dropdown open in data-dense screens. The segmented thumb and the overlay transitions are sanctioned exceptions.
- **Indeterminate action waits get a kit loader, chosen by the wait and shown late.** `Spinner` for generic async (fetches, saves), `CometLoader` for AI/agentic work (→ see Primitives); either appears only after ~300ms — a flashed loader reads slower than no loader — and only for actions: submitting, generating. Content loads render a skeleton with the real component's hardcoded dimensions so the swap causes zero shift; a loader is not a page placeholder. Never hand-roll a third loader or reintroduce ad-hoc sweep bars.
- **Overlays share one open/close system** — `.t-modal` (→ see the Scaffold manifest for the source): scale from `0.96` + fade, **250ms open / 150ms close** (close is snappier) on `--ml-ease-out`. Drive it with the `useOverlayTransition(open)` hook — it keeps the element mounted through its exit — then apply `t-modal` + `is-open` / `is-closing`.

```tsx
const { mounted, status } = useOverlayTransition(open);
return mounted ? (
  <div className={`t-modal ${status === 'open' ? 'is-open' : 'is-closing'}`}>…</div>
) : null;
```

- **Centered modals** add a `.t-modal-backdrop` dimmer — same cadence, no scale (the paired-elements law in practice).
- **Focus travels with the overlay** — into the overlay on open, back to the trigger on close. The focus contract lives next to the motion contract; the hook knows both moments.
- **Anchored popups** set `[--modal-origin:<corner>]` so they scale out of their trigger, not the center.
- **Bottom sheets are the exception** — they slide up from the bottom edge (`translate-y-full` to `0`). Don't scale-pop a bottom-anchored sheet.
- **Gesture-driven motion is springs, not CSS transitions.** This applies only to things the user can grab and drag mid-flight (drawers, bottom sheets, swipe-to-dismiss, reorderable rows; the kit's `Drawer` and `SortableList` are the built surfaces, so reuse them before hand-rolling). The rule that separates fluid from janky: the element stays grabbable and reversible at any instant, with no seam between the drag and the animation that follows. On interrupt, animate from the element's live on-screen value, never the logical target (springs do this by default; CSS `transition` / `@keyframes` can't be grabbed mid-flight). Hand the release velocity into the spring (`transition={{ velocity }}`), and animate to where the flick is going, not the release point: project momentum with Apple's decay, `(v / 1000) * d / (1 - d)` with `d ≈ 0.998`, then snap to the nearest target in that projection. Rubber-band past boundaries (progressive damping, never a hard stop), and decide reverse-vs-commit by velocity sign, not position: a sheet dragged 10% but flicked hard toward dismiss should dismiss. Under `prefers-reduced-motion`, drop the spring and projection and cross-fade the end state.
- **Kill flicker by animating a child, not the parent.** When a hover- or scroll-driven effect jitters, put the `transform` / `opacity` on a dedicated child and leave the parent static. `will-change: transform` is fine on elements that mount/unmount (like `.t-modal`); never leave it on an always-present node.
- **Nudge, don't always message.** When a blocked action's fix is a single visible, self-explanatory control on screen (an unchecked "accept terms" box, a skipped required field), don't narrate the problem in text: nudge the blocker with a short transform-only shake or pulse (≤ `--ml-duration-slow`, re-triggerable) plus a durable highlight that persists until the gate is met. The shake grabs the eye; the highlight and moving focus to the control are the real cue, and what reduced-motion and screen-reader users rely on. The gated button must be `aria-disabled`, not native `disabled`, or the click that fires the nudge never lands. Reserve actual error messages for problems that aren't visible or inferable: server failures, "email already taken", format rules. Full decision guide in the `nudge-over-error` skill.
- **Never show the same snack bar twice.** A duplicate toast tells the user nothing new. If the message is already the front toast, shake it (short, transform-only, re-triggerable) and reset its timer; if it's stacked behind a newer toast, bring it to the front and reset its timer so it stays readable. The kit `toast()` does all of this by default (dedupes on tone + title + description; opting out is passing your own `id`): mount `Toaster` and fire away, never hand-roll the dedupe.

### Haptics

- **Confirm committed choices with a haptic** via `lib/haptics` — a thin wrapper over `web-haptics` (`npm i web-haptics`; the ~15-line wrapper is in the Scaffold manifest). The exports are `hapticSuccess()` and `haptic('selection' | 'error')`. Call `hapticSuccess()` from the handler when the user **commits a selection** — onboarding picks, quiz answers, "Start" — not on every tap.

```tsx
import { hapticSuccess } from '@/lib/haptics';
onClick={() => { hapticSuccess(); onSelect(value); }}
```

- **One shared instance, fire-and-forget.** Never `new WebHaptics()` per component, never raw `navigator.vibrate` — the helper is the only door. It picks the right mechanism per platform and **no-ops on desktop**, so a call is always safe.
- **Reserve it for confirmation, not navigation.** Selections, answers, and the "done" moment — not scrolling, hovering, or back/close. Use `haptic('selection')` for a lighter cue and `haptic('error')` only where something genuinely failed.

### Graphs & charts

Data viz reads from the same `--brand-*` tokens as everything else — lines and axes in `--brand-fg` / `--brand-fg-muted`, gridlines in `--brand-border-subtle`, area fills as a low-opacity `currentColor`, and status hues only where they carry meaning. No rainbow palettes, no drop shadows.

- **Real-time / live-updating line charts** — use **Liveline** by **Benji Taylor** ([github.com/benjitaylor/liveline](https://github.com/benjitaylor/liveline)) — a real-time animated line chart for React. `npm i liveline`, then map `--brand-fg` / `--brand-border-subtle` onto its line and grid props so the chart inherits the palette. Don't hand-roll a live chart on a `setInterval` + full re-render — it drops frames and ignores reduced motion.
- **Static charts** — keep them flat and quiet: thin strokes, `tabular-nums` on axis labels, and animate `transform` / `opacity` on enter only, behind `prefers-reduced-motion`.

---

## The non-negotiables

Brand-agnostic. These hold on every product, every surface, no exceptions:

| Rule | Detail lives in |
|---|---|
| Tokens, never raw values — every color, font, and radius is a `--brand-*` token | Start here |
| Hugeicons Pro only — never Lucide, Heroicons, or raw `<svg>` | Icons |
| `@meir-labs/ui-kit` first — check the kit before writing a custom control | Primitives |
| 12px minimum font size, everywhere | Typography |
| 16px minimum on form controls (`input`, `textarea`, `select`) | Inputs |
| Icons: 20px default, 16px floor | Icons |
| No `font-weight: 700` — the font loads 400/500/600 only | Typography |
| No gradient page or section backgrounds — the primary button is the one sanctioned gradient | Color |
| No `#000000` text — `--brand-fg` is a near-black | Color |
| Everything on the 4px grid | Spacing |
| Cards are `--brand-surface-2` + a 1px border — no card shadows, no card nested in a card | Color |
| Depth from borders and surface shifts in the page flow; floating layers lift with the stacked-shadow elevation system | Color |
| 4.5:1 contrast on text, 3:1 on functional non-text | Color |
| ≥44×44px hit area on every touch control | Touch targets |
| The `:focus-visible` ring on every interactive element — no opt-outs | CSS hygiene |
| Never leave an invisible control focusable — `visibility: hidden` or `inert`, per the two hide cases | Layout stability |
| All motion behind `prefers-reduced-motion` | Motion |
| Animate only `transform` and `opacity`, never layout properties, and never height to `auto` | Performance · Motion |
| `next/image` for every raster; per-route budgets: LCP < 2.5s, INP < 200ms, CLS < 0.1 | Performance |
| Environment-aware favicon: static PNGs selected in `metadata.icons`, never an `app/icon.*` file | Favicon |
| Consistency — match how a header, card, or spacing already reads before inventing a new pattern | Everywhere |

---

## Thanks

This system leans on the work of two people who shaped its motion and its graphs:

- **Emil Kowalski** — design engineering and animation craft. The `emil-design-engineering` skill and the motion rules in this doc draw directly on his work. [emilkowal.ski](https://emilkowal.ski)
- **Benji Taylor** — **Liveline**, the real-time animated line chart we reach for on live graphs. [benji.org](https://benji.org) · [github.com/benjitaylor/liveline](https://github.com/benjitaylor/liveline)
