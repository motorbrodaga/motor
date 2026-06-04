---
phase: "09"
plan: "09-03"
title: "Update linked calendar events when tasks change"
status: "completed"
completed_at: "2026-06-05"
requirements_addressed: ["CALN-03", "CALN-04", "CALN-05"]
key_files:
  created:
    - "zadachnik-app/src/lib/calendar/task-calendar.ts"
  modified:
    - "zadachnik-app/src/app/api/tasks/[id]/route.ts"
    - "zadachnik-app/src/app/api/tasks/[id]/calendar/route.ts"
verification:
  - "npm run typecheck"
  - "npm run test:e2e -- calendar-notifications-flow.spec.ts"
  - "DATABASE_URL=file:./dev.db npm run build"
---

# 09-03 Summary

Linked calendar events now refresh when calendar-relevant task data changes.

## Notes

- Task title, description, status, and date changes increment the linked event `SEQUENCE`.
- Re-saving the calendar panel updates the event projection and increments sequence.
- Archived tasks are excluded from the feed; completed tasks are emitted with cancelled status when still linked.
- The UI explicitly says iPhone controls the subscription refresh timing.

## Deviations from Plan

None - plan executed exactly as written.
