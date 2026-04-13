# Development Guidelines

## Branch Naming

Use consistent branch names to keep the repository organized:

```
feature/component-name          # New Astro component or feature
fix/issue-description           # Bug fixes
content/page-slug               # Content/schema changes in Sanity
chore/task-description          # Build config, deps, refactoring
```

**Examples:**
- `feature/testimonial-block`
- `fix/form-validation-error`
- `content/services-landing-page`
- `chore/update-dependencies`

---

## PR Description Template

Keep PR descriptions concise and focused:

```markdown
## What
Brief description of what changed

## Why
Problem being solved or feature being added
```

**Example:**
```markdown
## What
Add new Testimonial block component for landing pages

## Why
Marketing team needs testimonial sections for client success stories
```

---

## PR Conventions

- **One concern per PR** — Don't bundle unrelated component changes, content updates, and chores. This keeps history clean and makes reverts easier.

- **Link Sanity docs** — For content/schema PRs, reference the relevant Sanity document or schema in the PR description.

- **Screenshot/demo** — For visual changes (new components, styling updates), include a before/after screenshot or link to a preview.

- **Auto-deploy on merge to main** — All pushes to `main` automatically deploy to Vercel. No manual steps required.

---

## Recommended Skills

When working in Claude Code, enable these skills for this project:

- `engineering:deploy-checklist` — Run before pushing to main to verify build, tests, and config
- `design:accessibility-review` — Audit landing pages and components for WCAG compliance
