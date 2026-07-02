#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const supportedTypes = new Set([
  'modernHeroBlock',
  'splitFeatureBlock',
  'featureTabsBlock',
  'cardGridBlock',
  'statementBandBlock',
  'modernCtaBlock',
  'proofMosaicBlock',
  'formLandingBlock',
  'accordionBlock',
  'peopleGridBlock',
  'eventHeroBlock',
  'heroBlock',
  'statsBlock',
  'featuresBlock',
  'testimonialBlock',
  'ctaBlock',
  'formBlock',
  'textBlock',
  'imageTextBlock',
  'logoBarBlock',
  'faqBlock',
]);

const tokenRules = {
  modernHeroBlock: {
    layoutPreset: { values: ['split', 'textOnly'], defaultValue: 'split' },
    tone: { values: ['light', 'soft', 'dark'], defaultValue: 'soft' },
    titleScale: { values: ['default', 'display'], defaultValue: 'default' },
    imageShape: { values: ['rounded', 'circle', 'plain'], defaultValue: 'rounded' },
    imageFit: { values: ['cover', 'contain'], defaultValue: 'cover' },
    sizePreset: { values: ['compact', 'standard', 'spacious'], defaultValue: 'standard' },
  },
  splitFeatureBlock: {
    imagePosition: { values: ['left', 'right'], defaultValue: 'right' },
    mediaHeight: { values: ['standard', 'short', 'hero'], defaultValue: 'standard' },
    theme: { values: ['light', 'muted', 'dark'], defaultValue: 'light' },
  },
  featureTabsBlock: {
    theme: { values: ['light', 'muted'], defaultValue: 'muted' },
    layoutPreset: { values: ['mediaPanel', 'badgePanel', 'ecosystem'], defaultValue: 'mediaPanel' },
    autoRotate: { values: [true, false], defaultValue: false },
  },
  cardGridBlock: {
    columns: { values: [2, 3, 4], defaultValue: 3 },
    theme: { values: ['light', 'muted', 'dark'], defaultValue: 'light' },
    variant: {
      values: ['standard', 'icon', 'numbered', 'credential', 'topic', 'benefit'],
      defaultValue: 'standard',
    },
    density: { values: ['compact', 'standard'], defaultValue: 'standard' },
  },
  statementBandBlock: {
    theme: { values: ['dark', 'muted', 'light'], defaultValue: 'dark' },
    pattern: { values: [true, false], defaultValue: false },
    width: { values: ['default', 'narrow'], defaultValue: 'default' },
  },
  modernCtaBlock: {
    theme: { values: ['dark', 'green', 'light', 'white'], defaultValue: 'green' },
    align: { values: ['split', 'centered'], defaultValue: 'split' },
    layoutPreset: { values: ['panel', 'strip', 'compact'], defaultValue: 'panel' },
  },
  proofMosaicBlock: {
    theme: { values: ['light', 'dark'], defaultValue: 'light' },
    layoutPreset: { values: ['mosaic', 'compact'], defaultValue: 'mosaic' },
  },
  formLandingBlock: {
    variant: { values: ['contact', 'newsletter', 'resource', 'event'], defaultValue: 'contact' },
    theme: { values: ['light', 'dark', 'muted'], defaultValue: 'dark' },
    showFormCard: { values: [true, false], defaultValue: true },
  },
  accordionBlock: {
    theme: { values: ['light', 'muted', 'dark'], defaultValue: 'light' },
    layoutPreset: { values: ['singleColumn', 'twoColumn'], defaultValue: 'twoColumn' },
  },
  peopleGridBlock: {
    layout: { values: ['centered', 'split'], defaultValue: 'centered' },
    showImages: { values: [true, false], defaultValue: true },
  },
  eventHeroBlock: {
    theme: { values: ['dark', 'green', 'light'], defaultValue: 'dark' },
  },
  logoBarBlock: {
    displayMode: { values: ['static', 'marquee'], defaultValue: 'static' },
    theme: { values: ['light', 'muted'], defaultValue: 'light' },
    density: { values: ['compact', 'standard'], defaultValue: 'standard' },
  },
};

