---
name: write-article
description: Write or edit an SEO/AEO article for the meirlabs web app (apps/web/content/articles) - the frontmatter schema, the answer-engine structure, the "By the numbers" stats convention, and the editorial rules. Use when the user says "write an article", "new blog post", "add an article", "edit the cost/timeline article", or wants copy for the /articles section.
---

# Write Article Skill

How to write and edit articles for the meirlabs site. Articles are Q&A pieces
built to be quoted by AI answer engines (AEO) and to rank in search (SEO), not
just read start to finish. Every rule below exists because a real edit was
needed to fix its absence, keep them.

## General rules vs cost-specific rules

Most of this skill is general and applies to every article: the answer-engine
structure, the TL;DR/intro split, concrete examples, honest math, tight length,
sourcing, voice, and the consistency sweep.

A few sections are **cost-specific** and are marked as such: cost tiers, the
monthly-usage explanation, and promo/discount CTAs. These apply **only** when
the article is about pricing, ROI, usage fees, or payback. For a timeline,
operating-model, security, or strategy article, use the same underlying
principles (concrete, tiered, honest, tight) but do not force cost tiers,
dollar figures, or a discount pitch where they do not belong. Overfitting every
article to the cost article is a failure mode, avoid it.

## Where articles live

- One markdown file per article: `apps/web/content/articles/<locale>/<slug>.md`
- `locale` is one of `en` | `he` | `ru`. Default to `en`; other locales are separate files sharing a `translationKey`.
- **The filename IS the slug.** `frontmatter.slug` must equal the filename without `.md`, or the build throws.
- Routes, the sitemap, and hreflang are automatic. Adding a valid file is all it takes to publish, there is no index to register in.
- The loader/validator is `apps/web/lib/articles.ts`; the renderer (stats icons, CTA, source pills) is `apps/web/app/articles/_components/ArticleView.tsx`. Read those if a field's behavior is unclear.

## Frontmatter (all fields required unless noted)

```yaml
---
title: "How Much Does AI Adoption Actually Cost a Small Business?"
description: "One-sentence meta description. This is the search snippet, make it earn the click."
slug: "how-much-does-ai-adoption-cost"        # MUST match the filename
translationKey: "ai-adoption-cost"            # groups the same article across locales for hreflang
locale: "en"
publishedAt: "2026-07-09"                      # YYYY-MM-DD
updatedAt: "2026-07-09"                        # bump when you materially edit
author: "Meir Rosenschein"
authorUrl: "https://meirlabs.com/about"
ogImage: "/logo.png"
ogImageAlt: "meirlabs logo"
heroImage: "/articles/how-much-does-ai-adoption-cost/hero.png"  # OPTIONAL lead image under the title — most articles omit it (see Images)
heroImageAlt: "A short description of what the hero image shows"  # required ONLY if heroImage is set (build fails otherwise)
heroCaption: "Optional one-line caption under the hero"           # optional
status: "published"                            # "draft" | "published" — draft still routes, but is not indexed
noindex: false
primaryQuestion: "How much does AI adoption cost for a small business?"
answerSummary: "…"                             # the extractable answer — see rules below
tags: ["ai-adoption", "cost", "getting-started"]
stats:                                         # optional; omit entirely if there are no numbers worth surfacing
  - value: "$3k–$5k"
    label: "To automate one simple task, like drafting routine emails"
    icon: "wrench"
sources:                                       # 2–3 real, reputable URLs
  - title: "Anthropic: Claude API pricing"
    url: "https://platform.claude.com/docs/en/about-claude/pricing"
---
```

`primaryQuestion` doesn't render as visible text — it feeds the FAQPage JSON-LD
(`apps/web/lib/article-seo.ts`) and must closely match the H1 title in meaning.
What renders under the H1 is the `answerSummary` TL;DR. Treat both as the most
important lines in the file.

## The answer-engine structure (non-negotiable shape)

1. **Title** — phrase it as, or close to, the question a person types. The "Actually" / "Really" framing tests well. Set `primaryQuestion` to that same question in bare form; it never appears on the page (it only feeds the FAQPage JSON-LD), so it must match the title in meaning.
2. **`answerSummary` (the TL;DR)** — renders under the H1; a self-contained answer an engine can quote without reading the body. See TL;DR rules.
3. **Intro (2–4 sentences)** — do a *different* job than the TL;DR (see the next section). Name and correct the reader's *wrong frame*, set the stakes, or explain why the obvious comparison misleads. e.g. "Most owners price AI like software. Wrong frame."
4. **3–4 H2 headings, each a question**, each answered in one tight paragraph. These are the questions people also ask. Real examples that work:
   - "What actually costs money in an AI project?"
   - "Why is the sticker price the wrong thing to compare?"
   - "Why is the first workflow more expensive than the tenth?"
   - "What makes AI adoption expensive when it goes wrong?"
