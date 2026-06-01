# Phase 5: Waiting And People - Context

**Gathered:** 2026-06-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 5 turns the current lightweight person field into a usable people/waiting workflow. It covers tasks connected to a person, two waiting directions, an explicit response due date for "ждут от меня", a waiting screen, and the data needed for later resurfacing.

This phase does not build the Phase 6 weekly review, does not create full contacts/address-book management, does not import people from Telegram/Gmail, and does not add automatic notifications.

</domain>

<decisions>
## Implementation Decisions

### Person Model
- **D-01:** People remain a text label in the MVP, not a separate people directory or contact model.
- **D-02:** The existing `personLabel` idea should be reused/extended where practical so the user can type a person's name quickly.
- **D-03:** No heavy person profile, search, avatar, contact details, or merge/deduplication flow belongs in Phase 5.

### Waiting Direction
- **D-04:** The two user-facing directions are: `ждут от меня` and `я жду`.
- **D-05:** Waiting state should be derived from person plus waiting direction, not from a separate "person is waiting" tag.
- **D-06:** The UI should keep this plain and readable on cards and forms; the exact visual treatment may be chosen by the agent.

### Dates And Follow-up
- **D-07:** For `ждут от меня`, response due date is a separate field from the task's normal due date.
- **D-08:** The separate response due date should be visible enough that these tasks can appear in the waiting screen and influence daily focus later.
- **D-09:** For `я жду` tasks without a date, the one-week return/check-status behavior should be implemented later/softly. Do not force it into the Dashboard in this phase.
- **D-10:** Phase 5 may store the data needed for later one-week follow-up, but the heavy weekly review behavior remains Phase 6.

### Waiting Screen
- **D-11:** The existing `Ожидания` navigation item should become the main place to inspect people-related waiting work.
- **D-12:** The waiting screen should separate or clearly distinguish `ждут от меня` from `я жду`.
- **D-13:** The screen should stay mobile-first and Russian-only, matching the existing app style.

### The Agent's Discretion
- The agent may choose the exact field names in the Prisma schema, provided they preserve the user-facing language and requirement meaning.
- The agent may choose whether to use segmented controls, grouped lists, or sections for the waiting screen, as long as both directions are clear and scannable.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product And Planning Scope
- `.planning/ROADMAP.md` - Phase 5 goal, requirements, success criteria, and existing plan placeholders.
- `.planning/REQUIREMENTS.md` - Waiting requirements `WAIT-01` through `WAIT-05`.
- `.planning/PROJECT.md` - product identity, mobile-first Russian UI, and MVP boundaries.
- `.planning/STATE.md` - current position after Phase 4 completion.

### Prior Phase Context
- `.planning/phases/02-core-task-system/02-CONTEXT.md` - task model, current statuses, person label, task cards, and quick actions.
- `.planning/phases/04-daily-focus-dashboard/04-CONTEXT.md` - Phase 4 explicitly deferred the full waiting-direction model to Phase 5.
- `.planning/phases/04-daily-focus-dashboard/04-VERIFICATION.md` - confirms Dashboard currently uses only temporary waiting signals.

### Current App Integration Points
- `zadachnik-app/prisma/schema.prisma` - current `Task` model has `status`, `personLabel`, `dueDate`, `doDate`, and related fields.
- `zadachnik-app/src/features/tasks/TaskForm.tsx` - current task edit form already has a `Человек` text field.
- `zadachnik-app/src/features/tasks/TaskQuickActions.tsx` - current quick action can assign a person label.
- `zadachnik-app/src/features/tasks/TaskCard.tsx` - current card already displays the person label.
- `zadachnik-app/src/lib/tasks/task-validation.ts` - task patch validation must be extended for waiting direction and response due date.
- `zadachnik-app/src/app/(app)/waiting/page.tsx` - current waiting page is an empty placeholder and is the main UI integration point.
- `zadachnik-app/src/lib/dashboard/focus-ranking.ts` - Phase 4 ranking currently uses `status: waiting` or `personLabel`; planning should align it with the new derived waiting model.
- `zadachnik-app/src/lib/dashboard/dashboard-sections.ts` - Dashboard waiting section should be kept compatible with the new direction fields.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TaskForm` already edits core task fields and has a plain text `personLabel` input.
- `TaskQuickActions` already supports assigning a person from a task card.
- `TaskCard` already displays person-related signals and can be extended with waiting direction and response date chips.
- `task-validation.ts` centralizes patch parsing for task fields.
- `/waiting` route already exists as a placeholder screen.

### Established Patterns
- Task changes go through protected API routes and `validateTaskPatch`.
- Task screens are server-rendered where possible, with small client components for interactive controls.
- UI copy is Russian-only and mobile-first.
- Tests use Playwright with both desktop and mobile projects.

### Integration Points
- Add schema fields to `Task` rather than creating a people directory in Phase 5.
- Extend task create/edit/update flows so assistant capture and manual edit can persist waiting data.
- Replace the empty waiting page with grouped lists for the two directions.
- Update Dashboard ranking/sections to derive waiting from person plus direction rather than the temporary Phase 4 shortcut.

</code_context>

<specifics>
## Specific Ideas

- User wants people as simple text labels for now.
- User wants user-facing direction labels: `ждут от меня` and `я жду`.
- User wants a separate response date for `ждут от меня`.
- User wants the one-week follow-up for `я жду` without date to happen later/softly, not as a heavy immediate Dashboard behavior.

</specifics>

<deferred>
## Deferred Ideas

- Separate people/contact directory.
- Contact details, avatars, deduplication, or autocomplete from integrations.
- Weekly review/resurfacing behavior for waiting tasks, beyond storing minimal data needed later.
- Push notifications for response dates or follow-ups.

</deferred>

---

*Phase: 5-Waiting And People*
*Context gathered: 2026-06-01*
