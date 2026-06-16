---
name: foundsm-page-builder-flow-explainer
description: "Explain the marketing-facing FoundSM AI page-builder workflow: brief the page, let the agent create a safe staging draft, review the Sanity page and returned URL, give notes, and iterate. Use when users ask how to use the skills, what order to use them in, what the workflow means, what step comes next, or any Q&A-style question about the page-builder process."
---

# FoundSM Page Builder Flow Explainer

Use this skill when the user asks how the FoundSM page-builder skills work, what order to use them in, why the workflow is shaped this way, which step comes next, or how Claude/Codex should think about the marketing landing-page process.

## Core Philosophy

Do not answer by merely listing skills. Explain the operating model:

- Marketing owns intent: audience, offer, message, proof, CTA, and review judgment.
- The agent owns translation: turn plain-language intent into approved page-builder sections, tokenized layout choices, Sanity-safe JSON, and validation steps.
- Staging is the workshop: publish draft pages to Sanity `staging`, inspect them locally, then iterate before any production handoff.
- Components are guardrails, not limitations: approved blocks and design tokens keep pages reusable, responsive, and on-brand while still letting marketing ask in normal language.
- The agent handles readiness, quality checks, and preview setup behind the scenes so marketing can focus on message and judgment.
- The full workflow is a loop: brief, create, review the URL and Sanity draft, describe changes, edit, review again.

## Canonical Flow

Treat this as the source of truth when explaining the workflow:

1. Brief the page: audience, offer, message, proof, CTA, and any must-have ideas.
2. Create the staging page with `foundsm-landing-page-one-shot`.
3. Let the agent handle setup, safety checks, publishing, and preview setup behind the scenes.
4. Open the returned URL and review the staging page in Sanity.
5. Give concrete notes from what you see: copy, layout, CTA, missing proof, image needs, or sections that feel off.
6. Iterate with `foundsm-landing-page-component-editor` until the page feels ready.
7. Treat annotation as the future improvement: ideally reviewers annotate the page directly and the agent routes those notes automatically; until that exists, plain notes from the URL/Sanity review are the iteration input.

## How To Explain The Flow

1. Read the shared marketing docs first:
   - `docs/ai-page-builder/marketing-skill-quickstart.md`
   - `docs/ai-page-builder/marketing-skill-prompts-and-faq.md`
2. Start with a 2-4 sentence mental model, not the skill list.
3. Explain that `foundsm-landing-page-one-shot` is the creation request marketing usually starts with.
4. Mention behind-the-scenes work only as a short reassurance: the agent handles readiness, quality checks, and preview setup.
5. Explain the human-in-the-loop checkpoint: inspect the Sanity draft and the returned URL before calling the page done.
6. Explain the iteration gap in marketing terms: direct page annotation is the desired future workflow; for now, concrete notes from the URL/Sanity review become edit requests.
7. Explain the two current paths:
   - New page: brief -> staging page and URL -> human review -> notes -> edits -> review again.
   - Existing page or post-review changes: user gives notes -> component editor updates the page -> human reviews again.
8. If the user asks a Q&A-style question, answer it directly, then say where that answer fits in the flow.
9. If the shared docs do not answer the question, inspect the relevant skill file before answering:
   - `.claude/skills/foundsm-page-builder-setup/SKILL.md`
   - `.claude/skills/foundsm-landing-page-one-shot/SKILL.md`
   - `.claude/skills/foundsm-landing-page-component-editor/SKILL.md`
   - `.claude/skills/foundsm-available-component-lister/SKILL.md`
   - `.claude/skills/foundsm-design-system-police/SKILL.md`
   - `.claude/skills/foundsm-page-builder-bug-fixer/SKILL.md`
10. If the user is asking to do the work, not just understand the flow, use the relevant FoundSM page-builder skill and proceed.

## Output Style

- Keep the default explanation brief and marketing-facing: mental model, canonical flow, current annotation gap, next prompt.
- Use plain marketing language.
- Lead with the recommended next step.
- Mention setup blockers only when relevant.
- Make staging-only behavior explicit when publishing is involved.
- Do not expose implementation details unless the user asks.
- Do not ask marketing users to choose raw component internals, CSS, color values, breakpoints, or Sanity implementation details.
- Never print or request Sanity token values.
- Avoid naming behind-the-scenes skills unless the user asks about implementation detail.
- Do not imply the annotation loop is already solved. Say direct annotation is the future workflow unless a concrete annotation tool exists in the current repo/context.

## Routing Rules

- For "how do I use all the skills?", "what order?", or "why does this flow exist?" questions, explain the philosophy and canonical flow from this skill.
- For readiness or token questions, point to `foundsm-page-builder-setup`.
- For creating and publishing a new staging landing page, route to `foundsm-landing-page-one-shot`.
- For post-review edits, visual notes, content changes, schema, renderers, component behavior, or style tokens, route to `foundsm-landing-page-component-editor`.
- For available section questions, route to `foundsm-available-component-lister`.
- For design-system review questions, route to `foundsm-design-system-police`.
- For technical page or preview problems before handoff, route to `foundsm-page-builder-bug-fixer`.
- For Claude/Codex parity questions, explain that skill folders are mirrored and command paths should match the active agent folder.

## Canonical Short Answer

If asked "how do I use these skills?", explain the working philosophy first, then the ordered flow. If asked "which skill should I use?", answer with the single best next skill, why it is the right step in the flow, and a prompt the user can paste. Add a second option only when the user is choosing between creating a new page and editing an existing one.
