import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { cn } from 'cn';

import ScaledFrame from 'src/components/common/ScaledFrame';
import { BrowserDots } from 'src/components/pages/landing/ProductSnippets';
import { useIsInView, useMediaQuery } from 'src/utils/hooks';

export type CarouselSite = { id: string; domainKey: string; typeKey: string; descKey: string; Site: () => React.ReactNode };

// How many copies of the list the track holds. It slides left by exactly one copy and starts over, so the jump
// lands on an identical picture; three copies keep the screen covered even on very wide monitors.
const _COPY_COUNT = 3;

// How long one copy takes to slide past, per site.
const _SECONDS_PER_SITE = 11;

// One example site in a browser frame with its caption. Pointing at it zooms the site inside a little.
function SiteCard({ site }: { site: CarouselSite }) {
  const { t } = useTranslation();
  return (
    <div className='group/card flex h-full flex-col overflow-hidden rounded-2xl border bg-background shadow-md transition-shadow duration-500 hover:shadow-xl hover:shadow-brand-strong/20'>
      <div className='flex items-center gap-3 border-b bg-card px-3 py-2'>
        <BrowserDots />
        <span className='truncate rounded-md bg-muted px-2 py-0.5 text-[0.6875rem] text-muted-foreground'>{t(site.domainKey)}</span>
      </div>
      <div className='overflow-hidden'>
        <div className='transition-transform duration-700 ease-out group-hover/card:scale-105'>
          <ScaledFrame baseWidth={640} baseHeight={400}>
            <site.Site />
          </ScaledFrame>
        </div>
      </div>
      <div className='flex-1 bg-card px-4 py-3'>
        <p className='text-[0.6875rem] font-bold tracking-[0.14em] text-muted-foreground uppercase'>{t(site.typeKey)}</p>
        <p className='mt-1 text-sm font-medium'>{t(site.descKey)}</p>
      </div>
    </div>
  );
}

// Original purpose: the landing page's "what could yours look like".
// Intentions: the example sites in one row that slides slowly and endlessly to the left, edge to edge, fading out
// at both sides, so the section stays short however many sites there are. It only moves while it's on screen,
// and holds still while the pointer is over it, so a site can be looked at. With reduced motion on, it doesn't
// move at all; the row just scrolls sideways by hand. `heading` is the section's title block, rendered above;
// `footer` (optional) goes under the row.
export default function ShowcaseCarousel({ sites, heading, footer }: { sites: CarouselSite[]; heading: React.ReactNode; footer?: React.ReactNode }) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [rowRef, isInView] = useIsInView<HTMLDivElement>();
  const copyCount = prefersReducedMotion ? 1 : _COPY_COUNT;

  return (
    <section data-section='showcase' className='border-y bg-card'>
      {/* Padding: the landing's section gap (SECTION_PAD_BOTTOM_CLASS in Landing), on top too since the border
          sits between it and the section above. With a footer (the start button), the bottom matches the gap
          above the button (mt-12) instead. */}
      <div className={cn('pt-14 sm:pt-20', footer ? 'pb-12' : 'pb-14 sm:pb-20')}>
        <div className='mx-auto w-full max-w-6xl px-4 sm:px-6'>
          {heading}
        </div>
        <div
          ref={rowRef}
          className={cn(
            'group/row mt-10 mask-x-from-90% mask-x-to-100% py-2',
            prefersReducedMotion ? 'overflow-x-auto' : 'overflow-hidden',
          )}
        >
          {/* The cards space themselves with padding rather than the row's gap, so one copy is exactly a third
              of the track and the slide (-100% / copies) lines up. */}
          <div
            className={cn('flex w-max', !prefersReducedMotion && 'animate-marquee group-hover/row:[animation-play-state:paused]')}
            style={prefersReducedMotion ? undefined : {
              animationDuration: `${_.size(sites) * _SECONDS_PER_SITE}s`,
              '--marquee-shift': `${-100 / copyCount}%`,
              ...(!isInView && { animationPlayState: 'paused' }),
            } as React.CSSProperties}
          >
            {_.times(copyCount, copyIndex => sites.map(site => (
              <div key={`${copyIndex}-${site.id}`} aria-hidden={copyIndex > 0 || undefined} className='w-[17.5rem] shrink-0 pl-6 sm:w-[23.5rem]'>
                <SiteCard site={site} />
              </div>
            )))}
          </div>
        </div>
        {footer && <div className='px-4 sm:px-6'>{footer}</div>}
      </div>
    </section>
  );
}
