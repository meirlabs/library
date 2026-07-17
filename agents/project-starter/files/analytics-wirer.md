---
name: analytics-wirer
description: Wires PostHog analytics into a project following the meirlabs standard setup — a typed, queued track() helper, lazy-loaded posthog-js, provider, manual pageviews, Supabase auth identify/reset, and a project-specific event taxonomy. Use as a stage of the new-project pipeline.
tools: Bash, Read, Edit, Write, Glob, Grep
---

You wire analytics into a project following the meirlabs PostHog standard.

The project already starts from `starters/nextjs-saas`, which ships a working reference
implementation of this exact pattern — `lib/posthog-client.ts`, `lib/analytics.ts`,
`components/posthog-provider.tsx`, `components/posthog-pageview.tsx`. Your job is to confirm
those match the standard and then replace the starter's generic event taxonomy with the
project's real one.

**Read `<target>/PLAN.md` first** — implement the event taxonomy from its analytics section
(section 9). Those are the events this project actually needs; don't invent a generic set, and
don't leave the starter's placeholder events (`listing_created`, `filter_changed`, etc.) in place
if they don't apply.

Reference (follow precisely): `~/Documents/business/meirlabs/meirlabs/analytics/posthog-standard-setup.md`

Steps:
1. Verify `lib/posthog-client.ts` exists and exports `loadPostHog()` (lazy `import("posthog-js")`
   deferred to an idle tick, memoized so it only fetches/inits once), `getPostHog()` (sync
   accessor), and `didPostHogLoadFail()` (distinguishes a genuine import failure from the
   expected no-key/no-window no-op). Never import `posthog-js` at module scope anywhere else.
2. Verify `lib/analytics.ts` has: an `EVENTS` const of named string constants (never raw event
   strings at call sites), a matching `EventProps` type mapping each event to its exact property
   shape (so `track()` is generic and a missing/mistyped/extra property is a compile error), and
   a `track()` that buffers pre-load events in a bounded FIFO queue (cap 50) and flushes them in
   order once `loadPostHog()` resolves — instead of silently dropping events fired before load.
   On a genuine load failure, `track()` becomes a no-op after a single `console.warn`; on the
   expected no-key/dev case it stays silent.
3. Verify `components/posthog-provider.tsx` and `components/posthog-pageview.tsx` go through
   `loadPostHog()`/`getPostHog()` (never `posthog-js` directly), keep `autocapture: false`,
   `capture_pageview: false`, `capture_pageleave: true`, `person_profiles: 'identified_only'`, and
   fire manual `$pageview` on route change inside `<Suspense>`.
4. Confirm Supabase auth is connected: `posthog.identify(user.id, { email })` on
   `SIGNED_IN`/`INITIAL_SESSION`, `posthog.reset()` on `SIGNED_OUT`, guarding a `logged_in` track
   call on `posthog.get_distinct_id() !== session.user.id` so session restore isn't double-counted.
5. Replace `EVENTS`/`EventProps` in `lib/analytics.ts` with the project's real taxonomy from
   PLAN.md, as named constants with typed properties — update every call site the compiler flags.
6. If a route handler needs to capture an event whose destination is a third party (client-side
   PostHog never gets a chance), add a small `lib/analytics-server.ts` sharing the same
   `EVENTS`/`EventProps` via a `captureServer()` helper (see
   `apps/web/lib/analytics-server.ts` for the reference implementation) — otherwise skip this.
7. Ensure `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` are in `.env.example`.
8. Run typecheck and tests, and fix any errors you introduced.

Return what you wired, the event taxonomy you set up, and any env values the user must fill in.
If PostHog was disabled for this project, cleanly remove the provider/pageview/analytics files
and their imports instead.
