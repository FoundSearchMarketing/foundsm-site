import { generatedBlogPosts } from '../data/blogPosts.generated';

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

export function getAllBlogPosts(): BlogPost[] {
  return [...generatedBlogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPostBySlug(slug: string | undefined): BlogPost | undefined {
  if (!slug) return undefined;
  return getAllBlogPosts().find((post) => post.slug === slug);
}

export function getBlogPostNavigation(slug: string): BlogPostNavigation {
  const posts = getAllBlogPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};

  return {
    previous: posts[index + 1],
    next: posts[index - 1],
  };
}

export function getAllBlogCategories(): BlogPostCategory[] {
  const categories = new Map<string, BlogPostCategory>();
  getAllBlogPosts().forEach((post) => {
    post.categories.forEach((category) => categories.set(category.slug, category));
  });
  return [...categories.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function toLatestPostCards(posts: BlogPost[] = getAllBlogPosts(), limit = 2) {
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

export function toInsightsArticleCards(posts: BlogPost[] = getAllBlogPosts()) {
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
