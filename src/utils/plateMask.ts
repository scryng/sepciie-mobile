const oldMask = [/[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/, '-', /\d/, /\d/, /\d/, /\d/];

const mercosulMask = [/[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/, /\d/, /[A-Za-z]/, /\d/, /\d/];

const undecidedMask = [/[A-Za-z]/, /[A-Za-z]/, /[A-Za-z]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/];

export const placaMask = (text?: string) => {
  const value = (text ?? '').toUpperCase();
  const raw = value.replace(/[^A-Z0-9]/g, '');

  if (value.includes('-')) return oldMask;

  if (/^[A-Z]{3}\d[A-Z]/.test(raw)) return mercosulMask;

  if (/^[A-Z]{3}\d\d/.test(raw)) return oldMask;

  return undecidedMask;
};

export const isPlateOld = (s: string) => /^(?:[A-Z]{3}-?\d{4})$/.test(s.toUpperCase());

export const isPlateMercosul = (s: string) => /^[A-Z]{3}\d[A-Z]\d{2}$/.test(s.toUpperCase());
