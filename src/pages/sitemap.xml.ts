import seoManifest from '../lib/seoManifest.generated.json';
import { DEFAULT_ROBOTS, SITE_URL, isIndexableRobots, normalizePath } from '../lib/seo';
import { getAllBlogPosts } from '../lib/blogPosts';
import { legacyAuthorDefinitions, legacyPageDefinitions } from '../lib/legacyPageData';

type ManifestRoute = {
  path?: string;
  canonical?: string;
  robots?: string;
  modifiedAt?: string;
};

type ManifestRedirect = {
  source: string;
  has?: unknown[];
  missing?: unknown[];
};

const staticRoutes = [
  '/',
  '/about-us/',
  '/capabilities/',
  '/capabilities/data-activation/',
  '/capabilities/data-intelligence/',
  '/capabilities/paid-media/',
  '/capabilities/performance-creative/',
  '/contact-us/',
  '/events/lunch-and-learn/',
  '/insights/',
  '/insights/blog/',
  '/insights/authors/',
  '/newsletter/',
  '/our-approach/',
  '/privacy-policy/',
  '/team/',
  '/whitepapers/',
];

export async function GET() {
  const localRoutes = await getLocalRoutes();
  const redirectSources = new Set((seoManifest.redirects || []).filter(isUnconditionalRedirect).map((redirect) => normalizePath(redirect.source)));
  const manifestRoutes = seoManifest.routes as Record<string, ManifestRoute>;
  const urls = [...localRoutes]
    .map((route) => normalizePath(route))
    .filter((route) => !redirectSources.has(route))
    .map((route) => ({ route, seo: manifestRoutes[route] }))
    .filter(({ seo }) => isIndexableRobots(seo?.robots || DEFAULT_ROBOTS))
    .map(({ route, seo }) => ({
      loc: seo?.canonical || `${SITE_URL}${route === '/' ? '/' : route.slice(1)}`,
      lastmod: formatLastmod(seo?.modifiedAt),
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(({ loc, lastmod }) => [
      '  <url>',
      `    <loc>${escapeXml(loc)}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
      '  </url>',
    ].filter(Boolean).join('\n')),
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

function isUnconditionalRedirect(redirect: ManifestRedirect) {
  return !redirect.has?.length && !redirect.missing?.length;
}

async function getLocalRoutes(): Promise<Set<string>> {
  const routes = new Set(staticRoutes.map(normalizePath));

  for (const definition of legacyPageDefinitions) {
    routes.add(definition.path);
  }

  for (const author of legacyAuthorDefinitions) {
    routes.add(`/insights/authors/${author.slug}/`);
  }

  try {
    const posts = await getAllBlogPosts();
    for (const post of posts) {
      routes.add(`/insights/${post.slug}/`);
    }
  } catch {
    for (const path of Object.keys(seoManifest.routes || {})) {
      if (isLocalManifestInsight(path)) routes.add(path);
    }
  }

  return routes;
}

function isLocalManifestInsight(path: string): boolean {
  const route = normalizePath(path);
  if (!route.startsWith('/insights/')) return false;
  if (route.startsWith('/insights/category/')) return false;
  if (route.startsWith('/insights/tag/')) return false;
  if (route.startsWith('/insights/author/')) return false;
  return true;
}

function formatLastmod(value?: string): string | undefined {
  if (!value) return undefined;
  return value.slice(0, 10);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
