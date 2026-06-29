import { defineArrayMember, defineField, defineType } from 'sanity';
import { richTextField } from './pageBuilderFields';

export default defineType({
  name: 'accordionBlock',
  title: 'Accordion',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    richTextField(),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            richTextField(),
            defineField({ name: 'icon', title: 'Icon', type: 'image' }),
          ],
          preview: { select: { title: 'title', media: 'icon' } },
        }),
      ],
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Muted', value: 'muted' },
          { title: 'Dark', value: 'dark' },
        ],
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'layoutPreset',
      title: 'Layout Preset',
      type: 'string',
      options: {
        list: [
          { title: 'Single Column', value: 'singleColumn' },
          { title: 'Two Column', value: 'twoColumn' },
        ],
      },
      initialValue: 'twoColumn',
    }),
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare({ title, items }) {
      return { title: title || 'Accordion', subtitle: `${items?.length || 0} items` };
    },
  },
});
