import { defineField, defineType } from 'sanity';
import { richTextField } from './pageBuilderFields';

export default defineType({
  name: 'formLandingBlock',
  title: 'Form Landing',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'lead', title: 'Lead', type: 'string' }),
    richTextField('intro', 'Intro'),
    defineField({ name: 'hubspotFormId', title: 'HubSpot Form ID', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'portalId', title: 'HubSpot Portal ID', type: 'string', initialValue: '5045186' }),
    richTextField('summary', 'Summary'),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Contact', value: 'contact' },
          { title: 'Newsletter', value: 'newsletter' },
          { title: 'Resource', value: 'resource' },
          { title: 'Event', value: 'event' },
        ],
      },
      initialValue: 'contact',
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Muted', value: 'muted' },
        ],
      },
      initialValue: 'dark',
    }),
    defineField({ name: 'showFormCard', title: 'Show Form Card', type: 'boolean', initialValue: true }),
    defineField({
      name: 'hideCopy',
      title: 'Hide Copy',
      type: 'boolean',
      description: 'Visually hide the eyebrow/lead/intro copy so only the form shows. The title is kept for accessibility and anchor links but is visually hidden too.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'variant' },
    prepare({ title, subtitle }) {
      return { title: title || 'Form Landing', subtitle: subtitle || 'Form Landing' };
    },
  },
});
