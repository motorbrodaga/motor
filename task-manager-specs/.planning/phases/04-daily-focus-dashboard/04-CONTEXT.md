# Phase 4: Daily Focus Dashboard - Context

**Gathered:** 2026-05-27
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase turns the existing Dashboard into the daily focus screen. It shows what should not be forgotten today: today's tasks, overdue tasks, waiting-related tasks where possible with the current model, important tasks without a due date, category sections, a proposed top-3 focus set, per-task confirmation/replacement, and an "other for today" list.

This phase does not implement the full Phase 5 people/waiting model, weekly review resurfacing, completion history, Telegram/Gmail intake, calendar export, notifications, offline sync, backups, recurrence, subtasks, or multi-user collaboration.

</domain>

<decisions>
## Implementation Decisions

### Dashboard Shape
- **D-01:** The Dashboard remains the first app screen and should become the morning/daily focus surface, not a generic analytics page.
- **D-02:** The screen should be mobile-first, Russian-only, quiet, and scan-friendly.
- **D-03:** The agent may choose the exact layout, but the recommended order is: daily focus/top-3 area first, then "other for today", then supporting sections such as overdue, waiting, important without due date, and categories.
- **D-04:** Empty states should be useful and calm. They should say what is absent and give the user an obvious next action when appropriate, without adding a new onboarding flow.

### Top-3 Suggestions
- **D-05:** Top-3 selection should feel soft: suggestions, not commands.
- **D-06:** Ranking must respect the locked requirements: urgency above importance, extra weight for "someone waits for me" when such a signal exists, overdue tasks included only if important or urgent, and task size must not exclude a task.
- **D-07:** The system should show a short reason on each suggested card, such as `срочно`, `дедлайн сегодня`, `важное`, `просрочено`, or `ждут ответа`.
- **D-08:** Explanations should be short inline labels, not a long scoring breakdown.

### Confirmation And Replacement
- **D-09:** Each of the three suggested main tasks is confirmed separately.
- **D-10:** Unconfirmed top-3 tasks remain suggestions and must not be treated as selected focus tasks.
- **D-11:** The user must be able to manually replace any proposed main task.
- **D-12:** Confirmation and replacement should be available directly from the top-3 cards, with touch-friendly controls.

### Other For Today
- **D-13:** "Other for today" should appear as a list after the three main tasks.
- **D-14:** Other-for-today tasks remain visible so they are not lost, but their visual weight should be lower than the confirmed/proposed top-3.
- **D-15:** The "other for today" list should use existing task-card/list patterns where practical and avoid becoming a second competing focus area.

### Section Coverage
- **D-16:** Dashboard sections must cover today's tasks, overdue tasks, waiting-related tasks, important tasks without a due date, and category sections.
- **D-17:** Because full waiting direction behavior is Phase 5, Phase 4 should use the existing available signal (`status: waiting`, `personLabel`, or equivalent Phase 2 placeholder) and avoid adding the full waiting model early.
- **D-18:** Category sections should help the user see where open work is accumulating, not become a heavy category-management surface.

### The Agent's Discretion
- The user delegated the exact screen structure and empty-state copy to the agent.
- The planner may decide whether focus confirmations need a small persistence model, settings record, or task fields, provided unconfirmed suggestions remain distinct from confirmed focus tasks.
- The planner may decide the exact replacement picker UI, provided it is simple and mobile-friendly.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product And Planning Scope
- `.planning/ROADMAP.md` - Phase 4 goal, requirements, success criteria, and plan placeholders.
- `.planning/REQUIREMENTS.md` - Dashboard requirements `DASH-02` through `DASH-11`.
- `.planning/PROJECT.md` - product identity, core value, Russian/mobile-first framing, soft review philosophy, and out-of-scope items.
- `.planning/STATE.md` - current position after Phase 3 acceptance.

