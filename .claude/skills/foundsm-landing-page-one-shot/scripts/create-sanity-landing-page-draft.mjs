#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@sanity/client';

const args = process.argv.slice(2);
const [jsonPath] = args;

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separator = trimmed.indexOf('=');
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] ||= value;
  }
}

loadEnvLocal();

const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_TOKEN;

if (args.includes('--help') || !jsonPath || !token) {
  const output = args.includes('--help') ? console.log : console.error;
  output(`
Usage:
  bun scripts/create-sanity-landing-page-draft.mjs <landing-page.json>

Creates or replaces and publishes a landingPage in the Sanity staging dataset.
Requires SANITY_WRITE_TOKEN in the repo root .env.local file or process environment.
This script never writes to production.
`);
  process.exit(args.includes('--help') ? 0 : 1);
}

const projectId = 'vzneqxsx';
const dataset = 'staging';
const apiVersion = '2024-01-01';

function slugToId(slug) {
  return `landing-page-${slug}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

const source = JSON.parse(await readFile(jsonPath, 'utf8'));

if (source._type !== 'landingPage') {
  throw new Error(`Expected _type "landingPage"; received "${source._type || 'missing'}".`);
}

const slug = source.slug?.current;
if (!slug) {
  throw new Error('Expected slug.current to be set.');
}

const publishedId = source._id?.startsWith('drafts.')
  ? source._id.slice('drafts.'.length)
  : source._id || slugToId(slug);

const published = {
  ...source,
  _id: publishedId,
  _type: 'landingPage',
};

delete published._rev;
delete published._createdAt;
delete published._updatedAt;

const draftId = `drafts.${publishedId}`;

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const result = await client
  .transaction()
  .createOrReplace(published)
  .delete(draftId)
  .commit({ visibility: 'sync' });

console.log(JSON.stringify({
  dataset,
  documentId: publishedId,
  deletedDraftId: draftId,
  transactionId: result.transactionId,
  title: published.title,
  slug,
  studioHint: 'Open the staging Studio to review the published staging Landing Page.',
}, null, 2));
