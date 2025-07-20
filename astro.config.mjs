// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import path from 'path';


// https://astro.build/config
export default defineConfig({
  site: 'https://g-3.vn',

  integrations: [
    react(),
    tailwind(),
    sitemap(),
    partytown({
      // Configure Partytown
      config: {
        forward: ['dataLayer.push', 'gtag'],
        debug: false, // Set to true for debugging in development
      },
    }),
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
  },

});