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
  title?: string;
  team?: string;
  foundStartDate?: string;
  expertise?: string;
  bio?: string;
  image?: string;
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
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaJson?: string;
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
  team?: string;
  foundStartDate?: string;
  expertise?: string;
  bio?: string;
  linkedin?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaJson?: string;
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
  {
    slug: 'julie',
    name: 'Julie Warnecke',
    title: 'CEO',
    team: 'Executive Leadership',
    foundStartDate: '2006',
    expertise: 'Measurement Strategy, Operational Excellence, Strategic Growth',
    bio: 'Julie Warnecke is the Founder and CEO of Found Search Marketing, a Midwest firm managing over $200M in annual media spend. An early Google employee instrumental in launching AdWords, she established Found in 2006. Today, she leads a team of 50+ that serves as a seamless extension of client teams.',
    image: 'https://foundsm.com/found2025/wp-content/uploads/2025/11/Julie_W_1800-1.webp?ver=1773664202',
  },
  {
    slug: 'kelley',
    name: 'Kelley Swart',
    title: 'VP, Strategy & Growth',
    team: 'Executive Leadership',
    foundStartDate: '2014',
    expertise: 'Client Alignment, Growth Architecture, Scalable Systems',
    bio: "Kelley, Found's VP of Strategy & Growth, brings 25+ years of experience, starting at Google Ads. She has led strategic planning for Fortune 1000 clients like Home Depot and Staples across CPG, Retail, and Higher Ed. Her focus is on strategic oversight and building strong relationships that exceed client goals.",
    image: 'https://foundsm.com/found2025/wp-content/uploads/2025/11/Julie_W_1800-1-6.webp?ver=1773663606',
  },
  {
    slug: 'nicholas',
    name: 'Nicholas Hoium',
    title: 'Head of Data Engineering',
    team: 'Innovation',
    foundStartDate: '2010',
    expertise: 'Google Cloud Certified Data Engineer',
    bio: 'With over 15 years of experience, Head of Data Engineering Nicholas Hoium builds advanced pipelines and web analytics solutions. The IU Bloomington graduate and Google Cloud Certified Engineer transforms raw information into accessible intelligence. Off the clock, Nicholas enjoys indie games, traveling, and watching soccer.',
    image: 'https://foundsm.com/found2025/wp-content/uploads/2026/03/Nicholas-FoundSM.webp',
  },
  {
    slug: 'ryan',
    name: 'Ryan Eme',
    title: 'Head of Data Intelligence',
    team: 'Innovation',
    foundStartDate: '2014',
    expertise: 'Audience Intelligence, Data Strategy, Attribution Modeling',
    bio: 'Ryan Eme is the Head of Data Intelligence at Found, bringing 20 years of experience in data-driven marketing. A Certified Google Cloud Data Engineer, he helps clients in higher ed and healthcare unlock business growth. Known for his innovative problem-solving, Ryan is so effective that clients frequently ask to clone him.',
    image: 'https://foundsm.com/found2025/wp-content/uploads/2025/11/Julie_W_1800-1-12.webp?ver=1773664036',
  },
  {
    slug: 'adam',
    name: 'Adam Persinger',
    title: 'Head of Strategic Media',
    team: 'Innovation',
    foundStartDate: '2016',
    expertise: 'Strategic Media, Performance Forecasting, Channel Strategy',
    bio: 'Adam joined Found Search Marketing in 2016, leveraging his media strategy background to drive client results through research and testing. A Brown University graduate in Cognitive Neuroscience and Economics, he began his career with the Indianapolis Colts. Outside the office, Adam stays active through CrossFit, backpacking, and various team sports.',
    image: 'https://foundsm.com/found2025/wp-content/uploads/2026/03/Adam-P-main.webp',
  },
  {
    slug: 'caroline',
    name: 'Caroline Stoner',
    title: 'Head of User Experience',
    team: 'Innovation',
    foundStartDate: '2017',
    expertise: 'User Experience & Strategy, CRO, Unbounce Expert',
    bio: 'As one of only 10 Unbounce Experts worldwide, Caroline specializes in creating high-performing landing pages and optimizing conversion rates. Her background spans CRO, web design, and SEO, with a focus on higher education. When not driving client results, Caroline enjoys gardening, cozy video games, and exploring the city with her family.',
    image: 'https://foundsm.com/found2025/wp-content/uploads/2025/11/Julie_W_1800-1-4.webp?ver=1773663451',
  },
  {
    slug: 'kylie',
    name: 'Kylie Colquitt',
    title: 'Group Account Director',
    team: 'Client Partnership',
    foundStartDate: '2017',
    expertise: 'Client Services',
    bio: 'As Group Account Director, Kylie leverages 15+ years of experience to orchestrate cross-channel strategies that drive client growth. Having supported brands like General Motors at top Chicago agencies, she brings calm, collaborative leadership to her team. Outside work, Kylie enjoys life with her daughter and dog.',
    image: 'https://foundsm.com/found2025/wp-content/uploads/2026/03/Kylie-FoundSM.webp',
  },
  {
    slug: 'matt',
    name: 'Matt Dragoo',
    title: 'Senior Data Analyst',
    team: 'Client Partnership',
    foundStartDate: '2019',
    expertise: 'Reporting, Analysis, Paid Media Management',
    bio: 'Since joining Found in 2019, Purdue graduate Matt crafts data-driven paid media strategies. Certified across multiple platforms, he leverages his expertise in B2B and Higher Education to maximize client ROI. Known for predicting problems, Matt spends his free time gaming, cooking, and exploring Indianapolis.',
    image: 'https://foundsm.com/found2025/wp-content/uploads/2026/02/Matt_author_profile.webp',
  },
  {
    slug: 'emily',
    name: 'Emily Williams-Hempstead',
    title: 'Strategist',
    team: 'Client Partnership',
    foundStartDate: '2020',
    expertise: 'Communication, collaboration & problem solving',
    bio: 'Strategist Emily Williams-Hempstead untangles complex challenges by applying her Indiana State Psychology and Marketing background to understand human behavior. Her knack for organizing chaos drives clear results for many clients at Found. Away from the agency, she enjoys traveling, hosting game nights, and relaxing with her two dogs.',
    image: 'https://foundsm.com/found2025/wp-content/uploads/2026/03/Emily_author_profile.webp',
  },
  {
    slug: 'maria',
    name: 'Maria Escobedo',
    title: 'Associate Data Analyst',
    team: 'Client Partnership',
    foundStartDate: '2022',
    expertise: 'Data Analysis',
    bio: 'Maria leverages her Purdue MS in Business Analytics to transform complex datasets into actionable, strategic insights. With over three years at Found, this Google-certified expert effectively bridges technical analysis with business goals. Outside work, Maria enjoys teaching spin classes, cooking, and reading.',
    image: 'https://foundsm.com/found2025/wp-content/uploads/2026/03/Maria-FoundSM.webp',
  },
  {
    slug: 'kelsey',
    name: 'Kelsey Connor',
    title: 'Director, Marketing & Brand Strategy',
    team: 'Agency Operations',
    foundStartDate: '2025',
    expertise: 'Marketing, Brand & Positioning',
    bio: 'Kelsey brings nearly 20 years of expertise as Director of Agency Marketing and Brand Strategy. She fosters seamless client-agency collaboration to drive results through authentic leadership. A proud Hoosier with an MBA, Kelsey serves the community as REV Committee Chair and enjoys flipping houses and cheering on her family.',
    image: 'https://foundsm.com/found2025/wp-content/uploads/2025/11/Julie_W_1800-1-7.webp?ver=1773663677',
  },
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
    ogTitle: incoming.ogTitle || fallback.ogTitle,
    ogDescription: incoming.ogDescription || fallback.ogDescription,
    ogImage: incoming.ogImage || fallback.ogImage,
    twitterCard: incoming.twitterCard || fallback.twitterCard,
    twitterTitle: incoming.twitterTitle || fallback.twitterTitle,
    twitterDescription: incoming.twitterDescription || fallback.twitterDescription,
    twitterImage: incoming.twitterImage || fallback.twitterImage,
    schemaJson: incoming.schemaJson || fallback.schemaJson,
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

  const knownAuthors = legacyAuthorDefinitions.map((definition) => mergeLegacyAuthor(definition, bySlug.get(definition.slug)));

  const knownSlugs = new Set(legacyAuthorDefinitions.map((definition) => definition.slug));
  const extraAuthors = incoming.filter((author) => author.slug && !knownSlugs.has(author.slug));

  return [...knownAuthors, ...extraAuthors.sort((a, b) => a.name.localeCompare(b.name))];
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

  const canonicalPath = definition.path === '/' ? '/' : definition.path;

  return {
    title: definition.title,
    path: definition.path,
    seoTitle: `${definition.title} | Found Search Marketing`,
    seoDescription: definition.description,
    canonicalUrl: `https://foundsm.com${canonicalPath === '/' ? '/' : canonicalPath}`,
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

function mergeLegacyAuthor(definition: LegacyAuthorDefinition, incoming?: LegacyAuthorData): LegacyAuthorData {
  return {
    _id: incoming?._id,
    slug: definition.slug,
    name: definition.name || incoming?.name || definition.slug,
    title: definition.title || incoming?.title,
    team: definition.team || incoming?.team,
    foundStartDate: definition.foundStartDate || incoming?.foundStartDate,
    expertise: definition.expertise || incoming?.expertise,
    bio: definition.bio || incoming?.bio,
    linkedin: incoming?.linkedin,
    image: definition.image || incoming?.image,
    seoTitle: incoming?.seoTitle,
    seoDescription: incoming?.seoDescription,
    canonicalUrl: incoming?.canonicalUrl,
    robots: incoming?.robots,
    ogTitle: incoming?.ogTitle,
    ogDescription: incoming?.ogDescription,
    ogImage: incoming?.ogImage,
    twitterCard: incoming?.twitterCard,
    twitterTitle: incoming?.twitterTitle,
    twitterDescription: incoming?.twitterDescription,
    twitterImage: incoming?.twitterImage,
    schemaJson: incoming?.schemaJson,
  };
}
