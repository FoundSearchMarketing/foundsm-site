import { defineField, defineType } from 'sanity';
import { defaultInsightsPageData } from '../../src/lib/insightsPageData';
import { createSeoFields } from './seoFields';

const groups = [
  { name: 'seo', title: 'SEO' },
  { name: 'content', title: 'Content', default: true },
];

const seoFields = createSeoFields();

export default defineType({
  name: 'insightsPage',
  title: 'Insights Page',
  type: 'document',
  groups,
  fields: [
    ...seoFields,
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
        defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
        defineField({ name: 'imageAlt', title: 'Image Alt Text', type: 'string' }),
        defineField({ name: 'videoFile', title: 'Video File', type: 'file', options: { accept: 'video/mp4,video/webm,video/quicktime' }, description: 'Optional uploaded video asset. Takes precedence over Video URL.' }),
        defineField({ name: 'videoUrl', title: 'Video URL', type: 'url', description: 'Optional MP4/WebM URL to render instead of the image.' }),
      ],
    }),
  ],
  initialValue: defaultInsightsPageData,
});
