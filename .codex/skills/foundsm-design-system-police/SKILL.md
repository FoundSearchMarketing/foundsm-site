---
name: foundsm-design-system-police
description: Review FoundSM landing-page JSON or component changes for approved blocks, tokens, CTA consistency, and design-system fit.
---

# FoundSM Design System Police

Use this skill to review generated landing page JSON, component edits, schema changes, renderer changes, or styling requests for FoundSM design-system compliance.

## Workflow

1. Identify the artifact being reviewed: page JSON, section JSON, schema, renderer, style change, or prompt request.
2. Compare blocks and token values against `references/component-catalog.md`.
3. Apply the checklist in `references/design-system-checklist.md`.
4. Return one of:
   - `Pass` with a short rationale.
   - `Needs fixes` with concrete violations and token-safe corrections.
5. If reviewing JSON, provide corrected field values or a corrected section when the fix is clear.

## Review Priorities

- Unsupported blocks or raw styling controls.
- Invalid token values.
- Missing required fields.
- Inconsistent CTA language or broken CTA paths.
- Missing alt text for meaningful media.
- Headings that are too long, duplicated, or off-brand.
- Frontend/style edits that make responsiveness content-managed instead of component-owned.
