# Phase 9: Calendar And Notifications - Discussion Log

**Date:** 2026-06-05
**Phase:** 9-Calendar And Notifications
**Areas discussed:** iPhone calendar strategy, calendar action placement, missing time behavior, linked-event updates, push notification scope, notification tone

## Calendar Strategy

| Option | Meaning | Selected |
|--------|---------|----------|
| `.ics` / calendar link | Simpler iPhone-first calendar integration for MVP. | yes |
| Google Calendar bridge | Heavier but may help sync/update paths. | |
| PWA reminder only | Simpler but does not create a real calendar event. | |

**User's choice:** `.ics` / calendar-link style path.
**Notes:** The user also chose automatic linked-event updates, so planning must validate whether the implementation should be a subscribed iCalendar feed rather than a one-off downloaded event file.

## Calendar Action Placement

| Option | Meaning | Selected |
|--------|---------|----------|
| Task card and task page | More visible, but heavier lists. | |
| Task page only | Keeps lists calm and makes calendar export deliberate. | yes |
| Quick actions on card | Fast, but can clutter cards. | |

**User's choice:** Task page only.
**Notes:** The user sent `2-2` for question 2.

## Missing Time Behavior

| Option | Meaning | Selected |
|--------|---------|----------|
| Ask for time | Forces exact timing before calendar creation. | |
| All-day event | Faster but may be too vague. | |
| Choice: all-day or time | Flexible and still explicit. | yes |

**User's choice:** Choice: all-day or specify time.
**Notes:** The user sent `2-3`; interpreted as the answer to question 3 because question 2 was already answered and this fits the sequence.

## Linked Event Updates

| Option | Meaning | Selected |
|--------|---------|----------|
| Manual update after linking | Reliable fallback but not automatic. | |
| Automatic update | Best user experience if technically supported. | yes |
| No stored link | Simplest but duplicates events. | |

**User's choice:** Automatic update.
**Notes:** This is a goal for research/planning. One-off `.ics` imports may not support true auto-update, so the likely research direction is subscribed calendar feed / stable event UID.

## Push Notification Scope

| Option | Meaning | Selected |
|--------|---------|----------|
| Preference toggles only | Low implementation cost, not real push. | |
| Morning review push only | Smaller real push slice. | |
| Morning review and task reminders | Full scoped MVP notification feature. | yes |

**User's choice:** Real push for both morning review and individual tasks.
**Notes:** Notifications remain optional per requirements.

## Notification Tone

| Option | Meaning | Selected |
|--------|---------|----------|
| Very soft | "Можно посмотреть день." | |
| Neutral | "У вас есть задачи на сегодня." | |
| Direct | "Пора открыть задачи." | yes |

**User's choice:** More direct notification tone.
**Notes:** Direct is allowed for notifications, while review screens should keep their already-selected soft tone.

## Deferred Ideas

- Google Calendar bridge as primary path unless iPhone calendar research makes it necessary.
- Heavy calendar OAuth and multi-account calendar management.

## Agent Discretion

- Decide exact calendar labels after research.
- Decide the durable storage shape for calendar links/feed UIDs.
- Decide exact push setup path and preference screen placement.
