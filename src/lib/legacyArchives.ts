import type { BlogPost } from './blogPosts';

export type LegacyArchiveKind = 'author' | 'category' | 'tag';

export interface LegacyArchiveDefinition {
  kind: LegacyArchiveKind;
  slug: string;
  title: string;
  seoTitle: string;
  canonicalUrl: string;
  robots: string;
  postSlugs: string[];
}

export const legacyArchivePostTitles: Record<string, string> = {
  'dirty-signals-bot-traffic-junk-leads': 'Bot Traffic and Bad Lookalikes: How Dirty Signals Can Wreck Your Funnel and Your Targeting',
  'customer-match-uploads-disabled-in-google-ads-api': 'Google Ads API Update: A Critical Change for Customer Match',
  'signal-loss-costs-real-revenue': 'When Marketing Metrics and Financial Results Don’t Align: Understanding Signal Loss',
  'googles-vision-for-2026-building-a-revenue-engine-powered-by-data': 'Google’s Vision for 2026: Building a Revenue Engine Powered by Data',
  'indiana-consumer-data-protection-act': 'ICDPA Isn’t Just Compliance. It’s the Foundation of Smarter Data Strategy.',
  'closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing': 'Closing the Loop: How Conversion APIs and Value-Based Bidding Transform Performance Marketing',
  'wrapping-up-19-years-with-purpose-founds-year-end-tradition-of-giving-back': 'Wrapping Up 19 Years With Purpose: Found’s Year-End Tradition of Giving Back',
  'a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4': 'A 3 Minute Implementation Guide to Segmenting AI Traffic in GA4',
  'how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit': 'How Advantage+ Is Reshaping Student Recruitment, Insights from a Meta Education Summit',
  'our-top-takeaways-from-search-marketing-expo-advanced-2025': 'Our Top Takeaways From Search Marketing Expo Advanced 2025',
};

const legacyArchivePostExcerpts: Record<string, string> = {
  'dirty-signals-bot-traffic-junk-leads': 'Leads are up. Pipeline quality is down. Dirty signals can poison optimization and steer budget to the wrong audiences. Here’s what executives should watch.',
  'customer-match-uploads-disabled-in-google-ads-api': 'Google Ads API Update could disrupt your Customer Match workflows starting April 2026. Here’s how to prepare.',
  'signal-loss-costs-real-revenue': 'Marketing says ROAS is 3.5:1. Finance disagrees. The gap isn’t a reporting error, it’s signal loss. Here’s where to find it.',
  'googles-vision-for-2026-building-a-revenue-engine-powered-by-data': 'Explore Google’s 2026 vision for building a scalable revenue engine powered by data, AI, and smarter monetization strategies.',
  'indiana-consumer-data-protection-act': 'Indiana’s ICDPA reshapes how businesses collect, consent to, and optimize first-party data for growth.',
  'closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing': 'Unlock the next evolution in performance marketing by moving beyond basic pixel tracking and embracing Conversion APIs (CAPI) and value-based bidding. In this post, we break down how server-to-server data integration helps advertisers send high-quality, first-party conversion signals back to ad platforms, enabling smarter machine learning and better bid optimization for real business value. Learn why revenue-focused marketers are shifting from traditional tracking to CAPI for more accurate measurement, how value-based bidding prioritizes high-value outcomes over volume, and actionable strategies to close the loop on conversion data to drive stronger ROI across campaigns.',
  'wrapping-up-19-years-with-purpose-founds-year-end-tradition-of-giving-back': 'Found has always believed that great work starts with great people, and great people make an even greater impact when they come together for good. This year, our team leaned into compassion, local involvement, and service.',
  'a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4': 'Segmenting AI search traffic in GA4 allows you to see traffic trends from answer engines over time and analyze correlations between other traffic sources (for example, organic search). This change in Google Analytics is very straightforward and should not take more than 3 minutes to implement.',
  'how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit': 'Over the past few years, we’ve seen Meta’s Advantage+ Audience feature evolve from a simple reach-expanding tool into a powerful AI-driven solution for higher education marketers. It’s helping institutions move beyond manual segmentation to discover new, high-value audiences.',
  'our-top-takeaways-from-search-marketing-expo-advanced-2025': 'In June 2025, four of our Found Search Marketing team members traveled to Boston, MA, for the first in-person SMX conference since 2019. We’ve compiled many of our thoughts and takeaways for those that missed it.',
};

const allBlogPostSlugs = [
  'dirty-signals-bot-traffic-junk-leads',
  'customer-match-uploads-disabled-in-google-ads-api',
  'signal-loss-costs-real-revenue',
  'googles-vision-for-2026-building-a-revenue-engine-powered-by-data',
  'indiana-consumer-data-protection-act',
  'closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing',
  'wrapping-up-19-years-with-purpose-founds-year-end-tradition-of-giving-back',
  'a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4',
  'how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit',
  'our-top-takeaways-from-search-marketing-expo-advanced-2025',
];

