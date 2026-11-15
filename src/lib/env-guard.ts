import type { SiteEnv } from '@/lib/content-guard';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Web3Forms access key, or null when none is set (the form is then hidden).
 * A malformed key throws to fail the build instead of rendering a form that cannot send.
 */
export function web3formsKey(value: string | undefined): string | null {
  const key = value?.trim() ?? '';
  if (key === '') return null;
  if (!uuid.test(key)) {
    throw new Error(`PUBLIC_WEB3FORMS_KEY must be a Web3Forms access key (UUID), got "${key}"`);
  }
  return key;
}

/** Fails the production build when a variable the published site needs is empty. */
export function assertProductionEnv(
  env: SiteEnv,
  required: Record<string, string | undefined>,
): void {
  if (env !== 'production') return;
  const missing = Object.entries(required)
    .filter(([, value]) => (value?.trim() ?? '') === '')
    .map(([name]) => name);
  if (missing.length > 0) {
    throw new Error(
      `Required for PUBLIC_ENV=production but empty: ${missing.join(', ')} (principle 3)`,
    );
  }
}
