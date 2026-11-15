/**
 * Contact form with JavaScript: validates each field in the page language,
 * sends with fetch and shows success or error without leaving the page.
 * Without this script the form posts natively and Web3Forms redirects to the
 * thank-you page.
 */
import { requiredFields, toPayload, validateContact, type RequiredField } from '@/lib/contact-form';

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
const submit = form?.querySelector<HTMLButtonElement>('[data-submit]');
const status = form?.querySelector<HTMLElement>('[data-status]');

if (form && submit && status) {
  form.noValidate = true;
  const msg = form.dataset;
  const submitLabel = submit.textContent ?? '';

  const control = (field: RequiredField) =>
    form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement;
  const errorFor = (field: RequiredField) =>
    form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);

  const setError = (field: RequiredField, text: string | null) => {
    const input = control(field);
    const error = errorFor(field);
    if (text) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    if (error) {
      error.textContent = text ?? '';
      error.classList.toggle('hidden', !text);
    }
  };

  const showStatus = (text: string) => {
    status.textContent = text;
    status.classList.remove('hidden');
  };

  for (const field of requiredFields) {
    control(field).addEventListener('input', () => {
      if (control(field).hasAttribute('aria-invalid')) setError(field, null);
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.classList.add('hidden');

    const values = Object.fromEntries(requiredFields.map((f) => [f, control(f).value]));
    const errors = validateContact(values);
    for (const field of requiredFields) {
      const error = errors[field];
      setError(field, error ? ((error === 'email' ? msg.msgEmail : msg.msgRequired) ?? '') : null);
    }
    const firstInvalid = requiredFields.find((f) => errors[f]);
    if (firstInvalid) {
      control(firstInvalid).focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = msg.msgSending ?? submitLabel;
    try {
      const entries = [...new FormData(form)].map(([k, v]) => [k, String(v)] as [string, string]);
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(toPayload(entries)),
      });
      const result = (await response.json().catch(() => ({}))) as { success?: boolean };
      if (!response.ok || !result.success) throw new Error('Web3Forms rejected the message');
      form.reset();
      showStatus(msg.msgSuccess ?? '');
    } catch {
      showStatus(msg.msgError ?? '');
    } finally {
      submit.disabled = false;
      submit.textContent = submitLabel;
    }
  });
}
