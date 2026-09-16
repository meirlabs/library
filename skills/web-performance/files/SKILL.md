---
name: web-performance
description: Make a meirlabs site as fast as possible - the delivery, perceived-speed, measurement, and CI decisions that keep Next.js App Router sites feeling instant, calibrated to our stack (Next.js 15 + React 19 + ui-kit + Supabase + PostHog + Hugeicons on Vercel). Use when the user says "make it fast", "improve performance", "site is slow", "Core Web Vitals", "Lighthouse", "reduce bundle size", "optimize images/fonts", "speed up load", "perf audit", or when scaffolding/shipping a new project.
---

# Web Performance

> **The network is the enemy. Ship less, feel instant, stay smooth.**

The best web apps hide the network from the user — the fewer loading states you make them look
at, the faster the app feels. Linear's teardown proves there's no silver bullet: speed is "the
culmination of hundreds of decisions made correctly." This skill is the checklist of those
decisions for a meirlabs site, plus how to measure and enforce them.

Source of truth: **`design/foundation/performance.md`** (homebase) — the three levers, the
non-negotiables, and the per-route budgets. Read it for the *why*; this skill is the *how*.

**Scope guard:** we build Next.js App Router sites (marketing + SaaS dashboards), not local-first
sync apps. Steal Linear's *techniques* (below), not its *architecture* — IndexedDB-as-database,
offline editing, and MobX-per-field are load-bearing for Linear and wrong for us. See
`references/perceived-speed.md` for the line between "borrow this" and "needs a sync engine."

## The three levers (name the one you're moving)

| Lever | Question | Where |
|---|---|---|
| **Ship less, in parallel** | How many bytes / round trips on the critical path? | `references/delivery.md` |
| **Feel instant** | Does the UI react in the same frame the user acts? | `references/perceived-speed.md` |
| **Stay smooth** | Does anything trigger layout/paint or block the main thread? | `references/delivery.md` + `motion.md` |

## Quick reference

| Topic | File | Use when |
|---|---|---|
| Bundles, images, fonts, code-splitting, third-party deferral, build config | `references/delivery.md` | shipping/optimizing what loads |
| Optimistic UI, no-spinner patterns, shell inlining, prefetch, palettes | `references/perceived-speed.md` | the app feels laggy even when it's "fast" |
| CWV targets, Lighthouse/PSI, bundle analyzer, RUM via PostHog, the audit loop | `references/measure-and-budget.md` | diagnosing, or setting a budget |
| next.config perf defaults + Lighthouse-CI + bundle-size guard | `references/ci.md` | wiring enforcement into a project |

## Core rules (non-negotiable — from `design/foundation/performance.md`)

1. **Animate only `transform` / `opacity`.** Never `width`/`height`/`top`/`left`/`margin`/`padding`/`background` on a hot path. Browser fact, not taste.
2. **`next/image` for every raster** — AVIF/WebP, `srcset`, lazy-below-fold free; `priority` on the one LCP image. No raw `<img>` for photos/avatars/hero.
3. **Fonts cost nothing** — system stack by default; a real webfont is one variable `woff2` + `font-display: swap` + `crossorigin`-matched preload, never double-fetched.
4. **Static by default** — `force-dynamic` only where auth/per-request data truly needs it. Prefer `generateStaticParams` + ISR (`revalidate`).
5. **Third parties defer** — PostHog/chat/embeds load after first paint, never before it.
6. **Budget per route, not per site** — first-load JS < ~130KB gz/route; LCP < 2.5s, INP < 200ms, CLS < 0.1.

## How to make a site fast

**On a new project** (the starter already ships the `next.config.ts` perf defaults + `@next/bundle-analyzer` — §1–§2 of `references/ci.md` are done at the template level):
1. Verify the inherited config survived scaffolding and apply the font/image conventions — `references/delivery.md`.
2. Wire the Lighthouse-CI budget / bundle-size guard (§3–§4 of `references/ci.md`) before ship so regressions fail loud.

**On an existing site** (audit → ranked fixes → verify):
1. **Measure first.** Run the audit loop in `references/measure-and-budget.md` (Lighthouse + bundle analyzer + real CWV). Never optimize by guessing.
2. **Rank by critical-path impact.** Biggest LCP/INP/bundle wins first; ignore micro-opts that don't move a budget.
3. **Fix the usual suspects** in order: unoptimized `<img>` → over-eager client bundles (missing `dynamic()`/`"use client"` creep) → blocking third parties → font strategy → missing preloads.
4. **Re-measure and verify.** Prove each fix moved its metric — use the `verify-frontend-change` skill to confirm nothing regressed visually. Numbers, not vibes.

## What this skill does NOT own (cross-link, don't duplicate)

- **React/Next.js code-level perf** — waterfalls, RSC caching, re-render micro-opts, `Suspense` data patterns → **`vercel-react-best-practices`** skill (57 rules). This skill points you there; it doesn't restate it.
- **Interaction feel: virtualization, GPU animation patterns, font/image *rendering* polish** → **`emil-design-engineering`** skill (`performance.md`, `animations.md`).
- **Layout shift / CLS specifics** → **`design/foundation/layout-stability.md`**.
- **Animation durations & easing** → **`design/foundation/motion.md`** (this skill owns only the *which-property* rule).
- **CWV thresholds for SEO/ranking + PSI reporting** → **`marketing-skills` seo-audit** and the **`seo-manager`** agent (they report the numbers; this skill fixes them).

## References

- `references/delivery.md` — ship less, load it in parallel: build target, per-package chunks, code-splitting, `next/image`, fonts, third-party deferral, the ui-kit `"use client"` footgun.
- `references/perceived-speed.md` — feel instant: optimistic UI, kill spinners, inline critical shell + localStorage theme replay, prefetch, command palette / keyboard paths; and the borrow-vs-sync-engine line.
- `references/measure-and-budget.md` — the audit loop, CWV targets, Lighthouse/PSI/bundle-analyzer, `performance.mark` + PostHog RUM.
- `references/ci.md` — copy-paste `next.config.ts` perf defaults, `@next/bundle-analyzer`, a Lighthouse-CI GitHub Action, and a bundle-size guard.
