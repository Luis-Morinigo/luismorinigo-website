import en from './en.json';
import es from './es.json';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export type MessageKey = keyof typeof es;

const messages: Record<Locale, Record<string, string>> = { es, en };

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Resolves Astro.currentLocale (or any string) to a supported locale. */
export function toLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/**
 * Returns the interface text for `key`. A missing translation throws, so the
 * build fails instead of silently falling back to the other language.
 */
export function t(locale: Locale, key: MessageKey): string {
  const value = messages[locale][key];
  if (value === undefined) {
    throw new Error(`Missing i18n key "${key}" for locale "${locale}"`);
  }
  return value;
}

/** Strips the locale prefix: "/en/about/" → "/about/", "/" → "/". */
export function basePath(pathname: string): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/** Path of the same page in `locale`: Spanish has no prefix, English lives under /en/. */
export function localizedPath(locale: Locale, pathname: string): string {
  const base = basePath(pathname);
  return locale === defaultLocale ? base : `/${locale}${base}`;
}
