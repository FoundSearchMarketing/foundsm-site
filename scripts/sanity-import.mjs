#!/usr/bin/env node

/**
 * Sanity Import Script
 *
 * Reads sanity-ready.json and imports authors, categories, and blog posts
 * into Sanity, including image uploads and HTML→Portable Text conversion.
 *
 * Usage:
 *   bun scripts/sanity-import.mjs <SANITY_TOKEN> <DATASET>
 *
 * Example:
 *   bun scripts/sanity-import.mjs skR3x... production
 *   bun scripts/sanity-import.mjs skR3x... staging
 *
 * Options:
 *   --dry-run    Preview what would be imported without writing to Sanity
 */

import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

// ── CLI Args ──

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const flags = process.argv.slice(2).filter((a) => a.startsWith('--'));
const DRY_RUN = flags.includes('--dry-run');

const SANITY_TOKEN = args[0];
const DATASET = args[1] || 'production';

if (!SANITY_TOKEN) {
  console.error(`
Usage: bun scripts/sanity-import.mjs <SANITY_TOKEN> <DATASET>

  SANITY_TOKEN  API token with Editor permissions (from manage.sanity.io)
  DATASET       Target dataset (default: "production")

Options:
  --dry-run     Preview what would be imported without writing

Example:
  bun scripts/sanity-import.mjs skR3xMyToken staging
  bun scripts/sanity-import.mjs skR3xMyToken production --dry-run
`);
  process.exit(1);
}

const PROJECT_ID = 'vzneqxsx';
const API_VERSION = '2024-01-01';
const EXPORT_DIR = new URL('./wp-export/', import.meta.url).pathname;

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: SANITY_TOKEN,
  apiVersion: API_VERSION,
  useCdn: false,
});

// ── HTML → Portable Text Converter ──

let blockKeyCounter = 0;
function genKey() {
  return `k${(++blockKeyCounter).toString(36).padStart(6, '0')}`;
}

/**
 * Lightweight HTML → Sanity Portable Text converter.
 * Handles: h1-h6, p, ul, ol, li, blockquote, hr, img, a, strong, em, b, i, u, br
 */
function htmlToPortableText(html) {
  const blocks = [];
  if (!html) return blocks;

  // Normalize whitespace between tags but preserve content whitespace
  let cleaned = html
    .replace(/\r\n/g, '\n')
    .replace(/\t+/g, '')
    .replace(/\n{2,}/g, '\n');

  // Split into top-level block elements
  const blockRegex =
    /<(h[1-6]|p|ul|ol|blockquote|hr|figure|figcaption|img)(\s[^>]*)?\/?>([\s\S]*?)<\/\1>|<(hr|img)(\s[^>]*)?\/?\s*>/gi;

  let match;
  let lastIndex = 0;

  while ((match = blockRegex.exec(cleaned)) !== null) {
    const tag = (match[1] || match[4] || '').toLowerCase();
    const attrs = match[2] || match[5] || '';
    const inner = match[3] || '';

    // Handle any text between block elements
    const between = cleaned.slice(lastIndex, match.index).trim();
    if (between && !between.match(/^<\/?div[^>]*>$/)) {
      const textBlocks = parseInlineContent(between);
      if (textBlocks.length > 0) {
        blocks.push(makeBlock('normal', textBlocks));
      }
    }
    lastIndex = match.index + match[0].length;

    switch (tag) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        blocks.push(makeBlock(tag, parseInlineContent(inner)));
        break;

      case 'p': {
        // Check if paragraph contains only an image
        const imgOnly = inner.match(
          /^\s*<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>\s*$/i
        );
        if (imgOnly) {
          blocks.push(makeImageBlock(imgOnly[1], imgOnly[2]));
        } else {
          const spans = parseInlineContent(inner);
          if (spans.length > 0) {
            blocks.push(makeBlock('normal', spans));
          }
        }
        break;
      }

      case 'ul':
      case 'ol': {
        const listStyle = tag === 'ul' ? 'bullet' : 'number';
        const items = extractListItems(inner);
        for (const item of items) {
          blocks.push(
            makeBlock('normal', parseInlineContent(item.text), {
              listItem: listStyle,
              level: item.level,
            })
          );
        }
        break;
      }

      case 'blockquote':
        blocks.push(
          makeBlock('blockquote', parseInlineContent(inner))
        );
        break;

      case 'hr':
        blocks.push({ _type: 'break', _key: genKey(), style: 'lineBreak' });
        break;

      case 'img': {
        const src = attrs.match(/src="([^"]+)"/)?.[1];
        const alt = attrs.match(/alt="([^"]*)"/) ?.[1];
        if (src) blocks.push(makeImageBlock(src, alt || ''));
        break;
      }

      case 'figure':
      case 'figcaption':
        // Extract text content from figcaptions
        blocks.push(makeBlock('normal', parseInlineContent(inner)));
        break;
    }
  }

  // Handle any trailing content
  const trailing = cleaned.slice(lastIndex).trim();
  if (trailing) {
    // Try to parse remaining content that might not match block pattern
    const remainingBlocks = parseRemainingHtml(trailing);
    blocks.push(...remainingBlocks);
  }

  return blocks.filter(Boolean);
}

