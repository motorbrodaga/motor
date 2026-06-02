---
phase: 05-waiting-and-people
plan: 01
subsystem: tasks
tags: [tasks, waiting, prisma, ui]

requires:
  - phase: 02-core-task-system
    provides: Task schema, task edit form, quick actions, and task cards
provides:
  - Waiting-direction fields on tasks
  - Separate response due date field
  - Stable waiting-since timestamp
  - Task form, quick action, and card support for waiting metadata
affects: [task-model, task-ui, task-api]

tech-stack:
  added: []
  patterns:
    - Nullable Prisma task fields for MVP metadata
    - Centralized task patch validation
    - Existing TaskCard signal chips extended for new task metadata

key-files:
  created:
    - zadachnik-app/prisma/migrations/20260602000000_waiting_people/migration.sql
  modified:
    - zadachnik-app/prisma/schema.prisma
    - zadachnik-app/src/lib/tasks/task-validation.ts
    - zadachnik-app/src/app/api/tasks/route.ts
    - zadachnik-app/src/app/api/tasks/[id]/route.ts
    - zadachnik-app/src/features/tasks/TaskForm.tsx
    - zadachnik-app/src/features/tasks/TaskQuickActions.tsx
    - zadachnik-app/src/features/tasks/TaskCard.tsx
    - zadachnik-app/src/features/tasks/task-types.ts
    - zadachnik-app/src/features/tasks/task-formatters.ts
    - zadachnik-app/tests/task-fields.spec.ts

requirements-completed: [WAIT-01, WAIT-02, WAIT-05]
completed: 2026-06-02
---

# Phase 05 Plan 01: Waiting Fields Summary

Task records now support plain-text people plus explicit waiting direction without introducing a contacts model.

## Accomplishments

- Added `waitingDirection`, `responseDueDate`, and `waitingSince` to the task schema and migration history.
- Extended task validation and create/update API paths for waiting metadata.
- Preserved `waitingSince` across normal edits, updating it only when the direction is first set or changed.
- Added Russian controls to the task form and quick actions.
- Extended task cards with direction and response-date signals.

## Verification

- `npm run typecheck` passed.
- Focused Playwright task field coverage passed on desktop and mobile.

