import type { EditableImage } from './simplePortableText';

export type SeoFields = {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robots?: string;
};

export type InsightsPageData = SeoFields & {
  hero: {
    headline?: string;
    body?: string;
    image?: EditableImage;
    imageAlt?: string;
  };
};

export const defaultInsightsPageData: InsightsPageData = {
  seoTitle: 'Insights | Found Search Marketing',
  seoDescription: 'Perspectives on paid media, data strategy, and digital marketing from the Found Search Marketing team.',
  canonicalUrl: 'https://foundsm.com/insights',
  robots: 'index, follow',
  hero: {
    headline: 'Where Bold Ideas Are Found.',
    body: 'Great performance begins by staying sharp. Tap into fresh insights, news, and forward-thinking strategies from our team and beyond.',
    imageAlt: '',
  },
};

export function mergeInsightsPageData(value?: Partial<InsightsPageData> | null): InsightsPageData {
  const page = value || {};

  return {
    ...defaultInsightsPageData,
    ...page,
    hero: {
      ...defaultInsightsPageData.hero,
      ...(page.hero || {}),
    },
  };
}
