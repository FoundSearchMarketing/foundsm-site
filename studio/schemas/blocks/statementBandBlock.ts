import { defineField, defineType } from 'sanity';
import { richTextField, themeField } from './pageBuilderFields';

export default defineType({
  name: 'statementBandBlock',
  title: 'Statement Band',
  type: 'object',
  fields: [
    defineField({
      name: 'lead',
      title: 'Lead',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    richTextField(),
    themeField('theme', 'Theme', 'dark'),
    defineField({
      name: 'pattern',
      title: 'Use Pattern Background',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Narrow', value: 'narrow' },
        ],
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: { title: 'lead' },
    prepare({ title }) {
      return { title: title || 'Statement Band', subtitle: 'Statement Band' };
    },
  },
});
