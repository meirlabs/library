---
name: testing
description: The meirlabs automated-testing standard. How every project sets up, writes, and runs tests, and how Claude reports results to a non-coder owner in plain language. Use when the user says "set up tests", "add tests", "write a test for this", "run the tests", "run the tests again", "why is CI red?", "is it safe to deploy?", "did I break anything?", or reports a bug (write a failing test first, then fix). Wiring a project is done by the test-wirer agent; the deploy skill hard-gates on green tests.
---

# Testing

Tests are how the owner, who does not read code, knows the software works. The owner never
writes or reads a test. Claude ALWAYS writes and maintains them, and reports back in plain
words: what passed, what broke, and what happens next. Treat the test suite as the owner's
eyes on the codebase. If the suite is green, the owner can trust the app. That trust only
holds if Claude keeps the suite honest, so the rules below are not optional.

## The canonical stack (meirlabs testing standard v1)

Every wired project uses exactly this. Do not substitute Jest, Cypress, or ad-hoc scripts.

**Unit and integration** (Vitest, jsdom):
- `vitest@^3`, `@testing-library/react@^16`, `@testing-library/jest-dom@^6`, `jsdom@^25`,
  `@vitejs/plugin-react@^5` as devDependencies, plus an explicit `vite@^7` devDependency
  (plugin-react@4 peer-conflicts with vite 7).
- `vitest.config.ts`: jsdom environment, `globals: true`, `setupFiles: ['./test/setup.ts']`,
  `exclude` covering `e2e/**` and `node_modules` (Playwright specs must never run under Vitest).
- `test/setup.ts`: imports `@testing-library/jest-dom/vitest` and runs Testing Library
  `cleanup()` in `afterEach`. This is the same setup ui-kit uses, so behavior stays consistent
  across the whole codebase.

**End to end** (Playwright, real browser):
- `@playwright/test` as a devDependency, chromium project only.
- Specs live in `e2e/`, named `e2e/*.spec.ts`.
- `playwright.config.ts` has a `webServer` block: locally it runs the dev server with
  `reuseExistingServer: !process.env.CI`; in CI it does a production `build` then `start` so
  E2E runs against the real build, not dev.

**Conventions:**
- Unit and integration tests sit next to the code they test: `lib/pricing.ts` gets
  `lib/pricing.test.ts`; `components/Card.tsx` gets `components/Card.test.tsx`.
- E2E specs live only in `e2e/`, as `e2e/*.spec.ts`.
- Every project ships at least three real tests: one `lib/` unit test (pure logic), one
  component render test (a component mounts and shows what it should), and one E2E smoke spec
  (home page renders, the key nav works, and there are no console errors).

**Scripts** (in `package.json`):
```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"test:all": "vitest run && playwright test"
```

## Standing rules for every session in a wired project

These apply to Claude on every task, not just testing tasks:

1. **Every new feature ships with tests.** New logic gets unit/integration tests. A new user
   flow gets an E2E update. A feature is not done until its tests exist and pass.
2. **A reported bug starts with a failing test.** When the owner reports a bug, FIRST write a
   test that reproduces it and fails, then fix the code until that test passes. This matches the
   owner's global rule. Never fix a bug without leaving a test that would catch it again.
3. **Never delete or skip a failing test to make the suite green.** A red test is information.
   Fix the code, or if the test itself is wrong, explain to the owner why and get a yes before
   changing it. Silently deleting, `.skip`-ing, or commenting out a failing test is forbidden:
   it hands the owner a green light that lies.
4. **Keep the suite fast.** The unit suite should stay under about 30 seconds. Slow tests get
   skipped, and skipped tests protect nothing. Push slow things (real network, real DB) into a
   small number of E2E specs, keep unit tests pure.

## Plain-language reporting

The owner cannot read a stack trace, so do not paste one. After any test run, report like this.

On success:
> All 34 checks passed (24 logic, 7 component, 3 browser). Safe to deploy.

