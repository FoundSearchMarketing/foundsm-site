type Span = {
  _type: 'span';
  text: string;
  marks?: string[];
};

export type PortableTextBlock = {
  _type: 'block';
  style?: 'normal';
  children?: Span[];
  markDefs?: Array<{ _key: string; _type: 'link'; href?: string }>;
};

type Metric = {
  eyebrow?: string;
  prefix?: string;
  value?: number;
  suffix?: string;
  label?: string;
};

type Logo = {
  src?: string;
  alt?: string;
};

type Cta = {
  ctaText?: string;
  ctaUrl?: string;
};

export type HomePageData = {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaJson?: string;
  hero: {
    headlineLines: string[];
    subheadline?: string;
    searchPrompts: string[];
  };
  intro: {
    heading?: string;
    body?: PortableTextBlock[];
    image?: string;
    imageAlt?: string;
  };
  ctaStrip: Cta & {
    headline?: string;
  };
  clientLogos: {
    heading?: string;
    logos: Logo[];
  };
  outcomes: Cta & {
    image?: string;
    imageAlt?: string;
    heading?: string;
    body?: PortableTextBlock[];
  };
  metrics: {
    spend: Metric;
    leads: Metric;
    experience: Metric;
    employees: Metric;
    testimonial: {
      quote?: string;
      authorName?: string;
      authorTitle?: string;
      authorCompany?: string;
      authorImage?: string;
      authorImageAlt?: string;
    };
    ownershipCard: Cta & {
      heading?: string;
    };
    image?: string;
    imageAlt?: string;
  };
  partners: Cta & {
    heading?: string;
    body?: PortableTextBlock[];
    logos: Logo[];
  };
  ecosystem: {
    headingLines: string[];
    introBody?: PortableTextBlock[];
    tabListHeading?: string;
    tabs: Array<Cta & {
      id?: string;
      title?: string;
      icon?: string;
      body?: PortableTextBlock[];
      image?: string;
      imageAlt?: string;
    }>;
  };
};

const span = (text: string, marks?: string[]): Span => ({
  _type: 'span',
  text,
  ...(marks ? { marks } : {}),
});

export const block = (children: Span[] | string): PortableTextBlock => ({
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: typeof children === 'string' ? [span(children)] : children,
});

