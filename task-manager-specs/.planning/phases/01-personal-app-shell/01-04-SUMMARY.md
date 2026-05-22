---
phase: 01-personal-app-shell
plan: 04
subsystem: dashboard-capture-shell
tags: [dashboard, quick-capture, mobile-ui, private-link, playwright]
requires:
  - 01-02
  - 01-03
provides:
  - Dashboard-first app entry
  - quick capture shell
  - shell event persistence endpoint
  - full Phase 1 smoke tests
affects:
  - zadachnik-app
tech-stack:
  added: []
  patterns:
    - Dashboard-first protected route
    - placeholder capture event before task CRUD
    - request host preserved for mobile/tunnel access
key-files:
  created:
    - zadachnik-app/src/features/dashboard/DashboardHome.tsx
    - zadachnik-app/src/features/capture/QuickCaptureEntry.tsx
    - zadachnik-app/src/features/capture/QuickCapturePanel.tsx
    - zadachnik-app/src/app/api/shell-events/route.ts
    - zadachnik-app/src/lib/request-origin.ts
    - zadachnik-app/tests/dashboard-capture.spec.ts
    - zadachnik-app/tests/access-shell-flow.spec.ts
  modified:
    - zadachnik-app/src/app/page.tsx
    - zadachnik-app/src/app/(app)/dashboard/page.tsx
    - zadachnik-app/src/app/a/[token]/route.ts
    - zadachnik-app/src/app/api/access/regenerate/route.ts
    - zadachnik-app/playwright.config.ts
key-decisions:
  - decision: "Quick capture records only ShellEvent entries in Phase 1."
    rationale: "Preserves the visible mobile capture affordance without introducing task CRUD before Phase 2."
  - decision: "Build private-link redirects from the incoming request host."
    rationale: "Keeps phone, LAN, and tunnel access on the same reachable origin instead of redirecting to localhost or 0.0.0.0."
requirements-completed: [ACCS-01, DASH-01, MOBL-01, MOBL-04]
duration: "0h 42m"
completed: 2026-05-22
---

# Phase 1 Plan 04: Dashboard And Quick Capture Summary

Built the Dashboard-first Phase 1 surface, mobile quick capture entry, placeholder capture panel, authenticated shell-event write endpoint, and full private-link-to-dashboard smoke coverage.

## Commits

| Hash | Description |
|------|-------------|
| c985292 | Add dashboard quick capture shell |
| 009ce84 | Preserve mobile private link host |

## Verification

- `npm run typecheck` - passed
- `npm run build` - passed
- `npm run test:e2e` - passed, 8 passed / 2 viewport-specific skips
- Human visual checkpoint - passed on phone through temporary tunnel link on 2026-05-22

## Deviations from Plan

**[Rule 2 - Runtime behavior] Mobile host preservation added after checkpoint** - Found during user phone verification.

Issue: The LAN server accepted the phone-facing request, but private-link redirect URLs could be generated from `0.0.0.0`, which a phone cannot open.

Fix: Added `getRequestUrl()` to build redirect and regenerated private-link URLs from the incoming `Host` header.

Verification: Confirmed redirect to the reachable tunnel host and user confirmed the phone opened and displayed the app correctly.

**Total deviations:** 1 auto-fixed.
**Impact:** Low. The change only preserves the caller-visible origin for redirects and link regeneration.

## Self-Check: PASSED

- Private link opens Dashboard as the first app screen.
- Dashboard uses Russian visible UI and does not implement Phase 4 ranking logic.
- Quick capture is reachable from the mobile experience.
- Quick capture writes only a shell event, not a real task.
- Phone/desktop access uses the same running app and database.
- Requirements copied from plan frontmatter.

## Next

Ready for Phase 1 verification and completion.
