# Phase 8: Telegram And Gmail Intake - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 8 delivers explicit, user-triggered task creation from Telegram and Gmail. The system may show recent or matching source items, let the user choose one, summarize it into a task draft, and create the task only after the user confirms the editable card. It must not scan all Telegram or Gmail content in the background.

</domain>

<decisions>
## Implementation Decisions

### Intake Entry Point
- **D-01:** The MVP import entry point should live in "More", not inside the main "Quick" button.
- **D-02:** The import flow should feel like a deliberate action, because Telegram/Gmail access is private and should not blend into casual capture.

### Telegram Intake
- **D-03:** Telegram MVP should show the latest 20 messages from `Motorcodex_bot`.
- **D-04:** Telegram search can be deferred; the current phase may leave space for search later.
- **D-05:** If Telegram connection/import is unavailable, provide a manual text paste fallback for Telegram content.

### Gmail Intake
- **D-06:** Gmail MVP should start from a user-written search query.
- **D-07:** If multiple Gmail messages match, show up to 20 choices before preparing a task draft.

### Confirmation And Editing
- **D-08:** Always show a prepared task card before creating the task.
- **D-09:** The confirmation card must allow editing before create.
- **D-10:** Do not auto-create tasks based on high confidence.

### Source Storage And Privacy
- **D-11:** Imported tasks need a text source label such as `from Gmail` or `from Telegram Motorcodex_bot`.
- **D-12:** Imported tasks do not need original message/email links in MVP.
- **D-13:** The system must never automatically scan all Telegram/Gmail content into tasks.

### the agent's Discretion
- Decide the exact "More" screen label and sub-page structure.
- Decide how compact the 20-option selectors should be on mobile.
- Decide whether the manual Telegram paste fallback shares the same confirmation card component as real Telegram/Gmail selections.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning
- `.planning/ROADMAP.md` - Phase 8 goal, requirements, success criteria, and planned plan count.
- `.planning/REQUIREMENTS.md` - INTG requirements and traceability context.
- `.planning/PROJECT.md` - Privacy boundary: tasks from Telegram/Gmail only by explicit request.
- `AGENTS.md` - Telegram access rules and secrets handling; do not print `.env` or `.telegram_sessions`.

### Prior Phase Context
- `.planning/phases/03-assistant-capture/03-CONTEXT.md` - Assistant capture confirmation flow and task interpretation patterns.
- `.planning/phases/02-core-task-system/02-CONTEXT.md` - Task creation, editing, and task field expectations.
- `.planning/phases/07-completion-history/07-CONTEXT.md` - "More" as a calm reference/action area pattern.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `zadachnik-app/src/features/capture/QuickCaptureEntry.tsx` and related capture components show the existing assistant capture entry pattern.
- `zadachnik-app/src/app/api/assistant-capture/interpret/route.ts` shows how assistant capture converts free text into an interpretation before task creation.
- `zadachnik-app/src/app/(app)/more/page.tsx` is the chosen navigation entry point for import.
- `zadachnik-app/src/app/api/tasks/route.ts` and `zadachnik-app/src/app/api/tasks/[id]/route.ts` are the task creation/update integration points.
- `scripts/telegram-account-import-all.js` is the existing safe Telegram import script referenced by `AGENTS.md`.

### Established Patterns
- User-facing UI is Russian-only and mobile-first.
- Mutating actions go through authenticated app API routes protected by the private-link session.
- The app prefers confirmation/editing before creating ambiguous assistant-derived tasks.
- Local Telegram access exists, but secrets and saved sessions must not be logged, copied, or committed.

### Integration Points
- Telegram source selection should use `Motorcodex_bot` as the MVP source and cap displayed messages at 20.
- Gmail source selection should use user-provided search text and cap displayed email choices at 20.
- The selected source should flow into the same task-draft confirmation surface.
- Task persistence may need a source-label field or another durable way to store text source labels without storing source links.

</code_context>

<specifics>
## Specific Ideas

- Keep this under "More" so it feels intentional.
- Telegram should support both real latest-message selection and manual paste fallback.
- Gmail starts with search, not automatic inbox scanning.
- Confirmation card should include edit before create.

</specifics>

<deferred>
## Deferred Ideas

- Telegram full-text search beyond the latest 20 messages is deferred beyond this MVP slice.
- Source deep links/permalinks are not needed in MVP.

</deferred>

---

*Phase: 8-Telegram And Gmail Intake*
*Context gathered: 2026-06-04*
