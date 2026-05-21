<!-- GSD:project-start source:PROJECT.md -->
## Project

**Задачник**

Задачник — личный таск-менеджер для одного пользователя, который заменяет ненадежную память и разрозненные заметки внешней системой управления задачами, сроками, ожиданиями и дневным фокусом. Первая версия должна работать с телефона и компьютера с общей актуальной базой задач, но главный сценарий должен быть удобен именно на телефоне.

Продукт строится вокруг мягкого возврата задач в поле внимания: быстрый захват, диалоговое уточнение через ассистента, утренняя панель с главными задачами дня, ожидания по людям и еженедельный обзор забытых или зависших задач.

**Core Value:** Не дать задачам потеряться.

### Constraints

- **Audience**: один пользователь в MVP — командные роли и общий доступ исключены, чтобы не раздувать первую версию.
- **Device**: главный сценарий должен работать с телефона — интерфейс и быстрый захват задач должны проектироваться mobile-first.
- **Cross-device**: телефон и компьютер должны видеть одну актуальную базу — нужно выбрать способ хранения и синхронизации.
- **Offline**: нужна офлайн-работа на телефоне — архитектура должна поддерживать локальное состояние и синхронизацию.
- **Conflict policy**: при офлайн-конфликтах побеждает последняя версия изменения — простое правило важнее сложного merge в MVP.
- **Access**: персональный доступ через приватную ссылку — нужна возможность перегенерировать ссылку.
- **Backups**: нужны автоматические бэкапы — потеря задач противоречит core value.
- **Notifications**: push-уведомления остаются в MVP, но должны быть опциональными — мягкие обзоры важнее жесткого давления.
- **Calendar**: нужна интеграция с календарем iPhone — способ интеграции еще нужно выбрать перед реализацией.
- **Telegram/Gmail privacy**: задачи создаются только по явной просьбе пользователя — система не сканирует всю переписку автоматически.
- **Project state**: проект находится внутри внешнего git worktree `C:/Users/maksd/OneDrive/Документы/New project 2` — git-операции должны учитывать внешний корень.
- **GSD agents**: нужные GSD subagents не установлены в проверенном runtime — дальнейшие research/roadmap шаги могут выполняться inline.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Overview
## Languages And Runtimes
- JavaScript CommonJS is the dominant runtime layer in `gsd-get-shit-done/bin/`, `gsd-get-shit-done/get-shit-done/bin/lib/`, `gsd-get-shit-done/hooks/`, `gsd-get-shit-done/scripts/`, and `gsd-get-shit-done/tests/`.
- TypeScript is used for the SDK source in `gsd-get-shit-done/sdk/src/` and is built to `gsd-get-shit-done/sdk/dist/`.
- Markdown is a first-class executable/configuration surface in `gsd-get-shit-done/commands/`, `gsd-get-shit-done/get-shit-done/workflows/`, `gsd-get-shit-done/agents/`, `gsd-get-shit-done/docs/`, and the root specification documents.
- Shell scripts support hooks, release checks, security scans, and tarball verification in `gsd-get-shit-done/hooks/` and `gsd-get-shit-done/scripts/`.
- Runtime requirement is Node.js `>=22.0.0`, declared in both `gsd-get-shit-done/package.json` and `gsd-get-shit-done/sdk/package.json`.
## Package Surfaces
- Main npm package: `gsd-get-shit-done/package.json`.
- SDK package metadata: `gsd-get-shit-done/sdk/package.json`.
- Top-level bins:
- SDK bin:
## Key Dependencies
- `@anthropic-ai/claude-agent-sdk` powers agent/SDK execution integration.
- `ws` supports WebSocket communication.
- `synckit` is used by the SDK package for synchronous worker-style bridges.
- `fallow` is an optional dependency for structural review flows.
- `typescript`, `tsx`, and `vitest` support SDK build and testing.
- `c8` provides coverage enforcement for the CommonJS runtime layer.
## Build And Test Commands
- `npm run build:sdk` in `gsd-get-shit-done/` runs `npm ci` and builds the SDK.
- `npm run build:hooks` builds generated hook assets through `gsd-get-shit-done/scripts/build-hooks.js`.
- `npm test` runs the cross-platform Node test harness at `gsd-get-shit-done/scripts/run-tests.cjs`.
- `npm run test:unit`, `npm run test:integration`, `npm run test:install`, `npm run test:security`, and `npm run test:slow` select suites by filename convention.
- `npm run test:coverage` uses `c8` against `gsd-get-shit-done/get-shit-done/bin/lib/*.cjs`.
- `npm run prepublishOnly` builds hooks and SDK before packaging.
## Configuration Files
- `gsd-get-shit-done/tsconfig.json` configures TypeScript for the top-level package.
- `gsd-get-shit-done/sdk/tsconfig.json` configures the SDK build.
- `gsd-get-shit-done/vitest.config.ts` defines SDK unit and integration projects rooted at `gsd-get-shit-done/sdk`.
- `gsd-get-shit-done/package-lock.json` and `gsd-get-shit-done/sdk/package-lock.json` pin dependencies.
## Generated Files
- `gsd-get-shit-done/get-shit-done/bin/lib/*.generated.cjs`
- `gsd-get-shit-done/sdk/src/**` generated support modules
- checks such as `check:configuration-fresh`, `check:project-root-fresh`, `check:secrets-fresh`, and `check:schema-detect-fresh` in `gsd-get-shit-done/package.json`.
## Runtime Targets
- `gsd-get-shit-done/bin/install.js`
- `gsd-get-shit-done/get-shit-done/bin/lib/runtime-artifact-layout.cjs`
- `gsd-get-shit-done/get-shit-done/bin/lib/runtime-homes.cjs`
- `gsd-get-shit-done/get-shit-done/bin/lib/runtime-slash.cjs`
- `gsd-get-shit-done/get-shit-done/bin/lib/shell-command-projection.cjs`
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## General Style
- Runtime implementation code in `gsd-get-shit-done/get-shit-done/bin/lib/` uses CommonJS with `require`, `module.exports`, and `.cjs` extensions.
- SDK code in `gsd-get-shit-done/sdk/src/` uses TypeScript and ESM package semantics from `gsd-get-shit-done/sdk/package.json`.
- Scripts use either `.cjs`, `.js`, `.mjs`, `.ts`, or shell extensions depending on runtime needs.
- Markdown files are executable workflow/spec artifacts, not only prose documentation.
## Command And Workflow Style
- User-facing command files live under `gsd-get-shit-done/commands/gsd/`.
- Workflow bodies live under `gsd-get-shit-done/get-shit-done/workflows/`.
- Workflow files use XML-like section tags (`<purpose>`, `<process>`, `<output>`, `<success_criteria>`) to structure agent-readable instructions.
- Workflows prefer `gsd-sdk query` for structured state and helper operations.
- Large workflow logic is decomposed into references, modes, templates, and subdirectories where possible.
## Module Style
- Shared logic is grouped by domain in `gsd-get-shit-done/get-shit-done/bin/lib/`.
- Router modules pair with domain modules, for example `roadmap.cjs` with `roadmap-command-router.cjs`, and `state.cjs` with `state-command-router.cjs`.
- Generated files are committed with `.generated.cjs` names and checked by freshness scripts.
- Cross-platform shell behavior is centralized rather than scattered, especially in `shell-command-projection.cjs`.
## Error Handling Patterns
- CLI helpers tend to fail with explicit messages and non-zero exits rather than silently ignoring invalid input.
- Test and script runners validate command-line flags, duplicate flags, missing values, and unknown arguments.
- Many modules use defensive filesystem operations with try/catch around optional directories and absent state.
- Installer code is explicit about runtime allow-lists and migration behavior, avoiding assumptions for unknown runtimes.
## State And Artifact Conventions
- Planning state is stored in `.planning/` as markdown and JSON.
- Project docs are intended to be human-readable and version-control friendly.
- Workflows commit planning artifacts atomically when `commit_docs` is enabled.
- Codebase maps live under `.planning/codebase/` and include real file paths in backticks.
## Security Conventions
- Secret scanning is built into scripts and workflow gates.
- Prompt/read guards live in `gsd-get-shit-done/hooks/`.
- The project-level `AGENTS.md` explicitly forbids printing `.env` and Telegram session contents.
- Runtime hook and installer projections are centralized to reduce shell-command drift and quoting mistakes.
## Testing Conventions
- CommonJS tests live in `gsd-get-shit-done/tests/*.test.cjs`.
- Suite markers are filename suffixes such as `.integration.test.cjs`, `.install.test.cjs`, `.security.test.cjs`, and `.slow.test.cjs`.
- Unmarked `.test.cjs` files are treated as unit tests by `gsd-get-shit-done/scripts/run-tests.cjs`.
- SDK tests use Vitest with project roots configured in `gsd-get-shit-done/vitest.config.ts`.
## Documentation Conventions
- Architecture and user-facing docs live in `gsd-get-shit-done/docs/`.
- ADRs live under `gsd-get-shit-done/docs/adr/`.
- Localized docs mirror key user documentation under language-specific directories.
- Root-level numbered documents appear to form a product/spec sequence for this workspace.
## Practical Guidance For Future Work
- Prefer changing shared modules in `gsd-get-shit-done/get-shit-done/bin/lib/` rather than duplicating behavior in command/workflow prose.
- When touching generated files, update the source generator and run the matching freshness check.
- When adding tests, follow filename suite markers so `scripts/run-tests.cjs --suite <name>` routes correctly.
- Avoid reading or committing `.env`, `.telegram_sessions/`, and downloaded personal files mentioned in `AGENTS.md`.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Shape
## Primary Flow
```text
```
## Major Layers
### Command Layer
- `gsd-get-shit-done/commands/gsd/*.md` contains slash command bodies.
- Project-local Codex skills are materialized under `.codex/skills/`.
- Commands are thin bootstrap surfaces; most detailed orchestration lives in workflow files.
### Workflow Layer
- `gsd-get-shit-done/get-shit-done/workflows/*.md` contains step-by-step process definitions.
- Large workflows are decomposed into subdirectories such as `gsd-get-shit-done/get-shit-done/workflows/execute-phase/`.
- Workflow files commonly call `gsd-sdk query init.<workflow>` to load state and configuration.
### Library Layer
- `gsd-get-shit-done/get-shit-done/bin/lib/*.cjs` contains reusable CommonJS implementation modules.
- Examples:
### SDK Layer
- `gsd-get-shit-done/sdk/src/` is TypeScript source for the SDK.
- `gsd-get-shit-done/bin/gsd-sdk.js` is a compatibility shim that delegates to built SDK output.
- The SDK package is published from `gsd-get-shit-done/sdk/` and exports `dist/index.js`.
### Installer Layer
- `gsd-get-shit-done/bin/install.js` is the main installer.
- It stages commands, skills, agents, hooks, SDK shims, runtime-specific config, and migration behavior.
- Installer migration modules live in `gsd-get-shit-done/get-shit-done/bin/lib/installer-migrations*.cjs`.
### Hook Layer
- Hook entrypoints live in `gsd-get-shit-done/hooks/`.
- Hook helper modules live in `gsd-get-shit-done/hooks/lib/`.
- Hook projection and platform-specific command generation are centralized in `shell-command-projection.cjs`.
### Agent Layer
- Agent definitions live in `gsd-get-shit-done/agents/*.md`.
- Each agent is a specialized markdown prompt/config artifact, for example `gsd-codebase-mapper.md`, `gsd-roadmapper.md`, and `gsd-executor.md`.
- The current Codex runtime did not have the required global agent definitions installed, so this mapping used the sequential fallback.
## Data Flow
## State Model
- `.planning/PROJECT.md`
- `.planning/config.json`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/phases/`
- `.planning/research/`
- `.planning/codebase/`
## Architectural Pattern
- markdown-as-workflow for user-facing orchestration,
- CommonJS modules for stable runtime behavior,
- TypeScript SDK code for typed programmatic integration,
- file-system artifacts as the durable state boundary,
- generated files for repeated runtime projections and schema-derived support code.
## Boundary Notes
- Root docs (`01-product-vision.md`, `02-requirements.md`, etc.) should inform project initialization, but they are not executable code.
- `gsd-get-shit-done/` is a nested package and should be treated as the implementation codebase.
- Sensitive Telegram files described in `AGENTS.md` are outside the architecture map and should remain uninspected unless specifically needed.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
