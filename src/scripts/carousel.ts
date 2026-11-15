/**
 * Testimonial carousel: arrows, dots, auto-advance every 7 s, pause on hover,
 * focus or the pause button, no auto-advance with prefers-reduced-motion.
 * The slides are a live region only while nothing rotates on its own, so a
 * screen reader announces the change the user asked for and nothing else.
 * Without this script every testimonial stays visible.
 */
import { Rotator } from '@/lib/rotator';
import { bindPauseButton, pauseOnHoverAndFocus, reducedMotion } from '@/scripts/pause-button';

for (const root of document.querySelectorAll<HTMLElement>('[data-carousel]')) {
  const container = root.querySelector<HTMLElement>('[data-carousel-slides]');
  const slides = [...root.querySelectorAll<HTMLElement>('[data-carousel-slide]')];
  const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]')];
  if (!container || slides.length < 2) continue;

  const motion = reducedMotion();

  const rotator: Rotator = new Rotator({
    count: slides.length,
    interval: 7000,
    autoplay: !motion.matches,
    onChange: (index) => {
      slides.forEach((slide, i) => slide.toggleAttribute('data-active', i === index));
      dots.forEach((dot, i) => {
        if (i === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    },
    onPausedChange: () => updateLive(),
  });

  function updateLive() {
    container?.setAttribute('aria-live', rotator.running ? 'off' : 'polite');
  }

  root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => rotator.prev());
  root.querySelector('[data-carousel-next]')?.addEventListener('click', () => rotator.next());
  dots.forEach((dot, i) => dot.addEventListener('click', () => rotator.go(i)));

  pauseOnHoverAndFocus(root, rotator);
  bindPauseButton(root.querySelector('[data-pause-button]'), rotator);
  motion.addEventListener('change', () => {
    rotator.setAutoplay(!motion.matches);
    updateLive();
  });
  updateLive();
}
