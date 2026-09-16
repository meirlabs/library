---
name: sae
description: Status And Estimate — answer "where are you at?" in four plain-English lines, nothing else. Use when the user types /sae, or says "status", "sitrep", "where are you", "how long left", "update me", "what's left". Written for a product owner, not an engineer. Portable across Claude Code, Codex, and any agent that reads skills.
---

# sae — status and estimate

Report state to a **product owner**, not a developer. No new work, no explaining, no recap.

## Output — exactly this, nothing around it

```
- estimate: 20-30 mins left
- remaining: the reliability fixes a reviewer flagged, the new sign-in flow
- finished: the daily sync, the invite email, the settings page
- notes: I can't deploy myself — when the fixes land you'll run one command I'll paste
```

## Rules

1. **Four lines max, in this order.** `estimate`, `remaining`, `finished`, always. `notes` only when something is blocked, you need a decision, or there's a caveat that changes what the user does next — otherwise drop the line.
2. **No preamble, no closing.** The first character of the reply is `-`.
3. **Estimate is a number.** Minutes or a tight range (`8 mins left`, `20-30 mins left`). Never "soon", "shortly", "almost done". If it truly can't be estimated: `unknown — <the one thing blocking the estimate>`.
4. **`remaining` is what's left, `finished` is what's done.** Comma-separated, max 3 items each; past that, `+N more`. Nothing left → `remaining: nothing — idle`. Nothing done yet → `finished: nothing yet`.
5. **Plain English, product level.** Every item is a thing the user or the business would notice — a feature, a screen, a flow, a risk. **Banned:** file paths, function and variable names, migration numbers, flags, library names, error types, anything in `code font`. If the work is pure plumbing, name what it protects: *"stops two people overwriting each other"*, not *"lock order"*. Ticket IDs are fine (`LAB-229`).
6. **Group, don't enumerate.** Five related fixes are one phrase — *"the reliability fixes a reviewer flagged"* — not a list of five mechanisms. Detail belongs in an answer to a follow-up question, never here.
7. **Honest, not flattering.** A failing test is not finished. Partial goes in `finished` with the limit stated: `the invite email (works for 2 of 3 plans)`. Blocked work stays in `remaining`, with the blocker in `notes`.
8. **Notes says what you need from the user**, in one sentence — the decision, the access, the command they'll run. Not a status of its own.
9. **A fleet reports as one block.** Aggregate every subagent into the same four lines; never one report per agent.

## Translate before you write

| what you'd say to a developer | what goes in the line |
| --- | --- |
| props→state sync, stale-submit guard, poll cutoff | the form no longer submits stale data |
| migration 0024 applied and recorded | the database change is live |
| worker browser lifecycle, watchdog abort | the scraper recovers on its own now |
| CLAUDE.md / OPS.md updated | the handover notes are current |

## Nothing running

```
- estimate: n/a — nothing in flight
- remaining: nothing — idle
- finished: the new pricing page, live on the site
- notes: worth a look before you share it — meirlabs.com/pricing
```
