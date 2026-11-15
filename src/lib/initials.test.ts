import { describe, expect, it } from 'vitest';
import { initials } from './initials';

describe('initials', () => {
  it('takes the first letter of the first and last names', () => {
    expect(initials('Ana García')).toBe('AG');
    expect(initials('Laura  Beatriz Martinez')).toBe('LM');
  });

  it('handles a single name, accents and lowercase', () => {
    expect(initials('madonna')).toBe('M');
    expect(initials('álvaro ñúñez')).toBe('ÁÑ');
  });

  it('returns an empty string for an empty name', () => {
    expect(initials('  ')).toBe('');
  });
});