const rawStyleFields = new Set([
  'className',
  'css',
  'customCss',
  'styles',
  'inlineStyle',
  'backgroundColor',
  'color',
  'textColor',
  'titleColor',
  'subtitleColor',
  'descriptionColor',
  'fontSize',
  'titleSize',
  'subtitleSize',
  'descriptionSize',
  'fontWeight',
  'titleWeight',
  'subtitleWeight',
  'descriptionWeight',
  'breakpoints',
  'responsive',
  'layoutCss',
]);

const args = process.argv.slice(2);

if (args.includes('--help') || args.length === 0) {
  printUsage();
  process.exit(args.length === 0 ? 1 : 0);
}

const inputPath = args[0];
const outPath = readFlag('--out');
const reportPath = readFlag('--report');
const reportFormat = readFlag('--format') || 'text';

const report = {
  ok: false,
  changed: false,
  inputPath: path.resolve(inputPath),
  outputPath: outPath ? path.resolve(outPath) : null,
  reportPath: reportPath ? path.resolve(reportPath) : null,
  fixes: [],
  warnings: [],
  errors: [],
};

let doc;

try {
  doc = JSON.parse(readFileSync(inputPath, 'utf8'));
} catch (error) {
  hard('$', `Could not read or parse JSON: ${error.message}`);
  finish();
}

if (!isPlainObject(doc)) {
  hard('$', 'Landing page JSON must be an object.');
  finish();
}

validateDocument(doc);
stripRawStyling(doc, '$');
normalizeMedia(doc, '$');
addArrayKeys(doc, '$');

report.ok = report.errors.length === 0;

if (report.ok && outPath) {
  writeFileSync(outPath, `${JSON.stringify(doc, null, 2)}\n`);
}

finish();

function validateDocument(page) {
  if (!page._type) {
    page._type = 'landingPage';
    fix('$._type', 'Set missing root _type to landingPage.');
  } else if (page._type !== 'landingPage') {
    hard('$._type', `Unsupported root _type "${page._type}". Expected landingPage.`);
  }

  if (!hasString(page.title)) {
    hard('$.title', 'Missing required landing page title.');
  }

  if (!isPlainObject(page.slug)) {
    if (hasString(page.slug)) {
      page.slug = { _type: 'slug', current: slugify(page.slug) };
      fix('$.slug', 'Converted string slug to Sanity slug object.');
    } else if (hasString(page.title)) {
      page.slug = { _type: 'slug', current: slugify(page.title) };
      fix('$.slug', 'Created slug from landing page title.');
    } else {
      hard('$.slug', 'Missing slug and no title is available to infer one.');
    }
  }

  if (isPlainObject(page.slug)) {
    if (!page.slug._type) {
      page.slug._type = 'slug';
      fix('$.slug._type', 'Set missing slug _type.');
    }

    const normalizedSlug = slugify(page.slug.current || page.title || '');
    if (!normalizedSlug) {
      hard('$.slug.current', 'Slug is empty after normalization.');
    } else if (page.slug.current !== normalizedSlug) {
      page.slug.current = normalizedSlug;
      fix('$.slug.current', `Normalized slug to "${normalizedSlug}".`);
    }
  }

  if (!Array.isArray(page.sections) || page.sections.length === 0) {
    hard('$.sections', 'Landing page must include at least one section.');
    return;
  }

  if (!hasString(page.seoTitle) && hasString(page.title)) {
    page.seoTitle = page.title;
    fix('$.seoTitle', 'Set missing SEO title from page title.');
  }

  if (!hasString(page.seoDescription)) {
    const description = summarizeText(page.sections);
    if (description) {
      page.seoDescription = description;
      fix('$.seoDescription', 'Set missing SEO description from section copy.');
    }
  } else if (page.seoDescription.length > 180) {
    page.seoDescription = trimSentence(page.seoDescription, 180);
    fix('$.seoDescription', 'Trimmed SEO description to 180 characters.');
  }

  page.sections.forEach((section, index) => {
    const sectionPath = `$.sections[${index}]`;

    if (!isPlainObject(section)) {
      hard(sectionPath, 'Section must be an object.');
      return;
    }

    if (!supportedTypes.has(section._type)) {
      hard(`${sectionPath}._type`, `Unsupported section _type "${section._type || 'missing'}".`);
      return;
    }

    applyTokenRules(section, sectionPath);
    validateSection(section, sectionPath);
  });
}

