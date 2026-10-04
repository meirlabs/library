# @meir-labs/skill-demo

Type `/demo` and your coding agent builds one page with 10 genuinely different options for the thing you named: a design, a layout, some copy, or a flow. Switch between them with the number keys and pick one by number. The agent then builds the one you pick properly.

## Install

```sh
# into the current project (./.claude/skills/demo)
npx @meir-labs/skill-demo

# into every project (~/.claude/skills/demo)
npx @meir-labs/skill-demo --global
```

Pass `--force` to overwrite an existing copy. It's plain markdown, so it works in Claude Code, Codex and any other agent that reads a `SKILL.md`.

Read it before you run it: [`files/`](./files).
