import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'vzneqxsx',
  dataset: import.meta.env.SANITY_DATASET || 'staging',
  useCdn: true,
  apiVersion: '2024-01-01',
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// GROQ Queries

const editableMediaProjection = `
  ...,
  "videoUrl": coalesce(videoFile.asset->url, videoUrl),
  "videoPoster": videoPoster.asset->url
`;

const editableCardProjection = `
  ${editableMediaProjection},
  "icon": icon.asset->url
`;

export const allPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  featuredImage,
  seoTitle,
  seoDescription,
  canonicalUrl,
  robots,
  ogTitle,
  ogDescription,
  "ogImage": ogImage.asset->url,
  twitterCard,
  twitterTitle,
  twitterDescription,
  "twitterImage": twitterImage.asset->url,
  schemaJson,
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
  canonicalUrl,
  robots,
  ogTitle,
  ogDescription,
  "ogImage": ogImage.asset->url,
  twitterCard,
  twitterTitle,
  twitterDescription,
  "twitterImage": twitterImage.asset->url,
  schemaJson,
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
  "videoUrl": coalesce(videoFile.asset->url, videoUrl),
  "videoPoster": videoPoster.asset->url,
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
  seoDescription,
  canonicalUrl,
  robots
}`;

export const homePageQuery = `*[_type == "homePage"][0] {
  _id,
  seoTitle,
  seoDescription,
  canonicalUrl,
  robots,
  ogTitle,
  ogDescription,
  "ogImage": ogImage.asset->url,
  twitterCard,
  twitterTitle,
  twitterDescription,
  "twitterImage": twitterImage.asset->url,
  schemaJson,
  hero,
  intro {
    heading,
    body,
    "image": image.asset->url,
    imageAlt,
    "videoUrl": coalesce(videoFile.asset->url, videoUrl),
    "videoPoster": videoPoster.asset->url
  },
  ctaStrip,
  clientLogos {
    heading,
    logos[] {
      "src": image.asset->url,
      alt
    }
  },
  outcomes {
    "image": image.asset->url,
    imageAlt,
    "videoUrl": coalesce(videoFile.asset->url, videoUrl),
    "videoPoster": videoPoster.asset->url,
    heading,
    body,
    ctaText,
    ctaUrl
  },
  metrics {
    spend,
    leads,
    experience,
    employees,
    testimonial {
      quote,
      authorName,
      authorTitle,
      authorCompany,
      "authorImage": authorImage.asset->url,
      authorImageAlt
    },
    ownershipCard,
    "image": image.asset->url,
    imageAlt,
    "videoUrl": coalesce(videoFile.asset->url, videoUrl),
    "videoPoster": videoPoster.asset->url
  },
  partners {
    heading,
    body,
    logos[] {
      "src": image.asset->url,
      alt
    },
    ctaText,
    ctaUrl
  },
  ecosystem {
    headingLines,
    introBody,
    tabListHeading,
    tabs[] {
      id,
      title,
      "icon": icon.asset->url,
      body,
      ctaText,
      ctaUrl,
      "image": image.asset->url,
      imageAlt,
      "videoUrl": coalesce(videoFile.asset->url, videoUrl),
      "videoPoster": videoPoster.asset->url
    }
  }
}`;

export const aboutPageQuery = `*[_id == "aboutPage"][0] {
  ...,
  hero { ${editableMediaProjection} },
  who { ${editableMediaProjection} },
  mission {
    ...,
    cards[] { ${editableCardProjection} }
  },
  values {
    ...,
    tabs[] { ${editableCardProjection} }
  },
  approach { ${editableMediaProjection} },
  team { ${editableMediaProjection} }
}`;

export const capabilitiesPageQuery = `*[_id == "capabilitiesPage"][0] {
  ...,
  hero { ${editableMediaProjection} },
  outcomes { ${editableMediaProjection} },
  workflow { ${editableMediaProjection} },
  details[] { ${editableMediaProjection} }
}`;

export const capabilityDetailPageQuery = `*[_type == "capabilityDetailPage" && _id == $id][0] {
  ...,
  hero { ${editableMediaProjection} },
  split { ${editableMediaProjection} },
  featureTabs {
    ...,
    tabs[] { ${editableCardProjection} }
  },
  primaryCards {
    ...,
    cards[] { ${editableCardProjection} }
  },
  secondarySplit { ${editableMediaProjection} },
  secondaryCards {
    ...,
    cards[] { ${editableCardProjection} }
  }
}`;

export const formPageQuery = `*[_type == "formPage" && _id == $id][0]`;

export const teamPageQuery = `*[_id == "teamPage"][0] {
  ...,
  hero { ${editableMediaProjection} }
}`;

export const notFoundPageQuery = `*[_id == "notFoundPage"][0]`;

export const approachPageQuery = `*[_id == "approachPage"][0] {
  ...,
  hero { ${editableMediaProjection} },
  intro { ${editableMediaProjection} },
  advantages {
    ...,
    items[] { ${editableCardProjection} }
  },
  partnerships {
    ...,
    tabs[] { ${editableMediaProjection} }
  }
}`;

export const privacyPolicyPageQuery = `*[_id == "privacyPolicyPage"][0]`;

export const eventLandingPageQuery = `*[_id == "eventLandingPage"][0]`;

export const insightsPageQuery = `*[_id == "insightsPage"][0] {
  ...,
  hero { ${editableMediaProjection} }
}`;

export const legacyPagesByPathsQuery = `*[_type == "legacyPage" && path in $paths] {
  _id,
  title,
  path,
  seoTitle,
  seoDescription,
  canonicalUrl,
  robots,
  ogTitle,
  ogDescription,
  "ogImage": ogImage.asset->url,
  twitterCard,
  twitterTitle,
  twitterDescription,
  "twitterImage": twitterImage.asset->url,
  schemaJson,
  hero,
  body,
  cards,
  cta,
  form
}`;

export const allAuthorsPageQuery = `*[_type == "author"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  title,
  team,
  foundStartDate,
  expertise,
  bio,
  linkedin,
  "image": image.asset->url,
  seoTitle,
  seoDescription,
  canonicalUrl,
  robots,
  ogTitle,
  ogDescription,
  "ogImage": ogImage.asset->url,
  twitterCard,
  twitterTitle,
  twitterDescription,
  "twitterImage": twitterImage.asset->url,
  schemaJson,
  wpId,
  profileHeading,
  "profileImage": coalesce(profileImage, image.asset->url),
  profileImageAlt,
  profileTeam,
  profileFoundStartDate,
  profileExpertise,
  profileBody,
  "latestPosts": *[_type == "blogPost" && references(^._id)] | order(publishedAt desc)[0...4] {
    title,
    "href": "/insights/" + slug.current + "/",
    "imageSrc": featuredImage.asset->url,
    "imageAlt": coalesce(featuredImage.alt, title),
    "imageWidth": 768,
    "imageHeight": 513,
    "date": publishedAt
  }
}`;

export const landingPageBySlugQuery = `*[_type == "landingPage" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  seoTitle,
  seoDescription,
  canonicalUrl,
  robots,
  ogTitle,
  ogDescription,
  "ogImage": ogImage.asset->url,
  twitterCard,
  twitterTitle,
  twitterDescription,
  "twitterImage": twitterImage.asset->url,
  schemaJson,
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
