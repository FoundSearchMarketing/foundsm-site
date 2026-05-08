import { defineArrayMember, defineField, defineType } from 'sanity';
import {
  defaultApproachPageData,
  defaultEventLandingPageData,
  defaultNotFoundPageData,
  defaultPrivacyPolicyPageData,
  defaultTeamPageData,
} from '../../src/lib/morePageData';

const { leaders: _leaders, ...teamPageInitialValue } = defaultTeamPageData;

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

const requiredImageFields = [
  defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
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
    richTextField('body', 'Body'),
    defineField({ name: 'icon', title: 'Icon', type: 'image' }),
    defineField({ name: 'image', title: 'Image', type: 'image' }),
    defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
  ],
  preview: { select: { title: 'title', media: 'image' } },
});

const groups = [
  { name: 'seo', title: 'SEO' },
  { name: 'content', title: 'Content', default: true },
];

export const formPage = defineType({
  name: 'formPage',
  title: 'Form Page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      group: 'content',
      readOnly: true,
      options: { list: [{ title: 'Contact', value: 'contact' }, { title: 'Newsletter', value: 'newsletter' }] },
    }),
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', group: 'content' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', group: 'content' }),
    richTextField('intro', 'Intro'),
    defineField({ name: 'formId', title: 'HubSpot Form ID', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    defineField({ name: 'portalId', title: 'HubSpot Portal ID', type: 'string', group: 'content' }),
    richTextField('summary', 'Summary'),
  ],
});

export const teamPage = defineType({
  name: 'teamPage',
  title: 'Team Page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({ name: 'hero', title: 'Hero', type: 'object', group: 'content', fields: [...richSectionFields, ...imageFields, defineField({ name: 'cta', title: 'CTA', type: 'object', fields: ctaFields })] }),
    defineField({ name: 'statement', title: 'Statement', type: 'object', group: 'content', fields: [defineField({ name: 'lead', title: 'Lead', type: 'string' }), richTextField('body', 'Body')] }),
    defineField({ name: 'leadership', title: 'Leadership Intro', type: 'object', group: 'content', fields: [defineField({ name: 'heading', title: 'Heading', type: 'string' }), richTextField('body', 'Body')] }),
    defineField({ name: 'cta', title: 'CTA Panel', type: 'object', group: 'content', fields: [defineField({ name: 'heading', title: 'Heading', type: 'string' }), richTextField('body', 'Body'), defineField({ name: 'cta', title: 'Button', type: 'object', fields: ctaFields })] }),
  ],
  initialValue: teamPageInitialValue,
});

export const notFoundPage = defineType({
  name: 'notFoundPage',
  title: '404 Page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({ name: 'code', title: 'Error Code', type: 'string', group: 'content' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', group: 'content' }),
    richTextField('body', 'Body'),
    defineField({ name: 'primaryCta', title: 'Primary CTA', type: 'object', group: 'content', fields: ctaFields }),
    defineField({ name: 'secondaryCta', title: 'Secondary CTA', type: 'object', group: 'content', fields: ctaFields }),
  ],
  initialValue: defaultNotFoundPageData,
});

export const approachPage = defineType({
  name: 'approachPage',
  title: 'Our Approach Page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({ name: 'hero', title: 'Hero', type: 'object', group: 'content', fields: [...richSectionFields, ...requiredImageFields] }),
    defineField({ name: 'intro', title: 'Intro', type: 'object', group: 'content', fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), ...richSectionFields, ...requiredImageFields] }),
    defineField({ name: 'callout', title: 'CTA Strip', type: 'object', group: 'content', fields: [defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 3 }), defineField({ name: 'cta', title: 'CTA', type: 'object', fields: ctaFields })] }),
    defineField({
      name: 'advantages',
      title: 'Advantages',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        richTextField('body', 'Body'),
        defineField({ name: 'items', title: 'Items', type: 'array', of: [cardMember] }),
      ],
    }),
    defineField({
      name: 'partnerships',
      title: 'Partnerships',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'headingLines', title: 'Heading Lines', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
        richTextField('body', 'Body'),
        defineField({ name: 'tabs', title: 'Tabs', type: 'array', of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'label', title: 'Tab Label', type: 'string' }), ...richSectionFields, ...requiredImageFields], preview: { select: { title: 'label', media: 'image' } } })] }),
        defineField({ name: 'ctaHeadingLines', title: 'CTA Heading Lines', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
        defineField({ name: 'cta', title: 'CTA', type: 'object', fields: ctaFields }),
      ],
    }),
  ],
  initialValue: defaultApproachPageData,
});

