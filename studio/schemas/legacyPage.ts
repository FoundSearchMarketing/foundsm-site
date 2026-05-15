import { defineArrayMember, defineField, defineType } from 'sanity';
import { defaultLegacyPageTemplates, legacyPagePathOptions } from '../../src/lib/legacyPageData';

const linkAnnotation = defineArrayMember({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [defineField({ name: 'href', title: 'URL', type: 'string', validation: (Rule) => Rule.required() })],
});

const richTextField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [{ title: 'Normal', value: 'normal' }],
        lists: [],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' },
          ],
          annotations: [linkAnnotation],
        },
      }),
    ],
  });

const seoFields = [
  defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
  defineField({ name: 'seoDescription', title: 'Meta Description', type: 'text', rows: 3, group: 'seo', validation: (Rule) => Rule.max(180) }),
  defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url', group: 'seo' }),
  defineField({ name: 'ogImage', title: 'Open Graph Image', type: 'image', group: 'seo' }),
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

const ctaFields = [
  defineField({ name: 'label', title: 'Label', type: 'string' }),
  defineField({
    name: 'href',
    title: 'URL',
    type: 'string',
    validation: (Rule) =>
      Rule.custom((value, context) => {
        const parent = context.parent as { label?: string } | undefined;
        if (parent?.label && !value) return 'URL is required when label is set.';
        return true;
      }),
  }),
];

const imageFields = [
  defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
  defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
];

export default defineType({
  name: 'legacyPage',
  title: 'Legacy Page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'content', title: 'Content', default: true },
  ],
  fields: [
    ...seoFields,
    defineField({ name: 'title', title: 'Internal Title', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'path',
      title: 'Fixed URL Path',
      type: 'string',
      group: 'content',
      readOnly: true,
      options: { list: legacyPagePathOptions },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 3 }),
        ...imageFields,
      ],
    }),
    richTextField('body', 'Body'),
    defineField({
      name: 'listing',
      title: 'Listing Content',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'latestHeading', title: 'Latest Posts Heading', type: 'string' }),
        defineField({ name: 'heading', title: 'Listing Heading', type: 'string' }),
        richTextField('body', 'Listing Intro'),
        defineField({ name: 'filterLabel', title: 'Filter Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            richTextField('body', 'Body'),
            defineField({ name: 'cta', title: 'CTA', type: 'object', fields: ctaFields }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        richTextField('body', 'Body'),
        ...ctaFields,
      ],
    }),
    defineField({
      name: 'form',
      title: 'HubSpot Form',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        richTextField('body', 'Body'),
        defineField({ name: 'hubspotFormId', title: 'HubSpot Form ID', type: 'string' }),
      ],
    }),
  ],
  initialValue: defaultLegacyPageTemplates[0]?.value,
  preview: {
    select: { title: 'title', path: 'path' },
    prepare({ title, path }) {
      return { title: title || 'Legacy Page', subtitle: path };
    },
  },
});
