import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { buildSync } from 'esbuild';

const modulePromise = loadModule();

test('curated labels are unique and short enough for a single-line button', async () => {
  const { CURATED_CTA_LABELS } = await modulePromise;
  const labels = Object.values(CURATED_CTA_LABELS);

  assert.equal(new Set(labels.map((label) => label.toLowerCase())).size, labels.length);
  labels.forEach((label) => assert.ok(label.length <= 30, `"${label}" is too long`));
  labels.forEach((label) => assert.doesNotMatch(label, /→/));
});

test('an editorial label from Sanity wins over the curated and derived labels', async () => {
  const { resolveCtaLabels } = await modulePromise;
  const labels = resolveCtaLabels([
    { slug: 'ccpa', title: 'What The CCPA Means for Your Business', ctaLabel: ' Get CCPA Ready → ' },
  ]);

  assert.equal(labels.get('ccpa'), 'Get CCPA Ready');
});

test('curated labels apply to known slugs', async () => {
  const { resolveCtaLabels } = await modulePromise;
  const labels = resolveCtaLabels([{ slug: 'ccpa', title: 'What The CCPA Means for Your Business' }]);

  assert.equal(labels.get('ccpa'), 'Understand the CCPA');
});

test('derived labels are specific to the title', async () => {
  const { resolveCtaLabel } = await modulePromise;

  assert.equal(resolveCtaLabel({ slug: 'a', title: '5 Ways to Cut Wasted Ad Spend' }), 'Get the 5 Ways');
  assert.equal(resolveCtaLabel({ slug: 'b', title: 'How to Audit Your Tracking' }), 'Learn to Audit Your Tracking');
  assert.equal(resolveCtaLabel({ slug: 'c', title: 'Intro to Demand Gen Campaigns' }), 'Get Started With Demand Gen');
  assert.equal(resolveCtaLabel({ slug: 'd', title: 'Is Reddit Advertising Worth It?' }), 'Find Out: Reddit Advertising');
  assert.equal(resolveCtaLabel({ slug: 'e', title: 'Consent Mode: A Practical Guide' }), 'Read the Consent Mode Guide');
  assert.equal(resolveCtaLabel({ slug: 'f', title: 'Consent Mode v2 – What Changed' }), 'Explore Consent Mode v2');
});

test('derived labels never collide across a set of posts', async () => {
  const { resolveCtaLabels } = await modulePromise;
  const labels = resolveCtaLabels([
    { slug: 'one', title: 'Attribution Modeling' },
    { slug: 'two', title: 'Attribution Modeling' },
    { slug: 'three', title: 'Attribution Modeling', categories: [{ label: 'Paid Media', slug: 'paid-media' }] },
  ]);

  assert.equal(labels.get('one'), 'Explore Attribution Modeling');
  assert.equal(labels.get('two'), 'Dive Into Attribution Modeling');
  assert.equal(labels.get('three'), 'Discover Attribution Modeling');
  assert.equal(new Set(labels.values()).size, 3);
});

function loadModule() {
  const tempDir = mkdtempSync(join(tmpdir(), 'foundsm-cta-labels-'));
  const outputPath = join(tempDir, 'blogPostCtaLabels.mjs');

  buildSync({
    entryPoints: [new URL('../src/lib/blogPostCtaLabels.ts', import.meta.url).pathname],
    outfile: outputPath,
    bundle: true,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  });

  return import(pathToFileURL(outputPath)).finally(() => {
    rmSync(tempDir, { force: true, recursive: true });
  });
}
