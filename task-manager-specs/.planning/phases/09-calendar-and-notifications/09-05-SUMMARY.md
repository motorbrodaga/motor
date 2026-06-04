---
phase: "09"
plan: "09-05"
title: "Schedule and send direct but soft reminders"
status: "completed"
completed_at: "2026-06-05"
requirements_addressed: ["NOTF-01", "NOTF-02", "NOTF-03"]
key_files:
  created:
    - "zadachnik-app/src/lib/notifications/scheduler.ts"
    - "zadachnik-app/src/app/api/notifications/send-due/route.ts"
    - "zadachnik-app/tests/notification-scheduler.spec.ts"
  modified:
    - "zadachnik-app/prisma/schema.prisma"
    - "zadachnik-app/src/features/tasks/TaskForm.tsx"
    - "zadachnik-app/src/lib/tasks/task-validation.ts"
verification:
  - "npm run typecheck"
  - "npm run test:e2e -- calendar-helper.spec.ts notification-scheduler.spec.ts"
  - "DATABASE_URL=file:./dev.db npm run build"
---

# 09-05 Summary

Added scheduled notification selection for morning review and individual task reminders.

## Notes

- Tasks now have `reminderAt` and `reminderSentAt`.
- The scheduler sends morning review notifications once per day and task reminders once per configured reminder.
- Notification copy is direct but non-punitive: "Пора открыть задачи" and "Пора открыть: {task}".
- Notification payloads route morning review to Dashboard and task reminders to the task detail page.

## Deviations from Plan

None - plan executed exactly as written.
