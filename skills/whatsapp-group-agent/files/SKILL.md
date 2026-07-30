---
name: whatsapp-group-agent
description: Connect an AI agent to an existing WhatsApp group so it silently monitors messages, auto-creates tickets, files shared documents into a searchable library, and answers when mentioned. Use when the user wants a WhatsApp group bot, "make our WhatsApp group smart", WhatsApp-to-Linear/tickets automation, a group document-intake bot, or asks how to hook an agent/OpenClaw/WAHA into WhatsApp. Encodes a working architecture and every gotcha from a real production build.
---
# public variant, safe to publish — NOT auto-loaded (Claude Code reads only ../SKILL.md); keep in lockstep with ../SKILL.md: every gotcha edit lands in both

Playbook for putting an AI agent inside an existing WhatsApp group. Built and
verified on a real production founder group (reference implementation: OpenClaw
running in a container on a VPS, driving a Linear workspace). Every rule below
exists because its absence broke something. Replace every `<PLACEHOLDER>` with
your own values.

## Architecture decision (do not re-litigate without new facts)

- **The official WhatsApp Cloud API cannot join an existing group.** Its
  Groups API only CREATES business-owned invite-link groups (8-participant
  cap). Verified against Meta docs 2026-06. Any solution that joins a real
  group rides an unofficial linked-device client (Baileys) underneath.
- **Winning stack:** OpenClaw (or WAHA as fallback) on a VPS + a NEW dedicated
  real SIM/eSIM (never VoIP, WhatsApp blocks those; never your own personal
  numbers) paired as a linked device + added to the group as a normal member.
- **Ban risk is real and accepted:** the bot number is expendable. Keep a
  spare SIM. All state (tickets, library, message log) lives outside WhatsApp,
  so recovery = new SIM + re-pair (~15 min).
- Cost: ~$10–30/mo (SIM $1–5 + model usage). Use a mid-tier model for the
  agent (sonnet-class) with a cheap fallback.

## Setup sequence

1. **Update OpenClaw first.** On a managed/prebuilt image the `latest` image
   tag is often stale; the real install may be npm inside a persistent mount
   (`npm install -g openclaw@latest` in the data home, e.g.
   `/data/.npm-global`). WhatsApp is an external plugin now:
   `openclaw plugins install clawhub:@openclaw/whatsapp`.
2. **Pair:** register WhatsApp on the bot number (a second account inside the
   WhatsApp Business app coexists fine with a personal account on one phone),
   then `openclaw channels login --channel whatsapp` and scan the QR.
   If the terminal QR is unscannable through a chat UI, parse the ANSI
   half-blocks and re-render as an image (approach: ▀▄█ chars → module matrix
   → BMP → open in an image viewer).
