export type ChangeReason = 'auto' | 'user';

export interface RotatorOptions {
  count: number;
  /** Milliseconds each item stays before advancing on its own. */
  interval: number;
  /** False disables auto-advance (e.g. prefers-reduced-motion). */
  autoplay: boolean;
  onChange: (index: number, reason: ChangeReason) => void;
  onPausedChange?: (paused: boolean) => void;
}

/**
 * Index of a rotating set (hero tabs, testimonial carousel) with auto-advance
 * that several sources can pause at once (hover, focus, the pause button).
 * Pausing keeps the remaining time, so resuming continues where it stopped.
 */
export class Rotator {
  index = 0;
  private readonly reasons = new Set<string>();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private remaining: number;
  private startedAt = 0;
  private autoplay: boolean;

  constructor(private readonly options: RotatorOptions) {
    this.remaining = options.interval;
    this.autoplay = options.autoplay;
    this.schedule();
  }

  get paused(): boolean {
    return this.reasons.size > 0;
  }

  get running(): boolean {
    return this.timer !== undefined;
  }

  go(index: number, reason: ChangeReason = 'user'): void {
    const { count } = this.options;
    this.index = ((index % count) + count) % count;
    this.remaining = this.options.interval;
    this.options.onChange(this.index, reason);
    this.schedule();
  }

  next(reason: ChangeReason = 'user'): void {
    this.go(this.index + 1, reason);
  }

  prev(reason: ChangeReason = 'user'): void {
    this.go(this.index - 1, reason);
  }

  pause(reason: string): void {
    const wasPaused = this.paused;
    this.reasons.add(reason);
    if (wasPaused) return;
    if (this.timer !== undefined) {
      this.remaining = Math.max(0, this.remaining - (Date.now() - this.startedAt));
      this.clear();
    }
    this.options.onPausedChange?.(true);
  }

  resume(reason: string): void {
    if (!this.reasons.delete(reason) || this.paused) return;
    this.options.onPausedChange?.(false);
    this.schedule();
  }

  isPausedBy(reason: string): boolean {
    return this.reasons.has(reason);
  }

  setAutoplay(autoplay: boolean): void {
    this.autoplay = autoplay;
    this.remaining = this.options.interval;
    this.schedule();
  }

  private schedule(): void {
    this.clear();
    if (!this.autoplay || this.paused || this.options.count < 2) return;
    this.startedAt = Date.now();
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.next('auto');
    }, this.remaining);
  }

  private clear(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
  }
}
