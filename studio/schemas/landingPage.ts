import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      group: 'content',
      description: 'Used internally to identify this landing page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({ type: 'heroBlock' }),
        defineArrayMember({ type: 'statsBlock' }),
        defineArrayMember({ type: 'featuresBlock' }),
        defineArrayMember({ type: 'testimonialBlock' }),
        defineArrayMember({ type: 'ctaBlock' }),
        defineArrayMember({ type: 'formBlock' }),
        defineArrayMember({ type: 'textBlock' }),
        defineArrayMember({ type: 'imageTextBlock' }),
        defineArrayMember({ type: 'logoBarBlock' }),
        defineArrayMember({ type: 'faqBlock' }),
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Overrides the internal title for the <title> tag',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      group: 'seo',
      description: '1200x630 recommended',
    }),
    defineField({
      name: 'hideNavigation',
      title: 'Hide Navigation',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Hide the main site navigation (useful for focused landing pages)',
    }),
    defineField({
      name: 'hideFooter',
      title: 'Hide Footer',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'abTestVariant',
      title: 'A/B Test Variant',
      type: 'string',
      group: 'settings',
      description: 'If set, this page is a variant. Enter the test ID (e.g., "homepage-hero-test"). The original page with the same test ID will be shown to control users.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({ title, slug }) {
      return {
        title: title,
        subtitle: slug ? `/${slug}` : 'No slug',
      };
    },
  },
});
