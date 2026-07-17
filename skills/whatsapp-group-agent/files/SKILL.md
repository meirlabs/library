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
   log), `library.py` (document intake + FTS index).
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

- Classify every message: task / decision / question / fyi / intake.
- **Silence is explicit:** "any text you produce gets posted to the group;
  between tool calls output nothing; your only text output is the final
  NO_REPLY". Without this the agent narrates its work into the chat.
- **Reactions as receipts, one per message:** ✅ ticket created, 🔁 already
  tracked, 📁 filed, 📌 decision, ❓ question, 👍 fyi. The react call must
  OMIT message_id: an explicit id skips the plugin's participant inference and
  WhatsApp silently drops group reactions missing the participant key.
- Tickets: dedup-search before create; rolling "[collection]" tickets per
  document topic (find-or-create by exact title, then comment per item)
  instead of a ticket per document. Localize the collection title language to
  the group's own language if it is not English.
- Media arrives as `<media:image>`/`<media:document>` placeholders with the
  file in `<data-home>/.openclaw/media/inbound/`; images are auto-described by
  the configured image model; PDFs need a pypdf extract helper.

## Fallback models break discipline

- Model idle timeouts (default 120s) silently push work to the LAST fallback
  model. Cheap models follow the silence/reaction rules loosely: they announce
  actions in chat, skip reactions, and misread plain imperatives ("add more
  languages") as being addressed directly.
- Fixes: set `agents.defaults.timeoutSeconds: 300`; order fallbacks mid-tier
  before cheap (sonnet-4-6 → sonnet-4-5 → haiku last); define "addressed"
  explicitly in the prompt (@mention / bot-name / reply-to-bot only, an
  imperative is a task); write every hard rule so the weakest model in the
  chain still obeys it.

## Container/environment gotchas (managed OpenClaw image on a VPS)

- Run ALL openclaw CLI as the service uid: `docker exec -u 1000 ...`. Running
  as root creates root-owned files that trip ownership security checks.
- `/tmp` must be mode 1777; some prebuilt images ship it 0700 → gateway
  refuses to start with "Unsafe fallback OpenClaw temp dir".
- Config is strict-validated and unknown keys abort the gateway: run
  `openclaw config validate` after every edit.
- pip needs `--user --break-system-packages` (PEP 668), installs persist in
  the /data home.
- AGENTS.md/skills snapshot per session: reset the group session
  (`rm -rf agents/<id>/sessions/*` + container restart) after prompt changes,
  ideally at a quiet moment (see the initialization race above).