const legacyArchives: LegacyArchiveDefinition[] = [
  authorArchive('caroline', 'Caroline Stoner', []),
  authorArchive('julie', 'Julie Warnecke', ['how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit']),
  authorArchive('kelley', 'Kelley Swart', ['our-top-takeaways-from-search-marketing-expo-advanced-2025']),
  authorArchive('kelsey', 'Kelsey Connor', ['wrapping-up-19-years-with-purpose-founds-year-end-tradition-of-giving-back']),
  authorArchive('mingyue', 'Mingyue Sun', []),
  authorArchive('ryan', 'Ryan Eme', [
    'indiana-consumer-data-protection-act',
    'a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4',
  ]),
  authorArchive('trfoundsm-com', 'TR Scrivner', [
    'dirty-signals-bot-traffic-junk-leads',
    'customer-match-uploads-disabled-in-google-ads-api',
    'signal-loss-costs-real-revenue',
  ]),
  categoryArchive('industry-insights', 'Industry Insights', [
    'customer-match-uploads-disabled-in-google-ads-api',
    'signal-loss-costs-real-revenue',
    'googles-vision-for-2026-building-a-revenue-engine-powered-by-data',
    'indiana-consumer-data-protection-act',
    'a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4',
    'how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit',
    'our-top-takeaways-from-search-marketing-expo-advanced-2025',
  ]),
  categoryArchive('life-at-found', 'Life at Found', ['wrapping-up-19-years-with-purpose-founds-year-end-tradition-of-giving-back']),
  categoryArchive('marketing-analytics-tracking', 'Marketing Analytics & Tracking', [
    'dirty-signals-bot-traffic-junk-leads',
    'customer-match-uploads-disabled-in-google-ads-api',
    'signal-loss-costs-real-revenue',
    'googles-vision-for-2026-building-a-revenue-engine-powered-by-data',
    'indiana-consumer-data-protection-act',
  ]),
  categoryArchive('meta', 'Meta', ['how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit']),
  categoryArchive('paid-media-strategy', 'Paid Media Strategy', [
    'dirty-signals-bot-traffic-junk-leads',
    'googles-vision-for-2026-building-a-revenue-engine-powered-by-data',
    'closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing',
  ]),
  categoryArchive('social-advertising', 'Social Advertising', []),
  categoryArchive('uncategorized', 'Uncategorized', []),
  tagArchive('blog', 'Blog', allBlogPostSlugs),
  tagArchive('quiz', 'Quiz', []),
  tagArchive('toolsandguides', 'Toolsandguides', []),
  tagArchive('webinars', 'Webinars', []),
  tagArchive('whitepapers', 'Whitepapers', []),
];

export function getLegacyArchives(kind: LegacyArchiveKind): LegacyArchiveDefinition[] {
  return legacyArchives.filter((archive) => archive.kind === kind);
}

export function getLegacyArchive(kind: LegacyArchiveKind, slug: string | undefined): LegacyArchiveDefinition | undefined {
  return legacyArchives.find((archive) => archive.kind === kind && archive.slug === slug);
}

export function getLegacyArchivePosts(posts: BlogPost[], archive: LegacyArchiveDefinition): BlogPost[] {
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  return archive.postSlugs.map((slug) => bySlug.get(slug)).filter(Boolean) as BlogPost[];
}

export function getLegacyArchivePostTitle(post: BlogPost): string {
  return legacyArchivePostTitles[post.slug] || post.title.replace(/^\[TEST\]\s*/, '');
}

export function getLegacyArchivePostExcerpt(post: BlogPost): string {
  return legacyArchivePostExcerpts[post.slug] || post.excerpt;
}

export function getLegacyArchiveBodyClass(archive: LegacyArchiveDefinition): string {
  return `archive ${archive.kind} ${archive.kind}-${archive.slug}`;
}

function authorArchive(slug: string, name: string, postSlugs: string[]): LegacyArchiveDefinition {
  return {
    kind: 'author',
    slug,
    title: name,
    seoTitle: `${name}, Author at Found Search Marketing`,
    canonicalUrl: `https://foundsm.com/insights/author/${slug}/`,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    postSlugs,
  };
}

function categoryArchive(slug: string, title: string, postSlugs: string[]): LegacyArchiveDefinition {
  return {
    kind: 'category',
    slug,
    title,
    seoTitle: `${title} Archives - Found Search Marketing`,
    canonicalUrl: `https://foundsm.com/insights/category/${slug}/`,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    postSlugs,
  };
}

function tagArchive(slug: string, title: string, postSlugs: string[]): LegacyArchiveDefinition {
  return {
    kind: 'tag',
    slug,
    title,
    seoTitle: `${title} Archives - Found Search Marketing`,
    canonicalUrl: `https://foundsm.com/insights/tag/${slug}/`,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    postSlugs,
  };
}
