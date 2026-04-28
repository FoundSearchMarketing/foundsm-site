import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { JSDOM } from 'jsdom';

const MONTHS = new Map([
  ['january', '01'],
  ['february', '02'],
  ['march', '03'],
  ['april', '04'],
  ['may', '05'],
  ['june', '06'],
  ['july', '07'],
  ['august', '08'],
  ['september', '09'],
  ['october', '10'],
  ['november', '11'],
  ['december', '12'],
]);

const POST_METADATA = {
  'dirty-signals-bot-traffic-junk-leads': {
    id: 5535,
    categories: [
      { label: 'Marketing Analytics & Tracking', slug: 'marketing-analytics-tracking' },
      { label: 'Paid Media Strategy', slug: 'paid-media-strategy' },
    ],
  },
  'customer-match-uploads-disabled-in-google-ads-api': {
    id: 6193,
    categories: [
      { label: 'Industry Insights', slug: 'industry-insights' },
      { label: 'Marketing Analytics & Tracking', slug: 'marketing-analytics-tracking' },
    ],
  },
  'signal-loss-costs-real-revenue': {
    id: 5376,
    categories: [
      { label: 'Industry Insights', slug: 'industry-insights' },
      { label: 'Marketing Analytics & Tracking', slug: 'marketing-analytics-tracking' },
    ],
  },
  'googles-vision-for-2026-building-a-revenue-engine-powered-by-data': {
    id: 4980,
    categories: [
      { label: 'Industry Insights', slug: 'industry-insights' },
      { label: 'Marketing Analytics & Tracking', slug: 'marketing-analytics-tracking' },
      { label: 'Paid Media Strategy', slug: 'paid-media-strategy' },
    ],
  },
  'indiana-consumer-data-protection-act': {
    id: 4486,
    categories: [
      { label: 'Industry Insights', slug: 'industry-insights' },
      { label: 'Marketing Analytics & Tracking', slug: 'marketing-analytics-tracking' },
    ],
  },
  'closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing': {
    id: 4358,
    categories: [
      { label: 'AI', slug: 'ai' },
      { label: 'Paid Media Strategy', slug: 'paid-media-strategy' },
    ],
  },
  'wrapping-up-19-years-with-purpose-founds-year-end-tradition-of-giving-back': {
    id: 3810,
    categories: [{ label: 'Life at Found', slug: 'life-at-found' }],
  },
  'a-3-minute-implementation-guide-to-segmenting-ai-traffic-in-ga4': {
    id: 3436,
    categories: [
      { label: 'AI', slug: 'ai' },
      { label: 'Industry Insights', slug: 'industry-insights' },
    ],
  },
  'how-advantage-is-reshaping-student-recruitment-insights-from-a-meta-education-summit': {
    id: 2464,
    categories: [
      { label: 'Industry Insights', slug: 'industry-insights' },
      { label: 'Meta', slug: 'meta' },
    ],
  },
  'our-top-takeaways-from-search-marketing-expo-advanced-2025': {
    id: 2256,
    categories: [{ label: 'Industry Insights', slug: 'industry-insights' }],
  },
};

export function parseDateLabel(label) {
  const match = String(label || '').trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (!match) {
    return '';
  }

  const [, monthName, day, year] = match;
  const month = MONTHS.get(monthName.toLowerCase());
  if (!month) {
    return '';
  }

  return `${year}-${month}-${day.padStart(2, '0')}`;
}

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function splitAuthor(value) {
  const normalized = cleanText(value);
  if (!normalized) {
    return { authorName: '', authorTitle: '' };
  }

  const separator = normalized.includes('|') ? '|' : ',';
  if (!normalized.includes(separator)) {
    return { authorName: normalized, authorTitle: '' };
  }

  const [name, ...titleParts] = normalized.split(separator);
  return {
    authorName: cleanText(name),
    authorTitle: cleanText(titleParts.join(separator)),
  };
}

