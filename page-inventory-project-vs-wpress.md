# Page Inventory Checklist: Astro Project vs foundsm.wpress

Generated on 2026-05-12.

Done criteria:
- `[x]` means the page has completed visual/HTML/CSS/JS QA against the WordPress source and known issues were fixed in the Astro project.
- `[ ]` means the page is inventoried but has not yet completed that QA/fix pass.

Sources:
- Local project: refreshed with `npm run build`, then read generated HTML routes from `dist/`.
- Local source routes: `src/pages/**/*.astro` plus static HTML copied from `public/`.
- WordPress archive: `/Users/theoden/Documents/test/foundsm.wpress`.
- WordPress database: extracted `database.sql` to `/private/tmp/foundsm-wpress-database.sql` and parsed `SERVMASK_PREFIX_posts`.
- WordPress cache: read WP Rocket HTML entries under `cache/wp-rocket/foundsm.com/` inside the `.wpress` archive.

## Inventory Summary

- Local generated HTML routes inventoried: 57 routes.
- Local Astro source route files inventoried: 24 files.
- WordPress published `page` records inventoried: 43 records.
- WordPress published `post` records inventoried: 10 records.
- All 53 published WordPress page/post routes are generated locally.
- 19 WordPress cache-only author/category/tag routes are not generated locally.

## QA/Fix Status Summary

- QA/fix complete: 1 route.
- QA/fix not complete: 85 inventoried route-like items.

## Published WordPress Pages

All published WordPress `page` records from the `.wpress` database are present in the local Astro build.

- [ ] `/` - Home - WP ID `66`
- [x] `/about-us/` - About Us - WP ID `991`
- [ ] `/capabilities/` - Capabilities - WP ID `798`
- [ ] `/capabilities/data-activation/` - Data Activation - WP ID `2773`
- [ ] `/capabilities/data-intelligence/` - Data Intelligence - WP ID `1603`
- [ ] `/capabilities/paid-media/` - Paid Media - WP ID `1531`
- [ ] `/capabilities/performance-creative/` - Performance Creative - WP ID `1951`
- [ ] `/contact-us/` - Contact Us - WP ID `913`
- [ ] `/dataconnect/` - Data Connect - WP ID `4068`
- [ ] `/insights-filter-results/` - Insights-filter-results - WP ID `7093`
- [ ] `/insights-march-update-v2/` - Insights - March Update v2 - WP ID `7043`
- [ ] `/insights-march-update/` - Insights - March Update - WP ID `6709`
- [ ] `/insights/` - Insights - WP ID `2283`
- [ ] `/insights/authors/` - Authors - WP ID `4751`
- [ ] `/insights/authors/adam/` - Adam - WP ID `5200`
- [ ] `/insights/authors/caroline/` - Caroline - WP ID `5202`
- [ ] `/insights/authors/emily/` - Emily - WP ID `5986`
- [ ] `/insights/authors/julie/` - Julie - WP ID `5007`
- [ ] `/insights/authors/kelley/` - Kelley - WP ID `5196`
- [ ] `/insights/authors/kelsey/` - Kelsey - WP ID `5194`
- [ ] `/insights/authors/kylie/` - Kylie - WP ID `5563`
- [ ] `/insights/authors/maria/` - Maria - WP ID `5303`
- [ ] `/insights/authors/matt/` - Matt - WP ID `5565`
- [ ] `/insights/authors/nicholas/` - Nicholas - WP ID `5984`
- [ ] `/insights/authors/ryan/` - Ryan - WP ID `5198`
- [ ] `/insights/blog/` - Blog - WP ID `6814`
- [ ] `/insights/man-vs-machine-smx-webinar/` - Man vs Machine - SMX - On-Demand Webinar - WP ID `6703`
- [ ] `/insights/modernize-your-data-architecture-webinar/` - Modernize Your Data Architecture - On-Demand Webinar - WP ID `5680`
- [ ] `/insights/modernize-your-data-architecture/` - Modernize Your Data Architecture - WP ID `4544`
- [ ] `/insights/toolsandguides/` - Tools and Guides - WP ID `6823`
- [ ] `/insights/webinar/` - Watch the webinar - WP ID `5935`
- [ ] `/insights/webinars/` - Webinars - WP ID `6829`
- [ ] `/insights/website-cookies-explained-on-demand-webinar/` - Website Cookies Explained - On-Demand Webinar - WP ID `7107`
- [ ] `/insights/whitepapers/` - White Papers - WP ID `6827`
- [ ] `/newsletter/` - Newsletter - WP ID `2365`
- [ ] `/our-approach/` - Our Approach - WP ID `609`
- [ ] `/privacy-policy/` - Privacy Policy - WP ID `1295`
- [ ] `/safelist/` - Safelist - WP ID `2508`
- [ ] `/signal-quiz/` - Signal Quiz - WP ID `4158`
- [ ] `/team/` - Team - WP ID `1748`
- [ ] `/thank-you/` - Thank You - WP ID `2776`
- [ ] `/whitepapers/` - whitepapers - WP ID `4197`
- [ ] `/whitepapers/first-party-data/` - Insights - Why First-Party Data Is Your Most Valuable Profit Lever - WP ID `3265`

## Published WordPress Posts

All published WordPress `post` records from the `.wpress` database are present in the local Astro build.

