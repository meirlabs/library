# Format matrix + HTML/Chromium compositing

All copy is composited over the art as **real HTML/CSS text screenshotted via headless
Chromium** — never generated into the image. This buys three things:

1. **Crisp type at any size, any language** — a real webfont rendered by Chromium is
   pixel-perfect; AI-generated type is melty/garbled.
2. **Per-format re-layout from one source image** — the same `illustration.png` drives every
   platform format, each with its own HTML template laid out for its aspect ratio.
3. **Copy edits without regeneration** — changing a headline is a data change re-run through
   the compositor only; it never triggers a new (paid, slow, model-variance-prone) image call.

## The format matrix (starting table)

Render each format **natively at its exact pixel viewport** — one full Chromium page render per
format. Do NOT render one canonical image and crop/resize it to hit each platform: formats that
look alike differ by a handful of pixels in height, and a crop would clip the illustration or
the text column differently per platform. Several formats share a *layout template* but each
gets its own render.

| Format key   | Output file                  | Dimensions | Aspect   | Layout template | Platform                          |
|--------------|------------------------------|------------|----------|-----------------|-----------------------------------|
| `square`     | `square-1080.png`            | 1080×1080  | 1:1      | squareHtml      | Meta / Reddit                     |
| `portrait`   | `portrait-1080x1350.png`     | 1080×1350  | 4:5      | portraitHtml    | Instagram / Stories feed          |
| `landscape`  | `landscape-1200x628.png`     | 1200×628   | 1.91:1   | landscapeHtml   | link-card / Google Demand-Gen     |
| `story`      | `story-1080x1920.png`        | 1080×1920  | 9:16     | storyHtml       | Stories / Reels full-screen       |
| `linkedin`   | `linkedin-1200x627.png`      | 1200×627   | ~1.91:1  | landscapeHtml   | LinkedIn link card                |
| `x`          | `x-1200x675.png`             | 1200×675   | 16:9     | landscapeHtml   | X (Twitter) link card             |
| `googleSquare`| `google-square-1200x1200.png`| 1200×1200 | 1:1      | squareHtml      | Google Display / Demand-Gen square|

That's 7 platform renders; counting the source `illustration.png` (the no-text art) as the
eighth artifact per piece gets you the "8 outputs" framing. Trim or extend the table to the
campaign's actual surfaces — it's a starting matrix, not a fixed set.

Four layout templates cover all seven formats:
- `squareHtml` — image + text stacked vertically, 1:1.
- `portraitHtml` — stacked, taller.
- `landscapeHtml` — image and text side-by-side (flex row); shared by landscape/linkedin/x.
- `storyHtml` — a **purpose-built** 9:16 layout, deliberately NOT a crop of the square: art
  centered at a comfortable size with the brand gradient carrying the tall dead space, so
  nothing letterboxes and the headline clears the platform's own top/bottom UI overlays.

Each format renders at its own viewport, e.g.:

```js
const page = await browser.newPage({ viewport: { width: format.width, height: format.height } });
```

## The letterboxing gotcha — pin square art to a 1:1 card

**The bug:** the source `illustration.png` is always square (BRAND_STYLE clause 7), but most
formats are not. If the illustration's card element is given `flex: 1` inside a non-square flex
container (its natural CSS behavior), it stretches to whatever box the flex hands it — a
non-square box — and the `<img>` inside (set to `object-fit: contain`) then shrinks to fit,
leaving visible white gutter bands above/below or left/right of the art.

**The fix:** pin every illustration card to a 1:1 aspect ratio and center it, so the card stays
square regardless of the outer format and the art fills it edge-to-edge:

```css
/* Applied to the .illustration-card in EVERY layout template, not just the square one. */
aspect-ratio: 1 / 1;
align-self: center;
width: auto;
min-height: 0;
```

**The general lesson:** whenever square (or any fixed-ratio) generated art is composited into a
non-square container, the container needs an explicit `aspect-ratio` pin. `object-fit: contain`
alone does NOT fix this — it controls how the image fits its box, not how the box itself is
shaped.

## Logo asset: transparent mark, never the app-icon tile

Use a **transparent-background** brand mark for any overlay/composited context (ad cards). Do
NOT use the app-icon-style logo tile — its baked-in background square reads as a sticker slapped
onto the card's colored gradient, not an integrated mark. Keep **both** asset variants in the
brand kit: a boxed/tile logo (for favicon, app icon, home-screen contexts) and a transparent
cutout mark (for everything composited onto arbitrary backgrounds). Picking the wrong one for a
surface is what produces the sticker artifact (see pitfalls.md #4).

## Headless Chromium without a new dependency (optional convenience)

You can avoid adding an npm dependency for Chromium by requiring `playwright-core` out of the
pnpm store and pointing it at a Chrome-for-Testing build already cached under
`~/Library/Caches/ms-playwright` from any prior Playwright use, bypassing the version-pinned
download check. This keeps a standalone asset-generation script tree free of the app's build deps.
