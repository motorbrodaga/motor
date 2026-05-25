# Phase 3: Assistant Capture - Context

**Gathered:** 2026-05-26
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase adds assistant-guided task capture inside the existing quick capture flow. The user can describe a task in natural language, the assistant asks at most one or two clarifying questions when useful, prepares an interpreted task card, and saves into the existing task system only after explicit confirmation.

This phase does not implement Telegram/Gmail intake, automatic message scanning, voice input, subtasks, recurrence, dashboard ranking, waiting workflows beyond lightweight person-related interpretation, notifications, calendar export, offline sync, backups, or multi-user collaboration.

</domain>

<decisions>
## Implementation Decisions

### Capture Entry Point
- **D-01:** Assistant capture lives inside the existing `Быстро` button and quick capture panel, not as a separate main navigation item or standalone page.
- **D-02:** The current fastest manual title-only capture path must remain available. Assistant behavior should enhance quick capture, not make simple capture slower.
- **D-03:** The assistant flow should feel mobile-first and compact, using the existing protected shell and Russian-only UI.

### Clarification Flow
- **D-04:** After the first user phrase, the assistant may ask one or two clarifying questions when the missing detail matters.
- **D-05:** The assistant should not run a long wizard. If details remain unknown after the short clarification, it should prepare a partial task card and let the user confirm or edit.
- **D-06:** Clarifying questions should focus on the Phase 3 recognition targets: date, category, and importance.

### Confirmation Contract
- **D-07:** The assistant must not save immediately after the first phrase. It must show the interpreted task card or equivalent summary before saving.
- **D-08:** The user may save an incomplete interpreted task after explicit confirmation.
- **D-09:** The planner may choose the exact confirmation labels and microcopy. Recommended Russian actions: `Сохранить`, `Изменить`, and `Отмена`.
- **D-10:** `Сохранить` creates the task in the same model and tables as manual tasks. `Изменить` lets the user adjust interpreted fields before saving. `Отмена` exits without creating a task.
- **D-11:** The confirmation UI should clearly distinguish interpreted fields from missing optional fields so the user can trust what will be saved.

### Natural-Language Understanding
- **D-12:** Phase 3 must recognize task title plus date, category, and importance from the user's phrase when reasonably obvious.
- **D-13:** Date recognition should map to the existing scheduling fields. The planner should decide whether ambiguous natural dates default to `doDate` or require clarification, but must preserve the Phase 2 distinction between `doDate` and `dueDate`.
- **D-14:** Category recognition should match existing default and custom categories when possible; uncertain matches should be shown for confirmation rather than silently applied.
- **D-15:** Importance recognition should map into the existing `importance` field. Urgency is not a primary Phase 3 target unless the planner can support it without expanding the conversation.
- **D-16:** The assistant should avoid inventing unsupported fields. Unknown information remains empty after confirmation.

### Data And Integration
- **D-17:** Confirmed assistant-created tasks use the existing Phase 2 task APIs/model wherever practical.
- **D-18:** If source metadata is useful, keep it lightweight and internal, such as a local capture-mode marker. Do not add Telegram/Gmail source handling in this phase.
- **D-19:** All assistant routes/actions must keep the existing private-link session boundary.

### The Agent's Discretion
- The user explicitly delegated the exact confirmation interaction to the agent.
- The planner may decide whether the assistant flow is implemented as a local deterministic parser, a structured endpoint, a client-side staged card, or another codebase-consistent mechanism, as long as it preserves the confirmation contract and Phase 3 scope.
- The planner may decide the exact visual layout inside `Быстро`, provided it remains fast on phone and does not introduce a heavy chat product.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product And Planning Scope
- `.planning/ROADMAP.md` - Phase 3 goal, requirements, success criteria, and three plan placeholders.
- `.planning/REQUIREMENTS.md` - Assistant Capture requirements `CAPT-01` through `CAPT-05`.
- `.planning/PROJECT.md` - product identity, core value, Russian/mobile-first framing, privacy boundaries, and out-of-scope items.
- `.planning/STATE.md` - current phase position after Phase 2 completion.

