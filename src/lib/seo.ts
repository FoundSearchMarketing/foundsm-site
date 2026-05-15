import manifest from './seoManifest.generated.json';

export const SITE_URL = 'https://foundsm.com';
export const SITE_NAME = 'Found Search Marketing';
export const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const DEFAULT_OG_IMAGE = 'https://foundsm.com/images/og-image-1200x630.jpg';

export type JsonLd = Record<string, unknown> | Record<string, unknown>[];

export interface SeoImage {
  url?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface SeoInput {
  title?: string;
  description?: string;
  canonical?: string;
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | SeoImage;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string | SeoImage;
  publishedAt?: string;
  modifiedAt?: string;
  schema?: JsonLd;
  schemaJson?: string;
}

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogImage: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogLocale: string;
  siteName: string;
  twitterCard: string;
  twitterSite: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  publishedAt?: string;
  modifiedAt?: string;
  schema?: JsonLd;
  sourceWpId?: number;
}

type ManifestRoute = SeoInput & {
  sourceWpId?: number;
  path?: string;
  schema?: JsonLd;
};

type SeoManifest = {
  siteUrl?: string;
  defaultOgImage?: SeoImage;
  twitterSite?: string;
  routes?: Record<string, ManifestRoute>;
};

const seoManifest = manifest as SeoManifest;

export function normalizePath(path = '/'): string {
  if (!path) return '/';
  let pathname = path;

  try {
    pathname = new URL(path, SITE_URL).pathname;
  } catch {
    pathname = path.split('?')[0]?.split('#')[0] || '/';
  }

  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  pathname = pathname.replace(/\/{2,}/g, '/');

  if (pathname !== '/' && !hasFileExtension(pathname) && !pathname.endsWith('/')) {
    pathname += '/';
  }

  return pathname;
}

export function canonicalForPath(path = '/'): string {
  return `${SITE_URL}${normalizePath(path) === '/' ? '/' : normalizePath(path).slice(1)}`;
}

export function normalizeCanonicalUrl(value?: string, route = '/'): string {
  const fallback = canonicalForPath(route);
  if (!value) return fallback;

  try {
    const url = new URL(value, SITE_URL);
    url.protocol = 'https:';
    url.hostname = 'foundsm.com';
    url.pathname = normalizePath(url.pathname);
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return fallback;
  }
}

export function getManifestSeo(route = '/'): ManifestRoute | undefined {
  const path = normalizePath(route);
  return seoManifest.routes?.[path] || seoManifest.routes?.[path.replace(/\/$/, '')];
}

export function serializeRobots(value?: string): string {
  if (!value) return DEFAULT_ROBOTS;
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ');
}

export function isIndexableRobots(value?: string): boolean {
  return !serializeRobots(value).toLowerCase().split(',').map((part) => part.trim()).includes('noindex');
}

