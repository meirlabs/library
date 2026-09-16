# @meir-labs/skill-sae

Status And Estimate — a three-line status protocol for coding agents, written for the person who owns the product rather than the person who wrote the code. Type `/sae` and get minutes left, what's in flight, what's done, and nothing else.

```
- estimate: 20-30 mins left
- status: working on the reliability fixes a reviewer flagged and the new sign-in flow | finished the daily sync, the invite email, and the settings page
- notes: I can't deploy myself — when the fixes land you'll run one command I'll paste
```

No file paths, no migration numbers, no function names: every item is a feature, screen, flow, or risk, and related fixes group into one phrase.

## Install

```sh
# into the current project (./.claude/skills/sae)
npx @meir-labs/skill-sae

# into every project (~/.claude/skills/sae)
npx @meir-labs/skill-sae --global
```

Pass `--force` to overwrite an existing copy. It is plain markdown with no tool calls, so it works in Claude Code, Codex, and anything else that reads a `SKILL.md` — link the same folder into `~/.codex/skills/sae` to share one copy.

Read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/sae](https://meirlabs.com/skills/sae).
