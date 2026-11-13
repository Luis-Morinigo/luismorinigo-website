// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://luismorinigo.com',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  env: {
    schema: {
      PUBLIC_WHATSAPP_NUMBER: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_LINKEDIN_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GITHUB_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_X_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_INSTAGRAM_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
