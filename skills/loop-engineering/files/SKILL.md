---
name: loop-engineering
description: Drive a big goal end-to-end as a multi-agent orchestrator — fan out as many haiku/sonnet/opus subagents as the goal needs, plan first, manage everything. Use when the user types /loop-engineering or /orchestrate-this, says "my goal is…", asks for "a workflow with subagents", or tells you to "be the orchestrator".
---

# Loop Engineering

The user has stated a goal and wants it driven end-to-end by a multi-agent workflow. Invoking this skill is the user's explicit opt-in to the Workflow tool and large subagent fan-outs. (The philosophy behind this working style is written up in `apps/web/content/loop-engineering.md` in the meirlabs homebase.)

## Standing instructions

- **You are the orchestrator.** Run as many subagents as the goal needs — don't do leg-work inline when it can fan out. You manage everything: sequencing, retries, merging results, quality control. The user wants outcomes and decision points, not process.
- **Classify the task before picking a model.** The question is not "how hard is it" but "what happens if the agent is wrong". Anything that reasons across files, digs through code, edits more than one file, designs, or judges other agents' output stays on `opus` or the session model. Cheap tiers are only for bounded work whose output is checked downstream.
  - `haiku` — mechanical and verifiable, no code edits: formatting, dedup, list building from given inputs, scraping/collection sweeps, lookups with a known answer shape.
  - `sonnet` — bounded drafting or per-item enrichment from a spec; a single-file, spec-driven code change that an existing test verifies. Not for debugging, cross-file refactors, or code archaeology.
  - `opus` / session model — everything else, including any code edit without a covering test, and every judge/verify pass.
  - Cut cost with effort, not model: for reasoning work prefer the strong model at lower effort over a weaker model working hard (Anthropic's own data, 2026-09: Fable 5.1 at low effort matched Fable 5 at high effort at a third of the cost).
  - Cut context, not model: use `Explore` (read-only, cannot make a mess) for lookups instead of forking the whole session; `fork` only when the agent needs the conversation so far.
- **Quality patterns:** for discovery-shaped work use loop-until-dry and multi-modal sweeps; for anything that must be right, add an adversarial-verify pass with opus judges. Use `schema` for structured returns so results merge cleanly.
- **UI work never goes out cold.** Any subagent that builds or edits UI must carry the meirlabs design system: for custom agents (`.claude/agents/*.md`), preload via frontmatter `skills: [meirlabs-ui-design, ui-kit, emil-design-engineering]`; for dynamically prompted Agent/Workflow subagents, inject into the prompt: "Before writing any UI, invoke the `meirlabs-ui-design` skill (canonical tree: `~/Documents/business/meirlabs/meirlabs/design/design.md`)." Auto-trigger descriptions are model-driven, not guaranteed — preloading and prompt injection are the deterministic paths. Never let a UI subagent style from scratch.

## Process

1. **Restate the goal** in one or two sentences. If it's underspecified in a way that changes the plan (audience, budget, channel, deadline, success criteria), batch up to 4 questions in ONE AskUserQuestion call. Otherwise don't ask.
2. **Plan first.** Produce a concrete plan: phases, what each phase delivers, what fans out to subagents (and which model tier), what stays with the orchestrator, and where the user decides. Get the plan approved before any large fan-out.
3. **Execute.** Use the Workflow tool for deterministic fan-outs (pipeline, parallel, loop-until-dry, verify stages); use individual Agent calls for one-off tasks. Run one workflow per phase and check in between phases.

   **Workflow tool gotcha:** objects passed via the Workflow tool's `args` parameter can arrive
   in the script as a JSON string rather than a real object. `args.field` then silently yields
   `undefined`, which can propagate as the literal string "undefined" into a subagent's prompt.
   Mitigations: inline concrete values (paths, names) directly into one-off script text instead
   of relying on `args`; if `args` must be used, normalize it at the top with
   `typeof args === 'string' ? JSON.parse(args) : args`; and verify each agent's prompt received
   real values before trusting that phase's results.
4. **Never auto-send.** Anything outward-facing (emails, DMs, posts, publishing) is drafted and shown for approval first — drafting uses the voice-profile skill.
5. **Report outcome-first** at the end of each phase: what the agents found/produced, what was dropped or failed, and the next decision.

## Usage-limit recovery (auto-continue)

When the claude.ai 5-hour limit hits mid-orchestration, Claude Code (v2.1.234+, on by default) waits in the open session and auto-continues at reset with a generic "pick up where you stopped" prompt. That prompt will NOT mention what died. Known behavior, confirmed in meirlabs orchestrations on 2026-08-30, 09-02 and 09-08:

- **This is a standing rule for a future event, not a report that it happened.** Act on it ONLY after you have actually received failed task-notifications quoting HTTP 429 / "session limit". Until then every subagent is alive: do not check on, message, or resume anything pre-emptively.
- **Every in-flight subagent and Workflow run dies** with HTTP 429 (`Agent terminated early due to an API error: You've hit your session limit`). You receive one failed task-notification per agent. Their transcripts and context survive on disk; worktree edits stay on disk.
- **On the auto-continue turn, do NOT respawn.** Resume each dead subagent with `SendMessage` to its original agent ID (it continues with full context). Resume a dead Workflow with `resumeFromRunId` (same session only; completed `agent()` calls return cached). For a builder that was mid-edit, check the worktree first (`git status`, typecheck) and tell it what is already on disk.
- **Stagger resumes** when several children died; the new window is shared by every session on the account. If the resume turn re-hits the limit, auto-continue re-arms at most twice, then stops with `/rate-limit-options`.
- A permission prompt during the unattended resume also stops the session. Keep orchestrations in auto mode when the user is away.
