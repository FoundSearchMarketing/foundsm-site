import { sanityClient, urlFor } from './sanity';
import wpExportPosts from '../../scripts/wp-export/posts.json';

export interface BlogPostCategory {
  label: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  wpId?: number;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  robots: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaJson?: string;
  excerpt: string;
  publishedAt: string;
  modifiedAt?: string;
  publishedLabel: string;
  authorName: string;
  authorTitle: string;
  authorUrl: string;
  heroImage: string;
  heroImageAlt: string;
  contentHtml: string;
  wordpressContentHtml?: string;
  wordpressHeroImage?: string;
  wordpressHeroElementId?: string;
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
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: SanityBlock;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: SanityBlock;
  schemaJson?: string;
  category?: SanityCategory | null;
  author?: SanityAuthor | null;
};
type ExportedWpPost = {
  wp_id: number;
  title?: string;
  slug?: string;
  content_html?: string;
  featuredImage?: {
    url?: string;
  };
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
  canonicalUrl,
  robots,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
  schemaJson,
  "category": category->{ title, slug },
  "author": author->{ name, title, linkedin }
}`;

const exactWordPressPostIds = new Set([3436, 4358, 6193, 5535, 4980, 2464, 4486, 2256, 5376, 3810]);
const exactWordPressPostLocalStyleIds = new Set([4358, 6193, 5535, 4980, 5376]);
const exactWordPressPostsBySlug = new Map(
  (wpExportPosts as ExportedWpPost[])
    .filter((post) => post.slug && exactWordPressPostIds.has(post.wp_id))
    .map((post) => [post.slug as string, post])
);

export function getWordPressPostStylesheets(post: BlogPost | undefined): string[] {
  if (!post?.wordpressContentHtml || !post.wpId) return [];

  return [
    'https://foundsm.com/found2025/wp-content/cache/min/1/zwu6tef.css?ver=1778763378',
    'https://foundsm.com/found2025/wp-content/uploads/elementor/css/custom-frontend.min.css?ver=1778763374',
    'https://foundsm.com/found2025/wp-content/uploads/elementor/css/custom-apple-webkit.min.css?ver=1778763374',
    'https://foundsm.com/found2025/wp-content/plugins/elementor/assets/css/widget-heading.min.css?ver=4.0.5',
    'https://foundsm.com/found2025/wp-content/plugins/elementor/assets/css/widget-image.min.css?ver=4.0.5',
    'https://foundsm.com/found2025/wp-content/plugins/elementor/assets/css/widget-video.min.css?ver=4.0.5',
    'https://foundsm.com/found2025/wp-content/plugins/elementor-pro/assets/css/widget-post-info.min.css?ver=4.0.0',
    'https://foundsm.com/found2025/wp-content/uploads/elementor/css/custom-widget-icon-list.min.css?ver=1778763374',
    'https://foundsm.com/found2025/wp-content/plugins/elementor/assets/css/widget-divider.min.css?ver=4.0.5',
    'https://foundsm.com/found2025/wp-content/plugins/elementor/assets/css/widget-spacer.min.css?ver=4.0.5',
    'https://foundsm.com/found2025/wp-content/plugins/elementor-pro/assets/css/widget-post-navigation.min.css?ver=4.0.0',
    'https://foundsm.com/found2025/wp-content/uploads/elementor/css/post-5.css?ver=1778763375',
    `https://foundsm.com/found2025/wp-content/uploads/elementor/css/post-${post.wpId}.css`,
    'https://foundsm.com/found2025/wp-content/uploads/elementor/css/base-desktop.css?ver=6a05c66fc915f',
    ...(exactWordPressPostLocalStyleIds.has(post.wpId)
      ? [`https://foundsm.com/found2025/wp-content/uploads/elementor/css/local-${post.wpId}-frontend-desktop.css`]
      : []),
    'https://foundsm.com/found2025/wp-content/uploads/elementor/css/post-2143.css?ver=1778763385',
  ];
}

