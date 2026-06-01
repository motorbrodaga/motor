# Phase 5: Waiting And People - Research

**Researched:** 2026-06-01
**Status:** Complete

## Scope

Phase 5 should turn the existing person label into a real waiting workflow without adding a contact directory or heavy relationship model. The MVP needs enough structure to distinguish two directions, show a useful waiting screen, and preserve a separate response date for tasks where another person is waiting for the user.

## Current System Findings

- The `Task` model already has `personLabel`, but no waiting direction, response due date, or stable waiting-start timestamp.
- `TaskForm`, `TaskQuickActions`, and `TaskCard` already expose or display a plain person field, so Phase 5 can extend existing task surfaces instead of creating a new people module.
- `/waiting` already exists as a route, but it is still a placeholder screen.
- Phase 4 Dashboard currently treats `status = waiting` or any `personLabel` as a waiting signal. This is intentionally temporary and should be replaced with a derived rule: person plus waiting direction.
- Existing task validation is centralized in `src/lib/tasks/task-validation.ts`, which is the right place to add new accepted fields.
- Existing tests are focused Playwright/spec files and can cover model, dashboard, and waiting-screen behavior without a large new test harness.

## Recommended Data Shape

Add nullable fields to `Task`:

- `waitingDirection`: internal string value, likely `waiting_for_me` and `waiting_for_them`.
- `responseDueDate`: nullable date for `waiting_for_me` tasks only.
- `waitingSince`: nullable date set when a direction is first chosen or changed, so the one-week follow-up is stable and not reset by unrelated edits.

Keep `personLabel` as plain text. Do not introduce a `Person` table in this phase.

## UX Approach

- In task edit and quick actions, expose person text plus a simple direction choice.
- Use Russian labels only: `ждут от меня` and `я жду`.
- Show response due date separately from normal due date.
- On the waiting screen, group tasks by direction, not by task status.
- For `я жду` tasks without a date, keep the reminder soft and local to the waiting screen: after one week, mark them as needing a check-in. Do not add Dashboard pressure, push notifications, or weekly-review behavior in this phase.

## Implementation Risks

- Existing code and tests may still rely on `status = waiting`; migration should avoid breaking old tasks while shifting new logic to `waitingDirection`.
- `waitingSince` should not be reset on every task update; only initialize or change it when the waiting direction changes.
- Response due date must not be confused with `dueDate` or `doDate`.
- Dashboard ranking should not keep boosting tasks merely because they have a person label.

## Verification Strategy

- Add schema and validation tests for direction, response due date, and stable waiting metadata.
- Add tests for the waiting screen grouping and empty states.
- Add tests for the one-week check-in behavior on `я жду` without a date.
- Update Dashboard tests so waiting sections and focus reasons use the new derived model.

---

*Phase: 05-Waiting And People*
*Research completed inline because GSD subagents are not installed in this runtime.*
