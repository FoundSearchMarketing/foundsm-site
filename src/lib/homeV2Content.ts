/*
  Content and merge logic for the homepage built on the October 2026
  review decisions.

  `homeV2Content` is the code default for every section. The Sanity
  `homePage` document carries the same sections (see studio/schemas/homePage.ts
  and scripts/seed-home-v2.mjs); `mergeHomeV2Content` lays the document over
  the defaults field by field, so an empty field in Sanity never blanks the
  page. Logos, the testimonial, the headline numbers and the team image come
  from the document's existing fields.

  This module stays free of Sanity client imports so the seed script and the
  tests can bundle it for Node; image URL building is injected.
*/

import type { HomePageData } from './homePageData';

export type HomeV2Link = { label: string; href: string };

export type HomeV2Image = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** object-position for the cover crop in the practice cards. */
  position?: string;
};

export type HomeV2Practice = {
  title: string;
  body: string;
  cta: HomeV2Link;
  image: HomeV2Image;
};

export type HomeV2Stage = { number: string; title: string; body: string };

export type HomeV2Column = { title: string; body: string };

export type HomeV2Signal = {
  label: string;
  title: string;
  href: string;
};

export type HomeV2Logo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type HomeV2Content = {
  hero: {
    eyebrow: string;
    headlineLines: string[];
    body: string;
    cta: HomeV2Link;
    videoUrl: string;
    videoPoster: string;
    videoLabel: string;
    placeholderLabel: string;
    placeholderNote: string;
  };
  proof: { spendLabel: string; leadsLabel: string; experienceLabel: string };
  practices: { eyebrow: string; heading: string; intro: string; items: HomeV2Practice[] };
  loop: { eyebrow: string; heading: string; intro: string; stages: HomeV2Stage[]; strapline: string };
  ai: { eyebrow: string; heading: string; intro: string; columns: HomeV2Column[] };
  work: {
    logosHeading: string;
    eyebrow: string;
    heading: string;
    body: string;
    cta: HomeV2Link;
    chart: { eyebrow: string; key: string; startLabel: string; endLabel: string };
  };
  engage: {
    eyebrow: string;
    heading: string;
    intro: string;
    tiles: HomeV2Column[];
    outro: string;
    cta: HomeV2Link;
    existing: { eyebrow: string; heading: string; body: string; cta: HomeV2Link };
  };
  team: {
    eyebrow: string;
    heading: string;
    lead: string;
    body: string;
    cta: HomeV2Link;
    imageUrl: string;
    imageAlt: string;
  };
  research: {
    eyebrow: string;
    brief: {
      heading: string;
      intro: string;
      issueLabel: string;
      title: string;
      dek: string;
      contentsHeading: string;
      contents: string[];
      cta: HomeV2Link;
      subscribeLabel: string;
      subscribeButton: string;
      subscribeSuccess: string;
      subscribeError: string;
      subscribeFallback: HomeV2Link;
    };
    signals: { heading: string; intro: string; allLink: HomeV2Link; drafts: HomeV2Signal[] };
  };
  recognition: { eyebrow: string; heading: string; intro: string; cards: HomeV2Column[] };
  talk: {
    eyebrow: string;
    heading: string;
    intro: string;
    fields: { name: string; email: string; notes: string };
    button: string;
    success: string;
    error: string;
    fallback: HomeV2Link;
  };
};

