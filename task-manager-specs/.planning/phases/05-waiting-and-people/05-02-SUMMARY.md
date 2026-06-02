---
phase: 05-waiting-and-people
plan: 02
subsystem: ui
tags: [waiting, dashboard, task-card, playwright]

requires:
  - plan: 05-01
    provides: Waiting task fields and API support
provides:
  - Grouped waiting screen
  - Derived waiting query helper
  - Dashboard waiting rule aligned with direction fields
affects: [waiting-page, dashboard, task-ui]

tech-stack:
  added: []
  patterns:
    - Server-side section helpers feeding mobile-first task lists
    - Derived waiting state from person plus direction

key-files:
  created:
    - zadachnik-app/src/lib/waiting/waiting-tasks.ts
    - zadachnik-app/tests/waiting-screen.spec.ts
  modified:
    - zadachnik-app/src/app/(app)/waiting/page.tsx
    - zadachnik-app/src/lib/dashboard/dashboard-sections.ts
    - zadachnik-app/src/features/dashboard/DashboardHome.tsx
    - zadachnik-app/src/app/globals.css
    - zadachnik-app/tests/dashboard-sections.spec.ts

requirements-completed: [WAIT-01, WAIT-02, WAIT-03, WAIT-05]
completed: 2026-06-02
---

# Phase 05 Plan 02: Waiting Screen Summary

The placeholder `Ожидания` screen is now a real grouped view for people-related waiting tasks.

## Accomplishments

- Added a reusable waiting helper that returns open tasks with both person and waiting direction.
- Split the waiting screen into `ждут от меня`, `я жду`, and soft check-in sections.
- Displayed the separate response due date through task cards.
- Updated Dashboard waiting logic so a person label alone no longer counts as waiting.
- Added desktop and mobile coverage for the waiting page and Dashboard waiting section.

## Verification

- Waiting screen Playwright coverage passed on desktop and mobile.
- Dashboard section coverage passed on desktop and mobile.

