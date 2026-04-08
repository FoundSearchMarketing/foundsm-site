import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [
    sanity({
      projectId: 'vzneqxsx',
      dataset: 'production',
      useCdn: true,
      apiVersion: '2024-01-01',
    }),
  ],
});
