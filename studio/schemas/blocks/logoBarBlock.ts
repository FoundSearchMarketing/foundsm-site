import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'logoBarBlock',
  title: 'Logo Bar',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', logos: 'logos' },
    prepare({ title, logos }) {
      return {
        title: title || 'Logo Bar',
        subtitle: `${logos?.length || 0} logos — Logo Bar`,
      };
    },
  },
});
