# BRAND_STYLE contract template

`BRAND_STYLE` is a single string prepended to **every** campaign piece's prompt. It is the
shared, non-negotiable visual foundation every concept sits on top of. Fill in the
`<BRACKETED>` slots per brand. Every clause below earned its place by preventing an observed
failure — do not trim the guardrails to make the string shorter.

## Named principle: NEVER-RECOLOR / SCALE-DOWN

The single most battle-tested rule in the whole contract. The model will try to blend the
mascot's signature colors into the scene's palette (e.g. pull warm gold gill-fronds toward a
scene's red accent), and will try to "shrink" the mascot by simplifying/distorting its
proportions rather than rendering it literally smaller. Both are forbidden by name:

> The mascot's signature colors and body must stay EXACTLY as in the reference image — NEVER
> recolored to match the scene palette. If the mascot needs to appear smaller in the frame,
> scale it down; never recolor it and never distort its proportions.

Keep this clause verbatim in every brand's contract. It is clause 8 below.

## Fill-in template

```js
export const BRAND_STYLE = [
  // 1. RENDERING STYLE — pins one visual family across all pieces.
  'Clean, modern <STYLE, e.g. flat-vector> illustration in a <BRAND ADJECTIVES> style — ' +
    'soft shapes, clear silhouettes, no photographic or 3D-render texture.',

  // 2. PALETTE — locks scene/prop colors to the brand's real tokens.
  "Palette strictly in <BRAND>'s <COLOR FAMILY> range (e.g. <#HEX1> and <#HEX2> tones) plus " +
    'white and warm neutral highlights — no unrelated hues.',

  // 3. COMPOSITION FOR SMALL SIZE — pre-optimizes for thumbnail consumption.
  'Generous whitespace around every element; calm, organized, uncluttered composition that ' +
    'reads instantly at small size.',

  // 4. ZERO TEXT — keeps the art a pure image layer for HTML compositing.
  'ABSOLUTELY NO text, words, letters, numbers, labels, captions, signage, or speech bubbles ' +
    'anywhere in the image — represent ideas with shapes and icons only.',

  // 5. NO HUMAN FACES — mascot is the sole identity carrier (brand + compliance).
  'NO real human figures, faces, or photographic people anywhere — the only "face" in the ' +
    'image is the <MASCOT SPECIES> mascot supplied as the reference image.',

  // 6. SOFT PADDING — pre-empts edge-cropping when force-fit into non-square formats.
  'Keep the whole scene comfortably inside the center of the frame with soft padding on every ' +
    'edge (the image will be shown inside a contained card, not cropped).',

  // 7. SQUARE + PLAIN BACKGROUND — one source image reuses across all formats.
  'Square composition, plain soft-gradient or white background behind the scene.',

  // 8. NEVER-RECOLOR / SCALE-DOWN — the named principle above. Keep verbatim.
  "Mascot <SIGNATURE FEATURE, e.g. gill fronds> and body must stay the mascot's natural " +
    '<SIGNATURE COLORS, e.g. warm gold/peach/orange> exactly as in the reference image — ' +
    'NEVER recolored to match the scene palette. If the mascot needs to appear smaller in the ' +
    'frame, scale it down; never recolor it and never distort its proportions.',
].join(' ');
```

## Why each clause exists — the failure it prevents

1. **Rendering style** — prevents stylistic drift between pieces (one card painterly, another
   photoreal). Pins all outputs to one family.
2. **Palette lock** — prevents off-brand color choices (the model defaulting to a warm sunset
   background, or accents that clash with the brand wash the compositor adds later).
3. **Whitespace / small-size** — prevents cluttered compositions that turn to mush once scaled
   to a feed-ad thumbnail. Optimizes for how the image is actually consumed.
4. **Zero text** — prevents the single most visible AI-image failure: melty/garbled type.
   Image models cannot reliably render legible typography, so the fix is *architectural* (never
   ask for text at all), not prompt-tuning (asking harder for legible text). All copy is
   composited later as real HTML.
5. **No human faces** — keeps the mascot as the sole face/identity carrier (brand voice) and
   avoids depicting a face that reads as endorsement, diagnosis, or authority (a compliance
   concern in sensitive verticals — medical, financial, political).
6. **Soft padding** — pre-empts important elements (mascot, hero prop) getting clipped when the
   square source is later force-fit into a non-square format.
7. **Square + plain background** — standardizes the source aspect ratio and background so one
   `illustration.png` reuses across every platform format via a contained card; no per-platform
   re-crop of the source.
8. **Never-recolor / scale-down** — the observed, battle-tested one. The model blended the
   mascot's signature colors toward the scene's accent, and shrank it by distorting proportions.
   This clause forecloses both: colors are fixed to the reference; smaller means literally
   smaller, never simplified or recolored.

## Per-piece guardrail lists (in addition to BRAND_STYLE)

Each concept also carries its own "avoid" list for the clichéd/harmful/over-promising visuals
specific to its subject — and independently repeats the no-face and no-text rules
(belt-and-suspenders, not redundancy to trim). Examples of the pattern:

- discouraged-learner piece: no crying/slumped figure, no red ink, no F grades, no failing
  report cards, no cliff-edge/summit imagery, no upward grade graph.
- business/revenue piece: no cash, coins, dollar signs, or trophies.
- medical piece: no doctors, white coats, stethoscopes, or alarming red readouts; any
  "data" on a fake report is illegible squiggle, never real numbers.
- news/politics piece: no real outlet logos, no red-vs-blue partisan framing, no
  conspiratorial visual language.
- trademark-adjacent piece: no third-party product logos or brand marks.
- outcome-claim piece (jobs, results): no "hired!"/handshake imagery that implies a guarantee.

Write the equivalent list for each of your campaign's pieces. The list is where brand-safety
and legal-caution constraints get enforced through the same mechanism as visual consistency.
