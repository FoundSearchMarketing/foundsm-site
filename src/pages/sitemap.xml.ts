import seoManifest from '../lib/seoManifest.generated.json';
import { DEFAULT_ROBOTS, SITE_URL, canonicalForPath, isIndexableRobots, normalizePath } from '../lib/seo';
import { getAllBlogPosts } from '../lib/blogPosts';
import { legacyAuthorDefinitions, legacyPageDefinitions } from '../lib/legacyPageData';
import { getLocalRedirectSources } from '../lib/redirectedRoutes';

type ManifestRoute = {
  path?: string;
  canonical?: string;
  robots?: string;
  modifiedAt?: string;
};

type RouteSeo = Pick<ManifestRoute, 'canonical' | 'robots' | 'modifiedAt'>;

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
  const redirectSources = new Set([
    ...(seoManifest.redirects || []).filter(isUnconditionalRedirect).map((redirect) => normalizePath(redirect.source)),
    ...getLocalRedirectSources(),
  ]);
  const manifestRoutes = seoManifest.routes as Record<string, ManifestRoute>;
  const urls = [...localRoutes.keys()]
    .map((route) => normalizePath(route))
    .filter((route) => !redirectSources.has(route))
    .map((route) => ({ route, seo: resolveRouteSeo(route, localRoutes.get(route), manifestRoutes[route]) }))
    .filter(({ seo }) => isIndexableRobots(seo.robots))
    .map(({ route, seo }) => ({
      loc: seo.canonical,
      lastmod: formatLastmod(seo.modifiedAt),
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

async function getLocalRoutes(): Promise<Map<string, RouteSeo>> {
  const routes = new Map<string, RouteSeo>();
  const addRoute = (route: string, seo: RouteSeo = {}) => {
    const normalized = normalizePath(route);
    routes.set(normalized, {
      ...(routes.get(normalized) || {}),
      ...seo,
    });
  };

  for (const route of staticRoutes) {
    addRoute(route);
  }

  for (const definition of legacyPageDefinitions) {
    addRoute(definition.path);
  }

  for (const author of legacyAuthorDefinitions) {
    addRoute(`/insights/authors/${author.slug}/`);
  }

  try {
    const posts = await getAllBlogPosts();
    for (const post of posts) {
      addRoute(`/insights/${post.slug}/`, {
        canonical: post.canonicalUrl,
        robots: post.robots,
        modifiedAt: post.modifiedAt || post.publishedAt,
      });
    }
  } catch {
    for (const path of Object.keys(seoManifest.routes || {})) {
      if (isLocalManifestInsight(path)) addRoute(path);
    }
  }

  return routes;
}

function resolveRouteSeo(route: string, current: RouteSeo | undefined, fallback: ManifestRoute | undefined): RouteSeo {
  return {
    ...(fallback || {}),
    ...current,
    canonical: current?.canonical || fallback?.canonical || canonicalForPath(route),
    robots: current?.robots || fallback?.robots || DEFAULT_ROBOTS,
  };
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
