# Phase 7: Completion History - Research

**Date:** 2026-06-03
**Mode:** Inline research because GSD subagents are not installed in this runtime.

## Scope

Phase 7 adds a lightweight memory of completed work: today, yesterday, this week, counts, category distribution, and optional actual time spent.

## Existing Foundation

- `zadachnik-app/prisma/schema.prisma` already has `Task.completedAt` and `Task.actualMinutes`, so this phase should not need a schema migration for the core MVP.
- `zadachnik-app/src/features/tasks/task-types.ts` already exposes `completedAt` and `actualMinutes` on `TaskView`.
- `zadachnik-app/src/app/api/tasks/[id]/route.ts` already supports patching task fields through the shared validation layer; implementation should extend validation only if needed.
- `zadachnik-app/src/lib/review/weekly-review.ts` provides a useful date-bucketing precedent for helper-first logic.
- `zadachnik-app/src/app/(app)/more/page.tsx` and `zadachnik-app/src/app/(app)/review/page.tsx` are the likely navigation entry points.

## Implementation Direction

1. Build a dedicated history helper under `src/lib/history/`.
2. Query completed, unarchived tasks ordered by `completedAt` descending.
3. Group visible history into day sections:
   - today
   - yesterday
   - this week
4. Compute summary statistics from the same completed-task set:
   - task count
   - category distribution
   - total actual minutes entered
5. Add a history screen reachable from "More" and from the review screen.
6. Add optional actual-time entry as a later action, not as an interruption when completing a task.

## Risks

- Existing task completion behavior may mark status as `done` without setting `completedAt`; Phase 7 must normalize this path.
- `actualMinutes` validation must remain forgiving enough for mobile entry but strict enough to avoid negative or invalid values.
- History should not clutter the Dashboard or turn review into a reporting screen.

## Verification Focus

- Unit tests for date grouping and statistics.
- API/client tests for actual-time patching and completion timestamp behavior.
- Screen tests for mobile-visible history entry points and day-based completed task sections.

