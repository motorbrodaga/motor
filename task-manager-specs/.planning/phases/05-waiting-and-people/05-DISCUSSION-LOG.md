# Phase 5: Waiting And People - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-01
**Phase:** 05-waiting-and-people
**Areas discussed:** person model, waiting direction labels, response due date, one-week follow-up timing

---

## Person Model

| Option | Description | Selected |
|--------|-------------|----------|
| Text label | Keep person as typed text on the task. | ✓ |
| People directory | Add separate person records and management UI. | |
| Agent decides | Let implementation choose the simplest durable model. | |

**User's choice:** Text label.
**Notes:** MVP should not add a heavy people/contact model.

---

## Waiting Direction Labels

| Option | Description | Selected |
|--------|-------------|----------|
| ждут от меня / я жду | Plain user-facing labels for two directions. | ✓ |
| More formal wording | Longer labels explaining direction. | |
| Agent decides | Let implementation choose final copy. | |

**User's choice:** `ждут от меня / я жду`.
**Notes:** User typed `ждут ри меня/ я жду`; captured as `ждут от меня / я жду` because the meaning matches the requirement and appears to be a typo.

---

## Response Due Date

| Option | Description | Selected |
|--------|-------------|----------|
| Separate date | Add a date specifically for response due date. | ✓ |
| Reuse task due date | Use the existing due date field. | |
| Agent decides | Let implementation choose based on model fit. | |

**User's choice:** Separate date.
**Notes:** Applies to `ждут от меня`.

---

## One-week Follow-up

| Option | Description | Selected |
|--------|-------------|----------|
| Implement later | Keep Phase 5 light; defer heavy resurfacing to later phases. | ✓ |
| Show immediately on Dashboard | Surface `я жду` without date after a week on Dashboard now. | |
| Agent decides | Store data now and choose minimal UI. | |

**User's choice:** Later.
**Notes:** This aligns with Phase 6 soft reviews and avoids expanding Phase 5.

---

## The Agent's Discretion

- Exact schema field names.
- Exact layout for the Waiting screen, as long as both directions are clear.
- Whether to store minimal future follow-up metadata during Phase 5.

## Deferred Ideas

- People directory/contact management.
- One-week waiting follow-up UI as a fuller resurfacing/review behavior.
- Notifications for waiting tasks.
