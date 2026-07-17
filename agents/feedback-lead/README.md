# @meir-labs/agent-feedback-lead

A [Claude Code](https://claude.com/claude-code) subagent that turns raw user feedback into a
deduped, prioritized backlog — clusters the same ask phrased different ways into one issue with
counted verbatim evidence, and files tickets to Linear (via MCP) or a portable backlog file.

## Install

```sh
# into the current project (./.claude/agents)
npx @meir-labs/agent-feedback-lead

# into every project (~/.claude/agents)
npx @meir-labs/agent-feedback-lead --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the agent up automatically.

## Use

```
> use the feedback-lead agent on feedback/inbox.csv
```

The agent definition is a single markdown file — read it before you run it:
[`files/feedback-lead.md`](./files/feedback-lead.md). Full page: [meirlabs.com/agents/feedback-lead](https://meirlabs.com/agents/feedback-lead).
