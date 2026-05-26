# Phase 4: Daily Focus Dashboard - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-27
**Phase:** 4-Daily Focus Dashboard
**Areas discussed:** Top-3 ranking, confirmation and replacement, other for today, ranking explanation, dashboard structure

---

## Top-3 Ranking

| Option | Description | Selected |
|--------|-------------|----------|
| Soft suggestions | The system proposes three tasks gently, as focus suggestions rather than commands. | yes |
| Strict formula | The system chooses strictly by formula and presents the result as the day's focus. | |

**User's choice:** Soft suggestions.
**Notes:** The Dashboard should help decide, not pressure the user.

---

## Confirmation And Replacement

| Option | Description | Selected |
|--------|-------------|----------|
| Confirm each task | Each suggested top-3 task is confirmed separately. | yes |
| Confirm whole set | One action confirms all three together. | |
| Confirm none explicitly | Suggestions stay passive without a confirmation state. | |

**User's choice:** Confirm each task.
**Notes:** Replacement remains in scope for any proposed main task.

---

## Other For Today

| Option | Description | Selected |
|--------|-------------|----------|
| List after top-3 | Show other tasks for today after the three main tasks. | yes |
| Mixed with top-3 | Show all today's tasks together with highlighted suggestions. | |
| Separate hidden section | Put other tasks behind an expansion or later section. | |

**User's choice:** List after top-3.
**Notes:** Other tasks must remain visible without competing with the main focus.

---

## Ranking Explanation

| Option | Description | Selected |
|--------|-------------|----------|
| Short reason on card | Show compact labels such as urgent, deadline today, important, overdue. | yes |
| Visual tags only | Use only icons/labels without explicit reason text. | |
| Reveal on tap | Keep cards clean and show reasons in details. | |

**User's choice:** Short reason on card.
**Notes:** The recommendation was accepted because it makes the ranking feel transparent.

---

## Dashboard Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Agent decides | Agent chooses exact layout while preserving phase scope and user decisions. | yes |
| Discuss full layout now | Continue into detailed section-by-section layout decisions. | |

**User's choice:** Agent decides.
**Notes:** The agent should put daily focus first, then other for today, then supporting sections.

---

## The Agent's Discretion

- Exact Dashboard layout and empty-state copy.
- Exact persistence approach for confirmed focus tasks.
- Exact replacement picker UI.

## Deferred Ideas

- Full waiting-direction behavior remains Phase 5.
- Weekly review/stale resurfacing remains Phase 6.
