---
last_mapped: 2026-05-21
scope: full repo
---

# Codebase Integrations

## External Services

This codebase is primarily a local CLI/workflow system. It does not appear to define a long-running web service or application database in the mapped files. Its integrations are mostly developer-runtime, package-management, Git, and AI-agent runtime integrations.

## AI Runtime Integrations

- Claude Code integration is represented through commands, agents, hooks, and installer paths in `gsd-get-shit-done/bin/install.js`.
- Codex integration is represented through skill generation and config handling in `gsd-get-shit-done/bin/install.js`, `gsd-get-shit-done/commands/`, and project-local `.codex/skills/`.
- Gemini, OpenCode, Copilot, Cursor, Windsurf, Kilo, Cline, Augment, Antigravity, Trae, Qwen, Hermes, and Codebuddy are referenced as supported runtime targets in installer/runtime logic.
- Runtime slash-command normalization is handled in `gsd-get-shit-done/get-shit-done/bin/lib/runtime-slash.cjs` and `gsd-get-shit-done/scripts/fix-slash-commands.cjs`.

## Agent SDK

- The SDK uses `@anthropic-ai/claude-agent-sdk`, declared in both `gsd-get-shit-done/package.json` and `gsd-get-shit-done/sdk/package.json`.
- SDK entrypoint shimming happens in `gsd-get-shit-done/bin/gsd-sdk.js`, which delegates to `gsd-get-shit-done/sdk/dist/cli.js`.
- Programmatic bridge modules include `gsd-get-shit-done/get-shit-done/bin/lib/cjs-sdk-bridge.cjs` and SDK source under `gsd-get-shit-done/sdk/src/`.

## Git Integration

- Git command safety and cross-platform projection live in `gsd-get-shit-done/get-shit-done/bin/lib/shell-command-projection.cjs`.
- Worktree safety and workstream support live in `gsd-get-shit-done/get-shit-done/bin/lib/worktree-safety.cjs`, `workstream.cjs`, and related generated inventory modules.
- Hook scripts in `gsd-get-shit-done/hooks/` integrate with repository events and session state.
- `.githooks/` exists under `gsd-get-shit-done/` for repository-level hook configuration.

## Package And Release Integrations

- npm packaging is controlled by `gsd-get-shit-done/package.json`.
- Release and changeset helpers live under `gsd-get-shit-done/scripts/changeset/`.
- Tarball smoke tests and SDK dist verification live in `gsd-get-shit-done/scripts/release-tarball-smoke.cjs` and `gsd-get-shit-done/scripts/verify-tarball-sdk-dist.sh`.
- Release notes and versioning documentation live in `gsd-get-shit-done/VERSIONING.md`, `gsd-get-shit-done/CHANGELOG.md`, and `gsd-get-shit-done/docs/RELEASE-*.md`.

## Security And Secret Scanning

- Security scanning scripts include `gsd-get-shit-done/scripts/secret-scan.sh`, `base64-scan.sh`, and `prompt-injection-scan.sh`.
- Generated secret detection logic is represented by `gsd-get-shit-done/get-shit-done/bin/lib/secrets.cjs` and `secrets.generated.cjs`.
- Runtime security helpers appear in `gsd-get-shit-done/get-shit-done/bin/lib/security.cjs`.
- Hook guard modules include `gsd-get-shit-done/hooks/gsd-read-guard.js`, `gsd-get-shit-done/hooks/gsd-prompt-guard.js`, and `gsd-get-shit-done/hooks/gsd-workflow-guard.js`.

## Documentation And Localization

- User-facing documentation is localized in `gsd-get-shit-done/docs/ja-JP/`, `docs/ko-KR/`, `docs/pt-BR/`, and `docs/zh-CN/`.
- README translations exist at `gsd-get-shit-done/README.ja-JP.md`, `README.ko-KR.md`, `README.pt-BR.md`, and `README.zh-CN.md`.
- Installation and command surfaces are documented in `gsd-get-shit-done/docs/USER-GUIDE.md`, `docs/COMMANDS.md`, and `docs/CLI-TOOLS.md`.

## Data Storage

- Project state is file-based. GSD workflows write `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/config.json`, phase folders, and research/codebase maps.
- The current workspace did not have `.planning/` before this mapping run; `.planning/codebase/` is newly created by this workflow.
- There is no mapped application database, ORM, migration system, or hosted API server in the current project.

## Local Sensitive Files

- The root `AGENTS.md` instructions mention Telegram access files such as `.env` and `.telegram_sessions/chief_agent.session.txt`. These are explicitly sensitive and should not be printed, copied, or committed.
- The mapping intentionally did not read `.env` or `.telegram_sessions/`.

