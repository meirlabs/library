# @meir-labs/skill-loops

The meirlabs loops skill — how to stand up a standing agent loop: a scheduled agent (cloud routine or local cron) that wakes on a cadence, reads the state of record, checks live reality against thresholds a human already wrote down, records what changed, and drafts escalations instead of acting. Covers the watcher-scribe archetype, the loop spec template, cloud-vs-local trade-offs, the dry-run-first pilot protocol, and the output discipline that keeps a loop from dying of noise.

## Install

```sh
# into the current project (./.claude/skills/loops)
npx @meir-labs/skill-loops

# into every project (~/.claude/skills/loops)
npx @meir-labs/skill-loops --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically when asked to set up a loop, monitor something on a schedule, or create a recurring agent.

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/loops](https://meirlabs.com/skills/loops).
