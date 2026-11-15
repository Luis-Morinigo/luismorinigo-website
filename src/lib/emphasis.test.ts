import { describe, expect, it } from 'vitest';
import { parseEmphasis } from './emphasis';

describe('parseEmphasis', () => {
  it('returns plain text as a single segment', () => {
    expect(parseEmphasis('Hola')).toEqual([{ text: 'Hola', strong: false }]);
  });

  it('marks the phrases between double asterisks', () => {
    expect(parseEmphasis('como **Bimbo y SC Johnson**, aplicando')).toEqual([
      { text: 'como ', strong: false },
      { text: 'Bimbo y SC Johnson', strong: true },
      { text: ', aplicando', strong: false },
    ]);
  });

  it('handles several phrases and phrases at the edges', () => {
    expect(parseEmphasis('**a** y **b**')).toEqual([
      { text: 'a', strong: true },
      { text: ' y ', strong: false },
      { text: 'b', strong: true },
    ]);
  });

  it('leaves an unpaired marker as text', () => {
    expect(parseEmphasis('30 ** 2')).toEqual([{ text: '30 ** 2', strong: false }]);
  });
});
