---
name: security-audit
description: Audit a web app or repo for real, exploitable security issues and turn each into a ranked finding with a concrete implementation plan. Runs a threat model, a multi-lens static sweep, live-config checks (auth, RLS, headers, deps, endpoints), then adversarially verifies every finding before it ships so the report is false-positive-resistant. Use when the user says "security audit", "find security issues", "is this app secure", "pentest my code", "check my RLS", "audit before launch", or names a repo/app to harden.
---

# Security Audit

Find security issues that are **real and exploitable**, prove they're real, and hand back a fix plan a developer can execute today. The output is not a vulnerability list — it's a ranked set of findings where each one names the exact file and line, describes a concrete attack that works, and comes with an implementation plan and a test that proves the fix.

The enemy of a useful security audit is the false positive. A report full of "consider using HTTPS" and theoretical issues trains the reader to ignore it. This skill is built to resist that: every candidate finding must survive an adversarial verification pass whose default is *reject* before it reaches the report.

## When to use

Use for: pre-launch hardening, "is this safe to deploy", periodic audits of a live app, reviewing a repo you're about to publish, or checking a specific surface (auth, a payment flow, an upload feature, database access rules).

Scale to the ask. "Quick check before I ship" → threat model + static sweep + verify, skip deep live probing. "Full audit" → all phases, loop-until-dry discovery, live-config checks, the works.

## Operating rules (read first)

1. **Read-only against anything live.** Never write to a production database, never change config, never attempt an auth bypass that mutates state. Live checks confirm *whether* a door is open — they do not walk through it. Anything that would require an actual exploit against prod gets written up as "here's how to verify safely," handed to the user, not executed.
2. **Authorized scope only.** Audit code and infrastructure the user owns or is explicitly authorized to test. If asked to probe a third party, stop and confirm authorization.
3. **Exploitability over theory.** A finding earns its place by describing a concrete path from attacker input to impact. "This is unvalidated" is not a finding; "an unauthenticated user can POST to `/api/x` and read another tenant's rows because there's no RLS and the route uses the service-role key" is.
4. **Every finding is verified before it ships.** No exceptions. The verification pass tries to *refute* the finding and defaults to rejecting it when uncertain. See Phase 3.
5. **Secrets: report the exposure, never the secret.** If you find a live key committed, report the file, line, and key type — never paste the value, and flag it for immediate rotation (assume it's already compromised the moment it's in git history).
6. **The `NEXT_PUBLIC_` prefix decides the audience.** A `NEXT_PUBLIC_*` env var is inlined into the browser bundle and is public forever; anything without the prefix is server-only. A real secret behind `NEXT_PUBLIC_` (e.g. a service-role key) is a full breach — but the Supabase anon key is public by design, so never flag *it* as exposed.

## The method

Five phases. For a small target, one agent can run them inline. For a real audit, fan out with a workflow: one finder per lens per target, then a verify stage. The pipeline shape is at the bottom.

### Phase 0 — Threat model & recon

Before hunting, understand what you're defending. Produce a short model per target:

- **Assets:** what's worth stealing or breaking? (user data, credentials, money movement, the ability to send email as the domain, admin access)
- **Entry points:** every place attacker-controlled input enters — routes/API handlers, form actions, webhooks, file uploads, query params, headers, auth callbacks, third-party redirects.
- **Trust boundaries:** where does "untrusted" become "trusted"? (client → server, server → DB, one tenant → another, unauthenticated → authenticated → admin)
- **Crown jewels:** the 2–3 things that would be catastrophic if breached. Weight the audit toward these.
- **Deployed surface:** what's actually reachable on the internet vs. local-only.

Recon commands that pay off fast:
```
# stack & entry points
cat package.json            # framework, deps, scripts
ls app/api  app/**/route.ts # Next.js API routes = attacker entry points
rg -l "createClient|service_role|SERVICE_ROLE" # where privileged DB access lives
rg -n "export async function (GET|POST|PUT|PATCH|DELETE)" # route handlers
# what's exposed
cat middleware.ts           # what's gated vs public
rg -n "NEXT_PUBLIC_"        # anything NEXT_PUBLIC_ ships to the browser
```

