import { block, type SimplePortableTextBlock } from './simplePortableTextCore';

export type LegacyPageGroup = 'root' | 'insights' | 'authorIndex' | 'whitepapers';

export interface LegacyPageDefinition {
  id: string;
  path: string;
  title: string;
  description: string;
  group: LegacyPageGroup;
}

export interface LegacyAuthorDefinition {
  slug: string;
  name: string;
}

export interface LegacyCta {
  label?: string;
  href?: string;
}

export interface LegacyPageCard {
  title: string;
  body?: SimplePortableTextBlock[];
  cta?: LegacyCta;
}

export interface LegacyPageForm {
  heading?: string;
  body?: SimplePortableTextBlock[];
  hubspotFormId?: string;
}

export interface LegacyPageData {
  _id?: string;
  title: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  robots: string;
  ogImage?: string;
  hero: {
    eyebrow?: string;
    heading: string;
    subheading?: string;
  };
  body: SimplePortableTextBlock[];
  cards?: LegacyPageCard[];
  cta?: {
    heading?: string;
    body?: SimplePortableTextBlock[];
    label?: string;
    href?: string;
  };
  form?: LegacyPageForm;
}

export interface LegacyAuthorData {
  _id?: string;
  slug: string;
  name: string;
  title?: string;
  bio?: string;
  linkedin?: string;
  image?: string;
}

export const legacyPageDefinitions: LegacyPageDefinition[] = [
  {
    id: 'legacy-dataconnect',
    path: '/dataconnect/',
    title: 'Data Connect',
    description: 'Connect customer, media, and conversion data so your team can make decisions from cleaner marketing signals.',
    group: 'root',
  },
  {
    id: 'legacy-insights-filter-results',
    path: '/insights-filter-results/',
    title: 'Insights Filter Results',
    description: 'Explore filtered perspectives from Found on paid media, analytics, data strategy, and performance marketing.',
    group: 'root',
  },
  {
    id: 'legacy-insights-march-update-v2',
    path: '/insights-march-update-v2/',
    title: 'Insights March Update v2',
    description: 'Read the latest March update from the Found team, including timely perspectives for modern marketing teams.',
    group: 'root',
  },
  {
    id: 'legacy-insights-march-update',
    path: '/insights-march-update/',
    title: 'Insights March Update',
    description: 'Read the March update from the Found team, including timely perspectives for modern marketing teams.',
    group: 'root',
  },
  {
    id: 'legacy-insights-authors',
    path: '/insights/authors/',
    title: 'Authors',
    description: 'Meet the people behind Found insights and explore their latest thinking on performance marketing.',
    group: 'authorIndex',
  },
  {
    id: 'legacy-man-vs-machine-smx-webinar',
    path: '/insights/man-vs-machine-smx-webinar/',
    title: 'Man vs Machine - SMX On-Demand Webinar',
    description: 'Watch the on-demand webinar on how marketers can balance automation, human strategy, and performance.',
    group: 'insights',
  },
  {
    id: 'legacy-modernize-your-data-architecture-webinar',
    path: '/insights/modernize-your-data-architecture-webinar/',
    title: 'Modernize Your Data Architecture - On-Demand Webinar',
    description: 'Watch the on-demand webinar on building a more durable marketing data architecture.',
    group: 'insights',
  },
  {
    id: 'legacy-modernize-your-data-architecture',
    path: '/insights/modernize-your-data-architecture/',
    title: 'Modernize Your Data Architecture',
    description: 'Learn how better marketing data architecture can improve measurement, activation, and decision-making.',
    group: 'insights',
  },
  {
    id: 'legacy-tools-and-guides',
    path: '/insights/toolsandguides/',
    title: 'Tools and Guides',
    description: 'Browse practical tools and guides from Found for paid media, analytics, and data activation teams.',
    group: 'insights',
  },
  {
    id: 'legacy-webinar',
    path: '/insights/webinar/',
    title: 'Watch the Webinar',
    description: 'Access webinar content from Found covering marketing data, paid media, analytics, and performance strategy.',
    group: 'insights',
  },
  {
    id: 'legacy-webinars',
    path: '/insights/webinars/',
    title: 'Webinars',
    description: 'Browse Found webinars and on-demand sessions for performance marketers and data-driven teams.',
    group: 'insights',
  },
  {
    id: 'legacy-website-cookies-explained-webinar',
    path: '/insights/website-cookies-explained-on-demand-webinar/',
    title: 'Website Cookies Explained - On-Demand Webinar',
    description: 'Watch the on-demand session explaining website cookies, tracking changes, and marketing measurement impact.',
    group: 'insights',
  },
  {
    id: 'legacy-insights-whitepapers',
    path: '/insights/whitepapers/',
    title: 'White Papers',
    description: 'Browse Found white papers and long-form resources for marketing analytics, data, and paid media strategy.',
    group: 'insights',
  },
  {
    id: 'legacy-safelist',
    path: '/safelist/',
    title: 'Safelist',
    description: 'Find sender and domain details that help your team receive important communication from Found.',
    group: 'root',
  },
  {
    id: 'legacy-signal-quiz',
    path: '/signal-quiz/',
    title: 'Signal Quiz',
    description: 'Assess how much signal loss may be hiding in your marketing measurement and activation workflows.',
    group: 'root',
  },
  {
    id: 'legacy-thank-you',
    path: '/thank-you/',
    title: 'Thank You',
    description: 'Thanks for connecting with Found. Our team will follow up with you soon.',
    group: 'root',
  },
  {
    id: 'legacy-whitepapers',
    path: '/whitepapers/',
    title: 'Whitepapers',
    description: 'Browse Found whitepapers and resources for marketers working across paid media, analytics, and data strategy.',
    group: 'whitepapers',
  },
  {
    id: 'legacy-first-party-data-whitepaper',
    path: '/whitepapers/first-party-data/',
    title: 'Why First-Party Data Is Your Most Valuable Profit Lever',
    description: 'Learn why first-party data is one of the most durable assets for better marketing performance and measurement.',
    group: 'whitepapers',
  },
];

