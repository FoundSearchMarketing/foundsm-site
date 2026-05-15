import { defineArrayMember, defineField, defineType } from 'sanity';
import { defaultHomePageData } from '../../src/lib/homePageData';
import { createSeoFields } from './seoFields';

const linkAnnotation = defineArrayMember({
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

const richTextField = (name: string, title: string) =>
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

const ctaFields = [
  defineField({ name: 'ctaText', title: 'CTA Text', type: 'string' }),
  defineField({
    name: 'ctaUrl',
    title: 'CTA URL',
    type: 'string',
    validation: (Rule) =>
      Rule.custom((value, context) => {
        const parent = context.parent as { ctaText?: string } | undefined;
        if (parent?.ctaText && !value) return 'CTA URL is required when CTA text is set.';
        return true;
      }),
  }),
];

const metricFields = [
  defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
  defineField({ name: 'prefix', title: 'Prefix', type: 'string' }),
  defineField({ name: 'value', title: 'Value', type: 'number', validation: (Rule) => Rule.required() }),
  defineField({ name: 'suffix', title: 'Suffix', type: 'string' }),
  defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
];

const metricObject = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: metricFields,
  });

const logoArrayField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        fields: [
          defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: false },
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'alt',
            title: 'Alt Text',
            type: 'string',
            validation: (Rule) => Rule.required(),
          }),
        ],
        preview: {
          select: { title: 'alt', media: 'image' },
          prepare({ title, media }) {
            return { title: title || 'Logo', media };
          },
        },
      }),
    ],
  });

const imageWithAltFields = [
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
    validation: (Rule) => Rule.required(),
  }),
];

