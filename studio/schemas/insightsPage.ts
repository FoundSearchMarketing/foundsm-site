import { defineField, defineType } from 'sanity';
import { defaultInsightsPageData } from '../../src/lib/insightsPageData';

const groups = [
  { name: 'seo', title: 'SEO' },
  { name: 'content', title: 'Content', default: true },
];

const seoFields = [
  defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
  defineField({ name: 'seoDescription', title: 'Meta Description', type: 'text', rows: 3, group: 'seo', validation: (Rule) => Rule.max(180) }),
  defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url', group: 'seo' }),
  defineField({
    name: 'robots',
    title: 'Robots',
    type: 'string',
    group: 'seo',
    options: {
      list: [
        { title: 'Index, follow', value: 'index, follow' },
        { title: 'Noindex, follow', value: 'noindex, follow' },
        { title: 'Noindex, nofollow', value: 'noindex, nofollow' },
      ],
    },
  }),
];

export default defineType({
  name: 'insightsPage',
  title: 'Insights Page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
        defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
        defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
      ],
    }),
  ],
  initialValue: defaultInsightsPageData,
});
