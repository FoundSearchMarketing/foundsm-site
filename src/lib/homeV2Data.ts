/*
  Content for the homepage built on the October 2026 review decisions.

  The copy lives here (not in Sanity yet) so the page can ship to staging
  without a schema change. Logos, the testimonial, the headline numbers and
  the team image still come from the existing `homePage` document, so the
  pieces editors already maintain keep working. Moving the rest of this copy
  into Sanity is a follow-up once the structure settles.
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

export const homeV2Content = {
  hero: {
    eyebrow: 'Your Agency of Results',
    headlineLines: ['We build', 'data-engineered', 'media systems.'],
    body:
      'FoundSM is a data engineering firm for paid media. We connect your signals, model the demand, activate the media and measure what moved. Accountable through proof, not hours.',
    cta: { label: 'Talk with us', href: '#home2-talk' },
    /** "The Found Loop" site cut (silent, seamless loop). Empty strings fall back to the placeholder panel. */
    videoUrl: 'https://cdn.sanity.io/files/vzneqxsx/staging/ce90c38a8670ddc1da91443d36eac6e77df41b2a.mp4',
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
    ] satisfies HomeV2Practice[],
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
    ] satisfies HomeV2Stage[],
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
    ] satisfies HomeV2Column[],
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
    ] satisfies HomeV2Column[],
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
      ] satisfies HomeV2Signal[],
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
    ] satisfies HomeV2Column[],
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

/** "$210M", "1M+", "20+" from the Sanity metric parts. */
export function formatMetric(metric: Metric): string {
  const value = metric.value ?? '';
  return `${metric.prefix || ''}${value}${metric.suffix || ''}`;
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
