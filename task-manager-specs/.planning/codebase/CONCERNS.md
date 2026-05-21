---
last_mapped: 2026-05-21
scope: full repo
---

# Codebase Concerns

## Current Mapping Limits

- This map was created with the sequential fallback because the required `gsd-codebase-mapper` agent was not installed in the checked runtime.
- The repository is large, with hundreds of tests and many generated/runtime-specific files. This first map captures the major architecture and risk areas, not every module contract.
- The root workspace contains specs plus a nested package; future planning should be explicit about whether changes target the root spec docs or `gsd-get-shit-done/`.

## Sensitive Local Data

- Project instructions mention `.env`, `.telegram_sessions/chief_agent.session.txt`, Telegram imports, and investment portfolio files.
- Those files must not be printed, copied, or committed unless the user explicitly asks and the action is safe.
- Any workflow that imports Telegram materials should use the safe patterns described in `AGENTS.md` and avoid logging secrets.

## Nested Worktree Risk

- GSD init detected this project is inside an existing git worktree rooted at `C:/Users/maksd/OneDrive/Документы/New project 2`.
- Planning files in `task-manager-specs/.planning/` are tracked by the outer repository, not a nested `.git`.
- Avoid running commands that assume the current folder is the git root unless they account for the outer worktree.

## Generated Artifact Drift

- Many files are generated and guarded by freshness checks.
- Editing generated files such as `gsd-get-shit-done/get-shit-done/bin/lib/*.generated.cjs` directly can create drift unless the corresponding generator is updated.
- Relevant checks are listed in `gsd-get-shit-done/package.json` and `gsd-get-shit-done/sdk/package.json`.

## Runtime Matrix Complexity

- The installer supports many runtimes with different command, skill, hook, and namespace behaviors.
- Changes in `gsd-get-shit-done/bin/install.js`, `runtime-artifact-layout.cjs`, `runtime-slash.cjs`, or `shell-command-projection.cjs` can have wide blast radius.
- Windows path behavior is a recurring theme in tests and should be treated as a high-risk area.

## Shell And Path Safety

- The codebase contains many shell-facing scripts and generated hook commands.
- Cross-platform behavior is centralized, but any new command construction should preserve quoting, path, and shell semantics.
- Avoid ad hoc string-built shell operations when a shared helper exists.

## Test Suite Scale

- There are 548 direct test files under `gsd-get-shit-done/tests/`.
- Full test runs may be slower than targeted suites; use suite filters during development, then broaden verification.
- The custom test runner chunks command lines for Windows, so new test harness behavior must preserve that constraint.

## Documentation As Executable Surface

- Markdown files in `commands/`, `workflows/`, `agents/`, and `.codex/skills/` are behavior-bearing artifacts.
- Seemingly small prose changes can alter command routing, workflow gates, or agent behavior.
- Preserve workflow gates around user questions, approvals, commits, and fallback behavior.

## Dependency And Version Sensitivity

- Node `>=22.0.0` is required.
- The package uses both top-level and SDK package locks; dependency updates may need changes in both places.
- `@anthropic-ai/claude-agent-sdk`, `ws`, and optional `fallow` touch core integration behavior.

## Recommended Follow-Up

- After this map, run `$gsd-new-project` again so initialization can use `.planning/codebase/`.
- If future work targets a specific area, consider a focused remap with `--paths` equivalent behavior to refresh only changed paths.
- Before committing, scan `.planning/codebase/` for secret-like patterns.

