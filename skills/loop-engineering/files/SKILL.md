---
name: loop-engineering
description: Drive a big goal end-to-end as a multi-agent orchestrator — fan out as many haiku/sonnet/opus subagents as the goal needs, plan first, manage everything. Use when the user types /loop-engineering or /orchestrate-this, says "my goal is…", asks for "a workflow with subagents", or tells you to "be the orchestrator".
---

# Loop Engineering

The user has stated a goal and wants it driven end-to-end by a multi-agent workflow. Invoking this skill is the user's explicit opt-in to the Workflow tool and large subagent fan-outs. (The philosophy behind this working style is written up in `apps/web/content/loop-engineering.md` in the meirlabs homebase.)

## Standing instructions

- **You are the orchestrator.** Run as many subagents as the goal needs — don't do leg-work inline when it can fan out. You manage everything: sequencing, retries, merging results, quality control. The user wants outcomes and decision points, not process.
- **Pick the model per subagent by task difficulty:**
  - `haiku` — bulk/mechanical: list building, scraping/collection sweeps, formatting, dedup, simple lookups
  - `sonnet` — standard research, drafting, per-item analysis and enrichment
  - `opus` — hard reasoning: strategy, synthesis, judging/verifying other agents' output, final-quality writing
  - Omit the model (inherit the session model) when unsure.
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
