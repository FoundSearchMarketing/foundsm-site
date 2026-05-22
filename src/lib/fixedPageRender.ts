import type { CapabilityDetailPageData } from './fixedPageData';
import { imageUrl, portableTextToPlainText, renderSimplePortableText } from './simplePortableText';

type CardList = NonNullable<CapabilityDetailPageData['primaryCards']>['cards'];
type LogoList = NonNullable<CapabilityDetailPageData['logoMarquee']>['logos'];
type TabList = NonNullable<CapabilityDetailPageData['featureTabs']>['tabs'];

export const richHtml = renderSimplePortableText;
export const richText = portableTextToPlainText;
const toImageUrl = (source: unknown) => imageUrl(source as Parameters<typeof imageUrl>[0]);
const toVideoUrl = (item?: { videoUrl?: string; videoFile?: any }) => {
  const directUrl = typeof item?.videoUrl === 'string' ? item.videoUrl.trim() : '';
  const fileUrl = typeof item?.videoFile?.asset?.url === 'string' ? item.videoFile.asset.url.trim() : '';
  return fileUrl || directUrl;
};
export const srcFor = toImageUrl;

export function imageProps(
  item?: { image?: any; imageAlt?: string; videoFile?: any; videoUrl?: string },
  loading: 'eager' | 'lazy' = 'lazy',
) {
  const imageSrc = toImageUrl(item?.image);
  const videoSrc = toVideoUrl(item);
  const src = videoSrc || imageSrc;
  return src ? { src, alt: item?.imageAlt || '', loading } : undefined;
}

export function cardsFor(cards: CardList = []) {
  return cards.map((card) => {
    const videoSrc = toVideoUrl(card as any);
    const imageSrc = toImageUrl(card.image);
    return {
      title: card.title || '',
      lead: card.lead,
      body: portableTextToPlainText(card.body),
      bodyHtml: renderSimplePortableText(card.body),
      icon: toImageUrl(card.icon),
      image: videoSrc || imageSrc,
      imageAlt: card.imageAlt,
    };
  });
}

export function tabsFor(tabs: TabList = []) {
  return tabs.map((tab) => {
    const videoSrc = toVideoUrl(tab as any);
    const imageSrc = toImageUrl(tab.image);
    return {
      title: tab.title || '',
      body: portableTextToPlainText(tab.body),
      bodyHtml: renderSimplePortableText(tab.body),
      icon: toImageUrl(tab.icon),
      image: videoSrc || imageSrc,
      imageAlt: tab.imageAlt,
    };
  });
}

export function logosFor(logos: LogoList = []) {
  return logos
    .map((logo) => ({
      src: toImageUrl(logo.image),
      alt: logo.alt || '',
    }))
    .filter((logo): logo is { src: string; alt: string } => Boolean(logo.src));
}
