import { PUBLIC_WHATSAPP_NUMBER } from 'astro:env/client';
import { t, type Locale } from '@/i18n';
import { whatsappUrl } from '@/lib/whatsapp';

export const contactEmail = 'hola@luismorinigo.com';

/** WhatsApp link with the greeting in the page language, or null if no number is set. */
export function whatsappLink(locale: Locale): string | null {
  return whatsappUrl(PUBLIC_WHATSAPP_NUMBER, t(locale, 'whatsapp.message'));
}
