// Intentions: where a visitor came from (an ad's utm_* tags, an ad platform's click id -- gclid: Google Ads, fbclid:
// Facebook -- or the site that linked here), carried over to the app on the links into it. This site sends no
// analytics of its own, so without this the app would only ever see "came from biveit.com" and every signup's real
// source would be lost. The app keeps it on the account if they sign up, and on their analytics person if they allow
// analytics (biveit-frontend services/arrivalSource).
// Kept in sessionStorage for the visit (first page wins, like PostHog's own "initial" properties), so it survives
// moving around this site before clicking through. Nothing of ours is added: the tags, the click id the ad platform
// put on the link, and a domain name.

import { APP_URL } from 'src/utils/appUrls';

const _STORAGE_KEY = 'biveit_arrival_source';
// Passed on as they are; the app reads the same names (biveit-frontend services/arrivalSource).
const _URL_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
// The referring site's domain, as the app reads it. `direct` when the visit had no source at all.
const _REFERRER_PARAM = 'ref';
const _DIRECT = 'direct';

type ArrivalSource = Record<string, string>;

// [Pure] What this page view says about where the visitor came from: the URL's tags and click ids, plus the referring
// site's domain. That's a `ref` already in the URL (the app passes one along when it sends a visitor here, see
// biveit-frontend routes RedirectToLanding), else the browser's referrer -- unless it's one of our own sites
// (`ownHosts`: this one and the app), since being moved between them isn't a source. With none of that the visit was
// direct (typed in, a bookmark, a messaging app that sends no referrer): `ref=direct`, so the app can tell it apart
// from "came from biveit.com".
function readArrivalSource(url: URL, referrer: string, ownHosts: string[]): ArrivalSource {
  const urlTags = Object.fromEntries(_URL_PARAMS.flatMap(name => (url.searchParams.get(name) ? [[name, url.searchParams.get(name) as string]] : [])));
  const referrerHost = referrer ? new URL(referrer).hostname : '';
  const externalReferrer = referrerHost && !ownHosts.includes(referrerHost) ? referrerHost : null;
  const referringDomain = url.searchParams.get(_REFERRER_PARAM) || externalReferrer;
  return {
    ...urlTags,
    ...(referringDomain || !Object.keys(urlTags).length ? { [_REFERRER_PARAM]: referringDomain || _DIRECT } : {}),
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
  const url = new URL(window.location.href);
  const ownHosts = [url.hostname, ...(APP_URL ? [new URL(APP_URL).hostname] : [])];
  const source = readArrivalSource(url, document.referrer, ownHosts);
  if (Object.keys(_getStoredSource()).length) {
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
