import { defineArrayMember, defineField, defineType } from 'sanity';
import { ctaField, mediaFields, richTextField, themeField } from './pageBuilderFields';

export default defineType({
  name: 'cardGridBlock',
  title: 'Card Grid',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'number', title: 'Number', type: 'string' }),
            defineField({ name: 'lead', title: 'Lead', type: 'string' }),
            defineField({ name: 'meta', title: 'Meta', type: 'string' }),
            richTextField(),
            ctaField(),
            defineField({ name: 'icon', title: 'Icon', type: 'image' }),
            ...mediaFields,
          ],
          preview: { select: { title: 'title', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          { title: '2 Columns', value: 2 },
          { title: '3 Columns', value: 3 },
          { title: '4 Columns', value: 4 },
        ],
      },
      initialValue: 3,
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Standard', value: 'standard' },
          { title: 'Icon', value: 'icon' },
          { title: 'Numbered', value: 'numbered' },
          { title: 'Credential', value: 'credential' },
          { title: 'Topic', value: 'topic' },
          { title: 'Benefit', value: 'benefit' },
        ],
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'density',
      title: 'Density',
      type: 'string',
      options: {
        list: [
          { title: 'Compact', value: 'compact' },
          { title: 'Standard', value: 'standard' },
        ],
      },
      initialValue: 'standard',
    }),
    themeField('theme', 'Theme', 'light'),
  ],
  preview: {
    select: { title: 'title', cards: 'cards' },
    prepare({ title, cards }) {
      return { title: title || 'Card Grid', subtitle: `${cards?.length || 0} cards` };
    },
  },
});
