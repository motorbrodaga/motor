# Phase 8: Telegram And Gmail Intake - Research

**Date:** 2026-06-04
**Mode:** Inline research because GSD subagents are not installed in this runtime.

## Scope

Phase 8 adds deliberate import from Telegram and Gmail. The user opens the import area from "More", chooses a source item, reviews an editable task card, and creates a normal task only after explicit confirmation.

This phase must not add background scanning, automatic inbox monitoring, or source links. The MVP stores only a short text source label on imported tasks.

## Existing Foundation

- `zadachnik-app/src/app/(app)/more/page.tsx` is the chosen entry point for the import area.
- `zadachnik-app/src/app/api/assistant-capture/interpret/route.ts` and `zadachnik-app/src/lib/assistant-capture/interpret-task-capture.ts` already provide the task-draft interpretation pattern.
- `zadachnik-app/src/app/api/tasks/route.ts`, `zadachnik-app/src/app/api/tasks/[id]/route.ts`, and `zadachnik-app/src/lib/tasks/task-validation.ts` are the normal task persistence path.
- `zadachnik-app/src/features/tasks/TaskCard.tsx`, `TaskForm.tsx`, and `task-types.ts` define the visible task surface and should receive source-label support.
- Local Telegram access exists through `scripts/telegram-account-import-all.js`, `.env`, and `.telegram_sessions/chief_agent.session.txt`; secrets must not be printed, copied, or committed.
- Gmail connector tools are available to Codex in this workspace, but the Next.js web app cannot call the Codex connector directly at runtime. The implementation needs a narrow Gmail adapter boundary with explicit query input and graceful unavailable/error states.

## Implementation Direction

1. Add a nullable text source label to tasks and expose it through validation, API responses, and task cards.
2. Add an import area under "More" with Russian-only copy and deliberate source buttons.
3. Build a shared intake draft contract so Telegram, Gmail, and manual paste all prepare the same editable confirmation card.
4. Build Telegram intake around latest 20 messages from `Motorcodex_bot`, with a manual text paste fallback if live Telegram is unavailable.
5. Build Gmail intake around a user-entered search query and show up to 20 matching email choices.
6. Ensure every provider endpoint requires an explicit user request parameter and uses hard limits.
7. Add tests proving no task is created until the confirmation action.

## Provider Boundaries

### Telegram

- Use the existing local GramJS setup without logging `.env` values or the saved session string.
- Prefer a local helper that returns sanitized message choices: id, date, sender/chat label, and a compact text preview.
- Cap results at 20 and target `Motorcodex_bot` for the MVP.
- Provide manual paste as an in-app fallback that still goes through the same confirmation card.

### Gmail

- The app should define its own server-side adapter contract instead of depending on Codex's Gmail connector at runtime.
- The UI must require the user to type a search query before results are requested.
- Cap displayed results at 20 and show compact choices.
- If Gmail is not configured in the app runtime, show a clear unavailable state and allow the rest of the import flow to remain intact.

## Risks

- Telegram secrets may accidentally leak through debug logging; provider code and tests must avoid printing raw config/session values.
- Gmail runtime availability may differ from Codex connector availability; the plan must keep a graceful adapter boundary.
- Imported source text can be long or private; selectors and confirmation cards should use short previews and avoid storing the original body on the task unless the user edits it into the task fields.
- Adding source labels touches the shared task model, so migration and validation must be verified carefully.

## Verification Focus

- Schema migration and typecheck for the new optional source label.
- Unit tests for provider caps, privacy guardrails, and shared intake draft conversion.
- E2E coverage for More -> import -> choose source -> edit/cancel/save.
- Browser verification on mobile width for Telegram, Gmail, and manual paste fallback.
