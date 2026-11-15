import type { Rotator } from '@/lib/rotator';

/** Wires a PauseButton to a rotator: toggles the "user" pause and its label. */
export function bindPauseButton(button: HTMLButtonElement | null, rotator: Rotator): void {
  if (!button) return;
  const sync = () => {
    const paused = rotator.isPausedBy('user');
    button.dataset.state = paused ? 'paused' : 'playing';
    button.setAttribute(
      'aria-label',
      (paused ? button.dataset.playLabel : button.dataset.pauseLabel) ?? '',
    );
  };
  button.addEventListener('click', () => {
    if (rotator.isPausedBy('user')) rotator.resume('user');
    else rotator.pause('user');
    sync();
  });
  sync();
}

/** Pauses while the pointer is over `root` or focus is inside it. */
export function pauseOnHoverAndFocus(root: HTMLElement, rotator: Rotator): void {
  root.addEventListener('mouseenter', () => rotator.pause('hover'));
  root.addEventListener('mouseleave', () => rotator.resume('hover'));
  root.addEventListener('focusin', () => rotator.pause('focus'));
  root.addEventListener('focusout', (event) => {
    if (!(event.relatedTarget instanceof Node && root.contains(event.relatedTarget))) {
      rotator.resume('focus');
    }
  });
}

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)');
