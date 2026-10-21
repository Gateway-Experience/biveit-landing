import path from 'node:path'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '')

// The languages the page is published in: English at `/`, the others at `/<code>/`. Keep in step with
// LANGUAGES in src/utils/constants.ts.
const LOCALES = { en: 'en', vi: 'vi', ko: 'ko', zh: 'zh-Hans', ja: 'ja', ru: 'ru' }

export default defineConfig({
  // The public address: canonical links, hreflang, the sitemap and preview images are built from it.
  site: PUBLIC_SITE_URL || 'https://biveit.com',
  // `/vi/` rather than `/vi`, matching the folders the build writes, so every page has one address.
  trailingSlash: 'ignore',
  // The stylesheet goes inside each page instead of a separate file the browser must fetch before it can
  // paint anything (it's small, ~10 KB).
  build: { inlineStylesheets: 'always' },
  i18n: {
    locales: Object.keys(LOCALES),
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    // Lists every language version, each pointing at the others (hreflang), for search engines.
    sitemap({ i18n: { defaultLocale: 'en', locales: LOCALES } }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Same `src/...` imports as the app, so components copy over unchanged.
      alias: { src: path.resolve(import.meta.dirname, './src') },
    },
  },
})
