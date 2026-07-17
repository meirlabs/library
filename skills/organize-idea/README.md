# @meir-labs/skill-organize-idea

A Claude Code skill that files a SaaS idea into a standard project structure — plan-first, confirm-before-move.

## Install

```sh
# into the current project (./.claude/skills/organize-idea)
npx @meir-labs/skill-organize-idea

# into every project (~/.claude/skills/organize-idea)
npx @meir-labs/skill-organize-idea --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically when organizing a new or messy idea folder.

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/organize-idea](https://meirlabs.com/skills/organize-idea).
