#!/usr/bin/env node

/**
 * WordPress → Sanity Content Cleanup Script
 *
 * Reads the raw extracted WordPress data (posts.json) and the mapping config
 * (sanity-mapping.json), then outputs sanity-ready.json with:
 *   - Elementor markup stripped, clean article HTML preserved
 *   - Authors resolved from embedded post metadata
 *   - Categories mapped to Sanity document IDs
 *   - Internal links rewritten to relative paths
 *   - HTML entities decoded
 *
 * Usage: bun scripts/wp-clean.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const EXPORT_DIR = new URL('./wp-export/', import.meta.url).pathname;

// ── Helpers ──

function decodeHtmlEntities(str) {
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

function rewriteUrls(html, rewrites) {
  let result = html;
  for (const { from, to } of rewrites) {
    // Replace full URLs with relative paths
    result = result.replaceAll(from, to);
  }
  return result;
}

/**
 * Extract clean article content from Elementor HTML.
 *
 * Strategy: find all text-editor and image widgets by their data-widget_type
 * attribute, extract their inner content, and concatenate.
 *
 * We skip the first text-editor widgets that appear inside the header section
 * (post-info area) since those contain author/date metadata, not article content.
 */
function extractCleanContent(elementorHtml) {
  const blocks = [];

  // Extract text-editor widget contents
  // Pattern: data-widget_type="text-editor.default"> followed by the content wrapper
  // The actual content is inside the innermost div after the widget wrapper
  const textEditorRegex =
    /data-widget_type="text-editor\.default">\s*(?:<div[^>]*>\s*)*\t*([\s\S]*?)\t*\s*<\/div>\s*<\/div>/g;

  let match;
  while ((match = textEditorRegex.exec(elementorHtml)) !== null) {
    let content = match[1].trim();

    // Skip if it's just a navigation button or empty
    if (!content || content.includes('← All Articles')) continue;

    // Skip author attribution lines that are just italic text with em-dash
    if (content.startsWith('<em>—') || content.startsWith('<em>\u2014')) {
      // This is a quote attribution, include it as part of the blockquote
      blocks.push(`<figcaption>${content}</figcaption>`);
      continue;
    }

    // Skip if it's just a bold quote (will be captured as blockquote)
    if (
      content.startsWith('<strong>\u201C') ||
      content.startsWith('<strong>&#8220;')
    ) {
      blocks.push(`<blockquote>${content}</blockquote>`);
      continue;
    }

    blocks.push(content);
  }

  // Extract standalone image widgets
  const imageWidgetRegex =
    /data-widget_type="image\.default">\s*[\s\S]*?<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g;

  // We already have inline images from the text content, but let's not double-add
  // Images inside text-editor widgets are already captured above

  let html = blocks.join('\n\n');

  // Clean up empty headings (e.g., <h2> </h2> or <h2>&nbsp;</h2>)
  html = html.replace(/<h([1-6])>\s*(&nbsp;|\s)*<\/h[1-6]>/g, '');

  // Clean up excessive whitespace
  html = html.replace(/\n{3,}/g, '\n\n');

  return html.trim();
}

/**
 * Try to extract the author name from the Elementor post-info widget.
 * Pattern: elementor-post-info__item--type-custom"> followed by the author name
 */
function extractAuthorFromHtml(html) {
  const authorMatch = html.match(
    /elementor-post-info__item--type-custom">\s*\n?\s*([^<]+)/
  );
  if (authorMatch) {
    // "Maria Escobedo, Associate Data Analyst" → "Maria Escobedo"
    const fullText = authorMatch[1].trim();
    const name = fullText.split(',')[0].split('|')[0].trim();
    return name;
  }
  return null;
}

