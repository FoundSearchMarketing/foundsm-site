import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'vzneqxsx',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// GROQ Queries

export const allPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  featuredImage,
  "category": category->{ title, slug },
  "author": author->{ name, title, image }
}`;

export const postBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
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
  "author": author->{ name, title, image, bio, linkedin }
}`;

export const allCategoriesQuery = `*[_type == "blogCategory"] | order(title asc) {
  _id,
  title,
  slug
}`;

export const allTeamMembersQuery = `*[_type == "teamMember"] | order(order asc) {
  _id,
  name,
  slug,
  role,
  image,
  bio,
  linkedin
}`;

export const relatedPostsQuery = `*[_type == "blogPost" && slug.current != $slug && category._ref == $categoryId] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  featuredImage,
  "category": category->{ title, slug }
}`;

export const allLandingPagesQuery = `*[_type == "landingPage"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  seoTitle,
  seoDescription
}`;

export const landingPageBySlugQuery = `*[_type == "landingPage" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  seoTitle,
  seoDescription,
  ogImage,
  hideNavigation,
  hideFooter,
  abTestVariant,
  sections[] {
    _type,
    _key,
    ...,
    "backgroundImage": backgroundImage.asset->url,
    "authorImage": authorImage.asset->url,
    "image": image.asset->url,
    "ogImage": ogImage.asset->url,
    logos[] {
      "url": asset->url,
      alt
    }
  }
}`;