function makeBlock(style, children, extra = {}) {
  // Filter out empty text spans
  const filteredChildren = (children || []).filter(
    (c) => c.text !== '' || c.marks?.length > 0
  );
  if (filteredChildren.length === 0 && style === 'normal') return null;
  if (filteredChildren.length === 0)
    filteredChildren.push({ _type: 'span', _key: genKey(), text: '', marks: [] });

  return {
    _type: 'block',
    _key: genKey(),
    style: style || 'normal',
    children: filteredChildren,
    markDefs: extractMarkDefs(children || []),
    ...extra,
  };
}

function makeImageBlock(src, alt) {
  // Store as a placeholder — actual image upload happens separately
  return {
    _type: 'image',
    _key: genKey(),
    _sanity_import: { src, alt },
  };
}

function parseInlineContent(html) {
  if (!html) return [{ _type: 'span', _key: genKey(), text: '', marks: [] }];

  const spans = [];
  let currentText = '';
  let currentMarks = [];
  const markDefs = [];
  let i = 0;

  // Strip wrapping divs and Elementor artifacts
  html = html.replace(/<\/?div[^>]*>/g, '');
  html = html.replace(/<\/?span[^>]*class="[^"]*elementor[^"]*"[^>]*>/g, '');

  // Normalize br tags
  html = html.replace(/<br\s*\/?>/gi, '\n');

  // Simple state machine parser
  const pushSpan = () => {
    if (currentText) {
      spans.push({
        _type: 'span',
        _key: genKey(),
        text: decodeEntities(currentText),
        marks: [...currentMarks],
      });
      currentText = '';
    }
  };

  while (i < html.length) {
    if (html[i] === '<') {
      const closeMatch = html.slice(i).match(
        /^<\/(strong|b|em|i|u|a|span|font|li|ul|ol|div)>/i
      );
      if (closeMatch) {
        const tag = closeMatch[1].toLowerCase();
        pushSpan();
        if (tag === 'a') currentMarks = currentMarks.filter((m) => !m.startsWith('link-'));
        else if (['strong', 'b'].includes(tag)) currentMarks = currentMarks.filter((m) => m !== 'strong');
        else if (['em', 'i'].includes(tag)) currentMarks = currentMarks.filter((m) => m !== 'em');
        else if (tag === 'u') currentMarks = currentMarks.filter((m) => m !== 'underline');
        i += closeMatch[0].length;
        continue;
      }

      const openMatch = html.slice(i).match(
        /^<(strong|b|em|i|u)(\s[^>]*)?>/i
      );
      if (openMatch) {
        pushSpan();
        const tag = openMatch[1].toLowerCase();
        if (['strong', 'b'].includes(tag)) currentMarks.push('strong');
        else if (['em', 'i'].includes(tag)) currentMarks.push('em');
        else if (tag === 'u') currentMarks.push('underline');
        i += openMatch[0].length;
        continue;
      }

      const linkMatch = html.slice(i).match(
        /^<a\s[^>]*href="([^"]*)"[^>]*>/i
      );
      if (linkMatch) {
        pushSpan();
        const linkKey = `link-${genKey()}`;
        markDefs.push({ _type: 'link', _key: linkKey, href: decodeEntities(linkMatch[1]) });
        currentMarks.push(linkKey);
        i += linkMatch[0].length;
        continue;
      }

      // Skip other tags (span, font, etc.) but keep going
      const skipTag = html.slice(i).match(/^<[^>]+>/);
      if (skipTag) {
        i += skipTag[0].length;
        continue;
      }
    }

    currentText += html[i];
    i++;
  }

  pushSpan();

  // Attach markDefs to spans for later extraction
  spans._markDefs = markDefs;
  return spans;
}

