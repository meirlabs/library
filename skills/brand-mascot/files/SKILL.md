---
name: brand-mascot
description: Create a branded mascot for a product and keep it visually consistent across an entire ad or content campaign. Runs one of two arcs — invent a mascot from scratch (discovery, character brief, anchor kit) or wrap a consistency system around existing mascot art — then generates on-brand campaign images by conditioning every render on an actual reference PNG, composites real text over the art in HTML/Chromium, and renders each platform format natively. Use when the user says "create a mascot", "brand character", "design a mascot", "mascot kit", "keep the mascot consistent", "character consistency", "consistent character across images", "brand campaign images", "on-brand illustrations", or "make my mascot do X".
---

# Brand Mascot — create a mascot and hold it consistent across a campaign

Turns a product into a recognizable mascot and then generates a whole campaign's
worth of on-brand images of that mascot without the character drifting between
renders. The whole system rests on one mechanism: **identity lives in an attached
reference image, never in prose.** Every generation call passes an actual PNG of
the mascot as the first `inlineData` part and tells the model, in a short fixed
line, to keep that character exactly consistent and only re-pose it. Text that
re-describes the character's appearance is the #1 cause of drift — so we never do it.

**Read the four reference files before generating anything. They are the contract,
not background reading:**

- `references/prompt-patterns.md` — the exact reference-conditioning request shape
  (image part first, text part second) and the fixed consistency line. Copy it verbatim.
- `references/style-contract-template.md` — the `BRAND_STYLE` contract to fill in per
  brand, with the WHY behind every hard-negative guardrail (each one prevented an
  observed failure).
- `references/format-matrix.md` — the format render table (7 platform sizes with dims, plus
  the source art = 8 artifacts per piece) and the letterboxing gotcha that must be fixed in
  the compositor.
- `references/pitfalls.md` — the documented failure log. Read it before the first render
  so you design against these, not into them.

Everything here was extracted from a campaign that shipped: the soclever "Lottie"
mascot pipeline, built as three pieces — a generator that renders the art, a concepts
file that holds the campaign's scene list, and a compositor that lays real text over
each render. That three-file split is the shape §3 describes, and it is worth keeping.
This skill is self-contained; you do not need that codebase to run it.

## 0. Prep — pick the entry point

Ask, with AskUserQuestion (batched), which arc this is:

- **Entry A — no mascot yet.** The brand has no character. Do §A1 → §A2 → §A3, then §1–§4.
- **Entry B — mascot art exists.** There's already a mascot (a logo character, an existing
  illustration, a prior kit). Skip to §B1, then §1–§4.

Also gather up front, whichever arc: the brand's color tokens (hex), the campaign's
surfaces (which platforms/formats — see `references/format-matrix.md`), and the image API
key (`GEMINI_API_KEY`; see §3 for the env pattern).

---

## Entry A — invent the mascot

### A1. Discovery — AskUserQuestion, batched

Ask these together (up to 4 per call, let the owner arrow between them). Never invent the
answers; a mascot chosen without them drifts toward a generic stock character.

1. **Brand personality** — 3-5 adjectives (e.g. patient, playful, precise). These become
   the mascot's default expression and the campaign's emotional baseline.
2. **Audience** — who sees these images, and what should the mascot make them feel
   (reassured? challenged? amused?).
3. **Product metaphor** — what does the product *do*, reduced to one concrete image? The
   mascot usually embodies or accompanies that metaphor.
4. **Species / character candidates** — animal, creature, object, or abstract form? Offer
   2-3 candidates that fit the personality and let the owner pick or redirect. Favor a
   silhouette that stays recognizable at thumbnail size and has one or two signature
   features (a color, a shape) that carry identity.

### A2. Character design brief — get it approved before generating

Write a short brief (not code) and get an explicit yes:

- **Species + signature features** — the 1-2 non-negotiable identity markers (Lottie: a
  peach-gold axolotl with feathery gill-plumes). These are what the reference image must
  lock and what `BRAND_STYLE` must protect from recoloring.
- **Signature palette** — the mascot's own colors, stated as hex, **separate from and
  allowed to differ from** the brand palette. This separation matters: the brand wash can
  be blue/teal while the mascot stays warm gold — and the contract must forbid the model
  from blending one into the other (see pitfall 1).
