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
      description: 'Retired. The site no longer embeds HubSpot forms. The old contact form id still renders ActiveCampaign form 8.',
    }),
    defineField({
      name: 'acFormId',
      title: 'ActiveCampaign Form ID',
      type: 'string',
      description: 'ActiveCampaign form id to embed, for example 8 for the contact form or 4 for the newsletter. When set, this is the form the page renders.',
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
