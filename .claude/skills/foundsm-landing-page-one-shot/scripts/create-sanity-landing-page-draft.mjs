#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@sanity/client';

const [jsonPath] = process.argv.slice(2);

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

if (!jsonPath || !token) {
  console.error(`
Usage:
  node scripts/create-sanity-landing-page-draft.mjs <landing-page.json>

Creates or replaces an unpublished landingPage draft in the Sanity staging dataset.
Requires SANITY_WRITE_TOKEN in the repo root .env.local file or process environment.
This script never writes to production and never publishes documents.
`);
  process.exit(1);
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

const draft = {
  ...source,
  _id: `drafts.${publishedId}`,
  _type: 'landingPage',
};

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const result = await client.createOrReplace(draft);

console.log(JSON.stringify({
  dataset,
  draftId: result._id,
  title: result.title,
  slug,
  studioHint: 'Open the staging Studio and look for this unpublished Landing Page draft.',
}, null, 2));