export function getWordPressPostInlineCss(post: BlogPost | undefined): string {
  if (!post?.wordpressContentHtml || !post.wpId) {
    return '';
  }

  const scopedElementorTokens = [
    'body.wordpress-post-page .blog-post__article--wordpress{',
    '--e-global-color-primary:#8DC63F;',
    '--e-global-color-secondary:#F05660;',
    '--e-global-color-text:#231f20;',
    '--e-global-color-accent:#231f20;',
    '--e-global-color-7eefa53:#8DC63F;',
    '--e-global-color-0441cdc:#F05660;',
    '--e-global-color-5c14d24:#0AADEF;',
    '--e-global-color-3f7b50c:#FA9828;',
    '--e-global-color-dac2337:#231F20;',
    '--e-global-color-04e5a1c:#F2F3F2;',
    '--e-global-color-19dc118:#414042;',
    '--e-global-color-44751e2:#FFFFFF;',
    '--e-global-color-aafeeb9:#B9DC89;',
    '--e-global-typography-primary-font-family:"Poppins";',
    '--e-global-typography-primary-font-size:26px;',
    '--e-global-typography-primary-font-weight:400;',
    '--e-global-typography-primary-line-height:40px;',
    '--e-global-typography-secondary-font-family:"Fraunces";',
    '--e-global-typography-secondary-font-size:20px;',
    '--e-global-typography-secondary-font-weight:400;',
    '--e-global-typography-secondary-line-height:36px;',
    '--e-global-typography-text-font-family:"Poppins";',
    '--e-global-typography-text-font-size:20px;',
    '--e-global-typography-text-font-weight:400;',
    '--e-global-typography-text-line-height:36px;',
    '--e-global-typography-accent-font-family:"Poppins";',
    '--e-global-typography-accent-font-size:24px;',
    '--e-global-typography-accent-font-weight:500;',
    '--e-global-typography-accent-text-transform:none;',
    '--e-global-typography-accent-line-height:28px;',
    '--e-global-typography-3b1f44f-font-family:"Fraunces";',
    '--e-global-typography-3b1f44f-font-size:85px;',
    '--e-global-typography-3b1f44f-font-weight:900;',
    '--e-global-typography-3b1f44f-line-height:90px;',
    '--e-global-typography-3b1f44f-letter-spacing:-2px;',
    '--e-global-typography-ed06a8a-font-family:"Fraunces";',
    '--e-global-typography-ed06a8a-font-size:60px;',
    '--e-global-typography-ed06a8a-font-weight:900;',
    '--e-global-typography-ed06a8a-line-height:65px;',
    '--e-global-typography-ed06a8a-letter-spacing:-1.5px;',
    '--e-global-typography-38f3b4a-font-family:"Fraunces";',
    '--e-global-typography-38f3b4a-font-size:40px;',
    '--e-global-typography-38f3b4a-font-weight:900;',
    '--e-global-typography-38f3b4a-line-height:44px;',
    '--e-global-typography-38f3b4a-letter-spacing:-1px;',
    '--e-global-typography-47454d3-font-family:"Poppins";',
    '--e-global-typography-47454d3-font-size:40px;',
    '--e-global-typography-47454d3-font-weight:700;',
    '--e-global-typography-47454d3-line-height:44px;',
    '--e-global-typography-47454d3-letter-spacing:-1px;',
    '--e-global-typography-1b6fed1-font-family:"Poppins";',
    '--e-global-typography-1b6fed1-font-size:30px;',
    '--e-global-typography-1b6fed1-font-weight:700;',
    '--e-global-typography-1b6fed1-line-height:40px;',
    '--e-global-typography-1b6fed1-letter-spacing:-0.2px;',
    '--e-global-typography-3284f7c-font-family:"Poppins";',
    '--e-global-typography-3284f7c-font-size:24px;',
    '--e-global-typography-3284f7c-font-weight:700;',
    '--e-global-typography-3284f7c-line-height:32px;',
    '--e-global-typography-3284f7c-letter-spacing:-0.2px;',
    '--e-global-typography-1fdfebb-font-family:"Poppins";',
    '--e-global-typography-1fdfebb-font-size:20px;',
    '--e-global-typography-1fdfebb-font-weight:700;',
    '--e-global-typography-1fdfebb-line-height:32px;',
    '--e-global-typography-1fdfebb-letter-spacing:0px;',
    '--e-global-typography-cf9586d-font-family:"Poppins";',
    '--e-global-typography-cf9586d-font-size:85px;',
    '--e-global-typography-cf9586d-font-weight:700;',
    '--e-global-typography-cf9586d-line-height:104px;',
    '--e-global-typography-cf9586d-letter-spacing:-2px;',
    '--e-global-typography-8d74701-font-family:"Poppins";',
    '--e-global-typography-8d74701-font-size:20px;',
    '--e-global-typography-8d74701-font-weight:500;',
    '--e-global-typography-8d74701-text-transform:none;',
    '--e-global-typography-8d74701-line-height:24px;',
    '--e-global-typography-5d55fac-font-family:"Poppins";',
    '--e-global-typography-5d55fac-font-size:20px;',
    '--e-global-typography-5d55fac-font-weight:300;',
    '--e-global-typography-5d55fac-text-transform:uppercase;',
    '--e-global-typography-5d55fac-line-height:28px;',
    '--e-global-typography-5d55fac-letter-spacing:3px;',
    '--e-global-typography-0ee76f2-font-family:"Poppins";',
    '--e-global-typography-0ee76f2-font-size:16px;',
    '--e-global-typography-0ee76f2-line-height:30px;',
    'color:var(--e-global-color-text);',
    'font-family:var(--e-global-typography-text-font-family),Sans-serif;',
    'font-size:var(--e-global-typography-text-font-size);',
    'font-weight:var(--e-global-typography-text-font-weight);',
    'line-height:var(--e-global-typography-text-line-height);',
    '}',
    'body.wordpress-post-page .blog-post__article--wordpress > .elementor{width:calc(100% - 20px);margin-inline:auto;}',
    'body.wordpress-post-page .blog-post__article--wordpress p{margin-block-start:0;margin-block-end:20px;}',
    'body.wordpress-post-page .blog-post__article--wordpress p+p{margin-block-start:0;}',
    'body.wordpress-post-page .blog-post__article--wordpress a{color:#8DC63F;}',
    'body.wordpress-post-page .blog-post__article--wordpress h1,body.wordpress-post-page .blog-post__article--wordpress h2,body.wordpress-post-page .blog-post__article--wordpress h3,body.wordpress-post-page .blog-post__article--wordpress h4,body.wordpress-post-page .blog-post__article--wordpress h5,body.wordpress-post-page .blog-post__article--wordpress h6{margin-block-start:0;color:var(--e-global-color-text);}',
    'body.wordpress-post-page .blog-post__article--wordpress h1,body.wordpress-post-page .blog-post__article--wordpress h2{margin-block-end:20px;}',
    'body.wordpress-post-page .blog-post__article--wordpress h3{margin-block-end:15px;font-family:var(--e-global-typography-47454d3-font-family),Sans-serif;font-weight:var(--e-global-typography-47454d3-font-weight);letter-spacing:var(--e-global-typography-47454d3-letter-spacing);}',
    'body.wordpress-post-page .blog-post__article--wordpress h2{font-family:var(--e-global-typography-38f3b4a-font-family),Sans-serif;font-size:var(--e-global-typography-38f3b4a-font-size);font-weight:var(--e-global-typography-38f3b4a-font-weight);line-height:var(--e-global-typography-38f3b4a-line-height);letter-spacing:var(--e-global-typography-38f3b4a-letter-spacing);}',
    'body.wordpress-post-page .blog-post__article--wordpress ul{list-style:disc;padding-left:20px;}',
    'body.wordpress-post-page .blog-post__article--wordpress ol{padding-left:20px;}',
    'body.wordpress-post-page .blog-post__article--wordpress ul li{margin-bottom:15px;}',
    'body.wordpress-post-page .blog-post__article--wordpress table{background-color:transparent;border-spacing:0;font-size:.9em;margin-block-end:15px;width:100%;}',
    'body.wordpress-post-page .blog-post__article--wordpress table td,body.wordpress-post-page .blog-post__article--wordpress table th{border:1px solid rgba(128,128,128,.5);line-height:1.5;padding:15px;vertical-align:top;}',
    'body.wordpress-post-page .blog-post__article--wordpress table th{font-weight:700;}',
    'body.wordpress-post-page .blog-post__article--wordpress table tbody>tr:nth-child(odd)>td,body.wordpress-post-page .blog-post__article--wordpress table tbody>tr:nth-child(odd)>th{background-color:rgba(128,128,128,.07);}',
    'body.wordpress-post-page .blog-post__article--wordpress table tbody tr:hover>td,body.wordpress-post-page .blog-post__article--wordpress table tbody tr:hover>th{background-color:rgba(128,128,128,.1);}',
    'body.wordpress-post-page .blog-post__article--wordpress .elementor-button{',
    'background-color:var(--e-global-color-text);',
    'border-radius:35px;',
    'color:var(--e-global-color-44751e2);',
    'font-family:var(--e-global-typography-8d74701-font-family),Sans-serif;',
    'font-size:var(--e-global-typography-8d74701-font-size);',
    'font-weight:var(--e-global-typography-8d74701-font-weight);',
    'line-height:var(--e-global-typography-8d74701-line-height);',
    'padding:18px 30px;',
    'text-transform:var(--e-global-typography-8d74701-text-transform);',
    '}',
    'body.wordpress-post-page .blog-post__article--wordpress .elementor-button:hover,body.wordpress-post-page .blog-post__article--wordpress .elementor-button:focus{background-color:#231F20BF;}',
    'body.wordpress-post-page .blog-post__article--wordpress .elementor-widget-image img{display:inline-block;vertical-align:middle;}',
    'body.wordpress-post-page .blog-post__article--wordpress .elementor-widget-video .elementor-wrapper{aspect-ratio:16 / 9;}',
    'body.wordpress-post-page .blog-post__article--wordpress .elementor-widget-video iframe{display:block;width:100%;height:100%;border:0;}',
    'body.wordpress-post-page .blog-post__article--wordpress .elementor-3436 .elementor-element.elementor-element-96c2a8c h2{margin-bottom:20px;}',
    '@media(max-width:1024px){body.wordpress-post-page .blog-post__article--wordpress{',
    '--e-global-typography-primary-font-size:24px;',
    '--e-global-typography-primary-line-height:30px;',
    '--e-global-typography-secondary-font-size:18px;',
    '--e-global-typography-secondary-line-height:32px;',
    '--e-global-typography-text-font-size:18px;',
    '--e-global-typography-text-line-height:30px;',
    '--e-global-typography-accent-font-size:18px;',
    '--e-global-typography-accent-line-height:22px;',
    '--e-global-typography-3b1f44f-font-size:45px;',
    '--e-global-typography-3b1f44f-line-height:50px;',
    '--e-global-typography-3b1f44f-letter-spacing:-1.5px;',
    '--e-global-typography-ed06a8a-font-size:38px;',
    '--e-global-typography-ed06a8a-line-height:42px;',
    '--e-global-typography-ed06a8a-letter-spacing:-1.2px;',
    '--e-global-typography-38f3b4a-font-size:34px;',
    '--e-global-typography-38f3b4a-line-height:39px;',
    '--e-global-typography-38f3b4a-letter-spacing:-1px;',
    '--e-global-typography-47454d3-font-size:34px;',
    '--e-global-typography-47454d3-line-height:42px;',
    '--e-global-typography-47454d3-letter-spacing:-0.8px;',
    '--e-global-typography-1b6fed1-font-size:24px;',
    '--e-global-typography-1b6fed1-line-height:32px;',
    '--e-global-typography-1b6fed1-letter-spacing:-0.5px;',
    '--e-global-typography-3284f7c-font-size:20px;',
    '--e-global-typography-3284f7c-line-height:26px;',
    '--e-global-typography-3284f7c-letter-spacing:-0.4px;',
    '--e-global-typography-1fdfebb-font-size:18px;',
    '--e-global-typography-1fdfebb-line-height:30px;',
    '--e-global-typography-1fdfebb-letter-spacing:-0.2px;',
    '--e-global-typography-cf9586d-font-size:50px;',
    '--e-global-typography-cf9586d-line-height:56px;',
    '--e-global-typography-cf9586d-letter-spacing:-1.2px;',
    '--e-global-typography-8d74701-font-size:16px;',
    '--e-global-typography-8d74701-line-height:20px;',
    '--e-global-typography-5d55fac-font-size:18px;',
    '--e-global-typography-5d55fac-line-height:22px;',
    '}body.wordpress-post-page .blog-post__article--wordpress .elementor-button{padding:18px 25px;}}',
    '@media(max-width:767px){body.wordpress-post-page .blog-post__article--wordpress{',
    '--e-global-typography-accent-font-size:16px;',
    '--e-global-typography-accent-line-height:20px;',
    '}body.wordpress-post-page .blog-post__article--wordpress .elementor-button{padding:15px 22px;}}',
  ].join('');

  const heroBackground = post.wordpressHeroImage && post.wordpressHeroElementId
    ? [
        `.elementor-${post.wpId} .elementor-element.elementor-element-${post.wordpressHeroElementId}:not(.elementor-motion-effects-element-type-background),`,
        `.elementor-${post.wpId} .elementor-element.elementor-element-${post.wordpressHeroElementId} > .elementor-motion-effects-container > .elementor-motion-effects-layer{`,
        `background-image:url("${escapeCssUrl(post.wordpressHeroImage)}");`,
        '}',
      ].join('')
    : '';

  return `${scopedElementorTokens}${heroBackground}`;
}

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

  const exactWordPressPost = exactWordPressPostsBySlug.get(slug);
  const publishedAt = normalizeDate(post.publishedAt);
  const category = post.category?.title
    ? {
        label: post.category.title,
        slug: post.category.slug?.current || slugify(post.category.title),
      }
    : undefined;

  const heroImage = imageUrl(post.featuredImage, 1200, 801);
  const canonicalUrl = post.canonicalUrl || `https://foundsm.com/insights/${slug}/`;

  return {
    id: stableId(post._id || slug),
    wpId: exactWordPressPost?.wp_id,
    slug,
    title: exactWordPressPost?.title || post.title,
    seoTitle: post.seoTitle || `${exactWordPressPost?.title || post.title} | Found Search Marketing`,
    seoDescription: post.seoDescription || post.excerpt || '',
    canonicalUrl,
    robots: post.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogTitle: post.ogTitle,
    ogDescription: post.ogDescription,
    ogImage: imageUrl(post.ogImage, 1200, 630),
    twitterCard: post.twitterCard,
    twitterTitle: post.twitterTitle,
    twitterDescription: post.twitterDescription,
    twitterImage: imageUrl(post.twitterImage, 1200, 630),
    schemaJson: post.schemaJson,
    excerpt: post.excerpt || post.seoDescription || '',
    publishedAt,
    modifiedAt: publishedAt,
    publishedLabel: formatDateLabel(post.publishedAt || publishedAt),
    authorName: post.author?.name || '',
    authorTitle: post.author?.title || '',
    authorUrl: '',
    heroImage,
    heroImageAlt: post.featuredImage?.alt || post.title,
    contentHtml: renderContentHtml(post.body || [], slugs),
    wordpressContentHtml: exactWordPressPost?.content_html ? normalizeWordPressContentHtml(exactWordPressPost.content_html) : undefined,
    wordpressHeroImage: exactWordPressPost?.featuredImage?.url,
    wordpressHeroElementId: exactWordPressPost?.content_html ? findHeroBackgroundElementId(exactWordPressPost.content_html) : undefined,
    categories: category ? [category] : [],
  };
}

