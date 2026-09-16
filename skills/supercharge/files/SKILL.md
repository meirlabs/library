---
name: supercharge
description: Turn any task into a don't-stop-until-wowed quality loop - builder subagents per dimension, each paired with a harsh critic that blind-compares the result against a named best-in-class benchmark, looping until every critic is wowed. Use when the user says "supercharge", "/supercharge", "make it utterly perfect", "AAA quality", "best in class", or "don't stop until it's the best".
---

# SuperCharge

The user has a task and wants it executed at best-in-class quality through relentless
builder/critic loops. Invoking this skill is the user's explicit opt-in to the Workflow
tool, large subagent fan-outs, and ultracode-scale token spend. **It also overrides the
proportionality rule for this task**: SuperCharge is the user saying "spend the process
weight." Do not do the lighter version.

## The five ingredients (all mandatory, every run)

1. **A named, real benchmark.** Never "make it good" — always "as good as X" where X is
   an actual best-in-class product, artifact, or exemplar (Linear's dashboard, a top
   Lavender-teardown cold email, Stripe's docs page, the latest Call of Duty). If the
   user didn't name one, pick the obvious category leader, state it, and proceed.
2. **Fan-out by dimension.** Decompose the task into quality dimensions (for UI:
   typography, spacing, motion, empty states…; for writing: opener, structure, evidence,
   tone…; for code: correctness, performance, API design…). One builder subagent owns
   each dimension.
3. **A separate harsh critic per dimension.** The builder NEVER grades its own work. The
   critic is a different subagent, prompted to be brutally harsh, that would rather fail
   good work than pass mediocre work.
4. **Blind side-by-side comparison.** The critic's acceptance test is never a rubric
   score in isolation. It puts our result and the real benchmark side by side — without
   being told which is which whenever the medium allows — and picks which one is better.
   Screenshots vs screenshots, draft vs real email, our answer vs the expert's answer.
5. **DON'T STOP until every critic is wowed.** This is the main ingredient. There is no
   fixed round count and no "3 iterations then ship." The loop terminates only when the
   critic is wowed, per the contract below. Write the orchestration so that the
   quality gate — not an iteration counter — is the exit condition.

## Process

1. **Restate the task and name the benchmark(s).** One or two sentences. If the choice
   of benchmark genuinely changes the work (e.g., "Linear-fast" vs "Notion-flexible"),
   batch questions in ONE AskUserQuestion call; otherwise pick and state.
2. **Decompose into dimensions** and post the plan: dimension → builder → critic →
   benchmark artifact used for the blind comparison. Say what "wowed" concretely means
   for each dimension before any agent runs.
3. **Run builder/critic pairs via the Workflow tool.** Pipeline per dimension:
   build → critique → fix → re-critique, looping inside the workflow. Structure the loop as
   `while (!verdict.wowed) { fix; re-judge; }` with the stall-escalation rule below —
   never `for (3 rounds)`.
4. **Critics check each other's blind spots.** After all dimensions pass, run a final
   integration critic on the whole assembled result (the parts can each be great while
   the whole is incoherent). It uses the same blind side-by-side contract against the
   full benchmark. If it fails the whole, it must name which dimension(s) to reopen —
   and those loops restart.
5. **Report honestly, outcome-first.** "Every critic wowed after N rounds" only if true.
   A partial pass is reported as NOT DONE with the failing critics' verdicts quoted —
   never rounded up to a win.

## The critic contract

Every critic subagent gets this contract in its prompt:

- **Default verdict is NOT wowed.** You are looking for reasons to fail this work. If
  you are unsure, you are not wowed.
- **Wowed means:** in a blind side-by-side against the real benchmark, you would pick
  ours, or you genuinely cannot tell which is the benchmark. "Almost as good" is a fail.
- **Return structured verdicts** (use Workflow `schema`):
  `{ wowed: boolean, loses_because: string[], concrete_fixes: string[], benchmark_compared: string }`
  `loses_because` must cite specific, observable gaps (not "polish more"); `concrete_fixes`
  must be actionable enough that the builder needs no further judgment calls.
- **You never fix anything yourself.** You judge and specify; the builder implements.
- **Compare against the real thing**, fetched fresh where possible (live screenshot of the
  benchmark product, the actual published email, the real docs page) — not your memory of it.

## The DON'T STOP rule

- No iteration caps anywhere in the orchestration. The Workflow tool's own 1000-agent
  backstop and any explicit "+Nk" token budget from the user are the ONLY hard limits.
- **Stalling is not a reason to stop.** If two consecutive rounds produce no movement in
  the critic's `loses_because` list, do not ship and do not quit: escalate strategy —
  re-diagnose from scratch with a fresh opus agent, try a structurally different
  approach, or split the dimension further. Then resume the loop.
- **"Good enough" is not a verdict that exists here.** The only three exits are:
  (a) every critic wowed; (b) the user interrupts; (c) a critic states explicitly that
  the remaining gap is impossible in this medium (e.g., a browser demo cannot match a
  native engine's lighting) — in which case that exact statement is surfaced to the user
  as an open decision, and the result is reported as NOT DONE, not as done-with-caveats.
- Long-running is expected. Use background workflows, check in between phases with
  state restated ("dimension 3 of 6 wowed; motion critic failing on easing, round 5"),
  and keep going across context summarization — the loop's state lives in the workflow,
  not in the conversation.

## Composition with standing meirlabs rules

- **Model tiering** (per orchestration-model-tiering): builders `sonnet` (or `haiku` for
  mechanical fixes), critics and final judges `opus` — judging is hard reasoning. Never
  let a fan-out inherit the session model by accident.
- **UI dimensions carry the design system.** Any builder touching UI gets the
  meirlabs-ui-design invocation injected into its prompt (canonical tree:
  `~/Documents/business/meirlabs/meirlabs/design/design.md`) plus ui-kit and
  emil-design-engineering where relevant. UI critics compare with real screenshots via
  headless Playwright, never from code alone.
- **Never auto-send.** If the supercharged artifact is outward-facing (email, DM, post,
  deploy), the loop perfects the draft; the send/publish stays an explicit user approval.
- **Workflow `args` gotcha** (from loop-engineering): objects passed via `args` can
  arrive as a JSON string — normalize with
  `typeof args === 'string' ? JSON.parse(args) : args` or inline concrete values into
  the script text.
- **Accuracy over win-framing** always beats the desire to report a clean finish.
