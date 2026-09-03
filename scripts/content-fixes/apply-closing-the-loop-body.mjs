// Applies closing-the-loop-body.json to a Sanity dataset and publishes it.
//
//   SANITY_WRITE_TOKEN=... node scripts/content-fixes/apply-closing-the-loop-body.mjs --dataset staging
//   SANITY_WRITE_TOKEN=... node scripts/content-fixes/apply-closing-the-loop-body.mjs --dataset production
//
// Regenerate the JSON first with build-closing-the-loop-body.mjs.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@sanity/client';

const DOC_ID = 'post-closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing';

const datasetIndex = process.argv.indexOf('--dataset');
const dataset = datasetIndex === -1 ? '' : process.argv[datasetIndex + 1];
if (!['staging', 'production'].includes(dataset)) {
  console.error('Usage: apply-closing-the-loop-body.mjs --dataset <staging|production>');
  process.exit(1);
}

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error('SANITY_WRITE_TOKEN is required (Editor access to the target dataset).');
  process.exit(1);
}

const body = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'closing-the-loop-body.json'), 'utf8'));

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'vzneqxsx',
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const published = await client.getDocument(DOC_ID);
if (!published) throw new Error(`${DOC_ID} not found in ${dataset}`);

await client.createOrReplace({ ...published, _id: `drafts.${DOC_ID}`, body });
await client
  .transaction()
  .createOrReplace({ ...published, body })
  .delete(`drafts.${DOC_ID}`)
  .commit();

console.log(`Published ${body.length} blocks to ${dataset}.`);
