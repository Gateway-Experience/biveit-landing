// Intentions: where a visitor came from (an ad's utm_* tags, or the site that linked here), carried over to the app
// on the links into it. This site sends no analytics of its own, so without this the app would only ever see
// "came from biveit.com" and every signup's real source would be lost. The app records it once the visitor allows
// analytics there (biveit-frontend services/analytics, readArrivalSource).
// Kept in sessionStorage for the visit (first page wins, like PostHog's own "initial" properties), so it survives
// moving around this site before clicking through. It's no identifier: just the tags and a domain name.

const _STORAGE_KEY = 'biveit_arrival_source';
const _UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
// The referring site's domain, as the app reads it.
const _REFERRER_PARAM = 'ref';

type ArrivalSource = Record<string, string>;

// [Pure] What this page view says about where the visitor came from: the URL's utm_* tags, plus the referring
// site's domain -- only another site's, since moving between this site's own pages isn't a source.
function readArrivalSource(url: URL, referrer: string): ArrivalSource {
  const utmTags = Object.fromEntries(_UTM_PARAMS.flatMap(name => (url.searchParams.get(name) ? [[name, url.searchParams.get(name) as string]] : [])));
  const referrerHost = referrer ? new URL(referrer).hostname : '';
  return {
    ...utmTags,
    ...(referrerHost && referrerHost !== url.hostname ? { [_REFERRER_PARAM]: referrerHost } : {}),
  };
}

// Storage can be blocked (private modes, strict settings): then there's simply no source to carry.
function _getStoredSource(): ArrivalSource {
  try {
    return JSON.parse(sessionStorage.getItem(_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

// Notes this page view's source, unless the visit already has one (the first page counts).
function rememberArrivalSource() {
  const source = readArrivalSource(new URL(window.location.href), document.referrer);
  if (Object.keys(_getStoredSource()).length || !Object.keys(source).length) {
    return;
  }
  try {
    sessionStorage.setItem(_STORAGE_KEY, JSON.stringify(source));
  } catch {
    // See _getStoredSource.
  }
}

// `url` with the visit's source added as query params (for links into the app).
function withArrivalSource(url: string) {
  const source = _getStoredSource();
  if (!Object.keys(source).length) {
    return url;
  }
  const target = new URL(url, window.location.href);
  const params = new URLSearchParams({ ...Object.fromEntries(target.searchParams), ...source });
  return `${target.origin}${target.pathname}?${params}${target.hash}`;
}

export {
  readArrivalSource,
  rememberArrivalSource,
  withArrivalSource,
};
