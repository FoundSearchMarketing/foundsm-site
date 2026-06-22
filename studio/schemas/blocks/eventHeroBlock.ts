import { defineArrayMember, defineField, defineType } from 'sanity';
import { ctaField } from './pageBuilderFields';

export default defineType({
  name: 'eventHeroBlock',
  title: 'Event Hero',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'titleLines',
      title: 'Title Lines',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: 'accentLine', title: 'Accent Line', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'meta',
      title: 'Metadata',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Icon Label', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
    }),
    ctaField('primaryCta', 'Primary CTA'),
    ctaField('secondaryCta', 'Secondary CTA'),
    defineField({ name: 'cardTitle', title: 'Card Title', type: 'string' }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
    defineField({ name: 'chips', title: 'Chips', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Dark', value: 'dark' },
          { title: 'Green', value: 'green' },
          { title: 'Light', value: 'light' },
        ],
      },
      initialValue: 'dark',
    }),
  ],
  preview: {
    select: { titleLines: 'titleLines', subtitle: 'eyebrow' },
    prepare({ titleLines, subtitle }) {
      return { title: titleLines?.join(' ') || 'Event Hero', subtitle: subtitle || 'Event Hero' };
    },
  },
});
