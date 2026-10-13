#!/usr/bin/env node
/*
  Seeds the AI hub content (src/lib/aiPageData.ts) into the Sanity `aiPage`
  singleton, so the Studio holds the copy the page renders.

  Usage:
    node scripts/seed-ai-page.mjs [--dataset staging|production] [--dry-run]

  - Reads SANITY_WRITE_TOKEN from the environment or .env.local (never printed).
  - Creates the document if missing, then sets every text field. Images are
    left alone: the page falls back to the default images until an editor
    uploads one in the Studio.
  - A draft of the document, if any, receives the same patch.
*/

import { createClient } from '@sanity/client';
import { buildSync } from 'esbuild';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const args = parseArgs(process.argv.slice(2));
const dataset = String(args.dataset || 'staging');
const dryRun = Boolean(args['dry-run']);
const token = process.env.SANITY_WRITE_TOKEN || readEnvToken();

if (!['staging', 'production'].includes(dataset)) fail(`Unknown dataset "${dataset}".`);
if (!token && !dryRun) fail('SANITY_WRITE_TOKEN is missing (set it in the environment or .env.local).');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'vzneqxsx',
  dataset,
  apiVersion: '2024-01-01',
  token: token || undefined,
  useCdn: false,
});

const { defaultAiPageData: d } = await loadContent();

let keyCounter = 0;
const key = (prefix) => `${prefix}-${++keyCounter}`;
const withKeys = (blocks = [], prefix) =>
  blocks.map((b) => ({
    ...b,
    _key: key(prefix),
    markDefs: b.markDefs || [],
    children: (b.children || []).map((child) => ({ _type: 'span', marks: [], ...child, _key: key(`${prefix}s`) })),
  }));
const link = (cta) => (cta ? { label: cta.label, href: cta.href } : undefined);
const items = (list = [], prefix) =>
  list.map((item) => compact({ _key: key(prefix), title: item.title, body: item.body, cta: link(item.cta) }));
const compact = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));

const set = {
  seoTitle: d.seoTitle,
  seoDescription: d.seoDescription,
  canonicalUrl: d.canonicalUrl,
  robots: d.robots,
  'hero.eyebrow': d.hero.eyebrow,
  'hero.heading': d.hero.heading,
  'hero.body': withKeys(d.hero.body, 'hero'),
  'hero.cta': link(d.hero.cta),
  'hero.imageAlt': d.hero.imageAlt,
  'callout.lead': d.callout.lead,
  'callout.body': withKeys(d.callout.body, 'callout'),
  'callout.cta': link(d.callout.cta),
  'systems.eyebrow': d.systems.eyebrow,
  'systems.heading': d.systems.heading,
  'systems.intro': d.systems.intro,
  'systems.items': items(d.systems.items, 'area'),
  'process.eyebrow': d.process.eyebrow,
  'process.heading': d.process.heading,
  'process.steps': items(d.process.steps, 'step'),
  'paidMedia.eyebrow': d.paidMedia.eyebrow,
  'paidMedia.heading': d.paidMedia.heading,
  'paidMedia.body': withKeys(d.paidMedia.body, 'paid'),
  'paidMedia.cta': link(d.paidMedia.cta),
  'paidMedia.secondaryCta': link(d.paidMedia.secondaryCta),
  'paidMedia.imageAlt': d.paidMedia.imageAlt,
  'closing.heading': d.closing.heading,
  'closing.body': d.closing.body,
  'closing.cta': link(d.closing.cta),
  'closing.secondaryCta': link(d.closing.secondaryCta),
};

const hasDraft = dryRun ? false : Boolean(await client.fetch('defined(*[_id == "drafts.aiPage"][0]._id)'));
console.log(`Dataset: ${dataset}${dryRun ? ' (dry run)' : ''}; fields: ${Object.keys(set).length}${hasDraft ? '; draft gets the same patch' : ''}`);
if (dryRun) {
  console.log(JSON.stringify(set, null, 2));
  process.exit(0);
}

let transaction = client
  .transaction()
  .createIfNotExists({ _id: 'aiPage', _type: 'aiPage' })
  .patch('aiPage', (patch) => patch.set(set));
if (hasDraft) transaction = transaction.patch('drafts.aiPage', (patch) => patch.set(set));
const result = await transaction.commit();
console.log(`Done. Transaction ${result.transactionId}.`);

function parseArgs(list) {
  const out = {};
  for (let i = 0; i < list.length; i++) {
    const arg = list[i];
    if (!arg.startsWith('--')) continue;
    const next = list[i + 1];
    if (next && !next.startsWith('--')) {
      out[arg.slice(2)] = next;
      i++;
    } else {
      out[arg.slice(2)] = true;
    }
  }
  return out;
}

function readEnvToken() {
  const file = join(root, '.env.local');
  if (!existsSync(file)) return '';
  const match = readFileSync(file, 'utf8').match(/^SANITY_WRITE_TOKEN=\s*["']?([^"'\s]+)/m);
  return match ? match[1] : '';
}

async function loadContent() {
  const dir = mkdtempSync(join(tmpdir(), 'foundsm-ai-page-'));
  const outfile = join(dir, 'aiPageData.mjs');
  buildSync({ entryPoints: [join(root, 'src/lib/aiPageData.ts')], outfile, bundle: true, format: 'esm', platform: 'node', logLevel: 'silent' });
  try {
    return await import(pathToFileURL(outfile).href);
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
