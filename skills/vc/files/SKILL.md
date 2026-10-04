---
name: vc
description: Explain what you just did (the problem and the fix) in a few plain lines a non-technical VC could follow, written for an ADHD reader. Use when the user types /vc, or says "explain it like I'm a VC", "VC version", "non-technical summary", "explain for an investor".
---

# vc: explain it to a non-technical VC

Say what the problem was and what you did about it, so an investor with 20 seconds and no engineering background gets it. Assume the reader has ADHD: short lines, the point first, nothing extra.

## Output: exactly this, nothing around it

```
**Problem:** phone sign-ups got no welcome email.
**Fix:** it now sends on every device.
```

## Rules

1. **Two lines: Problem, Fix.** Add a third line, `**Open:**`, only when something real is unfinished or blocked.
2. **Short fragments, about 8 words per line max.** Lowercase after the label, no full sentences needed. No preamble, no closing, no headings.
3. **Business words only.** Talk about customers, money, time, risk, speed and trust. **Banned:** file names, code, library or tool names, "API", "database", "deploy", "bug", "refactor", "migration", "endpoint", and all acronyms.
4. **Describe what users saw, not how it worked.** "The page took 8 seconds to load", not "an N+1 query".
5. **Use real numbers where you have them** (time saved, % of users, $). Never make one up. If you don't have a number, leave it out.
6. **Be honest.** Partial means partial: "Fixed for new customers; existing ones next week." Never make it sound like a bigger win than it was.
7. **Several changes means one block.** Group them under the single business outcome they add up to, not one block per change.
8. **Match the user's language.** If they asked in Hebrew, answer in Hebrew.

## Translate before you write

| what you'd tell an engineer | what the VC reads |
| --- | --- |
| race condition in the checkout webhook | some payments were counted twice |
| added retries + a watchdog to the scraper | the data now keeps flowing on its own, with no one babysitting it |
| RLS policies were missing on 3 tables | one customer could have seen another's data; now they can't |
| moved to edge caching, cut the JS bundle | pages load about 3x faster |
