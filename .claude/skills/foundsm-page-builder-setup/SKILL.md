---
name: foundsm-page-builder-setup
description: "Check FoundSM page-builder skill setup manually or passively from LP creation: .env.local SANITY_WRITE_TOKEN, Bun/dependencies, skill files, and staging-only readiness."
---

# FoundSM Page Builder Setup

Use this skill when a user asks to set up, verify, troubleshoot, or onboard the FoundSM AI landing-page builder skills for local marketing use. Also use it passively when `foundsm-landing-page-one-shot` has not yet verified setup in the current agent session.

## Scope

- Verify that the local repo can run the FoundSM page-builder skills.
- Separate user-owned setup from agent-owned checks.
- Exit early when required setup is missing.
- Do not create landing pages, publish Sanity documents, change production, or ask marketing users to configure CI/automation secrets.

## User-Owned Setup

Marketing users must do these steps themselves:

1. Get a Sanity staging write token from the team.
2. Add it to the repo root `.env.local` file as `SANITY_WRITE_TOKEN=...`.
3. Restart or reload the agent session if `.env.local` changed after the session started.
4. Use staging Studio to review or edit any staging pages published later by `foundsm-landing-page-one-shot`.

Do not ask marketing users for production tokens, production dataset names, CI secret-store changes, raw Sanity API details, or component implementation choices.

## Agent Workflow

1. Run the bundled setup checker from the repo root:

```bash
bun .claude/skills/foundsm-page-builder-setup/scripts/check-page-builder-skill-setup.mjs
```

2. If the checker reports `FAIL`, stop and give the user only the blocking fixes.
3. If the only blocker is `.env.local` or `SANITY_WRITE_TOKEN`, tell the user exactly:

```text
The FoundSM page-builder skills are not ready yet. Please add SANITY_WRITE_TOKEN to .env.local with a Sanity staging write token, then rerun this setup check.
```

4. If the checker passes during manual setup, tell the user they can use `foundsm-landing-page-one-shot` to create and publish a staging page. If called passively by the one-shot skill, continue that workflow instead of producing a separate setup handoff.
5. If the user explicitly asks to test the token against Sanity, run the checker with `--test-token`. This uses the staging dataset only and must not print the token.

## Checks This Skill Can Perform

- Confirm the command is running from the `foundsm-site` repo.
- Confirm the command is running in a Node-compatible runtime.
- Confirm `bun` is available for install/build/dev commands.
- Confirm `lsof` is available so the one-shot skill can check and restart the selected preview port.
- Confirm dependencies are installed and `@sanity/client` is resolvable.
- Confirm `.env.local` exists and contains a non-placeholder `SANITY_WRITE_TOKEN`.
- Confirm the Codex and Claude page-builder skill entrypoints exist.
- Confirm the one-shot Sanity staging publisher scripts exist.
- Confirm the one-shot local preview server-control scripts exist.
- Confirm the bug-fixer JSON and preview-smoke scripts exist.
- Optionally confirm the token can read from the Sanity `staging` dataset without writing.

## Output Rules

- Keep setup results concise and action-oriented.
- If called passively by `foundsm-landing-page-one-shot` and setup passes, do not interrupt the user with a separate setup report.
- Never print or echo the Sanity token value.
- Treat missing `SANITY_WRITE_TOKEN` as a hard blocker.
- Treat `SANITY_TOKEN` as a legacy fallback only; request `SANITY_WRITE_TOKEN` for marketing setup.
- Do not suggest CI/automation secret-store setup for this marketing flow.
- Do not proceed to page generation or publication from this skill.
