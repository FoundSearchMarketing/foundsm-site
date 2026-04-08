import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'formBlock',
  title: 'Form',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'hubspotFormId',
      title: 'HubSpot Form ID',
      type: 'string',
      description: 'The HubSpot form ID to embed',
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
      initialValue: 'light',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Form Block', subtitle: 'Form' };
    },
  },
});
