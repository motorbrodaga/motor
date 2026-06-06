---
status: testing
phase: 09-calendar-and-notifications
source:
  - 09-01-SUMMARY.md
  - 09-02-SUMMARY.md
  - 09-03-SUMMARY.md
  - 09-04-SUMMARY.md
  - 09-05-SUMMARY.md
started: 2026-06-06T16:59:27+03:00
updated: 2026-06-06T17:18:00+03:00
---

## Current Test

number: 3
name: Linked calendar event updates after task edit
expected: |
  After a task has been added to the calendar, changing the task title or description and saving keeps the calendar link active; the detail page still shows the calendar status and says iPhone controls subscription refresh timing.
awaiting: user response

## Tests

### 1. Add a task to iPhone calendar feed
expected: Open a task detail page. A "Календарь iPhone" panel is visible below the task form. Choose "Весь день" or "Точное время", click "Добавить в календарь", and the page shows "Календарь обновлен." without leaving the task page.
result: pass

### 2. Copy and regenerate calendar subscription link
expected: In the same calendar panel, "Скопировать подписку" copies the feed link, and "Новая ссылка" shows that the old link was disabled and a new subscription link is available.
result: issue
reported: "Failed to execute 'writeText' on 'Clipboard': Write permission denied."
severity: major

### 3. Linked calendar event updates after task edit
expected: After a task has been added to the calendar, changing the task title or description and saving keeps the calendar link active; the detail page still shows the calendar status and says iPhone controls subscription refresh timing.
result: [pending]

### 4. Notification settings are reachable and optional
expected: Open "Ещё" -> "Уведомления". The page shows separate controls for "Утренний обзор" and "Напоминания задач", and both can be enabled or disabled independently.
result: [pending]

### 5. Task reminder field is available on task detail
expected: Open a task detail page. The task form has a "Напоминание" section with a "Пуш-напоминание" date/time field. Saving the task keeps the page usable and shows the normal saved state.
result: [pending]

### 6. Cold Start Smoke Test
expected: Start the app from a clean server process. The dashboard opens, task detail pages compile, the notifications page opens, and the calendar feed route returns live calendar data after a task is linked.
result: [pending]

## Summary

total: 6
passed: 1
issues: 1
pending: 4
skipped: 0
blocked: 0

## Gaps

- truth: "Calendar subscription link can be copied or otherwise made available without a technical browser permission error"
  status: failed
  reason: "User reported: Failed to execute 'writeText' on 'Clipboard': Write permission denied."
  severity: major
  test: 2
  root_cause: "The calendar panel calls navigator.clipboard.writeText directly. In the in-app browser, clipboard write permission can be denied, and the UI does not catch the error or show the feed URL as a manual fallback."
  artifacts:
    - path: "zadachnik-app/src/features/tasks/TaskCalendarPanel.tsx"
      issue: "copyFeedUrl awaits navigator.clipboard.writeText without fallback UI for denied permission"
  missing:
    - "Catch Clipboard API failures"
    - "Show the subscription URL in a selectable readonly field when automatic copy fails or is unavailable"
    - "Change the status message to tell the user to copy the visible link manually"
  debug_session: "inline UAT diagnosis 2026-06-06"
