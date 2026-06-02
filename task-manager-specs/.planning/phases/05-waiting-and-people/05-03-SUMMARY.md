---
phase: 05-waiting-and-people
plan: 03
subsystem: waiting
tags: [waiting, follow-up, dashboard, playwright]

requires:
  - plan: 05-01
    provides: waitingSince field
  - plan: 05-02
    provides: Waiting screen sections
provides:
  - Soft one-week check-in for undated `я жду` tasks
  - Updated daily focus ranking that no longer boosts every person task
affects: [waiting-page, dashboard-ranking]

tech-stack:
  added: []
  patterns:
    - Date-threshold helper tested independently
    - Soft resurfacing kept local to the relevant page

key-files:
  created:
    - zadachnik-app/tests/waiting-followup.spec.ts
  modified:
    - zadachnik-app/src/lib/waiting/waiting-tasks.ts
    - zadachnik-app/src/app/(app)/waiting/page.tsx
    - zadachnik-app/src/lib/dashboard/focus-ranking.ts
    - zadachnik-app/tests/dashboard-focus-ranking.spec.ts

requirements-completed: [WAIT-02, WAIT-04, WAIT-05]
completed: 2026-06-02
---

# Phase 05 Plan 03: Soft Follow-up Summary

Undated `я жду` tasks now return softly on the waiting screen after one week, without adding notifications or Dashboard pressure.

## Accomplishments

- Added `needsWaitingCheckIn` using `waitingSince` and a seven-day threshold.
- Kept the check-in behavior local to `/waiting`.
- Updated daily focus ranking so only `ждут от меня` with a response date can influence focus reasons.
- Added focused tests for new, dated, and seven-day waiting cases.

## Verification

- Waiting follow-up tests passed.
- Dashboard focus ranking tests passed on desktop and mobile.
- `npm run build` passed.

