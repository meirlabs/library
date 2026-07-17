# Measure & budget — the audit loop

Never optimize by guessing. Measure, rank by critical-path impact, fix, re-measure. This is the
one workflow no existing skill owns end to end (the seo-audit skill only states CWV thresholds; it
doesn't run the tool or diagnose root causes).

## Budgets (per route — the number that matters)

| Metric | Target | What it is |
|---|---|---|
| **LCP** | < 2.5s | largest contentful paint — usually the hero image/heading. Mobile, 4G. |
| **INP** | < 200ms | interaction to next paint — responsiveness of clicks/taps |
| **CLS** | < 0.1 | cumulative layout shift — see `design/foundation/layout-stability.md` |
| **TTFB** | < 0.8s | static/ISR routes should be well under this |
| **First-load JS / route** | < ~130KB gz | from the Next.js build report, per segment |

Judge every route against these, not the site as a whole. A route-split app ships a lot in
aggregate and still loads each page fast — that's the point.

## The audit loop

**1. Lab — Lighthouse (reproducible, diagnostic).**
```bash
pnpm build && pnpm start          # measure the PROD build, never dev (dev is unoptimized)
npx lighthouse http://localhost:3000 --preset=desktop --view
npx lighthouse http://localhost:3000 --view    # mobile, throttled — the number that ships
```
Read the Opportunities + Diagnostics, not just the score. Map each to a fix in `delivery.md` /
`perceived-speed.md`.

**2. Bundle — what's actually shipping.**
```bash
# Next.js build already prints per-route First Load JS — read that table first.
# For the "why is this chunk huge" answer, add @next/bundle-analyzer (see ci.md):
ANALYZE=true pnpm build           # opens the treemap
```
Look for: a heavy dep pulled into every route, a `"use client"` island dragging in a big library,
a non-split component that should be `dynamic()`.

**3. Field — real users (the ground truth).**
- **PostHog Web Vitals:** enable the web-vitals autocapture in the PostHog config (we already load PostHog on every site). It reports real LCP/INP/CLS/FCP from actual sessions — lab numbers lie about real-world devices. (See the `posthog-ops` skill for the project/config.)
- **`performance.mark("appStart")`** in the inline shell script (see `perceived-speed.md`) → measure true boot time from the earliest point, not React mount. Send the delta to PostHog as a custom event for a real boot-time distribution.
- **PageSpeed Insights / Search Console** for Google's field CWV (also the SEO signal — the `seo-manager` agent reports these; this skill fixes them).

## Rank, then fix

1. Sort candidate fixes by **how much they move a budget on the critical path.** A 300KB hero image failing LCP beats a 5KB micro-opt every time.
2. Work the usual order: unoptimized `<img>` → over-eager client bundles / missing `dynamic()` → blocking third parties → font strategy → missing preloads → render strategy (`force-dynamic` that could be static).
3. **Re-measure after each fix** and confirm the metric moved. If it didn't, revert — you learned the bottleneck is elsewhere. Use the `verify-frontend-change` skill to confirm no visual/mobile regression came with the win.

## Output a ranked worklist

When auditing for someone (or handing off), don't return a raw Lighthouse dump. Return ranked
findings: **metric it fails → root cause (with file) → fix → expected delta → effort.** Same shape
the `security-audit` skill uses. Fix what's cheap and high-impact in the same pass; file the rest.
