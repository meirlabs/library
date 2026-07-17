# @meir-labs/skill-security-audit

The meirlabs security-audit skill — finds security issues that are **real and exploitable**, proves they're real, and hands back a fix plan a developer can execute today. It runs a threat model, a multi-lens static sweep (secrets, authz/RLS, injection, SSRF, XSS, supply chain, headers, business logic), read-only live-config checks, then puts every candidate finding through a 3-skeptic adversarial verification pass that defaults to rejecting it — so the report resists false positives. Each surviving finding ships with an exact file:line, a concrete attack, an implementation plan, and a test that proves the fix.

## Install

```sh
# into the current project (./.claude/skills/security-audit)
npx @meir-labs/skill-security-audit

# into every project (~/.claude/skills/security-audit)
npx @meir-labs/skill-security-audit --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically when asked to "audit before launch", "find security issues", "is this app secure", "check my RLS", or "pentest my code".

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/security-audit](https://meirlabs.com/skills/security-audit).
