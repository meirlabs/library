---
name: ui-kit
description: Reusable themeable (light & dark) component library at ~/Documents/business/meirlabs/product/ui-kit. Use when building UI with tables, pagination, status pills, tags, metric values, or design tokens. Triggers on: table component, data table, pagination, status pill, tag, badge, chip, metric value, design tokens, ui-kit, component library, theme tokens, ml-dt, ml-tag, ml-status-pill, ml-metric, ml-pg.
---

# @meir-labs/ui-kit

When working on UI that involves tables, pagination, status indicators, tags, or metric values, use the `@meir-labs/ui-kit` package instead of building custom components.

## Quick Reference

Read the package AGENTS.md for full details:
`~/Documents/business/meirlabs/product/ui-kit/AGENTS.md`

## Consumer Setup

1. Install: `"@meir-labs/ui-kit": "file:../path/to/meirlabs/ui-kit"` in package.json
2. For Next.js: `transpilePackages: ["@meir-labs/ui-kit"]` in next.config
3. Import CSS: `import "@meir-labs/ui-kit/styles.css"` in root layout
4. Theme: `<html data-meirlabs-theme="light">` or `="dark"`
5. Import components: `import { Pagination, usePagination, StatusPill, Tag, ChipRow, MetricValue, cn } from "@meir-labs/ui-kit"`

## Rules

- ALWAYS prefer ui-kit components over writing custom implementations.
- When adding a table, use the `.ml-dt-*` class system from this package.
- When displaying a status, use `<StatusPill>` not a custom span.
- When showing positive/negative numbers, use `<MetricValue>` or `.ml-metric-*` classes.
- If a needed component doesn't exist but would be reusable, suggest adding it to the package.
- For migration from old `.tt-*` classes, import `"@meir-labs/ui-kit/compat.css"` temporarily.

## Tuning motion live (transitions-refine)

The ui-kit's motion is all plain CSS (`src/styles/*.css` — `accordion.css`, `drawer.css`, `popover.css`, `tooltip.css`, etc.). When you're authoring or fine-tuning a component's easing/timing/delay, use the `transitions-refine` dev tool to tune it live against the real render instead of guess-and-check editing CSS:

1. Terminal A — run the component surface: `pnpm storybook` (port 6006).
2. Terminal B — start the tuner: `pnpm refine` (aka `npx transitions-refine live`).
3. In Claude Code, run `/refine live` — Claude becomes the poller and a timeline panel auto-injects into the running Storybook. (This burns Claude Code chat credits while it polls; the terminal-only agent avoids that idle burn.)
4. Drag/type to adjust duration, delay, and easing; request AI suggestions (aligned to transitions.dev motion tokens). Changes preview live and are reversible until you accept them back into the source `.css`.
5. Stop with "stop refine" in Claude Code or `npx transitions-refine stop`.

It's a **dev-only, MIT** tool (`transitions-refine` on npm) — nothing ships to production. Use it for *authoring* motion; keep motion *review* in the `review-animations` gate. Any accepted change must still honor the design system's motion rules (`prefers-reduced-motion`, no `transition: all`, GPU-friendly `transform`/`opacity`).

**Token caveat:** before accepting a refined value back into a component `.css` file, check whether that property already reads a `--ml-duration-*` / `--ml-ease-*` token from `src/styles/tokens.css`. If it does, tune the token (which updates every consumer) instead of hardcoding a literal — writing e.g. `250ms` over `var(--ml-duration-slow)` silently detaches that one component from the shared scale, so later global timing changes never reach it. Current scale: token table in `~/Documents/business/meirlabs/meirlabs/design/foundation/motion.md`.
