#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const testToken = args.has('--test-token');
const projectId = 'vzneqxsx';
const dataset = 'staging';

const checks = [];

function add(status, label, detail) {
  checks.push({ status, label, detail });
}

function pass(label, detail) {
  add('PASS', label, detail);
}

function warn(label, detail) {
  add('WARN', label, detail);
}

function fail(label, detail) {
  add('FAIL', label, detail);
}

function fileExists(relativePath) {
  return existsSync(path.join(root, relativePath));
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), 'utf8'));
}

function parseEnvLocal() {
  const envPath = path.join(root, '.env.local');
  if (!existsSync(envPath)) {
    return null;
  }

  const env = {};
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

    env[key] = value;
  }

  return env;
}

function isPlaceholderToken(value) {
  if (!value) {
    return true;
  }

  const normalized = value.toLowerCase();
  return [
    'your-token',
    'your_sanity_write_token',
    'replace-me',
    'changeme',
    '<token>',
  ].some((placeholder) => normalized.includes(placeholder));
}

if (!fileExists('package.json')) {
  fail('Repo root', 'Run this checker from the foundsm-site repo root.');
} else {
  const pkg = readJson('package.json');
  if (pkg.name === 'foundsm-site') {
    pass('Repo root', 'package.json identifies foundsm-site.');
  } else {
    warn('Repo root', `package.json name is "${pkg.name || 'missing'}"; expected "foundsm-site".`);
  }

  const requiredMajor = 20;
  const actualMajor = Number(process.versions.node.split('.')[0]);
  if (actualMajor >= requiredMajor) {
    pass('Node version', `Node ${process.versions.node} satisfies >=${requiredMajor}.`);
  } else {
    fail('Node version', `Node ${process.versions.node} found; install Node ${requiredMajor} or newer.`);
  }

  const declaredSanityClient =
    pkg.dependencies?.['@sanity/client'] ||
    pkg.devDependencies?.['@sanity/client'];

  if (declaredSanityClient) {
    pass('@sanity/client dependency', `Declared as ${declaredSanityClient}.`);
  } else {
    fail('@sanity/client dependency', 'Missing from package.json dependencies.');
  }

  try {
    const requireFromRepo = createRequire(path.join(root, 'package.json'));
    requireFromRepo.resolve('@sanity/client');
    pass('Installed dependencies', '@sanity/client is resolvable from the repo.');
  } catch {
    fail('Installed dependencies', 'Run npm install so @sanity/client can be resolved.');
  }
}

const envLocal = parseEnvLocal();
let token = '';

if (!envLocal) {
  fail('.env.local', 'Create .env.local in the repo root.');
} else {
  pass('.env.local', '.env.local exists.');
  token = envLocal.SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || '';

  if (!envLocal.SANITY_WRITE_TOKEN) {
    if (envLocal.SANITY_TOKEN) {
      fail('SANITY_WRITE_TOKEN', 'SANITY_TOKEN is present, but marketing setup requires SANITY_WRITE_TOKEN.');
    } else {
      fail('SANITY_WRITE_TOKEN', 'Add SANITY_WRITE_TOKEN=... with a Sanity staging write token.');
    }
  } else if (isPlaceholderToken(envLocal.SANITY_WRITE_TOKEN)) {
    fail('SANITY_WRITE_TOKEN', 'SANITY_WRITE_TOKEN looks empty or placeholder-like.');
  } else {
    pass('SANITY_WRITE_TOKEN', 'SANITY_WRITE_TOKEN is present in .env.local.');
  }
}

const skillFiles = [
  '.codex/skills/foundsm-landing-page-one-shot/SKILL.md',
  '.codex/skills/foundsm-landing-page-component-editor/SKILL.md',
  '.codex/skills/foundsm-available-component-lister/SKILL.md',
  '.codex/skills/foundsm-design-system-police/SKILL.md',
  '.codex/skills/foundsm-page-builder-setup/SKILL.md',
  '.claude/skills/foundsm-landing-page-one-shot/SKILL.md',
  '.claude/skills/foundsm-landing-page-component-editor/SKILL.md',
  '.claude/skills/foundsm-available-component-lister/SKILL.md',
  '.claude/skills/foundsm-design-system-police/SKILL.md',
  '.claude/skills/foundsm-page-builder-setup/SKILL.md',
];

for (const skillFile of skillFiles) {
  if (fileExists(skillFile)) {
    pass('Skill entrypoint', `${skillFile} exists.`);
  } else {
    fail('Skill entrypoint', `${skillFile} is missing.`);
  }
}

const draftWriters = [
  '.codex/skills/foundsm-landing-page-one-shot/scripts/create-sanity-landing-page-draft.mjs',
  '.claude/skills/foundsm-landing-page-one-shot/scripts/create-sanity-landing-page-draft.mjs',
];

for (const draftWriter of draftWriters) {
  if (fileExists(draftWriter)) {
    pass('Draft writer', `${draftWriter} exists.`);
  } else {
    fail('Draft writer', `${draftWriter} is missing.`);
  }
}

if (testToken) {
  if (!token || isPlaceholderToken(token)) {
    fail('Sanity staging token test', 'Cannot test because SANITY_WRITE_TOKEN is missing or placeholder-like.');
  } else {
    try {
      const { createClient } = await import('@sanity/client');
      const client = createClient({
        projectId,
        dataset,
        apiVersion: '2024-01-01',
        token,
        useCdn: false,
      });

      await client.fetch('count(*[_type == "landingPage"][0...1])');
      pass('Sanity staging token test', 'Token can read the staging dataset. Write permission is checked when drafts are created.');
    } catch (error) {
      fail('Sanity staging token test', `Could not read staging dataset: ${error.message}`);
    }
  }
} else {
  warn('Sanity staging token test', 'Skipped. Run with --test-token only when the user asks to verify Sanity connectivity.');
}

const failed = checks.filter((check) => check.status === 'FAIL');
const warnings = checks.filter((check) => check.status === 'WARN');

console.log('FoundSM page-builder setup check');
console.log(`Project: ${projectId}`);
console.log(`Dataset: ${dataset}`);
console.log('');

for (const check of checks) {
  console.log(`[${check.status}] ${check.label}: ${check.detail}`);
}

console.log('');
console.log(`Summary: ${checks.length - failed.length - warnings.length} pass, ${warnings.length} warn, ${failed.length} fail`);

if (failed.length > 0) {
  console.log('');
  console.log('The FoundSM page-builder skills are not ready yet. Please fix the FAIL items above and rerun this setup check.');
  process.exit(1);
}

console.log('');
console.log('The FoundSM page-builder skills are ready for staging draft creation.');