function extractMarkDefs(children) {
  return children._markDefs || [];
}

function extractListItems(html, level = 1) {
  const items = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;

  while ((match = liRegex.exec(html)) !== null) {
    let content = match[1];

    // Check for nested lists
    const nestedUl = content.match(/<ul[^>]*>([\s\S]*)<\/ul>/i);
    const nestedOl = content.match(/<ol[^>]*>([\s\S]*)<\/ol>/i);

    // Remove nested lists from content to get just this item's text
    const textOnly = content
      .replace(/<[uo]l[^>]*>[\s\S]*<\/[uo]l>/gi, '')
      .trim();

    if (textOnly) {
      items.push({ text: textOnly, level });
    }

    if (nestedUl) {
      items.push(...extractListItems(nestedUl[1], level + 1));
    }
    if (nestedOl) {
      items.push(...extractListItems(nestedOl[1], level + 1));
    }
  }

  return items;
}

function parseRemainingHtml(html) {
  const blocks = [];
  // Try to extract any remaining block elements
  const parts = html.split(/(?=<(?:h[1-6]|p|ul|ol|blockquote|hr)[\s>])/i);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed || trimmed.match(/^<\/?div[^>]*>$/)) continue;

    const tagMatch = trimmed.match(/^<(h[1-6]|p)(\s[^>]*)?>(.+)<\/\1>$/is);
    if (tagMatch) {
      blocks.push(makeBlock(tagMatch[1].toLowerCase(), parseInlineContent(tagMatch[3])));
    }
  }
  return blocks;
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014')
    .replace(/&#8230;/g, '\u2026')
    .replace(/&#160;/g, ' ')
    .replace(/&nbsp;/g, ' ');
}

// ── Image Upload ──

async function uploadImageFromUrl(imageUrl) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      console.error(`    ✗ Failed to fetch image: ${imageUrl} (${res.status})`);
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = path.basename(new URL(imageUrl).pathname);
    const contentType = res.headers.get('content-type') || 'image/webp';

    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType,
    });

    return asset._id;
  } catch (err) {
    console.error(`    ✗ Image upload error: ${imageUrl} — ${err.message}`);
    return null;
  }
}

async function uploadImageFromFile(localPath) {
  try {
    const fullPath = path.join(EXPORT_DIR, localPath);
    const stream = createReadStream(fullPath);
    const filename = path.basename(localPath);
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.webp': 'image/webp',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
    };

    const asset = await client.assets.upload('image', stream, {
      filename,
      contentType: contentTypes[ext] || 'image/webp',
    });

    return asset._id;
  } catch (err) {
    console.error(`    ✗ Local image upload error: ${localPath} — ${err.message}`);
    return null;
  }
}

// ── Import Functions ──

async function importAuthors(authors) {
  console.log(`\n👤 Importing ${authors.length} authors...`);
  for (const author of authors) {
    if (DRY_RUN) {
      console.log(`  [dry-run] Would create author: ${author.name}`);
      continue;
    }
    try {
      await client.createOrReplace(author);
      console.log(`  ✓ ${author.name}`);
    } catch (err) {
      console.error(`  ✗ ${author.name}: ${err.message}`);
    }
  }
}

async function importCategories(categories) {
  console.log(`\n📁 Importing ${categories.length} categories...`);
  for (const cat of categories) {
    if (DRY_RUN) {
      console.log(`  [dry-run] Would create category: ${cat.title}`);
      continue;
    }
    try {
      await client.createOrReplace(cat);
      console.log(`  ✓ ${cat.title}`);
    } catch (err) {
      console.error(`  ✗ ${cat.title}: ${err.message}`);
    }
  }
}

