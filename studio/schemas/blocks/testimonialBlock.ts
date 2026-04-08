import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonialBlock',
  title: 'Testimonial',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role',
      type: 'string',
    }),
    defineField({
      name: 'authorCompany',
      title: 'Author Company',
      type: 'string',
    }),
    defineField({
      name: 'authorImage',
      title: 'Author Photo',
      type: 'image',
      options: { hotspot: true },
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
    select: { title: 'authorName', subtitle: 'authorCompany' },
    prepare({ title, subtitle }) {
      return { title: title || 'Testimonial', subtitle: subtitle ? `${subtitle} — Testimonial` : 'Testimonial' };
    },
  },
});
