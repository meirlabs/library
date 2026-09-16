---
name: new-project
description: Spin up a new project from the meirlabs homebase. Use when the user says "new project", "start a project", "bootstrap a project", or wants to scaffold an app with the standard stack (Next.js + ui-kit + Supabase + PostHog + Hugeicons). Runs discovery, writes an approved PLAN.md first, then scaffolds, applies the design system, wires analytics, wires tests (Vitest + Playwright + CI), writes docs, and optionally creates a private GitHub repo. Does not build until the plan is approved.
---

# New Project

Bootstrap a new project from the meirlabs homebase so you never start from scratch.

Homebase root: `~/Documents/business/meirlabs/meirlabs`
Default project location: `~/Documents/business/projects/in-development/<name>`. The starter's
`@meir-labs/ui-kit` file: dependency path is relative, so the scaffolder must compute it from
wherever the project actually lands, not assume a fixed depth: from `in-development` that path
is `file:../../../meirlabs/product/ui-kit`.

**Do not write any code or scaffold anything until the plan (Step 2) is approved.** Understand
the project first, produce a great plan, get a yes, then build.

## Step 1 — Discovery (understand the project)

**Check the project's origin first.** The /projects/new dashboard is an AI intake wizard
(rewritten 2026-06-25): its only Supabase write (`/api/start`) inserts `projects` rows already at
status `building` — with a plan, the intake answers, a created GitHub repo, and a dispatched cloud
build. Dashboard-originated projects therefore arrive with a full `PLAN.md` and a live repo: pick
them up from there (clone the repo, read `PLAN.md`) rather than re-running discovery. No flow
leaves rows at status `planning`, so `scripts/get-brief.mjs` (which queries `status=planning`)
finds nothing for new work.

A fully local/manual start — the user describing an idea in a session — is the path that actually
goes through this skill's discovery and planning gate.

First get the **brief** in the user's own words. If they already described the project when
invoking, use that; otherwise ask them to describe the idea in a sentence or two (this one is
open-ended — a plain prompt is fine here).

Then nail down the decisions with the AskUserQuestion tool (batched, options-based, up to 4 per
call — run a second round if needed). Cover, as relevant to the idea:
- **Primary user** — who is this for? (offer the most likely personas for this idea)
- **MVP cut** — what's the smallest first version? (offer scope options from lean → fuller)
- **Must-have features** — the P0 capabilities (multiSelect)
- **Monetization** — free / subscription / usage / not yet
- **Auth & data needs** — drives the Supabase decision
- **Design vibe** — drives the design-applier (SaaS dashboard vs. marketing-forward, etc.)

Confirm the project **name** (kebab-case) and **location** (default
`~/Documents/business/projects/in-development/<name>`).

## Step 2 — Plan (and get approval — gate before building)

Hand the brief + all answers to the **planner** agent (`agents/planner.md`). It writes a strong
`PLAN.md` into the target dir (problem, users, MVP scope, prioritized features, key flows, data
model, stack decisions, analytics taxonomy, milestones, risks).

