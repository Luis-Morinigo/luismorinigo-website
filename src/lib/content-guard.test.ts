import { describe, expect, it } from 'vitest';
import {
  assertContent,
  findDrafts,
  findMissingTranslations,
  splitLocalizedId,
  type GuardEntry,
} from './content-guard';

const locales = ['es', 'en'] as const;
const localizedCollections = ['home', 'testimonials'];

const entry = (collection: string, id: string, draft = false): GuardEntry => ({
  collection,
  id,
  data: { draft },
});

describe('splitLocalizedId', () => {
  it('splits the slug and the locale', () => {
    expect(splitLocalizedId('ana-garcia.es', locales)).toEqual({
      slug: 'ana-garcia',
      locale: 'es',
    });
    expect(splitLocalizedId('home.en', locales)).toEqual({ slug: 'home', locale: 'en' });
  });

  it('returns null without a supported locale suffix', () => {
    expect(splitLocalizedId('ana-garcia', locales)).toBeNull();
    expect(splitLocalizedId('ana-garcia.fr', locales)).toBeNull();
    expect(splitLocalizedId('.es', locales)).toBeNull();
  });
});

describe('drafts', () => {
  it('lists every draft entry by collection and id', () => {
    const entries = [
      entry('home', 'home.es', true),
      entry('home', 'home.en', false),
      entry('clients', 'acme', true),
    ];
    expect(findDrafts(entries)).toEqual(['home/home.es', 'clients/acme']);
  });

  it('fails the production build naming the drafts', () => {
    const entries = [entry('home', 'home.es', true), entry('home', 'home.en', true)];
    expect(() =>
      assertContent(entries, { env: 'production', localizedCollections, locales }),
    ).toThrow(/PUBLIC_ENV=production[\s\S]*home\/home\.es[\s\S]*home\/home\.en/);
  });

  it('allows drafts outside production', () => {
    const entries = [entry('home', 'home.es', true), entry('home', 'home.en', true)];
    expect(() =>
      assertContent(entries, { env: 'development', localizedCollections, locales }),
    ).not.toThrow();
  });

  it('passes production when nothing is a draft', () => {
    const entries = [entry('home', 'home.es'), entry('home', 'home.en')];
    expect(() =>
      assertContent(entries, { env: 'production', localizedCollections, locales }),
    ).not.toThrow();
  });
});

describe('language parity', () => {
  it('reports an entry that exists in only one language', () => {
    const entries = [
      entry('testimonials', 'ana.es'),
      entry('testimonials', 'ana.en'),
      entry('testimonials', 'carlos.es'),
    ];
    expect(findMissingTranslations(entries, localizedCollections, locales)).toEqual([
      'testimonials/carlos: missing en',
    ]);
  });

  it('reports an entry without a locale suffix', () => {
    const entries = [entry('home', 'home')];
    expect(findMissingTranslations(entries, localizedCollections, locales)).toEqual([
      'home/home: file name must end in .es or .en',
    ]);
  });

  it('ignores collections that are not translated', () => {
    const entries = [entry('clients', 'acme')];
    expect(findMissingTranslations(entries, localizedCollections, locales)).toEqual([]);
  });

  it('fails any build, not only production', () => {
    const entries = [entry('home', 'home.es')];
    expect(() =>
      assertContent(entries, { env: 'development', localizedCollections, locales }),
    ).toThrow(/home\/home: missing en/);
  });
});
