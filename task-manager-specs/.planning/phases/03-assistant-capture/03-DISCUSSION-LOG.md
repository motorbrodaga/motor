# Phase 3: Assistant Capture - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-26
**Phase:** 3-Assistant Capture
**Areas discussed:** Capture entry point, clarification depth, confirmation contract, interpretation scope

---

## Capture Entry Point

| Option | Description | Selected |
|--------|-------------|----------|
| Inside `Быстро` | Reuse the existing quick capture button and panel. | yes |
| Separate assistant screen | Add a separate app surface for assistant capture. | |
| Dedicated navigation item | Add assistant capture to main navigation. | |

**User's choice:** In the `Быстро` button.
**Notes:** This keeps assistant capture attached to the fastest existing capture path.

---

## Clarification Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Show card immediately | Interpret the phrase and ask for confirmation without extra questions unless needed. | |
| Ask 1-2 questions | Ask only a small number of useful clarification questions. | yes |
| Step-by-step dialogue | Use a longer wizard-like task creation dialogue. | |

**User's choice:** Ask 1-2 questions.
**Notes:** The flow should stay compact and mobile-friendly.

---

## Confirmation Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Agent decides exact UX | Planner chooses labels and interaction while preserving explicit confirmation. | yes |
| Strict full-card edit before save | Require a complete card before saving. | |
| Save only after all fields known | Do not allow incomplete interpreted tasks. | |

**User's choice:** Agent decides exact confirmation behavior; incomplete tasks may be saved.
**Notes:** The confirmation contract remains mandatory: no save after the first phrase without showing the interpretation.

---

## Interpretation Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Date | Recognize task date from the phrase. | yes |
| Category | Recognize existing category from the phrase. | yes |
| Importance | Recognize importance from the phrase. | yes |
| Urgency/context/person/time | Additional fields that may be useful but are not required in Phase 3. | |

**User's choice:** Date, category, and importance.
**Notes:** Recognition should stay narrow enough to ship reliably in this phase.

---

## The Agent's Discretion

- Exact confirmation microcopy and layout.
- Whether interpretation is implemented through a deterministic parser, staged API endpoint, client-side state, or another codebase-consistent approach.
- Whether ambiguous date phrases require clarification or default to an existing scheduling field.

## Deferred Ideas

- Telegram/Gmail assistant intake remains Phase 8.
- Full waiting behavior remains Phase 5.
- Voice input, subtasks, recurrence, and collaboration remain outside the MVP phase.