function validateSection(section, sectionPath) {
  switch (section._type) {
    case 'modernHeroBlock':
      requireText(section, 'title', sectionPath);
      requirePortableText(section, 'intro', sectionPath);
      ensureCta(section, sectionPath, true);
      if (section.secondaryCta) {
        ensureNamedCta(section, 'secondaryCta', sectionPath, false);
      }
      break;
    case 'splitFeatureBlock':
      requireText(section, 'title', sectionPath);
      requirePortableText(section, 'body', sectionPath);
      ensureCta(section, sectionPath, false);
      break;
    case 'featureTabsBlock':
      requireText(section, 'title', sectionPath);
      if (section.idPrefix && section.idPrefix !== slugify(section.idPrefix)) {
        section.idPrefix = slugify(section.idPrefix);
        fix(`${sectionPath}.idPrefix`, 'Normalized idPrefix to lowercase letters, numbers, and hyphens.');
      } else if (!section.idPrefix) {
        section.idPrefix = slugify(section.title || 'feature-tabs');
        fix(`${sectionPath}.idPrefix`, 'Created missing idPrefix from section title or feature-tabs default.');
      }
      validateTitledRichTextArray(section, 'tabs', sectionPath);
      validateNestedCtas(section.tabs, sectionPath, 'tabs');
      break;
    case 'cardGridBlock':
      requireText(section, 'title', sectionPath);
      validateTitledRichTextArray(section, 'cards', sectionPath);
      validateNestedCtas(section.cards, sectionPath, 'cards');
      break;
    case 'statementBandBlock':
      requireText(section, 'lead', sectionPath);
      requirePortableText(section, 'body', sectionPath);
      break;
    case 'modernCtaBlock':
      requireText(section, 'title', sectionPath);
      normalizePortableText(section, 'body', sectionPath, false);
      ensureCta(section, sectionPath, true);
      break;
    case 'proofMosaicBlock':
      requireText(section, 'title', sectionPath);
      validateMetrics(section, sectionPath);
      validateQuote(section, sectionPath);
      validateFeatureCard(section, sectionPath);
      break;
    case 'formLandingBlock':
      requireText(section, 'title', sectionPath);
      normalizePortableText(section, 'intro', sectionPath, true);
      normalizePortableText(section, 'summary', sectionPath, false);
      requireText(section, 'hubspotFormId', sectionPath);
      break;
    case 'accordionBlock':
      requireText(section, 'title', sectionPath);
      normalizePortableText(section, 'body', sectionPath, false);
      validateTitledRichTextArray(section, 'items', sectionPath);
      break;
    case 'peopleGridBlock':
      requireText(section, 'title', sectionPath);
      normalizePortableText(section, 'intro', sectionPath, false);
      validatePeople(section, sectionPath);
      break;
    case 'eventHeroBlock':
      validateEventHero(section, sectionPath);
      break;
    case 'logoBarBlock':
      validateLogoBar(section, sectionPath);
      break;
    default:
      normalizeGenericBlock(section, sectionPath);
      break;
  }
}

function validateMetrics(section, sectionPath) {
  if (!Array.isArray(section.metrics) || section.metrics.length === 0) {
    warn(`${sectionPath}.metrics`, 'proofMosaicBlock has no metrics. Add metrics when proof is available.');
    return;
  }

  section.metrics.forEach((metric, index) => {
    const itemPath = `${sectionPath}.metrics[${index}]`;
    if (!isPlainObject(metric)) {
      hard(itemPath, 'Metric item must be an object.');
      return;
    }
    requireText(metric, 'value', itemPath);
    requireText(metric, 'label', itemPath);
  });
}

function validateQuote(section, sectionPath) {
  if (!section.quote) {
    return;
  }

  if (!isPlainObject(section.quote)) {
    hard(`${sectionPath}.quote`, 'quote must be an object.');
    return;
  }

  if (!hasString(section.quote.text)) {
    warn(`${sectionPath}.quote.text`, 'Quote is present without quote text.');
  }
}

