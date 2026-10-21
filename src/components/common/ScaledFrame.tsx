import { cn } from 'cn';

import { useElementSize } from 'src/utils/hooks';

// Intentions: renders children on a fixed-size canvas (baseWidth x baseHeight, in px) and scales it down
// to whatever width the frame gets — like a screenshot of a UI, except it's live markup that stays crisp
// and follows the theme. Handy for device mockups (a site inside a laptop or phone screen).
// The canvas stays hidden until the frame has been measured, so it never flashes at full size.
// On the landing page these are pictures of made-up example sites ("Ride Da Nang your way", prices...), not
// content: `aria-hidden` keeps screen readers from reading them out (nothing inside can take focus), and
// `data-nosnippet` keeps their text out of the snippets Google shows under our search result.
export default function ScaledFrame({ baseWidth, baseHeight, className, children }: {
  baseWidth: number;
  baseHeight: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [setFrameElement, frameSize] = useElementSize<HTMLDivElement>();
  const scale = frameSize.width ? frameSize.width / baseWidth : 0;

  return (
    <div
      ref={setFrameElement}
      aria-hidden='true'
      data-nosnippet=''
      className={cn('relative w-full overflow-hidden', className)}
      style={{ aspectRatio: `${baseWidth} / ${baseHeight}` }}
    >
      <div
        className='absolute top-0 left-0 origin-top-left'
        style={{ width: baseWidth, height: baseHeight, transform: `scale(${scale})`, visibility: scale ? 'visible' : 'hidden' }}
      >
        {children}
      </div>
    </div>
  );
}
