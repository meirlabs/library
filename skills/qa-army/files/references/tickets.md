# Tickets

One master regression ticket, one new subticket per confirmed issue without an existing ticket. Reuse existing tickets; reopened tickets have no parent. Set real tracker fields (priority, estimate, labels, project, parent), not only text.

## Reopening an existing ticket

When reopening a ticket in any project or team, including returning it for further work after failed QA, automatically remove its parent relationship as part of that workflow, without asking. Clear the actual relationship using the tracker's supported operation: Linear's parent field, GitHub's sub-issue relationship or active task-list membership, or local markdown's parent metadata and active child listing. If it already has no parent, leave it that way. Do not attach it to the current regression master or another parent unless the user explicitly asks; a plain reference link in the report may preserve history.

Preserve other fields except changes required by reopening. Read back and verify both the reopened status and no parent. If removal fails, report the failure rather than claiming the reopening workflow is complete.

## Rating scales

**Priority** — how soon to fix
- **Urgent** — a critical journey is broken, data/money is at risk, or there's a security hole. Fix before release.
- **High** — a core feature is broken or wrong for many users; there's a workaround but it's painful.
- **Medium** — a secondary feature misbehaves, or a core one fails in an edge case.
- **Low** — cosmetic, copy, rare path, minor polish.

**Severity** — how bad it is when it happens
- **Blocker** — the user can't continue. **Major** — wrong result or lost work. **Minor** — annoying, has a workaround. **Cosmetic** — looks wrong, works fine.

**Risk** — blast radius × likelihood
- **High** — many users hit it, or the cost is data loss, money, security, or trust.
- **Medium** — some users hit it, or the cost is real but recoverable.
- **Low** — few users, little cost.

**Effort** — size of the fix (estimate, don't fix)
| Size | Meaning | Linear points (Fibonacci) |
|------|---------|---------------------------|
| XS | copy/style one-liner | 1 |
| S | one component or function | 2 |
| M | a few files, one area | 3 |
| L | cross-area, needs tests and care | 5 |
| XL | design decision or migration | 8 |

Map to the team's own scale if it differs.

## Master regression ticket

**Title:** `QA regression — <app> — <YYYY-MM-DD>`
**Labels:** `qa-army`, `regression` · **Priority:** the highest priority among its subtickets

```markdown
## TL;DR
<2–4 plain sentences: is the app ready to ship? what's the single biggest problem?
what's fine? Written for someone who doesn't read code.>

## Results
| Priority | Count |
|----------|-------|
| Urgent | n |
| High | n |
| Medium | n |
| Low | n |

## Fix first
1. <subticket link> — <one plain line why>
2. ...
3. ...

## Coverage
- Environment: <target + env>, depth: <quick|full|deep>, rounds: <n>
- Test cases run: <n>/<total> · Areas: <list>
- Lanes: automated, scripted browser, exploratory (<personas>), code inspection
- Viewports / browsers / locales: <list>

## Not covered
- <area or flow> — <why: no account, needs real payment, service down, out of scope>

## Not reproduced
- <candidate title> — <lane> — seen once, verifier couldn't reproduce

## All issues
- [ ] <subticket link> — <priority> — <title>
```

## Subticket

**Title:** 2–6 plain words, verb-led where natural: "Checkout button does nothing on mobile", "Fix invoice total rounding". No codes, no "QA found…".
**Parent (new tickets):** the master ticket; reopened tickets have no parent · **Labels:** `qa-army`, `<area>`, `flaky` if relevant · **Priority / Estimate:** real fields

```markdown
## TL;DR
<What's broken, who notices, and why it matters — in plain words, 1–3 sentences.
No jargon, no file names. Example: "When a customer taps Pay on a phone, nothing
happens, so mobile customers can't buy anything. Desktop works.">

| Priority | Severity | Risk | Effort |
|----------|----------|------|--------|
| High | Blocker | High | S |

## Steps to reproduce
Environment: <URL/env>, <browser + viewport>, account: <role>
1. ...
2. ...

**Expected:** ...
**Actual:** ...
<If flaky: "Reproduced 3 of 5 tries.">

## Evidence
- Screenshot: <path or attachment>
- Console / network: <error lines, request + status>
- Code: `<file>:<line>` (if found by inspection)

## Notes for the fixer
<Optional. Suspected cause and where to look. A hint, not a fix — no code changes were made.>

Found by: qa-army <date>, lane: <lane>, test case: <TC-xxx | exploratory: persona>
```

## Tracker mapping

| Field | Linear | GitHub Issues | Local markdown |
|-------|--------|---------------|----------------|
| Parent (new tickets only) | `parentId` = master | sub-issue, or task list in master | link in `000-master.md` |
| Priority | priority field (1 Urgent – 4 Low) | label `priority:<x>` | frontmatter |
| Estimate | estimate field | label `effort:<x>` | frontmatter |
| Severity / Risk | labels or table in body | labels `severity:<x>`, `risk:<x>` | frontmatter |
| Status | team's to-do status | open | `status: todo` |

Before creating anything: search open and recently closed tickets for the same symptom. If one exists, comment the new evidence there and link it from the master instead of opening a duplicate. If reopening it, follow the parent-removal rule above. After creating: read each ticket back and confirm parent, priority, estimate, labels, and status actually stuck.
