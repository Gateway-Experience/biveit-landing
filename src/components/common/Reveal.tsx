import { createElement } from 'react';

import { useHasBeenInView } from 'src/utils/hooks';

type RevealProps = React.HTMLAttributes<HTMLElement> & {
  // The element to render, so a revealed card can still be the `li` of its list.
  as?: 'div' | 'li' | 'section';
  // Wait this long after it scrolls into view. Give items in a row increasing delays to stagger them.
  delayMs?: number;
};

// Intentions: content that fades in and drifts up the first time it scrolls into view (the animation is in
// global.css). It works in both kinds of places on this page:
// - in plain-HTML sections, React never runs in the browser, so scripts/reveal.ts sets `data-revealed`;
// - inside an interactive island, React sets it itself once hydrated (and the script leaves islands alone, or
//   React would find an attribute it didn't render and complain about a mismatch).
// The text is always in the HTML for search engines, and without JavaScript (or with reduced motion)
// everything simply shows.
// References: the app's src/components/common/Reveal.tsx (same props).
export default function Reveal({ as = 'div', delayMs = 0, style, children, ...rest }: RevealProps) {
  const [ref, hasBeenInView] = useHasBeenInView<HTMLElement>({ bottomOffset: '8%' });
  return createElement(as, {
    ...rest,
    ref,
    'data-reveal': '',
    'data-revealed': hasBeenInView ? '' : undefined,
    style: { ...style, '--reveal-delay': `${delayMs}ms` },
  }, children);
}
