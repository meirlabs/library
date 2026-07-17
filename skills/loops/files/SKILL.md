---
name: loops
description: Design, pilot, and run standing agent loops — scheduled agents (cloud routines or local crons) that watch a system between sessions, keep its state of record honest, and escalate to a human instead of acting. Use when the user says "set up a loop", "monitor X on a schedule", "check this every few hours", "recurring agent", "routine", or wants something watched automatically between work sessions.
---

# Loops

How to stand up a standing agent loop: a scheduled agent that wakes on a cadence,
reads the state of record, checks live reality against thresholds a human already
wrote down, records what changed, and drafts escalations for a human to act on.
The loop is a watcher and a scribe. It is never an operator.

## 0. When a loop is worth having (and when it is not)

A loop earns its keep when all three are true:

1. **The watched system moves between your sessions.** Deadlines attached to
   calendar dates, SLAs measured in hours, external state that changes without
   you (deliverability rates, a queue, a ramp schedule). If state only changes
   when you act, a loop just confirms nothing happened.
2. **The rules are already written down as numbers.** A loop enforces
   thresholds; it must never invent them. If you cannot point at a doc that
   says "X must stay below Y after date Z", write that doc first (the meirlabs
   convention: a Verification section in the domain's ops skill).
3. **Catching a breach hours earlier changes the outcome.** Compliance clocks,
   reputation damage that compounds, ramps with due dates. If nothing bad
   happens by waiting for your next session, wait for your next session.

Do not build a loop as a substitute for reading state when you start working —
sessions still read the state of record first. And do not build one before the
system it watches is live: a loop watching static state is a safety shakedown
at best, noise at worst.

## 1. The one archetype: watcher-scribe

Every loop starts life as a watcher-scribe. It has exactly three permitted
outputs, and a hard rule above them:

**HARD RULE, stated verbatim in the prompt, no exceptions:** the loop NEVER
performs the domain's real actions (send, launch, approve, suppress, change
DNS or settings, spend money). If any action other than the three below seems
required, it STOPS and escalates instead.

1. **Read live state** (read-only APIs, DNS, files).
2. **Update the state of record** — the domain's OPS file. Correcting drift
   between the file and reality is the scribe's job, not an escalation.
3. **Draft escalations** for the human. Format, always: what tripped, the
   measured number, the threshold it crossed, the suggested human action.
   Specific and quantitative; never "something looks off".

Promoting a loop from watcher to operator (letting it fix things) is a
separate, later decision made only after a clean pilot — and even then, one
narrow action at a time.

## 2. Write the loop spec before the loop

A loop is born as a spec document, not a schedule. The spec (keep it in
`ops/tasks/<loop-name>.md`; worked example in the meirlabs homebase:
`ops/tasks/loops-pilot-outreach.md`) carries:

- **Objective** — one paragraph: what it watches, what it writes, what it never does.
- **The exact prompt** — self-contained, because a scheduled agent starts with
  zero context. Include the hard rule, the read order, each check with its
  numeric threshold, and the output rules.
- **Read order, non-negotiable:** (1) the state-of-record file, (2) the rules
  doc with the thresholds, (3) only then live state — so the loop interprets
  numbers against rules instead of guessing. If either file is unreadable, the
  loop does nothing and reports that it is blind. Acting on partial state is
  the cardinal sin.
- **Cadence + why** — justified against how fast the watched state actually
  moves and what the tightest real SLA is. Cold-email state moves in hours →
  4 wakes/day. A nightly report → 1. Complement existing loops; never
  duplicate one.
- **Escalation conditions** — the enumerated list of "notify, do not act" cases.
- **Pilot plan and pass/fail bar** (section 4).
- **Prerequisites checklist** — every file, credential, and access path the
  loop needs, each independently verified before launch.

## 3. Where the loop runs (decide with eyes open)

**Cloud routine** (claude.ai/code/routines, created via the /schedule skill):
survives your machine being off. But it is a sandbox:
- GitHub access needs the Claude GitHub App installed on the org, or a
  `/web-setup` token sync from a CLI that can already reach the repo. Verify
  with a throwaway run BEFORE trusting a schedule — the classic silent failure
  is a routine whose checkout never worked.
- No access to your machine: no Keychain, no local files, no local env.
  Secrets go in the routine's cloud-environment variables (UI-only, stored in
  plain text — judge accordingly) or the loop runs without them (see the
  known-gap rule, section 5).
