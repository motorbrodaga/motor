---
phase: "08"
plan: "08-03"
title: "Convert selected Telegram/Gmail source into confirmed task cards"
status: "completed"
completed_at: "2026-06-04"
requirements_addressed: ["INTG-04", "INTG-08"]
key_files:
  created:
    - "zadachnik-app/src/lib/intake/prepare-source-task.ts"
    - "zadachnik-app/src/app/api/intake/prepare/route.ts"
    - "zadachnik-app/src/features/intake/IntakePageClient.tsx"
    - "zadachnik-app/tests/intake-flow.spec.ts"
verification:
  - "npm run typecheck"
  - "npm run test:e2e -- intake-flow.spec.ts"
  - "Browser check: paste -> edit -> cancel -> save"
---

# 08-03 Summary

Connected selected source content to a shared editable confirmation card before task creation.

## Notes

- Source content is compacted into a task draft before display.
- The confirmation card supports edit, cancel, and save.
- Cancel creates no task; save creates exactly one task through the normal task API.
- The source body is not stored automatically on the task.
