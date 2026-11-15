import { describe, expect, it } from 'vitest';
import { toPayload, validateContact } from './contact-form';

const valid = { name: 'Ana', email: 'ana@empresa.com', mensaje: 'Hola' };

describe('validateContact', () => {
  it('accepts a complete form', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('marks every empty required field', () => {
    expect(validateContact({ name: ' ', email: '', mensaje: '' })).toEqual({
      name: 'required',
      email: 'required',
      mensaje: 'required',
    });
  });

  it('rejects a malformed email', () => {
    expect(validateContact({ ...valid, email: 'ana@empresa' })).toEqual({ email: 'email' });
    expect(validateContact({ ...valid, email: 'ana empresa.com' })).toEqual({ email: 'email' });
  });
});

describe('toPayload', () => {
  it('joins repeated fields and drops the redirect', () => {
    expect(
      toPayload([
        ['name', 'Ana'],
        ['servicios', 'Finanzas'],
        ['servicios', 'Capacitación'],
        ['redirect', 'https://luismorinigo.com/gracias/'],
      ]),
    ).toEqual({ name: 'Ana', servicios: 'Finanzas, Capacitación' });
  });
});