- [ ] `/insights/a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4/` - A 3 Minute Implementation Guide to Segmenting AI Traffic in GA4 - WP ID `3436`
- [ ] `/insights/closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing/` - Closing the Loop: How Conversion APIs and Value-Based Bidding Transform Performance Marketing - WP ID `4358`
- [ ] `/insights/customer-match-uploads-disabled-in-google-ads-api/` - Google Ads API Update: A Critical Change for Customer Match - WP ID `6193`
- [ ] `/insights/dirty-signals-bot-traffic-junk-leads/` - Bot Traffic and Bad Lookalikes: How Dirty Signals Can Wreck Your Funnel and Your Targeting - WP ID `5535`
- [ ] `/insights/googles-vision-for-2026-building-a-revenue-engine-powered-by-data/` - Google's Vision for 2026: Building a Revenue Engine Powered by Data - WP ID `4980`
- [ ] `/insights/how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit/` - How Advantage+ Is Reshaping Student Recruitment, Insights from a Meta Education Summit - WP ID `2464`
- [ ] `/insights/indiana-consumer-data-protection-act/` - ICDPA Isn't Just Compliance. It's the Foundation of Smarter Data Strategy. - WP ID `4486`
- [ ] `/insights/our-top-takeaways-from-search-marketing-expo-advanced-2025/` - Our Top Takeaways From Search Marketing Expo Advanced 2025 - WP ID `2256`
- [ ] `/insights/signal-loss-costs-real-revenue/` - When Marketing Metrics and Financial Results Don't Align: Understanding Signal Loss - WP ID `5376`
- [ ] `/insights/wrapping-up-19-years-with-purpose-founds-year-end-tradition-of-giving-back/` - Wrapping Up 19 Years With Purpose: Found's Year-End Tradition of Giving Back - WP ID `3810`

## WordPress Cache-Only Routes

These routes exist as WP Rocket cached HTML inside `foundsm.wpress`, but they are not published `page` or `post` records in the extracted database and are not currently generated by the local Astro build.

- [ ] `/insights/author/caroline/` - cached mobile
- [ ] `/insights/author/julie/` - cached mobile
- [ ] `/insights/author/kelley/` - cached desktop, mobile
- [ ] `/insights/author/kelsey/` - cached desktop, mobile
- [ ] `/insights/author/mingyue/` - cached desktop, mobile
- [ ] `/insights/author/ryan/` - cached desktop, mobile
- [ ] `/insights/author/trfoundsm-com/` - cached desktop, mobile
- [ ] `/insights/category/industry-insights/` - cached desktop, mobile
- [ ] `/insights/category/life-at-found/` - cached desktop, mobile
- [ ] `/insights/category/marketing-analytics-tracking/` - cached desktop
- [ ] `/insights/category/meta/` - cached desktop, mobile
- [ ] `/insights/category/paid-media-strategy/` - cached desktop, mobile
- [ ] `/insights/category/social-advertising/` - cached desktop, mobile
- [ ] `/insights/category/uncategorized/` - cached desktop, mobile
- [ ] `/insights/tag/blog/` - cached desktop, mobile
- [ ] `/insights/tag/quiz/` - cached desktop
- [ ] `/insights/tag/toolsandguides/` - cached desktop, mobile
- [ ] `/insights/tag/webinars/` - cached desktop, mobile
- [ ] `/insights/tag/whitepapers/` - cached desktop, mobile

## Local-Only Generated Routes

These routes are generated by the local project but were not published WordPress `page` or `post` records in the extracted database.

- [ ] `/404` - local error page
- [ ] `/events/lunch-and-learn/` - local event landing page
- [ ] `/foundsm-header-rebuild` - copied static HTML from `public/foundsm-header-rebuild.html`
- [ ] `/imported/home/` - ignored local imported route

## Local Source Route Files

- `src/pages/404.astro`
- `src/pages/[slug].astro`
- `src/pages/about-us.astro`
- `src/pages/capabilities/data-activation.astro`
- `src/pages/capabilities/data-intelligence.astro`
- `src/pages/capabilities/index.astro`
- `src/pages/capabilities/paid-media.astro`
- `src/pages/capabilities/performance-creative.astro`
- `src/pages/contact-us.astro`
- `src/pages/events/lunch-and-learn.astro`
- `src/pages/imported/home.astro`
- `src/pages/index.astro`
- `src/pages/insights.astro`
- `src/pages/insights/[slug].astro`
- `src/pages/insights/authors/[slug].astro`
- `src/pages/insights/authors/index.astro`
- `src/pages/insights/blog.astro`
- `src/pages/lp/[slug].astro`
- `src/pages/newsletter.astro`
- `src/pages/our-approach.astro`
- `src/pages/privacy-policy.astro`
- `src/pages/team.astro`
- `src/pages/whitepapers/[slug].astro`
- `src/pages/whitepapers/index.astro`

## Other Published WordPress Custom Post Types

These are present in the WordPress database but are not normal frontend `page` or blog `post` records.

- [ ] `/found2025/` - `custom_css` - found2025 - WP ID `3220`
- [ ] `/example-auto-opening-announcement-popup/` - `popup` - Example: Auto-opening announcement popup - WP ID `3195`
- [ ] `/content-only/` - `popup_theme` - Content Only - For use with page builders or block editor - WP ID `3194`
- [ ] `/cutting-edge/` - `popup_theme` - Cutting Edge - WP ID `3191`
- [ ] `/default-theme/` - `popup_theme` - Default Theme - WP ID `3187`
- [ ] `/enterprise-blue/` - `popup_theme` - Enterprise Blue - WP ID `3189`
- [ ] `/floating-bar/` - `popup_theme` - Floating Bar - Soft Blue - WP ID `3193`
- [ ] `/framed-border/` - `popup_theme` - Framed Border - WP ID `3192`
- [ ] `/hello-box/` - `popup_theme` - Hello Box - WP ID `3190`
- [ ] `/lightbox/` - `popup_theme` - Light Box - WP ID `3188`
