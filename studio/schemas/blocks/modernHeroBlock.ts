import { defineField, defineType } from 'sanity';
import { ctaField, mediaFields, richTextField } from './pageBuilderFields';

export default defineType({
  name: 'modernHeroBlock',
  title: 'Modern Hero',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    richTextField('intro', 'Intro'),
    ctaField(),
    ctaField('secondaryCta', 'Secondary CTA'),
    ...mediaFields,
    defineField({
      name: 'layoutPreset',
      title: 'Layout Preset',
      type: 'string',
      options: {
        list: [
          { title: 'Split', value: 'split' },
          { title: 'Text Only', value: 'textOnly' },
        ],
      },
      initialValue: 'split',
    }),
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Soft', value: 'soft' },
          { title: 'Dark', value: 'dark' },
        ],
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'titleScale',
      title: 'Title Scale',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Display', value: 'display' },
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'imageShape',
      title: 'Image Shape',
      type: 'string',
      options: {
        list: [
          { title: 'Rounded', value: 'rounded' },
          { title: 'Circle', value: 'circle' },
          { title: 'Plain', value: 'plain' },
        ],
      },
      initialValue: 'rounded',
    }),
    defineField({
      name: 'imageFit',
      title: 'Image Fit',
      type: 'string',
      options: {
        list: [
          { title: 'Cover', value: 'cover' },
          { title: 'Contain', value: 'contain' },
        ],
      },
      initialValue: 'cover',
    }),
    defineField({
      name: 'sizePreset',
      title: 'Size Preset',
      type: 'string',
      options: {
        list: [
          { title: 'Compact', value: 'compact' },
          { title: 'Standard', value: 'standard' },
          { title: 'Spacious', value: 'spacious' },
          { title: 'Framed (504x518)', value: 'framed' },
        ],
      },
      initialValue: 'standard',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Modern Hero', subtitle: 'Modern Hero', media };
    },
  },
});
