/**
 * Build-time rules for content collections (harness: principles 2 and 5).
 * Pure functions so they can be tested without Astro; `src/lib/content.ts`
 * feeds them the real collections on every build.
 */

export interface GuardEntry {
  collection: string;
  id: string;
  data: { draft: boolean };
}

export type SiteEnv = 'development' | 'production';

/** Splits "ana-garcia.es" into its slug and locale; null when the id has no locale suffix. */
export function splitLocalizedId(
  id: string,
  locales: readonly string[],
): { slug: string; locale: string } | null {
  const dot = id.lastIndexOf('.');
  if (dot <= 0) return null;
  const locale = id.slice(dot + 1);
  return locales.includes(locale) ? { slug: id.slice(0, dot), locale } : null;
}

/** "collection/id" of every entry still marked as draft. */
export function findDrafts(entries: readonly GuardEntry[]): string[] {
  return entries.filter((e) => e.data.draft).map((e) => `${e.collection}/${e.id}`);
}

/**
 * Problems with the language pairs of the localized collections: an entry
 * without a locale suffix, or a slug that exists in one locale but not in another.
 */
export function findMissingTranslations(
  entries: readonly GuardEntry[],
  localizedCollections: readonly string[],
  locales: readonly string[],
): string[] {
  const problems: string[] = [];
  const found = new Map<string, Set<string>>();

  for (const entry of entries) {
    if (!localizedCollections.includes(entry.collection)) continue;
    const parts = splitLocalizedId(entry.id, locales);
    if (!parts) {
      problems.push(
        `${entry.collection}/${entry.id}: file name must end in .${locales.join(' or .')}`,
      );
      continue;
    }
    const key = `${entry.collection}/${parts.slug}`;
    if (!found.has(key)) found.set(key, new Set());
    found.get(key)?.add(parts.locale);
  }

  for (const [key, present] of found) {
    const missing = locales.filter((l) => !present.has(l));
    if (missing.length > 0) problems.push(`${key}: missing ${missing.join(', ')}`);
  }
  return problems;
}

/**
 * Throws with every problem listed, so the build fails and names the entries:
 * missing translations in any environment, drafts only in production.
 */
export function assertContent(
  entries: readonly GuardEntry[],
  options: { env: SiteEnv; localizedCollections: readonly string[]; locales: readonly string[] },
): void {
  const messages: string[] = [];

  const missing = findMissingTranslations(entries, options.localizedCollections, options.locales);
  if (missing.length > 0) {
    messages.push(`Content missing in a language (principle 5):\n  - ${missing.join('\n  - ')}`);
  }

  if (options.env === 'production') {
    const drafts = findDrafts(entries);
    if (drafts.length > 0) {
      messages.push(
        `Draft content cannot be published with PUBLIC_ENV=production (principle 2):\n  - ${drafts.join('\n  - ')}`,
      );
    }
  }

  if (messages.length > 0) throw new Error(messages.join('\n\n'));
}
