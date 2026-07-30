# @meir-labs/skill-supercharge

Most "make this better" loops stop when the model runs out of ideas, not when the work is actually good. This skill replaces that with a quality gate: the task is split into dimensions, one builder subagent owns each, and a **separate** harsh critic judges each dimension blind against a **named real benchmark** — Linear's dashboard, an actual published cold email, Stripe's docs page. The loop exits when every critic is wowed, never on a round counter.

## Install

```sh
# into the current project (./.claude/skills/supercharge)
npx @meir-labs/skill-supercharge

# into every project (~/.claude/skills/supercharge)
npx @meir-labs/skill-supercharge --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up on "supercharge", "/supercharge", "make it utterly perfect", "AAA quality", "best in class", or "don't stop until it's the best".

## The five ingredients

1. **A named, real benchmark** — never "make it good", always "as good as X", where X exists and can be fetched.
2. **Fan-out by dimension** — one builder subagent per quality dimension (typography, motion, evidence, API design…).
3. **A separate harsh critic per dimension** — the builder never grades its own work; the critic's default verdict is NOT wowed.
4. **Blind side-by-side** — the acceptance test is picking a winner between our result and the real benchmark, not scoring a rubric in isolation.
5. **DON'T STOP** — no iteration caps. Stalling escalates strategy instead of shipping. A partial pass is reported as NOT DONE, never rounded up to a win.

Invoking it is explicit opt-in to large subagent fan-outs and ultracode-scale token spend, and it overrides the usual proportionality rule for that one task.

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/supercharge](https://meirlabs.com/skills/supercharge).
