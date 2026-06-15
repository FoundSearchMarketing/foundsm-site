---
name: foundsm-landing-page-one-shot
description: Build a complete FoundSM Sanity landingPage JSON from a general idea using approved page-builder blocks and design tokens.
---

# FoundSM Landing Page One Shot

Use this skill when the user asks to create, draft, generate, or build a FoundSM landing page from a general idea, rough brief, audience, campaign, service, or offer.

## Workflow

1. Extract the goal, audience, offer, primary CTA, proof points, required form/contact path, tone, and must-have ideas.
2. Choose 4-7 sections from the approved component catalog in `references/component-catalog.md`.
3. Put the strongest promise in `modernHeroBlock`.
4. Use `splitFeatureBlock`, `featureTabsBlock`, and `cardGridBlock` for the main body.
5. Use one `statementBandBlock` only when a strong strategic statement helps the page.
6. End with `modernCtaBlock` or `formBlock`.
7. Return a complete Sanity `landingPage` draft JSON with `title`, `slug`, SEO fields, and ordered `sections`.
8. Before final output, apply the `foundsm-design-system-police` checklist in `references/design-system-checklist.md`.

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

## Output Rules

- Output valid JSON unless the user asks for a prose draft.
- Use only approved `_type` values and token values.
- Do not include raw CSS, arbitrary colors, custom font sizes, custom breakpoints, inline styles, or negative letter spacing.
- Include a short design-system review after the JSON: `Design review: pass` or list fixes made before final.