function validateFeatureCard(section, sectionPath) {
  if (!section.featureCard) {
    return;
  }

  if (!isPlainObject(section.featureCard)) {
    hard(`${sectionPath}.featureCard`, 'featureCard must be an object.');
    return;
  }

  requireText(section.featureCard, 'title', `${sectionPath}.featureCard`);
  normalizePortableText(section.featureCard, 'body', `${sectionPath}.featureCard`, false);
  ensureNamedCta(section.featureCard, 'cta', `${sectionPath}.featureCard`, false);
}

function validatePeople(section, sectionPath) {
  const peoplePath = `${sectionPath}.people`;

  if (!Array.isArray(section.people) || section.people.length === 0) {
    hard(peoplePath, 'peopleGridBlock must include at least one person.');
    return;
  }

  section.people.forEach((person, index) => {
    const personPath = `${peoplePath}[${index}]`;
    if (!isPlainObject(person)) {
      hard(personPath, 'Person item must be an object.');
      return;
    }
    requireText(person, 'name', personPath);
    requireText(person, 'role', personPath);
  });
}

function validateEventHero(section, sectionPath) {
  if (!Array.isArray(section.titleLines) || section.titleLines.filter(hasString).length === 0) {
    if (hasString(section.title)) {
      section.titleLines = [section.title];
      fix(`${sectionPath}.titleLines`, 'Created titleLines from legacy title.');
    } else {
      hard(`${sectionPath}.titleLines`, 'eventHeroBlock must include at least one title line.');
    }
  }

  requireText(section, 'description', sectionPath);
  ensureNamedCta(section, 'primaryCta', sectionPath, true);
  ensureNamedCta(section, 'secondaryCta', sectionPath, false);

  validateLabelValueArray(section, 'meta', sectionPath, false);
  validateLabelValueArray(section, 'stats', sectionPath, false);

  if (section.chips !== undefined) {
    if (!Array.isArray(section.chips)) {
      hard(`${sectionPath}.chips`, 'chips must be an array of text labels.');
    } else {
      section.chips = section.chips.filter(hasString);
    }
  }
}

function validateLogoBar(section, sectionPath) {
  const logosPath = `${sectionPath}.logos`;

  if (!Array.isArray(section.logos) || section.logos.length === 0) {
    hard(logosPath, 'logoBarBlock must include at least one logo.');
    return;
  }

  section.logos.forEach((logo, index) => {
    const logoPath = `${logosPath}[${index}]`;
    if (!isPlainObject(logo)) {
      hard(logoPath, 'Logo item must be an object.');
      return;
    }

    const hasLegacyImageAlt = hasString(logo.alt);
    const hasObjectName = hasString(logo.name);
    const hasAnyMedia = Boolean(logo.asset || logo.image || logo.videoFile || logo.videoUrl || logo.url);

    if (!hasLegacyImageAlt && !hasObjectName) {
      hard(logoPath, 'Logo item must include name for logo objects or alt for legacy image logos.');
    }

    if (!hasAnyMedia) {
      warn(logoPath, 'Logo item has no media. Add a logo image asset or temporary videoUrl placeholder before handoff.');
    }

    if (hasString(logo.url) && !hasString(logo.videoUrl)) {
      logo.videoUrl = logo.url;
      delete logo.url;
      fix(`${logoPath}.url`, 'Moved logo URL to videoUrl for Sanity compatibility.');
    }
  });
}

function validateLabelValueArray(section, fieldName, sectionPath, required) {
  const value = section[fieldName];
  const fieldPath = `${sectionPath}.${fieldName}`;

  if (!Array.isArray(value) || value.length === 0) {
    if (required) {
      hard(fieldPath, `${fieldName} must include at least one item.`);
    }
    return;
  }

  value.forEach((item, index) => {
    const itemPath = `${fieldPath}[${index}]`;
    if (!isPlainObject(item)) {
      hard(itemPath, `${fieldName} item must be an object.`);
      return;
    }
    requireText(item, 'label', itemPath);
    requireText(item, 'value', itemPath);
  });
}