export const defaultHomePageData: HomePageData = {
  seoTitle: 'Found Search Marketing | An Enterprise Paid Media Agency',
  seoDescription:
    'Trusted by leading brands, Found Search Marketing is an enterprise paid media agency delivering clarity, efficiency, and performance through advanced data-driven solutions.',
  canonicalUrl: 'https://foundsm.com/',
  hero: {
    headlineLines: ['Drive Profitable Growth.', 'Get Found.'],
    subheadline: 'Combining the power of advanced data engineering with paid media expertise.',
    searchPrompts: [
      'What does AI mean for performance media?',
      'What are industry benchmarks for CVR, CPL, close rates etc?',
      'How to overcome AI Overviews and keep traffic high via SERPs',
      'Should we use Target CPA or Target ROAS and what are the trade-offs?',
      'How do we get more leads this month?',
    ],
  },
  intro: {
    heading: 'A Seamless Extension of Your Team',
    body: [
      block("Unusually great performance takes a different kind of agency. One that's highly collaborative with a deep understanding of your business goals. One relentlessly focused on solving problems with forward-thinking, custom solutions. One that always prioritizes outcomes above hours."),
      block([
        span('Found Search Marketing is that partner.', ['strong']),
        span(" We're experts at fitting into your internal workflows, bringing clarity, and optimizing your resources for stronger leads, better conversion rates, and smarter spend. Unlike traditional agencies, we are a data engineering firm that activates paid media strategies, not the other way around."),
      ]),
    ],
    imageAlt: 'Found Search Marketing team collaboration',
  },
  ctaStrip: {
    headline: "If you want to scale your paid media performance with strategic intention, let's talk.",
    ctaText: "Let's Find A Solution",
    ctaUrl: '/contact-us/',
  },
  clientLogos: {
    heading: 'Trusted by Leading Brands',
    logos: [
      { alt: 'Bar Keepers Friend' },
      { alt: 'Accu-Chek' },
      { alt: 'ADT' },
      { alt: 'Bastian Solutions' },
      { alt: 'Indiana Wesleyan University' },
      { alt: 'Hendricks' },
      { alt: 'Indiana University Kelley School of Business' },
      { alt: 'Lawn Pride' },
      { alt: 'Indy Ignite' },
      { alt: 'Farm Bureau Insurance' },
      { alt: 'Roche' },
      { alt: 'Duke Corporate Education' },
      { alt: 'Cook Medical' },
      { alt: 'Mr. Quik' },
      { alt: 'BNE' },
      { alt: 'Client logo' },
    ],
  },
  outcomes: {
    imageAlt: 'Performance marketing outcomes visualization',
    heading: 'Focused On Outcomes',
    body: [
      block("At Found, we integrate advanced data engineering and strategic paid media expertise to drive customer acquisitions at scale. By combining first-party data, automation, audience and media mix modeling, and adaptive creative, we create a self-reinforcing optimization cycle that's always finding new ways to boost your results. And we collaborate with you, sharing our expertise on the same side of the table, to target your audiences more effectively, place ads more efficiently, and improve without wasting budget."),
    ],
    ctaText: 'Explore Our Capabilities',
    ctaUrl: '/capabilities/',
  },
  metrics: {
    spend: {
      eyebrow: 'Paid Media Spend',
      prefix: '$',
      value: 210,
      suffix: 'M',
      label: 'Managed in 2025',
    },
    leads: {
      eyebrow: 'Leads Generated',
      value: 1,
      suffix: 'M+',
      label: 'in 2025',
    },
    experience: {
      value: 20,
      suffix: '+',
      label: 'Years Performance Marketing Experience',
    },
    employees: {
      value: 50,
      suffix: '+',
      label: 'Full-Time Employees Across 12 States',
    },
    testimonial: {
      quote:
        'It is rare to find an external partner as good as Found. They have excelled in quality of work, responsiveness and professional presence.',
      authorName: 'Marcus Dennis',
      authorTitle: 'Sr. International Marketing Manager of Global Marketing',
      authorCompany: 'Roche',
      authorImageAlt: 'Marcus Dennis',
    },
    ownershipCard: {
      heading: 'Independently Owned, Certified Women-Owned Business',
      ctaText: 'About Us',
      ctaUrl: '/about-us/',
    },
    imageAlt: 'Target graphic',
  },
  partners: {
    heading: 'Top-Tier Partnerships',
    body: [
      block("We're only as good as our partnerships, which is why we work together with industry-leading organizations in paid media and marketing analytics."),
    ],
    logos: [
      { alt: 'Google Partner' },
      { alt: 'Google Marketing Platform' },
      { alt: 'Google Cloud Partner' },
      { alt: 'Microsoft Advertising Premier Elite Partner 2026' },
      { alt: 'Meta Business Partner' },
    ],
    ctaText: 'Learn More About Our Partnerships',
    ctaUrl: '/our-approach/#partnerships',
  },
  ecosystem: {
    headingLines: ['Data Powered,', 'Paid Media System'],
    introBody: [
      block("Getting the most out of your paid media investment means we are working together to understand your business objectives and customers, and taking a holistic view of everything that's part of your performance lead generation ecosystem. Our team blends advanced data integration with paid media expertise to create lead engines that deliver predictable, scalable customer acquisition."),
    ],
    tabListHeading: 'We handle your entire performance lead generation ecosystem, including:',
    tabs: [
      {
        id: 'data',
        title: 'Data, Reporting, & Analytics',
        body: [
          block("What's your CPL? Are you using first-party data to inform your campaigns? Do you have a clear line of sight from dollars spent to results? We turn your first party data into powerful audience models and unified insights - then activate it through precision paid media that converts."),
        ],
        ctaText: 'See How We Leverage Data',
        ctaUrl: '/capabilities/data-intelligence/',
        imageAlt: 'Data, Reporting, & Analytics',
      },
      {
        id: 'media',
        title: 'Paid Media',
        body: [
          block('We apply a custom media mix framework, rooted in data modeling and precision bidding, to architect high-performing paid media strategies that drive more qualified leads for your business, and maximize profitability.'),
        ],
        ctaText: 'Get Better Leads',
        ctaUrl: '/capabilities/paid-media/',
        imageAlt: 'Paid Media',
      },
      {
        id: 'creative',
        title: 'Performance Creative & CRO',
        body: [
          block('To us, performance means generating high-quality leads that drive customer growth. We distill and clarify your messaging, take a UI/UX-focused approach to design, and complement it with engaging content that drives action. This includes conversion rate optimization (CRO) and other multivariate testing strategies to identify the highest level of performance from click to conversion to customer.'),
        ],
        ctaText: 'Explore Our Creativity',
        ctaUrl: '/capabilities/performance-creative/',
        imageAlt: 'Performance Creative & CRO',
      },
    ],
  },
};