export const privacyPolicyPage = defineType({
  name: 'privacyPolicyPage',
  title: 'Privacy Policy Page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({ name: 'heading', title: 'Heading', type: 'string', group: 'content' }),
    defineField({ name: 'lastUpdated', title: 'Last Updated', type: 'string', group: 'content' }),
    richTextField('intro', 'Intro'),
    defineField({
      name: 'sections',
      title: 'Policy Sections',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            richTextField('body', 'Body'),
            defineField({ name: 'items', title: 'List Items', type: 'array', of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'title', title: 'Bold Label', type: 'string' }), defineField({ name: 'body', title: 'Text', type: 'text', rows: 3 })] })] }),
            defineField({ name: 'contact', title: 'Contact Block', type: 'object', fields: [defineField({ name: 'organization', title: 'Organization', type: 'string' }), defineField({ name: 'lines', title: 'Address Lines', type: 'array', of: [defineArrayMember({ type: 'string' })] }), defineField({ name: 'email', title: 'Email', type: 'string' }), defineField({ name: 'phone', title: 'Phone', type: 'string' })] }),
          ],
          preview: { select: { title: 'heading' } },
        }),
      ],
    }),
  ],
  initialValue: defaultPrivacyPolicyPageData,
});

export const eventLandingPage = defineType({
  name: 'eventLandingPage',
  title: 'Event Landing Page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({ name: 'ogImage', title: 'Open Graph Image URL', type: 'url', group: 'seo' }),
    defineField({ name: 'event', title: 'Event Schema', type: 'object', group: 'content', fields: [defineField({ name: 'name', title: 'Name', type: 'string' }), defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }), defineField({ name: 'startDate', title: 'Start Date ISO', type: 'string' }), defineField({ name: 'endDate', title: 'End Date ISO', type: 'string' }), defineField({ name: 'locationLabel', title: 'Location Label', type: 'string' }), defineField({ name: 'locationUrl', title: 'Location URL', type: 'url' })] }),
    defineField({ name: 'nav', title: 'Navigation Labels', type: 'object', group: 'content', fields: [defineField({ name: 'topicsLabel', title: 'Topics Label', type: 'string' }), defineField({ name: 'benefitsLabel', title: 'Benefits Label', type: 'string' }), defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' })] }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'titleLines', title: 'Title Lines', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
        defineField({ name: 'accentLine', title: 'Accent Line', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
        defineField({ name: 'meta', title: 'Meta Items', type: 'array', of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'icon', title: 'Icon Label', type: 'string' }), defineField({ name: 'label', title: 'Label', type: 'string' }), defineField({ name: 'value', title: 'Value', type: 'string' })] })] }),
        defineField({ name: 'primaryCta', title: 'Primary CTA', type: 'object', fields: ctaFields }),
        defineField({ name: 'secondaryCta', title: 'Secondary CTA', type: 'object', fields: ctaFields }),
        defineField({ name: 'cardTitle', title: 'Card Title', type: 'string' }),
        defineField({ name: 'stats', title: 'Stats', type: 'array', of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'value', title: 'Value', type: 'string' }), defineField({ name: 'label', title: 'Label', type: 'string' })] })] }),
        defineField({ name: 'chips', title: 'Topic Chips', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
      ],
    }),
    defineField({ name: 'topics', title: 'Topics', type: 'object', group: 'content', fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'heading', title: 'Heading', type: 'string' }), defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }), defineField({ name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'icon', title: 'Icon Label', type: 'string' }), defineField({ name: 'title', title: 'Title', type: 'string' }), defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }), defineField({ name: 'time', title: 'Time', type: 'string' })] })] })] }),
    defineField({ name: 'benefits', title: 'Benefits', type: 'object', group: 'content', fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'heading', title: 'Heading', type: 'string' }), defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }), defineField({ name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'number', title: 'Number', type: 'string' }), defineField({ name: 'title', title: 'Title', type: 'string' }), defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 })] })] })] }),
    defineField({ name: 'registration', title: 'Registration', type: 'object', group: 'content', fields: [defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }), defineField({ name: 'headingLines', title: 'Heading Lines', type: 'array', of: [defineArrayMember({ type: 'string' })] }), defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }), defineField({ name: 'perks', title: 'Perks', type: 'array', of: [defineArrayMember({ type: 'string' })] }), defineField({ name: 'buttonLabel', title: 'Button Label', type: 'string' }), defineField({ name: 'fields', title: 'Form Fields', type: 'array', of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'label', title: 'Label', type: 'string' }), defineField({ name: 'type', title: 'Type', type: 'string', options: { list: ['text', 'email', 'select'] } }), defineField({ name: 'placeholder', title: 'Placeholder', type: 'string' }), defineField({ name: 'options', title: 'Select Options', type: 'array', of: [defineArrayMember({ type: 'string' })] })] })] })] }),
    defineField({ name: 'footer', title: 'Footer', type: 'object', group: 'content', fields: [defineField({ name: 'copyright', title: 'Copyright', type: 'string' }), defineField({ name: 'links', title: 'Links', type: 'array', of: [defineArrayMember({ type: 'object', fields: ctaFields })] })] }),
  ],
  initialValue: defaultEventLandingPageData,
});
