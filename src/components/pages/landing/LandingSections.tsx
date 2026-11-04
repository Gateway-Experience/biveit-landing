import { useTranslation } from 'react-i18next';
import { CheckIcon, ChevronDownIcon, CoffeeIcon, XIcon } from 'lucide-react';
import { cn } from 'cn';

import Reveal from 'src/components/common/Reveal';
import {
  COMPARE_ROWS, FAQS, HERO_PERK_KEYS, HERO_PLEDGES, HERO_QUALITIES, LANDING_WIDTH_CLASS, OUR_TASKS,
  SECTION_PAD_BOTTOM_CLASS, STAGGER_MS, YOUR_TASK_KEYS,
} from 'src/components/pages/landing/landingData';
import { getPriceLabels } from 'src/services/pricing';
import { withLanguage } from 'src/i18n/i18n';
import { APP_NAME } from 'src/utils/constants';

// The landing page's sections that need no JavaScript: Astro renders them to plain HTML at build time and
// sends none of this code to the browser. (They started as the app's Landing.tsx.) The hero is split around its
// interactive parts (the prompt box is an island, see islands.tsx), which pages/LandingPage.astro
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

// The hero's backdrop: a navy night sky with a glowing horizon rising behind the prompt box, like the edge of a
// planet: a deep violet haze high up, a bright lavender rim with a touch of lime, and a pale floor below that
// turns into the page's own background, so the next section carries on seamlessly. Placed inside the block that
// starts with the prompt box (Landing puts it there), so the rim always meets the box, whatever the language or
// screen; the shapes run far wider than the screen and the hero clips them. Pure CSS, nothing to load.
function HeroHorizon() {
  const shapeClass = 'absolute left-1/2 h-[90rem] w-[max(180vw,110rem)] -translate-x-1/2 rounded-[50%]';
  return (
    <div aria-hidden='true' className='pointer-events-none absolute inset-x-0 top-0 -z-10'>
      <div className={cn(shapeClass, '-top-48 bg-[color-mix(in_oklab,var(--primary)_55%,var(--brand-ink))] opacity-70 blur-[90px]')} />
      <div className={cn(shapeClass, '-top-8 bg-primary blur-2xl')} />
      <div className={cn(shapeClass, 'top-6 bg-linear-to-b from-[color-mix(in_oklab,var(--primary)_35%,var(--background))] from-0% to-background to-[18%] shadow-[inset_0_10px_30px_-16px_var(--brand-light)] blur-[6px]')} />
    </div>
  );
}

// Two fine waves along the bottom of the hero, drifting slowly sideways (the marquee slide in global.css: each
// path repeats every half of its width, so sliding by half loops without a jump). With reduced motion on, still.
function HeroWaves() {
  return (
    <div aria-hidden='true' className='pointer-events-none absolute inset-x-0 bottom-10 -z-10 overflow-hidden'>
      <svg
        viewBox='0 0 2880 64'
        preserveAspectRatio='none'
        fill='none'
        strokeWidth={1}
        className='h-16 w-[200%] animate-marquee text-primary [animation-duration:60s] motion-reduce:animate-none'
        style={{ '--marquee-shift': '-50%' } as React.CSSProperties}
      >
        <path d='M0 30 Q180 6 360 30 Q540 54 720 30 Q900 6 1080 30 Q1260 54 1440 30 Q1620 6 1800 30 Q1980 54 2160 30 Q2340 6 2520 30 Q2700 54 2880 30' stroke='currentColor' strokeOpacity={0.55} vectorEffect='non-scaling-stroke' />
        <path d='M0 34 Q240 58 480 34 Q720 10 960 34 Q1200 58 1440 34 Q1680 10 1920 34 Q2160 58 2400 34 Q2640 10 2880 34' stroke='currentColor' strokeOpacity={0.35} vectorEffect='non-scaling-stroke' />
      </svg>
    </div>
  );
}

