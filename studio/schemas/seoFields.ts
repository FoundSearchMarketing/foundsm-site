import { defineField } from 'sanity';

type SeoFieldOptions = {
  group?: string | false;
  descriptionMax?: number;
  includeCanonical?: boolean;
  includeOgImage?: boolean;
};

const robotsOptions = [
  { title: 'Index, follow', value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
  { title: 'Noindex, follow', value: 'noindex, follow' },
  { title: 'Noindex, nofollow', value: 'noindex, nofollow' },
];

export function createSeoFields({
  group = 'seo',
  descriptionMax = 180,
  includeCanonical = true,
  includeOgImage = true,
}: SeoFieldOptions = {}) {
  const groupConfig = group ? { group } : {};

  return [
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', ...groupConfig }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      ...groupConfig,
      validation: (Rule) => Rule.max(descriptionMax),
    }),
    ...(includeCanonical ? [defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url', ...groupConfig })] : []),
    defineField({
      name: 'robots',
      title: 'Robots',
      type: 'string',
      ...groupConfig,
      options: { list: robotsOptions },
    }),
    defineField({ name: 'ogTitle', title: 'Open Graph Title', type: 'string', ...groupConfig }),
    defineField({ name: 'ogDescription', title: 'Open Graph Description', type: 'text', rows: 2, ...groupConfig }),
    ...(includeOgImage ? [defineField({ name: 'ogImage', title: 'Open Graph Image', type: 'image', ...groupConfig, description: '1200x630 recommended' })] : []),
    defineField({
      name: 'twitterCard',
      title: 'Twitter Card',
      type: 'string',
      ...groupConfig,
      options: {
        list: [
          { title: 'Summary large image', value: 'summary_large_image' },
          { title: 'Summary', value: 'summary' },
        ],
      },
    }),
    defineField({ name: 'twitterTitle', title: 'Twitter Title', type: 'string', ...groupConfig }),
    defineField({ name: 'twitterDescription', title: 'Twitter Description', type: 'text', rows: 2, ...groupConfig }),
    defineField({ name: 'twitterImage', title: 'Twitter Image', type: 'image', ...groupConfig }),
    defineField({
      name: 'schemaJson',
      title: 'Schema JSON-LD Override',
      type: 'text',
      rows: 8,
      ...groupConfig,
      description: 'Optional raw JSON-LD. Leave empty to use generated Yoast-compatible schema.',
    }),
  ];
}
