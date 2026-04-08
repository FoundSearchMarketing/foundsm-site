import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'statsBlock',
  title: 'Stats',
  type: 'object',
  fields: [
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
      },
      initialValue: 'dark',
    }),
  ],
  preview: {
    select: { stats: 'stats' },
    prepare({ stats }) {
      return {
        title: `${stats?.length || 0} Statistics`,
        subtitle: 'Stats',
      };
    },
  },
});
