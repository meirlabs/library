# Stack-specific gotchas

Load the section matching the target. These are the failure modes that are easy to miss because the framework *looks* safe.

## Next.js (App Router)

- **API route handlers are raw entry points.** `app/**/route.ts` exporting `GET/POST/...` are public unless `middleware.ts` gates them. Check the middleware `matcher` — a route outside the matcher is unauthenticated even if every UI path to it requires login.
- **Server Actions** (`'use server'`) are POST endpoints with generated ids; they're callable directly, not just from the form. Auth/authz must be *inside* the action, not on the page.
- **`NEXT_PUBLIC_`** inlines the value into the client bundle at build time. Anything with that prefix is public forever. Grep for sensitive names with that prefix.
- **Server/client boundary:** importing a module with secrets into a client component leaks it. `import 'server-only'` guards this — check privileged modules have it.
- **Route handler auth ≠ middleware auth.** Middleware runs on the edge and can be skipped for some route types; defense-in-depth means the handler re-checks.
- **`headers()`/`cookies()`** trust: don't trust an `x-user-id` header set by "the app" — trust only the verified session.
- Error responses: don't return the caught error object to the client (leaks stack/paths). 

## Supabase

- **RLS is the whole ballgame.** With RLS off, the anon key (which ships to the browser) can read/write the table. Verify RLS is `enabled` on every table with user data AND that a real policy exists (RLS enabled with no policy = deny-all, which is safe but often not intended; RLS enabled with `USING (true)` = wide open).
- **Service-role key bypasses RLS entirely.** Any request-handling code path using the service-role client must do its own authz — the DB won't. Service-role key must NEVER be `NEXT_PUBLIC_` or reachable from client code.
- **The anon key is public by design** — it's meant to ship to the browser; it is not a secret. Do NOT report the anon key as "exposed." The security boundary is RLS, not the anon key's secrecy.
- Policies that reference `auth.uid()` only work when the query runs under the user's JWT. A service-role query has no `auth.uid()`.
- Storage buckets: public vs private, and RLS policies on `storage.objects`.
- Auth config: check "confirm email" setting, allowed redirect URLs (open-redirect / token-leak), and whether anon signups are open if they shouldn't be.
- Postgres functions (`SECURITY DEFINER`) run as owner — audit them like service-role code.

## Vercel

- Env vars: `Production`/`Preview`/`Development` scoping. A preview deploy with prod secrets + a public preview URL leaks them.
- Preview deployments are public URLs by default unless protection is on — sensitive apps need deployment protection.
- Serverless function logs may capture request bodies/secrets — check what's logged.
- `vercel.json` headers/redirects/rewrites: a rewrite can expose an internal path; check `headers` sets the security headers if the app doesn't.

## Published npm packages

- `npm pack --dry-run` (or read `files` in package.json) is the source of truth for what ships — not `.gitignore`. A missing `files` allow-list can publish the whole repo including `.env`.
- `dist` from a bundler can inline a `.env` value if the build read `process.env.X` and X was set at build time — grep the built output for anything secret-shaped.
- `postinstall` scripts run on every consumer's machine — yours are a supply-chain risk to your users; dependencies' are a risk to you.
- `prepublishOnly` / CI publish: ensure `NPM_TOKEN` isn't logged and 2FA/provenance is on.
- Version pinning of security-sensitive transitive deps; `overrides` for known-bad versions.

## LLM / agent apps

- **Prompt injection** is the new SQL injection. Any untrusted text (user input, fetched web pages, email bodies, file contents) that reaches a model with tools can carry instructions. The model cannot reliably distinguish data from instructions.
- Tool/action gating: a model with a `send_email` or `run_sql` tool acting on injected instructions = real impact. Gate consequential tools behind human confirmation or hard rules, not the model's judgment.
- Output handling: model output rendered as HTML/markdown → XSS; model output used in a shell/SQL → injection. Treat model output as untrusted.
- Secrets in prompts/system messages that get logged or returned.
- Rate/cost limits on model calls triggerable by anon users (denial-of-wallet).
