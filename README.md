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
- The sections are React components (they started out as the app's landing page). Astro renders them to
  plain HTML at build time; only the interactive parts are hydrated in the browser
  (`src/components/pages/landing/islands.tsx`).
- This repo is the only home of the landing page: edit it here. The app's `/` just sends signed-out visitors
  to this site (its `VITE_LANDING_URL`).
- A few things also exist in the app (vib3-frontend) and must be kept in step by hand:
  - prices: `PRICING` in `src/utils/constants.ts` (the app's Pricing page has the same);
  - the colour theme: `src/styles/global.css` (the app's `src/styles/index.css`);
  - the logo and favicons: `src/assets/brand/`, `public/favicons/`;
  - the `idea` link parameter the app's new-project form reads: `NEW_PROJECT_IDEA_PARAM`.
- The wording (`src/i18n/strings.ts`) started as a copy of the app's translations and now lives here.
