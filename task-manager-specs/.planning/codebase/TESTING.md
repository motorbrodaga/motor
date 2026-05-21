---
last_mapped: 2026-05-21
scope: full repo
---

# Codebase Testing

## Test Systems

The codebase uses two main test systems:

- Node's built-in test runner for the large CommonJS runtime suite in `gsd-get-shit-done/tests/`.
- Vitest for TypeScript SDK tests under `gsd-get-shit-done/sdk/src/`.

## Top-Level Test Commands

Defined in `gsd-get-shit-done/package.json`:

- `npm test` - runs `node scripts/run-tests.cjs`.
- `npm run test:unit` - runs `node scripts/run-tests.cjs --suite unit`.
- `npm run test:integration` - runs `node scripts/run-tests.cjs --suite integration`.
- `npm run test:install` - runs `node scripts/run-tests.cjs --suite install`.
- `npm run test:security` - runs `node scripts/run-tests.cjs --suite security`.
- `npm run test:slow` - runs `node scripts/run-tests.cjs --suite slow`.
- `npm run test:coverage` - runs `c8` with coverage checks against `get-shit-done/bin/lib/*.cjs`.

## SDK Test Commands

Defined in `gsd-get-shit-done/sdk/package.json`:

- `npm test` - runs `vitest run`.
- `npm run test:unit` - runs `vitest run --project unit`.
- `npm run test:integration` - runs `vitest run --project integration`.

The Vitest projects are configured in `gsd-get-shit-done/vitest.config.ts`.

## Test Harness

`gsd-get-shit-done/scripts/run-tests.cjs` provides cross-platform test execution. Important behavior:

- Selects suites by filename marker.
- Treats unmarked `.test.cjs` files as unit tests.
- Supports `all`, `unit`, `integration`, `install`, `security`, and `slow`.
- Chunks long command lines to stay below Windows `CreateProcess` limits.
- Runs all chunks and reports the first non-zero failure code after all chunks complete.
- Allows `GSD_TEST_DIR` and `RUN_TESTS_MAX_CMDLINE_CHARS` overrides.

## Test Volume And Coverage

- The mapped repository has 548 files directly under `gsd-get-shit-done/tests/`.
- Coverage commands use `c8` with a 70 percent line threshold and include `gsd-get-shit-done/get-shit-done/bin/lib/*.cjs`.
- Many tests are regression-oriented and encode issue numbers in filenames, such as `bug-3491-nested-git-worktree.test.cjs`.

## Freshness Checks

The package includes many generated artifact checks:

- `check:alias-drift`
- `check:state-document-fresh`
- `check:configuration-fresh`
- `check:workstream-inventory-builder-fresh`
- `check:project-root-fresh`
- `check:plan-scan-fresh`
- `check:secrets-fresh`
- `check:schema-detect-fresh`
- `check:decisions-fresh`
- `check:workstream-name-policy-fresh`

These typically build the SDK and compare generated output to committed files.

## Lint And Policy Checks

Policy scripts include:

- `gsd-get-shit-done/scripts/lint-skill-deps.cjs`
- `gsd-get-shit-done/scripts/lint-no-source-grep.cjs`
- `gsd-get-shit-done/scripts/lint-test-file-count.cjs`
- `gsd-get-shit-done/scripts/lint-pr-check-project-dir.cjs`
- `gsd-get-shit-done/scripts/lint-command-contract.cjs`
- `gsd-get-shit-done/scripts/lint-docs-required.cjs`
- `gsd-get-shit-done/scripts/lint-descriptions.cjs`

## Security Tests And Scans

- Security suite selection is supported through `.security.test.cjs` filenames.
- Dedicated scanning scripts include `gsd-get-shit-done/scripts/secret-scan.sh`, `prompt-injection-scan.sh`, and `base64-scan.sh`.
- Generated secret-detection modules are checked through `npm run check:secrets-fresh`.

## Practical Guidance

- For runtime library changes, add or update `gsd-get-shit-done/tests/*.test.cjs`.
- For SDK changes, add or update `gsd-get-shit-done/sdk/src/**/*.test.ts` or `*.integration.test.ts`.
- For installer/runtime changes, expect tests around Windows paths, runtime artifact layouts, hook projection, and migration behavior.
- Run targeted suites first, then broader `npm test` before shipping substantial changes.