Present the plan to the user. **Iterate until they approve it.** Use ExitPlanMode or an explicit
confirmation — do not proceed to scaffolding without a clear yes. The plan also settles the build
config below, so confirm those toggles as part of approval:
- **Stack** — SaaS app (App Router) [default] · Landing/marketing · Minimal Next.js
- **Supabase?** · **PostHog?** · **Create private GitHub repo?**  (pre-fill from the plan's recommendations)

## Step 3 — Scaffold

Two paths (both are supported — pick based on the user's preference; default to local copy):
- **Local copy** (default): the `scaffolder` agent copies `starters/nextjs-saas/` into the target.
- **From GitHub template**: `gh repo create <name> --private --template xmeir-dev/meirlabs-starter --clone`,
  then continue from the clone.

Run the **scaffolder** agent (`agents/scaffolder.md`): copy template, replace `__PROJECT_NAME__`,
fix the `@meir-labs/ui-kit` path, set up `.npmrc`, prune disabled features, install deps. The
scaffolder preserves the existing `PLAN.md` in the target. With Supabase on, it also confirms the
starter's Supabase agent skills came along (`.claude/skills/supabase`,
`.claude/skills/supabase-postgres-best-practices`, `skills-lock.json`, `lib/storageCdn.ts`);
with Supabase off it removes them. Every later stage that touches the schema loads
`supabase-postgres-best-practices` first (rule in the starter's `CLAUDE.md`).

**Register in the tracker:** ensure a row for this project exists in the meirlabs Supabase
`projects` table (dashboard-originated projects already have a row at status `building`). Upsert via
the REST API using `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from `.env.sync` — set `repo_path`
to the target path and `status` to `building` (then `live` once it ships). After building, run
`node scripts/sync-projects.mjs` to populate git-derived time/cost. The dashboard reads this live.

## Step 4 — Pipeline (run these agents in order, each builds on the last)

Every agent in this step reads `<target>/PLAN.md` first and builds toward it — not a generic app.

1. **design-applier** (`agents/design-applier.md`) — apply DESIGN-SAAS tokens, build the base layout
   and the key screens from the plan's user flows, verify icons. The starter already ships the
   **`web-performance`** skill's `next.config.ts` perf defaults and `@next/bundle-analyzer` — keep
   them intact and follow the skill's `next/image` + font conventions; the only perf wiring left
   on a new project is the Lighthouse-CI / bundle-size guard (`references/ci.md`).
2. **analytics-wirer** (`agents/analytics-wirer.md`) — wire PostHog per the standard, implementing the
   plan's event taxonomy (skip/remove if disabled).
3. **test-wirer** (`agents/test-wirer.md`) — the starter ships the **`testing`** skill's baseline
   (Vitest + Testing Library + Playwright, sample tests, CI workflow); keep it intact. This stage
   replaces the samples with real tests for the screens and logic the earlier stages actually built
   from the plan, and confirms both suites run green. Runs after design-applier and analytics-wirer.
4. **docs-writer** (`agents/docs-writer.md`) — write project CLAUDE.md / AGENTS.md / README, linking PLAN.md.

For speed you may run design-applier and analytics-wirer concurrently (they touch different files),
then test-wirer, then docs-writer last. If using the Workflow tool, `workflows/new-project.js`
encodes this pipeline.

## Step 5 — Verify

Run the build/typecheck (`pnpm build` or `npm run build`) **and the test suites** (`npm run test`,
then `npm run test:e2e`). All three must be green — a red test blocks the ship the same way a
broken build does (see the **`testing`** skill). Report failures verbatim; fix obvious wiring
issues before continuing.

## Step 6 — Ship

If GitHub was requested and not already created via template:
```
cd <target> && git init && git add -A && git commit -m "Initial scaffold from meirlabs starter"
gh repo create <name> --private --source=. --push
```
Then `open` the project (and the GitHub URL). Commit `PLAN.md` with the initial scaffold.

The starter's `.github/workflows/ci.yml` runs typecheck + tests on every push. For it to install
deps it needs the Hugeicons secret on the repo: `gh secret set HUGEICONS_TOKEN` (value is in
`~/.zshrc`). Do this right after `gh repo create`, or the first CI run fails on install.

## Step 7 — Report

Summarize: location, repo URL, what was built against the plan, and the manual steps left
(Hugeicons token in `.npmrc`, fill `.env.local` with Supabase/PostHog keys). Point to `PLAN.md`
and the milestones as the next steps.

## Notes
- Never commit secrets. `.env.local` stays local; only `.env.example` is tracked — see the **`security-audit`** skill for the full `NEXT_PUBLIC_` rule.
- Before the project goes live (or any auth/API-route/DB work lands), run the **`security-audit`** skill on it — it catches unauthenticated routes, RLS gaps, and leaked secrets before they reach production.
- Speed is a starting constraint, not a launch-day rescue. Follow the **`web-performance`** skill: the starter bakes in its `next.config.ts` perf defaults + bundle analyzer; wire its Lighthouse-CI / bundle-size guard before ship so regressions fail loud. Calibrated to `design/foundation/performance.md`.
- The starter consumes `@meir-labs/ui-kit` from `~/Documents/business/meirlabs/product/ui-kit`.
- Honor all rules in `design/ui-preferences.md` and the global `config/CLAUDE.md`.
