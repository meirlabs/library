# @meir-labs/agent-project-starter

The meirlabs new-project pipeline as [Claude Code](https://claude.com/claude-code) subagents.
Six agent definitions that turn a brief into a shipped app, with a human yes in the middle:

1. **planner** — turns the brief into a build-ready `PLAN.md` and stops for explicit approval
2. **scaffolder** — copies the starter, replaces placeholders, installs
3. **design-applier** — applies the design system toward the plan's screens
4. **analytics-wirer** — wires PostHog per the plan's event taxonomy
5. **test-wirer** — wires Vitest + Playwright + CI and writes real starter tests, all green
6. **docs-writer** — writes CLAUDE.md / AGENTS.md / README so the next session starts smart

## Install

```sh
# into the current project (./.claude/agents)
npx @meir-labs/agent-project-starter

# into every project (~/.claude/agents)
npx @meir-labs/agent-project-starter --global
```

Installs all six files. Pass `--force` to overwrite existing copies.

## Use

Each agent runs standalone, or chained as the pipeline (plan → approve → build). The
definitions are plain markdown files — read them before you run them: [`files/`](./files).
Full page: [meirlabs.com/agents/project-starter](https://meirlabs.com/agents/project-starter).

Note: the planner/scaffolder reference meirlabs conventions (starter template, ui-kit,
PostHog setup). They work best alongside those, but the shape is easy to adapt.
