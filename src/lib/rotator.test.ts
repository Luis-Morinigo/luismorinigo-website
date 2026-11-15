import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Rotator, type RotatorOptions } from './rotator';

const make = (overrides: Partial<RotatorOptions> = {}) => {
  const changes: [number, string][] = [];
  const rotator = new Rotator({
    count: 3,
    interval: 6000,
    autoplay: true,
    onChange: (i, reason) => changes.push([i, reason]),
    ...overrides,
  });
  return { rotator, changes };
};

describe('Rotator', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('advances on its own every interval and wraps around', () => {
    const { rotator, changes } = make();
    vi.advanceTimersByTime(6000 * 3);
    expect(changes).toEqual([
      [1, 'auto'],
      [2, 'auto'],
      [0, 'auto'],
    ]);
    expect(rotator.index).toBe(0);
  });

  it('does not advance without autoplay (reduced motion)', () => {
    const { rotator, changes } = make({ autoplay: false });
    vi.advanceTimersByTime(60_000);
    expect(changes).toEqual([]);
    rotator.next();
    expect(changes).toEqual([[1, 'user']]);
    vi.advanceTimersByTime(60_000);
    expect(changes).toHaveLength(1);
  });

  it('keeps the remaining time across a pause', () => {
    const { rotator, changes } = make();
    vi.advanceTimersByTime(4000);
    rotator.pause('hover');
    vi.advanceTimersByTime(60_000);
    expect(changes).toEqual([]);
    rotator.resume('hover');
    vi.advanceTimersByTime(1999);
    expect(changes).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(changes).toEqual([[1, 'auto']]);
  });

  it('stays paused while any reason remains', () => {
    const paused: boolean[] = [];
    const { rotator, changes } = make({ onPausedChange: (p) => paused.push(p) });
    rotator.pause('hover');
    rotator.pause('user');
    rotator.resume('hover');
    vi.advanceTimersByTime(60_000);
    expect(changes).toEqual([]);
    expect(rotator.isPausedBy('user')).toBe(true);
    rotator.resume('user');
    expect(paused).toEqual([true, false]);
    vi.advanceTimersByTime(6000);
    expect(changes).toEqual([[1, 'auto']]);
  });

  it('restarts the interval when the user picks an item', () => {
    const { rotator, changes } = make();
    vi.advanceTimersByTime(5000);
    rotator.go(2);
    vi.advanceTimersByTime(5999);
    expect(changes).toEqual([[2, 'user']]);
    vi.advanceTimersByTime(1);
    expect(changes).toEqual([
      [2, 'user'],
      [0, 'auto'],
    ]);
  });

  it('wraps backwards with prev', () => {
    const { rotator } = make({ autoplay: false });
    rotator.prev();
    expect(rotator.index).toBe(2);
  });

  it('starts and stops auto-advance when autoplay changes', () => {
    const { rotator, changes } = make({ autoplay: false });
    rotator.setAutoplay(true);
    vi.advanceTimersByTime(6000);
    expect(changes).toEqual([[1, 'auto']]);
    rotator.setAutoplay(false);
    expect(rotator.running).toBe(false);
  });
});
