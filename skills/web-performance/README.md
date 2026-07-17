# @meir-labs/skill-web-performance

The meirlabs web-performance skill — make a Next.js site as fast as possible. Distilled from the Linear "how is it so fast" teardown and calibrated to the meirlabs stack (Next.js 15 + React 19 + ui-kit + Supabase + PostHog + Hugeicons on Vercel). It organizes the work around three levers — **ship less and load it in parallel**, **feel instant**, **stay smooth** — sets per-route Core Web Vitals budgets, runs a measure-first audit loop that turns a Lighthouse run into ranked fixes, and wires a CI guard so a regression fails the build instead of shipping. It steals Linear's techniques (optimistic UI, modulepreload, per-package chunks, the font checklist) without cargo-culting its local-first sync engine.

## Install

```sh
# into the current project (./.claude/skills/web-performance)
npx @meir-labs/skill-web-performance

# into every project (~/.claude/skills/web-performance)
npx @meir-labs/skill-web-performance --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically when asked to "make it fast", "improve performance", "site is slow", "Core Web Vitals", "Lighthouse", "reduce bundle size", "optimize images/fonts", or for a "perf audit".

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/web-performance](https://meirlabs.com/skills/web-performance).
