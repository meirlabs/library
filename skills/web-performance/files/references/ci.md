# CI & config — make fast the default, make regressions fail loud

The starter (`starters/nextjs-saas`) already ships §1–§2 below — the `next.config.ts` perf
defaults and `@next/bundle-analyzer` — so a scaffolded project inherits them at the template
level. The remaining new-project work is §3–§4: wire the Lighthouse-CI / bundle-size guard before
the project goes live. §1–§2 stay here as the copy-paste reference for projects that predate the
starter defaults.

## 1. `next.config.ts` perf defaults

Already in the starter's `next.config.ts`; for an older project, merge with its existing
`transpilePackages`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@meir-labs/ui-kit"],
  images: {
    formats: ["image/avif", "image/webp"],   // apps/web and the starter both ship this
    // remotePatterns: [{ protocol: "https", hostname: "your-cdn.com" }],  // if serving remote images
    minimumCacheTTL: 60 * 60 * 24 * 30,       // 30d — cache optimized outputs
  },
  experimental: {
    // tree-shake barrel imports of icon/util libs so they don't bloat every route:
    optimizePackageImports: ["@hugeicons/react", "@hugeicons-pro/core-stroke-rounded"],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
```

## 2. Bundle analyzer (on demand, not in prod)

```bash
pnpm add -D @next/bundle-analyzer
```
```ts
// next.config.ts
import withBundleAnalyzer from "@next/bundle-analyzer";
const analyze = withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" });
export default analyze(nextConfig);
```
```bash
ANALYZE=true pnpm build     # opens the treemap; use it to hunt the fix in measure-and-budget.md
```

## 3. Lighthouse CI — fail the build on a budget regression

`lighthouserc.json` at the project root:
```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm start",
      "url": ["http://localhost:3000/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 300 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```
`.github/workflows/lighthouse.yml`:
```yaml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: npx @lhci/cli autorun
```
Add the URLs of your real critical routes to `collect.url` (not just `/`). Tune thresholds to the
budgets in `measure-and-budget.md`; start as `warn`, promote to `error` once the site is green so a
PR that regresses LCP fails visibly.

## 4. Bundle-size guard (lightweight alternative / complement)

If full Lighthouse CI is heavier than a project needs, gate on first-load JS instead — the
Next.js build already prints it. A minimal check: fail if any route's First Load JS crosses the
budget. `size-limit` with `@size-limit/file` against `.next/static/chunks/**` works, or a small
script that greps the build output. Keep the budget from `measure-and-budget.md` (~130KB gz/route).

## Note for the new-project pipeline

These aren't opt-in polish — they're the starting line. §1 (config defaults) and §2 (analyzer)
ship in `starters/nextjs-saas/`, so every scaffolded project inherits them; §3/§4 (CI guard) get
wired before ship (Step 5–6 of the `new-project` skill). When a new perf default proves out on a
real project, push it back into `starters/nextjs-saas/` per the `add-to-meirlabs` skill so the
next project inherits it instead of re-deriving it.
