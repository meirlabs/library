---
name: aeo
description: Make a site quotable by AI answer engines (ChatGPT, Claude, Perplexity, Gemini). Encodes the AEO checklist, pass thresholds, and code fixes - robots for AI crawlers, llms.txt, JSON-LD/FAQPage schema, canonical/OG, alt text, freshness, AI-referral measurement. Use when the user says "AEO", "answer engine optimization", "GEO", "will AI cite my site", "LLM visibility", "schema for AI", "llms.txt", or wants an AEO audit/plan.
---

# AEO — Answer Engine Optimization

**AEO is structuring content, technical foundations, and authority signals so AI
answer engines can understand, trust, and surface your content in generated
answers.** SEO fights to rank in a list of blue links; AEO fights to be the
source the model *quotes* in the one answer it gives. The overlap with SEO is
large, but AEO adds four things SEO never had to care about: letting AI crawlers
in, marking up meaning in machine-readable schema, writing content shaped so an
answer can be *lifted whole*, and measuring whether LLMs actually mention you.

This skill is the framework and the fix recipes. The **`aeo-manager` agent** is
the working pass that applies it to a site. **`seo-manager`** covers the SEO
overlap; **`write-article`** is the repeatable content workflow that closes
question-coverage gaps. Cross-reference all three; don't duplicate their work.

## The mental model

For an AI to cite a page, four things must be true, in order. Each is a gate: a
page that fails an earlier gate never reaches the later ones.

1. **Findable** — an AI crawler can reach and index the page at all.
2. **Quotable** — there's a clean, current, self-contained answer to lift.
3. **Understandable** — the machine can parse the structure and the meaning.
4. **Trustworthy** — the page signals it's an authority worth citing.

Zoom out from the page to the whole site and the same thing splits into four
**pillars** you can score and move: **Content** (do you answer the questions,
and completely), **Technical** (can machines parse the site), **Authority**
(does the rest of the web vouch for you), **Measurement** (do you even know how
LLMs represent you). A site can be technically perfect and still invisible
because it answers 16% of the questions buyers ask — AEO is all four or nothing.

## The per-page checklist (exact pass thresholds)

Score every page against these. **Pass items** count toward the score;
**bonus items** add points but never penalize when missing. Reproduce these
thresholds exactly — they are the assessment's real bars, not approximations.

### Findable — can an AI crawler reach and index it

- **HTTPS enabled.** Served over HTTPS. Required for AI crawlers to trust and index it.
- **robots.txt present** and does **not** block the AI bots. See the AI-crawler list below.
- **sitemap.xml present**, lists all key pages, submitted in Google Search Console under Sitemaps.
- **Canonical URL set** — a `<link rel="canonical">` in the head of every page, to prevent duplicate-content splits.
- **AI crawlers allowed** — no `Disallow` targeting `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`. This is the single most common own-goal: a default `Disallow` quietly locks every answer engine out.

### Quotable — can it lift a clean, current answer

- **Meta description, 50–160 chars.** Also set `og:description`; make sure it's SSR-rendered (present in the raw HTML, not injected client-side — crawlers read the raw HTML).
- **Substantial text content** — at least **100 words** of readable body text. AI can't quote a page that is mostly images or a headline.
- **Content freshness signals** — a date in JSON-LD (`datePublished`/`dateModified`), meta tags, or sitemap `lastmod`. "Fresh" = updated within **6 months**.
- **FAQ-style content (bonus)** — H2/H3 headings phrased as questions ending in `?`, or `FAQPage` schema. Adds points, never penalizes. Question-shaped headings are the highest-leverage single edit for quotability.

### Understandable — can it parse structure and meaning

- **Single H1**, descriptive, reasonable length. One clear "what this page is about" signal. Not zero, not three.
- **Clean heading hierarchy** — headings structure the content (h1 → h2 → h3), not just style text. No jumping levels for visual size.
- **Structured data (JSON-LD)** — the schema.org type the page obviously is. Missing is a finding; *wrong* type is a worse finding. The single most reliable way for AI to know a page's type and context.
- **Open Graph tags** — `og:title`, `og:description`, `og:image`, `og:url` in the head.
- **Image alt text coverage ≥ 50%** — the pass threshold is **50%, not 100%**. Alt text descriptive, under ~125 chars, describing what the image shows.

### Trustworthy — does it signal authority

- **Internal links present** — at least **3 contextual links in the page body**, pointing to related content, pricing, or core pages. **Nav and footer links do not count** — they must be in-prose links.
- **External citation links** — at least **2 outbound links to external sources**. Signals you're citing evidence, which is what a citable source does.
- **llms.txt file present (bonus)** — a `/llms.txt` at the site root describing the site to AI systems. Emerging standard; adds points, never penalizes.

## The four site-wide pillars (what moves the score)

Per-page is necessary but not sufficient. These are the levers that move the
whole-site score, in the assessment's own terms.

### Content — answer the questions, completely

