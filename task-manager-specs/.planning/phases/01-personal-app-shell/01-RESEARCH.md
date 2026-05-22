# Phase 1: Personal App Shell - Research

**Date:** 2026-05-22
**Status:** Complete

## Research Question

What technical foundation should Phase 1 use to deliver a private, mobile-first PWA shell for Задачник with one phone/desktop entry point, a regenerable private link, Russian navigation, Dashboard-first routing, and real persistence without pulling full offline/backups forward?

## Recommendation

Use a separate `zadachnik-app/` Next.js App Router application with TypeScript, Tailwind CSS, Prisma ORM, and SQLite for the first local/server-backed MVP.

This gives Phase 1 a real full-stack walking skeleton:

- one web/PWA entry point for phone and desktop;
- server-side routes for private-link validation and regeneration;
- a real database file for access/session/settings data now and task data later;
- mobile-first UI shell with Russian labels;
- local full-stack run command that can be opened from desktop and phone on the same network.

## Findings

### PWA and routing

Next.js App Router is a good fit because it supports server-rendered routes, client components, API route handlers, and a PWA manifest in the same project. The current Next.js docs include an App Router PWA guide and describe built-in manifest support for App Router projects.

Relevant source:

- https://nextjs.org/docs/app
- https://nextjs.org/docs/app/guides/progressive-web-apps

### Persistence

Prisma ORM fits the Phase 1 need for typed data access, migrations, and an upgrade path from SQLite to a server database later. Prisma's current docs describe Prisma ORM as a Node.js/TypeScript ORM with type-safe access and migrations; the Next.js guide covers App Router-style setup.

For Phase 1, SQLite is enough if the application is served from one running server process and both phone and desktop connect to that server. This satisfies the same-database requirement for the MVP shell while deferring true offline sync and backups.

Relevant source:

- https://www.prisma.io/docs/v6/orm
- https://www.prisma.io/docs/guides/nextjs

### Testing

Playwright should be included early because Phase 1 success is visual and device-shaped: desktop route loads, mobile bottom navigation fits, private link works, and quick capture entry is reachable. Playwright officially supports Chromium/WebKit/Firefox and mobile device profiles, which is useful for checking an iPhone-like viewport.

Relevant source:

- https://playwright.dev/docs/browsers

## Stack Decision For Plans

Plan against:

- `zadachnik-app/` as the new product app root.
- Next.js App Router + TypeScript.
- Tailwind CSS for mobile-first styling.
- Prisma ORM + SQLite for local/server-backed persistence.
- Playwright for smoke and responsive checks.
- PWA manifest plus app metadata in Phase 1; advanced service-worker/offline behavior remains Phase 10.

## Scope Boundaries

In Phase 1:

- implement shell, access link, route guard, regeneration, app layout, Dashboard-first route, quick capture entry, and minimal persistence;
- create placeholder pages for Inbox, Waiting, Review, and More where needed;
- seed only the data needed for shell/access/settings.

Do not implement in Phase 1:

- full task CRUD;
- assistant capture;
- ranking logic for daily focus;
- Telegram/Gmail intake;
- calendar export;
- push notifications;
- offline mode, sync conflicts, or backups.

## Risks and Mitigations

- **Phone access depends on server reachability.** Mitigate by documenting a local LAN run path and exposing the dev host binding in npm scripts.
- **Secret link in URL can leak through sharing/history.** Mitigate by using high-entropy tokens, storing only a token hash, rotating tokens, setting an httpOnly session cookie after first validation, and avoiding heavy login.
- **SQLite is not final production sync architecture.** Mitigate by isolating data access through a small server data layer so Phase 10 can replace/extend persistence without rewriting the UI.
- **PWA can imply offline support.** Mitigate by limiting Phase 1 PWA work to manifest/installability/app-like shell and explicitly deferring offline caching/sync.

## Research Complete

The phase can be planned as a walking skeleton with four execution plans matching the roadmap placeholders.
