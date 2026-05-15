#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const distDir = new URL('../dist/', import.meta.url).pathname;
const manifest = JSON.parse(readFileSync(new URL('../src/lib/seoManifest.generated.json', import.meta.url), 'utf8'));

if (!existsSync(distDir)) {
  throw new Error('Missing dist directory. Run `npm run build` before `npm run verify:seo`.');
}

const htmlFiles = walk(distDir).filter((file) => file.endsWith('.html'));
const failures = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const route = routeFromFile(file);
  const titleCount = countMatches(html, /<title\b/gi);
  const canonicalTags = [...html.matchAll(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi)];
  const robotsTags = [...html.matchAll(/<meta\s+[^>]*(?:name=["']robots["'][^>]*content=["']([^"']+)["']|content=["']([^"']+)["'][^>]*name=["']robots["'])[^>]*>/gi)];
  const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const ogImage = html.match(/<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1];

  if (titleCount !== 1) failures.push(`${route}: expected exactly one <title>, found ${titleCount}`);
  if (canonicalTags.length !== 1) failures.push(`${route}: expected exactly one canonical tag, found ${canonicalTags.length}`);
  if (robotsTags.length !== 1) failures.push(`${route}: expected exactly one robots tag, found ${robotsTags.length}`);

  const canonical = canonicalTags[0]?.[0].match(/\shref=["']([^"']+)["']/i)?.[1];
  if (canonical?.startsWith('https://www.foundsm.com/')) failures.push(`${route}: canonical uses www host`);
  if (canonical && !canonical.startsWith('https://foundsm.com/')) failures.push(`${route}: canonical is outside foundsm.com`);
  if (!ogImage) failures.push(`${route}: missing og:image`);

  if (jsonLdBlocks.length === 0) {
    failures.push(`${route}: missing JSON-LD`);
  } else {
    for (const block of jsonLdBlocks) {
      try {
        JSON.parse(decodeEntities(block[1]));
      } catch (error) {
        failures.push(`${route}: invalid JSON-LD (${error.message})`);
      }
    }
  }
}

const sitemapFile = join(distDir, 'sitemap.xml');
if (!existsSync(sitemapFile)) {
  failures.push('missing dist/sitemap.xml');
} else {
  const sitemap = readFileSync(sitemapFile, 'utf8');
  if (sitemap.includes('https://www.foundsm.com/')) failures.push('sitemap contains www canonicals');
  const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const redirectSources = new Set((manifest.redirects || []).filter(isUnconditionalRedirect).map((redirect) => normalizePath(redirect.source)));
  for (const url of sitemapUrls) {
    const route = normalizePath(new URL(url).pathname);
    const seo = manifest.routes[route];
    if (seo?.robots?.includes('noindex')) failures.push(`sitemap includes noindex route ${route}`);
    if (redirectSources.has(route)) failures.push(`sitemap includes redirect source ${route}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`SEO build verification passed for ${htmlFiles.length} HTML files.`);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function routeFromFile(file) {
  const rel = relative(distDir, file);
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '/')}`;
}

function countMatches(value, regex) {
  return [...value.matchAll(regex)].length;
}

function normalizePath(path) {
  let pathname = path.startsWith('/') ? path : `/${path}`;
  if (pathname !== '/' && !/\.[a-z0-9]{2,8}$/i.test(pathname.split('/').pop() || '') && !pathname.endsWith('/')) pathname += '/';
  return pathname;
}

function isUnconditionalRedirect(redirect) {
  return !redirect.has?.length && !redirect.missing?.length;
}

function decodeEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
