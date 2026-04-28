import test from 'node:test';
import assert from 'node:assert/strict';

import { JSDOM } from 'jsdom';

import {
  importModernBlogPosts,
  parseDateLabel,
  rewriteBlogPostLinks,
} from '../scripts/blog-posts/lib/import-modern-posts.mjs';

const sourceDir = '/Users/theoden/Documents/test/blogposts-modern';

test('parseDateLabel converts exported labels to ISO dates', () => {
  assert.equal(parseDateLabel('March 20, 2026'), '2026-03-20');
  assert.equal(parseDateLabel('June 10, 2025'), '2025-06-10');
});

test('importModernBlogPosts parses the complete migrated batch', async () => {
  const posts = await importModernBlogPosts(sourceDir);
  assert.equal(posts.length, 10);
  assert.deepEqual(posts.map((post) => post.slug).slice(0, 3), [
    'dirty-signals-bot-traffic-junk-leads',
    'customer-match-uploads-disabled-in-google-ads-api',
    'signal-loss-costs-real-revenue',
  ]);

  const dirtySignals = posts.find((post) => post.slug === 'dirty-signals-bot-traffic-junk-leads');
  assert.equal(dirtySignals.title, 'Bot Traffic and Bad Lookalikes: How Dirty Signals Can Wreck Your Funnel and Your Targeting');
  assert.equal(dirtySignals.publishedAt, '2026-03-20');
  assert.equal(dirtySignals.authorName, 'Maria Escobedo');
  assert.equal(dirtySignals.authorTitle, 'Associate Data Analyst');
  assert.equal(dirtySignals.heroImage, 'https://foundsm.com/found2025/wp-content/uploads/2026/03/bot-traffic-sm.webp');
  assert.match(dirtySignals.contentHtml, /blog-post__toc/);
  assert.match(dirtySignals.contentHtml, /blog-post__quote/);
  assert.doesNotMatch(dirtySignals.contentHtml, /blog-post__pagination/);

  const ga4Guide = posts.find((post) => post.slug === 'a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4');
  assert.match(ga4Guide.contentHtml, /blog-post__video/);
  assert.match(ga4Guide.contentHtml, /blog-post__button/);

  const closingLoop = posts.find((post) => post.slug === 'closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing');
  assert.match(closingLoop.contentHtml, /<table>/);
  assert.match(closingLoop.contentHtml, /blog-post__cta/);
});

test('rewriteBlogPostLinks localizes migrated post links and preserves other URLs', () => {
  const dom = new JSDOM(`
    <a id="post" href="https://foundsm.com/insights/dirty-signals-bot-traffic-junk-leads/">Post</a>
    <a id="post-hash" href="https://www.foundsm.com/insights/dirty-signals-bot-traffic-junk-leads/#section1">Post hash</a>
    <a id="asset" href="https://foundsm.com/found2025/wp-content/uploads/image.webp">Asset</a>
    <a id="external" href="https://example.com/insights/dirty-signals-bot-traffic-junk-leads/">External</a>
  `);

  rewriteBlogPostLinks(dom.window.document, new Set(['dirty-signals-bot-traffic-junk-leads']));

  assert.equal(dom.window.document.querySelector('#post').getAttribute('href'), '/insights/dirty-signals-bot-traffic-junk-leads/');
  assert.equal(dom.window.document.querySelector('#post-hash').getAttribute('href'), '/insights/dirty-signals-bot-traffic-junk-leads/#section1');
  assert.equal(dom.window.document.querySelector('#asset').getAttribute('href'), 'https://foundsm.com/found2025/wp-content/uploads/image.webp');
  assert.equal(dom.window.document.querySelector('#external').getAttribute('href'), 'https://example.com/insights/dirty-signals-bot-traffic-junk-leads/');
});