- Writes default to `claude/*` branches + a PR, not pushes to main. For a
  pilot, keep that default: it contains an over-reaching loop at the cost of
  one merge click.
- The loop reads `origin/main`. Local sessions must push state-of-record
  changes promptly or every wake sees a stale file and "corrects" it backwards.
- Cron is UTC. A local-time cadence drifts by an hour across DST changes;
  note it in the spec.

**Local schedule** (cron on your machine): full repo, Keychain, and network
access, no sandbox friction — but wakes silently skip when the machine is off
or asleep. Fine for loops that tolerate missed wakes; wrong for SLA clocks.

**Secrets hygiene, wherever the loop runs:** any secret file on disk is `0600`,
never `0644` — make that the default, not a per-incident fix. Better still, keep
no long-lived plaintext secret files at all: pull on demand (`vercel env pull`),
use a manager (1Password CLI, `direnv` with an encrypted store), or the OS
keychain. Cloud-environment variables are stored in plain text — treat them as
the lowest tier and put only read-only, easily-rotated keys there.

## 4. Pilot protocol: prove it small, then decide

Never turn a loop on wide. In order:

1. **Dry run by hand.** Run the exact prompt once in a normal session with one
   modification: propose-only — everything it would have written goes to a
   scratch file, nothing touches the repo or any API mutably. Read the output.
   Two questions: did it try to do anything beyond its three permitted
   outputs, and would its writes have been correct and quiet?
2. **Short scheduled window.** ~20 wakes (about 5 days at 4/day). Watch for the
   two failure modes: **stalling** (a wake that produces nothing or silently
   errors) and **over-reaching** (editing more than its files, drafting noise,
   proposing to act).
3. **Iterate the prompt, not the cadence, first.** Noisy → tighten the
   no-change rule and the escalation bar. Only a loop that genuinely misses
   fast state earns a tighter interval.
4. **Usage review.** After the window, check cost per wake and total. A
   read-heavy monitor should be cheap; an expensive one is over-fetching or
   over-writing and needs trimming before it runs indefinitely.
5. **Decide, against the pre-written bar:** promote only if zero unsafe
   actions, at most 1 false-positive escalation, every real state change
   reflected within one wake, and cost acceptable. Otherwise stop and
   redesign. Widening scope or cadence is a separate later decision.

## 5. Output discipline (where loops die)

- **No-change wakes write nothing.** No branch, no PR, no "no change" log
  line. A one-line session summary is enough. Loops die by noise: four
  do-nothing PRs a day trains the human to ignore the loop, and then the real
  escalation is ignored too.
- **Encode known gaps explicitly.** If a credential or data source is
  deliberately absent (a key not provisioned yet), the prompt must say so and
  instruct the loop to skip those checks silently, noting them only in the
  session summary. Otherwise every wake escalates "I am blind" and the pilot
  fails on false positives through no fault of the design. Only an
  unexpectedly failing source is real blindness worth escalating.
- **Escalations are files, not vibes.** One dated file per escalation in an
  agreed place the human actually looks (e.g. `<domain>/escalations/`),
  delivered by PR, with a pointer line in the ops log. Agree on the landing
  place before launch; it is a spec prerequisite.
- **Absolute dates only** in everything the loop writes.

## Verification

Quantitative checks a session (or a meta-loop) can run against any loop built
with this skill:

- The loop's spec doc exists and contains: the hard rule verbatim, a numeric
  threshold for every check, a cadence justification, and a pilot pass/fail
  bar. A loop with an unwritten threshold is a fail.
- Dry run completed before the schedule existed, with zero unsafe actions and
  zero repo writes. No dry-run record = do not launch.
- Every threshold the prompt cites matches the domain rules doc exactly
  (numbers, dates, units). A drifted copy is a fail; the prompt should cite
  the doc, not fork it.
- Cloud checkout verified by an actual run before the first scheduled wake.
- Pilot window defined in wakes (default 20) with the promote bar: 0 unsafe
  actions, ≤1 false-positive escalation, every real state change reflected in
  the state of record within one wake.
- No-change wakes produced zero repo writes during the pilot. Any "no change"
  commit or PR is a fail.
- Post-pilot usage review done before the loop runs past its window.
