# Phase 2: Core Task System - Context

**Gathered:** 2026-05-22
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase turns the Phase 1 shell into a real personal task manager. It delivers task persistence, creation, editing, completion, deletion/technical archive, task status, scheduling fields, importance/urgency, estimated and actual time, description, note feed, categories, contexts, lightweight projects, and task-card quick actions.

This phase does not implement assistant-dialog task creation, Telegram/Gmail intake, Dashboard top-3 ranking, people/waiting workflows, completion history screens, calendar export, push notifications, offline sync, conflict handling, backups, recurrence, subtasks, attachments, tags, or multi-user collaboration.

</domain>

<decisions>
## Implementation Decisions

### Task Lifecycle
- **D-01:** Use the task statuses already defined in requirements and domain docs: `inbox`, `todo`, `in_progress`, `waiting`, `done`, plus technical hiding through `archivedAt` or equivalent hidden state.
- **D-02:** New manual quick-created tasks default to `inbox` unless the user explicitly chooses another status/list during creation.
- **D-03:** `done` is the normal completed state. Completion should set `completedAt` and preserve enough task data for later history phases.
- **D-04:** Delete/archive should be a quiet technical hide in the MVP UI, not a separate archive product surface. Prefer soft deletion/archival over hard deletion unless the planner identifies a narrow safe need for permanent delete.
- **D-05:** `blocked` is out of scope; blocks are represented later through `waiting`.

### Task Fields And Creation Form
- **D-06:** The fastest creation path should require only `title`. It must be faster than opening notes and writing a thought down.
- **D-07:** Unknown fields may remain empty after user confirmation. Do not force project, due date, do date, priority, time estimate, context, or description at creation.
- **D-08:** Keep `dueDate` and `doDate` distinct: `dueDate` is the deadline, `doDate` is the day the user plans to work on the task.
- **D-09:** Importance and urgency are separate fields. Importance starts with `normal` and `important`; urgency is binary `isUrgent`.
- **D-10:** Estimated time and actual time are manual numeric minute values. Do not add a start/stop timer in this phase.
- **D-11:** Description is a separate editable field. Notes are a chronological feed, not a single overwritten notes field.
- **D-12:** The primary create/edit UI should be mobile-first: title and save are prominent; advanced fields are grouped behind a detail area or progressive sections to avoid slowing capture.

### Organization
- **D-13:** Categories are the primary organization tool in MVP. Seed defaults: work, personal, calls, household. The user can create custom categories.
- **D-14:** Categories have visible colors and should be usable as scan-friendly labels on task cards and filters.
- **D-15:** Contexts are separate from categories and can be many-to-many on tasks. Seed defaults: call, computer, home, on the go, with person. The user can create custom contexts.
- **D-16:** Projects are lightweight and optional. A task may have zero or one project. Projects should not introduce heavy methodology, project dashboards, milestones, or team workflow in Phase 2.
- **D-17:** Tags remain out of scope for v1. Do not add a tag model as a substitute for categories or contexts.

### Task Cards And Quick Actions
- **D-18:** Task cards should show the title, status, category color, due/do date signals when present, importance/urgency signals when present, and enough metadata to scan quickly on a phone without visual overload.
- **D-19:** Quick actions in Phase 2: complete, reschedule, change importance, add note, and assign person placeholder if the data model needs it for later waiting phases. Full waiting behavior remains Phase 5.
- **D-20:** Reschedule quick options are tomorrow, in a week, and choose date. This updates `doDate` by default unless the UI explicitly says the deadline is being changed.
- **D-21:** Completing a task should be available directly from the card and from task details.
- **D-22:** Adding a note should append to the notes feed with timestamp; notes should be visible in task details and prepared for later history/review use.

### Screens And Navigation
- **D-23:** Reuse Phase 1 protected shell and Russian navigation. The Inbox page becomes the primary list for uncategorized/new tasks; Dashboard should show real task summaries only where Phase 2 can do so without implementing Phase 4 ranking.
- **D-24:** The More section may expose management screens for categories, contexts, and lightweight projects if needed, but must not add separate "All tasks" or "Categories" nav entries that contradict Phase 1 MVP navigation decisions.
- **D-25:** Keep visible UI Russian-only.

### Data And Implementation Constraints
- **D-26:** Extend the existing Prisma/SQLite foundation rather than introducing another persistence stack.
- **D-27:** Use structured relational tables for tasks, categories, contexts, projects, task notes, and join tables where needed. Avoid JSON blobs for core task data unless they are clearly temporary metadata.
- **D-28:** Maintain the existing private-link session boundary for all task APIs and pages.
- **D-29:** Preserve Phase 1's `ShellEvent` only as shell telemetry. Real task creation must use new task tables, not `ShellEvent`.
- **D-30:** Update the custom SQLite migration/init path if Prisma's native migrate flow remains unreliable on this Windows/OneDrive setup.