function validateNestedCtas(items, sectionPath, fieldName) {
  if (!Array.isArray(items)) {
    return;
  }

  items.forEach((item, index) => {
    if (isPlainObject(item) && item.cta) {
      ensureNamedCta(item, 'cta', `${sectionPath}.${fieldName}[${index}]`, false);
    }
  });
}

function validateTitledRichTextArray(section, fieldName, sectionPath) {
  const value = section[fieldName];
  const fieldPath = `${sectionPath}.${fieldName}`;

  if (!Array.isArray(value) || value.length === 0) {
    hard(fieldPath, `${fieldName} must include at least one item.`);
    return;
  }

  value.forEach((item, index) => {
    const itemPath = `${fieldPath}[${index}]`;
    if (!isPlainObject(item)) {
      hard(itemPath, `${fieldName} item must be an object.`);
      return;
    }
    requireText(item, 'title', itemPath);
    requirePortableText(item, 'body', itemPath);
  });
}

function normalizeGenericBlock(section, sectionPath) {
  for (const fieldName of ['body', 'description', 'intro']) {
    if (fieldName in section) {
      normalizePortableText(section, fieldName, sectionPath, false);
    }
  }

  for (const ctaFieldName of ['cta', 'primaryCta', 'secondaryCta']) {
    if (ctaFieldName in section) {
      ensureNamedCta(section, ctaFieldName, sectionPath, false);
    }
  }
}

function applyTokenRules(section, sectionPath) {
  const rules = tokenRules[section._type];
  if (!rules) {
    return;
  }

  for (const [fieldName, rule] of Object.entries(rules)) {
    const fieldPath = `${sectionPath}.${fieldName}`;
    if (section[fieldName] === undefined || section[fieldName] === null || section[fieldName] === '') {
      section[fieldName] = rule.defaultValue;
      fix(fieldPath, `Set missing token to "${String(rule.defaultValue)}".`);
      continue;
    }

    if (!rule.values.includes(section[fieldName])) {
      section[fieldName] = rule.defaultValue;
      fix(fieldPath, `Replaced invalid token with "${String(rule.defaultValue)}".`);
    }
  }
}

function requireText(target, fieldName, parentPath) {
  if (!hasString(target[fieldName])) {
    hard(`${parentPath}.${fieldName}`, `Missing required ${fieldName}.`);
  }
}

function requirePortableText(target, fieldName, parentPath) {
  normalizePortableText(target, fieldName, parentPath, true);
}

function normalizePortableText(target, fieldName, parentPath, required) {
  const value = target[fieldName];
  const fieldPath = `${parentPath}.${fieldName}`;

  if (typeof value === 'string') {
    if (value.trim()) {
      target[fieldName] = [portableBlock(value.trim(), `${fieldPath}[0]`)];
      fix(fieldPath, `Converted string ${fieldName} to Portable Text.`);
      return;
    }
  }

  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === 'string')) {
      target[fieldName] = value
        .map((item, index) => item.trim() && portableBlock(item.trim(), `${fieldPath}[${index}]`))
        .filter(Boolean);
      fix(fieldPath, `Converted string array ${fieldName} to Portable Text.`);
    }

    if (required && !hasPortableText(target[fieldName])) {
      hard(fieldPath, `Missing required ${fieldName} copy.`);
    }
    return;
  }

  if (required) {
    hard(fieldPath, `Missing required ${fieldName} copy.`);
  }
}

function ensureCta(section, sectionPath, required) {
  ensureNamedCta(section, 'cta', sectionPath, required);
}

function ensureNamedCta(target, fieldName, parentPath, required) {
  const ctaPath = `${parentPath}.${fieldName}`;

  if (!target[fieldName]) {
    if (required) {
      target[fieldName] = { label: 'Contact Us', href: '/contact-us/' };
      fix(ctaPath, 'Created missing required CTA using the default contact path.');
    }
    return;
  }

  const cta = target[fieldName];
  if (!isPlainObject(cta)) {
    hard(ctaPath, `${fieldName} must be an object with label and href.`);
    return;
  }

  const hasLabel = hasString(cta.label);
  const hasHref = hasString(cta.href);

  if (!hasLabel && !hasHref && required) {
    cta.label = 'Contact Us';
    cta.href = '/contact-us/';
    fix(ctaPath, 'Filled empty required CTA with the default contact path.');
    return;
  }

  if (hasLabel && !hasHref) {
    cta.href = '/contact-us/';
    fix(`${ctaPath}.href`, 'Set missing CTA href to /contact-us/.');
  }

  if (hasHref && !hasLabel) {
    cta.label = 'Contact Us';
    fix(`${ctaPath}.label`, 'Set missing CTA label to Contact Us.');
  }

  if (hasString(cta.href)) {
    const normalized = normalizeHref(cta.href);
    if (cta.href !== normalized) {
      cta.href = normalized;
      fix(`${ctaPath}.href`, `Normalized CTA href to "${normalized}".`);
    }
  }
}

