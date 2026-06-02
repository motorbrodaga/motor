# Phase 6: Soft Reviews - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 6 builds the weekly review system for gently bringing forgotten, stale, unscheduled, and waiting tasks back into attention. It uses the existing `/review` navigation item and should remain separate from the morning Dashboard.

This phase does not add push notifications, calendar integration, Telegram/Gmail intake, completion history, offline sync, backups, contact management, or a new analytics dashboard.

</domain>

<decisions>
## Implementation Decisions

### Weekly Review Shape
- **D-01:** The weekly review should feel like a soft list, not a checklist audit or performance report.
- **D-02:** The main screen should be one calm page with grouped task sections rather than a step-by-step wizard.
- **D-03:** The review is primarily for Mondays, but the user should be able to open it manually from the existing `Обзор` navigation item.

### Review Tone
- **D-04:** The tone should be very soft and pressure-free.
- **D-05:** Copy should use language like `можно вернуть`, `стоит проверить`, `накопилось`, and avoid blame or urgency theater.
- **D-06:** The review should surface tasks without making the user feel forced to process everything immediately.

### Review Actions
- **D-07:** Tasks in the weekly review should support quick actions directly from the review where practical.
- **D-08:** Preferred quick actions are: keep/leave visible, assign a date, mark important, complete, and open the task.
- **D-09:** Full inline task editing is out of scope for Phase 6; if deeper changes are needed, open the task detail page.

### Review Groups
- **D-10:** The review must include forgotten, stale, no-due-date, no-do-date, waiting-without-movement, and category accumulation groups.
- **D-11:** Groups should remain scan-friendly on mobile and may reuse existing task card/list patterns.
- **D-12:** Duplicate tasks across groups are acceptable if it helps explain why the task resurfaced, but the UI should avoid making the same task feel like several unrelated problems.

### Separation From Dashboard
- **D-13:** The weekly review must be visibly separate from the morning Dashboard.
- **D-14:** Dashboard remains the daily focus screen; `/review` becomes the weekly resurfacing screen.
- **D-15:** Review state and copy should not compete with the top-3 daily focus flow.

### The Agent's Discretion
- The agent may choose exact thresholds for "forgotten" and "stale" when requirements do not specify them, but `stale` with no changes for 7 days is locked by `REVW-04`.
- The agent may choose exact section order, empty-state copy, and whether quick actions reuse existing `TaskQuickActions` or a smaller review-specific component.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product And Planning Scope
- `.planning/ROADMAP.md` - Phase 6 goal, requirements, success criteria, and plan placeholders.
- `.planning/REQUIREMENTS.md` - Review requirements `REVW-01` through `REVW-09`.
- `.planning/PROJECT.md` - core value, mobile-first app framing, and soft-review philosophy.
- `.planning/STATE.md` - current position after Phase 5 completion.

### Prior Phase Context
- `.planning/phases/04-daily-focus-dashboard/04-CONTEXT.md` - Dashboard decisions, top-3 focus, and explicit separation from weekly review.
- `.planning/phases/05-waiting-and-people/05-CONTEXT.md` - waiting direction decisions and deferral of heavier weekly review behavior.
- `.planning/phases/05-waiting-and-people/05-VERIFICATION.md` - confirms waiting fields and soft waiting check-in exist.

### Current App Integration Points
- `zadachnik-app/src/app/(app)/review/page.tsx` - current placeholder page for weekly review.
- `zadachnik-app/src/features/shell/nav-items.ts` - existing `Обзор` navigation item.
- `zadachnik-app/src/features/tasks/TaskCard.tsx` - reusable task card display and complete action.
- `zadachnik-app/src/features/tasks/TaskQuickActions.tsx` - existing quick actions for date, importance, notes, and person/waiting metadata.
- `zadachnik-app/src/lib/tasks/task-queries.ts` - shared task include/query helper.
- `zadachnik-app/src/lib/waiting/waiting-tasks.ts` - waiting follow-up helper and waiting direction constants.
- `zadachnik-app/src/lib/dashboard/dashboard-sections.ts` - example of server-side grouped task sections.
- `zadachnik-app/prisma/schema.prisma` - task timestamps, dates, importance, categories, waiting fields, and related models.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `/review` already exists as a placeholder route.
- `TaskCard` and `TaskQuickActions` already provide card display and quick task changes.
- Phase 5 added `waitingDirection`, `responseDueDate`, and `waitingSince`, plus `needsWaitingCheckIn`.
- Dashboard section helpers show the existing pattern for server-side grouping and mobile-friendly section rendering.
- Categories, contexts, projects, dates, importance, urgency, and timestamps already exist on the task model.

### Established Patterns
- Pages load data in server components and use small client components for mutations.
- Russian UI copy is required.
- Mobile-first layouts use full-width sections, compact cards, and calm empty states.
- Tests use Playwright in both desktop and mobile projects.

### Integration Points
- Replace the `/review` placeholder with a grouped weekly review page.
- Add a review helper under `src/lib/review/` or similar, following the dashboard/waiting helper style.
- Reuse task cards and quick actions, or create a smaller review-specific quick-action strip if full quick actions feel too heavy.
- Keep weekly review data separate from daily focus confirmation state.

</code_context>

<specifics>
## Specific Ideas

- User selected `1-1`: weekly review should be a soft list.
- User selected `2-1`: quick actions should be available directly in the review.
- User selected `3-1`: review tone should be very soft.
- Review should remain separate from the morning Dashboard.
- Weekly review should help the user notice accumulated neglected work without pressure.

</specifics>

<deferred>
## Deferred Ideas

- Push notifications for weekly review.
- Calendar integration.
- Analytics/statistics or completion history.
- Full inline task editing inside the review.
- Separate contacts/people directory.

</deferred>

---

*Phase: 6-Soft Reviews*
*Context gathered: 2026-06-03*
