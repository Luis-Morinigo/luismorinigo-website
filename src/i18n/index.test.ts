import { describe, expect, it } from 'vitest';
import en from './en.json';
import es from './es.json';
import { basePath, localizedPath, t, toLocale } from './index';

describe('i18n messages', () => {
  it('has the same keys in every locale', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort());
  });

  it('has no empty translations', () => {
    for (const dict of [es, en]) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), key).not.toBe('');
      }
    }
  });

  it('returns the text for the requested locale', () => {
    expect(t('es', 'meta.ogAlt')).toBe(es['meta.ogAlt']);
    expect(t('en', 'meta.ogAlt')).toBe(en['meta.ogAlt']);
  });

  it('throws on a missing key instead of falling back', () => {
    expect(() => t('en', 'does.not.exist' as never)).toThrow(/Missing i18n key/);
  });
});

describe('i18n paths', () => {
  it('resolves unknown locales to Spanish', () => {
    expect(toLocale(undefined)).toBe('es');
    expect(toLocale('fr')).toBe('es');
    expect(toLocale('en')).toBe('en');
  });

  it('strips the English prefix', () => {
    expect(basePath('/en/')).toBe('/');
    expect(basePath('/en')).toBe('/');
    expect(basePath('/en/recursos/')).toBe('/recursos/');
    expect(basePath('/enfoque/')).toBe('/enfoque/');
    expect(basePath('/')).toBe('/');
  });

  it('builds the equivalent path in each locale', () => {
    expect(localizedPath('en', '/')).toBe('/en/');
    expect(localizedPath('es', '/en/')).toBe('/');
    expect(localizedPath('en', '/en/recursos/')).toBe('/en/recursos/');
    expect(localizedPath('es', '/recursos/')).toBe('/recursos/');
  });
});
