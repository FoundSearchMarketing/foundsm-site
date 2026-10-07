import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { buildSync } from 'esbuild';

const modulePromise = loadModule();

test('merge returns the code defaults when there is no document', async () => {
  const { mergeHomeV2Content, homeV2Content } = await modulePromise;

  assert.deepEqual(mergeHomeV2Content(null), homeV2Content);
  assert.deepEqual(mergeHomeV2Content({}), homeV2Content);
});

test('merge takes Sanity strings and falls back field by field', async () => {
  const { mergeHomeV2Content, homeV2Content } = await modulePromise;
  const merged = mergeHomeV2Content({
    hero: { eyebrow: 'From Sanity', subheadline: '   ', ctaText: 'Book a call', ctaUrl: '' },
    work: { heading: 'Case heading from Sanity' },
    clientLogos: { heading: 'Brands we work with' },
    metrics: { spend: { value: 210, label: 'Managed last year' }, leads: { value: 1, label: '' } },
    talk: { nameLabel: 'Name' },
  });

  assert.equal(merged.hero.eyebrow, 'From Sanity');
  assert.equal(merged.hero.body, homeV2Content.hero.body, 'blank strings fall back');
  assert.deepEqual(merged.hero.cta, { label: 'Book a call', href: homeV2Content.hero.cta.href });
  assert.equal(merged.work.heading, 'Case heading from Sanity');
  assert.equal(merged.work.logosHeading, 'Brands we work with');
  assert.equal(merged.proof.spendLabel, 'Managed last year');
  assert.equal(merged.proof.leadsLabel, homeV2Content.proof.leadsLabel);
  assert.equal(merged.talk.fields.name, 'Name');
  assert.equal(merged.talk.fields.email, homeV2Content.talk.fields.email);
});

test('merge fills arrays from the defaults at the same index and keeps default arrays when Sanity is empty', async () => {
  const { mergeHomeV2Content, homeV2Content } = await modulePromise;
  const merged = mergeHomeV2Content({
    loop: { stages: [{ title: 'Connect it' }, { number: '2', title: '', body: 'Second body' }] },
    ai: { columns: [] },
    research: { signals: { drafts: [{ title: 'A real draft', url: '/insights/a-real-draft/' }] } },
  });

  assert.equal(merged.loop.stages.length, 2);
  assert.deepEqual(merged.loop.stages[0], { ...homeV2Content.loop.stages[0], title: 'Connect it' });
  assert.deepEqual(merged.loop.stages[1], { number: '2', title: homeV2Content.loop.stages[1].title, body: 'Second body' });
  assert.deepEqual(merged.ai.columns, homeV2Content.ai.columns);
  assert.deepEqual(merged.research.signals.drafts, [
    { label: homeV2Content.research.signals.drafts[0].label, title: 'A real draft', href: '/insights/a-real-draft/' },
  ]);
});

test('merge uses the image builder for Sanity images and keeps local images otherwise', async () => {
  const { mergeHomeV2Content, homeV2Content } = await modulePromise;
  const builder = (image, width, height) => (image?.asset?._ref ? `https://cdn.example/${image.asset._ref}-${width}x${height}` : undefined);
  const merged = mergeHomeV2Content(
    {
      practices: {
        items: [{ title: 'Paid Media', image: { asset: { _ref: 'image-abc' } }, imageAlt: 'Alt from Sanity' }, { title: 'Second' }],
      },
      team: { image: { asset: { _ref: 'image-team' } } },
    },
    builder,
  );

  assert.deepEqual(merged.practices.items[0].image, { src: 'https://cdn.example/image-abc-760x420', alt: 'Alt from Sanity', width: 760, height: 420 });
  assert.deepEqual(merged.practices.items[1].image, homeV2Content.practices.items[1].image);
  assert.equal(merged.team.imageUrl, 'https://cdn.example/image-team-742x739');
});

test('client logos come out in the approved order and partner sizes are known', async () => {
  const { selectClientLogos, selectPartnerLogos, formatMetric } = await modulePromise;
  const logos = selectClientLogos([
    { src: '/duke.png', alt: 'Duke Corporate Education' },
    { src: '/adt.png', alt: 'ADT' },
    { src: '/bkf.png', alt: 'Bar Keepers Friend' },
    { src: '/roche.png', alt: 'Roche' },
    { src: '/x.png', alt: 'Unlisted brand' },
  ]);

  assert.deepEqual(
    logos.map((logo) => logo.alt),
    ['Bar Keepers Friend', 'ADT', 'Roche', 'Duke Corporate Education'],
  );
  assert.deepEqual(selectPartnerLogos([{ src: '/ms.png', alt: 'Microsoft Advertising Premier Elite Partner 2026' }])[0], {
    src: '/ms.png',
    alt: 'Microsoft Advertising Premier Elite Partner 2026',
    width: 184,
    height: 64,
  });
  assert.equal(formatMetric({ prefix: '$', value: 210, suffix: 'M' }), '$210M');
  assert.equal(formatMetric({ value: 20, suffix: '+ years' }), '20+ years');
});

function loadModule() {
  const tempDir = mkdtempSync(join(tmpdir(), 'foundsm-home-v2-'));
  const outputPath = join(tempDir, 'homeV2Content.mjs');

  buildSync({
    entryPoints: [new URL('../src/lib/homeV2Content.ts', import.meta.url).pathname],
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
