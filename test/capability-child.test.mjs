import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { buildSync } from 'esbuild';

const modulePromise = loadModule();

test('only Paid Search uses the child template', async () => {
  const { usesCapabilityChildTemplate, CAPABILITY_CHILD_PATHS } = await modulePromise;
  assert.deepEqual([...CAPABILITY_CHILD_PATHS], ['capabilities/paid-media/paid-search']);
  assert.equal(usesCapabilityChildTemplate('capabilities/paid-media/paid-search'), true);
  assert.equal(usesCapabilityChildTemplate('/capabilities/paid-media/paid-search/'), true);
  assert.equal(usesCapabilityChildTemplate('capabilities/paid-media/paid-social'), false);
  assert.equal(usesCapabilityChildTemplate('capabilities/paid-media'), false);
  assert.equal(usesCapabilityChildTemplate('capabilities/ad-account-migration'), false);
});

test('Paid Search place labels match the approved template', async () => {
  const { capabilityPlace } = await modulePromise;
  const place = capabilityPlace('capabilities/paid-media/paid-search', 'Paid Search');
  assert.equal(place.kind, 'grandchild');
  assert.equal(place.eyebrow, 'Paid Media · Paid Search');
  assert.deepEqual(place.crumbs.map((crumb) => crumb.label), ['Capabilities', 'Paid Media', 'Paid Search']);
  assert.equal(place.crumbs[0].href, '/capabilities/');
  assert.equal(place.crumbs[1].href, '/capabilities/paid-media/');
  assert.equal(place.crumbs[2].href, undefined);
  assert.equal(place.related.eyebrow, 'More in Paid Media');
  assert.equal(place.related.title, 'Related capabilities');
  assert.deepEqual(place.related.back, { label: 'Back to Paid Media', href: '/capabilities/paid-media/' });
  assert.deepEqual(
    place.related.cards.map((card) => card.label),
    ['Paid Social', 'Programmatic & Display', 'Competitive Intelligence', 'Paid Media'],
  );
  assert.equal(place.related.cards[3].kind, 'parent');
  assert.equal(place.related.cards[3].kicker, 'Practice overview');
  assert.equal(place.related.cards[3].description, 'Search, social, display, and programmatic engineered as one system.');
  assert.equal(place.related.cards[3].linkLabel, 'All of Paid Media');
  assert.ok(place.related.cards.slice(0, 3).every((card) => card.linkLabel === 'Explore' && card.kind === 'sibling'));
});

test('a practice page uses the child variant', async () => {
  const { capabilityPlace } = await modulePromise;
  const place = capabilityPlace('capabilities/paid-media', 'Paid Media');
  assert.equal(place.kind, 'child');
  assert.equal(place.related.back.label, 'Back to Capabilities');
  assert.equal(place.related.back.href, '/capabilities/');
  assert.deepEqual(
    place.related.cards.map((card) => card.label),
    ['Paid Search', 'Paid Social', 'Programmatic & Display', 'Competitive Intelligence'],
  );
  assert.ok(place.related.cards.every((card) => card.kind === 'sibling'));
});

test('sections are ordered by role and proof blocks are skipped', async () => {
  const { groupCapabilitySections } = await modulePromise;
  const grouped = groupCapabilitySections([
    { _type: 'modernCtaBlock', _key: 'cta' },
    { _type: 'logoBarBlock', _key: 'logos' },
    { _type: 'cardGridBlock', _key: 'leaks' },
    { _type: 'statsBlock', _key: 'stats' },
    { _type: 'splitFeatureBlock', _key: 'partners' },
    { _type: 'proofMosaicBlock', _key: 'proof' },
    { _type: 'accordionBlock', _key: 'run' },
    { _type: 'statementBandBlock', _key: 'band' },
    { _type: 'modernHeroBlock', _key: 'hero' },
  ]);
  assert.equal(grouped.hero._key, 'hero');
  assert.equal(grouped.band._key, 'band');
  assert.equal(grouped.run._key, 'run');
  assert.equal(grouped.partners._key, 'partners');
  assert.deepEqual(grouped.grids.map((section) => section._key), ['leaks']);
  assert.equal(grouped.cta._key, 'cta');
  assert.deepEqual(grouped.skipped.sort(), ['logoBarBlock', 'proofMosaicBlock', 'statsBlock']);
});

test('partnership notes and new labels have no em dashes', async () => {
  const { partnerBadges, capabilityPlace, SEE_WHAT_WE_RUN, TALK_EYEBROW } = await modulePromise;
  const place = capabilityPlace('capabilities/paid-media/paid-search');
  const labels = [
    SEE_WHAT_WE_RUN,
    TALK_EYEBROW,
    place.eyebrow,
    place.related.eyebrow,
    place.related.title,
    place.related.back.label,
    ...place.related.cards.flatMap((card) => [card.label, card.linkLabel, card.kind === 'parent' ? card.kicker : '', card.kind === 'parent' ? card.description : '']),
    ...partnerBadges.flatMap((badge) => [badge.label, badge.note, badge.alt]),
  ];
  for (const label of labels) {
    assert.equal(label.includes('\u2014') || label.includes('\u2013'), false, label);
  }
  assert.deepEqual(partnerBadges.map((badge) => badge.note), [
    'Weekly call with named reps',
    'Call every other week with named reps',
  ]);
  assert.equal(partnerBadges[0].src, '/images/pages/capabilities/badge-google-partner.png');
  assert.equal(partnerBadges[1].src, '/images/pages/our-approach/microsoft-badge-2026.svg');
});

function loadModule() {
  const tempDir = mkdtempSync(join(tmpdir(), 'foundsm-capability-child-'));
  const outputPath = join(tempDir, 'capabilityChild.mjs');
  buildSync({
    entryPoints: [new URL('../src/lib/capabilityChild.ts', import.meta.url).pathname],
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