function stripRawStyling(value, valuePath) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => stripRawStyling(item, `${valuePath}[${index}]`));
    return;
  }

  if (!isPlainObject(value)) {
    return;
  }

  for (const key of Object.keys(value)) {
    const isPortableTextStyle = key === 'style' && value._type === 'block';
    if ((rawStyleFields.has(key) || key === 'style') && !isPortableTextStyle) {
      delete value[key];
      fix(`${valuePath}.${key}`, 'Removed unsupported raw styling field.');
      continue;
    }

    stripRawStyling(value[key], `${valuePath}.${key}`);
  }
}

function normalizeMedia(value, valuePath) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => normalizeMedia(item, `${valuePath}[${index}]`));
    return;
  }

  if (!isPlainObject(value)) {
    return;
  }

  if (typeof value.image === 'string' && /^https?:\/\//.test(value.image)) {
    if (!value.videoUrl) {
      value.videoUrl = value.image;
    }
    delete value.image;
    fix(`${valuePath}.image`, 'Moved external image URL to videoUrl for Sanity compatibility.');
  } else if (isPlainObject(value.image) && typeof value.image.url === 'string' && !value.image.asset) {
    if (!value.videoUrl) {
      value.videoUrl = value.image.url;
    }
    delete value.image;
    fix(`${valuePath}.image`, 'Moved external image.url to videoUrl for Sanity compatibility.');
  }

  if (hasString(value.videoUrl) && isPlaceholderUrl(value.videoUrl) && !hasString(value.imageAlt)) {
    value.imageAlt = placeholderAlt(value, valuePath);
    fix(`${valuePath}.imageAlt`, 'Added placeholder image alt text.');
  } else if ((value.image || value.videoFile || value.videoUrl) && !hasString(value.imageAlt)) {
    warn(`${valuePath}.imageAlt`, 'Media is present without meaningful imageAlt. Add specific alt text before handoff.');
  }

  for (const [key, child] of Object.entries(value)) {
    normalizeMedia(child, `${valuePath}.${key}`);
  }
}

function addArrayKeys(value, valuePath) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (isPlainObject(item) && !hasString(item._key)) {
        item._key = stableKey(item, `${valuePath}[${index}]`);
        fix(`${valuePath}[${index}]._key`, 'Added stable _key.');
      }
      addArrayKeys(item, `${valuePath}[${index}]`);
    });
    return;
  }

  if (!isPlainObject(value)) {
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    addArrayKeys(child, `${valuePath}.${key}`);
  }
}

function portableBlock(text, blockPath) {
  return {
    _type: 'block',
    _key: stableKey({ _type: 'block', text }, blockPath),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: stableKey({ _type: 'span', text }, `${blockPath}.children[0]`),
        text,
        marks: [],
      },
    ],
  };
}

function hasPortableText(value) {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.some((block) => {
    if (!isPlainObject(block)) {
      return false;
    }
    if (typeof block.text === 'string' && block.text.trim()) {
      return true;
    }
    if (!Array.isArray(block.children)) {
      return false;
    }
    return block.children.some((child) => typeof child?.text === 'string' && child.text.trim());
  });
}

function summarizeText(sections) {
  const text = collectText(sections).replace(/\s+/g, ' ').trim();
  return text ? trimSentence(text, 180) : '';
}

function collectText(value) {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(collectText).join(' ');
  }
  if (!isPlainObject(value)) {
    return '';
  }
  return ['title', 'lead', 'subtitle', 'intro', 'body', 'description']
    .map((key) => collectText(value[key]))
    .join(' ');
}

