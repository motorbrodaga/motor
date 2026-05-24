# Phase 2: Core Task System - Research

**Researched:** 2026-05-24
**Phase:** 2 - Core Task System
**Mode:** MVP
**Status:** Ready for UI contract gate

## Research Summary

Phase 2 should extend the existing Next.js App Router, Prisma, SQLite, private-link session, and Russian mobile shell from Phase 1. The work is best split into a persistence foundation, task CRUD, scheduling/metadata, organization entities, and task-card quick actions with notes.

The main implementation risk is scope creep around people/waiting behavior. Phase 2 requires an "assign person" quick action, but Phase 5 owns waiting direction, response due dates, follow-up resurfacing, and the Waiting screen behavior. The safest Phase 2 interpretation is a lightweight person assignment field or minimal neutral person reference that does not implement waiting workflows.

## Existing Foundation

- `zadachnik-app/prisma/schema.prisma` currently contains only access/session settings and `ShellEvent`.
- `zadachnik-app/src/lib/db.ts` exposes the shared Prisma client.
- `zadachnik-app/src/middleware.ts` and session helpers already protect app routes.
- `zadachnik-app/src/features/shell/*` provides the protected responsive shell with Russian navigation and mobile bottom nav.
- `zadachnik-app/src/features/capture/QuickCapturePanel.tsx` is the Phase 1 placeholder most directly connected to fast task creation.
- `zadachnik-app/src/features/dashboard/DashboardHome.tsx` can show real task counts and simple lists without implementing Phase 4 ranking.
- `zadachnik-app/tests/helpers/access.ts` already knows how to create private access for Playwright tests.
- Native Prisma migration was previously unreliable in this Windows/OneDrive path, so Phase 2 must update the custom SQLite migration/init path together with Prisma schema changes.

## Data Model Direction

Use structured relational tables rather than JSON blobs for core data.

Recommended models:

- `Task`
  - `id`
  - `title`
  - `description`
  - `status`: `inbox`, `todo`, `in_progress`, `waiting`, `done`
  - `importance`: `normal`, `important`
  - `isUrgent`
  - `dueDate`
  - `doDate`
  - `estimatedMinutes`
  - `actualMinutes`
  - `categoryId`
  - `projectId`
  - lightweight person assignment field or relation
  - `completedAt`
  - `archivedAt`
  - `createdAt`
  - `updatedAt`

- `Category`
  - `id`
  - `name`
  - `color`
  - `systemDefault`
  - `archivedAt`
  - timestamps

- `Context`
  - `id`
  - `name`
  - `systemDefault`
  - `archivedAt`
  - timestamps

- `TaskContext`
  - `taskId`
  - `contextId`

- `Project`
  - `id`
  - `name`
  - `description`
  - `archivedAt`
  - timestamps

- `TaskNote`
  - `id`
  - `taskId`
  - `body`
  - timestamps

For the person quick action, prefer one of these scoped choices:

- `Task.personLabel` as a simple optional text value for Phase 2.
- Or a minimal `Person` table with only `id`, `name`, `archivedAt`, and timestamps.

Do not add waiting direction, waiting follow-up dates, response due dates, person dashboards, or waiting-derived behavior in Phase 2.

## Default Seeds

Seed these on database init if missing:

- Categories: `Работа`, `Личное`, `Звонки`, `Дом`
- Contexts: `Звонок`, `Компьютер`, `Дом`, `В дороге`, `С человеком`

Category colors should be stable and visibly distinct on task cards and filters. Use explicit stored color values so later custom categories can remain user-controlled.

## Persistence And Migration

Phase 2 must update both:

- Prisma schema
- Custom SQLite migration/init path

The migration should be idempotent at the application setup level and deterministic for fresh installs. It should create task and organization tables, indexes for open-task queries, and seed default categories/contexts. The init script should apply ordered migrations rather than only a one-off SQL file if it does not already do so.

Recommended verification:

