# @meir-labs/skill-drain-studio

The meirlabs Drain Studio skill — the whole bookmark-to-PR loop. Two daily agent loops and a human review gate: bookmark triage turns saved X bookmarks into Linear tickets every morning, then Drain Studio runs a PM-led agent team per top-priority ticket (fixed 10-agent roster, isolated git worktrees, adversarial review with a 2-round rework cap, cost fuses) and parks each result as a draft PR. Approve or kill; the loop never merges, publishes, or sends anything itself.

This package installs the overview skill — the system map, the three stages, and the safety spine. The runnable machinery (Python conductor, fixed-purpose helper CLIs, launchd schedules, Supabase pipeline-state migration, agent role briefs, offline test harness) is open source at [github.com/meirlabs/drain-studio](https://github.com/meirlabs/drain-studio).

## Install

```sh
# into the current project (./.claude/skills/drain-studio)
npx @meir-labs/skill-drain-studio

# into every project (~/.claude/skills/drain-studio)
npx @meir-labs/skill-drain-studio --global
```

Pass `--force` to overwrite an existing copy.

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/drain-studio](https://meirlabs.com/skills/drain-studio).
