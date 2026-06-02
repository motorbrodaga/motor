---
phase: 06-soft-reviews
plan: 02
subsystem: review
tags: [stale-tasks, forgotten-tasks, waiting]

provides:
  - Stale task grouping
  - Forgotten task grouping
  - Waiting-without-movement grouping
affects: [review-page, waiting-regression]

key-files:
  modified:
    - zadachnik-app/src/lib/review/weekly-review.ts
    - zadachnik-app/tests/weekly-review-helper.spec.ts

requirements-completed: [REVW-03, REVW-04, REVW-07]
completed: 2026-06-03
---

# Phase 06 Plan 02: Stale Forgotten Waiting Summary

Weekly review now includes stale tasks, forgotten tasks, and waiting items that have not moved for a week or more.

## Verification

- Weekly review helper tests passed.
- Phase 5 waiting regression tests passed.

