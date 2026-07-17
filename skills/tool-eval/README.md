# @meir-labs/skill-tool-eval

The meirlabs tool-picking skill — runs "what platform should I use for X" as a multi-agent evaluation instead of a from-memory answer: parallel research with pricing verified against official pages, adversarial fact-checking of the decision-flipping claims, a judge panel scored on the buyer's real priorities, and a decision memo with a runner-up and switch triggers.

## Install

```sh
# into the current project (./.claude/skills/tool-eval)
npx @meir-labs/skill-tool-eval

# into every project (~/.claude/skills/tool-eval)
npx @meir-labs/skill-tool-eval --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically when asked to choose a tool, platform, or vendor where the decision has to hold up long term.

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/tool-eval](https://meirlabs.com/skills/tool-eval).