function trimSentence(text, maxLength) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const truncated = normalized.slice(0, maxLength - 1).trimEnd();
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 80 ? lastSpace : truncated.length).trimEnd()}.`;
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
    .replace(/-+$/g, '');
}

function normalizeHref(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return '/contact-us/';
  }
  if (/^(https?:|mailto:|tel:|#|\/)/.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith('www.')) {
    return `https://${trimmed}`;
  }
  return `/${trimmed.replace(/^\/+/, '')}`;
}

function stableKey(value, keyPath) {
  const seed = JSON.stringify({
    path: keyPath,
    type: value?._type,
    title: value?.title,
    lead: value?.lead,
    label: value?.label,
    text: value?.text,
  });
  return `k${createHash('sha1').update(seed).digest('hex').slice(0, 11)}`;
}

function placeholderAlt(value, valuePath) {
  const dimensions = extractPlaceholderDimensions(value.videoUrl) || defaultDimensions(value, valuePath);
  const label = blockLabel(valuePath);
  return `Image goes here - replace with a ${label} image, ${dimensions}.`;
}

function blockLabel(valuePath) {
  if (valuePath.includes('people')) {
    return 'person';
  }
  if (valuePath.includes('proof')) {
    return 'proof';
  }
  if (valuePath.includes('tabs')) {
    return 'feature tab';
  }
  if (valuePath.includes('cards')) {
    return 'card';
  }
  if (valuePath.includes('logos')) {
    return 'logo';
  }
  if (valuePath.includes('sections')) {
    return 'section';
  }
  return 'landing page';
}

function extractPlaceholderDimensions(url) {
  const match = String(url).match(/placehold\.co\/(\d+x\d+)/i);
  return match?.[1] || '';
}

function defaultDimensions(value, valuePath) {
  if (valuePath.includes('people')) {
    return '800x800';
  }
  if (valuePath.includes('proofMosaicBlock')) {
    return '1200x800';
  }
  if (valuePath.includes('tabs')) {
    return '826x1070';
  }
  if (valuePath.includes('cards')) {
    return '800x600';
  }
  if (valuePath.includes('logos')) {
    return '320x160';
  }
  if (value?._type === 'modernHeroBlock') {
    return value.imageShape === 'circle' ? '1200x1200' : '1200x900';
  }
  if (value?._type === 'splitFeatureBlock' || value?._type === 'imageTextBlock') {
    return '960x720';
  }
  return '1200x900';
}

function isPlaceholderUrl(value) {
  return /placehold\.co/i.test(String(value));
}

function hasString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function fix(fieldPath, message) {
  report.changed = true;
  report.fixes.push({ path: fieldPath, message });
}

function warn(fieldPath, message) {
  report.warnings.push({ path: fieldPath, message });
}

function hard(fieldPath, message) {
  report.errors.push({ path: fieldPath, message });
}

function readFlag(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? '' : args[index + 1] || '';
}

function printUsage() {
  console.log(`Usage: bun ${path.basename(process.argv[1])} <landing-page.json> [--out fixed.json] [--report report.json] [--format json]`);
}

function finish() {
  const summary = {
    fixes: report.fixes.length,
    warnings: report.warnings.length,
    errors: report.errors.length,
  };
  const output = { ...report, summary };

  if (reportPath) {
    writeFileSync(reportPath, `${JSON.stringify(output, null, 2)}\n`);
  }

  if (reportFormat === 'json') {
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(`FoundSM landing page JSON fixer: ${report.errors.length ? 'FAIL' : 'PASS'}`);
    console.log(`Fixes: ${summary.fixes}, warnings: ${summary.warnings}, errors: ${summary.errors}`);
    for (const item of report.fixes) {
      console.log(`[FIX] ${item.path}: ${item.message}`);
    }
    for (const item of report.warnings) {
      console.log(`[WARN] ${item.path}: ${item.message}`);
    }
    for (const item of report.errors) {
      console.log(`[FAIL] ${item.path}: ${item.message}`);
    }
  }

  process.exit(report.errors.length > 0 ? 1 : 0);
}
