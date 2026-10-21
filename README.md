# biveit-landing

biveit's public landing page (biveit.com), built with Astro as a static site so search engines and link
previews get the full page as HTML. The web app (log in, projects, pricing, policies) is vib3-frontend.

## Run it

```sh
npm install
cp .env.example .env   # then point the URLs at your app and API
npm run dev            # http://localhost:4322
npm run build          # type-checks, then writes the static site to dist/
```

The API must list this site's origin in its `CORS_ALLOWED_ORIGINS`, or the "already signed in? go to the app"
check can't run (the page still works, it just always shows).

## How it's put together

- One page per language: English at `/`, the others at `/vi/`, `/ko/`, `/zh/`, `/ja/`, `/ru/`
  (`src/pages`), each with its own title, description, canonical link, hreflang links, preview image and
  structured data (`src/layouts/Base.astro`, `src/utils/seo.ts`). The sitemap and robots.txt are generated.
- The sections are the app's React landing components. Astro renders them to plain HTML at build time;
  only the interactive parts are hydrated in the browser (`src/components/pages/landing/islands.tsx`).
- The components, theme (`src/styles/global.css`), prices (`src/utils/constants.ts`) and wording
  (`src/i18n/strings.ts`) are copied from vib3-frontend. Change things in the app first, then copy them here.
