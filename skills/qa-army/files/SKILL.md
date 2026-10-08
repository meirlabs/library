---
name: qa-army
description: Run a full QA regression of an app with an army of agents — the strongest model writes the test plan, then automated, browser, and code-reading testers run rounds in parallel and file every issue as a ticket (one master regression ticket + prioritized subtickets, each with a plain-English TL;DR). Finds issues only, never fixes them. Use when the user says "qa army", "full regression", "QA the app", "test everything", "find all the bugs", or wants a pre-release QA pass.
---

# QA Army

A full regression of one app, run by a team of agents, ending in tickets. The strongest model writes the test plan; testers matched to their strengths execute it in rounds; every new confirmed issue becomes a subticket under one master regression ticket, each opening with a TL;DR anyone can read. Existing tickets are reused; reopened tickets have no parent.

**This skill finds issues. It never fixes them.** No code edits, no commits, no PRs, no "quick fix while I'm here". The only things it writes are the test plan, evidence files, and tickets.

## Operating rules (read first)

1. **Find, don't fix.** Testers may read code, run tests, and drive the app. They may not edit source, config, migrations, or data the app depends on. A tester that spots the fix writes it as a *hint* in the ticket and moves on.
2. **Safe target only.** Run against local, preview, or staging. Production only if the user says so, and then read-only: no sign-ups with real emails, no payments, no sends, no deletes. Use test accounts and seed data the user provides or approves.
3. **Nothing outward-facing.** Never send real emails/SMS/WhatsApp, never charge a card, never post publicly. If a flow needs that to complete, test up to the last safe step and note the gap.
4. **Evidence or it didn't happen.** Every issue carries reproduction steps and at least one artifact: a screenshot, console/network log, failing test output, or `file:line`.
5. **Confirm before filing.** A second agent reproduces each candidate before it becomes a ticket (Phase 4). Flaky = filed as flaky, not as a bug.
6. **Dedupe before filing.** Search the tracker (open and recently closed) for the same issue; comment on an existing ticket instead of opening a duplicate.
7. **Reopened tickets lose their parent.** Whenever reopening a ticket in any project or team, including returning it for further work after failed QA, automatically clear its actual parent relationship without asking. Reopened tickets stay parentless unless the user explicitly requests a parent. Read back and verify the reopened status and no parent; report any unlinking failure. See `references/tickets.md` for tracker handling.

## Inputs to gather (ask once, batched)

- **Target:** URL(s) and/or repo path. Which environment.
- **Access:** test accounts per role (anonymous, user, admin, other tenant), seed data, feature flags.
- **Scope:** whole app (default) or named areas; what changed recently (git log since last release is a good proxy).
- **Tracker:** Linear (team + project), GitHub Issues (repo), or local markdown (default fallback: `qa-army/<date>/tickets/`).
- **Depth:** `quick` (one round, critical paths only) / `full` (default, rounds until dry) / `deep` (adds exploratory personas and cross-browser).

If something is missing and has a sensible default, use the default and say so in the master ticket.

## The roles

Match each job to the cheapest model that does it well. Anything that reasons about intended behavior stays on the strongest model.

| Role | Model tier | Job |
|------|-----------|-----|
| **Planner** | strongest | Maps the app, writes the test plan, assigns lanes |
| **Automated runner** | small/fast | Runs existing suites (unit, integration, e2e, typecheck, lint, build) and reports failures verbatim |
| **Scripted browser tester** | mid | Executes the plan's step-by-step cases in a headless browser, screenshot per case |
| **Exploratory browser tester** | strongest or mid | Uses the app like a real persona — wrong inputs, back button, refresh mid-flow, double-clicks, slow network, mobile width |
| **Code inspector** | strongest | Reads routes, handlers, data access, and edge-case logic for bugs the UI can't reveal (unchecked states, silent catches, wrong permissions, race conditions) |
| **Verifier** | strongest | Re-reproduces each candidate from its steps alone, rejects what doesn't reproduce |
| **Ticket writer** | mid | Turns verified issues into tickets in the house format |

Full lane checklists and prompt templates: `references/lanes.md`.

## The method

### Phase 0 — Recon (Planner)

Build a map before writing a single test case:

- Stack, scripts, and existing test suites (`package.json`, `playwright.config.*`, `vitest.config.*`, CI files).
- Every route/screen and every API entry point. Every role and what it should and shouldn't see.
- The **critical journeys**: the 3–7 flows that, if broken, make the product useless or lose money/data (sign-up, sign-in, the core action, payment, data export...).
- Recent changes: `git log --since=<last release>` — weight testing toward them.
- Known issues already in the tracker, so testers don't refile them.

### Phase 1 — Test plan (Planner, strongest model)

Write `qa-army/<date>/TEST-PLAN.md` using `references/test-plan.md`. It holds:

