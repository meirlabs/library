# @meir-labs/skill-prep

Type `/prep LAB-123` and your coding agent turns a vague ticket into one that someone else can build from. It reads the whole ticket, finds the cause or the shape of the work in the code, picks one fix, and writes it back onto the ticket. It never builds the fix.

The ticket ends up with this description:

```
## What          the problem, as the user sees it
## Why           who it affects and what it costs to leave
## Where         product area, repo and main files
## Cause         bugs only, marked confirmed or suspected
## Proposed fix  numbered steps a builder can follow
## Risk          Low / Medium / High, what could break, how to roll back
## Done when     checkable acceptance criteria
## Source        who asked, original wording, links
```

It also sets the effort estimate on the team's own scale and a priority, fixes a vague title, and re-reads the ticket to check the changes saved. Status and assignee are left alone. It comments only when it changed a field or has a question for the owner.

Works with Linear (through an MCP server or the API) and with GitHub issues through `gh`.

## Install

```sh
# into the current project (./.claude/skills/prep)
npx @meir-labs/skill-prep

# into every project (~/.claude/skills/prep)
npx @meir-labs/skill-prep --global
```

Pass `--force` to overwrite an existing copy. It's plain markdown, so it works in Claude Code, Codex and any other agent that reads a `SKILL.md`. Link the same folder into `~/.codex/skills/prep` to share one copy.

Read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/prep](https://meirlabs.com/skills/prep).
