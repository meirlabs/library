# @meir-labs/skill-review-animations

A motion-review Claude Code skill with ten non-negotiable standards derived from Emil Kowalski's design engineering philosophy — default to flagging, approval is earned.

## Install

```sh
# into the current project (./.claude/skills/review-animations)
npx @meir-labs/skill-review-animations

# into every project (~/.claude/skills/review-animations)
npx @meir-labs/skill-review-animations --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically when reviewing CSS transitions, keyframes, springs, and gesture handlers.

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/review-animations](https://meirlabs.com/skills/review-animations).
