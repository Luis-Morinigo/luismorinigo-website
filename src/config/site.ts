import {
  PUBLIC_GITHUB_URL,
  PUBLIC_INSTAGRAM_URL,
  PUBLIC_LINKEDIN_URL,
  PUBLIC_WHATSAPP_NUMBER,
  PUBLIC_X_URL,
} from 'astro:env/client';
import { t, type Locale } from '@/i18n';
import { socialLinks } from '@/lib/social';
import { whatsappUrl } from '@/lib/whatsapp';

export const siteName = 'Luis Morinigo';
export const contactEmail = 'hola@luismorinigo.com';

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
