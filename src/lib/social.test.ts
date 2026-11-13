import { describe, expect, it } from 'vitest';
import { socialLinks } from './social';

describe('socialLinks', () => {
  it('keeps configured networks in a fixed order', () => {
    expect(
      socialLinks({
        instagram: 'https://instagram.com/luis',
        linkedin: 'https://www.linkedin.com/in/luis',
      }),
    ).toEqual([
      { network: 'linkedin', href: 'https://www.linkedin.com/in/luis' },
      { network: 'instagram', href: 'https://instagram.com/luis' },
    ]);
  });

  it('drops empty or missing URLs', () => {
    expect(socialLinks({ github: '', x: '   ', linkedin: undefined })).toEqual([]);
  });

  it('rejects values that are not https URLs', () => {
    expect(() => socialLinks({ x: 'x.com/luis' })).toThrow(/https URL/);
    expect(() => socialLinks({ x: 'http://x.com/luis' })).toThrow(/https URL/);
  });
});