const withoutImageValues = {
  ...defaultHomePageData,
  ogImage: undefined,
  intro: {
    heading: defaultHomePageData.intro.heading,
    body: defaultHomePageData.intro.body,
    imageAlt: defaultHomePageData.intro.imageAlt,
  },
  clientLogos: {
    heading: defaultHomePageData.clientLogos.heading,
    logos: defaultHomePageData.clientLogos.logos.map(({ alt }) => ({ alt })),
  },
  outcomes: {
    heading: defaultHomePageData.outcomes.heading,
    body: defaultHomePageData.outcomes.body,
    imageAlt: defaultHomePageData.outcomes.imageAlt,
    ctaText: defaultHomePageData.outcomes.ctaText,
    ctaUrl: defaultHomePageData.outcomes.ctaUrl,
  },
  metrics: {
    spend: defaultHomePageData.metrics.spend,
    leads: defaultHomePageData.metrics.leads,
    experience: defaultHomePageData.metrics.experience,
    employees: defaultHomePageData.metrics.employees,
    testimonial: {
      quote: defaultHomePageData.metrics.testimonial.quote,
      authorName: defaultHomePageData.metrics.testimonial.authorName,
      authorTitle: defaultHomePageData.metrics.testimonial.authorTitle,
      authorCompany: defaultHomePageData.metrics.testimonial.authorCompany,
      authorImageAlt: defaultHomePageData.metrics.testimonial.authorImageAlt,
    },
    ownershipCard: defaultHomePageData.metrics.ownershipCard,
    imageAlt: defaultHomePageData.metrics.imageAlt,
  },
  partners: {
    heading: defaultHomePageData.partners.heading,
    body: defaultHomePageData.partners.body,
    logos: defaultHomePageData.partners.logos.map(({ alt }) => ({ alt })),
    ctaText: defaultHomePageData.partners.ctaText,
    ctaUrl: defaultHomePageData.partners.ctaUrl,
  },
  ecosystem: {
    headingLines: defaultHomePageData.ecosystem.headingLines,
    introBody: defaultHomePageData.ecosystem.introBody,
    tabListHeading: defaultHomePageData.ecosystem.tabListHeading,
    tabs: defaultHomePageData.ecosystem.tabs.map(({ id, title, body, ctaText, ctaUrl, imageAlt }) => ({
      id,
      title,
      body,
      ctaText,
      ctaUrl,
      imageAlt,
    })),
  },
};

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'seo', title: 'SEO' },
    { name: 'content', title: 'Content', default: true },
  ],
  fields: [
    ...createSeoFields({ descriptionMax: 180 }),
    defineField({
      name: 'hero',
      title: 'Hero/Search',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'headlineLines',
          title: 'Headline Lines',
          type: 'array',
          of: [defineArrayMember({ type: 'string', validation: (Rule) => Rule.required() })],
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({ name: 'subheadline', title: 'Subheadline', type: 'text', rows: 2 }),
        defineField({
          name: 'searchPrompts',
          title: 'Search Prompts',
          type: 'array',
          of: [defineArrayMember({ type: 'string', validation: (Rule) => Rule.required() })],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
        richTextField('body', 'Body'),
        ...imageWithAltFields,
      ],
    }),
    defineField({
      name: 'ctaStrip',
      title: 'CTA Strip',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string', validation: (Rule) => Rule.required() }),
        ...ctaFields,
      ],
    }),
    defineField({
      name: 'clientLogos',
      title: 'Client Logo Marquee',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
        logoArrayField('logos', 'Logos'),
      ],
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      type: 'object',
      group: 'content',
      fields: [
        ...imageWithAltFields,
        defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
        richTextField('body', 'Body'),
        ...ctaFields,
      ],
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics/Testimonial',
      type: 'object',
      group: 'content',
      fields: [
        metricObject('spend', 'Paid Media Spend'),
        metricObject('leads', 'Leads Generated'),
        metricObject('experience', 'Experience'),
        metricObject('employees', 'Employees'),
        defineField({
          name: 'testimonial',
          title: 'Testimonial',
          type: 'object',
          fields: [
            defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
            defineField({ name: 'authorName', title: 'Author Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'authorTitle', title: 'Author Title', type: 'string' }),
            defineField({ name: 'authorCompany', title: 'Author Company', type: 'string' }),
            defineField({ name: 'authorImage', title: 'Author Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'authorImageAlt', title: 'Author Image Alt Text', type: 'string' }),
          ],
        }),
        defineField({
          name: 'ownershipCard',
          title: 'Ownership Card',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
            ...ctaFields,
          ],
        }),
        ...imageWithAltFields,
      ],
    }),
    defineField({
      name: 'partners',
      title: 'Partner Section',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
        richTextField('body', 'Body'),
        logoArrayField('logos', 'Logos'),
        ...ctaFields,
      ],
    }),
    defineField({
      name: 'ecosystem',
      title: 'Ecosystem Tabs',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'headingLines',
          title: 'Heading Lines',
          type: 'array',
          of: [defineArrayMember({ type: 'string', validation: (Rule) => Rule.required() })],
          validation: (Rule) => Rule.required().min(1),
        }),
        richTextField('introBody', 'Intro Body'),
        defineField({ name: 'tabListHeading', title: 'Tab List Heading', type: 'string' }),
        defineField({
          name: 'tabs',
          title: 'Tabs',
          type: 'array',
          validation: (Rule) => Rule.required().min(1),
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'id',
                  title: 'Stable ID',
                  type: 'string',
                  description: 'Lowercase identifier used for tab behavior, for example "data" or "media".',
                  validation: (Rule) => Rule.required().regex(/^[a-z0-9-]+$/, { name: 'slug-like ID' }),
                }),
                defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
                defineField({ name: 'icon', title: 'Icon', type: 'image' }),
                richTextField('body', 'Body'),
                ...ctaFields,
                ...imageWithAltFields,
              ],
              preview: {
                select: { title: 'title', media: 'image' },
                prepare({ title, media }) {
                  return { title: title || 'Tab', subtitle: 'Ecosystem tab', media };
                },
              },
            }),
          ],
        }),
      ],
    }),
  ],
  initialValue: withoutImageValues,
  preview: {
    prepare() {
      return {
        title: 'Home Page',
        subtitle: 'Homepage singleton',
      };
    },
  },
});
