import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'vzneqxsx';
const SANITY_DATASET = process.env.SANITY_DATASET || 'staging';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  devToolbar: {
    enabled: false,
  },
  integrations: [
    sanity({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      useCdn: true,
      apiVersion: '2024-01-01',
    }),
  ],
});
