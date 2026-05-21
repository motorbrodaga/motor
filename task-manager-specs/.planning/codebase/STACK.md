---
last_mapped: 2026-05-21
scope: full repo
---

# Codebase Stack

## Overview

This workspace is a brownfield planning/specification project around the `gsd-get-shit-done/` codebase. The root directory contains product and implementation specs (`00-session-log.md`, `01-product-vision.md`, `02-requirements.md`, `03-domain-model.md`, `04-ux-flows.md`, `05-tech-decisions.md`, `06-open-questions.md`, `07-development-brief.md`, `08-spec-audit.md`) plus a nested implementation package at `gsd-get-shit-done/`.

The implementation package is `get-shit-done-cc`, an npm-distributed GSD system for Claude Code, OpenCode, Gemini, Codex, Copilot, Cursor, Windsurf, and related agent runtimes.

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
  - `get-shit-done-cc` -> `gsd-get-shit-done/bin/install.js`
  - `gsd-sdk` -> `gsd-get-shit-done/bin/gsd-sdk.js`
  - `gsd-tools` -> `gsd-get-shit-done/bin/gsd-sdk.js`
- SDK bin:
  - `gsd-sdk` -> `gsd-get-shit-done/sdk/dist/cli.js`

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

Several files are generated or freshness-checked:

- `gsd-get-shit-done/get-shit-done/bin/lib/*.generated.cjs`
- `gsd-get-shit-done/sdk/src/**` generated support modules
- checks such as `check:configuration-fresh`, `check:project-root-fresh`, `check:secrets-fresh`, and `check:schema-detect-fresh` in `gsd-get-shit-done/package.json`.

## Runtime Targets

The installer supports multiple runtimes and artifact layouts. Runtime-specific logic appears in:

- `gsd-get-shit-done/bin/install.js`
- `gsd-get-shit-done/get-shit-done/bin/lib/runtime-artifact-layout.cjs`
- `gsd-get-shit-done/get-shit-done/bin/lib/runtime-homes.cjs`
- `gsd-get-shit-done/get-shit-done/bin/lib/runtime-slash.cjs`
- `gsd-get-shit-done/get-shit-done/bin/lib/shell-command-projection.cjs`