### Prior Phase Context
- `.planning/phases/01-personal-app-shell/01-CONTEXT.md` - Dashboard-first shell, PWA/mobile-first, private-link, and Russian UI decisions.
- `.planning/phases/02-core-task-system/02-CONTEXT.md` - task model, do/due date distinction, importance/urgency, categories, task cards, and quick actions.
- `.planning/phases/03-assistant-capture/03-CONTEXT.md` - quick capture/assistant decisions and explicit deferral of dashboard ranking to Phase 4.
- `.planning/phases/03-assistant-capture/03-VERIFICATION.md` - confirms assistant capture is accepted and available.

### Source Specifications
- `02-requirements.md` - original dashboard and ranking requirements.
- `03-domain-model.md` - task fields used for dashboard grouping and ranking.
- `04-ux-flows.md` - dashboard/morning review and task-card flow references.
- `07-development-brief.md` - compact implementation brief and MVP boundaries.

### Current App Integration Points
- `zadachnik-app/src/app/(app)/dashboard/page.tsx` - current Dashboard route entry.
- `zadachnik-app/src/features/dashboard/DashboardHome.tsx` - current Dashboard content to replace/extend.
- `zadachnik-app/src/features/tasks/TaskCard.tsx` - existing task card display pattern.
- `zadachnik-app/src/features/tasks/TaskList.tsx` - existing list pattern for groups of tasks.
- `zadachnik-app/src/features/tasks/TaskQuickActions.tsx` - existing card action pattern to preserve.
- `zadachnik-app/src/lib/tasks/task-queries.ts` - existing task include/query helpers.
- `zadachnik-app/src/lib/tasks/task-validation.ts` - existing task field validation helpers.
- `zadachnik-app/prisma/schema.prisma` - current task fields and available persistence model.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `DashboardHome` already queries open, inbox, important, and preview tasks; Phase 4 can replace these simple counters with richer dashboard sections.
- `TaskCard` and `TaskList` already provide task-card/list presentation for mobile-friendly task groups.
- `TaskQuickActions` already covers card-level actions such as complete, reschedule, importance, note, and person assignment.
- `taskInclude` in `task-queries.ts` provides category, project, and context data needed for dashboard cards.
- The Prisma `Task` model already has `status`, `importance`, `isUrgent`, `dueDate`, `doDate`, `estimatedMinutes`, `personLabel`, and `categoryId`.

### Established Patterns
- The app uses Next.js App Router server components for page-level data loading and client components for interactive card actions.
- Mutations use protected API routes and then refresh the route.
- UI is Russian-only and mobile-first, with global CSS class patterns rather than a separate component library.
- Existing tests use Playwright with desktop and mobile projects.

### Integration Points
- Add dashboard query/ranking helpers under `src/lib/tasks/` or a dashboard-specific library module.
- Extend `DashboardHome` with top-3 suggestions, confirmation/replacement controls, and sectioned task groups.
- Add persistence only if needed to distinguish confirmed focus tasks from suggestions.
- Add Playwright coverage for the dashboard sections, top-3 suggestion state, per-card confirmation, manual replacement, and "other for today".

</code_context>

<specifics>
## Specific Ideas

- User wants top-3 selection to be soft, not a hard command from the system.
- User wants each of the three main tasks confirmed individually.
- User wants "other for today" as a list after the three main tasks.
- User chose short inline reasons on suggested cards so the ranking feels transparent.
- User left the exact dashboard structure to the agent, with the expectation that the top-3 stays primary and the rest remains visible.

</specifics>

<deferred>
## Deferred Ideas

- Full waiting-direction model remains Phase 5.
- Weekly review and stale/forgotten task resurfacing remain Phase 6.
- Completion history and statistics remain Phase 7.
- Telegram/Gmail intake remains Phase 8.
- Calendar export and push notifications remain Phase 9.
- Offline sync, conflicts, and backups remain Phase 10.

</deferred>

---

*Phase: 4-Daily Focus Dashboard*
*Context gathered: 2026-05-27*
