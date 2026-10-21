import { useTranslation } from 'react-i18next';
import { CheckIcon, ChevronDownIcon, CoffeeIcon, SparklesIcon, XIcon } from 'lucide-react';
import { cn } from 'cn';

import Reveal from 'src/components/common/Reveal';
import {
  BRAND_TEXT_CLASS, COMPARE_ROWS, FAQS, HERO_PERK_KEYS, HERO_QUALITIES, LANDING_WIDTH_CLASS, OUR_TASKS,
  SECTION_PAD_BOTTOM_CLASS, STAGGER_MS, YOUR_TASK_KEYS,
} from 'src/components/pages/landing/landingData';
import { getPriceLabels } from 'src/services/pricing';
import { withLanguage } from 'src/i18n/i18n';
import { APP_NAME } from 'src/utils/constants';

// The landing page's sections that need no JavaScript: Astro renders them to plain HTML at build time and
// sends none of this code to the browser. Copied from the app's Landing.tsx; the hero is split around its
// interactive parts (the prompt box and the showcase are islands, see islands.tsx), which pages/LandingPage.astro
// puts back together.

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <Reveal className='mx-auto max-w-2xl text-center'>
      {eyebrow && <span className='text-xs font-bold tracking-[0.18em] text-brand-strong uppercase'>{eyebrow}</span>}
      <h2 className='mt-3 font-heading text-3xl font-bold tracking-[-0.03em] text-balance sm:text-4xl'>{title}</h2>
      {subtitle && <p className='mt-4 text-pretty text-muted-foreground sm:text-lg'>{subtitle}</p>}
    </Reveal>
  );
}

function CheckBullet() {
  return (
    <span className='grid size-5 shrink-0 place-items-center rounded-full bg-primary/12 text-brand-strong'>
      <CheckIcon className='size-3' strokeWidth={3} />
    </span>
  );
}

// The top of the hero: the badge, the promise in three short lines ("You picture. We build. You own.") and the
// line under it. The prompt box comes next (an island), then HeroPerks.
// The badge sits inside the <h1> on purpose: its phrase ("The done-for-you website builder") is what people
// search for, and search engines weigh the main heading most. It looks the same as before (its own size, the
// slogan's spacing moved onto the slogan).
function HeroIntro() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className='flex flex-col items-center font-heading'>
        <span className='inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card px-4 py-2 font-sans text-sm font-semibold tracking-normal text-accent-foreground shadow-xs sm:text-[0.9375rem]'>
          <SparklesIcon className='size-4 text-brand-strong' />
          {t('landing_hero_eyebrow')}
        </span>
        <span className='mt-6 block text-[clamp(2.5rem,12vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.025em] break-words hyphens-auto sm:text-7xl xl:text-[5.25rem]'>
          <span className='block'>{t('landing_hero_title_lead')}</span>
          <span className='block'><span className={BRAND_TEXT_CLASS}>{t('landing_hero_title_build')}</span></span>
          <span className='block'>{t('landing_hero_title_rest')}</span>
        </span>
      </h1>
      <p className='mt-6 max-w-2xl text-lg text-pretty text-muted-foreground'>{t('landing_hero_subtitle')}</p>
    </>
  );
}

// Under the prompt box: what using biveit is like, then what the finished site is like.
function HeroPerks() {
  const { t } = useTranslation();

  return (
    <>
      <ul className='mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium'>
        {HERO_PERK_KEYS.map(perkKey => (
          <li key={perkKey} className='flex items-center gap-1.5'>
            <CheckBullet />
            {t(perkKey)}
          </li>
        ))}
      </ul>
      <ul className='mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground'>
        {HERO_QUALITIES.map(quality => (
          <li key={quality.id} data-qualityid={quality.id} className='flex items-center gap-1.5'>
            <quality.Icon className='size-4 text-brand-strong' strokeWidth={1.75} />
            {t(quality.labelKey)}
          </li>
        ))}
      </ul>
    </>
  );
}

// The "how it works" heading; the three animated steps under it are an island.
function HowItWorksHeading() {
  const { t } = useTranslation();
  return <SectionHeading eyebrow={t('landing_how_eyebrow')} title={t('landing_how_title')} />;
}

