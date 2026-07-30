# @meir-labs/skill-brand-mascot

Create a branded mascot for a product and keep it visually consistent across an entire ad or content campaign.

The whole system rests on one mechanism: **identity lives in an attached reference image, never in prose.** Every generation call passes an actual PNG of the mascot as the first image part and tells the model, in a short fixed line, to keep that character consistent and only re-pose it. Re-describing the character's appearance in text is the number one cause of drift, so the skill never does it.

## Install

```sh
# into the current project (./.claude/skills/brand-mascot)
npx @meir-labs/skill-brand-mascot

# into every project (~/.claude/skills/brand-mascot)
npx @meir-labs/skill-brand-mascot --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically when you ask it to create a mascot, build a brand character, or keep one consistent across images.

## What it does

- Runs one of two arcs: invent a mascot from scratch (discovery, character brief, anchor kit), or wrap a consistency system around mascot art you already have.
- Conditions every render on a real reference PNG, with a fixed consistency line and a per-brand style contract of hard negatives.
- Composites real copy over the art in HTML/Chromium instead of asking the model for legible text, which it cannot reliably produce.
- Renders each platform format natively at its own dimensions rather than cropping one master, so nothing letterboxes or goes off-center.

## Contents

The skill is plain markdown — read it before you run it: [`files/`](./files).

- `SKILL.md` — the arc, the render loop, the ship checklist
- `references/prompt-patterns.md` — the exact reference-conditioning request shape
- `references/style-contract-template.md` — the per-brand style contract, with the reason behind each guardrail
- `references/format-matrix.md` — the platform format table and the letterboxing gotcha
- `references/pitfalls.md` — the documented failure log

Full page: [meirlabs.com/skills/brand-mascot](https://meirlabs.com/skills/brand-mascot).
