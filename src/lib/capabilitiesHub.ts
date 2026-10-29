/*
  View model for the capabilities hub. Copy stays on the capabilitiesPage
  document (Sanity over the code defaults). This module only decides which
  fields the hub renders, and keeps retired routes off the page.
*/
import {
  defaultCapabilitiesPageData,
  type CapabilitiesPageData,
} from './fixedPageData';

export { defaultCapabilitiesPageData, defaultCapabilityDetailPages, mergeCapabilitiesPageData } from './fixedPageData';
import type { SimplePortableTextBlock } from './simplePortableTextCore';

const LONG_INTRO_PREFIX = 'We build smart, custom systems for performance marketing';
const RETIRED_AI_HREF = /^\/capabilities\/ai-automation\/?$/;

const CARD_SLOTS = [
  { id: 'paid', anchor: 'capabilities-paid-media', href: '/capabilities/paid-media/' },
  { id: 'activation', anchor: 'capabilities-data-activation', href: '/capabilities/data-activation/' },
  { id: 'data', anchor: 'capabilities-data-reporting-analytics', href: '/capabilities/data-analytics/' },
  { id: 'creative', anchor: 'capabilities-performance-creative', href: '/capabilities/performance-creative/' },
] as const;

export type PracticeCardModel = {
  id: string;
  anchor: string;
  heading: string;
  lead: string;
  /** Full practice body from the hub document, or the code default when Sanity has none. */
  body: SimplePortableTextBlock[];
  label: string;
  href: string;
  image?: CapabilitiesPageData['details'][number]['image'];
  imageAlt: string;
};

const textOf = (block?: SimplePortableTextBlock) =>
  (block?.children || []).map((child) => child.text || '').join('').trim();

/** Homepage headings end with a period. Add one when an older string omitted it. */
export function withTerminalPeriod(value?: string) {
  const trimmed = (value || '').trim();
  if (!trimmed || /[.!?]$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
}

/** The hub shows one supporting line. The long opening paragraph stays in the data and is not rendered. */
export function outcomeIntroBlocks(page: CapabilitiesPageData): SimplePortableTextBlock[] {
  const blocks = (page.outcomes.body || []).filter((item) => item?._type === 'block');
  const supporting = blocks.filter((item) => {
    const text = textOf(item);
    return Boolean(text) && !text.startsWith(LONG_INTRO_PREFIX);
  });
  if (supporting.length > 0) return [supporting[0]];
  const fallback = (defaultCapabilitiesPageData.outcomes.body || []).find((item) => {
    const text = textOf(item);
    return Boolean(text) && !text.startsWith(LONG_INTRO_PREFIX);
  });
  return fallback ? [fallback] : [];
}

export function outcomesHeading(page: CapabilitiesPageData) {
  return withTerminalPeriod(page.outcomes.heading);
}

function cardHref(href: string | undefined, fallback: string) {
  const value = href?.trim() || '';
  if (!value || /dataconnect/i.test(value)) return fallback;
  // The published data card still points at the old path, which only redirects.
  if (value.replace(/\/$/, '') === '/capabilities/data-intelligence') return '/capabilities/data-analytics/';
  return value;
}

/** Four hub cards in the approved order. Missing document entries fall back to the code defaults. */
export function practiceCards(page: CapabilitiesPageData): PracticeCardModel[] {
  const byId = new Map(page.details.filter((detail) => detail.id).map((detail) => [detail.id as string, detail]));
  const defaults = new Map(defaultCapabilitiesPageData.details.filter((detail) => detail.id).map((detail) => [detail.id as string, detail]));
  return CARD_SLOTS.map((slot) => {
    const detail = byId.get(slot.id) || defaults.get(slot.id);
    const fallback = defaults.get(slot.id);
    const body = detail?.body?.length ? detail.body : fallback?.body || [];
    return {
      id: slot.id,
      anchor: slot.anchor,
      heading: detail?.heading || fallback?.heading || '',
      lead: detail?.lead?.trim() || fallback?.lead || '',
      body,
      label: detail?.cta?.label?.trim() || fallback?.cta?.label || '',
      href: cardHref(detail?.cta?.href, slot.href),
      image: detail?.image ?? fallback?.image,
      imageAlt: detail?.imageAlt || fallback?.imageAlt || '',
    };
  });
}

/** `/capabilities/ai-automation/` was a code default and is not a real route. */
export function aiHref(href?: string) {
  const value = href?.trim() || '';
  if (!value || RETIRED_AI_HREF.test(value)) return '/ai/';
  return value;
}

export function aiSection(page: CapabilitiesPageData) {
  const detail = page.details.find((item) => item.id === 'ai') || defaultCapabilitiesPageData.details.find((item) => item.id === 'ai');
  return {
    anchor: 'capabilities-ai',
    heading: withTerminalPeriod(detail?.heading),
    body: detail?.body || [],
    label: detail?.cta?.label?.trim() || 'Explore AI & Automation',
    href: aiHref(detail?.cta?.href),
    image: detail?.image,
    imageAlt: detail?.imageAlt || 'Circuit board with the Found magnifier mark',
  };
}
