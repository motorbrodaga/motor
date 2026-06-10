---
status: testing
phase: 10-offline-conflicts-and-backups
source: 10-01-SUMMARY.md, 10-02-SUMMARY.md, 10-03-SUMMARY.md
started: 2026-06-10T13:25:00.000Z
updated: 2026-06-11T00:19:00.000+03:00
---

## Current Test

number: 1
name: Offline quick capture
expected: |
  Open the latest private Telegram link on the phone. Temporarily disconnect the phone from the network, tap "Быстро", add a short task, and tap "Добавить". The app should not show "нет доступа"; it should say the task was saved on the phone and is waiting for sync.
awaiting: user response

## Tests

### 1. Offline quick capture
expected: Open the latest private Telegram link on the phone. Temporarily disconnect the phone from the network, tap "Быстро", add a short task, and tap "Добавить". The app should not show "нет доступа"; it should say the task was saved on the phone and is waiting for sync.
result: [pending]

### 2. Reconnect sync
expected: Reconnect the network. The queued task should sync automatically and appear in the normal task list without creating duplicates.
result: [pending]

### 3. Latest change wins
expected: Edit a task while offline, then reconnect. The latest edit should be the version that remains after sync; there should be no conflict dialog or duplicate task.
result: [pending]

### 4. Backup page and manual backup
expected: Open "Еще" -> "Бэкапы". The page should show the latest backup status and the button "Создать бэкап сейчас". Clicking it should create a backup and show a success message.
result: [technical pass]
notes: Manual backup creation and backup validation passed from the app scripts on 2026-06-11. Phone UI confirmation is still useful during user UAT.

## Summary

total: 4
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps

[none yet]
