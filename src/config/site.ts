import {
  PUBLIC_ENV,
  PUBLIC_GITHUB_URL,
  PUBLIC_INSTAGRAM_URL,
  PUBLIC_LINKEDIN_URL,
  PUBLIC_WEB3FORMS_KEY,
  PUBLIC_WHATSAPP_NUMBER,
  PUBLIC_X_URL,
} from 'astro:env/client';
import { t, type Locale } from '@/i18n';
import { assertProductionEnv, web3formsKey } from '@/lib/env-guard';
import { socialLinks } from '@/lib/social';
import { whatsappUrl } from '@/lib/whatsapp';

export const siteName = 'Luis Morinigo';
export const contactEmail = 'consultas@luismorinigo.com';

/** WhatsApp link with the greeting in the page language, or null if no number is set. */
export function whatsappLink(locale: Locale): string | null {
  return whatsappUrl(PUBLIC_WHATSAPP_NUMBER, t(locale, 'whatsapp.message'));
}

export const social = socialLinks({
  linkedin: PUBLIC_LINKEDIN_URL,
  github: PUBLIC_GITHUB_URL,
  x: PUBLIC_X_URL,
  instagram: PUBLIC_INSTAGRAM_URL,
});

/** Variables the published site cannot do without: the build of main fails if one is empty. */
assertProductionEnv(PUBLIC_ENV, { PUBLIC_WEB3FORMS_KEY });

/** Access key of the contact form, or null to hide the form. */
export const contactFormKey = web3formsKey(PUBLIC_WEB3FORMS_KEY);
