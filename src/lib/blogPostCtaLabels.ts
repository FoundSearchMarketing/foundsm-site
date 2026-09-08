/**
 * Per-article CTA button labels for insights cards.
 *
 * Resolution order:
 *   1. `ctaLabel` set on the post in Sanity (editorial override).
 *   2. Curated label for an existing post, keyed by slug.
 *   3. A label derived from the post title, de-duplicated across the set.
 */

export interface CtaLabelSource {
  slug: string;
  title: string;
  ctaLabel?: string | null;
  categories?: { label: string; slug: string }[];
}

export const CURATED_CTA_LABELS: Record<string, string> = {
  'microsoft-partner-awards-2026-finalist': 'See the Work Behind It',
  'midwest-hvac-paid-media-seasonal-demand': 'Get Ahead of HVAC Season',
  '20-year-anniversary': "Hear Julie's Story",
  '20-years-of-higher-ed-marketing': "See What's Next in Higher Ed",
  'dirty-signals-bot-traffic-junk-leads': 'Clean Up Your Signals',
  'customer-match-uploads-disabled-in-google-ads-api': 'See the Customer Match Change',
  'signal-loss-costs-real-revenue': 'Understand Signal Loss',
  'googles-vision-for-2026-building-a-revenue-engine-powered-by-data': "Explore Google's 2026 Vision",
  'indiana-consumer-data-protection-act': 'Get Ahead of ICDPA',
  'closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing': 'Close the Loop',
  'wrapping-up-19-years-with-purpose-founds-year-end-tradition-of-giving-back': 'See How We Give Back',
  'a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4': 'Segment AI Traffic in GA4',
  'how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit': 'See the Advantage+ Insights',
  'our-top-takeaways-from-search-marketing-expo-advanced-2025': 'Get the SMX Takeaways',
  'seo-basics-7-simple-tips-to-improve-search-rankings': 'Get the 7 SEO Tips',
  'ga4-and-paid-media-whats-changing': "See What's Changing in GA4",
  'leveling-up-social-media-lead-generation-strategies': 'Level Up Paid Social Leads',
  'content-best-practices-to-improve-search-engine-ranking': 'Improve Your Content',
  'tiktok-marketing-is-it-right-for-your-business': 'Is TikTok Right for You?',
  'foundsm-named-a-great-employer-to-work-for-in-2022': 'See the 2022 Award',
  'a-marketers-guide-to-paid-media-ad-types': 'Explore Paid Media Ad Types',
  'intro-to-responsive-search-ads-rsas': 'Get Started With RSAs',
  'three-ways-to-get-ahead-of-googles-expanded-text-ad-eta-sunset': 'Prepare for the ETA Sunset',
  'headline-copy-increase-lp-cvr': 'Write Better Headlines',
  'how-to-get-started-with-facebooks-campaign-budget-optimization-cbo': 'Get Started With CBO',
  'embrace-the-future-of-analytics-ga4': 'Embrace GA4',
  'core-web-vitals-an-introduction-to-googles-new-page-experience-signal': 'Learn Core Web Vitals',
  'a-guide-to-using-paid-search-for-top-of-funnel-marketing': 'Read the Paid Search Guide',
  '3-paid-social-strategies-to-stop-doing': 'See What to Stop Doing',
  'how-to-remarket-on-social-media-for-lead-generation': 'Learn Social Remarketing',
  'linkedin-conversation-ads': 'Explore Conversation Ads',
  'how-the-2020-presidential-election-has-impacted-digital-advertising': 'See the Election Impact',
  'annual-google-analytics-audits': 'Get the 8 Audit Reasons',
  'rank-higher-on-google-maps': 'Rank Higher on Google Maps',
  'guide-for-local-seo': 'Read the Local SEO Guide',
  'increase-search-rankings': 'Get the 7 Ranking Steps',
  'cro-best-practices': 'Get the 5 CRO Practices',
  'marketing-covid19': 'Evolve Your Strategy',
  'gtm-video-elements': 'Track Video in GTM',
  'gtm-javascript-utility-variables': 'Get the GTM Variable Tip',
  ccpa: 'Understand the CCPA',
  'emojis-facebook': 'Try Emojis in Your Ads',
  'inside-indiana-business-tech-town-hall': 'See the Town Hall Recap',
  'bing-select-partner': 'See Our Bing Select Status',
  'facebook-ad-creative': 'View the Infographic',
  'expanded-text-ads': 'See the Text Ad Changes',
  'facebook-vs-traditional-advertising': 'Rethink Your Ad Buy',
  'social-media-success-pt-3': 'Make Engagement Easy',
  'entrepreneurship-show': 'See the Feature',
  'best-places-to-work-2016': 'See the 2016 Honor',
  'social-media-success-pt-2': 'Avoid Negative Attention',
  'social-media-success-pt-1': 'Treat Customers Right',
  'found-sm-website': 'Tour the New Site',
};

const MAX_LABEL_LENGTH = 30;
const ALTERNATE_VERBS = ['Explore', 'Dive Into', 'Learn About', 'Discover', 'Unpack'];
const WORD_NUMBERS: Record<string, string> = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
};
const LIST_NOUNS = 'tips|ways|steps|reasons|strategies|takeaways|best practices|practices|lessons|mistakes|trends|ideas|questions';
const LIST_PATTERN = new RegExp(`\\b(\\d+|${Object.keys(WORD_NUMBERS).join('|')})\\s+(?:[a-z-]+\\s+){0,3}?(${LIST_NOUNS})\\b`, 'i');

