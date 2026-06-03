---
phase: "07"
plan: "07-03"
title: "Connect history to task completion and manual actual-time entry"
status: "completed"
completed_at: "2026-06-03"
requirements_addressed: ["HIST-01", "HIST-02", "HIST-05"]
key_files:
  created:
    - "zadachnik-app/src/features/history/ActualTimeEditor.tsx"
  modified:
    - "zadachnik-app/src/app/(app)/history/page.tsx"
    - "zadachnik-app/src/app/api/tasks/[id]/route.ts"
    - "zadachnik-app/src/app/globals.css"
    - "zadachnik-app/tests/completion-history-screen.spec.ts"
verification:
  - "npm run typecheck"
  - "npx playwright test tests/completion-history-helper.spec.ts tests/completion-history-screen.spec.ts"
---

# 07-03 Summary

Connected completed tasks to history and added optional later actual-time entry from the completed task row.

## Notes

- Completing a task still does not prompt for time immediately.
- Re-saving a task as done preserves an existing `completedAt` timestamp instead of resetting history.
- Moving a task out of `done` clears `completedAt`, keeping history tied to current task state.

