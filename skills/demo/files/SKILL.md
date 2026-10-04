---
name: demo
description: Build one clickable demo page with 10 genuinely different options (designs, layouts, copy, flows, or approaches) side by side, so the user can pick by number. Use when the user types /demo, or says "make a demo", "show me options", "give me 10 versions", "demo some variants".
---

# demo: one page, 10 options

Show 10 distinct takes on the thing the user named, on one page, so they can compare and pick by number.

## Steps

1. **Pin the subject.** Use what the user named: a component, a page, a hero section, copy, a flow, a pricing layout, and so on. Ask only if there is no subject at all, and then use AskUserQuestion.
2. **Plan 10 real differences.** Before building, write one line per option naming its idea. Each option must differ in structure, concept or tone, not just in colour or spacing. If two lines sound alike, replace one.
3. **Build one self-contained HTML page:**
   - Options numbered 1-10, one visible at a time, with a compact switcher (tabs or segmented control). Keys `1`-`9` and `0` (for 10) jump to an option, and left/right arrows step through them.
   - Each option gets a 2-4 word name. No descriptions or captions.
   - Use real content from the user's project, not lorem ipsum.
   - Follow the project's design system if it has one. Every option ships only what its job needs, with no extra labels, captions or chrome.
   - Support light and dark, and make it work at phone width.
   - Remember the last viewed option in `localStorage` (wrapped in try/catch).
4. **Share it** the easiest way your environment offers: a published page or artifact if you have one, otherwise a local file path. If the demo belongs inside a running app, put it on a throwaway route instead and give the local URL.
   Then open it in the user's regular browser, full window: `open <url or file>` on macOS, `xdg-open` on Linux. Never leave it only in an editor or side-pane preview.
5. **Check it once** in a browser: all 10 render and the keys switch between them.
6. **Reply** with the link, then the 10 names as a numbered list, then one line: "Pick a number (or mix, like '3 with 7's header')."

## Rules

- Always exactly 10 options, unless the user gives a different number.
- No option is a straw man. Each should be one you could defend shipping.
- Once the user picks, build the chosen option properly in the real code. The demo page is throwaway.