export const homeV2Content: HomeV2Content = {
  hero: {
    eyebrow: 'Your Agency of Results',
    headlineLines: ['We build', 'data-engineered', 'media systems.'],
    body:
      'FoundSM is a data engineering firm for paid media. We connect your signals, model the demand, activate the media and measure what moved. Accountable through proof, not hours.',
    cta: { label: 'Talk with us', href: '#home2-talk' },
    /** "The Found Loop" site cut (silent, seamless loop). Empty strings fall back to the placeholder panel. */
    videoUrl: 'https://cdn.sanity.io/files/vzneqxsx/staging/628ec3f19c7354550b871be98a529500452323dc.mp4',
    videoPoster: 'https://cdn.sanity.io/images/vzneqxsx/staging/01fc386acea94a35ca848c0be1da7633a0f85433-1280x720.jpg',
    videoLabel:
      'The Found Loop: connect every signal, model decisions before dollars, activate media on the model, measure the result, then run it again.',
    placeholderLabel: 'Video placeholder · 16:9',
    placeholderNote: 'Hero video in production.',
  },
  proof: {
    spendLabel: 'Paid media managed in 2025',
    leadsLabel: 'Leads generated in 2025',
    experienceLabel: 'Running enterprise paid media',
  },
  practices: {
    eyebrow: 'Practices',
    heading: 'Proof of capability.',
    intro:
      'Four practices, one team, all running inside the Loop. Each one is a place we have done the work and can show it.',
    items: [
      {
        title: 'Paid Media',
        body:
          'Search, social, display and programmatic engineered as one system, with platform AI tested on real accounts and judged on qualified outcomes.',
        cta: { label: 'Scale the media', href: '/capabilities/paid-media/' },
        image: {
          src: '/images/pages/paid-media/tab-art-bid.webp',
          alt: 'Circuit board with the Found magnifier mark',
          width: 850,
          height: 887,
          position: 'center',
        },
      },
      {
        title: 'Data Activation',
        body:
          'Your first-party data, connected to the platforms where growth happens and clean enough for their bidding models to learn from.',
        cta: { label: 'Connect the data', href: '/capabilities/data-activation/' },
        image: {
          src: '/images/pages/insights/dataengine-768x432.webp',
          alt: 'Data engine connected to platforms and devices',
          width: 768,
          height: 432,
          position: 'center',
        },
      },
      {
        title: 'Data & Analytics',
        body:
          'Unified data so decisions are clearer, faster and measurable, with automated reviews that flag changes before the monthly report.',
        cta: { label: 'Prove what moved', href: '/capabilities/data-analytics/' },
        image: {
          src: '/images/pages/home/attribution-touchpoints.jpg',
          alt: 'Attribution illustration showing one customer across five touchpoints',
          width: 900,
          height: 900,
          position: 'center 40%',
        },
      },
      {
        title: 'Performance Creative',
        body:
          'Fast-track creative paired with data-backed testing and CRO, classified and tested faster than people alone could manage.',
        cta: { label: 'Test the creative', href: '/capabilities/performance-creative/' },
        image: {
          src: '/images/pages/performance-creative/creative-sketch2.webp',
          alt: 'Brain illustration, creative on one side and analytical on the other',
          width: 535,
          height: 774,
          position: 'center 30%',
        },
      },
    ],
  },
  loop: {
    eyebrow: 'The Found Loop',
    heading: 'One system, running on every account.',
    intro:
      'Connect the signals, model the demand, activate the media, measure what moved. Then the loop runs again, and every pass makes the next one sharper.',
    stages: [
      {
        number: '01',
        title: 'Connect',
        body:
          'Server-side tracking, call tracking and first-party data wired into every platform you buy on, with automated checks that catch broken tracking early.',
      },
      {
        number: '02',
        title: 'Model',
        body:
          'Attribution, audience models and forecasting score the demand, then turn that data into clear decisions before a single dollar of budget moves.',
      },
      {
        number: '03',
        title: 'Activate',
        body:
          'Search, social, programmatic and creative deployed against the model, not platform defaults, with platform AI kept on guardrails until it proves itself.',
      },
      {
        number: '04',
        title: 'Measure',
        body:
          'Verification systems and reporting prove what moved and what did not, surface anomalies daily, then hand every answer back to Connect.',
      },
    ],
    strapline: 'AI runs the watching. People run the decisions.',
  },
  ai: {
    eyebrow: 'AI, inside the Loop',
    heading: "We build with AI. We don't hide behind it.",
    intro:
      'AI does the watching across every account we run: the checks, the classifications, the first draft of every review. People make the calls, and their names are on the work.',
    columns: [
      {
        title: 'Platform AI, steered',
        body:
          'AI Max, Performance Max and ChatGPT Ads run on real accounts with guardrails on your copy, your spend and your brand, and get judged on qualified outcomes, not cost per lead.',
      },
      {
        title: 'Systems we build',
        body:
          'Automated performance reviews, anomaly reporting, creative classification and keyword diagnosis, running daily so problems surface before the monthly report does.',
      },
      {
        title: 'The principle',
        body:
          'AI buys you more senior attention, not a smaller invoice from the same work done faster. What we automate, we automate so the people on your account can think.',
      },
    ],
  },
  work: {
    logosHeading: 'Trusted by leading brands',
    eyebrow: 'Work',
    heading: '46% higher ROAS in 60 days.',
    body:
      'Same budget, rebuilt account, verified from day one. The problem, what we changed and what improved, with the numbers attached. More case stories follow as they clear approval.',
    cta: { label: 'See the work', href: '/results/' },
    chart: {
      eyebrow: 'Return on ad spend',
      key: 'Each dot = 1% of day-0 ROAS',
      startLabel: 'Day 0',
      endLabel: 'Day 60',
    },
  },
  engage: {
    eyebrow: 'How we engage',
    heading: 'Start with the Found Deployment.',
    intro:
      'Most new engagements begin here: a time-boxed modernization of your paid media system, delivered by a dedicated Found team and left running on the Loop when they step back.',
    tiles: [
      { title: 'Signal infrastructure', body: 'Tracking, data and consent, rebuilt to a standard.' },
      { title: 'Account rebuild', body: 'Structure, bidding and creative aligned to the model.' },
      {
        title: 'Verification systems',
        body: 'Automated monitoring and reporting that prove what moved, from day one.',
      },
    ],
    outro:
      'What happens after the deployment is shaped in conversation, not on a pricing page: ongoing oversight, a handover to your team, or Found runs it.',
    cta: { label: 'Talk with us about a deployment', href: '#home2-talk' },
    existing: {
      eyebrow: 'Already with FoundSM?',
      heading: 'Continuity first, then the upgrade.',
      body: 'Your account keeps running while it moves onto the Loop. Nothing is rebuilt that is already working.',
      cta: { label: 'Ask about the upgrade path', href: '#home2-talk' },
    },
  },
  team: {
    eyebrow: "Who you'll work with",
    heading: 'A seamless extension of your team.',
    lead:
      'Unusually good performance takes a different kind of agency. One that is highly collaborative, with a deep understanding of your business goals. FoundSM is that partner: we fit into your internal workflows, bring clarity, and treat your budget as if it were our own.',
    body:
      'The people on your account are senior, named and reachable, backed by automation that does the watching. AI buys you more of their attention, not a smaller invoice, and they report on what moved, not on hours billed.',
    cta: { label: 'Meet the team', href: '/team/' },
    /** Falls back to the Sanity intro image (the lattice) when the team section has no image of its own. */
    imageUrl: '',
    imageAlt: 'One green strand woven through a white lattice',
  },
  research: {
    eyebrow: 'Research',
    brief: {
      heading: 'The Found Brief',
      intro:
        'The state of the state, once a month: what changed in paid media, data and AI, and what we are doing about it on real accounts.',
      issueLabel: 'Issue 01 · October 2026',
      title: 'The metric your budget runs on is lying to you.',
      dek:
        'Three tests this quarter moved cost per lead and business results in opposite directions. What that means for how you judge AI channels, and which stage of the Loop catches it.',
      contentsHeading: 'In this issue',
      contents: [
        'Cheaper leads, worse business: three tests, one lesson',
        'ChatGPT Ads after four weeks, and where it stalled',
        "The warning label that doesn't mean what it says",
        "Three prompts we're running on every account this month",
      ],
      cta: { label: 'Read the Brief', href: '/newsletter/' },
      subscribeLabel: 'Get the Brief in your inbox',
      subscribeButton: 'Subscribe',
      subscribeSuccess: "You're on the list. The first issue lands in October.",
      subscribeError: 'That did not go through.',
      subscribeFallback: { label: 'Subscribe on the newsletter page', href: '/newsletter/' },
    },
    signals: {
      heading: 'Found Signals',
      intro:
        'Short, frequent notes on what we are testing, what new models and tools actually produce, and what we find interesting.',
      allLink: { label: 'All Signals', href: '/insights/' },
      /** Shown until the first Signals are published in Sanity. */
      drafts: [
        {
          label: 'Draft · Paid search',
          title: 'AI Max rewrote the ad copy. Nobody got a notification.',
          href: '/insights/',
        },
        {
          label: 'Draft · Landing pages',
          title: 'We deleted the top of the page. Mobile conversions went up a third.',
          href: '/insights/',
        },
        {
          label: 'Draft · Brand safety',
          title: "Half your PMax budget runs where you can't see it. One setting takes it back.",
          href: '/insights/',
        },
      ],
    },
  },
  recognition: {
    eyebrow: 'Partnerships & recognition',
    heading: 'Certified by the platforms. Recognized at home.',
    intro:
      'Partner status with every platform we buy on, and the credentials buyers ask about before the first call.',
    cards: [
      { title: 'Microsoft Advertising', body: 'Partner of the Year finalist, 2026' },
      { title: 'Certification', body: 'Certified women-owned business' },
      { title: 'Indianapolis Business Journal', body: 'Top 25 agency list, three years running' },
    ],
  },
  talk: {
    eyebrow: 'Talk with us',
    heading: "Let's look at your account.",
    intro:
      'Thirty minutes with the people who would do the work. We will tell you what we see, whether or not it leads to a deployment.',
    fields: {
      name: 'Full name',
      email: 'Business email',
      notes: 'What should we look at first?',
    },
    button: 'Start the conversation',
    success: 'Thanks. Someone who would do the work will be in touch within one business day.',
    error: 'That did not go through.',
    fallback: { label: 'Use the contact page instead', href: '/contact-us/' },
  },
};

