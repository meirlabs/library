# @meir-labs/skill-testing

The meirlabs automated-testing standard. How every project sets up, writes, and runs tests, and how Claude reports results to a non-coder owner in plain language: Vitest + Testing Library for unit/integration, Playwright for E2E, a CI workflow, and a "safe to deploy or not" report after every run.

## Install

```sh
# into the current project (./.claude/skills/testing)
npx @meir-labs/skill-testing

# into every project (~/.claude/skills/testing)
npx @meir-labs/skill-testing --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically on "set up tests", "add tests", "run the tests", "why is CI red?", "is it safe to deploy?", or a reported bug (pairs with the `test-wirer` agent, which does the wiring, and the `deploy` skill, which hard-gates on green tests).

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/testing](https://meirlabs.com/skills/testing).
