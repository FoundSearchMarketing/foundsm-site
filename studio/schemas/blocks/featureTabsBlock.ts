import { defineArrayMember, defineField, defineType } from 'sanity';
import { mediaFields, richTextField } from './pageBuilderFields';

export default defineType({
  name: 'featureTabsBlock',
  title: 'Feature Tabs',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({
      name: 'idPrefix',
      title: 'Stable ID Prefix',
      type: 'string',
      description: 'Lowercase letters, numbers, and hyphens only. Used for accessible tab IDs.',
      validation: (Rule) => Rule.regex(/^[a-z0-9-]+$/),
    }),
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            richTextField(),
            defineField({ name: 'icon', title: 'Icon', type: 'image' }),
            ...mediaFields,
          ],
          preview: { select: { title: 'title', media: 'image' } },
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
        ],
      },
      initialValue: 'muted',
    }),
  ],
  preview: {
    select: { title: 'title', tabs: 'tabs' },
    prepare({ title, tabs }) {
      return { title: title || 'Feature Tabs', subtitle: `${tabs?.length || 0} tabs` };
    },
  },
});
