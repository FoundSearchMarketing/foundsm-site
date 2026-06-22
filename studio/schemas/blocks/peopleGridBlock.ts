import { defineArrayMember, defineField, defineType } from 'sanity';
import { richTextField } from './pageBuilderFields';

export default defineType({
  name: 'peopleGridBlock',
  title: 'People Grid',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    richTextField('intro', 'Intro'),
    defineField({
      name: 'people',
      title: 'People',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'role', title: 'Role', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
            defineField({ name: 'videoFile', title: 'Video File', type: 'file', options: { accept: 'video/mp4,video/webm,video/quicktime' } }),
            defineField({ name: 'videoUrl', title: 'Video URL', type: 'url' }),
          ],
          preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: [{ title: 'Centered', value: 'centered' }, { title: 'Split', value: 'split' }] },
      initialValue: 'centered',
    }),
    defineField({ name: 'showImages', title: 'Show Images', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title', people: 'people' },
    prepare({ title, people }) {
      return { title: title || 'People Grid', subtitle: `${people?.length || 0} people` };
    },
  },
});