### Phase 1 — Multi-lens static sweep

The core discovery pass. Each **lens** is a distinct way an app fails; run them independently (one agent per lens per target) so no single reviewer's blind spot hides a class of bug. Lenses and their checklists live in `references/lenses.md`. The lenses:

1. **Secrets & credential exposure** — committed keys, `.env` in git, secrets in client bundles / `NEXT_PUBLIC_`, keys in logs, hardcoded tokens, service-role keys reachable from client code.
2. **AuthN & session** — how identity is established and kept: weak/again-usable OTP or reset tokens, missing session expiry, JWT verification gaps, auth logic that trusts client-supplied identity, OAuth state/redirect handling.
3. **AuthZ & multi-tenant isolation** — the #1 real-world SaaS failure. Every data access: can user A reach user B's rows? Missing ownership checks, IDOR (object id from the request used without an ownership filter), RLS assumed but not enforced, admin routes gated only in the UI.
4. **Injection** — SQL/NoSQL, command, path traversal, template, and (for LLM apps) prompt injection into tool-calling. Trace untrusted input to any interpreter.
5. **SSRF & outbound requests** — any server-side fetch built from user input (webhooks, "fetch this URL", image proxies, PDF/screenshot renderers). Can it hit `169.254.169.254`, internal services, `localhost`?
6. **XSS & output encoding** — `dangerouslySetInnerHTML`, unescaped user content, `href`/`src` from user input, markdown rendering, SVG upload.
7. **Supply chain & published surface** — for packages: what ships in `dist`/`files`, postinstall scripts, dependency provenance, `npm publish` including secrets, typosquat-prone deps. For apps: lockfile drift, known-CVE deps.
8. **Config & headers** — CSP, CORS (`*` with credentials), security headers, cookie flags (`HttpOnly`/`Secure`/`SameSite`), verbose errors leaking stack traces, debug endpoints, permissive file upload types/sizes.
9. **Business logic & rate limiting** — flows abusable without any "vulnerability": no rate limit on OTP/login/send-email, price/quantity tampering, race conditions in credit/balance updates, mass-assignment.

For unknown-size discovery, **loop until dry**: rerun finders until two consecutive rounds surface nothing new. Simple one-pass sweeps miss the tail.

### Phase 2 — Live-config checks (read-only)

Static analysis can't see runtime reality. For a deployed target, check the live config — all read-only:

- **Supabase / Postgres RLS:** is RLS *enabled* on every table with user data, and do the policies actually scope by owner? A table with RLS off and a client-reachable anon key is a full data breach. Read policies; don't assume the migration matches prod.
- **Auth settings:** email confirmation on/off, allowed redirect URLs, JWT expiry, whether anon signups are open, password/OTP policy.
- **Deployed headers:** `curl -sI https://<domain>` — check CSP, HSTS, `X-Frame-Options`, CORS, cookie flags on the real response.
- **Dependency CVEs:** `pnpm audit` / `npm audit --production` — triage to what's actually reachable, not the raw count.
- **Endpoint probing (non-destructive):** does an API route respond to an *unauthenticated* request? A `200` with data where you expected `401` is a finding. A `401`/`403` confirms the gate. Never send payloads that mutate state.

### Phase 3 — Adversarial verification (the gate)

**This is what makes the report trustworthy.** Every candidate finding from Phases 1–2 goes through skeptics whose job is to *kill it*.

- Spawn independent verifiers (2–3, use the strongest model available — this is the highest-leverage reasoning in the whole audit). Prompt each to **refute**, not confirm: "Here is a claimed vulnerability. Find the reason it is NOT exploitable — the auth check upstream, the framework default that already escapes this, the RLS policy that does cover it, the fact that this input can't actually reach here. Default to `refuted: true` unless you can trace a concrete working exploit."
- A finding survives only if a majority of verifiers fail to refute it AND at least one can articulate the concrete exploit path end to end.
- Give verifiers distinct lenses when a finding can fail more than one way (does it reproduce? is the input really attacker-controlled? is there an upstream guard?).
- Downgrade rather than drop when a finding is real but lower-impact than claimed (e.g. requires an authenticated user, or only leaks non-sensitive data).

