/*
  View model for the shared capabilities child template.
  Practice names, hrefs and descriptions are the Expertise menu in Header.astro.
  The allowlist is the only page that renders through the template.
*/

export const CAPABILITY_CHILD_PATHS = ['capabilities/paid-media/paid-search'] as const;

export const SEE_WHAT_WE_RUN = 'See what we run';
export const RELATED_HEADING = 'Related capabilities';
export const PRACTICE_OVERVIEW = 'Practice overview';
export const EXPLORE_LABEL = 'Explore';
export const TALK_EYEBROW = 'Talk with us';
export const RUN_ANCHOR = 'what-we-run';

export type CapabilityLink = {
  label: string;
  href: string;
};

export type CapabilityPractice = {
  label: string;
  href: string;
  description: string;
  children: CapabilityLink[];
};

export const capabilityPractices: CapabilityPractice[] = [
  {
    label: 'Paid Media',
    href: '/capabilities/paid-media/',
    description: 'Search, social, display, and programmatic engineered as one system.',
    children: [
      { label: 'Paid Search', href: '/capabilities/paid-media/paid-search/' },
      { label: 'Paid Social', href: '/capabilities/paid-media/paid-social/' },
      { label: 'Programmatic & Display', href: '/capabilities/paid-media/programmatic/' },
      { label: 'Competitive Intelligence', href: '/capabilities/paid-media/competitive-intelligence/' },
    ],
  },
  {
    label: 'Data Activation',
    href: '/capabilities/data-activation/',
    description: 'Your first-party data, connected to the platforms where growth happens.',
    children: [
      { label: 'Server-Side Tracking', href: '/capabilities/data-activation/server-side-tracking/' },
      { label: 'Call Tracking & Call-to-Revenue', href: '/capabilities/data-activation/call-tracking/' },
      { label: 'First-Party Data & CRM Integration', href: '/capabilities/data-activation/first-party-data/' },
      { label: 'Privacy, Security & Governance', href: '/capabilities/data-activation/privacy-governance/' },
    ],
  },
  {
    label: 'Data & Analytics',
    href: '/capabilities/data-analytics/',
    description: 'Unified data so marketing decisions are clearer, faster, and measurable.',
    children: [
      { label: 'Discovery, Audit & Analysis', href: '/capabilities/data-analytics/discovery-audit/' },
      { label: 'Attribution & Measurement', href: '/capabilities/data-analytics/attribution/' },
      { label: 'Audience Modeling', href: '/capabilities/data-analytics/audience-modeling/' },
      { label: 'Customized Reporting', href: '/capabilities/data-analytics/reporting/' },
    ],
  },
  {
    label: 'Performance Creative',
    href: '/capabilities/performance-creative/',
    description: 'Fast-track creative paired with data-backed testing and CRO.',
    children: [
      { label: 'Landing Page Design', href: '/capabilities/performance-creative/landing-pages/' },
      { label: 'CRO & Conversion Optimization', href: '/capabilities/performance-creative/cro/' },
      { label: 'Ad Creative & Motion Graphics', href: '/capabilities/performance-creative/ad-creative/' },
    ],
  },
];

/* Approved partnership rail. Notes are the cadence already in the Paid Search paragraph. */
export const partnerBadges = [
  {
    label: 'Google Partner',
    note: 'Weekly call with named reps',
    src: '/images/pages/capabilities/badge-google-partner.png',
    alt: 'Google Partner',
    width: 820,
    height: 798,
  },
  {
    label: 'Microsoft Advertising Elite Partner',
    note: 'Call every other week with named reps',
    src: '/images/pages/our-approach/microsoft-badge-2026.svg',
    alt: 'Microsoft Advertising Elite Partner',
    width: 293,
    height: 285,
  },
] as const;

const SHOWN_SECTION_TYPES = new Set([
  'modernHeroBlock',
  'statementBandBlock',
  'accordionBlock',
  'splitFeatureBlock',
  'cardGridBlock',
  'modernCtaBlock',
]);

export type CapabilityCrumb = {
  label: string;
  href?: string;
};

export type CapabilitySiblingCard = {
  kind: 'sibling';
  label: string;
  href: string;
  slug: string;
  linkLabel: string;
};

export type CapabilityParentCard = {
  kind: 'parent';
  kicker: string;
  label: string;
  href: string;
  description: string;
  linkLabel: string;
};

