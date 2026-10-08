# @meir-labs/skill-qa-army

A full QA regression of your app, run by a team of agents, ending in tickets — not fixes.

1. The strongest model maps the app and writes a test plan.
2. Testers run it in rounds, each matched to what it does best: automated suites, scripted browser cases, exploratory "real user" sessions, and code inspection.
3. A verifier re-reproduces every candidate; what doesn't reproduce is dropped.
4. Every confirmed issue becomes a subticket under one **master regression ticket**, rated for priority, severity, risk, and effort, and opening with a **TL;DR** anyone can read.

It never edits code. Tickets go to Linear, GitHub Issues, or local markdown files.

## Install

```sh
# Claude Code — this project (./.claude/skills/qa-army)
npx @meir-labs/skill-qa-army

# Claude Code — every project (~/.claude/skills/qa-army)
npx @meir-labs/skill-qa-army --global

# Codex — this project / every project
npx @meir-labs/skill-qa-army --codex
npx @meir-labs/skill-qa-army --codex --global
```

Pass `--force` to overwrite an existing copy. Then ask your agent: "run qa-army on staging".

Read it before you run it: [`files/`](./files).

## Reopened tickets

Whenever reopening a ticket in any project or team, including failed QA that returns it for further work, automatically clear its actual parent relationship without asking. Keep it parentless unless the user explicitly requests a parent; a plain reference link may remain for history. Preserve other fields except changes required by reopening. Read back and verify the reopened status and no parent; report any failure instead of claiming completion. Adding a comment to a ticket that is still open is not a reopening and must not detach it.