// The top of the hero, on its dark sky (light text): the badge, the promise in three short lines ("You picture. We build. You own.") and the
// line under it. The prompt box comes next (an island), then HeroPledges and HeroPerks.
// The badge sits inside the <h1> on purpose: its phrase ("The done-for-you website builder") is what people
// search for, and search engines weigh the main heading most. It looks the same as before (its own size, the
// slogan's spacing moved onto the slogan).
// The badge sits a visible 80px above the headline's letters, the same as the hero's top padding: the margin is
// 80px less the room the headline's line leaves above its capitals (about 8px at the phone size, 13px from sm up).
function HeroIntro() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className='flex flex-col items-center font-heading'>
        <span className='inline-flex items-center gap-2 rounded-full border border-brand-ink-foreground/15 bg-brand-ink-foreground/8 px-3.5 py-1.5 font-sans text-[0.8125rem] font-semibold tracking-normal text-brand-ink-foreground backdrop-blur-sm'>
          <span className='size-1.5 rounded-full bg-brand-light' />
          {t('landing_hero_eyebrow')}
        </span>
        <span className='mt-18 block text-[clamp(2.25rem,10vw,3rem)] leading-[1.08] text-brand-ink-foreground sm:mt-[67px] font-semibold tracking-[-0.03em] break-words hyphens-auto sm:text-6xl lg:text-[4rem]'>
          <span className='block'>{t('landing_hero_title_lead')}</span>
          {/* "We build." on a tilted block of lime, like a marker swipe over the whole phrase. Dark words on it, against
              the night sky. The block goes behind every line of the headline (no stacking context of its own), so
              the line above's descenders stay on top of it, but in front of the hero's backdrop (-z-10), whose
              haze would dull it. */}
          <span className='block'>
            <span className='relative inline-block text-brand-ink before:absolute before:-inset-x-[0.14em] before:-top-[0.02em] before:-bottom-[0.06em] before:-z-[5] before:-rotate-[2.5deg] before:bg-brand-light'>
              {t('landing_hero_title_build')}
            </span>
          </span>
          <span className='block'>{t('landing_hero_title_rest')}</span>
        </span>
      </h1>
      <p className='mt-5 max-w-xl text-pretty text-brand-ink-foreground/70 sm:text-lg'>{t('landing_hero_subtitle')}</p>
    </>
  );
}

// Right under the prompt box, and louder than the perks below it: how paying works. Two by two on phones, one row
// from sm up.
function HeroPledges() {
  const { t } = useTranslation();

  return (
    <ul className='mt-6 grid w-full max-w-xl grid-cols-2 gap-2 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center'>
      {HERO_PLEDGES.map(pledge => (
        <li
          key={pledge.id}
          data-pledgeid={pledge.id}
          className='flex items-center gap-2 rounded-full border border-brand-deep/40 bg-card py-1.5 pr-3.5 pl-1.5 text-left text-[0.8125rem] leading-tight font-semibold shadow-md shadow-brand-strong/10 sm:text-sm'
        >
          <span className='grid size-6 shrink-0 place-items-center rounded-full bg-highlight text-brand-strong'>
            <pledge.Icon className='size-3.5' strokeWidth={2.25} />
          </span>
          {t(pledge.labelKey)}
        </li>
      ))}
    </ul>
  );
}

// Under the prompt box: what using biveit is like, then what the finished site is like.
function HeroPerks() {
  const { t } = useTranslation();

  return (
    <>
      <ul className='mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium'>
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
const LandingHeroPledges = withLanguage(HeroPledges);
const LandingHeroPerks = withLanguage(HeroPerks);
const LandingHowItWorksHeading = withLanguage(HowItWorksHeading);
const LandingDealSection = withLanguage(DealSection);
const LandingCompareSection = withLanguage(CompareSection);
const LandingFaqSection = withLanguage(FaqSection);

export {
  SectionHeading,
  HeroHorizon,
  HeroWaves,
  LandingHeroIntro,
  LandingHeroPledges,
  LandingHeroPerks,
  LandingHowItWorksHeading,
  LandingDealSection,
  LandingCompareSection,
  LandingFaqSection,
};
