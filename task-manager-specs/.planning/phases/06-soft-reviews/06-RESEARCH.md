# Phase 6: Soft Reviews - Research

**Researched:** 2026-06-03
**Status:** Complete

## Scope

Phase 6 should replace the current `/review` placeholder with a weekly review surface that gently returns unattended tasks to attention. The review should be a soft grouped list, not a wizard or audit. It should be manually accessible from `Обзор`, framed around Monday review, and separate from the daily Dashboard.

## Current System Findings

- `/review` already exists and is the right route for the weekly review.
- `Task` already has the fields needed for review grouping: `dueDate`, `doDate`, `updatedAt`, `createdAt`, `importance`, `status`, `archivedAt`, `categoryId`, `personLabel`, `waitingDirection`, `waitingSince`, and `responseDueDate`.
- Phase 5 added `needsWaitingCheckIn`, which can be reused or generalized for waiting-without-movement.
- Dashboard grouping already uses a server-side helper and compact task cards; the review should follow that pattern.
- Existing task cards and quick actions are reusable, but the review may need a smaller review action strip to avoid turning the page into a heavy editor.

## Recommended Approach

- Add a review helper under `src/lib/review/weekly-review.ts`.
- Keep review state light. A full audit trail is not needed in Phase 6, but the implementation may need a small weekly "seen/kept" record if "once per week" cannot be represented cleanly from existing task timestamps.
- Define week start as Monday in local app logic.
- Use open, unarchived, non-done tasks only.
- Suggested grouping:
  - no due date,
  - no do date,
  - stale for 7 days,
  - forgotten/open and not touched beyond the chosen threshold,
  - waiting without movement,
  - category accumulation.
- Keep duplicate tasks explainable. A task may appear in more than one reason group, but the UI should not feel punitive.

## UX Notes

- User selected a soft list, quick actions, and very soft tone.
- Copy should avoid blame. Good language: `можно вернуть`, `стоит проверить`, `накопилось`, `без спешки`.
- The review should not compete with top-3 daily focus.
- The review page can show whether it is Monday-oriented while remaining open any day.

## Verification Strategy

- Unit/focused tests for review date helpers and grouping thresholds.
- Playwright coverage for `/review` on desktop and mobile.
- Regression check that Dashboard is not altered into a weekly review.
- Build and typecheck after implementation.

---

*Phase: 06-Soft Reviews*
*Research completed inline because GSD subagents are not installed in this runtime.*