function normalizeWordPressContentHtml(html: string): string {
  return injectWordPressVideoIframes(html)
    .replace(/href="https:\/\/foundsm\.com\/DataConnect\//gi, 'href="https://foundsm.com/dataconnect/')
    .replace(/https:\/\/foundsm\.com\/found2025\/wp-content\/uploads\/elementor\/thumbs\/data_download_blog_cta-[^"]+\.webp/gi, 'https://foundsm.com/found2025/wp-content/uploads/2026/01/data_download_blog_cta.png')
    .replace(/(<img\b(?![^>]*\bloading=))/gi, '$1 loading="lazy"')
    .trim();
}

function injectWordPressVideoIframes(html: string): string {
  return html.replace(
    /(<div class="elementor-element[^"]*elementor-widget-video"[^>]*data-settings="([^"]+)"[^>]*>[\s\S]*?<div class="elementor-wrapper[^"]*">)\s*<div class="elementor-video"><\/div>/gi,
    (match, prefix: string, encodedSettings: string) => {
      const youtubeId = getYouTubeIdFromElementorSettings(encodedSettings);

      if (!youtubeId) {
        return match;
      }

      return `${prefix}<iframe class="elementor-video elementor-video-iframe" src="https://www.youtube.com/embed/${youtubeId}?feature=oembed&cc_load_policy=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`;
    }
  );
}

function getYouTubeIdFromElementorSettings(encodedSettings: string): string | undefined {
  try {
    const settings = JSON.parse(decodeHtmlAttribute(encodedSettings)) as { youtube_url?: unknown };
    const youtubeUrl = typeof settings.youtube_url === 'string' ? settings.youtube_url : '';

    return youtubeUrl.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1];
  } catch {
    return undefined;
  }
}

function decodeHtmlAttribute(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function findHeroBackgroundElementId(html: string): string | undefined {
  return html.match(/elementor-element-([a-z0-9]+)[^"]*elementor-hidden-tablet[^"]*elementor-hidden-mobile/i)?.[1];
}

function escapeCssUrl(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
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
    const url = new URL(href, 'https://foundsm.com');
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
