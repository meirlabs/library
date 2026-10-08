# Test plan template

The Planner writes this to `qa-army/<date>/TEST-PLAN.md`. Keep it scannable: testers read only the sections they need.

```markdown
# Test plan — <app> — <date>

## Scope
- Target: <URL / repo path>, environment: <local | preview | staging | prod read-only>
- Depth: <quick | full | deep>
- In scope: <areas>
- Out of scope: <areas + why>
- Recent changes to weight: <commits/PRs/areas since last release>

## Accounts and data
| Role | Account | Notes |
|------|---------|-------|
| anonymous | — | |
| user | <test account> | |
| admin | <test account> | |
| other tenant | <test account> | for isolation checks |

## Critical journeys
1. <journey> — why it's critical
2. ...

## Coverage matrix
| Area | Automated | Scripted browser | Exploratory | Code inspection |
|------|-----------|------------------|-------------|-----------------|
| Sign-in | ✓ | ✓ | ✓ | ✓ |
| ... | | | | |

## Test cases
### TC-001 — <short name>
- Area: <area> · Lane: <lane> · Priority: <P0–P3>
- Preconditions: <state, account, data>
- Steps:
  1. ...
- Expected: <observable result>

## Exploratory personas
- **First-timer** — no context, follows the obvious path, reads nothing.
- **Power user** — keyboard only, many tabs, bulk actions, long inputs.
- **Impatient** — double-clicks, refreshes mid-flow, hits back, closes tabs.
- **Mobile, bad network** — 390px wide, slow 3G, touch only.
- **Wrong-input** — empty, huge, emoji, RTL text, pasted HTML, past/future dates.
- **Nosy** — tries other users' URLs and IDs, edits query params.

## Environments
- Viewports: 1440×900, 390×844 (+ 768×1024 for deep)
- Browsers: Chromium (+ WebKit and Firefox for deep)
- Locales: <each shipped language; RTL if any>

## Round cap and stop rule
Stop after two consecutive rounds with nothing new, or <cap> rounds.
```

## Case priority (for the plan, not for tickets)

- **P0** — a critical journey; run every round.
- **P1** — core feature; run in round 1, again if the area had bugs.
- **P2** — secondary feature or edge case.
- **P3** — cosmetic or rare path; run if time allows.

## Writing good cases

- One observable expected result per case. "Works correctly" is not an expected result.
- Steps a different agent can follow without reading the code.
- Every role-sensitive screen gets a case for a role that should be *blocked*.
- Every form gets an empty, an invalid, and a boundary case.
- Every list gets empty, one, and many (pagination) cases.
