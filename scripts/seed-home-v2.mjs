#!/usr/bin/env node
/*
  Seeds the October 2026 homepage content into the Sanity `homePage` document,
  so the Studio becomes the source of truth for the copy that started life in
  src/lib/homeV2Content.ts.

  Usage:
    node scripts/seed-home-v2.mjs [--dataset staging|production] [--dry-run]
         [--hero-video path.mp4] [--hero-poster path.jpg] [--replace-images]

  - Reads SANITY_WRITE_TOKEN from the environment or .env.local (never printed).
  - Idempotent: practice images, the team image and the hero film already on the
    document are kept unless --replace-images / --hero-video / --hero-poster.
  - When the document has no hero film yet, it links the newest uploaded asset
    named FoundSM-Loop-hero-1280x720.mp4 (and the matching poster).
  - A draft of the document, if any, receives the same patch so publishing it
    later does not roll the content back.
*/

import { createClient } from '@sanity/client';
import { buildSync } from 'esbuild';
import { createReadStream, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
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

const { homeV2Content: content } = await loadContent();

const doc = await client.fetch(`*[_id == "homePage"][0]{
  _id,
  "introImage": intro.image.asset._ref,
  "practiceImages": practices.items[].image.asset._ref,
  "teamImage": team.image.asset._ref,
  "heroVideo": hero.videoFile.asset._ref,
  "heroPoster": hero.videoPoster.asset._ref
}`);
if (!doc) fail(`No homePage document in the ${dataset} dataset.`);
const hasDraft = Boolean(await client.fetch('defined(*[_id == "drafts.homePage"][0]._id)'));

/* ---- assets ---------------------------------------------------------- */

const uploads = [];
const uploadAsset = async (kind, file) => {
  if (!existsSync(file)) fail(`Missing file: ${file}`);
  uploads.push(`${kind}: ${basename(file)}`);
  if (dryRun) return `(new ${kind} asset from ${basename(file)})`;
  const asset = await client.assets.upload(kind, createReadStream(file), { filename: basename(file) });
  return asset._id;
};
const latestAssetId = (type, filename) =>
  client.fetch('*[_type == $type && originalFilename == $filename] | order(_createdAt desc)[0]._id', { type, filename });

const practiceImageRefs = [];
for (const [index, item] of content.practices.items.entries()) {
  const existing = doc.practiceImages?.[index];
  if (existing && !args['replace-images']) {
    practiceImageRefs.push(existing);
    continue;
  }
  practiceImageRefs.push(await uploadAsset('image', join(root, 'public', item.image.src)));
}

const heroVideoRef = args['hero-video']
  ? await uploadAsset('file', resolve(String(args['hero-video'])))
  : doc.heroVideo || (await latestAssetId('sanity.fileAsset', 'FoundSM-Loop-hero-1280x720.mp4'));
const heroPosterRef = args['hero-poster']
  ? await uploadAsset('image', resolve(String(args['hero-poster'])))
  : doc.heroPoster || (await latestAssetId('sanity.imageAsset', 'FoundSM-Loop-hero-poster.jpg'));
const teamImageRef = doc.teamImage || doc.introImage;

/* ---- the patch -------------------------------------------------------- */

const ref = (id) => ({ _type: 'reference', _ref: id });
const image = (id) => (id ? { _type: 'image', asset: ref(id) } : undefined);
const keyed = (prefix) => (item, index) => ({ _key: `${prefix}-${index + 1}`, ...item });
const cta = (link) => ({ ctaText: link.label, ctaUrl: link.href });
const compact = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined));

