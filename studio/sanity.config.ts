import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const projectId = 'vzneqxsx';

export default defineConfig([
  {
    name: 'production',
    title: 'Production',
    projectId,
    dataset: 'production',
    basePath: '/production',
    plugins: [structureTool(), visionTool()],
    schema: {
      types: schemaTypes,
    },
  },
  {
    name: 'staging',
    title: 'Staging',
    projectId,
    dataset: 'staging',
    basePath: '/staging',
    plugins: [structureTool(), visionTool()],
    schema: {
      types: schemaTypes,
    },
  },
]);
