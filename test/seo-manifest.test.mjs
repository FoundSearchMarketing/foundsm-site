import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const manifest = JSON.parse(readFileSync(new URL('../src/lib/seoManifest.generated.json', import.meta.url), 'utf8'));
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const localRedirects = JSON.parse(readFileSync(new URL('../src/lib/redirectedRoutes.json', import.meta.url), 'utf8'));

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

test('legacy whitepaper upload URLs redirect to clean PDF URLs', () => {
  const expectedRedirects = new Map([
    [
      '/found2025/wp-content/uploads/2025/11/Balance-of-Humans-and-Automation_Nov-2025.pdf',
      '/whitepapers/balance-of-humans-and-automation-nov-2025.pdf',
    ],
    [
      '/found2025/wp-content/uploads/2026/01/Foundsm_Data_Activation_whitepaper_2026.pdf',
      '/whitepapers/data-activation-whitepaper-2026.pdf',
    ],
    [
      '/found2025/wp-content/uploads/2026/01/foundsm_data_activation_whitepaper_2026.pdf',
      '/whitepapers/data-activation-whitepaper-2026.pdf',
    ],
  ]);

  for (const [source, destination] of expectedRedirects) {
    assert.ok(vercel.redirects.some((redirect) => (
      redirect.source === source
      && redirect.destination === destination
      && redirect.permanent === true
    )), source);
  }
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

test('local SEO remediation redirects are mirrored in Vercel config', () => {
  for (const expected of localRedirects) {
    assert.ok(vercel.redirects.some((redirect) => (
      redirect.source === expected.source
      && redirect.destination === expected.destination
      && redirect.permanent === expected.permanent
    )), `${expected.source} should redirect to ${expected.destination}`);
  }
});

test('sitemap generation excludes local redirected routes and prefers current route SEO', () => {
  const source = readFileSync(new URL('../src/pages/sitemap.xml.ts', import.meta.url), 'utf8');

  assert.match(source, /getLocalRedirectSources/);
  assert.match(source, /resolveRouteSeo/);
  assert.match(source, /robots:\s*post\.robots/);
  assert.match(source, /canonical:\s*post\.canonicalUrl/);
});

test('SEO copy overrides cover dashboard title and description findings', () => {
  const source = readFileSync(new URL('../src/lib/seo.ts', import.meta.url), 'utf8');

  assert.match(source, /SEO_COPY_OVERRIDES/);
  assert.match(source, /About Found Search Marketing \| Paid Media Agency/);
  assert.match(source, /Segment AI Traffic in GA4 in 3 Minutes/);
  assert.match(source, /Found's 19-Year Giving Tradition/);
  assert.match(source, /Learn how first-party data can strengthen measurement/);
});

test('blog post links normalize legacy DataConnect CTAs', () => {
  const source = readFileSync(new URL('../src/lib/blogPosts.ts', import.meta.url), 'utf8');

  assert.match(source, /normalizeKnownFoundHref/);
  assert.match(source, /url\.pathname\.toLowerCase\(\) === '\/dataconnect\/'/);
  assert.match(source, /`\/dataconnect\/\$\{url\.search\}\$\{url\.hash\}`/);
});