const set = compact({
  'hero.eyebrow': content.hero.eyebrow,
  'hero.headlineLines': content.hero.headlineLines,
  'hero.subheadline': content.hero.body,
  'hero.ctaText': content.hero.cta.label,
  'hero.ctaUrl': content.hero.cta.href,
  'hero.videoLabel': content.hero.videoLabel,
  'hero.videoFile': heroVideoRef ? { _type: 'file', asset: ref(heroVideoRef) } : undefined,
  'hero.videoPoster': image(heroPosterRef),
  'clientLogos.heading': content.work.logosHeading,
  'metrics.spend.label': content.proof.spendLabel,
  'metrics.leads.label': content.proof.leadsLabel,
  'metrics.experience.suffix': '+ years',
  'metrics.experience.label': content.proof.experienceLabel,
  practices: {
    eyebrow: content.practices.eyebrow,
    heading: content.practices.heading,
    intro: content.practices.intro,
    items: content.practices.items.map((item, index) =>
      keyed('practice')(
        compact({
          title: item.title,
          body: item.body,
          ...cta(item.cta),
          image: image(practiceImageRefs[index]),
          imageAlt: item.image.alt,
        }),
        index,
      ),
    ),
  },
  loop: {
    eyebrow: content.loop.eyebrow,
    heading: content.loop.heading,
    intro: content.loop.intro,
    stages: content.loop.stages.map(keyed('stage')),
  },
  ai: {
    eyebrow: content.ai.eyebrow,
    heading: content.ai.heading,
    intro: content.ai.intro,
    columns: content.ai.columns.map(keyed('ai')),
  },
  work: {
    eyebrow: content.work.eyebrow,
    heading: content.work.heading,
    body: content.work.body,
    ...cta(content.work.cta),
  },
  engage: {
    eyebrow: content.engage.eyebrow,
    heading: content.engage.heading,
    intro: content.engage.intro,
    tiles: content.engage.tiles.map(keyed('tile')),
    outro: content.engage.outro,
    ...cta(content.engage.cta),
    existing: {
      eyebrow: content.engage.existing.eyebrow,
      heading: content.engage.existing.heading,
      body: content.engage.existing.body,
      ...cta(content.engage.existing.cta),
    },
  },
  team: compact({
    eyebrow: content.team.eyebrow,
    heading: content.team.heading,
    lead: content.team.lead,
    body: content.team.body,
    ...cta(content.team.cta),
    image: image(teamImageRef),
    imageAlt: content.team.imageAlt,
  }),
  research: {
    eyebrow: content.research.eyebrow,
    brief: {
      heading: content.research.brief.heading,
      intro: content.research.brief.intro,
      issueLabel: content.research.brief.issueLabel,
      title: content.research.brief.title,
      dek: content.research.brief.dek,
      contentsHeading: content.research.brief.contentsHeading,
      contents: content.research.brief.contents,
      ...cta(content.research.brief.cta),
      subscribeLabel: content.research.brief.subscribeLabel,
      subscribeButton: content.research.brief.subscribeButton,
      subscribeSuccess: content.research.brief.subscribeSuccess,
      subscribeError: content.research.brief.subscribeError,
    },
    signals: {
      heading: content.research.signals.heading,
      intro: content.research.signals.intro,
      note: content.research.signals.note,
      allLinkText: content.research.signals.allLink.label,
      allLinkUrl: content.research.signals.allLink.href,
      drafts: content.research.signals.drafts.map((item, index) =>
        keyed('signal')(compact({ label: item.label, title: item.title, summary: item.summary, url: item.href }), index),
      ),
    },
  },
  recognition: {
    eyebrow: content.recognition.eyebrow,
    heading: content.recognition.heading,
    intro: content.recognition.intro,
    cards: content.recognition.cards.map(keyed('card')),
  },
  talk: {
    eyebrow: content.talk.eyebrow,
    heading: content.talk.heading,
    intro: content.talk.intro,
    nameLabel: content.talk.fields.name,
    emailLabel: content.talk.fields.email,
    notesLabel: content.talk.fields.notes,
    button: content.talk.button,
    success: content.talk.success,
    error: content.talk.error,
  },
});

/* ---- apply ------------------------------------------------------------ */

console.log(`Dataset: ${dataset}${dryRun ? ' (dry run)' : ''}`);
console.log(`Fields set: ${Object.keys(set).length}; uploads: ${uploads.length ? uploads.join(', ') : 'none'}`);
console.log(`Hero film: ${heroVideoRef || 'none'}; poster: ${heroPosterRef || 'none'}; team image: ${teamImageRef || 'none'}`);
console.log(`Practice images: ${practiceImageRefs.join(', ')}`);
if (hasDraft) console.log('A draft exists and receives the same patch.');

if (dryRun) {
  console.log(JSON.stringify(set, null, 2));
  process.exit(0);
}

let transaction = client.transaction().patch('homePage', (patch) => patch.set(set));
if (hasDraft) transaction = transaction.patch('drafts.homePage', (patch) => patch.set(set));
const result = await transaction.commit();
console.log(`Done. Transaction ${result.transactionId}.`);

/* ---- helpers ---------------------------------------------------------- */

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
  const dir = mkdtempSync(join(tmpdir(), 'foundsm-home-v2-'));
  const outfile = join(dir, 'homeV2Content.mjs');
  buildSync({
    entryPoints: [join(root, 'src/lib/homeV2Content.ts')],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  });
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
