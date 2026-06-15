---
name: foundsm-landing-page-one-shot
description: Build and publish a FoundSM Sanity staging landingPage from a general idea using approved page-builder blocks and design tokens, then return a verified local preview link.
---

# FoundSM Landing Page One Shot

Use this skill when the user asks to create, draft, generate, or build a FoundSM landing page from a general idea, rough brief, audience, campaign, service, or offer.

## Workflow

1. Run the Passive Setup Gate once per agent session before doing any page-generation work.
2. If setup is not ready, exit early. Do not generate JSON, do not ask marketing users for implementation details, and tell the user only the blocking fixes from `foundsm-page-builder-setup`.
3. Extract the goal, audience, offer, primary CTA, proof points, required form/contact path, tone, and must-have ideas.
4. Choose 4-7 sections from the approved component catalog in `references/component-catalog.md`.
5. Put the strongest promise in `modernHeroBlock`.
6. Use `splitFeatureBlock`, `featureTabsBlock`, and `cardGridBlock` for the main body.
7. Use one `statementBandBlock` only when a strong strategic statement helps the page.
8. End with `modernCtaBlock` or `formBlock`.
9. Create a complete Sanity `landingPage` JSON with `_type`, `title`, `slug`, SEO fields, and ordered `sections`.
10. Before writing to Sanity, apply the `foundsm-design-system-police` checklist in `references/design-system-checklist.md`.
11. Run the `foundsm-page-builder-bug-fixer` JSON fixer. If it reports hard failures, stop and report the fixes needed.
12. Create or replace and publish only the fixed JSON in the Sanity `staging` dataset using `scripts/create-sanity-landing-page-draft.mjs`.
13. Rebuild, restart, smoke-check, and return the local route using the Post-Publish Server Handoff.

## Passive Setup Gate

At the start of the first `foundsm-landing-page-one-shot` run in an agent session for a repo, run:

```bash
bun .claude/skills/foundsm-page-builder-setup/scripts/check-page-builder-skill-setup.mjs
```

If it passes, remember that setup passed for this session and continue. Do not ask the user to run `foundsm-page-builder-setup` manually.

On later one-shot requests in the same session, skip this checker unless `.env.local`, `package.json`, `bun.lock`, page-builder skill files, or page-builder scripts changed.

If it fails, treat `foundsm-page-builder-setup` as the active blocking skill: stop before content generation, follow its output rules, and surface only the required setup fixes. Manual `foundsm-page-builder-setup` use remains available when the user asks for setup or troubleshooting directly.

## Defaults

- Use `/contact-us/` as the CTA URL unless the user names another destination.
- Use `tone: "soft"` for heroes, `theme: "light"` for content sections, and `theme: "green"` for the final CTA.
- Use 3 columns for card grids unless there are exactly 2 or 4 peer items.
- Use `imagePosition: "right"` when the previous visual section placed media left.
- Keep hero titles under 12 words and section headings under 14 words.
- If real media is unavailable, add a visible placeholder image using the dimensions in `references/component-catalog.md`. Use placeholder text `Image goes here - WIDTHxHEIGHT`, set it as `videoUrl`, leave `image` unset, and add meaningful `imageAlt` that names the replacement image need.

## Constraints

- Use only approved FoundSM `landingPage.sections` blocks from `references/component-catalog.md`.
- Prefer modern POC blocks for new AI-assisted pages.
- Use only approved design tokens for theme, layout, size, columns, image position, image fit, image shape, and alignment.
- Do not create raw CSS, arbitrary colors, custom font sizes, custom breakpoints, inline styles, unsupported components, or one-off layout behavior.
- Do not invent client names, logos, metrics, case studies, awards, or performance claims. Mark unknown proof as placeholder copy.
- Keep responsiveness and visual behavior owned by Astro components, not by Sanity content.
- Include meaningful alt text for media that communicates information.
- For temporary placeholder images, do not put external URLs in `image`; use `videoUrl` so Sanity staging renders the placeholder until an editor uploads a real image asset.
- Run the design-system review before final output.
- Run the page-builder bug fixer after the design-system review and before publishing.
- Create Sanity documents only in the `staging` dataset.
- Publish automatically in `staging`; never write to `production`.

