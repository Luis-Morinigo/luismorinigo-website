import { describe, expect, it } from 'vitest';
import { findMissingDownloads, readingMinutes, sortArticles } from './articles';

describe('readingMinutes', () => {
  it('rounds up at 200 words per minute', () => {
    expect(readingMinutes(Array(200).fill('palabra').join(' '))).toBe(1);
    expect(readingMinutes(Array(201).fill('palabra').join(' '))).toBe(2);
  });

  it('never returns less than one minute and ignores Markdown symbols', () => {
    expect(readingMinutes('## Hola\n\n- **uno**')).toBe(1);
    expect(readingMinutes('')).toBe(1);
  });
});

describe('sortArticles', () => {
  const a = (title: string, date?: string) => ({
    data: { title, date: date ? new Date(date) : undefined },
  });

  it('puts the newest first, then undated articles by title', () => {
    const sorted = sortArticles([
      a('Zeta'),
      a('Vieja', '2026-01-01'),
      a('Alfa'),
      a('Nueva', '2026-06-01'),
    ]);
    expect(sorted.map((x) => x.data.title)).toEqual(['Nueva', 'Vieja', 'Alfa', 'Zeta']);
  });
});

describe('findMissingDownloads', () => {
  it('lists declared files that do not exist', () => {
    const articles = [
      { id: 'a.es', data: { download: 'ok.xlsx' } },
      { id: 'b.es', data: { download: 'missing.pdf' } },
      { id: 'c.es', data: {} },
    ];
    expect(findMissingDownloads(articles, (f) => f === 'ok.xlsx')).toEqual([
      'articles/b.es: public/descargas/missing.pdf',
    ]);
  });
});
