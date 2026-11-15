import { describe, expect, it } from 'vitest';
import { assertProductionEnv, web3formsKey } from './env-guard';

const key = 'a9274458-9c1d-473d-a6b2-623f0fc4d1a6';

describe('web3formsKey', () => {
  it('returns the trimmed key', () => {
    expect(web3formsKey(` ${key} `)).toBe(key);
  });

  it('returns null when no key is set', () => {
    expect(web3formsKey(undefined)).toBeNull();
    expect(web3formsKey('  ')).toBeNull();
  });

  it('throws on a malformed key', () => {
    expect(() => web3formsKey('not-a-key')).toThrow(/PUBLIC_WEB3FORMS_KEY/);
  });
});

describe('assertProductionEnv', () => {
  it('fails production naming the empty variables', () => {
    expect(() =>
      assertProductionEnv('production', { PUBLIC_WEB3FORMS_KEY: '', OTHER: 'x' }),
    ).toThrow(/PUBLIC_WEB3FORMS_KEY/);
    expect(() => assertProductionEnv('production', { PUBLIC_WEB3FORMS_KEY: undefined })).toThrow(
      /PUBLIC_WEB3FORMS_KEY/,
    );
  });

  it('passes production when every variable is set', () => {
    expect(() => assertProductionEnv('production', { PUBLIC_WEB3FORMS_KEY: key })).not.toThrow();
  });

  it('allows empty variables outside production', () => {
    expect(() => assertProductionEnv('development', { PUBLIC_WEB3FORMS_KEY: '' })).not.toThrow();
  });
});