/*
  Form plumbing. Both forms post to the systems the rest of the site already
  uses, so submissions land where the team expects them.

  - Talk with us: the ActiveCampaign contact form (#8), the same one embedded
    on /contact-us/. These are the public values from its embed script.
  - The Brief: the HubSpot newsletter form behind /newsletter/, through the
    client-side submissions endpoint. Swap to an ActiveCampaign form once the
    newsletter list moves over.
*/
export const homeV2Forms = {
  contact: {
    action: 'https://foundsm.activehosted.com/proc.php',
    hidden: {
      u: '6AC6A7ECAD721',
      f: '8',
      s: '',
      c: '0',
      m: '0',
      act: 'sub',
      v: '2',
      or: '30d75a65-2290-4462-a1f2-7ce779f43d21',
    },
    messageField: 'field[17]',
  },
  brief: {
    portalId: '5045186',
    formId: 'f757bd34-b8c5-4f2a-a1ef-19c3a364683b',
  },
};

/** The one row of client logos Megan picked for the Work section, in order. */
export const approvedClientLogoOrder = [
  'bar keepers',
  'accu chek',
  'adt',
  'roche',
  'indiana wesleyan',
  'cook medical',
  'farm bureau',
  'duke',
];

const partnerLogoSizes: Array<{ match: string; width: number; height: number }> = [
  { match: 'google cloud partner', width: 226, height: 87 },
  { match: 'google marketing platform', width: 323, height: 90 },
  { match: 'google partner', width: 150, height: 150 },
  { match: 'microsoft', width: 184, height: 64 },
  { match: 'meta', width: 184, height: 76 },
];

