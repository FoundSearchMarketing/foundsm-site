/*
  Content and merge logic for the AI hub page (/ai/).

  `defaultAiPageData` is the code default for every section; the Sanity
  `aiPage` singleton carries the same shape (studio/schemas/aiPage.ts,
  seeded by scripts/seed-ai-page.mjs). `mergeAiPageData` lays the document
  over the defaults field by field, so a blank field in the Studio never
  blanks the page. No Sanity client imports here, so Node can bundle it for
  the seed script and the tests.
*/

import { block, type EditableImage, type SimplePortableTextBlock } from './simplePortableTextCore';

type Blocks = SimplePortableTextBlock[];

export type AiCta = { label?: string; href?: string };
export type AiItem = { title?: string; body?: string; cta?: AiCta };

export type AiPageData = {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robots?: string;
  hero: { eyebrow?: string; heading?: string; body?: Blocks; cta?: AiCta; image?: EditableImage; imageAlt?: string };
  callout: { lead?: string; body?: Blocks; cta?: AiCta };
  systems: { eyebrow?: string; heading?: string; intro?: string; items: AiItem[] };
  process: { eyebrow?: string; heading?: string; steps: AiItem[] };
  paidMedia: {
    eyebrow?: string;
    heading?: string;
    body?: Blocks;
    cta?: AiCta;
    secondaryCta?: AiCta;
    image?: EditableImage;
    imageAlt?: string;
  };
  closing: { heading?: string; body?: string; cta?: AiCta; secondaryCta?: AiCta };
};

export const defaultAiPageData: AiPageData = {
  seoTitle: 'AI at FoundSM | Applied AI Systems for the Whole Business',
  seoDescription:
    'FoundSM tests the major AI models on real work and builds AI systems for operations, finance, people, reporting and paid media, each on the right model for the job.',
  canonicalUrl: 'https://foundsm.com/ai/',
  robots: 'index, follow',
  hero: {
    eyebrow: 'AI at FoundSM',
    heading: 'AI systems for the whole business.',
    body: [
      block(
        'FoundSM is a leading agency in applied AI. We test the major models on real work, choose the right one for each job, and build systems that run inside your operations, finance, people and marketing workflows, not just your ad accounts.',
      ),
    ],
    cta: { label: 'Talk about an AI build', href: '/contact-us/' },
    image: '/images/pages/data-intelligence/ai-chip-sm.webp',
    imageAlt: 'Circuit board with an AI chip at its center',
  },
  callout: {
    lead: "We test the models so you don't have to.",
    body: [
      block(
        'New models ship every few weeks, and each one is better at some jobs than others. We run them side by side on real work: which reasons best over messy data, which writes in your voice, which is fast and cheap enough to run on every record. Every system we build sits on the model that fits its job, and moves when a better one earns it.',
      ),
    ],
    cta: { label: "Read what we're finding", href: '/insights/' },
  },
  systems: {
    eyebrow: 'Where we build',
    heading: 'AI systems, well past the ad account.',
    intro: 'Most of the work that slows a business down never touches an ad platform. These are the places we build.',
    items: [
      {
        title: 'Operations',
        body: 'Intake, routing, scheduling and status updates automated end to end, so requests move without anyone chasing them.',
      },
      {
        title: 'Accounting & finance',
        body: 'Reconciliation, reporting prep and month-end checks run on their own, with the exceptions flagged for a person to decide.',
      },
      {
        title: 'HR & people',
        body: 'Onboarding, training records, reviews and policy questions handled inside the tools your team already uses.',
      },
      {
        title: 'Reporting & data',
        body: 'Numbers from every system you run pulled into one place, refreshed on schedule and explained in plain language.',
      },
      {
        title: 'Content & documents',
        body: 'Briefs, decks, proposals and on-brand drafts built from your templates and your data, ready for a human edit.',
      },
      {
        title: 'Paid media',
        body: 'Platform AI kept on guardrails, plus daily account checks that catch a problem while it is still small.',
        cta: { label: 'AI in paid media', href: '/capabilities/ai-automation/' },
      },
    ],
  },
  process: {
    eyebrow: 'How a build works',
    heading: 'From a named problem to a system that runs.',
    steps: [
      { title: 'Name the job', body: 'Start with the work that eats hours or hides the answer, described by the people who do it.' },
      {
        title: 'Test the models',
        body: 'Run the candidates against your real data and keep the one that is accurate, fast and affordable at your volume.',
      },
      { title: 'Build it in', body: 'Ship it where your team already works, with a person approving the decisions that matter.' },
      { title: 'Keep it current', body: 'Re-run the tests as new models arrive, and switch when the numbers say so.' },
    ],
  },
  paidMedia: {
    eyebrow: 'AI in paid media',
    heading: 'Where we started, and where the stakes are highest.',
    body: [
      block(
        'Paid media is where we first put AI to work, and it is still where a bad model costs real money fastest. Every model we let near a budget learns from data we engineered first, and answers to the same verification as everything else on the account.',
      ),
    ],
    cta: { label: 'Explore AI & Automation', href: '/capabilities/ai-automation/' },
    secondaryCta: { label: 'See our paid media expertise', href: '/capabilities/' },
    image: '/images/pages/paid-media/tab-art-bid.webp',
    imageAlt: 'Circuit board with the Found magnifier mark',
  },
  closing: {
    heading: 'What would you automate first?',
    body: "Bring the process that eats the most hours. We'll tell you straight whether it's an AI job, which model we'd use, and what it would take to build.",
    cta: { label: 'Talk about an AI build', href: '/contact-us/' },
    secondaryCta: { label: 'See the build library', href: '/resources/tools/custom-builds/' },
  },
};