- **Library size.** A handful of pages is a weak foundation. Aim for **≥ 10 content pages** on your core topics (guides, articles, resource pages).
- **Question coverage.** Score = share of the **top ~50 questions your audience asks** that your content addresses. Going from ~16% to majority coverage is usually the biggest single AEO win. Prioritize **high-intent** questions: ROI, implementation timeline, use cases, pricing, security.
- **Answer depth ("complete the thought").** LLMs cite thorough answers and skip partial ones. Never mention a capability without explaining how it works; never state a benefit without evidence. A half-answer earns zero citations.

→ Every gap here is a `write-article` job. Turn each uncovered high-intent question into an article; each one raises coverage and ships `Article` + (ideally) `FAQPage` schema.

### Technical — let machines parse the site

- **Schema coverage %** — share of pages carrying JSON-LD. Start with `Organization` on the homepage and `Article`/`FAQPage` on content pages; scale to **50%+ of pages**. Validate with Google's Rich Results / Structured Data test.
- **Metadata coverage** — title + meta description + canonical + OG on every page.
- **Mobile speed** — mobile **LCP under 4s** per the AEO assessment bar (~5s fails). This is looser than the `web-performance` skill's 2.5s Core Web Vitals budget; hitting that budget satisfies this automatically. For fixes, see the `web-performance` skill. Speed is an AI-crawlability signal, not just UX.
- **Accessibility metadata** — clean landmarks and alt text double as machine-parseability signals.

### Authority — make the rest of the web vouch for you

- **Contact page** — a dedicated page with real contact info (email, booking link, address where applicable). A basic legitimacy signal for both prospects and AI.
- **Consistent brand messaging sitewide** — the same one-line description of what you do and who you're for on homepage, about, product, pricing. **Inconsistent descriptions confuse LLMs and dilute authority** — this is the "AI slop / misrepresentation" risk. Keep a one-paragraph canonical description and reconcile every page to it.
- **Author attribution** — bylines with **author bios + credentials**, linked author profiles, and `Person` schema so LLMs get structured authorship. Aim for author attribution on ~15% of content pages and up.
- **Off-site mentions** — how many of the top ~50 sites in your space mention you. Mostly earned (PR, directories, guest content, being genuinely referenceable), not a code fix — file it as strategy.

### Measurement — know how LLMs represent you

Externally-visible analytics (GA4, PostHog) is table stakes. AEO-specific
measurement is the frontier, and most of it can't be seen from outside — so if
it's not in place, it's a real gap even when a scanner can't detect it:

- **Share of voice** — how often LLMs recommend you vs. competitors, across your priority buyer questions.
- **Accuracy / representation** — do LLMs describe your product, positioning, and pricing correctly, and *consistently* across different phrasings of the same question? Track which sources get cited in those answers.
- **AI-referred traffic as its own channel** — segment visits/conversions from `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, etc. Do they convert differently than organic search?
- **Server-log crawler hits** — confirm `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` are actually fetching your pages.
- **Real-time dashboards + alerts** on LLM mention/citation rate and on changes in how you're represented.

## Code recipes (Next.js App Router shown; principles are generic)

### robots — allow the AI crawlers (the #1 own-goal)

The bots that must be allowed: `GPTBot` (OpenAI), `OAI-SearchBot` (ChatGPT
search), `ChatGPT-User`, `ClaudeBot` / `Claude-Web` (Anthropic), `PerplexityBot`
+ `Perplexity-User`, `Google-Extended` (Gemini/AI Overviews training),
`Applebot-Extended`, `Bytespider`, `CCBot` (Common Crawl, feeds many models).
**Allowing = simply not `Disallow`-ing them.** A blanket `Disallow: /` or a
CMS-default block is what kills AEO. In `app/robots.ts`:

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/auth/'] }],
    sitemap: 'https://example.com/sitemap.xml',
    host: 'https://example.com',
  }
}
```

If you must gate specific bots, do it deliberately and know you're trading away
that engine's citations. Don't block AI bots "to save bandwidth" by default.

### llms.txt (bonus, but cheap) — a plain-text map for AI

A `/llms.txt` at the root: an H1 with the site name, a blockquote one-liner,
then `##` sections of Markdown links to your key pages with short descriptions.
It's the AI-era `sitemap.xml` in prose. Serve it at the root (a route or a
static file). Keep it current when pages change.

### JSON-LD — the meaning layer

Inject `<script type="application/ld+json">` per page with the right type:

- `Organization` + `WebSite` — once, sitewide (root layout). Name, url, logo, `sameAs` (social profiles), `contactPoint`.
- `Article` / `BlogPosting` — every article. `headline`, `datePublished`, `dateModified`, `author` (a `Person`), `image`, `publisher`.
- `FAQPage` — any page with Q&A sections. Each `Question` + `acceptedAnswer`. This is what surfaces you in "People also ask" and in AI answers directly.
- `Person` — author bios; link from `Article.author`.
- `BreadcrumbList`, `Product`, `Service`, `SoftwareApplication` — where they genuinely fit the page.

