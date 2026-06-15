---
name: foundsm-available-component-lister
description: List approved FoundSM Sanity landing-page components, use cases, required values, tokens, and valid examples.
---

# FoundSM Available Component Lister

Use this skill when the user asks which reusable components, blocks, or sections can be used to build a FoundSM Sanity landing page.

## Workflow

1. List only approved `landingPage.sections` blocks from `references/component-catalog.md`.
2. Group blocks by job-to-be-done.
3. For each block, include its use case, required values, and optional tokens.
4. Prefer the modern POC blocks for new AI-assisted landing pages.
5. Do not list unsupported components, raw styling controls, arbitrary colors, custom font sizes, or custom CSS options.
6. Before final output, apply the `foundsm-design-system-police` rule: verify the list includes only approved blocks and tokenized controls.

## Output Shape

Use a concise table by default:

```text
Component | Use when | Required values | Optional tokens
```

If the user asks for examples, include a short valid JSON section using approved token values.
