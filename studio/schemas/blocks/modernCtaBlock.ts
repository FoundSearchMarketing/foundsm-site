import { defineField, defineType } from 'sanity';
import { ctaField, richTextField } from './pageBuilderFields';

export default defineType({
  name: 'modernCtaBlock',
  title: 'Modern CTA',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    richTextField(),
    ctaField(),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Dark', value: 'dark' },
          { title: 'Green', value: 'green' },
          { title: 'Light', value: 'light' },
          { title: 'White', value: 'white' },
        ],
      },
      initialValue: 'dark',
    }),
    defineField({
      name: 'align',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Split', value: 'split' },
          { title: 'Centered', value: 'centered' },
        ],
      },
      initialValue: 'split',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Modern CTA', subtitle: 'Modern CTA' };
    },
  },
});
