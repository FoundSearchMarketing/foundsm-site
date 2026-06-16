# FoundSM AI Page Builder Skill Quickstart

Use these skills when you want Claude or Codex to help create, edit, review, or troubleshoot FoundSM landing pages in the Sanity page builder.

## The Basic Idea

The flow is not "pick a tool from a menu." Think of it as a staged workflow:

1. Marketing brings the intent: audience, offer, message, proof, CTA, and judgment.
2. The agent translates that intent into approved page-builder blocks and design tokens.
3. Work happens in Sanity `staging`, where drafts are safe to inspect and revise.
4. The agent handles readiness, quality checks, publishing, and preview setup behind the scenes.
5. Human review happens after the URL exists: inspect the Sanity draft and the returned local URL.
6. Iteration starts with human notes: what feels off, what needs sharper copy, what image or section should change.
7. Direct page annotation is the future workflow; for now, concrete notes from the URL/Sanity review are the input.

## Copy/Paste Starter Prompt

```text
Use foundsm-landing-page-one-shot to create and publish a staging landing page for B2B SaaS CMOs who need clearer paid media measurement. The primary CTA is /contact-us/. Emphasize pipeline clarity, CFO-ready reporting, fewer wasted experiments, and confidence in budget allocation. Use placeholder media where needed. When the page is ready, return the local preview URL, Sanity document id, and slug so I can review it.
```

## Before You Start

- Work in the `foundsm-site` repo.
- Use staging only. These skills are designed to publish landing pages to the Sanity `staging` dataset, not production.
- For publishing, add a Sanity staging write token to `.env.local` as `SANITY_WRITE_TOKEN=...`.
- Do not paste tokens into chat. The agent should check `.env.local` and should never print the token.

## Which Skill To Use

| Need | Skill | Ask it like this |
| --- | --- | --- |
| Check whether your machine is ready | `foundsm-page-builder-setup` | "Check whether the FoundSM page builder skills are ready." |
| Create and publish a staging landing page from a brief | `foundsm-landing-page-one-shot` | "Create a staging landing page for enterprise paid media measurement." |
| Edit a page, section, component, schema, renderer, or style token | `foundsm-landing-page-component-editor` | "Make the hero more direct for CFOs and keep the same CTA." |
| See which page sections are approved | `foundsm-available-component-lister` | "What components can I use for a paid media landing page?" |
| Review page JSON or component work for brand/design-system fit | `foundsm-design-system-police` | "Review this landing page JSON before we publish it." |
| Troubleshoot a page or preview before handoff | `foundsm-page-builder-bug-fixer` | "Troubleshoot this landing page preview before handoff." |
| Understand the overall flow or next best step | `foundsm-page-builder-flow-explainer` | "Explain the FoundSM page-builder skill flow and what order to use the skills in." |

## Common Paths

LP creation:

```text
Use foundsm-landing-page-one-shot with a brief.
The agent handles setup, quality checks, publishing, and preview setup.
You get a staging page and a URL to review.
```

Human in the loop:

```text
Open the returned URL.
Review the staging page in Sanity.
Write down visual/content notes.
Use those notes for the iteration phase.
```

Iteration:

```text
Direct page annotation is still the future workflow.
For now, ask for foundsm-landing-page-component-editor and provide concrete notes from the URL or Sanity review.
```

## Good Briefs

A good page brief can be short. Include what you know:

- Audience: who the page is for.
- Offer: what service, campaign, or promise the page should sell.
- CTA: usually `/contact-us/`, unless you name another URL.
- Proof: real examples, metrics, claims, or "use placeholders" if proof is not ready.
- Tone: direct, strategic, technical, executive, plainspoken, or another useful direction.
- Must-haves: sections, objections, positioning, images, forms, or compliance notes.

Example:

```text
Use foundsm-landing-page-one-shot to create a staging page for B2B SaaS CMOs who need cleaner paid media measurement. CTA is /contact-us/. Emphasize pipeline clarity, CFO-ready reporting, and fewer wasted experiments. Use placeholder media where needed.
```

## What The Agent Should Return

For a published staging page, the agent should return:

- A verified local preview URL like `http://127.0.0.1:4321/lp/example-slug/`.
- The Sanity document `_id` and slug.
- A short note that the page was checked and is ready to review.

If setup or validation fails, the agent should stop and tell you the blocking fixes instead of publishing partial work.
