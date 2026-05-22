# Walking Skeleton - Задачник

**Phase:** 1
**Generated:** 2026-05-22

## Capability Proven End-to-End

A user can open a private Задачник PWA link from phone or desktop, pass through the same server-backed access path, land on Dashboard, navigate the Russian mobile shell, and reach quick task capture while the app reads/writes its access state in a real database.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js App Router + TypeScript in `zadachnik-app/` | Provides routes, server actions/route handlers, client UI, PWA metadata, and a clean separation from the root specs and nested GSD package. |
| Data layer | Prisma ORM + SQLite for Phase 1 | Gives real migrations and typed access now while keeping the first setup local and low-friction. Future phases can migrate to a hosted database if deployment needs grow. |
| Auth/access | High-entropy private link token, hashed in database, with httpOnly session cookie after validation | Matches the MVP decision: private secret link with regeneration, no heavy authentication or accounts. |
| Deployment target | Local full-stack dev server reachable from desktop and phone on the same network; deployment can be added later | Satisfies the walking skeleton without requiring external account setup during Phase 1. |
| Directory layout | `zadachnik-app/src/app`, `zadachnik-app/src/features`, `zadachnik-app/src/lib`, `zadachnik-app/prisma` | Keeps routes, feature UI, shared server utilities, and schema separate enough for later vertical slices. |

## Stack Touched in Phase 1

- [ ] Project scaffold (framework, build, lint, test runner)
- [ ] Routing - private entry route plus app shell routes
- [ ] Database - access token/session/settings read and write
- [ ] UI - Dashboard, bottom navigation, and quick capture entry wired to app state
- [ ] Deployment - documented local full-stack run command for desktop and phone

## Out of Scope (Deferred to Later Slices)

- Full task CRUD and task model
- Assistant capture dialogue
- Daily top-3 ranking logic
- Telegram/Gmail intake
- Calendar export and push notifications
- Offline cache, sync queue, conflict handling, and backups
- Multi-user accounts, shared spaces, OAuth, email login, password reset

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without renegotiating the foundation:

- Phase 2: real task model, CRUD, organization, notes, and quick actions.
- Phase 3: assistant capture that saves confirmed tasks into the Phase 2 model.
- Phase 4: real Dashboard sections and top-3 daily focus behavior.
- Phase 5: people and waiting workflows.
- Phase 6: weekly review and resurfacing.
- Phase 7: completion history and simple statistics.
- Phase 8: explicit Telegram/Gmail intake.
- Phase 9: calendar and optional notifications.
- Phase 10: offline behavior, conflicts, and backups.
