import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'vzneqxsx';
const SANITY_DATASET = process.env.SANITY_DATASET || 'staging';

export default defineConfig({
  site: 'https://foundsm.com',
  output: 'static',
  trailingSlash: 'always',
  adapter: vercel(),
  integrations: [
    sanity({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      useCdn: true,
      apiVersion: '2024-01-01',
    }),
  ],
});