const normalize = (value?: string) => (value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

type SanityLogo = { src?: string; alt?: string };

/** Picks the approved logos out of the Sanity list, in the approved order; falls back to the first eight. */
export function selectClientLogos(logos: SanityLogo[], order = approvedClientLogoOrder): HomeV2Logo[] {
  const usable = logos.filter((logo): logo is Required<SanityLogo> => Boolean(logo.src && logo.alt));
  const picked = order
    .map((match) => usable.find((logo) => normalize(logo.alt).includes(match)))
    .filter((logo): logo is Required<SanityLogo> => Boolean(logo));
  const chosen = picked.length >= 4 ? picked : usable.slice(0, 8);
  return chosen.map((logo) => ({ src: logo.src, alt: logo.alt, width: 500, height: 500 }));
}

export function selectPartnerLogos(logos: SanityLogo[]): HomeV2Logo[] {
  return logos
    .filter((logo): logo is Required<SanityLogo> => Boolean(logo.src && logo.alt))
    .map((logo) => {
      const size = partnerLogoSizes.find((item) => normalize(logo.alt).includes(item.match));
      return { src: logo.src, alt: logo.alt, width: size?.width || 184, height: size?.height || 80 };
    });
}

type Metric = HomePageData['metrics']['spend'];

/** "$210M", "1M+", "20+ years" from the Sanity metric parts. */
export function formatMetric(metric: Metric): string {
  const value = metric.value ?? '';
  return `${metric.prefix || ''}${value}${metric.suffix || ''}`;
}

/* ------------------------------------------------------------------------
   Sanity document → page content
   ------------------------------------------------------------------------ */

/** A Sanity image field as the GROQ query returns it (reference, hotspot, crop). */
export type SanityImageField = { asset?: { _ref?: string } | null; hotspot?: unknown; crop?: unknown } | null | undefined;

/** Builds a sized URL for a Sanity image field; returns undefined when the field is empty. */
export type ImageUrlBuilder = (image: SanityImageField, width: number, height: number) => string | undefined;

type Cta = { ctaText?: string | null; ctaUrl?: string | null };
type Head = { eyebrow?: string | null; heading?: string | null; intro?: string | null };
type Column = { title?: string | null; body?: string | null };

/** The homepage document fields the new page reads, as the GROQ query returns them. */
export type HomeV2SanityDoc = {
  hero?: {
    eyebrow?: string | null;
    headlineLines?: string[] | null;
    subheadline?: string | null;
    videoUrl?: string | null;
    videoPoster?: string | null;
    videoLabel?: string | null;
  } & Cta;
  clientLogos?: { heading?: string | null } | null;
  metrics?: {
    spend?: Metric | null;
    leads?: Metric | null;
    experience?: Metric | null;
  } | null;
  practices?: Head & { items?: Array<Column & Cta & { image?: SanityImageField; imageAlt?: string | null }> | null };
  loop?: Head & { stages?: Array<Column & { number?: string | null }> | null; strapline?: string | null };
  ai?: Head & { columns?: Column[] | null };
  work?: { eyebrow?: string | null; heading?: string | null; body?: string | null } & Cta;
  engage?: Head & {
    tiles?: Column[] | null;
    outro?: string | null;
    existing?: ({ eyebrow?: string | null; heading?: string | null; body?: string | null } & Cta) | null;
  } & Cta;
  team?: {
    eyebrow?: string | null;
    heading?: string | null;
    lead?: string | null;
    body?: string | null;
    image?: SanityImageField;
    imageAlt?: string | null;
  } & Cta;
  research?: {
    eyebrow?: string | null;
    brief?: ({
      heading?: string | null;
      intro?: string | null;
      issueLabel?: string | null;
      title?: string | null;
      dek?: string | null;
      contentsHeading?: string | null;
      contents?: string[] | null;
      subscribeLabel?: string | null;
      subscribeButton?: string | null;
      subscribeSuccess?: string | null;
      subscribeError?: string | null;
    } & Cta) | null;
    signals?: {
      heading?: string | null;
      intro?: string | null;
      allLinkText?: string | null;
      allLinkUrl?: string | null;
      drafts?: Array<{ label?: string | null; title?: string | null; url?: string | null }> | null;
    } | null;
  } | null;
  recognition?: Head & { cards?: Column[] | null };
  talk?: Head & {
    nameLabel?: string | null;
    emailLabel?: string | null;
    notesLabel?: string | null;
    button?: string | null;
    success?: string | null;
    error?: string | null;
  };
};

const text = (value: string | null | undefined, fallback: string): string => {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed ? value!.trim() : fallback;
};

const optionalText = (value: string | null | undefined, fallback: string): string =>
  typeof value === 'string' ? value.trim() : fallback;

const link = (cta: Cta | null | undefined, fallback: HomeV2Link): HomeV2Link => ({
  label: text(cta?.ctaText, fallback.label),
  href: text(cta?.ctaUrl, fallback.href),
});

const strings = (value: unknown, fallback: string[]): string[] => {
  const list = Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim() !== '') : [];
  return list.length > 0 ? list : fallback;
};

