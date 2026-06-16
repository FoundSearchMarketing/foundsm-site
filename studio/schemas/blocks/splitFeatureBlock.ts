import { defineField, defineType } from 'sanity';
import { ctaField, mediaFields, richTextField, themeField } from './pageBuilderFields';

export default defineType({
  name: 'splitFeatureBlock',
  title: 'Split Feature',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    richTextField(),
    ctaField(),
    ...mediaFields,
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'left',
    }),
    themeField('theme', 'Theme', 'light'),
  ],
  preview: {
    select: { title: 'title', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Split Feature', subtitle: 'Split Feature', media };
    },
  },
});
