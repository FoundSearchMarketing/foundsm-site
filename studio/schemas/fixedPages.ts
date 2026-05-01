import { defineArrayMember, defineField, defineType } from 'sanity';
import { defaultAboutPageData, defaultCapabilitiesPageData } from '../../src/lib/fixedPageData';

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
  defineField({ name: 'seoDescription', title: 'Meta Description', type: 'text', rows: 3, group: 'seo', validation: (Rule) => Rule.max(170) }),
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

const richSectionFields = [
  defineField({ name: 'heading', title: 'Heading', type: 'string' }),
  richTextField('body', 'Body'),
];

const cardMember = defineArrayMember({
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'lead', title: 'Lead', type: 'string' }),
    richTextField('body', 'Body'),
    defineField({ name: 'icon', title: 'Icon', type: 'image' }),
    defineField({ name: 'image', title: 'Image', type: 'image' }),
    defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
  ],
  preview: {
    select: { title: 'title', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Card', media };
    },
  },
});

const cardArrayField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [cardMember],
  });

const logoArrayField = defineField({
  name: 'logos',
  title: 'Logos',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      fields: [
        defineField({ name: 'image', title: 'Logo Image', type: 'image' }),
        defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (Rule) => Rule.required() }),
      ],
      preview: {
        select: { title: 'alt', media: 'image' },
      },
    }),
  ],
});

const tabArrayField = defineField({
  name: 'tabs',
  title: 'Tabs',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      fields: [
        defineField({ name: 'id', title: 'Stable ID', type: 'string', validation: (Rule) => Rule.regex(/^[a-z0-9-]+$/) }),
        defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
        richTextField('body', 'Body'),
        defineField({ name: 'icon', title: 'Icon', type: 'image' }),
        defineField({ name: 'image', title: 'Image', type: 'image' }),
        defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
      ],
      preview: {
        select: { title: 'title', media: 'image' },
      },
    }),
  ],
});

const groups = [
  { name: 'seo', title: 'SEO' },
  { name: 'content', title: 'Content', default: true },
];

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({ name: 'hero', title: 'Hero', type: 'object', group: 'content', fields: [...richSectionFields, ...imageFields] }),
    defineField({
      name: 'who',
      title: 'Who We Are',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        ...richSectionFields,
        defineField({ name: 'subheading', title: 'Credentials Heading', type: 'string' }),
        defineField({
          name: 'credentials',
          title: 'Credentials',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'image', title: 'Badge Image', type: 'image' }),
                defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
                defineField({ name: 'text', title: 'Text', type: 'string' }),
              ],
              preview: { select: { title: 'text', media: 'image' } },
            }),
          ],
        }),
        ...imageFields,
      ],
    }),
    defineField({
      name: 'mission',
      title: 'Mission',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'headingLines', title: 'Heading Lines', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
        cardArrayField('cards', 'Cards'),
      ],
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'object',
      group: 'content',
      fields: [defineField({ name: 'heading', title: 'Heading', type: 'string' }), tabArrayField],
    }),
    defineField({
      name: 'approach',
      title: 'Approach',
      type: 'object',
      group: 'content',
      fields: [...imageFields, ...richSectionFields, defineField({ name: 'cta', title: 'CTA', type: 'object', fields: ctaFields })],
    }),
    defineField({ name: 'team', title: 'Team Image', type: 'object', group: 'content', fields: [defineField({ name: 'heading', title: 'Heading', type: 'string' }), ...imageFields] }),
    defineField({ name: 'teamCta', title: 'Team CTA', type: 'object', group: 'content', fields: [richTextField('body', 'Body'), defineField({ name: 'cta', title: 'CTA', type: 'object', fields: ctaFields })] }),
  ],
  initialValue: defaultAboutPageData,
});

export const capabilitiesPage = defineType({
  name: 'capabilitiesPage',
  title: 'Capabilities Page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({ name: 'hero', title: 'Hero', type: 'object', group: 'content', fields: [...richSectionFields, ...imageFields] }),
    defineField({ name: 'outcomes', title: 'Outcomes', type: 'object', group: 'content', fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), ...richSectionFields, ...imageFields] }),
    defineField({ name: 'workflow', title: 'Workflow', type: 'object', group: 'content', fields: [...richSectionFields, defineField({ name: 'prompt', title: 'Prompt', type: 'string' }), ...imageFields] }),
    defineField({
      name: 'details',
      title: 'Capability Details',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [defineField({ name: 'id', title: 'Stable ID', type: 'string' }), ...richSectionFields, ...imageFields, defineField({ name: 'cta', title: 'CTA', type: 'object', fields: ctaFields })],
          preview: { select: { title: 'heading', media: 'image' } },
        }),
      ],
    }),
  ],
  initialValue: defaultCapabilitiesPageData,
});

export const capabilityDetailPage = defineType({
  name: 'capabilityDetailPage',
  title: 'Capability Detail Page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({ name: 'hero', title: 'Hero', type: 'object', group: 'content', fields: [...richSectionFields, ...imageFields] }),
    defineField({ name: 'split', title: 'How We Work', type: 'object', group: 'content', fields: [...richSectionFields, ...imageFields] }),
    defineField({ name: 'statement', title: 'Statement Band', type: 'object', group: 'content', fields: [defineField({ name: 'lead', title: 'Lead', type: 'string' }), richTextField('body', 'Body')] }),
    defineField({ name: 'featureTabs', title: 'Feature Tabs', type: 'object', group: 'content', fields: [defineField({ name: 'idPrefix', title: 'ID Prefix', type: 'string' }), tabArrayField] }),
    defineField({ name: 'primaryCards', title: 'Primary Cards', type: 'object', group: 'content', fields: [defineField({ name: 'title', title: 'Heading', type: 'string' }), defineField({ name: 'subtitle', title: 'Subtitle', type: 'text' }), cardArrayField('cards', 'Cards')] }),
    defineField({ name: 'secondarySplit', title: 'Secondary Split Feature', type: 'object', group: 'content', fields: [...richSectionFields, ...imageFields] }),
    defineField({ name: 'secondaryCards', title: 'Secondary Cards', type: 'object', group: 'content', fields: [defineField({ name: 'title', title: 'Heading', type: 'string' }), defineField({ name: 'subtitle', title: 'Subtitle', type: 'text' }), cardArrayField('cards', 'Cards')] }),
    defineField({ name: 'logoMarquee', title: 'Logo Marquee', type: 'object', group: 'content', fields: [defineField({ name: 'title', title: 'Heading', type: 'string' }), logoArrayField] }),
    defineField({ name: 'cta', title: 'CTA', type: 'object', group: 'content', fields: [defineField({ name: 'title', title: 'Heading', type: 'string' }), richTextField('body', 'Body'), defineField({ name: 'cta', title: 'Button', type: 'object', fields: ctaFields })] }),
  ],
});
