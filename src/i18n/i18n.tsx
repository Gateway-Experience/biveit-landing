import i18next, { type i18n as I18n } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import _ from 'lodash';

import STRINGS from 'src/i18n/strings';
import { DEFAULT_LANGUAGE, type LanguageCode } from 'src/utils/constants';

// One ready-to-use i18next per language, made on first use. Each page is built for a single language, and
// React islands hydrate with the same one, so the text matches between the built HTML and the browser.
const _instances: Partial<Record<LanguageCode, I18n>> = {};

// [Pure] One language's strings, in the shape i18next wants ({ key: text }). Falls back to English for any
// key that's missing in that language.
function _getTranslation(lang: LanguageCode) {
  return _.mapValues(STRINGS, byLanguage => byLanguage[lang] ?? byLanguage[DEFAULT_LANGUAGE]);
}

function getI18n(lang: LanguageCode) {
  if (!_instances[lang]) {
    const instance = i18next.createInstance();
    // initAsync false: the strings are already here, so it's ready the moment init returns (needed to render
    // at build time). React escapes text itself, so i18next mustn't escape it again.
    instance.use(initReactI18next).init({
      lng: lang,
      fallbackLng: DEFAULT_LANGUAGE,
      resources: { [lang]: { translation: _getTranslation(lang) } },
      initAsync: false,
      interpolation: { escapeValue: false },
    });
    _instances[lang] = instance;
  }
  return _instances[lang];
}

// [Pure-ish] A string in `lang`, for Astro templates (titles, meta tags) that aren't React.
function translate(lang: LanguageCode, key: string, values: Record<string, unknown> = {}) {
  return getI18n(lang).t(key, values);
}

// Intentions: the landing components call useTranslation() just like in the app. This puts the page's
// language around one of them, so it works whether Astro renders it as plain HTML or hydrates it as an island.
function withLanguage<P extends object>(Component: React.ComponentType<P>) {
  return function ComponentInLanguage({ lang, ...props }: P & { lang: LanguageCode }) {
    return (
      <I18nextProvider i18n={getI18n(lang)}>
        <Component {...(props as P)} />
      </I18nextProvider>
    );
  };
}

export {
  getI18n,
  translate,
  withLanguage,
};
