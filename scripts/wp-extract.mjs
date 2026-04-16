#!/usr/bin/env node

/**
 * WordPress Content Extraction Script
 *
 * Extracts blog posts, categories, tags, pages, authors, and images
 * from foundsm.com via the WP REST API. Outputs structured JSON
 * files ready for Sanity import.
 *
 * Usage: node scripts/wp-extract.mjs
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const WP_BASE = 'https://foundsm.com/wp-json/wp/v2';
const EXPORT_DIR = new URL('./wp-export/', import.meta.url).pathname;
const IMAGES_DIR = path.join(EXPORT_DIR, 'images');
const DELAY_MS = 200; // polite delay between image downloads

// ── Helpers ──

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function wpFetch(endpoint, params = {}) {
  const url = new URL(`${WP_BASE}/${endpoint}`);
  url.searchParams.set('per_page', '100');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const items = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    url.searchParams.set('page', String(page));
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error(`  ✗ Failed ${url} — ${res.status} ${res.statusText}`);
      break;
    }

    const data = await res.json();
    items.push(...(Array.isArray(data) ? data : [data]));

    totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    page++;
  }

  return items;
}

async function downloadImage(imageUrl, destPath) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok || !res.body) {
      console.error(`  ✗ Image download failed: ${imageUrl} (${res.status})`);
      return false;
    }
    await mkdir(path.dirname(destPath), { recursive: true });
    const fileStream = createWriteStream(destPath);
    await pipeline(res.body, fileStream);
    return true;
  } catch (err) {
    console.error(`  ✗ Image download error: ${imageUrl} — ${err.message}`);
    return false;
  }
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

function extractInlineImageUrls(html) {
  const urls = [];
  const regex = /<img[^>]+src="([^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const url = match[1];
    if (url.includes('foundsm.com')) {
      urls.push(url);
    }
  }
  return [...new Set(urls)];
}

function getFilename(url) {
  try {
    return path.basename(new URL(url).pathname);
  } catch {
    return 'image.jpg';
  }
}

async function writeJson(filename, data) {
  const filePath = path.join(EXPORT_DIR, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`  ✓ ${filename} (${Array.isArray(data) ? data.length + ' items' : 'written'})`);
}

// ── Extractors ──

async function extractCategories() {
  console.log('\n📁 Fetching categories...');
  const raw = await wpFetch('categories');
  const categories = raw.map((c) => ({
    wp_id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    count: c.count,
  }));
  await writeJson('categories.json', categories);
  return categories;
}

async function extractTags() {
  console.log('\n🏷️  Fetching tags...');
  const raw = await wpFetch('tags');
  const tags = raw.map((t) => ({
    wp_id: t.id,
    name: t.name,
    slug: t.slug,
    count: t.count,
  }));
  await writeJson('tags.json', tags);
  return tags;
}

async function extractAuthors() {
  console.log('\n👤 Fetching authors...');
  const raw = await wpFetch('users');
  const authors = raw.map((u) => ({
    wp_id: u.id,
    name: u.name,
    slug: u.slug,
    description: u.description || '',
    avatar_url: u.avatar_urls?.['96'] || null,
  }));
  await writeJson('authors.json', authors);
  return authors;
}

async function fetchMediaDetails(mediaId) {
  if (!mediaId) return null;
  try {
    const res = await fetch(`${WP_BASE}/media/${mediaId}`);
    if (!res.ok) return null;
    const m = await res.json();
    return {
      wp_id: m.id,
      url: m.source_url,
      alt: m.alt_text || '',
      width: m.media_details?.width || null,
      height: m.media_details?.height || null,
      mime_type: m.mime_type,
    };
  } catch {
    return null;
  }
}

async function extractPosts(categoryMap, tagMap, authorMap) {
  console.log('\n📝 Fetching posts...');
  const raw = await wpFetch('posts');
  console.log(`   Found ${raw.length} posts`);

  const mediaManifest = [];
  const posts = [];

  for (const p of raw) {
    const slug = p.slug;
    console.log(`   Processing: ${slug}`);

    // Resolve category (first one)
    const catId = p.categories?.[0];
    const category = catId ? categoryMap.get(catId) || { wp_id: catId, name: 'Unknown', slug: 'unknown' } : null;

    // Resolve tags
    const tags = (p.tags || []).map((tid) => tagMap.get(tid) || { wp_id: tid, name: 'Unknown', slug: 'unknown' });

    // Resolve author
    const authorId = p.author;
    const author = authorId ? authorMap.get(authorId) || { wp_id: authorId, name: 'Unknown', slug: 'unknown' } : null;

    // Featured image
    let featuredImage = null;
    if (p.featured_media) {
      const media = await fetchMediaDetails(p.featured_media);
      if (media) {
        const filename = getFilename(media.url);
        const localPath = path.join('images', 'posts', slug, `featured-${filename}`);
        featuredImage = { ...media, localPath };
        mediaManifest.push({ wp_id: media.wp_id, url: media.url, localPath });
      }
    }

    // Inline images from content HTML
    const contentHtml = p.content?.rendered || '';
    const inlineUrls = extractInlineImageUrls(contentHtml);
    const inlineImages = [];
    for (let i = 0; i < inlineUrls.length; i++) {
      const url = inlineUrls[i];
      const filename = getFilename(url);
      const localPath = path.join('images', 'posts', slug, `inline-${i + 1}-${filename}`);
      inlineImages.push({ url, localPath });
      mediaManifest.push({ url, localPath });
    }

    // Yoast SEO
    const yoast = p.yoast_head_json || {};
    const seo = {
      title: yoast.title || '',
      description: yoast.description || '',
      canonical: yoast.canonical || '',
      ogImage: yoast.og_image?.[0] ? {
        url: yoast.og_image[0].url,
        width: yoast.og_image[0].width,
        height: yoast.og_image[0].height,
      } : null,
      ogType: yoast.og_type || '',
      twitterCard: yoast.twitter_card || '',
      robots: yoast.robots || {},
    };

    posts.push({
      wp_id: p.id,
      title: p.title?.rendered || '',
      slug,
      publishedAt: p.date_gmt ? `${p.date_gmt}Z` : p.date,
      modifiedAt: p.modified_gmt ? `${p.modified_gmt}Z` : p.modified,
      excerpt: stripHtml(p.excerpt?.rendered || ''),
      content_html: contentHtml,
      author,
      category,
      tags,
      featuredImage,
      inlineImages,
      seo,
    });
  }

  await writeJson('posts.json', posts);
  return { posts, mediaManifest };
}

async function extractPages() {
  console.log('\n📄 Fetching pages...');
  const raw = await wpFetch('pages');
  console.log(`   Found ${raw.length} pages`);

  const mediaManifest = [];
  const pages = [];

  for (const p of raw) {
    const slug = p.slug;
    console.log(`   Processing page: ${slug}`);

    // Featured image
    let featuredImage = null;
    if (p.featured_media) {
      const media = await fetchMediaDetails(p.featured_media);
      if (media) {
        const filename = getFilename(media.url);
        const localPath = path.join('images', 'pages', slug, `featured-${filename}`);
        featuredImage = { ...media, localPath };
        mediaManifest.push({ wp_id: media.wp_id, url: media.url, localPath });
      }
    }

    // Inline images
    const contentHtml = p.content?.rendered || '';
    const inlineUrls = extractInlineImageUrls(contentHtml);
    const inlineImages = [];
    for (let i = 0; i < inlineUrls.length; i++) {
      const url = inlineUrls[i];
      const filename = getFilename(url);
      const localPath = path.join('images', 'pages', slug, `inline-${i + 1}-${filename}`);
      inlineImages.push({ url, localPath });
      mediaManifest.push({ url, localPath });
    }

    // Yoast SEO
    const yoast = p.yoast_head_json || {};
    const seo = {
      title: yoast.title || '',
      description: yoast.description || '',
      canonical: yoast.canonical || '',
      ogImage: yoast.og_image?.[0] ? {
        url: yoast.og_image[0].url,
        width: yoast.og_image[0].width,
        height: yoast.og_image[0].height,
      } : null,
    };

    pages.push({
      wp_id: p.id,
      title: p.title?.rendered || '',
      slug,
      publishedAt: p.date_gmt ? `${p.date_gmt}Z` : p.date,
      content_html: contentHtml,
      template: p.template || '',
      featuredImage,
      inlineImages,
      seo,
    });
  }

  await writeJson('pages.json', pages);
  return { pages, mediaManifest };
}

async function downloadAllImages(manifest) {
  console.log(`\n🖼️  Downloading ${manifest.length} images...`);
  let success = 0;
  let failed = 0;

  for (const item of manifest) {
    const destPath = path.join(EXPORT_DIR, item.localPath);
    const ok = await downloadImage(item.url, destPath);
    if (ok) {
      success++;
      process.stdout.write(`  ✓ ${success}/${manifest.length}\r`);
    } else {
      failed++;
    }
    await sleep(DELAY_MS);
  }

  console.log(`\n  Downloaded: ${success} | Failed: ${failed}`);
}

// ── Main ──

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log(' WordPress Content Extraction — foundsm.com');
  console.log('═══════════════════════════════════════════');

  await mkdir(EXPORT_DIR, { recursive: true });

  // 1. Fetch lookup data first
  const categories = await extractCategories();
  const tags = await extractTags();
  const authors = await extractAuthors();

  // Build lookup maps
  const categoryMap = new Map(categories.map((c) => [c.wp_id, c]));
  const tagMap = new Map(tags.map((t) => [t.wp_id, t]));
  const authorMap = new Map(authors.map((a) => [a.wp_id, a]));

  // 2. Fetch posts and pages (with resolved references)
  const { posts, mediaManifest: postMedia } = await extractPosts(categoryMap, tagMap, authorMap);
  const { pages, mediaManifest: pageMedia } = await extractPages();

  // 3. Combine media manifest and save
  const fullManifest = [...postMedia, ...pageMedia];
  await writeJson('media-manifest.json', fullManifest);

  // 4. Download all images
  await downloadAllImages(fullManifest);

  // Summary
  console.log('\n═══════════════════════════════════════════');
  console.log(' Extraction Complete!');
  console.log('═══════════════════════════════════════════');
  console.log(`  Posts:      ${posts.length}`);
  console.log(`  Pages:      ${pages.length}`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Tags:       ${tags.length}`);
  console.log(`  Authors:    ${authors.length}`);
  console.log(`  Images:     ${fullManifest.length}`);
  console.log(`\n  Output dir: ${EXPORT_DIR}`);
}

main().catch((err) => {
  console.error('\n✗ Fatal error:', err);
  process.exit(1);
});
