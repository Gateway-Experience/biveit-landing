import { NEW_PROJECT_IDEA_PARAM } from 'src/utils/constants';

// Where the biveit web app lives (log in, the projects, pricing and the policy pages are all there) and its
// API. Set per environment in .env (see .env.example); PUBLIC_ means Astro bakes them into the page.
const APP_URL = import.meta.env.PUBLIC_APP_URL ?? '';
const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? '';

// Every "start" button: the app's project list. Visitors who aren't signed in get sent through Log in first
// and land there afterwards.
const APP_START_URL = `${APP_URL}/projects`;
const APP_PRICING_URL = `${APP_URL}/pricing`;
const APP_TERMS_URL = `${APP_URL}/terms-of-service`;
const APP_PRIVACY_URL = `${APP_URL}/privacy-policy`;
const APP_COOKIE_POLICY_URL = `${APP_URL}/cookie-policy`;
// The app's "who am I": 200 with the user when signed in, 401 otherwise. Used to send signed-in users
// straight into the app (layouts/Base.astro).
const API_ME_URL = `${API_BASE_URL}/me`;

// [Pure] Log in, then on to the project list with `idea` in the URL: the app opens its new-project form with
// it already filled in (the hero's prompt box). Someone already signed in goes straight through the login page.
function buildLoginWithIdeaUrl(idea: string) {
  const projectsPath = `/projects?${new URLSearchParams({ [NEW_PROJECT_IDEA_PARAM]: idea })}`;
  return `${APP_URL}/login?${new URLSearchParams({ next: projectsPath })}`;
}

export {
  APP_START_URL,
  APP_PRICING_URL,
  APP_TERMS_URL,
  APP_PRIVACY_URL,
  APP_COOKIE_POLICY_URL,
  API_ME_URL,
  buildLoginWithIdeaUrl,
};
