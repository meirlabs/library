# @meir-labs/skill-deploy

The five-step ship checklist as a Claude Code skill — typecheck, build, env check, deploy to Vercel, report the URL.

## Install

```sh
# into the current project (./.claude/skills/deploy)
npx @meir-labs/skill-deploy

# into every project (~/.claude/skills/deploy)
npx @meir-labs/skill-deploy --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically when shipping a web app the same verified way every time.

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/deploy](https://meirlabs.com/skills/deploy).
