# Perceived speed — feel instant

Lever 2. *"Users perceive speed based on how quickly the interface reacts, not how quickly the
server responds."* A site can be "fast" on paper and still feel laggy if the user waits on a
spinner for every action. These techniques hide the network behind the paint.

## The borrow line — read this first

Linear's instant feel rests on a **local-first sync engine**: IndexedDB is the real database the UI
reads from, a MobX object pool is hydrated on boot, mutations hit a durable local queue and flush
to the server over WebSocket. **That is a first-line-of-code architecture, not a retrofit — do not
prescribe it for a normal Next.js marketing/SaaS site.**

| Steal today (no architecture change) | Needs a sync engine (don't cargo-cult) |
|---|---|
| Optimistic UI via SWR/TanStack Query `mutate()` | IndexedDB as the source of truth the UI reads |
| Inline critical shell + localStorage theme replay | MobX object-pool hydration replacing all fetches |
| `performance.mark` boot timing | True offline create/edit, WebSocket delta reconciliation |
| Command palette over already-cached data | Auth-optimistic render keyed on a full local dataset |
| Prefetch on hover/viewport | Per-property observable re-render at Linear's scale |

Steal the *feeling* (optimistic, no spinners), not the *engine*.

## Optimistic UI — the single most transferable idea

React to the user in the same frame; reconcile with the server in the background; roll back only on
the rare rejection. With Server Actions (`apps/web`'s pattern) use `useOptimistic`; with client
data use SWR/TanStack Query.

```tsx
// Server Actions (our default): reflect the change instantly, revalidate behind it
const [optimistic, addOptimistic] = useOptimistic(items, (state, next) => [...state, next]);
async function onAdd(item) {
  addOptimistic(item);            // UI updates this frame
  await createItemAction(item);   // server reconciles; revalidatePath refreshes truth
}
```
```ts
// SWR optimistic mutate — validate before you ever create the transaction, so rollback is rare
mutate(key, optimisticData, { revalidate: false, rollbackOnError: true });
```
Plan the rollback path, but expect it to be almost never hit — validate on the client before firing.

## Kill spinners

Every spinner is an admission that the UI is waiting on the network. Reduce them:
- **Skeletons over spinners** for first loads — reserve the real layout so there's no shift when data lands. Add `loading.tsx` per route so App Router streams a skeleton during the server render. `apps/web` has **zero** `loading.tsx` files today — route transitions get no streamed skeleton. Add them to slow/dynamic routes.
- **Stream with `Suspense`** — wrap slow server data so the shell paints immediately and the slow part fills in, rather than blocking the whole route.
- **Optimistic + revalidate** (above) removes the spinner from mutations entirely.

## Instant shell — paint before the framework boots

Linear inlines critical CSS + a tiny script in `<head>` so a themed shell paints with zero external
fetch, and replays shell tokens from `localStorage` before hydration to avoid a theme/layout flash.
Directly usable in the App Router root layout:
```tsx
// app/layout.tsx <head> — runs before any bundle; kills dark-mode / theme FOUC on reload
<script dangerouslySetInnerHTML={{ __html: `
  try {
    var t = localStorage.getItem("theme");
    if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches))
      document.documentElement.classList.add("dark");
  } catch {}
  performance.mark("appStart");   // real boot timing from the earliest possible point
`}} />
```
Inline the handful of CSS variables that define the above-the-fold shell (bg color, sidebar width)
so the first paint is themed without waiting for the stylesheet.

## Prefetch — warm the next navigation

- App Router `<Link>` prefetches in-viewport routes by default — keep it on for primary nav.
- For a known next step (a wizard's next page, the row the user is hovering), prefetch the route/data on hover or on viewport-enter so the click resolves instantly.

## Command palette & keyboard paths (SaaS dashboards)

*"Engineering speed makes a single interaction fast. Design speed makes the path to each interaction
short."* For repeat-use tools:
- A ⌘K palette (`cmdk`) over **already-cached client state** (routes, settings, recent items) is zero-latency because it never hits the server. Don't make it query an API.
- Keyboard shortcuts for the top actions, every one also mouse-accessible so beginners aren't locked out.
- This is for dashboards/tools, **not** marketing pages.

## Animation restraint (cross-links)

The instinct to animate everything hurts dense UI — Linear ships list/table interactions with *no*
transition to keep them snappy. Property rule (transform/opacity only) is in
`design/foundation/performance.md`; durations/easing and the "motion shows spatial origin, not
decoration" principle live in **`design/foundation/motion.md`** and the **`emil-design-engineering`**
skill (`animations.md`). Fast defaults: instant appear (0s), short fade-out (~150ms), asymmetric.
