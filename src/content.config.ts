import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Entry id = file name without extension: "home.es", "ana-garcia.en", "acme". */
const yamlFiles = (base: string) =>
  glob({
    pattern: '**/*.{yaml,yml}',
    base,
    generateId: ({ entry }) => entry.replace(/\.ya?ml$/, ''),
  });

/** Collections with one file per language (`<slug>.es.yaml`, `<slug>.en.yaml`). */
export const localizedCollections = ['home', 'testimonials', 'projects'] as const;

const methodologyIcons = ['recycle', 'zap', 'combine'] as const;
const serviceIcons = ['briefcase', 'code', 'trending-up', 'users'] as const;
/** Home sections the chatbot can link to. */
export const homeSections = [
  'sobre-mi',
  'metodologia',
  'servicios',
  'testimonios',
  'proyectos',
  'contacto',
] as const;

/** Section heading: the highlight is the key phrase rendered with the gradient, after the title. */
const heading = z.object({
  title: z.string().min(1),
  highlight: z.string().min(1),
  lead: z.string().min(1),
});

const home = defineCollection({
  loader: yamlFiles('./src/content/home'),
  schema: ({ image }) =>
    z
      .object({
        draft: z.boolean(),
        /** Page h1 (visually hidden: the visible titles are the hero messages). */
        title: z.string().min(1),
        hero: z.object({
          slides: z
            .array(
              z.object({
                eyebrow: z.string().min(1),
                title: z.string().min(1),
                highlight: z.string().min(1),
                description: z.string().min(1),
              }),
            )
            .min(1),
          secondaryCta: z.string().min(1),
        }),
        about: heading.extend({
          /** `**text**` marks the emphasised phrase. */
          paragraphs: z.array(z.string().min(1)).min(1),
          companies: z.array(z.string().min(1)),
          photo: image().optional(),
          photoAlt: z.string().min(1),
        }),
        methodology: heading.extend({
          items: z
            .array(
              z.object({
                icon: z.enum(methodologyIcons),
                title: z.string().min(1),
                text: z.string().min(1),
                featured: z.boolean().default(false),
              }),
            )
            .min(1),
        }),
        services: heading.extend({
          items: z
            .array(
              z.object({
                icon: z.enum(serviceIcons),
                title: z.string().min(1),
                text: z.string().min(1),
              }),
            )
            .min(1),
        }),
        testimonials: heading,
        projects: heading,
        contact: heading.extend({
          /** Options of the "services of interest" checkboxes. */
          services: z.array(z.string().min(1)).min(1),
        }),
        chatbot: z.object({
          greeting: z.string().min(1),
          replies: z
            .array(
              z.object({
                label: z.string().min(1),
                answer: z.string().min(1),
                section: z.enum(homeSections),
                linkLabel: z.string().min(1),
              }),
            )
            .min(1),
        }),
      })
      // The photo placeholder only exists while the entry is a draft (principle 2).
      .refine((data) => data.draft || data.about.photo !== undefined, {
        message: 'about.photo is required once the entry is published (draft: false)',
        path: ['about', 'photo'],
      }),
});

const testimonials = defineCollection({
  loader: yamlFiles('./src/content/testimonials'),
  schema: z.object({
    draft: z.boolean(),
    order: z.number().int(),
    quote: z.string().min(1),
    name: z.string().min(1),
    role: z.string().min(1),
  }),
});

const projects = defineCollection({
  loader: yamlFiles('./src/content/projects'),
  schema: ({ image }) =>
    z
      .object({
        draft: z.boolean(),
        order: z.number().int(),
        title: z.string().min(1),
        description: z.string().min(1),
        tags: z.array(z.string().min(1)).min(1),
        image: image().optional(),
        imageAlt: z.string().min(1).optional(),
      })
      .refine((data) => data.image === undefined || data.imageAlt !== undefined, {
        message: 'imageAlt is required when image is set',
        path: ['imageAlt'],
      })
      // The screenshot placeholder only exists while the entry is a draft (principle 2).
      .refine((data) => data.draft || data.image !== undefined, {
        message: 'image is required once the entry is published (draft: false)',
        path: ['image'],
      }),
});

/** Company name and logo are not translated: one file per client. */
const clients = defineCollection({
  loader: yamlFiles('./src/content/clients'),
  schema: ({ image }) =>
    z.object({
      draft: z.boolean(),
      order: z.number().int(),
      name: z.string().min(1),
      logo: image(),
    }),
});

export const collections = { home, testimonials, projects, clients };
