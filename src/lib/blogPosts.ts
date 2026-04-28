import { sanityClient, urlFor } from './sanity';

export interface BlogPostCategory {
  label: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  publishedAt: string;
  publishedLabel: string;
  authorName: string;
  authorTitle: string;
  authorUrl: string;
  heroImage: string;
  heroImageAlt: string;
  contentHtml: string;
  sourceType: string;
  categories: BlogPostCategory[];
}

export interface BlogPostNavigation {
  previous?: BlogPost;
  next?: BlogPost;
}

type SanitySlug = { current?: string };
type SanityCategory = { title?: string; slug?: SanitySlug };
type SanityAuthor = {
  name?: string;
  title?: string;
  linkedin?: string;
};
type SanitySpan = {
  _key?: string;
  _type: 'span';
  text?: string;
  marks?: string[];
};
type SanityMarkDef = {
  _key: string;
  _type: string;
  href?: string;
};
type SanityBlock = {
  _key?: string;
  _type: string;
  style?: string;
  children?: SanitySpan[];
  markDefs?: SanityMarkDef[];
  listItem?: 'bullet' | 'number';
  level?: number;
  asset?: { _ref: string };
  alt?: string;
  caption?: string;
};
type SanityBlogPost = {
  _id: string;
  title?: string;
  slug?: SanitySlug;
  publishedAt?: string;
  excerpt?: string;
  body?: SanityBlock[];
  featuredImage?: SanityBlock;
  seoTitle?: string;
  seoDescription?: string;
  category?: SanityCategory | null;
  author?: SanityAuthor | null;
};

type RenderGroup =
  | { type: 'list'; listType: 'bullet' | 'number'; items: SanityBlock[] }
  | { type: 'block'; block: SanityBlock };
type RenderState = { sectionCount: number };
type RenderOptions = { linkClass?: string };

const sanityBlogPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  body,
  featuredImage,
  seoTitle,
  seoDescription,
  "category": category->{ title, slug },
  "author": author->{ name, title, linkedin }
}`;

let blogPostsPromise: Promise<BlogPost[]> | undefined;

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  blogPostsPromise ??= loadSanityBlogPosts();
  return blogPostsPromise;
}

export async function getBlogPostBySlug(slug: string | undefined): Promise<BlogPost | undefined> {
  if (!slug) return undefined;
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getBlogPostNavigation(slug: string): Promise<BlogPostNavigation> {
  const posts = await getAllBlogPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};

  return {
    previous: posts[index + 1],
    next: posts[index - 1],
  };
}

export async function getAllBlogCategories(): Promise<BlogPostCategory[]> {
  const categories = new Map<string, BlogPostCategory>();
  const posts = await getAllBlogPosts();
  posts.forEach((post) => {
    post.categories.forEach((category) => categories.set(category.slug, category));
  });
  return [...categories.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export async function getLatestBlogPosts(limit = 2): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
}

export function toLatestPostCards(posts: BlogPost[], limit = 2) {
  return posts.slice(0, limit).map((post) => ({
    type: 'Blog',
    categories: post.categories.map((category) => category.label).join(', '),
    title: post.title,
    href: `/insights/${post.slug}/`,
    imageSrc: post.heroImage,
    imageAlt: post.heroImageAlt,
    date: post.publishedLabel,
    excerpt: post.excerpt,
    ctaLabel: 'Keep Reading',
  }));
}

export function toInsightsArticleCards(posts: BlogPost[]) {
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    url: `/insights/${post.slug}/`,
    categories: post.categories,
    dateLabel: post.publishedLabel,
    datetime: post.publishedAt,
    excerpt: post.excerpt,
    image: {
      src: post.heroImage,
      width: 1200,
      height: 800,
      alt: post.heroImageAlt,
      wpImageId: post.id,
    },
  }));
}

async function loadSanityBlogPosts(): Promise<BlogPost[]> {
  let sanityPosts: SanityBlogPost[];

  try {
    sanityPosts = await sanityClient.fetch<SanityBlogPost[]>(sanityBlogPostsQuery);
  } catch (error) {
    throw new Error(`Unable to load Sanity blog posts: ${formatUnknownError(error)}`);
  }

  if (!Array.isArray(sanityPosts)) {
    throw new Error('Unable to load Sanity blog posts: Sanity returned an unexpected response.');
  }

  const slugs = new Set(sanityPosts.map((post) => post.slug?.current).filter(Boolean) as string[]);
  const posts = sanityPosts.map((post) => mapSanityPost(post, slugs)).filter(Boolean) as BlogPost[];

  if (posts.length === 0) {
    throw new Error(`Unable to load Sanity blog posts: Sanity returned ${sanityPosts.length} records, but none had a usable slug and title.`);
  }

  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

function mapSanityPost(post: SanityBlogPost, slugs: Set<string>): BlogPost | undefined {
  const slug = post.slug?.current;
  if (!slug || !post.title) return undefined;

  const publishedAt = normalizeDate(post.publishedAt);
  const category = post.category?.title
    ? {
        label: post.category.title,
        slug: post.category.slug?.current || slugify(post.category.title),
      }
    : undefined;

  const heroImage = imageUrl(post.featuredImage, 1200, 801);

  return {
    id: stableId(post._id || slug),
    slug,
    title: post.title,
    seoTitle: post.seoTitle || `${post.title} | Found Search Marketing`,
    excerpt: post.excerpt || post.seoDescription || '',
    publishedAt,
    publishedLabel: formatDateLabel(post.publishedAt || publishedAt),
    authorName: post.author?.name || '',
    authorTitle: post.author?.title || '',
    authorUrl: '',
    heroImage,
    heroImageAlt: post.featuredImage?.alt || post.title,
    contentHtml: renderContentHtml(post.body || [], slugs),
    sourceType: 'sanity',
    categories: category ? [category] : [],
  };
}

function renderContentHtml(blocks: SanityBlock[], slugs: Set<string>): string {
  const state = { sectionCount: 0 };
  const bodyHtml = groupBlocks(blocks)
    .map((group) => renderGroup(group, slugs, state))
    .filter(Boolean)
    .join('');

  return `<section class="blog-post__content-section article-content">${bodyHtml}</section>`;
}

function groupBlocks(blocks: SanityBlock[]): RenderGroup[] {
  const groups: RenderGroup[] = [];

  for (const block of blocks) {
    if (block._type === 'block' && block.listItem) {
      const last = groups[groups.length - 1];
      if (last?.type === 'list' && last.listType === block.listItem) {
        last.items.push(block);
      } else {
        groups.push({ type: 'list', listType: block.listItem, items: [block] });
      }
      continue;
    }

    groups.push({ type: 'block', block });
  }

  return groups;
}

function renderGroup(group: RenderGroup, slugs: Set<string>, state: RenderState): string {
  if (group.type === 'list') {
    if (isTableOfContentsList(group)) {
      const items = group.items
        .map((block) => `<li class="blog-post__toc-item">${renderChildren(block, slugs, { linkClass: 'blog-post__toc-link' })}</li>`)
        .join('');
      return `<nav class="blog-post__toc" aria-label="Table of contents"><h2 class="blog-post__toc-title">Table of Contents</h2><ul class="blog-post__toc-list">${items}</ul></nav>`;
    }

    const tag = group.listType === 'bullet' ? 'ul' : 'ol';
    const items = group.items.map((block) => `<li>${renderChildren(block, slugs)}</li>`).join('');
    return `<${tag}>${items}</${tag}>`;
  }

  return renderBlock(group.block, slugs, state);
}

function renderBlock(block: SanityBlock, slugs: Set<string>, state: RenderState): string {
  if (block._type === 'image' && block.asset) {
    const src = imageUrl(block, 1200);
    if (!src) return '';

    return [
      '<figure class="blog-post__figure">',
      `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(block.alt || '')}" loading="lazy">`,
      block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : '',
      '</figure>',
    ].join('');
  }

  if (block._type !== 'block') return '';

  const inner = renderChildren(block, slugs);
  if (!inner.trim()) return '';

  const style = block.style || 'normal';
  if (style === 'blockquote') return `<blockquote><p>${inner}</p></blockquote>`;
  if (/^h[1-6]$/.test(style)) {
    const id = style === 'h2' ? ` id="section${++state.sectionCount}"` : '';
    return `<${style}${id}>${inner}</${style}>`;
  }

  return `<p>${inner}</p>`;
}

