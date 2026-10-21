// Intentions: the other half of components/common/Reveal, for the plain-HTML parts of the page. Marks each
// `[data-reveal]` element as revealed the first time it's well into the screen (8% above the bottom edge),
// which starts its fade-in (global.css). Each element is watched once and then let go. Elements inside an
// island (<astro-island>) are skipped: React reveals those itself. Without IntersectionObserver, everything
// shows at once.
function revealOnScroll() {
  const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])')]
    .filter(element => !element.closest('astro-island'));
  if (!('IntersectionObserver' in window)) {
    elements.forEach(element => element.setAttribute('data-revealed', ''));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      entry.target.setAttribute('data-revealed', '');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  elements.forEach(element => observer.observe(element));
}

revealOnScroll();
