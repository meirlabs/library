---
name: deploy
description: Verify and ship a web app to Vercel: typecheck, production build, env check, then deploy and report the URL. Use when the user says "deploy", "ship it", or "push to prod".
---
# public variant, safe to publish

# Deploy Skill

Ship a web app to Vercel. Use the generic flow below. If your app matches the
special case (a monorepo app with a local-path dependency), use that section
instead: the generic `vercel --prod` steps will fail for it.

## Generic web app deploy

1. Run `npx tsc --noEmit` to check for type errors. Fix all errors before deploying.
2. Run `npm run build` to verify the production build succeeds.
3. Confirm `.env.local` exists and has every required var.
4. Run `vercel --prod` to deploy.
5. Report the deployment URL.

## Special case: monorepo app with a local-path dependency

If the app depends on a package via a local `file:` path (a shared component
library that is not published to npm), Vercel's remote install cannot resolve
it. Deploy prebuilt instead, from the app directory:

```
npx tsc --noEmit                              # 1. typecheck, must be clean
npx vercel build --prod                       # 2. build locally (the file: dep resolves here)
npx vercel deploy --prebuilt --prod --yes     # 3. upload .vercel/output
```

The Vercel CLI must be authed as the account that owns the target
scope/project, otherwise the deploy lands in the wrong place. Check with
`npx vercel whoami` and set `--scope <YOUR_SCOPE>` if needed.

### Rules (each prevents a specific failure)

- **Deploy the prebuilt output, never a plain `vercel --prod` and never
  `git push`.**
  - If the project's git integration is disconnected or absent, a push to the
    default branch produces no deployment at all. Pushing and assuming prod is
    updated ships nothing. Verify a deployment was actually created.
  - A plain `vercel --prod` triggers a remote install, which hits the
    local-path failure below.

- **Always build locally so the `file:` dependency resolves; never let Vercel
  run a remote install.** A remote install on Vercel's build machine fails with
  `ENOENT <path>` because the local path does not exist there.
  `npx vercel build --prod` resolves it from your filesystem, and `--prebuilt`
  uploads the finished output so Vercel never runs its own install.

- **A production build must never write to the dev server's output directory.**
  In `next.config.ts`, set `distDir` to a separate directory (for example
  `.next-dev`) when `NODE_ENV === "development"`, so `next dev` and
  `vercel build` write to physically separate directories.
  - Failure prevented: `next build` wipes its output dir. When dev and prod
    share `.next`, a prod build deletes the dev server's compiled CSS; the dev
    server then 404s on `layout.css`, showing serif fonts and underlined
    links, and it recurs after every deploy. Gitignore the dev dir and add it
    to `tsconfig`'s `include` so Next's generated types are still picked up.
  - If broken/serif styling appears in dev, check the CSS response code BEFORE
    editing any CSS file (the CSS source is usually not the problem):
    ```
    curl -s localhost:3000/_next/static/css/app/layout.css -o /dev/null -w '%{http_code}'
    ```
    A non-200 confirms the build-clobber issue, not a CSS bug.

## Verification

Treat these as stop conditions. Every one must pass before calling a deploy done.

1. **Typecheck clean.** `npx tsc --noEmit` exits `0` and prints no errors.

2. **Local build succeeds.** `npx vercel build --prod` exits `0` and produces a
   `.vercel/output` directory. Confirm: `test -d .vercel/output && echo OK`
   prints `OK`.

3. **Deploy uploaded prebuilt.** `npx vercel deploy --prebuilt --prod --yes`
   exits `0` and prints a production URL. A healthy prebuilt deploy completes
   in roughly 10 seconds. If it instead runs a full remote build (much longer,
   or fails with an `ENOENT` on the local-path dep), the prebuilt path was not
   used. Stop and fix; do not retry blindly.

4. **Prod domain serves the new build.** Your production domain returns HTTP
   `200`:
   ```
   curl -s -o /dev/null -w '%{http_code}' https://<YOUR_DOMAIN>
   ```
   prints `200`.

5. **No stale auto-deploy assumption.** Confirm the deployment you just
   created is the current prod alias (`npx vercel ls` / `npx vercel inspect`
   shows your new deployment aliased to the domain), not an older auto-deploy.

6. **Dev CSS intact (only if a `next dev` server is running).** The
   `layout.css` curl above prints `200`. A non-200 means a build clobbered the
   dev output; verify the split `distDir` is still in place.
