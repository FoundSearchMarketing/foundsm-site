# Missing Pages And Sanity Connection Checklist

Generated on 2026-05-11 from:
- `wp-pages-implementation-checklist.md`
- `sanity-connection-implementation-checklist.md`
- current Astro routes under `src/pages`
- Sanity schemas under `studio/schemas`
- git history through `origin/develop` at `18daa89`
- read-only Sanity document checks against `staging` and `production`

## Summary

- [x] All published WordPress pages and posts from the original checklist have Astro route coverage.
- [x] Published fixed/marketing/resource routes are wired to Sanity in code, with static/default fallbacks where documents are absent.
- [x] Blog posts, categories, authors, legacy pages, fixed pages, landing pages, and team members have Sanity schemas.
- [x] Recent visual QA fixes are merged for homepage, Our Approach, Paid Media, Capabilities, partner/client logos, and Insights hero imagery.
- [ ] 19 WP Rocket cache-only author/category/tag archive URLs are still not implemented as dedicated Astro routes and are not connected to Sanity.
- [ ] Staging is missing most fixed-page singleton documents and all `legacyPage`, `capabilityDetailPage`, `formPage`, `teamMember`, and `landingPage` documents.
- [ ] Production is largely unseeded; only `insightsPage` was present in the read-only check.
- [ ] Global site settings and redirect records are not modeled in Sanity yet.

## Already Fixed From Git History

- [x] Blog data wired to Sanity: `79e9298`, `914e1c8`
- [x] Homepage migrated: `996d0fe`
- [x] Our Approach migrated: `95f9c89`
- [x] Capabilities overview and detail pages migrated: `8990e5c`
- [x] About page migrated: `4782b11`
- [x] WordPress implementation checklist added: `8958728`
- [x] HTML pages migrated to Astro: `647b032`
- [x] Remaining WordPress routes migrated: `22bd783`, `c977371`
- [x] Marketing pages connected to Sanity: `92541e1`
- [x] Remaining static pages connected to Sanity: `6d156ab`
- [x] Legacy WordPress pages connected to Sanity: `b625f43`
- [x] Homepage visual QA and Sanity logo source fixes: `895bbba`, `36d6b28`, `442fdcb`
- [x] Our Approach Sanity image/accordion fix: `13bc307`
- [x] Insights hero image connected to Sanity: `d8b1048`
- [x] Paid Media visual QA fix merged in PR #37: `016d55b`, `253d797`
- [x] Capabilities missing-image fallback fix merged in PR #38: `90534eb`, `18daa89`

## Missing Route Checklist

These routes existed only as rendered WP Rocket cache entries, not as published WordPress `page` or `post` records in the original migration checklist. They need a product decision: implement archive pages, redirect them, or intentionally leave them unimplemented/noindexed.

### Author Archive Aliases

The `/insights/authors/*` pages are implemented and Sanity-backed. These older singular `/insights/author/*` archive aliases are still missing.

- [ ] `/insights/author/caroline/` - decide redirect to `/insights/authors/caroline/` or implement archive
- [ ] `/insights/author/julie/` - decide redirect to `/insights/authors/julie/` or implement archive
- [ ] `/insights/author/kelley/` - decide redirect to `/insights/authors/kelley/` or implement archive
- [ ] `/insights/author/kelsey/` - decide redirect to `/insights/authors/kelsey/` or implement archive
- [ ] `/insights/author/mingyue/` - decide target; no matching Sanity author was present in the original fixed author list
- [ ] `/insights/author/ryan/` - decide redirect to `/insights/authors/ryan/` or implement archive
- [ ] `/insights/author/trfoundsm-com/` - decide target; no matching Sanity author was present in the original fixed author list

### Category Archives

Current insights pages use Sanity blog posts/categories, but these WordPress taxonomy archive URLs are not implemented as routes or redirects.

- [ ] `/insights/category/industry-insights/`
- [ ] `/insights/category/life-at-found/`
- [ ] `/insights/category/marketing-analytics-tracking/`
- [ ] `/insights/category/meta/`
- [ ] `/insights/category/paid-media-strategy/`
- [ ] `/insights/category/social-advertising/`
- [ ] `/insights/category/uncategorized/`

### Tag Archives

