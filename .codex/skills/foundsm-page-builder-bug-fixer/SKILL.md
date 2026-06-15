---
name: foundsm-page-builder-bug-fixer
description: Fix safe FoundSM landing-page JSON issues and smoke-check page-builder previews before publish or handoff.
---

# FoundSM Page Builder Bug Fixer

Use this passive skill when generated or edited FoundSM `landingPage` JSON, Sanity page-builder content, schema/rendering changes, or a local preview URL needs validation before publish or handoff.

## Passive Contract

This skill is passive by linked instruction. It is not automatically invoked by the runtime, so the one-shot and component-editor skills must explicitly run it before final output.

- `foundsm-landing-page-one-shot` must run this skill after the design-system police review and before publishing.
- `foundsm-landing-page-one-shot` must publish only the fixed JSON produced by this skill.
- `foundsm-landing-page-one-shot` must run preview smoke after rebuilding/restarting the local preview server.
- `foundsm-landing-page-component-editor` must run this skill after JSON/content/schema/renderer edits and before final output.
- If this skill reports hard JSON errors, build errors, or preview smoke failures, block publish or handoff until they are fixed.

## What This Skill Checks

- Valid root `landingPage` shape, title, slug, and non-empty sections.
- Supported `landingPage.sections` block `_type`s only.
- Required values for approved modern POC blocks.
- Valid design tokens from the component catalog.
- Missing `_key`s on sections, Portable Text, tabs, cards, logos, and other nested arrays.
- No raw CSS/style fields, arbitrary colors, arbitrary font sizes, or unsupported responsive controls.
- External placeholder media uses `videoUrl`, not `image`.
- Placeholder media has useful `imageAlt`.
- CTA labels and URLs are present when CTAs are used.
- Portable Text fields use valid array/block/span shape where conversion is safe.
- Local preview URL returns HTTP 200.
- Browser console errors, request failures, missing media, horizontal overflow, and near-empty renders on desktop and mobile.

## Safe Fixes

The JSON fixer may automatically fix deterministic issues:

- Add missing `_key`s.
- Add missing/default token values.
- Replace invalid token values with approved defaults.
- Normalize slugs.
- Move external `image` URLs to `videoUrl`.
- Add placeholder `imageAlt`.
- Fill default CTA URL `/contact-us/` when a CTA label is present.
- Convert string rich text into Portable Text blocks.
- Remove unsupported raw styling fields.

## Hard Failures

Stop and report clearly when any of these occur:

- Unsupported root `_type` or section `_type`.
- Missing landing page title.
- Empty or missing `sections`.
- Missing section titles, required body copy, tab copy, card copy, or statement copy.
- Invalid JSON.
- Build failure after code/schema/frontend edits.
- Local preview URL does not return HTTP 200.
- Browser smoke finds console errors, failed requests, broken media, horizontal overflow, or nearly empty rendered content.

## JSON Fix Command

Save the generated or edited landing page JSON to a temporary file, then run:

```bash
bun .codex/skills/foundsm-page-builder-bug-fixer/scripts/fix-landing-page-json.mjs <landing-page.json> --out <fixed-landing-page.json> --report <bug-fixer-report.json>
```

Use `<fixed-landing-page.json>` for any Sanity publish. If the command exits non-zero, do not publish.

## Preview Smoke Command

After the preview server returns a verified URL, run:

```bash
bun .codex/skills/foundsm-page-builder-bug-fixer/scripts/check-preview-smoke.mjs http://127.0.0.1:<port>/lp/<slug>/
```

The script uses Playwright when available. If browser tooling is unavailable, it falls back to HTTP-only and reports a warning.

## Code/Edit Validation

For schema, Astro renderer, or style edits:

1. Run this skill on any changed/generated landing page JSON.
2. Run `git diff --check`.
3. Run `bun test`.
4. Run `bun run build`.
5. If a preview URL exists, run the preview smoke command.

Do not silently patch schema or component code from this skill. Fix code only when the calling task asks for implementation edits.

## Output Rules

- Report whether JSON was fixed, what changed, and whether any hard failures remain.
- Start with `Bug fixer: pass` only when JSON/build/runtime checks pass.
- Start with `Bug fixer: fail` when publish or handoff must be blocked.
- Keep token values and replacements explicit.
- Never print Sanity token values.
- Never write to production.
