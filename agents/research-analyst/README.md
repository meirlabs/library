# @meir-labs/agent-research-analyst

A [Claude Code](https://claude.com/claude-code) subagent that maps a market and watches the
competition — builds a sourced market map (segments, named competitors, positioning, pricing,
recent moves), then on repeat runs diffs against the last map and briefs only what changed.

## Install

```sh
# into the current project (./.claude/agents)
npx @meir-labs/agent-research-analyst

# into every project (~/.claude/agents)
npx @meir-labs/agent-research-analyst --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the agent up automatically.

## Use

```
> use the research-analyst agent to map the market for <your product>
```

The agent definition is a single markdown file — read it before you run it:
[`files/research-analyst.md`](./files/research-analyst.md). Full page: [meirlabs.com/agents/research-analyst](https://meirlabs.com/agents/research-analyst).
