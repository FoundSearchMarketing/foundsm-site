# Project Memory Index

This index tracks persistent project context that carries across Claude Code sessions.

## User Context
- Solo developer on this project
- Responsible for both development and content integration
- Focus on lean, pragmatic solutions without overengineering

## Project Architecture

### Tech Stack
- **Framework**: Astro 5.x (static output)
- **CMS**: Sanity v3 (content management)
- **Hosting**: Vercel (auto-deploys on main push)
- **Analytics**: Google Tag Manager with server-side tagging
- **Forms**: HubSpot (Portal 5045186)

### Key Components
- 10 reusable Astro block types for landing pages (Hero, Stats, Features, Testimonial, CTA, Form, Text, ImageText, LogoBar, FAQ)
- Landing pages built in Sanity Studio by composing blocks
- A/B testing via middleware.ts (cookie-based, 30-day persistence)
- Dynamic page generation from CMS data at build time

### Important Files
- `src/middleware.ts` — A/B testing logic
- `src/components/blocks/` — Astro block components
- `studio/schemas/` — Sanity content schemas
- `astro.config.mjs` — Framework configuration

## Development Workflow

### Recommended Skills
- `engineering:deploy-checklist` — Run before pushing to main
- `design:accessibility-review` — Audit landing pages

### Guidelines
See `GUIDELINES.md` for:
- Branch naming conventions
- PR description template
- PR conventions
- Auto-deploy behavior

## Decisions & Patterns

### Future Skills to Consider
- Landing Page Audit skill (planned) — validate Sanity data completeness and component rendering

---

*Last updated: 2026-04-13*