A finding that can't survive a genuine refutation attempt was never a finding. This pass typically removes 30–50% of a raw sweep's output. That's the point.

### Phase 4 — Rank & plan

Synthesize the survivors into the deliverable.

**Severity** — rate each by impact × exploitability, not a generic CVSS number:
- **Critical** — unauthenticated data breach, RCE, auth bypass, credential exposure of a live high-value key (payment, email-domain, admin). Fix before anything else ships.
- **High** — authenticated cross-tenant access, privilege escalation, stored XSS, SSRF to internal services.
- **Medium** — needs unusual conditions or yields limited data; missing defense-in-depth that a chain would use.
- **Low** — hardening, best-practice gaps with no direct exploit today.

**Each finding in the report has this shape:**

```
### [SEVERITY] Short title
**Where:** path/to/file.ts:42  (and the deployed surface if live)
**Attack:** Concrete steps. Who the attacker is, what they send, what they get.
**Why it works:** The missing/broken control, traced.
**Verified:** How it was confirmed and what the skeptics failed to refute.
**Fix (implementation plan):**
  1. Exact change — file, function, the control to add.
  2. Code sketch of the fix.
  3. Blast radius — what else touches this, what might break.
**Proof:** A test (or safe manual check) that fails today and passes after the fix.
```

The implementation plan is the payload. A finding without an actionable fix is half a deliverable. Make the fix specific enough to hand to a coding agent: name the file, the function, the control, and the test that proves it.

End the report with: a one-paragraph executive summary (counts by severity + the single most urgent thing), and an ordered remediation sequence (what to fix first and why — usually critical-credential-rotation and unauthenticated-breach before everything else).

## Workflow shape (for real fan-outs)

Pipeline by default — each lens verifies as soon as its sweep completes; no barrier stalling fast finders behind slow ones. Use the strongest model for the verify stage. Uses the Workflow tool's pipeline/parallel primitives — see loop-engineering for the general fan-out pattern this specializes.

```js
const LENSES = [ /* {key, prompt} per lens above */ ];
const results = await pipeline(
  LENSES,
  lens => agent(lens.prompt, {label: `sweep:${lens.key}`, phase: 'Sweep', schema: FINDINGS}),
  review => parallel((review.findings||[]).map(f => () =>
    // 3 refuters, strongest model, default-reject
    parallel([0,1,2].map(i => () =>
      agent(refutePrompt(f, i), {label:`refute:${f.id}`, phase:'Verify', schema: VERDICT})))
    .then(vs => ({...f, survives: vs.filter(Boolean).filter(v=>!v.refuted).length >= 2}))
  ))
);
const confirmed = results.flat().filter(Boolean).filter(f => f.survives);
```

For loop-until-dry discovery, wrap the sweep in a `while (dry < 2)` loop that dedupes new findings against everything seen so far (dedupe against *seen*, not *confirmed*, or refuted findings resurface every round).

## Anti-patterns (don't ship these)

- Reporting `npm audit` output raw as "findings" — triage to reachable, exploitable CVEs.
- "Consider adding rate limiting" with no specific endpoint and no attack — either there's an abusable flow (name it) or there isn't.
- Flagging framework behavior that's already safe (React escapes JSX by default; Next.js server components don't leak server code) — verify the framework doesn't already handle it before reporting.
- Pasting a discovered secret's value into the report.
- Severity inflation. If it needs admin already, it's not Critical.
- A finding with no verification trail. Everything goes through Phase 3.

## References

- `references/lenses.md` — the full per-lens checklist (what each finder actually looks for).
- `references/stack-notes.md` — stack-specific gotchas (Next.js App Router, Supabase RLS, Vercel, published npm packages) worth loading when the target matches.
