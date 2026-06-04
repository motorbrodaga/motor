# Phase 9: Calendar And Notifications - Research

**Date:** 2026-06-05
**Mode:** Inline research because GSD subagents are not installed in this runtime.

## Scope

Phase 9 connects tasks with dates or reminders to the iPhone calendar and adds optional real push notifications. The implementation should stay deliberate: calendar linking starts from the task detail page, and push notifications are enabled from settings.

## Existing Foundation

- `zadachnik-app/prisma/schema.prisma` stores task dates as date-only fields today; Phase 9 needs time/all-day metadata for calendar events and task reminders.
- `zadachnik-app/src/app/(app)/tasks/[id]/page.tsx` is the right entry point for calendar actions because the user chose task-detail-only controls.
- `zadachnik-app/src/app/api/tasks/[id]/route.ts` is the likely update hook where linked calendar metadata should be refreshed when task title, dates, description, or notes change.
- `zadachnik-app/src/app/manifest.ts` already provides a PWA manifest with standalone display mode.
- `zadachnik-app/src/app/(app)/more/page.tsx` is the natural entry point for notification preferences.
- `AppSetting` exists, but durable push subscriptions and calendar links should use explicit tables if they need structured fields, revocation, or cleanup.

## External Findings

### iPhone Calendar

- Apple supports calendar subscriptions by URL on iPhone, iPad, and Mac. A subscribed calendar is the right fit for updates because the calendar app can fetch the same URL again.
- A one-off downloaded `.ics` file is useful as a manual fallback, but it cannot honestly satisfy the "linked event updates when task changes" requirement by itself.
- iCalendar events should use stable `UID` values. When an exported event changes, the feed should update `LAST-MODIFIED` / `DTSTAMP` and increment `SEQUENCE` so clients can identify a changed event.
- Because iPhone Calendar may fetch the subscription URL without the app's private-link session cookie, the calendar feed needs its own private token. Regenerating that token should revoke the old feed URL.

### Web Push

- Apple Web Push uses cross-browser Push API, Notifications API, and Service Worker standards.
- On iOS, push for a web app requires Home Screen / installed PWA behavior. The app must detect support and show a clear unavailable state when the browser cannot subscribe.
- Push permission must be requested from a user gesture, then the server stores the subscription endpoint and encryption keys.
- Web Push is server-initiated, so real morning review and task reminders need a scheduled sender, not only client-side preference toggles.
- Notifications should be visible when delivered; the implementation should not rely on silent background push behavior.

## Implementation Direction

1. Implement a subscribed iCalendar feed with a private calendar token as the primary calendar strategy.
2. Add task calendar-link metadata with stable feed/event identifiers, all-day vs timed start/end, include-description/include-notes settings, and a sequence number.
3. Add the calendar action only to task detail. If a task lacks date/time, show a focused chooser before linking it.
4. Keep a one-off `.ics` download/link only as a fallback or diagnostic path, clearly labeled as manual.
5. Add notification preferences under "More" for morning review and task reminders.
6. Add Web Push subscription storage, service worker handling, server-side send helpers, and a minimal scheduled sender.
7. Keep notification copy direct but non-punitive, for example "Time to open tasks" / Russian equivalent, without blame language.

## Risks

- Calendar clients may refresh subscriptions on their own schedule; the app can update the feed immediately, but cannot force iPhone Calendar to refresh instantly.
- A calendar token is effectively a secret URL. It must be revocable, omitted from logs, and scoped only to calendar feed access.
- iOS push support depends on installed PWA behavior and user permission. The UI must explain unavailable states without blocking the rest of the app.
- Scheduled push delivery needs a runtime mechanism. If the deployment target lacks a persistent worker, the phase must add the smallest compatible scheduler path and document local/deployed behavior.
- Notes and descriptions may contain private information; the calendar UI should make including notes explicit.

## Verification Focus

- Validate generated iCalendar output for all-day and timed tasks.
- Test calendar token regeneration invalidates the previous feed.
- Test task changes update linked event fields and increment sequence.
- Test unsupported push, denied permission, successful subscription, and disabled preferences.
- Test morning review and individual reminder send selection without duplicate sends.
- Browser-check mobile task detail and More notification settings.

## Sources

- Apple Developer: Web Push for web apps and browsers - https://developer.apple.com/documentation/UserNotifications/sending-web-push-notifications-in-web-apps-and-browsers
- Apple Support: Add calendar subscriptions in iCloud - https://support.apple.com/en-us/102301
- RFC 5545: iCalendar specification - https://www.rfc-editor.org/rfc/rfc5545
