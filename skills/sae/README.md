# @meir-labs/skill-sae

Status And Estimate — a three-line status protocol for coding agents. Type `/sae` and get minutes left, what's in flight, what's finished, and nothing else.

```
- estimate: 12 mins left
- status: working on the Hebrew nav copy and the mobile crop | finished the token swap, the hero, and the /pricing table
- notes: the e2e run needs E2E_PORT=4173 or it hangs
```

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