export const legacyAuthorDefinitions: LegacyAuthorDefinition[] = [
  { slug: 'adam', name: 'Adam' },
  { slug: 'caroline', name: 'Caroline' },
  { slug: 'emily', name: 'Emily' },
  { slug: 'julie', name: 'Julie' },
  { slug: 'kelley', name: 'Kelley' },
  { slug: 'kelsey', name: 'Kelsey' },
  { slug: 'kylie', name: 'Kylie' },
  { slug: 'maria', name: 'Maria' },
  { slug: 'matt', name: 'Matt' },
  { slug: 'nicholas', name: 'Nicholas' },
  { slug: 'ryan', name: 'Ryan' },
];

export const legacyPagePathOptions = legacyPageDefinitions.map((page) => ({
  title: `${page.title} (${page.path})`,
  value: page.path,
}));

export const defaultLegacyPageTemplates = legacyPageDefinitions.map((definition) => ({
  id: definition.id,
  title: definition.title,
  value: buildDefaultLegacyPageData(definition),
}));

export function getLegacyPageDefinitionsByGroup(group: LegacyPageGroup): LegacyPageDefinition[] {
  return legacyPageDefinitions.filter((definition) => definition.group === group);
}

export function getLegacyPageDefinitionByPath(path: string): LegacyPageDefinition | undefined {
  const normalized = normalizeLegacyPath(path);
  return legacyPageDefinitions.find((definition) => definition.path === normalized);
}

export function pathToSingleSlug(path: string): string {
  return normalizeLegacyPath(path).replace(/^\/|\/$/g, '').split('/').pop() || '';
}

