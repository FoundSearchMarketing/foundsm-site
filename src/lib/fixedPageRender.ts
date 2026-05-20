import type { CapabilityDetailPageData } from './fixedPageData';
import { imageUrl, portableTextToPlainText, renderSimplePortableText } from './simplePortableText';

type CardList = NonNullable<CapabilityDetailPageData['primaryCards']>['cards'];
type LogoList = NonNullable<CapabilityDetailPageData['logoMarquee']>['logos'];
type TabList = NonNullable<CapabilityDetailPageData['featureTabs']>['tabs'];

export const richHtml = renderSimplePortableText;
export const richText = portableTextToPlainText;
const toImageUrl = (source: unknown) => imageUrl(source as Parameters<typeof imageUrl>[0]);
export const srcFor = toImageUrl;

export function imageProps(
  item?: { image?: any; imageAlt?: string; videoUrl?: string; videoPoster?: any },
  loading: 'eager' | 'lazy' = 'lazy',
) {
  const imageSrc = toImageUrl(item?.image);
  const videoSrc = typeof item?.videoUrl === 'string' ? item.videoUrl.trim() : '';
  const src = videoSrc || imageSrc;
  const poster = videoSrc ? toImageUrl(item?.videoPoster) || imageSrc : undefined;
  return src ? { src, alt: item?.imageAlt || '', loading, poster } : undefined;
}

export function cardsFor(cards: CardList = []) {
  return cards.map((card) => ({
    title: card.title || '',
    lead: card.lead,
    body: portableTextToPlainText(card.body),
    bodyHtml: renderSimplePortableText(card.body),
    icon: toImageUrl(card.icon),
    image: typeof (card as any).videoUrl === 'string' && (card as any).videoUrl.trim()
      ? (card as any).videoUrl.trim()
      : toImageUrl(card.image),
    imageAlt: card.imageAlt,
    imagePoster: typeof (card as any).videoUrl === 'string' ? toImageUrl((card as any).videoPoster) || toImageUrl(card.image) : undefined,
  }));
}

export function tabsFor(tabs: TabList = []) {
  return tabs.map((tab) => ({
    title: tab.title || '',
    body: portableTextToPlainText(tab.body),
    bodyHtml: renderSimplePortableText(tab.body),
    icon: toImageUrl(tab.icon),
    image: typeof (tab as any).videoUrl === 'string' && (tab as any).videoUrl.trim()
      ? (tab as any).videoUrl.trim()
      : toImageUrl(tab.image),
    imageAlt: tab.imageAlt,
    imagePoster: typeof (tab as any).videoUrl === 'string' ? toImageUrl((tab as any).videoPoster) || toImageUrl(tab.image) : undefined,
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