### The Agent's Discretion
- The user selected "trust me" for Phase 2 gray areas. The planner and executor may choose the exact screen decomposition, component names, route structure, form layout, query/API boundaries, and validation library if they preserve the decisions above.
- The planner may split implementation across data model, CRUD APIs, list/detail UI, organization management, and quick actions in whatever order best reduces risk.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product And Planning Scope
- `.planning/ROADMAP.md` - Phase 2 goal, requirements, success criteria, and five plan placeholders.
- `.planning/REQUIREMENTS.md` - Phase 2 task and organization requirements: `TASK-01` through `TASK-16`, `ORGN-01` through `ORGN-07`.
- `.planning/PROJECT.md` - product identity, MVP boundaries, Russian/mobile-first framing, and out-of-scope items.
- `.planning/STATE.md` - current phase position and Phase 1 completion state.

### Prior Phase Context
- `.planning/phases/01-personal-app-shell/01-CONTEXT.md` - locked decisions for PWA, private link, Dashboard-first shell, Russian UI, and storage foundation.
- `.planning/phases/01-personal-app-shell/01-VERIFICATION.md` - confirms Phase 1 shell, private access, and quick capture entry are working.
- `.planning/phases/01-personal-app-shell/01-04-SUMMARY.md` - documents quick capture placeholder and shell-event behavior that Phase 2 replaces with real task creation.

### Source Specifications
- `02-requirements.md` - original task and organization requirements.
- `03-domain-model.md` - preliminary task, project, category, context, task note, task source, status, importance, and urgency model.
- `04-ux-flows.md` - quick add, task card, inbox review, project, mobile navigation, and interface principles.
- `05-tech-decisions.md` - technical framing and deferred integration notes.
- `07-development-brief.md` - compact summary of task fields, categories, contexts, quick actions, and out-of-scope boundaries.

### Codebase Maps And Current App
- `.planning/codebase/STACK.md` - repository/runtime context; note the app now lives in `zadachnik-app/`.
- `.planning/codebase/ARCHITECTURE.md` - planning artifact conventions and GSD workflow context.
- `.planning/codebase/CONVENTIONS.md` - artifact and security conventions to preserve.
- `zadachnik-app/prisma/schema.prisma` - current Prisma schema with access/session foundation and `ShellEvent`.
- `zadachnik-app/src/features/capture/QuickCapturePanel.tsx` - Phase 1 quick capture placeholder to convert into real task creation.
- `zadachnik-app/src/features/dashboard/DashboardHome.tsx` - Dashboard shell entry that can begin showing real task data without Phase 4 ranking.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `zadachnik-app/src/lib/db.ts` exposes the shared Prisma client.
- `zadachnik-app/src/middleware.ts` and session helpers protect app routes; task APIs and pages should use the same session model.
- `zadachnik-app/src/features/shell/*` provides the protected responsive shell, Russian nav, and mobile bottom navigation.
- `zadachnik-app/src/features/capture/QuickCaptureEntry.tsx` and `QuickCapturePanel.tsx` already give a mobile quick-capture surface.
- `zadachnik-app/tests/helpers/access.ts` provides private-link setup helpers for Playwright tests.

### Established Patterns
- App code uses Next.js App Router, TypeScript, Prisma Client, Playwright E2E, and CSS classes in `globals.css`.
- Phase 1 prefers server routes/API endpoints with protected sessions over client-only state.
- Tests run with desktop and iPhone-like Playwright projects; viewport-specific skips are already used where appropriate.
- Prisma native migrate was unreliable in the Windows/OneDrive path, so `scripts/init-db.mjs` and SQL migration files are part of the persistence workflow.

### Integration Points
- Replace the quick capture placeholder submit with real task creation.
- Update Inbox, Dashboard, and possibly More pages to display or manage real task data.
- Extend Prisma schema and custom migration/init SQL for tasks and organization tables.
- Add API routes or server actions for task CRUD and quick actions, guarded by the existing session.
- Expand E2E tests from shell smoke tests to real create/edit/complete/reschedule/note flows.

</code_context>

<specifics>
## Specific Ideas

- User chose the agent's recommended defaults for all Phase 2 gray areas.
- Keep capture fast: title-first, optional fields later.
- Keep the product quiet and utilitarian, not a heavy project-management tool.
- Use the existing Russian labels and mobile shell rather than introducing a new navigation model.

</specifics>

<deferred>
## Deferred Ideas

- Assistant clarification and confirmed assistant-created tasks remain Phase 3.
- Dashboard top-3 ranking, morning focus confirmation, and "other for today" behavior remain Phase 4.
- People/waiting direction behavior remains Phase 5, even if the Phase 2 data model leaves a safe integration point.
- Completion history screens and statistics remain Phase 7.
- Telegram/Gmail intake and source conversion remain Phase 8.
- Calendar export remains Phase 9.
- Offline sync, conflict handling, and backups remain Phase 10.
- Recurrence, subtasks, attachments, tags, and collaboration remain out of scope for Phase 2.

</deferred>

---

*Phase: 2-Core Task System*
*Context gathered: 2026-05-22*
