# Lanes

Each tester gets: the lane checklist below, its slice of the test plan, the environment and accounts, and the shared rules. Every prompt ends with the candidate schema and **"Do not modify any file, config, or data. Report only."**

## Shared prompt footer

```
Rules:
- You are a QA tester. Find issues; never fix them. Do not edit, create, or delete
  source files, config, migrations, or app data. Only write under qa-army/<date>/evidence/.
- No real emails, payments, or public posts. Stop at the last safe step and note it.
- Known issues (do not refile): <list from tracker>.
Return JSON: { candidates: [ { id, title, area, lane, test_case, steps[], expected,
  actual, evidence[], suspected_severity, environment } ], cases_run: [TC-ids],
  cases_blocked: [{ id, reason }] }
Return an empty candidates list if nothing is wrong. Do not invent issues.
```

## Automated runner

Model: small/fast. Mechanical, verifiable output.

- Discover suites: `package.json` scripts, Playwright/Vitest/Jest/pytest configs, CI workflow files.
- Run, in order: typecheck, lint, unit, integration, e2e, production build. Capture exit code and failing output verbatim.
- One candidate per **distinct failure** (group tests that fail for the same reason).
- Note suites that can't run (missing env, services down) as `cases_blocked`, not as bugs.
- Don't edit tests to make them pass. Don't update snapshots.

## Scripted browser tester

Model: mid. Follows the plan exactly.

- Run each assigned TC in a fresh, isolated headless browser context.
- Screenshot at the end of every case and at the moment of any failure. Save to `qa-army/<date>/evidence/TC-xxx-<n>.png`.
- After each case, collect console errors and failed network requests (4xx/5xx).
- Check each case at every viewport in the plan.
- A console error or failed request during a passing case is still a candidate (Minor unless it hides a real failure).

## Exploratory browser tester

Model: strongest or mid. Thinks like a user, not a script.

Take one persona from the plan per run and try to break the app:

- Inputs: empty, whitespace, max length +1, emoji, RTL, HTML/script tags, SQL-ish strings, negative numbers, dates far in the past/future, pasted rich text.
- Navigation: back/forward mid-flow, refresh on every step, deep-link straight to step 3, open the same flow in two tabs.
- Timing: double-click every submit, click during loading, slow network (throttle), offline then online.
- Layout: 390px wide, zoom 200%, long names/translations, dark mode, every locale.
- States: empty lists, one item, many items, errors from the server, expired session.
- Access: open another user's URL/ID, change IDs in the URL, try admin pages as a user.
- Feel: anything confusing, misleading, or that would make a real person give up — file as UX at the right priority.

## Code inspector

Model: strongest. Finds what the UI can't show.

- Every route/handler: is the user checked? Is ownership checked for the object ID? What happens on bad input?
- Data access: missing filters by user/tenant, row-level security assumptions, N+1 queries on hot paths.
- Error handling: swallowed errors (`catch {}`), success shown on failure, unhandled promise rejections, missing loading/error states.
- State and timing: race conditions on double-submit, stale cache after mutation, optimistic UI without rollback.
- Edge logic: off-by-one, timezones, currency rounding, pagination boundaries, empty arrays, null/undefined.
- Config: env vars read without fallback, feature flags with dead branches, secrets reachable from the client.
- Each candidate needs `file:line` and a concrete scenario showing the wrong outcome; then ask a browser tester to reproduce it if it's user-visible.
- Security-shaped findings: note them, but for a full security pass recommend a dedicated security audit.

## Verifier

Model: strongest. Fresh context: gets only one candidate's steps, environment, and account.

```
Here is a reported issue. Reproduce it from these steps alone.
Default to "not reproduced" unless you observe the actual result yourself.
If it reproduces only sometimes, run it 5 times and report the hit rate.
If the behavior is intended (check docs, code comments, product copy), say so.
Return { id, verdict: confirmed | flaky | not_reproduced | as_designed,
         hit_rate, notes, extra_evidence[] }
```

## Ticket writer

Model: mid. Gets verified issues + ratings, writes tickets with `tickets.md`. The TL;DR is the part that matters most: read it back as someone who has never seen the code.
