---
phase: "08"
plan: "08-05"
title: "Add privacy and explicit-request safeguards"
status: "completed"
completed_at: "2026-06-04"
requirements_addressed: ["INTG-01", "INTG-05", "INTG-11"]
key_files:
  created:
    - "zadachnik-app/src/lib/intake/intake-guards.ts"
    - "zadachnik-app/src/app/api/intake/telegram/route.ts"
    - "zadachnik-app/src/app/api/intake/gmail/route.ts"
    - "zadachnik-app/tests/intake-flow.spec.ts"
  modified:
    - "zadachnik-app/src/app/(app)/more/page.tsx"
verification:
  - "npm run typecheck"
  - "npm run test:e2e -- intake-flow.spec.ts"
  - "DATABASE_URL=file:./dev.db npm run build"
---

# 08-05 Summary

Added the deliberate import entry under "More" and shared provider guardrails for explicit, bounded requests.

## Notes

- Telegram and Gmail provider routes require explicit actions.
- Provider result limits are enforced server-side with a maximum of 20.
- Opening import screens or source lists never creates tasks.
- Provider errors avoid exposing secret values or session contents.
