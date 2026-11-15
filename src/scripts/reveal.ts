/**
 * Entrance animation: sections marked with [data-reveal] fade and rise the
 * first time they enter the viewport. The hidden state only exists in CSS
 * under `.js` and `prefers-reduced-motion: no-preference`, so without
 * JavaScript or with reduced motion everything is visible from the start.
 */
const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
const reveal = (el: Element) => el.classList.add('is-revealed');

if (!('IntersectionObserver' in window)) {
  targets.forEach(reveal);
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  targets.forEach((el) => observer.observe(el));
}
