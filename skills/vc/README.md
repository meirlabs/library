# @meir-labs/skill-vc

Type `/vc` and your coding agent explains what it just did in two short lines that a non-technical investor can follow. There's no jargon and nothing extra.

```
**Problem:** phone sign-ups got no welcome email.
**Fix:** it now sends on every device.
```

A third line, `**Open:**`, appears only when something is unfinished.

## Install

```sh
# into the current project (./.claude/skills/vc)
npx @meir-labs/skill-vc

# into every project (~/.claude/skills/vc)
npx @meir-labs/skill-vc --global
```

Pass `--force` to overwrite an existing copy. It's plain markdown, so it works in Claude Code, Codex and any other agent that reads a `SKILL.md`.

Read it before you run it: [`files/`](./files).
