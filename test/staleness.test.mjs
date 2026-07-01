import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { buildSync } from 'esbuild';

const modulePromise = loadStalenessModule();

test('staleness treats posts under twelve months as fresh', async () => {
  const { getStaleness } = await modulePromise;
  const result = getStaleness({
    publishedAt: '2025-08-01T00:00:00.000Z',
    now: '2026-07-01T00:00:00.000Z',
  });

  assert.equal(result.level, 'fresh');
  assert.equal(result.showReviewLine, false);
  assert.equal(result.showNotice, false);
});

test('staleness shows a quiet review line after twelve months', async () => {
  const { getStaleness } = await modulePromise;
  const result = getStaleness({
    publishedAt: '2025-06-01T00:00:00.000Z',
    now: '2026-07-01T00:00:00.000Z',
  });

  assert.equal(result.level, 'reviewed');
  assert.equal(result.freshnessSource, 'publishedAt');
  assert.equal(result.showReviewLine, true);
  assert.equal(result.showNotice, false);
});

test('staleness shows the full notice after eighteen months', async () => {
  const { getStaleness } = await modulePromise;
  const result = getStaleness({
    publishedAt: '2025-01-01T00:00:00.000Z',
    now: '2026-07-01T00:00:00.000Z',
  });

  assert.equal(result.level, 'stale');
  assert.equal(result.showReviewLine, false);
  assert.equal(result.showNotice, true);
});

test('lastReviewed resets the freshness clock', async () => {
  const { getStaleness } = await modulePromise;
  const result = getStaleness({
    publishedAt: '2020-01-01T00:00:00.000Z',
    lastReviewed: '2026-01-02T00:00:00.000Z',
    now: '2026-07-01T00:00:00.000Z',
  });

  assert.equal(result.level, 'fresh');
  assert.equal(result.freshnessSource, 'lastReviewed');
  assert.equal(result.showNotice, false);
});

test('evergreen posts never show stale UI', async () => {
  const { getStaleness } = await modulePromise;
  const result = getStaleness({
    publishedAt: '2020-01-01T00:00:00.000Z',
    evergreen: true,
    now: '2026-07-01T00:00:00.000Z',
  });

  assert.equal(result.level, 'fresh');
  assert.equal(result.showReviewLine, false);
  assert.equal(result.showNotice, false);
});

test('content date labels use UTC calendar dates', async () => {
  const { formatContentDate } = await modulePromise;

  assert.equal(formatContentDate('2025-01-01T00:00:00.000Z'), 'January 1, 2025');
});

function loadStalenessModule() {
  const tempDir = mkdtempSync(join(tmpdir(), 'foundsm-staleness-'));
  const outputPath = join(tempDir, 'staleness.mjs');

  buildSync({
    entryPoints: [new URL('../src/lib/staleness.ts', import.meta.url).pathname],
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
