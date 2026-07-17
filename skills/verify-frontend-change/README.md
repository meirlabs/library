# @meir-labs/skill-verify-frontend-change

Verify any UI change end-to-end before declaring it done — drive it in a real browser, check the console and mobile, screenshot before/after.

## Install

```sh
# into the current project (./.claude/skills/verify-frontend-change)
npx @meir-labs/skill-verify-frontend-change

# into every project (~/.claude/skills/verify-frontend-change)
npx @meir-labs/skill-verify-frontend-change --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically and runs it as the stop condition for frontend work — no more handing back a UI change on a green build alone.

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/verify-frontend-change](https://meirlabs.com/skills/verify-frontend-change).