/** Uses the Sanity array when it has entries, filling each item from the default at the same index. */
function list<S, T>(value: S[] | null | undefined, fallback: T[], map: (item: S, fallbackItem: T | undefined, index: number) => T): T[] {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return value.map((item, index) => map(item, fallback[index], index));
}

const column = (item: Column, fallback: HomeV2Column | undefined): HomeV2Column => ({
  title: text(item.title, fallback?.title || ''),
  body: text(item.body, fallback?.body || ''),
});

/**
 * Lays the Sanity homepage document over the code defaults. Every field falls
 * back individually, so a half-filled section in the Studio still renders.
 */
export function mergeHomeV2Content(doc: HomeV2SanityDoc | null | undefined, imageUrl: ImageUrlBuilder = () => undefined): HomeV2Content {
  const d = homeV2Content;
  const page = doc || {};

  return {
    hero: {
      eyebrow: text(page.hero?.eyebrow, d.hero.eyebrow),
      headlineLines: strings(page.hero?.headlineLines, d.hero.headlineLines),
      body: text(page.hero?.subheadline, d.hero.body),
      cta: link(page.hero, d.hero.cta),
      videoUrl: text(page.hero?.videoUrl, d.hero.videoUrl),
      videoPoster: text(page.hero?.videoPoster, d.hero.videoPoster),
      videoLabel: text(page.hero?.videoLabel, d.hero.videoLabel),
      placeholderLabel: d.hero.placeholderLabel,
      placeholderNote: d.hero.placeholderNote,
    },
    proof: {
      spendLabel: text(page.metrics?.spend?.label, d.proof.spendLabel),
      leadsLabel: text(page.metrics?.leads?.label, d.proof.leadsLabel),
      experienceLabel: text(page.metrics?.experience?.label, d.proof.experienceLabel),
    },
    practices: {
      eyebrow: text(page.practices?.eyebrow, d.practices.eyebrow),
      heading: text(page.practices?.heading, d.practices.heading),
      intro: text(page.practices?.intro, d.practices.intro),
      items: list(page.practices?.items, d.practices.items, (item, fallback) => {
        const src = imageUrl(item.image, 760, 420);
        return {
          title: text(item.title, fallback?.title || ''),
          body: text(item.body, fallback?.body || ''),
          cta: link(item, fallback?.cta || { label: 'Learn more', href: '/capabilities/' }),
          image: src
            ? { src, alt: text(item.imageAlt, fallback?.image.alt || ''), width: 760, height: 420 }
            : fallback?.image || { src: '', alt: '', width: 760, height: 420 },
        };
      }),
    },
    loop: {
      eyebrow: text(page.loop?.eyebrow, d.loop.eyebrow),
      heading: text(page.loop?.heading, d.loop.heading),
      intro: text(page.loop?.intro, d.loop.intro),
      stages: list(page.loop?.stages, d.loop.stages, (item, fallback, index) => ({
        number: text(item.number, fallback?.number || String(index + 1).padStart(2, '0')),
        ...column(item, fallback),
      })),
      strapline: text(page.loop?.strapline, d.loop.strapline),
    },
    ai: {
      eyebrow: text(page.ai?.eyebrow, d.ai.eyebrow),
      heading: text(page.ai?.heading, d.ai.heading),
      intro: text(page.ai?.intro, d.ai.intro),
      columns: list(page.ai?.columns, d.ai.columns, column),
    },
    work: {
      logosHeading: text(page.clientLogos?.heading, d.work.logosHeading),
      eyebrow: text(page.work?.eyebrow, d.work.eyebrow),
      heading: text(page.work?.heading, d.work.heading),
      body: text(page.work?.body, d.work.body),
      cta: link(page.work, d.work.cta),
      chart: d.work.chart,
    },
    engage: {
      eyebrow: text(page.engage?.eyebrow, d.engage.eyebrow),
      heading: text(page.engage?.heading, d.engage.heading),
      intro: text(page.engage?.intro, d.engage.intro),
      tiles: list(page.engage?.tiles, d.engage.tiles, column),
      outro: text(page.engage?.outro, d.engage.outro),
      cta: link(page.engage, d.engage.cta),
      existing: {
        eyebrow: text(page.engage?.existing?.eyebrow, d.engage.existing.eyebrow),
        heading: text(page.engage?.existing?.heading, d.engage.existing.heading),
        body: text(page.engage?.existing?.body, d.engage.existing.body),
        cta: link(page.engage?.existing, d.engage.existing.cta),
      },
    },
    team: {
      eyebrow: text(page.team?.eyebrow, d.team.eyebrow),
      heading: text(page.team?.heading, d.team.heading),
      lead: text(page.team?.lead, d.team.lead),
      body: text(page.team?.body, d.team.body),
      cta: link(page.team, d.team.cta),
      imageUrl: imageUrl(page.team?.image, 742, 739) || d.team.imageUrl,
      imageAlt: text(page.team?.imageAlt, d.team.imageAlt),
    },
    research: {
      eyebrow: text(page.research?.eyebrow, d.research.eyebrow),
      brief: {
        heading: text(page.research?.brief?.heading, d.research.brief.heading),
        intro: text(page.research?.brief?.intro, d.research.brief.intro),
        issueLabel: text(page.research?.brief?.issueLabel, d.research.brief.issueLabel),
        title: text(page.research?.brief?.title, d.research.brief.title),
        dek: text(page.research?.brief?.dek, d.research.brief.dek),
        contentsHeading: text(page.research?.brief?.contentsHeading, d.research.brief.contentsHeading),
        contents: strings(page.research?.brief?.contents, d.research.brief.contents),
        cta: link(page.research?.brief, d.research.brief.cta),
        subscribeLabel: text(page.research?.brief?.subscribeLabel, d.research.brief.subscribeLabel),
        subscribeButton: text(page.research?.brief?.subscribeButton, d.research.brief.subscribeButton),
        subscribeSuccess: text(page.research?.brief?.subscribeSuccess, d.research.brief.subscribeSuccess),
        subscribeError: text(page.research?.brief?.subscribeError, d.research.brief.subscribeError),
        subscribeFallback: d.research.brief.subscribeFallback,
      },
      signals: {
        heading: text(page.research?.signals?.heading, d.research.signals.heading),
        intro: text(page.research?.signals?.intro, d.research.signals.intro),
        allLink: {
          label: text(page.research?.signals?.allLinkText, d.research.signals.allLink.label),
          href: text(page.research?.signals?.allLinkUrl, d.research.signals.allLink.href),
        },
        drafts: list(page.research?.signals?.drafts, d.research.signals.drafts, (item, fallback) => ({
          label: optionalText(item.label, fallback?.label || ''),
          title: text(item.title, fallback?.title || ''),
          href: text(item.url, fallback?.href || '/insights/'),
        })),
      },
    },
    recognition: {
      eyebrow: text(page.recognition?.eyebrow, d.recognition.eyebrow),
      heading: text(page.recognition?.heading, d.recognition.heading),
      intro: text(page.recognition?.intro, d.recognition.intro),
      cards: list(page.recognition?.cards, d.recognition.cards, column),
    },
    talk: {
      eyebrow: text(page.talk?.eyebrow, d.talk.eyebrow),
      heading: text(page.talk?.heading, d.talk.heading),
      intro: text(page.talk?.intro, d.talk.intro),
      fields: {
        name: text(page.talk?.nameLabel, d.talk.fields.name),
        email: text(page.talk?.emailLabel, d.talk.fields.email),
        notes: text(page.talk?.notesLabel, d.talk.fields.notes),
      },
      button: text(page.talk?.button, d.talk.button),
      success: text(page.talk?.success, d.talk.success),
      error: text(page.talk?.error, d.talk.error),
      fallback: d.talk.fallback,
    },
  };
}

