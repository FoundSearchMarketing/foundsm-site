---
name: foundsm-landing-page-component-editor
description: Edit FoundSM landing-page JSON, Sanity schemas, Astro renderers, or styles for reusable page-builder components.
---

# FoundSM Landing Page Component Editor

Use this skill when the user asks to edit a specific landing page component, section, block, field, layout token, schema, Astro renderer, or style behavior.

## Marketing-Friendly Prompt Contract

Marketing users do not need to specify constraints, implementation scope, token rules, or validation steps. Accept natural requests such as:

- "Make the hero more direct for CMOs."
- "Change the CTA to feel less salesy."
- "Can this card section be denser?"
- "Update this section so the image is on the left."
- "This component needs an option for a tighter layout."

Infer the likely scope from the request. Ask a short clarifying question only if the target component or desired outcome is ambiguous. Translate informal design requests into approved tokens and reusable component behavior.

## Determine The Edit Scope

Classify the request before changing anything:

- **Content JSON:** update an existing `landingPage` document or section JSON.
- **Sanity schema/query:** add or adjust editable fields, validation, or GROQ projections.
- **Astro renderer/styles:** change reusable component rendering, CSS, responsive behavior, or token handling.

## Built-In Constraints

- Use approved FoundSM page-builder blocks and tokenized controls by default.
- Prefer content JSON edits when the requested change can be handled by existing fields.
- For schema/frontend/style changes, add reusable tokens or component behavior rather than one-off styling.
- Do not add raw CSS controls, arbitrary colors, custom font sizes, custom breakpoints, inline styles, unsupported components, or page-specific hacks unless the user explicitly asks after being warned.
- Keep responsiveness and layout behavior owned by Astro components, not by Sanity content.
- Preserve fixed capability routes and existing `/lp/[slug]` behavior unless the user explicitly asks to change them.
- Keep meaningful media alt text, CTA consistency, concise headings, and valid token values.
- Always run the design-system review before final output.
- Always run the page-builder bug fixer after JSON/content/schema/renderer edits and before final output.

## Workflow

1. Identify the target block `_type`, section key, field, or component.
2. Inspect the relevant existing files before editing.
3. Preserve existing page-builder block names and fixed capability routes unless explicitly asked.
4. Prefer approved tokens and reusable component behavior over one-off CSS.
5. If schema fields change, update schema, query projection, renderer props, demo data, and docs/skills references together.
6. If frontend/styles change, validate responsive behavior and avoid text overlap.
7. Before final output, apply the `foundsm-design-system-police` checklist in `references/design-system-checklist.md`.
8. Run the `foundsm-page-builder-bug-fixer` checks. For JSON/content edits, run the JSON fixer and use the fixed output. For schema/frontend edits, also run tests and build.
9. If a preview URL exists, run the bug-fixer preview smoke check before handoff.

## Code Pointers

- Block renderer: `src/components/blocks/BlockRenderer.astro`
- Modern block adapters: `src/components/blocks/*Block.astro`
- Sanity block schemas: `studio/schemas/blocks/*.ts`
- Landing page schema: `studio/schemas/landingPage.ts`
- GROQ projection: `src/lib/sanity.ts`
- Demo data: `src/lib/pageBuilderDemoData.ts`

## Validation Guidance

- For JSON-only edits, run:

```bash
bun .claude/skills/foundsm-page-builder-bug-fixer/scripts/fix-landing-page-json.mjs <landing-page.json> --out <fixed-landing-page.json> --report <bug-fixer-report.json>
```

- For schema/frontend edits, run `git diff --check`, `bun test`, and `bun run build`.
- For preview handoff, run:

```bash
bun .claude/skills/foundsm-page-builder-bug-fixer/scripts/check-preview-smoke.mjs <preview-url>
```

- For visual changes, run a local page render or screenshot check on desktop and mobile.
- If the bug fixer, tests, build, or preview smoke fails, block handoff and report the failure clearly.
