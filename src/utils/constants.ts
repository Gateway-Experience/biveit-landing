// The landing site's constants. PRICING and NEW_PROJECT_IDEA_PARAM also exist in the app (biveit-frontend
// src/utils/constants.ts): keep them in step by hand. PRICING is what the FAQ quotes.

const APP_NAME = 'Biveit';

// The languages the landing page is published in. Each gets its own address: English at `/`, the others at
// `/<code>/` (see pages/[lang]). `name` is the language's own name for itself, so people can spot theirs.
// `htmlLang` / `ogLocale` are what search engines and link previews read.
const LANGUAGES = [
  { code: 'en', name: 'English', htmlLang: 'en', ogLocale: 'en_US' },
  { code: 'vi', name: 'Tiếng Việt', htmlLang: 'vi', ogLocale: 'vi_VN' },
  { code: 'ko', name: '한국어', htmlLang: 'ko', ogLocale: 'ko_KR' },
  { code: 'zh', name: '简体中文', htmlLang: 'zh-Hans', ogLocale: 'zh_CN' },
  { code: 'ja', name: '日本語', htmlLang: 'ja', ogLocale: 'ja_JP' },
  { code: 'ru', name: 'Русский', htmlLang: 'ru', ogLocale: 'ru_RU' },
] as const;

type LanguageCode = typeof LANGUAGES[number]['code'];

const DEFAULT_LANGUAGE: LanguageCode = 'en';

// What biveit costs, in USD (formatted for display by services/pricing).
//   publishPrice     the regular one-time price to publish a site
//   salePublishPrice what it's sold for while there's a sale; null = no sale, publishPrice applies
//   monthlyPrice     the monthly charge once the site is live
//   freeDomainBelow  a domain costing less than this is included free
const PRICING = {
  publishPrice: 49,
  salePublishPrice: 39 as number | null,
  monthlyPrice: 9,
  freeDomainBelow: 20,
};

// The query param that carries a site idea into the app's new-project form (/projects?idea=...: the app opens the
// form with it filled in).
// Must match NEW_PROJECT_IDEA_PARAM in the app.
const NEW_PROJECT_IDEA_PARAM = 'idea';

// Example site ideas, as i18n keys: typed out as a hint in the hero's prompt box.
const EXAMPLE_IDEA_KEYS = ['auth_showcase_prompt_1', 'auth_showcase_prompt_2', 'auth_showcase_prompt_3', 'auth_showcase_prompt_4'];

export {
  APP_NAME,
  LANGUAGES,
  DEFAULT_LANGUAGE,
  PRICING,
  NEW_PROJECT_IDEA_PARAM,
  EXAMPLE_IDEA_KEYS,
};
export type { LanguageCode };
