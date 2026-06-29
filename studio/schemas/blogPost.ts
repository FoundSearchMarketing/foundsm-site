import { defineType, defineField } from 'sanity';
import { createSeoFields } from './seoFields';

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'category',
      title: 'Legacy Category',
      type: 'reference',
      to: [{ type: 'blogCategory' }],
      hidden: true,
      readOnly: true,
      description: 'Deprecated single-category field retained for existing imported posts.',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blogCategory' }],
        },
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featuredVideo',
      title: 'Featured MP4 Video',
      type: 'file',
      description: 'Optional. When set, this MP4 is used for post thumbnails and the main post hero. The featured image remains the poster and social fallback.',
      options: { accept: 'video/mp4' },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
        {
          type: 'file',
          title: 'MP4 Video',
          options: { accept: 'video/mp4' },
          fields: [
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
        {
          name: 'videoEmbed',
          title: 'Video Embed',
          type: 'object',
          fields: [
            defineField({
              name: 'url',
              title: 'Video URL',
              type: 'url',
              validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url',
            },
            prepare(selection) {
              return {
                title: selection.title || 'Video embed',
                subtitle: selection.subtitle,
              };
            },
          },
        },
      ],
    }),
    ...createSeoFields({ group: false, descriptionMax: 180 }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'featuredImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
