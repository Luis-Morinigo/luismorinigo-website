export const articleCategories = ['finanzas', 'procesos', 'desarrollo'] as const;
export type ArticleCategory = (typeof articleCategories)[number];

const WORDS_PER_MINUTE = 200;

/** Minutes to read a Markdown body (at least 1), ignoring Markdown symbols. */
export function readingMinutes(markdown: string): number {
  const words = markdown
    .replace(/[#*_`>[\]()-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

interface Sortable {
  data: { title: string; date?: Date };
}

/** Newest first; articles without a date go after the dated ones, by title. */
export function sortArticles<T extends Sortable>(articles: readonly T[]): T[] {
  return [...articles].sort((a, b) => {
    const da = a.data.date?.getTime();
    const db = b.data.date?.getTime();
    if (da !== undefined && db !== undefined && da !== db) return db - da;
    if (da !== undefined && db === undefined) return -1;
    if (da === undefined && db !== undefined) return 1;
    return a.data.title.localeCompare(b.data.title);
  });
}

/** "articles/<id>: <file>" for every declared download that does not exist. */
export function findMissingDownloads(
  articles: readonly { id: string; data: { download?: string } }[],
  exists: (file: string) => boolean,
): string[] {
  return articles
    .filter((a) => a.data.download !== undefined && !exists(a.data.download))
    .map((a) => `articles/${a.id}: public/descargas/${a.data.download}`);
}
