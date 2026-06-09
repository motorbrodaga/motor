# Phase 10: Offline, Conflicts, And Backups - Research

**Date:** 2026-06-09
**Mode:** Inline research because GSD subagents are not installed in this runtime.
**Source:** Requirements-only planning. User chose to continue without a separate discussion pass.

## Scope

Phase 10 makes the existing MVP trustworthy when the phone is temporarily offline. The phase should cover the task system itself: cached task views, queued task changes, deterministic latest-change-wins sync, and automatic recovery backups.

This phase should not expand into a full sync platform. Telegram/Gmail import, push delivery, and iPhone calendar subscription updates can stay online-only for the MVP as long as task data remains safe and the core task workflow continues.

## Existing Foundation

- `zadachnik-app/prisma/schema.prisma` already stores `createdAt` and `updatedAt` on tasks, notes, categories, contexts, projects, calendar links, push subscriptions, and preferences.
- `Task` is the central entity for the offline MVP. It already has fields for status, dates, importance, urgency, notes, person/waiting metadata, source label, reminders, calendar link, category, project, and contexts.
- `zadachnik-app/src/app/api/tasks/route.ts` provides the task list and create path.
- `zadachnik-app/src/app/api/tasks/[id]/route.ts` provides task detail, update, and archive/delete behavior.
- `taskInclude` and `taskDetailInclude` are already used as the shape boundary for task list/detail responses.
- `zadachnik-app/public/sw.js` exists, but currently handles push notifications and notification clicks only. It does not cache app shell routes or runtime assets yet.
- The app is already a PWA through `zadachnik-app/src/app/manifest.ts`.
- `AppSetting` exists and can store small backup/sync metadata, but structured backup run history should use an explicit model if it needs status, file names, timestamps, or error details.

## Implementation Direction

1. Add a browser-side task cache in IndexedDB for the minimum useful offline surface: Dashboard, Inbox/task lists, task detail, quick capture, and task edits.
2. Add a durable client mutation queue in IndexedDB. Queue task create, task update, task archive/delete, quick actions, and task notes when the network is unavailable or the request fails for connectivity reasons.
3. Extend the service worker to cache the application shell and static assets needed to reopen the main app routes while offline. Sensitive task data should live in IndexedDB after an authenticated session rather than in a broad service-worker cache of private URLs.
4. Introduce a sync endpoint that accepts mutation envelopes with `clientMutationId`, operation type, target entity, payload, client timestamp, and base/server timestamp where available.
5. Apply latest-change-wins at the server boundary. For the MVP, whole-record or operation-level latest wins is acceptable as long as it is deterministic, replay-safe, and documented.
6. Return per-mutation results so the client can mark queued items as applied, ignored as stale, failed, or needing retry.
7. After sync, refresh the local task cache from the server so the UI converges on the saved source of truth.
8. Add a small sync status surface in Russian: offline, waiting to sync, synced, and needs attention.
9. Add automatic server-side backups that export the recoverable task database to timestamped JSON files in a local ignored backup directory. The backup should include task-domain and settings data needed to recover the MVP, but not raw secrets, session files, Telegram sessions, `.env`, or downloaded personal files.
10. Provide a recovery path as a script or guarded admin-only action that can validate a backup and restore it into a database intentionally. Avoid a casual destructive restore button in the main mobile UI.

## Conflict Policy

- The product requirement is simple: when offline edits conflict, the latest change wins.
- The latest change should be based on an explicit client-side mutation timestamp plus server receipt metadata, not on array order alone.
- Replayed mutations must be de-duplicated by `clientMutationId`.
- If a mutation targets an archived/deleted task, the newer timestamp decides whether the archive/delete remains or the later update revives/changes the record.
- The UI should not force the user through conflict dialogs in v1. It can show a calm sync status and let the server converge the data.

## Backup Policy

- Backups should be automatic and also manually runnable for verification.
- Backup output should be written outside committed source or under a git-ignored local data directory.
- Backup JSON should include schema/version metadata, creation timestamp, and counts by entity.
- Restore should start with validation. The first recovery path can be a script, because it is safer than a destructive everyday UI.
- Backup tests should avoid writing personal real data into committed fixtures.

## Risks

- Offline authentication is limited. If the private-link session expires while offline, the app can still show locally cached data but cannot renew access until online.
- Service-worker caching private pages can expose sensitive information if done too broadly. Cache the shell and static assets; keep task records in IndexedDB controlled by app code.
- iOS PWA behavior can vary by browser/install state. Verification should include a phone-sized browser pass and at least one offline reload scenario.
- IndexedDB schema changes need versioning so future releases do not lose queued mutations.
- Backups contain personal task data and must not be committed.

## Verification Focus

- Create a task while offline, reload, reconnect, and confirm it syncs exactly once.
- Edit the same task offline and online; confirm the newest change wins.
- Replay a mutation and confirm it is not applied twice.
- Archive/delete and then update the same task with different timestamps; confirm deterministic latest-change behavior.
- Confirm Dashboard/Inbox/task detail are usable from cached data while offline.
- Confirm the backup job creates a valid JSON backup and records last-run metadata.
- Confirm restore validation can read a backup and reject invalid/incompatible files.
- Run typecheck and focused tests for sync queue, conflict resolution, and backup export.
