# Found Search Marketing Website

Enterprise paid media agency website built with [Astro](https://astro.build) and [Sanity CMS](https://www.sanity.io).

## Tech Stack

- **Framework:** Astro (Static Output)
- **CMS:** Sanity v3
- **Hosting:** Vercel
- **Analytics:** Google Tag Manager (GTM-PG7TGGG) via server-side tagging
- **Forms:** HubSpot (Portal 5045186)

## Getting Started

### Website

```bash
npm install
npm run dev
```

### Sanity Studio

```bash
cd studio
npm install
npm run dev
```

## Project Structure

```
├── public/            # Static assets (images, scripts, robots.txt)
├── src/
│   ├── components/    # Reusable Astro components
│   ├── layouts/       # Page layouts (BaseLayout)
│   ├── lib/           # Sanity client & GROQ queries
│   ├── pages/         # File-based routing
│   ├── scripts/       # Client-side JavaScript
│   └── styles/        # Global CSS
├── studio/            # Sanity Studio
│   └── schemas/       # Content schemas
├── astro.config.mjs   # Astro configuration
├── vercel.json        # Vercel deployment config
└── package.json
```

## Landing Pages

Landing pages are modular, CMS-driven pages at `/lp/<slug>`. Create them in Sanity Studio:

1. In Sanity Studio, create a new **Landing Page** document
2. Add a **URL Slug** (this becomes the `/lp/<slug>` path)
3. Build the page by adding **Page Sections** from 10 available block types:
   - **Hero** — headline, subheadline, CTA, background image, light/dark/green theme
   - **Stats** — array of value/label pairs, light/dark theme
   - **Features** — heading, feature cards in 2/3/4-column grid
   - **Testimonial** — quote with author info and avatar
   - **Call to Action** — headline + button with topographic background
   - **Form** — HubSpot form embed by form ID
   - **Text** — rich text with alignment and width controls
   - **Image + Text** — two-column layout with image left/right toggle
   - **Logo Bar** — partner/client logo grid
   - **FAQ** — accessible accordion with rich text answers
4. Optional: configure SEO fields, hide navigation/footer, or assign an A/B test variant

## A/B Testing

Cookie-based A/B testing is built into the Astro middleware (`src/middleware.ts`).

### How it works
1. On first visit, the middleware assigns a random variant (50/50 split) and sets a cookie (e.g., `ab-homepage-hero=control` or `ab-homepage-hero=variant-a`)
2. The cookie persists for 30 days so the user sees the same variant consistently
3. The variant is pushed to the GTM `dataLayer` as an `ab_test_loaded` event on every page load
4. Pages can read the variant from `Astro.locals.abTests['homepage-hero']`

### Adding a new test
1. In `src/middleware.ts`, add a new cookie-based assignment (follow the existing pattern)
2. The cookie name should start with `ab-` (the GTM script auto-detects `ab-*` cookies)
3. In GA4, create a custom dimension for the test cookie and use the `ab_test_loaded` event to segment reports

### Reading results in GA4
- All `ab-*` cookies are automatically pushed to the `dataLayer`
- In GA4, go to **Explore > Free Form**, add the custom dimension for your test, and compare conversion rates between variants

## Deployment

The site deploys to Vercel automatically on push to `main`. Sanity Studio can be deployed independently via `cd studio && npx sanity deploy`.
