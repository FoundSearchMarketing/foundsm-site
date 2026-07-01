import redirectedRoutes from './redirectedRoutes.json';
import { normalizePath } from './seo';

export type LocalRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export const localRedirects = redirectedRoutes as LocalRedirect[];

const redirectedRouteSources = new Set(localRedirects.map((redirect) => normalizePath(redirect.source)));

export function isLocalRedirectSource(path: string): boolean {
  return redirectedRouteSources.has(normalizePath(path));
}

export function getLocalRedirectSources(): Set<string> {
  return new Set(redirectedRouteSources);
}
