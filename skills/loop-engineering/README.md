# @meir-labs/skill-loop-engineering

The meirlabs loop-engineering skill — drive a big goal end-to-end as a multi-agent orchestrator. Invoking it is the explicit opt-in to large subagent fan-outs: the agent restates the goal, produces a phased plan (what fans out, which model tier per task, where the human decides), and only executes after the plan is approved. Model tiering is per task — haiku for bulk/mechanical work, sonnet for standard research and drafting, opus for hard reasoning and judging other agents' output. Anything that must be right gets an adversarial-verify pass; anything outward-facing (emails, posts, publishing) is drafted for approval, never auto-sent.

The philosophy behind this working style is written up at [meirlabs.com/loop-engineering](https://meirlabs.com/loop-engineering).

## Install

```sh
# into the current project (./.claude/skills/loop-engineering)
npx @meir-labs/skill-loop-engineering

# into every project (~/.claude/skills/loop-engineering)
npx @meir-labs/skill-loop-engineering --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically when the user says "my goal is…", asks for "a workflow with subagents", or says "be the orchestrator" / "orchestrate this".

The skill is plain markdown — read it before you run it: [`files/`](./files).
