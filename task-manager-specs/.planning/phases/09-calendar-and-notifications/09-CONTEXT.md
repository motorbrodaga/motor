# Phase 9: Calendar And Notifications - Context

**Gathered:** 2026-06-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 9 connects dated/timed tasks to the iPhone calendar and adds optional push notifications. The work should keep the product's soft-review philosophy, but the user selected a more direct notification tone than earlier review copy. Calendar and notification features must remain explicit and controllable by the single MVP user.

</domain>

<decisions>
## Implementation Decisions

### Calendar Strategy
- **D-01:** Use an iCalendar-compatible path for MVP, starting from `.ics` / calendar-feed style integration rather than a heavy Google Calendar bridge.
- **D-02:** Because the user wants linked calendar events to update automatically, planning must validate a subscription/feed style implementation rather than relying only on one-off downloaded `.ics` files.
- **D-03:** Google Calendar as an intermediary is not the preferred MVP path.

### Calendar Entry Point
- **D-04:** The calendar action should live on the task detail page, not on every task card in lists.
- **D-05:** Task lists should stay lighter; calendar export/update is deliberate enough to belong on the full task surface.

### Missing Time Handling
- **D-06:** If a task has a date but no time, the UI should offer a choice: create an all-day event or specify a time.
- **D-07:** If a task has no date/time at all, ask for date/time before adding it to calendar.

### Linked Event Updates
- **D-08:** The desired behavior is automatic update of the linked iPhone calendar event when the task changes.
- **D-09:** If the technical route cannot truly update an already imported iPhone event, planning should prefer a subscribed calendar/feed model or clearly surface a manual update fallback rather than pretending auto-update works.

### Push Notifications
- **D-10:** Implement real browser/PWA push notifications in MVP, not only preference toggles.
- **D-11:** Push scope includes both morning review and individual task reminders.
- **D-12:** Notifications must remain optional: the user can enable or disable morning review notifications and task reminders.

### Notification Tone
- **D-13:** Notification copy can be more direct than review copy, using prompts like "Пора открыть задачи".
- **D-14:** Even with direct wording, avoid blame, guilt, or alarmist urgency.

### The Agent's Discretion
- Decide exact Russian labels and whether the task detail action says "Добавить в календарь", "Подписка календаря", or another clearer phrase after research.
- Decide the storage model for calendar linkage, as long as it supports the selected auto-update goal or a documented fallback.
- Decide whether task reminders use an explicit reminder datetime field or derive from task date/time after planning research.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning
- `.planning/ROADMAP.md` - Phase 9 goal, requirements, success criteria, and planned plan count.
- `.planning/REQUIREMENTS.md` - `CALN-01` through `CALN-05` and `NOTF-01` through `NOTF-03`.
- `.planning/PROJECT.md` - mobile-first product framing, soft reminders, optional push, and open calendar strategy.
- `.planning/STATE.md` - current position after Phase 8 completion.

### Prior Phase Context
- `.planning/phases/02-core-task-system/02-CONTEXT.md` - task dates, task detail, notes, and task mutation model.
- `.planning/phases/04-daily-focus-dashboard/04-CONTEXT.md` - morning review/dashboard behavior.
- `.planning/phases/06-soft-reviews/06-CONTEXT.md` - soft reminder philosophy and copy guardrails.
- `.planning/phases/08-telegram-and-gmail-intake/08-CONTEXT.md` - deliberate integration entry patterns and privacy posture.

### Current App Integration Points
- `zadachnik-app/prisma/schema.prisma` - task date fields, notes, settings, and persistence model.
- `zadachnik-app/src/app/(app)/tasks/[id]/page.tsx` - task detail page where calendar action should live.
- `zadachnik-app/src/features/tasks/TaskForm.tsx` - existing task edit form and date fields.
- `zadachnik-app/src/app/api/tasks/[id]/route.ts` - task update API and likely calendar-link update hook point.
- `zadachnik-app/src/app/manifest.ts` - PWA manifest foundation for installed app behavior.
- `zadachnik-app/src/app/(app)/more/page.tsx` - likely settings entry point for notification preferences.

### External Primary References For Research
- Apple Developer: Web Push for web apps and browsers - https://developer.apple.com/documentation/UserNotifications/sending-web-push-notifications-in-web-apps-and-browsers
- Apple Support: Add calendar subscriptions in iCloud - https://support.apple.com/en-us/102301
- Apple Calendar Scripting Guide: subscribing to a calendar URL - https://developer.apple.com/library/archive/documentation/AppleApplications/Conceptual/CalendarScriptingGuide/Calendar-SubscribetoaCalendar.html

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Task detail already loads a full task with notes and organization options.
- `TaskForm` already edits `doDate`, `dueDate`, description, and notes-related fields through existing APIs.
- `AppSetting` exists in Prisma and can store notification preferences or calendar configuration if a more specific table is not needed.
- The app already has a PWA manifest at `zadachnik-app/src/app/manifest.ts`.
- The "More" area is already used for deliberate settings/integration surfaces.

### Established Patterns
- User-facing UI is Russian-only and mobile-first.
- Mutating actions go through authenticated app API routes protected by the private-link session.
- Pages use server components for data and focused client components for actions.
- Integrations should be deliberate and visible rather than hidden automation.
- Reviews use soft copy, but notifications may be more direct per this phase's decision.

### Integration Points
- Add calendar controls to task detail, not to every `TaskCard`.
- Add durable calendar-link metadata to the task model or a related model if update behavior requires stable event IDs/feed UIDs.
- Add notification preferences under "More" or a settings subpage.
- Push implementation will likely require service worker, subscription storage, VAPID/web-push server support, and installed PWA testing, especially on iPhone.

</code_context>

<specifics>
## Specific Ideas

- Calendar should work for the iPhone calendar first.
- The calendar path should start simple for MVP but not block future updates.
- If a task has date but no time, the user should choose all-day vs exact time.
- Push notifications should be real for both morning review and task reminders.
- Direct notification tone is acceptable, but still not punitive.

</specifics>

<deferred>
## Deferred Ideas

- Google Calendar as the primary bridge is deferred unless research proves iPhone calendar auto-update is impractical without it.
- Heavy multi-account calendar OAuth is out of scope unless needed as a fallback after research.

</deferred>

---

*Phase: 9-Calendar And Notifications*
*Context gathered: 2026-06-05*
