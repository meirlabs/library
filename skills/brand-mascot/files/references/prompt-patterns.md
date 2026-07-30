# Prompt patterns — the reference-conditioning mechanism

This is the load-bearing part of the whole skill. Copy the request shape verbatim; the
character's consistency comes from *how* the call is structured, not from clever wording.

## The one rule everything else serves

**Identity lives in the picture, not the prose.** From the soclever generation contract
(`mascot/lottie-reference-kit/CONTRACT.md`), stated as numbered law learned from experience:

> 1. The reference image is ALWAYS attached (as `inlineData` parts, BEFORE the text part).
>    Identity lives in the picture, not the prose.
> 2. Appearance is NEVER re-typed in text. Text competing with the reference is the #1 cause
>    of drift. Only a short fixed consistency line is allowed; the prompt otherwise describes
>    ONLY the state.
> 3. One state change per call. Never combine pose + accessory + mood changes.

"Text competing with the reference is the #1 cause of drift" is the sentence to internalize.
When a prompt *also* spells out the character's colors/proportions/face in words, that text
competes with the attached pixels and the model drifts toward its own visual defaults. The
fix is to say as little as possible about appearance in words and let the attached image
carry it. The text's only job is "what's different this time" (pose, scene, composition).

## Request shape — image part FIRST, text part second

```js
// Read the reference PNG and base64-encode it.
const refB64 = fs.readFileSync(mascotRefPath).toString('base64');

// Prompt = brand contract + composition brief + the fixed consistency line.
// Note what the last line does NOT do: it never re-states the mascot's actual
// colors/proportions. It only asserts that whatever is in the picture stays the same.
const prompt = [
  BRAND_STYLE,                                   // the per-brand contract (see style-contract-template.md)
  `Composition brief: ${concept.illustrationPrompt}`,
  `Mascot: ${concept.mascotPose} Keep the mascot's identity (colors, face, proportions) ` +
    `EXACTLY consistent with the attached reference image — it is the same character, just re-posed.`,
].join('\n\n');

const body = {
  contents: [
    {
      role: 'user',
      parts: [
        { inlineData: { mimeType: 'image/png', data: refB64 } },  // IMAGE FIRST
        { text: prompt },                                         // TEXT SECOND
      ],
    },
  ],
  generationConfig: {
    responseModalities: ['IMAGE'],
    imageConfig: { imageSize: '1K' },   // add aspectRatio only if the output is a fixed non-square shape
  },
};

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
);

// Parse the response. The image comes back as a base64 inlineData part on the first candidate.
// A non-200 HTTP status OR a response with no image part is a failed generation for this piece
// (fail it, retry per §retry — do not silently write an empty file).
if (!res.ok) throw new Error(`image gen HTTP ${res.status}: ${await res.text()}`);
const json = await res.json();
const imgPart = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
if (!imgPart) throw new Error('no image part in response');
fs.writeFileSync(outPath, Buffer.from(imgPart.inlineData.data, 'base64'));
```

## The fixed consistency line (copy verbatim)

> Keep the mascot's identity (colors, face, proportions) EXACTLY consistent with the attached
> reference image — it is the same character, just re-posed.

Multi-character variant (comic-panel origin of the pattern):

> Keep the characters EXACTLY consistent with the provided reference image — same faces,
> colors, and designs.

Both do the same thing: assert sameness, name nothing specific, and hand the model only the
one thing allowed to change (the pose/scene). The ad-card pipeline copied this line directly
from the in-app comic renderer.

## Bootstrapping the very first anchor (Entry A only)

There is exactly one moment you describe appearance in prose: the seed render, when no
reference exists yet. Generate the front mascot from a text description, iterate until it
matches the character brief, and **that render becomes the anchor.** From then on, every image
— angle anchors, moods, modes, campaign pieces — conditions on a real PNG and never
re-describes the character again. Once you have the anchor, the prose-appearance door closes.

## Zero-text instruction (always include, in `BRAND_STYLE` and per-piece)

Image models cannot render legible type — do not fight this in the prompt, forbid text
entirely and composite real text later (see format-matrix.md §compositing).

> Critical: render NO text, NO words, NO letters, NO numbers, NO labels, NO captions, NO
> signage, NO speech bubbles, NO lettering anywhere in the image. Represent ideas with shapes
> and icons only.

For a piece that *needs* something that looks like text (a fake report, column headers, a
chart), instruct that every such mark be an abstract illegible squiggle/line-fill — "this
rule has ZERO exceptions anywhere in the image" — rather than real glyphs.

## One-change-per-call, in practice

When building the kit or a variant, change exactly one thing per generation and condition on
the anchor:

- new angle → condition on `anchor-front.png`, ask only for the angle.
- new mood → condition on the nearest accepted anchor, ask only for the expression.
- add an accessory → condition on the accepted mood sprite, ask only for the prop.

Never "front → three-quarter + graduating + holding a book" in one call. Each extra changed
variable is a fresh opportunity for the model to invent, which is drift.
