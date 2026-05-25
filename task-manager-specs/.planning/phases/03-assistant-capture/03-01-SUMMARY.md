---
phase: 03-assistant-capture
plan: 01
subsystem: api
tags: [nextjs, playwright, parser, prisma]
requires:
  - phase: 02-core-task-system
    provides: task model, validation helpers, organization options, protected task APIs
provides:
  - Deterministic assistant-capture interpretation contract
  - Protected interpretation endpoint that never saves tasks
  - Parser coverage for date, category, importance, incomplete tasks, and no-premature-save behavior
affects: [assistant-capture, quick-capture, task-api]
tech-stack:
  added: []
  patterns: [pure deterministic parser, protected interpretation API]
key-files:
  created:
    - zadachnik-app/src/lib/assistant-capture/interpret-task-capture.ts
    - zadachnik-app/src/app/api/assistant-capture/interpret/route.ts
    - zadachnik-app/tests/assistant-capture-parser.spec.ts
  modified: []
key-decisions:
  - "Use a deterministic narrow parser for Phase 3 instead of adding an external AI provider."
  - "Treat ambiguous category matches conservatively instead of silently choosing a category."
patterns-established:
  - "Assistant interpretation is staged and side-effect-free; persistence happens only after confirmation."
requirements-completed: [CAPT-01, CAPT-02, CAPT-04, CAPT-05]
duration: 35 min
completed: 2026-05-26
---

# Phase 03 Plan 01: Assistant Interpretation Summary

**Deterministic assistant-capture parser with protected no-save interpretation endpoint**

## Performance

- **Duration:** 35 min
- **Started:** 2026-05-26T00:00:00Z
- **Completed:** 2026-05-26T00:35:00Z
- **Tasks:** 4
- **Files modified:** 3

## Accomplishments

- Added a typed assistant-capture interpretation result for staged task drafts.
- Implemented narrow Russian parsing for obvious date, deadline, category, and importance signals.
- Added `POST /api/assistant-capture/interpret`, protected by the existing private-link session boundary.
- Added Playwright coverage proving interpretation does not create tasks.

## Task Commits

1. **Tasks 1-4: Assistant interpretation module, API, and tests** - `77b098e` (feat)

## Files Created/Modified

- `zadachnik-app/src/lib/assistant-capture/interpret-task-capture.ts` - Pure parser and staged draft contract.
- `zadachnik-app/src/app/api/assistant-capture/interpret/route.ts` - Protected API endpoint for interpreting a phrase.
- `zadachnik-app/tests/assistant-capture-parser.spec.ts` - Parser and endpoint coverage.

## Decisions Made

- Kept Phase 3 interpretation deterministic and local for reliability, testability, and scope control.
- Preserved the confirmation contract by making interpretation side-effect-free.
- Treated multi-category matches as ambiguous rather than guessing silently.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- JavaScript word-boundary matching was unreliable for Cyrillic phrase detection. Replaced it with explicit normalized phrase matching.
- Initial test phrase matched both call and work categories. Updated coverage to respect the intended conservative ambiguity rule.

## Verification

- `npm run typecheck` - passed.
- `npm run test:e2e -- assistant-capture-parser.spec.ts` - passed, 8 passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 03-02 can now build the quick capture UI against the interpretation endpoint and staged draft contract.

---
*Phase: 03-assistant-capture*
*Completed: 2026-05-26*
