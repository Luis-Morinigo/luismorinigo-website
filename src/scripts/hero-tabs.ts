/**
 * Hero messages as ARIA tabs: progress bar, auto-advance every 6 s, pause on
 * hover, focus or the pause button, arrow keys, and no auto-advance with
 * prefers-reduced-motion. Without this script all messages stay visible.
 */
import { Rotator } from '@/lib/rotator';
import { bindPauseButton, pauseOnHoverAndFocus, reducedMotion } from '@/scripts/pause-button';

const root = document.querySelector<HTMLElement>('[data-hero]');
const tabs = [...(root?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])];
const panels = [...(root?.querySelectorAll<HTMLElement>('[data-hero-panel]') ?? [])];

if (root && tabs.length > 1 && tabs.length === panels.length) {
  const motion = reducedMotion();

  const select = (index: number) => {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      tab.toggleAttribute('data-done', i < index);
    });
    panels.forEach((panel, i) => panel.toggleAttribute('data-active', i === index));
  };

  const rotator = new Rotator({
    count: tabs.length,
    interval: 6000,
    autoplay: !motion.matches,
    onChange: select,
    onPausedChange: (paused) => root.toggleAttribute('data-paused', paused),
  });

  tabs.forEach((tab, i) => tab.addEventListener('click', () => rotator.go(i)));

  tabs[0].parentElement?.addEventListener('keydown', (event) => {
    const keys: Record<string, number> = {
      ArrowRight: rotator.index + 1,
      ArrowDown: rotator.index + 1,
      ArrowLeft: rotator.index - 1,
      ArrowUp: rotator.index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    rotator.go(keys[event.key]);
    tabs[rotator.index].focus();
  });

  pauseOnHoverAndFocus(root, rotator);
  bindPauseButton(root.querySelector('[data-pause-button]'), rotator);
  motion.addEventListener('change', () => rotator.setAutoplay(!motion.matches));
}
