# @meir-labs/skill-bookmark-triage

The meirlabs bookmark-triage skill — turn saved X/Twitter bookmarks into Linear tickets automatically. A daily agent loop reads new bookmarks via the shiori.sh CLI, classifies each against your idea taxonomy (build ideas, AI tooling, content angles, tools to evaluate), auto-files tickets for the actionable ones, skips the noise, and tags processed links so nothing is ever double-processed. Covers the full working setup: the fixed-purpose helper CLI that is the agent's only mutation surface (no general shell or network for the unattended run), the prompt-injection containment for processing untrusted tweet content, the launchd daily schedule with its preflight checks, and the subagent variant.

## Install

```sh
# into the current project (./.claude/skills/bookmark-triage)
npx @meir-labs/skill-bookmark-triage

# into every project (~/.claude/skills/bookmark-triage)
npx @meir-labs/skill-bookmark-triage --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically when asked to triage bookmarks or set up a bookmarks-to-tickets loop.

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/bookmark-triage](https://meirlabs.com/skills/bookmark-triage).
