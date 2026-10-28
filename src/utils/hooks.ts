import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import _ from 'lodash';

// The browser hooks the landing components use (they started as the app's, vib3-frontend src/utils/hooks.ts).
// All of them only touch the browser inside effects, so they're safe to render ahead of time at build.

// Provide the means to use setInterval-like logic in a hook-like manner.
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(undefined);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// Whether a CSS media query currently matches, kept live. E.g. `useMediaQuery('(min-width: 1024px)')`.
function useMediaQuery(query: string) {
  const subscribe = useCallback((onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

// The element's current content-box size, kept live; 0x0 until it's measured. Pass the returned
// callback as the element's `ref`.
function useElementSize<T extends HTMLElement>() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [element, setElement] = useState<T | null>(null);
  useEffect(() => {
    if (!element) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return [setElement, size] as const;
}

// How far an element has scrolled through the screen, from 0 to 1, kept live while scrolling (once per
// frame at most): 0 when the element's top reaches the bottom of the screen, 1 when it reaches the top.
// Pass the returned callback as the element's `ref`.
function useScrollProgress<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!element) {
      return;
    }
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      setProgress(_.clamp((viewportHeight - rect.top) / viewportHeight, 0, 1));
    };
    const scheduleMeasure = () => {
      if (!frame) {
        frame = requestAnimationFrame(measure);
      }
    };
    measure();
    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [element]);
  return [setElement, progress] as const;
}

// Flips to true the first time the element scrolls into view, and stays true (it stops watching after that).
// Pass the returned callback as the element's `ref`. `bottomOffset` makes it wait until the element is
// that far above the bottom edge of the screen (e.g. '10%'), so it isn't triggered by a barely-visible sliver.
function useHasBeenInView<T extends HTMLElement>(options: { bottomOffset?: string } = {}) {
  const { bottomOffset = '0px' } = options;
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const [element, setElement] = useState<T | null>(null);
  useEffect(() => {
    if (!element || hasBeenInView) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setHasBeenInView(true);
      }
    }, { rootMargin: `0px 0px -${bottomOffset} 0px` });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, hasBeenInView, bottomOffset]);
  return [setElement, hasBeenInView] as const;
}

// Whether any of the element is on screen right now, kept live (false until it's measured). Pass the returned
// callback as the element's `ref`. For things that should only run while they can be seen, like animations.
function useIsInView<T extends HTMLElement>() {
  const [isInView, setIsInView] = useState(false);
  const [element, setElement] = useState<T | null>(null);
  useEffect(() => {
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setIsInView(Boolean(entry?.isIntersecting)));
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return [setElement, isInView] as const;
}

type TypewriterState ={ phraseIndex: number; typedLength: number; mode: 'typing' | 'pausing' | 'deleting' };

const TYPEWRITER_TIMING = { typeMs: 55, deleteMs: 28, pauseMs: 1800, beforeNextMs: 300 };

// [Pure] How many leading characters two phrases share (as arrays of characters).
function _countSharedPrefix(phraseA: string[], phraseB: string[]) {
  const firstMismatch = phraseA.findIndex((char, index) => char !== phraseB[index]);
  return firstMismatch === -1 ? Math.min(phraseA.length, phraseB.length) : firstMismatch;
}

// [Pure] One tick of the typewriter: the state after the current one, and how long to wait before
// showing it. Deleting only goes back to what the next phrase shares with this one (so "Build a shop…"
// to "Build a menu…" keeps "Build a "), which also means a single text slice covers both phrases.
function _stepTypewriter(state: TypewriterState, phrases: string[][]): { next: TypewriterState; delayMs: number } {
  const phrase = phrases[state.phraseIndex];
  const nextPhraseIndex = (state.phraseIndex + 1) % phrases.length;
  if (state.mode === 'typing') {
    return state.typedLength < phrase.length
      ? { next: { ...state, typedLength: state.typedLength + 1 }, delayMs: TYPEWRITER_TIMING.typeMs }
      : { next: { ...state, mode: 'pausing' }, delayMs: TYPEWRITER_TIMING.pauseMs };
  }
  if (state.mode === 'pausing') {
    return { next: { ...state, mode: 'deleting' }, delayMs: TYPEWRITER_TIMING.deleteMs };
  }
  const sharedLength = _countSharedPrefix(phrase, phrases[nextPhraseIndex]);
  return state.typedLength > sharedLength
    ? { next: { ...state, typedLength: state.typedLength - 1 }, delayMs: TYPEWRITER_TIMING.deleteMs }
    : { next: { phraseIndex: nextPhraseIndex, typedLength: sharedLength, mode: 'typing' }, delayMs: TYPEWRITER_TIMING.beforeNextMs };
}

// Types the phrases out one after another, like someone typing into a box: type, pause, backspace,
// next one, forever. Returns the text to show right now, and whether it's paused on a finished phrase
// (handy for blinking the cursor only while idle). With reduced motion on, it just shows the first phrase.
function useTypewriter(phrases: string[]) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  // Characters, not UTF-16 units, so nothing gets cut in half mid-letter.
  const phraseChars = phrases.map(phrase => Array.from(phrase));
  const phrasesKey = phrases.join('\n');
  const [state, setState] = useState<TypewriterState>({ phraseIndex: 0, typedLength: 0, mode: 'typing' });

  // Start over when the phrases change (e.g. the language was switched).
  useEffect(() => {
    setState({ phraseIndex: 0, typedLength: 0, mode: 'typing' });
  }, [phrasesKey]);

  useEffect(() => {
    if (prefersReducedMotion || _.isEmpty(phraseChars)) {
      return;
    }
    const { next, delayMs } = _stepTypewriter(state, phraseChars);
    const timer = setTimeout(() => setState(next), delayMs);
    return () => clearTimeout(timer);
    // phraseChars is rebuilt every render; phrasesKey stands in for it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, phrasesKey, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return { text: phrases[0] ?? '', isIdle: true, phraseIndex: 0 };
  }
  const currentChars = phraseChars[state.phraseIndex] ?? [];
  return { text: currentChars.slice(0, state.typedLength).join(''), isIdle: state.mode === 'pausing', phraseIndex: state.phraseIndex };
}

export {
  useInterval,
  useMediaQuery,
  useElementSize,
  useScrollProgress,
  useHasBeenInView,
  useIsInView,
  useTypewriter,
};