function DealSection() {
  const { t } = useTranslation();

  return (
    <section data-section='deal' className={cn(LANDING_WIDTH_CLASS, SECTION_PAD_BOTTOM_CLASS)}>
      <SectionHeading eyebrow={t('landing_deal_eyebrow')} title={t('landing_deal_title')} subtitle={t('landing_deal_subtitle')} />
      <div className='mt-12 grid gap-4 lg:grid-cols-5'>
        <Reveal className='flex flex-col rounded-3xl border bg-card p-6 sm:p-8 lg:col-span-2'>
          <h3 className='font-heading text-xl font-bold'>{t('landing_deal_yours')}</h3>
          <ol className='mt-6 mb-8 flex flex-col gap-4'>
            {YOUR_TASK_KEYS.map((taskKey, index) => (
              <li key={taskKey} className='flex items-center gap-3'>
                <span className='grid size-8 shrink-0 place-items-center rounded-full bg-accent font-heading text-sm font-bold text-accent-foreground'>{index + 1}</span>
                <span className='font-medium'>{t(taskKey)}</span>
              </li>
            ))}
          </ol>
          <p className='mt-auto flex items-center gap-2 border-t pt-5 text-sm text-muted-foreground'>
            <CoffeeIcon className='size-4 shrink-0' />
            {t('landing_deal_yours_time')}
          </p>
        </Reveal>
        <Reveal delayMs={STAGGER_MS} className='rounded-3xl bg-linear-to-br from-highlight to-chart-2 p-6 text-primary-foreground shadow-xl shadow-primary/20 sm:p-8 lg:col-span-3'>
          <div className='flex items-center justify-between gap-3'>
            <h3 className='font-heading text-xl font-bold'>{t('landing_deal_ours')}</h3>
            <span className='rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground'>{t('landing_deal_ours_badge')}</span>
          </div>
          <ul className='mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3'>
            {OUR_TASKS.map(task => (
              <li key={task.id} data-taskid={task.id} className='flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-3.5 py-3 text-sm font-semibold'>
                <task.Icon className='size-4.5 shrink-0' />
                {t(task.labelKey)}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function CompareSection() {
  const { t } = useTranslation();

  return (
    <section data-section='compare' className={cn(LANDING_WIDTH_CLASS, SECTION_PAD_BOTTOM_CLASS)}>
      <SectionHeading title={t('landing_compare_title')} />
      {/* One grid of [usual, vib3] cell pairs (not two columns), so each row's cells share a height */}
      <Reveal className='mx-auto mt-10 grid max-w-3xl grid-cols-2 overflow-hidden rounded-3xl border bg-card shadow-xs'>
        <div className='border-r p-4 text-sm font-bold text-muted-foreground sm:p-5'>{t('landing_compare_usual')}</div>
        <div className='bg-accent p-4 font-heading text-sm font-bold text-accent-foreground sm:p-5'>{t('landing_compare_vib3', { appName: APP_NAME })}</div>
        {COMPARE_ROWS.map(row => [
          <div key={`${row.id}-usual`} data-compareid={row.id} className='flex items-start gap-2.5 border-t border-r p-4 text-sm text-muted-foreground sm:p-5 sm:text-base'>
            <XIcon className='mt-0.5 size-4 shrink-0' />
            {t(row.usualKey)}
          </div>,
          <div key={`${row.id}-vib3`} data-compareid={row.id} className='flex items-start gap-2.5 border-t bg-accent/50 p-4 text-sm font-semibold sm:p-5 sm:text-base'>
            <CheckIcon className='mt-0.5 size-4 shrink-0 text-brand-strong' strokeWidth={3} />
            {t(row.vib3Key)}
          </div>,
        ])}
      </Reveal>
    </section>
  );
}

function FaqSection() {
  const { t, i18n } = useTranslation();
  const prices = getPriceLabels(i18n.language);

  return (
    <section data-section='faq' className={cn(LANDING_WIDTH_CLASS, SECTION_PAD_BOTTOM_CLASS)}>
      <SectionHeading title={t('landing_faq_title')} />
      <Reveal className='mx-auto mt-10 flex max-w-3xl flex-col gap-3'>
        {FAQS.map(faq => (
          // Native <details>: open/close for free, no JS state, and it works with the keyboard.
          <details key={faq.id} data-faqid={faq.id} className='group rounded-2xl border bg-card px-5 py-4 open:shadow-sm'>
            <summary className='flex cursor-pointer list-none items-center justify-between gap-4 font-heading font-semibold [&::-webkit-details-marker]:hidden'>
              {t(faq.questionKey)}
              <ChevronDownIcon className='size-4 shrink-0 text-brand-strong transition-transform group-open:rotate-180' />
            </summary>
            <p className='mt-3 text-muted-foreground'>{t(faq.answerKey, prices)}</p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}

const LandingHeroIntro = withLanguage(HeroIntro);
const LandingHeroPerks = withLanguage(HeroPerks);
const LandingHowItWorksHeading = withLanguage(HowItWorksHeading);
const LandingDealSection = withLanguage(DealSection);
const LandingCompareSection = withLanguage(CompareSection);
const LandingFaqSection = withLanguage(FaqSection);

export {
  SectionHeading,
  LandingHeroIntro,
  LandingHeroPerks,
  LandingHowItWorksHeading,
  LandingDealSection,
  LandingCompareSection,
  LandingFaqSection,
};
