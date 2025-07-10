// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  site: 'https://g-3.vn',
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
  output: 'static',
  build: {
    assets: 'assets'
  },
  vite: {
    optimizeDeps: {
      include: ['@supabase/supabase-js']
    },
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  }
});
