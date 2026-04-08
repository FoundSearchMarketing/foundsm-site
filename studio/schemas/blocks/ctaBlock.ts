import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'ctaBlock',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'ctaText',
      title: 'Button Text',
      type: 'string',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Button URL',
      type: 'string',
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Green', value: 'green' },
        ],
      },
      initialValue: 'dark',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      return { title: title || 'CTA Block', subtitle: 'Call to Action' };
    },
  },
});