/*
  Dot layout for the Work card's ROAS motion graphic. 100 dots are day-0 ROAS
  (each dot is 1%); day 60 is the same 100 plus 46 green dots pulled out of the
  noise. Built once at build time; the browser only runs the choreography.
  Same seeded generator as the standalone component, so the layout matches the
  approved mockup frame for frame.
*/
export type RoasDot = { className: string; style: string };

export function buildRoasDots(seed = 11): RoasDot[] {
  let a = seed;
  const rnd = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const P = 9.6;
  const D = 6.8;
  const X0 = 26;
  const X1 = 152;
  const ROW0 = 232;
  const LIFT = 4;
  const top = (row: number) => ROW0 - row * P - (row >= 10 ? LIFT : 0);

  const NX = 18;
  const NY = 12;
  const cw = 352 / NX;
  const ch = 188 / NY;
  type Cell = { x: number; y: number };
  const cells: Cell[] = [];
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      cells.push({
        x: 24 + (i + 0.5) * cw + (rnd() - 0.5) * cw * 0.85 - D / 2,
        y: 44 + (j + 0.5) * ch + (rnd() - 0.5) * ch * 0.85 - D / 2,
      });
    }
  }
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = cells[i];
    cells[i] = cells[j];
    cells[j] = t;
  }

  const zones = [
    [X0 - 8, 132, X0 + 101, 252],
    [X1 - 8, 84, X1 + 101, 252],
    [248, 86, 384, 146],
  ];
  const free = cells.filter(
    (q) => !zones.some((z) => q.x + D > z[0] && q.x < z[2] && q.y + D > z[1] && q.y < z[3]),
  );
  const C = free.slice(0, 46);
  const rest = cells.filter((q) => C.indexOf(q) < 0);
  const A = rest.slice(0, 100);
  const N = rest.slice(100);

  const out: RoasDot[] = [];
  const f = (n: number) => Math.round(n * 100) / 100;
  const dot = (kind: string, px: number, py: number, dx: number, dy: number, delay: number, wave?: number) => {
    out.push({
      className: `rx-dot rx-dot--${kind}`,
      style:
        `--x:${f(px)};--y:${f(py)};--dx:${f(dx)};--dy:${f(dy)};--d:${delay.toFixed(3)}s` +
        (wave ? `;--w:${wave.toFixed(3)}s` : ''),
    });
  };

  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10);
    const c = i % 10;
    const x = X0 + c * P;
    const y = top(r);
    dot('a', x, y, A[i].x - x, A[i].y - y, 0.25 + i * 0.009 + rnd() * 0.05);
  }
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10);
    const c = i % 10;
    dot('b', X1 + c * P, top(r), 0, 0, 1.95 + (9 - c) * 0.03);
  }
  for (let i = 0; i < 46; i++) {
    const r = 10 + Math.floor(i / 10);
    const c = i % 10;
    const x = X1 + c * P;
    const y = top(r);
    dot('c', x, y, C[i].x - x, C[i].y - y, 2.8 + i * 0.032, 4.98 + c * 0.035 + (r - 10) * 0.02);
  }
  N.forEach((n) => dot('n', n.x, n.y, 0, 0, 0.35 + rnd() * 1.25));

  return out;
}
