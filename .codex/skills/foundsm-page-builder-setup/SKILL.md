---
name: foundsm-page-builder-setup
description: Check FoundSM page-builder skill setup: .env.local SANITY_WRITE_TOKEN, Node/dependencies, skill files, and staging-only readiness.
---

# FoundSM Page Builder Setup

Use this skill when a user asks to set up, verify, troubleshoot, or onboard the FoundSM AI landing-page builder skills for local marketing use.

## Scope

- Verify that the local repo can run the FoundSM page-builder skills.
- Separate user-owned setup from agent-owned checks.
- Exit early when required setup is missing.
- Do not create landing-page drafts, publish Sanity documents, change production, or ask marketing users to configure CI/automation secrets.

## User-Owned Setup

Marketing users must do these steps themselves:

1. Get a Sanity staging write token from the team.
2. Add it to the repo root `.env.local` file as `SANITY_WRITE_TOKEN=...`.
3. Restart or reload the agent session if `.env.local` changed after the session started.
4. Use staging Studio to review and publish any drafts created later by `foundsm-landing-page-one-shot`.

Do not ask marketing users for production tokens, production dataset names, CI secret-store changes, raw Sanity API details, or component implementation choices.

## Agent Workflow

1. Run the bundled setup checker from the repo root:

```bash
node .codex/skills/foundsm-page-builder-setup/scripts/check-page-builder-skill-setup.mjs
```

2. If the checker reports `FAIL`, stop and give the user only the blocking fixes.
3. If the only blocker is `.env.local` or `SANITY_WRITE_TOKEN`, tell the user exactly:

```text
The FoundSM page-builder skills are not ready yet. Please add SANITY_WRITE_TOKEN to .env.local with a Sanity staging write token, then rerun this setup check.
```

4. If the checker passes, tell the user they can use `foundsm-landing-page-one-shot` to create an unpublished staging draft.
5. If the user explicitly asks to test the token against Sanity, run the checker with `--test-token`. This uses the staging dataset only and must not print the token.

## Checks This Skill Can Perform

- Confirm the command is running from the `foundsm-site` repo.
- Confirm Node satisfies the repo requirement, currently Node 20 or newer.
- Confirm dependencies are installed and `@sanity/client` is resolvable.
- Confirm `.env.local` exists and contains a non-placeholder `SANITY_WRITE_TOKEN`.
- Confirm the Codex and Claude page-builder skill entrypoints exist.
- Confirm the one-shot Sanity draft writer scripts exist.
- Optionally confirm the token can read from the Sanity `staging` dataset without writing.

## Output Rules

- Keep setup results concise and action-oriented.
- Never print or echo the Sanity token value.
- Treat missing `SANITY_WRITE_TOKEN` as a hard blocker.
- Treat `SANITY_TOKEN` as a legacy fallback only; request `SANITY_WRITE_TOKEN` for marketing setup.
- Do not suggest CI/automation secret-store setup for this marketing flow.
- Do not proceed to page generation from this skill.