These WordPress tag archive URLs are not implemented as routes or redirects.

- [ ] `/insights/tag/blog/`
- [ ] `/insights/tag/quiz/`
- [ ] `/insights/tag/toolsandguides/`
- [ ] `/insights/tag/webinars/`
- [ ] `/insights/tag/whitepapers/`

## Sanity Dataset Seeding Checklist

Code connection is present for the routes below, but the documents still need to exist in the relevant dataset for editors to control content. The read-only check found:

- `staging`: `homePage`, `insightsPage`, `aboutPage`, and `approachPage` present; 10 `blogPost`, 7 of 11 expected `author`, and 7 `blogCategory` documents present.
- `production`: only `insightsPage` present; zero `blogPost`, `author`, `blogCategory`, `teamMember`, `landingPage`, `legacyPage`, `capabilityDetailPage`, and `formPage` documents.

### Fixed Page Documents

- [x] Staging: `/` - `homePage`
- [ ] Production: `/` - `homePage`
- [x] Staging: `/insights/` - `insightsPage`
- [x] Production: `/insights/` - `insightsPage`
- [x] Staging: `/about-us/` - `aboutPage`
- [ ] Production: `/about-us/` - `aboutPage`
- [ ] Staging: `/capabilities/` - `capabilitiesPage`
- [ ] Production: `/capabilities/` - `capabilitiesPage`
- [ ] Staging: `/contact-us/` - `contactPage` (`formPage`)
- [ ] Production: `/contact-us/` - `contactPage` (`formPage`)
- [ ] Staging: `/newsletter/` - `newsletterPage` (`formPage`)
- [ ] Production: `/newsletter/` - `newsletterPage` (`formPage`)
- [x] Staging: `/our-approach/` - `approachPage`
- [ ] Production: `/our-approach/` - `approachPage`
- [ ] Staging: `/team/` - `teamPage`
- [ ] Production: `/team/` - `teamPage`
- [ ] Staging: `/privacy-policy/` - `privacyPolicyPage`
- [ ] Production: `/privacy-policy/` - `privacyPolicyPage`
- [ ] Staging: `/404.html` - `notFoundPage`
- [ ] Production: `/404.html` - `notFoundPage`
- [ ] Staging: `/events/lunch-and-learn/` - `eventLandingPage`
- [ ] Production: `/events/lunch-and-learn/` - `eventLandingPage`

### Capability Detail Documents

- [ ] Staging: `/capabilities/data-activation/` - `capabilityDataActivationPage`
- [ ] Production: `/capabilities/data-activation/` - `capabilityDataActivationPage`
- [ ] Staging: `/capabilities/data-intelligence/` - `capabilityDataIntelligencePage`
- [ ] Production: `/capabilities/data-intelligence/` - `capabilityDataIntelligencePage`
- [ ] Staging: `/capabilities/paid-media/` - `capabilityPaidMediaPage`
- [ ] Production: `/capabilities/paid-media/` - `capabilityPaidMediaPage`
- [ ] Staging: `/capabilities/performance-creative/` - `capabilityPerformanceCreativePage`
- [ ] Production: `/capabilities/performance-creative/` - `capabilityPerformanceCreativePage`

### Legacy Page Documents

All of these routes are implemented in Astro and wired to `legacyPage` documents, but no `legacyPage` documents were present in staging or production during the read-only check.

