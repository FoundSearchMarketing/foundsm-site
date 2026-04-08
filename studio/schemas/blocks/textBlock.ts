import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'textBlock',
  title: 'Text',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max Width',
      type: 'string',
      options: {
        list: [
          { title: 'Narrow', value: 'narrow' },
          { title: 'Medium', value: 'medium' },
          { title: 'Full', value: 'full' },
        ],
      },
      initialValue: 'medium',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Text Block', subtitle: 'Rich Text' };
    },
  },
});
