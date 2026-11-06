import { useTranslation } from 'react-i18next';
import { CoffeeIcon } from 'lucide-react';
import { cn } from 'cn';

import cryptoCalmSnapshot from 'src/assets/showcase/cryptocalm.webp';
import fourPixieGamesSnapshot from 'src/assets/showcase/4pixiegames.webp';
import tuViThanSoSnapshot from 'src/assets/showcase/tuvithanso.webp';
import wordPuzzleSnapshot from 'src/assets/showcase/wordpuzzle.webp';

// Intentions: the customer sites the landing page shows: four real ones in the "Ideas" section (TuViThanSoSite,
// FourPixieGamesSite, WordPuzzleSite and CryptoCalmSite, snapshots of their home pages) and a made-up café (CafeSite), the site the how-it-works demo
// builds, a small but believable home page in its own brand colors (the `--site-cafe` tokens). They're all drawn
// on a 640x400 canvas; the caller scales them down with ScaledFrame.
// Shop names, product names and prices are flavor and stay as-is in every language.

// Standard top bar: brand on the left, a few links and a call-to-action on the right.
function SiteNav({ brand, brandClassName, linkKeys, ctaLabel, ctaClassName, className }: {
  brand: React.ReactNode;
  brandClassName?: string;
  linkKeys: string[];
  ctaLabel?: string;
  ctaClassName?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className={cn('flex items-center justify-between px-7 py-4', className)}>
      <span className={cn('flex items-center gap-2 text-[15px] font-bold', brandClassName)}>{brand}</span>
      <div className='flex items-center gap-5 text-[11px] font-medium opacity-80'>
        {linkKeys.map(linkKey => <span key={linkKey}>{t(linkKey)}</span>)}
        {ctaLabel && <span className={cn('rounded-full px-3.5 py-1.5 text-[11px] font-semibold opacity-100', ctaClassName)}>{ctaLabel}</span>}
      </div>
    </div>
  );
}

function TuViThanSoSite() {
  return <img src={tuViThanSoSnapshot.src} alt='' width={1280} height={800} loading='lazy' decoding='async' className='size-full object-cover object-top' />;
}

// Also real: a snapshot of 4pixiegames.com's home page (a studio that turns a one-line idea into a mobile game),
// taken the same way.
function FourPixieGamesSite() {
  return <img src={fourPixieGamesSnapshot.src} alt='' width={1280} height={800} loading='lazy' decoding='async' className='size-full object-cover object-top' />;
}

// Also real: a snapshot of wordpuzzle.biveitapp.com (PuzzleForge, a crossword and word search maker), built with
// Biveit, taken the same way.
function WordPuzzleSite() {
  return <img src={wordPuzzleSnapshot.src} alt='' width={1280} height={800} loading='lazy' decoding='async' className='size-full object-cover object-top' />;
}

// Also real: a snapshot of cryptocalm.biveitapp.com (BitCalm, a calm feed of crypto news with live prices), built
// with Biveit, taken the same way.
function CryptoCalmSite() {
  return <img src={cryptoCalmSnapshot.src} alt='' width={1280} height={800} loading='lazy' decoding='async' className='size-full object-cover object-top' />;
}

function CafeSite() {
  const { t } = useTranslation();
  const menu = [
    { id: 'espresso', name: 'Espresso', price: '35k' },
    { id: 'suada', name: 'Cà phê sữa đá', price: '39k' },
    { id: 'coldbrew', name: 'Cold brew', price: '45k' },
    { id: 'croissant', name: 'Croissant', price: '32k' },
  ];
  return (
    <div className='flex size-full flex-col bg-site-cafe-soft text-site-cafe'>
      <SiteNav
        brand={<><CoffeeIcon className='size-5' />Morning Bean</>}
        linkKeys={['landing_mock_nav_menu', 'landing_laptop_nav_contact']}
        ctaLabel={t('landing_mock_cafe_reserve_title')}
        ctaClassName='bg-site-cafe text-card'
      />
      <p className='px-7 pt-2 font-heading text-[28px] leading-tight font-bold'>{t('landing_mock_cafe_title')}</p>
      <div className='grid flex-1 grid-cols-[1.2fr_1fr] gap-6 px-7 pt-4 pb-6'>
        <div>
          <p className='text-[11px] font-bold tracking-[0.2em] uppercase opacity-70'>{t('landing_mock_cafe_menu')}</p>
          <ul className='mt-2 flex flex-col gap-2.5 text-[12px]'>
            {menu.map(item => (
              <li key={item.id} className='flex items-end gap-2'>
                <span className='font-medium'>{item.name}</span>
                <span className='mb-1 flex-1 border-b border-dotted border-site-cafe/40' />
                <span className='font-semibold'>{item.price}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className='rounded-2xl bg-card p-4 shadow-sm'>
          <p className='text-[13px] font-bold'>{t('landing_mock_cafe_reserve_title')}</p>
          <div className='mt-2.5 flex flex-col gap-1.5 text-[11px]'>
            {[
              { id: 'date', labelKey: 'landing_mock_date', value: '12/06' },
              { id: 'time', labelKey: 'landing_mock_time', value: '08:30' },
              { id: 'guests', labelKey: 'landing_mock_guests', value: '2' },
            ].map(field => (
              <div key={field.id} className='flex justify-between rounded-lg border border-site-cafe/15 px-2.5 py-1.5'>
                <span className='opacity-70'>{t(field.labelKey)}</span>
                <span className='font-semibold'>{field.value}</span>
              </div>
            ))}
          </div>
          <span className='mt-2.5 block rounded-lg bg-site-cafe py-1.5 text-center text-[11px] font-semibold text-card'>{t('landing_mock_cafe_reserve')}</span>
        </div>
      </div>
    </div>
  );
}

export {
  TuViThanSoSite,
  FourPixieGamesSite,
  WordPuzzleSite,
  CryptoCalmSite,
  CafeSite,
};
