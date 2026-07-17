---
name: tool-eval
description: Pick the right tool/platform/vendor for a job with a multi-agent evaluation — parallel research with verified pricing, adversarial fact-checking against official docs, a judge panel scored on the buyer's real priorities, and a decision memo with switch triggers. Use when the user asks "what platform/tool/service should I use for X", "compare vendors for X", or wants a tooling decision that has to hold up long term.
---

# Tool Eval

The user needs to pick a tool, platform, or vendor and the decision matters — wrong picks cost a migration later. This skill runs the decision as a multi-agent evaluation instead of a from-memory recommendation. Invoking it is the user's opt-in to a Workflow fan-out (~15-25 agents for a full run).

The method exists because single-pass recommendations fail in three specific ways, and each phase below kills one of them:
1. **Stale or hallucinated facts** (pricing, tier-gating) → research agents must fetch official pages, and finalists get a separate adversarial verify pass.
2. **Generic criteria** (a "best overall" that isn't best for this buyer) → judge lenses are derived from the buyer's stated priorities, not a stock rubric.
3. **Point-in-time answers** that rot → the memo includes a runner-up and concrete switch triggers, so the decision documents when it stops being right.

## Phase 0 — Buyer context (before any fan-out)

Build the buyer-context block. If any of these are unknown AND would change the answer, batch them in ONE AskUserQuestion call (max 4): long-term scale/usage shape, budget ceiling (and whether cost or migration-avoidance dominates), hard requirements (the must-haves that disqualify, e.g. "API + webhooks on the tier I buy"), and the current default/incumbent if one exists.

Write the context as a `CONTEXT` string with the priorities in ranked order. Every downstream agent gets it verbatim. Include today's month/year in it — research agents have no clock and must not trust remembered pricing.

## Phase 1 — Research sweep (parallel)

- **One sonnet agent per candidate** (aim for 8-10 candidates; include the incumbent). Structured schema, at minimum: pricing per plan with the caps, which tier gates each hard requirement, ecosystem/infra options, community reputation with sources, company trajectory (funding, direction, layoffs), lock-in/migration pain, fit notes against CONTEXT, source URLs, confidence. Instruct: fetch the OFFICIAL pricing page and docs, do not rely on memory, be specifically skeptical about tier-gating of the hard requirements, lower confidence when unverifiable.
- **2-3 cross-cutting sweep agents (sonnet)** researching what no per-candidate agent sees: practitioner sentiment at the buyer's target scale (what do people actually running this workload use — Reddit, X, comparison posts from the last ~18 months), landscape shifts that change the game (platform crackdowns, regulation, pricing-model trends), and unit economics at 2-3 scale points relevant to the buyer.

## Phase 2 — Shortlist (opus, high effort)

One judge gets ALL research + sweeps and picks 3-4 finalists. For each finalist it must list the 3-6 **load-bearing claims** — the facts that flip the decision if wrong (usually pricing, tier-gating of hard requirements, scale limits). Everything else gets eliminated with one-line reasons. A candidate that looks good on paper but has consistent practitioner complaints or high landscape exposure is not a finalist.

## Phase 3 — Adversarial verify (parallel, per finalist)

One sonnet agent per finalist re-checks each load-bearing claim against OFFICIAL sources only (pricing page, docs, changelog — fetched fresh). Verdict per claim: confirmed / wrong / partially-wrong / unverifiable, with evidence URL and correction. This is the phase that catches the decision-flipping errors — in one real run it caught the planned pick's base tier silently lacking webhooks, which reversed the recommendation.

## Phase 4 — Judge panel (3 opus judges, high effort)

Three lenses, **derived from the buyer's top-3 ranked priorities** (not a stock rubric). Each judge sees the verified research (with instructions to use corrections over original claims), scores every finalist 0-10 through its single lens, ranks, and flags dealbreakers.

## Phase 5 — Decision memo (opus, high effort)

One synthesis agent writes the memo: TLDR (winner + runner-up + one-sentence why); what to buy NOW for the current stage and the growth path on the same platform; scorecard table (finalists x lenses); why-not paragraphs for eliminated candidates; **switch triggers** (concrete conditions under which the runner-up becomes right); and a setup plan with costs. Where judges disagreed, the memo must resolve the disagreement explicitly against the buyer's priority order and say why. Be decisive — a ranked tie is a failure mode.

## After the workflow

1. Save the memo where the project keeps decisions (e.g. the relevant strategy dir) and relay the TLDR, the reversal-if-any, and the switch triggers to the user.
2. On approval, update the plan-of-record docs and memory so the old recommendation can't resurface.
3. Purchases and signups stay with the user. Never buy, subscribe, or create vendor accounts.

## Calibration

Scale the harness to the stakes. A reversible, low-cost pick (a $10/mo utility): skip the workflow, one research agent + a verify of the single load-bearing claim. A foundational pick (sending infrastructure, database, payments): the full five phases. When the user says "long term" or the cost of migrating later is high, that is the full-harness signal.
