import { describe, expect, it } from 'vitest';
import { whatsappUrl } from './whatsapp';

describe('whatsappUrl', () => {
  it('builds a wa.me link with the encoded message', () => {
    expect(whatsappUrl('541164521396', 'Hola Luis, ¿cómo va?')).toBe(
      'https://wa.me/541164521396?text=Hola%20Luis%2C%20%C2%BFc%C3%B3mo%20va%3F',
    );
  });

  it('returns null when the number is missing or empty', () => {
    expect(whatsappUrl(undefined, 'x')).toBeNull();
    expect(whatsappUrl('  ', 'x')).toBeNull();
  });

  it('rejects numbers that are not plain international digits', () => {
    expect(() => whatsappUrl('+54 11 6452-1396', 'x')).toThrow(/PUBLIC_WHATSAPP_NUMBER/);
    expect(() => whatsappUrl('123', 'x')).toThrow(/PUBLIC_WHATSAPP_NUMBER/);
  });
});
