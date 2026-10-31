import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon } from 'lucide-react';
import { cn } from 'cn';

import Reveal from 'src/components/common/Reveal';
import BusinessOrbit from 'src/components/pages/landing/BusinessOrbit';
import DotGridBackdrop from 'src/components/pages/landing/DotGridBackdrop';
import HeroPrompt from 'src/components/pages/landing/HeroPrompt';
import HeroShowcase from 'src/components/pages/landing/HeroShowcase';
import HowItWorks from 'src/components/pages/landing/HowItWorks';
import { SectionHeading } from 'src/components/pages/landing/LandingSections';
import ShowcaseCarousel from 'src/components/pages/landing/ShowcaseCarousel';
import {
  BRAND_BUTTON_CLASS, BUSINESSES, GALLERY_SITE_IDS, HERO_SITE_IDS, SHOWCASE_SITES,
} from 'src/components/pages/landing/landingData';
import { withLanguage } from 'src/i18n/i18n';
import { APP_START_URL } from 'src/utils/appUrls';

// The landing page's interactive parts, which Astro hydrates in the browser (they still arrive as finished
// HTML first). Astro can only hand an island plain data, not components, so each wrapper here owns its own
// lists and takes just the page's language (plus a class).

function HeroShowcaseWithSites() {
  return <HeroShowcase sites={_.filter(SHOWCASE_SITES, site => _.includes(HERO_SITE_IDS, site.id))} />;
}

function BusinessOrbitWithBusinesses() {
  const { t } = useTranslation();
  return <BusinessOrbit businesses={BUSINESSES} title={t('landing_made_for_title')} />;
}

function ShowcaseWithSites() {
  const { t } = useTranslation();
  return (
    <ShowcaseCarousel
      sites={_.compact(_.map(GALLERY_SITE_IDS, id => _.find(SHOWCASE_SITES, { id })))}
      heading={<SectionHeading eyebrow={t('landing_showcase_eyebrow')} title={t('landing_showcase_title')} subtitle={t('landing_showcase_subtitle')} />}
      footer={(
        <Reveal className='mt-12 flex justify-center'>
          <a
            href={APP_START_URL}
            className={cn('inline-flex h-13 w-[186px] items-center justify-center gap-2 rounded-lg pr-5 pl-6 font-semibold whitespace-nowrap transition-all', BRAND_BUTTON_CLASS)}
          >
            {t('landing_cta_start')}
            <ArrowRightIcon className='size-4.5' />
          </a>
        </Reveal>
      )}
    />
  );
}

const LandingHeroPrompt = withLanguage(HeroPrompt);
const LandingHeroShowcase = withLanguage(HeroShowcaseWithSites);
const LandingHowItWorks = withLanguage(HowItWorks);
const LandingBusinessOrbit = withLanguage(BusinessOrbitWithBusinesses);
const LandingShowcase = withLanguage(ShowcaseWithSites);

export {
  LandingHeroPrompt,
  LandingHeroShowcase,
  LandingHowItWorks,
  LandingBusinessOrbit,
  LandingShowcase,
  DotGridBackdrop,
};