export function resolveSeo(route: string, input: SeoInput = {}): ResolvedSeo {
  const fallback = getManifestSeo(route) || {};
  const canonical = normalizeCanonicalUrl(input.canonical || input.canonicalUrl || fallback.canonical || fallback.canonicalUrl, route);
  const title = firstText(input.title, fallback.title, SITE_NAME);
  const description = firstText(input.description, fallback.description, '');
  const ogImage = resolveImage(input.ogImage) || resolveImage(fallback.ogImage) || resolveImage(seoManifest.defaultOgImage) || DEFAULT_OG_IMAGE;
  const twitterImage = resolveImage(input.twitterImage) || resolveImage(fallback.twitterImage) || ogImage;
  const ogImageMeta = resolveImageMeta(input.ogImage) || resolveImageMeta(fallback.ogImage) || seoManifest.defaultOgImage;
  const robots = chooseRobots(input.robots, fallback.robots);
  const schema = parseSchema(undefined, input.schemaJson) || input.schema || fallback.schema || createDefaultSchema({
    title,
    description,
    canonical,
    ogImage,
    ogType: firstText(input.ogType, fallback.ogType, 'website'),
    publishedAt: input.publishedAt || fallback.publishedAt,
    modifiedAt: input.modifiedAt || fallback.modifiedAt,
  });

  return {
    title,
    description,
    canonical,
    robots,
    ogTitle: firstText(input.ogTitle, fallback.ogTitle, title),
    ogDescription: firstText(input.ogDescription, fallback.ogDescription, description),
    ogType: firstText(input.ogType, fallback.ogType, 'website'),
    ogImage,
    ogImageWidth: input.ogImageWidth || fallback.ogImageWidth || ogImageMeta?.width,
    ogImageHeight: input.ogImageHeight || fallback.ogImageHeight || ogImageMeta?.height,
    ogLocale: 'en_US',
    siteName: SITE_NAME,
    twitterCard: firstText(input.twitterCard, fallback.twitterCard, 'summary_large_image'),
    twitterSite: normalizeTwitterSite(firstText(input.twitterSite, fallback.twitterSite, seoManifest.twitterSite, '@FoundSM')),
    twitterTitle: firstText(input.twitterTitle, fallback.twitterTitle, input.ogTitle, fallback.ogTitle, title),
    twitterDescription: firstText(input.twitterDescription, fallback.twitterDescription, input.ogDescription, fallback.ogDescription, description),
    twitterImage,
    publishedAt: input.publishedAt || fallback.publishedAt,
    modifiedAt: input.modifiedAt || fallback.modifiedAt,
    schema,
    sourceWpId: fallback.sourceWpId,
  };
}

function chooseRobots(input?: string, fallback?: string): string {
  const normalizedInput = serializeRobots(input);
  const normalizedFallback = fallback ? serializeRobots(fallback) : '';

  if (normalizedFallback.toLowerCase().includes('noindex') && isBasicIndexRobots(input)) {
    return normalizedFallback;
  }

  return input ? normalizedInput : normalizedFallback || DEFAULT_ROBOTS;
}

function isBasicIndexRobots(value?: string): boolean {
  if (!value) return true;
  return value
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .every((part) => part === 'index' || part === 'follow');
}

function firstText(...values: Array<unknown>): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function resolveImage(image?: string | SeoImage): string | undefined {
  if (typeof image === 'string') return normalizeImageUrl(image);
  if (image?.url) return normalizeImageUrl(image.url);
  return undefined;
}

function resolveImageMeta(image?: string | SeoImage): SeoImage | undefined {
  if (!image || typeof image === 'string') return undefined;
  return image;
}

function normalizeImageUrl(value: string): string {
  if (!value) return value;
  if (value.startsWith('/')) return `${SITE_URL}${value}`;
  return value.replace('https://foundsm.com/', 'https://foundsm.com/');
}

function normalizeTwitterSite(value: string): string {
  if (!value) return '@FoundSM';
  return value.startsWith('@') ? value : `@${value}`;
}

function parseSchema(schema?: JsonLd, schemaJson?: string): JsonLd | undefined {
  if (schema) return schema;
  if (!schemaJson?.trim()) return undefined;

  try {
    return JSON.parse(schemaJson);
  } catch {
    return undefined;
  }
}

function createDefaultSchema(seo: {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType: string;
  publishedAt?: string;
  modifiedAt?: string;
}): JsonLd {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const webpageId = `${seo.canonical}#webpage`;
  const graph: Array<Record<string, unknown>> = [
    {
      '@type': seo.ogType === 'article' ? 'Article' : 'WebPage',
      '@id': webpageId,
      url: seo.canonical,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      primaryImageOfPage: seo.ogImage,
      inLanguage: 'en-US',
      ...(seo.publishedAt ? { datePublished: seo.publishedAt } : {}),
      ...(seo.modifiedAt ? { dateModified: seo.modifiedAt } : {}),
      publisher: { '@id': organizationId },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { '@id': organizationId },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.svg`,
      },
      sameAs: [
        'https://www.facebook.com/foundsm/',
        'https://x.com/FoundSM',
        'https://www.linkedin.com/company/found-search-marketing/',
      ],
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function hasFileExtension(pathname: string): boolean {
  const last = pathname.split('/').pop() || '';
  return /\.[a-z0-9]{2,8}$/i.test(last);
}
