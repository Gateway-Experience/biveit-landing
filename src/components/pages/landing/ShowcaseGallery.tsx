import { useTranslation } from 'react-i18next';
import { ArrowUpRightIcon } from 'lucide-react';
import { cn } from 'cn';

import Reveal from 'src/components/common/Reveal';
import { HeroHorizon, HeroWaves } from 'src/components/pages/landing/LandingSections';
import ScaledFrame from 'src/components/common/ScaledFrame';
import { BrowserDots } from 'src/components/pages/landing/ProductSnippets';
import { STAGGER_MS } from 'src/components/pages/landing/landingData';

export type GallerySite = { id: string; domainKey: string; typeKey: string; descKey: string; href: string; Site: () => React.ReactNode };

// One example site in a browser frame with its caption, as a link that opens the live site in a new tab. Pointing
// at it zooms the site inside a little.
function SiteCard({ site }: { site: GallerySite }) {
  const { t } = useTranslation();
  return (
    <a
      href={site.href}
      target='_blank'
      rel='noopener'
      data-siteid={site.id}
      className='group/card flex h-full flex-col overflow-hidden rounded-2xl border bg-background shadow-md outline-none transition-shadow duration-500 hover:shadow-xl hover:shadow-brand-strong/20 focus-visible:ring-3 focus-visible:ring-ring/40'
    >
      <div className='flex items-center gap-3 border-b bg-card px-3 py-2'>
        <BrowserDots />
        <span className='truncate rounded-md bg-muted px-2 py-0.5 text-[0.6875rem] text-muted-foreground'>{t(site.domainKey)}</span>
        <ArrowUpRightIcon className='ml-auto size-3.5 shrink-0 text-muted-foreground transition-colors group-hover/card:text-foreground' />
      </div>
      <div className='overflow-hidden'>
        <div className='transition-transform duration-700 ease-out group-hover/card:scale-105'>
          <ScaledFrame baseWidth={640} baseHeight={400}>
            <site.Site />
          </ScaledFrame>
        </div>
      </div>
      <div className='flex-1 bg-card px-5 py-4'>
        <p className='text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase'>{t(site.typeKey)}</p>
        <p className='mt-1.5 font-medium'>{t(site.descKey)}</p>
      </div>
    </a>
  );
}

// Original purpose: the landing page's "what could yours look like".
// Intentions: the example sites in one still row of four (two by two on tablets, stacked on phones), each fading
// in as it scrolls into view. On the hero's backdrop upside down, so the page ends the way it starts: the page's
// own background at the top (carrying on from the section above) with the hero's two fine waves, then the
// horizon's lavender rim at the footer (the start button), like the hero's rim at its prompt box, and the navy
// night sky below it. `heading` is the section's title block, rendered above; `footer` (optional) goes under the
// row.
export default function ShowcaseGallery({ sites, heading, footer }: { sites: GallerySite[]; heading: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <section data-section='showcase' className='relative isolate overflow-hidden bg-background'>
      {/* Padding: the landing's section gap on top; at the bottom, the same as the gap above the button (the
          footer's mt-12), so the button sits evenly between the cards and the section's end. */}
      <div className='mx-auto w-full max-w-7xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20'>
        {heading}
        <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {sites.map((site, index) => (
            <Reveal key={site.id} delayMs={index * STAGGER_MS}>
              <SiteCard site={site} />
            </Reveal>
          ))}
        </div>
        {footer && (
          <div className='relative'>
            {/* The flip point is the button's middle: half the wrapper, plus half the footer's mt-12 above it. The
                horizon mirrored there, over plain navy (the horizon's shapes don't reach the section's bottom on
                every screen). The navy starts 10rem higher, under the horizon's solid rim and floor: the haze is
                see-through, so a navy edge where it starts would show through it as a line. */}
            <div aria-hidden='true' className='pointer-events-none absolute top-[calc(50%-8.5rem)] left-1/2 -z-20 h-[100rem] w-[300vw] -translate-x-1/2 bg-brand-ink' />
            <HeroHorizon className='top-[calc(50%+1.5rem)] origin-top -scale-y-100' />
            {footer}
          </div>
        )}
      </div>
      {/* After the content, so the waves draw over the horizon's floor. */}
      <HeroWaves className='top-2' />
    </section>
  );
}