5. **A one-line rule/test to close** — "A simple rule to start: …" / "A simple test for the first slice: …". Gives the reader one thing to do.
6. **Optional promo/CTA section** (cost-specific, see CTA rule).

A section that enumerates failure modes or gotchas ("What breaks first?") reads
as **symptom → fix bullets**, not one dense paragraph — more scannable, and
each bullet is independently quotable by an answer engine (real edit on the
WhatsApp article).

**Length: target 600–900 words.** The current articles are strong because they
are tight. If a draft passes 1,000 words, cut before adding sections. Each H2
should usually be a single paragraph, not a mini-essay.

## Images & figures

A wall of text does not read like a real publication. Prefer at least one image
that carries information, not decoration.

- **Bespoke `fig:` figures are the house standard** (every published article
  ships 1–3). A figure is a hand-designed, theme-aware diagram or chart that
  carries one of the article's actual arguments — never generic chart filler.
  Each article's figures live in
  `apps/web/app/articles/_components/figures/<slug>.tsx`, default-exporting
  `Record<string, FigureComponent>` (see any existing module for the pattern;
  `how-much-does-ai-adoption-cost.tsx` is the reference). Embed with
  `![alt](fig:<name> "Caption")`. An unknown figure name **throws at build
  time**, so name and module must match.
