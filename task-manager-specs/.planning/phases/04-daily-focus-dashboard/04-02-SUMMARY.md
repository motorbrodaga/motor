---
phase: 04-daily-focus-dashboard
plan: 02
subsystem: ui
tags: [dashboard, focus-ranking, playwright]

requires:
  - phase: 04-daily-focus-dashboard
    provides: Dashboard sections and card-ready task groups
provides:
  - Deterministic daily focus ranking with short Russian reason labels
  - Soft top-3 suggestions on the Dashboard
  - Other-for-today list immediately after the suggestions
affects: [daily-focus-dashboard, dashboard-tests]

tech-stack:
  added: []
  patterns:
    - Pure ranking helper separate from Dashboard rendering
    - Suggestion-oriented focus UI without confirmation persistence

key-files:
  created:
    - zadachnik-app/src/lib/dashboard/focus-ranking.ts
    - zadachnik-app/src/features/dashboard/DailyFocusSuggestions.tsx
    - zadachnik-app/tests/dashboard-focus-ranking.spec.ts
  modified:
    - zadachnik-app/src/lib/dashboard/dashboard-sections.ts
    - zadachnik-app/src/features/dashboard/DashboardHome.tsx
    - zadachnik-app/src/app/globals.css
    - zadachnik-app/tests/dashboard-sections.spec.ts

key-decisions:
  - "Top-3 tasks are rendered as suggestions only; confirmation remains deferred to 04-03."
  - "Overdue normal non-urgent tasks stay visible in the overdue section but are excluded from top-3 suggestions."
  - "Estimated size is not used as an exclusion filter."

patterns-established:
  - "Daily focus ranking returns suggestions plus otherForToday from the same deterministic helper."
  - "Reason labels remain compact inline chips rather than long score explanations."

requirements-completed: [DASH-03, DASH-07, DASH-08, DASH-09, DASH-10, DASH-11]

duration: 7 min
completed: 2026-06-01
---

# Phase 04 Plan 02: Daily Focus Suggestions Summary

**Dashboard now proposes a soft top-3 focus set with reason chips and keeps remaining today work visible below it.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-01T17:33:45Z
- **Completed:** 2026-06-01T17:40:53Z
- **Tasks:** 4
- **Files modified:** 7

## Accomplishments

- Added `rankDailyFocusTasks` for deterministic top-3 suggestions, reason labels, and other-for-today calculation.
- Added the `DailyFocusSuggestions` Dashboard block above supporting sections.
- Added E2E coverage for urgency over importance, waiting/person weighting, overdue exclusion rules, size non-exclusion, and other-for-today order.

## Task Commits

1. **Tasks 1-4: Ranking helper, focus UI, other-for-today, and tests** - `a9a6dac` (feat)

**Plan metadata:** pending in this commit

## Files Created/Modified

- `zadachnik-app/src/lib/dashboard/focus-ranking.ts` - Pure daily focus ranking and reason-label helper.
- `zadachnik-app/src/features/dashboard/DailyFocusSuggestions.tsx` - Soft top-3 and other-for-today UI.
- `zadachnik-app/src/lib/dashboard/dashboard-sections.ts` - Adds open task data for ranking.
- `zadachnik-app/src/features/dashboard/DashboardHome.tsx` - Places focus suggestions before supporting sections.
- `zadachnik-app/src/app/globals.css` - Adds focus area styling.
- `zadachnik-app/tests/dashboard-focus-ranking.spec.ts` - Covers ranking and other-for-today behavior.
- `zadachnik-app/tests/dashboard-sections.spec.ts` - Updated selectors for the expanded Dashboard.

## Decisions Made

- Suggestions explicitly say they are only proposals, so they do not imply selected focus tasks before 04-03 persistence exists.
- Overdue normal non-urgent tasks are excluded from top-3 but remain visible in the overdue section.
- The other-for-today list is lower-weight and placed inside the focus block directly after the suggestions.

## Deviations from Plan

None - plan executed exactly as written.

---

**Total deviations:** 0 auto-fixed.
**Impact on plan:** No scope change.

## Issues Encountered

- Tests needed selector refinements because some task titles now correctly appear in both focus suggestions and supporting sections.

## User Setup Required

None - no external service configuration required.

## Self-Check: PASSED

- `npm run typecheck` passed.
- `npm run test:e2e -- dashboard-focus-ranking.spec.ts dashboard-sections.spec.ts` passed: 8 tests across desktop and mobile.
- Acceptance criteria satisfied: urgency outranks importance, overdue normal non-urgent tasks are excluded from suggestions, task size does not exclude, every suggestion has reason labels, and other-for-today follows the top-3 area without duplicating suggested IDs.

## Next Phase Readiness

Ready for `04-03`: per-task confirmation and replacement can attach persistence to the existing suggestion slots.

---
*Phase: 04-daily-focus-dashboard*
*Completed: 2026-06-01*
