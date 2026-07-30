# Pitfalls log

Every failure mode below is a documented, observed problem from a shipped pipeline — not a
hypothetical. Read this before the first render so you design against these.

## 1. Signature-color recoloring toward the scene's accent

**Symptom:** the mascot's signature colors (e.g. warm gold/peach gill-fronds) drift toward a
scene's own accent color. When a piece uses a single warm accent as its pop color, the model
pulls the mascot into that same warm-red family so it "matches" — destroying the character's
identity color.

**Also:** the model shrinks the mascot by simplifying/distorting its proportions rather than
rendering it literally smaller.

**Fix:** the never-recolor / scale-down clause in `BRAND_STYLE` (style-contract-template.md
clause 8), verbatim: *"…must stay the mascot's natural <colors> exactly as in the reference
image — NEVER recolored to match the scene palette. If the mascot needs to appear smaller in
the frame, scale it down; never recolor it."* Colors are fixed to the reference; smaller means
literally smaller. Keep a parallel color-containment rule for any accent that belongs to only
one part of the mascot (e.g. "green appears ONLY on the graduation cap, nowhere else").

## 2. Melty / garbled AI text

**Symptom:** any text requested in the generated art comes back as illegible, corrupted glyphs.
Image models cannot reliably render legible typography.

**Fix:** architectural, not prompt-tuning. Never request text in the art at all — `BRAND_STYLE`
clause 4 forbids all words/letters/numbers/labels; every per-piece guardrail repeats it for that
piece's specific props (a fake report card's every mark is "a wavy abstract squiggle… this rule
has ZERO exceptions"). All real copy is composited afterward as HTML text (format-matrix.md).
Do not try to prompt the model into legible type — you will lose.

## 3. Letterboxing — square art in a non-square card

**Symptom:** white gutter bands above/below (or left/right of) the artwork in non-square
formats. Caused by letting a square `illustration.png`'s card stretch to fill a non-square flex
box; the contained `<img>` then shrinks and leaves gutters.

**Fix:** pin every illustration card to `aspect-ratio: 1 / 1; align-self: center; width: auto;
min-height: 0;` in every layout template. `object-fit: contain` alone does not fix it. Full
detail in format-matrix.md.

## 4. App-icon tile pasted as a logo reads as a sticker

**Symptom:** the brand logo looks like a sticker slapped onto the ad card rather than an
integrated mark. Caused by using the app's normal logo asset — an app-icon-style tile with its
own background square baked in (meant for home screen / favicon) — directly on the card's
colored gradient. The baked-in tile background reads as a foreign rectangle.

**Fix:** keep two logo asset variants. Use the **transparent-background cutout mark** for any
composited/overlay context (ad cards, images on colored backgrounds); reserve the **boxed/tile
logo** for contexts that actually want a contained icon (app icon, favicon). A single logo
asset is not enough once the mark has to sit on arbitrary backgrounds.

## 5. Drift from generating without a reference at all

**Symptom:** a subtly-different-looking mascot each time — wrong proportions, off palette, a
face the character never had. Caused by generating from a text description with no reference
image attached, so the model re-derives the character from prose and its own defaults creep in.

**Fix:** always attach a reference PNG as the first `inlineData` part and never re-describe the
character's appearance in text (prompt-patterns.md). The only prose-appearance moment allowed is
the very first seed render in Entry A, before any reference exists; after that the door closes.

## 6. Content-safety / compliance failures (the reason per-piece guardrails exist)

**Symptom:** the art implies something it must not — a human face reading as endorsement or
medical/diagnostic authority; legible "data" on a fake report a viewer could mistake for real
guidance; a real news logo or partisan color-coding reading as political bias; a third-party
trademark; a "hired!" image implying an outcome guarantee.

**Fix:** the same illustration-brief + `BRAND_STYLE` + reference mechanism enforces these, not
just visual consistency. Each piece's guardrail list bans the specific harmful/over-promising
shorthand for its subject; the brand-wide no-face and no-legible-text rules are repeated per
piece. Run a pre-launch compliance pass over the whole set against these lists before shipping.

## 7. Over-combining changes in one call

**Symptom:** identity drift when a single generation asks for a new pose AND a new accessory AND
a new mood at once. Each extra changed variable is a fresh chance for the model to invent.

**Fix:** one state change per call. Condition on the anchor (or nearest accepted sprite), change
exactly one thing, accept, then chain the next change off the accepted result.
