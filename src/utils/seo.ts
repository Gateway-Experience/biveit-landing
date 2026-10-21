import _ from 'lodash';

import { FAQS } from 'src/components/pages/landing/landingData';
import { translate } from 'src/i18n/i18n';
import META_DESCRIPTIONS from 'src/i18n/meta';
import { getPriceLabels } from 'src/services/pricing';
import { APP_NAME, DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from 'src/utils/constants';

// [Pure] A language's page path: English at `/`, the others at `/<code>/`.
function getLanguagePath(lang: LanguageCode) {
  return lang === DEFAULT_LANGUAGE ? '/' : `/${lang}/`;
}

// Chinese and Japanese don't put spaces between sentences; the slogan's parts already end in punctuation.
const _NO_SPACE_LANGUAGES: LanguageCode[] = ['zh', 'ja'];

// [Pure-ish] What a language's page shows in search results and link previews:
// - `title` (search results) leads with what people search for, the hero badge's phrase ("The done-for-you
//   website builder", "Dịch vụ làm website trọn gói"...), then the name.
// - `socialTitle` (link previews when shared) is the slogan, which reads better in a feed than in a search.
// - `description` is written for search (i18n/meta.ts).
function getPageMeta(lang: LanguageCode) {
  const slogan = _.join([
    translate(lang, 'landing_hero_title_lead'),
    translate(lang, 'landing_hero_title_build'),
    translate(lang, 'landing_hero_title_rest'),
  ], _.includes(_NO_SPACE_LANGUAGES, lang) ? '' : ' ');
  return {
    title: `${translate(lang, 'landing_hero_eyebrow')} | ${APP_NAME}`,
    socialTitle: `${APP_NAME} · ${slogan}`,
    description: META_DESCRIPTIONS[lang],
  };
}

// [Pure-ish] Structured data (schema.org JSON-LD) for search engines: who we are, the site, and the FAQ, which
// Google can show as expandable questions under the result. The FAQ is the same text the page shows.
function getStructuredData(lang: LanguageCode, siteUrl: URL) {
  const pageUrl = new URL(getLanguagePath(lang), siteUrl).href;
  const htmlLang = _.find(LANGUAGES, { code: lang })?.htmlLang ?? lang;
  const prices = getPriceLabels(lang);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: APP_NAME,
      url: siteUrl.href,
      logo: new URL('/favicons/icon-512.png', siteUrl).href,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: APP_NAME,
      url: pageUrl,
      inLanguage: htmlLang,
      description: getPageMeta(lang).description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: htmlLang,
      mainEntity: FAQS.map(faq => ({
        '@type': 'Question',
        name: translate(lang, faq.questionKey),
        acceptedAnswer: { '@type': 'Answer', text: translate(lang, faq.answerKey, prices) },
      })),
    },
  ];
}

export {
  getLanguagePath,
  getPageMeta,
  getStructuredData,
};