function renderChildren(block: SanityBlock, slugs: Set<string>, options: RenderOptions = {}): string {
  const markDefs = block.markDefs || [];
  return (block.children || []).map((span) => renderSpan(span, markDefs, slugs, options)).join('');
}

function renderSpan(span: SanitySpan, markDefs: SanityMarkDef[], slugs: Set<string>, options: RenderOptions): string {
  let text = escapeHtml(span.text || '').replace(/\n/g, '<br>');

  for (const mark of span.marks || []) {
    if (mark === 'strong') text = `<strong>${text}</strong>`;
    else if (mark === 'em') text = `<em>${text}</em>`;
    else if (mark === 'underline') text = `<u>${text}</u>`;
    else if (mark === 'code') text = `<code>${text}</code>`;
    else {
      const def = markDefs.find((markDef) => markDef._key === mark);
      if (def?._type === 'link' && def.href) {
        const href = rewriteHref(def.href, slugs);
        const external = /^https?:\/\//i.test(href);
        const rel = external ? ' rel="noopener noreferrer" target="_blank"' : '';
        const className = options.linkClass ? ` class="${escapeAttribute(options.linkClass)}"` : '';
        text = `<a${className} href="${escapeAttribute(href)}"${rel}>${text}</a>`;
      }
    }
  }

  return text;
}

function isTableOfContentsList(group: Extract<RenderGroup, { type: 'list' }>): boolean {
  if (group.listType !== 'bullet' || group.items.length < 3) return false;

  return group.items.every((block) => {
    const linkedMarks = new Set((block.children || []).flatMap((span) => span.marks || []));
    return (block.markDefs || []).some((markDef) => linkedMarks.has(markDef._key) && /^#section\d+$/i.test(markDef.href || ''));
  });
}

function rewriteHref(href: string, slugs: Set<string>): string {
  try {
    const url = new URL(href, 'https://www.foundsm.com');
    const isFoundDomain = url.hostname === 'foundsm.com' || url.hostname === 'www.foundsm.com';
    const match = url.pathname.match(/^\/insights\/([^/]+)\/?$/);

    if (isFoundDomain && match && slugs.has(match[1])) {
      return `/insights/${match[1]}/${url.search}${url.hash}`;
    }
  } catch {
    return href;
  }

  return href;
}

function imageUrl(source: SanityBlock | undefined, width: number, height?: number): string {
  if (!source?.asset) return '';

  try {
    const builder = urlFor(source as any).width(width).auto('format');
    return height ? builder.height(height).fit('crop').url() : builder.url();
  } catch {
    return '';
  }
}

function normalizeDate(value: string | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

function formatDateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(date);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function stableId(value: string): number {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatUnknownError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
