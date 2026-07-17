---
name: gtm
description: How a one-person studio takes an idea to market — positioning, channels, and operating cadence. Load when planning launches, landing pages, or distribution.
---

# Go-to-market at meirlabs

How a one-person studio takes an idea to market fast. The premise: shipping is
cheap now, so the scarce thing is not building the product — it's finding the
people who need it and earning their trust. Distribution is the discipline;
the product is the proof.

This is the operating playbook that runs on every launch. It has one binding
constraint everywhere: one person's hours — ten focused hours a week during a
push. Every channel below is budgeted in hours the way the tracker budgets
projects in hours. Agents extend the hours; they don't repeal the constraint.

The doc is a living playbook. It gets revisited per launch, not framed on a
wall. Attributions live in the sources footer; the claims stand on their own.

## Who it's for

Each product starts with a sharp ICP, not a broad one. A tool that tries to
serve everyone converts no one. Before writing a line of copy, we name:

- **The person** — their role, the moment they feel the pain, what they use now.
- **The trigger** — the specific event that sends them looking for a fix.
- **The alternative** — the spreadsheet, the manual process, the incumbent
  they'll be leaving behind. Including "do nothing." In practice the biggest
  competitor is inertia; positioning has to break the status quo, not just
  beat the other vendor.

Two tests before the ICP is accepted:

- **Painkiller, not vitamin.** Weekly-or-daily use, real consequences if
  unsolved. Vitamins get admired and churned.
- **The trigger is findable.** If we can't name where the person is at the
  moment of the trigger — a subreddit, a search query, a review page, a
  LinkedIn post — we don't have an ICP, we have a demographic.

### Finding the pain before writing code

Cheapest research in the business: read the complaints people already wrote.

1. Find a simple product making real money in the space.
2. Open the Reddit threads complaining about it; append `/.json` to the URL
   to pull the entire thread with metadata.
3. Feed the dump to a model. Extract recurring pain, exact vocabulary, and
   the gaps the incumbent won't close.
4. That vocabulary becomes the copy. Those gaps become the differentiator.

People write paragraphs about their problems on Reddit they'd never say to a
salesperson. Same move works on G2 and Trustpilot 1-star reviews — more on
that in Outbound.

### Proving it travels — before the build

Pain-reading proves people *complain*. It does not prove the product will
*spread*. Those are two tests, and the second is the one most technical
founders skip — they build the whole thing, then discover the distribution
second. Building is the fun part; that's exactly why the reach question gets
deferred. Invert it: before committing real build hours, ship the cheapest
artifact that proves the thing can move through its intended channel.

