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
const PLAYBOOK_PREFIX = 'Every engagement starts with a custom playbook';
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

/**
 * The one-line lead is already shown above the body. Drop a first block that
 * is only that sentence, or cut it off the start of the first block. Later
 * sentences stay word for word.
 */
export function bodyWithoutRepeatedLead(lead: string, blocks: SimplePortableTextBlock[] = []): SimplePortableTextBlock[] {
  const leadText = lead.trim();
  const usable = blocks.filter((item) => item?._type === 'block');
  if (!leadText || usable.length === 0) return usable;
  const [first, ...rest] = usable;
  const firstText = textOf(first);
  if (firstText === leadText) return rest;
  if (!firstText.startsWith(leadText)) return usable;

  let remaining = leadText.length;
  const children = (first.children || []).map((child) => ({ ...child, text: child.text || '' }));
  for (const child of children) {
    if (remaining <= 0) break;
    if (child.text.length <= remaining) {
      remaining -= child.text.length;
      child.text = '';
    } else {
      child.text = child.text.slice(remaining);
      remaining = 0;
    }
  }
  const withText = children.filter((child) => child.text);
  if (withText[0]) withText[0].text = withText[0].text.replace(/^[\s\n]+/, '');
  const stripped = { ...first, children: withText.filter((child) => child.text) };
  return textOf(stripped) ? [stripped, ...rest] : rest;
}

/** Homepage headings end with a period. Add one when an older string omitted it. */
export function withTerminalPeriod(value?: string) {
  const trimmed = (value || '').trim();
  if (!trimmed || /[.!?]$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
}

/** Supporting copy under the outcomes heading. The long opening paragraph stays in the data and is not rendered. */
export function outcomeIntroBlocks(page: CapabilitiesPageData): SimplePortableTextBlock[] {
  const blocks = (page.outcomes.body || []).filter((item) => item?._type === 'block');
  const supporting = blocks.filter((item) => {
    const text = textOf(item);
    return Boolean(text) && !text.startsWith(LONG_INTRO_PREFIX);
  });
  const defaults = (defaultCapabilitiesPageData.outcomes.body || []).filter((item) => {
    const text = textOf(item);
    return Boolean(text) && !text.startsWith(LONG_INTRO_PREFIX);
  });
  const shown = supporting.length > 0 ? supporting : defaults;
  if (shown.some((item) => textOf(item).startsWith(PLAYBOOK_PREFIX))) return shown;
  const playbook = defaults.find((item) => textOf(item).startsWith(PLAYBOOK_PREFIX));
  if (!playbook) return shown;
  if (shown.length === 0) return [playbook];
  return [shown[0], playbook, ...shown.slice(1)];
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
    const lead = detail?.lead?.trim() || fallback?.lead || '';
    const sourceBody = detail?.body?.length ? detail.body : fallback?.body || [];
    return {
      id: slot.id,
      anchor: slot.anchor,
      heading: detail?.heading || fallback?.heading || '',
      lead,
      body: bodyWithoutRepeatedLead(lead, sourceBody),
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
