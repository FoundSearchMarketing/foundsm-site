import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { buildSync } from 'esbuild';

const modulePromise = loadModule();

test('AI page merge returns the defaults when there is no document', async () => {
  const { mergeAiPageData, defaultAiPageData } = await modulePromise;

  assert.deepEqual(mergeAiPageData(null), defaultAiPageData);
  assert.deepEqual(mergeAiPageData({}), defaultAiPageData);
});

test('AI page merge takes Sanity values field by field and keeps default images without an asset', async () => {
  const { mergeAiPageData, defaultAiPageData } = await modulePromise;
  const merged = mergeAiPageData({
    hero: { heading: 'From Sanity', eyebrow: '  ', cta: { label: 'Go', href: '' }, image: { _type: 'image' } },
    systems: { items: [{ title: 'Operations, renamed' }, { title: '', body: 'New body' }] },
    paidMedia: { image: { asset: { _ref: 'image-abc-10x10-png' } } },
    closing: { secondaryCta: { label: 'Library', href: '/library/' } },
  });

  assert.equal(merged.hero.heading, 'From Sanity');
  assert.equal(merged.hero.eyebrow, defaultAiPageData.hero.eyebrow, 'blank strings fall back');
  assert.deepEqual(merged.hero.cta, defaultAiPageData.hero.cta, 'a link needs both label and href');
  assert.equal(merged.hero.image, defaultAiPageData.hero.image, 'an image field without an asset keeps the default');
  assert.equal(merged.systems.items.length, 2);
  assert.equal(merged.systems.items[0].title, 'Operations, renamed');
  assert.equal(merged.systems.items[0].body, defaultAiPageData.systems.items[0].body);
  assert.equal(merged.systems.items[1].title, defaultAiPageData.systems.items[1].title);
  assert.equal(merged.systems.items[1].body, 'New body');
  assert.deepEqual(merged.paidMedia.image, { asset: { _ref: 'image-abc-10x10-png' } });
  assert.deepEqual(merged.closing.secondaryCta, { label: 'Library', href: '/library/' });
  assert.deepEqual(merged.process.steps, defaultAiPageData.process.steps);
});

function loadModule() {
  const tempDir = mkdtempSync(join(tmpdir(), 'foundsm-ai-page-'));
  const outputPath = join(tempDir, 'aiPageData.mjs');

  buildSync({
    entryPoints: [new URL('../src/lib/aiPageData.ts', import.meta.url).pathname],
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
