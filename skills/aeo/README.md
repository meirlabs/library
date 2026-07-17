# @meir-labs/skill-aeo

The meirlabs AEO (Answer Engine Optimization) skill — make a site quotable by AI answer engines (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews). SEO fights to rank in a list of blue links; AEO fights to be the source the model *quotes* in the one answer it gives. The skill encodes the mental model as four gates every page must pass in order — **Findable, Quotable, Understandable, Trustworthy** — each with exact pass thresholds, plus the site-wide Content/Technical/Authority/Measurement pillars and the code recipe that fixes each failure: robots access for AI crawlers, llms.txt, JSON-LD schema, FAQPage, canonical/OG, alt text, freshness signals, and AI-referral measurement.

## Install

```sh
# into the current project (./.claude/skills/aeo)
npx @meir-labs/skill-aeo

# into every project (~/.claude/skills/aeo)
npx @meir-labs/skill-aeo --global
```

Pass `--force` to overwrite an existing copy. Claude Code picks the skill up automatically when asked about "AEO", "answer engine optimization", "GEO", "will AI cite my site", "get cited by ChatGPT/Perplexity", "LLM visibility", "schema for AI", "llms.txt", "AI crawler access", or for an AEO audit/plan.

The skill is plain markdown — read it before you run it: [`files/`](./files).
Full page: [meirlabs.com/skills/aeo](https://meirlabs.com/skills/aeo).