- **Post the demo before the product exists.** A clip of the outcome — even
  stitched from footage of the thing working elsewhere — dropped into the
  actual channel, honestly (never claim it's built), measures the only thing
  that matters pre-build: does it travel? Comments asking "where can I get
  this" and waitlist signups are the signal. This is the move that inverts
  "build first, distribute later" — the whole playbook in one step.
- **Optimize the test for buyers, not views.** A million views of the wrong
  audience is a vanity result: a viral education carousel pulls in students
  who can't pay. Count comments from people who'd buy, not reach.
- **Prefer a fast feedback loop while validating.** A channel that tells you
  in hours (a posted clip, a DM offer) is worth more at this stage than one
  that compounds over weeks (SEO/ASO) — the slow loop is right for scale, not
  for the pre-build question. Judge the test by how fast it answers.
- **You can only write hooks for a feed you live in.** A channel you don't
  actually use daily is one you can't validate against; native attention is
  part of the cost of picking it.

The point isn't "make something go viral" — virality isn't summonable. It's
that the cheapest possible channel test comes *before* the build, not after,
and its result decides whether the build happens at all.

## Positioning

Positioning is decided before the landing page, not after. The formula:

> For **[ICP]** who **[trigger]**, meirlabs builds **[product]** — the
> **[category]** that **[single differentiator]**. Unlike **[alternative]**,
> it **[proof]**.

One product, one promise, one primary metric it moves. The landing page's only
job is to make that promise legible in ten seconds.

The formula expands into a four-level messaging hierarchy, written once per
product and reused everywhere:

| Level | Form | Rule |
|---|---|---|
| One-liner | 7–12 words | Names the outcome, no jargon. |
| Elevator pitch | 3–4 sentences | Who it serves, what it does, why it matters, what's different. |
| Proof narrative | 2–3 minutes | A user like you → the struggle → what changed → the number. |
| Deep dive | Long-form | Methodology for people already leaning in. |

Rules that keep positioning honest:

- **Start from alternatives, not from us.** April Dunford's ordering:
  alternatives → unique attributes → value → best-fit customer → category.
  You are always positioned relative to something.
- **Name the category deliberately.** The same product files differently in
  the brain depending on what we call it. Narrow, verifiable claims beat broad
  ones — narrow enough that we're the only option in the frame.
- **Repel on purpose.** If the messaging appeals to everyone, it resonates
  with no one. Some people bouncing is the copy working.
- **One messaging doc per product** — positioning statement, one-liner,
  pitch, 3–5 core messages with proof points. Every page, post, and cold
  email pulls from it. Agents pull from it too; that's what keeps automated
  output on-voice.
- **Rebrand after a real pivot.** Keeping the old story creates dissonance;
  the rewrite forces us to articulate what the product became.

The voice is already defined by the design doc and principles: restrained,
specific, no superlatives. "Cut reporting from 4 hours to 15 minutes" beats
"save time." Ban streamline, optimize, innovative, and every exclamation point.

## The portfolio

The studio is wide, not deep — eleven products across B2C, vertical B2B, dev
tools, and Hebrew-local, most at first-hundred-users stage. Portfolio rules
exist so the width doesn't dilute the hours.

| Rule | Meaning |
|---|---|
| One push at a time | One product gets the active GTM motion per cycle. The rest get maintenance and the shared drip. |
| Shared rails | Every product rides the same scaffold: PostHog day one, the studio event dictionary, same landing structure, same launch checklist, same agent stack. A launch should cost less each time. |
| One audience, many products | The founder audience is the studio's owned channel. Every launch seeds from it; every launch feeds it back. |
| Kill criteria are written before launch | See Measurement. A product that misses them goes to the shelf without ceremony. |

### Which product gets the push

"One push at a time" needs a way to pick the one. Score every candidate 1–5
on four axes and multiply — multiply, not sum, so a 1 anywhere sinks it:

| Axis | The question |
|---|---|
| ICP findability | Can we name the room and the trigger query today? |
| Channel–founder fit | Does its primary channel run on hours the founder already spends well? |
| Revenue potential | Price × buyers plausibly reachable this cycle. |
| Excitement runway | Will the founder still want this in six months? |

The score is re-run at every cycle boundary — when a push hits its kill
criteria or its double-down. The winner is recorded in the GTM workspace, and
this doc records the current answer: **Miror**. The hackathon-finalist
credential is perishable, the buyers are builders, and the channel is the
founder's home platform. Monday morning has an answer.

Rough channel-fit map, from each product's ICP:

| Product | ICP | Primary channel |
|---|---|---|
| Edena | VCs/analysts triaging decks | Founder-led on LinkedIn + outbound to funds |
| Miror | Devs doing AI QA | X + GitHub + Show HN; the hackathon-finalist credential leads |
| RedMaester, LetSync | Agent-workflow adopters | X build-in-public — this audience **is** builders |
| NuNotes, SoClever | Prosumers, self-learners | SEO/AEO + product-led sharing |
| Elianna | Health-conscious consumers | Short-form content + AEO; paid only after organic proof |
| Sanegor, Balitut | Hebrew-speaking Israel market | Hebrew SEO/AEO (near-zero competition), local communities, WhatsApp groups — not X |
| DoorData | Property managers | Outbound. Vertical B2B buyers are reached, not found |
| GOAT Arena | Fantasy-sports gamers | Product-led virality + community; largest proven user base — rebuild the loop that got it |

The Hebrew products get a note of their own: the Hebrew answer-engine corpus
is thin, which makes AEO there disproportionately cheap. Being the answer in
a small language is easier than page three in English.

## Channels

Two taxonomies used to coexist — the prose ordering here and the seven-row
GTM workspace. Merged, they're one table. Ordering is still by how we reach
the first hundred users: cheapest and most credible first.

| Channel | Workspace row | Role | Weekly hours (active push) |
|---|---|---|---|
| Founder-led / direct | social | First users come from conversations, not ads. The founder account is the studio's distribution. | 5 |
| Product-led | — | The product is the demo — live, shareable, value before signup. See Product-led loops. | Built into the product |
| Content, SEO & AI search | seo | Own the queries buyers type — into Google and into ChatGPT, Claude, Perplexity. Compounds slowly, then all at once. | 1.5 |
| Community | social / influencer | Show up where the ICP already gathers; useful before promotional. | 1.5 — shared line with Outbound |
| Outbound | outbound | Reach hand-raisers directly, on signals, not lists. B2B verticals only. | (the same 1.5, agent-assisted) |
| Influencer & UGC | influencer | Borrow trust from creators. Micro first; only for consumer products with a visual payoff. | 0 until a product earns it |
| Paid | paid-ads | Amplifies fit, doesn't create it. Gated hard — see Paid. | 0 until gates pass |
| GTM engineering | gtm-engineering | The agents and pipelines that run the rows above. Meta-channel; it buys hours back. | 1 |
| Strategy | strategy | This document, the Monday hour, the monthly review. | 1 |

The rows sum to ten. They have to — the weekly cadence at the end of this doc
is the same ten hours arranged by day. Community and Outbound share one line
because a push runs one of them, never both: outbound when the push is
vertical B2B, community when it's consumer or dev. Two views of one budget;
when they disagree in a given week, the cadence wins — days are real,
categories are accounting.

Channel discipline is a barbell: ~80% of hours on the one or two channels
that are working, ~20% on one experiment. Nothing in the mediocre middle.
And channels are classified by role before being judged — awareness,
conversion, or SEO-support. Directories build authority, not demand. A
newsletter mention converts but doesn't scale. Judging a channel against the
wrong role is how good channels get killed.

Everything funnels to owned ground. Social is rented, boards are rented,
marketplaces are rented. The email list and this site are owned. Every
rented-channel win should end with an email captured — and the owned list
has its own playbook below.

## Founder-led distribution

The single cheapest asset the studio has is a founder who ships and can say
so in public. On LinkedIn, personal accounts pull roughly 7x the reach of
company pages, and inbound from founder content converts to conversations at
multiples of cold outreach — vendor-reported numbers, directional rather than
audited, but the direction is unambiguous. This is a system, not a mood.

**Platform:** X first — the studio's products skew dev/indie/prosumer, and
that audience lives there. LinkedIn for the B2B verticals (Edena, DoorData),
where the buyer does not read X.

**The topic ladder.** 3–5 topics, held for 90 days, nothing published outside
them:

1. Building AI products as a studio of one — the technical problem, weekly.
2. The GTM build-in-public story — what's being tried, with numbers, weekly.
3. Agent-run operations — how the studio actually runs, 1–2x/week.
4. Category takes on AI products/tooling — occasional.

**Cadence:** 3–5 posts/week. Under three, the algorithm forgets you; over
five, quality drops. First signals in 3–6 weeks, real compounding in 12–18.
Anyone promising faster is overselling.

**The daily 45 minutes:**

- 15 min replying to builders in the niche — early replies to large accounts
  get outsized visibility.
- 15 min replying to people tweeting about the problems the products solve —
  these are warm leads, answered helpfully, no pitch.
- 15 min posting the day's update and answering every reply within the hour.

The ratio matters: ~60% engaging with others, 40% broadcasting. Screenshots
and demo GIFs run ~3x text; launch threads with video ~5x.

**The production pipeline.** Founder records 30–60 minutes of voice notes a
week. An agent drafts posts against a voice card — 5–7 verbatim exemplars of
the best past posts plus a do/don't list. Founder edits 15–20 minutes.
Automation queues. Net founder writing time: about an hour a week. Every
piece must carry at least one earned insight — something learned from
operating that a competitor wouldn't say. One specific earned insight per
week beats five generic posts per day.

**Power-law honesty:** the top 1% of posts will carry ~85% of total reach.
So — volume buys lottery tickets, 20% of effort goes into the few big swings,
and when something hits, double down immediately: follow-up post, thread,
series. A viral post is the most valuable signal you will ever get. Don't
post the hit and move on.

**Build-in-public, with eyes open.** It works when the buyers are builders —
true for Miror, RedMaester, LetSync. For Elianna or DoorData it's
entertainment, not GTM; those ICPs get reached in their own rooms. Build in
public is one rung on the ladder, not the religion.

**LinkedIn, where used — reach and the close.** The mechanics get reach:
personal profile only; PDF carousels for dwell time; hooks that state the
value up front; reply to every comment in the first 60 minutes; links in the
comments, never the body; track saves and DMs, not likes. The close needs
architecture on top:

- **Three content layers, all three posted.** Awareness (takes, contrarian
  reads — attention), authority (frameworks, breakdowns — "this person knows
  the space"), conversion (case studies, lead magnets, CTAs — "I should talk
  to them"). Most accounts post only the first layer and wonder why no calls
  get booked. Edena is the doc's LinkedIn-primary product; it runs all three.
- **The four-step DM sequence** when someone bites: deliver the promised
  thing immediately, no pitch → one genuine question ("what made this
  interesting to you?") → qualify through the conversation → only then offer
  the call. Saves and DMs are the diagnostic; this sequence is what turns
  them into pipeline.

## Product-led loops

"The product is the demo" is a fact, not a plan. The plan:

- **Every valuable output is shareable by default** — a link, an image, an
  artifact with the product's name quietly in the corner. The user's work
  does the advertising.
- **The referral ask fires at delight moments** — right after activation,
  right after a first win — never at signup. Two-sided incentive, both sides
  paid in credits (the pricing unit already exists), sized against what a
  paid acquisition would cost, not against gut feel.
- **GOAT Arena is the virality product and gets the full loop.** Match
  results render as shareable cards; the referral pays both sides in in-game
  currency at the moment of a win. And before building anything new: pull
  the acquisition source of the existing 10K players from PostHog. Whatever
  brought them is the proven channel — rebuild that loop deliberately
  instead of studying it admiringly.

## Community

This budget line exists only when the push's primary channel is community —
otherwise it's zero and the hours go to outbound. When it runs:

- **Join, don't host.** Chat groups work under ~50 active members; a solo
  founder's version is being useful in rooms that already exist, not
  moderating an empty Discord.
- **Pick subreddits by signal quality:** strict moderation, high engagement,
  narrow professional focus. That's also the pattern in AI-citation data, so
  community hours double-count as AEO hours.
- **Cadence:** 2 subreddits, 15–20 min/day, one structured data-backed post
  a week. Value first; products mentioned only inside genuine experience.
  Links, corporate tone, and vague advice are the three ways to die there —
  naive Reddit audience-building ends in bans about 80% of the time;
  answering specific questions is what survives.
- **Hebrew products: WhatsApp groups are the subreddits of Israel.**
  Balitut's room is the neighborhood group that already trades produce;
  Sanegor's is the freelancer and SMB groups. Same rule everywhere: useful
  before promotional.

## The launch motion

The five steps still hold:

1. **Narrow** — one ICP, one promise.
2. **Land** — a fast, honest landing page that states the promise and shows
   the product, not a marketing abstraction of it.
3. **Instrument** — PostHog from day one, wired from the studio's one event
   dictionary: object-action names (`signup_completed`,
   `activation_reached`, one north-star event per product) defined once in
   the scaffold and reused everywhere. That file is what makes "a launch
   should cost less each time" true for analytics — no launch re-argues
   event names.
4. **Talk** — the first users get talked to directly; their words become the
   next version of the copy.
5. **Double down** — find the one channel that returns more than it costs,
   then pour into it. Kill the rest.

What's changed: a launch is a season, not a day.

**The slow drip.** Post every small thing on the way — the login page
working, the first real output, the ugly first dashboard. Marketing should
sound like an EDM track: a steady beat with occasional drops, not
thirty-second rests and cymbal crashes. By launch day the audience and the
storytelling skill both exist. The all-eggs launch is high-risk, low-reward:
best case, two days of electricity for months of work.

**Launch sequence.** Soft-launch to the waitlist and the founder audience
first. Then two or three smaller boards weeks apart, each feeding signups
into the owned list: Uneed, Peerlist, Microlaunch; Dev Hunt for dev tools;
Fazier for the dofollow backlink that feeds the AEO consensus play; BetaList
while still pre-launch; Tiny Startups for its ~20K bootstrapper newsletter.
Plus the one launch channel that isn't a board: a genuine thread in the
niche subreddit where the customers already complain — it usually converts
best of all. Show HN and Product Hunt come last, once the product has
survived real users. One spike decays in 48 hours; three medium launches
compound. The strongest predictor of results on any platform is arriving
with an owned audience to seed the first hours.

**First customers are manual.** Find ~200 people who recently posted about
the problem. Short, sincere DMs offering free access for feedback. No
automation. First customers should arrive in days, not months. Also record
their calls — the objections from the first ten conversations become the
sales page after the first ten customers.

**Launch week checklist:**

- Messaging doc final; landing page passes the ten-second test.
- PostHog events firing from the studio event dictionary: signup,
      activation, the north-star.
- Email capture wired; welcome sequence loaded, first email lands
      immediately.
- Demo video cut (Remotion is in the stack; Remocn has free scenes).
- Comparison/alternative pages live — they earn from day one.
- Answer Hub page live (see SEO & AEO).
- Brand-facts page live, with its machine-readable twin at
      `/.well-known/brand-facts.json`.
- 200-person DM list built; drafts written.
- Board listings drafted; dates spaced weeks apart; niche-subreddit
      thread drafted.
- Launch thread drafted, with GIF or video.
- Kill criteria written down, with dates.

Every subsequent feature is a launch moment: major = full motion; medium =
email + in-app; minor = changelog. Never go quiet right when the product is
getting good.

### The owned list

Every rented win ends in an email captured. Here is what happens after,
because a list nothing happens to is a spreadsheet, not an asset:

- **Welcome sequence: 3–7 emails.** The first lands the moment they sign up
  and delivers the promised thing with no pitch. Then gate the second
  helping, not the first — the lead magnet is free; the follow-on depth is
  what earns the reply.
- **Onboarding sequence: 5–10 emails** for new customers — origin story,
  activation nudges, testimonials, the feature that predicts retention.
- **Win-back: 3–5 emails**, triggered by the credit meter going quiet.
- **The list is emailed on every launch and every major feature.** Each send
  seeds the next launch's first hours — the flywheel that makes launch three
  cheaper than launch one.
- One email, one job, one CTA. Relevance over volume.

## SEO & AEO — being the answer

The `seo` channel's blurb already says it: own the queries buyers type into
Google **and** into ChatGPT, Claude, and Perplexity. The game is no longer
"rank on page one." The game is "be the answer."

**The stage-gate objection, answered first.** One credible school says
$0–10K MRR means direct outreach, one landing page, a hundred customer
conversations — and no SEO. The conversations rule stands; the SEO ban
doesn't apply here, because it assumes SEO eats founder hours. This floor is
agent-run: the founder pays about ninety minutes a week and the agents pay
the rest. When compounding is nearly free, it starts on day one.

What the data says (a 700K-conversation citation study, plus controlled
tests):

- Optimize for **turn-1 queries** — "what is X," "best X for Y," "X vs Y."
  The opening question produces citations at ~4x the rate of deep-thread
  follow-ups.
- Answer engines pick sources by **consensus across independent sources** —
  reviews, Reddit, editorial roundups — not by backlinks alone. Our own site
  is one voice; the model wants third-party agreement.
- ChatGPT search leans on Bing: **87% of citations matched Bing's top
  results.** Bing Webmaster Tools is table stakes, not a curiosity.
- Citations come disproportionately from the **first third of a page**, and
  freshness visibly helps. Small sites can win.

The playbook, per product:

1. **Bottom-of-funnel pages on day one.** Comparison pages, "[competitor]
   alternative" pages, use-case pages. SEO takes time to compound — which is
   exactly why it starts early, not late. Honest comparisons only: name who
   each tool is best for, concede real strengths. Readers and models both
   verify.
2. **One Answer Hub per product** — `/guides/best-[category]-[year]`. A
   60–90-word neutral TL;DR up top, a ranked list including real competitors,
   a spec table, FAQs shaped like turn-1 queries, external citations. Models
   won't cite a product page, but they'll cite a guide that looks neutral —
   even on our own domain. In one documented ecom case this single page drove
   ~60% of AI citations.
3. **A brand-facts page, twice.** The human version: Wikipedia-style
   verifiable facts — founded, what it does, pricing, links to
   Crunchbase/GitHub/press. The machine version:
   `/.well-known/brand-facts.json` — name, category, price range, top
   features, a `lastUpdated` field kept current. An hour of work almost no
   brand ships, and a tiebreaker when a model chooses between similar
   products. Models recommend the brand they can verify.
4. **One free tool per pushed product.** A calculator, analyzer, or
   generator adjacent to the paid job — one thing, done well, valuable even
   without the product. Free tools rank easier than blog posts and earn the
   links that do the link-building; in a 13,000-page pSEO corpus, the free
   tools had the highest engagement of any page type. ROI gate before
   building: expected leads × lead value > build + maintenance cost. For a
   studio that ships product weekly the build cost rounds down, so the gate
   mostly filters ideas with no search volume. Gate the tool's output for
   email only when the value clearly covers the ask.
5. **Off-site consensus, the highest-ROI hour:** launch-board listings, a
   Crunchbase entry, authentic answers in 2 niche subreddits (the Community
   playbook above — same hours), one or two editorial placements. Seeded
   Reddit mentions produced a measured 3x jump in AI-citation rate in
   controlled tests — and reverted when the effort stopped. Zapier's GEO
   team treats Reddit as a volume play and ignores upvotes. Micro-YouTube
   counts too: one sponsored video with 835 views captured 5.9% of citation
   share in their data.
6. **Technical floor:** don't block GPTBot/ClaudeBot/PerplexityBot;
   server-render everything; index in Google and Bing; visible updated dates;
   schema (Organization, SoftwareApplication, FAQPage) for entity clarity —
   controlled tests show schema does **not** buy citations, so it gets an hour,
   not a week. `llms.txt` is a 20-minute hedge; expect nothing measurable.
7. **pSEO only over data we own.** Google's scaled-content crackdown killed
   template-spinning. What survives: pages backed by proprietary or
   product-derived data, generated against strict schemas, pruned hard. The
   test for every page: would it still be useful if search engines didn't
   exist? A hundred great pages beat ten thousand thin ones. Being the
   primary source of a number is the most durable citation magnet.
8. **The founder byline is AEO.** Answer engines increasingly cite named
   human experts. Publishing under a name builds a citable persona; a company
   page builds a logo.

**Rollout, four weeks per product:** week 1 — the intent-map audit: run ~50
real buyer questions across ChatGPT, Claude, Perplexity; log who gets
recommended and which sources get cited. Week 2 — Answer Hub live. Week 3 —
brand-facts page, `brand-facts.json`, the schema hour, Bing verification.
Week 4 — the citation campaign: boards, Crunchbase, subreddit presence,
review-site pitches; start the weekly loop. First AI-recommendation
appearances take 60–90 days; the prompt panel is the progress bar until then.

**The KPI is citation rate, not rankings.** A panel of ~20 buying-intent
prompts per product, run monthly across ChatGPT, Claude, Perplexity: how
often are we mentioned, and which sources get cited instead of us? Then go
earn placement in those exact sources. AI-referred visitors convert at
roughly 4x organic in published data — this channel is worth the 90 minutes
a week it costs to maintain.

## Outbound

For the vertical B2B products only — DoorData, Edena, Sanegor's SMB side.
Consumer products don't get cold email; they get content.

**The list is the strategy. The copy is secondary.** ColdIQ cut 40% of their
addressable market before sending a single email and reply rates went **up**.
Two hundred high-signal leads at a 3–5% reply beat ten thousand generic ones
at 0.5%.

Signals, ranked by warmth:

1. **Our own content engagers** — every Friday, mine the week's post
   engagement for ICP fits; email them about the topic, never the engagement
   itself. Prospects who saw the content 3+ times convert at 2–3x cold.
2. **Competitor 1-star reviewers** — G2/Trustpilot, last 90 days, contacted
   within 72 hours while they're still mad. The email is one line: "saw your
   review of [competitor]. we built [product] because of complaints like
   yours. want to see it?" Self-reported at 11.4% reply against a 0.3%
   baseline — the operators publishing these numbers are selling the play,
   so treat the multiple as directional. The logic holds without it: every
   1-star review is someone announcing they have budget, pain, and a
   shopping cart open.
3. **Public breakage** — the property manager with no reporting, the firm
   with a stale site. Lead with an artifact, not a pitch: a mini-analysis, a
   demo built on their own data. The prospect sees proof, not a promise.
4. **Job posts, funding, tool changes** — classic intent signals, enriched
   before writing a word.

**The five-line email** (a 40%+ reply rate is claimed for it; the structure
is the point): subject = the specific thing they did, so specific only one
person could have received it. One sentence proving attention → one sentence
why them → one sentence of outcome → a low-friction ask ("mind if I send a
2-min demo?") → first name. If it doesn't fit in five lines, the offer isn't
understood well enough. Follow-ups at day 3 and day 7; the best follow-up is
news — traction is the best follow-up you can send.

**Hygiene:** never send cold from the main domain. Separate sending domains,
warmed inboxes, verified addresses, volume capped at what one person can
answer personally. Agents research, enrich, and draft; a human sends. And the
compliance line is real — scraped-contact plays carry GDPR/CAN-SPAM exposure
that the growth-bro posts never mention. When in doubt, don't.

## Pricing & monetization

The principle already exists: avoid charging clearly for value and the cost
comes back as a worse product that punishes users. Pricing ships with v1,
not after.

Defaults for an AI product built here:

| Decision | Default | Why |
|---|---|---|
| Model | 2–3 tiers, each with a monthly credit allowance + top-up packs | Predictable floor for us, cost protection against heavy users. The 2026 consensus for AI products. |
| Credit unit | A user outcome — a review, a plan, a document. Never tokens. | Users buy outcomes. The exchange rate stays stable. |
| Margin math | Assume 50–60% gross margin, not SaaS's 80–90% | Every generation has COGS. Verify worst-case model cost per credit before setting the price. |
| Free tier | Credits sized to reach the aha moment at least once, visible meter | The meter is the upgrade prompt. Cap the spend, not the experience — we personally pay the inference bill for every free user. |
| Trial shape | Reverse trial: full access, then downgrade to the capped free tier | Benchmarks land it between freemium and paid-trial conversion. |
| Price point | Between the next-best alternative and the value created; cost is a floor, never a basis | Value-based, per the pricing axes: packaging × metric × point. |

Planning numbers, so targets stay honest: median free-to-paid is ~8%;
freemium runs 3–5%, no-card trials 5–10%, card-required trials convert
25–40% of far fewer signups. Most conversions happen by day 7 — time-to-value
is the pricing lever nobody prices.

**Lifetime deals** are launch fuel, never a business model — and on an AI
product, inference costs recur forever. If one runs: credit-capped, priced at
roughly 2x the annual plan, limited quantity, nothing "unlimited," LTD buyers
tracked as their own cohort. A discounted annual usually does the same job
with better economics.

**Raise prices when** prospects stop flinching, conversion runs hot, or real
new value shipped. Grandfather existing users or give a lock-in window.
Never naive A/B tests on visible prices — new-cohort tests only.

For anything sold as a service (Sanegor-style vertical work, agent setups):
price like a service, report like a product — setup fee plus retainer tied
to an outcome metric, live dashboard from day one. Sell the work, not the
tool; the seller of outcomes gets margin expansion every time the models
improve.

## GTM engineering — agents run the channels

The `gtm-engineering` row is the studio's honest edge: the same stack that
builds the products (Claude Code, Firecrawl, Apify, Browserbase, Remotion)
runs the marketing. The goal is not automation for its own sake — it's that
we don't run campaigns; we build the agents that run them.

The maturity ladder, used as a build order:

1. **Prompts** → 2. **Skills** (methodology as markdown, not one-liners) →
3. **Skills + a brand foundation file** → 4. **Agents running whole
workflows** → 5. **Agent teams with memory.**

Level 3 is the unlock most people skip: one file per product — voice,
always/never words, positioning, ICP pain language, the phrases that sound
like us versus AI slop — referenced by every skill. That file is why
automated output doesn't read as automated. The moat is taste; anyone can
set up agents.

Standing pipelines, in build order:

| Pipeline | What it does | Cadence |
|---|---|---|
| Ship-log → content | Turns commits and releases into drafted posts and changelog entries, in-voice, human-approved | Daily |
| Content atomizer | One weekly voice memo → posts, thread, newsletter section | Weekly |
| Search Console loop | Reads impression/click data across all posts, drafts improvements to pages already getting tested by Google | Monthly |
| Citation panel | Runs the ~20-prompt AEO panel, logs mention share and cited sources | Monthly |
| Signal watcher | f5bot for Reddit keywords, Google News RSS feeds (append `/rss` — free), review-site monitors | Continuous |
| Outbound research | Scrape → enrich → draft; human sends | Weekly, B2B pushes only |
| Experiment memory | Every hypothesis and result logged; new work pulls in what already failed | Always |

Engineering rules learned from people running this at scale:

- **Agents query warehouses, not rate-limited APIs.** Pipe ad/analytics data
  into a store the agent can query; save the API for write actions.
- **Decompose into scoped sub-agents.** Anthropic's own growth workflow runs
  a headline agent and a description agent separately because constraints
  differ; quality and debuggability both improve.
- **Teach → memory → skill → cron.** Onboard an agent like an employee:
  small task, corrections saved to memory, process converted to a skill,
  then a recurring job.
- **Hard human lines, written down:** agents never send email, never publish
  without approval, never price, never touch relationship-sensitive threads.
  Drafts only. The bias on anything ambiguous is toward the human.
- **Keep support human.** Base44's founder killed his own support bot after
  two weeks — reading tickets is how the earned insights that feed the
  content engine get earned. Customer contact is the moat, not a cost.
- **Third-party agent skills get audited before install.** The OpenClaw
  ecosystem is useful and contaminated in equal measure; our own notes
  record hundreds of malicious skills found on its marketplace. Run nothing
  with credentials it doesn't need.

Budget honestly: the whole stack should cost less than a part-time
contractor. When an always-on agent bill starts resembling a salary, it gets
the same scrutiny a salary would.

## Conversion

The landing page and onboarding are GTM surfaces, audited in impact order:
value-prop clarity → headline → CTA → hierarchy → trust → objections →
friction.

- Most landing pages are ~3x too long, and simple layouts are trusted more.
  Cut, then cut again.
- CTA copy states value, not action. Never "Submit."
- Social proof sits next to the CTA, not in a ghost-town logo row.
- Every signup field has a cost; value shown must exceed effort asked.
  Email or OAuth is usually enough. Ask role/use-case **after** signup.
- Activation is defined empirically — the earliest action separating
  retained users from churned — then everything between signup and that
  action gets deleted. One goal per first session. Aha inside the first
  minute where the product allows it.
- Paywalls trigger at demonstrated value — usage limit hit, trial ending —
  and always leave an escape hatch. The credit meter does most of this work.
- Ask for the testimonial right after the first win. A user who gives one
  converts psychologically from customer to champion. Lower the barrier to
  the first yes; inertia and good service do the rest.

## Paid

Paid amplifies fit; it doesn't create it. The gates, in order, all required:

1. Organic conversion proven — some channel already returns users who
   activate and stick.
2. Content system producing pieces that demonstrably work organically —
   paid needs ammunition, not ideas.
3. Onboarding converts — a leaky funnel amplified is a bigger leak.
4. Max CAC computed from real LTV before the first shekel of spend.

When the gates pass:

- **Creative is the variable.** Kill and replace ads; don't fiddle campaign
  settings. Native-feeling beats polished. Ten variants of a winner beat ten
  new concepts. Scale budget ~30% every few days, not overnight.
- **Mechanical rules an agent can enforce:** frequency > 3.5 means the
  audience is cooked; CPA > 2.5x target for 48 hours means pause. The human
  reads a 90-second morning brief and replies "approved."
- **Land paid traffic on intent-matched pages** — theme pages, honest
  listicles, comparison pages — not the homepage. Ad-to-page congruence
  throughout.
- Small experiments, hard stop-losses, and the experiment log remembers
  every burn so it isn't repeated.

## What we measure

Vanity metrics are ignored. The scoreboard is short:

- **Activation** — did a new user reach the aha moment?
- **Retention** — do they come back without being pulled?
- **One north-star per product** — the single number that means it's working.

Diagnostics under the scoreboard, per channel — each row carries a pass/fail
line, because "returns less than it costs" needs a number when the cost is
hours:

| Channel | Diagnostic | Pass / fail |
|---|---|---|
| Founder-led | Saves, DMs, ICP-fit replies — not likes or follower count | First ICP-fit signals by week 6; 2–5K followers by month 4–6 of a sustained push, the base that yields 300–800 launch-day signups. Silence past week 6 → change topics, not cadence. |
| SEO/AEO | Citation rate on the prompt panel; impressions before clicks | Mentioned on ≥1 of the 20 panel prompts by day 90; impressions rising month over month. Zero at day 90 → the off-site consensus layer is missing; fix that before touching pages. |
| Outbound | Reply rate by segment; time-to-reply on our side | ≥3% reply on a high-signal list. Under 1% after 4 weeks → the list is wrong, not the copy. |
| Launch | Email captures per board; day-7 retention of each cohort | Free-to-paid tracking toward the ~8% median (≥5% by day 30 keeps the push alive). A board whose cohort shows no day-7 retention doesn't get the next product. |
| Paid | CAC vs. the pre-computed max | CAC ≤ max or spend stops; CPA > 2.5x target for 48 hours pauses automatically. Nothing else matters until this holds. |

Kill criteria are written before launch, dated, and honored:

- No activations from the first 200 direct conversations → the positioning
  is wrong or the pain isn't a painkiller. Reposition once, then shelve.
- A channel that misses its pass line after a fair test (12 weeks for
  content, 4 for outbound, 2 for paid) → killed without sentiment.
- The founder dreading the product's work for a month → shelve it. Personal
  runway of excitement is a real resource; the principles say so.

Everything else is a diagnostic, not a goal.

## The weekly cadence

GTM is a standing job with a fixed budget: ten focused hours a week, agents
doing the middle work — the same ten hours the channel table allocates,
arranged by day. One goal per week — positioning, traffic, or conversion —
never all three.

| Day | Block | Work |
|---|---|---|
| Daily | 45 min | The X routine: reply, engage, post. Non-negotiable during a push. |
| Mon | 1 hr | Strategy hour: read the weekend's numbers, pick the week's one goal, approve the agents' queued drafts. |
| Tue | 1 hr | The week's power-law content swing — the one piece that gets real effort. |
| Wed | 1 hr | The shared channel line: outreach batch for a B2B push, community work for a consumer one, board listing in launch weeks. |
| Thu | 1 hr | Talk to users. At least two real conversations. Transcripts feed the copy and the content engine. |
| Fri | 1.5 hr | AEO loop: run panel prompts, refresh the Answer Hub, one new FAQ or comparison page. Mine the week's engagers into Monday's outbound list. |
| Weekly | 30 min | Voice memo for the atomizer. |
| Monthly | 2 hr | Citation panel review, Search Console loop, experiment log review, kill-criteria check, push-score re-run if a cycle ended. |

Monday morning, concretely: open PostHog, open the GTM workspace, read what
the agents queued overnight, pick the one goal, say go. Which product? The
one the push rubric named — currently Miror.

## What we don't do

The anti-patterns list, kept short and enforced:

- No channel spread. One channel won before a second is opened.
- No generic AI content mill. One earned insight beats five average posts.
- No paid before the gates. No exceptions for impatience.
- No delegated voice. Agents draft; the founder's judgment ships.
- No big-bang launches. The drip is the launch.
- No "unlimited" anything on an AI product.
- No hosting communities we should be joining.
- No building the tool before the manual work has taught us what to
  automate. Run the work by hand until the work tells you what to automate.
- No new product pushes while the current push has unspent kill-criteria
  runway.

The premise, restated as the close: building got easy, distribution didn't.
The studio's compounding assets are the founder's audience, the owned list,
the citation footprint, the experiment memory, and the taste encoded in the
skills. Every week those five either grow or they don't. That's the
scoreboard behind the scoreboard.

---

## Sources

Claims above trace to: the marketing-skills playbook modules (positioning,
CRO, pricing, launch, free tools, referral loops, email sequences,
analytics); Profound's 700K-conversation citation study; Seer's
SearchGPT/Bing match analysis; ZipTie's source-selection study; SE Ranking's
llms.txt null result; the Ahrefs and Otterly schema tests; StartupCookie's
founder-led content playbook; Teract's indie X guide; Catalin Fetean's
founder-led marketing playbook; Fortune's Base44 reporting; the ColdIQ
allbound threads; and practitioner threads from @DanKulkov, @skeptrune,
@Shadabshs, @MichLieben, @zodchiii, @LoganTGott, @paolo_scales,
@codyschneiderxx, @scaling_shields, @adriannalakatos, @aryanXmahajan,
@jakezward, @Nate_Google_, @denohawari, @AndrewWarner, @maubaron, @GRITCULT,
@shannholmberg, @itsalexvacca, @TheMattBerman, @blvckledge, @arunidesign,
@Som_Mohapatra, @scott_bair, @abhisheknaironx, @jimprosser, @kapish_dima.

Calibration note, applied throughout: vendor- and operator-reported
conversion numbers (reply rates, reach multiples, revenue claims) are
directional, not audited. Where a number gates a decision here, the decision
survives the number being half as good.
