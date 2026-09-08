import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { buildSync } from 'esbuild';

const modulePromise = loadModule();

test('dimensions are parsed from a Sanity asset reference', async () => {
  const { parseSanityImageDimensions } = await modulePromise;

  assert.deepEqual(parseSanityImageDimensions('image-439b6709d65a3f49855ec184f4936c8a8c584f55-1390x479-png'), {
    width: 1390,
    height: 479,
    aspectRatio: 1390 / 479,
  });
  assert.equal(parseSanityImageDimensions('image-abc-png'), undefined);
  assert.equal(parseSanityImageDimensions(undefined), undefined);
});

test('standard and unknown images keep the 3:2 hero crop', async () => {
  const { shouldCropToHeroFrame } = await modulePromise;

  assert.equal(shouldCropToHeroFrame('image-abc-1200x800-jpg'), true);
  assert.equal(shouldCropToHeroFrame('image-abc-1200x706-jpg'), true);
  assert.equal(shouldCropToHeroFrame('image-abc-1000x1000-jpg'), true);
  assert.equal(shouldCropToHeroFrame(undefined), true);
});

test('panoramic banners are served without the hero crop', async () => {
  const { shouldCropToHeroFrame } = await modulePromise;

  assert.equal(shouldCropToHeroFrame('image-439b6709d65a3f49855ec184f4936c8a8c584f55-1390x479-png'), false);
  assert.equal(shouldCropToHeroFrame('image-abc-1920x1000-jpg'), false);
});

function loadModule() {
  const tempDir = mkdtempSync(join(tmpdir(), 'foundsm-image-dimensions-'));
  const outputPath = join(tempDir, 'sanityImageDimensions.mjs');

  buildSync({
    entryPoints: [new URL('../src/lib/sanityImageDimensions.ts', import.meta.url).pathname],
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
