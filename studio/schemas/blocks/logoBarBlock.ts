import { defineArrayMember, defineType, defineField } from 'sanity';

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
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
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
        }),
        defineArrayMember({
          type: 'object',
          name: 'logoItem',
          title: 'Logo Item',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Logo Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'imageAlt',
              title: 'Image Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'videoFile',
              title: 'Logo File',
              type: 'file',
              options: { accept: 'image/svg+xml,image/png,image/jpeg,image/webp' },
            }),
            defineField({
              name: 'videoUrl',
              title: 'Temporary Logo URL',
              type: 'url',
              description: 'Use only for staging placeholders until a real logo asset is uploaded.',
            }),
          ],
          preview: {
            select: { title: 'name', media: 'image' },
            prepare({ title, media }) {
              return { title: title || 'Logo Item', subtitle: 'Logo', media };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'displayMode',
      title: 'Display Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Static', value: 'static' },
          { title: 'Marquee', value: 'marquee' },
        ],
      },
      initialValue: 'static',
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Muted', value: 'muted' },
        ],
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'density',
      title: 'Density',
      type: 'string',
      options: {
        list: [
          { title: 'Compact', value: 'compact' },
          { title: 'Standard', value: 'standard' },
        ],
      },
      initialValue: 'standard',
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
