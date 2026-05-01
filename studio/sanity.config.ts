import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { defaultCapabilityDetailPages } from '../src/lib/fixedPageData';

const projectId = 'vzneqxsx';
const singletonTypes = new Set(['homePage', 'aboutPage', 'capabilitiesPage', 'capabilityDetailPage']);
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
const schema = {
  types: schemaTypes,
  templates: (previousTemplates: any[]) => [
    ...previousTemplates.filter((template) => !capabilityDetailTemplates.some((detailTemplate) => detailTemplate.id === template.id)),
    ...capabilityDetailTemplates,
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
        .title('About Page')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('About Page')),
      S.listItem()
        .title('Capabilities Page')
        .id('capabilitiesPage')
        .child(S.document().schemaType('capabilitiesPage').documentId('capabilitiesPage').title('Capabilities Page')),
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