/**
 * Resolve a CTA label for every post, guaranteeing that no two posts share a label.
 */
export function resolveCtaLabels<T extends CtaLabelSource>(posts: T[]): Map<string, string> {
  const labels = new Map<string, string>();
  const taken = new Set<string>();
  const claim = (slug: string, label: string) => {
    labels.set(slug, label);
    taken.add(normalizeLabel(label));
  };

  // Editorial and curated labels take priority and are never rewritten.
  for (const post of posts) {
    const explicit = cleanLabel(post.ctaLabel) || CURATED_CTA_LABELS[post.slug];
    if (explicit) claim(post.slug, explicit);
  }

  for (const post of posts) {
    if (labels.has(post.slug)) continue;

    const candidates = deriveCtaLabelCandidates(post);
    const unique = candidates.find((candidate) => !taken.has(normalizeLabel(candidate)));
    claim(post.slug, unique ?? candidates[candidates.length - 1]);
  }

  return labels;
}

export function resolveCtaLabel(post: CtaLabelSource): string {
  return resolveCtaLabels([post]).get(post.slug) ?? 'Read the Article';
}

/**
 * Build an ordered list of label candidates from the post title, most specific first.
 */
export function deriveCtaLabelCandidates(post: CtaLabelSource): string[] {
  const title = collapseWhitespace(post.title).replace(/\s*\[[^\]]*\]\s*$/, '');
  const candidates: string[] = [];
  const push = (label: string | undefined) => {
    const cleaned = cleanLabel(label);
    if (cleaned && cleaned.length <= MAX_LABEL_LENGTH && !candidates.includes(cleaned)) candidates.push(cleaned);
  };

  const list = title.match(LIST_PATTERN);
  if (list) {
    const count = WORD_NUMBERS[list[1].toLowerCase()] ?? list[1];
    push(`Get the ${count} ${titleCase(list[2])}`);
    push(`See All ${count} ${titleCase(list[2])}`);
  }

  if (/\binfographic\b/i.test(post.title)) push('View the Infographic');
  if (/\bguide\b/i.test(title)) {
    for (const maxWords of [3, 2]) push(`Read the ${topicFrom(title, maxWords)} Guide`);
  }

  const howTo = title.match(/^how to\s+(.+)$/i);
  if (howTo) {
    push(`Learn How to ${shorten(stripTrailingPunctuation(howTo[1]), 4)}`);
    push(`Learn to ${shorten(stripTrailingPunctuation(howTo[1]), 3)}`);
  }

  const intro = title.match(/^(?:intro(?:duction)? to|getting started with|get started with)\s+(.+)$/i);
  if (intro) {
    for (const maxWords of [3, 2]) push(`Get Started With ${shorten(stripTrailingPunctuation(intro[1]), maxWords)}`);
  }

  if (/\?\s*$/.test(title)) {
    const question = title.replace(/^(?:is|are|should|does|do|can|could|will|what|why|when|which)\s+/i, '');
    for (const maxWords of [3, 2]) push(`Find Out: ${topicFrom(question, maxWords)}`);
  }

  // Prefer the fullest topic phrase that still fits, then progressively shorter ones.
  for (const verb of ALTERNATE_VERBS) {
    for (const maxWords of [4, 3, 2]) push(`${verb} ${topicFrom(title, maxWords)}`);
  }

  const category = post.categories?.[0]?.label;
  if (category) push(`More on ${category}`);
  push('Read the Article');

  return candidates;
}

function topicFrom(title: string, maxWords: number): string {
  let topic = title.split(/\s*(?::|\||–|—|\s-\s)\s*/)[0] || title;
  topic = topic.replace(/^(how to|a guide to|the guide to|guide to|intro(?:duction)? to|the|an|a|our|your)\s+/i, '');
  topic = topic.replace(/^(top|best)\s+\d+\s+/i, '');
  topic = topic.replace(/^\d+\s+(?:[a-z-]+\s+){0,2}?(?:tips|ways|steps|reasons|strategies)\s+(?:to|for)\s+/i, '');
  topic = stripTrailingPunctuation(topic);
  return shorten(topic, maxWords);
}

function shorten(text: string, maxWords: number): string {
  const words = collapseWhitespace(text).split(' ').filter(Boolean);
  const kept = words.slice(0, maxWords);
  // Avoid ending on a connective word.
  while (kept.length > 1 && /^(a|an|and|the|to|for|of|in|on|with|your|by|is|it|or|vs\.?|&)$/i.test(kept[kept.length - 1])) {
    kept.pop();
  }
  return kept.join(' ');
}

function stripTrailingPunctuation(text: string): string {
  return text.replace(/[\s?!.,:;–—-]+$/g, '').trim();
}

function titleCase(text: string): string {
  return text
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word))
    .join(' ');
}

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function cleanLabel(label: string | null | undefined): string | undefined {
  if (typeof label !== 'string') return undefined;
  const cleaned = collapseWhitespace(label).replace(/\s*(?:→|->|»|&rarr;)\s*$/u, '');
  return cleaned || undefined;
}

function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
