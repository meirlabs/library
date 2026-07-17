# @meir-labs/skill-whatsapp-group-agent

Connect an AI agent to an existing WhatsApp group — it silently monitors messages, auto-creates and dedupes Linear tickets, files shared documents into a searchable library, and answers only when addressed.

## Install

```sh
# into the current project (./.claude/skills/whatsapp-group-agent)
npx @meir-labs/skill-whatsapp-group-agent

# into every project (~/.claude/skills/whatsapp-group-agent)
npx @meir-labs/skill-whatsapp-group-agent --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically the next time you ask it to wire an agent into a WhatsApp group.

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/whatsapp-group-agent](https://meirlabs.com/skills/whatsapp-group-agent).