function extractExcerpt(document) {
  const intro = document.querySelector('.blog-post__intro');
  const paragraph = intro?.querySelector('p');
  const text = cleanText(paragraph?.textContent || intro?.textContent || '');
  if (text.length <= 240) {
    return text;
  }

  const trimmed = text.slice(0, 237).replace(/\s+\S*$/, '');
  return `${trimmed}...`;
}

function getKnownPostSlugs(postsDirEntries) {
  return new Set(
    postsDirEntries
      .filter((entry) => entry.endsWith('.html') && entry !== 'index.html')
      .map((entry) => path.basename(entry, '.html'))
  );
}

export function rewriteBlogPostLinks(root, migratedSlugs) {
  root.querySelectorAll('a[href]').forEach((link) => {
    const rawHref = link.getAttribute('href');
    if (!rawHref) {
      return;
    }

    let parsed;
    try {
      parsed = new URL(rawHref, 'https://foundsm.com');
    } catch {
      return;
    }

    const hostname = parsed.hostname.replace(/^www\./, '');
    if (hostname !== 'foundsm.com') {
      return;
    }

    const insightsMatch = parsed.pathname.match(/^\/insights\/([^/]+)\/?$/);
    if (insightsMatch && migratedSlugs.has(insightsMatch[1])) {
      link.setAttribute('href', `/insights/${insightsMatch[1]}/${parsed.hash}`);
      return;
    }

    if (parsed.pathname === '/insights/' || parsed.pathname === '/insights') {
      link.setAttribute('href', `/insights/${parsed.hash}`);
    }
  });
}

function extractBodyHtml(document, migratedSlugs) {
  const body = document.querySelector('.blog-post__body');
  if (!body) {
    throw new Error('Missing .blog-post__body');
  }

  body.querySelector('.blog-post__pagination')?.remove();
  rewriteBlogPostLinks(body, migratedSlugs);

  return body.innerHTML.trim();
}

export function parseModernBlogPost(html, { slug, migratedSlugs }) {
  const dom = new JSDOM(html);
  const { document } = dom.window;
  const main = document.querySelector('.blog-post');
  const title = cleanText(document.querySelector('.blog-post__title')?.textContent);
  const seoTitle = cleanText(document.title).replace(/\s+-\s+Found Search Marketing$/, ' | Found Search Marketing');
  const authorNode = document.querySelector('.blog-post__meta .blog-post__meta-item');
  const authorLink = authorNode?.querySelector('a[href]');
  const { authorName, authorTitle } = splitAuthor(authorNode?.textContent || '');
  const publishedLabel = cleanText(document.querySelector('.blog-post__meta time')?.textContent);
  const heroImage = document.querySelector('.blog-post__hero-image');
  const metadata = POST_METADATA[slug] || { id: 0, categories: [] };

  if (!title) {
    throw new Error(`Missing title for ${slug}`);
  }

  const publishedAt = parseDateLabel(publishedLabel);
  if (!publishedAt) {
    throw new Error(`Missing or invalid publish date for ${slug}`);
  }

  return {
    id: metadata.id,
    slug,
    title,
    seoTitle: seoTitle || `${title} | Found Search Marketing`,
    excerpt: extractExcerpt(document),
    publishedAt,
    publishedLabel,
    authorName,
    authorTitle,
    authorUrl: authorLink?.getAttribute('href') || '',
    heroImage: heroImage?.getAttribute('src') || '',
    heroImageAlt: heroImage?.getAttribute('alt') || '',
    contentHtml: extractBodyHtml(document, migratedSlugs),
    sourceType: main?.getAttribute('data-source-type') || 'desktop',
    categories: metadata.categories,
  };
}

export async function importModernBlogPosts(sourceDir) {
  const entries = await readdir(sourceDir);
  const htmlFiles = entries.filter((entry) => entry.endsWith('.html') && entry !== 'index.html').sort();
  const migratedSlugs = getKnownPostSlugs(entries);

  const posts = await Promise.all(
    htmlFiles.map(async (entry) => {
      const slug = path.basename(entry, '.html');
      const html = await readFile(path.join(sourceDir, entry), 'utf-8');
      return parseModernBlogPost(html, { slug, migratedSlugs });
    })
  );

  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
