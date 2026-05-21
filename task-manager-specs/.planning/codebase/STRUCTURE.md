---
last_mapped: 2026-05-21
scope: full repo
---

# Codebase Structure

## Root Workspace

- `README.md` - root project overview.
- `00-session-log.md` - session/history context.
- `01-product-vision.md` - product framing.
- `02-requirements.md` - requirements/specification material.
- `03-domain-model.md` - domain entities and relationships.
- `04-ux-flows.md` - user experience flows.
- `05-tech-decisions.md` - technical decisions.
- `06-open-questions.md` - unresolved questions.
- `07-development-brief.md` - implementation brief.
- `08-spec-audit.md` - audit/review of specification quality.
- `.codex/` - project-local Codex/GSD skills, workflows, templates, and configuration.
- `gsd-get-shit-done/` - nested implementation package.
- `.planning/codebase/` - codebase map created by this workflow.

## Implementation Package

`gsd-get-shit-done/` is the main package root.

- `package.json` - npm metadata, bins, dependencies, scripts.
- `package-lock.json` - top-level dependency lock.
- `README.md` and translated READMEs - user-facing package docs.
- `CHANGELOG.md`, `VERSIONING.md`, `SECURITY.md`, `CONTRIBUTING.md` - release and contributor docs.
- `vitest.config.ts` - SDK test project configuration.
- `tsconfig.json` - TypeScript configuration.

## Command And Workflow Layout

- `gsd-get-shit-done/commands/gsd/` - command entrypoints such as `new-project.md`, `map-codebase.md`, `plan-phase.md`, `execute-phase.md`, and namespace routers.
- `gsd-get-shit-done/get-shit-done/workflows/` - workflow bodies used by commands.
- `gsd-get-shit-done/get-shit-done/references/` - shared workflow reference material.
- `gsd-get-shit-done/get-shit-done/templates/` - markdown templates for planning, research, codebase maps, and runtime instructions.
- `gsd-get-shit-done/agents/` - agent definitions such as `gsd-codebase-mapper.md`, `gsd-roadmapper.md`, and `gsd-executor.md`.

## Runtime Library Layout

- `gsd-get-shit-done/get-shit-done/bin/gsd-tools.cjs` - legacy/central tool entrypoint.
- `gsd-get-shit-done/get-shit-done/bin/check-latest-version.cjs` - update/version helper.
- `gsd-get-shit-done/get-shit-done/bin/lib/` - CommonJS runtime modules.
- `gsd-get-shit-done/bin/install.js` - npm bin for installing GSD surfaces into supported runtimes.
- `gsd-get-shit-done/bin/gsd-sdk.js` - SDK compatibility shim.

## SDK Layout

- `gsd-get-shit-done/sdk/package.json` - SDK package metadata.
- `gsd-get-shit-done/sdk/src/` - TypeScript SDK source and SDK tests.
- `gsd-get-shit-done/sdk/shared/` - shared SDK assets.
- `gsd-get-shit-done/sdk/prompts/` - SDK prompt assets.
- `gsd-get-shit-done/sdk/dist/` - built SDK output expected by bin shims and package exports.

## Test Layout

- `gsd-get-shit-done/tests/` - large CommonJS test suite for runtime behavior, regressions, installer behavior, workflow constraints, command routing, and generated artifact freshness.
- `gsd-get-shit-done/sdk/src/**/*.test.ts` - SDK unit tests.
- `gsd-get-shit-done/sdk/src/**/*.integration.test.ts` - SDK integration tests.
- `gsd-get-shit-done/tests/fixtures/` - adversarial and fixture data.

## Scripts And Hooks

- `gsd-get-shit-done/scripts/` - release, lint, generator, changeset, security, and test helper scripts.
- `gsd-get-shit-done/hooks/` - runtime hook entrypoints.
- `gsd-get-shit-done/hooks/lib/` - hook helper scripts.
- `gsd-get-shit-done/.githooks/` - repository hook configuration.

## Documentation Layout

- `gsd-get-shit-done/docs/` - architecture, commands, configuration, user guide, release notes, ADRs, PRDs, research notes, and localized docs.
- `gsd-get-shit-done/docs/adr/` - architecture decision records.
- `gsd-get-shit-done/docs/prd/` - product requirement docs.
- `gsd-get-shit-done/docs/research/` - research artifacts.
- `gsd-get-shit-done/docs/{ja-JP,ko-KR,pt-BR,zh-CN}/` - localized documentation.

## Naming Conventions

- Commands use `gsd-*.md` filenames and hyphenated command names.
- Agents use `gsd-*.md` filenames with agent names matching frontmatter.
- Runtime library modules use kebab-case or domain-focused names ending in `.cjs`.
- Tests often encode issue numbers in filenames, e.g. `bug-3491-nested-git-worktree.test.cjs`.
- Generated runtime files include `.generated.cjs` in their names.

