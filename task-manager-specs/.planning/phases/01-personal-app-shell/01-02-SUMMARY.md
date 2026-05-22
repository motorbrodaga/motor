---
phase: 01-personal-app-shell
plan: 02
subsystem: private-access
tags: [access, private-link, session, prisma, playwright]
requires:
  - 01-01
provides:
  - private token entry route
  - session cookie guard
  - access-link regeneration
affects:
  - zadachnik-app
tech-stack:
  added: []
  patterns:
    - high-entropy token hashed before storage
    - signed httpOnly session cookie
key-files:
  created:
    - zadachnik-app/src/lib/access-tokens.ts
    - zadachnik-app/src/lib/session.ts
    - zadachnik-app/src/lib/session-cookie.ts
    - zadachnik-app/src/app/a/[token]/route.ts
    - zadachnik-app/src/app/api/access/regenerate/route.ts
    - zadachnik-app/tests/access.spec.ts
  modified:
    - zadachnik-app/src/middleware.ts
    - zadachnik-app/playwright.config.ts
key-decisions:
  - decision: "Store only token hashes, never raw private links."
    rationale: "Keeps the MVP private-link model low-friction while reducing leakage risk."
  - decision: "Use a signed session cookie after private-link validation."
    rationale: "Avoids heavy authentication while keeping protected routes behind a durable browser session."
requirements-completed: [ACCS-02, ACCS-03]
duration: "0h 18m"
completed: 2026-05-22
---

# Phase 1 Plan 02: Private Access Summary

Implemented private-link access with persistent hashed tokens, session cookie protection, regeneration from the `Еще -> Приватная ссылка` screen, and Playwright coverage for old-link invalidation.

## Commits

| Hash | Description |
|------|-------------|
| fd4d1f7 | Implement private link access |

## Verification

- `npm run typecheck` - passed
- `npm run build` - passed
- `npm run test:e2e -- access.spec.ts shell-navigation.spec.ts` - passed after Playwright browsers were installed

## Deviations from Plan

**[Rule 2 - Runtime behavior] Redirect session handoff hardened** - Found during E2E access test.

Issue: In the Next dev redirect path, the session cookie set by `/a/[token]` was not visible to middleware on the immediate `/dashboard` request.

Fix: `/a/[token]` now includes a signed short session value as `sid` on the redirect. Middleware converts it to the same httpOnly cookie and removes the query parameter before rendering Dashboard.

Verification: Access test passes for Chromium desktop and mobile project; old token is rejected after regeneration.

**Total deviations:** 1 auto-fixed.
**Impact:** Low. The private link remains the secret entry point; the intermediate `sid` is signed and immediately converted into the cookie.

## Self-Check: PASSED

- Raw private tokens are not stored in the database.
- Regeneration invalidates the previous token.
- Protected routes require a session.
- Requirements copied from plan frontmatter.

## Next

Ready for Plan 01-04 after Plan 01-03 shell completion.
