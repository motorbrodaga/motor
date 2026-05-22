# Phase 1: Personal App Shell - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-05-22
**Phase:** 1-Personal App Shell
**Areas discussed:** app foundation, private access, first screen, navigation language, persistence foundation

---

## App Foundation

| Option | Description | Selected |
|--------|-------------|----------|
| PWA/mobile-first web app | Same web app opens on phone and desktop; can feel app-like on mobile. | yes |
| Native-ish/iOS-first | More platform-specific; heavier for MVP. | |
| Local-only prototype | Faster demo, but does not satisfy shared phone/desktop entry point. | |

**User's choice:** PWA/mobile-first web app.
**Notes:** This matches the Phase 1 requirement for one entry point across phone and desktop.

---

## Private Access

| Option | Description | Selected |
|--------|-------------|----------|
| Secret private link with regeneration | Low-friction MVP access; can be rotated if exposed. | yes |
| Link plus passcode | More protection, more friction. | |
| Heavy authentication | Email/OAuth/account setup; not needed for personal MVP shell. | |

**User's choice:** Secret link with regeneration and no heavy authentication.
**Notes:** Multi-user and team access remain outside MVP scope.

---

## First Screen

| Option | Description | Selected |
|--------|-------------|----------|
| Open to Dashboard | Makes the shell feel like the real product home. | yes |
| Open to quick capture | Optimizes capture but makes Dashboard secondary. | |
| Open to navigation/menu | Lower product value as first screen. | |

**User's choice:** Open directly to Dashboard.
**Notes:** Quick task capture still needs to be reachable from the mobile shell.

---

## Navigation Language

| Option | Description | Selected |
|--------|-------------|----------|
| Russian-only labels | Fits the user's working language and product specs. | yes |
| English/internal labels | Easier for code internals, worse visible product fit. | |
| Mixed labels | Risk of inconsistent UI tone. | |

**User's choice:** Russian-only visible UI labels.
**Notes:** Planned nav labels: `Панель`, `Входящие`, `Ожидания`, `Обзор`, `Еще`.

---

## Persistence Foundation

| Option | Description | Selected |
|--------|-------------|----------|
| Real storage foundation now | Supports future phases without treating Phase 1 as a throwaway demo. | yes |
| In-memory/demo only | Fast but fragile and likely to be replaced. | |
| Full offline/sync/backups now | Too much scope for Phase 1; belongs to Phase 10. | |

**User's choice:** Real storage foundation now, without pulling full offline/backups scope forward.
**Notes:** Planner should define enough storage for shell/access/future task data while keeping advanced reliability work deferred.

---

## The Agent's Discretion

- Exact framework, database/storage provider, deployment target, link-token implementation, and UI component structure are left to research and planning.

## Deferred Ideas

- Full offline support, conflict handling, and automatic backups remain Phase 10.
- Native app implementation is not part of Phase 1.
