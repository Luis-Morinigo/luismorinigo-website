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
      // "production" only for the build of main: it fails on draft content (principle 2).
      PUBLIC_ENV: envField.enum({
        context: 'client',
        access: 'public',
        values: ['development', 'production'],
        default: 'development',
      }),
      PUBLIC_WHATSAPP_NUMBER: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      // Web3Forms access key: public by design (it only allows sending to the
      // address registered with it). Empty hides the contact form.
      PUBLIC_WEB3FORMS_KEY: envField.string({
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
