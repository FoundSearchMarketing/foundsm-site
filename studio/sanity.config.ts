import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { defaultCapabilityDetailPages } from '../src/lib/fixedPageData';
import { defaultLegacyPageTemplates } from '../src/lib/legacyPageData';
import { defaultContactPageData, defaultNewsletterPageData } from '../src/lib/morePageData';

const projectId = 'vzneqxsx';
const singletonTypes = new Set([
  'homePage',
  'insightsPage',
  'aboutPage',
  'capabilitiesPage',
  'capabilityDetailPage',
  'formPage',
  'teamPage',
  'notFoundPage',
  'approachPage',
  'privacyPolicyPage',
  'eventLandingPage',
  'legacyPage',
]);
const capabilityDetailTemplates = [
  {
    id: 'capabilityDataActivationPage',
    title: 'Data Activation',
    schemaType: 'capabilityDetailPage',
    value: defaultCapabilityDetailPages.dataActivation,
  },
  {
    id: 'capabilityDataIntelligencePage',
    title: 'Data Intelligence',
    schemaType: 'capabilityDetailPage',
    value: defaultCapabilityDetailPages.dataIntelligence,
  },
  {
    id: 'capabilityPaidMediaPage',
    title: 'Paid Media',
    schemaType: 'capabilityDetailPage',
    value: defaultCapabilityDetailPages.paidMedia,
  },
  {
    id: 'capabilityPerformanceCreativePage',
    title: 'Performance Creative',
    schemaType: 'capabilityDetailPage',
    value: defaultCapabilityDetailPages.performanceCreative,
  },
];
const formPageTemplates = [
  {
    id: 'contactPage',
    title: 'Contact Page',
    schemaType: 'formPage',
    value: defaultContactPageData,
  },
  {
    id: 'newsletterPage',
    title: 'Newsletter Page',
    schemaType: 'formPage',
    value: defaultNewsletterPageData,
  },
];
const legacyPageTemplates = defaultLegacyPageTemplates.map((template) => ({
  id: template.id,
  title: template.title,
  schemaType: 'legacyPage',
  value: template.value,
}));
const singletonTemplates = [...capabilityDetailTemplates, ...formPageTemplates, ...legacyPageTemplates];
const schema = {
  types: schemaTypes,
  templates: (previousTemplates: any[]) => [
    ...previousTemplates.filter((template) => !singletonTemplates.some((singletonTemplate) => singletonTemplate.id === template.id)),
    ...singletonTemplates,
  ],
};

const structure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage').title('Home Page')),
      S.listItem()
        .title('Insights Page')
        .id('insightsPage')
        .child(S.document().schemaType('insightsPage').documentId('insightsPage').title('Insights Page')),
      S.listItem()
        .title('About Page')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('About Page')),
      S.listItem()
        .title('Capabilities Page')
        .id('capabilitiesPage')
        .child(S.document().schemaType('capabilitiesPage').documentId('capabilitiesPage').title('Capabilities Page')),
      S.listItem()
        .title('Contact Page')
        .id('contactPage')
        .child(S.document().schemaType('formPage').documentId('contactPage').initialValueTemplate('contactPage').title('Contact Page')),
      S.listItem()
        .title('Newsletter Page')
        .id('newsletterPage')
        .child(S.document().schemaType('formPage').documentId('newsletterPage').initialValueTemplate('newsletterPage').title('Newsletter Page')),
      S.listItem()
        .title('Our Approach Page')
        .id('approachPage')
        .child(S.document().schemaType('approachPage').documentId('approachPage').title('Our Approach Page')),
      S.listItem()
        .title('Team Page')
        .id('teamPage')
        .child(S.document().schemaType('teamPage').documentId('teamPage').title('Team Page')),
      S.listItem()
        .title('Privacy Policy Page')
        .id('privacyPolicyPage')
        .child(S.document().schemaType('privacyPolicyPage').documentId('privacyPolicyPage').title('Privacy Policy Page')),
      S.listItem()
        .title('404 Page')
        .id('notFoundPage')
        .child(S.document().schemaType('notFoundPage').documentId('notFoundPage').title('404 Page')),
      S.listItem()
        .title('Lunch & Learn Event Page')
        .id('eventLandingPage')
        .child(S.document().schemaType('eventLandingPage').documentId('eventLandingPage').title('Lunch & Learn Event Page')),
      S.listItem()
        .title('Capability Detail Pages')
        .id('capabilityDetailPages')
        .child(
          S.list()
            .title('Capability Detail Pages')
            .items([
              S.listItem()
                .title('Data Activation')
                .id('capabilityDataActivationPage')
                .child(S.document().schemaType('capabilityDetailPage').documentId('capabilityDataActivationPage').initialValueTemplate('capabilityDataActivationPage').title('Data Activation')),
              S.listItem()
                .title('Data Intelligence')
                .id('capabilityDataIntelligencePage')
                .child(S.document().schemaType('capabilityDetailPage').documentId('capabilityDataIntelligencePage').initialValueTemplate('capabilityDataIntelligencePage').title('Data Intelligence')),
              S.listItem()
                .title('Paid Media')
                .id('capabilityPaidMediaPage')
                .child(S.document().schemaType('capabilityDetailPage').documentId('capabilityPaidMediaPage').initialValueTemplate('capabilityPaidMediaPage').title('Paid Media')),
              S.listItem()
                .title('Performance Creative')
                .id('capabilityPerformanceCreativePage')
                .child(S.document().schemaType('capabilityDetailPage').documentId('capabilityPerformanceCreativePage').initialValueTemplate('capabilityPerformanceCreativePage').title('Performance Creative')),
            ]),
        ),
      S.listItem()
        .title('Legacy WordPress Pages')
        .id('legacyPages')
        .child(
          S.list()
            .title('Legacy WordPress Pages')
            .items(
              legacyPageTemplates.map((template) =>
                S.listItem()
                  .title(template.title)
                  .id(template.id)
                  .child(
                    S.document()
                      .schemaType('legacyPage')
                      .documentId(template.id)
                      .initialValueTemplate(template.id)
                      .title(template.title),
                  ),
              ),
            ),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem: any) => !singletonTypes.has(listItem.getId())),
    ]);

export default defineConfig([
  {
    name: 'production',
    title: 'Production',
    projectId,
    dataset: 'production',
    basePath: '/production',
    plugins: [structureTool({ structure }), visionTool()],
    schema,
  },
  {
    name: 'staging',
    title: 'Staging',
    projectId,
    dataset: 'staging',
    basePath: '/staging',
    plugins: [structureTool({ structure }), visionTool()],
    schema,
  },
]);