- **Figure rules** (from the pilot, keep them): monochrome `--ml-*` tokens only
  (must read in both themes); labels localized en/he/ru via a LABELS map inside
  the module; panels forced `dir="ltr"` (figures are LTR islands on the RTL
  Hebrew pages); every value directly labeled, no hover layer; honest scales
  (never mix one-time and monthly units on one axis; don't fabricate quantities
  the prose doesn't claim — a qualitative shape chart drops its y-axis); bars
  ≤24px with 4px rounded data-ends, 2px surface gaps, hairline gridlines; text
  in text tokens, never data color; no horizontal scroll at 375px. Shared
  grammar classes are `.art-fig-*` in `articles.css`; per-figure geometry is
  inline styles so new figures need no CSS edits.
- **Design the figure for the argument.** Pick the 2–3 points the article
  actually argues and give each the form that proves it (range bars, phase
  timeline, break-even lines, a flow/boundary diagram, a typographic ledger).
  If the point is qualitative, a diagram beats a chart.
- **Numbers in figures obey the consistency sweep**: they must match the body,
  the stats tiles, and any sibling article quoting the same example (the cost
  and ROI articles share the email-tool math).
- **Captions do a job.** Say what the reader should take from the image, don't
  just name it. "Where the $3k–$5k tier lands versus a full software build," not
  "a chart."
- **Raster images still work** where a real screenshot/photo is the content:
  `![alt text](/articles/<slug>/thing.png "Optional caption")`. The renderer
  unwraps a lone-image paragraph into a `<figure>`: the markdown **title** (the
  quoted part) becomes the visible caption; if omitted, the **alt** is used.
- **Hero image is optional.** There is no standard hero-graphic style yet, so
  most articles currently ship without one. If you do set a hero, use
  `heroImage` (+ required `heroImageAlt`, optional `heroCaption`); it renders
  full-column-width directly under the title, ahead of the TL;DR, and the build
  **fails** if `heroImage` is set without `heroImageAlt`.
- **Where images live.** Put real image files under
  `apps/web/public/articles/<slug>/` and reference them as
  `/articles/<slug>/<file>`. Prefer `.webp`/`.png`; keep them reasonably sized.
- **Schematic app-window cards** (the `mock:<name>` step cards from
  `StepMocks.tsx`) still work for how-to walkthroughs and are exempt from the
  figure framing — they render as their own step panel, not a bordered figure.
  A step item can also carry a nested bullet list and a follow-up paragraph
  (the step-grid CSS places them in the text column since 2026-07-10). Use
  that to make the pivotal step the meatiest one — e.g. quoting literal,
  copy-pasteable rules. Hard-won literal rules are the highest-value quotable
  content an article can carry; competing articles can't reproduce them.
- **SEO note:** when a `heroImage` is set, the BlogPosting JSON-LD uses it as
  the structured-data image (otherwise the title OG card).

## Do not repeat the TL;DR in the intro

The TL;DR (`answerSummary`) already answers the question directly. The first
body paragraph must do a *different* job: correct the reader's wrong frame, set
up the stakes, or explain why the obvious comparison is misleading. If the intro
mostly restates the answerSummary, delete it or rewrite it. A reader who just
read the TL;DR should learn something new in the first paragraph, not hear the
same answer twice.

## TL;DR (`answerSummary`) rules

The single most-edited field. Get it right the first time:

- **Short.** Aim ~55–75 words. If it runs long, cut. A four-sentence version beats an eight-sentence one every time.
- **Conversational.** Use "for example", "like", "say". It should read like you explaining it to one person, not a spec.
- **Lead with concrete, tiered examples**, never one abstract range. The failure mode to avoid: "a simple workflow costs $3,000 to $30,000." That range is too wide and self-contradictory. Instead, split into named tiers, each with a recognizable example:
  > A simple tool, like one that drafts replies to routine emails, runs $3,000 to $5,000. A bigger multi-step workflow is more like $20,000 to $30,000, plus $20 to $200 a month to run.
- **Self-contained.** Someone who reads only these lines should have the real answer.
- **End on the one thing that matters most** (here: the wrong-workflow warning).
- **No product/skill plug inside the TL;DR.** A bolded pitch mid-answer dilutes what an answer engine will quote (real edit: the WhatsApp article's TL;DR carried a bolded skill link and ran to 100 words; the fix moved the pitch to its own body section). The TL;DR is the answer; offers live in the body.

## Concrete examples over abstractions (everywhere, not just the TL;DR)

"Something very simple" or "a well-scoped workflow" tells the reader nothing.
Name the actual tool every time:

- Bad: "Automating a simple workflow costs $3–5k."
- Good: "A tool that drafts replies to your routine customer emails costs $3–5k."

Reuse the same two or three example tools consistently across the whole article
(TL;DR, body, stats) so the reader builds a mental model instead of meeting a
new example in every paragraph.

## Numbers and ranges (mostly cost-specific)

These apply to any article that quotes figures, but they matter most on
pricing/ROI articles. Do not manufacture tiers or dollar amounts for an article
that is not about cost.

- **Tier, don't span.** Never attach a giant range to one label. Break it into tiers (simple / multi-step), each with its own tight range and its own concrete example. *(Cost articles especially.)*
- **Explain the mechanism in plain language, and say who bears it.** *(Cost-specific.)* When you name a cost, don't leave it as jargon. Example that had to be added: the monthly "usage" cost is *the fees the AI models and any connected services (an email API, a search tool) charge each time the tool runs; the integrator wires these up so the technical side is handled, but the usage itself is billed to the company.* Same pattern for any cost, fee, or mechanism: what it is, and whose bill it lands on.
- **Keep the math honest.** If you quote a payback ("pays for itself in a few months"), the numbers in that example must actually support it. A $20–30k build against $900/month of manual work does NOT pay back in months, so use the cheap-tier example there.

## The "By the numbers" stats strip

- **Stats are optional. If present, use exactly 3 tiles.** Omit the `stats` field entirely on an article with no numbers worth surfacing; when you include it, ship exactly 3. The renderer slices to 3 (`article.stats.slice(0, 3)`), so a 4th is silently dropped and fewer than 3 looks unbalanced.
- Every stat must map to a number that actually appears in the body. The strip is a scannable index of the article's claims, not new claims.
- **Pick numbers the reader needs for their decision** (what it costs to run, how long to set up, how long to recover), not facts about the alternative the article rejects. Real edit: an "8-participant cap on official-API groups" tile (a fact about the path the article says not to take) got replaced by total monthly running cost.
- `value` is a string, so ranges/units render verbatim: `"$3k–$5k"`, `"2–6 weeks"`, `"~1 / month"`, `"< 1 year"`. Use an en dash `–` in ranges, never a hyphen-minus and never an em dash.
- **Tight labels.** One line. Cut filler. "Per month to run the workflows" not "Per month to run each of the workflows." Put one concrete example in at least one label ("…like drafting routine emails").
- `icon` is a short key mapped in `ARTICLE_STAT_ICONS`. Valid keys only:
  `clock`, `calendar`, `rocket`, `target`, `speed`, `wrench`, `repeat`, `coins`, `money`, `chart`, `team`, `workflow`.
- Optional `sourceUrl` on a stat links the figure to a source pill.

## The CTA / promotions (promo part is cost-specific)

- Every article auto-appends a **shared** book-a-plan CTA (`ctaTitle`/`ctaBody`/`ctaButton` in `ArticleView.tsx`, per locale). Editing that changes it on **every** article. Do not put article-specific copy there.
- An **article-specific** offer or promo goes in the **body** of that one article, as a final Q&A section that hands off into the CTA below it. Real example (the cost article's launch discount):
  > ## Is there a discount right now?
  > Yes. I'm just launching, so I'm taking on a small group of early clients at about half the numbers above. … If you want one of those spots, the free AI plan below is where it starts.
- When a promo restates numbers ("about half the numbers above"), give the reader at least one concrete resulting figure ("closer to $1,500 to $2,500") and make sure it's arithmetically right against the tiers.

## Voice

- **No em dashes.** Ever. Use commas, or parentheses, or split the sentence. (Hard rule, see the `voice-profile` skill.)
- Conversational and direct. Short declaratives. "Wrong frame." is a fine sentence.
- First person as Meir where it's his offer or opinion (the promo, "teaches me the most"). Third person for the general explainer body.
- Contractions are fine and preferred. Avoid corporate hedging ("it depends", "various factors").

## Sources

- 2–3 real, resolvable URLs. Never invent one. If unsure a link resolves, check it.
- **A source must support a claim the article actually makes**, not sit there for credibility. Reputable is not enough. If nothing in the piece leans on it, drop it.
- **The inverse holds too: the article's strongest quotable claim must carry a source.** Real edit: the WhatsApp article's most-quotable fact (the 8-person cap on official-API groups) had no source while a weak X-thread walkthrough sat in the sources list; the fix swapped them. A link that only supports a how-to step belongs inline in the body, not in `sources`. Verify the page states the claim (fetch it) before citing.
- **Link the specific report or article, not a topic hub.** Point at the page with the finding (`.../state-of-ai-report-2026`), not the outlet's landing page or a tag/search page.
- **If a number is operator judgment, say so.** Figures like the cost tiers come from experience, not a study. Phrase them as judgment ("in my experience", "typically") rather than dressing them up with a source that does not actually contain them. Do not attach a research URL to a number that research did not produce.
- Outlets used before (Anthropic, a16z, Stanford HAI, Deloitte, MIT/Fortune, IBM) are examples of the *bar*, not a required set. Pick whatever genuinely backs this article's claims.

## Consistency sweep (do this after any numeric or example edit)

Changing one number or example silently breaks others. After an edit, re-read
the WHOLE article and confirm:

- The same example tool carries the same price tier everywhere (TL;DR, body, stats, promo).
- Every stat tile still matches a body number.
- Any payback/ROI claim still holds against the numbers in its own example.
- The promo's halved/derived figures are still arithmetically correct.
- `updatedAt` is bumped if the change is material.

The canonical bug this catches: an invoice-matching workflow priced at $20–30k
in the cost breakdown while the payback section still called the same invoice
tool "a few thousand to build." Fix by making the examples consistent, not by
patching one number.

## Quick checklist before shipping

- [ ] Filename == `slug`; `locale` correct; `status` set intentionally.
- [ ] Title reads like the question; `primaryQuestion` + `answerSummary` are a clean Q→A.
- [ ] TL;DR is short, conversational, self-contained (and tiered with concrete examples *if* it's a cost article).
- [ ] **Intro does a different job than the TL;DR** — it does not restate the answer.
- [ ] Every H2 is a question; each answered in one tight paragraph; a one-line rule closes it.
- [ ] **600–900 words; under 1,000.** Cut before adding sections.
- [ ] Stats optional; if present, exactly 3, tight labels, valid icons, each backed by a body number.
- [ ] **1–3 bespoke `fig:` figures placed at the article's argument points, each with a caption that carries the takeaway; figure module has en/he/ru labels; localized siblings embed the same figures with translated alt/captions. Hero image optional (with alt text if used).**
- [ ] No em dashes anywhere. En dashes in ranges.
- [ ] Sources support actual claims, link the specific page not a topic hub; operator-judgment numbers phrased as judgment, not falsely sourced.
- [ ] No cost tiers / dollar figures / discount pitch forced onto a non-cost article.
- [ ] (Cost articles) costs explained in plain language with who-pays; ranges tiered, not spanned; payback math holds.
- [ ] Article-specific CTA/promo in the body, not the shared component.
- [ ] Consistency sweep done.
- [ ] For a new indexable article, add localized siblings later if the family needs them (shared `translationKey`).
