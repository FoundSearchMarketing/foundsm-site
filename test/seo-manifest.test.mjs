import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const manifest = JSON.parse(readFileSync(new URL('../src/lib/seoManifest.generated.json', import.meta.url), 'utf8'));
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

test('generated manifest contains core Yoast SEO fields', () => {
  const home = manifest.routes['/'];
  assert.equal(manifest.siteUrl, 'https://foundsm.com');
  assert.equal(manifest.twitterSite, '@FoundSM');
  assert.equal(home.title, 'Found Search Marketing | An Enterprise Paid Media Agency');
  assert.equal(home.canonical, 'https://foundsm.com/');
  assert.match(home.robots, /max-image-preview:large/);
  assert.ok(home.schema?.['@graph']?.length >= 3);
});

test('canonical URLs are normalized to non-www foundsm.com', () => {
  for (const [path, route] of Object.entries(manifest.routes)) {
    assert.match(route.canonical, /^https:\/\/foundsm\.com\//, path);
    assert.doesNotMatch(route.canonical, /^https:\/\/www\.foundsm\.com\//, path);
  }
});

test('Yoast redirects are merged under Vercel static redirect limits', () => {
  assert.equal(vercel.trailingSlash, true);
  assert.ok(Array.isArray(vercel.redirects));
  assert.ok(vercel.redirects.length >= manifest.redirects.length);
  assert.ok(vercel.redirects.length <= 2048);
  assert.ok(vercel.redirects.some((redirect) => redirect.source === '/capabilities-paid-media' && redirect.destination === '/capabilities/paid-media/'));
});

test('query-string redirects use Vercel query matchers instead of source query strings', () => {
  assert.ok(vercel.redirects.every((redirect) => !redirect.source.includes('?')));
  assert.ok(manifest.redirects.every((redirect) => !redirect.source.includes('?')));

  const wpPostRedirect = vercel.redirects.find((redirect) => (
    redirect.source === '/'
    && redirect.destination === '/'
    && redirect.has?.some((condition) => condition.type === 'query' && condition.key === 'p' && condition.value?.eq === '82548')
  ));
  assert.ok(wpPostRedirect);
});

test('noindex routes stay out of indexable expectations', () => {
  const noindexRoutes = Object.entries(manifest.routes).filter(([, route]) => String(route.robots).includes('noindex'));
  assert.ok(noindexRoutes.length > 0);
  assert.ok(noindexRoutes.some(([path]) => path === '/safelist/' || path === '/thank-you/'));
});
