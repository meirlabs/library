# @meir-labs/agent-seo-manager

A [Claude Code](https://claude.com/claude-code) subagent that audits and tends a site's SEO —
checks titles, meta, headings, schema, and internal links against the queries the site should
win, fixes what it can directly in code, and files the rest as a prioritized worklist.

## Install

```sh
# into the current project (./.claude/agents)
npx @meir-labs/agent-seo-manager

# into every project (~/.claude/agents)
npx @meir-labs/agent-seo-manager --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the agent up automatically.

## Use

```
> use the seo-manager agent to audit this site
```

The agent definition is a single markdown file — read it before you run it:
[`files/seo-manager.md`](./files/seo-manager.md). Full page: [meirlabs.com/agents/seo-manager](https://meirlabs.com/agents/seo-manager).
