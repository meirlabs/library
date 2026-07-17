# Delivery — ship less, load it in parallel

Lever 1. Bytes and round trips on the critical path. Calibrated to our stack (Next.js 15 App
Router, React 19, ui-kit, Hugeicons, PostHog, Vercel). Real footguns from `apps/web` are called
out inline so you fix the ones we actually have.

## Images — the #1 footgun in our codebase

`apps/web` still mixes `next/image` with raw `<img>` — run `grep -rl "<img" apps/web/app` for the
current list rather than trusting a count here. Two hits are intentional and stay raw:
`app/(app)/projects/projects-table.tsx` (deliberate plain `<img>`) and `lib/og/renderCard.tsx`
(OG image route — can't use `next/image`). Raw `<img>` for a photo ships the full PNG/JPG with no
`srcset`, no format conversion, and no automatic lazy-load. **Fix the raster, not the symptom.**

```tsx
// ❌ raw img — no AVIF/WebP, no srcset, no width/height → CLS + oversized bytes
<img src="/home/elianna.png" alt="Elianna" />

// ✅ next/image — AVIF/WebP, responsive srcset, lazy below the fold, reserved space
import Image from "next/image";
<Image src="/home/elianna.png" alt="Elianna" width={96} height={96} />
// the ONE image above the fold (hero/LCP) gets priority so it isn't lazy-loaded:
<Image src={hero} alt="" priority sizes="100vw" />
```

Rules:
- Every raster (photo, avatar, hero, inline article image) goes through `next/image`. SVG icons do not (they're markup).
- `next.config.ts` sets `images.formats: ["image/avif", "image/webp"]` in both `apps/web` and the starter. For remote images add `remotePatterns` and `minimumCacheTTL`.
- Always pass `width`/`height` (or `fill` + a sized parent) so space is reserved → no CLS.
- Exactly one `priority` image per route: the LCP element. Everything else stays lazy.
- Compress source assets before they land in `public/` — `next/image` optimizes delivery, not your 450KB source PNG's storage.

## Fonts — currently our best free win, easy to wreck

We ship the **system font stack** (`--ml-font-sans` in ui-kit) — zero webfont download, no FOIT,
no swap shift. `design/foundation/typography.md` calls Geist load-bearing but no Geist file is
actually loaded anywhere. **Do not "fix" that by adding `next/font/google` Geist without a reason**
— you'd add a font download and swap cost to a site that currently has none.

If a webfont is genuinely required, do it the Linear way (all three or you get a footgun):
```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--ml-font-sans" });
// next/font self-hosts, preloads, and matches crossorigin automatically — this is why we prefer it
// over hand-rolled <link> tags. One variable font covers all weights (font-weight: 100 900).
```
Never both `<link rel="preload" as="font">` *and* let CSS `@font-face` fetch the same file with a
different `crossorigin` — that double-fetches. `next/font` avoids this; if you hand-roll, match
`crossorigin="anonymous"` on preload and `@font-face`, and `preconnect` the asset host.

## JavaScript — split by route, judge per critical path

Total JS is the wrong number. Linear ships ~21MB minified but splits it into hundreds of
route-level chunks, so no single page pays it. Next.js App Router already splits per route segment
— your job is to keep shared/heavy code out of every route's chunk.

- **`next/dynamic` for heavy, non-critical, or below-fold client components.** `apps/web` uses it exactly once; heavy animated heroes (`HeroDisc`, `HeroDots`, `AuditTerminal`) ship eagerly. Lazy-load them:
  ```tsx
  const AuditTerminal = dynamic(() => import("./AuditTerminal"), { ssr: false, loading: () => <TerminalSkeleton /> });
  ```
- **Watch `"use client"` creep.** 40% of `apps/web`'s `app/*.tsx` are client components. Every `"use client"` boundary pulls that subtree's JS to the browser. Keep pages as Server Components; push interactivity to small leaf islands.
- **ui-kit is stamped `"use client"` wholesale** (tsup `banner`). Importing even one presentational ui-kit primitive (`Tag`, `StatusPill`) forces a client boundary into that route. Fine for interactive pages; for a near-static marketing page, prefer a plain server-rendered element over a ui-kit import you don't need the interactivity of.
- **Hugeicons: keep per-icon named imports** (`import { X } from "@hugeicons-pro/core-stroke-rounded"`). `apps/web` does this consistently — it's tree-shakeable. Never barrel-import the whole set.
- **Modern build target.** Linear's single biggest bundler win was `target: "esnext"` — no ES5 transpile, no polyfills. Check `browserslist`/`tsconfig` target; a modern-only audience shouldn't pay for IE-era output.
- **`experimental.optimizePackageImports`** in `next.config.ts` for barrel-heavy libs — see `ci.md`.

## Preloading — fire the waterfall in parallel

Chunk loading is a serial waterfall unless the browser is told what's coming: fetch entry → parse →
discover imports → fetch → parse… Linear puts `<link rel="modulepreload">` for every critical chunk
in `<head>` so they all fire at once.
- Next.js emits modulepreload for statically-analyzable route imports automatically — verify it's happening for your critical route (DevTools → Network, look for the parallel chunk fetches).
- For a known-needed `dynamic()` import, add a manual preload so it isn't discovered late.
- **Matched `crossorigin`:** a preload whose CORS mode differs from the real request double-fetches. Every preload's `crossorigin` must match its consumer. Lint-style check on any hand-written `<link rel="preload">`.
- Use `<Link prefetch>` (default in App Router) so in-viewport route chunks + data are warm before the click.

## Third parties — after the app, never before

- **PostHog:** loaded as a client component; init at module scope so it runs before child effects — good, and it doesn't block SSR/first paint. Config is right (`autocapture:false`, manual pageviews). Keep the `PostHogPageview` (`useSearchParams`) wrapped in `<Suspense>` so it doesn't de-opt the tree to client rendering. Don't move init earlier or make it block paint.
- Any chat widget / embed / third-party script: `next/script` with `strategy="lazyOnload"` (or `afterInteractive` at most). Never render-blocking.

## Static-first rendering

- `generateStaticParams` + `export const revalidate = <seconds>` (ISR) for content routes — `apps/web` does this for articles/locales (`revalidate = 300`). Copy that pattern.
- `export const dynamic = "force-dynamic"` **only** for auth'd/personalized routes (`(app)/*`). It opts out of static generation and pays SSR on every request — scope it tightly.
- `unstable_cache` (with `revalidate`) for per-request data that can tolerate staleness (view counts, etc.).
