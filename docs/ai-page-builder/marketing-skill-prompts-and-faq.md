# FoundSM AI Page Builder Prompts And FAQ

Use this as a copy-and-adjust prompt sheet for Claude or Codex.

## Copyable Prompts

Check setup:

```text
Use foundsm-page-builder-setup to check whether the FoundSM page builder skills are ready for staging page publication.
```

Create a page:

```text
Use foundsm-landing-page-one-shot to create and publish a staging landing page for B2B SaaS CMOs who need clearer paid media measurement. The primary CTA is /contact-us/. Emphasize pipeline clarity, CFO-ready reporting, fewer wasted experiments, and confidence in budget allocation. Use placeholder media where needed. When the page is ready, return the local preview URL, Sanity document id, and slug so I can review it.
```

Edit a page:

```text
Use foundsm-landing-page-component-editor to update [page or section]. Change [specific content, CTA, layout token, or component behavior]. Keep the page-builder design system intact.
```

List available sections:

```text
Use foundsm-available-component-lister to show the approved landing page sections for a [campaign/service/audience] page and when to use each one.
```

Review before handoff:

```text
Use foundsm-design-system-police to review this landing page JSON for approved blocks, token values, CTA consistency, alt text, and heading quality.
```

Troubleshoot JSON or preview:

```text
Use foundsm-page-builder-bug-fixer to troubleshoot this landing page preview before handoff.
```

Understand the flow:

```text
Use foundsm-page-builder-flow-explainer to explain how marketing should brief, review, and iterate on a FoundSM staging landing page.
```

## FAQ

### Can I use these from Claude and Codex?

Yes. The skill folders are mirrored under `.claude/skills` and `.codex/skills`. Ask for the same skill name in either agent. If a command path is needed, Claude should use `.claude/skills/...` and Codex should use `.codex/skills/...`.

### Which skill should I start with?

Use `foundsm-page-builder-flow-explainer` when you want the mental model, not just a tool list. It should explain how a brief becomes a staging page, where to review it, and how notes turn into iteration.

### Why is there a flow at all?

The workflow protects speed and quality at the same time. Marketing can describe the desired outcome in plain language, while the agent handles page-builder constraints, staging publication, and quality checks. This keeps experiments quick without turning every page into a one-off build.

### What happens inside LP creation?

`foundsm-landing-page-one-shot` is the active creation skill. Marketing should experience it as one creation request: give a brief, get a staging page, open the returned URL, and review it.

### Where does human review happen?

After creation, review the returned local URL and the staging document in Sanity. This is where the human decides what feels wrong, what needs sharper copy, what needs visual adjustment, and whether the page is ready to keep iterating.

### How does iteration work right now?

Direct page annotation is the desired future workflow. Until that exists, reviewers should give concrete notes from the URL or Sanity review and ask the agent to use `foundsm-landing-page-component-editor`.

### Do I need to know the component names?

No. You can ask in normal marketing language. The agent should translate requests like "make the cards denser" or "move the image left" into approved page-builder fields and design tokens.

### What is staging?

Staging is the safe Sanity dataset used for drafting and review. These skills should publish only to `staging` and should never write to production.

### What if I do not have real images yet?

Say "use placeholder media where needed." The one-shot skill should add visible placeholder media with useful alt text so editors can replace it later.

### What should I avoid asking for?

Avoid asking for arbitrary CSS, custom colors, custom breakpoints, custom font sizes, or one-off layout hacks. Ask for the outcome instead, such as "make this feel tighter" or "make this section more executive."

### What happens if a check fails?

The agent should stop and explain the blocker. Common blockers are missing setup, invalid page content, build failures, or preview problems.

### Can the agent update reusable components?

Yes, use `foundsm-landing-page-component-editor`. It should update schema, query projection, renderer, styles, demo data, and skill references together when a reusable component change requires it.