On failure, name what broke in owner terms and say what you will do:
> 1 check failed. The article page stopped showing the publish date. I am fixing the date
> formatting now and will re-run.

Rules for the report:
- Group counts as logic (Vitest lib tests), component (Vitest render tests), browser (Playwright).
- Describe failures as user-visible effects ("the login button did nothing"), not by test name
  or assertion.
- No raw stack traces, no jargon walls. Show them only if the owner asks "show me the error".
- Always end with the practical answer the owner cares about: safe to deploy, or not yet.

## How to run

Exact commands (from the project root):
```bash
npm run test        # unit + integration, one pass (vitest run)
npm run test:watch  # re-run on save while developing
npm run test:e2e    # Playwright browser tests
npm run test:all    # everything, the pre-deploy gate
```
Use whatever package manager the project uses (`pnpm run test` if it has a `pnpm-lock.yaml`,
`npm run test` for `package-lock.json`). Do not introduce a second lockfile.

What the owner types in plain words, and what Claude does:
- **"run the tests"** → `npm run test:all`, then report in plain language.
- **"add tests for X"** → write unit/integration tests for X's logic, an E2E update if X is a
  user flow, run them, report.
- **"why is CI red?"** → open the failing GitHub Actions run, find the failing step, translate
  it into what broke and how you will fix it.
- **"is it safe to deploy?"** → run `test:all`; safe only if everything is green.

## Wiring a project

Do not hand-assemble the config. The **`test-wirer` agent** (`agents/test-wirer.md`) installs the
stack, writes the config files, adds the scripts and CI, writes real starter tests against the
project's own code, and iterates until green. It is idempotent: on a project that already has
Vitest or Playwright (ui-kit, for example, already ships Vitest and 28 tests) it fills gaps and
upgrades instead of clobbering.

- **New project:** the test-wirer runs as a stage of the `new-project` pipeline, after the
  scaffolder and alongside the other wiring agents. A project is not "scaffolded" until it has a
  passing suite and a CI workflow.
- **Existing project:** run the test-wirer standalone to retrofit the stack.

## CI

Wired projects get `.github/workflows/ci.yml`, running on every push and pull request:
setup-node with dependency caching → install → typecheck → `vitest run` → build →
`npx playwright install chromium --with-deps` → `playwright test`.

On GitHub, the green check on a commit or PR means the whole suite passed on a clean machine;
the red X means something is broken and it is NOT safe to deploy. "Why is CI red?" means: open
that run, find the red step, and translate it.

Two gotchas the workflow must handle (the test-wirer sets these up, but know them when CI is red):
- **Hugeicons Pro auth.** Projects using Hugeicons Pro have an authed `.npmrc`, so the CI
  install fails with a 401 on `@hugeicons-pro` unless a `HUGEICONS_TOKEN` repo secret exists.
  Set it once per repo: `gh secret set HUGEICONS_TOKEN`. A CI install that dies on
  `@hugeicons-pro` is almost always the missing secret.
- **Build-time env vars.** A Next build (and the E2E `webServer` build) reads
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the PostHog vars. If they are
  absent the build can fail. The workflow provides harmless placeholder values as env vars for
  the build and E2E steps unless real staging values are configured as secrets. Placeholders are
  fine: the smoke spec checks that pages render, not that live data loads.

**The deploy skill hard-gates on green tests.** Do not deploy with a red or unrun suite. Run
`test:all` (or confirm CI is green on the commit) before shipping. A green suite is the owner's
permission slip.

## Notes
- Package managers vary across projects (npm vs pnpm). Always use the project's existing
  lockfile and its matching commands. Never add a competing lockfile.
- Consistency with ui-kit is deliberate: same Vitest setup, same Testing Library cleanup, so a
  test written in one meirlabs project reads the same in the next.
- If a project has genuinely no pure logic to unit test, the test-wirer says so rather than
  writing fake `expect(true).toBe(true)` tests. A test that cannot fail protects nothing.
