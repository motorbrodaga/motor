# Phase 8: Telegram And Gmail Intake - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-04
**Phase:** 8-Telegram And Gmail Intake
**Areas discussed:** import entry point, Telegram MVP, Gmail MVP, task confirmation

---

## Import Entry Point

| Option | Description | Selected |
|--------|-------------|----------|
| In "Quick" near assistant | Makes import feel like another capture mode. | |
| Separate item in "More" | Makes private integrations deliberate and calmer. | yes |
| Both places | Maximizes access but makes the capture surface busier. | |

**User's choice:** Separate item in "More".
**Notes:** This reinforces explicit-request privacy.

---

## Telegram MVP

| Option | Description | Selected |
|--------|-------------|----------|
| Only latest 20 from `Motorcodex_bot` | Smallest real integration slice. | |
| Latest 20 first, search later | Ships real selection now and leaves space for later search. | yes |
| Manual paste fallback | Lets the user continue if Telegram connection is unavailable. | yes |

**User's choice:** Latest 20 now, search later, plus manual paste fallback.
**Notes:** The user selected both `2` and `3` for Telegram.

---

## Gmail MVP

| Option | Description | Selected |
|--------|-------------|----------|
| User writes search query, show up to 20 emails | Explicit, targeted, and avoids broad scanning. | yes |
| Latest emails only | Simpler but less useful for finding a relevant email. | |
| Manual paste first, Gmail search later | Avoids connector work but delays the planned Gmail flow. | |

**User's choice:** User-written Gmail search query with up to 20 matching emails.
**Notes:** This matches the roadmap requirement that Gmail import can search based on the user's request.

---

## Task Confirmation

| Option | Description | Selected |
|--------|-------------|----------|
| Always show card and "Create" | Explicit confirmation before creating. | |
| Create automatically when confidence is high | Faster but risks surprise task creation. | |
| Always show card, plus allow edit before create | Safest and most useful for assistant-derived drafts. | yes |

**User's choice:** Always show a card and allow editing before creation.
**Notes:** No automatic task creation from source content.

---

## the agent's Discretion

- Exact mobile layout, labels, and fallback UI can be chosen during planning and implementation.

## Deferred Ideas

- Telegram message search beyond latest 20.
- Source links/permalinks to original Telegram/Gmail items.
