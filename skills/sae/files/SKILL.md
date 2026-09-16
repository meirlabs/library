---
name: sae
description: Status And Estimate — answer "where are you at?" in three lines, nothing else. Use when the user types /sae, or says "status", "sitrep", "where are you", "how long left", "update me", "what's left". Portable across Claude Code, Codex, and any agent that reads skills.
---

# sae — status and estimate

Report state. Do not start new work, do not explain, do not recap history.

## Output — exactly this, nothing around it

```
- estimate: 12 mins left
- status: working on the Hebrew nav copy and the mobile crop | finished the token swap, the hero, and the /pricing table
- notes: the e2e run needs E2E_PORT=4173 or it hangs
```

Rules:

1. **Three lines max.** `estimate`, `status`, always. `notes` only if there is a blocker, a decision you need, or a caveat that changes what the user would do next — otherwise drop the line entirely.
2. **No preamble, no closing.** No "Here's where I'm at", no "let me know if…". The first character of the reply is `-`.
3. **Estimate is a number.** Minutes or a tight range (`8 mins left`, `20-30 mins left`). Never "soon", "shortly", "almost done". If it genuinely can't be estimated, write `unknown — <the one thing blocking the estimate>`.
4. **Status is `working on … | finished …`.** Present-tense items before the pipe, done items after. Cap each side at 3 items; past that write `+N more`. If nothing is in flight, write `working on nothing — idle`.
5. **Honest, not flattering.** A test that fails is not "finished". A partial pass is `finished X (2 of 5 tests green)`. Blocked work goes in `working on` with the blocker in `notes`, never silently in `finished`.
6. **Concrete nouns.** Name files, pages, tickets — `the /pricing table`, `LAB-229` — not "the frontend work".
7. **When asked about subagents**, aggregate the same way: each agent's live task before the pipe, its shipped output after. One block for the whole fleet, not one per agent.

## If there is nothing running

```
- estimate: n/a — nothing in flight
- status: working on nothing — idle | finished the favicon per-env wiring and the deploy to prod
- notes: next action is verifying the preview URL favicon is amber
```