## Output Rules

- Output valid JSON unless the user asks for a prose draft or the page is being published.
- When publishing, use JSON as the temporary artifact for Sanity, then make the final user-facing response start with the verified URL: `http://127.0.0.1:<port>/lp/<slug>/`.
- Use only approved `_type` values and token values.
- Do not include raw CSS, arbitrary colors, custom font sizes, custom breakpoints, inline styles, or negative letter spacing.
- Include placeholder media notes directly in the generated JSON when media is missing, using `videoUrl: "https://placehold.co/WIDTHxHEIGHT?text=Image+goes+here+-+WIDTHxHEIGHT"` and `imageAlt: "Image goes here - replace with [specific image need], WIDTHxHEIGHT."`
- Include a short design-system review and bug-fixer result after the JSON: `Design review: pass` and `Bug fixer: pass`, or list fixes needed before final.
- If a staging page is published, include the document `_id`, slug, and a note that editors can review or edit it in staging Studio.

## Staging Page Publication

When the repo root `.env.local` has `SANITY_WRITE_TOKEN`, save the final JSON to a temporary file, run the bug fixer, and publish only the fixed JSON:

```bash
bun .claude/skills/foundsm-page-builder-bug-fixer/scripts/fix-landing-page-json.mjs <landing-page.json> --out <fixed-landing-page.json> --report <bug-fixer-report.json>
```

If the bug fixer exits non-zero, stop. Do not publish partial or invalid JSON.

```bash
bun .claude/skills/foundsm-landing-page-one-shot/scripts/create-sanity-landing-page-draft.mjs <fixed-landing-page.json>
```

The script loads `.env.local`, writes only to project `vzneqxsx`, dataset `staging`, and publishes a document with an `_id` like `landing-page-example-slug`. It also removes a matching `drafts.landing-page-example-slug` draft if one exists.

If no write token is available, exit before generating the page. Do not return partial JSON.

## Post-Publish Server Handoff

After the Sanity publish succeeds:

1. Choose a preview port, defaulting to `4321` only when it is free unless the user gives another port or `FOUNDSM_PAGE_BUILDER_PORT` is set. If another checkout owns `4321`, choose `4322` or the next free port.
2. Treat only the selected free port or a previously helper-owned page-builder preview server as owned by this one-shot run. Do not kill another checkout's dev server just to reuse its port.
3. Rebuild and restart through the bundled server helper:

```bash
bun .claude/skills/foundsm-landing-page-one-shot/scripts/restart-local-preview-server.mjs --slug <slug> --port <port> --build
```

4. The helper runs `bun run build`, starts `bun run dev -- --host 127.0.0.1 --port <port>`, writes pid/log state under `.astro/page-builder-preview/`, and verifies `http://127.0.0.1:<port>/lp/<slug>/` returns HTTP 200.
5. Run the preview smoke check:

```bash
bun .claude/skills/foundsm-page-builder-bug-fixer/scripts/check-preview-smoke.mjs http://127.0.0.1:<port>/lp/<slug>/
```

6. If preview smoke fails, block the handoff and report the build/runtime issues instead of returning a verified link.
7. For any later one-shot edits to the same page, rerun the same helper with the same port when that server is the helper-owned preview server. It will rebuild, restart, verify, and smoke-check again.
8. If launching Studio or Presentation for review, set `SANITY_STUDIO_PREVIEW_URL=http://127.0.0.1:<port>` for that process.
9. Final response after successful smoke: first line must be the verified link `http://127.0.0.1:<port>/lp/<slug>/`, followed by the document `_id`, slug, server pid, log path, and concise publish/build/restart/smoke verification notes.