export type CapabilityRelatedCard = CapabilitySiblingCard | CapabilityParentCard;

export type CapabilityPlace = {
  kind: 'grandchild' | 'child';
  eyebrow: string;
  crumbs: CapabilityCrumb[];
  related: {
    eyebrow: string;
    title: string;
    back: CapabilityLink;
    cards: CapabilityRelatedCard[];
  };
};

export function normalizeCapabilityPath(path: string | string[] | undefined) {
  const value = Array.isArray(path) ? path.join('/') : String(path || '');
  return value.replace(/^\/+|\/+$/g, '');
}

export function usesCapabilityChildTemplate(path: string | string[] | undefined) {
  const slug = normalizeCapabilityPath(path);
  return (CAPABILITY_CHILD_PATHS as readonly string[]).includes(slug);
}

function slugFromHref(href: string) {
  return normalizeCapabilityPath(href);
}

function practiceFor(slug: string) {
  return capabilityPractices.find((practice) => {
    const practiceSlug = slugFromHref(practice.href);
    return slug === practiceSlug || slug.startsWith(`${practiceSlug}/`);
  });
}

function siblingCard(link: CapabilityLink): CapabilitySiblingCard {
  return {
    kind: 'sibling',
    label: link.label,
    href: link.href,
    slug: slugFromHref(link.href),
    linkLabel: EXPLORE_LABEL,
  };
}

function parentCard(practice: CapabilityPractice): CapabilityParentCard {
  return {
    kind: 'parent',
    kicker: PRACTICE_OVERVIEW,
    label: practice.label,
    href: practice.href,
    description: practice.description,
    linkLabel: `All of ${practice.label}`,
  };
}

/**
 * Grandchild: Capabilities / practice / page.
 * Child: Capabilities / practice, with its sub-pages as the related cards.
 */
export function capabilityPlace(path: string | string[] | undefined, pageTitle = ''): CapabilityPlace {
  const slug = normalizeCapabilityPath(path);
  const practice = practiceFor(slug);
  const title = pageTitle.trim();

  if (practice && slug !== slugFromHref(practice.href)) {
    const page = practice.children.find((child) => slugFromHref(child.href) === slug);
    const pageLabel = page?.label || title;
    const siblings = practice.children.filter((child) => slugFromHref(child.href) !== slug);
    return {
      kind: 'grandchild',
      eyebrow: `${practice.label} · ${pageLabel}`,
      crumbs: [
        { label: 'Capabilities', href: '/capabilities/' },
        { label: practice.label, href: practice.href },
        { label: pageLabel },
      ],
      related: {
        eyebrow: `More in ${practice.label}`,
        title: RELATED_HEADING,
        back: { label: `Back to ${practice.label}`, href: practice.href },
        cards: [...siblings.map(siblingCard), parentCard(practice)],
      },
    };
  }

  if (practice) {
    return {
      kind: 'child',
      eyebrow: `Capabilities · ${practice.label}`,
      crumbs: [
        { label: 'Capabilities', href: '/capabilities/' },
        { label: practice.label },
      ],
      related: {
        eyebrow: 'More in Capabilities',
        title: RELATED_HEADING,
        back: { label: 'Back to Capabilities', href: '/capabilities/' },
        cards: practice.children.map(siblingCard),
      },
    };
  }

  return {
    kind: 'child',
    eyebrow: title ? `Capabilities · ${title}` : 'Capabilities',
    crumbs: [
      { label: 'Capabilities', href: '/capabilities/' },
      ...(title ? [{ label: title }] : []),
    ],
    related: {
      eyebrow: 'More in Capabilities',
      title: RELATED_HEADING,
      back: { label: 'Back to Capabilities', href: '/capabilities/' },
      cards: [],
    },
  };
}

type SectionLike = { _type?: string };

export function groupCapabilitySections<T extends SectionLike>(sections: T[] = []) {
  const list = sections.filter((section) => section && section._type);
  const first = (type: string) => list.find((section) => section._type === type);
  return {
    hero: first('modernHeroBlock'),
    band: first('statementBandBlock'),
    run: first('accordionBlock'),
    partners: first('splitFeatureBlock'),
    grids: list.filter((section) => section._type === 'cardGridBlock'),
    cta: first('modernCtaBlock'),
    skipped: list.filter((section) => !SHOWN_SECTION_TYPES.has(section._type || '')).map((section) => section._type || ''),
  };
}
