import { defineType, defineField } from 'sanity';
import { createSeoFields } from './seoFields';

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Job Title',
      type: 'string',
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'string',
    }),
    defineField({
      name: 'foundStartDate',
      title: 'Found Start Date',
      type: 'string',
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    ...createSeoFields({ group: false, descriptionMax: 180 }),
    defineField({
      name: 'wpId',
      title: 'WordPress ID',
      type: 'number',
    }),
    defineField({
      name: 'profileHeading',
      title: 'Profile Heading',
      type: 'string',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image URL',
      type: 'url',
    }),
    defineField({
      name: 'profileImageAlt',
      title: 'Profile Image Alt Text',
      type: 'string',
    }),
    defineField({
      name: 'profileTeam',
      title: 'Profile Team',
      type: 'string',
    }),
    defineField({
      name: 'profileFoundStartDate',
      title: 'Profile Found Start Date',
      type: 'string',
    }),
    defineField({
      name: 'profileExpertise',
      title: 'Profile Expertise',
      type: 'string',
    }),
    defineField({
      name: 'profileBody',
      title: 'Profile Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'latestPosts',
      title: 'Latest Posts',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'href', title: 'URL', type: 'string' }),
            defineField({ name: 'imageSrc', title: 'Image URL', type: 'url' }),
            defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
            defineField({ name: 'imageWidth', title: 'Image Width', type: 'number' }),
            defineField({ name: 'imageHeight', title: 'Image Height', type: 'number' }),
            defineField({ name: 'date', title: 'Date Label', type: 'string' }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image',
    },
  },
});