- Validate Prisma schema.
- Generate Prisma client.
- Apply the custom SQLite migration/init flow on a clean database.
- Confirm default categories and contexts exist after init.
- Run typecheck, build, and Playwright flows.

## API And Session Boundary

Use the existing private-link session boundary for every task-related page and API route.

Recommended route groups:

- `/api/tasks`
- `/api/tasks/[id]`
- `/api/tasks/[id]/notes`
- `/api/categories`
- `/api/contexts`
- `/api/projects`

PATCH-style task updates are enough for status, completion, archive, scheduling, importance, urgency, category, project, context, and person assignment changes. Dedicated quick-action endpoints are optional; the important contract is that quick actions reuse the same validation and session checks as normal editing.

Real task creation must write to `Task`, not `ShellEvent`. `ShellEvent` may remain telemetry only.

## UI Direction

Phase 2 should reuse the Phase 1 shell and avoid adding top-level nav items that contradict the locked mobile nav: Dashboard, Inbox, Waiting, Review, More.

Recommended screens:

- Dashboard: real task summary counts and a small recent/open preview only. No top-3 ranking.
- Inbox: primary open task list and fast creation path.
- Task details/edit surface: full field editing, notes feed, and completion/archive actions.
- More: entry points for category, context, and project management if needed.

Mobile-first form behavior:

- Title and save action are immediate.
- Advanced details are grouped below the fast capture path.
- Unknown fields remain empty.
- Due date and do date are visibly separate.
- Importance and urgency are separate controls.
- Estimated and actual time are plain minute inputs.
- Notes append chronologically and do not overwrite description.

Task-card behavior:

- Show title, status, category color, due/do signals, importance, urgency, and quick actions without visual overload.
- Quick actions: complete, reschedule, change importance, add note, assign person.
- Reschedule changes `doDate` by default with options for tomorrow, in a week, and custom date.

UI controls should use normal app controls: icon buttons where obvious, swatches for category colors, segmented controls for status/importance, toggles for urgency, date inputs for scheduling, numeric inputs for minutes, and menus/selects for category/project/context. Keep visible UI Russian-only.

## Test Strategy

Required Playwright coverage should include:

- Private-link access still gates the task app.
- Fast task creation from a short title.
- New manual tasks default to Inbox.
- Editing status, importance, urgency, due date, do date, estimated minutes, actual minutes, and description.
- Completing a task sets it to done and hides or separates it from active open lists as designed.
- Archive/delete hides a task without hard deletion.
- Notes append with visible chronological history.
- Default categories and contexts are present.
- Custom category/context/project creation works.
- Task card quick actions complete, reschedule, change importance, add note, and assign person.
- Mobile viewport remains usable with the bottom nav and task controls.

Unit-level or integration tests are useful for date/status helpers if those helpers become non-trivial, but Phase 2's highest-value verification is end-to-end because it is primarily user workflow and persistence behavior.

## Planning Implications

The existing five plan placeholders are good and should remain:

- `02-01`: data model, migrations, seeds, Prisma client, and verification hooks.
- `02-02`: task CRUD, status, completion, archive/delete, and protected APIs/pages.
- `02-03`: due/do dates, importance, urgency, estimated/actual minutes, and description editing.
- `02-04`: categories, contexts, lightweight projects, management UI, and task associations.
- `02-05`: task-card quick actions, notes feed, and final mobile polish.

`02-01` must be blocking for all later work because all later plans depend on the real task tables and generated client. `02-05` should run after the CRUD and organization plans because quick actions touch most of the finished task surface.

## Open Risks

- UI-SPEC is required by the current GSD UI safety gate and is not present for Phase 2 yet.
- The person quick action must be narrowly scoped so it satisfies Phase 2 without implementing Phase 5 waiting workflows early.
- The custom SQLite migration path must be updated carefully to avoid breaking existing private-link access state.
- Dashboard must stay intentionally modest in Phase 2 and avoid Phase 4 ranking behavior.

