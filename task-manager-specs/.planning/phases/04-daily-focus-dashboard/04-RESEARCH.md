# Phase 4: Daily Focus Dashboard - Research

**Researched:** 2026-05-27
**Status:** Ready for planning

## Scope

Phase 4 turns the current Dashboard into the daily focus surface. It must show dashboard sections, propose three main tasks, allow per-task confirmation and manual replacement, keep unconfirmed suggestions separate from selected focus tasks, and keep "other for today" visible after the main three.

## Current Codebase Findings

### Dashboard Entry

- `zadachnik-app/src/app/(app)/dashboard/page.tsx` renders `DashboardHome`.
- `zadachnik-app/src/features/dashboard/DashboardHome.tsx` currently shows counts and the three most recently created open tasks.
- `QuickCaptureEntry` already belongs at the top of the Dashboard and should remain reachable.

### Task Model Signals Available Now

- `Task.doDate` identifies the day the user plans to work on a task.
- `Task.dueDate` identifies the deadline.
- `Task.importance` is `normal` or `important`.
- `Task.isUrgent` is binary and must outrank importance in top-3 ranking.
- `Task.status` can be `waiting`; this can serve as a Phase 4 waiting signal until Phase 5 introduces richer waiting directions.
- `Task.personLabel` can serve as the lightweight "someone may be waiting" signal already created in Phase 2.
- `Task.estimatedMinutes` exists, but requirement `DASH-11` says size must not exclude a task from suggestions.

### Existing UI Patterns

- `TaskCard` is a client component with complete/reschedule/importance/note/person quick actions.
- `TaskList` already handles empty states for task groups.
- `TaskQuickActions` follows the existing mutation + `router.refresh()` pattern.
- Dashboard can use server-side queries and pass serialized task views into client components when interaction is needed.

### Persistence Options For Focus Confirmation

1. **Use `AppSetting` JSON**: quickest and no migration, but awkward for per-slot task relations and harder to query/test.
2. **Add a `DailyFocusSelection` table**: more explicit and durable; supports one row per date/slot, task relation, confirmation timestamp, replacement, and cleanup if a task is archived.

Recommendation: use a small relational `DailyFocusSelection` model. It keeps confirmed focus tasks clearly separate from unconfirmed suggestions, which is central to `DASH-06`.

## Proposed Implementation Strategy

### Dashboard Sections

Build dashboard query helpers that return:

- today tasks: open tasks with `doDate` equal to today;
- overdue tasks: open tasks with `dueDate` before today;
- waiting tasks: open tasks with `status = waiting` or non-empty `personLabel`;
- important without due date: open important tasks with no `dueDate`;
- category sections: open task counts and recent tasks grouped by category;
- other for today: today tasks not currently occupying confirmed/proposed top-3 slots.

### Ranking Rules

Use deterministic scoring and always return a reason list. Suggested priority:

1. urgent tasks;
2. due today / overdue when important or urgent;
3. waiting/person tasks;
4. important tasks;
5. planned for today;
6. older created tasks as tie-breaker.

Overdue tasks that are neither important nor urgent should be visible in the overdue section but excluded from top-3 suggestions.

### Confirmation Contract

- Suggestions are generated each request.
- Confirmed tasks are stored in `DailyFocusSelection`.
- Unconfirmed suggestions are not stored and not treated as selected.
- Replacing a slot should write the selected replacement into that slot as confirmed, or present a short list of candidate tasks and confirm the chosen one in one action.

### Testing

Add focused Playwright coverage for:

- dashboard sections and empty states;
- top-3 suggestions and reason labels;
- urgency outranking importance;
- overdue exclusion unless important/urgent;
- confirming one task without confirming the whole set;
- replacing a suggested task;
- other-for-today list after the top three;
- mobile visibility/no overlap for the focus area.

## Risks

- Adding a Prisma model requires updating both `prisma/schema.prisma` and the custom SQLite init path.
- Existing tests reset task data but may not clear new focus-selection rows unless helper cleanup is updated.
- Waiting requirements are only partially available until Phase 5; plan must explicitly avoid building the full waiting model early.

## Research Complete

The phase can be planned as four waves:

1. Dashboard sections and query helpers.
2. Top-3 ranking and reason labels.
3. Per-task focus confirmation and replacement persistence.
4. Mobile polish and full Phase 4 verification.