3. **Group config** (`channels.whatsapp` in openclaw.json):
   - `groupPolicy: "open"` + `groups: { "<GROUP_JID>": { requireMention: false } }`.
     The `groups` map IS the per-group admission list ("DM + 1 configured
     group" in the startup log confirms it). Do NOT use
     `groupPolicy: "allowlist"`: in this plugin that gates by SENDER
     (`groupAllowFrom`), not by group.
   - Get the group JID WITHOUT opening admission (verified 2026-07-10, better
     than the old temporarily-open dance): have someone send a message in the
     group, then grep the CONTAINER FILE LOG — dropped inbounds are logged
     there with their JID even though the docker console log shows nothing:
     `grep -o "[0-9]\{15,\}@g\.us" /tmp/openclaw-<uid>/openclaw-*.log`
     (inside the container). `openclaw directory groups list` only shows
     already-configured groups, so it can't discover a new one.
   - `reactionLevel: "minimal"` to enable agent-initiated reactions.
4. **Dedicated agent:** `agents.list` entry with its own workspace +
   `bindings: [{ type: "route", agentId: ..., match: { channel: "whatsapp" } }]`.
   `bindings[].match.peer` requires BOTH `kind` and `id`, so match on channel
   only until the JID is known.
5. **Ticket/library tools:** small Python CLIs the agent calls via exec beat
   MCP for reliability, and register Linear's remote MCP too
   (`openclaw mcp set linear '{"url":"https://mcp.linear.app/mcp","transport":"streamable-http","headers":{"Authorization":"Bearer <LINEAR_API_KEY>"}}'`).
   Reference CLIs from the build: `linear.py` (create/search/comment/
   collection find-or-create/archive-done), `groupmem.py` (SQLite+FTS5 message
   log), `library.py` (document intake + FTS index), `granola.py` (meeting
   cache + project-scoped Q&A — see "Granola meeting access" below).
6. **Message-log hook (the safety net).** Register via
   `hooks.internal.handlers: [{ event: "message", module: "hooks/group-logger/handler.js" }]`.
   The module path resolves RELATIVE TO EACH AGENT WORKSPACE (put the file in
   `<workspace>/hooks/...`). The HOOK.md `metadata.openclaw.events` route did
   NOT bind in 2026.6.11. In the handler, insert on
   `event.action === "preprocessed"` (fires once per admitted message;
   "received" does not fire through this route) using `context.bodyForAgent`
   (clean text), `context.senderName`, `context.groupId`.
7. **Daily sweep cron:** the agent can drop a run (known race: a message
   arriving while the group session is initializing fails with "reply session
   initialization conflicted"). Host cron runs
   `openclaw agent --agent <id> --message "<reconcile prompt>"` daily to diff
   the message log against tickets/library and file anything missed.
8. **Health cron:** restart the container ONLY when the gateway is
   unreachable; "not linked" is a pairing state a restart cannot fix.
9. **Granola sync cron:** if meeting Q&A is wired (see below), host cron runs
   `granola.py sync` every 30 minutes — separate from the daily sweep and
   health cron. Agents never call `sync` inline; that eats request budget and
   stalls a reply.

## Granola meeting access (added 2026-07-20)

Lets a group agent answer "what did we discuss in the meeting with X" from a
local cache — the public API has no search, so agents read a synced SQLite
cache, never the live API directly (except a one-off `get` on a known id).

- **CLI:** `<data-home>/granola.py`, stdlib-only (urllib + sqlite3 — a
  minimal container may not have `requests`). Subcommands:
  `sync [--full] [--days N]`, `list --project P [--limit N] [--days N]`,
  `search --query Q [--project P] [--limit N]`, `get --id ID [--transcript]`,
  `unclassified [--limit N]`, `reclassify --id ID --project P`, `stats`.
- **The public API surface is exactly three endpoints and nothing else:**
  base `https://public-api.granola.ai`, `Authorization: Bearer
  $GRANOLA_API_KEY`. `GET /v1/notes` (list), `GET /v1/notes/{id}[?include=
  transcript]` (detail), `GET /v1/folders`. No server-side search, no
  attendee filter, no free-text query — unknown query params are silently
  ignored (200 OK, unfiltered) while bad values for KNOWN params 400. So
  relevance filtering must happen client-side; that's why the cache exists.
- **List items are stubs:** only id/title/owner/created_at/updated_at, no
  summary/attendees/folder. You cannot classify off the list endpoint alone —
  every note needs the per-note detail call.
- **Folders are read-only via the API** — there is no write endpoint for
  folders or folder membership, so you cannot auto-categorize inside Granola
  itself. The project mapping has to live in your own store:
  `granola-rules.json` next to the script, per project
  `{domains, names, keywords}`, matched in priority order domains → names →
  keywords.
- **Keyword precision carries the classification.** Most notes are "solo
  notes" with no attendees/calendar event populated, so attendee-domain
  signals often don't fire. Loose keywords ("legal", "client", "consulting")
  cause false positives from notetaker boilerplate — keep keywords
  high-precision and let ambiguous meetings fall to a low-confidence `other`
  bucket surfaced by `unclassified` for the daily sweep to review, rather
  than guessing.
- **No webhooks; polling is the only trigger.** `updated_after` drives
  incremental sync, `page_size` maxes at 30 with cursor pagination, rate
  limit is 25 req/5s burst / 5 req/s sustained. Never fetch transcripts in
  bulk — only for a note a query has already judged relevant.
- **Per-group scoping is mandatory, same discipline as `groupmem.py
  --group <jid>` and the per-team Linear key prefix:** each group agent is
  hard-scoped to its own project (`--project <own-project>` on every `list`/
  `search` call in that AGENTS.md) so it can never read another project's
  meetings.
- **Secret handling:** `GRANOLA_API_KEY` goes in `.env`, same pattern as the
  Linear keys. An `env_file` change needs `compose up -d --force-recreate`,
  not just a restart — a plain restart keeps the container running with the
  stale environment.

## Multiple groups / projects (e.g. a second group → a different Linear team)

Sessions are per-group (`agent:<id>:whatsapp:group:<jid>`), so one bot number
serves many groups without context bleed. To add a group:

1. Add its JID to the admission map:
   `channels.whatsapp.groups["<NEW_GROUP_JID>"] = { requireMention: false }`
   (get the JID the same way as in setup step 3).
2. Pick the isolation level:
   - **Same agent, different context (light):** add
     `systemPrompt: "This group is project X with <people>; tickets go to Linear team <KEY> (pass --team <KEY> to linear.py)."`
     to that group's entry in the groups map.
   - **Dedicated agent per project (clean, preferred for a real second team):**
     new `agents.list` entry with its own `workspace` (own AGENTS.md: project
     context, taxonomy, collection-title language, team key) and optionally its
     own `model`. Route with
     `bindings: [{ type: "route", agentId: "<new>", match: { channel: "whatsapp", peer: { kind: "group", id: "<NEW_GROUP_JID>" } } }]`
     placed BEFORE any channel-wide binding (exact peer match wins; remember
     peer requires both `kind` and `id`). Tighten the original catch-all
     binding to its own group JID at the same time.
3. Linear team: `linear.py` takes `--team <KEY>` per call (or set
   `LINEAR_TEAM_KEY` per agent via the workspace AGENTS.md instructions); one
   workspace API key covers all its teams. Collection tickets stay per-team
   automatically since they are created with that team flag.
   **Different Linear WORKSPACE (verified 2026-07-10):** an API key only sees
   its own workspace, so a second project in another workspace needs its own
   key. Put it in `.env` as `LINEAR_API_KEY_<PROJECT>` (env_file change →
   container RECREATE, `compose up -d --force-recreate`, not just restart) and
   have that agent's AGENTS.md prefix EVERY linear.py call with
   `LINEAR_API_KEY="$LINEAR_API_KEY_<PROJECT>" LINEAR_TEAM_KEY=<KEY>` — state
   in the prompt that a missing prefix files tickets into the wrong company.
4. Shared automatically: the message log and library (both partitioned by
   group JID), health cron, daily sweep (make the sweep prompt name both
   teams or run one sweep per agent). Scope every shared query by group:
   `groupmem.py search/recent --group <jid>` in each AGENTS.md and in each
   sweep prompt, otherwise agents and sweeps read the other project's chatter
   (search lacked `--group` until 2026-07-10 — check before reusing an older
   copy). If the second project shouldn't share the document library, forbid
   `library.py` in its prompt (allow `extract-pdf`, it's read-only) and file
   intake to Linear collection tickets only.
5. Caveat to tell the user: it is still ONE WhatsApp number on Baileys; a ban
   takes all groups down until re-pair. Use a second number for groups with
   external collaborators.

## Agent prompt rules (AGENTS.md in the agent workspace)

**Policy v2 (2026-07-20):** replaced the flat "classify then react to every
message" rule below. Reaction-per-message was pure noise (most
`<media:audio>` fell through to a stray 👍) and the old taxonomy couldn't
distinguish "addressed to the bot" from "humans talking to each other" from
"actually ticket-worthy". Current rules:

- **Prime directive — default to silence.** When in doubt, output `NO_REPLY`
  and nothing else. A missed ticket is caught by the daily sweep; an unwanted
  reaction or reply cannot be taken back. Never narrate ("noted", "creating a
  ticket") before/between/after tool calls — in monitoring mode the only text
  output is the final `NO_REPLY`.
- **Am I addressed? — run BEFORE any classification.** True only if one of:
  **A.** @mention of the bot itself — the prompt MUST spell out the bot's own
  identifiers verbatim, because WhatsApp delivers a mention as raw literal
  text with NO mention metadata (the OpenClaw plugin never forwards
  `mentionedJids`): a mention arrives as `@<bot-LID>` (the bot's LID, a
  WhatsApp-internal id — NOT the phone number, NOT the display name) or
  `@<bot-number>` (phone). Either token anywhere in the message = addressed;
  `@` + any other number is a human mention and does not count. A rule that
  just says "@mention of your own number/handle" is unsatisfiable — the model
  NO_REPLY'd a real direct mention until the literal tokens were spelled out
  (incident + fix 2026-07-20). GENERAL LESSON: every group bot's prompt
  states its own LID and phone number; discover the LID by having someone
  tap-mention the bot and reading the raw body in the gateway file log or
  message log.
  **B.** the trigger word `bot` (or your language's equivalent, any casing)
  used as a DIRECT ADDRESS anywhere in the message — first word ("bot,
  what's open"), last word ("what's open, bot?"), or mid-sentence vocative
  ("tell me, bot, what's open"). Widened from first-word-only 2026-07-20.
  Third-person REFERENCE is explicitly not addressing: "the bot"/"the bot
  didn't respond" stay ambient; genuinely unsure whether it's address or
  reference → NOT addressed (silence-default wins).
  **C.** WhatsApp quoted-reply to a message the bot sent.
  **D.** conversational continuation (added 2026-07-20): the bot sent the
  immediately previous group message AND the new message is a direct reaction
  to it — a correction/objection ("I think that's incomplete"), a follow-up
  question, or "help". One hop only; a new unrelated topic doesn't count.
  None of A/B/C/D → NOT addressed → ambient classification below. A plain
  imperative ("add hebrew support") is two humans assigning each other work,
  never a bot request; audio/image/document with no A/B/C/D trigger is never
  addressed.
- **Ambient classification (not addressed), top-to-bottom, first match wins:**
  audio/untranscribed media → **SILENT** (never guess unheard content) →
  client/sensitive-case content (real client name/ID, case facts) →
  **SILENT** (never filed, never ticketed) → intake (attachment or link worth
  keeping) → file it, react **📁** → task/bug/feature/commitment →
  dedup-search first, then react **✅** if a ticket was created, or **SILENT**
  if an existing open ticket already matched → everything else (decisions,
  questions, scheduling, FYI, banter, ideas with no owner) → **SILENT**, no
  reaction of any kind.
- **Reactions are receipts for completed actions only, and there are exactly
  two:** ✅ created, 📁 filed. 👍/❓/📌 are retired, and so is the 🔁 duplicate
  marker: finding an existing ticket is not work, so it earns silence like
  everything else the bot did not act on. Write the dedup rule as "no ticket,
  NO reaction, just NO_REPLY" — a weak model reads "duplicate found" as an
  outcome worth announcing unless told otherwise. One reaction max: if intake
  and task both fire on the same message, do both actions but show only ✅.
  A text
  reply is its own receipt — never stack a reaction on top of a reply. The
  react call must OMIT message_id: an explicit id skips the plugin's
  participant inference and WhatsApp silently drops group reactions missing
  the participant key.
- **When addressed, route by ask:** bare mention (a mention with no ask —
  e.g. just `@<bot-LID>` — is still addressed: never NO_REPLY it; reply one
  short line in the sender's language inviting the ask) / ticket ops (dedup,
  then create/update,
  confirm in one line with identifier+URL) / reminders (OpenClaw's own cron —
  never build new — `announce → whatsapp:<target>`, group JID for "remind
  us/the group" vs DM for "remind me"; reminders never touch Linear) /
  knowledge or advice (search first via `groupmem.py`/`linear.py`/
  `library.py`, answer short and in-language; for pure opinion give a short
  honest take and state uncertainty plainly — never default to "I don't have
  enough context") / meetings (Granola cache, always project-scoped — see
  "Granola meeting access" above; summary first, transcript only when the
  summary doesn't answer it) / capabilities ("what can you do?" — required
  self-description, see below) / correction or banter (one short reply;
  best-effort undo if it corrected a wrong action; no ticket, no reaction).
- **Client PII in tickets:** when a task wraps a real client's data (name/ID,
  medical/case detail), the ticket describes the technical problem only and
  references the WhatsApp thread/date; never paste the client narrative into
  Linear.
- **Timezone (added 2026-07-20):** if the container clock's timezone differs
  from the group's (e.g. a European VPS serving a group elsewhere), state the
  offset in the prompt and have the bot convert any stated time to the
  group's timezone and label it as such — otherwise reminders and "at 3pm"
  answers land an hour off.
- **Carried forward, unchanged:** dedup-search before create; rolling
  "[collection]" tickets per document topic (find-or-create by exact title,
  then comment per item) instead of a ticket per document, localized to the
  group's own language; media arrives as `<media:image>`/`<media:document>`
  placeholders with the file in `<data-home>/.openclaw/media/inbound/`, images
  auto-described by the configured image model, PDFs need a pypdf extract
  helper.

## Capabilities self-description (added 2026-07-20)

Required section in every group agent's AGENTS.md, answered when addressed
and asked "what can you do?" — a silent bot can't be discovered by its users,
and its emoji receipts are undecodable without an explanation on demand.
Answer in the asker's language, adapted naturally, nothing invented:

1. Silent monitoring — every task mentioned in the group becomes a ticket
   automatically; documents/articles/screenshots are filed to the library and
   collection tickets.
2. On-request ("call me bot anywhere in the message, @mention me, or reply
   to me" — deployed wording 2026-07-20; a direct follow-up right after the
   bot speaks counts too):
   open/search/close tickets, list what's open, set reminders, answer
   questions from group history + the document library + Granola meetings,
   give a short opinion.
3. **Reaction glossary, verbatim, not paraphrased:** ✅ ticket created,
   📁 filed — that is the whole set — plus an explicit line that silence is
   deliberate: "seen, nothing to do," including when a ticket already exists.

Without item 3 users can't decode the emoji receipts and end up asking "did
that work?" in the chat, which defeats the point of the silent-monitoring
design — this is now required for every group bot, not optional flavor.

## Fallback models break discipline

- Model idle timeouts (default 120s) silently push work to the LAST fallback
  model. Cheap models follow the silence/reaction rules loosely: they announce
  actions in chat, skip reactions, and misread plain imperatives ("add more
  languages") as being addressed directly.
- Fixes: set `agents.defaults.timeoutSeconds: 300`; order fallbacks mid-tier
  before cheap (sonnet-4-6 → sonnet-4-5 → haiku last); define "addressed"
  explicitly in the prompt (the A/B/C/D test above, literal identifier tokens
  included; an imperative is a task); write every hard rule so the weakest
  model in the chain still obeys it.

## Container/environment gotchas (managed OpenClaw image on a VPS)

- Run ALL openclaw CLI as the service uid: `docker exec -u 1000 ...`. Running
  as root creates root-owned files that trip ownership security checks.
- `/tmp` must be mode 1777; some prebuilt images ship it 0700 → gateway
  refuses to start with "Unsafe fallback OpenClaw temp dir".
- Config is strict-validated and unknown keys abort the gateway: run
  `openclaw config validate` after every edit.
- pip needs `--user --break-system-packages` (PEP 668), installs persist in
  the /data home.
- Bot LID discovery: the bot's own LID (needed verbatim in the prompt — see
  "Am I addressed?" rule A) appears in no config file. Have someone
  tap-mention the bot in the group, then read the raw message body — it shows
  as literal `@<15-digit LID>` text — in the container file log
  (`/tmp/openclaw-<uid>/openclaw-*.log`) or the message log. The plugin
  forwards no mention metadata, so the raw body is the only place the LID
  surfaces.
- AGENTS.md/skills snapshot per session: reset the group session
  (`rm -rf agents/<id>/sessions/*` + container restart) after prompt changes,
  ideally at a quiet moment (see the initialization race above).
