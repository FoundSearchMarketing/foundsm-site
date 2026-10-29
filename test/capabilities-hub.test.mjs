import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { buildSync } from 'esbuild';

const modulePromise = loadModule();

const LONG_INTRO = 'We build smart, custom systems for performance marketing by combining first-party data with our proven approach.';
const SHORT_INTRO = 'We handle every aspect of your performance lead generation ecosystem, making sure strategy and execution are always aligned.';

test('hub defaults are the four cards, the short outcomes line, and /ai/', async () => {
  const { defaultCapabilitiesPageData, defaultCapabilityDetailPages, mergeCapabilitiesPageData, practiceCards, outcomeIntroBlocks, aiSection, outcomesHeading } = await modulePromise;
  const page = mergeCapabilitiesPageData(null);
  const cards = practiceCards(page);
  const intro = outcomeIntroBlocks(page).map(textOf).join(' ');

  assert.deepEqual(cards.map((card) => card.heading), [
    'Paid Media',
    'Data Activation',
    'Data, Reporting & Analytics',
    'Performance Creative & CRO',
  ]);
  assert.deepEqual(cards.map((card) => card.lead), [
    "We don't just manage campaigns. We engineer ecosystems.",
    "In today's AI marketing landscape, data is your most valuable asset yet many companies are not using it to its full potential.",
    'Do you have multiple data sources to connect? Or multiple CRMs? No problem.',
    'Performance creative bridges the gap between storytelling and sales.',
  ]);
  assert.deepEqual(cards.map((card) => card.label), [
    "Let's Scale Smarter",
    'Connect the data',
    'Connect Data to Outcomes',
    'Creative Ads That Convert',
  ]);
  assert.deepEqual(cards.map((card) => card.href), [
    '/capabilities/paid-media/',
    '/capabilities/data-activation/',
    '/capabilities/data-analytics/',
    '/capabilities/performance-creative/',
  ]);
  assert.deepEqual(cards.map((card) => card.anchor), [
    'capabilities-paid-media',
    'capabilities-data-activation',
    'capabilities-data-reporting-analytics',
    'capabilities-performance-creative',
  ]);
  assert.equal(intro, SHORT_INTRO);
  assert.equal(intro.includes(LONG_INTRO.slice(0, 40)), false);
  assert.equal(outcomesHeading(page), 'Outcomes that Outperform.');
  assert.equal(aiSection(page).href, '/ai/');
  assert.equal(aiSection(page).heading, 'AI, Inside Every Practice.');
  assert.equal(aiSection(page).anchor, 'capabilities-ai');
  assert.equal(defaultCapabilitiesPageData.details.some((detail) => detail.id === 'activation'), true);
  for (const card of cards) {
    const body = card.body.map(textOf).join('\n');
    assert.equal(body.startsWith(card.lead), false, card.id);
    assert.equal(body.includes(card.lead), false, card.id);
  }
  assert.equal(cards.find((card) => card.id === 'data').body.map(textOf).join('\n\n').includes('For us, analytics and reporting go beyond tracking paid media'), true);
  assert.equal(cards.find((card) => card.id === 'paid').body.map(textOf).join('\n').startsWith('Our team brings 20+ years of performance experience'), true);
  assert.equal(cards.find((card) => card.id === 'creative').body.map(textOf).join('').startsWith('We design motion graphics'), true);
  const activation = cards.find((card) => card.id === 'activation');
  const heroBody = defaultCapabilityDetailPages.dataActivation.hero.body.map(textOf).join('\n\n');
  assert.equal(activation.body.map(textOf).join('\n\n'), heroBody.slice(activation.lead.length).trim());
  assert.equal(intro.includes('We build smart'), false);
});

test('an older four-item document still gets Data Activation and keeps card leads', async () => {
  const { defaultCapabilitiesPageData, mergeCapabilitiesPageData, practiceCards } = await modulePromise;
  const legacy = defaultCapabilitiesPageData.details.filter((detail) => detail.id !== 'activation').map((detail) => ({
    id: detail.id,
    heading: detail.heading,
    body: detail.body,
    cta: detail.id === 'ai' ? { label: detail.cta.label, href: '/capabilities/ai-automation/' } : detail.cta,
    image: detail.image,
    imageAlt: detail.imageAlt,
  }));
  const page = mergeCapabilitiesPageData({
    outcomes: { heading: 'Outcomes that Outperform', body: defaultCapabilitiesPageData.outcomes.body },
    details: legacy,
  });
  const cards = practiceCards(page);
  const activation = cards.find((card) => card.id === 'activation');

  assert.equal(cards.length, 4);
  assert.equal(activation.lead.startsWith("In today's AI marketing landscape"), true);
  assert.equal(activation.href, '/capabilities/data-activation/');
  assert.equal(activation.label, 'Connect the data');
  assert.equal(cards.find((card) => card.id === 'paid').lead, "We don't just manage campaigns. We engineer ecosystems.");
});

test('retired AI and dataconnect hrefs resolve to the child pages', async () => {
  const { mergeCapabilitiesPageData, practiceCards, aiSection, outcomeIntroBlocks } = await modulePromise;
  const page = mergeCapabilitiesPageData({
    outcomes: {
      heading: 'Outcomes that Outperform',
      body: [{ _type: 'block', children: [{ _type: 'span', text: 'We build smart, custom systems for performance marketing and should not show on the hub.' }] }],
    },
    details: [
      { id: 'activation', cta: { label: 'Connect the data', href: 'https://foundsm.com/dataconnect/' } },
      { id: 'ai', heading: 'AI, Inside Every Practice', cta: { label: 'Explore AI & Automation', href: '/capabilities/ai-automation' } },
    ],
  });

  assert.equal(practiceCards(page).find((card) => card.id === 'activation').href, '/capabilities/data-activation/');
  const legacyData = mergeCapabilitiesPageData({
    details: [{ id: 'data', cta: { label: 'Connect Data to Outcomes', href: '/capabilities/data-intelligence/' } }],
  });
  assert.equal(practiceCards(legacyData).find((card) => card.id === 'data').href, '/capabilities/data-analytics/');
  assert.equal(aiSection(page).href, '/ai/');
  assert.equal(aiSection(page).heading, 'AI, Inside Every Practice.');
  const intro = outcomeIntroBlocks(page).map(textOf).join(' ');
  assert.equal(intro.includes('We build smart'), false);
  assert.equal(intro.includes('making sure strategy and execution are always aligned'), true);
});

test('hub copy has no em dashes', async () => {
  const { mergeCapabilitiesPageData, practiceCards, outcomeIntroBlocks, aiSection, outcomesHeading } = await modulePromise;
  const page = mergeCapabilitiesPageData(null);
  const chunks = [
    outcomesHeading(page),
    ...outcomeIntroBlocks(page).map(textOf),
    ...practiceCards(page).flatMap((card) => [card.heading, card.lead, card.label]),
    aiSection(page).heading,
    aiSection(page).label,
    ...aiSection(page).body.map(textOf),
  ];
  for (const chunk of chunks) assert.equal(/[\u2013\u2014]/.test(chunk), false, chunk);
});

function textOf(block) {
  return (block?.children || []).map((child) => child.text || '').join('').trim();
}

function loadModule() {
  const tempDir = mkdtempSync(join(tmpdir(), 'foundsm-capabilities-hub-'));
  const outputPath = join(tempDir, 'capabilitiesHub.mjs');

  buildSync({
    entryPoints: [new URL('../src/lib/capabilitiesHub.ts', import.meta.url).pathname],
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