- [ ] Staging: `/dataconnect/` - `legacy-dataconnect`
- [ ] Production: `/dataconnect/` - `legacy-dataconnect`
- [ ] Staging: `/insights-filter-results/` - `legacy-insights-filter-results`
- [ ] Production: `/insights-filter-results/` - `legacy-insights-filter-results`
- [ ] Staging: `/insights-march-update-v2/` - `legacy-insights-march-update-v2`
- [ ] Production: `/insights-march-update-v2/` - `legacy-insights-march-update-v2`
- [ ] Staging: `/insights-march-update/` - `legacy-insights-march-update`
- [ ] Production: `/insights-march-update/` - `legacy-insights-march-update`
- [ ] Staging: `/insights/authors/` - `legacy-insights-authors`
- [ ] Production: `/insights/authors/` - `legacy-insights-authors`
- [ ] Staging: `/insights/man-vs-machine-smx-webinar/` - `legacy-man-vs-machine-smx-webinar`
- [ ] Production: `/insights/man-vs-machine-smx-webinar/` - `legacy-man-vs-machine-smx-webinar`
- [ ] Staging: `/insights/modernize-your-data-architecture-webinar/` - `legacy-modernize-your-data-architecture-webinar`
- [ ] Production: `/insights/modernize-your-data-architecture-webinar/` - `legacy-modernize-your-data-architecture-webinar`
- [ ] Staging: `/insights/modernize-your-data-architecture/` - `legacy-modernize-your-data-architecture`
- [ ] Production: `/insights/modernize-your-data-architecture/` - `legacy-modernize-your-data-architecture`
- [ ] Staging: `/insights/toolsandguides/` - `legacy-tools-and-guides`
- [ ] Production: `/insights/toolsandguides/` - `legacy-tools-and-guides`
- [ ] Staging: `/insights/webinar/` - `legacy-webinar`
- [ ] Production: `/insights/webinar/` - `legacy-webinar`
- [ ] Staging: `/insights/webinars/` - `legacy-webinars`
- [ ] Production: `/insights/webinars/` - `legacy-webinars`
- [ ] Staging: `/insights/website-cookies-explained-on-demand-webinar/` - `legacy-website-cookies-explained-webinar`
- [ ] Production: `/insights/website-cookies-explained-on-demand-webinar/` - `legacy-website-cookies-explained-webinar`
- [ ] Staging: `/insights/whitepapers/` - `legacy-insights-whitepapers`
- [ ] Production: `/insights/whitepapers/` - `legacy-insights-whitepapers`
- [ ] Staging: `/safelist/` - `legacy-safelist`
- [ ] Production: `/safelist/` - `legacy-safelist`
- [ ] Staging: `/signal-quiz/` - `legacy-signal-quiz`
- [ ] Production: `/signal-quiz/` - `legacy-signal-quiz`
- [ ] Staging: `/thank-you/` - `legacy-thank-you`
- [ ] Production: `/thank-you/` - `legacy-thank-you`
- [ ] Staging: `/whitepapers/` - `legacy-whitepapers`
- [ ] Production: `/whitepapers/` - `legacy-whitepapers`
- [ ] Staging: `/whitepapers/first-party-data/` - `legacy-first-party-data-whitepaper`
- [ ] Production: `/whitepapers/first-party-data/` - `legacy-first-party-data-whitepaper`

### Collection Documents

- [x] Staging: `blogPost` content exists for migrated insights posts
- [ ] Production: `blogPost` content exists for migrated insights posts
- [ ] Staging: `author` content is complete for current author routes; 7 of 11 expected authors exist, with `caroline`, `emily`, `kylie`, and `matt` still falling back to route defaults
- [ ] Production: `author` content exists for current author routes
- [x] Staging: `blogCategory` content exists for filters/categories
- [ ] Production: `blogCategory` content exists for filters/categories
- [ ] Staging: `teamMember` content exists for `/team/`
- [ ] Production: `teamMember` content exists for `/team/`
- [ ] Staging: `landingPage` content exists for `/lp/[slug]/`
- [ ] Production: `landingPage` content exists for `/lp/[slug]/`

## Not Yet Modeled In Sanity

- [ ] Global site settings for shared organization name, address, phone, email, social links, header/footer labels, and default SEO data
- [ ] Redirect records for historical WordPress aliases and cache-only archive URLs
- [ ] Optional taxonomy archive page model if category/tag archives should be first-class pages
- [ ] Optional author archive alias model or redirect mapping for `/insights/author/*`

## Notes

- The "missing route" list is intentionally separate from missing Sanity documents. Published WordPress pages are implemented; cache-only archive URLs are the remaining URL coverage decision.
- The "dataset seeding" list reflects document existence, not visual parity. Several routes still render from defaults when the Sanity document is absent.
- Paid Media currently has static default media in `defaultCapabilityDetailPages.paidMedia` so the merged visual QA fix can match the live page while the `capabilityPaidMediaPage` document is absent. Those fields should be moved into Sanity once the singleton is seeded.
- Capabilities now shows visible missing-Sanity placeholders when required CMS images are absent, per PR #38.