/* ---------------------------------------------------------------- merge */

type Doc = {
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
  hero?: Partial<Record<keyof AiPageData['hero'], unknown>> | null;
  callout?: Partial<Record<keyof AiPageData['callout'], unknown>> | null;
  systems?: { eyebrow?: string | null; heading?: string | null; intro?: string | null; items?: unknown[] | null } | null;
  process?: { eyebrow?: string | null; heading?: string | null; steps?: unknown[] | null } | null;
  paidMedia?: Partial<Record<keyof AiPageData['paidMedia'], unknown>> | null;
  closing?: Partial<Record<keyof AiPageData['closing'], unknown>> | null;
};

const text = (value: unknown, fallback: string | undefined): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

const blocks = (value: unknown, fallback: Blocks | undefined): Blocks | undefined =>
  Array.isArray(value) && value.length > 0 ? (value as Blocks) : fallback;

const cta = (value: unknown, fallback: AiCta | undefined): AiCta | undefined => {
  const link = value as AiCta | null | undefined;
  return link && typeof link.label === 'string' && link.label.trim() && typeof link.href === 'string' && link.href.trim()
    ? { label: link.label.trim(), href: link.href.trim() }
    : fallback;
};

/** A Sanity image field counts only when it carries an asset; otherwise the default image stays. */
const image = (value: unknown, fallback: EditableImage | undefined): EditableImage | undefined => {
  const field = value as { asset?: { _ref?: string; url?: string } } | null | undefined;
  return field && field.asset && (field.asset._ref || field.asset.url) ? field : fallback;
};

function items(value: unknown, fallback: AiItem[]): AiItem[] {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  return value.map((raw, index) => {
    const item = (raw || {}) as Record<string, unknown>;
    const base = fallback[index] || {};
    return {
      title: text(item.title, base.title),
      body: text(item.body, base.body),
      cta: cta(item.cta, base.cta),
    };
  });
}

/** Sanity `aiPage` document over the code defaults, field by field. */
export function mergeAiPageData(doc: Doc | null | undefined): AiPageData {
  const d = defaultAiPageData;
  const page = doc || {};
  const hero = page.hero || {};
  const callout = page.callout || {};
  const systems = page.systems || {};
  const process = page.process || {};
  const paidMedia = page.paidMedia || {};
  const closing = page.closing || {};

  return {
    seoTitle: text(page.seoTitle, d.seoTitle),
    seoDescription: text(page.seoDescription, d.seoDescription),
    canonicalUrl: text(page.canonicalUrl, d.canonicalUrl),
    robots: text(page.robots, d.robots),
    hero: {
      eyebrow: text(hero.eyebrow, d.hero.eyebrow),
      heading: text(hero.heading, d.hero.heading),
      body: blocks(hero.body, d.hero.body),
      cta: cta(hero.cta, d.hero.cta),
      image: image(hero.image, d.hero.image),
      imageAlt: text(hero.imageAlt, d.hero.imageAlt),
    },
    callout: {
      lead: text(callout.lead, d.callout.lead),
      body: blocks(callout.body, d.callout.body),
      cta: cta(callout.cta, d.callout.cta),
    },
    systems: {
      eyebrow: text(systems.eyebrow, d.systems.eyebrow),
      heading: text(systems.heading, d.systems.heading),
      intro: text(systems.intro, d.systems.intro),
      items: items(systems.items, d.systems.items),
    },
    process: {
      eyebrow: text(process.eyebrow, d.process.eyebrow),
      heading: text(process.heading, d.process.heading),
      steps: items(process.steps, d.process.steps),
    },
    paidMedia: {
      eyebrow: text(paidMedia.eyebrow, d.paidMedia.eyebrow),
      heading: text(paidMedia.heading, d.paidMedia.heading),
      body: blocks(paidMedia.body, d.paidMedia.body),
      cta: cta(paidMedia.cta, d.paidMedia.cta),
      secondaryCta: cta(paidMedia.secondaryCta, d.paidMedia.secondaryCta),
      image: image(paidMedia.image, d.paidMedia.image),
      imageAlt: text(paidMedia.imageAlt, d.paidMedia.imageAlt),
    },
    closing: {
      heading: text(closing.heading, d.closing.heading),
      body: text(closing.body, d.closing.body),
      cta: cta(closing.cta, d.closing.cta),
      secondaryCta: cta(closing.secondaryCta, d.closing.secondaryCta),
    },
  };
}
