---
name: prep
description: Examine one ticket, work out the fix, and write the plan back onto the ticket — description, risk, effort, priority — without implementing anything. Use when the user types /prep, or says "look at this ticket", "plan this ticket", "propose a fix for LAB-123", "scope this ticket", "groom this ticket", "make this ticket ready". Portable across Claude Code, Codex, and any agent that reads skills.
---

# prep — propose the fix, update the ticket, build nothing

Input: one ticket (ID, URL, or "this ticket" from the conversation). Output: the
same ticket, rewritten so someone else — a person or an agent — can pick it up
and build it without asking a question.

**Hard boundary: plan only.** No code edits, no branches, no commits, no PRs, no
migrations, no deploys. Reading code, running read-only commands, and reproducing
a bug are fine. If the fix turns out to be a one-liner, still don't make it —
write it into the ticket.

## Tracker access

Default tracker is Linear. Use whichever is available, in this order:

1. The Linear MCP server, if one is connected to this agent.
2. The Linear GraphQL API with a key from `LINEAR_API_KEY` or the machine's
   secret store (on macOS: `security find-generic-password -s linear-api-key -w`).
   Never print the key.

For a GitHub issue use `gh issue view` / `gh issue edit` and map the fields
below onto labels. No tracker access → stop and say so; don't write the plan
into a local file instead.

## Steps

### 1. Read the ticket — all of it

Fetch the ticket by ID and confirm it's the right one (title matches what the
user meant). Read the description, every comment, attachments and images,
linked and parent/sub tickets, and the current project, estimate, priority,
status and labels. Note what the reporter actually asked for versus what the
title says.

### 2. Understand it — research only as far as needed

Find the cause or the shape of the work, at the depth the ticket needs:

- **Clear and small** (copy, a known one-file change): locate the spot in the
  code and move on. No research.
- **Bug**: find the code path, and reproduce it or pin the cause from the code.
  State whether the cause is *confirmed* (reproduced / read in code) or
  *suspected*.
- **Feature or unclear ask**: read the surrounding code and how similar things
  are already done in the repo. Search open and recently closed tickets for
  overlap.
- **External unknown** (a vendor API, a library behaviour, a legal or pricing
  fact): only then go to the web, primary sources first.

Stop researching as soon as you can name the fix and its risk. If the ticket
names no repo, work out which one from the team/project before reading code.

### 3. Decide the fix

One recommended approach, concrete enough to build from: what changes, where,
and in what order. Mention an alternative only if it's a real contender, in one
line with why it lost. If two approaches differ in a way only the owner can
judge (product behaviour, money, scope), don't pick silently — see "Open
questions" below.

### 4. Rewrite the description

Replace the description with the structure below. Keep everything true from the
original — the reporter's words, links, screenshots — under **Source**; never
drop information. Plain language first; file paths and identifiers are welcome
in "Proposed fix" where a builder needs them.

```markdown
## What
One or two sentences: the problem or the ask, as the user experiences it.

## Why
Who it affects and what it costs to leave it.

## Where
Product area / screen, plus repo and the main files involved.

## Cause
(bugs only) What's actually wrong — marked confirmed or suspected.

## Proposed fix
Numbered steps a builder can follow. Name files/functions. Include the test
that should exist when it's done.

## Risk
Level: Low / Medium / High — one line why.
- What could break, and who would notice
- Blast radius: one screen / one app / shared code / data / money / outbound messages
- Reversible? How to roll back
- What must be checked before shipping

## Done when
Checkable acceptance criteria.

## Open questions
Only if any. Each with a recommended answer.

## Source
Who asked, where, when; original wording; links.
```

Drop a section that genuinely doesn't apply (no "Cause" on a feature, no "Open
questions" when there are none). Never drop **Risk**.

**Risk level guide.** Low: isolated, easy to revert, no data touched. Medium:
shared code or several screens, or behaviour users will notice. High: data
migrations, auth/permissions, payments, anything that sends messages to real
people, or anything hard to undo.

### 5. Set the fields

- **Title** — fix it if it's vague or wrong: 2–6 plain words, verb-led, no codes.
- **Effort** — the tracker's estimate field, on the team's own scale (read the
  team settings; don't assume). Base it on the proposed fix, including tests
  and verification.
- **Priority** — Urgent / High / Medium / Low from impact (who's affected, how
  badly, how soon). Never leave "No priority". If you change an existing
  priority, say why in the comment.
- **Project** — set if missing; best-fitting existing project in the team.
- **Labels** — fix if wrong or missing (bug / feature / etc.).
- **Status** — leave as is. Don't move it to in-progress; nobody is building.
  Don't change the assignee.

If the ticket duplicates another, don't plan it twice: carry any new detail
into the keeper, mark this one Duplicate, and report that instead.

### 6. Comment — only when it adds something

Add one comment when any of these is true; otherwise none:

- You changed priority, estimate or title — say from what to what, and why.
- There are open questions the owner must answer before building.
- Research turned up something that doesn't belong in the description (a dead
  end worth not repeating, a related ticket, evidence of the repro).

Keep it short. Don't paste the plan again.

### 7. Read back and verify

Re-fetch the ticket and check that the description, title, estimate, priority,
project and labels actually stuck. Fix anything that didn't.

## Reply to the user

Short, no recap of the ticket body:

```
LAB-123 updated — <title>
- fix: <one line>
- effort: <estimate> · priority: <priority> · risk: <level>
- open question: <only if any>
```

## Rules

1. **Never implement.** The deliverable is the ticket.
2. **Never lose information.** Rewriting the description keeps the original
   facts and links.
3. **Honest confidence.** A suspected cause is labelled suspected; an estimate
   resting on an unknown says so in Risk.
4. **One ticket per run** unless the user gives a list — then run the steps per
   ticket and reply with one block per ticket.
5. **Split, don't bloat.** If the fix is really two independent pieces of work,
   propose the split in "Open questions" (or the comment) rather than creating
   new tickets unasked.