export function normalizeLegacyPath(path: string): string {
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function mergeLegacyPageData(definition: LegacyPageDefinition, incoming?: Partial<LegacyPageData> | null): LegacyPageData {
  const fallback = buildDefaultLegacyPageData(definition);
  if (!incoming) return fallback;

  return {
    ...fallback,
    ...incoming,
    title: incoming.title || fallback.title,
    path: incoming.path || fallback.path,
    seoTitle: incoming.seoTitle || fallback.seoTitle,
    seoDescription: incoming.seoDescription || fallback.seoDescription,
    canonicalUrl: incoming.canonicalUrl || fallback.canonicalUrl,
    robots: incoming.robots || fallback.robots,
    hero: {
      ...fallback.hero,
      ...(incoming.hero || {}),
      heading: incoming.hero?.heading || fallback.hero.heading,
    },
    body: hasBlocks(incoming.body) ? incoming.body as SimplePortableTextBlock[] : fallback.body,
    cards: incoming.cards || fallback.cards,
    cta: mergeObject(fallback.cta, incoming.cta),
    form: mergeObject(fallback.form, incoming.form),
  };
}

export function mergeLegacyAuthors(incoming: LegacyAuthorData[] = []): LegacyAuthorData[] {
  const bySlug = new Map<string, LegacyAuthorData>();

  for (const author of incoming) {
    if (!author.slug) continue;
    bySlug.set(author.slug, author);
  }

  const knownAuthors = legacyAuthorDefinitions.map((definition) => ({
    slug: definition.slug,
    name: bySlug.get(definition.slug)?.name || definition.name,
    ...bySlug.get(definition.slug),
  }));

  const knownSlugs = new Set(legacyAuthorDefinitions.map((definition) => definition.slug));
  const extraAuthors = incoming.filter((author) => author.slug && !knownSlugs.has(author.slug));

  return [...knownAuthors, ...extraAuthors].sort((a, b) => a.name.localeCompare(b.name));
}

export function slugifyAuthorName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildDefaultLegacyPageData(definition: LegacyPageDefinition): LegacyPageData {
  if (definition.id === 'legacy-dataconnect') {
    const summary = "We're ready to learn more about your business goals and talk about all the ways we can work together to find solutions that drive impact and lead to profitable revenue. Whether it's smarter paid media strategy, creative that converts, or finding clarity in your data, we're ready to sit on the same side of the table and get to work.";

    return {
      title: definition.title,
      path: definition.path,
      seoTitle: 'Data Connect - Found Search Marketing',
      seoDescription: summary,
      canonicalUrl: 'https://foundsm.com/dataconnect/',
      robots: 'index, follow',
      hero: {
        eyebrow: 'Ready to stop guessing and start scaling?',
        heading: 'Activating First-Party Data for Revenue.',
        subheading: "Let's talk about bringing your first-party data directly to the ad platforms where growth happens.",
      },
      body: [block(summary)],
      form: {
        hubspotFormId: '77ee07f7-2567-46d2-9255-ff9e410fdf6a',
      },
    };
  }

  const canonicalPath = definition.path === '/' ? '' : definition.path.replace(/\/$/, '');

  return {
    title: definition.title,
    path: definition.path,
    seoTitle: `${definition.title} | Found Search Marketing`,
    seoDescription: definition.description,
    canonicalUrl: `https://www.foundsm.com${canonicalPath}`,
    robots: 'index, follow',
    hero: {
      eyebrow: eyebrowForGroup(definition.group),
      heading: definition.title,
      subheading: definition.description,
    },
    body: [block(definition.description)],
    cta: {
      heading: 'Ready to improve your marketing performance?',
      body: [block('Found helps teams connect data, media, and creative decisions to measurable business outcomes.')],
      label: 'Start the Conversation',
      href: '/contact-us',
    },
  };
}

function eyebrowForGroup(group: LegacyPageGroup): string {
  if (group === 'insights') return 'Insights';
  if (group === 'authorIndex') return 'Insights';
  if (group === 'whitepapers') return 'Resources';
  return 'Found Search Marketing';
}

function hasBlocks(blocks: unknown): blocks is SimplePortableTextBlock[] {
  return Array.isArray(blocks) && blocks.some((item) => item?._type === 'block');
}

function mergeObject<T extends object>(fallback: T | undefined, incoming: T | undefined): T | undefined {
  if (!fallback && !incoming) return undefined;
  return { ...(fallback || {}), ...(incoming || {}) } as T;
}
