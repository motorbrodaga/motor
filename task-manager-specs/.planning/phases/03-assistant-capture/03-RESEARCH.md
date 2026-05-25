# Phase 3: Assistant Capture - Research

**Researched:** 2026-05-26
**Status:** Complete

## Scope

Phase 3 adds assistant-style capture inside the existing `Быстро` flow. The assistant should interpret a user's phrase, ask at most one or two useful clarifying questions, show a task-card interpretation, and save only after explicit confirmation.

## Current Codebase Findings

- `zadachnik-app/src/features/capture/QuickCapturePanel.tsx` is the right entry point. It already opens from `Быстро`, records a shell event, posts to `/api/tasks`, and refreshes the app after creation.
- `zadachnik-app/src/app/api/tasks/route.ts` currently accepts title-only creation. It can be expanded to accept the same structured optional fields already supported by task patch validation.
- `zadachnik-app/src/lib/tasks/task-validation.ts` already validates title, dates, importance, category, project, contexts, minutes, and optional text fields.
- `zadachnik-app/src/lib/tasks/task-options.ts` defines the persisted importance values and default organization vocabulary.
- `zadachnik-app/src/lib/tasks/task-queries.ts` already provides organization options. Assistant interpretation can use active categories from the database.
- No database schema change is required for the core Phase 3 behavior.

## Recommended Approach

Use a deterministic, narrow assistant interpreter for Phase 3 instead of adding an external LLM provider.

Reasons:

- The requested recognition scope is small: title, date, category, and importance.
- The app currently has no AI provider dependency, no model routing, and no secret management for AI calls.
- The phase requirement is assistant-style dialogue with confirmation, not broad natural-language automation.
- Deterministic parsing is easier to test with Playwright and unit tests, and avoids latency on mobile quick capture.

## Interpreter Shape

Create a small task-capture module, likely under `zadachnik-app/src/lib/assistant-capture/`, that returns a staged interpretation:

- `title`: cleaned task title after removing obvious scheduling/category/importance markers where safe.
- `doDate` or `dueDate`: parsed from obvious Russian date phrases and ISO dates.
- `categoryId`: matched against active category names and common aliases.
- `importance`: `important` when the phrase clearly says the task is important.
- `questions`: zero to two clarification prompts for missing or ambiguous Phase 3 target fields.
- `warnings` or `missing`: optional hints for the confirmation card.

The planner should decide exact internals, but the interpreter should be pure enough to unit test without a browser.

## Date Parsing Boundary

Support obvious low-risk inputs:

- `сегодня`
- `завтра`
- `послезавтра`
- `через неделю`
- ISO-style `YYYY-MM-DD`

Ambiguous phrases should not silently create wrong dates. If ambiguity matters, ask one clarification question or leave the date empty and show that on the confirmation card.

Default mapping recommendation: use `doDate` for natural capture phrases unless the user clearly says `дедлайн`, `срок`, or `крайний срок`, in which case use `dueDate`. This preserves the Phase 2 distinction without forcing extra questions for every date.

## Category Matching Boundary

Match active categories by exact normalized name and a small alias table for defaults:

- Работа: `работа`, `рабочее`, `по работе`
- Личное: `личное`, `лично`
- Звонки: `звонок`, `позвонить`, `созвон`
- Дом: `дом`, `домашнее`, `быт`

If multiple categories could match, ask one clarification question or leave category empty for confirmation. Do not invent categories in Phase 3.

## Importance Boundary

Map clear phrases such as `важно`, `важная`, `приоритет`, `срочно и важно` to `importance: important`.

Urgency is not a Phase 3 target. If the phrase says only `срочно`, the executor may either leave `importance` normal and show a warning, or map it conservatively only if the final UI copy makes that interpretation visible before confirmation.

## UI Pattern

The quick capture panel should support two paths:

- Fast manual path: title-only creation remains direct and quick.
- Assistant path: phrase input -> interpretation/clarification -> confirmation card -> save.

The assistant confirmation card should show:

- title
- date interpretation
- category interpretation
- importance interpretation
- missing optional fields as empty/not set
- primary action `Сохранить`
- secondary actions `Изменить` and `Отмена`

## API Pattern

Recommended routes:

- `POST /api/assistant-capture/interpret` for protected interpretation using current organization options.
- Existing `POST /api/tasks` extended to accept optional structured fields for confirmed saves.

This keeps interpretation separate from persistence and protects the confirmation contract.

## Verification Strategy

Add focused tests:

- Unit tests for parser/date/category/importance recognition.
- E2E: assistant flow asks a clarification or shows interpretation before saving.
- E2E: first phrase alone does not create a task.
- E2E: confirmed save creates a normal task in `/api/tasks`/Prisma.
- E2E: cancel exits without creating a task.
- E2E/mobile: assistant capture remains usable inside `Быстро`.

## Risks

- Russian text encoding in terminal output is noisy in this workspace, but source files preserve Cyrillic. Prefer editing through normal file tools and verify in browser/tests.
- Over-eager parsing can create wrong tasks. The confirmation card must make interpreted fields visible.
- Adding external AI now would widen Phase 3 into provider selection and secret handling; defer that unless a later phase explicitly needs it.

## Research Complete

Proceed with three plans:

1. Assistant interpretation contract and parser.
2. Quick capture assistant UI with clarification and confirmation.
3. Confirmed save integration and coverage.