- Scope and out-of-scope, environment, accounts.
- A coverage matrix: area × lane (which areas get automated, scripted browser, exploratory, code inspection).
- Numbered test cases (`TC-001`…) — preconditions, steps, expected result, priority, lane.
- Personas for exploratory testing.
- Viewports/browsers for the depth chosen.

Show the plan to the user as message text before running anything heavier than recon, unless they said to go end-to-end without stopping.

### Phase 2 — Rounds (all testers, parallel)

Fan out one agent per lane per area. Every tester returns **candidates** in this shape (not tickets yet):

```
id, title, area, lane, test_case (TC-xxx or "exploratory"),
steps[], expected, actual, evidence[], suspected_severity, environment
```

Rounds:

- **Round 1 — Plan coverage.** Every test case in the plan gets executed once. Automated runner goes first; its failures seed the others.
- **Round 2+ — Gaps and hotspots.** The Planner reviews round results, adds cases where bugs clustered (bugs cluster), and reassigns. Exploratory testers get new personas.
- **Stop** when two consecutive rounds surface nothing new (dedupe against everything *seen*, not just confirmed), or at the round cap for the depth (`quick` 1, `full` 4, `deep` 6).

### Phase 3 — Dedupe (Planner)

Merge candidates that are the same root symptom seen from different lanes (a failing e2e test + a broken button + a 500 in the logs may be one issue). Keep all evidence on the merged candidate.

### Phase 4 — Verify (Verifier, strongest model)

For each candidate, a fresh agent with **only** the steps and environment tries to reproduce it.

- Reproduces → confirmed.
- Reproduces sometimes → confirmed, labeled `flaky`, with the hit rate (e.g. 3/5).
- Doesn't reproduce → dropped, listed in the master ticket's "not reproduced" section.
- Works as designed → dropped unless the design itself hurts users; then filed as a UX issue at Low.

### Phase 5 — Rate

Rate each confirmed issue on four separate axes (scales in `references/tickets.md`):

- **Priority** — Urgent / High / Medium / Low: how soon it should be fixed.
- **Severity** — Blocker / Major / Minor / Cosmetic: how bad it is when it happens.
- **Risk** — High / Medium / Low: blast radius × likelihood — how many users hit it, and what's lost (data, money, trust, security).
- **Effort** — XS / S / M / L / XL (map to the tracker's estimate field): rough size of the fix, judged from the code, without fixing.

### Phase 6 — File tickets

Use `references/tickets.md` for exact templates.

1. **Master regression ticket** first: `QA regression — <app> — <date>`. Holds the TL;DR of the whole run, coverage, counts by priority, the top 3 to fix first, what wasn't tested and why, and links to every subticket.
2. **One new subticket per confirmed issue that has no existing ticket**, linked as a child of the master. Reuse existing tickets; if reopened, remove their parent and link them from the master's report as references only. Every new subticket opens with a **TL;DR** in plain, non-technical language — what's broken, who notices, why it matters — before any technical detail.
3. Set priority, estimate, labels (`qa-army`, area, `flaky` when relevant), and project in the tracker's real fields, not only in text. Read each ticket back and confirm the fields stuck.
4. Set status to the team's to-do state. Assign no one unless asked.

### Phase 7 — Report

Reply to the user with: the master ticket link, counts by priority, the top 3 issues in one line each, and what wasn't covered. Nothing else.

## Harness notes

The method is the same everywhere; only the fan-out mechanism changes.

- **Claude Code:** spawn testers with the Agent tool (one per lane × area, in a single message so they run in parallel), passing a model per the roles table. For a large app and a user who opted into multi-agent orchestration, use a Workflow: `pipeline(lanes, run, verify)`. Browser lanes use the Playwright MCP server (isolated headless browser), never the user's own logged-in browser unless they ask.
- **Codex:** use subagents if the session supports them; otherwise run the lanes sequentially in the same order (automated → scripted → exploratory → code inspection), and run verification in a fresh session or as a separate pass that reads only the candidate list. Browser lanes use Playwright (`npx playwright` scripts or a Playwright MCP server).
- **Trackers:** Linear via its MCP server; GitHub via `gh issue create` with a sub-issue/task-list link to the master; otherwise local markdown files in `qa-army/<date>/tickets/` (`000-master.md`, `001-<slug>.md`, …).

## Anti-patterns

- Fixing something. Even one line. File it.
- Filing a candidate nobody re-reproduced.
- A TL;DR that uses jargon ("hydration mismatch on the RSC boundary"). Say what the person using the app sees.
- One giant ticket listing 30 bugs. One issue per subticket.
- Severity inflation: a typo is not High because it's on the home page. Use the scales.
- Raw test-runner dumps pasted as tickets. Group failures by root cause, one ticket each.
- Testing against production with real side effects.
- Silent gaps: anything not tested goes in the master ticket's "not covered" list.

## References

- `references/test-plan.md` — the test plan template the Planner fills in.
- `references/lanes.md` — per-lane checklists and the prompt template for each tester.
- `references/tickets.md` — master and subticket templates, rating scales, and tracker field mapping.
