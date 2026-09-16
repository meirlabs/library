---
name: verify-frontend-change
description: Verify a UI change end-to-end before declaring it done - drive it in a headless Playwright browser (never the user's Chrome), screenshot the result. One pass per task, scaled to the change - a desktop look for trivial tweaks, the full loop (console, mobile, before/after) for structural or cross-page changes. Triggers on "verify the UI", "did that work", "check it in the browser", or before reporting a UI change complete.
---

# Verifying frontend changes

Never report a UI change as complete on a successful edit alone. A green typecheck
and a clean build do not prove a button clicks, a layout holds, or a page stops
scrolling sideways on a phone. Verify it the way a human reviewer would: open it,
touch it, look at it. Only then is it done.

This is the stop condition for frontend work. If any step below fails, fix the
issue and rerun from step 1 — do not hand back partially verified work.

**Run this ONCE, at the end of the task — never after each intermediate edit.**
And scale it to the change:

- **Trivial tweak** (copy, spacing, a color, one component's styling): one
  desktop screenshot of the result. Skip the mobile resize, the console read,
  and the before/after pair unless something looks off.
- **Structural / layout / cross-page change** (grid changes, shared components,
  global CSS, new fixed/absolute elements, anything touching widths or
  overflow): the full loop below.

## Before you verify: fix the root cause, not the symptom

If the change is a styling / spacing / layout fix, diagnose the real cause before
editing CSS. Read the component tree, find the element actually responsible, and
change that one thing. Do not guess-and-check by layering CSS. If a fix does not
work on the first attempt, step back and re-analyze instead of piling on more
rules. (This mirrors the standing UI rules — reason the change through, then
verify once at the end.)

For anything nontrivial, load the `meirlabs-ui-design` skill first (the
design-system entry point — it carries the house rules this verification is
checking against) and `emil-design-engineering` for the polish craft bar.

## The loop

1. **Serve the page.** Start the dev server if it is not already running. For the
   meirlabs monorepo app this is `cd apps/web && pnpm dev` (port 3000 — check
   `lsof -i :3000` first; reuse a running server rather than starting a second).
   Open the edited page.

2. **Drive the change directly.** Use the Playwright MCP server
   (`mcp__playwright__browser_*`) — an isolated headless Chromium, NOT the user's
   real Chrome. Never use `mcp__claude-in-chrome__*` for verification unless the
   task genuinely requires the user's logged-in session, and say why first.
   Navigate with `browser_navigate`, then do the thing a user would:
   - New control (button, input, toggle, link): interact with it (`browser_click`,
     `browser_type`, …) and confirm the expected state change actually happens —
     not just that it renders. Use `browser_snapshot` to find elements.
   - Screenshot **before and after** the interaction (`browser_take_screenshot`)
     so the change is visible, not asserted.

3. **Check the console.** Read `browser_console_messages`. Zero **new** errors or
   warnings introduced by the change. A pre-existing warning is not a pass — note
   it, but a new one is a fail.

4. **Check mobile, specifically horizontal scroll** — only when the change
   plausibly affects responsive layout (widths, overflow, position, fixed
   elements, shared layout). Resize to a phone width (`browser_resize` to
   ~390px) and confirm the page does not scroll sideways — this is the single
   most common regression from a CSS/layout edit here. Confirm the change still
   works and tap targets are reachable at that width.

5. **Confirm no layout shift and no hidden-element hacks.** Nothing you added uses
   `display:none` to hide an element (it shifts layout on toggle) — hiding must use
   `visibility:hidden` or `opacity:0`. Watch for content jumping as the page
   settles or as the control changes state.

## Verification (stop conditions)

Treat these as the bar. Every one must pass before calling a UI change done.
(For a trivial tweak per the scaling rule above, the bar is 1 + 6 only —
renders correctly on desktop, typecheck clean.)

1. **Renders and behaves.** The edited page loads and the specific change is
   visible in an after-screenshot; any new control produces its expected state
   change when interacted with. Before/after screenshots captured.

2. **Console clean.** `browser_console_messages` shows zero new errors or
   warnings attributable to the change.

3. **No horizontal scroll on mobile.** At ~390px width the document does not
   scroll horizontally. Quick check via `browser_evaluate`:
   ```
   document.documentElement.scrollWidth <= window.innerWidth
   ```
   evaluates `true`.

4. **No layout shift on state change / load.** Toggling the control or reloading
   does not visibly jump the layout. No `display:none` used to hide anything.

5. **Consistent with siblings.** The changed element matches how the same kind of
   element (header, card, button, spacing, type) is styled on other pages — UI
   consistency is a hard requirement, not a nice-to-have. Spot-check one sibling
   page if the change touches a shared pattern.

6. **Typecheck still clean** (for TS/JSX edits). In `apps/web`: `pnpm typecheck`
   (`tsc --noEmit`) exits `0`.

If a step fails: fix it, then rerun from step 1. Report the change as done only
when all six hold, and say which you verified — not "should work now".