const keep = <T>(value: T | undefined | null, fallback: T): T => value ?? fallback;

const mergeObject = <T extends Record<string, any>>(fallback: T, value?: Partial<T> | null): T => ({
  ...fallback,
  ...(value || {}),
});

const mergeList = <T extends Record<string, any>>(fallback: T[], value?: Partial<T>[] | null): T[] => {
  if (!Array.isArray(value)) return fallback;
  return value.map((item, index) => mergeObject(fallback[index] || ({} as T), item));
};

export function mergeHomePageData(value?: Partial<HomePageData> | null): HomePageData {
  const page = value || {};
  const defaults = defaultHomePageData;

  return {
    ...defaults,
    ...page,
    hero: {
      ...defaults.hero,
      ...(page.hero || {}),
      headlineLines: Array.isArray(page.hero?.headlineLines) ? page.hero.headlineLines : defaults.hero.headlineLines,
      searchPrompts: Array.isArray(page.hero?.searchPrompts) ? page.hero.searchPrompts : defaults.hero.searchPrompts,
    },
    intro: {
      ...defaults.intro,
      ...(page.intro || {}),
      body: keep(page.intro?.body, defaults.intro.body),
      image: keep(page.intro?.image, defaults.intro.image),
    },
    ctaStrip: mergeObject(defaults.ctaStrip, page.ctaStrip),
    clientLogos: {
      ...defaults.clientLogos,
      ...(page.clientLogos || {}),
      logos: mergeList(defaults.clientLogos.logos, page.clientLogos?.logos),
    },
    outcomes: {
      ...defaults.outcomes,
      ...(page.outcomes || {}),
      body: keep(page.outcomes?.body, defaults.outcomes.body),
      image: keep(page.outcomes?.image, defaults.outcomes.image),
    },
    metrics: {
      ...defaults.metrics,
      ...(page.metrics || {}),
      spend: mergeObject(defaults.metrics.spend, page.metrics?.spend),
      leads: mergeObject(defaults.metrics.leads, page.metrics?.leads),
      experience: mergeObject(defaults.metrics.experience, page.metrics?.experience),
      employees: mergeObject(defaults.metrics.employees, page.metrics?.employees),
      testimonial: {
        ...defaults.metrics.testimonial,
        ...(page.metrics?.testimonial || {}),
        authorImage: keep(page.metrics?.testimonial?.authorImage, defaults.metrics.testimonial.authorImage),
      },
      ownershipCard: mergeObject(defaults.metrics.ownershipCard, page.metrics?.ownershipCard),
      image: keep(page.metrics?.image, defaults.metrics.image),
    },
    partners: {
      ...defaults.partners,
      ...(page.partners || {}),
      body: keep(page.partners?.body, defaults.partners.body),
      logos: mergeList(defaults.partners.logos, page.partners?.logos),
    },
    ecosystem: {
      ...defaults.ecosystem,
      ...(page.ecosystem || {}),
      headingLines: Array.isArray(page.ecosystem?.headingLines) ? page.ecosystem.headingLines : defaults.ecosystem.headingLines,
      introBody: keep(page.ecosystem?.introBody, defaults.ecosystem.introBody),
      tabs: mergeList(defaults.ecosystem.tabs, page.ecosystem?.tabs),
    },
  };
}