- **Default expression + proportions** — the resting pose the front anchor will hold.
- **Persona modes (optional)** — "hats" the same character wears for different campaign
  registers (coach, professor, scout, spark). Decide these now; they become mode variants
  in the kit and per-use-case reference choices later (§2).

### A3. Generate the anchor reference kit — reference-conditioned iteration

This is the bootstrap. The **first acceptable render becomes the anchor**, and every
subsequent kit image is generated FROM that anchor as an `inlineData` reference — so the
kit is internally consistent by construction, not by re-describing the character each time.

1. **Seed render.** Generate the front-facing mascot from a text description (this is the
   *only* time appearance is described in prose — you have no reference yet). Generate
   against a plain solid background (a magenta/chroma key if you'll cut it to transparent
   later). Iterate the text until one render matches the A2 brief. **That render is the
   anchor.** Save it (`anchor-front.png`).
2. **Every other kit image conditions on the anchor.** Now switch to the
   reference-conditioned request shape from `references/prompt-patterns.md`: attach
   `anchor-front.png` as the first part, and in text ask ONLY for the new angle/mood/mode —
   never re-describe the character. Generate:
   - **Angle anchors** — three-quarter-left, three-quarter-right, profile, full-body.
     (These exist so downstream calls have a clean angle to condition on, not for direct
     campaign use.)
   - **Mood set** — one render per emotional register the campaign needs (encouraging,
     focused, playful, oops, wistful, etc.). Match this list to the campaign's tones.
   - **Persona/mode variants** — one per "hat" decided in A2.
   - **Accessories (optional)** — standalone overlay props (spectacles, cap, headphones)
     if the campaign reuses them across moods.
3. **One state change per call.** Never combine pose + accessory + mood in a single
   generation — it multiplies drift. Change one thing, condition on the anchor, accept, move on.
4. **Human-judge each round.** Lay the batch out as a contact sheet and accept only renders
   that hold identity against the anchor. Accepted files become the kit. If you'll use them
   on colored backgrounds, chroma-key the accepted renders to transparent RGBA (keep the raw
   renders untouched alongside).

Kit output: `anchor-{front,34l,34r,profile,full}.png`, `mood-{...}.png`,
`mode-{...}.png`, optional `acc-{...}.png`, plus a transparent-cut copy of each for
overlay use. This kit is now the reference library §2 draws from.

---

## Entry B — mascot art already exists

### B1. Build the consistency system around the existing art

1. **Confirm the anchor.** Get the cleanest existing front-facing image of the mascot.
   That becomes `anchor-front.png` — the primary identity reference. If the only art is a
   logo tile or a busy scene, generate a clean front anchor FROM it using the
   reference-conditioned shape (§prompt-patterns), then treat that as the anchor.
   If that source art has a baked-in background and you will overlay the mascot on
   colored surfaces, also cut a transparent-RGBA version (§A3 step 4) — a tile
   pasted onto an ad reads as a sticker, not a character.
2. **Fill gaps in the kit.** If the campaign needs moods/modes/angles the existing art
   doesn't have, generate them from the anchor exactly as in §A3 step 2 (one change per
   call, condition on the anchor, human-judge). Skip any the existing art already covers.
3. **Write the `BRAND_STYLE` contract** for this brand from
   `references/style-contract-template.md` — fill in the brand palette, the mascot's own
   signature colors, and any brand-specific guardrails. This contract is prepended to
   every campaign prompt.
4. Continue to §1.

---

## 1. Write the per-piece concept briefs

For each campaign image, write a concept with three parts (keep them as data — a config
object or a list — so copy edits never trigger a re-render):

- **Composition metaphor** — a concrete visual object/scene standing in for the idea.
- **Emotional register** — the feel the scene must land, stated independently of the metaphor.
- **Concept-specific guardrail list** — an "avoid" list of clichéd, harmful, or
  over-promising visuals unique to this piece (e.g. a discouraged-learner piece bans crying
  children and failing grades). This repeats the brand-wide no-face / no-text rules on purpose
  — belt-and-suspenders beats trusting the shared preamble alone.
- **`mascotRef`** — which kit image (§2) this piece conditions on.
- **Overlay copy** — headline / CTA / wordmark as plain text fields. This is composited later
  as real HTML (§4), never generated into the art.

