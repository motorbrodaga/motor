# Phase 1: Personal App Shell - Context

**Gathered:** 2026-05-22
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the first usable private app shell for Задачник: one mobile-first PWA/web entry point that works on phone and desktop, protects access through a personal private link, exposes the main app navigation, opens to Dashboard, and provides an entry point for quick task capture. It does not implement the full task model, assistant capture, offline/conflict handling, backups, calendar export, notifications, or external intake.

</domain>

<decisions>
## Implementation Decisions

### App Foundation
- **D-01:** Build Phase 1 as a PWA/mobile-first web app.
- **D-02:** The same app entry point must work from phone and desktop.
- **D-03:** The phone experience should feel app-like, but native app work is out of scope for this phase.

### Private Access
- **D-04:** Use a private secret link for MVP access.
- **D-05:** The user must be able to regenerate the private link.
- **D-06:** Do not add heavy authentication in Phase 1. Avoid email login, OAuth, account setup, or multi-user access unless a later phase changes this.

### First Screen And Navigation
- **D-07:** Opening the app should land on Dashboard.
- **D-08:** Quick task capture must be reachable from the mobile shell, but it should not replace Dashboard as the first screen.
- **D-09:** Navigation labels and visible UI copy for the core shell must be Russian-only.
- **D-10:** The mobile bottom navigation should use Russian labels corresponding to the planned sections: `Панель`, `Входящие`, `Ожидания`, `Обзор`, `Еще`.

### Persistence Foundation
- **D-11:** Choose and implement a real storage foundation during Phase 1.
- **D-12:** Keep the storage work scoped to the foundation needed for the app shell, private access, and future task data. Do not pull full offline mode, conflict handling, or automatic backups from Phase 10 into this phase.

### The Agent's Discretion
- The planner and researcher may choose the exact web framework, hosting/deployment shape, database, schema details, and implementation libraries, as long as they preserve the decisions above and fit the codebase/project constraints.
- Empty states, placeholder Dashboard content, and shell polish can use standard mobile app patterns, but should stay quiet, practical, and personal rather than marketing-like.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product And Scope
- `.planning/ROADMAP.md` - Phase 1 goal, requirements, success criteria, and plan placeholders.
- `.planning/REQUIREMENTS.md` - v1 requirement mapping, especially `ACCS-01`, `ACCS-02`, `ACCS-03`, `DASH-01`, and `MOBL-01` through `MOBL-04`.
- `.planning/PROJECT.md` - product identity, MVP framing, and project-level constraints.
- `.planning/STATE.md` - current focus, blockers, and open storage/sync concern noted for Phase 1.

### Source Specifications
- `01-product-vision.md` - product intent: prevent tasks from being lost.
- `02-requirements.md` - original functional requirements and acceptance details.
- `04-ux-flows.md` - expected user flows for opening, navigation, dashboard, and capture.
- `05-tech-decisions.md` - prior technical decisions and open questions relevant to stack/storage.
- `07-development-brief.md` - development brief for implementation planning.
- `08-spec-audit.md` - audit trail and traceability notes.

### Codebase Maps
- `.planning/codebase/STACK.md` - current repository stack and runtime context.
- `.planning/codebase/STRUCTURE.md` - repository layout and project/spec separation.
- `.planning/codebase/CONVENTIONS.md` - existing conventions to respect when adding project files.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing Задачник application shell is present yet. Phase 1 is a greenfield app start inside a specs/planning workspace.
- The nested `gsd-get-shit-done/` package is GSD tooling, not the task manager implementation.

### Established Patterns
- The workspace already treats Markdown planning artifacts as source-of-truth and keeps implementation decisions in `.planning/`.
- Node.js is available in the repository context, but the planner should still validate the best app/runtime stack for the new PWA rather than assuming the nested GSD package is the application base.

### Integration Points
- New application code should connect back to the root product specs and `.planning` artifacts, not to the internal GSD package as a product dependency.
- Sensitive local files mentioned in `AGENTS.md` must remain private and should not be copied, logged, or committed.

</code_context>

<specifics>
## Specific Ideas

- The user explicitly chose: PWA/mobile-first web app.
- The user explicitly chose: secret private link with regeneration and no heavy authentication.
- The user explicitly chose: Dashboard as the first screen.
- The user explicitly chose: Russian-only visible shell language.
- The user explicitly chose: real storage foundation now, while deferring full offline/backups/conflict handling to later phases.

</specifics>

<deferred>
## Deferred Ideas

- Full offline phone usage, sync conflicts, and automatic backups remain Phase 10 scope.
- Native mobile app implementation remains out of scope unless a later phase or roadmap update adds it.
- Calendar, push notifications, Telegram/Gmail intake, assistant capture, and full task CRUD remain later phase scope.

</deferred>

---

*Phase: 1-Personal App Shell*
*Context gathered: 2026-05-22*
