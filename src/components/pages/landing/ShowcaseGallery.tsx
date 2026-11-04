import { useTranslation } from 'react-i18next';
import { ArrowUpRightIcon } from 'lucide-react';
import { cn } from 'cn';

import Reveal from 'src/components/common/Reveal';
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
// Intentions: the example sites side by side in one still row (stacked on phones), each fading in as it scrolls
// into view. `heading` is the section's title block, rendered above; `footer` (optional) goes under the row.
export default function ShowcaseGallery({ sites, heading, footer }: { sites: GallerySite[]; heading: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <section data-section='showcase' className='border-y bg-card'>
      {/* Padding: the landing's section gap (SECTION_PAD_BOTTOM_CLASS in Landing), on top too since the border
          sits between it and the section above. With a footer (the start button), the bottom matches the gap
          above the button (mt-12) instead. */}
      <div className={cn('mx-auto w-full max-w-5xl px-4 pt-14 sm:px-6 sm:pt-20', footer ? 'pb-12' : 'pb-14 sm:pb-20')}>
        {heading}
        <div className='mt-10 grid gap-6 sm:grid-cols-2'>
          {sites.map((site, index) => (
            <Reveal key={site.id} delayMs={index * STAGGER_MS}>
              <SiteCard site={site} />
            </Reveal>
          ))}
        </div>
        {footer}
      </div>
    </section>
  );
}
