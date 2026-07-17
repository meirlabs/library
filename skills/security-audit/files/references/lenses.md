# Lens checklists

One finder per lens. Each list is what that finder actively hunts for — grep hints included. A lens is "dry" when a fresh pass surfaces nothing new.

## 1. Secrets & credential exposure

- `.env`, `.env.local`, `.env.production` tracked in git (`git ls-files | grep env`); check git *history*, not just working tree (`git log --all --oneline -- '*.env*'`).
- Hardcoded keys/tokens: `rg -n "sk-|xoxb-|ghp_|AKIA|-----BEGIN|service_role|eyJ[A-Za-z0-9_-]{20,}"`.
- Secrets shipped to the client: anything referenced in client components that isn't `NEXT_PUBLIC_` by mistake — and anything sensitive that IS `NEXT_PUBLIC_` (that prefix means "public", so a `NEXT_PUBLIC_SERVICE_ROLE_KEY` is a full breach).
- Service-role / admin DB keys importable from client-side code (trace the import graph, not just the filename).
- Secrets in logs, error messages, or committed to `content/`, fixtures, or test files.
- Private keys, JWT signing secrets, webhook signing secrets in the repo.
- **Report the exposure and key type, never the value. Assume any committed key is already burned → rotate.**

## 2. AuthN & session

- OTP / magic-link / password-reset tokens: single-use? time-limited? sufficient entropy? invalidated after use? rate-limited on verification (brute-forceable 6-digit code with no lockout = bypass)?
- Session/JWT: expiry set? refresh handled? signature actually verified server-side (not just decoded)? algorithm pinned (no `alg: none`)?
- Identity trusted from the client: any handler that reads a `userId`/`email`/`role` from the request body/query/header instead of the verified session.
- OAuth: `state` param checked (CSRF), redirect URL allow-listed (open redirect), tokens stored server-side.
- Account enumeration: does login/reset reveal whether an email exists via different responses or timing?

## 3. AuthZ & multi-tenant isolation (highest-yield)

- **IDOR:** every route that takes an id (`/api/thing/[id]`, `?id=`, body `{id}`) — is there an ownership check, or does it trust the id? Try: "as user A, request user B's id."
- **RLS reliance:** if the app assumes Postgres RLS for isolation, is RLS actually enabled on that table AND does the query run under the user's JWT (anon/authed key) rather than the service-role key (which bypasses RLS entirely)?
- **Service-role misuse:** service-role/admin key used in a request-handling path where the tenant filter comes from user input → RLS bypassed, one tenant reads all.
- **Admin gating:** admin actions gated only in the UI (hidden button) but the API route has no role check.
- **Mass assignment:** update handlers that spread `req.body` into a DB write, letting a user set fields they shouldn't (`role`, `is_admin`, `owner_id`, `credits`).
- Missing function-level auth: a route that assumes middleware protected it, but middleware's matcher doesn't cover it.

## 4. Injection

- SQL/NoSQL: string-concatenated queries, `raw`/`sql.unsafe`, `.rpc()` with unescaped input. Parameterized everywhere?
- Command: `exec`, `execSync`, `spawn` with shell:true built from input.
- Path traversal: user input in `fs` paths, `path.join(userInput)`, file downloads by name (`../../etc/passwd`).
- Template / SSTI, and for markdown/HTML pipelines, unsanitized rendering.
- **Prompt injection (LLM apps):** untrusted content (email bodies, scraped pages, user messages) fed to a model that has tools/actions — can the content instruct the model to exfiltrate or act? Are tool calls gated by anything but the model's judgment?

## 5. SSRF & outbound requests

- Any server-side `fetch`/`axios`/`got` with a URL derived from user input: webhooks, "import from URL", image/avatar proxies, link unfurlers, PDF/screenshot/OG renderers, RSS/feed fetchers.
- Can the target be `http://169.254.169.254/` (cloud metadata → credentials), `localhost`, `10.x`/`192.168.x` (internal services), or `file://`?
- Redirect-following that lands on an internal host after starting external.
- DNS-rebinding / allow-list bypass via alternate encodings.

## 6. XSS & output encoding

- `dangerouslySetInnerHTML`, `v-html`, direct DOM `innerHTML` with any user-influenced content.
- User content in `href`/`src`/`action` (`javascript:` URIs), `style`, or attribute context.
- Markdown → HTML without sanitization (raw HTML passthrough); SVG upload rendered inline (SVG = script).
- `dangerouslySetInnerHTML` on server-fetched third-party content.
- Reflected values in error pages / search results without encoding. (Note React/JSX escapes by default — flag only real gaps, not JSX interpolation.)

## 7. Supply chain & published surface

For npm packages / anything published:
- `files` in package.json / `.npmignore`: does `npm publish` include `.env`, source maps with secrets, test fixtures, `.git`?
- `postinstall`/`preinstall` scripts (yours and dependencies').
- What actually ships in `dist` — run `npm pack --dry-run` mentally: any secret, internal path, or private code leaking?
- Dependency provenance: typosquat-prone names, unmaintained deps, deps pulling huge transitive trees.
- For apps: lockfile committed? known-CVE deps (`pnpm audit`)? pinned vs floating ranges on security-sensitive deps.

## 8. Config & headers

- CSP present and not trivially bypassable (`unsafe-inline`, `unsafe-eval`, `*`)?
- CORS: `Access-Control-Allow-Origin: *` combined with `Allow-Credentials: true` = credential theft.
- Cookies: `HttpOnly`, `Secure`, `SameSite` set on session cookies?
- Security headers: HSTS, `X-Frame-Options`/`frame-ancestors` (clickjacking), `X-Content-Type-Options`.
- Error handling: stack traces / internal paths / SQL errors returned to the client in prod.
- Debug/introspection endpoints reachable in prod (GraphQL introspection, `/debug`, source maps served publicly).
- File upload: type allow-list (not deny-list), size cap, stored outside webroot / with random names, content-type validated not just extension.

## 9. Business logic & rate limiting

- No rate limit on: login, OTP verification, password reset, signup, and anything that sends email/SMS (cost + abuse) or calls a paid API.
- Price/quantity/amount tampering: values trusted from the client in checkout/credit flows.
- Race conditions: concurrent requests double-spending credits, redeeming a coupon twice, TOCTOU on balance checks.
- Workflow bypass: can steps be skipped by calling the final endpoint directly?
- Resource exhaustion: unbounded queries, no pagination cap, expensive operations triggerable by anon users.