## 2. Select a reference per piece — controlled variation, not drift

Assign each piece exactly one `mascotRef` from the kit, matched to that piece's emotional
register: a supportive piece points at the coach/encouraging mood, a mastery piece at the
professor mode, a neutral piece falls back to a plain front or three-quarter anchor.

Why this is variation and not drift: every render is still conditioned on a kit image whose
identity was already locked against the anchor. What differs between pieces is only the
starting pose/expression the model re-poses from — a curated, pre-approved set — not the
character's identity. Drift is the opposite: a *new, unreferenced* image where the model's
own defaults creep in. Picking a different mood sprite is a creative choice; generating with
no reference is the failure mode.

## 3. Generate the illustrations — reference-conditioned, zero text

Use the exact request shape in `references/prompt-patterns.md`. Per piece:

- Prompt = `[BRAND_STYLE, "Composition brief: <metaphor>", "Mascot: <pose>. Keep the
  mascot's identity (colors, face, proportions) EXACTLY consistent with the attached
  reference image — it is the same character, just re-posed."]` joined by blank lines.
- Request body: `inlineData` PNG part FIRST, `text` part second. Never re-describe the
  mascot's colors/proportions in the text — the attached pixels carry that.
- **Zero text in the art.** `BRAND_STYLE` forbids all words/letters/numbers/labels; the art
  is a pure image layer for §4 to composite over.

Working model default (swappable — this is the model slot, not a hard dependency):

```
Model:    gemini-3.1-flash-image-preview   (AI Studio REST, plain fetch — no SDK needed)
Endpoint: https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}
Config:   generationConfig = { responseModalities: ['IMAGE'], imageConfig: { imageSize: '1K' } }
Key:      GEMINI_API_KEY || GOOGLE_GENERATIVE_AI_API_KEY || GOOGLE_API_KEY  (from env, never hardcoded)
Cost:     ~$0.067 / image observed at 1K (verify current pricing; override the estimate if the rate moves)
```

Retry is coarse and human-in-the-loop: regenerate one piece at a time (~2 tries) if the art
comes back off-brief (wrong mascot look, a human face, chaotic composition), tweak the prompt,
retry. Write retry variants to a side path so you don't clobber an accepted render before QA.

## 4. Composite text over the art — HTML/Chromium, native per format

Never bake text into the generated image (models render melty/garbled type; see pitfall 2).
Composite all copy afterward as real HTML/CSS text screenshotted via headless Chromium.

- **Render each platform format natively at its exact pixel viewport** — do NOT crop or
  resize one canonical image to hit each platform. Formats that share a layout still get their
  own render. Use the table in `references/format-matrix.md` as the starting matrix.
- **Pin square art to a 1:1 card (the letterboxing gotcha).** Square source art dropped into a
  non-square format's flex box stretches and leaves white gutter bands. Give every
  illustration card an explicit `aspect-ratio: 1 / 1` and center it — `object-fit: contain`
  alone does NOT fix this (it shapes the image, not the box). Full detail in
  `references/format-matrix.md`.
- **Use a transparent-background mark for the logo**, never the app-icon tile — a tile's baked
  background reads as a sticker on a colored card (pitfall 4). Keep both asset variants.
- Editing overlay copy is a pure data change re-run through the compositor only — it never
  triggers a new (paid, slow) image generation.

## 5. QA — ONE pass at the end

After a full generation + composite pass, review the whole set together (a contact sheet):

- Identity holds across every piece (gill/signature color intact, not recolored toward the
  scene; proportions consistent; same character everywhere).
- Zero legible text anywhere in the *art* layer; all real copy is the crisp HTML overlay.
- No human faces (unless the brand explicitly wants them); no clipped mascot/hero prop.
- Each format is laid out correctly for its own canvas — no letterbox bands, no off-center text.

Regenerate only the pieces that fail, one at a time. Do not re-run the whole batch to fix one.

## 6. Ship + record

Deliver the kit + the per-format renders. If this is a meirlabs client/campaign, surface the
deliverable where the owner operates (per the project's deliverable rule — a browsable
admin/gallery view, not a loose folder), and note the model + observed per-image cost so the
spend is honest.
