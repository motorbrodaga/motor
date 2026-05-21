---
last_mapped: 2026-05-21
scope: full repo
---

# Codebase Conventions

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

