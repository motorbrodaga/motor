---
last_mapped: 2026-05-21
scope: full repo
---

# Codebase Architecture

## System Shape

The workspace has two layers:

1. Root planning/spec layer: product and implementation documents in `00-session-log.md` through `08-spec-audit.md`.
2. Nested implementation layer: `gsd-get-shit-done/`, an npm package that installs and runs the GSD workflow system across agent runtimes.

The implementation architecture is file-based and command-oriented. User-facing commands load workflow markdown, workflows call `gsd-sdk query` handlers, handlers read/write `.planning/` artifacts, and agents/hooks/scripts provide specialized automation around that loop.

## Primary Flow

```text
User command
  -> commands/gsd/*.md
  -> get-shit-done/workflows/*.md
  -> gsd-sdk query handlers
  -> get-shit-done/bin/lib/*.cjs
  -> .planning/* artifacts
```

For installed runtimes, the command surface differs by adapter, but the underlying workflow and library modules stay shared.

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
  - `core.cjs` for shared config/path/model helpers.
  - `init.cjs` and `init-command-router.cjs` for workflow initialization context.
  - `roadmap.cjs` and `roadmap-command-router.cjs` for roadmap operations.
  - `state.cjs`, `state-document.cjs`, and `state-command-router.cjs` for state management.
  - `config.cjs` and `config-schema.cjs` for planning configuration.
  - `runtime-artifact-layout.cjs`, `runtime-homes.cjs`, and `runtime-slash.cjs` for runtime portability.

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

1. A user invokes a GSD command.
2. The command references workflow instructions.
3. The workflow loads structured context using `gsd-sdk query`.
4. Workflow steps create or update `.planning/` markdown/JSON artifacts.
5. Agents or inline fallback steps read those artifacts in later phases.
6. Verification, ship, transition, and milestone flows update state and traceability.

## State Model

GSD intentionally uses a file-based state model. Important artifact paths include:

- `.planning/PROJECT.md`
- `.planning/config.json`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/phases/`
- `.planning/research/`
- `.planning/codebase/`

This mapping created `.planning/codebase/` for the current workspace.

## Architectural Pattern

The codebase favors a hybrid of:

- markdown-as-workflow for user-facing orchestration,
- CommonJS modules for stable runtime behavior,
- TypeScript SDK code for typed programmatic integration,
- file-system artifacts as the durable state boundary,
- generated files for repeated runtime projections and schema-derived support code.

## Boundary Notes

- Root docs (`01-product-vision.md`, `02-requirements.md`, etc.) should inform project initialization, but they are not executable code.
- `gsd-get-shit-done/` is a nested package and should be treated as the implementation codebase.
- Sensitive Telegram files described in `AGENTS.md` are outside the architecture map and should remain uninspected unless specifically needed.

