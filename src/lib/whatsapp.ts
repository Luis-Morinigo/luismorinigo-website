/**
 * Builds a wa.me link. Returns null when no number is configured, so callers
 * hide the control instead of rendering a link that goes nowhere.
 * A malformed number throws to fail the build.
 */
export function whatsappUrl(number: string | undefined, message: string): string | null {
  const digits = number?.trim() ?? '';
  if (digits === '') return null;
  if (!/^\d{8,15}$/.test(digits)) {
    throw new Error(
      `PUBLIC_WHATSAPP_NUMBER must be 8 to 15 digits in international format, got "${digits}"`,
    );
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
