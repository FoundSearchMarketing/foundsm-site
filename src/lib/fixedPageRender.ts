import type { CapabilityDetailPageData } from './fixedPageData';
import { imageUrl, portableTextToPlainText, renderSimplePortableText } from './simplePortableText';

type CardList = NonNullable<CapabilityDetailPageData['primaryCards']>['cards'];
type LogoList = NonNullable<CapabilityDetailPageData['logoMarquee']>['logos'];
type TabList = NonNullable<CapabilityDetailPageData['featureTabs']>['tabs'];

export const richHtml = renderSimplePortableText;
export const richText = portableTextToPlainText;
const toImageUrl = (source: unknown) => imageUrl(source as Parameters<typeof imageUrl>[0]);
export const srcFor = toImageUrl;

export function imageProps(item?: { image?: any; imageAlt?: string }, loading: 'eager' | 'lazy' = 'lazy') {
  const src = toImageUrl(item?.image);
  return src ? { src, alt: item?.imageAlt || '', loading } : undefined;
}

export function cardsFor(cards: CardList = []) {
  return cards.map((card) => ({
    title: card.title || '',
    lead: card.lead,
    body: portableTextToPlainText(card.body),
    bodyHtml: renderSimplePortableText(card.body),
    icon: toImageUrl(card.icon),
    image: toImageUrl(card.image),
    imageAlt: card.imageAlt,
  }));
}

export function tabsFor(tabs: TabList = []) {
  return tabs.map((tab) => ({
    title: tab.title || '',
    body: portableTextToPlainText(tab.body),
    bodyHtml: renderSimplePortableText(tab.body),
    icon: toImageUrl(tab.icon),
    image: toImageUrl(tab.image),
    imageAlt: tab.imageAlt,
  }));
}

export function logosFor(logos: LogoList = []) {
  return logos
    .map((logo) => ({
      src: toImageUrl(logo.image),
      alt: logo.alt || '',
    }))
    .filter((logo): logo is { src: string; alt: string } => Boolean(logo.src));
}
