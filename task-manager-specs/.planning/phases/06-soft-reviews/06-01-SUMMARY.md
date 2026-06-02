---
phase: 06-soft-reviews
plan: 01
subsystem: review
tags: [weekly-review, resurfacing, tasks]

provides:
  - Weekly review helper foundation
  - Monday week-start calculation
  - No-due-date and no-do-date review groups
affects: [review-page, task-grouping]

key-files:
  created:
    - zadachnik-app/src/lib/review/weekly-review.ts
    - zadachnik-app/tests/weekly-review-helper.spec.ts
  modified:
    - zadachnik-app/src/features/tasks/task-types.ts

requirements-completed: [REVW-01, REVW-05, REVW-06, REVW-09]
completed: 2026-06-03
---

# Phase 06 Plan 01: Review Foundation Summary

Weekly review now has a reusable helper that calculates Monday-based review windows and groups open tasks without due dates or do dates.

## Verification

- `npm run typecheck` passed.
- Weekly review helper tests passed on desktop and mobile projects.