// ── Main ──

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log(' WordPress → Sanity Content Cleanup');
  console.log('═══════════════════════════════════════════');

  // Load data
  const posts = JSON.parse(
    await readFile(path.join(EXPORT_DIR, 'posts.json'), 'utf-8')
  );
  const mapping = JSON.parse(
    await readFile(path.join(EXPORT_DIR, 'sanity-mapping.json'), 'utf-8')
  );

  console.log(`\nLoaded ${posts.length} posts and mapping config`);

  // Build Sanity-ready authors
  const authors = mapping.authors.map((a) => ({
    _id: a._id,
    _type: 'author',
    name: a.name,
    slug: { current: a.slug },
    title: a.title || undefined,
  }));

  // Build Sanity-ready categories (skip "Uncategorized" and empty ones)
  const categories = mapping.categories.map((c) => ({
    _id: c._id,
    _type: 'blogCategory',
    title: c.title,
    slug: { current: c.slug },
  }));

  // Process posts
  const cleanPosts = [];
  let authorMisses = [];

  for (const post of posts) {
    const slug = post.slug;
    console.log(`  Processing: ${slug}`);

    // 1. Extract clean HTML from Elementor content
    const cleanHtml = extractCleanContent(post.content_html);

    // 2. Rewrite internal URLs
    const rewrittenHtml = rewriteUrls(cleanHtml, mapping.urlRewrites);

    // 3. Resolve author
    const authorName = extractAuthorFromHtml(post.content_html);
    const authorId = authorName ? mapping.authorLookup[authorName] : null;

    if (!authorId && authorName) {
      authorMisses.push({ slug, authorName });
      console.log(`    ⚠ Author not in mapping: "${authorName}"`);
    }

    // 4. Resolve category
    const wpCatId = post.category?.wp_id;
    const categoryId = wpCatId
      ? mapping.categoryLookup[String(wpCatId)]
      : null;

    // 5. Decode HTML entities in text fields
    const title = decodeHtmlEntities(post.title);
    const excerpt = decodeHtmlEntities(post.excerpt);
    const seoTitle = decodeHtmlEntities(post.seo?.title || post.title);
    const seoDescription = decodeHtmlEntities(post.seo?.description || '');

    // 6. Build Sanity-ready post document
    cleanPosts.push({
      _type: 'blogPost',
      title,
      slug: { current: slug },
      publishedAt: post.publishedAt,
      excerpt,
      author: authorId ? { _type: 'reference', _ref: authorId } : null,
      category: categoryId
        ? { _type: 'reference', _ref: categoryId }
        : null,
      seoTitle: seoTitle !== title ? seoTitle : undefined,
      seoDescription: seoDescription || undefined,
      content_clean_html: rewrittenHtml,
      featuredImage: post.featuredImage
        ? {
            localPath: post.featuredImage.localPath,
            alt: post.featuredImage.alt || '',
            url: post.featuredImage.url,
          }
        : null,
      inlineImages: (post.inlineImages || []).map((img) => ({
        localPath: img.localPath,
        url: img.url,
      })),
      _wp_meta: {
        wp_id: post.wp_id,
        tags: post.tags,
        modifiedAt: post.modifiedAt,
        canonical: post.seo?.canonical,
      },
    });
  }

  // Assemble output
  const output = {
    _generated: new Date().toISOString(),
    _stats: {
      authors: authors.length,
      categories: categories.length,
      posts: cleanPosts.length,
      authorMisses: authorMisses.length,
    },
    authors,
    categories,
    posts: cleanPosts,
  };

  // Write output
  const outPath = path.join(EXPORT_DIR, 'sanity-ready.json');
  await writeFile(outPath, JSON.stringify(output, null, 2));

  // Summary
  console.log('\n═══════════════════════════════════════════');
  console.log(' Cleanup Complete!');
  console.log('═══════════════════════════════════════════');
  console.log(`  Authors:           ${authors.length}`);
  console.log(`  Categories:        ${categories.length}`);
  console.log(`  Posts:             ${cleanPosts.length}`);
  if (authorMisses.length > 0) {
    console.log(`  Author misses:     ${authorMisses.length}`);
    authorMisses.forEach((m) =>
      console.log(`    - ${m.slug}: "${m.authorName}"`)
    );
  }
  console.log(`\n  Output: ${outPath}`);

  // Show a preview of the first post's clean HTML
  if (cleanPosts.length > 0) {
    const preview = cleanPosts[0].content_clean_html;
    const previewLines = preview.split('\n').slice(0, 5).join('\n');
    console.log(`\n  First post content preview:`);
    console.log(`  ${previewLines.substring(0, 300)}...`);
  }
}

main().catch((err) => {
  console.error('\n✗ Fatal error:', err);
  process.exit(1);
});
