---
name: foundsm-landing-page-one-shot
description: Build a complete FoundSM Sanity landingPage JSON from a general idea using approved page-builder blocks and design tokens.
---

# FoundSM Landing Page One Shot

Use this skill when the user asks to create, draft, generate, or build a FoundSM landing page from a general idea, rough brief, audience, campaign, service, or offer.

## Workflow

1. Check for `SANITY_WRITE_TOKEN` in the repo root `.env.local` file or process environment before doing any page-generation work. Treat `SANITY_TOKEN` as a legacy fallback only.
2. If no write token is available, exit early. Do not generate JSON, do not ask marketing users for implementation details, and tell the user: `I can't create a Sanity staging draft because SANITY_WRITE_TOKEN is not available in .env.local or the environment. Please add a Sanity staging write token and rerun this skill.`
3. Extract the goal, audience, offer, primary CTA, proof points, required form/contact path, tone, and must-have ideas.
4. Choose 4-7 sections from the approved component catalog in `references/component-catalog.md`.
5. Put the strongest promise in `modernHeroBlock`.
6. Use `splitFeatureBlock`, `featureTabsBlock`, and `cardGridBlock` for the main body.
7. Use one `statementBandBlock` only when a strong strategic statement helps the page.
8. End with `modernCtaBlock` or `formBlock`.
9. Create a complete Sanity `landingPage` draft JSON with `_type`, `title`, `slug`, SEO fields, and ordered `sections`.
10. Before writing to Sanity, apply the `foundsm-design-system-police` checklist in `references/design-system-checklist.md`.
11. Create or replace an unpublished draft in the Sanity `staging` dataset using `scripts/create-sanity-landing-page-draft.mjs`.

## Defaults

- Use `/contact-us/` as the CTA URL unless the user names another destination.
- Use `tone: "soft"` for heroes, `theme: "light"` for content sections, and `theme: "green"` for the final CTA.
- Use 3 columns for card grids unless there are exactly 2 or 4 peer items.
- Use `imagePosition: "right"` when the previous visual section placed media left.
- Keep hero titles under 12 words and section headings under 14 words.
- If real media is unavailable, use a clearly labeled `https://placehold.co/...` placeholder and meaningful `imageAlt`.

## Constraints

- Use only approved FoundSM `landingPage.sections` blocks from `references/component-catalog.md`.
- Prefer modern POC blocks for new AI-assisted pages.
- Use only approved design tokens for theme, layout, size, columns, image position, image fit, image shape, and alignment.
- Do not create raw CSS, arbitrary colors, custom font sizes, custom breakpoints, inline styles, unsupported components, or one-off layout behavior.
- Do not invent client names, logos, metrics, case studies, awards, or performance claims. Mark unknown proof as placeholder copy.
- Keep responsiveness and visual behavior owned by Astro components, not by Sanity content.
- Include meaningful alt text for media that communicates information.
- Run the design-system review before final output.
- Create Sanity documents only in the `staging` dataset.
- Create unpublished draft documents only; never publish and never write to `production`.

## Output Rules

- Output valid JSON unless the user asks for a prose draft.
- Use only approved `_type` values and token values.
- Do not include raw CSS, arbitrary colors, custom font sizes, custom breakpoints, inline styles, or negative letter spacing.
- Include a short design-system review after the JSON: `Design review: pass` or list fixes made before final.
- If a staging draft is created, include the draft `_id`, slug, and a note that editors can review and publish it in staging Studio.

## Staging Draft Creation

When the repo root `.env.local` has `SANITY_WRITE_TOKEN`, save the final JSON to a temporary file and run:

```bash
node .codex/skills/foundsm-landing-page-one-shot/scripts/create-sanity-landing-page-draft.mjs <landing-page.json>
```

The script loads `.env.local`, writes only to project `vzneqxsx`, dataset `staging`, and creates an unpublished document with an `_id` like `drafts.landing-page-example-slug`.

If no write token is available, exit before generating the page. Do not return partial JSON.
