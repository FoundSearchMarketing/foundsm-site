import { defineArrayMember, defineField } from 'sanity';

export const toneOptions = [
  { title: 'Light', value: 'light' },
  { title: 'Muted', value: 'muted' },
  { title: 'Dark', value: 'dark' },
];

export const linkAnnotation = defineArrayMember({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const richTextField = (name = 'body', title = 'Body') =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [{ title: 'Normal', value: 'normal' }],
        lists: [],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' },
          ],
          annotations: [linkAnnotation],
        },
      }),
    ],
  });

export const ctaField = (name = 'cta', title = 'CTA') =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({ name: 'label', title: 'Label', type: 'string' }),
      defineField({
        name: 'href',
        title: 'URL',
        type: 'string',
        validation: (Rule) =>
          Rule.custom((value, context) => {
            const parent = context.parent as { label?: string } | undefined;
            if (parent?.label && !value) return 'URL is required when label is set.';
            return true;
          }),
      }),
    ],
  });

export const mediaFields = [
  defineField({
    name: 'image',
    title: 'Image',
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
    title: 'Video File',
    type: 'file',
    options: { accept: 'video/mp4,video/webm,video/quicktime' },
    description: 'Optional uploaded video asset. Takes precedence over Image and Video URL.',
  }),
  defineField({
    name: 'videoUrl',
    title: 'Video URL',
    type: 'url',
    description: 'Optional MP4/WebM URL to render instead of the image.',
  }),
];

export const themeField = (
  name = 'theme',
  title = 'Theme',
  initialValue: 'light' | 'muted' | 'dark' = 'light',
) =>
  defineField({
    name,
    title,
    type: 'string',
    options: { list: toneOptions },
    initialValue,
  });