Never fabricate schema that misrepresents the page — wrong schema is worse than
none. Validate everything before shipping.

### Canonical + Open Graph — the Next metadata API

```ts
export const metadata: Metadata = {
  title: '…',
  description: '…',                                  // 50–160 chars
  alternates: { canonical: 'https://example.com/page' },
  openGraph: { title, description, url, images: [{ url: '/og.png' }] },
}
```

For localized sites also emit `alternates.languages` (hreflang) so each locale
is its own canonical.

### FAQ-shaping — the highest-leverage content edit

Turn body prose into H2/H3 questions ending in `?`, each answered in one tight,
self-contained paragraph, and mirror them into `FAQPage` schema. This is exactly
what `write-article` already does for meirlabs articles — the answer-engine
structure and the primaryQuestion/answerSummary block. Reuse that pattern.

### Freshness — prove the page is current

Set `dateModified` in the page's JSON-LD **and** `lastmod` in the sitemap, and
bump them on material edits. Stale-looking pages (no date, or >6 months) get
skipped even when the answer is good.

### Measurement — detect AI-referred traffic

In your analytics (PostHog for meirlabs — see `posthog-ops`), segment by
referrer host: `chatgpt.com`, `perplexity.ai`, `gemini.google.com`,
`copilot.microsoft.com`. Track those as a named "AI answer engines" channel and
compare conversion vs. organic. For crawler confirmation, grep server/CDN logs
for the bot user-agents above.

## Running an audit

The `aeo-manager` agent does this end to end. If you're doing it inline:

1. **Map the surface** — enumerate pages from framework routes or by crawling the live URL (cap ~25).
2. **Score each page** against the four-gate checklist above; record pass/fail/bonus per item.
3. **Check the site-wide items once** — robots (AI bots allowed?), sitemap, llms.txt, schema coverage %, contact page, brand-message consistency, measurement tooling.
4. **Separate fix-in-code from strategy.** Code: schema, robots, llms.txt, canonical/OG, alt text, freshness, FAQ-shaping, internal links. Strategy/worklist: new content pages, question coverage, off-site mentions, LLM-mention tracking.
5. **Audit the real code, not a stale report.** External scanners run at a point in time and go out of date fast — verify every claimed gap against the current codebase before repeating it. A "missing contact page" finding is wrong the moment the page ships.
6. **Never invent metrics.** Claim only what you can see in code or fetch live. "9% schema coverage" is a number from a specific crawl, not a fact about the code today.

## The org layer (why AEO stalls, from the AEO Divide research)

AEO is as much an operating problem as a technical one. The research is blunt:
68% of marketing *leaders* claim AEO maturity, but only 26% of *practitioners*
say they're actually implementing it. The gap is ownership, enablement, and
measurement, not knowledge. The four moves that separate high-maturity teams:

1. **Name an owner.** One person/team owns AEO strategy and coordination (usually from an SEO background), even if it's part of their remit. Ambiguous ownership keeps AEO stuck in "experiment" mode forever.
2. **Enable before you raise expectations.** Give the team reference examples and hands-on training, not high-level decks. (Only 23% of practitioners get hands-on AEO training.)
3. **Systematize content, don't optimize one page at a time.** Standardize FAQs, answer sections, author attribution, and freshness so improvements apply across many pages. Embed AEO in the *content workflow*, not as a post-publish afterthought.
4. **Measure early, even imperfectly.** High-maturity teams track AI visibility and LLM-referred traffic before the standards settle. Waiting for perfect metrics delays learning; it doesn't reduce risk.

For a solo operator (meirlabs): the owner is obvious, `write-article` **is** the
systematized content workflow, and PostHog is the measurement base — so the
whole org layer collapses to "keep shipping question-coverage articles with
schema, and watch AI referrals." Don't over-engineer the org story for a
one-person shop; do apply the content-system and measurement discipline.

## Checklist before calling an AEO pass done

- [ ] robots allows GPTBot / ClaudeBot / PerplexityBot / Google-Extended (verified, not assumed).
- [ ] sitemap.xml present and complete; canonical + OG on every page.
- [ ] llms.txt present and current (bonus, but cheap).
- [ ] JSON-LD on the homepage (`Organization`/`WebSite`) and on content pages (`Article`/`FAQPage`); type matches the page; validated.
- [ ] Each page: single descriptive H1, clean heading hierarchy, meta description 50–160 chars, ≥100 words body, ≥50% image alt coverage.
- [ ] Each substantive page: ≥3 in-body internal links, ≥2 external citation links.
- [ ] Freshness: dateModified in schema + sitemap lastmod, bumped on edits.
- [ ] Content: counted question coverage; each gap filed as a `write-article` job; no half-answers.
- [ ] Authority: contact page live; one canonical brand description reconciled across home/about/pricing; author bios + `Person` schema.
- [ ] Measurement: AI-referral channel segmented in analytics; a plan to track LLM mentions/representation.
- [ ] Every claimed gap verified against current code, not copied from a stale external report. No invented metrics.
