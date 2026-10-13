import { defineArrayMember, defineField, defineType } from 'sanity';
import { defaultAiPageData } from '../../src/lib/aiPageData';
import { createSeoFields } from './seoFields';

/* The AI hub (/ai/). Each section is a collapsible object; a blank field
   falls back to the code default in src/lib/aiPageData.ts. */

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

const linkField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({ name: 'label', title: 'Label', type: 'string' }),
      defineField({ name: 'href', title: 'URL', type: 'string' }),
    ],
  });

const itemMember = (subtitle: string, withLink = false) =>
  defineArrayMember({
    type: 'object',
    fields: [
      defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
      defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
      ...(withLink ? [linkField('cta', 'Link')] : []),
    ],
    preview: {
      select: { title: 'title' },
      prepare({ title }) {
        return { title: title || 'Untitled', subtitle };
      },
    },
  });

const section = (name: string, title: string, fields: ReturnType<typeof defineField>[], description?: string) =>
  defineField({
    name,
    title,
    type: 'object',
    group: 'content',
    options: { collapsible: true, collapsed: name !== 'hero' },
    description,
    fields,
  });

// Initial value without image strings: the code defaults use local paths, which an image field can't hold.
const { hero, paidMedia, ...restDefaults } = defaultAiPageData;
const initialValue = {
  ...restDefaults,
  hero: { ...hero, image: undefined },
  paidMedia: { ...paidMedia, image: undefined },
};

export default defineType({
  name: 'aiPage',
  title: 'AI Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    ...createSeoFields({ descriptionMax: 170 }),
    section('hero', 'Hero', [
      defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
      defineField({ name: 'heading', title: 'Heading', type: 'string' }),
      richTextField('body', 'Paragraph'),
      linkField('cta', 'Button'),
      defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
      defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
    ]),
    section(
      'callout',
      'Callout band (under the hero)',
      [
        defineField({ name: 'lead', title: 'Statement', type: 'string' }),
        richTextField('body', 'Supporting text'),
        linkField('cta', 'Link'),
      ],
      'The dark statement band under the hero, same as the capability sub pages.',
    ),
    section(
      'systems',
      'Where we build',
      [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
        defineField({ name: 'items', title: 'Areas', type: 'array', of: [itemMember('Area', true)] }),
      ],
      'The nav links here as /ai/#systems.',
    ),
    section('process', 'How a build works', [
      defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
      defineField({ name: 'heading', title: 'Heading', type: 'string' }),
      defineField({ name: 'steps', title: 'Steps (numbered in order)', type: 'array', of: [itemMember('Step')] }),
    ]),
    section('paidMedia', 'AI in paid media', [
      defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
      defineField({ name: 'heading', title: 'Heading', type: 'string' }),
      richTextField('body', 'Body'),
      linkField('cta', 'Button'),
      linkField('secondaryCta', 'Text link'),
      defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
      defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
    ]),
    section('closing', 'Closing band', [
      defineField({ name: 'heading', title: 'Heading', type: 'string' }),
      defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
      linkField('cta', 'Button'),
      linkField('secondaryCta', 'Text link'),
    ]),
  ],
  initialValue,
  preview: {
    prepare() {
      return { title: 'AI Page', subtitle: '/ai/' };
    },
  },
});