async function importPosts(posts) {
  console.log(`\n📝 Importing ${posts.length} blog posts...`);

  for (const post of posts) {
    console.log(`\n  Processing: ${post.slug.current}`);

    if (DRY_RUN) {
      const body = htmlToPortableText(post.content_clean_html);
      console.log(`  [dry-run] Would create post: ${post.title}`);
      console.log(`    Portable Text blocks: ${body.length}`);
      console.log(`    Author ref: ${post.author?._ref || 'none'}`);
      console.log(`    Category ref: ${post.category?._ref || 'none'}`);
      continue;
    }

    // 1. Upload featured image
    let featuredImageAsset = null;
    if (post.featuredImage?.localPath) {
      console.log(`    Uploading featured image...`);
      featuredImageAsset = await uploadImageFromFile(post.featuredImage.localPath);
      if (!featuredImageAsset && post.featuredImage.url) {
        console.log(`    Falling back to URL upload...`);
        featuredImageAsset = await uploadImageFromUrl(post.featuredImage.url);
      }
    }

    // 2. Convert HTML to Portable Text
    const body = htmlToPortableText(post.content_clean_html);

    // 3. Upload inline images referenced in Portable Text
    for (const block of body) {
      if (block._type === 'image' && block._sanity_import) {
        const { src, alt } = block._sanity_import;
        console.log(`    Uploading inline image: ${path.basename(src)}`);
        const assetId = await uploadImageFromUrl(src);
        if (assetId) {
          block.asset = { _type: 'reference', _ref: assetId };
          block.alt = alt;
        }
        delete block._sanity_import;
      }
    }

    // 4. Build Sanity document
    const doc = {
      _id: `post-${post.slug.current}`,
      _type: 'blogPost',
      title: post.title,
      slug: post.slug,
      publishedAt: post.publishedAt,
      excerpt: post.excerpt,
      body: body.filter((b) => !b._sanity_import), // remove failed image blocks
      author: post.author || undefined,
      category: post.category || undefined,
      seoTitle: post.seoTitle || undefined,
      seoDescription: post.seoDescription || undefined,
    };

    if (featuredImageAsset) {
      doc.featuredImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: featuredImageAsset },
        alt: post.featuredImage?.alt || '',
      };
    }

    // 5. Write to Sanity
    try {
      await client.createOrReplace(doc);
      console.log(`  ✓ ${post.title} (${body.length} blocks)`);
    } catch (err) {
      console.error(`  ✗ ${post.title}: ${err.message}`);
    }
  }
}

// ── Main ──

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log(' Sanity Content Import');
  console.log('═══════════════════════════════════════════');
  console.log(`  Project:  ${PROJECT_ID}`);
  console.log(`  Dataset:  ${DATASET}`);
  console.log(`  Dry run:  ${DRY_RUN}`);
  console.log('═══════════════════════════════════════════');

  // Load data
  const data = JSON.parse(
    await readFile(path.join(EXPORT_DIR, 'sanity-ready.json'), 'utf-8')
  );

  console.log(`\nLoaded: ${data._stats.authors} authors, ${data._stats.categories} categories, ${data._stats.posts} posts`);

  // Verify connection
  if (!DRY_RUN) {
    try {
      const datasets = await client.datasets.list();
      const exists = datasets.some((d) => d.name === DATASET);
      if (!exists) {
        console.error(`\n✗ Dataset "${DATASET}" does not exist. Available: ${datasets.map((d) => d.name).join(', ')}`);
        process.exit(1);
      }
      console.log(`  ✓ Connected to Sanity (dataset: ${DATASET})`);
    } catch (err) {
      console.error(`\n✗ Failed to connect to Sanity: ${err.message}`);
      console.error('  Check that your token has Editor permissions.');
      process.exit(1);
    }
  }

  // Import in order: authors & categories first (posts reference them)
  await importAuthors(data.authors);
  await importCategories(data.categories);
  await importPosts(data.posts);

  console.log('\n═══════════════════════════════════════════');
  console.log(' Import Complete!');
  console.log('═══════════════════════════════════════════');
}

main().catch((err) => {
  console.error('\n✗ Fatal error:', err);
  process.exit(1);
});