### Prior Phase Context
- `.planning/phases/01-personal-app-shell/01-CONTEXT.md` - locked PWA/mobile-first, private-link, Dashboard-first, and Russian UI decisions.
- `.planning/phases/02-core-task-system/02-CONTEXT.md` - task model, quick capture, confirmation, optional fields, categories, scheduling, and task API decisions.
- `.planning/phases/02-core-task-system/02-VERIFICATION.md` - confirms the core task system is accepted and available as the base for assistant-created tasks.

### Source Specifications
- `02-requirements.md` - original assistant capture and task requirements.
- `03-domain-model.md` - task fields and assistant-related task-source concepts.
- `04-ux-flows.md` - quick add and assistant clarification flow references.
- `05-tech-decisions.md` - technical framing and deferred integration notes.
- `07-development-brief.md` - compact implementation brief for task capture and out-of-scope boundaries.

### Current App Integration Points
- `zadachnik-app/src/features/capture/QuickCaptureEntry.tsx` - existing `Быстро` entry point.
- `zadachnik-app/src/features/capture/QuickCapturePanel.tsx` - current quick capture panel to extend with assistant capture.
- `zadachnik-app/src/app/api/tasks/route.ts` - current task creation API.
- `zadachnik-app/src/app/api/tasks/[id]/route.ts` - current task update API.
- `zadachnik-app/src/lib/tasks/task-validation.ts` - existing validation helpers for task fields.
- `zadachnik-app/src/lib/tasks/task-options.ts` - status, importance, category, and context option definitions.
- `zadachnik-app/src/features/tasks/TaskForm.tsx` - existing editable task field UI.
- `zadachnik-app/prisma/schema.prisma` - current task/category/context/project/note data model.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `QuickCaptureEntry` and `QuickCapturePanel` already provide the mobile quick capture surface where Phase 3 should live.
- `/api/tasks` already creates title-only tasks and can be reused or extended for confirmed assistant-created tasks.
- `task-validation.ts` already normalizes dates, text, minutes, status, importance, category, project, context, and description fields.
- `task-options.ts` defines the existing status and importance vocabulary and seeded organization defaults.
- `TaskForm` and task card components show how task fields are represented after creation.

### Established Patterns
- The app uses Next.js App Router, TypeScript, Prisma, protected routes, and Playwright E2E tests.
- UI is Russian-only, mobile-first, and embedded in the existing protected shell.
- Phase 2 uses regular JSON API routes and `router.refresh()` after task mutations.
- Unknown optional fields are allowed and should not block task creation after confirmation.

### Integration Points
- Extend the quick capture panel with an assistant mode or staged flow.
- Add an interpretation step before task creation.
- Show an interpreted task card/summary before save.
- Save confirmed tasks through the existing task model and session-protected API boundary.
- Add E2E coverage for assistant capture: interpret phrase, clarify, confirm save, cancel without save, save incomplete task.

</code_context>

<specifics>
## Specific Ideas

- User wants assistant capture inside the `Быстро` button.
- User wants only one or two clarifying questions, not a long setup flow.
- User delegated the exact confirmation UX to the agent.
- User explicitly allows saving an incomplete task after confirmation.
- Phase 3 recognition target is limited to date, category, and importance.

</specifics>

<deferred>
## Deferred Ideas

- Telegram/Gmail task creation remains Phase 8.
- Dashboard top-3 and morning focus behavior remain Phase 4.
- Full waiting direction behavior remains Phase 5.
- Calendar export remains Phase 9.
- Offline sync, conflict handling, and backups remain Phase 10.
- Voice input, subtasks, recurrence, attachments, tags, and collaboration remain out of scope for the MVP phase.

</deferred>

---

*Phase: 3-Assistant Capture*
*Context gathered: 2026-05-26*
