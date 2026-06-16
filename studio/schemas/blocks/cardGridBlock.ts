import { defineArrayMember, defineField, defineType } from 'sanity';
import { mediaFields, richTextField, themeField } from './pageBuilderFields';

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
            defineField({ name: 'lead', title: 'Lead', type: 'string' }),
            richTextField(),
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
    themeField('theme', 'Theme', 'light'),
  ],
  preview: {
    select: { title: 'title', cards: 'cards' },
    prepare({ title, cards }) {
      return { title: title || 'Card Grid', subtitle: `${cards?.length || 0} cards` };
    },
  },
});
