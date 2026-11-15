import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { PUBLIC_ENV } from 'astro:env/client';
import { localizedCollections } from '@/content.config';
import { locales, type Locale } from '@/i18n';
import { assertContent } from '@/lib/content-guard';

let checked: Promise<void> | undefined;

/**
 * Fails the build on drafts in production or on content missing in a language.
 * Runs once per build, from the base layout, so no page can skip it.
 */
export function checkContent(): Promise<void> {
  checked ??= (async () => {
    const all = await Promise.all([
      getCollection('home'),
      getCollection('testimonials'),
      getCollection('projects'),
      getCollection('clients'),
    ]);
    assertContent(all.flat(), { env: PUBLIC_ENV, localizedCollections, locales });
  })();
  return checked;
}

export async function getHome(locale: Locale): Promise<CollectionEntry<'home'>> {
  const entry = await getEntry('home', `home.${locale}`);
  if (!entry) throw new Error(`Missing content entry home/home.${locale}`);
  return entry;
}

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) =>
  a.data.order - b.data.order;

export async function getTestimonials(locale: Locale) {
  const entries = await getCollection('testimonials', (e) => e.id.endsWith(`.${locale}`));
  return entries.sort(byOrder);
}

export async function getProjects(locale: Locale) {
  const entries = await getCollection('projects', (e) => e.id.endsWith(`.${locale}`));
  return entries.sort(byOrder);
}

export async function getClients() {
  return (await getCollection('clients')).sort(byOrder);
}
