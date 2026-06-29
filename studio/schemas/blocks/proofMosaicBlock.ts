import { defineArrayMember, defineField, defineType } from 'sanity';
import { ctaField, mediaFields, richTextField } from './pageBuilderFields';

export default defineType({
  name: 'proofMosaicBlock',
  title: 'Proof Mosaic',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
            defineField({ name: 'prefix', title: 'Prefix', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'suffix', title: 'Suffix', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'object',
      fields: [
        defineField({ name: 'text', title: 'Quote Text', type: 'text', rows: 3 }),
        defineField({ name: 'authorName', title: 'Author Name', type: 'string' }),
        defineField({ name: 'authorTitle', title: 'Author Title', type: 'string' }),
        defineField({ name: 'authorCompany', title: 'Author Company', type: 'string' }),
        defineField({ name: 'authorImage', title: 'Author Image', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'authorImageAlt', title: 'Author Image Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'featureCard',
      title: 'Feature Card',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        richTextField(),
        ctaField(),
      ],
    }),
    ...mediaFields,
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: { list: [{ title: 'Light', value: 'light' }, { title: 'Dark', value: 'dark' }] },
      initialValue: 'light',
    }),
    defineField({
      name: 'layoutPreset',
      title: 'Layout Preset',
      type: 'string',
      options: { list: [{ title: 'Mosaic', value: 'mosaic' }, { title: 'Compact', value: 'compact' }] },
      initialValue: 'mosaic',
    }),
  ],
  preview: {
    select: { title: 'title', metrics: 'metrics' },
    prepare({ title, metrics }) {
      return { title: title || 'Proof Mosaic', subtitle: `${metrics?.length || 0} metrics` };
    },
  },
});
