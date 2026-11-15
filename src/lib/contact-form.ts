export const requiredFields = ['name', 'email', 'mensaje'] as const;
export type RequiredField = (typeof requiredFields)[number];
export type FieldError = 'required' | 'email';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Errors of the contact form, by field. Empty when it can be sent. */
export function validateContact(
  values: Partial<Record<RequiredField, string>>,
): Partial<Record<RequiredField, FieldError>> {
  const errors: Partial<Record<RequiredField, FieldError>> = {};
  for (const field of requiredFields) {
    if ((values[field]?.trim() ?? '') === '') errors[field] = 'required';
  }
  if (!errors.email && !emailPattern.test(values.email?.trim() ?? '')) errors.email = 'email';
  return errors;
}

/**
 * JSON body for Web3Forms from the form entries: repeated names (the services
 * checkboxes) are joined, and the no-JavaScript redirect is left out.
 */
export function toPayload(entries: Iterable<[string, string]>): Record<string, string> {
  const payload: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (key === 'redirect') continue;
    payload[key] = key in payload ? `${payload[key]}, ${value}` : value;
  }
  return payload;
}
